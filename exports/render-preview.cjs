const fs = require('fs');
const path = require('path');

const SAMPLE = {
  'ash-product.css': '/assets/ash-product.css',
  'black-malus-product.css': '/assets/black-malus-product.css',
  'z02-product.css': '/assets/z02-product.css',
  variant_price: '$1,299.00 SGD',
  variant_price_raw: '1299.00',
  variant_sku: 'ASH',
  variant_id: '47839210455297',
  variant_available: true,
  product_id: '8961053884673',
  product_handle: 'ash-universal-in-ear-monitor',
  canonical_url: 'https://www.aaw.me/products/ash-universal-in-ear-monitor',
  currency: 'SGD',
  jm_badge: '',
  jm_widget: '',
  z02_variant_price: '$299.00 SGD',
  z02_variant_price_raw: '299.00',
  z02_variant_sku: 'Z02',
  z02_variant_id: '47839210488065',
  z02_product_id: '8961053884929',
  z02_product_handle: 'z02-planar-magnetic-universal-in-ear-monitor',
  z02_canonical_url: 'https://www.aaw.me/products/z02-planar-magnetic-universal-in-ear-monitor',
};

function assetUrl(match, file) {
  return SAMPLE[file] || `/cdn/shop/assets/${file}`;
}

function fileUrl(match, file) {
  return `/cdn/shop/files/${file}`;
}

function moneyFilter(val) {
  return (typeof val === 'string' && val.startsWith('$')) ? val : `$${val}`;
}

function render(content, ctx) {
  // Remove Liquid comments
  content = content.replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '');
  
  // Handle {% assign x = value %}
  content = content.replace(/\{%-?\s*assign\s+(\w+)\s*=\s*(.+?)\s*-?%\}/g, (m, name, val) => {
    val = val.replace(/['"]/g, '').trim();
    // Handle product.handle contains 'custom'
    if (val.includes('product.handle') && val.includes("contains 'custom'")) {
      ctx[name] = ctx.product_handle && ctx.product_handle.includes('custom');
      return '';
    }
    // Handle hero_image ternary
    const ternary = val.match(/^(.+?)\s*\?\s*'(.+?)'\s*:\s*'(.+?)'$/);
    if (ternary) {
      const cond = ternary[1].trim();
      if (ctx[cond]) {
        ctx[name] = ternary[2];
      } else {
        ctx[name] = ternary[3];
      }
      return '';
    }
    // Handle alt_fit string
    const strVal = val.match(/^['"](.+?)['"]$/);
    if (strVal) {
      ctx[name] = strVal[1];
    } else {
      ctx[name] = val;
    }
    return '';
  });

  // Handle {% if x %} ... {% else %} ... {% endif %} (multi-line)
  content = content.replace(/\{%-?\s*if\s+(.+?)\s*-?%\}([\s\S]*?)\{%-?\s*else\s*-?%\}([\s\S]*?)\{%-?\s*endif\s*-?%\}/g, (m, cond, ifBlock, elseBlock) => {
    cond = cond.trim();
    let result = false;
    if (cond in ctx) result = !!ctx[cond];
    else if (cond === 'true' || cond === '1') result = true;
    else if (cond === 'false' || cond === '0' || cond === 'blank' || cond === 'nil') result = false;
    else if (cond.includes('contains')) {
      const parts = cond.match(/(\w+)\s+contains\s+['"](.+?)['"]/);
      if (parts && ctx[parts[1]]) {
        result = String(ctx[parts[1]]).includes(parts[2]);
      }
    }
    else if (cond.includes('==')) {
      const parts = cond.match(/(.+?)\s*==\s*(.+)/);
      if (parts) {
        const left = ctx[parts[1].trim()] || parts[1].trim().replace(/['"]/g, '');
        const right = parts[2].trim().replace(/['"]/g, '');
        result = String(left) === right;
      }
    }
    else if (cond.includes('!=')) {
      result = true; // conservative
    }
    return result ? ifBlock : elseBlock;
  });

  // Handle {% if x %} ... {% endif %} (no else)
  content = content.replace(/\{%-?\s*if\s+(.+?)\s*-?%\}([\s\S]*?)\{%-?\s*endif\s*-?%\}/g, (m, cond, block) => {
    cond = cond.trim();
    if (cond in ctx) return !!ctx[cond] ? block : '';
    if (cond === 'true') return block;
    if (cond === 'blank' || cond === 'nil' || cond === 'false') return '';
    return block; // conservative
  });

  // Handle {% unless x %} ... {% endunless %}
  content = content.replace(/\{%-?\s*unless\s+(.+?)\s*-?%\}([\s\S]*?)\{%-?\s*endunless\s*-?%\}/g, (m, cond, block) => {
    cond = cond.trim();
    if (cond in ctx) return !ctx[cond] ? block : '';
    return ''; // conservative
  });

  // Handle {{ var | filter1 | filter2 ... }}
  content = content.replace(/\{\{-?\s*(.+?)\s*-?\}\}/g, (m, expr) => {
    const parts = expr.split('|').map(s => s.trim());
    let val = parts[0];
    
    // Check ctx
    if (ctx[val] !== undefined) val = ctx[val];
    else if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    else if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    
    // Apply filters
    for (let i = 1; i < parts.length; i++) {
      const f = parts[i];
      if (f === 'money') val = moneyFilter(String(val));
      else if (f === 'json') val = JSON.stringify(val);
      else if (f === 'downcase') val = String(val).toLowerCase();
      else if (f.startsWith('default:')) {
        const def = f.replace('default:', '').trim().replace(/['"]/g, '');
        if (!val || val === 'undefined') val = def;
      }
      else if (f.startsWith('remove:')) {
        const char = f.replace('remove:', '').trim().replace(/['"]/g, '');
        val = String(val).replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
      }
      else if (f.startsWith('prepend:')) {
        const prefix = f.replace('prepend:', '').trim().replace(/['"]/g, '');
        val = prefix + String(val);
      }
      else if (f.startsWith('append:')) {
        const suffix = f.replace('append:', '').trim().replace(/['"]/g, '');
        val = String(val) + suffix;
      }
      else if (f === 'money_without_currency') {
        val = String(val).replace(/[^0-9.]/g, '');
      }
    }
    
    return String(val);
  });

  return content;
}

function buildASH() {
  const ctx = {
    is_custom: false,
    alt_fit: 'Universal fit',
    hero_image: 'ash-universal-1.jpg',
    current_variant: { id: SAMPLE.variant_id, available: true, price: SAMPLE.variant_price_raw, sku: 'ASH' },
    product_price: SAMPLE.variant_price,
    product: { id: SAMPLE.product_id, handle: 'ash-universal-in-ear-monitor', title: 'AAW ASH Hybrid In-Ear Monitor' },
    canonical_url: SAMPLE.canonical_url,
    variant_available: true,
    jm_badge: '',
    jm_widget: '',
  };

  let liquid = fs.readFileSync(path.join(__dirname, 'halcyon-theme-scan', '147399213098-development-lf-mac-studio', 'sections', 'ash-product.liquid'), 'utf8');
  
  // Remove schema block
  liquid = liquid.replace(/\{%\s*schema\s*%\}[\s\S]*?\{%\s*endschema\s*%\}/, '');
  
  let html = render(liquid, ctx);

  // Post-process: fix stylesheet tag output
  html = html.replace(/\{\s*'([^']+)'\s*\|\s*asset_url\s*\|\s*stylesheet_tag\s*\}/g, (m, file) => {
    return ''; // already handled
  });

  // Wrap in full HTML
  const full = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AAW ASH — Preview</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900;950&display=swap" rel="stylesheet">
<style>
${fs.readFileSync(path.join(__dirname, 'halcyon-theme-scan', '147399213098-development-lf-mac-studio', 'assets', 'ash-product.css'), 'utf8')}
</style>
</head>
<body style="margin:0;background:#050403;">
${html}
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, 'ash-preview.html'), full);
  console.log('ASH preview written to ash-preview.html');
}

function buildZ02() {
  const ctx = {
    current_variant: { id: SAMPLE.z02_variant_id, available: true, price: SAMPLE.z02_variant_price_raw, sku: 'Z02' },
    product_price: SAMPLE.z02_variant_price,
    product: { id: SAMPLE.z02_product_id, handle: 'z02-planar-magnetic-universal-in-ear-monitor', title: 'AAW Z02' },
    canonical_url: SAMPLE.z02_canonical_url,
    variant_available: true,
    jm_badge: '',
    jm_widget: '',
  };

  let liquid = fs.readFileSync(path.join(__dirname, 'halcyon-theme-scan', '147399213098-development-lf-mac-studio', 'sections', 'z02-product.liquid'), 'utf8');
  
  // Remove schema block
  liquid = liquid.replace(/\{%\s*schema\s*%\}[\s\S]*?\{%\s*endschema\s*%\}/, '');
  
  let html = render(liquid, ctx);

  // Wrap in full HTML
  const full = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AAW Z02 — Preview</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900;950&display=swap" rel="stylesheet">
<style>
${fs.readFileSync(path.join(__dirname, 'halcyon-theme-scan', '147399213098-development-lf-mac-studio', 'assets', 'black-malus-product.css'), 'utf8')}
${fs.readFileSync(path.join(__dirname, 'halcyon-theme-scan', '147399213098-development-lf-mac-studio', 'assets', 'z02-product.css'), 'utf8')}
</style>
</head>
<body style="margin:0;background:#060607;">
${html}
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, 'z02-preview.html'), full);
  console.log('Z02 preview written to z02-preview.html');
}

buildASH();
buildZ02();

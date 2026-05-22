# Z05 Universal Product Page Prep

Prepared on May 22, 2026.

## Existing Reference

- Live Z06 page: https://www.aaw.me/products/z06-universal-in-ear-monitor
- Local Z06 template: `D:\OneDrive\Codex\AAW-Website\aaw-theme\templates\product.z06.json`
- New local Z05 template: `D:\OneDrive\Codex\AAW-Website\aaw-theme\templates\product.z05.json`

## What Is Ready

- Created a new Shopify OS 2.0 product template: `product.z05.json`.
- Reworked it into a distinct editorial/product-feature layout inspired by the structure of LFI's build article pages.
- Added a full-screen feature hero, highlight stat strip, overview/story section, purchase handoff, build-spec card, sound-architecture section, FAQ, and final CTA.
- Kept the live Shopify product module in the page so price, variants, media gallery, checkout, and dynamic payment buttons still come from the product record.
- Confirmed the new template parses as valid JSON after Shopify's generated-file header comment.

## Still Needed Before Publishing

- Create the Z05 product in Shopify Admin, likely with handle `z05-universal-in-ear-monitor`.
- Assign the product template `z05` to that product.
- Add product title, description, price, variants, inventory, product category, vendor, tags, SEO title, and SEO description.
- Upload final Z05 product media through Shopify Admin.
- Replace the Z06 `shopify://shop_images/...` section images inside `product.z05.json` with Z05-specific images once available.
- Confirm final Z05 technical specifications before replacing copied Z06 specs.

## Current Caveat

The new template pulls hero/detail imagery from the assigned Shopify product's media rather than hard-coding existing Z06 section images. Upload final Z05 media to the product in Shopify Admin before launch. A few technical claims still use draft positioning and should be verified against the final Z05 driver/spec sheet.

## Push Command When Ready

```powershell
shopify theme push --store advanced-acousticwerkes.myshopify.com --theme 142069760042 --path "D:\OneDrive\Codex\AAW-Website\aaw-theme" --only "templates/product.z05.json"
```

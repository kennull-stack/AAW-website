import collections
import csv
import json
from pathlib import Path


BASE = Path(r"D:/OneDrive/Codex/AAW-Website")
INPUT = BASE / "exports/aaw-monitor-reviews/aaw-monitor-reviews-judgeme-format.csv"
ORIGINAL_EXPORT = Path(
    r"C:/Users/wkwlb/Downloads/null-audio-studio-all-published-reviews-in-judgeme-format-2026-05-23-1779539064.csv"
)
PRODUCTS_JSON = BASE / "exports/aaw-products-live.json"
OUTPUT_DIR = BASE / "exports/aaw-monitor-reviews/mapped-to-aaw"
RESHELL_SOURCE_HANDLES = {
    "earphone-reshell-service-by-aaw",
    "iem-remolding-modification-service",
}


TARGETS = {
    "aaw-z06-universal-6-driver-in-ear-monitor": [
        "z06-universal-in-ear-monitor",
        "z06-custom-in-ear-monitor",
    ],
    "aaw-z06-6-driver-custom-in-ear-monitor": [
        "z06-universal-in-ear-monitor",
        "z06-custom-in-ear-monitor",
    ],
    "project-4-2-electrostatic-hybrid-in-ear-monitor": [
        "z06-universal-in-ear-monitor",
        "z06-custom-in-ear-monitor",
    ],
    "aaw-ath-6-driver-hybrid-custom-in-ear-monitor-1": [
        "z06-universal-in-ear-monitor",
        "z06-custom-in-ear-monitor",
    ],
    "advanced-acousticwerkes-axh-universal-in-ear-monitor": [
        "z05-auag-launch-edition",
    ],
    "advanced-acousticwerkes-axh-custom-in-ear-monitor": [
        "z05-auag-launch-edition",
    ],
    "aaw-axh-uiem-ciem-demo-sale": [
        "z05-auag-launch-edition",
    ],
    "m5-5d-in-ear-monitors": [
        "z05-auag-launch-edition",
    ],
    "canary-isobaric-electrostatic-universal-in-ear-monitor": [
        "canary-isobaric-electrostatic-universal-in-ear-monitor",
        "canary-isobaric-electrostatic-custom-in-ear-monitor",
    ],
    "aaw-canary-isobaric-electrostatic-custom-in-ear-monitor": [
        "canary-isobaric-electrostatic-universal-in-ear-monitor",
        "canary-isobaric-electrostatic-custom-in-ear-monitor",
    ],
    "advanced-acousticwerkes-a3h-pro-triple-driver-hybrid-custom-in-ear-monitor": [
        "advanced-acousticwerkes-a3h-universal-in-ear-monitor",
        "advanced-acousticwerkes-a3h-pro-triple-driver-hybrid-custom-in-ear-monitor",
    ],
    "advanced-acousticwerkes-a3h-universal-in-ear-monitor": [
        "advanced-acousticwerkes-a3h-universal-in-ear-monitor",
        "advanced-acousticwerkes-a3h-pro-triple-driver-hybrid-custom-in-ear-monitor",
    ],
    "advanced-acousticwerkes-a3h-triple-driver-hybrid-custom-in-ear-monitor": [
        "advanced-acousticwerkes-a3h-universal-in-ear-monitor",
        "advanced-acousticwerkes-a3h-pro-triple-driver-hybrid-custom-in-ear-monitor",
    ],
    "a3h-wireless-universal-in-ear-monitor": [
        "advanced-acousticwerkes-a3h-universal-in-ear-monitor",
        "advanced-acousticwerkes-a3h-pro-triple-driver-hybrid-custom-in-ear-monitor",
    ],
    "advanced-acousticwerkes-m80-custom-in-ear-monitor": [
        "m20-universal-in-ear-monitor",
        "m20-custom-in-ear-monitor",
    ],
    "ash-universal-in-ear-monitor": [
        "ash-universal-in-ear-monitor",
        "ash-custom-in-ear-monitor",
    ],
    "ash-custom-in-ear-monitor": [
        "ash-universal-in-ear-monitor",
        "ash-custom-in-ear-monitor",
    ],
    "advanced-acousticwerkes-w900-reference-hybrid-custom-in-ear-monitor": [
        "advanced-acousticwerkes-w900-reference-universal-in-ear-monitor",
        "advanced-acousticwerkes-w900-reference-hybrid-custom-in-ear-monitor",
    ],
    "advanced-acousticwerkes-w500-reference-hybrid-custom-in-ear-monitor": [
        "advanced-acousticwerkes-w900-reference-universal-in-ear-monitor",
        "advanced-acousticwerkes-w900-reference-hybrid-custom-in-ear-monitor",
    ],
    "advanced-acousticwerkes-w500-ahmorph-reference-hybrid-custom-in-ear-monitor": [
        "advanced-acousticwerkes-w900-reference-universal-in-ear-monitor",
        "advanced-acousticwerkes-w900-reference-hybrid-custom-in-ear-monitor",
    ],
    "aaw-w900-uiem-ciem-demo-sale": [
        "advanced-acousticwerkes-w900-reference-universal-in-ear-monitor",
        "advanced-acousticwerkes-w900-reference-hybrid-custom-in-ear-monitor",
    ],
    "mockingbird-hybrid-in-ear-monitor": [
        "advanced-acousticwerkes-w900-reference-universal-in-ear-monitor",
        "advanced-acousticwerkes-w900-reference-hybrid-custom-in-ear-monitor",
    ],
    "pola-electrostatic-universal-in-ear-monitor": [
        "pola-electrostatic-universal-in-ear-monitor",
    ],
    "advanced-acousticwerkes-halcyon-universal-in-ear-monitor": [
        "halcyon-electrostatic-hybrid-in-ear-monitor",
        "advanced-acousticwerkes-halcyon-electrostatic-hybrid-custom-in-ear-monitor",
    ],
    "earphone-reshell-service-by-aaw": [
        "earphone-reshell-service-by-aaw",
    ],
    "iem-remolding-modification-service": [
        "earphone-reshell-service-by-aaw",
    ],
}


FAMILY = {
    "aaw-z06-universal-6-driver-in-ear-monitor": "Z06",
    "aaw-z06-6-driver-custom-in-ear-monitor": "Z06",
    "project-4-2-electrostatic-hybrid-in-ear-monitor": "Z06",
    "aaw-ath-6-driver-hybrid-custom-in-ear-monitor-1": "Z06",
    "advanced-acousticwerkes-axh-universal-in-ear-monitor": "Z05",
    "advanced-acousticwerkes-axh-custom-in-ear-monitor": "Z05",
    "aaw-axh-uiem-ciem-demo-sale": "Z05",
    "m5-5d-in-ear-monitors": "Z05",
    "canary-isobaric-electrostatic-universal-in-ear-monitor": "Canary Pro",
    "aaw-canary-isobaric-electrostatic-custom-in-ear-monitor": "Canary Pro",
    "advanced-acousticwerkes-a3h-pro-triple-driver-hybrid-custom-in-ear-monitor": "A3H+ LUX",
    "advanced-acousticwerkes-a3h-universal-in-ear-monitor": "A3H+ LUX",
    "advanced-acousticwerkes-a3h-triple-driver-hybrid-custom-in-ear-monitor": "A3H+ LUX",
    "a3h-wireless-universal-in-ear-monitor": "A3H+ LUX",
    "advanced-acousticwerkes-m80-custom-in-ear-monitor": "M20",
    "ash-universal-in-ear-monitor": "ASH",
    "ash-custom-in-ear-monitor": "ASH",
    "advanced-acousticwerkes-w900-reference-hybrid-custom-in-ear-monitor": "Mockingbird",
    "advanced-acousticwerkes-w500-reference-hybrid-custom-in-ear-monitor": "Mockingbird",
    "advanced-acousticwerkes-w500-ahmorph-reference-hybrid-custom-in-ear-monitor": "Mockingbird",
    "aaw-w900-uiem-ciem-demo-sale": "Mockingbird",
    "mockingbird-hybrid-in-ear-monitor": "Mockingbird",
    "pola-electrostatic-universal-in-ear-monitor": "POLA",
    "advanced-acousticwerkes-halcyon-universal-in-ear-monitor": "Halcyon",
    "earphone-reshell-service-by-aaw": "Reshell Service",
    "iem-remolding-modification-service": "Reshell Service",
}


NOTES = {
    "aaw-z06-universal-6-driver-in-ear-monitor": "Bundled Z06 Universal/Custom so each Z06 review appears on both pages.",
    "aaw-z06-6-driver-custom-in-ear-monitor": "Bundled Z06 Universal/Custom so each Z06 review appears on both pages.",
    "project-4-2-electrostatic-hybrid-in-ear-monitor": "Legacy Project 4+2 mapped to Z06 UIEM and CIEM per AAW request.",
    "aaw-ath-6-driver-hybrid-custom-in-ear-monitor-1": "Legacy ATH 6-driver mapped to Z06 UIEM and CIEM per AAW request.",
    "advanced-acousticwerkes-axh-universal-in-ear-monitor": "Legacy AXH mapped to Z05 AuAg as the successor product per AAW request.",
    "advanced-acousticwerkes-axh-custom-in-ear-monitor": "Legacy AXH custom mapped to Z05 AuAg as the successor product per AAW request.",
    "aaw-axh-uiem-ciem-demo-sale": "Legacy AXH demo sale mapped to Z05 AuAg as the successor product per AAW request.",
    "m5-5d-in-ear-monitors": "Legacy M5-5D mapped to Z05 AuAg per AAW request.",
    "canary-isobaric-electrostatic-universal-in-ear-monitor": "Legacy/current Canary handle now represents Canary Pro; duplicated to Canary Pro UIEM and CIEM.",
    "aaw-canary-isobaric-electrostatic-custom-in-ear-monitor": "Legacy Canary custom mapped to Canary Pro UIEM and CIEM.",
    "advanced-acousticwerkes-m80-custom-in-ear-monitor": "Null Audio handle is M80, but review titles identify M20; mapped to current M20 UIEM and CIEM.",
    "advanced-acousticwerkes-w900-reference-hybrid-custom-in-ear-monitor": "Live AAW W900 handle is now Mockingbird custom; duplicated to Mockingbird UIEM and CIEM.",
    "advanced-acousticwerkes-w500-reference-hybrid-custom-in-ear-monitor": "Legacy W500 mapped to current Mockingbird UIEM and CIEM per AAW request.",
    "advanced-acousticwerkes-w500-ahmorph-reference-hybrid-custom-in-ear-monitor": "Legacy W500 AHMorph mapped to current Mockingbird UIEM and CIEM per AAW request.",
    "aaw-w900-uiem-ciem-demo-sale": "W900 demo sale mapped to current Mockingbird UIEM and CIEM.",
    "mockingbird-hybrid-in-ear-monitor": "Legacy Mockingbird handle mapped to current Mockingbird UIEM and CIEM.",
    "pola-electrostatic-universal-in-ear-monitor": "Only a live POLA universal product exists; not duplicated to custom.",
    "advanced-acousticwerkes-halcyon-universal-in-ear-monitor": "Legacy Halcyon reviews mapped to active Halcyon UIEM and CIEM product handles.",
    "earphone-reshell-service-by-aaw": "Null Audio reshell service reviews mapped to AAW's live reshell service product.",
    "iem-remolding-modification-service": "Legacy remolding/modification service reviews mapped to AAW's live reshell service product.",
}


def load_products():
    products = json.loads(PRODUCTS_JSON.read_text(encoding="utf-8-sig"))["products"]
    return {product["handle"]: product for product in products}


def write_csv(path, fieldnames, rows):
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def load_reshell_rows(fieldnames):
    with ORIGINAL_EXPORT.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        rows = [
            row
            for row in reader
            if row.get("product_handle") in RESHELL_SOURCE_HANDLES
        ]

    return [{field: row.get(field, "") for field in fieldnames} for row in rows]


def main():
    product_by_handle = load_products()

    def product_title(handle):
        return product_by_handle.get(handle, {}).get("title", "")

    def product_id(handle):
        return str(product_by_handle.get(handle, {}).get("id", ""))

    with INPUT.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        fields = reader.fieldnames or []
        monitor_rows = list(reader)

    reshell_rows = load_reshell_rows(fields)
    source_rows = monitor_rows + reshell_rows

    source_counts = collections.Counter(row["product_handle"] for row in source_rows)
    mapped = []
    audit = []
    unmapped = []

    for row in source_rows:
        source_handle = row["product_handle"]
        targets = TARGETS.get(source_handle)
        if not targets:
            unmapped_row = dict(row)
            unmapped_row["mapping_status"] = "unmapped_legacy_or_no_live_product"
            unmapped.append(unmapped_row)
            continue

        for target in targets:
            mapped_row = dict(row)
            original_metaobject = mapped_row.get("metaobject_handle") or f"review-{len(mapped) + 1}"
            mapped_row["product_handle"] = target
            mapped_row["product_id"] = product_id(target)
            mapped_row["metaobject_handle"] = (
                f"{original_metaobject[:80]}-{target[:60]}".replace("__", "-")
            )
            mapped.append(mapped_row)

            audit_row = dict(row)
            audit_row.update(
                {
                    "source_product_handle": source_handle,
                    "target_product_handle": target,
                    "target_product_id": product_id(target),
                    "target_product_title": product_title(target),
                    "product_family": FAMILY.get(source_handle, ""),
                    "mapping_note": NOTES.get(
                        source_handle,
                        "Bundled matching UIEM/CIEM live product handles.",
                    ),
                    "mapped_metaobject_handle": mapped_row["metaobject_handle"],
                }
            )
            audit.append(audit_row)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    mapped_path = OUTPUT_DIR / "aaw-monitor-reviews-mapped-for-aaw-judgeme.csv"
    write_csv(mapped_path, fields, mapped)

    public_fields = [field for field in fields if field not in {"reviewer_email", "ip_address"}]
    public_path = OUTPUT_DIR / "aaw-monitor-reviews-mapped-public.csv"
    write_csv(
        public_path,
        public_fields,
        [{key: value for key, value in row.items() if key in public_fields} for row in mapped],
    )

    audit_fields = [
        "source_product_handle",
        "target_product_handle",
        "target_product_id",
        "target_product_title",
        "product_family",
        "mapping_note",
    ] + fields + ["mapped_metaobject_handle"]
    audit_path = OUTPUT_DIR / "aaw-monitor-reviews-mapping-audit.csv"
    write_csv(audit_path, audit_fields, audit)

    unmapped_path = OUTPUT_DIR / "aaw-monitor-reviews-unmapped-legacy.csv"
    write_csv(unmapped_path, fields + ["mapping_status"], unmapped)

    report_rows = []
    for source_handle, count in source_counts.most_common():
        targets = TARGETS.get(source_handle, [])
        report_rows.append(
            {
                "source_product_handle": source_handle,
                "source_review_count": count,
                "product_family": FAMILY.get(source_handle, ""),
                "mapping_status": "mapped" if targets else "unmapped_legacy_or_no_live_product",
                "target_product_handles": "; ".join(targets),
                "target_product_titles": "; ".join(product_title(target) for target in targets),
                "output_review_rows": count * len(targets),
                "notes": NOTES.get(
                    source_handle,
                    "No current live product target chosen; keep for manual legacy/testimonial review.",
                ),
            }
        )

    report_path = OUTPUT_DIR / "aaw-review-handle-mapping-report.csv"
    write_csv(
        report_path,
        [
            "source_product_handle",
            "source_review_count",
            "product_family",
            "mapping_status",
            "target_product_handles",
            "target_product_titles",
            "output_review_rows",
            "notes",
        ],
        report_rows,
    )

    mapped_source_rows = sum(source_counts[source] for source in TARGETS if source in source_counts)
    target_counts = collections.Counter(row["product_handle"] for row in mapped)

    md_lines = [
        "# AAW Review Handle Mapping Report",
        "",
        "Generated from Null Audio Judge.me export and live AAW products.json on 2026-05-23.",
        "",
        "## Summary",
        f"- Original AAW monitor review rows: {len(monitor_rows)}",
        f"- Reshell/remolding service review rows added: {len(reshell_rows)}",
        f"- Total source rows considered: {len(source_rows)}",
        f"- Source rows mapped to live AAW products: {mapped_source_rows}",
        f"- Duplicated output rows for Judge.me import: {len(mapped)}",
        f"- Source rows left unmapped for manual review: {len(unmapped)}",
        f"- Live target handles receiving reviews: {len(target_counts)}",
        "",
        "## Mapping Rules",
        "- UIEM and CIEM variants are bundled by duplicating reviews to both live product handles where both exist.",
        "- Canary legacy/current reviews are mapped to Canary Pro UIEM and CIEM.",
        '- I interpreted "Canary Rro" as "Canary Pro".',
        "- W900/Mockingbird reviews are mapped to the current Mockingbird UIEM and CIEM live handles.",
        "- W500 reviews are mapped to the current Mockingbird UIEM and CIEM live handles.",
        "- ATH 6-driver and Project 4+2 legacy reviews are mapped to Z06 UIEM and CIEM.",
        "- AXH universal/custom/demo-sale reviews are mapped to Z05 AuAg as the successor product.",
        "- M5-5D reviews are mapped to Z05 AuAg.",
        "- Halcyon reviews are mapped to the active Halcyon UIEM and CIEM product handles.",
        "- Reshell and legacy remolding service reviews are mapped to the live AAW reshell service product.",
        "- M80-handle reviews were mapped to M20 because the review titles identify M20 and AAW has live M20 UIEM/CIEM products.",
        "- Legacy products with no clear live replacement were not forced into a target product.",
        "",
        "## Target Distribution",
    ]
    for target, count in target_counts.most_common():
        md_lines.append(f"- {target} ({product_title(target)}): {count}")

    md_lines.extend(["", "## Source Mapping"])
    for source_handle, count in source_counts.most_common():
        targets = TARGETS.get(source_handle, [])
        if targets:
            md_lines.append(
                f"- {source_handle}: {count} source reviews -> {count * len(targets)} rows -> "
                + ", ".join(targets)
            )
        else:
            md_lines.append(f"- {source_handle}: {count} source reviews -> unmapped/manual review")

    md_path = OUTPUT_DIR / "aaw-review-handle-mapping-report.md"
    md_path.write_text("\n".join(md_lines) + "\n", encoding="utf-8")

    result = {
        "source_monitor_rows": len(monitor_rows),
        "source_reshell_rows": len(reshell_rows),
        "source_total_rows": len(source_rows),
        "mapped_source_rows": mapped_source_rows,
        "mapped_output_rows": len(mapped),
        "unmapped_source_rows": len(unmapped),
        "target_counts": dict(target_counts.most_common()),
        "outputs": [
            str(mapped_path),
            str(public_path),
            str(audit_path),
            str(report_path),
            str(md_path),
            str(unmapped_path),
        ],
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

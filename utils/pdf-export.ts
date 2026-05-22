/**
 * Open the browser's print dialog with a clean snapshot of a table element,
 * letting the user save it as a PDF. Excludes interactive content
 * (checkboxes, buttons, icons) and any columns whose header is empty or
 * literally "Actions".
 */
export function downloadTableAsPdf(
  tableEl: HTMLTableElement | null,
  title: string,
): void {
  if (!tableEl) {
    console.warn("[pdf-export] No table element provided.");
    return;
  }

  const clone = tableEl.cloneNode(true) as HTMLTableElement;

  // Strip out anything that would render badly or doesn't belong in a PDF
  clone
    .querySelectorAll("input, button, svg, [role='button']")
    .forEach((el) => el.remove());

  // Identify columns to drop based on header label
  const headerRow = clone.querySelector("thead tr");
  const headerCells = headerRow
    ? Array.from(headerRow.querySelectorAll("th"))
    : [];
  const removeIndices: number[] = [];
  headerCells.forEach((th, i) => {
    const text = th.textContent?.trim().toLowerCase() ?? "";
    if (text === "" || text === "actions") removeIndices.push(i);
  });

  // Remove those columns from header + body (iterate in reverse so indices stay valid)
  removeIndices
    .slice()
    .reverse()
    .forEach((i) => {
      clone
        .querySelectorAll("thead tr, tbody tr")
        .forEach((tr) => {
          const cell = tr.children[i];
          if (cell) cell.remove();
        });
    });

  // Remove any tfoot / pagination if present (Table component embeds its own,
  // but children of the cloned wrapper are usually outside the <table>)
  clone.querySelectorAll("tfoot").forEach((el) => el.remove());

  const win = window.open("", "_blank", "width=1000,height=800");
  if (!win) {
    // Pop-ups blocked — surface to caller via console; toast handled by caller if desired
    console.warn(
      "[pdf-export] Could not open print window. Pop-ups may be blocked.",
    );
    return;
  }

  const safeTitle = title.replace(/[<>]/g, "");
  const generatedAt = new Date().toLocaleString();

  win.document.open();
  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${safeTitle}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 24px;
      color: #111928;
      margin: 0;
    }
    h1 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 6px;
      color: #111928;
    }
    .meta {
      font-size: 11px;
      color: #6b7280;
      margin-bottom: 16px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }
    thead { background-color: #f5f7fa; }
    th, td {
      padding: 10px 16px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
      font-size: 12px;
      vertical-align: top;
    }
    th { font-weight: 600; color: #111928; }
    td { color: #4b5563; }
    tbody tr:last-child td { border-bottom: none; }
    @media print {
      body { padding: 0; }
      thead { display: table-header-group; }
      tr { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>${safeTitle}</h1>
  <div class="meta">Generated on ${generatedAt}</div>
  ${clone.outerHTML}
  <script>
    window.addEventListener('load', function () {
      setTimeout(function () {
        window.focus();
        window.print();
      }, 150);
    });
    window.addEventListener('afterprint', function () { window.close(); });
  </script>
</body>
</html>`);
  win.document.close();
}

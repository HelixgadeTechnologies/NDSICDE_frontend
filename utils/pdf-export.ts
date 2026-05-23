/**
 * Snapshot a chart container (which holds a Recharts SVG plus a status-legend
 * row) into a print window. The SVG already carries the dimensions Recharts
 * computed during layout, so it renders correctly without a layout pass.
 * Tailwind classes used in the legend are mapped to inline CSS in the print
 * window so the colors and spacing survive.
 */
export function downloadChartAsPdf(
  chartEl: HTMLElement | null,
  title: string,
): void {
  if (!chartEl) {
    console.warn("[pdf-export] No chart element provided.");
    return;
  }

  const html = chartEl.outerHTML;
  const win = window.open("", "_blank", "width=1100,height=800");
  if (!win) {
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
    h1 { font-size: 16px; font-weight: 600; margin: 0 0 6px; }
    .meta { font-size: 11px; color: #6b7280; margin-bottom: 16px; }
    svg { max-width: 100%; height: auto; }
    /* Map Tailwind utility classes used by the chart wrapper + legend */
    .flex { display: flex; }
    .flex-wrap { flex-wrap: wrap; }
    .items-center { align-items: center; }
    .justify-end { justify-content: flex-end; }
    .gap-3 { gap: 12px; }
    .gap-1\\.5 { gap: 6px; }
    .h-2 { height: 8px; }
    .w-2 { width: 8px; }
    .rounded-full { border-radius: 9999px; }
    .text-xs { font-size: 12px; line-height: 1rem; }
    .font-medium { font-weight: 500; }
    .mt-3 { margin-top: 12px; }
    .h-75 { height: 300px; }
    /* Status dot colors */
    .bg-blue-500 { background-color: #3b82f6; }
    .bg-green-500 { background-color: #22c55e; }
    .bg-red-500 { background-color: #ef4444; }
    .bg-amber-500 { background-color: #f59e0b; }
    .bg-gray-400 { background-color: #9ca3af; }
    /* Status text colors */
    .text-blue-700 { color: #1d4ed8; }
    .text-green-700 { color: #15803d; }
    .text-red-700 { color: #b91c1c; }
    .text-amber-600 { color: #d97706; }
    .text-gray-500 { color: #6b7280; }
    .text-gray-600 { color: #4b5563; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>${safeTitle}</h1>
  <div class="meta">Generated on ${generatedAt}</div>
  ${html}
  <script>
    window.addEventListener('load', function () {
      setTimeout(function () { window.focus(); window.print(); }, 250);
    });
    window.addEventListener('afterprint', function () { window.close(); });
  </script>
</body>
</html>`);
  win.document.close();
}

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

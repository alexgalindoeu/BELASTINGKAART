// CSV export for completed, non-sensitive result tables only.
(() => {
  function serialize(rows, columns) {
    if (!Array.isArray(rows) || !Array.isArray(columns) || !columns.length)
      throw new TypeError("Rows and columns are required.");
    const cell = value => '"' + String(value ?? "").replaceAll('"','""') + '"';
    return [columns.map(c=>cell(c.label)).join(";"),
      ...rows.map(row=>columns.map(c=>cell(row[c.key])).join(";"))].join("\r\n");
  }
  window.BKCSV = Object.freeze({serialize});
})();

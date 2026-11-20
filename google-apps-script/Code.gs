const SPREADSHEET_ID = "1Y-3ehCswcDufK4pEWDZa71WZqmYVXw5_oqgwbzz3mq4";
const HEADERS = ["Date/time", "Items", "Subtotal", "Shipping", "Total", "Status"];

function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents);
    const expectedSecret = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");

    if (!expectedSecret || data.secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "Unauthorized request." });
    }

    if (!Array.isArray(data.items) || data.items.length === 0
      || !Number.isFinite(data.subtotal) || !Number.isFinite(data.shipping)
      || !Number.isFinite(data.total) || typeof data.status !== "string") {
      return jsonResponse({ ok: false, error: "Invalid order details." });
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    }

    const columnCount = Math.max(sheet.getLastColumn(), HEADERS.length);
    const headerRow = sheet.getRange(1, 1, 1, columnCount).getValues()[0]
      .map(function (header) { return String(header).trim().toLowerCase(); });
    const columns = HEADERS.map(function (header) { return headerRow.indexOf(header.toLowerCase()); });

    if (columns.some(function (column) { return column < 0; })) {
      return jsonResponse({ ok: false, error: "The sheet needs the headers: " + HEADERS.join(", ") });
    }

    const row = Array(columnCount).fill("");
    row[columns[0]] = new Date();
    row[columns[1]] = data.items.map(function (item) { return item.description; }).join("\n");
    row[columns[2]] = data.subtotal;
    row[columns[3]] = data.shipping;
    row[columns[4]] = data.total;
    row[columns[5]] = data.status;
    sheet.appendRow(row);

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: "Could not write to the order sheet." });
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

import { defineEventHandler, readBody, sendStream } from "h3";
import * as xlsx from "node-xlsx";
import { Readable } from "stream";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ rows: any[] }>(event);

  if (!Array.isArray(body.rows)) {
    throw createError({ statusCode: 400, message: "Invalid rows" });
  }

  const headers = Object.keys(body.rows[0] || {});
  const data = [headers, ...body.rows.map((row) => headers.map((h) => row[h]))];

  const buffer = xlsx.build([{ name: "Schedule", data }]);
  const stream = Readable.from(buffer);

  event.node.res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  event.node.res.setHeader(
    "Content-Disposition",
    'attachment; filename="loan_schedule.xlsx"'
  );

  return sendStream(event, stream);
});

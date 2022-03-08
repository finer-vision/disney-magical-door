import * as fs from "node:fs";
import { parse } from "csv-parse";

export default function parseCsv<Record>(filePath: string): Promise<Record[]> {
  return new Promise((resolve, reject) => {
    const parser = parse({ delimiter: ",", fromLine: 2 }, (err, records) => {
      if (err) return reject(err);
      resolve(records);
    });
    fs.createReadStream(filePath).pipe(parser);
  });
}

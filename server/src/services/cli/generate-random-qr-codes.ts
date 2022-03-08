import * as path from "node:path";
import * as fs from "node:fs/promises";
import * as QRCode from "qrcode";
import { Op } from "sequelize";
import Code from "../../entities/code";
import config from "../../config";

export default async function generateRandomQrCodes() {
  const ids: number[] = [];
  const limit = 10;
  for (let i = 0; i < limit; i++) {
    ids.push(1 + Math.floor(Math.random() * 1000000));
  }
  const codes = await Code.findAll({ limit, where: { id: { [Op.in]: ids } } });

  console.info("Generating QR codes...");

  const qrCodeImagesPath = path.join(config.paths.data, "qr-code-images");

  try {
    await fs.access(qrCodeImagesPath);
  } catch {
    await fs.mkdir(qrCodeImagesPath);
  }

  await Promise.all(
    codes.map((code) => {
      const filename = `${code.code}.svg`;
      return QRCode.toFile(path.join(qrCodeImagesPath, filename), code.code);
    })
  );

  console.info("QR codes generated");
}

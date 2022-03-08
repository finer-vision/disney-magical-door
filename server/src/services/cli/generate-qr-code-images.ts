import * as path from "node:path";
import { execSync } from "node:child_process";
import * as fs from "node:fs/promises";
import * as QRCode from "qrcode";
import { Op } from "sequelize";
import Code from "../../entities/code";
import config from "../../config";

export default async function generateQrCodeImages() {
  const ids: number[] = [];
  const limit = 10;
  for (let i = 0; i < limit; i++) {
    ids.push(1 + Math.floor(Math.random() * 1000000));
  }
  const codes = await Code.findAll({ limit, where: { id: { [Op.in]: ids } } });

  console.info("Generating QR codes...");

  const qrCodeImagesPath = path.join(config.paths.data, "qr-code-images");
  const qrCodeAdminImagesPath = path.join(
    config.paths.data,
    "qr-code-admin-images"
  );

  try {
    await fs.access(qrCodeImagesPath);
    execSync(`rm -rf ${qrCodeImagesPath}`);
    await fs.mkdir(qrCodeImagesPath);
  } catch {
    await fs.mkdir(qrCodeImagesPath);
  }

  try {
    await fs.access(qrCodeAdminImagesPath);
  } catch {
    await fs.mkdir(qrCodeAdminImagesPath);
  }

  await Promise.all(
    codes.map((code) => {
      const filename = `${code.code}.svg`;
      return QRCode.toFile(path.join(qrCodeImagesPath, filename), code.code);
    })
  );

  await Promise.all(
    config.adminCodes.map((code) => {
      const filename = `${code.id}.svg`;
      return QRCode.toFile(
        path.join(qrCodeAdminImagesPath, filename),
        code.code
      );
    })
  );

  console.info("QR codes generated");
}

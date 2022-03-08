import * as path from "node:path";
import * as QRCode from "qrcode";
import * as Sequelize from "sequelize";
import Code from "../../entities/code";
import config from "../../config";

export default async function generateRandomQrCodes() {
  const codes = await Code.findAll({
    order: Sequelize.literal("rand()"),
    limit: 10,
    where: {
      used: false,
      guaranteedWin: false,
    },
  });

  console.info("Generating QR codes...");

  await Promise.all(codes.map((code) => generateQrCode(code.code)));

  console.info("QR codes generated");

  function generateQrCode(code: string): Promise<void> {
    return new Promise((resolve) => {
      try {
        const filename = `${code}.svg`;
        QRCode.toFile(
          path.resolve(config.paths.data, filename),
          code,
          (err) => {
            if (err) {
              throw new Error(`Failed to generate QR code "${code}"`);
            }
          }
        );
      } catch (err) {
        console.error("Error creating QR code:", err);
      } finally {
        resolve();
      }
    });
  }
}

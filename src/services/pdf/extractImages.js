import * as pdf2img from "pdf-img-convert";
import { PDF_DIRECTORY, IMAGES_DIRECTORY } from "../../config/ocr.config.js";
import fs from "fs";
import path from "path";

export async function extractImages() {
  const files = await fs.promises.readdir(PDF_DIRECTORY);
  const conversion_config = {
    // width: 100, //Number in px
    // height: 100, // Number in px
    page_numbers: [1], // A list of pages to render instead of all of them
    // base64: True,
    scale: 2.0,
  };
  try {
    await Promise.all(
      files.map(async (pdfName) => {
        const pdfPath = path.join(PDF_DIRECTORY, pdfName);
        const imagePath = path.join(
          IMAGES_DIRECTORY,
          pdfName.replace(".pdf", "") + ".png"
        );
        const pdfArray = await pdf2img.convert(pdfPath, conversion_config);
        console.log("saving " + pdfName);
        fs.writeFile(imagePath, pdfArray[0], function (error) {
          if (error) {
            console.error("Error: " + error);
          }
        });
      })
    );
  } catch (err) {
    console.error(err);
  }
}

import fs from "fs";
import {
  RECOGNIZED_DIRECTORY,
  PDF_DIRECTORY,
} from "../../config/ocr.config.js";
import path from "path";

export async function renameFiles() {
  const files = await fs.promises.readdir(RECOGNIZED_DIRECTORY);
  const fioRegex =
    /(?<lastname>[А-Я][а-яё]+)[\s\n`_]+(?<firstname>[А-Я][а-я]+)[\s\n\`_]+(?<surname>[А-Я][а-я]+)[,\.;][\s\n`_]+(?:[Зз]арег|[Пп]рож)/g;

  try {
    files.map(async (textName) => {
      const pdfPath = path.join(
        PDF_DIRECTORY,
        textName.replace(".png.txt", ".pdf")
      );
      const textPath = path.join(RECOGNIZED_DIRECTORY, textName);
      const textString = fs.readFileSync(textPath, "utf-8");
      const contractNum = textString.match(/№ (\d+\.?\d?)/gi)?.[0];
      const fio = fioRegex.exec(textString);

      fs.rename(
        pdfPath,
        `${PDF_DIRECTORY}/${contractNum} - ${fio?.groups?.lastname || ""} ${
          fio?.groups?.firstname || ""
        } ${fio?.groups?.surname || ""}.pdf`,
        function (err) {
          if (err) console.log("ERROR: " + err);
        }
      );
      fioRegex.lastIndex = 0;
    });
  } catch (err) {
    console.error(err);
  }
}

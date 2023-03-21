import { recognizeImages } from "./services/ocr/recognizeImages.js";
import { extractImages } from "./services/pdf/extractImages.js";
import { renameFiles } from "./services/file/renameFiles.js";

(async () => {
  // await extractImages();
  await recognizeImages();
  await renameFiles();
})();

import {
  RECOGNIZED_DIRECTORY,
  IMAGES_DIRECTORY,
  CONCURRENCY,
} from "../../config/ocr.config.js";

import { createWorker, createScheduler } from "tesseract.js";
import ProgressBar from "progress";
import { promises as fs } from "fs";
import path from "path";

export async function recognizeImages() {
  const scheduler = createScheduler();
  try {
    const files = await fs.readdir(IMAGES_DIRECTORY);
    const bar = new ProgressBar(
      "  recognizing [:bar] :rate/bps :percent :etas",
      {
        total: files.length,
        width: 200,
        complete: "#",
        incomplete: " ",
      }
    );
    for (let i = 0; i < CONCURRENCY; i++) {
      const worker = await createWorker({ logger: (m) => console.log(m) });
      await worker.loadLanguage("rus");
      await worker.initialize("rus");
      scheduler.addWorker(worker);
    }
    await Promise.all(
      files.map(async (imageName) => {
        const imagePath = path.join(IMAGES_DIRECTORY, imageName);
        const textPath = path.join(RECOGNIZED_DIRECTORY, imageName + ".txt");
        try {
          await fs.access(textPath);
          bar.tick();
        } catch (error) {
          await scheduler
            .addJob("recognize", imagePath)
            .then(async (result) => {
              await fs.writeFile(textPath, result.data.text);
              bar.tick();
            })
            .catch((err) => {
              bar.tick();
              console.log(
                "=======================ERROR======================="
              );
              console.log(`error parsing ${imageName}: \\n\\t\\t${err}`);
              console.log(
                "=====================END_ERROR====================="
              );
            });
        }
      })
    );
  } catch (err) {
    console.error(err);
  } finally {
    await scheduler.terminate();
  }
}

import { createWorker } from "tesseract.js";

const worker = await createWorker({
  logger: (m) => console.log(m),
});

(async () => {
  await worker.loadLanguage("rus");
  await worker.initialize("rus");
  const {
    data: { text },
  } = await worker.recognize("src/assets/doc.png");
  console.log(text);
  await worker.terminate();
})();

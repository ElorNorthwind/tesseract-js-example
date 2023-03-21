# Tesseract-js-example

A little script that extracts images from pdf files, runs ocr and than renames the pdfs semantically

# How to

1. Put the target .pdf files to `scr/assets/pdf` folder;
2. Run 'npm start' command;
3. Wait.

Adjust `CONCURRENCY` variable in `scr/config/ocr.config.js` to change the number of workers created for OCR.

This particular example is setup to rename DGI-style contract scans to reflect contract number and party name (see `scr/services/file/renameFiles.js`).

# node-pdf2ppm

Adapter for pdf2ppm ran as cli - will need to install pdftoppm separately. 

Note: Please consider using https://github.com/Fdawgs/node-poppler

## Usage

> npm install --save git+https://github.com/corsed-bytes/node-pdf2ppm.git

```
require("./index.js")("Turngau_100Jahre_Flyer.pdf",".", {first:1, last:2}, (err, da) => console.log(err, da));
```
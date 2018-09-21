# FreeSASA Web Assembly

Experiment to allow run [FreeSASA](https://github.com/mittinatten/freesasa) in the browser.

To build the application, one needs Node.js, a browser that supports web assembly, and [Emscripten](https://kripken.github.io/emscripten-site/docs/getting_started/downloads.html) to run. 

To get started type:

     npm install
     npm run build:wasm
     npm start

Then go to http://localhost:8080/ and type in a PDB code.

#!/bin/bash

# To run this you need to have an Emscripten environment setup

emcc -o freesasa.mjs \
     freesasa/src/classifier.c \
     freesasa/src/classifier_naccess.c \
     freesasa/src/classifier_protor.c \
     freesasa/src/coord.c \
     freesasa/src/freesasa.c \
     freesasa/src/lexer.c \
     freesasa/src/parser.c \
     freesasa/src/log.c \
     freesasa/src/nb.c \
     freesasa/src/pdb.c \
     freesasa/src/rsa.c \
     freesasa/src/sasa_lr.c \
     freesasa/src/sasa_sr.c \
     freesasa/src/selection.c \
     freesasa/src/structure.c \
     freesasa/src/node.c \
     freesasa/src/util.c \
     freesasa-wasm.c \
     -O3 \
     -g0 \
     -DUSE_JSON=0 -DUSE_XML=0 \
     -s WASM=1 -s FORCE_FILESYSTEM=1 -s \
     EXPORTED_FUNCTIONS='["_freesasa_run"]' \
     -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap", "FS"]' \
     -s ALLOW_MEMORY_GROWTH=1 \
     -s ENVIRONMENT=web \
     -s EXPORT_NAME=freesasa \
     -s MODULARIZE=1 && \

     mv freesasa.wasm src/ && \
     mv freesasa.mjs src/

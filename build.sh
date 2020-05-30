#!/usr/bin/env bash

rollup lib/index.js --file "dist/typefo.js" --format umd --name "TypeFo"
terser "dist/typefo.js" --compress --mangle --output "dist/typefo.min.js"
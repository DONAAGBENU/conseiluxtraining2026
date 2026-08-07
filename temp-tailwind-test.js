const path = require('path');
const fs = require('fs');
const postcss = require('postcss');
const plugin = require('@tailwindcss/postcss');

const css = '@import "tailwindcss"; .test { @apply text-navy; }';

postcss([plugin()])
  .process(css, { from: path.resolve('app/globals.css') })
  .then(result => {
    console.log('OK');
    console.log(result.css);
  })
  .catch(error => {
    console.error('ERROR');
    console.error(error.message);
    process.exit(1);
  });

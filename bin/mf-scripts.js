#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const scriptSourcePath = args.length > 0 ? path.resolve(__dirname, '..', 'scripts', `${args.shift(0)}.js`) : false;

if (!scriptSourcePath || !fs.existsSync(scriptSourcePath)) {
  console.error('Unknown script');
  return;
}

// eslint-disable-next-line import/no-dynamic-require
const script = require(scriptSourcePath);
script(args).catch(err => {
  console.error(err);
  process.exitCode = 1;
});

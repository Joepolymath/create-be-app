#!/usr/bin/env node
const { init } = require('./generate.js');

init().catch((error) => {
  console.error(error);
});

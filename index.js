#!/usr/bin/env node
const { init } = require('./generate');

init().catch((error) => {
  console.error(error);
});

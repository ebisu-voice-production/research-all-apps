#!/usr/bin/env node

const cmd = process.argv[2] || 'help';
require(`./${cmd}`);

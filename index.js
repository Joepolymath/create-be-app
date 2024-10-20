#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const colors = require('picocolors');
const argv = require('minimist')(process.argv.slice(2));

const { green, red } = colors;

async function init() {
  console.log(green('create-be-app running'));

  const targetDir = argv._[0] || '.';
  const cwd = process.cwd();
  const root = path.join(cwd, targetDir);

  const renameFiles = {
    _gitignore: '.gitignore',
  };

  await fs.ensureDir(root);
  const existing = await fs.readdir(root);
  if (existing.length) {
    console.error(red(`Error: target directory is not empty.`));
    process.exit(1);
  }

  const templateDir = path.join(
    __dirname,
    `template-${argv.t || argv.template || 'express'}`
  );

  const write = async (file, content) => {
    const targetPath = renameFiles[file]
      ? path.join(root, renameFiles[file])
      : path.join(root, file);
    if (content) {
      await fs.writeFile(targetPath, content);
    } else {
      await fs.copy(path.join(templateDir, file), targetPath);
    }
  };

  const files = await fs.readdir(templateDir);
  for (const file of files.filter((f) => f !== 'package.json')) {
    await write(file);
  }

  const pkg = require(path.join(templateDir, `package.json`));
  pkg.name = path.basename(root);
  await write('package.json', JSON.stringify(pkg, null, 2));

  console.log(`\nDone. Now run:\n`);
  if (root !== cwd) {
    console.log(green(`  cd ${path.relative(cwd, root)}`));
  }
  console.log(green(`  npm install (or \`yarn\`)`));
  console.log(green(`  npm run dev (or \`yarn dev\`)`));
  console.log();
}

init().catch((error) => {
  console.error(error);
});

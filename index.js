#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const colors = require('picocolors');
const argv = require('minimist')(process.argv.slice(2));
const prompts = require('prompts');
const { formatString } = require('./utils');
prompts.override(require('yargs').argv);

const { green, red } = colors;

// template pattern => template|framework|architecture|db|language

const checkIfTemplateExists = async (templateDirectory) => {
  try {
    const exists = await fs.pathExists(templateDirectory);
    return exists;
  } catch (error) {
    console.error(red('Could not check template directory'));
  }
};

async function init() {
  console.log(green('create-be-app running'));
  const defaultFramework = 'express';
  const defaultArchitecture = 'basic';
  const defaultDb = 'mongodb';
  const defaultLang = 'javascript';

  let selectedFramework = '';

  // prompts section ===================================
  const promptsList = [
    {
      type: 'select',
      name: 'framework',
      message: 'What framework would you like to use?',
      // initial: defaultFramework,
      choices: [
        { title: 'Express', value: 'express' },
        { title: 'Fastify', value: 'fastify' },
      ],
      onState: (state) => {
        console.log({ state });
        selectedFramework = formatString(state.value) || defaultFramework;
      },
    },
    {
      type: 'select',
      name: 'architecture',
      message: 'What architecture/pattern would you like to use?',
      choices: [
        { title: 'Basic', value: 'basic' },
        { title: 'Modular', value: 'modular' },
      ],
    },
    {
      type: 'select',
      name: 'database',
      message: 'What database would you like to use?',
      choices: [
        { title: 'Mongodb', value: 'mongodb' },
        { title: 'Postgres', value: 'postgres' },
      ],
    },
    {
      type: 'select',
      name: 'language',
      message: 'What language would you like to use?',
      choices: [
        { title: 'TypeScript', value: 'ts' },
        { title: 'JavaScript', value: 'js' },
      ],
    },
  ];

  // (async () => {
  const response = await prompts(promptsList);
  console.log({ selectedFramework });
  console.log({ response });
  process.exit(1);

  // end of prompts section ================================

  const framework = argv.f || argv.framework || 'express';
  const architecture = argv.a || argv.arch || 'basic';
  const db = argv.d || argv.database || argv.db || 'mongodb';
  const language = argv.l || argv.language || 'js';
  const targetDir = argv._[0] || '.';
  const cwd = process.cwd();
  const root = path.join(cwd, targetDir);

  // console.log({ framework, architecture, db, language });

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
    `template-${framework}-${architecture}-${db}-${language}`
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
  console.log(green(`  npm install (or \`yarn\` or \`pnpm\`)`));
  console.log(green(`  npm run dev (or \`yarn dev\` or \`pnpm\`)`));
  console.log();
}

init().catch((error) => {
  console.error(error);
});

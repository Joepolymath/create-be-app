#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const colors = require('picocolors');
const argv = require('minimist')(process.argv.slice(2));
const prompts = require('prompts');
const { formatString, capitalizeFirstChar } = require('./utils.js');
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

// context layer ==> framwork.architecture.db.language
const selectionContexts = {
  express: {
    basic: {
      mongodb: {
        js: 'js',
      },
    },
    modular: {
      mongodb: {
        ts: 'ts',
      },
    },
  },
};

async function init() {
  console.log(green('create-be-app running'));
  const defaultFramework = 'express';

  // ========================= prompts section ===================================

  const response = await prompts([
    {
      type: 'select',
      name: 'framework',
      message: 'What framework would you like to use?',
      choices: Object.keys(selectionContexts).map((framework) => {
        return {
          title: capitalizeFirstChar(framework),
          value: framework,
        };
      }),
    },
    {
      type: (prev) => (prev ? 'select' : null),
      name: 'architecture',
      message: 'What architecture/pattern would you like to use?',
      choices: (prev) =>
        Object.keys(selectionContexts[prev || defaultFramework]).map(
          (architecture) => ({
            title: capitalizeFirstChar(architecture),
            value: architecture,
          })
        ),
    },
    {
      type: (prev, values) => (prev ? 'select' : null),
      name: 'database',
      message: 'What database would you like to use?',
      choices: (prev, values) =>
        Object.keys(
          selectionContexts[values.framework][values.architecture]
        ).map((database) => ({
          title: capitalizeFirstChar(database),
          value: database,
        })),
    },
    {
      type: (prev, values) => (prev ? 'select' : null),
      name: 'language',
      message: 'What language would you like to use?',
      choices: (prev, values) =>
        Object.keys(
          selectionContexts[values.framework][values.architecture][
            values.database
          ]
        ).map((language) => ({
          title: language.toUpperCase(),
          value: language,
        })),
    },
  ]);

  const { framework, architecture, database, language } = response;

  // end of prompts section ================================

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
    `template-${formatString(framework)}-${formatString(
      architecture
    )}-${formatString(database)}-${formatString(language)}`
  );

  if (!checkIfTemplateExists(templateDir)) {
    console.log(red(`Selected template does not exist: ${response}`));
  }

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

const colors = require('picocolors');

const { green } = colors;

async function init() {
  console.log(green('create-be-app running'));
}

init().catch((error) => {
  console.error(error);
});

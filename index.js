const { init } = require('./generate');

init().catch((error) => {
  console.error(error);
});

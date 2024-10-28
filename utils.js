function formatString(stringInput) {
  if (typeof stringInput !== 'string') {
    throw new Error(`[FORMAT-STRING]: Input must be string.`);
  }
  return stringInput?.trim().replace(/\/+$/g, '');
}

function capitalizeFirstChar(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  formatString,
  capitalizeFirstChar,
};

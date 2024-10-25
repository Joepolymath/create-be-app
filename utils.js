function formatString(stringInput) {
  if (typeof stringInput !== 'string') {
    throw new Error(`[FORMAT-STRING]: Input must be string.`);
  }
  return stringInput?.trim().replace(/\/+$/g, '');
}

module.exports = {
  formatString,
};

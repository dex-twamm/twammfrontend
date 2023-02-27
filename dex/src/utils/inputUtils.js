export const validateInput = (inputStr) => {
  const pattern = /^[0-9]+(\.[0-9]+)?$/;

  if (pattern.test(inputStr)) {
    return true;
  } else {
    return false;
  }
};

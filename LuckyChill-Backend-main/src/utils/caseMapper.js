function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function camelToSnake(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function keysToCamel(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(keysToCamel);
  }
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  if (typeof obj !== "object") {
    return obj;
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[snakeToCamel(key)] = keysToCamel(value);
    return acc;
  }, {});
}

function keysToSnake(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(keysToSnake);
  }
  if (typeof obj !== "object") {
    return obj;
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[camelToSnake(key)] = keysToSnake(value);
    return acc;
  }, {});
}

module.exports = {
  keysToCamel,
  keysToSnake
};

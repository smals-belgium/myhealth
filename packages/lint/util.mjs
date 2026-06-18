export const setLevel = (level, rules) =>
  Object.keys(rules).reduce((acc, next) => ({ ...acc, [next]: level }), {});

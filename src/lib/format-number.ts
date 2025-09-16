export function compactFormat(value: number) {
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
  });

  return formatter.format(value);
}

export function standardFormat(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatString(str) {
  // Convert the entire string to lowercase
  let lowercasedStr = str.toLowerCase();

  // Replace all whitespace characters with a single hyphen
  // The /\s+/g regular expression matches one or more whitespace characters globally
  let hyphenatedStr = lowercasedStr.replace(/\s+/g, '-');

  // Remove any leading or trailing hyphens that might result from initial whitespace
  let finalStr = hyphenatedStr.replace(/^-+|-+$/g, '');

  return finalStr;
}
function normalizeOutput(value) {
  if (value === null || value === undefined) return '';

  return String(value)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, ''))
    .join('\n')
    .trim();
}

export function compareOutput(actual, expected) {
  const normalizedActual = normalizeOutput(actual);
  const normalizedExpected = normalizeOutput(expected);

  return {
    passed: normalizedActual === normalizedExpected,
    normalizedActual,
    normalizedExpected
  };
}
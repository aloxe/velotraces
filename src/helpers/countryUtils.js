export function countryCodeToFlag(countrycode) {
    if (countrycode?.length !== 2) return;
    if (countrycode === 'xx') return '🌍' // not a country, used for «all»
    
    countrycode = countrycode.toUpperCase()

  const offset = 127397;
  const A = 65;
  const Z = 90;
  const f = countrycode.codePointAt(0);
  const s = countrycode.codePointAt(1);

  if (f > Z || f < A || s > Z || s < A)
    throw new Error('Not an alpha2 country code');

  return String.fromCodePoint(f + offset) + String.fromCodePoint(s + offset);
}

export function flagToCountryCode(flag) {
  if (flag === '🌍') return 'xx' // not a country, used for «all»

  const offset = 127397;
  const f = flag.codePointAt(0);
  const s = flag.codePointAt(2);
  const cc = String.fromCodePoint(f - offset) + String.fromCodePoint(s - offset);
  return cc.toLowerCase();
}
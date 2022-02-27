export function rutFormatter(rut) {
  const digits = `${rut}`.split('').reverse();
  let serie = 2;
  let sum = 0;

  digits.forEach((digit) => {
    if (serie > 7) serie = 2;
    sum = sum + parseInt(digit) * serie;
    serie = serie + 1;
  });

  let ver = 11 - (sum - Math.floor(sum / 11) * 11);
  let dig = `${ver}`;

  switch (dig) {
    case '11':
      dig = '0';
      break;
    case '10':
      dig = 'K';
      break;
    default:
      break;
  }

  return `${new Intl.NumberFormat('es-CL').format(rut)}-${dig}`;
}

export function toLegibleDate(timestamp) {
  let time =
    typeof timestamp === 'string'
      ? parseInt(timestamp)
      : timestamp.seconds * 1000;
  return new Date(time).toLocaleDateString('es-CL');
}

export function toLegibleTime(timestamp) {
  let time =
    typeof timestamp === 'string'
      ? parseInt(timestamp)
      : timestamp.seconds * 1000;
  return new Date(time).toLocaleTimeString('es-CL');
}

export function toLegibleDateTime(timestamp) {
  return `${toLegibleDate(timestamp)} ${toLegibleTime(timestamp)}`;
}

export function normalizeString(str) {
  str = str.toLowerCase();
  for (var i = 0; i < str.length; i++) {
    //Sustituye "á é í ó ú"
    if (str.charAt(i) === 'á') str = str.replace(/á/, 'a');
    if (str.charAt(i) === 'é') str = str.replace(/é/, 'e');
    if (str.charAt(i) === 'í') str = str.replace(/í/, 'i');
    if (str.charAt(i) === 'ó') str = str.replace(/ó/, 'o');
    if (str.charAt(i) === 'ú') str = str.replace(/ú/, 'u');
  }
  return str;
}

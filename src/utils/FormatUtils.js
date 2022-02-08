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
  return new Date(timestamp.seconds * 1000).toLocaleDateString('es-CL');
}

export function toLegibleTime(timestamp) {
  return new Date(timestamp.seconds * 1000).toLocaleTimeString('es-CL');
}

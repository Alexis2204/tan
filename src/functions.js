export const getName = (longName) => {
  const pattern = /^[^(]+/;
  let result = longName.match(pattern)[0].trim();
  return result;
}

export const getDate= (timestamp ) => {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
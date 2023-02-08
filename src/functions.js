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

export const formatTimestamp= (timestamp) => {
  if (timestamp){
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes() + 1}`.slice(-2);
    return `${year}-${month}-${day}_${hours}-${minutes}`;
  }
}

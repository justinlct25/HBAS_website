export const formatDateAndTime = (date: string) => {
  return (
    new Date(date).toLocaleDateString('en-CA') +
    ' ' +
    new Date(date).toLocaleTimeString('en-CA', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    })
  );
};
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-CA');
};
export const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('en-CA', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
export const getDateFormat = (date: string) => {
  const tempArr = date.split('/');
  const dateString = tempArr[1] + '月' + tempArr[0] + '日';
  return dateString;
};

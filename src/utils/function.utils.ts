export const checkSameDay = (
  startTime: Date | string,
  endTime: Date | string,
) => {
  const formattedDate1 = new Date(startTime);
  const formattedDate2 = new Date(endTime);
  return (
    formattedDate1.getDate() === formattedDate2.getDate() &&
    formattedDate1.getMonth() === formattedDate2.getMonth() &&
    formattedDate1.getFullYear() === formattedDate2.getFullYear()
  );
};

export const getDateWithoutTime = (startTime: Date | string) => {
  const dateWithoutTime = new Date(startTime);
  const time = dateWithoutTime.getTime();
  const result = time - (time % 86400000);
  return new Date(result);
};

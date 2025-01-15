const getQuarterDates = (year : number) => {
  return [
    { start: new Date(year, 0, 1), end: new Date(year, 2, 31) },  // Q1: January 1 to March 31
    { start: new Date(year, 3, 1), end: new Date(year, 5, 30) },  // Q2: April 1 to June 30
    { start: new Date(year, 6, 1), end: new Date(year, 8, 30) },  // Q3: July 1 to September 30
    { start: new Date(year, 9, 1), end: new Date(year, 11, 31) }  // Q4: October 1 to December 31
  ];
}


const formatDate = (date : any) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, pad with leading zero
  const day = String(date.getDate()).padStart(2, '0'); // Pad day with leading zero
  return `${year}-${month}-${day}`;
}

export const getCurrentEpoch = () => {
  const today = new Date();
  const year = today.getFullYear();
  const quarters = getQuarterDates(year);

  for (let i = 0; i < quarters.length; i++) {
    const { start, end } = quarters[i];
    if (today >= start && today <= end) {
      // console.log(`Today's date is in Quarter ${i + 1}:`);
      // console.log(`Start date: ${formatDate(start)}`);
      // console.log(`End date: ${formatDate(end)}`);
      return ({
        start_date : formatDate(start),
        end_date : formatDate(end)
      })
    }
  }
}

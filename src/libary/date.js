const monthsList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const localToUTC = (mydate) => {
  return new Date(mydate.toUTCString()).toISOString();
};

export const convertUTCDateToLocalDate = (date) => {
  var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return newDate;
};
export const convertDate = (date) => {
  let mydate = new Date();
  let dateDay = mydate.getDate();
  let mymonth = monthsList[mydate.getMonth()];
  let myyear = mydate.getFullYear();
  let th =
    dateDay === 1 ? "st" : dateDay === 2 ? "nd" : dateDay === 3 ? "rd" : "th";
   
  let datetext = "";
  if (date && date.length === 0) {
    datetext = `${dateDay}${th}  ${mymonth} ${myyear}` ;
  } else {
   
    mydate = new Date(date);
    dateDay = mydate.getDate();

    mymonth = monthsList[mydate.getMonth()];
    myyear = mydate.getFullYear();
    th =
      (dateDay === 1 || dateDay === 21 || dateDay === 31) ? "st" : dateDay === 2 || dateDay === 22 || dateDay === 32 ? "nd" : dateDay === 3 || dateDay === 23  ? "rd" : "th";

    datetext = dateDay + th + " " + mymonth + " " + myyear;
  }
  return datetext;
};

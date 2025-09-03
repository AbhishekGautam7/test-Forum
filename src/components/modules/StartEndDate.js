import React, { useEffect, useState } from "react";
import DatePicker from "./DatePicker";
function StartEndDate(props) {
  const { onSetEndDate,onSetStartDate, onScheduled,onIsValidDate,onRemoveDatePicker, startDate, endDate } = props;
  const [selectedDate,setSelectedDate]=useState("");
  const [isValidDate,setIsValidDate] = useState(true);
  const [title, setTitle] = useState("");
  const [datePickerStatus, setDatePickerStatus] = useState(false);
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
  useEffect(() => {
    console.log("check all validation");
    console.log(startDate);
    console.log(endDate);
    if(startDate instanceof Date  && endDate instanceof Date === false){
      setIsValidDate(true);
      onIsValidDate(true);
      console.log("Yes1")
    }else if(startDate instanceof Date === false && endDate instanceof Date === true){
      // Invalid
      setIsValidDate(false);
      onIsValidDate(false);
      console.log("No1")
    }else if(startDate instanceof Date === false && endDate instanceof Date === false){
      // null
    }else if(startDate instanceof Date === true && endDate instanceof Date === true){
      // condition apply
      if(startDate<=endDate){
        setIsValidDate(true);
        onIsValidDate(true);
        console.log("Yes2")
      }else{
        setIsValidDate(false);
        onIsValidDate(false);
        console.log("No2")
      }
    }else{

    }
  

  }, [startDate,endDate]);

 


  const openDatePicker = (txt) => {
    try {
     if(txt === "Start Schedule"){
        setSelectedDate(startDate);
        setTitle(txt);
        setDatePickerStatus(true);
      }else{
        setSelectedDate(endDate);
        setTitle(txt);
        setDatePickerStatus(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const removeDatePicker = (txt) =>{
    try {
      onRemoveDatePicker();
      setDatePickerStatus(false);
    } catch (error) {
      console.error(error);
    }
  }

  const convertDate = (date) =>{
    let mydate = new Date(date);
    let dateDay = mydate.getDate();
    let mymonth = monthsList[mydate.getMonth()];
    let myyear = mydate.getFullYear();
    let hrs = mydate.getHours();
    let mins = mydate.getMinutes();
    console.log(dateDay);
    let th = dateDay === 1 || dateDay === 21 || dateDay === 31
      ? "st"
      : dateDay === 2 || dateDay === 22 || dateDay === 32
      ? "nd"
      : dateDay === 3 || dateDay === 23 || dateDay === 33
      ? "rd"
      : "th" 
     
    if(date.length===0){
      return dateDay + th + " "+mymonth + " " + myyear
    }else{
      mydate = new Date(date);
      hrs = mydate.getHours();
      mins = mydate.getMinutes();
   dateDay = mydate.getDate();
   mymonth = monthsList[mydate.getMonth()];
     myyear = mydate.getFullYear();
   th = dateDay === 1 || dateDay === 21 || dateDay === 31
      ? "st"
      :  dateDay === 2 || dateDay === 22 || dateDay === 32
      ? "nd"
      :dateDay === 3 || dateDay === 23 || dateDay === 33
      ? "rd"
      : "th";
      return dateDay + "" + th + " "+mymonth + " " + myyear + " "+hrs +":"+mins
    }
   
  }
  const makeSchedule = (data) =>{
    console.log(data);
    setDatePickerStatus(false);
    onScheduled(data);
   
  } 
  return (
    <div className="startEndDate">
      <div className="startAt">
        <span className="lbl"> Start at </span>
        <div className="rightOpt">
          <span>:</span>
          <img
            onClick={() => openDatePicker("Start Schedule")}
            src={process.env.REACT_APP_SITE_URL + "time.svg"}
            width="12"
            height="12"
          />
        <span>{startDate.length===0 ? "" : convertDate(startDate)}</span>
      
        </div>
      </div>
      <div className="endAt">
        <span className="lbl"> End at :</span>
        <div className="rightOpt">
          <span>:</span>
          <img
            onClick={() => openDatePicker("End Schedule")}
            src={process.env.REACT_APP_SITE_URL + "time.svg"}
            width="12"
            height="12"
          />
 <span>{endDate.length===0 ? "" : convertDate(endDate)}</span>
         
        </div>
      </div>
     
      {
        !isValidDate && <span>Start Date must not be greater than End Date</span>
      }
      {datePickerStatus && <DatePicker value={selectedDate} onStatus={(val)=>setDatePickerStatus(val)} onScheduled={(data)=>makeSchedule(data)} onRemove={(data)=>removeDatePicker(data)} title={title} />}
    </div>
  );
}

export default React.memo(StartEndDate);

import React, { PureComponent } from "react";

class DatePicker extends PureComponent {
  constructor(props) {
    try {
      super(props);
      this.hrsRef = React.createRef();
      this.setHours = this.setHours.bind(this);
      this.setMonth = this.setMonth.bind(this);
      this.setMins = this.setMins.bind(this);

      // this.toggleShowMonthList = this.toggleShowMonthList.bind(this);

      this.state = {
        monthsList: [
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
        ],
        dayList: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        showMonthList: false,
        showAMPMList: false,
        days: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        dates: [],
        scheduleDate: null,
        choosedDate: 0,
        selectedMonth: 0,
        selectedYear: new Date().getFullYear(),
        selectedDate: 0,
        selectedDay: "",
        selectedHour: null,
        selectedMinutes: null,
        selectedAMPM: null,
        twelveHours: 0,
        title: null,
        hours: 1,
        btnTitle: "OK",
        minutes: 1,
        errorMsg: "",
        ampmOptions: [
          {
            id: "0",
            title: "AM",
            value: "am",
          },
          {
            id: "1",
            title: "PM",
            value: "pm",
          },
        ],
        timeZoneValues: [
          {
            id: "0",
            title: "PST",
            value: "pst",
          },
        ],
        timeZoneOptions: [
          {
            id: "0",
            title: "PST",
            value: "pst",
          },
          {
            id: "1",
            title: "GMT",
            value: "gmt",
          },
        ],
        monthZoneOptions: [],
        monthValues: [],
        selectedMonthValue: [],
      };
    } catch (err) {
      console.log(err);
    }
  }
  setIfLeapYear() {
    let selectedYear = new Date().getFullYear();
    let days = [...this.state.days];
    if (selectedYear % 4 === 0) {
      days[1] = 28;
      this.setState({
        days: days,
      });
    }
  }
  convertTwelveHours(val) {
    try {
      if (val) {
        let hrs = parseInt(val);

        if (this.state.selectedAMPM[0].value === "pm") {
          if (hrs === 12) {
            hrs = 12;
          } else if (hrs > 12) {
            hrs = hrs - 12;
          }
        }
        if (this.state.selectedAMPM[0].value === "am") {
          if (hrs > 12) {
            hrs -= 12;
          }
        }

        return hrs;
      } else {
        return "";
      }
    } catch (error) {
      console.log(error);
    }
  }
  setCurrentDate() {
    let da = new Date();
    let localMinute = da.getMinutes();
    let utcMinute = da.getUTCMinutes();
    let mins = Math.abs((localMinute - utcMinute + 30) % 60);
    da.setMinutes(mins);
    return da;
  }
  getUTCMinutes() {
    let newDate = this.props.value ? new Date(this.props.value) : new Date();
    let da = newDate;
    let localMinute = da.getMinutes();
    let utcMinute = da.getUTCMinutes();
    return Math.abs((localMinute - utcMinute + 30) % 60);
  }
  componentDidUpdate() {
    this.setState({
      title: this.props.title ? this.props.title : null,
    });
  }
  async componentDidMount() {
    try {
      console.log(this.props);
      let newDate = this.props.value ? new Date(this.props.value) : new Date();

      let selectedYear = newDate.getFullYear();
      let selectedMonth = newDate.getMonth();
      let currentDate = newDate.getDate();
      let selectedHour = newDate.getHours();

      let selectedMinutes = this.state.selectedMinutes
        ? this.state.selectedMinutes
        : newDate.getMinutes();

      if (this.props.mode === "createpost") {
        selectedMinutes = this.getUTCMinutes();
      }

      this.setIfLeapYear();

      let datesList = this.setDateList({
        year: selectedYear,
        month: selectedMonth,
        currentDate: currentDate,
      });

      let monthList = this.showMonthList();
      let ampmOptions = [...this.state.ampmOptions];
      let monthObj = monthList.find(
        (item) => item.month === this.state.monthsList[selectedMonth]
      );
      let monthIndex = monthList.indexOf(monthObj);

      let scheduleDate = this.props.value
        ? new Date(this.props.value)
        : new Date();
      scheduleDate.setFullYear(selectedYear);
      scheduleDate.setMonth(selectedMonth);
      scheduleDate.setDate(newDate.getDate());
      scheduleDate.setSeconds(0);

      await this.setState({
        monthValues: monthList,
        selectedMonth: selectedMonth,
        selectedYear: selectedYear,
        selectedHour: selectedHour,
        selectedMinutes: selectedMinutes,
        selectedDate: newDate.getDate(),
        selectedDay: this.state.dayList[newDate.getDay()].slice(0, 3),
        dates: datesList,
        btnTitle: this.props.btnTitle ? this.props.btnTitle : "OK",
        scheduleDate: scheduleDate,
        title: this.props.title ? this.props.title : null,
        selectedAMPM:
          selectedHour > 12
            ? [ampmOptions[1]]
            : selectedHour === 0
            ? [ampmOptions[1]]
            : selectedHour === 12
            ? [ampmOptions[0]]
            : [ampmOptions[0]],
        selectedMonthValue: [monthList[monthIndex]],
        twelveHours:
          selectedHour > 12
            ? parseInt(selectedHour) - 12
            : selectedHour === 0
            ? 12
            : selectedHour === 12
            ? 0
            : parseInt(selectedHour),
      });
      window.scrollTo(0, window.scrollY + 500);
    } catch (error) {
      console.log(error);
    }
  }

  setDateList(obj) {
    try {
      let selectedYear = obj.year;
      let selectedMonth = obj.month;

      let firstDateDay = new Date(
        Date.UTC(selectedYear, selectedMonth, 1)
      ).getUTCDay();

      // Find dates of previous month
      let prevMonthRemainStart =
        this.state.days[selectedMonth - 1] - firstDateDay + 1;

      let j = 0;
      let date = 0;
      let datesList = [];
      let monthOf = null;
      let active = false;
      let isCurrentDate = false;
      let startedCountCurrentMonthDate = false;

      while (j < 42) {
        // Date Display of Previous Month

        if (j === 0 && prevMonthRemainStart > 0) {
          date = prevMonthRemainStart;
          monthOf = "previous";
        }

        if (j === firstDateDay) {
          monthOf = "current";
          date = 1;
          startedCountCurrentMonthDate = true;
        }

        if (
          date > this.state.days[selectedMonth] &&
          startedCountCurrentMonthDate
        ) {
          date = 1;
          monthOf = "next";
        }

        if (date === this.state.selectedDate && monthOf === "current") {
          isCurrentDate = true;
        } else {
          isCurrentDate = false;
        }

        let mydate = "0" + date;

        let todayDate = new Date();
        let eachDate = new Date(selectedYear, selectedMonth, mydate.slice(-2));

        if (eachDate >= todayDate) {
          active = true;
        } else {
          active = false;
          // Check exact year, month and date
          let matchEachDate =
            eachDate.getDate() === todayDate.getDate() ? true : false;
          let matchEachYear =
            eachDate.getFullYear() === todayDate.getFullYear() ? true : false;
          let matchEachMonth =
            eachDate.getMonth() === todayDate.getMonth() ? true : false;
          if (
            matchEachDate === true &&
            matchEachYear === true &&
            matchEachMonth === true
          ) {
            active = true;
          }
        }

        // If Previous Month's date need
        if (monthOf === "previous") {
          active = false;
        }

        const selectedDate = new Date(selectedYear, selectedMonth, date);
        let selectedDay = selectedDate.getDay();

        let month = selectedMonth;
        if (monthOf === "previous") {
          month = month - 1;
        }

        if (monthOf === "next") {
          month = month + 1;
        }

        datesList.push({
          id: j,
          monthOf: monthOf,
          date: date,
          month: month,
          year: selectedYear,
          isCurrentDate: isCurrentDate,
          active: active,
          day: selectedDay,
        });
        date++;

        j++;
      }

      return datesList;
    } catch (error) {
      console.log(error);
    }
  }
  showMonthList() {
    try {
      let currentMonth = new Date().getMonth();
      let currentYear = new Date().getFullYear();
      let monthList = [];
      let i = 0;
      while (i < 12) {
        if (currentMonth === 12) {
          currentMonth = 0;
          currentYear++;
        }

        monthList.push({
          id: i,
          title: this.state.monthsList[currentMonth] + " - " + currentYear,
          month: this.state.monthsList[currentMonth],
          year: currentYear,
        });
        currentMonth++;
        i++;
      }
      return monthList;
    } catch (error) {
      console.log(error);
    }
  }
  setMins(e) {
    try {
      var val =
        !isNaN(parseInt(e.target.value)) &&
        parseInt(e.target.value) >= 0 &&
        parseInt(e.target.value) < 60
          ? parseInt(e.target.value)
          : "00";
      console.log("Selected mins :", e.target.value);
      let scheduleDate = new Date(this.state.scheduleDate);
      scheduleDate.setMinutes(e.target.value);
      this.setState({
        selectedMinutes: e.target.value,
        scheduleDate: scheduleDate,
      });
    } catch (error) {
      console.log(error);
    }
  }
  setHours(e) {
    try {
      var data = e.target.value;

      data.trim();

      if (data.length === 0) {
        this.setState({
          twelveHours: null,
          selectedHour: null,
        });
      } else if (data > 0 && data <= 12) {
        let hrs = 0;
        if (this.state.selectedAMPM[0].value === "am") {
          hrs = data;
          if (parseInt(data) === 12) {
            hrs = 12;
          }
        }

        if (this.state.selectedAMPM[0].value === "pm") {
          hrs = parseInt(data) + 12;
          if (parseInt(data) === 12) {
            hrs = 24;
          }
        }
        let scheduleDate = new Date(this.state.scheduleDate);
        scheduleDate.setHours(hrs);
        if (data.length > 0) {
          this.setState({
            twelveHours: data,
            selectedHour: hrs,
            scheduleDate: scheduleDate,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  setMonth(obj) {
    try {
      console.log("setMonth");
      let selectedMonth = this.state.monthsList.indexOf(obj[0].month);
      let selectedYear = obj[0].year;
      let currentDate = this.state.selectedDate;

      let datesList = this.setDateList({
        year: selectedYear,
        month: selectedMonth,
        currentDate: currentDate,
      });
      let scheduleDate = new Date(this.state.scheduleDate);
      scheduleDate.setMonth(selectedMonth);
      scheduleDate.setFullYear(selectedYear);

      this.setState({
        selectedMonth: selectedMonth,
        selectedYear: selectedYear,
        dates: datesList,
        scheduleDate: scheduleDate,
        showMonthList: false,
      });
    } catch (error) {
      console.log(error);
    }
  }
  setAMDefaultValue() {
    try {
      return this.state.selectedAMPM;
    } catch (error) {
      console.log(error);
    }
  }
  setMonthDefaultValue() {
    try {
      return this.showMonthList()[0];
    } catch (error) {
      console.log(error);
    }
  }
  set12Hours(val) {
    try {
      var hrsInput = this.state.selectedHour;
      var hours = 0;
      if (val[0].value === "pm") {
        if (hrsInput === 12) {
          hours = 0;
        } else if (hrsInput < 12) {
          hrsInput = parseInt(hrsInput) + 12;
          hours = hrsInput;
        } else {
          hours = hrsInput;
        }
      } else if (val[0].value === "am") {
        if (hrsInput === 12) {
          hours = 12;
        } else if (hrsInput > 12) {
          hrsInput = parseInt(hrsInput) - 12;
          hours = hrsInput;
        } else {
          hours = hrsInput;
        }
      }

      return hours;
    } catch (error) {
      console.log(error);
    }
  }
  setAMPM(val) {
    try {
      var convertedHour = this.set12Hours([val]);
      this.setState({
        selectedAMPM: [val],
        selectedHour: convertedHour,
        showAMPMList: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  hidePanel = (value) => {
    try {
      this.props.onStatus(value);
      window.scrollTo(0, window.scrollY - 500);
    } catch (error) {
      console.log(error);
    }
  };
  setDateClass(item) {
    let todayDate = new Date();

    let itemDate = new Date();
    itemDate.setFullYear(item.year);
    itemDate.setMonth(item.month);
    itemDate.setDate(item.date);
    itemDate.setHours(this.state.selectedHour);
    itemDate.setMinutes(this.state.selectedMinutes);
    itemDate.setSeconds(0);

    let currentClass =
      todayDate.toString() === itemDate.toString() ? " current " : "";
    let activeClass;
    if (item.active && item.monthOf === "current") {
      activeClass = "active";
    } else {
      activeClass = "disabled";
    }

    let selectedDate =
      itemDate.toString() === this.state.scheduleDate.toString()
        ? " selected "
        : "";
    return currentClass + activeClass + selectedDate;
  }
  async selectDate(obj) {
    try {
      let scheduleDate = this.state.scheduleDate;
      scheduleDate.setDate(obj.date);
      scheduleDate.setHours(this.state.selectedHour);
      scheduleDate.setMinutes(this.state.selectedMinutes);
      scheduleDate.setSeconds(0);

      let day = this.state.dayList[obj.day].slice(0, 3);
      await this.setState({
        selectedDate: obj.date,
        selectedDay: day,
        choosedDate: obj.date,
        scheduleDate: scheduleDate,
      });
    } catch (error) {
      console.log(error);
    }
  }

  getSemiMonth(val) {
    try {
      return this.state.monthsList[val].slice(0, 3);
    } catch (err) {
      console.log(err);
    }
  }

  setSchedulePost() {
    try {
      let freshDate = new Date();
      let scheduleDate = new Date(this.state.scheduleDate);

      scheduleDate.setSeconds(0);
      //scheduleDate.setMinutes(0);
      //scheduleDate.setHours(0);
      scheduleDate.setMilliseconds(0);

      let newDate = new Date();

      // newDate.setMinutes(this.getUTCMinutes());
      newDate.setSeconds(0);
      //newDate.setMinutes(0);
      //newDate.setHours(0);
      newDate.setMilliseconds(0);

      if (this.state.selectedHour) {
        if (this.state.selectedHour.length === 0) {
          this.setState({
            errorMsg: "Scheduled Hour is required to fill",
          });
          return false;
        }
      } else {
        this.setState({
          errorMsg: "Scheduled Hour is required to fill",
        });
        return false;
      }

      if (scheduleDate < newDate) {
        console.log(scheduleDate);
        console.log(newDate);

        this.setState({
          errorMsg: "Schedule date must not be less than current date",
        });
        return false;
      }

      scheduleDate.setHours(this.state.selectedHour);
      scheduleDate.setMinutes(this.state.selectedMinutes);
      scheduleDate.setSeconds(0);
      console.log({
        data: scheduleDate,
        title: this.state.title === "Start Schedule" ? "start" : "end",
      });
      console.log("Schedule Date :", scheduleDate.toLocaleString());

      this.props.onScheduled({
        data: scheduleDate,
        title: this.state.title === "Start Schedule" ? "start" : "end",
      });
      window.scrollTo(0, window.scrollY - 500);
    } catch (error) {
      console.log(error);
    }
  }
  setTwelveHours(val) {
    try {
      let hrs = val;
      if (this.state.selectedAMPM[0].value === "pm" && hrs >= 12) {
        hrs = parseInt(val) - 12;
      }

      if (this.state.selectedAMPM[0].value === "am" && hrs <= 12) {
        hrs = parseInt(val) + 12;
      }

      return hrs;
    } catch (error) {
      console.log(error);
    }
  }
  toggleShowAMPMList() {
    try {
      this.setState((prevstate) => ({
        showAMPMList: !prevstate.showAMPMList,
      }));
    } catch (error) {
      console.error(error);
    }
  }
  toggleShowMonthList() {
    try {
      this.setState((prevstate) => ({
        showMonthList: !prevstate.showMonthList,
      }));
    } catch (error) {
      console.error(error);
    }
  }
  removeSchedule() {
    window.scrollTo(0, window.scrollY - 500);
    this.props.onRemove(
      this.state.title === "Start Schedule"
        ? "start"
        : this.state.title === "End Schedule"
        ? "close"
        : null
    );
  }
  render() {
    const { btnTitle, title } = this.state;
    return (
      <>
        <div id="schedulePicker">
          <div className="titleRow">
            {title ? <h3>{title}</h3> : ""}
            <button
              className="btn btn-secondary closeBtn"
              onClick={() => this.hidePanel(false)}
            >
              <span>Cancel</span> <div className="cross"></div>
            </button>
          </div>
          <div className="calendarConfig">
            {/*
            <div className="leftConfig">
              <input
                type="text"
                onChange={this.setHours}
                maxLength="2"
                value={this.convertTwelveHours(
                  this.state.selectedHour
                ).toString()}
                className="hour"
                ref={this.hrsRef}
              />
              <span className="colon">:</span>
             
              <input
                type={title != null ? "text" : "hidden"}
                maxLength="2"
                disabled={title == null}
                onChange={this.setMins}
                value={
                  this.state.selectedMinutes ? this.state.selectedMinutes : "00"
                }
                className="minute"
                ref={this.minsRef}
              />
              
              {this.state.selectedAMPM ? (
                <Select
                  values={this.state.selectedAMPM}
                  onChange={(value) => this.setAMPM(value)}
                  options={this.state.ampmOptions}
                  labelField="title"
                  valueField="id"
                  className="selectbox am"
                />
              ) : (
                ""
              )}
            </div> */}
            <div className="leftConfig">
              <input
                type="text"
                onChange={this.setHours}
                maxLength="2"
                value={this.convertTwelveHours(
                  this.state.selectedHour
                ).toString()}
                className="hour"
                ref={this.hrsRef}
              />
              <span className="colon">:</span>

              <input
                type={title != null ? "text" : "hidden"}
                maxLength="2"
                disabled={title == null}
                onChange={this.setMins}
                value={
                  this.state.selectedMinutes ? this.state.selectedMinutes : "00"
                }
                className="minute"
                ref={this.minsRef}
              />

              {this.state.selectedAMPM &&
                this.state.ampmOptions &&
                this.state.ampmOptions.length > 0 && (
                  <div className="selectbox am">
                    <div className="title">
                      <div className="txt">
                        {this.state.selectedAMPM[0].title}
                      </div>
                      <button
                        className="arrowBtn"
                        onClick={() => this.toggleShowAMPMList()}
                      >
                        <div
                          className={`downArrow ${
                            this.state.showAMPMList ? "open" : "close"
                          }`}
                        ></div>
                      </button>
                    </div>
                    {this.state.showAMPMList && (
                      <ul>
                        {this.state.ampmOptions.map((item) => {
                          return (
                            <li
                              key={item.value}
                              onClick={() => this.setAMPM(item)}
                            >
                              {item.title}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
            </div>
            <div className="selectbox month">
              <div className="title">
                <div className="txt">
                  {this.state.monthsList[this.state.selectedMonth]}
                  <span>-</span>
                  {this.state.selectedYear}
                </div>
                <button
                  className="arrowBtn"
                  onClick={() => this.toggleShowMonthList()}
                >
                  <div
                    className={`downArrow ${
                      this.state.showMonthList ? "open" : "close"
                    }`}
                  ></div>
                </button>
              </div>

              {this.state.showMonthList && (
                <ul>
                  {this.state.monthValues && this.state.monthValues.length > 0
                    ? this.state.monthValues.map((item) => {
                        return (
                          <li
                            key={item.id}
                            onClick={() => this.setMonth([item])}
                          >
                            {item.title}
                          </li>
                        );
                      })
                    : ""}
                </ul>
              )}
            </div>
          </div>
          {/*
           <Select
              values={this.state.selectedMonthValue}
              onChange={(value) => this.setMonth(value)}
              options={this.state.monthValues}
              labelField="title"
              valueField="id"
              className="selectbox month"
            />
          */}
          <div className="displayCalendar">
            <ul className="weeks">
              {this.state.dayList.map((item, index) => (
                <li key={index}>{item.charAt(0)}</li>
              ))}
            </ul>
            <ul className="days">
              {this.state.dates.map((item) => {
                return (
                  <li
                    onClick={() => this.selectDate(item)}
                    key={item.id}
                    className={this.setDateClass(item)}
                    data-month={item.month}
                    data-year={item.year}
                  >
                    <span>{item.date}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="actionControl">
            <div className="leftSide">
              <button
                className="btn btn-secondary"
                onClick={() => this.removeSchedule()}
              >
                Remove Schedule
              </button>
            </div>
            <div className="rightSide">
              <div className="selectedDate">
                <span className="date"> Date : {this.state.selectedDate}</span>
                <span className="th">
                  {this.state.selectedDate === 1
                    ? "st"
                    : this.state.selectedDate === 2
                    ? "nd"
                    : this.state.selectedDate === 3
                    ? "rd"
                    : "th"}
                </span>
                <span className="month">
                  &nbsp;
                  {this.state.monthsList[this.state.selectedMonth].slice(0, 3)}
                </span>
                <span className="year">&nbsp;{this.state.selectedYear}</span>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <span>
                  {this.state.selectedHour}:{this.state.selectedMinutes}{" "}
                  {this.state.selectedAMPM && this.state.selectedAMPM.length > 0
                    ? this.state.selectedAMPM[0].title
                    : ""}
                </span>
              </div>
              <button
                className="btn btn-dark"
                onClick={() => this.setSchedulePost()}
              >
                {btnTitle}
              </button>
              {/* Disabled State : <button disabled className="btn btn-primary">Schedule Post</button> */}
            </div>
          </div>
          <div className="small-txt">{this.state.errorMsg}</div>
        </div>
      </>
    );
  }
}

export default React.memo(DatePicker);

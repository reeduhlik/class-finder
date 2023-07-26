import React from "react";
import { useState, useEffect } from "react";
import Course from "./Course";
import CalendarCourse from "./CalendarCourse";
import "./App.css";
import page0 from "./page0.json";
import page1 from "./page1.json";
import page2 from "./page2.json";
import page3 from "./page3.json";
import page4 from "./page4.json";
import page5 from "./page5.json";
import page6 from "./page6.json";
import page7 from "./page7.json";
import page8 from "./page8.json";
import page9 from "./page9.json";
import page10 from "./page10.json";
import page11 from "./page11.json";
import InfiniteScroll from "react-infinite-scroll-component";
import { HashLoader } from "react-spinners";
import { inject } from "@vercel/analytics";
//import stuff to do animation on scroll
import "animate.css/animate.min.css";
import { AnimationOnScroll } from "react-animation-on-scroll";
import {
  FaSliders,
  FaArrowRightToBracket,
  FaRegCalendar,
  FaCopy,
  FaBars,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import Toggle from "react-toggle";
import Select from "react-select";
import IntroScreen from "./IntroScreen";

const mergePages = () => {
  const data = page0.data.concat(
    page1.data,
    page2.data,
    page3.data,
    page4.data,
    page5.data,
    page6.data,
    page7.data,
    page8.data,
    page9.data,
    page10.data,
    page11.data
  );

  return data;

  //write certain fields to csv file
};

const App = () => {
  inject();
  const formatMilitaryTime = (time) => {
    if (!time) {
      return "";
    }
    const hour = time.substring(0, 2);
    const minute = time.substring(2, 4);
    const formattedHour = hour % 12 || 12;
    const ampm = hour < 12 ? "AM" : "PM";
    return formattedHour + ":" + minute + " " + ampm;
  };
  const courses = mergePages();

  const [showIntro, setShowIntro] = useState(true);
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedCourses, setSelectedCourses] = useState(() => {
    const saved = localStorage.getItem("selectedCourses");
    const initialValue = JSON.parse(saved);
    return initialValue || [];
  });
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [attributeOptions, setAttributeOptions] = useState([]);

  const times = [
    "600",
    "630",
    "700",
    "730",
    "800",
    "830",
    "900",
    "930",
    "1000",
    "1030",
    "1100",
    "1130",
    "1200",
    "1230",
    "1300",
    "1330",
    "1400",
    "1430",
    "1500",
    "1530",
    "1600",
    "1630",
    "1700",
    "1730",
    "1800",
    "1830",
    "1900",
    "1930",
    "2000",
    "2030",
    "2100",
    "2130",
    "2200",
    "2230",
    "2300",
    "2330",
  ];

  const colors = [
    "#FFC857",
    "#3ABECF",
    "#F9B9F2",
    "#8089b3",
    "#D64933",
    "#bc5000",
  ];

  const days = ["M", "T", "W", "Th", "F"];

  const switchDayOfWeek = (course, day) => {
    if (day === "M") {
      return course.meetingsFaculty[0].meetingTime.monday;
    } else if (day === "T") {
      return course.meetingsFaculty[0].meetingTime.tuesday;
    } else if (day === "W") {
      return course.meetingsFaculty[0].meetingTime.wednesday;
    } else if (day === "Th") {
      return course.meetingsFaculty[0].meetingTime.thursday;
    } else if (day === "F") {
      return course.meetingsFaculty[0].meetingTime.friday;
    }
  };

  const onCopyClick = () => {
    //copy all crns of selected courses to clipboard
    let crns = "";
    crns += "Your Course CRNs:\n\n";
    selectedCourses.forEach((course) => {
      crns +=
        course.subjectCourse +
        " (" +
        course.courseTitle +
        "): **" +
        course.courseReferenceNumber +
        "**\n";
    });
    navigator.clipboard.writeText(crns);
  };

  useEffect(() => {
    localStorage.setItem("selectedCourses", JSON.stringify(selectedCourses));
    setShowCalendar(true);
  }, [selectedCourses]);

  const getCreditNumber = () => {
    //add credit numbers together of selected courses
    let credits = 0;

    selectedCourses.forEach((course) => {
      if (course.creditHours != null) {
        credits += course.creditHours;
      } else if (course.creditHourHigh != null) {
        credits += course.creditHourHigh;
      } else if (course.creditHourLow != null) {
        credits += course.creditHourLow;
      }
    });
    return credits + " Credits";
  };

  const [timeOptions, setTimeOptions] = useState([
    { value: 500, label: "5:00 AM" },
    { value: 530, label: "5:30 AM" },
    { value: 600, label: "6:00 AM" },
    { value: 630, label: "6:30 AM" },
    { value: 700, label: "7:00 AM" },
    { value: 730, label: "7:30 AM" },

    { value: 800, label: "8:00 AM" },
    { value: 830, label: "8:30 AM" },
    { value: 900, label: "9:00 AM" },
    { value: 930, label: "9:30 AM" },
    { value: 1000, label: "10:00 AM" },
    { value: 1030, label: "10:30 AM" },
    { value: 1100, label: "11:00 AM" },
    { value: 1130, label: "11:30 AM" },
    { value: 1200, label: "12:00 PM" },
    { value: 1230, label: "12:30 PM" },
    { value: 1300, label: "1:00 PM" },
    { value: 1330, label: "1:30 PM" },
    { value: 1400, label: "2:00 PM" },
    { value: 1430, label: "2:30 PM" },
    { value: 1500, label: "3:00 PM" },
    { value: 1530, label: "3:30 PM" },
    { value: 1600, label: "4:00 PM" },
    { value: 1630, label: "4:30 PM" },
    { value: 1700, label: "5:00 PM" },
    { value: 1730, label: "5:30 PM" },
    { value: 1800, label: "6:00 PM" },
    { value: 1830, label: "6:30 PM" },
    { value: 1900, label: "7:00 PM" },
    { value: 1930, label: "7:30 PM" },
    { value: 2000, label: "8:00 PM" },
    { value: 2030, label: "8:30 PM" },
    { value: 2100, label: "9:00 PM" },
    { value: 2130, label: "9:30 PM" },
    { value: 2200, label: "10:00 PM" },
    { value: 2230, label: "10:30 PM" },
    { value: 2300, label: "11:00 PM" },
    { value: 2330, label: "11:30 PM" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [attributes, setAttributes] = useState([]);

  const [onlyOpen, setOnlyOpen] = useState(false);
  const [onlyGrad, setOnlyGrad] = useState(false);
  const [onlyGU, setOnlyGU] = useState(true);
  const [noFriday, setNoFriday] = useState(false);

  const [showShortcuts, setShowShortcuts] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const [records, setrecords] = useState(12);
  const [hasMore, setHasMore] = useState(true);

  const [startTime, setStartTime] = useState(timeOptions[0]);
  const [endTime, setEndTime] = useState(timeOptions[timeOptions.length - 1]);

  const loadMore = () => {
    if (records > filteredCourses.length) {
      setHasMore(false);
    } else {
      setTimeout(() => {
        setrecords(records + 6);
      }, 1000);
    }
  };

  const addCourse = (course) => {
    if (!selectedCourses.includes(course)) {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const removeCourse = (course) => {
    setSelectedCourses(selectedCourses.filter((c) => c.id !== course.id));
  };

  useEffect(() => {
    const usedAttributes = [];
    courses.map((course) => {
      course.sectionAttributes.map((attribute) => {
        if (!usedAttributes.includes(attribute.code)) {
          attributeOptions.push({
            value: attribute.code,
            label: attribute.description,
          });
          usedAttributes.push(attribute.code);
        }
      });
    });
  }, []);

  document.addEventListener("keydown", (e) => {
    console.log(e.key);
    if (e.key === "/") {
      setShowCalendar(!showCalendar);
    } else if (e.key === ".") {
      setShowIntro(!showIntro);
    } else if (e.key === "[") {
      setShowShortcuts(!showShortcuts);
    } else if (e.key === "]") {
      setOpenModal(!openModal);
    } else if (e.key === ";") {
      onCopyClick();
    } else if (e.key === "Escape") {
      setShowShortcuts(false);
    }
  });

  const getBackgroundColor = (course) => {
    //find index of course in selected courses
    const index = selectedCourses.findIndex((c) => c.id === course.id);
    return colors[index % colors.length];
  };

  useEffect(() => {
    console.log(startTime);
    const newFilteredCourses = courses.filter((course) => {
      //business logic in here
      if (onlyOpen && course.seatsAvailable === 0) return false;
      if (onlyGrad && Number(course.courseNumber) > 4999) return false;
      if (onlyGU && Number(course.sequenceNumber) >= 70) return false;
      if (noFriday && course.meetingsFaculty[0]?.meetingTime.friday)
        return false;

      if (
        startTime.value &&
        course.meetingsFaculty.length > 0 &&
        course.meetingsFaculty[0]?.meetingTime.beginTime != null &&
        Number(course.meetingsFaculty[0]?.meetingTime.beginTime) <
          startTime.value
      ) {
        console.log("start time");
        console.log(course.meetingsFaculty[0]?.meetingTime.beginTime);
        return false;
      }

      if (
        endTime.value &&
        course.meetingsFaculty.length > 0 &&
        course.meetingsFaculty[0]?.meetingTime.endTime != null &&
        Number(course.meetingsFaculty[0]?.meetingTime.endTime) > endTime.value
      ) {
        return false;
      }

      if (attributes.length > 0) {
        for (let i = 0; i < attributes.length; i++) {
          console.log(attributes[i]);
          let found = false;
          for (let j = 0; j < course.sectionAttributes.length; j++) {
            if (attributes[i].value === course.sectionAttributes[j].code) {
              found = true;
              break;
            }
          }
          if (!found) {
            return false;
          }
        }
      }

      if (
        !course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !course.subjectCourse
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        !course.courseReferenceNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        !course.faculty[0]?.displayName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
    setFilteredCourses(newFilteredCourses);
    setHasMore(newFilteredCourses.length > records);
  }, [
    searchTerm,
    onlyOpen,
    onlyGrad,
    onlyGU,
    noFriday,
    records,
    attributes,
    startTime,
    endTime,
  ]);

  const expandOptions = () => {
    setOpenModal(!openModal);
  };

  return (
    <div className="App">
      <div className="icons">
        {!showShortcuts && (
          <FaBars
            className="icon-bar"
            onClick={() => setShowShortcuts(!showShortcuts)}
          />
        )}
        {showShortcuts && (
          <div
            className="icon-row"
            onClick={() => setShowShortcuts(!showShortcuts)}>
            <h6 className="keyboard-outline">[</h6>
            <h4>
              <FaArrowRightToBracket />
            </h4>
            <p>Toggle Menu</p>
          </div>
        )}
        {showShortcuts && (
          <div className="icon-row" onClick={() => setOpenModal(true)}>
            <h6 className="keyboard-outline">]</h6>
            <h4>
              <FaSliders />
            </h4>
            <p>Open Settings</p>
          </div>
        )}
        {showShortcuts && (
          <div
            className="icon-row"
            onClick={() => setShowCalendar(!showCalendar)}>
            <h6 className="keyboard-outline">/</h6>
            <h4>
              <FaRegCalendar />
            </h4>
            <p>Toggle Calendar</p>
          </div>
        )}
        {showShortcuts && (
          <div className="icon-row" onClick={() => setShowIntro(!showIntro)}>
            <h6 className="keyboard-outline">.</h6>
            <h4>
              <FaArrowRightToBracket />
            </h4>
            <p>Toggle Intro Screen</p>
          </div>
        )}
        {showShortcuts && (
          <div className="icon-row" onClick={onCopyClick}>
            <h6 className="keyboard-outline">;</h6>
            <h4>
              <FaCopy />
            </h4>
            <p>Copy Your CRNs</p>
          </div>
        )}
      </div>
      {showIntro && <IntroScreen closeModal={() => setShowIntro(false)} />}
      {openModal && (
        <div className="introscreen-bg">
          <div className="options animate__animated animate__zoomInUp animate__fast">
            <h3>Customize your filters</h3>
            <div className="option">
              <p>Show only classes with seats available</p>
              <Toggle
                defaultChecked={onlyOpen}
                className="toggle"
                onChange={() => setOnlyOpen(!onlyOpen)}
              />
            </div>
            <div className="option">
              <p>Show only undergraduate classes</p>
              <Toggle
                defaultChecked={onlyGrad}
                className="toggle"
                onChange={() => setOnlyGrad(!onlyGrad)}
              />
            </div>
            <div className="option">
              <p>Hide Qatar classes</p>
              <Toggle
                defaultChecked={onlyGU}
                className="toggle"
                onChange={() => setOnlyGU(!onlyGU)}
              />
            </div>
            <div className="option">
              <p>Hide Friday classes</p>
              <Toggle
                defaultChecked={noFriday}
                className="toggle"
                onChange={() => setNoFriday(!noFriday)}
              />
            </div>
            <p>Starting no earlier than...</p>
            <Select
              name="start-time"
              options={timeOptions}
              defaultValue={{ label: startTime.label }}
              onChange={(e) => setStartTime(e)}
            />
            <p>Ending no later than...</p>
            <Select
              name="start-time"
              defaultValue={{ label: endTime.label }}
              options={timeOptions}
              onChange={(e) => setEndTime(e)}
            />
            <p>Filter by attribute</p>
            <Select
              isMulti
              name="attributes"
              defaultValue={attributes}
              options={attributeOptions}
              onChange={(e) => setAttributes(e)}
              placeholder="Filter by Attribute"
            />
            <button className="toggle_modal" onClick={expandOptions}>
              Close
            </button>
          </div>
        </div>
      )}
      <div className="container">
        <div className="content">
          <div className="header">
            <a target="_blank" href="https://hoyadevelopers.com">
              <img src="hd-logo.png" alt="logo" />
            </a>

            <h1 onClick={() => setShowIntro(true)}>Georgetown Course Finder</h1>
          </div>
          <h5 className="app-subtitle" onClick={() => setShowCalendar(false)}>
            The best way to find classes you need. Find seats remaining and RMP
            ratings all in one place. Blazingly Fast.
          </h5>
          <div className="searchFields">
            <div className="wrapper-input">
              <input
                type="text"
                className="main-input extra-padding"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Course Title, Instructor, or Code"
              />
              <FaMagnifyingGlass className="input-logo" />
            </div>

            <button className="settings" onClick={expandOptions}>
              <FaSliders />
              <p>More</p>
            </button>
          </div>
          <h2 className="main-subtitle">
            {filteredCourses.length} courses found!
          </h2>
          <InfiniteScroll
            dataLength={records}
            className="courses"
            next={loadMore}
            hasMore={hasMore}
            loader={
              <div className="loader-container">
                <HashLoader loading={true} size={50} className="loader" />
                <p>Loading more classes, hang tight.</p>
              </div>
            }>
            {filteredCourses.slice(0, records).map((course, index) => (
              <Course
                course={course}
                key={course.id}
                func={() => addCourse(course)}
              />
            ))}
          </InfiniteScroll>
        </div>
        {showCalendar && (
          <div className="right animate__animated animate__slideInRight">
            <h4
              className="calendar-close"
              onClick={() => setShowCalendar(false)}></h4>
            <h2>Your Calendar</h2>
            <h4>{getCreditNumber()}</h4>
            <div className="calendar">
              <div className="calendar-day slot-label-column">
                <p>.</p>
                {times.map((time, index) => {
                  if (index % 2 === 0) {
                    return (
                      <div className="calendar-slot slot-label border-top">
                        {(Number(time) / 100) % 12 || 12}
                      </div>
                    );
                  } else {
                    return <div className="calendar-slot slot-label"></div>;
                  }
                })}
              </div>
              {days.map((day) => (
                <div className="calendar-day">
                  <p>Mon</p>
                  {times.map((time, index) => {
                    //if any selected courses have a meeting at this time, display it
                    const coursesAtTime = selectedCourses.filter((course) => {
                      if (course.meetingsFaculty.length > 0) {
                        return (
                          switchDayOfWeek(course, day) &&
                          Number(
                            course.meetingsFaculty[0].meetingTime.beginTime
                          ) <= Number(time) &&
                          Number(
                            course.meetingsFaculty[0].meetingTime.endTime
                          ) > Number(time)
                        );
                      }
                    });
                    if (coursesAtTime.length === 0) {
                      return (
                        <div
                          className={
                            index % 2 === 0
                              ? "calendar-slot slot-empty  border-top"
                              : "calendar-slot slot-empty"
                          }></div>
                      );
                    } else {
                      return (
                        <div
                          className="calendar-slot slot-filled"
                          style={{
                            backgroundColor: getBackgroundColor(
                              coursesAtTime[0]
                            ),
                          }}>
                          {" "}
                          <div className="calendar-tooltip">
                            <h5>{coursesAtTime[0].courseTitle}</h5>
                            <h6>
                              {coursesAtTime[0].subject} -{" "}
                              {coursesAtTime[0].courseNumber}
                            </h6>
                            <h6>
                              {formatMilitaryTime(
                                coursesAtTime[0].meetingsFaculty[0].meetingTime
                                  .beginTime
                              )}{" "}
                              -{" "}
                              {formatMilitaryTime(
                                coursesAtTime[0].meetingsFaculty[0].meetingTime
                                  .endTime
                              )}
                            </h6>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              ))}
            </div>
            <h2>Your Selected Courses</h2>
            <p className="right-subtitle">Click on a course to reomve it.</p>
            <div className="selected-courses">
              {selectedCourses.map((course, index) => (
                <CalendarCourse
                  color={getBackgroundColor(course)}
                  course={course}
                  key={course.id}
                  func={() => removeCourse(course)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

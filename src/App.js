import React from "react";
import { useState, useEffect, useRef } from "react";
import instructors from "./instructors";
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

import descriptions0 from "./descriptions0.json";
import descriptions1 from "./descriptions1.json";
import descriptions2 from "./descriptions2.json";
import descriptions3 from "./descriptions3.json";
import descriptions4 from "./descriptions4.json";
import descriptions5 from "./descriptions5.json";
import descriptions6 from "./descriptions6.json";
import descriptions7 from "./descriptions7.json";
import descriptions8 from "./descriptions8.json";
import descriptions9 from "./descriptions9.json";
import descriptions10 from "./descriptions10.json";
import descriptions11 from "./descriptions11.json";

import prereqs0 from "./prereqs0.json";
import prereqs1 from "./prereqs1.json";
import prereqs2 from "./prereqs2.json";
import prereqs3 from "./prereqs3.json";
import prereqs4 from "./prereqs4.json";
import prereqs5 from "./prereqs5.json";
import prereqs6 from "./prereqs6.json";
import prereqs7 from "./prereqs7.json";
import prereqs8 from "./prereqs8.json";
import prereqs9 from "./prereqs9.json";
import prereqs10 from "./prereqs10.json";
import prereqs11 from "./prereqs11.json";

import InfiniteScroll from "react-infinite-scroll-component";
import { HashLoader } from "react-spinners";
import { inject } from "@vercel/analytics";
//import stuff to do animation on scroll
import "animate.css/animate.min.css";
import { AnimationOnScroll } from "react-animation-on-scroll";
import {
  FaSliders,
  FaRegCalendar,
  FaMagnifyingGlass,
  FaX,
  FaCheck,
  FaExpand,
  FaCopy,
} from "react-icons/fa6";
import Toggle from "react-toggle";
import Select from "react-select";
import IntroScreen from "./IntroScreen";
import useEventListener from "@use-it/event-listener";

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

  //filter out all null courses
  const newData = data.filter((course) => course != null);

  return newData;

  //write certain fields to csv file
};

const mergeDescriptions = () => {
  const data = descriptions0.concat(
    descriptions1,
    descriptions2,
    descriptions3,
    descriptions4,
    descriptions5,
    descriptions6,
    descriptions7,
    descriptions8,
    descriptions9,
    descriptions10,
    descriptions11
  );

  return data;
};

const mergePrereqs = () => {
  const data = prereqs0.concat(
    prereqs1,
    prereqs2,
    prereqs3,
    prereqs4,
    prereqs5,
    prereqs6,
    prereqs7,
    prereqs8,
    prereqs9,
    prereqs10,
    prereqs11
  );

  return data;
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
  const inputRef = useRef(null);
  const attributesRef = useRef(null);

  const [showIntro, setShowIntro] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [preReqStatus, setPreReqStatus] = useState(false);

  const [calendars, setCalendars] = useState(() => {
    const saved = localStorage.getItem("calendars");
    const initialValue = JSON.parse(saved);
    if (initialValue && Object.keys(initialValue)?.length !== 3) {
      return [
        {
          name: "Plan #1",
          courses: [],
        },
        {
          name: "Plan #2",
          courses: [],
        },
        {
          name: "Plan #3",
          courses: [],
        },
      ];
    } else {
      return (
        initialValue || [
          {
            name: "Plan #1",
            courses: [],
          },
          {
            name: "Plan #2",
            courses: [],
          },
          {
            name: "Plan #3",
            courses: [],
          },
        ]
      );
    }
  });
  const [activeCalendar, setActiveCalendar] = useState(0);

  const [hoveredCourseID, setHoveredCourseID] = useState(null);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [attributeOptions, setAttributeOptions] = useState([]);
  const [showCourseAttributes, setShowCourseAttributes] = useState(true);
  const [showCourseInfo, setShowCourseInfo] = useState(true);
  const [showExpandedInfo, setShowExpandedInfo] = useState(0);
  const [preReqOptions, setPreReqOptions] = useState([]);

  const prereqs = mergePrereqs();

  useEffect(() => {
    const expression = getPreqExpression(
      showExpandedInfo.courseReferenceNumber
    );

    if (expression != "N/A") {
      const regex =
        /\(([^()]*(?:\([^()]*\))*)\s+(Or|And)\s+([^()]*(?:\([^()]*\))*)\)/g;

      const variables = [];
      let match;

      while ((match = regex.exec(expression)) !== null) {
        //if not already in variables, add it

        if (!variables.includes(match[1])) {
          variables.push(match[1]);
        }
        if (!variables.includes(match[3])) {
          variables.push(match[3]);
        }
      }

      if (variables) {
        setPreReqOptions(
          variables.map((variable) => {
            //label is the text before Undergarduate or Graduate

            let labelVal = variable;

            if (variable.includes("Undergraduate")) {
              labelVal = variable.replace("Undergraduate D", "");
            }

            return { value: variable, label: labelVal, isChecked: false };
          })
        );
      }
    }
  }, [showExpandedInfo]);

  useEffect(() => {
    //determine if the preqeuisite expression is satisfied
    let expression = getPreqExpression(showExpandedInfo.courseReferenceNumber);

    if (expression != "N/A") {
      for (const i in preReqOptions) {
        const value = preReqOptions[i].isChecked;
        expression = expression.replace(preReqOptions[i].value, value);
      }

      expression = expression.replace(/Or/g, "||");
      expression = expression.replace(/And/g, "&&");

      try {
        // Use eval to evaluate the boolean expression
        const result = eval(expression);

        setPreReqStatus(result);

        // The result will be a boolean value (true or false)
      } catch (error) {
        // Handle any parsing or evaluation errors
        console.error(error);
      }
    }
  }, [preReqOptions]);

  const getPreqExpression = (crn) => {
    const prereq = prereqs.find(
      (prereq) => prereq.courseReferenceNumber === crn
    );
    if (prereq) {
      return prereq.prerequisites;
    } else {
      return "No prerequisites.";
    }
  };

  const times = [];

  for (let hour = 6; hour < 23; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      times.push(formattedHour + formattedMinute);
    }
  }

  console.log(times);

  const colors = [
    "#FFC857",
    "#3ABECF",
    "#F9B9F2",
    "#8089b3",
    "#D64933",
    "#9AC705",
  ];

  const days = ["M", "T", "W", "Th", "F"];

  const descriptions = mergeDescriptions();
  const getCourseDescription = (course) => {
    const description = descriptions.find(
      (desc) => desc.courseReferenceNumber === course
    );
    if (description) {
      return description.description;
    } else {
      return "No description available.";
    }
  };

  const switchDayOfWeek = (courseID, day) => {
    //switch day of week of course
    const course = findCourseByID(courseID);

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

    calendars[activeCalendar].courses.forEach((courseID) => {
      const course = findCourseByID(courseID);

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

  const getCreditNumber = () => {
    //add credit numbers together of selected courses
    let credits = 0;

    calendars[activeCalendar]?.courses.forEach((courseID) => {
      const course = findCourseByID(courseID);

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
  const [filterConflicts, setFilterConflicts] = useState(true);

  const [onlyOpen, setOnlyOpen] = useState(false);
  const [onlyGrad, setOnlyGrad] = useState(false);
  const [onlyGU, setOnlyGU] = useState(true);
  const [noFriday, setNoFriday] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [filterByRating, setFilterByRating] = useState(false);

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

  const addCalendar = (calendar) => {
    setCalendars({
      ...calendars,
      [calendar]: {
        name: `Calendar #${calendar + 1}`,
        courses: [],
      },
    });
  };

  const addCourse = (course) => {
    if (!calendars[activeCalendar].courses.includes(course)) {
      setCalendars({
        ...calendars,
        [activeCalendar]: {
          ...calendars[activeCalendar],
          courses: [...calendars[activeCalendar].courses, course],
        },
      });
      setHoveredCourseID(null);
      setShowCalendar(true);
      setShowExpandedInfo(0);
    }
  };
  const retrieveInstructorRating = (instructor) => {
    const instructorObject = instructors.find(
      (inst) => inst.instructor === instructor
    );
    if (instructorObject && instructorObject.rating !== 0) {
      return instructorObject.rating;
    } else {
      return "N/A";
    }
  };

  const removeCourse = (course) => {
    setCalendars({
      ...calendars,
      [activeCalendar]: {
        ...calendars[activeCalendar],
        courses: calendars[activeCalendar].courses.filter((c) => c !== course),
      },
    });
  };

  //update calendar lcoal storage when calendar changes
  useEffect(() => {
    localStorage.setItem("calendars", JSON.stringify(calendars));
  }, [calendars]);

  useEffect(() => {
    //filter all null couress

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
    //add a professors RMP rating to the course
    courses.forEach((course) => {
      course.rating = calculateCourseRating(course, 0);
      course.ratingPercent = calculateCourseRating(course, 1);
      course.ratingDifficulty = calculateCourseRating(course, 2);
      course.courseTitle = course.courseTitle.replace(/&amp;/g, "&");
      course.courseTitle = course.courseTitle.replace(/&quot;/g, '"');
      course.courseTitle = course.courseTitle.replace(/&apos;/g, "'");
      course.courseTitle = course.courseTitle.replace("&#39;", "'");
    });
  }, []);

  const resetOptions = () => {
    setAttributes([]);
    setOnlyOpen(false);
    setOnlyGrad(false);
    setOnlyGU(false);
    setNoFriday(false);
    setFilterConflicts(false);
    setStartTime(timeOptions[0]);
    setEndTime(timeOptions[timeOptions.length - 1]);
    setSearchTerm("");
  };

  const handleKeyDown = async (e) => {
    //if either inputs are focused, don't do anything

    //if the active element is any of the inputs, don't do anything
    if (document.activeElement.tagName === "INPUT") {
      return;
    }

    if (e.key === "/") {
      setOpenModal(false);
      setShowIntro(false);
      e.preventDefault();
      inputRef.current.focus();
    } else if (e.key === "?") {
      setShowIntro(!showIntro);
    } else if (e.key === " ") {
      e.preventDefault();
      if (showExpandedInfo !== 0) {
        setShowExpandedInfo(0);
      } else {
        setOpenModal(!openModal);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (!openModal) {
        setShowCalendar(!showCalendar);
      } else {
        setOpenModal(false);
      }
    } else if (e.key === ";") {
      onCopyClick();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpenModal(false);
      setShowIntro(false);
      setShowExpandedInfo(0);
      inputRef.current.blur();
    } else if (e.key === "a") {
      e.preventDefault();
      await setOpenModal(true);
      attributesRef.current.focus();
    } else if (e.key === "r") {
      setOnlyOpen(!onlyOpen);
    } else if (e.key === "`") {
      setFilterByRating(!filterByRating);
    } else if (e.key === "q") {
      setOnlyGU(!onlyGU);
    } else if (e.key === "u") {
      setOnlyGrad(!onlyGrad);
    } else if (e.key === "f") {
      setNoFriday(!noFriday);
    } else if (e.key === "i") {
      setShowCourseInfo(!showCourseInfo);
    } else if (e.key === "p") {
      setShowCourseAttributes(!showCourseAttributes);
    } else if (e.key === "c") {
      setFilterConflicts(!filterConflicts);
    } else if (e.key === "-") {
      const i = timeOptions.findIndex((time) => time.value === startTime.value);

      if (i !== 0) {
        setStartTime(timeOptions[i - 1]);
      }
    } else if (e.key === "=") {
      const i = timeOptions.findIndex((time) => time.value === startTime.value);

      if (i !== timeOptions.length - 1) {
        setStartTime(timeOptions[i + 1]);
      }
    } else if (e.key === "[") {
      const i = timeOptions.findIndex((time) => time.value === endTime.value);

      if (i !== 0) {
        setEndTime(timeOptions[i - 1]);
      }
    } else if (e.key === "]") {
      const i = timeOptions.findIndex((time) => time.value === endTime.value);

      if (i !== timeOptions.length - 1) {
        setEndTime(timeOptions[i + 1]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      //reset all filters
      resetOptions();
    }
  };
  const calculateCourseRating = (course, item) => {
    const instructorIndex = instructors.findIndex(
      (inst) => inst.instructor === course?.faculty[0]?.displayName
    );

    if (instructorIndex !== -1) {
      if (item === 0) {
        return instructors[instructorIndex].rating;
      } else if (item === 1) {
        return instructors[instructorIndex].percent;
      } else if (item === 2) {
        return instructors[instructorIndex].difficulty;
      }
    } else {
      return "N/A";
    }
  };

  const findCourseByID = (id) => {
    return courses.find((course) => course.id === id);
  };

  const getBackgroundColor = (course) => {
    //find index of course in selected courses
    const index = calendars[activeCalendar].courses.findIndex(
      (c) => c === course
    );
    return colors[index % colors.length];
  };

  useEffect(() => {
    const newFilteredCourses = courses.filter((course) => {
      //business logic in here
      if (onlyOpen && course.seatsAvailable === 0) return false;
      if (onlyGrad && Number(course.courseNumber) > 4999) return false;
      if (onlyGU && Number(course.sequenceNumber) >= 70) return false;

      //filter out courses with schedule conflicts
      if (filterConflicts) {
        let conflict = false;

        calendars[activeCalendar].courses.forEach((selectedCourseID) => {
          const selectedCourse = findCourseByID(selectedCourseID);
          if (
            selectedCourse?.meetingsFaculty.length > 0 &&
            course.meetingsFaculty.length > 0
          ) {
            if (
              (selectedCourse.meetingsFaculty[0].meetingTime.monday &&
                course.meetingsFaculty[0].meetingTime.monday) ||
              (selectedCourse.meetingsFaculty[0].meetingTime.tuesday &&
                course.meetingsFaculty[0].meetingTime.tuesday) ||
              (selectedCourse.meetingsFaculty[0].meetingTime.wednesday &&
                course.meetingsFaculty[0].meetingTime.wednesday) ||
              (selectedCourse.meetingsFaculty[0].meetingTime.thursday &&
                course.meetingsFaculty[0].meetingTime.thursday) ||
              (selectedCourse.meetingsFaculty[0].meetingTime.friday &&
                course.meetingsFaculty[0].meetingTime.friday)
            ) {
              if (
                Number(
                  course.meetingsFaculty[0].meetingTime.beginTime >=
                    Number(
                      selectedCourse.meetingsFaculty[0].meetingTime.beginTime
                    ) &&
                    Number(course.meetingsFaculty[0].meetingTime.beginTime) <=
                      Number(
                        selectedCourse.meetingsFaculty[0].meetingTime.endTime
                      )
                ) ||
                (Number(course.meetingsFaculty[0].meetingTime.endTime) >=
                  Number(
                    selectedCourse.meetingsFaculty[0].meetingTime.beginTime
                  ) &&
                  Number(course.meetingsFaculty[0].meetingTime.endTime) <=
                    Number(
                      selectedCourse.meetingsFaculty[0].meetingTime.endTime
                    ))
              ) {
                conflict = true;
              }
            }
          }
        });
        if (conflict) return false;
      }

      if (noFriday && course.meetingsFaculty[0]?.meetingTime.friday)
        return false;

      if (
        startTime.value &&
        course.meetingsFaculty.length > 0 &&
        course.meetingsFaculty[0]?.meetingTime.beginTime != null &&
        Number(course.meetingsFaculty[0]?.meetingTime.beginTime) <
          startTime.value
      ) {
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
        let hasAttribute = false;
        for (let i = 0; i < attributes.length; i++) {
          for (let j = 0; j < course.sectionAttributes.length; j++) {
            if (attributes[i].value === course.sectionAttributes[j].code) {
              hasAttribute = true;
              break;
            }
          }
        }
        if (!hasAttribute) return false;
      }

      if (
        !course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !course.subjectCourse
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        !course.subjectCourse
          .toLowerCase()
          .includes(searchTerm.toLowerCase().replace(/\s+/g, "")) &&
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

    if (filterByRating) {
      newFilteredCourses.sort((a, b) => {
        return b.rating - a.rating;
      });
    }

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
    filterConflicts,
    calendars,
    filterByRating,
    activeCalendar,
  ]);

  useEventListener("keydown", handleKeyDown);

  const expandOptions = () => {
    setOpenModal(!openModal);
  };

  const showInfoFunc = (course) => {
    setShowExpandedInfo(course);
  };

  const getTimeString = (course) => {
    let str = "";
    let empty = false;
    for (let i = 0; i < course.meetingsFaculty.length; i++) {
      if (course.meetingsFaculty[i].meetingTime.beginTime == "") {
        empty = true;
      }
      str +=
        formatTimeFromMilitary(
          course.meetingsFaculty[i].meetingTime.beginTime
        ) +
        " - " +
        formatTimeFromMilitary(course.meetingsFaculty[i].meetingTime.endTime);
      if (i < course.meetingsFaculty.length - 1) {
        str += ", ";
      }
    }
    if (str.length == 0 || str == " - " || empty) {
      str = "TBA";
    }
    return str;
  };

  const formatTimeFromMilitary = (time) => {
    if (!time) {
      return "";
    }
    const hour = time.substring(0, 2);
    const minute = time.substring(2, 4);
    const formattedHour = hour % 12 || 12;
    const ampm = hour < 12 ? "AM" : "PM";
    return formattedHour + ":" + minute + " " + ampm;
  };

  const formatDaysString = (course) => {
    let str = "";
    for (let i = 0; i < course.meetingsFaculty.length; i++) {
      if (course.meetingsFaculty[i].meetingTime.monday) {
        str += "M";
      }
      if (course.meetingsFaculty[i].meetingTime.tuesday) {
        str += "T";
      }
      if (course.meetingsFaculty[i].meetingTime.wednesday) {
        str += "W";
      }
      if (course.meetingsFaculty[i].meetingTime.thursday) {
        str += "Th";
      }
      if (course.meetingsFaculty[i].meetingTime.friday) {
        str += "F";
      }
      if (i < course.meetingsFaculty.length - 1) {
        str += ", ";
      }
    }

    if (str.length == 0) {
      str = "TBA";
    }

    return str;
  };

  const getCreditHours = (course) => {
    if (course.creditHours != null) {
      return course.creditHours + " Credits";
    } else if (course.creditHourHigh != null) {
      return course.creditHourHigh + " Credits";
    } else if (course.creditHourLow != null) {
      return course.creditHourLow + " Credits";
    } else {
      return "TBA";
    }
  };

  return (
    <div className="app dark">
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="mobile-calendar">
        <FaRegCalendar />
        <p>{showCalendar ? "Hide" : "Show"}</p>
      </button>
      {showIntro && <IntroScreen closeModal={() => setShowIntro(false)} />}
      {showExpandedInfo !== 0 && (
        <div className="introscreen-bg">
          <div className="options animate__animated animate__fadeIn animate__faster">
            <div className="options-header">
              <h2>{showExpandedInfo.courseTitle}</h2>
              <h6 className="keyboard-outline">ESC</h6>
              <p>or</p>
              <h6 className="keyboard-outline">Space</h6>
            </div>
            <p className="app-settings-subtitle">
              {showExpandedInfo.subject}-{showExpandedInfo.courseNumber}
            </p>
            <h6 className="options-expanded-header">Basic Info</h6>
            <div className="course-icons-expanded">
              <div className="course-icon">
                <img src="/icons/instructor.svg" alt="instructor" />

                <a
                  target="_blank"
                  href={
                    "https://gufaculty360.georgetown.edu/s/global-search?searchText=" +
                    encodeURIComponent(showExpandedInfo.faculty[0]?.displayName)
                  }>
                  {showExpandedInfo.faculty.length > 0
                    ? showExpandedInfo.faculty[0].displayName
                    : "Not Available"}
                </a>
              </div>
              <div className="course-icon">
                <img src="/icons/seats.svg" alt="Seats" />

                <p>
                  <span className="large-text">
                    {showExpandedInfo.seatsAvailable}
                  </span>
                  <span className="small-text">
                    {"/" + showExpandedInfo.maximumEnrollment}{" "}
                  </span>
                  Left
                </p>
                <p>
                  <span className="large-text">
                    {showExpandedInfo.waitAvailable}
                  </span>
                  <span className="small-text">
                    {"/" + showExpandedInfo.waitCapacity}{" "}
                  </span>
                  WL
                </p>
              </div>
              <div className="course-icon">
                <img src="/icons/location.svg" alt="location" />
                <p>
                  {showExpandedInfo.meetingsFaculty.length > 0 &&
                  showExpandedInfo.meetingsFaculty[0].meetingTime.building
                    ? showExpandedInfo.meetingsFaculty[0].meetingTime.building +
                      "-" +
                      showExpandedInfo.meetingsFaculty[0].meetingTime.room
                    : "TBA"}
                </p>
              </div>

              <div className="course-icon">
                <img src="/icons/star.svg" alt="rating" />
                <a
                  target="_blank"
                  href={
                    "https://www.ratemyprofessors.com/search/professors/355?q=" +
                    encodeURIComponent(showExpandedInfo.faculty[0]?.displayName)
                  }>
                  {showExpandedInfo.faculty.length > 0
                    ? showExpandedInfo.rating
                    : "N/A"}

                  {showExpandedInfo.rating !== "N/A" &&
                    showExpandedInfo.rating >= 4 && (
                      <div className="color-circle-green"></div>
                    )}
                  {showExpandedInfo.rating !== "N/A" &&
                    showExpandedInfo.rating < 4 &&
                    showExpandedInfo.rating >= 3 && (
                      <div className="color-circle-yellow"></div>
                    )}
                  {showExpandedInfo.rating !== "N/A" &&
                    showExpandedInfo.rating < 3 && (
                      <div className="color-circle-red"></div>
                    )}
                </a>
              </div>
              <div className="course-icon">
                <img src="/icons/star.svg" alt="rating" />
                <a
                  target="_blank"
                  href={
                    "https://www.ratemyprofessors.com/search/professors/355?q=" +
                    encodeURIComponent(showExpandedInfo.faculty[0]?.displayName)
                  }>
                  {showExpandedInfo.faculty.length > 0
                    ? showExpandedInfo.ratingDifficulty + " Difficulty"
                    : "N/A Difficulty"}

                  {showExpandedInfo.rating !== "N/A" &&
                    showExpandedInfo.ratingDifficulty < 2.5 && (
                      <div className="color-circle-green"></div>
                    )}
                  {showExpandedInfo.rating !== "N/A" &&
                    showExpandedInfo.rating < 4 &&
                    showExpandedInfo.ratingDifficulty >= 2.5 && (
                      <div className="color-circle-yellow"></div>
                    )}
                  {showExpandedInfo.rating !== "N/A" &&
                    showExpandedInfo.ratingDifficulty > 4 && (
                      <div className="color-circle-red"></div>
                    )}
                </a>
              </div>
              <div className="course-icon">
                <img src="/icons/star.svg" alt="rating" />
                <a
                  target="_blank"
                  href={
                    "https://www.ratemyprofessors.com/search/professors/355?q=" +
                    encodeURIComponent(showExpandedInfo.faculty[0]?.displayName)
                  }>
                  {showExpandedInfo.faculty.length > 0
                    ? showExpandedInfo.ratingPercent + " Would Take Again"
                    : "N/A"}
                </a>
              </div>

              <div className="course-icon">
                <img src="/icons/time.svg" alt="time" />
                <p>{getTimeString(showExpandedInfo)}</p>
              </div>
              <div className="course-icon">
                <img src="/icons/days.svg" alt="Days" />
                <p>{formatDaysString(showExpandedInfo)}</p>
              </div>
              <div className="course-icon">
                <img src="/icons/fast.svg" alt="time" />
                <p>{getCreditHours(showExpandedInfo)}</p>
              </div>
            </div>
            <div className="course-attributes">
              {showExpandedInfo.sectionAttributes.length > 0 &&
                showExpandedInfo.sectionAttributes.map((attribute) => {
                  if (attribute.code != "MEAN") {
                    return (
                      <p className="course-attribute">
                        {attribute.description}
                      </p>
                    );
                  }
                })}
            </div>
            <h6 className="options-expanded-header">Course Description</h6>
            <p>
              {getCourseDescription(showExpandedInfo.courseReferenceNumber)}
            </p>
            <h6 className="options-expanded-header">Prerequisites</h6>
            <p>{getPreqExpression(showExpandedInfo.courseReferenceNumber)}</p>
            {preReqOptions.length > 0 && (
              <div>
                <h6 className="options-expanded-header">
                  Prerequisites Checker
                </h6>
                <p>
                  We get it can be confusing to read that. Select which classes
                  you've already taken to see if you can take this one.
                </p>
              </div>
            )}
            {preReqOptions.length > 0 && (
              <div className="options-preq-selectors">
                {preReqOptions.length > 0 ? (
                  preReqOptions.map((option) => {
                    return (
                      <div className="options-preq-selector">
                        <label class="custom-checkbox-container">
                          <input
                            type="checkbox"
                            id={option.value}
                            name={option.value}
                            value={option.isChecked}
                            onChange={() => {
                              const newOptions = preReqOptions.map((o) => {
                                if (o.value === option.value) {
                                  return {
                                    ...o,
                                    isChecked: !o.isChecked,
                                  };
                                } else {
                                  return o;
                                }
                              });
                              setPreReqOptions(newOptions);
                            }}
                          />
                          <span class="checkmark"></span>
                        </label>

                        <p>{option.label}</p>
                      </div>
                    );
                  })
                ) : (
                  <p>No Prerequisites</p>
                )}
              </div>
            )}

            {preReqOptions.length > 0 && (
              <div className="options-preq-checker-status">
                <p className="options-preq-checker-label">Status:</p>
                <span className={!preReqStatus ? "red-bg" : "green-bg"}>
                  <p className="options-expanded-status">
                    {preReqStatus ? "Eligble!" : "Ineligble"}
                  </p>
                  {preReqStatus ? <FaCheck /> : <FaX />}
                </span>
              </div>
            )}

            <div className="options-expanded-buttons">
              <button
                className="options-expanded-button-close"
                onClick={() => setShowExpandedInfo(0)}>
                Close
              </button>
              <button
                className="options-expanded-button-add"
                onClick={() => addCourse(showExpandedInfo.id)}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      {openModal && (
        <div className="introscreen-bg">
          <div className="options animate__animated animate__fadeIn animate__faster">
            <div className="options-header">
              <h2>Search Filters</h2>
              <h6 className="keyboard-outline">ESC</h6>
              <p>or</p>
              <h6 className="keyboard-outline">Space</h6>
            </div>
            <p className="app-settings-subtitle">
              Thoughtfully designed to make your experience seamless.
            </p>

            <div className="options-content">
              <div className="options-content-left">
                <h3>Your Search Settings</h3>
                <div className="option">
                  <h6 className="keyboard-outline">R</h6>
                  <p>Show only classes with seats available</p>
                  <Toggle
                    checked={onlyOpen}
                    className="toggle"
                    onChange={() => setOnlyOpen(!onlyOpen)}
                  />
                </div>
                <div className="option">
                  <h6 className="keyboard-outline">U</h6>
                  <p>Show only undergraduate classes</p>
                  <Toggle
                    checked={onlyGrad}
                    className="toggle"
                    onChange={() => setOnlyGrad(!onlyGrad)}
                  />
                </div>
                <div className="option">
                  <h6 className="keyboard-outline">C</h6>
                  <p>Hide classes with schedule conflict</p>
                  <Toggle
                    checked={filterConflicts}
                    className="toggle"
                    onChange={() => setFilterConflicts(!filterConflicts)}
                  />
                </div>
                <div className="option">
                  <h6 className="keyboard-outline">Q</h6>
                  <p>Hide Qatar classes</p>
                  <Toggle
                    checked={onlyGU}
                    className="toggle"
                    onChange={() => setOnlyGU(!onlyGU)}
                  />
                </div>
                <div className="option">
                  <h6 className="keyboard-outline">F</h6>
                  <p>Hide Friday classes</p>
                  <Toggle
                    checked={noFriday}
                    className="toggle"
                    onChange={() => setNoFriday(!noFriday)}
                  />
                </div>
                <div className="option">
                  <h6 className="keyboard-outline">`</h6>
                  <p>Sort by RMP Rating</p>
                  <Toggle
                    checked={filterByRating}
                    className="toggle"
                    onChange={() => setFilterByRating(!filterByRating)}
                  />
                </div>
                <div className="option">
                  <h6 className="keyboard-outline">I</h6>
                  <p>Show Course Info</p>
                  <Toggle
                    checked={showCourseInfo}
                    className="toggle"
                    onChange={() => setShowCourseInfo(!showCourseInfo)}
                  />
                </div>
                <div className="option">
                  <h6 className="keyboard-outline">P</h6>
                  <p>Show Course Attributes</p>
                  <Toggle
                    checked={showCourseAttributes}
                    className="toggle"
                    onChange={() =>
                      setShowCourseAttributes(!showCourseAttributes)
                    }
                  />
                </div>

                <h5>Filter by attribute</h5>
                <div className="option">
                  <Select
                    isMulti
                    name="attributes"
                    defaultValue={attributes}
                    className="time-select"
                    options={attributeOptions}
                    onChange={(e) => setAttributes(e)}
                    placeholder="Filter by Attribute"
                    ref={attributesRef}
                  />
                </div>
                <div className="time-options">
                  <h5>Class starts after...</h5>
                  <h5>Class ends before...</h5>
                  <div className="option">
                    <Select
                      name="start-time"
                      options={timeOptions}
                      value={{ label: startTime.label }}
                      className="time-select"
                      onChange={(e) => setStartTime(e)}
                    />
                  </div>

                  <div className="option">
                    <Select
                      name="end-time"
                      value={{ label: endTime.label }}
                      className="time-select"
                      options={timeOptions}
                      onChange={(e) => setEndTime(e)}
                    />
                  </div>
                </div>
              </div>
              <div className="options-content-right">
                <h3>All Keyboard Shortcuts</h3>

                <div className="option">
                  <h6 className="keyboard-outline">Space</h6>
                  <p>Open Menu</p>
                </div>
                <div className="option">
                  <h6 className="keyboard-outline">Enter</h6>
                  <p>Toggle Calendar</p>
                </div>
                <div className="option">
                  <h6 className="keyboard-outline">Tab</h6>
                  <p>Reset all filters</p>
                </div>
                <div className="option">
                  <h6 className="keyboard-outline">/</h6>
                  <p>Search for class</p>
                </div>

                <div className="option">
                  <h6 className="keyboard-outline">Escape</h6>
                  <p>Unfocus search</p>
                </div>

                <div className="option">
                  <h6 className="keyboard-outline">A</h6>
                  <p>Add attribute filter</p>
                </div>
                <div className="option">
                  <h6 className="keyboard-outline">?</h6>
                  <p>Toggle Intro Screen</p>
                </div>
                <div className="option">
                  <h6 className="keyboard-outline">-</h6>
                  <h6 className="keyboard-outline">=</h6>
                  <p>Change start time filter</p>
                </div>
                <div className="option">
                  <h6 className="keyboard-outline">[</h6>
                  <h6 className="keyboard-outline">]</h6>
                  <p>Change end time filter</p>
                </div>
              </div>
            </div>
            <button className="option-button" onClick={expandOptions}>
              Close
            </button>
          </div>
        </div>
      )}
      <div className="container">
        <div className="content">
          <div className="header">
            <h1 onClick={() => setShowIntro(true)}>Hoya Courses</h1>
          </div>
          <h5 className="app-subtitle" onClick={() => setShowCalendar(false)}>
            The best way to find classes at Georgetown. Built for students.
          </h5>
          <div className="searchFields">
            <div className="wrapper-input">
              <input
                type="text"
                className="main-input extra-padding"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  e.key === "Escape" && inputRef.current.blur();
                }}
                placeholder="Search by Course Title, Instructor, or Code"
                ref={inputRef}
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
                <HashLoader
                  loading={true}
                  size={50}
                  className="loader"
                  color="#aaa"
                />
                <p>Loading more classes, hang tight.</p>
              </div>
            }>
            {filteredCourses.slice(0, records).map((course, index) => (
              <Course
                course={course}
                key={course.id}
                showInfo={showInfoFunc}
                showInfoToggle={showCourseInfo}
                func={() => addCourse(course.id)}
                hoverFunc={() => setHoveredCourseID(course.id)}
                unhoverFunc={() => setHoveredCourseID(null)}
                showAttributes={showCourseAttributes}
              />
            ))}
          </InfiniteScroll>
          {filteredCourses.length === 0 && (
            <div className="no-results">
              <h2>Whoops, no classes found.</h2>
              <p>Check your search for typos, or expand your search filters.</p>
              <div className="no-results-content">
                <h6 className="keyboard-outline">Tab</h6>
                <h6>Reset all filters</h6>
              </div>
            </div>
          )}
        </div>
        {showCalendar && (
          <div className="right animate__animated animate__slideInRight animate__faster">
            <h4
              className="calendar-close"
              onClick={() => setShowCalendar(false)}></h4>
            <div className="calendar-header">
              <h2>Your Schedules</h2>
              <button className="calendar-copy" onClick={onCopyClick}>
                <p>Copy CRNs</p>
                <FaCopy />
              </button>
            </div>
            <div className="calendar-list">
              {Object.keys(calendars).map((calendar, index) => (
                <div
                  className={`calendar-item ${
                    activeCalendar === index ? "active-calendar" : ""
                  }`}
                  onClick={() => setActiveCalendar(index)}>
                  <h6>{calendars[calendar].name}</h6>
                  <p>{calendars[calendar].courses.length} courses</p>
                </div>
              ))}
            </div>
            <div className="calendar-list"></div>
            <h4>{getCreditNumber()}</h4>
            <div className="calendar">
              <div className="calendar-day slot-label-column">
                <p>.</p>
                {times.map((time, index) => {
                  if (index % 12 === 0) {
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
                  <p>{day}</p>
                  {times.map((time, index) => {
                    let hover = false;
                    //if any selected courses have a meeting at this time, display it

                    const coursesAtTime = calendars[
                      activeCalendar
                    ].courses.filter((courseID) => {
                      const course = findCourseByID(courseID);

                      if (course.meetingsFaculty.length > 0) {
                        return (
                          switchDayOfWeek(courseID, day) &&
                          Number(
                            course.meetingsFaculty[0].meetingTime.beginTime
                          ) <= Number(time) &&
                          Number(
                            course.meetingsFaculty[0].meetingTime.endTime
                          ) > Number(time)
                        );
                      }
                    });

                    if (hoveredCourseID) {
                      const hoveredCourse = findCourseByID(hoveredCourseID);

                      if (hoveredCourse?.meetingsFaculty.length > 0) {
                        hover =
                          switchDayOfWeek(hoveredCourseID, day) &&
                          Number(
                            hoveredCourse.meetingsFaculty[0].meetingTime
                              .beginTime
                          ) <= Number(time) &&
                          Number(
                            hoveredCourse.meetingsFaculty[0].meetingTime.endTime
                          ) > Number(time);
                      }
                    }

                    if (hover) {
                      return (
                        <div
                          className={
                            index % 12 === 0
                              ? "calendar-slot slot-filled  border-top"
                              : "calendar-slot slot-filled"
                          }
                          style={{
                            backgroundColor: "#e1e1e1",
                          }}></div>
                      );
                    } else if (coursesAtTime.length === 0) {
                      return (
                        <div
                          className={
                            index % 12 === 0
                              ? "calendar-slot slot-empty  border-top"
                              : "calendar-slot slot-empty"
                          }></div>
                      );
                    } else {
                      return (
                        <div
                          className={
                            index % 12 === 0
                              ? "calendar-slot slot-filled  border-top"
                              : "calendar-slot slot-filled"
                          }
                          style={{
                            backgroundColor: getBackgroundColor(
                              coursesAtTime[0]
                            ),
                            borderColor: getBackgroundColor(coursesAtTime[0]),
                          }}>
                          {" "}
                          <div className="calendar-tooltip">
                            <h5>
                              {findCourseByID(coursesAtTime[0]).courseTitle}
                            </h5>
                            <h6>
                              {findCourseByID(coursesAtTime[0]).subject} -{" "}
                              {findCourseByID(coursesAtTime[0]).courseNumber}
                            </h6>
                            <h6>
                              {formatMilitaryTime(
                                findCourseByID(coursesAtTime[0])
                                  .meetingsFaculty[0].meetingTime.beginTime
                              )}{" "}
                              -{" "}
                              {formatMilitaryTime(
                                findCourseByID(coursesAtTime[0])
                                  .meetingsFaculty[0].meetingTime.endTime
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
            <h2>{calendars[activeCalendar].name}'s Courses</h2>
            <p className="right-subtitle">
              Click a course to remove it from this plan.
            </p>
            <div className="selected-courses">
              {calendars[activeCalendar].courses.map((course, index) => (
                <CalendarCourse
                  color={getBackgroundColor(course)}
                  course={findCourseByID(course)}
                  key={course}
                  func={() => removeCourse(course)}
                />
              ))}
            </div>
            {calendars[activeCalendar].courses.length === 0 && (
              <div className="empty-calendar">
                <p>
                  No courses added yet. Click on a course to add it to this
                  plan.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

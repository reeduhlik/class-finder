import React from "react";
import { useState, useEffect, useRef } from "react";

import InfiniteScroll from "react-infinite-scroll-component";
import { HashLoader } from "react-spinners";
import { inject } from "@vercel/analytics";
import "animate.css/animate.min.css";
import { FaSliders, FaRegCalendar, FaMagnifyingGlass } from "react-icons/fa6";
import useEventListener from "@use-it/event-listener";

import { courseData } from "./courseData";
import instructors from "./instructors";

import "./App.css";

import ExpandedView from "./ExpandedView";
import Settings from "./Settings";
import CalendarView from "./CalendarView";
import Course from "./Course";
import IntroScreen from "./IntroScreen";

//colors used in the calendar view for each course
const colors = [
  "#FFC857",
  "#3ABECF",
  "#F9B9F2",
  "#8089b3",
  "#D64933",
  "#9AC705",
];

const days = ["M", "T", "W", "Th", "F"];

//times used in the calendar view
const times = [];

//options for the time filter
const timeOptions = [];

//generate all times from 6:00 AM to 11:55 PM in 5 minute intervals
for (let hour = 6; hour < 23; hour++) {
  for (let minute = 0; minute < 60; minute += 5) {
    const formattedHour = hour.toString().padStart(2, "0");
    const formattedMinute = minute.toString().padStart(2, "0");
    times.push(formattedHour + formattedMinute);

    if (formattedMinute % 15 === 0) {
      timeOptions.push({
        value: Number(formattedHour + formattedMinute),
        label:
          formattedHour +
          ":" +
          formattedMinute +
          " " +
          (hour < 12 ? "AM" : "PM"),
      });
    }
  }
}

const App = () => {
  //inject vercel analytics
  inject();

  //get data from courseData.js
  const courses = courseData;

  const inputRef = useRef(null);
  const attributesRef = useRef(null);

  //options for user to toggle on and off when looking at courses
  const [showCourseAttributes, setShowCourseAttributes] = useState(true);
  const [showCourseInfo, setShowCourseInfo] = useState(true);

  //default show the intro modal
  const [showIntro, setShowIntro] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState(0);

  //reflects if the user is eligble for a class based on the pre-requisites selected

  //loads the users calendars from local storage
  const [calendars, setCalendars] = useState(() => {
    const localCalendars = localStorage.getItem("calendars");

    const savedCalendars = JSON.parse(localCalendars);

    const currentPeriod = localStorage.getItem("currentPeriod");

    if (currentPeriod && currentPeriod === "F24") {
      return (
        savedCalendars || [
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
    } else {
      //set the current period to F24 and return the default calendars
      localStorage.setItem("currentPeriod", "F24");
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
    }
  });

  const [activeCalendar, setActiveCalendar] = useState(0);
  const [hoveredCourseID, setHoveredCourseID] = useState(null);

  const [filteredCourses, setFilteredCourses] = useState([]);

  //determined by traversing through all courses and finding unique attributes
  const [attributeOptions, setAttributeOptions] = useState([]);

  //Variables that a user can filter by
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [onlyGrad, setOnlyGrad] = useState(false);
  const [onlyGU, setOnlyGU] = useState(true);
  const [noFriday, setNoFriday] = useState(false);
  const [filterByRating, setFilterByRating] = useState(false);
  const [filterConflicts, setFilterConflicts] = useState(true);
  const [attributesToFilter, setAttributesToFilter] = useState([]);
  const [startTime, setStartTime] = useState(timeOptions[0]);
  const [endTime, setEndTime] = useState(timeOptions[timeOptions.length - 1]);

  const [numberOfCoursesRendered, setNumberOfCoursesRendered] = useState(12);
  const [hasMore, setHasMore] = useState(true);

  //calculates the total number of credits in the active calendar
  const getCreditNumber = () => {
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

  //returns the meeting time of a course on a specific day
  const switchDayOfWeek = (courseID, day) => {
    const course = findCourseByID(courseID);

    if (day === "M") {
      return course.meetingsFaculty[0].meetingTime.monday;
    } else if (day === "T") {
      return course.meetingsFaculty[0].meetingTime.tuesday;
    } else if (day === "W") {
      return course.meetingsFaculty[0].meetingTime.wednesday;
    } else if (day === "Th") {
      return course.meetingsFaculty[0].meetingTime.thursday;
    } else {
      return course.meetingsFaculty[0].meetingTime.friday;
    }
  };

  //returns course object based on course ID
  const findCourseByID = (id) => {
    return courses.find((course) => course.id === id);
  };

  //returns background color of course in active calendar
  const getBackgroundColor = (course) => {
    //find index of course in selected courses
    const index = calendars[activeCalendar].courses.findIndex(
      (c) => c === course,
    );
    return colors[index % colors.length];
  };

  //copy all crns of selected courses to clipboard
  const onCopyClick = () => {
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

  //when the user gets to the bottom of the infinite scroll, load more courses
  const loadMore = () => {
    if (numberOfCoursesRendered > filteredCourses.length) {
      setHasMore(false);
    } else {
      setNumberOfCoursesRendered(numberOfCoursesRendered + 6);
    }
  };

  //adds the selected course to the active calendar
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
      setExpandedCourse(0);
    }
  };

  //removes the selected course from the active calendar
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

  //on page load, generate all possible attribute options from the courses and merge the instructor data into the course object
  useEffect(() => {
    const usedAttributes = [];

    courses.map((course) => {
      course.sectionAttributes.map((attribute) => {
        if (!usedAttributes.includes(attribute.code)) {
          //add attribute to attribute options
          setAttributeOptions((attributeOptions) => [
            ...attributeOptions,
            { value: attribute.code, label: attribute.description },
          ]);
          usedAttributes.push(attribute.code);
        }
      });
    });

    //clean up course data
    courses.forEach((course) => {
      //add RMP rating to course object
      course.rating = calculateCourseRating(course, 0);
      course.ratingPercent = calculateCourseRating(course, 1);
      course.ratingDifficulty = calculateCourseRating(course, 2);

      //format course title
      course.courseTitle = course.courseTitle.replace(/&amp;/g, "&");
      course.courseTitle = course.courseTitle.replace(/&quot;/g, '"');
      course.courseTitle = course.courseTitle.replace(/&apos;/g, "'");
      course.courseTitle = course.courseTitle.replace("&#39;", "'");
    });

    console.log(calendars);
  }, [courses]);

  //when a user clicks TAB, reset all filters
  const resetOptions = () => {
    setAttributesToFilter([]);
    setOnlyOpen(false);
    setOnlyGrad(false);
    setOnlyGU(false);
    setNoFriday(false);
    setFilterConflicts(false);
    setStartTime(timeOptions[0]);
    setEndTime(timeOptions[timeOptions.length - 1]);
    setSearchTerm("");
  };

  //find index of course in instructor array based on instructor name
  const calculateCourseRating = (course, item) => {
    const instructorIndex = instructors.findIndex(
      (inst) => inst.instructor === course?.faculty[0]?.displayName,
    );

    if (instructorIndex !== -1) {
      if (item === 0) {
        return instructors[instructorIndex].rating;
      } else if (item === 1) {
        return instructors[instructorIndex].percent;
      } else {
        return instructors[instructorIndex].difficulty;
      }
    } else {
      //if instructor not found, return 0
      return 0;
    }
  };

  //Main controller for keyboard shortcuts
  const handleKeyDown = async (e) => {
    //if the active element is any of the inputs, don't do anything
    if (document.activeElement.tagName === "INPUT") {
      return;
    }

    if (e.key === "/") {
      setOpenSettingsModal(false);
      setShowIntro(false);
      e.preventDefault();
      inputRef.current.focus();
    } else if (e.key === "?") {
      setShowIntro(!showIntro);
    } else if (e.key === " ") {
      e.preventDefault();
      if (expandedCourse !== 0) {
        setExpandedCourse(0);
      } else {
        setOpenSettingsModal(!openSettingsModal);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (!openSettingsModal) {
        setShowCalendar(!showCalendar);
      } else {
        setOpenSettingsModal(false);
      }
    } else if (e.key === ";") {
      onCopyClick();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpenSettingsModal(false);
      setShowIntro(false);
      setExpandedCourse(0);
      inputRef.current.blur();
    } else if (e.key === "a") {
      e.preventDefault();
      await setOpenSettingsModal(true);
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

  //Main controller for filtering courses
  useEffect(() => {
    const newFilteredCourses = courses.filter((course) => {
      //if the course is full and the user has selected to only show open courses, return false
      if (onlyOpen && course.seatsAvailable === 0) return false;

      //if the user has selected to only show undergraduate courses, and it is a grad course, return false
      if (onlyGrad && Number(course.courseNumber) > 4999) return false;

      //if the user wants to filter out Qatar campus courses, and it is a Qatar campus course, return false
      if (onlyGU && Number(course.sequenceNumber) >= 70) return false;

      //if the user wants to filter out courses on Friday, and the course is on Friday, return false
      if (noFriday && course.meetingsFaculty[0]?.meetingTime.friday)
        return false;

      //filter out courses with schedule conflicts
      if (filterConflicts) {
        let conflict = false;

        calendars[activeCalendar].courses.forEach((selectedCourseID) => {
          const selectedCourse = findCourseByID(selectedCourseID);
          if (
            selectedCourse?.meetingsFaculty.length > 0 &&
            course.meetingsFaculty.length > 0
          ) {
            //check if the course is on the same day
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
              //check if the course times overlap
              if (
                Number(
                  course.meetingsFaculty[0].meetingTime.beginTime >=
                    Number(
                      selectedCourse.meetingsFaculty[0].meetingTime.beginTime,
                    ) &&
                    Number(course.meetingsFaculty[0].meetingTime.beginTime) <=
                      Number(
                        selectedCourse.meetingsFaculty[0].meetingTime.endTime,
                      ),
                ) ||
                (Number(course.meetingsFaculty[0].meetingTime.endTime) >=
                  Number(
                    selectedCourse.meetingsFaculty[0].meetingTime.beginTime,
                  ) &&
                  Number(course.meetingsFaculty[0].meetingTime.endTime) <=
                    Number(
                      selectedCourse.meetingsFaculty[0].meetingTime.endTime,
                    ))
              ) {
                conflict = true;
              }
            }
          }
        });
        if (conflict) return false;
      }

      //filter out courses that start before the start time
      if (
        startTime.value &&
        course.meetingsFaculty.length > 0 &&
        course.meetingsFaculty[0]?.meetingTime.beginTime != null &&
        Number(course.meetingsFaculty[0]?.meetingTime.beginTime) <
          startTime.value
      ) {
        return false;
      }

      //filter out courses that end after the end time
      if (
        endTime.value &&
        course.meetingsFaculty.length > 0 &&
        course.meetingsFaculty[0]?.meetingTime.endTime != null &&
        Number(course.meetingsFaculty[0]?.meetingTime.endTime) > endTime.value
      ) {
        return false;
      }

      //filter out courses that don't have the selected attributes
      if (attributesToFilter.length > 0) {
        let hasAttribute = false;
        for (let i = 0; i < attributesToFilter.length; i++) {
          for (let j = 0; j < course.sectionAttributes.length; j++) {
            if (
              attributesToFilter[i].value === course.sectionAttributes[j].code
            ) {
              hasAttribute = true;
              break;
            }
          }
        }
        if (!hasAttribute) return false;
      }

      //filter out courses that don't match the search term
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

      //if none of the filters return false, return true
      return true;
    }); //end of filter

    //sort courses by RMP rating if the user has selected to do so
    if (filterByRating) {
      newFilteredCourses.sort((a, b) => {
        return b.rating - a.rating;
      });
    }

    setFilteredCourses(newFilteredCourses);

    //updates the hasMore state to determine if the infinite scroll should load more courses
    setHasMore(newFilteredCourses.length > numberOfCoursesRendered);
  }, [
    searchTerm,
    onlyOpen,
    onlyGrad,
    onlyGU,
    noFriday,
    numberOfCoursesRendered,
    attributesToFilter,
    startTime,
    endTime,
    filterConflicts,
    calendars,
    filterByRating,
    activeCalendar,
  ]);

  useEventListener("keydown", handleKeyDown);

  const toggleSettingsScreen = () => {
    setOpenSettingsModal(!openSettingsModal);
  };

  const showDetailedInfoFunc = (course) => {
    setExpandedCourse(course);
  };

  return (
    <div className="app">
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="mobile-calendar"
      >
        <FaRegCalendar />
        <p>{showCalendar ? "Hide" : "Show"}</p>
      </button>
      {showIntro && <IntroScreen closeModal={() => setShowIntro(false)} />}
      {expandedCourse !== 0 && (
        <ExpandedView
          expandedCourse={expandedCourse}
          addCourse={addCourse}
          setExpandedCourse={setExpandedCourse}
        />
      )}

      {openSettingsModal && (
        <Settings
          onlyOpen={onlyOpen}
          setOnlyOpen={setOnlyOpen}
          onlyGrad={onlyGrad}
          setOnlyGrad={setOnlyGrad}
          onlyGU={onlyGU}
          setOnlyGU={setOnlyGU}
          noFriday={noFriday}
          setNoFriday={setNoFriday}
          filterByRating={filterByRating}
          setFilterByRating={setFilterByRating}
          showCourseInfo={showCourseInfo}
          setShowCourseInfo={setShowCourseInfo}
          showCourseAttributes={showCourseAttributes}
          setShowCourseAttributes={setShowCourseAttributes}
          attributesToFilter={attributesToFilter}
          setAttributesToFilter={setAttributesToFilter}
          attributesRef={attributesRef}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          toggleSettingsScreen={toggleSettingsScreen}
          timeOptions={timeOptions}
          attributeOptions={attributeOptions}
          setFilterConflicts={setFilterConflicts}
          filterConflicts={filterConflicts}
        />
      )}
      <div className="container">
        <div className="content">
          <div className="header">
            <h1>Hoya Courses</h1>
          </div>
          <h5 className="app-subtitle">
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

            <button className="settings" onClick={toggleSettingsScreen}>
              <FaSliders />
              <p>More</p>
            </button>
          </div>
          <h2 className="main-subtitle">
            {filteredCourses.length} courses found!
          </h2>

          <InfiniteScroll
            dataLength={numberOfCoursesRendered}
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
            }
          >
            {filteredCourses.slice(0, numberOfCoursesRendered).map((course) => (
              <Course
                course={course}
                key={course.id}
                showInfo={showDetailedInfoFunc}
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
          <CalendarView
            calendars={calendars}
            activeCalendar={activeCalendar}
            setActiveCalendar={setActiveCalendar}
            hoveredCourseID={hoveredCourseID}
            removeCourse={removeCourse}
            onCopyClick={onCopyClick}
            findCourseByID={findCourseByID}
            switchDayOfWeek={switchDayOfWeek}
            getBackgroundColor={getBackgroundColor}
            getCreditNumber={getCreditNumber}
            days={days}
            times={times}
          />
        )}
      </div>
    </div>
  );
};

export default App;

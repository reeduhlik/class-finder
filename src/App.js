import React from "react";
import { useState, useEffect } from "react";
import Course from "./Course";
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
//import stuff to do animation on scroll
import "animate.css/animate.min.css";
import { AnimationOnScroll } from "react-animation-on-scroll";
import { FaSliders } from "react-icons/fa6";
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
  const courses = mergePages();

  const [showIntro, setShowIntro] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [attributeOptions, setAttributeOptions] = useState([]);
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
  const [instructor, setInstructor] = useState("");
  const [attributes, setAttributes] = useState([]);

  const [onlyOpen, setOnlyOpen] = useState(true);
  const [onlyGrad, setOnlyGrad] = useState(false);
  const [onlyGU, setOnlyGU] = useState(true);
  const [noFriday, setNoFriday] = useState(false);

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
        setrecords(records + 12);
      }, 2500);
    }
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
    console.log(attributeOptions);
  }, []);

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

      if (course.faculty.length > 0) {
        if (
          !course.faculty[0].displayName
            .toLowerCase()
            .includes(instructor.toLowerCase())
        ) {
          return false;
        }
      }

      if (course.faculty.length == 0 && instructor != "") return false;

      if (
        !course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !course.subjectCourse.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
    setFilteredCourses(newFilteredCourses);
    setHasMore(newFilteredCourses.length > records);
  }, [
    searchTerm,
    instructor,
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
            <button className="toggle_modal" onClick={expandOptions}>
              Close
            </button>
          </div>
        </div>
      )}

      <div className="header">
        <h1 onClick={() => setShowIntro(true)}>Georgetown Course Finder F23</h1>
      </div>
      <h5 className="app-subtitle">
        The best way to find classes you need. Find seats remaining and RMP
        ratings all in one place. Blazingly Fast.
      </h5>
      <div className="searchFields">
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Course Title, Number, or CRN"
        />
        <input
          type="text"
          onChange={(e) => setInstructor(e.target.value)}
          placeholder="Search by Instructor"
        />
        <Select
          isMulti
          name="attributes"
          options={attributeOptions}
          className="select-field"
          onChange={(e) => setAttributes(e)}
          placeholder="Search by Attribute"
        />
        <button className="settings" onClick={expandOptions}>
          <FaSliders />
        </button>
      </div>
      <h2 className="main-subtitle">{filteredCourses.length} courses found!</h2>
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
        {filteredCourses.slice(0, records).map((course, index) =>
          index > 12 ? (
            <AnimationOnScroll
              delay={0}
              duration={0.5}
              animateIn="animate__zoomIn"
              animateOnce>
              <Course course={course} key={course.id} />
            </AnimationOnScroll>
          ) : (
            <Course course={course} key={course.id} />
          )
        )}
      </InfiniteScroll>
    </div>
  );
};

export default App;

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

  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [instructor, setInstructor] = useState("");

  const [onlyOpen, setOnlyOpen] = useState(true);
  const [onlyGrad, setOnlyGrad] = useState(false);
  const [onlyGU, setOnlyGU] = useState(true);
  const [noFriday, setNoFriday] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const [records, setrecords] = useState(12);
  const [hasMore, setHasMore] = useState(true);

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
    const newFilteredCourses = courses.filter((course) => {
      //business logic in here
      if (onlyOpen && course.seatsAvailable === 0) return false;
      if (onlyGrad && Number(course.courseNumber) > 4999) return false;
      if (onlyGU && Number(course.sequenceNumber) >= 70) return false;
      if (noFriday && course.meetingsFaculty[0]?.meetingTime.friday)
        return false;

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
  }, [searchTerm, instructor, onlyOpen, onlyGrad, onlyGU, noFriday, records]);

  const expandOptions = () => {
    setOpenModal(!openModal);
  };

  return (
    <div className="App">
      {openModal && (
        <div className="options">
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
          <button className="toggle_modal" onClick={expandOptions}>
            Close
          </button>
        </div>
      )}
      <h1>Georgetown Course Finder F23</h1>
      <h5 className="app-subtitle">
        The best way to find classes you need. Find seats remaining and RMP
        ratings all in one place. Blazingly Fast. Created by Reed Uhlik.
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

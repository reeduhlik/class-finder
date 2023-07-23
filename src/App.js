import React from "react";
import { useState } from "react";
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
import InfiniteScroll from "react-infinite-scroller";
import { HashLoader } from "react-spinners";
//import stuff to do animation on scroll
import "animate.css/animate.min.css";
import { AnimationOnScroll } from "react-animation-on-scroll";

const mergePages = () => {
  return page0.data.concat(
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
};

const App = () => {
  const courses = mergePages();

  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("");
  const [instructor, setInstructor] = useState("");

  const [records, setrecords] = useState(12);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = () => {
    if (records > filteredCourses.length) {
      setHasMore(false);
    } else {
      setTimeout(() => {
        setrecords(records + 12);
      }, 2000);
    }
  };

  const updateCourses = () => {
    const coursesFilteredOnName = courses.filter((course) => {
      return (
        course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.subjectCourse.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    const coursesFilteredOnInstructor = coursesFilteredOnName.filter(
      (course) => {
        if (instructor === "") return true;

        return course.faculty.length > 0
          ? course.faculty[0].displayName
              .toLowerCase()
              .includes(instructor.toLowerCase())
          : false;
      }
    );
    setFilteredCourses(coursesFilteredOnInstructor);
    setrecords(12);
    setHasMore(coursesFilteredOnInstructor.length > 12);
  };

  return (
    <div className="App">
      <h1>Georgetown Course Finder F23</h1>
      <h5>Created by Reed Uhlik.</h5>
      <div className="searchFields">
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={updateCourses}
          placeholder="Course Title, Number, or CRN"
        />
        <input
          type="text"
          onChange={(e) => setInstructor(e.target.value)}
          onKeyUp={updateCourses}
          placeholder="Instructor"
        />
      </div>
      <h2>{filteredCourses.length} courses found!</h2>
      <InfiniteScroll
        className="courses"
        pageStart={0}
        loadMore={loadMore}
        hasMore={hasMore}
        loader={
          <div className="loader-container">
            <HashLoader loading={true} size={50} className="loader" />
            <p>Loading more classes, hang tight.</p>
          </div>
        }
        useWindow={false}>
        {filteredCourses.slice(0, records).map((course, index) =>
          index > 12 ? (
            <AnimationOnScroll animateIn="animate__zoomInUp">
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

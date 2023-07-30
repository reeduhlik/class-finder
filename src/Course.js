import React from "react";
import instructors from "./instructors";
import "animate.css";

const Course = ({
  course,
  func,
  hoverFunc,
  unhoverFunc,
  showAttributes,
  showInfo,
}) => {
  const calculateCourseRating = (course) => {
    //find index of course in instructor array based on instructor name
    const instructorIndex = instructors.findIndex(
      (inst) => inst.instructor === course.faculty[0]?.displayName
    );
    if (instructorIndex === -1) {
      return "N/A";
    } else {
      return (
        10 * instructors[instructorIndex].rating +
        (6 - instructors[instructorIndex].difficulty) * 10
      );
    }
  };
  const getTimeString = () => {
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

  const formatTitle = (title) => {
    return title.replace(/&amp;/g, "&");
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

  const formatDaysString = () => {
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

  const getCreditHours = () => {
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

  const rating = retrieveInstructorRating(course.faculty[0]?.displayName);

  return (
    <div
      className="course animate__animated animate__fadeIn animate__faster"
      onClick={func}
      onMouseEnter={hoverFunc}
      onMouseLeave={unhoverFunc}>
      <div className="course-top">
        <div className="course-top-left">
          <h3>
            {course.subjectCourse}-{course.sequenceNumber}
          </h3>
        </div>
        <h5>CRN: {course.courseReferenceNumber}</h5>
      </div>
      <h2>{formatTitle(course.courseTitle)}</h2>
      <h6>{getCreditHours()}</h6>
      {showInfo && (
        <div className="course-icons">
          <div className="course-icon">
            <img src="/icons/instructor.svg" alt="instructor" />

            <a
              target="_blank"
              href={
                "https://gufaculty360.georgetown.edu/s/global-search?searchText=" +
                encodeURIComponent(course.faculty[0]?.displayName)
              }>
              {course.faculty.length > 0
                ? course.faculty[0].displayName
                : "Not Available"}
            </a>
          </div>

          <div className="course-icon">
            <img src="/icons/star.svg" alt="rating" />
            <a
              target="_blank"
              href={
                "https://www.ratemyprofessors.com/search/professors/355?q=" +
                encodeURIComponent(course.faculty[0]?.displayName)
              }>
              {course.faculty.length > 0 ? rating : "N/A"}

              {rating !== "N/A" && rating >= 4 && (
                <div className="color-circle-green"></div>
              )}
              {rating !== "N/A" && rating < 4 && rating >= 3 && (
                <div className="color-circle-yellow"></div>
              )}
              {rating !== "N/A" && rating < 3 && (
                <div className="color-circle-red"></div>
              )}
            </a>
          </div>
          <div className="course-icon">
            <img src="/icons/seats.svg" alt="Seats" />

            <p>
              <span className="large-text">{course.seatsAvailable}</span>
              <span className="small-text">
                {"/" + course.maximumEnrollment}{" "}
              </span>
              Left
            </p>
            <p>
              <span className="large-text">{course.waitAvailable}</span>
              <span className="small-text">{"/" + course.waitCapacity} </span>
              WL
            </p>
          </div>
          <div className="course-icon">
            <img src="/icons/location.svg" alt="location" />
            <p>
              {course.meetingsFaculty.length > 0 &&
              course.meetingsFaculty[0].meetingTime.building
                ? course.meetingsFaculty[0].meetingTime.building +
                  "-" +
                  course.meetingsFaculty[0].meetingTime.room
                : "TBA"}
            </p>
          </div>

          <div className="course-icon">
            <img src="/icons/time.svg" alt="time" />
            <p>{getTimeString()}</p>
          </div>
          <div className="course-icon">
            <img src="/icons/days.svg" alt="Days" />
            <p>{formatDaysString()}</p>
          </div>
        </div>
      )}
      {course.seatsAvailable == 1 && course.waitCount > 0 && (
        <div className="course-alert">
          <img src="/icons/alert.svg" alt="alert" />
          <p>Open seat likely from WL</p>
        </div>
      )}
      {course.seatsAvailable == 0 && (
        <div className="course-warning">
          <img src="/icons/alert.svg" alt="alert" />
          <p>Course is full :(</p>
        </div>
      )}
      {showAttributes && (
        <div className="course-attributes">
          {course.sectionAttributes.length > 0 &&
            course.sectionAttributes.map((attribute) => {
              if (attribute.code != "MEAN") {
                return <p className="course-attribute">{attribute.code}</p>;
              }
            })}
        </div>
      )}
    </div>
  );
};

export default Course;

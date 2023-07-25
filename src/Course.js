import React from "react";
import instructors from "./instructors";

const Course = ({ course }) => {
  const formatTimeFromMilitary = (time) => {
    if (!time) {
      return "TBA";
    }
    const hour = time.substring(0, 2);
    const minute = time.substring(2, 4);
    const formattedHour = hour % 12 || 12;
    const ampm = hour < 12 ? "AM" : "PM";
    return formattedHour + ":" + minute + " " + ampm;
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
    if (course.meetingsFaculty.length > 0) {
      if (course.meetingsFaculty[0].meetingTime.monday) {
        str += "M";
      }
      if (course.meetingsFaculty[0].meetingTime.tuesday) {
        str += "T";
      }
      if (course.meetingsFaculty[0].meetingTime.wednesday) {
        str += "W";
      }
      if (course.meetingsFaculty[0].meetingTime.thursday) {
        str += "Th";
      }
      if (course.meetingsFaculty[0].meetingTime.friday) {
        str += "F";
      }
    } else {
      return "Not Available";
    }
    return str;
  };

  const rating = retrieveInstructorRating(course.faculty[0]?.displayName);

  return (
    <div className="course">
      <div className="course-top">
        <div className="course-top-left">
          <h3>
            {course.subjectCourse}-{course.sequenceNumber}
          </h3>
          <h2>{unescape(course.courseTitle)}</h2>
        </div>
        <h5>CRN: {course.courseReferenceNumber}</h5>
      </div>
      <div className="course-icons">
        <div className="course-icon">
          <img src="/icons/instructor.svg" alt="instructor" />

          <p>
            {course.faculty.length > 0
              ? course.faculty[0].displayName
              : "Not Available"}
          </p>
        </div>

        <div className="course-icon">
          <img src="/icons/star.svg" alt="rating" />
          <p>{course.faculty.length > 0 && rating}</p>
          {rating !== "N/A" && rating >= 4 && (
            <div className="color-circle-green"></div>
          )}
          {rating !== "N/A" && rating < 4 && rating >= 3 && (
            <div className="color-circle-yellow"></div>
          )}
          {rating !== "N/A" && rating < 3 && (
            <div className="color-circle-red"></div>
          )}
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
        </div>
        <div className="course-icon">
          <img src="/icons/location.svg" alt="location" />
          <p>
            {course.meetingsFaculty.length > 0 &&
              course.meetingsFaculty[0].meetingTime.building +
                "-" +
                course.meetingsFaculty[0].meetingTime.room}
          </p>
        </div>
        <div className="course-icon">
          <img src="/icons/time.svg" alt="time" />
          <p>
            {course.meetingsFaculty.length > 0 &&
              formatTimeFromMilitary(
                course.meetingsFaculty[0].meetingTime.beginTime
              ) +
                " - " +
                formatTimeFromMilitary(
                  course.meetingsFaculty[0].meetingTime.endTime
                )}
          </p>
        </div>
        <div className="course-icon">
          <img src="/icons/days.svg" alt="Days" />
          <p>{formatDaysString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Course;

import React from "react";
import { useEffect } from "react";
import { FaCopy } from "react-icons/fa6";
import { formatMilitaryTime } from "./helperFunctions";
import CalendarCourse from "./CalendarCourse";

const CalendarView = ({
  calendars,
  activeCalendar,
  setActiveCalendar,
  hoveredCourseID,
  removeCourse,
  onCopyClick,
  findCourseByID,
  switchDayOfWeek,
  getBackgroundColor,
  getCreditNumber,
  days,
  times,
}) => {
  //print out the passed props

  return (
    <div className="right animate__animated animate__slideInRight animate__faster">
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
            <h6>{calendars[calendar]?.name}</h6>
            <p>{calendars[calendar]?.courses.length} courses</p>
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

              const coursesAtTime = calendars[activeCalendar].courses.filter(
                (courseID) => {
                  const course = findCourseByID(courseID);

                  if (course.meetingsFaculty.length > 0) {
                    return (
                      switchDayOfWeek(courseID, day) &&
                      Number(course.meetingsFaculty[0].meetingTime.beginTime) <=
                        Number(time) &&
                      Number(course.meetingsFaculty[0].meetingTime.endTime) >
                        Number(time)
                    );
                  }
                  return false;
                }
              );

              if (hoveredCourseID) {
                const hoveredCourse = findCourseByID(hoveredCourseID);

                if (hoveredCourse?.meetingsFaculty.length > 0) {
                  hover =
                    switchDayOfWeek(hoveredCourseID, day) &&
                    Number(
                      hoveredCourse.meetingsFaculty[0].meetingTime.beginTime
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
                      backgroundColor: getBackgroundColor(coursesAtTime[0]),
                      borderColor: getBackgroundColor(coursesAtTime[0]),
                    }}>
                    {" "}
                    <div className="calendar-tooltip">
                      <h5>{findCourseByID(coursesAtTime[0]).courseTitle}</h5>
                      <h6>
                        {findCourseByID(coursesAtTime[0]).subject} -{" "}
                        {findCourseByID(coursesAtTime[0]).courseNumber}
                      </h6>
                      <h6>
                        {formatMilitaryTime(
                          findCourseByID(coursesAtTime[0]).meetingsFaculty[0]
                            .meetingTime.beginTime
                        )}{" "}
                        -{" "}
                        {formatMilitaryTime(
                          findCourseByID(coursesAtTime[0]).meetingsFaculty[0]
                            .meetingTime.endTime
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
          <p>No courses added yet. Click on a course to add it to this plan.</p>
        </div>
      )}
    </div>
  );
};

export default CalendarView;

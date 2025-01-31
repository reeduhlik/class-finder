import React from "react";
import { FaCheck, FaX } from "react-icons/fa6";
import {
  getTimeString,
  formatDaysString,
  getCreditHours,
} from "./helperFunctions";
const ExpandedView = ({ expandedCourse, addCourse, setExpandedCourse }) => {
  return (
    <div className="introscreen-bg">
      <div className="options animate__animated animate__fadeIn animate__faster">
        <div className="options-header">
          <h2>{expandedCourse.courseTitle}</h2>
          <h6 className="keyboard-outline">ESC</h6>
          <p>or</p>
          <h6 className="keyboard-outline">Space</h6>
        </div>
        <p className="app-settings-subtitle">
          {expandedCourse.subject}-{expandedCourse.courseNumber}
        </p>
        <h6 className="options-expanded-header">Basic Info</h6>
        <div className="course-icons-expanded">
          <div className="course-icon">
            <img src="/icons/instructor.svg" alt="instructor" />

            <a
              target="_blank"
              rel="noreferrer"
              href={
                "https://gufaculty360.georgetown.edu/s/global-search?searchText=" +
                encodeURIComponent(expandedCourse.faculty[0]?.displayName)
              }
            >
              {expandedCourse.faculty.length > 0
                ? expandedCourse.faculty[0].displayName
                : "Not Available"}
            </a>
          </div>
          <div className="course-icon">
            <img src="/icons/seats.svg" alt="Seats" />

            <p>
              <span className="large-text">
                {expandedCourse.seatsAvailable}
              </span>
              <span className="small-text">
                {"/" + expandedCourse.maximumEnrollment}{" "}
              </span>
              Left
            </p>
            <p>
              <span className="large-text">{expandedCourse.waitAvailable}</span>
              <span className="small-text">
                {"/" + expandedCourse.waitCapacity}{" "}
              </span>
              WL
            </p>
          </div>
          <div className="course-icon">
            <img src="/icons/location.svg" alt="location" />
            <p>
              {expandedCourse.meetingsFaculty.length > 0 &&
              expandedCourse.meetingsFaculty[0].meetingTime.building
                ? expandedCourse.meetingsFaculty[0].meetingTime.building +
                  "-" +
                  expandedCourse.meetingsFaculty[0].meetingTime.room
                : "TBA"}
            </p>
          </div>

          <div className="course-icon">
            <img src="/icons/star.svg" alt="rating" />
            <a
              target="_blank"
              rel="noreferrer"
              href={
                "https://www.ratemyprofessors.com/search/professors/355?q=" +
                encodeURIComponent(expandedCourse.faculty[0]?.displayName)
              }
            >
              {expandedCourse.faculty.length > 0
                ? expandedCourse.rating
                : "N/A"}

              {expandedCourse.rating !== "N/A" &&
                expandedCourse.rating >= 4 && (
                  <div className="color-circle-green"></div>
                )}
              {expandedCourse.rating !== "N/A" &&
                expandedCourse.rating < 4 &&
                expandedCourse.rating >= 3 && (
                  <div className="color-circle-yellow"></div>
                )}
              {expandedCourse.rating !== "N/A" && expandedCourse.rating < 3 && (
                <div className="color-circle-red"></div>
              )}
            </a>
          </div>
          <div className="course-icon">
            <img src="/icons/star.svg" alt="rating" />
            <a
              target="_blank"
              rel="noreferrer"
              href={
                "https://www.ratemyprofessors.com/search/professors/355?q=" +
                encodeURIComponent(expandedCourse.faculty[0]?.displayName)
              }
            >
              {expandedCourse.faculty.length > 0
                ? expandedCourse.ratingDifficulty + " Difficulty"
                : "N/A Difficulty"}

              {expandedCourse.rating !== "N/A" &&
                expandedCourse.ratingDifficulty < 2.5 && (
                  <div className="color-circle-green"></div>
                )}
              {expandedCourse.rating !== "N/A" &&
                expandedCourse.rating < 4 &&
                expandedCourse.ratingDifficulty >= 2.5 && (
                  <div className="color-circle-yellow"></div>
                )}
              {expandedCourse.rating !== "N/A" &&
                expandedCourse.ratingDifficulty > 4 && (
                  <div className="color-circle-red"></div>
                )}
            </a>
          </div>
          <div className="course-icon">
            <img src="/icons/star.svg" alt="rating" />
            <a
              target="_blank"
              rel="noreferrer"
              href={
                "https://www.ratemyprofessors.com/search/professors/355?q=" +
                encodeURIComponent(expandedCourse.faculty[0]?.displayName)
              }
            >
              {expandedCourse.faculty.length > 0
                ? expandedCourse.ratingPercent + " Would Take Again"
                : "N/A"}
            </a>
          </div>

          <div className="course-icon">
            <img src="/icons/time.svg" alt="time" />
            <p>{getTimeString(expandedCourse)}</p>
          </div>
          <div className="course-icon">
            <img src="/icons/days.svg" alt="Days" />
            <p>{formatDaysString(expandedCourse)}</p>
          </div>
          <div className="course-icon">
            <img src="/icons/fast.svg" alt="time" />
            <p>{getCreditHours(expandedCourse)}</p>
          </div>
        </div>
        <div className="course-attributes">
          {expandedCourse.sectionAttributes.length > 0 &&
            expandedCourse.sectionAttributes.map((attribute) => {
              if (attribute.code !== "MEAN") {
                return (
                  <p className="course-attribute">{attribute.description}</p>
                );
              }
            })}
        </div>
        <div className="options-expanded-buttons">
          <button
            className="options-expanded-button-close"
            onClick={() => setExpandedCourse(0)}
          >
            Close
          </button>
          <button
            className="options-expanded-button-add"
            onClick={() => addCourse(expandedCourse.id)}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpandedView;

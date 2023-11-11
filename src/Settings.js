import React from "react";
import Toggle from "react-toggle";
import Select from "react-select";

const Settings = ({
  onlyOpen,
  setOnlyOpen,
  onlyGrad,
  setOnlyGrad,
  filterConflicts,
  setFilterConflicts,
  onlyGU,
  setOnlyGU,
  noFriday,
  setNoFriday,
  filterByRating,
  setFilterByRating,
  showCourseInfo,
  setShowCourseInfo,
  showCourseAttributes,
  setShowCourseAttributes,
  attributesToFilter,
  setAttributesToFilter,
  attributesRef,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  toggleSettingsScreen,
  timeOptions,
  attributeOptions,
}) => {
  return (
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
                onChange={() => setShowCourseAttributes(!showCourseAttributes)}
              />
            </div>

            <h5>Filter by attribute</h5>
            <div className="option">
              <Select
                isMulti
                name="attributes"
                defaultValue={attributesToFilter}
                className="time-select"
                options={attributeOptions}
                onChange={(e) => setAttributesToFilter(e)}
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
        <button className="option-button" onClick={toggleSettingsScreen}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Settings;

//auxiliary function to format time to military time
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

//returns the course time in the format of "5:00 PM - 6:15 PM"
const getTimeString = (course) => {
  let str = "";
  let empty = false;
  for (let i = 0; i < course.meetingsFaculty.length; i++) {
    if (course.meetingsFaculty[i].meetingTime.beginTime === "") {
      empty = true;
    }
    str +=
      formatMilitaryTime(course.meetingsFaculty[i].meetingTime.beginTime) +
      " - " +
      formatMilitaryTime(course.meetingsFaculty[i].meetingTime.endTime);
    if (i < course.meetingsFaculty.length - 1) {
      str += ", ";
    }
  }
  if (str.length === 0 || str === " - " || empty) {
    str = "TBA";
  }
  return str;
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

  if (str.length === 0) {
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

export { getTimeString, formatDaysString, formatMilitaryTime, getCreditHours };

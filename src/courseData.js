import page0 from "./coursePages/page0.json";
import page1 from "./coursePages/page1.json";
import page2 from "./coursePages/page2.json";
import page3 from "./coursePages/page3.json";
import page4 from "./coursePages/page4.json";
import page5 from "./coursePages/page5.json";
import page6 from "./coursePages/page6.json";
import page7 from "./coursePages/page7.json";
import page8 from "./coursePages/page8.json";
import page9 from "./coursePages/page9.json";
import page10 from "./coursePages/page10.json";
import page11 from "./coursePages/page11.json";
import page12 from "./coursePages/page12.json";

import descriptions0 from "./descriptions/descriptions0.json";
import descriptions1 from "./descriptions/descriptions1.json";
import descriptions2 from "./descriptions/descriptions2.json";
import descriptions3 from "./descriptions/descriptions3.json";
import descriptions4 from "./descriptions/descriptions4.json";
import descriptions5 from "./descriptions/descriptions5.json";
import descriptions6 from "./descriptions/descriptions6.json";
import descriptions7 from "./descriptions/descriptions7.json";
import descriptions8 from "./descriptions/descriptions8.json";
import descriptions9 from "./descriptions/descriptions9.json";
import descriptions10 from "./descriptions/descriptions10.json";
import descriptions11 from "./descriptions/descriptions11.json";

import prereqs0 from "./prereqs/prereqs0.json";
import prereqs1 from "./prereqs/prereqs1.json";
import prereqs2 from "./prereqs/prereqs2.json";
import prereqs3 from "./prereqs/prereqs3.json";
import prereqs4 from "./prereqs/prereqs4.json";
import prereqs5 from "./prereqs/prereqs5.json";
import prereqs6 from "./prereqs/prereqs6.json";
import prereqs7 from "./prereqs/prereqs7.json";
import prereqs8 from "./prereqs/prereqs8.json";
import prereqs9 from "./prereqs/prereqs9.json";
import prereqs10 from "./prereqs/prereqs10.json";
import prereqs11 from "./prereqs/prereqs11.json";

//
const mergePages = () => {
  return page0.data
    .concat(
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
      page11.data,
      page12.data
    )
    .filter((course) => course != null);
};

const mergeDescriptions = () => {
  const data = descriptions0.concat(
    descriptions1,
    descriptions2,
    descriptions3,
    descriptions4,
    descriptions5,
    descriptions6,
    descriptions7,
    descriptions8,
    descriptions9,
    descriptions10,
    descriptions11
  );

  return data;
};

const mergePrereqs = () => {
  const data = prereqs0.concat(
    prereqs1,
    prereqs2,
    prereqs3,
    prereqs4,
    prereqs5,
    prereqs6,
    prereqs7,
    prereqs8,
    prereqs9,
    prereqs10,
    prereqs11
  );

  return data;
};

const courseData = mergePages();
const descriptionData = mergeDescriptions();
const prereqData = mergePrereqs();

export { courseData, descriptionData, prereqData };

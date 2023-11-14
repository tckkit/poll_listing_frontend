import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PollVote } from "../../components/pollVote";
import { getData, postData } from "../../utilities/apiHelper";

function convertTimestampToFormattedDate(timestamp) {
  var daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Create a new Date object using the timestamp
  var date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds

  // Extract the components of the date
  var dayOfWeek = daysOfWeek[date.getDay()];
  var day = date.getDate();
  var month = monthsOfYear[date.getMonth()];
  var year = date.getFullYear();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var period = hour >= 12 ? "pm" : "am";

  // Convert hour to 12-hour format
  hour = hour % 12 || 12;

  // Add leading zero to minutes if less than 10
  minute = (minute < 10 ? "0" : "") + minute;

  // Format the date
  var formattedDate =
    dayOfWeek +
    ", " +
    day +
    " " +
    month +
    ", " +
    year +
    ", " +
    hour +
    ":" +
    minute +
    period;

  return formattedDate;
}

export function Component() {
  const params = useParams();
  const pollId = params.pollId;

  const [pollData, setPollData] = useState();
  const fetchPolls = async () => {
    const data = await getData(`http://localhost:8080/poll/${pollId}`);
    setPollData(data);
    return;
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const doughnutData = {
    datasets: [
      {
        label: "Vote",
        data: [1, 2],
        backgroundColor: ["#E3680E", "#1B3F70"],
        borderColor: ["#E3680E", "#1B3F70"],
      },
    ],
  };

  return (
    <>
      <div>
        {pollData && (
          <div className="pollDetailsTitle">
            <span>{pollData.title}</span>
          </div>
        )}
        {pollData && (
          <div className="publishContainer">
            <span className="publishTime">
              PUBLISHED :{" "}
              {convertTimestampToFormattedDate(pollData.published_date)}
            </span>
          </div>
        )}
      </div>
      {pollData && <PollVote doughnutData={doughnutData} data={pollData} />}
    </>
  );
}

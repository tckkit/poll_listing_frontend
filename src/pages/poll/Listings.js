import React, { useEffect, useState } from "react";
import Box from "@mui/system/Box";
import Grid from "@mui/system/Unstable_Grid";
import styled from "@mui/system/styled";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getData, postData } from "../../utilities/apiHelper";

import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

const Item = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  border: "1px solid",
  borderColor: theme.palette.mode === "dark" ? "#444d58" : "#ced7e0",
  padding: theme.spacing(1),
  borderRadius: "4px",
  textAlign: "center",
}));

const transformSurveyData = (input) => {
  const output = input.map((survey) => {
    const labels = survey.answers.map((answer) => answer.label);
    const data = survey.answers.map((answer) => answer.voteCount);
    // Define colors for background and border
    const backgroundColor = generateColors(labels.length);
    const borderColor = backgroundColor;
    return {
      // labels: labels,
      datasets: [
        {
          label: "Vote",
          data: data,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
        },
      ],
    };
  });
  return output;
};

// Function to generate random colors for the charts
function generateColors(numColors) {
  const colors = ["#E3680E", "#1B3F70"];
  for (let i = 2; i < numColors; i++) {
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    colors.push(color);
  }
  return colors;
}

function convertTimestampToDateString(timestamp) {
  // Create a new Date object using the timestamp
  var date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds

  // Define an array of month names
  var monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  // Extract the components of the date
  var day = date.getDate();
  var month = monthNames[date.getMonth()];
  var year = date.getFullYear();

  // Format the date as "DD Mon YYYY"
  var formattedDate = day + " " + month + " " + year;

  return formattedDate;
}

export function Component() {
  const [pollsArr, setPollsArr] = useState([]);
  const [todayPollData, setTodayPollData] = useState({
    datasets: [
      {
        label: "Vote",
        data: [3, 6],
        backgroundColor: ["#E3680E", "#2F5A87"],
        borderColor: ["#E3680E", "#2F5A87"],
      },
    ],
  });
  const [todayPollColor, setTodayPollColor] = useState([]);

  const fetchPolls = async () => {
    const data = await getData(`http://localhost:8080/poll/`);
    setPollsArr(data["polls"]);
    return;
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  useEffect(() => {
    const outputData = transformSurveyData(pollsArr);
    if (outputData.length > 0) {
      const todayData = outputData[0];
      setTodayPollData(todayData);
      setTodayPollColor(todayData.datasets[0].backgroundColor);
    } else {
      setTodayPollData({
        datasets: [
          {
            label: "Vote",
            data: [3, 6],
            backgroundColor: ["#E3680E", "#2F5A87"],
            borderColor: ["#E3680E", "#2F5A87"],
          },
        ],
      });
    }
  }, [pollsArr]);

  const todayPollTextCenter = {
    id: "textCenter",
    beforeDatasetsDraw(chart, args, pluginOptions) {
      const { ctx, data } = chart;

      ctx.save();
      ctx.font = "bold 50px sans-serif";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      const xCoor = chart.getDatasetMeta(0).data[0].x;
      const yCoor = chart.getDatasetMeta(0).data[0].y;
      ctx.fillText("%", xCoor, yCoor);
    },
  };
  const todayPollOptions = {
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  // Doughnut Icon
  const doughnutIconData = {
    // labels: ["Yes", "No"],
    datasets: [
      {
        label: "Vote",
        data: [5, 5],
        backgroundColor: ["#E3680E", "#5B98CC"],
        borderColor: ["#E3680E", "#5B98CC"],
      },
    ],
  };
  const doughnutIconTextCenter = {
    id: "textCenter",
    beforeDatasetsDraw(chart, args, pluginOptions) {
      const { ctx, data } = chart;
      ctx.save();
      ctx.font = "bold 25px sans-serif";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      const xCoor = chart.getDatasetMeta(0).data[0].x;
      const yCoor = chart.getDatasetMeta(0).data[0].y;
      ctx.fillText("%", xCoor, yCoor);
    },
  };
  const doughnutIconOptions = {
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: false,
      },
    },
  };
  const DoughnutIcon = () => (
    <Doughnut
      data={doughnutIconData}
      plugins={[doughnutIconTextCenter]}
      options={doughnutIconOptions}
    ></Doughnut>
  );

  return (
    <div className="listingsPage">
      <div className="todayPollContainer">
        <div className="todayPollLeft">
          <div className="todayPollTitle">Today's Poll</div>
          <div className="todayPollName">
            {pollsArr.length > 0 && pollsArr[0].title}{" "}
            <span className="pollDate">
              {pollsArr.length > 0 &&
                convertTimestampToDateString(pollsArr[0].published_date)}
            </span>
          </div>
          <div className="voteContainer">
            {pollsArr.length > 0 &&
              todayPollColor.length > 0 &&
              pollsArr[0].answers.map((answer, i) => (
                <button
                  className="voteButton"
                  index={i}
                  key={answer.id}
                  style={{
                    backgroundColor: todayPollColor[i],
                    color: "white",
                    border: "none",
                    fontWeight: 900,
                  }}
                >
                  {answer.label.toUpperCase()}
                </button>
              ))}
          </div>
          <div className="todayPollTotalVotes">
            Total number of votes recorded:{" "}
            {pollsArr.length > 0 && pollsArr[0].totalVoteCount}
          </div>
        </div>
        <div className="todayPollRight">
          <Doughnut
            data={todayPollData}
            plugins={[todayPollTextCenter]}
            options={todayPollOptions}
          ></Doughnut>
        </div>
      </div>
      <div className="otherPollContainer">
        <div className="otherPollTop">
          {pollsArr.length > 0 &&
            pollsArr.slice(1, 3).map((poll, i) => (
              <div className={`otherPoll${i + 1}`}>
                <div className="otherPollDetails">
                  <div className="otherPollChart">
                    <DoughnutIcon />
                  </div>
                  <div className="otherPollDateTitle">
                    <div className="pollDate">
                      {convertTimestampToDateString(poll.published_date)}
                    </div>
                    <div className="otherPollTitle">{poll.title}</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="otherPollBottom">
          {pollsArr.length > 0 &&
            pollsArr.slice(3, 5).map((poll, i) => (
              <div className={`otherPoll${i + 3}`}>
                <div className="otherPollDetails">
                  <div className="otherPollChart">
                    <DoughnutIcon />
                  </div>
                  <div className="otherPollDateTitle">
                    <div className="pollDate">
                      {convertTimestampToDateString(poll.published_date)}
                    </div>
                    <div className="otherPollTitle">{poll.title}</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

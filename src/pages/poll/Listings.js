import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getData, postData } from "../../utilities/apiHelper";
import { PollVote } from "../../components/pollVote";
import { useNavigate } from "react-router-dom";

import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

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
  const navigate = useNavigate();
  const [pollsArr, setPollsArr] = useState([]);

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
    } else {
    }
  }, [pollsArr]);

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

  const handleRedirect = (id) => {
    console.log(id, "idddd");
    navigate(`/poll/${id}`);
  };

  return (
    <div className="listingsPage">
      {pollsArr.length > 0 && (
        <PollVote data={pollsArr[0]} isTodayPoll={true} />
      )}
      <div className="otherPollContainer">
        <div className="otherPollTop">
          {pollsArr.length > 0 &&
            pollsArr.slice(1, 3).map((poll, i) => (
              <div className={`otherPoll${i + 1}`}>
                <div
                  className="otherPollDetails"
                  onClick={() => handleRedirect(poll.id)}
                >
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
                <div
                  className="otherPollDetails"
                  onClick={() => handleRedirect(poll.id)}
                >
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

import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { postData } from "../utilities/apiHelper";
ChartJS.register(ArcElement, Tooltip, Legend);

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

function generateColors(numColors) {
  const colors = ["#E3680E", "#1B3F70"];
  for (let i = 2; i < numColors; i++) {
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    colors.push(color);
  }
  return colors;
}

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

export const PollVote = (props) => {
  const {
    isTodayPoll = false,
    data = {
      title: "",
      published_date: "",
      answers: [],
      totalVoteCount: "",
    },
  } = props;

  const doughnutTextCenter = {
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
  const doughnutOptions = {
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  const [answerPollColor, setAnswerPollColor] = useState(
    transformSurveyData(data ? [data] : [])
  );

  const [doughnutData, setDoughnutData] = useState({
    datasets: [
      {
        label: "Vote",
        data: [3, 6],
        backgroundColor: ["#E3680E", "#2F5A87"],
        borderColor: ["#E3680E", "#2F5A87"],
      },
    ],
  });

  useEffect(() => {
    const outputData = transformSurveyData([data]);
    if (outputData.length > 0) {
      const todayData = outputData[0];
      setDoughnutData(todayData);
      setAnswerPollColor(todayData.datasets[0].backgroundColor);
    } else {
      setDoughnutData({
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
  }, [data]);

  const onSubmit = async (e) => {
    console.log(e.target.value, "keyyyy");
    const payload = {
      poll_id: data.id,
      answers: [e.target.value],
    };
    await postData(`http://localhost:8080/poll`, payload);
    window.alert("Vote Successfully!");
    window.location.reload();
    return;
  };

  return (
    <div
      className={`todayPollContainer ${
        isTodayPoll ? "greyBackground" : "blueBackground"
      }`}
    >
      <div className={`todayPollLeft ${isTodayPoll ? "borderBottom" : ""}`}>
        {isTodayPoll && <div className="todayPollTitle">Today's Poll</div>}
        {isTodayPoll && (
          <div className="todayPollName">
            {data.title}{" "}
            <span className="pollDate">
              {convertTimestampToDateString(data.published_date)}
            </span>
          </div>
        )}
        <div className="voteContainer">
          {data.answers.length > 0 &&
            answerPollColor &&
            data.answers.map((answer, i) => (
              <button
                className="voteButton"
                key={i}
                value={answer.id}
                style={{
                  backgroundColor: answerPollColor[i],
                  color: "white",
                  border: "none",
                  fontWeight: 900,
                }}
                onClick={onSubmit}
              >
                {answer.label.toUpperCase()}
              </button>
            ))}
        </div>
        <div
          className={`todayPollTotalVotes ${isTodayPoll ? "" : "marginTop"}`}
        >
          Total number of votes recorded: {data.totalVoteCount}
        </div>
      </div>
      <div className={`todayPollRight ${isTodayPoll ? "borderBottom" : ""}`}>
        {doughnutData && doughnutTextCenter && doughnutOptions && (
          <Doughnut
            data={doughnutData}
            plugins={[doughnutTextCenter]}
            options={doughnutOptions}
          />
        )}
      </div>
    </div>
  );
};

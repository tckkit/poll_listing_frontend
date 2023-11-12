import * as React from "react";
import Box from "@mui/system/Box";
import Grid from "@mui/system/Unstable_Grid";
import styled from "@mui/system/styled";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

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

export function Component() {
  const data = {
    // labels: ["Yes", "No"],
    datasets: [
      {
        label: "Vote",
        data: [3, 6],
        backgroundColor: ["#FF6A22", "#173066"],
        borderColor: ["#FF6A22", "#173066"],
      },
    ],
  };

  const textCenter = {
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

  const options = {
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  const optionsLogo = {
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: false, // <-- this option disables tooltips
      },
    },
  };

  const dataLogo = {
    // labels: ["Yes", "No"],
    datasets: [
      {
        label: "Vote",
        data: [5, 5],
        backgroundColor: ["#FF6A22", "#5B98CC"],
        borderColor: ["#FF6A22", "#5B98CC"],
      },
    ],
  };
  const textCenterLogo = {
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

  const PlainChart = () => (
    <Doughnut
      data={dataLogo}
      plugins={[textCenterLogo]}
      options={optionsLogo}
    ></Doughnut>
  );
  return (
    <div className="listingsPage">
      <div className="todayPollContainer">
        <div className="todayPollLeft">
          <div className="todayPollTitle">Today's Poll</div>
          <div className="todayPollName">
            Is bitcoin worth the time and money that mining requires? 17 JAN
            2018
          </div>
          <div className="voteContainer">
            <button className="voteButton">Yes</button>
            <button className="voteButton">No</button>
          </div>
          <div className="todayPollTotalVotes">
            Total number of votes recorded: 182
          </div>
        </div>
        <div className="todayPollRight">
          <Doughnut
            data={data}
            plugins={[textCenter]}
            options={options}
          ></Doughnut>
        </div>
      </div>
      <div className="otherPollContainer">
        <div className="otherPollTop">
          <div className="otherPoll1">
            <div className="otherPollDetails">
              <div className="otherPollChart">
                <PlainChart />
              </div>
              <div className="otherPollDateTitle">
                <div className="otherPollDate">15 Jan 2018</div>
                <div className="otherPollTitle">
                  Should chatbots replace humans in customer service jobs?
                </div>
              </div>
            </div>
          </div>
          <div className="otherPoll2">
            <div className="otherPollDetails">
              <div className="otherPollChart">
                <PlainChart />
              </div>
              <div className="otherPollDateTitle">
                <div className="otherPollDate">15 Jan 2018</div>
                <div className="otherPollTitle">
                  Should chatbots replace humans in customer service jobs?
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="otherPollBottom">
          <div className="otherPoll3">
            <div className="otherPollDetails">
              <div className="otherPollChart">
                <PlainChart />
              </div>
              <div className="otherPollDateTitle">
                <div className="otherPollDate">15 Jan 2018</div>
                <div className="otherPollTitle">
                  Should chatbots replace humans in customer service jobs?
                </div>
              </div>
            </div>
          </div>
          <div className="otherPoll4">
            <div className="otherPollDetails">
              <div className="otherPollChart">
                <PlainChart />
              </div>
              <div className="otherPollDateTitle">
                <div className="otherPollDate">15 Jan 2018</div>
                <div className="otherPollTitle">
                  Should chatbots replace humans in customer service jobs?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

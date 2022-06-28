import React from "react";
import { ResponsiveLine } from "@nivo/line";
import InputArea from "./inputArea";

//TODO: add mobile support for grpah legend rearrangement

class graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  render() {
    return (
      <>
        <div className="graph">
          <ResponsiveLine
            data={this.state.data}
            margin={{ top: 30, bottom: 80, left: 50, right: 140 }}
            xScale={{
              type: "time",
              format: "%Y-%m-%d",
              useUTC: false,
              precision: "day",
            }}
            xFormat="time:%Y-%m-%d"
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            curve="cardinal"
            theme={{
              textColor: "#ebebeb",
              fontSize: 13,
              axis: {
                domain: {
                  line: {
                    stroke: "#777777",
                    strokeWidth: 1,
                  },
                },
                ticks: {
                  line: {
                    stroke: "#777777",
                    strokeWidth: 1,
                  },
                },
              },
              grid: {
                line: {
                  stroke: "#dddddd",
                  strokeWidth: 1,
                },
              },
              annotations: {
                text: {
                  fontSize: 13,
                  outlineWidth: 2,
                  outlineColor: "#ffffff",
                  outlineOpacity: 1,
                },
                link: {
                  stroke: "#000000",
                  strokeWidth: 1,
                  outlineWidth: 2,
                  outlineColor: "#ffffff",
                  outlineOpacity: 1,
                },
                outline: {
                  stroke: "#000000",
                  strokeWidth: 2,
                  outlineWidth: 2,
                  outlineColor: "#ffffff",
                  outlineOpacity: 1,
                },
                symbol: {
                  fill: "#000000",
                  outlineWidth: 2,
                  outlineColor: "#ffffff",
                  outlineOpacity: 1,
                },
              },
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              format: "%b",
              tickValues: "every 1 month",
              legend: "",
              legendOffset: -12,
            }}
            axisLeft={null}
            enableGridX={false}
            colors={{ scheme: "set1" }}
            enablePoints={false}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            enableCrosshair={false}
            useMesh={true}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 90,
                translateY: 10,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </div>
        <InputArea addTerm={this.addTerm} />
      </>
    );
  }

  addTerm = (term) => {
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        term: term,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //normalize new data based on covid rate of Infection
        let covidROI = this.state.data[0].data;
        let trendData = data.map((d) => {
          return d.y;
        });
        let trendDates = data.map((d) => {
          return d.x;
        });
        //fix trend dates to match covid dates
        let fixedTrendDates = [];
        for (let i = 0; i < trendDates.length; i++) {
          let d = new Date(trendDates[i]);
          fixedTrendDates.push(
            d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
          );
        }
        covidROI = covidROI.map((d) => {
          return d.y;
        });

        //normalize data to range of covidROI

        let min = Math.min(...covidROI);
        let max = Math.max(...covidROI);
        let dataMax = Math.max(...trendData);
        let dataMin = Math.min(...trendData);
        let normalizationFactor =
          ((dataMin !== 0 ? min / dataMin : 0) + max / dataMax) / 2;

        for (let i = 0; i < trendData.length; i++) {
          let normalized = trendData[i] * normalizationFactor;
          data[i].y = parseInt(normalized);
          data[i].x = fixedTrendDates[i];
        }
        let currentState = this.state.data;
        currentState.push({
          id: term,
          data: data,
        });
        this.setState(currentState);
        console.log(currentState);
      });
  };

  componentDidMount() {
    let ra = 4;
    fetch("https://pomber.github.io/covid19/timeseries.json")
      .then((result) => {
        return result.json();
      })
      .then((data) => {
        //trim data to only include previous year
        let trimmedIndex = data["US"].length - 365;
        data = data["US"].slice(trimmedIndex);
        //construct simple array of active cases
        let activeCases = data.map((d) => {
          return d.confirmed - d.deaths - d.recovered;
        });
        //calc derivative of active cases
        let derivative = [];
        for (let i = 1; i < activeCases.length; i++) {
          derivative.push(activeCases[i] - activeCases[i - 1]);
        }

        let zippedData = [];
        //smooth data with rolling avg
        let avgerageRoi = rollingAverage(derivative, ra);

        //zip data together and skip every other value for smoothing
        for (var i = 0; i < avgerageRoi.length; i += 5) {
          zippedData.push({
            x: data[i + ra].date,
            y: avgerageRoi[i],
          });
        }
        console.log(zippedData);
        data = [
          {
            id: "Rate of Infection",
            data: zippedData,
          },
        ];
        this.setState({ data: data });
      });
  }
}

function rollingAverage(arr, n) {
  //TODO: change to middle calculated rolling average
  //simple rolling average
  var out = [];
  var sum = 0;
  for (var i = 0; i < arr.length; i++) {
    sum += arr[i];
    if (i >= n) {
      sum -= arr[i - n];
    }
    if (i >= n - 1) {
      out.push(parseInt(sum / n));
    }
  }
  return out;
}

export default graph;

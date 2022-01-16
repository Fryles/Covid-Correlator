import React from "react";
import { ResponsiveLine } from "@nivo/line";
import InputArea from "./inputArea";

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
            margin={{ top: 50, right: 140, bottom: 50, left: 100 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: true,
              reverse: false,
            }}
            curve="basis"
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
            axisBottom={null}
            axisLeft={{
              orient: "left",
              tickSize: 0,
              tickPadding: 7,
              tickRotation: 0,
              legend: "case/hit count",
              legendOffset: -70,
              legendPosition: "middle",
            }}
            enableGridX={false}
            colors={{ scheme: "accent" }}
            enablePoints={false}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            enableSlices="x"
            enableCrosshair={false}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 100,
                translateY: 0,
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
            d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate()
          );
        }
        console.log(fixedTrendDates);

        covidROI = covidROI.map((d) => {
          return d.y;
        });
        let max = Math.max(...covidROI);
        let min = Math.min(...covidROI);
        let avg = (max + min) / 2;
        let trendDataMin = Math.min(...trendData);
        console.log(trendDataMin);
        for (let i = 0; i < trendData.length; i++) {
          let normalized = (trendData[i] / trendDataMin) * avg;
          data[i].y = normalized;
          data[i].x = fixedTrendDates[i];
        }
        console.log(data);
        let currentState = this.state.data;
        currentState.push({
          id: term,
          data: data,
        });
        this.setState(currentState);
      });
  };

  componentDidMount() {
    let ra = 5;
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
        for (var i = 0; i < avgerageRoi.length; i += 2) {
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

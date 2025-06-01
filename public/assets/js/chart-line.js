/**
 *  Fetch feelings from database
 */
async function fetchFeelingsSorted() {
  return fetch("/api/feelingsSorted")
    .then((response) => response.json())
    .then((json) => {
      // console.log("/feelings", json);
      return json;
    });
}

(async function () {
  const ctx = document.getElementById("myChart");
  let feelingsSorted = await fetchFeelingsSorted();
  // console.log("feelingsSorted", feelingsSorted);

  let labels = [];
  let chartDataSorted = {};
  let chartData = [];

  // loop through all rows
  for (var i = 0; i < feelingsSorted.length; i++) {
    // console.log(i, feelingsSorted[i]);

    // convert string to date
    let d = new Date(feelingsSorted[i].datetime);
    let dateStr = `${d.getFullYear()} ${d.toLocaleString("default", {
      month: "short",
    })}`;

    // add label
    if (!labels.includes(dateStr)) labels.push(new Date(dateStr));

    // sort data into different object properties by feeling

    // if feeling doesn't exist then add
    if (!chartDataSorted[feelingsSorted[i].feeling])
      chartDataSorted[feelingsSorted[i].feeling] = {};
    // if feeling/date doesn't exist add
    if (!chartDataSorted[feelingsSorted[i].feeling][dateStr])
      chartDataSorted[feelingsSorted[i].feeling][dateStr] = {
        color: feelingsSorted[i].color,
        count: 1,
      };
    // else add to it
    else chartDataSorted[feelingsSorted[i].feeling][dateStr].count++;
  }
  // console.log("chartDataSorted", chartDataSorted);

  // loop through all sorted feelings
  for (const feeling in chartDataSorted) {
    // console.log(feeling, chartDataSorted[feeling]);

    let dataForThisFeeling = [];
    let color;
    // loop through each feeling
    for (const month in chartDataSorted[feeling]) {
      // add to the feeling's data
      dataForThisFeeling.push({
        y: chartDataSorted[feeling][month].count,
        x: new Date(month),
      });
      color = chartDataSorted[feeling][month].color;
    }
    // add to the dataset
    chartData.push({
      label: feeling,
      data: dataForThisFeeling,
      borderColor: color,
      tension: 0.1,
      spanGaps: false,
      tension: 0.2, // 10 - lol
    });
  }
  // console.log("chartData", chartData);
  // console.log("labels", labels);

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: chartData,
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      elements: {
        line: {
          borderWidth: 5,
          fill: false,
          stepped: false,
        },
      },
      scales: {
        x: {
          type: "time",
          ticks: {
            autoSkip: true,
            maxTicksLimit: 20,
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Point",
          },
        },
        y: {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Value",
          },
        },
      },
    },
  });
})();


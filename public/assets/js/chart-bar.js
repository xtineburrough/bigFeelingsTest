/**
 *  Fetch feelings from database
 */
async function fetchFeelingsSorted() {
  return fetch("/api/feelingsGrouped")
    .then((response) => response.json())
    .then((json) => {
      // console.log("/feelings", json);
      return json;
    });
}

(async function () {
  // await updateChart();
})();

async function updateChart () {
  const ctx = document.getElementById("myChart");
  let feelingsSorted = await fetchFeelingsSorted();
  // console.log("feelingsSorted", feelingsSorted);

  let labels = [];
  let chartDataSorted = [];
  let chartData = [];
  let colors = [];

  // loop through all rows
  for (var i = 0; i < feelingsSorted.length; i++) {
    // console.log(i, feelingsSorted[i]);

    // ... store data in appropriate arrays
    labels.push(feelingsSorted[i].feeling);
    chartDataSorted.push(feelingsSorted[i].count);
    colors.push(feelingsSorted[i].color);
  }

  // push to chart
  chartData.push({
    axis: "y",
    label: "feeling",
    data: chartDataSorted,
    backgroundColor: colors,
    tension: 0.1,
    spanGaps: false,
    tension: 0.2, // 10 - lol
  });

  console.log("chartDataSorted", chartDataSorted);
  console.log("labels", labels);
  console.log("colors", colors);

  
  if (window.myChart != null && window.myChart != undefined)
    window.myChart.destroy();
  
  window.myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: chartData,
    },
    options: {
      indexAxis: "y",
      plugins: {
        legend: {
          display: false,
        },
      },
      elements: {
        line: {
          borderWidth: 2,
          fill: false,
          stepped: false,
        },
      },
    },
  });  
};

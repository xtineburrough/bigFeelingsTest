// client-side js run by the browser



async function main() {
  // 👉 add code inside this function (Chapter 10) ...

  let data = await fetchFeelings();
  // console.log("data", data)

  // update the map
  await updateMap(data);

  // 👈
}
main();

// global placeholder for colors
let colors;
// create interface
(async () => {
  colors = await fetchColors();
  // update drop down
  updateOptions(colors);
})();



//////////////////////////////////////
///////////// FUNCTIONS //////////////
//////////////////////////////////////

/**
 *  General fetch function
 */
async function fetchData(url) {
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      // let the calling function decide what to do
      throw new Error('No response received');
    })
    .then((json) => {
      // console.log("fetchData()", JSON.stringify(json));
      return json;
    })
}
async function fetchFeelings() {

  let data = [];
  try {
    // get feelings data
    data = await fetchData("https://big-feelings.vercel.app/api/feelings");
    // if no data throw an error
    if (!data || data.length < 1)
      throw new Error("Issue retrieving data from Mongo");
  }
  catch (err) {
    console.error(`${err} - Problem retrieving feelings from database. Switching to test data...`);
    // catch any errors and use test file instead
    data = await fetchFeelingsJSON();
  }
  console.log("data", data)

  return data;
}
async function fetchFeelingsJSON() { return await fetchData("/assets/data/test-feelings.json"); }
async function fetchColors() { return await fetchData("./assets/data/colors.json"); }




function submitForm(e) {
  e.preventDefault();
  try {
    // 👉 add code inside this function (Chapter 10) ...

    let data = getFormData();
    console.log("data", data);
    if (data.feeling == "" || data.lat == "" || data.lng == "") {
      throw new Error("The feeling or location is missing");
    }

    // create options object to send data, options
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    // console.log("submit", data);
    fetch("/api/feeling", options)
      .then((response) => response.json())
      .then(async (json) => {
        console.log("/feeling", json);
        await updateMap(json);
        // await displayData(json);
        // await updateChart();
        showSuccessMsg("Your feeling was added", data.color);
      }).catch((err) => console.error("submitForm() error", err));

    // 👈
  } catch (e) {
    showSuccessMsg("Please add a feeling and select a location", "white");
  }
}



/**
 *  Gets form data
 */
function getFormData() {
  // references
  let location = document.querySelector("#location");
  // get checked option
  let id = document.querySelector('input[name="feelings"]:checked').id;

  // update
  let feeling = "";
  let color = "";

  // if the checked option is in colors.json
  if (id < colors.length) {
    feeling = colors[id].feeling;
    color = colors[id].color;
  } else {
    // they chose "addYourOwn"
    feeling = this.text.value;
    color = this.color.value;
  }
  // split the value of
  let [lat, lng] = location.value.split(",");
  // console.log(feeling, color, lat, lng);

  return {
    feeling: feeling,
    color: color,
    lat: lat,
    lng: lng,
  };
}


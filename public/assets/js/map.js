//////////////////////////////////////
/////////// INITIALIZE MAP ///////////
//////////////////////////////////////

// array to hold markers
let markerLayer = [];

// INITIALIZE MAP
var map = L.map("map", {
  center: [20, -25],
  zoom: 3,
});

// url for tileset
let tiles =
  "https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}";
tiles = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"

// add tile layer
L.tileLayer(tiles, {
  maxZoom: 14,
  minZoom: 2,
  // noWrap: true,
  // bounds: [
  //   [-90, -180],
  //   [90, 180]
  // ],
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

/**
 *  Called (by main.js) on load and after form submission
 */
function updateMap(data) {  
  
  // 👉 add code inside this function (Chapter 10) ...
  
  // remove all the markers
  removeMarkers();

  // loop through JSON
  for (let i = 0; i < data.length; i++) {
    // console.log(data[i]);
    
    // create marker and add to array
    markerLayer[i] = createMarker(data[i]);
  }
  
  // 👈
}

/**
 *  Create and add feeling   marker to map
 */
function createMarker(row) {
  let popupContent = `<span class="popup" style="color:${row.color};">${row.feeling}</span>`;
  let color = row.color;
  let marker = L.circleMarker([row.lat, row.lng], {
    radius: 50,
    stroke: false,
    color: row.color,
    fillOpacity: getFillOpacity(),
    className: "blur",
  });
 let popup = L.popup({className: "hello"}).setContent(popupContent);
  marker
    .addTo(map).bindPopup(popup)
    .on('click', function(){
      console.log("createMarker()", color)
      // updatePopupColor(color)
    });
  return marker;
}


function updatePopupColor(color){
      console.log("updatePopupColor()", color)
  let wrapper = document.querySelector(".leaflet-popup-content-wrapper");
  let tip = document.querySelector(".leaflet-popup-tip");  
  wrapper.style.backgroundColor = color;
  tip.style.backgroundColor = color;
  
  
  // let parent = document.querySelector(".leaflet-popup");
  // parent.style.backgroundColor = color;
  
}



//////////////////////////////////////
/////////////// EVENTS ///////////////
//////////////////////////////////////

// web form inside popup
let inputMarker;
let inputMarkerPopup = L.popup()
      .setLatLng(L.latLng([0,0]))
      .setContent(getInputMarkerPopup(L.latLng([0,0])))
      // .openOn(map);




function getInputMarkerPopup(latlng, show=false){
  
  return `<form class="popupInput">
  
          <div class="row">
            <div class="col">
              <div class="select-box">
                <div class="options-container"></div>
                <div class="selected">How do you feel?</div>
              </div>
            </div>
          </div>
          
          <div class="row addYourOwn">
            <div class="col">
              <div id="color-wrapper">
                <input
                  type="color"
                  id="color"
                  class="form-control"
                  value="#dd00dd"
                  title="Choose your color"
                />
              </div>
              <input
                type="text"
                id="text"
                class="form-control"
                style="width:85%"
                maxlength="140"
                placeholder="Share your feeling and a color"
                title="Add your text"
              />
            </div>
          </div>
          
          <div class="row mt-2">
            <div class="col">
              <input
                type="text"
                id="location"
                class="form-control w-100"
                maxlength="100"
                value="${latlng.lat},${latlng.lng}"
                placeholder="Zoom and click map to locate your feeling"
              />
            </div>
            <div class="col">
              <button type="button" class="btn btn-light w-100 submitBtn">Submit</button>
            </div>
          </div>
          
          <div class="row">
            <div class="msg text-center"></div>
          </div>
        </form>`;
}



map.on("click", (e) => {
  // wrap latlng (reset coordinates on dateline -180 and +180 degrees)
  let latlng = L.latLng([e.latlng.lat, e.latlng.lng]).wrap();
  // prevent specific locations
  latlng.lat = Number(latlng.lat.toPrecision(5));
  latlng.lng = Number(latlng.lng.toPrecision(5));

  // if (!inputMarker) {
  //   // inputMarker doesn't yet exist
  //   inputMarker = L.marker(latlng).addTo(map);
  // } else {
  //   // thereafter, update its position
  //   inputMarker.setLatLng(latlng).update();
  // }

  

  console.log(latlng);
  // inputMarkerPopup.setLatLng(latlng).setContent(latlng.toString()).openOn(map);
  inputMarkerPopup.setLatLng(latlng);
  map.openPopup(inputMarkerPopup);
  // updatePopupColor("white");
  let location = document.querySelector("#location");
  location.value = `${latlng.lat},${latlng.lng}`;
  
  document.querySelector(".submitBtn").addEventListener("click", submitForm);
  updateOptions(colors);
});

// close popups on zoom
map.on("zoomstart", (e) => {
  // map.closePopup();
});

// update marker opacity
map.on("zoomend", (e) => {
  markerLayer.forEach(function (marker, i) {
    marker.setStyle({ fillOpacity: getFillOpacity() });
  });
});

// // constrain viewport to map tiles (SW, NE) on drag
// let bounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));
// map.setMaxBounds(bounds);
// map.on("drag", function () {
//   map.panInsideBounds(bounds, { animate: false });
// });

//////////////////////////////////////
////////////// FUNCTIONS /////////////
//////////////////////////////////////

// removes all markers from the map
function removeMarkers() {
  // remove visible marker
  for (let i = 0; i < markerLayer.length; i++) {
    map.removeLayer(markerLayer[i]);
  }  
  // empty the array
  markerLayer = [];
}

function getFillOpacity() {
  return map.getZoom() / 25;
}
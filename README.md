# Big Feelings

<!-- Note: These instructions are the same across the two projects -->

A web map where users can share and locate their current emotional state (in text and color) on a world map.

## How does it work?

This project uses Node.js (backend) to returns data to the browser (frontend).

- `public/index.html`: The frontend for the API, uses client side JS to make requests to the server.
- `api/index.js`: [Node.js](https://nodejs.org/en/about/) runs Javascript in the backend using the Express framework to start the server and import the `routes.js` file
- `api/mongodb.js` creates the database connection
- `api/routes.js` contains the endpoints that return data
- `package.json`: Project dependencies

## Notes

- The finished version https://github.com/omundy/big-feelings
- The starter project https://github.com/criticalwebdesign/big-feelings-starter appears in Chapter 10 "Design & Power"in <em>Critical Web Design</em> by xtine burrough and Owen Mundy (MIT Press).


<hr>



## Production Notes

### Database(s)

- We first tried LowDB, which looks promising. However, Glitch [is currently @ Node 16](https://help.glitch.com/hc/en-us/articles/16287495688845-What-version-of-Node-can-I-use-and-how-do-I-change-update-upgrade-it) but the [latest Lowdb](https://github.com/typicode/lowdb/releases) (7.\*) doesn't support Node 16
- SQLite documentation: [Connect with Node.js](https://www.sqlitetutorial.net/sqlite-nodejs/connect/), [SQLite Codecademy Cheatsheet](https://www.codecademy.com/learn/connecting-javascript-and-sql/modules/learn-node-sqlite-module/cheatsheet)
- Switched to Vercel + MongoDB (Atlas) after the [Glitch announcement](https://www.theverge.com/news/673457/glitch-coding-platform-shutting-down) but results have been mixed. Connections don't seem to be reliable.



### Leaflet

In order to make the circle sizes appear constant relative to the interface we used [`L.circleMarker()`](https://leafletjs.com/reference.html#circlemarker-option) (radius in pixels) ...

```js
let marker = L.circleMarker([data[i].lat, data[i].lng], {
  radius: 50,
  stroke: false,
  color: "red",
  fillOpacity: 0.3,
});
```

... instead of [`L.circle()`](https://leafletjs.com/reference.html#circle) (radius in meters).

```js
var circle = L.circle([data[i].lat, data[i].lng], {
  radius: 350000,
  stroke: false,
  fillColor: "#f03",
  color: "red",
  fillOpacity: 0.3,
});
```

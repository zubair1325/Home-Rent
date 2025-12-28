// require("dotenv").config();
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/streets-v12",
  center: listing.geometry.coordinates,
  zoom: 9,
});

const marker1 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(
        `<h6>${listing.title}</h6> <p>Exact Location will be provided after booking</p>`
      )
      .setMaxWidth("300px")
  )
  .addTo(map);



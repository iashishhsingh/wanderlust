maptilersdk.config.apiKey = mapToken;

const map = new maptilersdk.Map({
  container: "map", // container's id or the HTML element in which the SDK will render the map
  style: maptilersdk.MapStyle.STREETS,
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 12, // starting zoom
});

const marker = new maptilersdk.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates) //Listing.geometry.coordinates
  .setPopup(
    new maptilersdk.Popup({ closeOnClick: false })
      .setHTML(`<h4>${listing.title}</h4><p>Exact Location provided after booking</p>`)
  )
  .addTo(map);

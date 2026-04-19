maptilerClient.config.apiKey = mapToken;

const map = new maptilerClient.Map({
  container: "map",
  style: maptilerClient.MapStyle.STREETS,
  center: listing.geometry.coordinates,
  zoom: 12,
});

new maptilerClient.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new maptilerClient.Popup({ closeOnClick: false }).setHTML(
      `<h4>${listing.title}</h4>
         <p>Exact Location provided after booking</p>`,
    ),
  )
  .addTo(map);

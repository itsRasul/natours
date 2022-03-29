/* eslint-disable */
// first time i tried to load map by mapbox but i couldn't
// the problme was about csp (Content-Security-Policy), i disabled security middlewares like helmet and xss-clean
// and generally disable csp and the problme is solved now!
document.addEventListener('DOMContentLoaded', function () {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );

  mapboxgl.accessToken =
    'pk.eyJ1IjoibXJyYXN1bCIsImEiOiJjbDFiN21ucjkwZTZwM2lwOHRla3pjdnA0In0.HImldK9ZCBZA_2RmRWQOsQ';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mrrasul/cl1c8nns4000n15s10lxuhobd',
    scrollZoom: false,
  });

  let bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // create a html marker and get it some styles
    const el = document.createElement('div');
    el.className = 'marker';

    // create a marker and add to map
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`${loc.description}`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      rigth: 100,
    },
  });

  console.log('hey');
});

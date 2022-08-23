// Client facing scripts here
function initMap() {
  //Map option
  let options = {
    center: { lat: 43.6532, lng: -79.3832 },
    zoom: 8,
  };

  const loadPoints = function () {
    const id = $("#map-id").val();
    $.get(`/maps/${id}/points`).then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        console.log(res.data[i]);
        addMarker(res.data[i]);
      }
    });
  };
  loadPoints();

  //New map
  map = new google.maps.Map(document.getElementById("map"), options);

  //Listen for click on map location
  google.maps.event.addListener(map, "click", (event) => {
    //add Marker
    addMarker({ location: event.latLng });
  });

  //Marker Array
  // let MarkerArray = [
  //   {
  //     location: { lat: 43.7315, lng: -79.7624 },
  //     content: `<h2>Brampton<h2>`,
  //   },
  //   {
  //     location: { lat: 43.2557, lng: -79.8711 },
  //     content: `<h2>Hamilton<h2>`,
  //   },
  //   {
  //     location: { lat: 44.6082, lng: -79.4187 },
  //     content: `<h2>Orillia<h2>`,
  //   },
  // ];

  // //Loop through marker
  // for (let i = 0; i < MarkerArray.length; i++) {
  //   addMarker(MarkerArray[i]);
  // }

  //Add Marker
  function addMarker(property) {
    const marker = new google.maps.Marker({
      position: property.location,
      map: map,
    });
    if (property.content) {
      const detailWindow = new google.maps.InfoWindow({
        content: property.content,
      });

      marker.addListener("mouseover", () => {
        detailWindow.open(map, marker);
      });
    }
  }
}

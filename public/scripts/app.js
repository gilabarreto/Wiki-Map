// Client facing scripts here
function initMap() {
  let detailWindow = new google.maps.InfoWindow();
  const markers = [];

  //Add Marker
  function addMarker(property) {
    const marker = new google.maps.Marker({
      position: property.location,
      map: map,
      content: property.content,
      delete: property.delete
    });

    if (property.content) {
      marker.addListener("mouseover", () => {
        detailWindow.setContent(property.content);
        detailWindow.open(map, marker);
      });
    }
    markers.push(marker)
  }
  //Map option
  let options = {
    center: { lat: 43.6532, lng: -79.3832 },
    zoom: 8,
  };

  const loadPoints = function () {
    const id = $("#map-id").val();
    $.get(`/maps/${id}/points`)
      .then((res) => {
        for (let i = 0; i < res.length; i++) {
          addMarker({
            location: {
              lat: parseFloat(res[i].latitude),
              lng: parseFloat(res[i].longitude),
            },
            content: `
            <h2>${res[i].title}</h2>
            <h2>${res[i].description}</h2>
            <form id="delete-point" action="/maps/${id}/points/delete" method="POST">
            <button type="submit">DELETE</button>
          </form>
            `
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  loadPoints();

  //New map
  map = new google.maps.Map(document.getElementById("map"), options);
  let counter = 0
  //Listen for click on map location
  google.maps.event.addListener(map, "click", (event) => {
    //add Marker
    const id = $("#map-id").val();

     let markersData = [
      {
        location: event.latLng,
        content: `<form id="add-point" action="/maps/${id}/points" method="POST">
    <label for="title">Title</label>
    <input type="text" name="title" placeholder="Enter place">
    <label for="description">Description</label>
    <input type="text" name="description" placeholder="Description">
    <button type="submit">Save</button>
    <button type="button" class="cancel-btn${counter}">Cancel</button>
    </form>`,
      },
    ];
    counter++;
    for (let i = 0; i < markersData.length; i++) {
      addMarker(markersData[i]);
    }

    // addMarker({
    //   location: event.latLng,
    //   content: `<form id="add-point" action="/maps/${id}/points" method="POST">
    //   <label for="title">Title</label>
    //   <input type="text" name="title" placeholder="Enter place">
    //   <label for="description">Description</label>
    //   <input type="text" name="description" placeholder="Description">
    //   <button type="submit">Save</button>
    //   <button type="button" class="cancel-btn">Cancel</button>
    //   </form>`,
    // });

    $("html").on("submit", "#delete-point", function (e) {
      const deletePoint = $("#delete-point").val();
      $.post(`/maps/${deletePoint}/points/delete`, {
        latitude: event.latLng.lat(),
        longitude: event.latLng.lng(),
        title: $(e.target).find("input[name='title']").val(),
        description: $(e.target).find("input[name='description']").val(),
      });
      detailWindow.close();
      loadPoints();
    });


    $("html").on("submit", "#add-point", function (e) {
      e.preventDefault();

      if (
        ($(e.target).find("input[name='title']").val() === "") |
        ($(e.target).find("input[name='description']").val() === "")
      ) {
        alert("Please enter valid place and description");
      } else {
        $.post(`/maps/${id}/points`, {
          latitude: event.latLng.lat(),
          longitude: event.latLng.lng(),
          title: $(e.target).find("input[name='title']").val(),
          description: $(e.target).find("input[name='description']").val(),
        });
      }
      detailWindow.close();
      loadPoints();
    });

    $("html").on("click", `#add-point .cancel-btn${counter - 1}`, function (event) {
      detailWindow.close();
      markers[markers.length - 1].setMap(null)
      markers.pop()
    });
  });
}

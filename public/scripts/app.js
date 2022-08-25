// Client facing scripts here
function initMap() {
  let detailWindow;
  //Add Marker
  function addMarker(property) {
    const marker = new google.maps.Marker({
      position: property.location,
      map: map,
      content: property.content
    });
    if (property.content) {
      console.log("content",property.content)
      detailWindow = new google.maps.InfoWindow({
      //   content: property.content,
      });
      console.log("detailwindow", detailWindow);
      marker.addListener("mouseover", () => {
        detailWindow.open(map, marker);
      });
    }
  }
  //Map option
  let options = {
    center: { lat: 43.6532, lng: -79.3832 },
    zoom: 8,
  };

  // const loadPoints = function () {
  //   const id = $("#map-id").val();
  //   // console.log({id})
  //   $.get(`/maps/${id}/points`)
  //     .then((res) => {
  //       console.log(res);

  //       const markers = res.map((obj) => {
  //         return {
  //           location: {
  //             lat: parseFloat(obj.latitude),
  //             lng: parseFloat(obj.longitude),
  //           },
  //           content: `
  //           <h2>${obj.title}</h2>
  //           <h2>${obj.description}</h2>`,
  //         };
  //       });
  //       console.log("markers", markers);
  //       markers.forEach((marker) => addMarker(marker));

  //       console.log(res);
  //       const test = res.map((obj) => {
  //         return {
  //           title: obj.title,
  //           description: obj.description,
  //         };
  //       });
  //       return test;
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // };
  // loadPoints();

  const loadPoints = function () {
    const id = $("#map-id").val();
    // console.log({id})
    $.get(`/maps/${id}/points`)
      .then((res) => {
        console.log(res)
        for (let i = 0; i < res.length; i++) {
          addMarker({
            location: {
              lat: parseFloat(res[i].latitude),
              lng: parseFloat(res[i].longitude),
            },
            content: `
            <h2>${res[i].title}</h2>
            <h2>${res[i].description}</h2>
            `,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  loadPoints();

  //New map
  map = new google.maps.Map(document.getElementById("map"), options);

  //Listen for click on map location
  google.maps.event.addListener(map, "click", (event) => {
    //add Marker
    const id = $("#map-id").val();

    console.log(event);

    addMarker({
      location: event.latLng,
      content: `<form id="add-point" action="/maps/${id}/points" method="POST">
      <label for="title">Title</label>
      <input type="text" name="title" placeholder="Enter place">
      <label for="description">Description</label>
      <input type="text" name="description" placeholder="Description">
      <button type="submit">Save</button>
      <button type="button" class="cancel-btn">Cancel</button>
      </form>`,
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

    $("html").on("click", "#add-point .cancel-btn", function (event) {
      detailWindow.close();
    });
  });
}

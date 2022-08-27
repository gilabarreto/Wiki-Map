// Client facing scripts here
function initMap() {

  //Add Marker Function
  function addMarker(property, clickEvent) {
    const marker = new google.maps.Marker({
      position: property.location,
      map: map,
      content: property.content,
      animation: google.maps.Animation.DROP,
      icon: {
        url: "https://images.emojiterra.com/google/android-pie/512px/1f954.png",
        scaledSize: new google.maps.Size(38, 31)
      }
    });

    if (property.content) {
      let detailWindow = new google.maps.InfoWindow();
      marker.addListener("click", () => {
        detailWindow.setContent(property.content);
        detailWindow.open(map, marker);
      });
      google.maps.event.addListener(detailWindow, "domready", function () {
        $(".cancel-btn").on("click", function (e) {
          marker.setMap(null);
        });
        $("#add-point").on("submit", function (e) {
          e.preventDefault();

          if (
            ($(e.target).find("input[name='title']").val() === "") |
            ($(e.target).find("input[name='description']").val() === "")
          ) {
            alert("Please enter valid place and description");
          } else {
            const id = $("#map-id").val();
            $.post(`/maps/${id}/points`, {
              latitude: clickEvent.latLng.lat(),
              longitude: clickEvent.latLng.lng(),
              title: $(e.target).find("input[name='title']").val(),
              description: $(e.target).find("input[name='description']").val(),
            }).then(() => {

              detailWindow.close();
              loadPoints();
            });
          }
        });
        $("#delete-point").on("submit", function(e) {
          e.preventDefault()
          console.log("Hi")
        })

      });
    }
  }

  //Map option
  let options = {
    center: { lat: 43.6532, lng: -79.3832 },
    zoom: 10,
  };

  // Function to LOAD POINTS
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
            <h1>${res[i].title}</h1>
            <h2>${res[i].description}</h2>
            <form id="delete-point" >
            <button type="submit">Delete</button></form>
            `,
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

  //Listen for click on map location
  google.maps.event.addListener(map, "click", (event) => {

    const id = $("#map-id").val();

    let markerData = [
      {
        location: event.latLng,
        content: `<form id="add-point" action="/maps/${id}/points" method="POST">
    <label for="title">Title</label>
    <input class="input-default" type="text" name="title" placeholder="Enter place">
    <label for="description">Description</label>
    <input class="input-default" type="text" name="description" placeholder="Description">
    <button type="submit">Save</button>
    <button type="button" class="cancel-btn">Cancel</button>
    </form>`,
      },
    ];

    for (let i = 0; i < markerData.length; i++) {
      addMarker(markerData[i],event);
    }

  });
}

// // Client facing scripts here
// function initMap() {
//   let detailWindow = new google.maps.InfoWindow();
//   const markers = [];

//   //Add Marker
//   function addMarker(property) {
//     const marker = new google.maps.Marker({
//       position: property.location,
//       map: map,
//       content: property.content,
//     });

//     if (property.content) {
//       marker.addListener("mouseover", () => {
//         detailWindow.setContent(property.content);
//         detailWindow.open(map, marker);
//       });
//     }
//     markers.push(marker)
//   }
//   //Map option
//   let options = {
//     center: { lat: 43.6532, lng: -79.3832 },
//     zoom: 8,
//   };

//   const loadPoints = function () {
//     const id = $("#map-id").val();
//     $.get(`/maps/${id}/points`)
//       .then((res) => {
//         for (let i = 0; i < res.length; i++) {
//           addMarker({
//             location: {
//               lat: parseFloat(res[i].latitude),
//               lng: parseFloat(res[i].longitude),
//             },
//             content: `
//             <h2>${res[i].title}</h2>
//             <h2>${res[i].description}</h2>
//             <form id="delete-point" action="/maps/${id}/points/delete" method="POST">
//             <button type="submit">DELETE</button>
//           </form>
//             `
//           });
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };
//   loadPoints();

//   //New map
//   map = new google.maps.Map(document.getElementById("map"), options);
//   let counter = 0
//   //Listen for click on map location
//   google.maps.event.addListener(map, "click", (event) => {
//     //add Marker
//     const id = $("#map-id").val();

//      let markersData = [
//       {
//         location: event.latLng,
//         content: `<form id="add-point" action="/maps/${id}/points" method="POST">
//     <label for="title">Title</label>
//     <input type="text" name="title" placeholder="Enter place">
//     <label for="description">Description</label>
//     <input type="text" name="description" placeholder="Description">
//     <button type="submit">Save</button>
//     <button type="button" class="cancel-btn${counter}">Cancel</button>
//     </form>`,
//       },
//     ];
//     counter++;
//     for (let i = 0; i < markersData.length; i++) {
//       addMarker(markersData[i]);
//     }

//     $("html").on("submit", "#delete-point", function (e) {
//       const deletePoint = $("#delete-point").val();
//       $.post(`/maps/${deletePoint}/points/delete`, {
//         latitude: event.latLng.lat(),
//         longitude: event.latLng.lng(),
//         title: $(e.target).find("input[name='title']").val(),
//         description: $(e.target).find("input[name='description']").val(),
//       });
//       detailWindow.close();
//       loadPoints();
//     });


//     $("html").on("submit", "#add-point", function (e) {
//       e.preventDefault();

//       if (
//         ($(e.target).find("input[name='title']").val() === "") |
//         ($(e.target).find("input[name='description']").val() === "")
//       ) {
//         alert("Please enter valid place and description");
//       } else {
//         $.post(`/maps/${id}/points`, {
//           latitude: event.latLng.lat(),
//           longitude: event.latLng.lng(),
//           title: $(e.target).find("input[name='title']").val(),
//           description: $(e.target).find("input[name='description']").val(),
//         });
//       }
//       detailWindow.close();
//       loadPoints();
//     });

//     $("html").on("click", `#add-point .cancel-btn${counter - 1}`, function (event) {
//       detailWindow.close();
//       markers[markers.length - 1].setMap(null)
//       markers.pop()
//     });
//   });
// }

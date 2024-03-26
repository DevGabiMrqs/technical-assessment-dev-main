import GeoLib from "./lib";

const API_KEY = "AIzaSyAGWvk3lA8cubNjtu8-7ghDOwTcc5wR1EY";

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 30, lng: -110 },
    zoom: 8,
  });

  let coordinatesPromise;
  if (locationData.address) {
    coordinatesPromise = GeoLib.getCoordinatesFromAddress(
      locationData.address,
      API_KEY,
    );
  } else if (locationData.coordinates) {
    coordinatesPromise = Promise.resolve(locationData.coordinates);
  } else {
    console.error("No address or coordinates provided.");
    return;
  }

  coordinatesPromise
    .then((coordinates) => {
      new google.maps.Marker({
        position: coordinates,
        map: map,
        title: "Location Resolved",
      });
    })
    .catch((error) => {
      console.error("Error resolving the location:", error);
    });
}

window.onload = () => {
  // Exemplo de uso com endereço
  // initMap({ address: "1600 Amphitheatre Parkway, Mountain View, CA" });

  // Exemplo de uso com coordenadas
  initMap({ coordinates: { lat: 37.4224764, lng: -122.0842499 } });

  // Você pode substituir os exemplos acima com os dados fornecidos pelo usuário
  // initMap({ address: userProvidedAddress });
  // ou
  // initMap({ coordinates: userProvidedCoordinates });
};

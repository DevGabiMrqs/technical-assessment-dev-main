import axios from "axios";

class GeoLib {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async getAddressFromCoordinates(
    coordinates: [number, number] | { lat: number; lng: number },
  ): Promise<string> {
    const [lat, lng] = Array.isArray(coordinates)
      ? coordinates
      : [coordinates.lat, coordinates.lng];
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`,
    );
    const address = response.data.results[0].formatted_address;
    return address;
  }

  public async getCoordinatesFromAddress(
    address: string,
  ): Promise<{ lat: number; lng: number }> {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`,
    );
    const location = response.data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
  }
}

export default GeoLib;

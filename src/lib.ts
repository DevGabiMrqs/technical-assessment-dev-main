class GeoLib {
  public getAddressFromCoordinates(
    coordinates: [number, number] | { lat: number; lng: number },
  ): Promise<string> {
    const address = this.convertCoordinatesToAddress(coordinates);
    return Promise.resolve(address);
  }

  public getCoordinatesFromAddress(
    address: string,
  ): Promise<{ lat: number; lng: number }> {
    const coordinates = this.convertAddressToCoordinates(address);
    return Promise.resolve(coordinates);
  }

  private convertCoordinatesToAddress(
    coordinates: [number, number] | { lat: number; lng: number },
  ): string {
    if (Array.isArray(coordinates)) {
      return `Latitude: ${coordinates[0]}, Longitude: ${coordinates[1]}`;
    } else {
      return `Latitude: ${coordinates.lat}, Longitude: ${coordinates.lng}`;
    }
  }

  private convertAddressToCoordinates(address: string): {
    lat: number;
    lng: number;
  } {
    // Simulando uma conversão fictícia de endereço para coordenadas
    return { lat: 37.7749, lng: -122.4194 };
  }
}

export default new GeoLib();

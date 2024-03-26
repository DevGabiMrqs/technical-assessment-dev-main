class GeoLib {
  public getAddressFromCoordinates(
    coordinates: [number, number] | { lat: number; lng: number },
  ): Promise<string> {
    return Promise.resolve("Rua teste");
    // return Promise.reject(new Error("Not implemented"));
  }

  public getCoordinatesFromAddress(
    address: string,
  ): Promise<{ lat: number; lng: number }> {
    return Promise.resolve({ lat: 1651, lng: 5416 });
    // return Promise.reject(new Error("Not implemented"));
  }
}

export default new GeoLib();

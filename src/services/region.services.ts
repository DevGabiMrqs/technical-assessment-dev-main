import { RegionModel } from "../models/region.models";

type RegionData = {
  _id: string;
  name: string;
  user: string;
  polygonCoordinates: number[][];
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

export class RegionService {
  async createRegion({
    _id,
    name,
    user,
    polygonCoordinates,
  }: RegionData): Promise<string> {
    const region = new RegionModel({
      _id,
      name,
      user,
      polygonCoordinates,
    });
    await region.save();
    return region._id;
  }

  async getRegion() {
    const res = await RegionModel.find();
    return res;
  }

  async getRegionById(regionId: string): Promise<RegionData | null> {
    return await RegionModel.findById(regionId).lean();
  }

  async updateRegion(
    regionId: string,
    newData: Partial<RegionData>,
    session: any,
  ): Promise<RegionData | null> {
    const region = await RegionModel.findByIdAndUpdate(regionId, newData, {
      new: true,
      session,
    });
    await session.commitTransaction();
    return region ? (region as RegionData) : null;
  }

  async deleteRegion(regionId: string): Promise<RegionData | null> {
    const region = await RegionModel.findByIdAndDelete(regionId);
    if (!region) {
      return null;
    }
    return region.toObject();
  }

  async getRegionsByCoordinates({ latitude, longitude }: Coordinates) {
    try {
      const region = await RegionModel.find({
        polygonCoordinates: {
          $geoIntersetics: {
            $geometry: {
              type: "Point",
              coordinates: [
                [
                  [longitude, latitude],
                  [longitude, latitude],
                  [longitude, latitude],
                  [longitude, latitude],
                ],
              ],
            },
          },
        },
      }).populate("user");
      return region;
    } catch (error) {
      console.error("Error listing regions by coordinates:", error);
      throw error;
    }
  }

  async getNearByRegion({ latitude, longitude }: Coordinates) {
    try {
      const regions = await RegionModel.find({
        polygonCoordinates: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], 1 / 6371],
          },
        },
      }).populate("user");
      return regions;
    } catch (error) {
      console.error("Error listing nearby regions:", error);
      throw error;
    }
  }
}

export default new RegionService();

import { Request, Response } from "express";
import { RegionModel } from "../models";

export async function createRegion(req: Request, res: Response) {
  try {
    const regionData = req.body;
    const newRegion = await RegionModel.create(regionData);
    res.status(201).json(newRegion);
  } catch (error) {
    console.error("Error creating region:", error);
    res.status(500).json({ message: "Failed to create region" });
  }
}

export async function getRegions(req: Request, res: Response) {
  try {
    const regions = await RegionModel.find();
    res.json(regions);
  } catch (error) {
    console.error("Error fetching regions:", error);
    res.status(500).json({ message: "Failed to fetch regions" });
  }
}

export async function getRegionById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const region = await RegionModel.findById(id);
    if (!region) {
      return res.status(404).json({ message: "Region not found" });
    }
  } catch (error) {
    console.error("Error fetching region:", error);
    res.status(500).json({ message: "Failed to fetch region" });
  }
}

export async function updateRegion(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedRegion = await RegionModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedRegion) {
      return res.status(404).json({ message: "Region not found" });
    }
  } catch (error) {
    console.error("Error updating region:", error);
    res.status(500).json({ message: "Failed to update region" });
  }
}

export async function deleteRegion(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deletedRegion = await RegionModel.findByIdAndDelete(id);
    if (!deletedRegion) {
      return res.status(404).json({ message: "Region not found" });
    }
  } catch (error) {
    console.error("Error deleting region:", error);
    res.status(500).json({ message: "Failed to delete region" });
  }
}

export async function getRegionsByCoordinates(req: Request, res: Response) {
  try {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }
    const regions = await RegionModel.find({
      polygonCoordinates: {
        $geoIntersects: {
          $geometry: {
            type: "Point",
            coordinates: [
              parseFloat(longitude.toString()),
              parseFloat(latitude.toString()),
            ],
          },
        },
      },
    }).populate("user");
    return res.json({ regions });
  } catch (error) {
    console.error("Error listing regions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getNearbyRegion(req: Request, res: Response) {
  try {
    const { latitude, longitude, distance } = req.query;

    if (!latitude || !longitude || !distance) {
      return res
        .status(400)
        .json({ message: "Latitude, longitude, and distance are required" });
    }

    const regions = await RegionModel.find({
      polygonCoordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              parseFloat(longitude.toString()),
              parseFloat(latitude.toString()),
            ],
          },
          $maxDistance: parseFloat(distance.toString()),
        },
      },
    }).populate("user");

    return res.json({ regions });
  } catch (error) {
    console.error("Error listing regions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

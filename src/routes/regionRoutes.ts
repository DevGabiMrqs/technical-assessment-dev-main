import express, { Request, Response } from "express";
import { RegionModel } from "../models";
import {
  createRegion,
  getRegions,
  getRegionById,
  updateRegion,
  deleteRegion,
} from "../controllers/region.controller";

const router = express.Router();

router.post("/regions", createRegion);
router.get("/regions", getRegions);
router.get("/regions/:id", getRegionById);
router.put("/regions/:id", updateRegion);
router.delete("/regions/:id", deleteRegion);

router.get("/regions/contains", async (req: Request, res: Response) => {
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
});

router.get("/regions/nearby", async (req: Request, res: Response) => {
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
});

export default router;

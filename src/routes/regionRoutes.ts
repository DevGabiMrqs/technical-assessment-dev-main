import express, { Request, Response } from "express";
import { RegionModel } from "../models";
import {
  createRegion,
  getRegions,
  getRegionById,
  updateRegion,
  deleteRegion,
  getRegionsByCoordinates,
  getNearbyRegion,
} from "../controllers/region.controller";

const router = express.Router();

router.post("/", createRegion);
router.get("/", getRegions);
router.get("/contains", getRegionsByCoordinates);
router.get("/nearby", getNearbyRegion);
router.get("/:id", getRegionById);
router.put("/:id", updateRegion);
router.delete("/:id", deleteRegion);

export default router;

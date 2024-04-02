import { Request, Response } from "express";
import { RegionService } from "../services/region.services";
import { StatusCodes } from "http-status-codes";
import { startSession } from "mongoose";

const regionService = new RegionService();

export async function createRegion(req: Request, res: Response) {
  try {
    const regionData = req.body;
    const newRegion = await regionService.createRegion(regionData);
    return res.status(StatusCodes.CREATED).json(newRegion);
  } catch (error) {
    console.error("Error creating region:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to create region" });
  }
}

export async function getRegions(req: Request, res: Response) {
  try {
    const regions = await regionService.getRegion();
    console.log(regions, "vixi");
    return res.status(StatusCodes.OK).json({ list: regions });
  } catch (error) {
    console.error("Error fetching regions:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch regions" });
  }
}

export async function getRegionById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const region = await regionService.getRegionById(id);
    if (!region) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Region not found" });
    }
    return res.json(region);
  } catch (error) {
    console.error("Error fetching region:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch region" });
  }
}

export async function updateRegion(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const session = await startSession();
    session.startTransaction();
    const updatedRegion = await regionService.updateRegion(
      id,
      updateData,
      session,
    );
    session.endSession();
    if (!updatedRegion) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Region not found" });
    }
    await session.commitTransaction();
    session.endSession();
    return res.json(updatedRegion);
  } catch (error) {
    console.error("Error updating region:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to update region" });
  }
}

export async function deleteRegion(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deletedRegion = await regionService.deleteRegion(id);
    if (!deletedRegion) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Region not found" });
    }
  } catch (error) {
    console.error("Error deleting region:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to delete region" });
  }
}

export async function getRegionsByCoordinates(req: Request, res: Response) {
  try {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Latitude and longitude are required" });
    }
    const regions = await regionService.getRegionsByCoordinates({
      latitude: parseFloat(latitude.toString()),
      longitude: parseFloat(longitude.toString()),
    });
    return res.json({ regions });
  } catch (error) {
    console.error("Error listing regions:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
}

export async function getNearbyRegion(req: Request, res: Response) {
  try {
    const { latitude, longitude, distance } = req.query;

    if (!latitude || !longitude || !distance) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Latitude, longitude, and distance are required" });
    }

    const regions = await regionService.getNearByRegion({
      latitude: parseFloat(latitude.toString()),
      longitude: parseFloat(longitude.toString()),
    });
    return res.json({ regions });
  } catch (error) {
    console.error("Error listing nearby regions:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
}

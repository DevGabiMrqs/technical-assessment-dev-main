import "reflect-metadata";

import * as mongoose from "mongoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { UserModel, User } from "../models/user.models";
import {
  pre,
  getModelForClass,
  Prop,
  Ref,
  modelOptions,
} from "@typegoose/typegoose";
import lib from "../lib";

import ObjectId = mongoose.Types.ObjectId;

class Base extends TimeStamps {
  @Prop({ required: true, default: () => new ObjectId().toString() })
  _id: string;
}

function validateGeoJSONCoordinates(value: any): boolean {
  if (!Array.isArray(value)) {
    return false;
  }
  for (const coordinate of value) {
    if (!Array.isArray(coordinate) || coordinate.length !== 2) {
      return false;
    }
    const [longitude, latitude] = coordinate;
    if (typeof longitude !== "number" || typeof latitude !== "number") {
      return false;
    }
    if (
      longitude < -180 ||
      longitude > 180 ||
      latitude < -90 ||
      latitude > 90
    ) {
      return false;
    }
  }
  return true;
}
@pre<Region>("save", async function (next) {
  const region = this as Omit<any, keyof Region> & Region;

  if (!region._id) {
    region._id = new ObjectId().toString();
  }

  if (region.isNew) {
    const user = await UserModel.findOne({ _id: region.user });
    if (user) {
      user.regions.push(region._id);
      await user.save({ session: region.$session() });
    } else {
      console.error("Usuário não encontrado.");
    }
  }

  next(region.validateSync());
})
@pre<Region>("save", async function (next) {
  const region = this as Omit<any, keyof Region> & Region;

  if (region.isModified("coordinates")) {
    region.address = await lib.getAddressFromCoordinates(region.coordinates);
  } else if (region.isModified("address")) {
    const { lat, lng } = await lib.getCoordinatesFromAddress(region.address);

    region.coordinates = [lng, lat];
  }

  next();
})
@modelOptions({ schemaOptions: { validateBeforeSave: false } })
export class Region extends Base {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ type: () => String })
  user: Ref<User>;

  @Prop({
    type: [[Number]],
    required: true,
    validate: validateGeoJSONCoordinates,
  })
  polygonCoordinates!: number[][];
}

export const RegionModel = getModelForClass(Region);

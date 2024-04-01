import "reflect-metadata";

import * as mongoose from "mongoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Region } from "../models/region.models";
import { getModelForClass, Prop, Ref } from "@typegoose/typegoose";
import lib from "../lib";

import ObjectId = mongoose.Types.ObjectId;

class Base extends TimeStamps {
  @Prop({ required: true, default: () => new ObjectId().toString() })
  _id: string;
}

export class User extends Base {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, type: () => [Number] })
  coordinates: [number, number];

  @Prop({ type: () => String })
  regions: Ref<Region>[];
}

export const UserModel = getModelForClass(User);

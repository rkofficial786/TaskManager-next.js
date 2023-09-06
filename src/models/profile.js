import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema({
  phone: {
    type: Number,
  },
  about: String,
});

export const Profile =
  mongoose.models.profile || mongoose.model("profile", profileSchema);

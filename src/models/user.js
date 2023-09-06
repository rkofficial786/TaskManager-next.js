import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: { type: String, required: true },

  password: { type: String, required: true },
   
  profile:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'profile',
    required: true,
  }


});

export const User = mongoose.models.users || mongoose.model("users", userSchema);

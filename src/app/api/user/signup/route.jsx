import { connectDb } from "@/helper/db";
import { NextResponse } from "next/server";

import bcrypt from "bcrypt";
import { Profile } from "@/models/profile";
import { OTP } from "@/models/otp";
import { User } from "../../../../models/user";
connectDb();

//signup user
export async function POST(req, res) {
  const { name, email, password, otp } = await req.json();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        message: "User already exists",
        success: false,
      });
    }
    console.log("name", name);
    const userOtp = await OTP.find({
      email,
    })
      .sort({ createAt: -1 })
      .limit(1);

    if (!userOtp) {
      return NextResponse.json({
        message: "otp not found",
        success: false,
      });
    }

    if (otp !== userOtp[0].otp) {
      return NextResponse.json({
        message: "otp is invalid",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileDetails = new Profile({
      phone: null,
      about: null,
    });

    await profileDetails.save();

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
      profile: profileDetails._id,
    });

    const createdUser = await user.save();
    console.log(createdUser);
    return NextResponse.json(
      {
        user: createdUser,
        success: true,
        message: "User created successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    throw new Error(error.message);
  }
}

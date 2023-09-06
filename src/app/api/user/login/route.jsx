import { connectDb } from "@/helper/db";
import { User } from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

connectDb();
export async function POST(req, res) {
  try {
    const { email, password } =await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 403 }
      );
    }

    //check if user exists  already

    const user = await User.findOne({ email: email })
      .populate("profile")
      .exec();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User does not exist",
        },
        { status: 403 }
      );
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      user.token = token;
      user.password = undefined;

      //create cookie

      const options = {
        expires: new Date(Date.now(+3 * 24 * 60 * 60 * 1000)),
        httpOnly: true,
      };
      return NextResponse.json(
        {
          success: true,
          token,
          user,
          message: "Logged in successfully",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json({
        success: false,
        message: "Password Incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    NextResponse.json({
      success: false,
      message: "Login Failed",
    });
  }
}

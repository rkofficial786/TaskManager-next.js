import { Profile } from "@/models/profile";
import { User } from "@/models/user";
import { NextResponse } from "next/server";

//get user details
export async function GET(req, { params }) {
  try {
    const { userId } = params;

    const user = await User.findById(userId);

    return NextResponse.json(
      {
        user,
        message: "User fetch Success",
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    throw new Error(error);
  }
}

export async function POST(req, { params }) {
  try {
    const { userId } = params;

    const { phone, about } = await req.json();

    console.log("phone", phone);

    const user = await User.findById(userId);

    const profile = await Profile.findById(user.profile);

    profile.phone = phone;
    profile.about = about;

    await profile.save();

    const updatedUser = await User.findById(userId).populate("profile").exec();

    return NextResponse.json(
      {
        user: updatedUser,
        message: "UserDetails fetch Success",
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    throw new Error(error);
  }
}

export async function DELETE(req, { params }) {
  try {
    const { userId } = params;

    await User.deleteOne({ _id: userId });

   return NextResponse.json(
      { success: true, message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    throw new Error(error);
  }
}

import { connectDb } from "@/helper/db";
import { mailSender } from "@/helper/mailSender";
import { OTP } from "@/models/otp";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import otpGenerator from "otp-generator";

connectDb();

export async function POST(req, res) {
  try {
    const { email } = await req.json();

    var otpgenerated = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const existingOtp = await OTP.findOne({ otp: otpgenerated });

    while (existingOtp) {
      otpgenerated = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
      });
    }
   

    const otp = new OTP({
      email: email,
      otp: otpgenerated,
    });

    const newOtp = await otp.save();
    await mailSender(email,"verification Email" ,`OTP is ${otpgenerated}`)
    return NextResponse.json({
      otp: newOtp,
      success: true,
      message: "Otp generated successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
}

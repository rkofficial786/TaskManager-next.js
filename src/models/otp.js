import { mailSender } from "@/helper/mailSender";
import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5,
  },
});

// async function sendVerificationEmail(email, otp) {
//   try {
//     const mailResponse = await mailSender(
//       email,
//       "Verification Email",
//       `otp is ${otp}`
//     );
//     console.log("email sent successfully", mailResponse.response);
//   } catch (error) {
//     console.log("error while sending mail", error);
//   }
// }


// otpSchema.pre("save", async function (next) {
//   console.log("New document saved to database");

//   // Only send an email when a new document is created
//   if (this.isNew) {
//     await sendVerificationEmail(this.email, this.otp);
//   }
//   next();
// });

export const OTP = mongoose.models.otp || mongoose.model("otp", otpSchema);

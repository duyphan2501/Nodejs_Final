import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    purchasePoint: { type: Number, default: 0 },
    password: { type: String, required: true },
    forgotPasswordToken: String,
    forgotPasswordTokenExpireAt: Date,
    phone: String,
    verificationToken: String,
    verificationTokenExpireAt: Date,
    refreshToken: String,
    refreshTokenExpireAt: Date,
    avatar: String,
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "users" }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;

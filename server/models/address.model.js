import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    receiver: { type: String, required: true },
    phone: { type: String, required: true },
    ward: { type: String, required: true },
    province: { type: String, required: true },
    addressDetail: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    addressType: { type: String, enum: ["home", "office"], default: "home" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, collection: "addresses" }
);
const AddressModel = mongoose.model("Address", addressSchema);

export default AddressModel

import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    ipAddress: { type: String },

    deviceType: {
      type: String,
      enum: ["desktop", "mobile", "tablet", "unknown"],
      default: "unknown",
    },

    browser: { type: String },

    page: { type: String },

    visitedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "visits",
  }
);

const VisitModel = mongoose.model("Visit", visitSchema);

export default VisitModel;

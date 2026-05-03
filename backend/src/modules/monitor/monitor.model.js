import mongoose from "mongoose";

const monitorSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    method: {
      type: String,
      default: "GET"
    },
    interval: {
      type: Number,
      default: 60000
    }, // ms (60s)
    active: {
      type: Boolean,
      default: true
    }
    // later: userId, regions, headers, auth, etc.
  },
  { timestamps: true }
);

// fast lookup by activity
monitorSchema.index({ active: 1 });

export default mongoose.model("Monitor", monitorSchema);
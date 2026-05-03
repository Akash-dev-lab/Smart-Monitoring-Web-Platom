import mongoose from "mongoose";

const aiSchema = new mongoose.Schema({
  monitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monitor"
  },
  incidentId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Incident"
  },
  status: String,
  reason: String,
  suggestion: [String]
}, { timestamps: true });

export default mongoose.model("AIInsight", aiSchema);
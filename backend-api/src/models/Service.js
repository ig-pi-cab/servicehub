const mongoose = require("mongoose");

const dynamicQuestionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    required: { type: Boolean, default: false },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: { type: String },
    price: { type: String },
    durationMinutes: { type: Number },
    providerRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: { type: String },
    locationType: {
      type: String,
      enum: ["online", "presencial", "ambos"],
      default: "ambos",
    },
    isActive: { type: Boolean, default: true },
    customQuestions: [dynamicQuestionSchema],
  },
  { timestamps: true }
);
serviceSchema.index({ name: "text", description: "text" });
module.exports = mongoose.model("Service", serviceSchema);

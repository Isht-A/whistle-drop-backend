const mongoose = require("mongoose");
const crypto = require("crypto");

const CATEGORIES = [
  "Security",
  "Harassment",
  "Corruption",
  "Technical",
  "Other"
];

const STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "RESOLVED",
  "DISMISSED"
];

function generateCaseCode() {
  const hex = crypto.randomBytes(6).toString("hex").toUpperCase();
  return `WD-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
}

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: STATUSES,
      required: true
    },
    moderatorNote: {
      type: String,
      required: true,
      trim: true
    },
    recordedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const reportSchema = new mongoose.Schema(
  {
    caseCode: {
      type: String,
      unique: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      enum: CATEGORIES
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    evidenceUrl: {
      type: String,
      default: null,
      trim: true
    },
    status: {
      type: String,
      enum: STATUSES,
      default: "SUBMITTED"
    },
    statusHistory: [statusHistorySchema]
  },
  {
    timestamps: true
  }
);

reportSchema.pre("save", function (next) {
  if (!this.caseCode) {
    this.caseCode = generateCaseCode();
  }
  if (typeof next === "function") next();
});

module.exports = mongoose.model("Report", reportSchema);
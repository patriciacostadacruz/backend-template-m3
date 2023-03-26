const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please write the title of your project."],
    },
    status: {
      type: String,
      required: true,
      enum: [
        "active",
        "initiation",
        "planning",
        "execution",
        "on hold",
        "closure stage",
        "closed",
      ],
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please add the project description."],
    },
    industry: {
      type: String,
      enum: [
        "All",
        "Agriculture",
        "Chems and materials",
        "Communication",
        "Construction",
        "Consumer goods and retail",
        "Consumer services",
        "Energy and environment",
        "Financial services",
        "Infrastructures",
        "Life science",
        "Real estate",
        "Transportation",
        "Digital mark",
        "IT/Tech",
        "Electronics",
        "Other",
      ],
      required: [true, "Please select the industries your work with."],
    },
    fundingNeeded: {
      type: String,
      required: [
        true,
        "Please select the type of funding you are looking for.",
      ],
      enum: ["pre-seed", "angel", "seed", "serie A, B or C", "none"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    investors: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Project", projectSchema);
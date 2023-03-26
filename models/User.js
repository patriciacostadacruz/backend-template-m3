const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please write your first name."],
    },
    lastName: {
      type: String,
      required: [true, "Please write your last name."],
    },
    image: {
      type: String,
      default:
        "https://www.atomos.co.uk/getmedia/ec2d2ef0-71ea-40b8-a76c-6eb00c0cc210/portrait_placeholder_6.png?width=600&height=600&ext=.png",
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please add your email."],
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: [true, "Please write your password."],
    },
    role: {
      type: String,
      enum: ["investee", "investor"],
      default: "investee",
      required: [true, "Please select your role."],
    },
    linkedIn: {
      type: String,
      unique: true,
    },
    company: {
      type: String,
      required: [
        true,
        "Please write the name of your company or the company for which you work.",
      ],
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
        "Other"
      ],
      required: [true, "Please select the industries your work with."]
    },
    bio: {
      type: String,
      required: [true, "Please write your biography."],
      maxLength: 600,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
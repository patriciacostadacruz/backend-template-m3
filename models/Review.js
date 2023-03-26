const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reviewSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, "Please add the review's title."]
		},
		rating: {
			type: Number,
			required: true,
			min: 0,
			max: 5
		},
		comment: {
			type: String,
			required: [true, "Please add your comments."],
			maxLength: 350
		},
		personRating: {
			type: Schema.Types.ObjectId,
  	  ref: "User",
  	  required: true,
		},
		personRated: {
			type: Schema.Types.ObjectId,
  	  ref: "User",
  	  required: true,
		}
	},
	{
		timestamps: true
	}
);

module.exports = model("Review", reviewSchema);
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const messageSchema = new Schema(
	{
	  sender: {
	    type: Schema.Types.ObjectId,
	    ref: "User",
	    required: true,
	  },
	  recipient: {
	    type: Schema.Types.ObjectId,
	    ref: "User",
	    required: true,
	  },
	  project: {
	    type: Schema.Types.ObjectId,
	    ref: "Project",
	    required: true,
	  },
		message: {
			type: String,
			required: [true, "Please write your message."]
		}
	},
	{
		timestamps: true,
	}
);

module.exports = model("Message", messageSchema);
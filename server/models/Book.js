const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, default: "General" },
  status: {
    type: String,
    enum: ["to-read", "reading", "completed"],
    default: "to-read"
  },
  notes: [noteSchema]
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);

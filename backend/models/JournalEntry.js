import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema({
  username: { type: String, required: true }, // store username
  title: { type: String, required: true },
  dream: { type: String, required: true },
  tags: [String],
  mood: { type: String },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("JournalEntry", journalEntrySchema);

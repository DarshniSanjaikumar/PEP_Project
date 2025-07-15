import express from "express";
import JournalEntry from "../models/JournalEntry.js";
import cookieParser from "cookie-parser";
const router = express.Router();

// Save Journal Entry
router.post("/", async (req, res) => {
  const username = req.cookies?.user_name;

  if (!username) return res.status(401).json({ message: "Unauthorized: No username cookie" });

  const { title, dream, tags, mood } = req.body;

  try {
    const entry = new JournalEntry({
      username,
      title,
      dream,
      tags,
      mood,
    });
    await entry.save();
    res.status(201).json({ message: "Journal entry saved", entry });
  } catch (err) {
    console.error("Save failed:", err);
    res.status(500).json({ message: "Error saving entry" });
  }
});

// Get All Entries for Logged-in User
router.get("/", async (req, res) => {
  const username = req.cookies?.user_name;

  if (!username) return res.status(401).json({ message: "Unauthorized: No username cookie" });

  try {
    const entries = await JournalEntry.find({ username }).sort({ date: -1 });
    res.status(200).json(entries);
  } catch (err) {
    console.error("Fetch failed:", err);
    res.status(500).json({ message: "Error fetching entries" });
  }
});

// Update Journal Entry
router.put("/:id", async (req, res) => {
  const username = req.cookies?.user_name;
  const { id } = req.params;

  if (!username) return res.status(401).json({ message: "Unauthorized: No username cookie" });

  const { title, dream, tags, mood } = req.body;

  try {
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: id, username }, // Ensure user can only update their own entries
      { title, dream, tags, mood },
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({ message: "Entry not found or unauthorized" });
    }

    res.status(200).json({ message: "Journal entry updated", entry });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ message: "Error updating entry" });
  }
});

// Delete Journal Entry
router.delete("/:id", async (req, res) => {
  const username = req.cookies?.user_name;
  const { id } = req.params;

  if (!username) return res.status(401).json({ message: "Unauthorized: No username cookie" });

  try {
    const entry = await JournalEntry.findOneAndDelete({ _id: id, username });

    if (!entry) {
      return res.status(404).json({ message: "Entry not found or unauthorized" });
    }

    res.status(200).json({ message: "Journal entry deleted" });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ message: "Error deleting entry" });
  }
});

export default router;
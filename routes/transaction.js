import express from "express";
import Transaction from "../models/transactionschema.js";
import mongoose from "mongoose";

const router = express.Router();

// Tranzaksiya yaratish
router.post("/", async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      user: req.user.id
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

// Barcha tranzaksiyalarni olish
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tranzaksiyani tahrirlash
router.put("/:id", async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title: req.body.title, amount: req.body.amount, type: req.body.type },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tranzaksiyani o'chirish
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Statistika
router.get("/stats", async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
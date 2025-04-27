import mongoose from "mongoose";

const scrapedValueSchema = new mongoose.Schema({
  value: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
});

const scrapedValueModel = mongoose.model("ScrapedValue", scrapedValueSchema);

export default scrapedValueModel;

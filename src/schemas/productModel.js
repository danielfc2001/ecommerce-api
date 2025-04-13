import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    alterCurrency: { type: Boolean },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true },
    isOffer: { type: Boolean, required: true },
    offerDiscount: { type: Number },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("Products", productSchema);

export default productModel;

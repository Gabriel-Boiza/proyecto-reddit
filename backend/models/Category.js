import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    parent_name: { type: String, default: null }
  },
  {
    collection: "categories"
  }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;

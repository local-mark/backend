import express from "express";
import asyncHandler from "express-async-handler";
import {
  uploadProduct,
  modifyProduct,
  removeProduct,
} from "../controllers/product.controller.js";

export const productRouter = express.Router({ mergeParams: true });

productRouter.post("", asyncHandler(uploadProduct));
productRouter.patch("/:id", asyncHandler(modifyProduct));
productRouter.delete("/:id", asyncHandler(removeProduct));

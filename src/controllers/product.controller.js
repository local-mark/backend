import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import {
  createProduct,
  updateProductDetails,
  deleteProductById,
} from "../services/product.service.js";

export const uploadProduct = async (req, res, next) => {
  console.log("상품 등록 API");
  console.log("body: ", req.body);

  res.send(response(status.SUCCESS, await createProduct(req.body)));
};

export const modifyProduct = async (req, res, next) => {
  console.log("상품 수정 API");
  console.log("body: ", req.body);

  res.send(
    response(
      status.SUCCESS,
      await updateProductDetails(req.params.id, req.body)
    )
  );
};

export const removeProduct = async (req, res, next) => {
  console.log("상품 삭제 API");

  res.send(response(status.SUCCESS, await deleteProductById(req.params.id)));
};

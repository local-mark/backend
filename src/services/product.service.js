import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import {
  addProduct,
  addCategoryToProduct,
  addColorToProduct,
  addSizeToProduct,
  setCategoryToProduct,
  deleteColorToProduct,
  deleteSizeToProduct,
  getProduct,
  getColor,
  getSize,
  updateProduct,
  deleteProduct,
} from "../models/product.dao.js";
import {
  uploadProductResponseDTO,
  editProductResponseDTO,
} from "../dtos/product.dto.js";

export const createProduct = async (body) => {
  const joinProductData = await addProduct({
    brand_id: body.brand_id,
    name: body.name,
    thumbnail_url: body.thumbnail_url,
    price: body.price,
    discount_rate: body.discount_rate,
    delivery_fee: body.delivery_fee,
    description: body.description,
    status: body.status,
  });
  if (joinProductData == -1) {
    throw new BaseError(status.BRAND_NOT_EXIST);
  } else {
    // 카테고리 저장
    await addCategoryToProduct(joinProductData, body.category_id);

    // 컬러 저장
    for (let i = 0; i < body.color.length; i++) {
      await addColorToProduct(joinProductData, body.color[i]);
    }

    // 사이즈 저장
    for (let i = 0; i < body.size.length; i++) {
      await addSizeToProduct(joinProductData, body.size[i]);
    }
    return uploadProductResponseDTO(
      await getProduct(joinProductData),
      await getColor(joinProductData),
      await getSize(joinProductData)
    );
  }
};

export const updateProductDetails = async (id, body) => {
  const updateProductData = await updateProduct(id, {
    name: body.name,
    thumbnail_url: body.thumbnail_url,
    price: body.price,
    discount_rate: body.discount_rate,
    delivery_fee: body.delivery_fee,
    description: body.description,
    status: body.status,
  });
  if (updateProductData == -1) {
    throw new BaseError(status.PRODUCT_NOT_EXIST);
  } else {
    // 카테고리 저장
    await setCategoryToProduct(id, body.category_id);

    // 컬러 저장
    await deleteColorToProduct(id);
    for (let i = 0; i < body.color.length; i++) {
      await addColorToProduct(id, body.color[i]);
    }

    // 사이즈 저장
    await deleteSizeToProduct(id);
    for (let i = 0; i < body.size.length; i++) {
      await addSizeToProduct(id, body.size[i]);
    }

    return editProductResponseDTO(
      await getProduct(id),
      await getColor(id),
      await getSize(id)
    );
  }
};

export const deleteProductById = async (id) => {
  const deleteResult = await deleteProduct(id);

  if (deleteResult == -1) {
    throw new BaseError(status.PRODUCT_NOT_EXIST);
  }

  return { isSuccess: true, message: "상품이 성공적으로 삭제되었습니다." };
};

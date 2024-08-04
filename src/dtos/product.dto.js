export const uploadProductResponseDTO = (product, color, size) => {
  const productColor = [];
  const productSize = [];

  for (let i = 0; i < color.length; i++) {
    productColor.push({
      name: color[i].name,
      hex_code: color[i].hex_code,
    });
  }

  for (let i = 0; i < size.length; i++) {
    productSize.push(size[i].size);
  }

  return {
    name: product[0].name,
    thumbnail_url: product[0].thumbnail_url,
    price: product[0].price,
    color: productColor,
    size: productSize,
    discount_rate: product[0].discount_rate,
    delivery_fee: product[0].delivery_fee,
    description: product[0].description,
    status: product[0].status,
  };
};

export const editProductResponseDTO = (product, color, size) => {
  const productColor = [];
  const productSize = [];

  for (let i = 0; i < color.length; i++) {
    productColor.push({
      name: color[i].name,
      hex_code: color[i].hex_code,
    });
  }

  for (let i = 0; i < size.length; i++) {
    productSize.push(size[i].size);
  }

  return {
    name: product[0].name,
    thumbnail_url: product[0].thumbnail_url,
    price: product[0].price,
    color: productColor,
    size: productSize,
    discount_rate: product[0].discount_rate,
    delivery_fee: product[0].delivery_fee,
    description: product[0].description,
    status: product[0].status,
  };
};

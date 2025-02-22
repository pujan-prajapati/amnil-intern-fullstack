import { redisClient } from "../config/redis.config";
import { Product } from "../entity/product.entity";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary";

interface getAllProductsQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  minPrice?: number;
  maxPrice?: number;
}

// create product service
export const createProduct = async (
  name: string,
  description: string,
  price: number,
  imageLocalPaths: string[],
  category: string,
  quantity: number
) => {
  const imageUrls = await Promise.all(
    imageLocalPaths.map(async (path) => {
      const uploadedImage = await uploadOnCloudinary(
        path,
        "amnil_intern_product"
      );
      if (!uploadedImage) {
        throw new Error("Error while uploading an image");
      }
      return uploadedImage.url;
    })
  );

  const product = Product.create({
    name,
    description,
    price,
    images: imageUrls,
    category,
    quantity,
  });
  await product.save();

  const chacheKeyPattern = `products:*`;
  const keys = await redisClient.keys(chacheKeyPattern);
  for (const key of keys) {
    await redisClient.del(key);
  }

  return product;
};

// get all products service
export const getAllProducts = async (query: getAllProductsQuery) => {
  const {
    page = 1,
    limit = 10,
    category,
    search,
    sortBy = "createdAt",
    sortOrder = "ASC",
    minPrice = 0,
    maxPrice,
  } = query;

  const cacheKey = `products:${JSON.stringify(query)}`;
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const queryBuilder = Product.createQueryBuilder("product");

  // Search by name OR description OR category
  if (search) {
    queryBuilder.andWhere(
      "(product.name ILIKE :search OR product.description ILIKE :search OR product.category ILIKE :search)",
      { search: `%${search}%` }
    );
  }

  // Filter by category
  if (category) {
    queryBuilder.andWhere("product.category ILIKE :category", {
      category: `%${category}%`,
    });
  }

  // Filter by price range
  if (minPrice !== undefined && maxPrice !== undefined) {
    queryBuilder.andWhere("product.price BETWEEN :minPrice AND :maxPrice", {
      minPrice,
      maxPrice,
    });
  } else if (minPrice !== undefined) {
    queryBuilder.andWhere("product.price >= :minPrice", { minPrice });
  } else if (maxPrice !== undefined) {
    queryBuilder.andWhere("product.price <= :maxPrice", { maxPrice });
  }

  // Sorting
  queryBuilder.orderBy(
    `product.${sortBy}`,
    sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"
  );

  // Pagination
  queryBuilder.skip((page - 1) * limit).take(limit);

  // Execute query
  const [products, totalProducts] = await queryBuilder.getManyAndCount();
  const response = {
    products,
    totalProducts,
    page,
    limit,
    totalPages: Math.ceil(totalProducts / limit),
  };
  await redisClient.setex(cacheKey, 600, JSON.stringify(response));

  return response;
};

// get product by id service
export const getProductById = async (id: string) => {
  const cacheKey = `product:${id}`;
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const product = await Product.findOneBy({ id });
  if (!product) {
    throw new Error("Product not found");
  }

  await redisClient.setex(cacheKey, 600, JSON.stringify(product));
  return product;
};

// delete product service
export const deleteProduct = async (id: string) => {
  const product = await Product.findOneBy({ id });
  if (!product) {
    throw new Error("Product not found");
  }

  if (product.images && Array.isArray(product.images)) {
    await Promise.all(
      product.images.map(async (image) => await deleteFromCloudinary(image))
    );
  }

  await Product.delete({ id });
  const cacheKeyPattern = `products:*`;
  const keys = await redisClient.keys(cacheKeyPattern);
  for (const key of keys) {
    await redisClient.del(key);
  }

  return product;
};

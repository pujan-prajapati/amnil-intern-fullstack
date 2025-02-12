import { Between, ILike, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
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
  imageLocalPath: string,
  category: string,
  quantity: number
) => {
  const imageUrl = await uploadOnCloudinary(
    imageLocalPath,
    "amnil_intern_product"
  );
  if (!imageUrl) {
    throw new Error("Error while uploading image");
  }

  const product = Product.create({
    name,
    description,
    price,
    image: imageUrl.url,
    category,
    quantity,
  });
  await product.save();

  return product;
};

// get all products service
// export const getAllProducts = async (query: getAllProductsQuery) => {
//   const {
//     page = 1,
//     limit = 10,
//     category,
//     search,
//     sortBy = "createdAt",
//     sortOrder = "ASC",
//     minPrice = 0,
//     maxPrice,
//   } = query;

//   const where: any = {};
//   if (search) {
//     where.name = ILike(`%${search}%`);
//     where.description = ILike(`%${search}%`);
//   }
//   if (category) {
//     where.category = ILike(`%${category}%`);
//   }
//   if (minPrice !== undefined && maxPrice !== undefined) {
//     where.price = Between(minPrice, maxPrice);
//   } else if (minPrice !== undefined) {
//     where.price = MoreThanOrEqual(minPrice);
//   } else if (maxPrice !== undefined) {
//     where.price = LessThanOrEqual(maxPrice);
//   }

//   const [products, totalProducts] = await Product.findAndCount({
//     where,
//     order: { [sortBy]: sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC" },
//     take: limit,
//     skip: (page - 1) * limit,
//   });

//   return {
//     products,
//     totalProducts,
//     page,
//     limit,
//     totalPages: Math.ceil(totalProducts / limit),
//   };
// };

export const getAllProducts = async (query: getAllProductsQuery) => {
  const {
    page = 1,
    limit = 5,
    category,
    search,
    sortBy = "createdAt",
    sortOrder = "ASC",
    minPrice = 0,
    maxPrice,
  } = query;

  const queryBuilder = Product.createQueryBuilder("product");

  // Search by name OR description
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

  return {
    products,
    totalProducts,
    page,
    limit,
    totalPages: Math.ceil(totalProducts / limit),
  };
};

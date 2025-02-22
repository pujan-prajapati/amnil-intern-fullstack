import { Request, Response } from "express";
import * as asyncHandler from "express-async-handler";
import { ApiResponse } from "../utils/ApiResponse";
import * as productServices from "../services/product.services";
import { Product } from "../entity/product.entity";

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, price, category, quantity } = req.body;

    const numericPrice = parseInt(price);
    const numberQuantity = parseInt(quantity);

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new Error("Image files are missing");
    }

    const imageLocalPaths = (req.files as Express.Multer.File[]).map(
      (file) => file.path
    );

    const product = await productServices.createProduct(
      name,
      description,
      numericPrice,
      imageLocalPaths,
      category,
      numberQuantity
    );

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          new ApiResponse(201, product, "Product created successfully"),
          "Product created successfully"
        )
      );
  }
);

// delete product
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await productServices.deleteProduct(id);
    res
      .status(200)
      .json(new ApiResponse(200, null, "Product deleted successfully"));
  }
);

// get all products
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const query = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      category: req.query.category as string,
      search: req.query.search as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as "ASC" | "DESC",
      minPrice: req.query.minPrice
        ? parseInt(req.query.minPrice as string)
        : undefined,
      maxPrice: req.query.maxPrice
        ? parseInt(req.query.maxPrice as string)
        : undefined,
    };

    const { products, totalProducts, limit, page, totalPages } =
      await productServices.getAllProducts(query);
    res.status(200).json(
      new ApiResponse(
        200,
        {
          products,
          totalProducts,
          limit,
          page,
          totalPages,
        },
        "Products fetched successfully"
      )
    );
  }
);

// get all products category
export const getAllCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await Product.createQueryBuilder("product")
      .select("DISTINCT product.category", "category")
      .getRawMany();

    res
      .status(200)
      .json(
        new ApiResponse(200, categories, "Categories fetched successfully")
      );
  }
);

// get product by id
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productServices.getProductById(id);
  res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

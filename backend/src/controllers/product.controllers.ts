import { Request, Response } from "express";
import * as asyncHanlder from "express-async-handler";
import { ApiResponse } from "../utils/ApiResponse";
import * as productServices from "../services/product.services";
import { Product } from "../entity/product.entity";

// create product
export const createProduct = asyncHanlder(
  async (req: Request, res: Response) => {
    const { name, description, price, category, quantity } = req.body;

    const imageLocalPath = req.file.path;
    if (!imageLocalPath) {
      throw new Error("Image file is missing");
    }

    const product = await productServices.createProduct(
      name,
      description,
      price,
      imageLocalPath,
      category,
      quantity
    );

    res
      .status(201)
      .json(new ApiResponse(201, product, "Product created successfully"));
  }
);

// get all products
export const getAllProducts = asyncHanlder(
  async (req: Request, res: Response) => {
    const query = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 5,
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
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { products, totalProducts, limit, page, totalPages },
          "Products fetched successfully"
        )
      );
  }
);

// get all products category
export const getAllCategoy = asyncHanlder(
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

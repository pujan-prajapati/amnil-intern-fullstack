import { AppDataSource } from "./data-source";
import * as dotenv from "dotenv";
import "reflect-metadata";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

import { app } from "./app";

// port
const PORT = 8000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));

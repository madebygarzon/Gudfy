import { Request, Response } from "express";
import { MedusaError } from "@medusajs/utils";

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = req.body.id; 
    const image = req.file;
    
    if (!categoryId) {
      res.status(400).json({ error: "Category ID is required" });
      return;
    }
    
    if (!image) {
      res.status(400).json({ error: "Image file is required" });
      return;
    }

    const productCategoryService = req.scope.resolve("productCategoryGudfyService");
    
    const data = await productCategoryService.addImageToCategory(categoryId, image.path);
    
    res.status(201).json({
      message: "Image uploaded successfully",
      category: data,
      image_url: data.image_url
    });
    
  } catch (error) {
    console.error("Error uploading image to category:", error);
    res.status(500).json({ 
      error: "Failed to upload image",
      details: error.message 
    });
  }
};

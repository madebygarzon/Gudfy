import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  const serialCodeService = req.scope.resolve("serialCodeService");
  
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string || null;

  try {
    const result = await serialCodeService.recoverListSerialCode({
      page,
      limit,
      search
    });
     res.status(200).send({
      data: result.data,
      totalCount: result.totalCount,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    });
  } catch (error) {
    console.error("Error al obtener códigos seriales:", error);
     res.status(500).send({
      message: "Error al obtener códigos seriales",
      error: error.message
    });
  }
};

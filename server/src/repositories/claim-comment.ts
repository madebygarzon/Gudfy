import { ClaimComment } from "../models/claim-comment";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const ClaimCommentRepository = dataSource.getRepository(ClaimComment);

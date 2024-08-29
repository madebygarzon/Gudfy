import { CommentOwner } from "../models/comment-owner";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const CommentOwnerRepository = dataSource.getRepository(CommentOwner);

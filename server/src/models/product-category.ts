import {
  Column,
  Entity,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { ProductCategory as MedusaProductCategory } from "@medusajs/medusa";

@Entity()
@Tree("materialized-path")

export class ProductCategory extends MedusaProductCategory {
  @Column({ type: "varchar", nullable: true })
  image_url?: string;

}

import { Entity, ManyToOne, JoinColumn, Column } from "typeorm";
import { Product as MedusaProduct } from "@medusajs/medusa";
import { SerialCode } from "./serial-code";
import { ProductComission } from "./product-comission";

@Entity()
export class Product extends MedusaProduct {
  @Column({ nullable: true })
  product_comission_id?: string;

  @ManyToOne(() => ProductComission, (comission) => comission.products)
  @JoinColumn({ name: "product_comission_id" })
  product_comission?: ProductComission;
}

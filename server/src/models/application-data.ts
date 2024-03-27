import { BaseEntity } from "@medusajs/medusa";
import { Column, Entity, BeforeInsert, OneToOne } from "typeorm";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { SellerApplication } from "./seller-application";

@Entity()
export class ApplicationData extends BaseEntity {
  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: false })
  last_name: string;

  @Column({ type: "varchar", nullable: false })
  email: string;

  @Column({ type: "varchar", nullable: false })
  phone: string;

  @Column({ type: "varchar", nullable: false })
  contry: string;

  @Column({ type: "varchar", nullable: false })
  city: string;

  @Column({ type: "varchar", nullable: false })
  address: string;

  @Column({ type: "varchar", nullable: false })
  postal_code: string;

  @Column({ type: "varchar", nullable: false })
  supplier_name: string;

  @Column({ type: "varchar", nullable: false })
  supplier_type: string;

  @Column({ type: "varchar", nullable: false })
  company_name: string;

  @Column({ type: "varchar", nullable: false })
  company_country: string;

  @Column({ type: "varchar", nullable: false })
  company_city: string;

  @Column({ type: "varchar", nullable: false })
  company_address: string;

  @Column({ type: "varchar", nullable: false })
  supplier_documents: string;

  @Column({ type: "varchar", nullable: false })
  quantity_products_sale: string;

  @Column({ type: "varchar", nullable: false })
  example_product: string;

  @Column({ type: "varchar", nullable: false })
  quantity_per_product: string;

  @Column({ type: "varchar", nullable: false })
  current_stock_distribution: string;

  @Column({ type: "varchar", nullable: false })
  front_identity_document: string;

  @Column({ type: "varchar", nullable: false })
  revers_identity_document: string;

  @Column({ type: "varchar", nullable: false })
  address_proof: string;

  @Column({ type: "varchar", nullable: false })
  field_payment_method_1: string;

  @Column({ type: "varchar", nullable: false })
  field_payment_method_2: string;

  @OneToOne(() => SellerApplication, (seller) => seller?.application_data_id)
  sellerapplication?: SellerApplication;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "appliData");
  }
}

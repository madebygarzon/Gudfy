import { BaseEntity, Customer } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/utils";
import { Column, Entity, JoinColumn, ManyToOne, BeforeInsert } from "typeorm";
import { StoreXVariant } from "./store_x_variant";

@Entity()
export class SerialCode extends BaseEntity {
  @Column({ type: "varchar", nullable: false })
  serial: string;

  @Column({ nullable: true })
  store_variant_id?: string;

  @ManyToOne(() => StoreXVariant, (sv) => sv?.serial_code)
  @JoinColumn({ name: "store_variant_id", referencedColumnName: "id" })
  store_variant?: StoreXVariant;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "serial_code");
  }
}

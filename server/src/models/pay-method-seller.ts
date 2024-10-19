import { BaseEntity } from "@medusajs/medusa";
import {
  Column,
  Entity,
  OneToMany,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { generateEntityId } from "@medusajs/medusa";
import { StoreOrder } from "./store-order";
import { Wallet } from "./wallet";

@Entity()
export class PayMethodSeller extends BaseEntity {
  @Column({ nullable: false })
  method?: string;

  @Column({ nullable: false })
  account_number?: string;

  @Column({ type: "varchar", nullable: false })
  wallet_id: string;

  @ManyToOne(() => Wallet, (so) => so?.pay_method_seller)
  @JoinColumn({ name: "wallet_id", referencedColumnName: "id" })
  wallet?: Wallet;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "seller_waller_id");
  }
}

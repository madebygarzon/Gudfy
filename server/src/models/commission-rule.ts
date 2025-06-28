import { BaseEntity, generateEntityId } from "@medusajs/medusa"
import { Column, Entity, ManyToOne, JoinColumn, BeforeInsert } from "typeorm"
import { CommissionGroup } from "./commission-group"

@Entity()
export class CommissionRule extends BaseEntity {
  @Column({ type: "varchar", nullable: true })
  category_id: string | null

  @Column({ type: "varchar", nullable: true })
  price_list_id: string | null

  @Column({ type: "decimal", precision: 5, scale: 4 })
  rate: number

  @Column({ type: "int", default: 0 })
  priority: number

  @ManyToOne(() => CommissionGroup, (cg) => cg.rules, { onDelete: "CASCADE" })
  @JoinColumn({ name: "group_id" })
  group: CommissionGroup

  @Column({ nullable: true })
  group_id: string | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "comrule")
  }
}

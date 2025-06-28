import { BaseEntity, generateEntityId } from "@medusajs/medusa"
import { Column, Entity, OneToMany, BeforeInsert } from "typeorm"
import { CommissionRule } from "./commission-rule"

@Entity()
export class CommissionGroup extends BaseEntity {
  @Column({ type: "text", unique: true })
  name: string

  @OneToMany(() => CommissionRule, (cr) => cr.group)
  rules: CommissionRule[]

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "comgrp")
  }
}

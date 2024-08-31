import { Lifetime } from "awilix";
import { LessThan } from "typeorm";
import {
  AdminPostCollectionsCollectionReq,
  TransactionBaseService,
} from "@medusajs/medusa";
import { OrderClaimRepository } from "../repositories/order-claim";
import { ClaimCommentRepository } from "../repositories/claim-comment";

class OrderClaimService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly orderClaimRepository_: typeof OrderClaimRepository;
  protected readonly claimCommentRepository_: typeof ClaimCommentRepository;
  // protected readonly commentOwnerRepository_: typeof ClaimCommentRepository;

  constructor(container) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.orderClaimRepository_ = container.orderClaimRepository;
    this.claimCommentRepository_ = container.claimCommentRepository;
  }

  async addClaim(claim, idCustoemr) {
    const repoOrderClaim = this.activeManager_.withRepository(
      this.orderClaimRepository_
    );
    const add = await repoOrderClaim.create({
      store_variant_order_id: claim.store_variant_order_id,
      customer_id: idCustoemr,
      status_claim: true,
    });
    const claimSave = await repoOrderClaim.save(add);

    await this.addComment({
      comment: claim.comment,
      comment_owner_id: "COMMENT_CUSTOMER_ID",
      order_claim_id: claimSave.id,
      customer_id: idCustoemr,
    });

    console.log("SE LOGRO LA INSERCION DE LA RECLAMACION", claimSave);
  }

  async retriveListClaimCustomer(idCustomer) {
    const repoOrderClaim = this.activeManager_.withRepository(
      this.orderClaimRepository_
    );

    // const listClaim = await repoOrderClaim.find({
    //   where: { customer_id: idCustomer },
    // });

    const listClaim = await repoOrderClaim
      .createQueryBuilder("oc")
      .leftJoinAndSelect("oc.store_variant_order", "svo")
      .leftJoinAndSelect("svo.store_variant", "sxv")
      .leftJoinAndSelect("sxv.store", "s")
      .leftJoinAndSelect("sxv.variant", "v")
      .where("oc.customer_id = :customer_id", { customer_id: idCustomer })
      .select([
        "oc.id AS id",
        "oc.status_claim AS status_claim",
        "oc.created_at AS created_at",
        "svo.quantity AS quantity",
        "svo.store_order_id AS number_order",
        "sxv.price AS price_unit",
        "s.name AS store_name",
        "v.title AS product_name",
      ])
      .getRawMany();

    return listClaim;
  }

  async retriveListClaimSeller(idStore) {
    const repoOrderClaim = this.activeManager_.withRepository(
      this.orderClaimRepository_
    );

    const listClaim = await repoOrderClaim
      .createQueryBuilder("oc")
      .leftJoinAndSelect("oc.store_variant_order", "svo")
      .leftJoinAndSelect("svo.store_variant", "sxv")
      .leftJoinAndSelect("sxv.store", "s")
      .leftJoinAndSelect("sxv.variant", "v")
      .leftJoinAndSelect("oc.customer", "c")
      .where("s.id = :store_id", { store_id: idStore })
      .select([
        "oc.id AS id",
        "oc.status_claim AS status_claim",
        "oc.created_at AS created_at",
        "svo.quantity AS quantity",
        "svo.store_order_id AS number_order",
        "sxv.price AS price_unit",
        "s.name AS store_name",
        "v.title AS product_name",
      ])
      .getRawMany();
    return listClaim;
  }

  async addComment(dataComment) {
    const repoClaimComment = this.activeManager_.withRepository(
      this.claimCommentRepository_
    );

    const createComment = await repoClaimComment.create({
      comment: dataComment.comment,
      comment_owner_id: dataComment.comment_owner_id,
      order_claim_id: dataComment.order_claim_id,
      customer_id: dataComment.customer_id,
    });

    const saveClaimComment = await repoClaimComment.save(createComment);
  }

  async retriverClaimComments(idOrderClaim) {
    const repoClaimComment = this.activeManager_.withRepository(
      this.claimCommentRepository_
    );

    const listClaimCommnets = await repoClaimComment.find({
      where: { order_claim_id: idOrderClaim },
    });

    return listClaimCommnets;
  }
}

export default OrderClaimService;

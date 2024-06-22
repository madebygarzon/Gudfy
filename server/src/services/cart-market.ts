import { Lifetime } from "awilix";
import { TransactionBaseService } from "@medusajs/medusa";
import LineItemRepository from "../repositories/line-item";
import ProductVariantRepository from "@medusajs/medusa/dist/repositories/product-variant";
import CartRepository from "@medusajs/medusa/dist/repositories/cart";
import StoreXVariantRepository from "../repositories/store-x-variant";

class CartMarketService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly lineItemRepository_: typeof LineItemRepository;
  protected readonly productVariantRepository_: typeof ProductVariantRepository;
  protected readonly cartRepository_: typeof CartRepository;
  protected readonly storeXVariantRepository_: typeof StoreXVariantRepository;

  constructor({
    lineItemRepository,
    productVariantRepository,
    cartRepository,
    storeXVariantRepository,
  }) {
    super(arguments[0]);

    this.lineItemRepository_ = lineItemRepository;
    this.productVariantRepository_ = productVariantRepository;
    this.cartRepository_ = cartRepository;
    this.storeXVariantRepository_ = storeXVariantRepository;
  }

  async recoveryCart(cart_id) {
    try {
      const cartRepo = this.activeManager_.withRepository(
        this.lineItemRepository_
      );
      const lineItemsRepo = this.activeManager_.withRepository(
        this.lineItemRepository_
      );
      const storexVariantRepo = this.activeManager_.withRepository(
        this.storeXVariantRepository_
      );

      const itemsCart = await lineItemsRepo.find({
        where: {
          cart_id: cart_id,
        },
      });

      const storeVariantIds = itemsCart.map((item) => item.store_variant_id);
      const uniqueStoreIds = [...new Set(storeVariantIds)];
      const storesWithCustomers = await storexVariantRepo
        .createQueryBuilder("sxv")
        .innerJoinAndSelect("sxv.store", "s")
        .leftJoinAndSelect("s.members", "c")
        .where("sxv.id IN (:...storeVariantIds)", {
          storeVariantIds: uniqueStoreIds,
        })
        .select([
          "sxv.id AS id",
          "s.name as store_name",
          "c.email AS seller_email",
        ])
        .getRawMany();

      const storeMap = new Map();
      storesWithCustomers.forEach((store) => {
        storeMap.set(store.id, {
          store_name: store.store_name,
          email: store.seller_email,
        });
      });

      // Mapear los items para incluir el campo store con datos de la tienda y el cliente
      const itemsCartWithStore = itemsCart.map((item) => {
        return {
          ...item,
          store: storeMap.get(item.store_variant_id),
        };
      });
      return itemsCartWithStore;
    } catch (error) {}
  }

  async postAddItem(cartId, variant, store_variant_id, quantity) {
    try {
      const lineItemRepo = this.activeManager_.withRepository(
        this.lineItemRepository_
      );

      let addItem = await lineItemRepo.create({
        cart_id: cartId,
        title: variant.title,
        description: variant.title,
        thumbnail: variant.thumbnail,
        unit_price: variant.price,
        variant_id: variant.id,
        quantity: quantity,
        store_variant_id: store_variant_id,
      });
      addItem = await lineItemRepo.save(addItem);
      return addItem;
    } catch (error) {
      console.log("Error al agregar el itemen el servicio", error);
    }
  }
}
export default CartMarketService;

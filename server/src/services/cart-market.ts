import { Lifetime } from "awilix";
import { TransactionBaseService } from "@medusajs/medusa";
import LineItemRepository from "../repositories/line-item";
import ProductVariantRepository from "@medusajs/medusa/dist/repositories/product-variant";
import CartRepository from "@medusajs/medusa/dist/repositories/cart";
import StoreRepository from "../repositories/store";

class CartMarketService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly lineItemRepository_: typeof LineItemRepository;
  protected readonly productVariantRepository_: typeof ProductVariantRepository;
  protected readonly cartRepository_: typeof CartRepository;
  protected readonly storeRepository_: typeof StoreRepository;

  constructor({
    lineItemRepository,
    productVariantRepository,
    cartRepository,
    storeRepository,
  }) {
    super(arguments[0]);

    this.lineItemRepository_ = lineItemRepository;
    this.productVariantRepository_ = productVariantRepository;
    this.cartRepository_ = cartRepository;
    this.storeRepository_ = storeRepository;
  }

  async recoveryCart(cart_id) {
    try {
      const cartRepo = this.activeManager_.withRepository(
        this.lineItemRepository_
      );
      const lineItemsRepo = this.activeManager_.withRepository(
        this.lineItemRepository_
      );
      const storeRepo = this.activeManager_.withRepository(
        this.storeRepository_
      );

      const itemsCart = await lineItemsRepo.find({
        where: {
          cart_id: cart_id,
        },
      });

      // Obtener todos los store_ids únicos
      const storeIds = itemsCart.map((item) => item.store_id);
      const uniqueStoreIds = [...new Set(storeIds)];

      // Realizar LEFT JOIN para obtener los datos de las tiendas junto con los clientes
      const storesWithCustomers = await storeRepo
        .createQueryBuilder("store")
        .leftJoinAndSelect("store.members", "customer")
        .where("store.id IN (:...storeIds)", { storeIds: uniqueStoreIds })
        .select(["store.id", "store.name", "customer.email AS customer_email"])
        .getRawMany();

      // Crear un mapa de tiendas con clientes por id para acceso rápido
      const storeMap = new Map();
      storesWithCustomers.forEach((store) => {
        storeMap.set(store.store_id, {
          store_name: store.store_name,
          email: store.customer_email,
        });
      });

      // Mapear los items para incluir el campo store con datos de la tienda y el cliente
      const itemsCartWithStore = itemsCart.map((item) => {
        return {
          ...item,
          store: storeMap.get(item.store_id),
        };
      });

      return itemsCartWithStore;
    } catch (error) {}
  }

  async postAddItem(cartId, variant, store_id, quantity) {
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
        store_id: store_id,
      });
      addItem = await lineItemRepo.save(addItem);
      return addItem;
    } catch (error) {
      console.log("Error al agregar el itemen el servicio", error);
    }
  }
}
export default CartMarketService;

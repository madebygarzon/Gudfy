import { Lifetime } from "awilix";
import { TransactionBaseService } from "@medusajs/medusa";
import LineItemRepository from "../repositories/line-item";
import ProductVariantRepository from "@medusajs/medusa/dist/repositories/product-variant";
import CartRepository from "@medusajs/medusa/dist/repositories/cart";
import StoreXVariantRepository from "../repositories/store-x-variant";
import StoreOrderRepository from "../repositories/store-order";
import StoreVariantOrderRepository from "../repositories/store-variant-order";

class CartMarketService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly lineItemRepository_: typeof LineItemRepository;
  protected readonly productVariantRepository_: typeof ProductVariantRepository;
  protected readonly cartRepository_: typeof CartRepository;
  protected readonly storeXVariantRepository_: typeof StoreXVariantRepository;
  protected readonly storeOrderRepository_: typeof StoreOrderRepository;
  protected readonly storeVariantOrderRepository_: typeof StoreVariantOrderRepository;

  constructor({
    lineItemRepository,
    productVariantRepository,
    cartRepository,
    storeXVariantRepository,
    storeOrderRepository,
    storeVariantOrderRepository,
  }) {
    super(arguments[0]);

    this.lineItemRepository_ = lineItemRepository;
    this.productVariantRepository_ = productVariantRepository;
    this.cartRepository_ = cartRepository;
    this.storeXVariantRepository_ = storeXVariantRepository;
    this.storeOrderRepository_ = storeOrderRepository;
    this.storeVariantOrderRepository_ = storeVariantOrderRepository;
  }

  async recoveryCart(cart_id) {
    try {
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

  async variantAndStock(items) {
    try {
      const idsVariants = items.map((item) => item.store_variant_id);

      const storexVariantRepo = this.activeManager_.withRepository(
        this.storeXVariantRepository_
      );

      const variantStoc = await storexVariantRepo
        .createQueryBuilder("sxv")
        .where("sxv.id IN (:...storeVariantIds)", {
          storeVariantIds: idsVariants,
        })
        .select(["sxv.id AS store_variant_id", "sxv.quantity_store AS stock"])
        .getRawMany();

      return variantStoc;
    } catch (error) {
      console.log("ERROR EN EL SERVICIO DEL CARRITO PORDUCTO POR STOCK");
    }
  }

  async updateItemStock(itemId, quantity) {
    const lineItemsRepo = this.activeManager_.withRepository(
      this.lineItemRepository_
    );

    await lineItemsRepo.update(itemId, { quantity: quantity });
    return;
  }

  async compareSuccessfulStocks(items) {
    try {
      const dataVarianStock = await this.variantAndStock(items);

      const result = compararStock(items, dataVarianStock);

      if (result.length) return result;

      let auxTotalProce = 0;
      let auxTotalProducts = 0;

      items.map((item) => {
        auxTotalProce += parseInt(item.unit_price) * item.quantity;
      });
      items.map((item) => {
        auxTotalProducts += item.quantity;
      });

      const newOrder = await this.createStore_order(
        auxTotalProce,
        auxTotalProducts
      );

      const storeVariantOrderRepo = this.activeManager_.withRepository(
        this.storeVariantOrderRepository_
      );

      for (let index = 0; index < items.length; index++) {
        const newSVO = await storeVariantOrderRepo.create({
          store_variant_id: items[index].store_variant_id,
          store_order_id: newOrder.id,
          quantity: items[index].quantity,
          total_price: items[index].unit_price * items[index].quantity,
        });
        const saveSVO = await storeVariantOrderRepo.save(newSVO);

        await this.reserverStock(
          items[index].store_variant_id,
          items[index].quantity
        );
      }
      return;
    } catch (error) {
      console.log("ERROR EN EL SERVICIO CREATE ORDER", error);
    }
  }

  private async reserverStock(store_variant_id, quantity) {
    const storeVariantRepo = this.activeManager_.withRepository(
      this.storeXVariantRepository_
    );
    const storeVaraint = await storeVariantRepo.findOne({
      where: {
        id: store_variant_id,
      },
    });
    await storeVariantRepo.update(store_variant_id, {
      quantity_store: storeVaraint.quantity_store - quantity,
      quantity_reserved: storeVaraint.quantity_store + quantity,
    });
  }

  private async createStore_order(total_price, quantity) {
    const storeOrderRepo = this.activeManager_.withRepository(
      this.storeOrderRepository_
    );

    const createOrder = await storeOrderRepo.create({
      customer_id: "cus_01HZM9Q40SDRBS3W7XYMEDD609",
      pay_method_id: "Secondary_Method_BINANCE_ID",
      order_status_id: "Payment_Pending_ID",
      SellerApproved: true,
      CustomerApproved: false,
      quantity_products: quantity,
      total_price: total_price,
      name: "Jane",
      last_name: "Smith",
      email: "jane.smith@example.com",
      conty: "USA",
      city: "New York",
      phone: "123-456-7890",
    });

    const saveOrder = await storeOrderRepo.save(createOrder);

    return saveOrder;
  }
}
interface Item {
  store_variant_id: string;
  stock: number;
}

function compararStock(arraySent, arrayRecovered: Item[]): string[] {
  // Crear un mapa de arrayRecuperado para acceso rápido
  const mapRecuperado = new Map(
    arrayRecovered.map((item) => [item.store_variant_id, item])
  );

  // Iterar sobre arrayEnviado y comparar los valores
  const compareArrays = arraySent
    .filter((enviado) => {
      const recuperado = mapRecuperado.get(enviado.store_variant_id);
      return recuperado !== undefined && enviado.quantity > recuperado.stock;
    })
    .map((item) => item.store_variant_id);
  return compareArrays;
}

export default CartMarketService;

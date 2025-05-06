import { Lifetime } from "awilix";
import { TransactionBaseService } from "@medusajs/medusa";
import LineItemRepository from "../repositories/line-item";
import ProductVariantRepository from "@medusajs/medusa/dist/repositories/product-variant";
import CartRepository from "@medusajs/medusa/dist/repositories/cart";
import StoreXVariantRepository from "../repositories/store-x-variant";
import StoreOrderRepository from "../repositories/store-order";
import StoreVariantOrderRepository from "../repositories/store-variant-order";
import { formatPrice } from "./utils/format-price";

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
          "s.avatar AS avatar",
          "c.email AS seller_email",
        ])
        .getRawMany();

      const storeMap = new Map();

      storesWithCustomers.forEach((store) => {
        storeMap.set(store.id, {
          avatar: store.avatar,
          store_name: store.store_name,
          email: store.seller_email,
        });
      });

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

  async compareSuccessfulStocks(items, customer_id) {
    try {
      const dataVarianStock = await this.variantAndStock(items);

      const result = compararStock(items, dataVarianStock);

      if (result.length) return {success: false, data: result};

      let auxTotalProce = 0;
      let auxTotalProducts = 0;

      items.forEach((item) => {
        auxTotalProce += parseFloat(item.unit_price) * item.quantity;
      });
      items.forEach((item) => {
        auxTotalProducts += item.quantity;
      });

      const newOrder = await this.createStoreOrder(
        auxTotalProce,
        auxTotalProducts,
        customer_id
      );

      const storeVariantOrderRepo = this.activeManager_.withRepository(
        this.storeVariantOrderRepository_
      );
      
      for (let index = 0; index < items.length; index++) {

        const newSVO = await storeVariantOrderRepo.create({
          store_variant_id: items[index].store_variant_id,
          store_order_id: newOrder.id,
          quantity: items[index].quantity,
          variant_order_status_id: "Payment_Pending_ID",
          total_price: formatPrice((items[index].unit_price) * items[index].quantity),
        });
        const saveSVO = await storeVariantOrderRepo.save(newSVO);
        
        await this.reserverStock(
          items[index].store_variant_id,
          items[index].quantity
        );
        
      }
      return {success: true, data: newOrder};
    } catch (error) {
      console.log("ERROR EN EL SERVICIO CREATE ORDER", error);
    }
  }

  async deleteItem(idCart, idItem) {
    const lineItemsRepo = this.activeManager_.withRepository(
      this.lineItemRepository_
    );
    try {
      if (!idCart || !idItem) throw "Error no proporcionaste idCart o idItem";

      const lineItem = await lineItemsRepo.findOne({
        where: { cart_id: idCart, id: idItem },
      });
      if (!lineItem) {
        throw new Error("No se encontró el artículo en el carrito");
      }
      await lineItemsRepo.remove(lineItem);
    } catch (error) {
      console.log(error);
    }
  }
  async deleteCart(idCart) {
    const cartRepo = this.activeManager_.withRepository(this.cartRepository_);
    const lineItemsRepo = this.activeManager_.withRepository(
      this.lineItemRepository_
    );
    try {
      if (!idCart) throw "Error no proporcionaste idCart o idItem";
      await lineItemsRepo.delete({ cart_id: idCart });
      const cart = await cartRepo.findOne({
        where: { id: idCart },
      });
      if (!cart) {
        throw new Error("el carrito");
      }
      await cartRepo.remove(cart);
    } catch (error) {
      console.log(error);
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
      quantity_reserved: storeVaraint.quantity_reserved + quantity,
    });
  }

  private async createStoreOrder(total_price, quantity, customer_id) {
    // Usamos atomicPhase_ para asegurarnos de que toda la operación está dentro de una transacción
    return await this.atomicPhase_(async (manager) => {
      // Usamos el manager proporcionado por atomicPhase_ para asegurarnos de que estamos en la misma transacción
      const storeOrderRepo = manager.getRepository(this.storeOrderRepository_.target);
      
      let newIdNumber = 1001;
      let prefix = "MPG-";

      // Ahora podemos usar setLock sin problemas porque estamos en una transacción
      const lastOrder = await storeOrderRepo
        .createQueryBuilder("store_order")
        .orderBy("store_order.created_at", "DESC")
        .setLock("pessimistic_write")
        .getOne();

      if (lastOrder && lastOrder.id) {
        const lastIdNumber = parseInt(lastOrder.id.replace(`${prefix}`, ""), 10);

        if (!isNaN(lastIdNumber)) {
          newIdNumber = lastIdNumber + 1;
        }
      }

      let totalComiBina = total_price + total_price * 0.01;

      const createOrder = storeOrderRepo.create({
        id: `${prefix}${newIdNumber}`,
        customer_id: customer_id,
        // pay_method_id: "",
        order_status_id: "Payment_Pending_ID",
        quantity_products: quantity,
        total_price: formatPrice(totalComiBina),
        // name: "",
        // last_name: "",
        // email: "",
        // conty: "",
        // city: "",
        // phone: "",
      });
      
      // Guardamos la orden dentro de la misma transacción
      const saveOrder = await storeOrderRepo.save(createOrder);
      return saveOrder;
      
      // La transacción se confirma automáticamente cuando atomicPhase_ se completa
      // Si hubiera un error, automáticamente se hace rollback
    });
  }
}
interface Item {
  store_variant_id: string;
  stock: number;
}

function compararStock(arraySent, arrayRecovered: Item[]): string[] {
  const mapRecuperado = new Map(
    arrayRecovered.map((item) => [item.store_variant_id, item])
  );
  const compareArrays = arraySent
    .filter((enviado) => {
      const recuperado = mapRecuperado.get(enviado.store_variant_id);
      return recuperado !== undefined && enviado.quantity > recuperado.stock;
    })
    .map((item) => item.store_variant_id);
  return compareArrays;
}

export default CartMarketService;

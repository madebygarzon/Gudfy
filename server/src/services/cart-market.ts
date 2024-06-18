import { Lifetime } from "awilix";
import { TransactionBaseService } from "@medusajs/medusa";
import LineItemRepository from "../repositories/line-item";
import ProductVariantRepository from "@medusajs/medusa/dist/repositories/product-variant";
import CartRepository from "@medusajs/medusa/dist/repositories/cart";

class CartMarketService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly lineItemRepository_: typeof LineItemRepository;
  protected readonly productVariantRepository_: typeof ProductVariantRepository;
  protected readonly cartRepository_: typeof CartRepository;

  constructor({
    lineItemRepository,
    productVariantRepository,
    cartRepository,
  }) {
    super(arguments[0]);

    this.lineItemRepository_ = lineItemRepository;
    this.productVariantRepository_ = productVariantRepository;
    this.cartRepository_ = cartRepository;
  }

  async recoveryCart(cart_id) {
    console.log("ID DEL CARRO:", cart_id);
    const cartRepo = this.activeManager_.withRepository(
      this.lineItemRepository_
    );
    const lineItemsRepo = this.activeManager_.withRepository(
      this.lineItemRepository_
    );

    const cartData = await cartRepo.findOne({
      where: {
        id: cart_id,
      },
    });

    const itemsCart = await lineItemsRepo.find({
      where: {
        cart_id: cart_id,
      },
    });

    return { ...cartData, items: itemsCart };
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
      console.log("fin de la insercion", addItem);
      return addItem;
    } catch (error) {
      console.log("Error al agregar el itemen el servicio", error);
    }
  }
}
export default CartMarketService;

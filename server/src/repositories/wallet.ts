import { Wallet } from "../models/wallet";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

const WalletRepository = dataSource.getRepository(Wallet);

export default WalletRepository;

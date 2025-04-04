"use client"

import { MEDUSA_BACKEND_URL, queryClient } from "@lib/config"
import { AccountProvider } from "@lib/context/account-context"
import { CartDropdownProvider } from "@lib/context/cart-dropdown-context"
import { CartGudfyProvider } from "@lib/context/cart-gudfy"
import { MobileMenuProvider } from "@lib/context/mobile-menu-context"
import { StoreProvider } from "@lib/context/store-context"
import { MedusaProvider, CartProvider } from "medusa-react"
import { HeroUIProvider } from "@heroui/react"
import { CategoryProvider } from "@lib/context/category-context"
import { OrderGudfyProvider } from "@lib/context/order-context"
import { SellerStoreProvider } from "@lib/context/seller-store"
import { NotificationProvider } from "@lib/context/notification-context"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MedusaProvider
      baseUrl={MEDUSA_BACKEND_URL}
      queryClientProviderProps={{
        client: queryClient,
      }}
    >
      <CartDropdownProvider>
        <MobileMenuProvider>
          <CartProvider>
            <CartGudfyProvider>
              <StoreProvider>
                <AccountProvider>
                  <OrderGudfyProvider>
                    <HeroUIProvider>
                      <SellerStoreProvider>
                        <NotificationProvider>
                          <CategoryProvider>{children}</CategoryProvider>
                        </NotificationProvider>
                      </SellerStoreProvider>
                    </HeroUIProvider>
                  </OrderGudfyProvider>
                </AccountProvider>
              </StoreProvider>
            </CartGudfyProvider>
          </CartProvider>
        </MobileMenuProvider>
      </CartDropdownProvider>
    </MedusaProvider>
  )
}

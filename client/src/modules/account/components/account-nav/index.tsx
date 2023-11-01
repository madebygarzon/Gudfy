import { useAccount } from "@lib/context/account-context"
import Button from "@modules/common/components/button"
import Icon from "@modules/common/icons/coin"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Cart from "@modules/common/icons/cart"

const AccountNav = () => {
  const route = usePathname()

  return (
    <div>
      <div className="small:hidden">
        {route !== "/account" && (
          <Link
            href="/account"
            className="flex items-center gap-x-2 text-small-regular py-2"
          >
            <>
              <span>Account</span>
            </>
          </Link>
        )}
      </div>
      <div className=" hidden small:block ">
        <div>
          <div className="text-base h-full flex flex-col justify-start items-center">
            <ul className="mb-auto flex flex-col gap-y-4">
              <li>
                <Button
                  variant="selected"
                  href="/account/profile"
                  route={route!}
                >
                  <Cart size={30} />
                  Comprador
                </Button>
              </li>
              <li>
                <Button variant="selected" href="/account" route={route!}>
                  <Icon size={30} />
                  Vendedor
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
}

export default AccountNav

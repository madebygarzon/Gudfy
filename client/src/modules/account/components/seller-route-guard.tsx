"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { actionGetSellerApplication } from "../actions/action-seller-application"
import { useSellerStoreGudfy } from "@lib/context/seller-store"
import Spinner from "@modules/common/icons/spinner"

interface SellerRouteGuardProps {
  children: React.ReactNode
}

const SellerRouteGuard = ({ children }: SellerRouteGuardProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isApproved, setIsApproved] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { storeSeller, handlerGetSellerStore } = useSellerStoreGudfy()

  useEffect(() => {
    let isMounted = true;
    
    const checkSellerStatus = async () => {
      if (!isMounted) return;
      
      try {
        const sellerApplication = await actionGetSellerApplication()
        
        if (!isMounted) return;
        if (sellerApplication?.state === "aprobada") {
          if (!storeSeller) {
            await handlerGetSellerStore()
          }
          setIsApproved(true)
        } else {

          if (pathname !== "/account/seller") {
            router.replace("/account/seller")
          }
        }
      } catch (error) {
        console.error("Error checking seller status:", error)
        if (pathname !== "/account/seller" && isMounted) {
          router.replace("/account/seller")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    checkSellerStatus()
    
    return () => {
      isMounted = false;
    };
  }, [pathname, router, storeSeller])

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center min-h-[300px]">
        <Spinner />
      </div>
    )
  }

  if (pathname === "/account/seller") {
    return <>{children}</>
  }
  return isApproved ? <>{children}</> : null
}

export default SellerRouteGuard

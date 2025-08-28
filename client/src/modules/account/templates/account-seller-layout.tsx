"use client"

import React from "react"
import SellerRouteGuard from "../components/seller-route-guard"

const AccountSellerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SellerRouteGuard>
      <div>
        {children}
      </div>
    </SellerRouteGuard>
  )
}

export default AccountSellerLayout

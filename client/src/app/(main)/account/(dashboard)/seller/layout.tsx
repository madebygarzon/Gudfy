import AccountSellerLayout from "@modules/account/templates/account-seller-layout"

export default function AccountPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AccountSellerLayout>{children}</AccountSellerLayout>
}

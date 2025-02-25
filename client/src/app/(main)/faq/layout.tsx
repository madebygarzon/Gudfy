import FaqLayout from "@modules/faq/templates/index"

export default function AccountPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <FaqLayout>{children}</FaqLayout>
}

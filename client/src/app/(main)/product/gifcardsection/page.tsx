import { Metadata } from "next"
import GiftCardSection from "@modules/home/components/giftcards"

export const metadata: Metadata = {
  title: "Giftcard Section",
  description: "Explore all of our products.",
}

export default function GifCardSecPage() {
  return <GiftCardSection />
}

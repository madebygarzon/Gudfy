import { Metadata } from "next"
import GamesSection from "@modules/home/components/juegos"

export const metadata: Metadata = {
  title: "Games Section",
  description: "Explore all of our products.",
}

export default function GifCardSecPage() {
  return <GamesSection />
}

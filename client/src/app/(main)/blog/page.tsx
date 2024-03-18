import { Metadata } from "next"
import BlogTemplat from "@modules/blog/templates"

export const metadata: Metadata = {
  title: "Blog",
  description: "Explore all of our products.",
}

export default function Blog() {
  return <BlogTemplat />
  
}
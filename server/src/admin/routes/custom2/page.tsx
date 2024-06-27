import { RouteConfig } from "@medusajs/admin"
//import { CustomIcon } from "../../icons/custom"

const CustomPage2 = () => {
  
  return (
    <div className="bg-white">
      <h1>Custom Route 2</h1>
    </div>

  )
}

export const config: RouteConfig = {
  link: {
    label: "Custom Route 2",
    // icon: CustomIcon,
  },
}

export default CustomPage2
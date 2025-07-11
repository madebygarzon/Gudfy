import { Router } from "express"
import { wrapHandler } from "@medusajs/utils"
import listComissions from "./list-commission"
import createComission from "./post-commission"
import updateComission from "./put-commission"
import deleteComission from "./delete-commission"

const router = Router()

router.get("/", wrapHandler(listComissions))
router.post("/", wrapHandler(createComission))
router.put("/:id", wrapHandler(updateComission))
router.delete("/:id", wrapHandler(deleteComission))

export default function commissionRoutes(adminRouter: Router) {
  adminRouter.use("/commission", router)
}

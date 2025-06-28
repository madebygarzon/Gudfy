import { Router } from "express"
import { wrapHandler } from "@medusajs/utils"
import listGroups from "./list-groups"
import createGroup from "./post-group"
import updateGroup from "./put-group"
import deleteGroup from "./delete-group"

const router = Router()

router.get("/groups", wrapHandler(listGroups))
router.post("/groups", wrapHandler(createGroup))
router.put("/groups/:id", wrapHandler(updateGroup))
router.delete("/groups/:id", wrapHandler(deleteGroup))

export default function commissionRoutes(adminRouter: Router) {
  adminRouter.use("/commission", router)
}

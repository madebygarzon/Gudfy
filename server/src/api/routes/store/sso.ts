import { Router } from 'express'
import jwt from 'jsonwebtoken'

export default (root: Router) => {
  const route = Router()
  root.use('/sso', route)          // ==>  🔗  POST https://api.gudfy.com/store/sso

  route.post('/', async (req, res) => {
    const { token } = req.body
    if (!token) return res.status(400).json({ error: 'missing token' })

    /* 1. Verifica firma del JWT emitido por test.gudfy.com */
    let payload: any
    try {
      payload = jwt.verify(token, process.env.WP_JWT_SECRET!)
    } catch {
      return res.status(401).json({ error: 'invalid token' })
    }

    const email = payload?.data?.user?.email || `${payload.data.user.id}@gudfy.local`

    /* 2. Upsert customer */
    const customerService = req.scope.resolve('customerService')
    const authService = req.scope.resolve('authService')

    let customer = await customerService
      .retrieveByEmail(email)
      .catch(() => null)

    if (!customer) customer = await customerService.create({ email })

    /* 3. Authentica y crea connect.sid */
    await authService.authenticateCustomer(customer.id)

    // La cookie connect.sid se setea aquí mismo por Medusa ↴
    res.json({ customer_id: customer.id })
  })
}

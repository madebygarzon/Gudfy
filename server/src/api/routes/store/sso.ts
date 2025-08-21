import { Router } from "express";
import jwt from "jsonwebtoken";

export default (root: Router) => {
  const route = Router();
  root.use("/sso", route);

  const processSSO = async (req: any, res: any, source: "GET" | "POST") => {
    try {
      const token = source === "GET" ? req.query.token : req.body.token;
      if (!token) {
        return res.status(400).json({ error: "missing token" });
      }

      let payload: any;
      try {
        payload = jwt.verify(token, process.env.JWT_SECRET!);
      } catch (err) {
        return res.status(401).json({ error: "invalid token" });
      }

      const jwtUser = payload?.data?.user || {};
      const emailFromJwt = jwtUser.email;
      const firstNameFromJwt = jwtUser.first_name;
      const lastNameFromJwt = jwtUser.last_name;
      const phoneFromJwt = jwtUser.phone;

      const email = source === "GET" ? req.query.email : req.body.email;
      const first_name =
        source === "GET" ? req.query.first_name : req.body.first_name;
      const last_name =
        source === "GET" ? req.query.last_name : req.body.last_name;
      const phone =
        source === "GET" ? req.query.phone : req.body.phone;

      const finalEmail = emailFromJwt || email || `${jwtUser.id}@gudfy.local`;
      const finalFirstName = firstNameFromJwt || first_name || "";
      const finalLastName = lastNameFromJwt || last_name || "";
      const finalPhone = phoneFromJwt || phone || "";

      const customerService = req.scope.resolve("customerService");
      const authService = req.scope.resolve("authService");

      let customer = await customerService
        .retrieveByEmail(finalEmail)
        .catch(() => null);

      if (!customer) {
        customer = await customerService.create({
          email: finalEmail,
          first_name: finalFirstName,
          last_name: finalLastName,
          phone: finalPhone,
        });
      } else {
        await customerService.update(customer.id, {
          first_name: finalFirstName || customer.first_name,
          last_name: finalLastName || customer.last_name,
          phone: finalPhone || customer.phone,
        });
      }

      await authService.authenticateCustomer(customer.id);

      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 365 * 10; // 10 años
      req.session.customer_id = customer.id;
      
      req.session.save((err: any) => {
        if (err) {
          
        } else {
          
        }
      });

      return { customer };
    } catch (err) {
      
      throw err;
    }
  };

  route.get("/", async (req, res) => {
    try {
      await processSSO(req, res, "GET");
      const frontendUrl = process.env.FRONT_URL || "http://localhost:8000";
      return res.redirect(`${frontendUrl}/account`);
    } catch {
      return res.status(500).json({ error: "internal error" });
    }
  });

  route.post("/", async (req, res) => {
    try {
      const { customer } = await processSSO(req, res, "POST");
      return res.json({
        message: "SSO ok",
        customer_id: customer.id,
        session_data: req.session,
      });
    } catch {
      return res.status(500).json({ error: "internal error" });
    }
  });
};

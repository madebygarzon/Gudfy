import { Router } from "express";
import { jwtVerify } from "jose";

function clean(v?: string) {
  return (v ?? "").trim();
}
function keyFrom(secret: string) {
  // If your WP secret is base64-encoded, use: Buffer.from(secret, "base64")
  return new TextEncoder().encode(secret);
}

type SsoOk = { ok: true; customerId: string };
type SsoErr = { ok: false; status: number; error: string };
type SsoResult = SsoOk | SsoErr;

// Optional explicit type guard (unused because we use 'in', but handy to keep around)
function isSsoErr(x: SsoResult): x is SsoErr {
  return (x as SsoErr).ok === false;
}

async function verifyJwtFromWp(token: string): Promise<any> {
  const secrets = [
    clean(process.env.JWT_AUTH_SECRET_KEY),
    clean(process.env.WP_JWT_SECRET),
    clean(process.env.JWT_SECRET),
  ].filter(Boolean);

  if (!secrets.length) {
    const e: any = new Error("server_no_secret");
    e.status = 500;
    throw e;
  }

  let lastErr: any;
  for (const s of secrets) {
    try {
      const { payload } = await jwtVerify(token, keyFrom(s), {
        // We intentionally don't set "issuer" option to allow prod/staging variance.
        clockTolerance: 60, // seconds of leeway for nbf/exp skew
      });
      return payload;
    } catch (e) {
      lastErr = e;
    }
  }
  const e: any = new Error(lastErr?.code || "invalid_token");
  e.status = 401;
  throw e;
}

export default (root: Router) => {
  // NOTE: If the store routes are mounted at "/store", these endpoints are:
  //   POST /store/sso
  //   GET  /store/sso
  const route = Router();
  root.use("/sso", route);

  const processSSO = async (req: any, source: "GET" | "POST"): Promise<SsoResult> => {
    const token = source === "GET" ? req.query?.token : req.body?.token;
    if (!token) return { ok: false, status: 400, error: "missing_token" };

    try {
      const payload = await verifyJwtFromWp(String(token));

      const jwtUser = payload?.data?.user || {};
      const emailFromJwt: string | undefined = jwtUser.email;
      const firstNameFromJwt: string = jwtUser.first_name || "";
      const lastNameFromJwt: string = jwtUser.last_name || "";
      const phoneFromJwt: string = jwtUser.phone || "";

      // Optional fallbacks from query/body if you also pass them (not required)
      const email = source === "GET" ? req.query?.email : req.body?.email;
      const first_name = source === "GET" ? req.query?.first_name : req.body?.first_name;
      const last_name = source === "GET" ? req.query?.last_name : req.body?.last_name;
      const phone = source === "GET" ? req.query?.phone : req.body?.phone;

      const finalEmail = String(emailFromJwt || email || `${jwtUser.id}@gudfy.local`);
      const finalFirstName = String(firstNameFromJwt || first_name || "");
      const finalLastName = String(lastNameFromJwt || last_name || "");
      const finalPhone = String(phoneFromJwt || phone || "");

      const customerService = req.scope.resolve("customerService");
      const authService = req.scope.resolve("authService");

      // Upsert customer by email
      let customer = await customerService.retrieveByEmail(finalEmail).catch(() => null);

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
        customer = await customerService.retrieve(customer.id);
      }

      // Authenticate/log the customer in (Medusa service)
      await authService.authenticateCustomer(customer.id);

      // Attach to session (express-session)
      if (!req.session) {
        const e: any = new Error("session_unavailable");
        e.status = 500;
        throw e;
      }

      // Long session in dev; adjust to your policy
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30; // 30 days
      req.session.customer_id = customer.id;

      // Ensure the session is persisted before sending response
      await new Promise<void>((resolve, reject) => {
        req.session.save((err: any) => (err ? reject(err) : resolve()));
      });

      return { ok: true, customerId: customer.id };
    } catch (err: any) {
      const status = Number(err?.status) || 500;
      const error = String(err?.message || "sso_internal_error");
      return { ok: false, status, error };
    }
  };

  // GET /store/sso?token=...
  route.get("/", async (req, res) => {
    const out = await processSSO(req, "GET");

    // Use 'in' operator to narrow SsoErr vs SsoOk
    if ("status" in out) {
      if (out.status >= 500) {
        console.error("SSO GET error:", out.error);
      }
      return res.status(out.status).json({ error: out.error });
    }

    const frontendUrl = clean(process.env.FRONT_URL) || "http://localhost:8000";
    return res.redirect(`${frontendUrl}/account`);
  });

  // POST /store/sso  (used by your frontend)
  route.post("/", async (req, res) => {
    const out = await processSSO(req, "POST");

    // Use 'in' operator to narrow SsoErr vs SsoOk
    if ("status" in out) {
      if (out.status >= 500) {
        console.error("SSO POST error:", out.error);
      }
      return res.status(out.status).json({ error: out.error });
    }

    return res.status(200).json({ ok: true, customer_id: out.customerId });
  });

  return root;
};

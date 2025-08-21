import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, decodeJwt } from "jose";

// --- Utils ---
function clean(v?: string) {
  return (v ?? "").trim();
}

function keyFrom(secret: string) {
  // If your WP secret is base64-encoded, switch to: Buffer.from(secret, "base64")
  return new TextEncoder().encode(secret);
}

function allowedIssuers(): string[] {
  // Allow both prod and staging to avoid false negatives during tests
  const fromEnv = clean(process.env.WP_SITE);
  const list = [fromEnv].filter(Boolean);
  if (!list.includes("https://gudfy.com")) list.push("https://gudfy.com");
  if (!list.includes("https://staging.gudfy.com")) list.push("https://staging.gudfy.com");
  // Also accept trailing slash variants
  if (!list.includes("https://gudfy.com/")) list.push("https://gudfy.com/");
  if (!list.includes("https://staging.gudfy.com/")) list.push("https://staging.gudfy.com/");
  return list;
}

async function verifyWpJwt(token: string) {
  // Try multiple env keys to avoid subtle env mismatches
  const candidates = [
    clean(process.env.JWT_SECRET),
    clean(process.env.JWT_AUTH_SECRET_KEY),
    clean(process.env.WP_JWT_SECRET),
  ].filter(Boolean);

  if (!candidates.length) throw new Error("server_no_secret");

  // Format sanity check (do not log payload in prod)
  decodeJwt(token); // throws if not a valid JWT structure

  const issuers = allowedIssuers();
  let lastErr: unknown;

  for (const secret of candidates) {
    try {
      const { payload } = await jwtVerify(token, keyFrom(secret), {
        // We don't set "issuer" option here; we check it ourselves for clearer errors and multiple allowed values.
        clockTolerance: 60, // seconds of leeway for nbf/exp skew
      });

      const iss = String((payload as any).iss ?? "");
      if (!issuers.includes(iss)) {
        throw new Error(`issuer_mismatch:${iss}`);
      }
      return payload; // ✅ Verified
    } catch (e) {
      lastErr = e;
    }
  }

  // Surface minimal info for debugging locally (avoid leaking secrets)
  // @ts-ignore
  console.error("JWT verify fail:", lastErr?.code || "", lastErr?.message || lastErr);
  throw new Error("invalid_token");
}

// Split a combined Set-Cookie header into individual cookie strings
function splitSetCookie(headerValue: string): string[] {
  // Split on comma only when a new cookie key follows (avoids breaking "Expires=...,")
  return headerValue.split(/,(?=\s*[A-Za-z0-9_\-]+=)/g);
}

// Normalize backend cookies so the browser will accept them in dev and work site-wide
function normalizeCookieForBrowser(raw: string, req: NextRequest): string {
  const isHttps = req.nextUrl.protocol === "https:";
  const domainEnv = clean(process.env.COOKIE_DOMAIN);
  let c = raw;

  // Widen Path to root
  if (/Path=/i.test(c)) {
    c = c.replace(/Path=[^;]+/i, "Path=/");
  } else {
    c += "; Path=/";
  }

  // Handle Domain:
  // - If COOKIE_DOMAIN provided, force it
  // - Else remove Domain so it's host-only (works best for localhost)
  if (domainEnv) {
    if (/Domain=/i.test(c)) {
      c = c.replace(/Domain=[^;]+/i, `Domain=${domainEnv}`);
    } else {
      c += `; Domain=${domainEnv}`;
    }
  } else {
    c = c.replace(/;\s*Domain=[^;]+/i, "");
  }

  // Drop Secure on http (localhost), keep it on https
  if (!isHttps) {
    c = c.replace(/;\s*Secure/gi, "");
  }

  // Keep HttpOnly/SameSite as provided by backend
  return c;
}

// --- Route handler ---
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/account/login?err=missing_token", url));
  }

  // 1) Verify JWT signed by WordPress
  try {
    await verifyWpJwt(token);
  } catch {
    return NextResponse.redirect(new URL("/account/login?err=invalid_token", url));
  }

  // 2) Call Medusa backend to perform its SSO/login and set session cookies
  const medusaUrl = `${clean(process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL)}/store/sso`;

  const apiRes = await fetch(medusaUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    credentials: "include",
    cache: "no-store",
  });

  if (!apiRes.ok) {
    const txt = await apiRes.text().catch(() => "");
    console.error("Medusa SSO fail:", txt);
    return NextResponse.redirect(new URL("/account/login?err=sso_failed", url));
  }

  // 3) Forward backend cookies to the browser
  const res = NextResponse.redirect(new URL("/account", url));
  const rawSetCookie = apiRes.headers.get("set-cookie");

  if (rawSetCookie) {
    const parts = splitSetCookie(rawSetCookie);
    for (const part of parts) {
      const normalized = normalizeCookieForBrowser(part, req);
      res.headers.append("set-cookie", normalized);
    }
  }

  return res;
}

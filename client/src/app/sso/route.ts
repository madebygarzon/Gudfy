import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function GET(req: NextRequest) {
  /* 1. Obtén el JWT desde el querystring */
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(
      new URL('/account/login?err=missing_token', req.url)
    )
  }

  /* 2. Verifica firma y expiración (HS256) */
  try {
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.WP_JWT_SECRET!),   // misma clave que WP
      { issuer: process.env.WP_SITE || 'https://test.gudfy.com' }
    )
  } catch (err) {
    console.error('JWT verify fail', err)
    return NextResponse.redirect(
      new URL('/account/login?err=invalid_token', req.url)
    )
  }

  /* 3. Intercambia por sesión Medusa */
  const apiRes = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/sso`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      credentials: 'include',      // para que se conserve el Set‑Cookie
    }
  )

  if (!apiRes.ok) {
    console.error('Medusa SSO fail', await apiRes.text())
    return NextResponse.redirect(
      new URL('/account/login?err=sso_failed', req.url)
    )
  }

  /* 4. Reenvía la cookie connect.sid al navegador */
  const res = NextResponse.redirect(new URL('/account', req.url))

  const setCookie = apiRes.headers.get('set-cookie')
  if (setCookie) {
    // Garantiza Path=/ y dominio .gudfyp2p.com
    const cookieBrowser = setCookie
      .replace(/Path=\/store/gi, 'Path=/')
      .replace(/Domain=[^;]+/i, 'Domain=localhost')

    res.headers.set('set-cookie', cookieBrowser)
  }

  return res
}

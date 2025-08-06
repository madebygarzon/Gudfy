import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(
      new URL('/account/login?err=missing_token', req.url)
    )
  }

  try {
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!),
      {
        issuer: process.env.WP_SITE || 'https://staging.gudfy.com'
      }
    )
  } catch (err) {
    console.error('JWT verify fail', err)
    return NextResponse.redirect(
      new URL('/account/login?err=invalid_token', req.url)
    )
  }

  const apiRes = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/sso`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      credentials: 'include',
    }
  )

  if (!apiRes.ok) {
    console.error('Medusa SSO fail', await apiRes.text())
    return NextResponse.redirect(
      new URL('/account/login?err=sso_failed', req.url)
    )
  }

  const res = NextResponse.redirect(new URL('/account', req.url))

  const setCookie = apiRes.headers.get('set-cookie')
  if (setCookie) {
    const cookieDomain =
      process.env.COOKIE_DOMAIN || 'localhost'

    const cookieBrowser = setCookie
      .replace(/Path=\/store/gi, 'Path=/')
      .replace(/Domain=[^;]+/i, `Domain=${cookieDomain}`)

    res.headers.set('set-cookie', cookieBrowser)
  }

  return res
}

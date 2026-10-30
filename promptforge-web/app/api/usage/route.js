import { NextResponse } from 'next/server'
import { getUsage, usageError } from '@/lib/usage'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { remaining } = await getUsage(request)
    return NextResponse.json({ remaining }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return NextResponse.json(usageError(error), { status: error.status || 503 })
  }
}

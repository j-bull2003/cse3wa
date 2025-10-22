import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    const secure = !!process.env.DATABASE_URL && /postgres:\/\//i.test(process.env.DATABASE_URL)
    return NextResponse.json({ connected: true, secure })
  } catch (e) { console.error(e); return NextResponse.json({ connected: false, secure: false }, { status: 500 }) }
}

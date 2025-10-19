import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../lib/primsa';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: cors }) }

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (id) {
      const user = await prisma.user.findUnique({ where: { id } })
      if (!user) return new NextResponse('User not found', { status: 404, headers: cors })
      return NextResponse.json(user, { headers: cors })
    }
    const users = await prisma.user.findMany()
    return NextResponse.json(users, { headers: cors })
  } catch (e) { console.error(e); return new NextResponse('Server error', { status: 500, headers: cors }) }
}

export async function POST(req: NextRequest) {
  try {
    const { name, lineStatus } = await req.json()
    if (!name || !lineStatus) return new NextResponse('Missing name or lineStatus', { status: 400, headers: cors })
    const created = await prisma.user.create({ data: { name, lineStatus } })
    return NextResponse.json(created, { status: 201, headers: cors })
  } catch (e) { console.error(e); return new NextResponse('Invalid body', { status: 400, headers: cors }) }
}

export async function PATCH(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return new NextResponse('Missing id', { status: 400, headers: cors })
    const { name, lineStatus } = await req.json()
    const updated = await prisma.user.update({ where: { id }, data: { ...(name !== undefined && { name }), ...(lineStatus !== undefined && { lineStatus }) } })
    return NextResponse.json(updated, { headers: cors })
  } catch (e) { console.error(e); return new NextResponse('Invalid request', { status: 400, headers: cors }) }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return new NextResponse('Missing id', { status: 400, headers: cors })
    await prisma.user.delete({ where: { id } })
    return new NextResponse(null, { status: 204, headers: cors })
  } catch (e) { console.error(e); return new NextResponse('Invalid request', { status: 400, headers: cors }) }
}

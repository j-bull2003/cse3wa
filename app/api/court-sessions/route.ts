import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../lib/primsa';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: cors }) }

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (id) {
      const one = await prisma.courtSession.findUnique({ where: { id } })
      if (!one) return new NextResponse('Not found', { status: 404, headers: cors })
      return NextResponse.json(one, { headers: cors })
    }
    const all = await prisma.courtSession.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(all, { headers: cors })
  } catch (e) { console.error(e); return new NextResponse('Server error', { status: 500, headers: cors }) }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const created = await prisma.courtSession.create({ data: {
      startedAt: body.startedAt ?? null,
      minutesPlanned: Number(body.minutesPlanned ?? 0),
      running: !!body.running,
      tasks: body.tasks ?? {},
      messages: body.messages ?? [],
      meta: body.meta ?? {},
    } })
    return NextResponse.json(created, { status: 201, headers: cors })
  } catch (e) { console.error(e); return new NextResponse('Invalid body', { status: 400, headers: cors }) }
}

export async function PATCH(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return new NextResponse('Missing id', { status: 400, headers: cors })
    const body = await req.json()
    const updated = await prisma.courtSession.update({ where: { id }, data: {
      ...(body.startedAt !== undefined && { startedAt: body.startedAt }),
      ...(body.minutesPlanned !== undefined && { minutesPlanned: Number(body.minutesPlanned) }),
      ...(body.running !== undefined && { running: !!body.running }),
      ...(body.tasks !== undefined && { tasks: body.tasks }),
      ...(body.messages !== undefined && { messages: body.messages }),
      ...(body.meta !== undefined && { meta: body.meta }),
    } })
    return NextResponse.json(updated, { headers: cors })
  } catch (e) { console.error(e); return new NextResponse('Invalid request', { status: 400, headers: cors }) }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return new NextResponse('Missing id', { status: 400, headers: cors })
    await prisma.courtSession.delete({ where: { id } })
    return new NextResponse(null, { status: 204, headers: cors })
  } catch (e) { console.error(e); return new NextResponse('Invalid request', { status: 400, headers: cors }) }
}

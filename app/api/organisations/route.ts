import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const organisations = await prisma.organisation.findMany()
    return NextResponse.json(organisations)
  } catch (error) {
    console.error('Erreur lors de la récupération des organisations:', error)
    return NextResponse.json({ error: 'Erreur lors de la récupération des organisations' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
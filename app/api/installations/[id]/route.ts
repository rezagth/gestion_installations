import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const installation = await prisma.installation.findUnique({
      where: { id: params.id },
      include: {
        materiels: true,
        remplacements: {
          include: {
            ancienMateriel: true,
            nouveauMateriel: true,
          },
        },
      },
    })

    if (!installation) {
      return NextResponse.json({ error: 'Installation non trouvée' }, { status: 404 })
    }

    return NextResponse.json(installation)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'installation:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updatedInstallation = await prisma.installation.update({
      where: { id: params.id },
      data: body,
    })
    return NextResponse.json(updatedInstallation)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'installation:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.installation.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ message: 'Installation supprimée avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'installation:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id?: string } }
) {
  try {
    const id = params?.id;

    if (!id) {
      return NextResponse.json({ error: 'ID du matériel manquant' }, { status: 400 });
    }

    console.log('Récupération du matériel avec ID:', id); // Log pour débogage

    const materiel = await prisma.materiel.findUnique({
      where: { id },
      include: {
          installation: true,
          remplacementsPrecedents: {
              include: { ancienMateriel: true }
          },
          remplacementsSuivants: {
              include: { nouveauMateriel: true }
          },
      },
    });

    if (!materiel) {
      return NextResponse.json({ error: 'Matériel non trouvé' }, { status: 404 });
    }

    return NextResponse.json(materiel);

  } catch (error) {
    console.error('Erreur lors de la récupération du matériel:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération du matériel' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
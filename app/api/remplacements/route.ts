import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function formatRemplacement(remplacement: any) {
  return {
    id: remplacement.id,
    dateRemplacement: remplacement.dateRemplacement.toISOString(),
    installation: remplacement.installation ? {
      id: remplacement.installation.id,
      nom: remplacement.installation.nom,
      dateCreation: remplacement.installation.dateCreation.toISOString(),
      organisation: remplacement.installation.organisation || 'Non spécifiée',
    } : null,
    ancienMateriel: remplacement.ancienMateriel ? {
      id: remplacement.ancienMateriel.id,
      marque: remplacement.ancienMateriel.marque,
      modele: remplacement.ancienMateriel.modele,
      numeroSerie: remplacement.ancienMateriel.numeroSerie,
      typeMateriel: remplacement.ancienMateriel.typeMateriel,
      dateInstallation: remplacement.ancienMateriel.dateInstallation.toISOString(),
    } : null,
    nouveauMateriel: remplacement.nouveauMateriel ? {
      id: remplacement.nouveauMateriel.id,
      marque: remplacement.nouveauMateriel.marque,
      modele: remplacement.nouveauMateriel.modele,
      numeroSerie: remplacement.nouveauMateriel.numeroSerie,
      typeMateriel: remplacement.nouveauMateriel.typeMateriel,
      dateInstallation: remplacement.nouveauMateriel.dateInstallation.toISOString(),
    } : null,
  };
}

export async function GET() {
  try {
    const remplacements = await prisma.remplacement.findMany({
      include: {
        installation: true,
        ancienMateriel: true,
        nouveauMateriel: true,
      },
    });

    const formattedRemplacements = remplacements.map(formatRemplacement);

    return NextResponse.json({ remplacements: formattedRemplacements });
  } catch (error) {
    console.error('Erreur lors de la récupération des remplacements:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des remplacements' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { installationId, ancienMaterielId, nouveauMateriel } = body;
    
    if (!installationId || !ancienMaterielId || !nouveauMateriel) {
      return NextResponse.json({ error: 'Données manquantes pour le remplacement' }, { status: 400 });
    }

    const newMateriel = await prisma.materiel.create({
      data: {
        marque: nouveauMateriel.marque,
        modele: nouveauMateriel.modele,
        numeroSerie: nouveauMateriel.numeroSerie,
        typeMateriel: nouveauMateriel.typeMateriel,
        dateInstallation: new Date(nouveauMateriel.dateInstallation),
        installationId: parseInt(installationId),
      },
    });

    const replacement = await prisma.remplacement.create({
      data: {
        dateRemplacement: new Date(),
        ancienMaterielId,
        nouveauMaterielId: newMateriel.id,
        installationId: parseInt(installationId),
      },
      include: {
        installation: true,
        ancienMateriel: true,
        nouveauMateriel: true,
      },
    });

    const formattedReplacement = formatRemplacement(replacement);

    return NextResponse.json(formattedReplacement);
  } catch (error) {
    console.error('Erreur lors du remplacement:', error);
    
    return NextResponse.json(
      { error: 'Erreur lors du remplacement', details: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    );
  }
}
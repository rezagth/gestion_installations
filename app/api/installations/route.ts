import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Materiel {
  marque: string;
  modele: string;
  numeroSerie: string;
  typeMateriel: string; // Champ mis à jour
  dateInstallation: string;
}

interface InstallationData {
  nom: string; // Assurez-vous que ce champ est inclus
  client: string;
  boutique: string;
  organisation?: string; // Optionnel
  numeroFacture?: string;
  dateFacture?: string;
  materiels: Materiel[];
}

// Méthode GET pour récupérer toutes les installations
export async function GET(req: Request) {
  try {
    const installations = await prisma.installation.findMany({
      include: {
        materiels: true,
      },
    });
    return NextResponse.json(installations, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des installations:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des installations' }, { status: 500 });
  }
}

// Méthode POST pour créer une nouvelle installation
export async function POST(req: Request) {
  try {
    const data = await req.json() as InstallationData;

    console.log('Données reçues:', data);

    // Validation des données reçues
    if (!data || !data.nom || !data.client || !data.boutique || !data.materiels || !Array.isArray(data.materiels)) {
      return NextResponse.json({ error: 'Données manquantes ou incorrectes' }, { status: 400 });
    }

    // Création de l'installation dans la base de données
    const newInstallation = await prisma.installation.create({
      data: {
        nom: data.nom, // Inclure le champ nom ici
        client: data.client,
        boutique: data.boutique,
        organisation: data.organisation || '', // Valeur par défaut si non fournie
        numeroFacture: data.numeroFacture,
        dateFacture: data.dateFacture ? new Date(data.dateFacture) : null,
        status: 'ACTIVE',
        materiels: {
          create: data.materiels.map((materiel) => ({
            marque: materiel.marque,
            modele: materiel.modele,
            numeroSerie: materiel.numeroSerie,
            typeMateriel: materiel.typeMateriel, // Champ mis à jour
            dateInstallation: new Date(materiel.dateInstallation), // Assurez-vous que le format est correct
          })),
        },
      },
      include: {
        materiels: true,
      },
    });

    return NextResponse.json(newInstallation, { status: 201 });
    
  } catch (error) {
    console.error('Erreur lors de la création de l\'installation:', error.message || error);
    
    return NextResponse.json({
      error:
        'Erreur lors de la création de l\'installation',
      details:
        (error instanceof Error) ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
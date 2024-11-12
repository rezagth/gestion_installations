import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET : Récupérer tous les matériels
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || ''; // Toujours une chaîne

        console.log('Paramètre de recherche:', search); // Log pour débogage

        const materiels = await prisma.materiel.findMany({
            where: search ? {
                OR: [
                    { marque: { contains: search, mode: 'insensitive' } },
                    { modele: { contains: search, mode: 'insensitive' } },
                    { numeroSerie: { contains: search, mode: 'insensitive' } },
                    { typeMateriel: { contains: search, mode: 'insensitive' } }, // Ajoutez d'autres champs si nécessaire
                ]
            } : undefined,
            include: {
                installation: true,
            }
        });

        // Renvoie un tableau vide si aucun matériel n'est trouvé au lieu d'une erreur.
        return NextResponse.json(materiels.length ? materiels : [], { status: materiels.length ? 200 : 404 });

    } catch (error) {
        console.error('Erreur lors de la récupération des matériels:', error);
        
        // Vérification du type d'erreur pour renvoyer des messages appropriés.
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ error: 'Erreur lors de la récupération des matériels' }, { status: 500 });
        
    } finally {
        await prisma.$disconnect();
    }
}

// POST : Créer un nouveau matériel
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Vérifiez que le corps contient toutes les informations nécessaires
        if (!body.marque || !body.modele || !body.numeroSerie || !body.typeMateriel || !body.dateInstallation || !body.installationId) {
            return NextResponse.json({ error: 'Informations manquantes dans la requête' }, { status: 400 });
        }

        const materiel = await prisma.materiel.create({
            data: {
                marque: body.marque,
                modele: body.modele,
                numeroSerie: body.numeroSerie,
                typeMateriel: body.typeMateriel,
                dateInstallation: new Date(body.dateInstallation),
                installationId: body.installationId,
            },
            include: {
                installation: true
            }
        });
        
        return NextResponse.json(materiel);
        
    } catch (error) {
        console.error('Erreur lors de la création du matériel:', error);
        return NextResponse.json({ error: 'Erreur lors de la création du matériel' }, { status: 500 });
        
    } finally {
        await prisma.$disconnect();
    }
}

// PUT : Mettre à jour un matériel existant
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Vérifiez que le corps contient toutes les informations nécessaires
        if (!body.id || !body.marque || !body.modele || !body.numeroSerie || !body.typeMateriel || !body.dateInstallation || !body.installationId) {
            return NextResponse.json({ error: 'Informations manquantes dans la requête' }, { status: 400 });
        }

        const materiel = await prisma.materiel.update({
            where: { id: body.id },
            data: {
                marque: body.marque,
                modele: body.modele,
                numeroSerie: body.numeroSerie,
                typeMateriel: body.typeMateriel,
                dateInstallation: new Date(body.dateInstallation),
                installationId: body.installationId,
            },
            include: {
                installation: true
            }
        });
        
        return NextResponse.json(materiel);
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour du matériel:', error);
        return NextResponse.json({ error: 'Erreur lors de la mise à jour du matériel' }, { status: 500 });
        
    } finally {
        await prisma.$disconnect();
    }
}

// DELETE : Supprimer un matériel
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
        }

        await prisma.materiel.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Matériel supprimé avec succès' });
        
    } catch (error) {
        console.error('Erreur lors de la suppression du matériel:', error);
        return NextResponse.json({ error: 'Erreur lors de la suppression du matériel' }, { status: 500 });
        
    } finally {
        await prisma.$disconnect();
    }
}
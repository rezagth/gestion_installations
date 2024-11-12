'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Materiel, Installation, Remplacement } from '@prisma/client';
import { FaTools, FaRegClock, FaUser, FaHistory } from 'react-icons/fa';
import { Button } from "@/components/ui/button"; // Importation du composant Button de Shadcn
import { Card } from "@/components/ui/card"; // Importation du composant Card de Shadcn
import { ToastContainer, toast } from 'react-toastify'; // Importation de Toastify
import 'react-toastify/dist/ReactToastify.css'; // Styles de Toastify
import { Skeleton } from "@/components/ui/skeleton"; // Importation du composant Skeleton

type MaterielWithDetails = Materiel & {
    installation: Installation;
    remplacementsPrecedents: (Remplacement & { ancienMateriel: Materiel })[];
    remplacementsSuivants: (Remplacement & { nouveauMateriel: Materiel })[];
};

const MaterielDetail: React.FC = () => {
    const params = useParams();
    const id = params.id as string;
    const [materiel, setMateriel] = useState<MaterielWithDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMaterielDetails = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/materiels/${encodeURIComponent(id)}`);
                if (!response.ok) throw new Error(`HTTP error! status:${response.status}`);
                const data = await response.json();
                setMateriel(data);
                toast.success('Détails du matériel chargés avec succès !');
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue est survenue";
                setError(errorMessage);
                toast.error(`Erreur : ${errorMessage}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMaterielDetails();
    }, [id]);

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <Skeleton className="h-32 w-32" />
        </div>
    );

    if (error) return (
        <div className="text-red-600 text-center mt-12 p-4 bg-red-100 rounded-lg max-w-xl mx-auto">
            Erreur : {error}
        </div>
    );

    if (!materiel) return <div className="text-center mt-12">Matériel non trouvé</div>;

    return (
        <div className="max-w-4xl mx-auto my-12 px-4">
            <Link href="/suivi" className="inline-block mb-6">
                <Button variant="primary">← Retour à la liste</Button>
            </Link>
            <Card className="shadow-lg overflow-hidden border border-gray-200 rounded-lg">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <h1 className="text-4xl font-bold">{materiel.marque} {materiel.modele}</h1>
                    <p className="mt-2 text-lg font-light italic">Détails du matériel</p>
                </div>
                <div className="p-6 bg-gray-50 space-y-8">

                    {/* Informations Générales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-5 shadow-md transition-transform transform hover:scale-105 border border-gray-300 rounded-lg">
                            <h3 className="text-lg font-semibold flex items-center text-blue-600">
                                <FaTools className="mr-2" /> N° série
                            </h3>
                            <p className="mt-1 text-gray-800">{materiel.numeroSerie}</p>
                        </Card>
                        <Card className="p-5 shadow-md transition-transform transform hover:scale-105 border border-gray-300 rounded-lg">
                            <h3 className="text-lg font-semibold flex items-center text-blue-600">
                                <FaRegClock className="mr-2" /> Type
                            </h3>
                            <p className="mt-1 text-gray-800">{materiel.typeMateriel}</p>
                        </Card>
                        <Card className="p-5 shadow-md transition-transform transform hover:scale-105 border border-gray-300 rounded-lg">
                            <h3 className="text-lg font-semibold flex items-center text-blue-600">
                                <FaUser className="mr-2" /> Date d'installation
                            </h3>
                            <p className="mt-1 text-gray-800">{new Date(materiel.dateInstallation).toLocaleDateString()}</p>
                        </Card>
                    </div>

                    {/* Section Installation */}
                    <h2 className="text-xl font-semibold text-gray800 flex items-center mb-4">
                        <FaUser className="mr-2 text-blue-600" /> Installation
                    </h2>
                    <Card className="rounded-lg p6 shadow-md mb-6 space-y-4 border border-gray-300">
                        <p><span className="font-medium">Nom:</span> {materiel.installation.nom}</p>
                        <p><span className="font-medium">Client:</span> {materiel.installation.client}</p>
                        <p><span className="font-medium">Organisation:</span> {materiel.installation.organisation}</p> 
                        <p><span className="font-medium">Boutique:</span> {materiel.installation.boutique}</p>
                    </Card>

                    {/* Historique des remplacements */}
                    {materiel.remplacementsPrecedents.length > 0 && (
                        <>
                            <h2 className="text-xl font-semibold text-gray800 flex items-center mb-4">
                                <FaHistory className="mr-2 text-blue-600" /> Historique des remplacements
                            </h2>
                            <ul className="bg-white rounded-lg p6 space-y-4 shadow-md border border-gray-300">
                                {materiel.remplacementsPrecedents.map((remplacement) => (
                                    <li key={remplacement.id} className="flex flex-col py-3 border-b last:border-b-none">
                                        <div><strong>Remplacé le :</strong> {new Date(remplacement.dateRemplacement).toLocaleDateString()}</div>
                                        <div><strong>Matériel remplacé :</strong></div>
                                        <ul className="list-disc list-inside ml-5 space-y-1">
                                            <li><strong>Nom :</strong> {remplacement.ancienMateriel.marque} {remplacement.ancienMateriel.modele}</li>
                                            <li><strong>Type :</strong> {remplacement.ancienMateriel.typeMateriel}</li>
                                            <li><strong>N° série :</strong> {remplacement.ancienMateriel.numeroSerie}</li>
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </Card>

            {/* Conteneur pour les toasts */}
            <ToastContainer />
        </div>
    );
};

export default MaterielDetail;
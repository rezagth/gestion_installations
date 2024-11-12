'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Installation, Materiel } from '@prisma/client';
import { Card } from "@/components/ui/card"; // Importation du composant Card de Shadcn
import { Input } from "@/components/ui/input"; // Importation du composant Input de Shadcn
import { Skeleton } from "@/components/ui/skeleton"; // Importation du composant Skeleton de Shadcn
import { FaTools, FaBoxOpen } from 'react-icons/fa'; // Importation des icônes
import { ToastContainer, toast } from 'react-toastify'; // Importation de Toastify
import 'react-toastify/dist/ReactToastify.css'; // Styles de Toastify

type InstallationWithDetails = Installation & {
  materiels: Materiel[];
};

export default function InstallationsPage() {
  const [installations, setInstallations] = useState<InstallationWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstallations = async () => {
      try {
        const response = await fetch('/api/installations');
        if (!response.ok) {
          throw new Error('Échec de la récupération des installations');
        }
        const data = await response.json();
        setInstallations(data);
        toast.success('Installations chargées avec succès !'); // Notification de succès
      } catch (err) {
        setError("Erreur lors du chargement des installations");
        toast.error("Erreur lors du chargement des installations"); // Notification d'erreur
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstallations();
  }, []);

  const filteredInstallations = useMemo(() => {
    return installations.filter(installation =>
      installation.materiels.some(materiel =>
        materiel.numeroSerie?.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      installation.numeroFacture?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      installation.boutique?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      installation.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [installations, searchTerm]);

  // Tri des installations filtrées par date de création (les plus récentes en premier)
  const sortedInstallations = useMemo(() => {
    return filteredInstallations.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
  }, [filteredInstallations]);

  if (isLoading) return (
    <div className="max-w-7xl mx-auto mt-10 px-4 pb-12">
      <div className="grid grid-cols-1 gap-8">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-6 bg-white border rounded-lg shadow-lg">
            <Skeleton className="h-6 mb-4" />
            <Skeleton className="h-4 mb-2" />
            <Skeleton className="h-4 mb-2" />
            <Skeleton className="h-4 mb-2" />
          </Card>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center mt-10 text-xl">{error}</div>
  );

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 pb-12">
      <ToastContainer /> {/* Conteneur pour les notifications */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Liste des Installations</h1>
        <Link 
          href="/installations/nouvelle" 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md text-center w-full sm:w-auto"
        >
          Nouvelle Installation
        </Link>
      </div>
      
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Rechercher par nom, numéro de série, numéro de facture ou boutique"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      {sortedInstallations.length === 0 ? (
        <Card className="text-gray-500 text-center text-lg bg-white p-8 rounded-lg shadow">Aucune installation trouvée.</Card>
      ) : (
        <div className="grid grid-cols-1 gap-y-8">
          {sortedInstallations.map((installation) => (
            <Card key={installation.id} className={`bg-white border rounded-lg shadow-lg hover:shadow-xl transition duration-300 overflow-hidden`}>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb=2">{installation.nom}</h2>
                <div className="grid grid-cols=1 md:grid-cols-2 gap=6 mb=6">
                  <div>
                    <p className="text-gray=600"><span className="font-medium text-gray=700">Organisation:</span> {installation.organisation || 'Non spécifiée'}</p>
                    <p className="text-gray=600"><span className="font-medium text-gray=700">Client:</span> {installation.client}</p>
                    <p className="text-gray=600"><span className="font-medium text-gray=700">Boutique:</span> {installation.boutique}</p>
                  </div>
                  <div>
                    <p className="text-gray=600"><span className="font-medium text-gray=700">Numéro de Facture:</span> {installation.numeroFacture || 'Non spécifié'}</p>
                    <p className="text-gray=600"><span className="font-medium text-gray=700">Date de Facture:</span> {installation.dateFacture ? new Date(installation.dateFacture).toLocaleDateString('fr-FR') : 'Non spécifiée'}</p>
                    <p className="text-gray=600"><span className="font-medium text-gray=700">Date de création:</span> {new Date(installation.dateCreation).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>

                {/* Affichage de tous les matériels associés */}
                {installation.materiels && installation.materiels.length > 0 && (
                  <div className="mt=6">
                    <h3 className="font-semibold text-lg text-gray=700 mb=4 border-b pb=2">Matériels:</h3>
                    {/* Grille pour les matériels */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
                      {installation.materiels.map((materiel) => (
                        <Link key={materiel.id} href={`/materiels/${materiel.id}`}>
                          {/* Rectangle pour le matériel */}
                          <div 
                            className={`bg-blue-50 p-4 rounded-md shadow-md hover:shadow-lg transition duration-300 cursor-pointer`}
                          >
                            {/* Contenu du matériel */}
                            <p className="font-bold text-lg text-blue-600">{materiel.marque} {materiel.modele}</p>
                            <p className="text-sm text-gray=600"><span className="font-medium">Type:</span> {materiel.typeMateriel}</p>
                            <p className="text-sm text-gray=600"><span className="font-medium">S/N:</span> {materiel.numeroSerie}</p>
                            {/* Formatage de la date en français */}
                            <p className="text-sm text-gray=600"><span className="font-medium">Installé le:</span> {new Date(materiel.dateInstallation).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Conteneur pour les toasts */}
      <ToastContainer />
    </div>
  );
}
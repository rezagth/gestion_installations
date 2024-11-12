'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { FaSpinner, FaExclamationTriangle, FaPlus, FaSearch, FaTools, FaBoxOpen } from 'react-icons/fa';
import { Card } from "@/components/ui/card"; // Importation du composant Card de Shadcn
import { Button } from "@/components/ui/button"; // Importation du composant Button de Shadcn
import { Input } from "@/components/ui/input"; // Importation du composant Input de Shadcn
import { Skeleton } from "@/components/ui/skeleton"; // Importation du composant Skeleton de Shadcn
import { ToastContainer, toast } from 'react-toastify'; // Importation de Toastify
import 'react-toastify/dist/ReactToastify.css'; // Styles de Toastify

interface Remplacement {
  id: string;
  dateRemplacement: string;
  installation: {
    id: number;
    nom: string;
    dateCreation: string;
    organisation: string;
  } | null;
  ancienMateriel: {
    id: string;
    marque: string;
    modele: string;
    numeroSerie: string;
    typeMateriel: string;
    dateInstallation: string;
  } | null;
  nouveauMateriel: {
    id: string;
    marque: string;
    modele: string;
    numeroSerie: string;
    typeMateriel: string;
    dateInstallation: string;
  } | null;
}

const Remplacements = () => {
  const [remplacements, setRemplacements] = useState<Remplacement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Remplacement | 'installation.nom', direction: 'asc' | 'desc' }>({ key: 'dateRemplacement', direction: 'desc' });

  useEffect(() => {
    fetchRemplacements();
  }, []);

  const fetchRemplacements = async () => {
    try {
      const response = await fetch('/api/remplacements');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des remplacements');
      }
      const data = await response.json();
      setRemplacements(data.remplacements);
      toast.success('Remplacements chargés avec succès !'); // Notification de succès
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      toast.error("Erreur lors du chargement des remplacements"); // Notification d'erreur
      setIsLoading(false);
    }
  };

  const filteredAndSortedRemplacements = useMemo(() => {
    let result = remplacements.filter(remplacement =>
      remplacement.installation?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      remplacement.ancienMateriel?.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
      remplacement.nouveauMateriel?.marque.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      if (sortConfig.key === 'installation.nom') {
        return (a.installation?.nom || '').localeCompare(b.installation?.nom || '') * (sortConfig.direction === 'asc' ? 1 : -1);
      }
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [remplacements, searchTerm, sortConfig]);

  const requestSort = (key: keyof Remplacement | 'installation.nom') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatDateFR = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

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
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Liste des Remplacements</h1>
        <Link 
          href="/remplacements/nouveau" 
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition duration-300 shadow-md text-center w-full sm:w-auto flex items-center"
        >
          <FaPlus className="inline mr-2" /> Nouveau Remplacement
        </Link>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Rechercher par nom d'installation ou marque de matériel"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500 shadow-sm transition duration-200 ease-in-out"
        />
      </div>

      {filteredAndSortedRemplacements.length === 0 ? (
        <Card className="text-gray-500 text-center text-lg bg-white p-8 rounded-lg shadow">Aucun remplacement trouvé.</Card>
      ) : (
        <div className="grid grid-cols-1 gap-y-8">
          {filteredAndSortedRemplacements.map((remplacement) => (
            <Card key={remplacement.id} className={`border-l-4 p-6 rounded-lg shadow-lg transition duration-300 hover:bg-gray-100 hover:border-blue-600`}>
              <div className="flex items-center mb-4">
                {remplacement.ancienMateriel ? (
                  <FaTools className="text-xl mr-2 text-blue-600" />
                ) : (
                  <FaBoxOpen className="text-xl mr-2 text-green600" />
                )}
                <h2 className="text-xl font-semibold text-gray-800">{formatDateFR(remplacement.dateRemplacement)}</h2>
              </div>
              <p className="font-medium"><strong>Installation:</strong> {remplacement.installation?.nom || 'N/A'}</p>
              <p className="font-medium"><strong>Ancien Matériel:</strong> {remplacement.ancienMateriel ? `${remplacement.ancienMateriel.marque} ${remplacement.ancienMateriel.modele}` : 'N/A'}</p>
              <p className="font-medium"><strong>Nouveau Matériel:</strong> {remplacement.nouveauMateriel ? `${remplacement.nouveauMateriel.marque} ${remplacement.nouveauMateriel.modele}` : 'N/A'}</p>
            </Card>
          ))}
        </div>
      )}
      
      {/* Suppression du footer pour un rendu plus épuré */}
      
    </div>
  );
};

export default Remplacements;

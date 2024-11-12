'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"; // Importation du composant Button de Shadcn
import { Skeleton } from "@/components/ui/skeleton"; // Importation du composant Skeleton de Shadcn
import { Card } from "@/components/ui/card"; // Importation du composant Card de Shadcn
import { ToastContainer, toast } from 'react-toastify'; // Importation de Toastify
import 'react-toastify/dist/ReactToastify.css'; // Styles de Toastify

type Materiel = {
  id: string;
  nom: string;
  marque: string;
  modele: string;
  numeroSerie: string;
  typeMateriel: string;
  dateInstallation: string;
}

type Installation = {
  id: string;
  nom: string;
}

function getCurrentDateFR() {
  const now = new Date();
  return now.toLocaleDateString('fr-CA'); // Format YYYY-MM-DD
}

export default function RemplacementPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [selectedInstallation, setSelectedInstallation] = useState<string | null>(null);
  const [materiels, setMateriels] = useState<Materiel[]>([]);
  
  const [nouveauMateriel, setNouveauMateriel] = useState<Materiel>({
    id: '',
    nom: '',
    marque: '',
    modele: '',
    numeroSerie: '',
    typeMateriel: '',
    dateInstallation: getCurrentDateFR()
  });

  useEffect(() => {
    const fetchInstallations = async () => {
      try {
        const res = await fetch('/api/installations');
        if (!res.ok) throw new Error('Erreur lors de la récupération des installations');
        const data = await res.json();
        setInstallations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erreur lors du chargement des installations:', err);
        setError('Impossible de charger les installations');
        setInstallations([]);
        toast.error('Impossible de charger les installations');
      }
    };

    fetchInstallations();
  }, []);

  useEffect(() => {
    const fetchMateriels = async () => {
      if (selectedInstallation) {
        try {
          const res = await fetch(`/api/materiels?installationId=${selectedInstallation}`);
          if (!res.ok) throw new Error('Erreur lors de la récupération des matériels');
          const data = await res.json();
          setMateriels(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('Erreur lors du chargement des matériels:', err);
          setError('Impossible de charger les matériels');
          setMateriels([]);
          toast.error('Impossible de charger les matériels');
        }
      }
    };

    fetchMateriels();
  }, [selectedInstallation]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!selectedInstallation) {
      setError('Veuillez sélectionner une installation');
      toast.error('Veuillez sélectionner une installation');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(event.currentTarget);
    
    const replacementData = {
      installationId: selectedInstallation,
      ancienMaterielId: formData.get('ancienMateriel') as string,
      nouveauMateriel: {
        ...nouveauMateriel,
        dateInstallation: new Date(nouveauMateriel.dateInstallation).toISOString()
      }
    };

    try {
      const response = await fetch('/api/remplacements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(replacementData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du remplacement');
      }

      toast.success('Remplacement effectué avec succès');
      router.push('/remplacements');
    } catch (error) {
      console.error('Erreur lors du remplacement:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue lors du remplacement. Veuillez réessayer.');
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue lors du remplacement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNouveauMaterielChange = (field: keyof Materiel, value: string) => {
    setNouveauMateriel(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Nouveau Remplacement</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        
        <div>
          <label htmlFor="installation" className="block text-sm font-medium text-gray-700">Installation</label>
          <select
            id="installation"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedInstallation || ''}
            onChange={(e) => setSelectedInstallation(e.target.value)}
          >
            <option value="">Sélectionnez une installation</option>
            {installations.map((installation) => (
              <option key={installation.id} value={installation.id}>
                {installation.nom}
              </option>
            ))}
          </select>
        </div>

        {selectedInstallation && (
          <>
            <div>
              <label htmlFor="ancienMateriel" className="block text-sm font-medium text-gray-700">Matériel à remplacer</label>
              <select
                id="ancienMateriel"
                name="ancienMateriel"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Sélectionnez le matériel à remplacer</option>
                {materiels.map((materiel) => (
                  <option key={materiel.id} value={materiel.id}>
                    {materiel.marque} {materiel.modele} - {materiel.numeroSerie}
                  </option>
                ))}
              </select>
            </div>

            <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-600">Nouveau Matériel</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={nouveauMateriel.nom}
                onChange={(e) => handleNouveauMaterielChange('nom', e.target.value)}
              />
              <input
                type="text"
                placeholder="Marque"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={nouveauMateriel.marque}
                onChange={(e) => handleNouveauMaterielChange('marque', e.target.value)}
              />
              <input
                type="text"
                placeholder="Modèle"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={nouveauMateriel.modele}
                onChange={(e) => handleNouveauMaterielChange('modele', e.target.value)}
              />
              <input
                type="text"
                placeholder="Numéro de série"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={nouveauMateriel.numeroSerie}
                onChange={(e) => handleNouveauMaterielChange('numeroSerie', e.target.value)}
              />
              <input
                type="text"
                placeholder="Type de matériel"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={nouveauMateriel.typeMateriel}
                onChange={(e) => handleNouveauMaterielChange('typeMateriel', e.target.value)}
              />
              <input
                type="date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={nouveauMateriel.dateInstallation}
                onChange={(e) => handleNouveauMaterielChange('dateInstallation', e.target.value)}
              />
            </div>
          </>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Chargement...' : 'Effectuer le Remplacement'}
        </Button>
      </form>

      {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}

      {/* Container for Toast notifications */}
      <ToastContainer />
    </div>
  );
}

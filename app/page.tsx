'use client';

import Link from 'next/link';
import { Card } from "@/components/ui/card"; // Importation du composant Card de Shadcn
import { Button } from "@/components/ui/button"; // Importation du composant Button de Shadcn
import { FaPlus, FaClipboardList, FaChartPie } from 'react-icons/fa';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [totals, setTotals] = useState({ installations: 0, remplacements: 0, materiels: 0 });

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const installationsResponse = await fetch('/api/installations');
        const installationsData = await installationsResponse.json();
        const remplacementsResponse = await fetch('/api/remplacements');
        const remplacementsData = await remplacementsResponse.json();
        const materielsResponse = await fetch('/api/materiels');
        const materielsData = await materielsResponse.json();

        setTotals({
          installations: installationsData.length,
          remplacements: remplacementsData.length,
          materiels: materielsData.length,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des totaux", error);
      }
    };

    fetchTotals();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 bg-white">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Bienvenue dans l'application de gestion des installations</h1>
      
      <div className="flex justify-center space-x-4 mb-6">
        <Link 
          href="/installations/nouvelle" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md text-lg font-medium flex items-center"
        >
          <FaPlus className="mr-2" /> Nouvelle Installation
        </Link>
        <Link 
          href="/remplacements/nouveau" 
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 shadow-md text-lg font-medium flex items-center"
        >
          <FaPlus className="mr-2" /> Nouveau Remplacement
        </Link>
      </div>

      {/* Grille pour les statistiques et les dernières installations/remplacements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
        
        {/* Statistiques */}
        <Link href="/statistiques" className="flex flex-col">
          <Card className="p-4 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center">
            <FaChartPie className="text-blue-600 mb-2" size={40} />
            <h2 className="text-xl font-semibold mb-2">Statistiques</h2>
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between w-full">
                <span>Total Installations:</span>
                <span className="font-bold">{totals.installations}</span>
              </div>
              <div className="flex justify-between w-full">
                <span>Total Remplacements:</span>
                <span className="font-bold">{totals.remplacements}</span>
              </div>
              <div className="flex justify-between w-full">
                <span>Total Matériels:</span>
                <span className="font-bold">{totals.materiels}</span>
              </div>
            </div>
          </Card>
        </Link>

        {/* Dernières Installations */}
        <Card className="p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-md hover:shadow-lg transition duration=300">
          <h2 className="text-xl font-semibold mb-4">Dernières Installations</h2>
          {/* Ici, vous pouvez ajouter une liste des dernières installations */}
          <Link href="/installations" className="text-blue-600 hover:underline flex items-center">
            <FaClipboardList className="mr-2" /> Voir toutes les installations
          </Link>
        </Card>

        {/* Derniers Remplacements */}
        <Card className="p-4 bg-green-50 border border-green-200 rounded-lg shadow-md hover:shadow-lg transition duration=300">
          <h2 className="text-xl font-semibold mb-4">Derniers Remplacements</h2>
          {/* Ici, vous pouvez ajouter une liste des derniers remplacements */}
          <Link href="/remplacements/" className="text-green-600 hover:underline flex items-center">
            <FaClipboardList className="mr-2" /> Voir tous les remplacements
          </Link>
        </Card>

      </div>

      {/* Bouton d'Information Supplémentaire */}
      <Button variant="outline" className="mt-6 w-full max-w-xs">
        En savoir plus sur l'application
      </Button>
    </div>
  );
}
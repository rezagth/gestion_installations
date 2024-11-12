'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link'; // Importation du composant Link de Next.js
import { Card } from "@/components/ui/card"; // Importation du composant Card de Shadcn
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'; // Importation des composants de Recharts
import { FaClipboardList, FaTools, FaBoxOpen } from 'react-icons/fa'; // Icônes pour les statistiques

export default function StatistiquesPage() {
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
          installations: installationsData.length || 0,
          remplacements: remplacementsData.length || 0,
          materiels: materielsData.length || 0,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des totaux", error);
      }
    };

    fetchTotals();
  }, []);

  // Configuration des données pour le graphique
  const data = [
    { name: 'Installations', value: totals.installations },
    { name: 'Remplacements', value: totals.remplacements },
    { name: 'Matériels', value: totals.materiels },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Statistiques de Gestion</h1>

      <div className="max-w-5xl w-full p-6">
        <div className="flex justify-between mb-6">
          <Card className="p-4 border border-gray-300 rounded-lg shadow-md flex-1 mr-2">
            <div className="flex items-center">
              <FaClipboardList className="text-blue-600 mr-2" size={24} />
              <span className="font-bold">Total Installations</span>
            </div>
            <span className="text-3xl font-bold">{totals.installations || 0}</span>
          </Card>

          <Card className="p-4 border border-gray-300 rounded-lg shadow-md flex-1 mx-2">
            <div className="flex items-center">
              <FaTools className="text-green-600 mr-2" size={24} />
              <span className="font-bold">Total Remplacements</span>
            </div>
            <span className="text-3xl font-bold">{totals.remplacements || 0}</span>
          </Card>

          <Card className="p-4 border border-gray-300 rounded-lg shadow-md flex-1 ml-2">
            <div className="flex items-center">
              <FaBoxOpen className="text-orange-600 mr-2" size={24} />
              <span className="font-bold">Total Matériels</span>
            </div>
            <span className="text-3xl font-bold">{totals.materiels || 0}</span>
          </Card>
        </div>

        {/* Graphique des statistiques */}
        <Card p={4} bg="white" borderWidth={1} borderColor="gray.300" borderRadius="md">
          <h2 className="text-xl font-semibold mb-4">Graphique des Statistiques</h2>
          <BarChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </Card>
      </div>
    </div>
  );
}
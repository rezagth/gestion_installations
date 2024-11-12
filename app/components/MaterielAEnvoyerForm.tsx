// components/MaterielAEnvoyerForm.tsx

import { useState } from 'react'

type MaterielAEnvoyerFormProps = {
  onSubmit: (data: { nom: string; quantite: number }) => void
}

export default function MaterielAEnvoyerForm({ onSubmit }: MaterielAEnvoyerFormProps) {
  const [nom, setNom] = useState('')
  const [quantite, setQuantite] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ nom, quantite })
    setNom('')
    setQuantite(1)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom du matériel</label>
        <input
          type="text"
          id="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="quantite" className="block text-sm font-medium text-gray-700">Quantité</label>
        <input
          type="number"
          id="quantite"
          value={quantite}
          onChange={(e) => setQuantite(Number(e.target.value))}
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Ajouter à la liste
      </button>
    </form>
  )
}
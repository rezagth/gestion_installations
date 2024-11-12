'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  organisation: z.string().min(1, 'L\'organisation est requise'),
  client: z.string().min(1, 'Le client est requis'),
  boutique: z.string().min(1, 'La boutique est requise'),
  materiel: z.object({
    nom: z.string().min(1, 'Le nom du matériel est requis'),
    type: z.string().min(1, 'Le type de matériel est requis'),
  }).optional(),
})

type FormData = z.infer<typeof schema>

type InstallationFormProps = {
  onSubmit: (data: FormData) => void
  isLoading: boolean
}

export default function InstallationForm({ onSubmit, isLoading }: InstallationFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const [showMaterielForm, setShowMaterielForm] = useState(false)

  const onSubmitForm = (data: FormData) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">Informations de l'Installation</h2>
      
      <div>
        <label htmlFor="organisation" className="block text-sm font-medium text-gray-700">Organisation</label>
        <input
          type="text"
          id="organisation"
          {...register('organisation')}
          className={`mt-1 block w-full rounded-md border ${errors.organisation ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
        />
        {errors.organisation && <p className="mt-1 text-sm text-red-600">{errors.organisation.message}</p>}
      </div>

      <div>
        <label htmlFor="client" className="block text-sm font-medium text-gray-700">Client</label>
        <input
          type="text"
          id="client"
          {...register('client')}
          className={`mt-1 block w-full rounded-md border ${errors.client ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
        />
        {errors.client && <p className="mt-1 text-sm text-red-600">{errors.client.message}</p>}
      </div>

      <div>
        <label htmlFor="boutique" className="block text-sm font-medium text-gray-700">Boutique</label>
        <input
          type="text"
          id="boutique"
          {...register('boutique')}
          className={`mt-1 block w-full rounded-md border ${errors.boutique ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
        />
        {errors.boutique && <p className="mt-1 text-sm text-red-600">{errors.boutique.message}</p>}
      </div>

      <button
        type="button"
        onClick={() => setShowMaterielForm(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Ajouter Matériel
      </button>

      {showMaterielForm && (
        <div className="space-y-4 mt-4 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-medium">Détails du Matériel</h3>
          <div>
            <label htmlFor="materiel.nom" className="block text-sm font-medium text-gray-700">Nom du matériel</label>
            <input
              type="text"
              id="materiel.nom"
              {...register('materiel.nom')}
              className={`mt-1 block w-full rounded-md border ${errors.materiel?.nom ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
            />
            {errors.materiel?.nom && <p className="mt-1 text-sm text-red-600">{errors.materiel.nom.message}</p>}
          </div>
          <div>
            <label htmlFor="materiel.type" className="block text-sm font-medium text-gray-700">Type de matériel</label>
            <input
              type="text"
              id="materiel.type"
              {...register('materiel.type')}
              className={`mt-1 block w-full rounded-md border ${errors.materiel?.type ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
            />
            {errors.materiel?.type && <p className="mt-1 text-sm text-red-600">{errors.materiel.type.message}</p>}
          </div>
        </div>
      )}

      <button 
        type="submit" 
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Création en cours...' : 'Créer l\'installation et le matériel'}
      </button>
    </form>
  )
}

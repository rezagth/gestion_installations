'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  nom: z.string().min(1, 'Le nom du produit est requis'),
  type: z.string().min(1, 'Le type de produit est requis'),
})

type FormData = z.infer<typeof schema>

type ProduitFormProps = {
  onSubmit: (data: FormData) => void
  isLoading: boolean
}

export default function ProduitForm({ onSubmit, isLoading }: ProduitFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom du produit</label>
        <input
          type="text"
          id="nom"
          {...register('nom')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>}
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type de produit</label>
        <input
          type="text"
          id="type"
          {...register('type')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
      </div>
      <button 
        type="submit" 
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Ajout en cours...' : 'Ajouter le produit'}
      </button>
    </form>
  )
}
import { useState } from 'react';
import { Materiel } from '@prisma/client';

type RemplacementFormProps = {
  installationId: string;
  materiels: Materiel[];
  onSubmit: (data: { ancienMaterielId: string; nouveauMaterielNom: string; nouveauMaterielType: string }) => void;
};

export default function RemplacementForm({ installationId, materiels, onSubmit }: RemplacementFormProps) {
  const [ancienMaterielId, setAncienMaterielId] = useState('');
  const [nouveauMaterielNom, setNouveauMaterielNom] = useState('');
  const [nouveauMaterielType, setNouveauMaterielType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ancienMaterielId, nouveauMaterielNom, nouveauMaterielType });
    setAncienMaterielId('');
    setNouveauMaterielNom('');
    setNouveauMaterielType('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={ancienMaterielId}
        onChange={(e) => setAncienMaterielId(e.target.value)}
        required
      >
        <option value="">Sélectionnez le matériel à remplacer</option>
        {materiels.map((materiel) => (
          <option key={materiel.id} value={materiel.id}>
            {materiel.nom} ({materiel.type})
          </option>
        ))}
      </select>
      <input
        type="text"
        value={nouveauMaterielNom}
        onChange={(e) => setNouveauMaterielNom(e.target.value)}
        placeholder="Nom du nouveau matériel"
        required
      />
      <input
        type="text"
        value={nouveauMaterielType}
        onChange={(e) => setNouveauMaterielType(e.target.value)}
        placeholder="Type du nouveau matériel"
        required
      />
      <button type="submit">Effectuer le remplacement</button>
    </form>
  );
}
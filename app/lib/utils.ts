import { Installation, Organisation, Materiel, Remplacement } from '@prisma/client'

export type InstallationWithDetails = Installation & {
  organisation: Organisation | null
  materiels: Materiel[]
  remplacements: (Remplacement & {
    ancienMateriel: Materiel
    nouveauMateriel: Materiel
  })[]
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getInstallationStatus(installation: InstallationWithDetails): string {
  if (installation.remplacements.length > 0) {
    return 'Modifiée'
  }
  return 'Initiale'
}
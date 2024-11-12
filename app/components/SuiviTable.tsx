import { InstallationWithDetails, formatDate, getInstallationStatus } from '../lib/utils'

type SuiviTableProps = {
  installations: InstallationWithDetails[]
}

export default function SuiviTable({ installations }: SuiviTableProps) {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Date
          </th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Organisation
          </th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Statut
          </th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Matériels installés
          </th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Remplacements
          </th>
        </tr>
      </thead>
      <tbody>
        {installations.map((installation) => (
          <tr key={installation.id}>
            <td className="px-6 py-4 whitespace-nowrap">{formatDate(installation.dateCreation)}</td>
            <td className="px-6 py-4 whitespace-nowrap">{installation.organisation?.nom || 'N/A'}</td>
            <td className="px-6 py-4 whitespace-nowrap">{getInstallationStatus(installation)}</td>
            <td className="px-6 py-4">
              <ul className="list-disc list-inside">
                {installation.materiels.map((materiel) => (
                  <li key={materiel.id}>{materiel.nom} ({materiel.type})</li>
                ))}
              </ul>
            </td>
            <td className="px-6 py-4">
              <ul className="list-disc list-inside">
                {installation.remplacements.map((remplacement) => (
                  <li key={remplacement.id}>
                    {remplacement.ancienMateriel.nom} remplacé par {remplacement.nouveauMateriel.nom} le {formatDate(remplacement.dateRemplacement)}
                  </li>
                ))}
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
export type Organisation = {
    id: number;
    name: string;
    sousOrganisations: Organisation[];
    organisationParent?: Organisation;
    organisationParentId?: number;
    installations: Installation[];
  }
  
  export type Installation = {
    id: number;
    name: string;
    client: string;
    boutique: string;
    dateCreation: string;
    numeroFacture?: string;
    dateFacture?: string;
    organisationId?: number;
    organisation?: Organisation;
    materiels: Materiel[];
    remplacements: Remplacement[];
  }
  
  export type Materiel = {
    id: string;
    marque: string;
    modele: string;
    numeroSerie: string;
    typeMateriel: string;
    dateInstallation: string;
    installationId: number;
    installation: Installation;
    remplacementsPrecedents: Remplacement[];
    remplacementsSuivants: Remplacement[];
  }
  
  export type Remplacement = {
    id: string;
    dateRemplacement: string;
    ancienMaterielId: string;
    nouveauMaterielId: string;
    installationId: number;
    installation: Installation;
    ancienMateriel: Materiel;
    nouveauMateriel: Materiel;
  }

  
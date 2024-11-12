-- CreateTable
CREATE TABLE `Installation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `client` VARCHAR(191) NOT NULL,
    `boutique` VARCHAR(191) NOT NULL,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `numeroFacture` VARCHAR(191) NULL,
    `dateFacture` DATETIME(3) NULL,
    `organisation` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Materiel` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `marque` VARCHAR(191) NOT NULL,
    `modele` VARCHAR(191) NOT NULL,
    `numeroSerie` VARCHAR(191) NOT NULL,
    `typeMateriel` VARCHAR(191) NOT NULL,
    `dateInstallation` DATETIME(3) NOT NULL,
    `installationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Remplacement` (
    `id` VARCHAR(191) NOT NULL,
    `dateRemplacement` DATETIME(3) NOT NULL,
    `ancienMaterielId` VARCHAR(191) NOT NULL,
    `nouveauMaterielId` VARCHAR(191) NOT NULL,
    `installationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Materiel` ADD CONSTRAINT `Materiel_installationId_fkey` FOREIGN KEY (`installationId`) REFERENCES `Installation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Remplacement` ADD CONSTRAINT `Remplacement_installationId_fkey` FOREIGN KEY (`installationId`) REFERENCES `Installation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Remplacement` ADD CONSTRAINT `Remplacement_ancienMaterielId_fkey` FOREIGN KEY (`ancienMaterielId`) REFERENCES `Materiel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Remplacement` ADD CONSTRAINT `Remplacement_nouveauMaterielId_fkey` FOREIGN KEY (`nouveauMaterielId`) REFERENCES `Materiel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `create_by` INTEGER NULL,
    `is_delete` INTEGER NULL DEFAULT 0,
    `update_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_by` INTEGER NULL,
    `email` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `avata` VARCHAR(191) NULL,
    `dob` DATETIME(3) NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    `phone_number` VARCHAR(255) NULL,
    `token` VARCHAR(500) NULL,
    `refresh_token` VARCHAR(500) NULL,
    `role` ENUM('ADMIN', 'PILOT', 'TOUR_GUIDE') NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `create_by` INTEGER NULL,
    `is_delete` INTEGER NULL DEFAULT 0,
    `update_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_by` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `create_by` INTEGER NULL,
    `is_delete` INTEGER NULL DEFAULT 0,
    `update_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_by` INTEGER NULL,
    `action` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_role` (
    `user_id` INTEGER NOT NULL,
    `role_id` INTEGER NOT NULL,

    UNIQUE INDEX `user_role_user_id_role_id_key`(`user_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_permission` (
    `permission_id` INTEGER NOT NULL,
    `role_id` INTEGER NOT NULL,

    UNIQUE INDEX `role_permission_permission_id_role_id_key`(`permission_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `route` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `create_by` INTEGER NULL,
    `is_delete` INTEGER NULL DEFAULT 0,
    `update_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_by` INTEGER NULL,
    `locations` JSON NOT NULL,
    `description` DATETIME(3) NOT NULL,
    `flight_length` INTEGER NOT NULL,
    `duration` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flight_schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `create_by` INTEGER NULL,
    `is_delete` INTEGER NULL DEFAULT 0,
    `update_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_by` INTEGER NULL,
    `route_id` INTEGER NOT NULL,
    `helicopter_id` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `start` DATETIME(3) NOT NULL,
    `end` DATETIME(3) NOT NULL,
    `duration` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_flight_schedule` (
    `user_id` INTEGER NOT NULL,
    `flight_schedule_id` INTEGER NOT NULL,

    UNIQUE INDEX `user_flight_schedule_user_id_flight_schedule_id_key`(`user_id`, `flight_schedule_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `work_schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `create_by` INTEGER NULL,
    `is_delete` INTEGER NULL DEFAULT 0,
    `update_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_by` INTEGER NULL,
    `user_id` INTEGER NOT NULL,
    `date` JSON NOT NULL,
    `startMorning` DATETIME(3) NULL,
    `endMorning` DATETIME(3) NULL,
    `startAfternoon` DATETIME(3) NULL,
    `endAfternoon` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Helicopter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `create_by` INTEGER NULL,
    `is_delete` INTEGER NULL DEFAULT 0,
    `update_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_by` INTEGER NULL,
    `capacity` JSON NOT NULL,
    `description` VARCHAR(191) NULL,
    `img` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `engine` VARCHAR(191) NULL,
    `speed` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdventureOparatingTime` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `create_by` INTEGER NULL,
    `is_delete` INTEGER NULL DEFAULT 0,
    `update_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_by` INTEGER NULL,
    `route_id` INTEGER NOT NULL,
    `startMorning` DATETIME(3) NULL,
    `endMorning` DATETIME(3) NULL,
    `startAfternoon` DATETIME(3) NULL,
    `endAfternoon` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flight_schedule` ADD CONSTRAINT `flight_schedule_route_id_fkey` FOREIGN KEY (`route_id`) REFERENCES `route`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flight_schedule` ADD CONSTRAINT `flight_schedule_helicopter_id_fkey` FOREIGN KEY (`helicopter_id`) REFERENCES `Helicopter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_flight_schedule` ADD CONSTRAINT `user_flight_schedule_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_flight_schedule` ADD CONSTRAINT `user_flight_schedule_flight_schedule_id_fkey` FOREIGN KEY (`flight_schedule_id`) REFERENCES `flight_schedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `work_schedule` ADD CONSTRAINT `work_schedule_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdventureOparatingTime` ADD CONSTRAINT `AdventureOparatingTime_route_id_fkey` FOREIGN KEY (`route_id`) REFERENCES `route`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

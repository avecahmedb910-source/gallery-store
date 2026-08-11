CREATE TABLE `orderIntents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`productName` varchar(220) NOT NULL,
	`variant` varchar(180) NOT NULL,
	`quantity` int NOT NULL,
	`customerName` varchar(180) NOT NULL,
	`customerPhone` varchar(40) NOT NULL,
	`customerAddress` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orderIntents_id` PRIMARY KEY(`id`)
);

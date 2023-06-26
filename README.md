# The Big Project

Ce projet est un projet de fin d'année en SUPDEWEB dev 3 qui me permet d'apprendre l'utilisation de React.js pour le frontend et Node.js pour le backend, avec une base de données MariaDB.

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre système :

- Node.js - Assurez-vous d'installer une version compatible de Node.js (v18.12.1).

- Assurez-vous d'installer un serveur de base de données, par exemple Wamp ou Mamp.

- MariaDB - Assurez-vous d'installer MariaDB et d'avoir un serveur MariaDB en cours d'exécution (v10.6.5).

## Installation du code

1. Téléchargement du code source

   - Téléchargez le code source de votre projet sur votre machine locale.

   - Ouvrez un terminal et exécutez les commandes suivantes :
     ```
     git clone https://github.com/Sharko303/theBigProject.git
     cd theBigProject
     ```

2. FrontEnd

   - Configuration du frontEnd (React.js)

     Vérifiez le chemin de build dans le fichier .env (`BUILD_PATH=../server/public`)

   - Installation des dépendances du frontend (React.js)

     Ouvrez une invite de commande/terminal dans le dossier "client".

     Exécutez la commande suivante pour installer les dépendances :
     ```
     npm install
     ```
    - Ou alors il faut télécharger le fichier zip du projet sur votre machine.

3. BackEnd

   - Configuration du backend (Node.js)

     Ouvrez une invite de commande/terminal dans le dossier "server".

     Renommez le fichier `.env.example` en `.env`.

     Ouvrez le fichier `.env` et configurez les variables d'environnement en fonction de votre configuration de base de données MariaDB et de vos préférences (par exemple, nom de la base de données, nom d'utilisateur, mot de passe, etc.).

   - Installation des dépendances du backend (Node.js)

     Toujours dans le dossier "server", exécutez la commande suivante pour installer les dépendances :
     ```
     npm install
     ```

## Base de données

1. Configuration de la base de données

   Assurez-vous que votre serveur MariaDB est en cours d'exécution.

   - Installation avec phpMyAdmin :

     Assurez-vous que l'utilisateur a accès à phpMyAdmin sur son serveur. Vous pouvez y accéder en utilisant l'URL correspondante (par exemple, http://localhost/phpmyadmin).

     Connectez-vous à phpMyAdmin en utilisant les identifiants appropriés (nom d'utilisateur et mot de passe).

     Cliquez sur l'onglet "Importer" (ou "Import") dans la barre de navigation supérieure.

     Cliquez sur le bouton "Parcourir" (ou "Choose File") pour sélectionner le fichier qui se trouve à la racine du projet dans le dossier "Schémas_base_de_données" → `thebigproject.sql`.

     Cliquez sur le bouton "Exécuter" (ou "Go") pour importer le fichier. Attendez que le processus soit terminé.

     Une fois l'importation terminée, la base de données spécifiée contiendra maintenant les tables et les données du fichier `thebigproject.sql`.

   - Installation en utilisant la ligne de commande :

     Assurez-vous que l'utilisateur a accès à la ligne de commande sur son serveur.

     Connectez-vous à votre serveur MariaDB en utilisant les identifiants appropriés (nom d'utilisateur et mot de passe).

     Placez-vous à la racine du projet dans le dossier "Schémas_base_de_données" → `thebigproject.sql` dans l'emplacement du fichier.

     Dans la console de ligne de commande, exécutez la commande suivante pour importer le fichier `thebigproject.sql` :
     ```
     mysql -u [nom_utilisateur] -p [nom_base_de_données] < chemin/vers/thebigproject.sql
     ```
     Remplacez `[nom_utilisateur]` par le nom d'utilisateur de la base de données, `[nom_base_de_données]` par le nom de la base de données cible et `chemin/vers/thebigproject.sql` par le chemin d'accès réel du fichier `thebigproject.sql` sur le serveur.

     Appuyez sur la touche "Entrée" pour exécuter la commande. Vous serez invité à entrer le mot de passe de l'utilisateur de la base de données.

     Attendez que l'importation soit terminée. Une fois terminée, la base de données spécifiée contiendra les tables et les données du fichier `thebigproject.sql`.

## Utilisation du projet

1. Démarrage du serveur de développement

   Dans le dossier "server", exécutez la commande suivante pour démarrer le serveur Node.js :
   ```
   npm run server
   ```
   Dans une autre invite de commande/terminal, ouvrez encore une fois le dossier "server".

   Exécutez la commande suivante pour démarrer le serveur de développement React.js :
   
   ```
   npm run client
   ```
2. Accès à l'application

   Ouvrez un navigateur web et accédez à l'URL suivante : [http://localhost:3000](http://localhost:3000)
   Vous devriez voir votre application fonctionner localement.
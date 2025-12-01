# GeoReact Blanc

Ceci est un projet de démarrage NextJS dans Firebase Studio. C'est un géoportail moderne construit avec React et Next.js.

## Pour commencer

Pour commencer, jetez un coup d'œil au fichier `src/app/page.tsx`.

### Configuration

Avant de lancer l'application, vous devez configurer votre clé API Google Maps.

1.  Créez un fichier nommé `.env.local` à la racine du projet.
2.  Ajoutez la ligne suivante dans ce fichier en remplaçant `VOTRE_CLE_API_GOOGLE_MAPS` par votre clé personnelle :
    ```
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="VOTRE_CLE_API_GOOGLE_MAPS"
    ```
    Vous pouvez obtenir une clé API depuis la [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/).

## Développement local

Pour lancer l'application en local, suivez ces étapes :

1.  **Installer les dépendances :**
    Ouvrez un terminal à la racine du projet et exécutez la commande suivante pour installer tous les paquets nécessaires.
    ```bash
    npm install
    ```

2.  **Lancer le serveur de développement :**
    Une fois les dépendances installées, lancez l'application avec la commande :
    ```bash
    npm run dev
    ```

L'application sera alors accessible à l'adresse [http://localhost:9002](http://localhost:9002).

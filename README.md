# music-diagram-generator

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/Bludwarf/music-diagram-generator)

## Preview mobile

Sur Stackblitz utilliser une largeur de 360px pour avoir un preview assez fidèle d'un affichage mobile d'une largeur de
720px.

## Nouveau morceau

Optionnel :

> Trouver la toute fin du sample dans Ableton Live. Ce sera le `sampleBeatTimeDuration`.

> Exemple si fin à la mesure 92, alors sampleBeatTimeDuration = 92 * 4

Copier le fichier als dans [src/assets/als](src/assets/als).

Dézipper manuellement le fichier als et lui ajouter l'extension `.als.xml`.

> Ajuster le `sampleBeatTimeDuration` trouvé précédemment.

Uploader le fichier .als.xml dans le [convertisseur](https://bludwarf.github.io/music-diagram-generator/convert).

Copier le contenu json dans un fichier json dans le dossier [src/assets/structures](src/assets/structures).

Copier le contenu ts dans un fichier du dossier [src/app/song/entries](src/app/song/entries).

Compléter le fichier [mobile-rehearsal.ts](src/app/rehearsal/mobile/mobile-rehearsal.ts) :

1. Ajouter un import vers le `SongEntry`
2. Ajouter le songEntry importé à `songEntries`

Ajuster le fichier dupliqué :

1. `events`
2. `patterns`

# Test Service Worker

Builder en mode prod :

```shell
npm run ng -- build --configuration production
```

Installer `http-serve` :

```shell
npm install http-server -g
```

Lancer le serveur :

```shell
http-server ./dist/browser -c-1 -o
```

# Exécuter certains tests unitaires

On a d'abord configuré Codespace pour avoir tous les outils nécessaire en suivant [cette doc](https://docs.github.com/fr/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/setting-up-your-nodejs-project-for-codespaces). Ainsi on a automatiquement Chrome d'installé.

```bash
npm test -- --include='**/css-utils.spec.ts'
```

On peut également utiliser l'extension VSCode `Karma Test Explorer` mais il faut d'abord configurer l'environnement :

```bash
npm install
export PATH="./node_modules/.bin:$PATH"
export CHROME_BIN=/opt/chrome/chrome
```

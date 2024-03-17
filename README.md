# music-diagram-generator

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/Bludwarf/music-diagram-generator)

## Preview mobile

Sur Stackblitz utilliser une largeur de 360px pour avoir un preview assez fidèle d'un affichage mobile d'une largeur de 720px.

## Nouveau morceau

Trouver la toute fin du sample dans Ableton Live. Ce sera le `sampleBeatTimeDuration`.

Exemple si fin à la mesure 92, alors sampleBeatTimeDuration = 92 * 4

Copier le fichier als dans [src/assets/als](src/assets/als).

Dézipper manuellement le fichier als et lui ajouter l'extension `.als.xml`.

Utiliser le nom du fichier pour modifier temporairement le test unitaire `should get JSON structure from Petit papillon`.
Ajuster le `sampleBeatTimeDuration` trouvé précédemment.
Lancer le test, puis trouver la conversion JSON dans la console.

Copier le contenu dans un fichier json dans le dossier [src/assets/structures](src/assets/structures).

Dupliquer un fichier du dossier [src/app/song/entries](src/app/song/entries).

Compléter le fichier [src/app/song/song.component.ts](src/app/song/song.component.ts) :

1. Ajouter un import vers le `SongEntry`
2. Ajouter le songEntry importé à `songEntries`

Ajuster le fichier dupliqué :

1. `export default name`
2. `events`
3. `patterns`

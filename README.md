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

Compléter le fichier [src/app/song/song.component.ts](src/app/song/song.component.ts) :

1. Ajouter un import vers le `SongEntry`
2. Ajouter le songEntry importé à `songEntries`

Ajuster le fichier dupliqué :

1. `events`
2. `patterns`
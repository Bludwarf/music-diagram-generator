# als

## Piste audio original

XPath relatif
à `/Ableton/LiveSet/Tracks/AudioTrack[1]/DeviceChain/MainSequencer/Sample/ArrangerAutomation/Events/AudioClip`.

| XPath                                   | Description                                            | Exemple                                                 |
|-----------------------------------------|--------------------------------------------------------|---------------------------------------------------------|
| `CurrentStart/@Value`                   | Début du clip dans l'arrangeur (en BeatTime)           | 0                                                       |
| `CurrentEnd/@Value`                     | Fin du clip dans l'arrangeur (en BeatTime)             | 378.36283820346318                                      |
| `Loop/HiddenLoopStart/@Value`           | Début du sample dans le clip (en BeatTime)             | -1.1762159715284715                                     |
| `Loop/HiddenLoopEnd/@Value`             | Fin du sample dans le clip (en BeatTime)               | 378.36283820346318                                      |
| `Name/@Value`                           | Nom du clip (par défaut, nom du sample sans extension) | DIDAFTA PETIT PAPILLON Master Web 24bit 48Khz_02-01     |
| `ColorIndex/@Value`                     | Couleur du clip                                        | 20                                                      |
| `SampleRef/FileRef/RelativePath`        | Sous dossiers du sample relatifs au projet             | Samples + lalicornerouge[...] + DIDAFTA - ALBUM         |
| `SampleRef/FileRef/SearchHint/PathHint` | Plus complet que `RelativePath`                        | Musique + Groupes + Didaf'ta + Samples + [...]          |
| `SampleRef/FileRef/Name`                | Nom du sample avec extension                           | DIDAFTA PETIT PAPILLON Master Web 24bit 48Khz_02-01.wav |
| `SampleRef/DefaultDuration/@Value`      | Durée en échantillons du sample                        | 9984000                                                 |
| `SampleRef/DefaultSampleRate/@Value`    | Fréquence d'échantillonnage du sample                  | 48000                                                   |

On peut déduire la durée du sample en secondes = DefaultDuration / DefaultSampleRate

## Piste structure

XPath relatif
à `/Ableton/LiveSet/Tracks/MidiTrack[1]/DeviceChain/MainSequencer/ClipTimeable/ArrangerAutomation/Events/MidiClip`.

| XPath                 | Description                                            | Exemple         |
|-----------------------|--------------------------------------------------------|-----------------|
| `CurrentStart/@Value` | Début du clip dans l'arrangeur (en BeatTime)           | 0               |
| `CurrentEnd/@Value`   | Fin du clip dans l'arrangeur (en BeatTime)             | 48              |
| `Name/@Value`         | Nom du clip (par défaut, nom du sample sans extension) | Partie bombarde |
| `ColorIndex/@Value`   | Couleur du clip                                        | 22              |

# Voir aussi

- https://github.com/Bludwarf/als-player

// Source : https://github.com/imagicbell/piano-app/blob/a22138d05361e1ebf2571eed2949b0e4544c2781/src/data/midi/index.js#L20

import {ReadMusicXml} from "./read-music-xml";
import {parseHeader as parseHeader_musicxml, parseTracks as parseTracks_musicxml} from './parser';
// import { parseHeader as parseHeader_tonemidi, parseTracks as parseTracks_tonemidi } from './tonemidiParser';

/**
 * Load a MusicXML file
 * @param content is either the url of a file, or the string content of a .xml/.mxl file
 */
export const loadMusicXml = async (content: string) => {
  let data = await ReadMusicXml(content);

  const parsed: any = {}; // TODO ajout Bludwarf

  [parsed.header, parsed.measures] = parseHeader_musicxml(data);
  [parsed.tracks, parsed.duration] = parseTracks_musicxml(data, parsed.header, parsed.measures);

  console.log("parse musicxml header\n", parsed.header);
  console.log("parse musicxml tracks\n", parsed.tracks);

  return parsed; // TODO ajout Bludwarf
};

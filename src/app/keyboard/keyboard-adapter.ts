import {Injectable} from "@angular/core";
import {OctavedNote} from "../notes";

@Injectable({
  providedIn: 'root'
})
export class KeyboardAdapter {

  adaptExtremeNoteName(octavedNote: OctavedNote, direction: 'down' | 'up'): string {
    const sign = direction === 'down' ? -1 : 1;
    let on = octavedNote;
    if (octavedNote.toString().includes('b')) {
      on = on.transpose(sign);
    }
    if (on.note.name === 'E' || on.note.name === 'B') {
      const value = direction === 'down' ? 2 : 1;
      on = on.transpose(sign * value);
    }
    if (octavedNote.compareTo(on) !== 0) {
      // console.warn('adaptExtremeNoteName', octavedNote.toString(), on.toString());
    }
    return on.toString();
  }

  adaptNoteName(octavedNote: OctavedNote): string {
    return octavedNote.toString('#');
  }

}

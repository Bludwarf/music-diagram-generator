import {Structure} from "../structure/structure";
import {Recording} from "../recording/recording";

export interface SongEntry {
  name: string
  structure: Structure
  recording: Recording
}

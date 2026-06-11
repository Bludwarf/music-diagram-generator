import {Setlist} from "./setlist";
import {Injectable} from "@angular/core";
import {error} from "../utils";

@Injectable({
    providedIn: 'root'
})
export class SetlistRepository {
    private readonly setlistByTitle: Record<string, Setlist> = {}

    push(setlist: Setlist): void {
        if (!setlist.title) error(`Impossible d'ajouter une setlist sans titre`);
        this.setlistByTitle[setlist.title] = setlist;
    }

    getByTitle(title: string): Setlist {
        const setlist = this.setlistByTitle[title];
        if (!setlist) error(`Aucune setlist "${title}"`);
        return setlist;
    }

}

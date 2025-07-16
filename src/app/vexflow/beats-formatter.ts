import {Formatter, isStaveNote, RenderContext, Stave, Voice} from "vexflow";

export class BeatsFormatter extends Formatter {
  override alignRests(voices: Voice[], alignAllNotes: boolean) {
    super.alignRests(voices, alignAllNotes);

    voices.forEach(voice => {
      voice.getTickables().forEach(currTickable => {
        if (isStaveNote(currTickable) && currTickable.isRest()) {
          const line = currTickable.getLineForRest();
          if (line === 3) { // TODO param
            const props = currTickable.getKeyProps()[0];
            props.line += 0.5; // TODO param
            currTickable.setKeyLine(0, props.line);
          }
        }
      })
    })
  }

  //
  // override createTickContexts(voices: Voice[]): AlignmentContexts<TickContext> {
  //   super.createTickContexts(voices);
  //
  //
  //
  //
  //   // TODO vérif si StaveGrid sinon impossible d'en déduire les largeur des TickContext
  //   const voiceTime: VoiceTime = {
  //     numBeats: 4,
  //     beatValue: 4,
  //   }
  //   const count = voiceTime.numBeats * voiceTime.beatValue;
  //   const tickValue = count * 64; // TODO d'où vient ce chiffre 64 ?
  //   const tickContexts = this.getTickContexts();
  //   if (!tickContexts) {
  //     throw new Error('No TickContexts');
  //   }
  //   const tickContextsArray = [...tickContexts.array];
  //   const tickContextsByBeatTickID: Record<number, TickContext[]> = {};
  //   tickContextsArray.forEach(tickContext => {
  //     const beatTickID = Math.floor(tickContext.getTickID() / tickValue);
  //     const currentTickContexts: TickContext[] = tickContextsByBeatTickID[beatTickID] || [];
  //     currentTickContexts.push(tickContext);
  //     tickContextsByBeatTickID[beatTickID] = currentTickContexts;
  //   });
  //   console.log('tickContextsByBeatTickID', tickContextsByBeatTickID);
  //
  //   const beatTickToContextMap: Record<number, TickContext> = {};
  //   sequence(count).forEach(beatTickID => {
  //     const tickContexts = tickContextsByBeatTickID[beatTickID];
  //     if (tickContexts) {
  //       if (tickContexts.length !== 1) {
  //         throw new Error("Expecting exactly 1 tickContext for beatTickID " + beatTickID);
  //       }
  //
  //       const tickContext = tickContexts[0];
  //
  //       const beatTickContext = new TickContext({
  //         tickID: tickContext.getTickID() //beatTickID,
  //       });
  //       beatTickContext.setX(tickContext.getX());
  //       console.log('x1', beatTickContext.getX());
  //       beatTickContext.setXBase(tickContext.getXBase());
  //       beatTickContext.setXOffset(tickContext.getXOffset());
  //       Object.assign(beatTickContext, tickContext);
  //
  //       const tickablesByVoice = tickContext.getTickablesByVoice();
  //       Object.keys(tickablesByVoice).forEach(voice => {
  //         const tickable = tickablesByVoice[voice];
  //         beatTickContext.addTickable(tickable, +voice);
  //         // console.log('beatTickContext.addTickable(tickable, +voice)')
  //       })
  //
  //       console.log('tickContext', tickContext);
  //       console.log('beatTickContext', beatTickContext);
  //       console.log('x2', beatTickContext.getX());
  //       beatTickToContextMap[beatTickID] = beatTickContext;
  //     }
  //
  //     else {
  //       console.log('no tickable for '+beatTickID);
  //     }
  //
  //   });
  //
  //
  //
  //
  //     // // TODO vérif si StaveGrid sinon impossible d'en déduire les largeur des TickContext
  //   // const voiceTime: VoiceTime = {
  //   //   numBeats: 4,
  //   //   beatValue: 4,
  //   // }
  //   // const count = voiceTime.numBeats * voiceTime.beatValue;
  //   // const beatTickToContextMap: Record<number, TickContext> = {};
  //   // const beatTickList = sequence(count);
  //   // let noteI = 0;
  //   // const beatTickContexts: TickContext[] = beatTickList.map(beatTickID => {
  //   //   const beatTickContext = new TickContext({
  //   //     tickID: beatTickID,
  //   //   });
  //   //
  //   //   beatTickContext.setX(0);
  //   //   beatTickContext.setXBase(0);
  //   //   beatTickContext.setXOffset(0);
  //   //   const tickable = voices[0].getTickables()[noteI++];
  //   //   if (tickable) {
  //   //     beatTickContext.addTickable(tickable);
  //   //   }
  //   //
  //   //   beatTickToContextMap[beatTickID] = beatTickContext;
  //   //
  //   //   return beatTickContext;
  //   // });
  //
  //
  //
  //   const beatTickContexts: TickContext[] = Object.values(beatTickToContextMap);
  //   const beatTickList: number[] = Object.keys(beatTickToContextMap).map(k => +k).sort((a, b) => a - b);
  //   this.tickContexts = {
  //     array: beatTickContexts,
  //     map: beatTickToContextMap,
  //     list: beatTickList,
  //     resolutionMultiplier: 1, // TODO ?
  //   };
  //
  //   return this.tickContexts;
  // }
  //
  // override createTickContexts(voices: Voice[]): AlignmentContexts<TickContext> {
  //   const tickContexts = super.createTickContexts(voices);
  //   console.log('tickContexts', tickContexts.array.map(tc => tc.getWidth()));
  //   return tickContexts;
  // }

  override preFormat(justifyWidth?: number, renderingContext?: RenderContext, voicesParam?: Voice[], stave?: Stave): number {
    const ret = super.preFormat(justifyWidth, renderingContext, voicesParam, stave); // TODO nécessaire ?
    const offsetX = -6;

    voicesParam?.forEach(voice => {
      voice.getTickables().forEach(currTickable => {
        if (isStaveNote(currTickable)) {
          const tickContext = currTickable.getTickContext();
          const tickID = tickContext.getTickID();
          const beatTickId = Math.floor(tickID / 1024);
          if (!justifyWidth) {
            throw new Error('Missing justifyWidth')
          }
          tickContext.setX(beatTickId / 16 * justifyWidth + offsetX);
          // TODO il faudrait quand même calculer une width fixe pour être sûr que tout est bien aligné
        }
      })
    })

    return ret; // TODO màj du coût supplémentaire à super
  }
}

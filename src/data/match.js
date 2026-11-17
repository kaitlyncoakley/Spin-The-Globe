import { destinations } from './destinations';
// Equal scores retain the stable order of destinations in the data file.
export function matchDestination(answers) {
 const ranked = destinations.map((destination,index)=>({destination,index,score:answers.reduce((sum,answer,q)=>sum+destination.scores[q][answer],0)})).sort((a,b)=>b.score-a.score||a.index-b.index);
 return {...ranked[0],percent:Math.round(ranked[0].score/(answers.length*4)*100)};
}

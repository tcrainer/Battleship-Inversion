
import { Ship, Question } from './types';

export const GRID_SIZE = 6;

export const DEFAULT_SHIPS: Omit<Ship, 'coordinates' | 'placed' | 'isVertical' | 'hits'>[] = [
  { id: 'battleship', name: 'Battleship', size: 4 },
  { id: 'destroyer', name: 'Destroyer', size: 3 },
  { id: 'submarine', name: 'Submarine', size: 2 },
  { id: 'patrol', name: 'Patrol', size: 2 },
];

export const INITIAL_QUESTIONS: Question[] = [
  // 1. Musik & Instrumente
  { id: 'm1', category: 'Musik & Instrumente', german: 'Am Montag spiele ich Geige.', english: 'On Monday I play the violin.' },
  { id: 'm2', category: 'Musik & Instrumente', german: 'Am Dienstag spiele ich Querflöte.', english: 'On Tuesday I play the flute.' },
  { id: 'm3', category: 'Musik & Instrumente', german: 'Am Mittwoch spiele ich Klarinette.', english: 'On Wednesday I play the clarinet.' },
  { id: 'm4', category: 'Musik & Instrumente', german: 'Am Donnerstag spiele ich Saxofon.', english: 'On Thursday I play the saxophone.' },
  { id: 'm5', category: 'Musik & Instrumente', german: 'Am Freitag spiele ich Trompete.', english: 'On Friday I play the trumpet.' },
  { id: 'm6', category: 'Musik & Instrumente', german: 'Am Samstag spiele ich Harfe.', english: 'On Saturday I play the harp.' },
  { id: 'm7', category: 'Musik & Instrumente', german: 'Am Sonntag spiele ich Klavier.', english: 'On Sunday I have a rehearsal.' },
  { id: 'm8', category: 'Musik & Instrumente', german: 'Am Montag übe ich Schlagzeug.', english: 'On Monday I practise the drums.' },
  { id: 'm9', category: 'Musik & Instrumente', german: 'Am Dienstag spiele ich Gitarre.', english: 'On Tuesday I play the guitar.' },
  { id: 'm10', category: 'Musik & Instrumente', german: 'Am Mittwoch spiele ich Keyboard.', english: 'On Wednesday I play the keyboard.' },
  { id: 'm11', category: 'Musik & Instrumente', german: 'Am Donnerstag spiele ich Blockflöte.', english: 'On Thursday I play the recorder.' },
  { id: 'm12', category: 'Musik & Instrumente', german: 'Am Freitag singe ich im Chor.', english: 'On Friday I sing in the choir.' },
  { id: 'm13', category: 'Musik & Instrumente', german: 'Am Samstag musiziere ich in der Band.', english: 'On Saturday I make music in the band.' },
  { id: 'm14', category: 'Musik & Instrumente', german: 'Am Sonntag habe ich eine Probe.', english: 'On Sunday I have a rehearsal.' },
  // 2. Sport & Action
  { id: 's1', category: 'Sport & Action', german: 'Am Montag schwimme ich im See.', english: 'On Monday I swim in the lake.' },
  { id: 's2', category: 'Sport & Action', german: 'Am Dienstag rudere ich gern.', english: 'On Tuesday I like rowing.' },
  { id: 's3', category: 'Sport & Action', german: 'Am Mittwoch surfe ich im Meer.', english: 'On Wednesday I surf in the sea.' },
  { id: 's4', category: 'Sport & Action', german: 'Am Donnerstag tauche ich im Meer.', english: 'On Thursday I dive in the sea.' },
  { id: 's5', category: 'Sport & Action', german: 'Am Freitag spiele ich Wasserball.', english: 'On Friday I play water polo.' },
  { id: 's6', category: 'Sport & Action', german: 'Am Samstag angle ich mit meinem Opa.', english: 'On Saturday I fish with my grandad.' },
  { id: 's7', category: 'Sport & Action', german: 'Am Sonntag mache ich Wasserski.', english: 'On Sunday I do water-skiing.' },
  { id: 's8', category: 'Sport & Action', german: 'Am Montag spiele ich Fußball.', english: 'On Monday I play football.' },
  { id: 's9', category: 'Sport & Action', german: 'Am Dienstag spiele ich Handball.', english: 'On Tuesday I play handball.' },
  { id: 's10', category: 'Sport & Action', german: 'Am Mittwoch spiele ich Basketball.', english: 'On Wednesday I play basketball.' },
  { id: 's11', category: 'Sport & Action', german: 'Am Donnerstag spiele ich Volleyball.', english: 'On Thursday I play volleyball.' },
  { id: 's12', category: 'Sport & Action', german: 'Am Freitag mache ich Leichtathletik.', english: 'On Friday I do athletics.' },
  { id: 's13', category: 'Sport & Action', german: 'Am Samstag reite ich auf dem Pony.', english: 'On Saturday I go horse riding on the pony.' },
  { id: 's14', category: 'Sport & Action', german: 'Am Sonntag jogge ich im Park.', english: 'On Sunday I jog in the park.' },
  { id: 's15', category: 'Sport & Action', german: 'Am Montag spiele ich Tischtennis.', english: 'On Monday I play table tennis.' },
  { id: 's16', category: 'Sport & Action', german: 'Am Dienstag wandere ich in den Bergen.', english: 'On Tuesday I hike in the mountains.' },
  { id: 's17', category: 'Sport & Action', german: 'Am Mittwoch klettere ich in der Halle.', english: 'On Wednesday I climb in the hall.' },
  { id: 's18', category: 'Sport & Action', german: 'Am Donnerstag fahre ich Ski.', english: 'On Thursday I go skiing.' },
  { id: 's19', category: 'Sport & Action', german: 'Am Freitag fahre ich Rad.', english: 'On Friday I cycle.' },
  { id: 's20', category: 'Sport & Action', german: 'Am Samstag fahre ich Skateboard.', english: 'On Saturday I ride a skateboard.' },
  { id: 's21', category: 'Sport & Action', german: 'Am Sonntag gehe ich eislaufen.', english: 'On Sunday I go ice skating.' },
  { id: 's22', category: 'Sport & Action', german: 'Am Montag mache ich Yoga.', english: 'On Monday I do yoga.' },
  { id: 's23', category: 'Sport & Action', german: 'Am Dienstag mache ich Karate.', english: 'On Tuesday I do karate.' },
  { id: 's24', category: 'Sport & Action', german: 'Am Mittwoch tanze ich Ballett.', english: 'On Wednesday I dance ballet.' },
  { id: 's25', category: 'Sport & Action', german: 'Am Donnerstag spiele ich Dart.', english: 'On Thursday I play darts.' },
  { id: 's26', category: 'Sport & Action', german: 'Am Freitag gehe ich bowling.', english: 'On Friday I go bowling.' },
  // 3. Zu Hause & Kreativ
  { id: 'h1', category: 'Zu Hause & Kreativ', german: 'Am Samstag spiele ich Theater.', english: 'On Saturday I act / play theatre.' },
  { id: 'h2', category: 'Zu Hause & Kreativ', german: 'Am Sonntag fotografiere ich die Natur.', english: 'On Sunday I take photos of nature.' },
  { id: 'h3', category: 'Zu Hause & Kreativ', german: 'Am Montag male ich ein Bild.', english: 'On Monday I paint a picture.' },
  { id: 'h4', category: 'Zu Hause & Kreativ', german: 'Am Dienstag bastle ich gern.', english: 'On Tuesday I like doing crafts.' },
  { id: 'h5', category: 'Zu Hause & Kreativ', german: 'Am Mittwoch koche ich für Freunde.', english: 'On Wednesday I cook for friends.' },
  { id: 'h6', category: 'Zu Hause & Kreativ', german: 'Am Donnerstag backe ich einen Kuchen.', english: 'On Thursday I bake a cake.' },
  { id: 'h7', category: 'Zu Hause & Kreativ', german: 'Am Freitag mache ich Gartenarbeit.', english: 'On Friday I do gardening.' },
  { id: 'h8', category: 'Zu Hause & Kreativ', german: 'Am Samstag spiele ich Schach.', english: 'On Saturday I play chess.' },
  { id: 'h9', category: 'Zu Hause & Kreativ', german: 'Am Sonntag sehe ich gern fern.', english: 'On Sunday I like watching TV.' },
  { id: 'h10', category: 'Zu Hause & Kreativ', german: 'Am Montag lese ich eine Zeitung.', english: 'On Monday I read a newspaper.' },
  // 4. Soziales & Orte
  { id: 'p1', category: 'Soziales & Orte', german: 'Am Dienstag treffe ich Freunde im Café.', english: 'On Tuesday I meet friends in the café.' },
  { id: 'p2', category: 'Soziales & Orte', german: 'Am Mittwoch mache ich einen Ausflug.', english: 'On Wednesday I go on an excursion.' },
  { id: 'p3', category: 'Soziales & Orte', german: 'Am Donnerstag gehen wir ins Kino.', english: 'On Thursday we go to the cinema.' },
  { id: 'p4', category: 'Soziales & Orte', german: 'Am Freitag bin ich in der Disko.', english: 'On Friday I am at the disco.' },
];

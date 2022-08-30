import { WvwMaps } from '~/types/api';

export type ObjectivesLayout = Record<WvwMaps, ObjectivesLayoutMap>;
export type ObjectivesLayoutMap = Record<string, { objectives: LayoutObjective[] }>;
export type LayoutObjective = { id: string; direction: Direction };
export type Direction = 'C' | 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW';

const objectivesLayoutEB: ObjectivesLayoutMap = Object.freeze({
  'Castle': {
    objectives: [
      { id: '9', direction: 'C' }, //sm
    ],
  },
  'Red Corner': {
    objectives: [
      { id: '1', direction: 'C' }, //sm
      { id: '20', direction: 'NW' }, //veloka
      { id: '17', direction: 'NE' }, //mendons
      { id: '18', direction: 'SW' }, //anz
      { id: '19', direction: 'SE' }, //ogre
      { id: '5', direction: 'W' }, //pang
      { id: '6', direction: 'E' }, //speldan
    ],
  },
  'Blue Corner': {
    objectives: [
      { id: '2', direction: 'C' }, //valley
      { id: '22', direction: 'NW' }, //bravost
      { id: '15', direction: 'NE' }, //langor
      { id: '16', direction: 'SW' }, //quentin
      { id: '21', direction: 'SE' }, //durios
      { id: '8', direction: 'W' }, //umber
      { id: '7', direction: 'E' }, //dane
    ],
  },
  'Green Corner': {
    objectives: [
      { id: '3', direction: 'C' }, //lowlands
      { id: '13', direction: 'NW' }, //jerrifer
      { id: '11', direction: 'NE' }, //aldons
      { id: '14', direction: 'SW' }, //klovan
      { id: '12', direction: 'SE' }, //wildcreek
      { id: '4', direction: 'W' }, //golanta
      { id: '10', direction: 'E' }, //rogues
    ],
  },
});

const objectivesLayoutAlpineBL: ObjectivesLayoutMap = Object.freeze({
  North: {
    objectives: [
      { id: '37', direction: 'C' }, //keep
      { id: '33', direction: 'W' }, //bay
      { id: '32', direction: 'E' }, //hills
      { id: '38', direction: 'NW' }, //longview
      { id: '40', direction: 'NE' }, //cliffside
      { id: '39', direction: 'N' }, //godsword
      { id: '52', direction: 'NW' }, //hopes
      { id: '51', direction: 'NE' }, //astral
    ],
  },
  South: {
    objectives: [
      { id: '35', direction: 'SW' }, //briar
      { id: '36', direction: 'SE' }, //lake
      { id: '34', direction: 'SW' }, //lodge
      { id: '53', direction: 'SE' }, //vale
      { id: '50', direction: 'S' }, //water
    ],
  },
  // Ruins: {
  //   objectives: [
  //     { id: '62', direction: '' }, //temple
  //     { id: '63', direction: '' }, //hollow
  //     { id: '64', direction: '' }, //estate
  //     { id: '65', direction: '' }, //orchard
  //     { id: '66', direction: '' }, //ascent
  //   ],
  // },
});

const objectivesLayoutDesertBL: ObjectivesLayoutMap = Object.freeze({
  North: {
    objectives: [
      { id: '113', direction: 'C' }, //keep
      { id: '106', direction: 'W' }, //bay
      { id: '114', direction: 'E' }, //hills
      { id: '102', direction: 'NW' }, //longview
      { id: '104', direction: 'NE' }, //cliffside
      { id: '99', direction: 'N' }, //godsword
      { id: '115', direction: 'NW' }, //hopes
      { id: '109', direction: 'NE' }, //astral
    ],
  },
  South: {
    objectives: [
      { id: '110', direction: 'SW' }, //briar
      { id: '105', direction: 'SE' }, //lake
      { id: '101', direction: 'SW' }, //lodge
      { id: '100', direction: 'SE' }, //vale
      { id: '116', direction: 'S' }, //water
    ],
  },
  // Ruins: {
  //   objectives: [
  //     { id: '62', direction: '' }, //temple
  //     { id: '63', direction: '' }, //hollow
  //     { id: '64', direction: '' }, //estate
  //     { id: '65', direction: '' }, //orchard
  //     { id: '66', direction: '' }, //ascent
  //   ],
  // },
});

export const objectivesLayout: ObjectivesLayout = {
  Center: objectivesLayoutEB,
  RedHome: objectivesLayoutDesertBL,
  BlueHome: objectivesLayoutAlpineBL,
  GreenHome: objectivesLayoutAlpineBL,
};

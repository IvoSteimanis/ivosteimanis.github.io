export interface Paper {
  title: string;
  slug: string;
  type: 'publication' | 'working-paper';
}

export interface FieldSite {
  name: string;
  country: string;
  lat: number;
  lng: number;
  description: string;
  projects: string[];
  papers: Paper[];
}

export const fieldSites: FieldSite[] = [
  {
    name: 'Solomon Islands',
    country: 'Solomon Islands',
    lat: -9.4280,
    lng: 160.0,
    description: 'Lab-in-the-field experiments on prosociality and sea-level rise adaptation',
    projects: ['Shadow of the Future'],
    papers: [
      { title: 'Prosociality as response to slow- and fast-onset climate hazards', slug: 'psb_cc', type: 'publication' },
      { title: 'Pitfalls of monetizing relational values in the context of climate change adaptation', slug: 'relational_values', type: 'publication' },
      { title: 'Relational values and citizens\' assemblies in the context of adaptation to sea-level rise', slug: 'relational_cosust', type: 'publication' },
    ],
  },
  {
    name: 'Bangladesh (coastal deltas)',
    country: 'Bangladesh',
    lat: 22.3,
    lng: 89.5,
    description: 'Climate migration and behavioral responses in river deltas',
    projects: ['Shadow of the Future'],
    papers: [
      { title: 'Prosociality as response to slow- and fast-onset climate hazards', slug: 'psb_cc', type: 'publication' },
      { title: 'Climate-related hazards increase risk aversion, place attachment and migration aspiration', slug: 'climate_movements', type: 'publication' },
      { title: 'Pitfalls of monetizing relational values in the context of climate change adaptation', slug: 'relational_values', type: 'publication' },
      { title: 'Decision to stay in climate-risk areas: Cognitive biases and behavioral preferences in Coastal Bangladesh', slug: 'behavioral_barriers', type: 'working-paper' },
    ],
  },
  {
    name: 'Vietnam (Mekong Delta)',
    country: 'Vietnam',
    lat: 10.0,
    lng: 105.8,
    description: 'Sea-level rise impacts on decision-making in the Mekong Delta',
    projects: ['Shadow of the Future'],
    papers: [
      { title: 'Prosociality as response to slow- and fast-onset climate hazards', slug: 'psb_cc', type: 'publication' },
      { title: 'Climate-related hazards increase risk aversion, place attachment and migration aspiration', slug: 'climate_movements', type: 'publication' },
    ],
  },
  {
    name: 'Namibia (Ohangwena & Kavango)',
    country: 'Namibia',
    lat: -18.5,
    lng: 17.5,
    description: 'Leadership experiments with traditional and democratic leaders',
    projects: ['Local Leaders in Namibia'],
    papers: [
      { title: 'Procedural fairness and nepotism among local traditional and democratic leaders in rural Namibia', slug: 'leadership', type: 'publication' },
      { title: 'When female leaders believe that men make better leaders', slug: 'leadership_norms', type: 'publication' },
      { title: 'The Appearance of Democracy: How Conditional Payments Reshape Behavior Among Local Leaders', slug: 'paying_for_democracy', type: 'working-paper' },
      { title: 'Can experiential learning enhance perceived behavioral control for climate adaptation?', slug: 'experiential_learning', type: 'working-paper' },
    ],
  },
  {
    name: 'Colombia',
    country: 'Colombia',
    lat: 4.5,
    lng: -74.0,
    description: 'PES termination effects on conservation behavior',
    projects: [],
    papers: [
      { title: 'No crowding out among those terminated from an ongoing PES program in Colombia', slug: 'pes_termination', type: 'publication' },
    ],
  },
  {
    name: 'Mozambique',
    country: 'Mozambique',
    lat: -19.8,
    lng: 34.9,
    description: 'Impact of terminated PES schemes on agroforestry adoption',
    projects: ['IMPACTED'],
    papers: [
      { title: 'Terminated Carbon Project in Mozambique underperforms with emission reductions, but generates benefits for local communities', slug: 'mozambique_pes', type: 'working-paper' },
    ],
  },
  {
    name: 'Philippines',
    country: 'Philippines',
    lat: 11.0,
    lng: 125.0,
    description: 'Solidarity and prosocial behavior after Typhoon Haiyan (Yolanda)',
    projects: ['Shadow of the Future'],
    papers: [
      { title: 'Moderate disaster exposure divides communities; severe exposure does not', slug: 'yolanda', type: 'working-paper' },
      { title: 'Why Governance Autonomy Can Undermine Climate Resilience', slug: 'fishery_game_philippines', type: 'working-paper' },
    ],
  },
  {
    name: 'India (Madhya Pradesh)',
    country: 'India',
    lat: 22.7,
    lng: 80.5,
    description: 'Water management games and women participation in Mandla district',
    projects: [],
    papers: [
      { title: 'The Role of Women in Learning Games and Water Management Outcomes', slug: 'water_women', type: 'publication' },
    ],
  },
  {
    name: 'Austria',
    country: 'Austria',
    lat: 47.5,
    lng: 14.5,
    description: 'Survey experiment on acceptance of climate migrants',
    projects: [],
    papers: [
      { title: '(Climate) Migrants welcome? Evidence from a Survey-Experiment in Austria', slug: 'migration_survey_experiment', type: 'publication' },
    ],
  },
  {
    name: 'Germany',
    country: 'Germany',
    lat: 51.0,
    lng: 10.0,
    description: 'COVID-19 vaccination hesitancy experiments and online solidarity experiments',
    projects: [],
    papers: [
      { title: 'Repeated information of benefits reduce COVID-19 vaccination hesitancy', slug: 'covid19_hesitancy', type: 'publication' },
      { title: 'Impact of Communicating Climate Mobility Narratives on Migrant Acceptance', slug: 'migration_acceptance_ger_nz', type: 'working-paper' },
    ],
  },
  {
    name: "Côte d'Ivoire",
    country: "Côte d'Ivoire",
    lat: 5.35,
    lng: -4.0,
    description: 'Behavioral change interventions to reduce zoonotic disease emergence',
    projects: ['BehaviorChange'],
    papers: [
      { title: 'Reducing wild meat supply through economic incentives in informal restaurants', slug: 'wild_meat_abidjan', type: 'working-paper' },
    ],
  },
  {
    name: 'Liberia',
    country: 'Liberia',
    lat: 6.4,
    lng: -9.4,
    description: 'Behavioral change interventions to reduce zoonotic disease emergence',
    projects: ['BehaviorChange'],
    papers: [],
  },
];

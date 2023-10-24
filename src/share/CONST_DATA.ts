export const VOYAGETILE = 'Voyages Database'
export const POPELETILET = 'People Database';
export const EnslavedTitle = 'Enslaved People'
export const EnslaversTitle = 'Enslavers'
export const VOYAGESTABLEFILE = 'voyages_table'
export const YOYAGESCARDFILE = 'transatlantic_voyages_card.json'
export const ENSLAVEDCARDFILE = 'enslaved_card.json'
export const ENSLAVERSCARDFILE = 'enslavers_card.json'
export const ENSLAVERS_TABLE_FILE = 'enslavers_table_cell_structure.json'
export const pathFlatFile = '@/utils/flatfiles/';
export const ENSLAVED_TABLE_FILE = 'enslaved_table_cell_structure.json';
export const AFRICANORIGINS_TABLE_FILE = 'african_origins_table_cell_structure.json';
export const TEXAS_TABLE_FILE = 'texas_table_cell_structure.json';

export const VOYAGESPAGE = 'VoyagesPage'
export const ALLVOYAGES = 'all-voyages'
export const ALLVOYAGESPAGE = '/voyage/all-voyages'
export const INTRAAMERICAN = 'intra-american'
export const INTRAAMERICANPAGE = '/voyage/intra-american'
export const TRANSATLANTIC = 'transatlantic'
export const TRANSATLANTICPATH = 'trans-atlantic'
export const TRANSATLANTICPAGE = '/voyage/trans-atlantic'
export const VOYAGESTEXAS = 'texas'
export const VOYAGESTEXASPAGE = '/voyage/texas'

export const PASTHOMEPAGE = 'PastHomePage'
export const Enslaved = 'Enslaved'
export const ALLENSLAVED = 'all-enslaved'
export const ALLENSLAVEDPAGE = '/all-enslaved'
export const ENSALVEDPAGE = '/enslaved'
export const AFRICANORIGINS = 'african-origins'
export const AFRICANORIGINSPAGE = '/african-origins'
export const ENSLAVEDTEXAS = 'texas'

export const ENSLAVEDTEXASPAGE = '/texas'
export const DOCUMENTPAGE = 'DocumentPage'
export const BLOGPAGE = 'Blog'

export const ALLENSLAVERS = 'all-enslavers'
export const ENSALVERSPAGE = '/enslaver'


export const mbaccesstoken = `pk.eyJ1IjoiamNtMTAiLCJhIjoiY2xid2VpZmF3MDhsaTN1bGhqMXZ5YmxjZCJ9.eP7ZuC68Q5iBZQa8I13AGw`;

export const mappingSpecialists = `https://api.mapbox.com/styles/v1/jcm10/clbmdqh2q000114o328k5yjpf/tiles/{z}/{x}/{y}?access_token=${mbaccesstoken}`;
export const mappingSpecialistsRivers = `https://api.mapbox.com/styles/v1/jcm10/cl98xvv9r001z14mm17w970no/tiles/{z}/{x}/{y}?access_token=${mbaccesstoken}`;
export const mappingSpecialistsCountries = `https://api.mapbox.com/styles/v1/jcm10/cl98yryw3003t14o66r6fx4m9/tiles/{z}/{x}/{y}?access_token=${mbaccesstoken}`;


export const MAP_CENTER: [number, number] = [5.486678, -35.59375];
export const MAXIMUM_NATIVE_ZOOM = 10;
export const MINIMUM_ZOOM = 2;
export const MAXIMUM_ZOOM = 22;
export const ZOOM_LEVEL_THRESHOLD = 5;
export const VOYAGESTYPE = 'voyages'
export const ENSALVEDTYPE = 'enslaved'
export const ENSLAVERSTYPE = 'enslavers'
export const BLOGTYPE = 'blog'
export const REGION = 'region'
export const PLACE = 'place'

export const minRadiusInPixels = 3;
export const maxRadiusInPixels = 20;
export const maxRadiusInPixelsNode = 15;

// Network Graph Node Type
export const ENSLAVEDNODE = 'enslaved'
export const ENSLAVERSNODE = 'enslavers'
export const VOYAGESNODE = 'voyages'
export const ENSLAVEMENTNODE = 'enslavement_relations'
export const classToColor = {
    enslaved: '#906866',
    enslavers: '#46A88C',
    enslavement_relations: '#ab47bc',
    voyages: '#F2EE0A',
};
export const RADIUSNODE = 8;
export const cachenamePivot = `voyage_pivot_tables`;
// Global search
export const GlobalSearchVoyagesType = 'voyages'
export const GlobalSearchEnslavedType = 'enslaved'
export const GlobalSearchEnslaversType = 'enslavers'
export const GlobalSearchBlogType = 'blog'
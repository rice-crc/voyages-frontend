import { PivotTablesProps } from "./InterfaceTypes";

export interface RespnseCrosstabsPivotTablesData {
    tablestructure: PivotColumnDef[]
    data: DaumPivotTables[]
}

export interface StatePivotRowData {
    data: Record<string, any>[]
    rowData: Record<string, any>[]
    columnDefs: PivotColumnDef[];
    offset: number
    pivotValueOptions: PivotTablesProps
    aggregation: string
    rowsPerPage: number
    totalResultsCount: number
}
export interface PivotColumnDef {
    headerName: string;
    children?: PivotColumnDefChildren[] | PivotColumnDefChildren;
}
export interface RowDataPivotTable {
    [key: string]: string | number;
}
export interface PivotColumnDefChildren {
    columnGroupShow?: string
    headerName: string
    field?: string
    children?: (PivotColumnDefChildren | PivotColumnDefChildren2)[] | undefined;
}
export interface PivotColumnDefChildren2 {
    columnGroupShow: string
    headerName: string
    field: string
}



export interface PivotTablestructureProps {
    tablestructure: PivotTablestructure[]
    data: DaumPivotTables[]
}

export interface PivotTablestructure {
    headerName: string
    children: PivotTableChildren[]
}

export interface PivotTableChildren {
    columnGroupShow?: string
    headerName: string
    field?: string
    filter?: string
    children?: PivotTableChildren2[]
}

export interface PivotTableChildren2 {
    columnGroupShow: string
    headerName: string
    field: string
    filter: string
}

export interface DaumPivotTables {
    "Imputed broad region of slave disembarkation (MJSELIMP1)": string
    "Africa__Bight of Benin__Aghway": number
    "Africa__Bight of Benin__Amokou": number
    "Africa__Bight of Benin__Ardra": number
    "Africa__Bight of Benin__Badagry/Apa": number
    "Africa__Bight of Benin__Benin": number
    "Africa__Bight of Benin__Bight of Benin, place unspecified": number
    "Africa__Bight of Benin__Costa da Mina, place unspecified": number
    "Africa__Bight of Benin__Epe": number
    "Africa__Bight of Benin__Grand Popo": number
    "Africa__Bight of Benin__Ife": number
    "Africa__Bight of Benin__Jacquin": number
    "Africa__Bight of Benin__Keta": number
    "Africa__Bight of Benin__Lagos, Onim": number
    "Africa__Bight of Benin__Lay": number
    "Africa__Bight of Benin__Legas": number
    "Africa__Bight of Benin__Little Popo": number
    "Africa__Bight of Benin__Oerê": number
    "Africa__Bight of Benin__Popo": number
    "Africa__Bight of Benin__Porto Novo": number
    "Africa__Bight of Benin__Rio Forcados/Formosa/Benin": number
    "Africa__Bight of Benin__Rio Nun": number
    "Africa__Bight of Benin__Whydah, Ouidah": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__Andony": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__Bight of Biafra and Gulf of Guinea Islands, port unspecified": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__Bilbay": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__Bimbia": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__Bonny": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__Bundy": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__Calabar": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__Calabary": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__Cameroons": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__Cameroons River": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__Cap Lopez": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__Corisco": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__Costa de Africa (mainland coast around S Tome/Principe)": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__Fernando Po": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__Formosa": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__Gabon": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__Gulf of Guinea islands": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__New Calabar": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__Princes Island": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__Quaqua": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__River Brass": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__River del Rey": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__São Tomé": number
    "Africa__Bight of Biafra and Gulf of Guinea islands__São Tomé or Princes Island": number
    "Africa__Gold Coast__Accra": number
    "Africa__Gold Coast__Alampo": number
    "Africa__Gold Coast__Anomabu": number
    "Africa__Gold Coast__Apammin": number
    "Africa__Gold Coast__Axim": number
    "Africa__Gold Coast__Cape Coast Castle": number
    "Africa__Gold Coast__Chama": number
    "Africa__Gold Coast__Christiansborg": number
    "Africa__Gold Coast__Danish Gold Coast": number
    "Africa__Gold Coast__Elmina": number
    "Africa__Gold Coast__Eva": number
    "Africa__Gold Coast__Gold Coast east of Kormantine": number
    "Africa__Gold Coast__Gold Coast, port unspecified": number
    "Africa__Gold Coast__Kormantine": number
    "Africa__Gold Coast__Pokesoe (Princes Town)": number
    "Africa__Gold Coast__Wiamba": number
    "Africa__Other Africa__Africa, port unspecified": number
    "Africa__Other Africa__Bights": number
    "Africa__Other Africa__Cape Logas (location undetermined)": number
    "Africa__Other Africa__Casnasonis (location undetermined)": number
    "Africa__Other Africa__Gold Coast + Bight of Benin + Bight of Biafra": number
    "Africa__Other Africa__Gold Coast, Fr. definition": number
    "Africa__Other Africa__Princes Island and Elmina": number
    "Africa__Other Africa__Senegambia or Sierra Leone": number
    "Africa__Other Africa__Touau-Toro (location undetermined)": number
    "Africa__Other Africa__West of Cape Apolonia": number
    "Africa__Other Africa__Windward + Ivory + Gold + Benin": number
    "Africa__Other Africa__Windward Coast (Nunez - Assini)": number
    "Africa__Senegambia and offshore Atlantic__Albreda": number
    "Africa__Senegambia and offshore Atlantic__Arguim": number
    "Africa__Senegambia and offshore Atlantic__Bissagos": number
    "Africa__Senegambia and offshore Atlantic__Bissau": number
    "Africa__Senegambia and offshore Atlantic__Cacheu": number
    "Africa__Senegambia and offshore Atlantic__Canary Islands": number
    "Africa__Senegambia and offshore Atlantic__Cape Verde Islands": number
    "Africa__Senegambia and offshore Atlantic__Casamance": number
    "Africa__Senegambia and offshore Atlantic__French Africa (Goree or Senegal)": number
    "Africa__Senegambia and offshore Atlantic__Galam": number
    "Africa__Senegambia and offshore Atlantic__Gambia": number
    "Africa__Senegambia and offshore Atlantic__Gorée": number
    "Africa__Senegambia and offshore Atlantic__Joal, or Saloum River": number
    "Africa__Senegambia and offshore Atlantic__Madeira": number
    "Africa__Senegambia and offshore Atlantic__Portudal": number
    "Africa__Senegambia and offshore Atlantic__Portuguese Guinea": number
    "Africa__Senegambia and offshore Atlantic__Rio Grande": number
    "Africa__Senegambia and offshore Atlantic__Saint-Louis": number
    "Africa__Senegambia and offshore Atlantic__Senegambia and offshore Atlantic, port unspecified": number
    "Africa__Sierra Leone__Banana Islands": number
    "Africa__Sierra Leone__Bance/Bunce Island": number
    "Africa__Sierra Leone__Côte de Malaguette (runs through to Cape Palmas on Windward Coast)": number
    "Africa__Sierra Leone__Delagoa": number
    "Africa__Sierra Leone__Gallinhas": number
    "Africa__Sierra Leone__Iles Plantain": number
    "Africa__Sierra Leone__Iles de Los": number
    "Africa__Sierra Leone__Mano": number
    "Africa__Sierra Leone__Rio Nunez": number
    "Africa__Sierra Leone__Rio Pongo": number
    "Africa__Sierra Leone__River Kissey": number
    "Africa__Sierra Leone__Scarcies": number
    "Africa__Sierra Leone__Sherbro": number
    "Africa__Sierra Leone__Sierra Leone estuary": number
    "Africa__Sierra Leone__Sierra Leone, port unspecified": number
    "Africa__Sierra Leone__Sugary (Siekere)": number
    "Africa__Southeast Africa and Indian Ocean islands__Cape of Good Hope": number
    "Africa__Southeast Africa and Indian Ocean islands__Costa Leste Occidental": number
    "Africa__Southeast Africa and Indian Ocean islands__Ibo": number
    "Africa__Southeast Africa and Indian Ocean islands__Inhambane": number
    "Africa__Southeast Africa and Indian Ocean islands__Kilwa": number
    "Africa__Southeast Africa and Indian Ocean islands__Lourenço Marques": number
    "Africa__Southeast Africa and Indian Ocean islands__Madagascar": number
    "Africa__Southeast Africa and Indian Ocean islands__Mascarene Islands": number
    "Africa__Southeast Africa and Indian Ocean islands__Mauritius (Ile de France)": number
    "Africa__Southeast Africa and Indian Ocean islands__Momboza or Zanzibar": number
    "Africa__Southeast Africa and Indian Ocean islands__Mozambique": number
    "Africa__Southeast Africa and Indian Ocean islands__Quilimane": number
    "Africa__Southeast Africa and Indian Ocean islands__Quirimba": number
    "Africa__Southeast Africa and Indian Ocean islands__Sofala": number
    "Africa__Southeast Africa and Indian Ocean islands__Southeast Africa and Indian Ocean islands, port unspecified": number
    "Africa__Southeast Africa and Indian Ocean islands__St. Lawrence": number
    "Africa__Southeast Africa and Indian Ocean islands__Zanzibar": number
    "Africa__West Central Africa and St. Helena__Alecuba": number
    "Africa__West Central Africa and St. Helena__Ambona": number
    "Africa__West Central Africa and St. Helena__Ambriz": number
    "Africa__West Central Africa and St. Helena__Benguela": number
    "Africa__West Central Africa and St. Helena__Boary": number
    "Africa__West Central Africa and St. Helena__Cabinda": number
    "Africa__West Central Africa and St. Helena__Cape Mole": number
    "Africa__West Central Africa and St. Helena__Coanza River": number
    "Africa__West Central Africa and St. Helena__Congo North": number
    "Africa__West Central Africa and St. Helena__Congo River": number
    "Africa__West Central Africa and St. Helena__Grenada Point": number
    "Africa__West Central Africa and St. Helena__Kilongo": number
    "Africa__West Central Africa and St. Helena__Loango": number
    "Africa__West Central Africa and St. Helena__Luanda": number
    "Africa__West Central Africa and St. Helena__Malembo": number
    "Africa__West Central Africa and St. Helena__Mayumba": number
    "Africa__West Central Africa and St. Helena__Mpinda": number
    "Africa__West Central Africa and St. Helena__Novo Redondo": number
    "Africa__West Central Africa and St. Helena__Penido": number
    "Africa__West Central Africa and St. Helena__Quicombo": number
    "Africa__West Central Africa and St. Helena__Rio Dande (N of Luanda)": number
    "Africa__West Central Africa and St. Helena__Rio Zaire": number
    "Africa__West Central Africa and St. Helena__Salinas": number
    "Africa__West Central Africa and St. Helena__Soyo": number
    "Africa__West Central Africa and St. Helena__West Central Africa and St. Helena, port unspecified": number
    "Africa__Windward Coast__Bassa": number
    "Africa__Windward Coast__Cape Lahou": number
    "Africa__Windward Coast__Cape Mount (Cape Grand Mount)": number
    "Africa__Windward Coast__Cess": number
    "Africa__Windward Coast__Dembia": number
    "Africa__Windward Coast__Drouin": number
    "Africa__Windward Coast__Grand Bassa": number
    "Africa__Windward Coast__Grand Bassam": number
    "Africa__Windward Coast__Grand Junk": number
    "Africa__Windward Coast__Grand Mesurado": number
    "Africa__Windward Coast__Grand Sestos": number
    "Africa__Windward Coast__Ivory Coast": number
    "Africa__Windward Coast__Little Bassa": number
    "Africa__Windward Coast__Little Junk": number
    "Africa__Windward Coast__Petit Mesurado": number
    "Africa__Windward Coast__Rio Assini": number
    "Africa__Windward Coast__Sassandra": number
    "Africa__Windward Coast__Settra Kru": number
    "Africa__Windward Coast__St. Paul": number
    "Africa__Windward Coast__Tabou": number
    "Africa__Windward Coast__Trade Town": number
    "Africa__Windward Coast__Windward Coast, place unspecified": number
    Brazil__Amazonia__Aracaty: number
    "Brazil__Amazonia__Ceará, port unspecified": number
    Brazil__Amazonia__Maranhão: number
    Brazil__Amazonia__Pará: number
    "Brazil__Amazonia__Portos do Norte": number
    Brazil__Amazonia__Tapajé: number
    Brazil__Bahia__Alcobaça: number
    "Brazil__Bahia__Aldeia Velha": number
    Brazil__Bahia__Aracaju: number
    "Brazil__Bahia__Bahia, place unspecified": number
    Brazil__Bahia__Belmonte: number
    Brazil__Bahia__Boaventura: number
    Brazil__Bahia__Canavieiras: number
    Brazil__Bahia__Caravelas: number
    "Brazil__Bahia__Caravelas, Mucuri e Vitória": number
    Brazil__Bahia__Estância: number
    Brazil__Bahia__Ilhéus: number
    Brazil__Bahia__Laranjeiras: number
    Brazil__Bahia__Mucuri: number
    "Brazil__Bahia__Rio Cotinguiba": number
    "Brazil__Bahia__Rio Real": number
    "Brazil__Bahia__Rio São Francisco": number
    "Brazil__Bahia__Santa Cruz": number
    "Brazil__Bahia__Sergipe, place unspecified": number
    Brazil__Bahia__Valença: number
    "Brazil__Bahia__Vila Viçosa": number
    "Brazil__Other Brazil__Brazil, place unspecified": number
    "Brazil__Pernambuco__Alagoas, place unspecified": number
    Brazil__Pernambuco__Açu: number
    Brazil__Pernambuco__Maceió: number
    Brazil__Pernambuco__Paraíba: number
    Brazil__Pernambuco__Patacho: number
    "Brazil__Pernambuco__Pernambuco, place unspecified": number
    "Brazil__Pernambuco__Rio Grande do Norte": number
    "Brazil__Pernambuco__Rio Paraíba do Norte": number
    "Brazil__Southeast Brazil__Angra dos Reis": number
    "Brazil__Southeast Brazil__Angra dos Reis e Mangaratiba": number
    "Brazil__Southeast Brazil__Antonina": number
    "Brazil__Southeast Brazil__Ariró": number
    "Brazil__Southeast Brazil__Baía de Sepetiba": number
    "Brazil__Southeast Brazil__Benevente": number
    "Brazil__Southeast Brazil__Cabo Frio": number
    "Brazil__Southeast Brazil__Campos": number
    "Brazil__Southeast Brazil__Campos e Macaé": number
    "Brazil__Southeast Brazil__Cananéia": number
    "Brazil__Southeast Brazil__Cananéia e Iguape": number
    "Brazil__Southeast Brazil__Caraguatatuba": number
    "Brazil__Southeast Brazil__Espírito Santo": number
    "Brazil__Southeast Brazil__Guarapari": number
    "Brazil__Southeast Brazil__Guaratiba": number
    "Brazil__Southeast Brazil__Guaratuba": number
    "Brazil__Southeast Brazil__Iguape": number
    "Brazil__Southeast Brazil__Ilha Grande": number
    "Brazil__Southeast Brazil__Ilha das Palmas": number
    "Brazil__Southeast Brazil__Ilha de Marambaia": number
    "Brazil__Southeast Brazil__Ilha dos Porcos": number
    "Brazil__Southeast Brazil__Itabapoana": number
    "Brazil__Southeast Brazil__Itaguaí": number
    "Brazil__Southeast Brazil__Itaipu": number
    "Brazil__Southeast Brazil__Itajaí": number
    "Brazil__Southeast Brazil__Itapemirim": number
    "Brazil__Southeast Brazil__Itapocorói": number
    "Brazil__Southeast Brazil__Jerumirim": number
    "Brazil__Southeast Brazil__Jerumirim e Mangaratiba": number
    "Brazil__Southeast Brazil__Laguna": number
    "Brazil__Southeast Brazil__Macaé": number
    "Brazil__Southeast Brazil__Mambucaba": number
    "Brazil__Southeast Brazil__Mangaratiba": number
    "Brazil__Southeast Brazil__Paranaguá": number
    "Brazil__Southeast Brazil__Parati": number
    "Brazil__Southeast Brazil__Porto Alegre": number
    "Brazil__Southeast Brazil__Porto Belo": number
    "Brazil__Southeast Brazil__Portos do Sul": number
    "Brazil__Southeast Brazil__Rio Doce": number
    "Brazil__Southeast Brazil__Rio Grande": number
    "Brazil__Southeast Brazil__Rio Grande do Sul, place unspecified": number
    "Brazil__Southeast Brazil__Rio São Francisco do Sul": number
    "Brazil__Southeast Brazil__Rio São João": number
    "Brazil__Southeast Brazil__Rio das Ostras": number
    "Brazil__Southeast Brazil__Rio de Janeiro": number
    "Brazil__Southeast Brazil__Rio de Janeiro province": number
    "Brazil__Southeast Brazil__Santa Catarina": number
    "Brazil__Southeast Brazil__Santos": number
    "Brazil__Southeast Brazil__Southeast Brazil, port unspecified": number
    "Brazil__Southeast Brazil__São Mateus": number
    "Brazil__Southeast Brazil__São Sebastião": number
    "Brazil__Southeast Brazil__São Vicente": number
    "Brazil__Southeast Brazil__Ubatuba": number
    "Brazil__Southeast Brazil__Vila Nova": number
    "Brazil__Southeast Brazil__Vitória": number
    "Caribbean__Anguilla__Anguilla, port unspecified": number
    "Caribbean__Antigua__Antigua, place unspecified": number
    "Caribbean__Antigua__Saint John (Antigua)": number
    "Caribbean__Bahamas__Bahamas, port unspecified": number
    Caribbean__Bahamas__Exuma: number
    Caribbean__Bahamas__Heneague: number
    Caribbean__Bahamas__Nassau: number
    "Caribbean__Bahamas__New Providence": number
    "Caribbean__Bahamas__Turk's Island": number
    "Caribbean__Barbados__Barbados, place unspecified": number
    Caribbean__Barbados__Speightstown: number
    "Caribbean__British Guiana__Demerara": number
    "Caribbean__British Honduras__British Honduras, port unspecified": number
    "Caribbean__British Honduras__Mosquito Shore": number
    Caribbean__Cuba__Baracoa: number
    "Caribbean__Cuba__Cuba, port unspecified": number
    Caribbean__Cuba__Havana: number
    "Caribbean__Cuba__Puerto Principe": number
    "Caribbean__Cuba__Santiago de Cuba": number
    "Caribbean__Cuba__South Keys": number
    "Caribbean__Cuba__Trinidad de Cuba": number
    "Caribbean__Danish West Indies__Danish West Indies, colony unspecified": number
    "Caribbean__Danish West Indies__Spanish Town, British Virgin Islands": number
    "Caribbean__Danish West Indies__St. Croix": number
    "Caribbean__Danish West Indies__St. John (Virgin Islands)": number
    "Caribbean__Danish West Indies__St. Thomas": number
    "Caribbean__Dominica__Dominica, place unspecified": number
    Caribbean__Dominica__Roseau: number
    "Caribbean__Dominica__St. Marc": number
    "Caribbean__Dutch Caribbean__Aruba": number
    "Caribbean__Dutch Caribbean__Curaçao": number
    "Caribbean__Dutch Caribbean__Dutch Caribbean, colony unspecified": number
    "Caribbean__Dutch Caribbean__Saba": number
    "Caribbean__Dutch Caribbean__St. Eustatius": number
    "Caribbean__Dutch Caribbean__St. Maarten": number
    "Caribbean__Dutch Guianas__Berbice": number
    "Caribbean__Dutch Guianas__Suriname, place unspecified": number
    "Caribbean__Grenada__Grenada, place unspecified": number
    "Caribbean__Guadaloupe__Basse-Terre": number
    "Caribbean__Guadaloupe__Grande-Terre, port unspecified": number
    "Caribbean__Guadaloupe__Guadeloupe, place unspecified": number
    "Caribbean__Hispaniola__Hispaniola, unspecified": number
    "Caribbean__Hispaniola__Isla Saona": number
    "Caribbean__Hispaniola__San Domingo (a) Santo Domingo": number
    "Caribbean__Jamaica__Annotto Bay": number
    Caribbean__Jamaica__Antonia: number
    "Caribbean__Jamaica__Jamaica, place unspecified": number
    Caribbean__Jamaica__Kingston: number
    "Caribbean__Jamaica__Lucea (a) St. Lucea": number
    "Caribbean__Jamaica__Martha Brae": number
    "Caribbean__Jamaica__Montego Bay": number
    "Caribbean__Jamaica__Morant Bay": number
    "Caribbean__Jamaica__Port Royal": number
    "Caribbean__Jamaica__Savanna la Mar": number
    "Caribbean__Jamaica__Spanish Town": number
    "Caribbean__Martinique__Fort-Royale": number
    "Caribbean__Martinique__Martinique, place unspecified": number
    "Caribbean__Montserrat__Montserrat, port unspecified": number
    "Caribbean__Nevis__Nevis, port unspecified": number
    "Caribbean__Other British Caribbean__Bermuda": number
    "Caribbean__Other British Caribbean__British Caribbean, colony unspecified": number
    "Caribbean__Other British Caribbean__British Leewards": number
    "Caribbean__Other Caribbean__Caribbean (colony unspecified)": number
    "Caribbean__Other Caribbean__Caribbean, port unspecified": number
    "Caribbean__Other French Caribbean__French Caribbean, colony unspecified": number
    "Caribbean__Other Spanish Caribbean__Providence Island": number
    "Caribbean__Puerto Rico__Puerto Rico, port unspecified": number
    "Caribbean__Puerto Rico__San Juan": number
    "Caribbean__Saint-Domingue__Cap Français": number
    "Caribbean__Saint-Domingue__Cayes (Les)": number
    "Caribbean__Saint-Domingue__Fort Dauphin": number
    "Caribbean__Saint-Domingue__Môle Saint Nicolas": number
    "Caribbean__Saint-Domingue__Port-au-Prince": number
    "Caribbean__Saint-Domingue__Saint-Domingue, then Haiti, port unspecified": number
    "Caribbean__Saint-Domingue__Saint-Marc": number
    "Caribbean__Saint-Domingue__Tortuga": number
    "Caribbean__St. Barthélemy (Sweden)__St. Barthélemy, port unspecified": number
    "Caribbean__St. Kitts__St. Kitts, port unspecified": number
    "Caribbean__St. Lucia__St. Lucia, port unspecified": number
    "Caribbean__St. Vincent__St. Vincent, port unspecified": number
    "Caribbean__Tobago__Tobago, port unspecified": number
    "Caribbean__Tortola__Tortola, port unspecified": number
    "Caribbean__Trinidad__Trinidad and Tobago, place unspecified": number
    "Europe__England and Wales__Bristol": number
    "Europe__England and Wales__Liverpool": number
    "Europe__England and Wales__London": number
    "Europe__Great Britain__Great Britain, place unspecified": number
    "Europe__Scotland__Scotland, place unspecified": number
    "Mainland North America__California__California, place unspecified": number
    "Mainland North America__Canada__Nova Scotia": number
    "Mainland North America__Connecticut__New London": number
    "Mainland North America__Delaware__Delaware, port unspecified": number
    "Mainland North America__Florida__Amelia Island": number
    "Mainland North America__Florida__Apalachicola": number
    "Mainland North America__Florida__Cedar Key": number
    "Mainland North America__Florida__Indian River": number
    "Mainland North America__Florida__Indianola": number
    "Mainland North America__Florida__Jacksonville": number
    "Mainland North America__Florida__Key West": number
    "Mainland North America__Florida__Magnolia": number
    "Mainland North America__Florida__New Smyrna": number
    "Mainland North America__Florida__Pensacola": number
    "Mainland North America__Florida__Port Leon": number
    "Mainland North America__Florida__St. Augustine": number
    "Mainland North America__Florida__St. Joseph": number
    "Mainland North America__Florida__St. Marks, FL": number
    "Mainland North America__Florida__Tampa": number
    "Mainland North America__Georgia__Georgia, port unspecified": number
    "Mainland North America__Georgia__Savannah": number
    "Mainland North America__Gulf coast__Mobile": number
    "Mainland North America__Gulf coast__New Orleans": number
    "Mainland North America__Gulf coast__Vicksburg (MS)": number
    "Mainland North America__Kentucky__Louisville": number
    "Mainland North America__Kentucky__Smithfield": number
    "Mainland North America__Maryland__Annapolis": number
    "Mainland North America__Maryland__Baltimore": number
    "Mainland North America__Maryland__Maryland, port unspecified": number
    "Mainland North America__Maryland__Patuxent": number
    "Mainland North America__Massachusetts__Boston": number
    "Mainland North America__Massachusetts__Nantucket": number
    "Mainland North America__Massachusetts__Plymouth": number
    "Mainland North America__Massachusetts__Salem": number
    "Mainland North America__New Hampshire__New Hampshire, port unspecified": number
    "Mainland North America__New Hampshire__Piscataqua": number
    "Mainland North America__New Hampshire__Portsmouth (NH)": number
    "Mainland North America__New Jersey__Delaware River": number
    "Mainland North America__New Jersey__Perth Amboy": number
    "Mainland North America__New York__Long Island": number
    "Mainland North America__New York__New York": number
    "Mainland North America__North Carolina__Beaufort": number
    "Mainland North America__North Carolina__Cape Fear": number
    "Mainland North America__North Carolina__North Carolina, port unspecified": number
    "Mainland North America__Other North America__Carolinas": number
    "Mainland North America__Other North America__New England": number
    "Mainland North America__Other North America__USA, location unspecified": number
    "Mainland North America__Pennsylvania__Pennsylvania, port unspecified": number
    "Mainland North America__Pennsylvania__Philadelphia": number
    "Mainland North America__Rhode Island__Newport": number
    "Mainland North America__Rhode Island__Providence": number
    "Mainland North America__Rhode Island__Rhode Island, port unspecified": number
    "Mainland North America__Rhode Island__Warren": number
    "Mainland North America__South Carolina__Charleston": number
    "Mainland North America__South Carolina__South Carolina, place unspecified": number
    "Mainland North America__Texas__Brazos Santiago": number
    "Mainland North America__Texas__Galveston": number
    "Mainland North America__Texas__La Salle": number
    "Mainland North America__Texas__Port Lavaca": number
    "Mainland North America__Texas__Woodville": number
    "Mainland North America__Virginia__Accomac": number
    "Mainland North America__Virginia__Alexandria": number
    "Mainland North America__Virginia__Hampton": number
    "Mainland North America__Virginia__Lower James River": number
    "Mainland North America__Virginia__Norfolk": number
    "Mainland North America__Virginia__Petersburg": number
    "Mainland North America__Virginia__Rappahannock": number
    "Mainland North America__Virginia__Richmond (VA)": number
    "Mainland North America__Virginia__South Potomac": number
    "Mainland North America__Virginia__Virginia, port unspecified": number
    "Mainland North America__Virginia__York River": number
    "Other__Americas__Americas, port unspecified": number
    "Other__Americas__Imfors Bay, location undetermined": number
    "Other__Americas__Kalas, location undetermined": number
    "Other__Asia e Africa__Asia e Africa, port unspecified": number
    "Other__Non-geographical__Prize (taken from Portuguese)": number
    "Other__Non-geographical__Prize (unknown place)": number
    "Other__Non-geographical__Seized at sea by Spanish officials": number
    "Other__Non-geographical__Slaves rescued at sea from a shipwreck": number
    "Other__Non-geographical__Taken at sea from pirates": number
    "Other__Spanish Americas__Spanish American Mainland, port unspecified": number
    "Other__Spanish Americas__Spanish Americas, port unspecified": number
    "Spanish Mainland Americas__Chile__Valparaiso": number
    "Spanish Mainland Americas__Pacific Central America__Panama City": number
    "Spanish Mainland Americas__Rio de la Plata__Buceo": number
    "Spanish Mainland Americas__Rio de la Plata__Buenos Aires": number
    "Spanish Mainland Americas__Rio de la Plata__Colonia de Sacramento": number
    "Spanish Mainland Americas__Rio de la Plata__Montevideo": number
    "Spanish Mainland Americas__Rio de la Plata__Rio de la Plata, port unspecified": number
    "Spanish Mainland Americas__Spanish Circum-Caribbean__Campeche": number
    "Spanish Mainland Americas__Spanish Circum-Caribbean__Caracas": number
    "Spanish Mainland Americas__Spanish Circum-Caribbean__Cartagena": number
    "Spanish Mainland Americas__Spanish Circum-Caribbean__Coro": number
    "Spanish Mainland Americas__Spanish Circum-Caribbean__Isla de Aves": number
    "Spanish Mainland Americas__Spanish Circum-Caribbean__La Guaira": number
    "Spanish Mainland Americas__Spanish Circum-Caribbean__Portobelo": number
    "Spanish Mainland Americas__Spanish Circum-Caribbean__Rio de la Hacha": number
    "Spanish Mainland Americas__Spanish Circum-Caribbean__Spanish Circum-Caribbean,unspecified": number
    "Spanish Mainland Americas__Spanish Circum-Caribbean__Venezuela": number
    All: number
}

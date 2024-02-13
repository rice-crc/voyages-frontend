import { BrazilValue, BritishCaribbeanValue, DutchAmericasValue, FrenchCaribbeanValue, MainlandNorthAmericaValue, SpanishAmericasValue, embarkationAfricaValue } from "@/share/CONST_DATA"

export const flagText = [
    'Spain / Uruguay',
    'Portugal / Brazil',
    'Great Britain',
    'Netherlands',
    'U.S.A.',
    'France',
    'Denmark / Baltic'
]


export const embarkationListData = [
    {
        label: 'Africa',
        show: true,
        varName: 'embarkation_region__name',
        checkName: embarkationAfricaValue,
        options: [
            'Senegambia and off-shore Atlantic',
            'Sierra Leone',
            'Windward Coast',
            'Gold Coast',
            'Bight of Benin',
            'Bight of Biafra',
            'West Central Africa and St. Helena',
            'South-east Africa and Indian ocean islands',
        ],
    }
]

export const disembarkationListData = [
    {
        label: 'Africa',
        show: false,
        varName: 'disembarkation_region__name',
        checkName: '',
        options: ['Africa']
    },
    {
        label: 'Brazil',
        show: true,
        varName: 'disembarkation_region__name',
        checkName: BrazilValue,
        options: [
            'Amazonia',
            'Bahia',
            'Pernambuco',
            'South-east Brazil',
            'Brazil unspecified',
        ]
    },
    {
        label: 'British Caribbean',
        show: true,
        varName: 'disembarkation_region__name',
        checkName: BritishCaribbeanValue,
        options: [
            'Jamaica',
            'Barbados',
            'Antigua',
            'St. Kitts',
            'Grenada',
            'Dominica',
            'British Guiana',
            'St. Vincent',
            'Montserrat / Nevis',
            'Trinidad / Tobago',
            'Other British Caribbean',
        ]
    },
    {
        label: 'Danish West Indies',
        show: false,
        varName: 'disembarkation_region__name',
        checkName: '',
        options: ['Danish West Indies']
    },
    {
        label: 'Dutch Americas',
        show: true,
        varName: 'disembarkation_region__name',
        checkName: DutchAmericasValue,
        options: [
            'Dutch Caribbean',
            'Dutch Guianas'
        ]

    },
    {
        label: 'Europe',
        show: false,
        varName: 'disembarkation_region__name',
        checkName: '',
        options: ['Europe']
    },
    {
        label: 'French Caribbean',
        show: true,
        varName: 'disembarkation_region__name',
        checkName: FrenchCaribbeanValue,
        options: [
            'Saint-Domingue',
            'Martinique',
            'Guadeloupe',
            'French Guiana',
            'French Caribbean unspecified'
        ]
    },
    {
        label: 'Mainland North America',
        show: true,
        varName: 'disembarkation_region__name',
        checkName: MainlandNorthAmericaValue,
        options: [
            'Northern U.S.',
            'Chesapeake',
            'Carolinas / Georgia',
            'Gulf states',
            'U.S.A. unspecified',
        ]

    },
    {
        label: 'Spanish Americas',
        show: true,
        varName: 'disembarkation_region__name',
        checkName: SpanishAmericasValue,
        options: [
            'Cuba',
            'Puerto Rico',
            'Spanish Circum-Caribbean',
            'Rio de la Plata',
            'Other Spanish Americas',
        ]

    },

]




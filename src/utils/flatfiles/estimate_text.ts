import { BrazilValue, BritishCaribbeanValue, DutchAmericasValue, FrenchCaribbeanValue, MainlandNorthAmericaValue, SpanishAmericasValue, embarkationAfricaValue } from "@/share/CONST_DATA"
import { TranslateType } from "@/share/InterfaceTypes"

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

export const EstimateTranslate: TranslateType = {
    title: {
        label: {
            "en": "Estimates: Trans-Atlantic Slave Trade",
            "es": "Estimaciones: Tráfico de Esclavos Transatlántico",
            "pt": "Estimativas: Tráfico de Escravos Transatlântico"

        }
    },
    queries: {
        label: {
            "en": "Current Query",
            "es": "Búsqueda actual ",
            "pt": "Consulta Atual"

        }
    },
    queriesTooltip: {
        label: {
            "en": "For purposes of calculation, estimates of embarked and disembarked slaves in tables, the timeline, and maps have been rounded to integers. When users cite any number, they are advised to round it to the nearest hundred.",
            "es": "Para propósitos de cálculo los estimados de esclavos embarcados y desembarcados en las tablas, cronologías y mapas han sido redondeado a números enteros.",
            "pt": "Para fins de cálculo, não foram arredondadas as estimativas de escravos embarcados e desembarcados em tabelas, na linha do tempo e nos mapas. Recomenda-se aos usuários que, ao citar uma cifra, a arredondem para a centena mais próxima."

        }
    },
    viewAll: {
        label: {
            "en": "View All",
            "es": "Ver Todo",
            "pt": "Ver Todos"

        }
    },
    resetAll: {
        label: {
            "en": "Reset All",
            "es": "Resetear Todo",
            "pt": "Redefinir Tudo"
        }
    },
    tabTable: {
        label: {
            "en": "Tables",
            "es": "Tablas",
            "pt": "Tabelas"

        }
    },
    tabtimeLine: {
        label: {
            "en": "Timeline",
            "es": "Cronología",
            "pt": "Linha do tempo"
        }
    },
    tabMap: {
        label: {
            "en": "Maps",
            "es": "Mapas",
            "pt": "Mapas"
        }
    },
    selectNation: {
        label: {
            "en": "Selected National Carriers",
            "es": "Transportistas Nacionales Seleccionados",
            "pt": "Transportadoras Nacionais Selecionadas"
        }

    },
    selectEmbarkation: {
        label: {
            "en": "Selected Embarkation Regions",
            "es": "Regiones de Embarque Seleccionadas",
            "pt": "Regiões de Embarque Selecionadas"
        }

    },
    selectDesEmbarkation: {
        label: {
            "en": "Selected Disembarkation Regions",
            "es": "Regiones de Desembarque Seleccionadas",
            "pt": "Regiões de Desembarque Selecionadas"
        }

    },
    hideText: {
        label: {
            "en": "Hide",
            "es": "Ocultar",
            "pt": "Ocultar"
        }

    },
    timeFrame: {
        label: {
            "en": "Time Frame",
            "es": "Periodo de tiempo",
            "pt": "Intervalo de tempo"
        }

    },
    flagData: {
        label: {
            "en": "Flag",
            "es": "Bandera",
            "pt": "Bandeira"
        }

    },
    regionsData: {
        label: {
            "en": "Regions",
            "es": "Regiones",
            "pt": "Regiões"
        }
    },
    resetBTN: {
        label: {
            "en": "Reset",
            "es": "Resetear",
            "pt": "Redefinir"
        }

    },
    selectAllBTN: {
        label: {
            "en": "Select All",
            "es": "Seleccionar todo",
            "pt": "Selecionar todas"
        }

    },
    deselectAllBTN: {
        label: {
            "en": "Deselect All",
            "es": "Deseleccionar todo",
            "pt": "Limpar seleção"
        }

    },
    regionesEmbarkation: {
        label: {
            "en": "Embarkation Regions",
            "es": "Regiones de embarque",
            "pt": "Regiões de embarque"
        }

    },
    regionesDesEmbarkation: {
        label: {
            "en": "Disembarkation Regions",
            "es": "Regiones de desembarco",
            "pt": "Regiões de desembarque"
        }

    },
    showDataFrom: {
        label: {
            "en": "Show data from:",
            "es": "Mostrar información desde",
            "pt": "Exibir dados de"
        }

    },
    showDataDetails: {
        label: {
            "en": "Full extent of coverage by estimates is ",
            "es": "Tiempo total cubierto por las estimaciones es ",
            "pt": "A extensão total de tempo coberto pelas estimativas é "
        }

    },
    toData: {
        label: {
            "en": "to",
            "es": "para",
            "pt": "para"
        }

    },
    rowDropDownTitle: {
        label: {
            "en": "Rows",
            "es": "Filas",
            "pt": "Linhas"
        }

    },
    columnsDropDownTitle: {
        label: {
            "en": "Columns",
            "es": "Columnas",
            "pt": "Colunas"
        }

    },
    cellDropDownTitle: {
        label: {
            "en": "Cells",
            "es": "Celdas",
            "pt": "Células"
        }
    },
    downloadTable: {
        label: {
            "en": "Download Table",
            "es": "Descargar tabla",
            "pt": "Baixar tabela"
        }
    }
}

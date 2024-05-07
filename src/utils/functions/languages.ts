import { LabelFilterMeneList } from "@/share/InterfaceTypes"

export const LanguageOptions = [
    { language: "English", value: "en", lable: 'English' },
    { language: "Español", value: "es", lable: 'Español' },
    { language: "Português", value: "pt", lable: 'Português' }
]

export interface PagesOptionsProps {
    page: PagesProps
}
interface PagesProps {
    name: string
    pathUrl: string
    label: LabelFilterMeneList
}
export const PagesOptions: PagesOptionsProps[] = [
    {
        page: {
            name: 'Voyages',
            pathUrl: '/voyage/trans-atlantic#voyages',
            label: {
                "en": 'Voyages Database',
                "es": "Base de Datos de Viajes",
                "pt": "Base de Dados de Viagens"
            }
        }
    },
    {
        page: {
            name: 'People',
            pathUrl: '/PastHomePage',
            label: {
                "en": 'People',
                "es": "Personas",
                "pt": "Pessoas"
            }
        }
    },
    {
        page: {
            name: 'Enslaved',
            pathUrl: '/past/enslaved/all-enslaved#people',
            label: {
                "en": 'Enslaved People',
                "es": "Personas Esclavizadas",
                "pt": "Pessoas Escravizadas"
            }
        }
    },
    {
        page: {
            name: 'Enslavers',
            pathUrl: '/past/enslaver/trans-atlantic-trades#people',
            label: {
                "en": 'Enslavers',
                "es": "Esclavistas",
                "pt": "Escravizadores"
            }
        }
    },
    {
        page: {
            name: 'Timelapse',
            pathUrl: '/voyage/trans-atlantic#timelapse',
            label: {
                "en": 'Timelapse',
                "es": "Lapso Temporal",
                "pt": "Cronologia"
            }
        }
    },
    {
        page: {
            name: 'Writing',
            pathUrl: '/blog',
            label: {
                "en": 'Writing',
                "es": "Escritura",
                "pt": "Escrita"
            }
        }
    }
]


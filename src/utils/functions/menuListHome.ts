import {
  ACCOUNTS,
  ASSESSMENT,
  BLOGPAGE,
  DOCUMENTPAGE,
  ESTIMATES,
  INTRAAMERICANPAGE,
  TRANSATLANTICTIMELAPSE,
} from '@/share/CONST_DATA';
import { MenuListsProps } from '@/share/InterfaceTypes';

export const menuLists: MenuListsProps[] = [
  {
    name: {
      en: 'About',
      es: 'Acerca de',
      pt: 'Sobre',
    },
    url: `${BLOGPAGE}/tag/about`
  },
  {
    name: {
      en: 'Intro Maps',
      es: 'Mapas Introductorios',
      pt: 'Mapas Introdutórios',
    },
    url: `${BLOGPAGE}/tag/all-intro-maps`,
  },
  {
    name: {
      en: 'Essays',
      es: 'Ensayos',
      pt: 'Ensaios',
    },
    url: `${BLOGPAGE}/tag/essays`,
    submenu: [
      {
        name: {
          en: 'Trans-Atlantic',
          es: 'Transatlántico',
          pt: 'Transatlântico',
        }, url: `${BLOGPAGE}/tag/transatlantic`
      },
      {
        name: {
          en: 'Intra-American',
          es: 'Intraamericano',
          pt: 'Intra-americano',
        },
        url: `${BLOGPAGE}/tag/intraamerican`
      },
      {
        name: {
          en: 'Texas Bound',
          es: 'Rumbo a Texas',
          pt: 'Destino Texas',
        },
        url: `${BLOGPAGE}/tag/texas-bound`
      },
    ],
  },
  {
    name: {
      en: 'Estimates',
      es: 'Estimaciones',
      pt: 'Estimativas',
    },
    url: `${ASSESSMENT}/${ESTIMATES}/`
  },
  {

    name: {
      en: 'Timelapse',
      es: 'Línea de Tiempo',
      pt: 'Linha do Tempo',
    },
    url: `${TRANSATLANTICTIMELAPSE}#timelapse`,
    submenu: [
      {
        name: {
          en: 'Trans-Atlantic',
          es: 'Transatlántico',
          pt: 'Transatlântico',
        },
        url: `${TRANSATLANTICTIMELAPSE}#timelapse`
      },
      {
        name: {
          en: 'Intra-American',
          es: 'Intraamericano',
          pt: 'Intra-americano',
        }, url: `${INTRAAMERICANPAGE}#timelapse`
      },
    ],
  },
  {
    name: {
      en: '3D Videos',
      es: 'Videos en 3D',
      pt: 'Vídeos 3D',
    }, url: `${BLOGPAGE}/3d-videos-of-slaving-vessels/162/`
  },
  {
    name: {
      en: 'Lesson Plans',
      es: 'Planes de Lecciones',
      pt: 'Planos de Aula',
    }, url: `${BLOGPAGE}/tag/lesson-plan`
  },
  {
    name: {
      en: 'Documents',
      es: 'Documentos',
      pt: 'Documentos',
    }, url: `${DOCUMENTPAGE}`
  },
  {
    name: {
      en: 'Methodology',
      es: 'Metodología',
      pt: 'Metodologia',
    }, url: `${BLOGPAGE}/tag/methodology`
  },
  {
    name: {
      en: 'Resources',
      es: 'Recursos',
      pt: 'Recursos',
    }, url: `${BLOGPAGE}/tag/resources`
  },
  {
    name: {
      en: 'Downloads',
      es: 'Descargas',
      pt: 'Downloads',
    }, url: `${BLOGPAGE}/tag/downloads`
  },
  {
    name: {
      en: 'Contribute',
      es: 'Contribuir',
      pt: 'Contribuir',
    }, url: `${ACCOUNTS}signin/`
  },
];
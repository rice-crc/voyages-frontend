import {ACCOUNTS, ASSESSMENT, BLOGPAGE, CONTRIBUTE, DOCUMENTPAGE, ESTIMATES, INTRAAMERICANPAGE, TRANSATLANTICTIMELAPSE} from "@/share/CONST_DATA";

export const menuLists = [
    {name: 'About', url: `${BLOGPAGE}/tag/about`},
    {name: 'Intro Maps', url: `${BLOGPAGE}/introductory-maps-to-the-transatlantic-slave-trade/148`},
    {
        name: 'Essays', url: `${BLOGPAGE}/tag/essays`,
        submenu: [
            {name: 'Trans-Atlantic', url: `${BLOGPAGE}/tag/essays-trans-atlantic`},
            {name: 'Intra-American ', url: `${BLOGPAGE}/tag/essays-intra-american`},
            {name: 'Texas Bound', url: `${BLOGPAGE}/tag/texas-bound`}
        ],
    },
    {name: 'Estimates', url: `${ASSESSMENT}/${ESTIMATES}/`},
    {
        name: 'Timelapse', url: `${TRANSATLANTICTIMELAPSE}#timelapse`,
        submenu: [
            {name: 'Trans-Atlantic', url: `${TRANSATLANTICTIMELAPSE}#timelapse`},
            {name: 'Intra-American', url: `${INTRAAMERICANPAGE}#timelapse`},
        ],
    },
    {name: '3D Videos', url: `${BLOGPAGE}/tag/3d-videos-slaving-vessels`},
    {name: 'Lesson Plans', url: `${BLOGPAGE}/tag/lesson-plan`},
    {name: 'Documents', url: `${DOCUMENTPAGE}`},
    {name: 'Methodology', url: `${BLOGPAGE}/tag/methodology`},
    {name: 'Resources', url: `${BLOGPAGE}/tag/resources`},
    {name: 'Downloads', url: `${BLOGPAGE}/tag/downloads`},
    {name: 'Contribute', url: `${ACCOUNTS}signin/`},
];
import React from 'react';
import ForceGraphComponent from './ForceGraphComponent'; // Adjust the path to your React component file

const GraphDiagramNetwork = () => {

    return (
        <div>
            <h1>Force-Directed Graph</h1>
            <ForceGraphComponent data={datas} />
        </div>
    );
};

export const datas = {
    edges: [
        {
            data: {},
            source: "8b4f0fdc-d310-47f1-b45e-5b58be490110",
            target: "65da063e-7374-445c-a921-f60804843a3a"
        },
        {
            data: {},
            source: "65da063e-7374-445c-a921-f60804843a3a",
            target: "613767c8-fabc-4c4e-8b5f-5c1a2e5f70f2"
        },
        {
            data: {},
            source: "eb85559a-6a0d-49da-9c70-1af406473425",
            target: "65da063e-7374-445c-a921-f60804843a3a"
        },
        {
            data: {},
            source: "fa3f6a2c-3f10-4ede-ad7f-e7bce99493bb",
            target: "65da063e-7374-445c-a921-f60804843a3a"
        },
        {
            data: {},
            source: "6c1efa93-1a96-412d-b610-3138f3053e10",
            target: "65da063e-7374-445c-a921-f60804843a3a"
        },
        {
            data: {},
            source: "9db2ec7a-a313-4fda-b421-b0a083ea0b99",
            target: "65da063e-7374-445c-a921-f60804843a3a"
        },
        {
            data: {},
            source: "b8272646-491a-4f04-8221-95f19b13c66c",
            target: "65da063e-7374-445c-a921-f60804843a3a"
        },
        {
            data: {},
            source: "b4bc596c-8502-479d-b7b6-d6033b5831aa",
            target: "65da063e-7374-445c-a921-f60804843a3a"
        },
        {
            data: {},
            source: "cad00781-602b-486f-a6f8-93b1608a8188",
            target: "65da063e-7374-445c-a921-f60804843a3a"
        },
        {
            data: {},
            source: "09567277-e684-40bc-835a-ffc32a9b7e83",
            target: "65da063e-7374-445c-a921-f60804843a3a"
        },
        {
            data: {},
            source: "7e284cc2-86d4-4f62-bd73-54688ebc421a",
            target: "65da063e-7374-445c-a921-f60804843a3a"
        },
        {
            data: {},
            source: "a9ac9c6e-82a7-4df5-b613-e68333f51f15",
            target: "65da063e-7374-445c-a921-f60804843a3a"
        },
        {
            data: {},
            source: "7dc5f743-edb1-49ba-90eb-47bbe230bc84",
            target: "65da063e-7374-445c-a921-f60804843a3a"
        },
        {
            data: {},
            source: "1e875ac6-084d-456e-8156-0a925ca49314",
            target: "65da063e-7374-445c-a921-f60804843a3a"
        },
        {
            data: {
                role__name: "Captain"
            },
            source: "32b2432f-a39e-4cff-adb5-4654b6bf21fe",
            target: "65da063e-7374-445c-a921-f60804843a3a"
        }
    ],
    nodes: [
        {
            age: 22,
            documented_name: "Latty",
            gender: 1,
            id: 6,
            node_class: "enslaved",
            uuid: "8b4f0fdc-d310-47f1-b45e-5b58be490110"
        },
        {
            id: 1017028,
            node_class: "enslavement_relations",
            relation_type__name: "Transportation",
            uuid: "65da063e-7374-445c-a921-f60804843a3a",
            voyage: 2315
        },
        {
            id: 2315,
            node_class: "voyages",
            uuid: "613767c8-fabc-4c4e-8b5f-5c1a2e5f70f2",
            voyage_dates__imp_arrival_at_port_of_dis_sparsedate__year: 1819,
            voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name:
                "Trade Town",
            voyage_itinerary__imp_principal_port_slave_dis__geo_location__name:
                "Freetown",
            voyage_ship__ship_name: "Fabiana"
        },
        {
            age: 30,
            documented_name: "Flam",
            gender: 1,
            id: 2,
            node_class: "enslaved",
            uuid: "eb85559a-6a0d-49da-9c70-1af406473425"
        },
        {
            age: 28,
            documented_name: "Dee",
            gender: 1,
            id: 3,
            node_class: "enslaved",
            uuid: "fa3f6a2c-3f10-4ede-ad7f-e7bce99493bb"
        },
        {
            age: 22,
            documented_name: "Pao",
            gender: 1,
            id: 4,
            node_class: "enslaved",
            uuid: "6c1efa93-1a96-412d-b610-3138f3053e10"
        },
        {
            age: 16,
            documented_name: "Mufa",
            gender: 1,
            id: 5,
            node_class: "enslaved",
            uuid: "9db2ec7a-a313-4fda-b421-b0a083ea0b99"
        },
        {
            age: 20,
            documented_name: "So",
            gender: 1,
            id: 7,
            node_class: "enslaved",
            uuid: "b8272646-491a-4f04-8221-95f19b13c66c"
        },
        {
            age: 30,
            documented_name: "Trua",
            gender: 1,
            id: 8,
            node_class: "enslaved",
            uuid: "b4bc596c-8502-479d-b7b6-d6033b5831aa"
        },
        {
            age: 18,
            documented_name: "Tou",
            gender: 1,
            id: 9,
            node_class: "enslaved",
            uuid: "cad00781-602b-486f-a6f8-93b1608a8188"
        },
        {
            age: 23,
            documented_name: "Quaco",
            gender: 1,
            id: 10,
            node_class: "enslaved",
            uuid: "09567277-e684-40bc-835a-ffc32a9b7e83"
        },
        {
            age: 30,
            documented_name: "Teagu",
            gender: 1,
            id: 11,
            node_class: "enslaved",
            uuid: "7e284cc2-86d4-4f62-bd73-54688ebc421a"
        },
        {
            age: 25,
            documented_name: "May",
            gender: 1,
            id: 12,
            node_class: "enslaved",
            uuid: "a9ac9c6e-82a7-4df5-b613-e68333f51f15"
        },
        {
            age: 23,
            documented_name: "By",
            gender: 1,
            id: 13,
            node_class: "enslaved",
            uuid: "7dc5f743-edb1-49ba-90eb-47bbe230bc84"
        },
        {
            age: 15,
            documented_name: "Fugra",
            gender: 2,
            id: 14,
            node_class: "enslaved",
            uuid: "1e875ac6-084d-456e-8156-0a925ca49314"
        },
        {
            alias: "García, Juan",
            id: 1001564,
            identity: 1004292,
            node_class: "enslavers",
            uuid: "32b2432f-a39e-4cff-adb5-4654b6bf21fe"
        }
    ]
};

export default GraphDiagramNetwork;

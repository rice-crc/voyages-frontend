import {
    ENSLAVEDNODE,
    ENSLAVERSNODE,
    VOYAGESNODE,
    ENSLAVEMENTNODE,
} from '@/share/CONST_DATA';
import { Nodes } from '@/share/InterfaceTypePastNetworks';

export const createdLableNode = (node: Nodes) => {
    const {
        node_class, documented_name,
        voyage_ship__ship_name: shipName,
        voyage_dates__imp_arrival_at_port_of_dis_sparsedate__year: year,
        voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name: purhcaseLocation,
        voyage_itinerary__imp_principal_port_slave_dis__geo_location__name: disembarkationLocation,
        principal_alias: alias,
        relation_type__name,
    } = node;
    let LableNode;
    if (node_class === ENSLAVEDNODE) {
        LableNode = documented_name
    } else if (node_class === ENSLAVERSNODE) {
        LableNode = alias
    }
    else if (node_class === ENSLAVEMENTNODE) {
        LableNode = relation_type__name
    }
    else if (node_class === VOYAGESNODE) {
        LableNode = `${shipName ?? shipName}, ${purhcaseLocation ? purhcaseLocation : 'unknown'} to ${disembarkationLocation} ${year}`
    }
    return LableNode;
};


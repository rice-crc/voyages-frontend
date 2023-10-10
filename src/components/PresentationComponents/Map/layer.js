function make_cluster_layer_groups(cluster_class) {

    var layergroup = L.markerClusterGroup(
        {
            zoomToBoundsOnClick: false,
            showCoverageOnHover: false,
            spiderfyOnMaxZoom: false,
            iconCreateFunction: function (cluster) {
                var markers = cluster.getAllChildMarkers();
                var n = 1;
                markers.forEach(marker => {
                    n += marker.feature.properties.size
                });

                if (cluster_class == 'origin') {
                    var html = '<div class="origin_cluster_circle"></div>';
                    var nodesize = origin_nodelogvaluescale(n) * 2
                } else if (cluster_class == 'final_destination') {
                    var html = '<div class="dest_cluster_circle"></div>';
                    var nodesize = dest_nodelogvaluescale(n) * 2
                }

                return L.divIcon({ html: html, iconSize: L.point(nodesize, nodesize), className: "transparentmarkerclusterdiv" });
            }
        }).on('clustermouseover', function (a) {
            activepopups.forEach(p => p.remove());
            activepopups = new Array;
            var clusterchildmarkers = a.layer.getAllChildMarkers();


            popuphtml = make_origin_and_final_nodes_table(clusterchildmarkers, cluster_class);
            //http://jsfiddle.net/3tnjL/59/
            var pop = new L.popup({
                'className': 'leafletAOPopup',
                'closeOnClick': false,
                'showCoverageOnHover': false,
            }).
                setLatLng(a.latlng).
                setContent(popuphtml);
            pop.addTo(AO_map);
            activepopups.push(pop);
            var child_hidden_edges = new Array;
            Object.keys(clusterchildmarkers).forEach(marker => {
                if (clusterchildmarkers[marker]) {
                    if (clusterchildmarkers[marker].feature) {
                        clusterchildmarkers[marker].feature.properties.hidden_edges.forEach(e_id => { child_hidden_edges.push(e_id) })
                    }
                }
            });
            refresh_hidden_edges(child_hidden_edges, regionorplace, AO_map, endpoint_main_edges_layer_group, endpoint_animation_edges_layer_group);
        })
    return layergroup
}

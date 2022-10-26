var map = L.map('map', {center: [39.981192, -75.155399], zoom: 10});
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap' }).addTo(map);
        map.doubleClickZoom.disable();

       
        // Write function to set Properties of the Popup
        function onMapClick(e) {
            popup
                .setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString())
                .openOn(map);
        }
        
        // Listen for a click event on the Map element
        map.on('click', onMapClick);

        // load GeoJSON from an external file
        function setColorFunc(density){
    return density > 21 ? '#88419d' :
           density > 14 ? '#8c96c6' :
           density > 7 ? '#b3cde3' :
           density > 0 ? '#edf8fb' :
                         '#BFBCBB';
};
        function styleFunc(feature) {
    return {
        fillColor: setColorFunc(feature.properties.num_bll_5p),
        fillOpacity: 0.9,
        weight: 1,
        opacity: 1,
        color: '#ffffff',
        dashArray: '3'
    };
}
        var neighborhoodsLayer = null;
        
        L.control.scale({position: 'bottomleft'}).addTo(map);
        

// Create Leaflet Control Object for Legend
var legend = L.control({position: 'bottomright'});

// Function that runs when legend is added to map
legend.onAdd = function (map) {
    // Create Div Element and Populate it with HTML
    var div = L.DomUtil.create('div', 'legend');            
    div.innerHTML += '<b>num_bll_5p</b><br />';
    div.innerHTML += 'by census tract<br />';
    div.innerHTML += '<br>';
    div.innerHTML += '<i style="background: #88419d"></i><p>21+</p>';
    div.innerHTML += '<i style="background: #8c96c6"></i><p>14-21</p>';
    div.innerHTML += '<i style="background: #b3cde3"></i><p>7-14</p>';
    div.innerHTML += '<i style="background: #edf8fb"></i><p>0-7</p>';
    div.innerHTML += '<hr>';
    div.innerHTML += '<i style="background: #BFBCBB"></i><p>No Data</p>';
    
    // Return the Legend div containing the HTML content
    return div;
};

// Add Legend to Map
legend.addTo(map);

$.getJSON("blood_lead.geojson",function(data){
    neighborhoodsLayer = L.geoJson(data, {
        style: styleFunc,
        onEachFeature: function(feature, layer){
            layer.bindPopup('Blood lead level: '+feature.properties.num_bll_5p);
        }
    }).addTo(map);
});
function onEachFeatureFunc(feature, layer){
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomFeature
    });
    layer.bindPopup('Blood lead level: '+feature.properties.num_bll_5p);
}
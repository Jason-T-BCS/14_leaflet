//specify url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url, function (data) {
    createFeatures(data.features);
});

//using lat long for San Franciso
function createFeatures(data) {
    var myMap = L.map("map", {
        center: [37.773972, -122.431297],
        zoom: 8
    });


    //mapbox map layers
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    }).addTo(myMap);

    //markers
    data.forEach(feature => {
        var mag = feature.properties.mag;
        var color = "";
        if (mag <= 1) {
            color = "#B0E0E6";
        } else if (mag <= 2) {
            color = "#B0C4DE";
        } else if (mag <= 3) {
            color = "#4682B4";
        } else if (mag <= 4) {
            color = "#5F9EA0";
        } else if (mag <= 5) {
            color = "#00CED1";
        } else {
            color = "#4169E1";
        }

        L.circle([feature.geometry.coordinates[1],
                 feature.geometry.coordinates[0]], {
            fillColor: color,
            fillOpacity: 0.75,
            color: color,
            radius: mag * 8000
        }).bindPopup("<h3> Location: " + feature.properties.place + "<hr>Mag: " + mag + "</h3>").addTo(myMap);
    });

    //legends
    var legend = L.control({
        position: 'bottomright'
    });
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        var labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
        var colors = ["#00FF7F", "#FFFF00", "#FF1493",
                        "#AFEEEE", "#FFE4C4", "#DC143C"];

// loop through our density intervals and generate a label with a colored background for each interval
        for (var i = 0; i < colors.length; i++) {
            div.innerHTML +=
                '<li style="background-color:' + colors[i] + '">' + labels[i] + '</li>';
        }
        return div;
    }
    legend.addTo(myMap);
}

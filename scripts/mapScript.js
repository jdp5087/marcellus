var marcellus = {
    'initMap' : function () {
        var map = new L.Map("map")
                    .setView(new L.LatLng(41.440, -76.525), 11)
                    .addLayer(new L.TileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png'));
	    if (map) {
		d3.json("./data/test.json", function (error, json) {
		    if (error) {
			console.log("ERROR: Couldn't load your stupid file");
		    }
		    function bpSPUD(feature, layer) {
				if (feature.properties) {
				    var p = feature.properties;
				    var c = "<ul><li><strong>SPUD Well Name</strong>: " + p.FARM_NM +"</li>" +
				    "<li><strong>Well API</strong>: " + p.WELL_API + "</li>" +
				    "<li><strong>Operator</strong>: " + p.OPERATOR + "</li>" +
					"<li><strong>Date Drilled</strong>: " + p.SPUD_DT+ "</li></ul>";
				    layer.bindPopup(c);
				}
		    }
		    function bpPermits(feature, layer) {
				if (feature.properties) {
				    var p = feature.properties;
				    var c = "<ul><li><strong>Permitted Well Name</strong>: " + p.LABEL +"</li>" + 
				    "<li><strong>Well API</strong>: " + p.WELL_API + "</li>" +
				    "<li><strong>Operator</strong>: " + p.OPERATOR + "</li>" +
				    "<li><strong>Authorization Description</strong>: " + p.AUTH_DESC + "</li>" +
					"<li><strong>Permit Issued Date</strong>: " + p.PERMIT_ISS+ "</li></ul>";
				    layer.bindPopup(c);
				}
		    }
		    function bpPooling(feature, layer) {
				if (feature.properties) {
				    var p = feature.properties;
				    var c = "<ul><li><strong>Pooling Unit Name</strong>: " + p.UNIT +"</li>" + 
				    "<li><strong>Operator</strong>: " + p.OPERATOR + "</li>" +
					"<li><strong>Recorded Date</strong>: " + p.RECORDED+ "</li></ul>";
				    layer.bindPopup(c);
				}
		    }
		    function bpPipe(feature, layer) {
				if (feature.properties) {
				    var p = feature.properties;
				    var c = "<ul><li><strong>Pipeline Project Name</strong>: " + p.PROJ_NM +"</li>" + 
				    "<li><strong>Sponsor</strong>: " + p.SPONSOR + "</li>" +
				    "<li><strong>Source</strong>: " + p.SOURCE + "</li>" +
					"<li><strong>Notified Date</strong>: " + p.NOTIFIED+ "</li></ul>";
				    layer.bindPopup(c);
				}
		    }

		    var pipeStyle = {
			color:"#000",
			weight: 2,
		    };
		    var pipeLyr = L.geoJson(json.pipe, {
				style: function(feature) {
					switch (feature.properties.TYPE) {
		    		case 1: return {color: "#000", weight: 4, };
		    		case 3: return {color: "#000", weight: 1.5, };
					}
				},
				onEachFeature: bpPipe

		    }).addTo(map);


		    var poolingLyr = L.geoJson(json.pooling, {
		    	style: function(feature) {
		    	    switch (feature.properties.RuleID) {
		    		case 1: return {fillColor: "#ff0000", color: "#000", weight: 1.5,};
		    		case 2: return {fillColor: "#0000ff", color: "#000", weight: 1.5,};
		    	    }
		    	},
		    	onEachFeature: bpPooling,
		    }).addTo(map);

		    var chesapeakeMarker = {
			radius: 5,
			fillColor: "#ff0000",
			color: "#000",
			weight: .8,
			opacity: 1,
			fillOpacity: 0.5
		    };

		    var chiefMarker = {
			radius: 5,
			fillColor: "#0000ff",
			color: "#000",
			weight: .8,
			opacity: 1,
			fillOpacity: 0.5
		    };

		    var excoMarker = {
			radius: 5,
			fillColor: "#00ff00",
			color: "#000",
			weight: .8,
			opacity: 1,
			fillOpacity: 0.5
		    };
		  
		    var southwesternMarker = {
			radius: 5,
			fillColor: "#ffff00",
			color: "#000",
			weight: .8,
			opacity: 1,
			fillOpacity: 0.5
		    };

			var SPUDLyr = L.geoJson(json.SPUD, {
			    pointToLayer: function (feature, latlng) {
					if (feature.properties.OPERATOR == "CHESAPEAKE APPALACHIA LLC") {
					    return L.circleMarker(latlng, chesapeakeMarker);
					} else {
					    return L.circleMarker(latlng, chiefMarker);
					}
			    },
			    onEachFeature: bpSPUD,
		    });
			var permWellsLyr = L.geoJson(json.permWells, {
			    pointToLayer: function (feature, latlng) {
					if (feature.properties.OPERATOR == "CHESAPEAKE APPALACHIA LLC") {
					    return L.circleMarker(latlng, chesapeakeMarker);
					} else if (feature.properties.OPERATOR == "CHIEF OIL & GAS LLC") {
					    return L.circleMarker(latlng, chiefMarker);
					} else if (feature.properties.OPERATOR == "EXCO RESOURCES PA LLC") {
						return L.circleMarker(latlng, excoMarker);
					} else {
						return L.circleMarker(latlng, southwesternMarker)
			    	}
				},
				onEachFeature: bpPermits,
		    });
			var markersSPUD = new L.markerClusterGroup({
				spiderfyDistanceMultiplier: 2,
			});
		    var markersPerm = new L.markerClusterGroup({
		    	spiderfyDistanceMultiplier: 2,
		    });

		    markersSPUD.addLayer(SPUDLyr);
		    markersPerm.addLayer(permWellsLyr);
		    map.addLayer(markersSPUD);
		    map.addLayer(markersPerm);

		    var toggleMaps = {
				"SPUD Wells": markersSPUD,
				"Permitted Wells": markersPerm,
		    };
			var overlayMaps = {

				"Pooling Units": poolingLyr,
				"Proposed Pipeline": pipeLyr,
			};

			L.control.layers(toggleMaps,overlayMaps).addTo(map);
	});
    } else {
		console.log("ERROR: The map was not .");
	return;
    }
    }
};

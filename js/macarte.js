/* definitions for
   tiles, track locations, overlays, variables in url
   */

moment.locale('fr');

var trackFolder = '../allvelotracks';

var ownCopyright = ' et <a href="http://alix.guillard.fr">Alix Guillard</a>';

// tiles mapbox https://www.mapbox.com/api-documentation/#maps
L.mapbox.accessToken = 'pk.eyJ1IjoiYWxveGUiLCJhIjoid3lBT0poSSJ9.QvBnfWvRrXcHGUQPccVtKA';

var mapbox = L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>' + ownCopyright
});

var greenbox = L.tileLayer('https://api.mapbox.com/v4/mapbox.run-bike-hike/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>' + ownCopyright
});

var pencil = L.tileLayer('https://api.mapbox.com/v4/mapbox.pencil/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>' + ownCopyright
});

var emerald = L.tileLayer('https://api.mapbox.com/v4/mapbox.emerald/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>' + ownCopyright
});

var outdoors = L.tileLayer('https://api.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>' + ownCopyright
});

//tiles osm
 var hikebike = L.tileLayer('http://{s}.tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', {
     maxZoom: 19,
     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' + ownCopyright
 });

// tiles topo
var topo1 = L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
maxZoom: 16,
attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)' + ownCopyright
});

// Esri_WorldTopoMap
var topo2 = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community' + ownCopyright
});

// Open surfer

var surfer = L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' + ownCopyright
});


// Hydra
var hydra = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
    attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' + ownCopyright
});

// Thunderforest landscape
var landscape = L.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' + ownCopyright
});

// OpenMap surfer

var surfer = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' + ownCopyright
});

// HERE Satelite
var here = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/satellite.day/{z}/{x}/{y}/256/png8?app_id=pfAhw6lDnb0sMr5AEBnP&app_code=o5uOOynx35QJsYG0k-7CWw', {
// var here = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/satellite.day/{z}/{x}/{y}/256/png8?app_id=jj3PxNTEQofGag1XJffz&app_code=DABJ44kZTSbLi8c520H_Vy-1CdIpLS_XFIT4EMdtNLo', {
    attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>' + ownCopyright,
    subdomains: '1234',
    mapID: 'newest',
    app_id: 'pfAhw6lDnb0sMr5AEBnP',
    app_code: 'o5uOOynx35QJsYG0k-7CWw',
    base: 'aerial',
    maxZoom: 20
});

// ESRI Satellite
var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'+ ownCopyright
});

// ESRI World Physical
var terrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
	maxZoom: 8
});

// OSM France
var osmfr = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
	maxZoom: 20,
	attribution: '&copy; Openstreetmap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


// https://leaflet-extras.github.io/leaflet-providers/preview/

var baseMaps = {
    "OSM Hike Bike": hikebike,
    "OSM fr labels": osmfr,
    "Open Topo Map": topo1,
    "Esri Topo Map": topo2,
    "Esri Satellite": satellite,
    "Esri terrain": terrain,
    "Hydra": hydra
};

var overlayMaps = {
//    "Tracks": layer
};

// variables from options in URL
var year = getParmFromHash("y");
var country = getParmFromHash("c");
var file = getParmFromHash("f");

/* functions to
   make url with # load
   find files
   find variables in file
*/

function jumpTo(url) {
    window.location.href=url;
    window.location.reload(true);
}

function getParmFromHash(param) {
    var re = new RegExp("#.*[?&]" + param + "=([^&]+)(&|$)");
    var match = location.hash.match(re);
    return(match ? match[1] : "");
}

function fileExists(url) {
    if(url){
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send();
        return req.status==200;
    } else {
        return false;
    }
}

function findDate(file) {
    var array = file.split('-');
    array[2] = array[2].substr(0, 2).replace(/\D/g, '');
    if (array[2].length === 2 && parseInt(array[2]) <= 31) {
        var date = array[0] + "-" + array[1] + "-" + array[2];
    } else {
        var date = array[0] + "-" + array[1];
    }
    return date;
}

function findName(file) {
    var date = findDate(file);
    var long = parseInt(file.length) - parseInt(date.length) - 4;
    var name = file.substr(date.length, long);
    var array = name.split('.');
    name = array[0].replace(/[-_]/g, ' ').replace(/[+&]/g, ' & ');
    name = decodeURI(name);
    return name;
}

function findCountries(file) {
    var countries = [];
    var array = file.split('.');
    var i = 1;
    while(i < array.length -1 ) {
        array[i]
        countries[i -1] = {
            code: array[i],
            name: getCountryName(array[i].toUpperCase())
        }
        countries[i -1].link = '<a href="#?c=' + countries[i -1].code + '">' + countries[i -1].name + "</a>";
        countries[i -1].url = '#?c=' + countries[i -1].code;
        i++;
    }
        countries[0].chain = ``;
    for (var i = 0; i < countries.length; i++) {
        if (countries[i] !== countries[0]) {
            countries[0].chain += `, `;
        }
        if (countries[i]) {
            countries[0].chain += `<a href="` + countries[i].url + `"   onClick="jumpTo('` + countries[i].url + `');">` + countries[i].name + `</a>`;
        }
    }
    if (countries.length >= 1) {
        return countries;
    } else {
        return false;
    }
}

  $( function() {
    $( "#content" ).draggable();
  } );

/* start of the main script 2 options:
   1- load one track and display title
   2- load all multiple tracks with info in popup
   */

$(document).ready(function () {

    var map = L.map('map', {
        layers: [topo2]
        // surfer, topo1, topo2, mapbox, emerald, greenbox, outdors, pencil, landscape, here, hydra
    });

    // console.log(map);

    // add change layer box
    L.control.layers(baseMaps).addTo(map);

    // if we have a file define actualtrack
    var actualtrack = (file) ? trackFolder + "/" + file : false;

    if (actualtrack) {

        // var map = new L.Map('map');


        var url = 'http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png',
            attr ='Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'  + ownCopyright,
            service = new L.TileLayer(url, {subdomains:"1234",attribution: attr});

        var el = L.control.elevation();
        el.addTo(map);
        var g=new L.GPX(actualtrack, { async: true });

        g.on('loaded', function(e) {
                map.fitBounds(e.target.getBounds());
        });

        g.on("addline",function(e){
            el.addData(e.line);
        });

        g.addTo(map);
        service = new L.TileLayer(url, {subdomains:"1234",attribution: attr});
        map.addLayer(service);

        var trackYear = findDate(file).substr(0, 4);
        var trackDate = moment(findDate(file)).format('dddd LL');
        var trackCountries = findCountries(file);

        var trackTitle = `<div id="content" class="whitepage ">
        	<h1><span>` + findName(file) + `</span> 🚲 <span>` +
        	trackDate + `</span></h1>\n<p> ` +
            ` ` + moment(findDate(file), "YYYYMMDD").fromNow() + `, ` +
        	`<a href="#?y=` + trackYear + `" onClick="jumpTo('#?y=` + trackYear + `')">` + trackYear + `</a> in ` +
            trackCountries[0].chain + `</p></div>`;


        $( '.leaflet-control-container' ).prepend( trackTitle );
        var elevation = $( '.elevation' );

        elevation.detach();
        elevation.appendTo( "#content" );
        // $( trackTitle ).insertBefore( '#map' );
        // TODO insert  watermark looks better that just div block
        // http://leafletjs.com/examples/extending/extending-3-controls.html

	// Elevation
	// var el = L.control.elevation();
/*	el.addTo(map);
*/
/*
        var runLayer = omnivore.gpx(actualtrack, null, objectLayer.customLayer)
        .on('ready', function() {
            map.fitBounds(runLayer.getBounds());
        })
        .addTo(map);
*/
} else { /* if not actualtrack */
        // if track not exists, we display the list from an array
        var filetoread = "./tracks.php?y=" + year + "&c=" + country;
        // FROM https://www.mapbox.com/mapbox.js/example/v1.0.0/non-exclusive-markers/

        filetoread = "./tracks.php?y=" + year + "&c=" + country;
        var layer = L.mapbox.featureLayer();

    // test first if the data contains tracks
    var jqxhr = $.getJSON(filetoread, function( data ) {

        if (!data || data.length <=0) {
            year = "2015";
            filetoread = "./tracks.php?y=" + year + "&c=" + country;
        }
    }).fail(function() {
            console.log( "error can't open track list" );
    }).complete(function() {
        $.getJSON(filetoread, function(tracks) {
            var arrayLayer = new Array();
            var nameUrl = new Array;
            var countryUrl = new Array;
            var yearUrl = new Array;
            var trackPopup = new Array;

            $.each(tracks, function( i, val ) {

                /* DEBUG */
                // console.log(" in Y= "+ year + "\n and C= " + country + "\n i // is "+ i +"\n val is "+ val);

                var objectLayer = {
                    id: i,
                    name: val,
                    year: year,
                    country: country,
                    trackYear: findDate(val).substr(0, 4),
                    trackDate: moment(findDate(val)).format('dddd LL'),
                    trackCountries: findCountries(val),

                    customLayer : L.geoJson(null, {
                        // http://leafletjs.com/reference.html#geojson-style
                        // TODO make this style editable
                        style: function(feature) {
                            return {
                            color: 'red',
        	                opacity: '0.4',
        	                weight: '3'
        		           };
        		        }
                    })
                };

            var actualtrack = trackFolder + "/" + val;

            /* EACH LAYER ADDED TO GROUP */

            nameUrl[i] = "#?f=" + objectLayer.name;

            trackPopup[i] = `<p><b>` +
        	`<a href="#?y=` + objectLayer.trackYear + `" onClick="jumpTo('#?y=` + objectLayer.trackYear + `')">` + objectLayer.trackYear
            + `</a> in ` + objectLayer.trackCountries[0].chain
            + `</b><br /><br />🚲 ` + i + `, `
            + objectLayer.trackDate
            + `<br /><a href="#?f=` + objectLayer.name
            + `" onClick="jumpTo('` + nameUrl[i] + `');" >`
            + objectLayer.name
            + `</a></p>`;

            arrayLayer[i] = omnivore.gpx(actualtrack, null, objectLayer.customLayer)
                .bindPopup(trackPopup[i])
    	        .on('ready', function() {
    		        map.fitBounds(arrayLayer[i].getBounds())
    	        })
                .addTo(map);
            }); // end .on('ready')

            /* DEBUG
            for ( var i = 0; i < arrayLayer.length; i++ ) {
                console.log("look in  "+ i +" → "+ arrayLayer[i] + "");
                console.log(arrayLayer[i]);
                console.log(yearUrl[i] + " " + countryUrl[i]);
                console.log(" ");
                console.log(" ");
            }
            */

        });
    });
    }
});

moment.locale('en');
var trackFolder = 'allvelotracks';

// available tiles
var baseMaps = {
    "OSM Hike Bike": hikebike,
    "Open Topo Map": opentopo,
    "OSM Fr labels": osmfr,
    "Mapbox street": mapbox_street,
    "Mapbox outdoor": mapbox_outdoor,
    "Mapbox light": mapbox_light,
    "Mapbox dark": mapbox_dark,
    "Thunderforest landscape": t_landscape,
    "Thunderforest cycle": t_cycle,
    "Thunderforest neighbourhood": t_neighbourhood,
    "Esri Satellite": esri_satellite,
    "Esri World Street": esri_street,
    "Esri Topo Map": esri_topo,
    "Esri World Physical": esri_physical,
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

$(document).ready(function () {
    var map = L.map('map', {
        layers: [esri_topo]
    });

    // add change layer box
    L.control.layers(baseMaps).addTo(map);

    // if we have a file define actualtrack
    var actualtrack = (file) ? trackFolder + "/" + file : false;

    if (actualtrack) {

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

        // TODO: insert  watermark looks better that just div block
        // http://leafletjs.com/examples/extending/extending-3-controls.html

    } else {
        // if track not exists, we display the list from an array
        // FROM https://www.mapbox.com/mapbox.js/example/v1.0.0/non-exclusive-markers/
        var filetoread = "./tracks.php?y=" + year + "&c=" + country;
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

            // each layer added to group
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
        });
    });
    }
});

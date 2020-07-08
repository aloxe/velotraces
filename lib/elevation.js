
		var map = new L.Map('map');


		var url = 'http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png',
			attr ='Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			service = new L.TileLayer(url, {subdomains:"1234",attribution: attr});

		var el = L.control.elevation();
		el.addTo(map);
		var g=new L.GPX("allvelotracks/2015-05-21_2107-Bracciano-lanotte.it.gpx", {

            async: true
            /*
			 marker_options: {
			    startIconUrl: './lib/leaflet-gpx/pin-icon-start.png',
			    endIconUrl: './lib/leaflet-gpx/pin-icon-end.png',
			    shadowUrl: './lib/leaflet-gpx/pin-shadow.png'
			  }
	*/
	});
		g.on('loaded', function(e) {
		  		map.fitBounds(e.target.getBounds());
		});
		g.on("addline",function(e){
			el.addData(e.line);
		});
		g.addTo(map);
		map.addLayer(service);

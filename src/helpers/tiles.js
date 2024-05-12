// Leaflet free tiles
// https://leaflet-extras.github.io/leaflet-providers/preview/
// tiles mapbox https://www.mapbox.com/api-documentation/#maps

// CyclOSM
export const CyclOSM = {
	tiles: (x, y, z) => {
		const s = String.fromCharCode(97 + ((x + y + z) % 3))
		return `https://${s}.tile-cyclosm.openstreetmap.fr/cyclosm/${z}/${x}/${y}.png`
	},
	attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}

// Thunderforest cycle
export const ThunderforestCycle = {
	tiles: (x, y, z) => {
		const s = String.fromCharCode(97 + ((x + y + z) % 3))
		return `http://${s}.tile.thunderforest.com/cycle/${z}/${x}/${y}.png?apikey=${import.meta.env.VITE_THUNDERFOREST_TOKEN}`
	},
	attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}

// Mapbox
export const mapboxStreet = {
	tiles: (x, y, z) => `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/${z}/${x}/${y}?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`,
	attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
}

export const mapboxOutdoor = {
	tiles: (x, y, z) => `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/256/${z}/${x}/${y}?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`,
	attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
}

// ESRI World Physical
export const esriPhysical = {
	tiles: (x, y, z) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/${z}/${y}/${x}`,
	attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service'
}

// Carto DB 
export const CartoDBVoyager = {
	tiles: (x, y, z, dpr) => {
		const s = String.fromCharCode(97 + ((x + y + z) % 3))
		return `https://${s}.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.png`
	},
	attribution: '<b><a href="https://carto.com/attributions">CARTO</a></b>'
}


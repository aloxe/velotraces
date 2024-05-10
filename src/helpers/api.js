import axios from 'axios';

export const getGpxList = async () => {
	try {
	  const response = await axios.get('/api/tracklist.json.php');
	  return response.data;
	} catch (error) {
	    console.error('oups Error fetching list:', error.message);
	    return {
			error: "Error fetching list",
			message: error.message
		}
	}
}

export const getGpx = async (url) => {
	console.log("url = " + url);
	try {
	  const response = await axios.get(`/api/gpx/${url}`);
	  return response.data;
	} catch (error) {
	    console.error('oups Error fetching gpx:', error.message);
	    return {
			error: "Error fetching gpx",
			message: error.message
		}
	}
}
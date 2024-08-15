const axios = require('axios');

async function getRestaurants() {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const location = '50.8503,4.3517';
    const radius = 500000;
    const keyword = 'gluten-free';
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&keyword=${keyword}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        console.log(response.data.results);
        return response.data.results;
    } catch (error) {
        console.error('Error fetching data from Google Places API', error);
        throw error;
    }
}

module.exports = getRestaurants;
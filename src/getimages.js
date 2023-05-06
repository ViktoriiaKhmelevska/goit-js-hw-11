
import axios from 'axios';

const per_page = 40;
let totalPages = 0;

async function getImages(inputValue, page) { 
   const API_KEY = '35804056-bdddfbb061fa747ba287fdf15';
const params = new URLSearchParams({
    key: API_KEY,
    q: inputValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: per_page,
    page: page,
});
      const response = await axios.get(`https://pixabay.com/api/?${params}`);
      totalPages = response.data.totalHits / per_page;
      return response;
};

export {getImages, totalPages}
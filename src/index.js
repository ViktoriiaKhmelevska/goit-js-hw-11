// import { getImages, totalPages } from './api';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let inputValue = "";
let page = 1;
const per_page = 40;
let totalPages = 0;

const form = document.querySelector(".search-form");
// const formInput = document.querySelector(".search-form input");
const gallery = document.querySelector('.gallery');
const lightbox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  const { searchQuery } = e.target.elements;
  inputValue = searchQuery.value.trim();
  
  if (!inputValue) {
    Notify.failure('Please, enter a search query');
    gallery.innerHTML = "";
    page = 1
    return
  }
  addGallery();
  return inputValue;
};
  
async function addGallery() {
  //  gallery.innerHTML = "";
  try {
  const response = await getImages(inputValue, page);
    const images = response.data.hits;
    console.log(images);
    createMarkup(images);
    lightbox.refresh();
  } catch (error) {
    console.log(error);
 }
};

// addGallery();
  
function createMarkup(images) {
  const markup = images
    .map(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `<a class="gallery__item" href="${largeImageURL}">
              <div class="photo-card">
                  <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
              </div>
              <div class="info">
                  <p class="info-item"><b>Likes</b> <br>${likes}</p>
                  <p class="info-item"><b>Views</b> <br>${views}</p>
                  <p class="info-item"><b>Comments</b> <br>${comments}</p>
                  <p class="info-item"><b>Downloads</b> <br>${downloads}</p>
              </div></a>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
};

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
    try {
      const response = await axios.get(`https://pixabay.com/api/?${params}`);
      totalPages = response.data.totalHits / per_page;
    return response;
  } catch (error) {
    Notify.warning("Error loading.");
  }
};
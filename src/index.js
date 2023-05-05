import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { createMarkup } from './createmarkup';

let inputValue = "";
let page = 5;
const per_page = 40;
let totalPages = 0;

const form = document.querySelector(".search-form");
const gallery = document.querySelector('.gallery');
const lightbox = new SimpleLightbox('.gallery a');
const guard = document.querySelector(".js-guard");
// const paginationBtn = document.querySelector('.load-more');

const options = {
  root: null,
  rootMargin: "200px",
  threshold: 0,
};
const observer = new IntersectionObserver(onPaginationScroll, options);

// paginationBtn.hidden = true;

// paginationBtn.addEventListener('click', onPagination);
form.addEventListener('submit', onSubmit);

async function onSubmit(e) {
  e.preventDefault();
  // paginationBtn.hidden = true;
  page = 1;
  const { searchQuery } = e.target.elements;
  inputValue = searchQuery.value.trim();
  
  if (!inputValue) {
    gallery.innerHTML = "";
    page = 1;
    Notify.failure('Please, enter a search query');
    //  paginationBtn.hidden = true;
    return;
  }
  await addGallery();

  page += 1;
  return inputValue;
};

// async function onPagination() {
//   page += 1;
//   await addGallery();
//   // getImages(page);
//   //  createMarkup(images);
//   if (page < totalPages) {
//     paginationBtn.hidden = false;
//   }
//   }
  
async function addGallery() {
  gallery.innerHTML = "";
  try {
  const response = await getImages(inputValue, page);
    const images = response.data.hits;
    createMarkup(images);
    observer.observe(guard);
    lightbox.refresh();
    } catch (error) {
    console.log(error);
 }
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
      // paginationBtn.hidden = true;
      if (response.data.hits.length === 0) {
        Notify.warning("Sorry, there are no images matching your search query. Please try again.")
        // paginationBtn.hidden = true;
        return;
      };
  Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
      return response;
      } catch (error) {
      Notify.warning("Error loading.");
  }
};

function onPaginationScroll (entries, observer) {
  console.log(entries);
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      page += 1;
      addGallery();
      // getImages(page);
      // createMarkup(images);
      if (page === totalPages) {
        observer.unobserve(guard);
      }
    }
  });
};

export {gallery}
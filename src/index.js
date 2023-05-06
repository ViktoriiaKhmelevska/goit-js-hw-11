import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { createMarkup } from './createmarkup';
import { scroll } from './scroll';
import { getImages, totalPages } from './getimages';

let inputValue = "";
let page = 1;

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
form.addEventListener('change', onInput);

function onInput(e) {
  inputValue = e.target.value.trim();
  return inputValue;
};

function onSubmit(e) {
  e.preventDefault();
    gallery.innerHTML = "";
  // paginationBtn.hidden = true;
  page = 1;
  const { searchQuery } = e.target.elements;
    if (!searchQuery.value) {
    Notify.failure('Please, enter a search query');
  } else {
   addImageSubmit()
  }
 };

function addImage(response) {
  const images = response.data.hits;
  if (!images.length) {
    gallery.innerHTML = "";
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  } else {
    createMarkup(images);
    Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
    lightbox.refresh();
  }
};

async function addImageSubmit() {
   try {
    const response = await getImages(inputValue, page);
    addImage(response);
    if (page !== totalPages) {
      observer.observe(guard); }
  } catch (error) {
    console.error(error);
  }};

async function addGallery() {
  try {
    scroll();
  const response = await getImages(inputValue, page);
    const images = response.data.hits;
    createMarkup(images);
    lightbox.refresh();
    if (page > totalPages) {
      Notify.warning("We're sorry, but you've reached the end of search results.");}
    } catch (error) {
    console.log(error);
 }
};

function onPaginationScroll (entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      page += 1;
      addGallery();
      if (page === totalPages) {
        observer.unobserve(guard);
      }
    }
  });
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

export {gallery}
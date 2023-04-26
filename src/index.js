import { searchImages } from 'pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

let inputValue = "";

const API_KEY = '35804056-bdddfbb061fa747ba287fdf15';
// const URL = "https://pixabay.com/api/?key=" + API_KEY + "&q=cats&image_type=photo&orientation=horizontal&safesearch=true";
const URL = 'https://pixabay.com/api/?key=35804056-bdddfbb061fa747ba287fdf15&q=cats&image_type=photo&orientation=horizontal&safesearch=true';

const form = document.querySelector(".search-form");
// const formInput = document.querySelector(".search-form input");
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', onSubmit);

function onSubmit(e) {
    e.preventDefault();
    const { searchQuery } = e.target.elements;

    inputValue = searchQuery.value;
  
    if (!inputValue) {
        gallery.innerHTML = "";
        return
    }

    searchImages(URL)
        .then((name) => {
            console.log(name);
        })
        .catch((err) => {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        });
};

function renderGallery(arr) {
    return arr.map(
        ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>    
            ` <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`).join("");
 };

// searchImages("inputValue")

// https://pixabay.com/api/?key=35804056-bdddfbb061fa747ba287fdf15&q=cats&image_type=photo&orientation=horizontal&safesearch=true
// searchImages(AUTH_KEY, 'puppy').then((r) => console.log(r));
// { totalHits: 500,
//   hits:
//    [ { previewHeight: 99,
//        likes: 108,
//        favorites: 87,
//        tags: 'chihuahua, dog, puppy',
//        webformatHeight: 426,
//        views: 38770,
//        webformatWidth: 640,
//        previewWidth: 150,
//        comments: 17,
//        downloads: 11050,
//        pageURL: 'https://pixabay.com/en/chihuahua-dog-puppy-cute-pet-621112/',
//        previewURL: 'https://cdn.pixabay.com/photo/2015/02/02/17/06/chihuahua-621112_150.jpg',
//        webformatURL: 'https://pixabay.com/get/ef37b00e29f61c2ad65a5854e34b4294e277eac818b5184993f0c07fafe9_640.jpg',
//        imageWidth: 5184,
//        user_id: 740400,
//        user: 'Teerasuwat',
//        type: 'photo',
//        id: 621112,
//        userImageURL: 'https://cdn.pixabay.com/user/2015/02/02/17-19-43-530_250x250.jpg',
//        imageHeight: 3456 },
//        ...
//    ],
//   total: 3343
// }
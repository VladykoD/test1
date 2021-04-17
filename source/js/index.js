const card = document.getElementById('cardDiv');
let windowHeight = window.innerHeight;

let start = 0;
let finish = 0;


function getPost() {
  let imagesNumber = parseInt(get('imgcol'));

  fetch('https://jsonplaceholder.typicode.com/photos?_start=0&_limit=200')
  .then((res) => {
    return res.json();
  })
  .then((post) => {
    if (start > post.length) return;

    finish += imagesNumber;

    if (finish > post.length) {
      finish = post.length;
    }

    for (let i = start; i < finish; i++) {
      card.innerHTML += `
        <li class='card list__item'>
          <img alt='${post[i].id}' class='card__image' src='${post[i].thumbnailUrl}' width='150' height='150'/>
          <p class='card__title'>${post[i].title}</p>
        </li>
      `
    }
    start += imagesNumber;
    checkGallerySize();
  })
  .catch((error) => {
    card.innerHTML = '<li class="list__item errorMessage">Подключиться не удалось. Пожалуйста попробуйте позже.</li>'
    console.log(error)
  })
}

function get(key) {
  let p = window.location.search;
  p = p.match(new RegExp(key + '=([^&=]+)'));
  return p ? p[1] : 12;
}

function checkGallerySize() {
  let contentHeight = card.offsetHeight;

  if (contentHeight <= windowHeight) {
    getPost();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getPost();
})

window.addEventListener('resize', function() {
  windowHeight = window.innerHeight;
})

window.addEventListener('scroll', function() {
  let contentHeight = card.offsetHeight;
  let yOffset = window.pageYOffset;
  let y = yOffset + windowHeight;

  if (y >= contentHeight) {
    getPost();
  }
});

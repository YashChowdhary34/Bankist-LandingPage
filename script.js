'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

// tabs

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  tabs.forEach(t => t.classList.remove('.operations__tab--active'));
  clicked.classList.add('.operations__tab--active');
  tabsContent.forEach(t => t.classList.remove('.operations__content--active'));
  document
    .querySelector(`operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__conent--active');
});

// menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// make header sticky
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const Headerobserver = new IntersectionObserver(
  function (entries, observer) {
    if (!entries.isIntersecting) {
      nav.classList.add('sticky');
    } else nav.classList.remove('sticky');
  },
  {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  }
);

Headerobserver.observe(header);

// reveal section
const allSection = document.querySelectorAll('.section');
const sectionObserver = new IntersectionObserver(
  function (entries, observer) {
    const [entry] = entries;
    if (entry.isIntersecting) {
      entry.target.classList.remove('section--hidden');
      observer.unobserve(entry.target);
    } else return;
  },
  {
    root: null,
    threshold: 0.15,
  }
);

allSection.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//lazy loading
const imgTargets = document.querySelectorAll('img[data-src]');
const imgObserver = new IntersectionObserver(
  function (entries, observer) {
    const [entry] = entries;
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src;
      entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img');
        observer.unobserve(entry.target);
      });
    } else return;
  },
  {
    root: null,
    threshold: 0.1,
    rootMargin: '100px',
  }
);

imgTargets.forEach(img => imgObserver.observe(img));

// slider component
const slides = document.querySelectorAll('.slide');
const btnleft = document.querySelector('.slider__btn--left');
const btnright = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let currSlide = 0;
let numSlides = slides.length;

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class = "dots__dot" data-slide = "${i}"></button>`
    );
  });
};

const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  }); // 0% 100% 200% 300%
};

const nextSlide = function () {
  if (currSlide === numSlides - 1) currSlide = 0;
  else currSlide++;

  goToSlide(currSlide);
};

const prevSlide = function () {
  if (currSlide == 0) currSlide = numSlides;
  else currSlide--;

  goToSlide(currSlide);
};

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide = "${slide}"]`)
    .classList.add('dots__dot--active');
};

const init = () => {
  createDots();
  goToSlide(0);
  activateDot(0);
};

init();

btnright.addEventListener('click', function (e) {
  nextSlide();
  activateDot(currSlide);
}); // -100% 0% 100% 200%

btnleft.addEventListener('click', function (e) {
  prevSlide();
  activateDot(currSlide);
});

document.addEventListener('keydown', function (e) {
  e.key === 'ArrowLeft' && prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    e.target.classList.add('.dots__dot--active');
    activateDot(slide);
  }
});

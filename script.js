'use strict';
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');  

const tabs =document.querySelectorAll('.operations__tab');
const tabsContainer=document.querySelector('.operations__tab-container');
const tabsContent=document.querySelectorAll('.operations__content');

const nav=document.querySelector('.nav');
///////////////////////////////////////
// Modal window



const openModal = function (e) {
  e.preventDefault();//bunu eklemezsek modali açtığında linkin olduğu pozisyonu alır.
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn=>btn.addEventListener('click', openModal));


btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//scrolling


btnScrollTo.addEventListener('click',function(e){
  const s1coords=section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());
  console.log('Current scroll (X/Y)',window.pageXOffset,window.pageYOffset);
  console.log('height/width viewport',
  document.documentElement.clientWidth,
  document.documentElement.clientHeight);  

  //scrolling
  /* window.scrollTo(s1coords.left+window.pageXOffset,
    s1coords.top+window.pageYOffset); 
 */

//1.yol
/*  window.scrollTo({
  left:s1coords.left+window.pageXOffset,
  top:s1coords.top+window.pageYOffset,
  behavior:'smooth'
}); */

 //2.yol
 section1.scrollIntoView({behavior:'smooth'})

}); 


//page navigation

//  document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click',function(e){
//     e.preventDefault();//linklerin default scroll işlemini deaktif eder.
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior:'smooth'});
//   })
// }); -ctrl + ö ile yapıldı.

//make page navigation with event delegater!!!-better solution -
//1.add event listener to common parent element
//2. Determine what element originated  the event


document.querySelector('.nav__links').addEventListener('click',function(e){
  e.preventDefault();

  //Matching strategy
  if(e.target.classList.contains('nav__link')){
    
    const id=e.target.getAttribute('href');
    console.log(id)
    document.querySelector(id).scrollIntoView({behavior:'smooth'});
  }
});

// Tabbed Component


tabsContainer.addEventListener('click',function(e){
  const clicked=e.target.closest('.operations__tab');//closesti eklemezsek buttondaki spana tıklarsak butonu tıklanmış saymaz

  //Guard clause
  if(!clicked)return;
  tabs.forEach(el=>el.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active'); 

  //activate content area
  tabsContent.forEach(el=>el.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});


//Menu fade animation
const handleHover=function(e){
    //console.log("üzerinde");
   
    if(e.target.classList.contains('nav__link')){
      //yanlışlıkla tıklanacak bir yer yoksa "btn içindeki span gibi",closesti kullanmaya gerek yok
      const link=e.target;
      const siblings=link.closest('.nav').querySelectorAll('.nav__link');
      const logo=link.closest('.nav').querySelector('img');
      siblings.forEach((el)=>{
        if(el !==link) el.style.opacity=this;
      });
      logo.style.opacity=this;
  
    }
}
nav.addEventListener('mouseover',handleHover.bind(0.5));
nav.addEventListener('mouseout',handleHover.bind(1));


//Sticky navigation
/*
OLD WAY
const initialCoords=section1.getBoundingClientRect();
console.log(initialCoords);

window.addEventListener('scroll',function(){
  //e argumeni girin-function(e) şeklinde- birsürü bilgiye ulaşabiliriz.
  if(window.scrollY>initialCoords.top)nav.classList.add('sticky');
  else nav.classList.remove('sticky');
})
 */

//STICKY NAVIGATION : Intersection Observer API
/* const obsCallback=function(entries,observer){
  entries.forEach(entry=>{
    console.log(entry);
  })
}
const obsOptions={
  root:null,
  threshold:[0,0.2] //1 yazarsak %100 göründüğünde çalışırdı8
}
const observer=new IntersectionObserver(obsCallback,obsOptions);
observer.observe(section1);
 */
const header=document.querySelector('.header');
const navHeight=nav.getBoundingClientRect().height;/* nav heightini verir. height:90px */
const stickyNav=function(entries){
  const [entry]=entries;
  if(!entry.isIntersecting)nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver=new IntersectionObserver
(stickyNav,{
  root:null,
  threshold:0,
  rootMargin:`-${navHeight}px`,/* 90px margin verir ve tetiklendiğinde çalışır "- yönde" */
});
headerObserver.observe(header);

//Reveal Sections 
const allSections=document.querySelectorAll('.section');

const revealSection=function(entries,observer){
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      entry.target.classList.remove('section--hidden');
      observer.unobserve(entry.target);
    }); 

};
const sectionObserver=new IntersectionObserver(revealSection,{
  root:null,
  threshold:0.15,
});
allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});


//Lazy Loading images-really useful for website performance
const imgTargets=document.querySelectorAll('img[data-src]');//if data-src is exist
const loadImg=function(entries,observer){
  const [entry]=entries;
  if(!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src=entry.target.dataset.src;
  entry.target.addEventListener('load',function(){
    entry.target.classList.remove('lazy-img');
  });


  observer.unobserver(entry.target);
}
const imgObserver=new IntersectionObserver(loadImg,{
  root:null,
  threshold:0,
  rootMargin:'-200px'
});
imgTargets.forEach(img=>imgObserver.observe(img));


//slider
const slider=()=>{
const slides=document.querySelectorAll('.slide');

const btnLeft=document.querySelector('.slider__btn--left');
const btnRight=document.querySelector('.slider__btn--right');
let curSlide=0;

const dotContainer=document.querySelector('.dots');

const maxSlide=slides.length;
/* const slider=document.querySelector('.slider');
slider.style.transform="scale(0.4)";
slider.style.overflow="visible";   */
//0%,100%,200%


//functions
const createDots=()=>{
  slides.forEach((_,i)=>{
  dotContainer.insertAdjacentHTML('beforeend',`<button class="dots__dot" data-slide="${i}"></button>` );
  })
}

const activateDot=function(slide){
  document.querySelectorAll('.dots__dot').forEach(dot=>dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}

const  goToSlide=function(slide){
  slides.forEach((s,i)=>{s.style.transform=`translateX(${100*(i-slide)}%)`})

}

const init=()=>{
  createDots();
  activateDot(0);
  goToSlide(0);
}
init();
//Next slide
const nextSlide=function(){
  if(curSlide===maxSlide-1)curSlide=0;
  else curSlide++;
  goToSlide(curSlide);
  activateDot(curSlide);
}

 //EVENT Handlers
btnRight.addEventListener('click',nextSlide);
const prevSlide=()=>{
  if(curSlide===0)curSlide=maxSlide-1;
  else curSlide--;
  
  goToSlide(curSlide);
  activateDot(curSlide);
 
}

btnLeft.addEventListener('click',prevSlide);
document.addEventListener('keydown',(e)=>{
  if(e.key==="ArrowRight")prevSlide()
  e.key==="ArrowLeft"&&nextSlide();
});
dotContainer.addEventListener('click',function(e){
  if(e.target.classList.contains('dots__dot')){
    const {slide}=e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  } 
});
};
slider();

/*Lifecycle DOM events */

//HTML oluşup DOM Tree inşa edildiğinde
document.addEventListener('DOMContentLoaded',function(){
  console.log("HTML parsed and DOM tree built!");
});

//Sayfadaki her şey tam anlamıyla yüklendiğinde
window.addEventListener('load',()=>console.log("Sayfa bütün detaylarıyla yüklendi"));
 
//sayfadan ayrıldığında-are you sure ? - mesaj verir.
window.addEventListener('beforeunload',(e)=>{
  e.preventDefault();
  console.log(e);
  e.returnValue='';
}); 


/* //DOM traversing
const h1=document.querySelector('h1');
//going downwards: child
console.log(h1.querySelectorAll('.highlight')); 
console.log(h1.childNodes);//bütün childları nodes türünde verir.
console.log(h1.children);//htmlCollection olarak verir-hepsini değil!-

h1.firstElementChild.style.color='white';
h1.lastElementChild.style.color="white"; 

//going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);//yukarıdakiyle aynı sonucu verir
h1.closest('.header').style.background='var(--gradient-secondary)';

//going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function(e){
  if(e !==h1)e.style.transform='scale(0.5)';
}); */
/*
How the DOM really works?
DOM
-allow us to make javascript interact with the browser;
-We can write JS to create,modify and delete HTML elements;
set styles,classes and attributes; and listen and respond to events;
-DOM tree is generated from an HTML document, whic we can then interact
with;
-DOM is a very complex API that contains a lots of methods and properties
to interact with the DOM tree


/////////Selectin elements //////////////////////////
 console.log(document.documentElement);//return entire html elements
console.log(document.head);//headı contentle birlikte verir
console.log(document.body);//bodyi contentle birlikte verir
const header=document.querySelector('.header');
console.log(document.querySelectorAll('.section'));//nodeList olarak verir.

console.log(document.getElementById('section--1'));

const allButtons=document.getElementsByTagName('button');
console.log(allButtons);
//htmlCollections olarak döner, bir element;html sayfasından 
//silindiğinde htmlCollections güncellenir! fakat NodeListte aynı durum geçerli değildir.

console.log(document.getElementsByClassName('btn'));


////////Creating and inserting elements///////////
//.insertAdjacentHTML
const message = document.createElement('div');
message.classList.add('cookie-message');
//message.textContent='We used cookies for improved funcionality and analytics.';
message.innerHTML='We use cookies for improved funcionality and analytics.<button class="btn btn--close-cookie">Got it!</button>';
console.log(message);
 
//append tek görünür, aynı anda birden fazla yerde görünmez!
//it cannot be used multiple times!!!!!!!!!
//header.prepend(message);//add element as the first child!
header.append(message);//add element as the last child!

//header.append(message.cloneNode(true));=> kopya oluşturma için


//header.before(message);//headerdan önce
//header.after(message);//headerdan sonra

//Delete Elements//
document.querySelector('.btn--close-cookie').addEventListener('click',()=>{
  //message.remove(); -yeni yöntem
  message.parentElement.removeChild(message);//old way
});

//Styles
message.style.backgroundColor='#37383d';
message.style.width='120%';
console.log(message.style.color);//tanımlayanmayan veya css dosyasına tanımlana css kodları görünmez
console.log(message.style.backgroundColor);//doğrudan objeye eklenen css kodları görünür.


console.log(getComputedStyle(message));//objeye ait bütün css kodlarını gösterir.
//biz height vs. tanımalamadıysak bile pc hesaplayıp css'e ekler, bu gibi css kodlarını da içerir!
console.log(getComputedStyle(message).height);

message.style.height=Number.parseFloat(getComputedStyle(message).height,10)+30+"px";

//css custom properties
document.documentElement.style.setProperty('--color-primary','orangered');



//Attributes
const logo=document.querySelector('.nav__logo');
logo.alt="Beautiful minimalist logo";//değiştirilebilir!
console.log(logo.alt,logo.src);
console.log(logo.className);  
//non-standart: yani normalde logoya eklenebilen bir attribute değil!
console.log(logo.designer);
//şimdi eklenip data getirilebilir işte
console.log(logo.getAttribute('designer'));
console.log(logo.setAttribute('company','Bankist'));

console.log(logo.getAttribute('company'));

console.log(logo.src);//link tipinde verir
console.log(logo.getAttribute('src')); //relative olarak verir.

const link=document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

//Data attributes - spesifik bir tipi var
//      data-version-number="3.0" 2. "-" işareti yerine kelime birleşir
//ve ilk harf büyük olur
console.log(logo.dataset.versionNumber);

//classes

logo.classList.add('c','j')
logo.classList.remove('c')
logo.classList.toggle('c')
logo.classList.contains('c');//not includes!
console.log(logo.classList);

//Don't use!!
logo.className='jonas'; //override yapar!

 

/////////////////Type of events and event handlers

 const h1=document.querySelector('h1');

const alertH1=(e)=>{
  alert('Add event listener çalıştı!');
}

h1.addEventListener('mouseenter',alertH1);

//event silme
setTimeout(()=>{
  h1.removeEventListener('mouseenter',alertH1);
},3000); 

h1.onmouseenter=(e)=>{
  alert('onmouseenter çalıştı');
} 

///////////////////////////////////////////////////////////////
//Önemli!
 //rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  // Stop propagation - tekrar üst elementlere geçişi durdurur!
  //e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});
   */




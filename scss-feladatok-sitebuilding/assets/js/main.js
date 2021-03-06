const navbar = document.querySelector('.navbar');
const navbarBrand = document.querySelector('.navbar-brand');
const navbarNavLinks = document.querySelectorAll('#navbarNav a');
let scrolled = false;
const links = document.querySelectorAll(".navbar-collapse ul a");
window.onscroll = NavbarOnScroll;

for (const link of links) {
  link.addEventListener("click", clickHandlerOfNavbarLinks);
}

function NavbarOnScroll(e) {
  if (!scrolled && scrollY > 1) {
    navbar.classList.toggle('navbar-initial');
    navbar.classList.toggle('navbar-scrolled');
    navbarBrand.classList.toggle('navbar-initial__brand');
    navbarBrand.classList.toggle('navbar-scrolled__brand');
    for (link of navbarNavLinks) {
      link.classList.toggle('navbar-initial__link');
      link.classList.toggle('navbar-scrolled__link');
    }
    scrolled = true;
    return;
  }
  if (scrollY === 0) {
    navbar.classList.toggle('navbar-initial');
    navbar.classList.toggle('navbar-scrolled');
    navbarBrand.classList.toggle('navbar-initial__brand');
    navbarBrand.classList.toggle('navbar-scrolled__brand');
    for (link of navbarNavLinks) {
      link.classList.toggle('navbar-initial__link');
      link.classList.toggle('navbar-scrolled__link');
    }
    scrolled = false;
  }
}

function clickHandlerOfNavbarLinks(e) {
  e.preventDefault();
  const href = this.getAttribute("href");
  document.documentElement.style.scrollBehavior = "auto";
  animScroll(href);
}

function animScroll(target, time = 300) {
  const elem = document.querySelector(target);
  if (!elem) return;
  const to = elem.offsetTop;
  const from = window.scrollY;
  const start = new Date().getTime();
  const timer = setInterval(function () {
    const step = Math.min(1, (new Date().getTime() - start) / time);
    window.scrollTo(0, (from + step * (to - from)) + 1);
    if (step == 1) {
      clearInterval(timer);
      document.documentElement.style.scrollBehavior = "";
    }
  }, 25);
  window.scrollTo(0, (from + 1)); // ??
}


$("footer a").on("click", function (e) {
  e.preventDefault();
  let target = $(this).data("target");
  let modal = new bootstrap.Modal(target);

  modal.toggle();
});
/*  
  super messy code but I don't have time to refactor or even better rewrite it
  from scratch for now 
*/

const getCaracters = async (url = './json/got.json') => {
  try {
    const response = await fetch(url);
    const dataRaw = await response.json();
    const dataFiltered = customFilter(dataRaw);
    const dataSorted = sortByName(dataFiltered);    
    renderPortraits(dataSorted);
    createSearchListeners(dataSorted);
  } catch (err) {
    console.error(err);
  }
};

const sortByName = (arr = [{}]) => {
  arr.sort((a, b) => {
    const aName = a.name.toUpperCase();
    const bName = b.name.toUpperCase();
    if (aName < bName) {
      return -1;
    }
    if (aName > bName) {
      return 1;
    }
    return 0;
  });
  return arr;
}

const customFilter = (arr = [{}]) => (
  arr.filter(item => item.hasOwnProperty('name') && item.hasOwnProperty('picture') && !item.hasOwnProperty('alias'))
)

const renderPortraits = (arr = [{}]) => {
  arr.forEach(item => {
    const target = document.querySelector('.main-content');
    const div = document.createElement('div');
    const img = document.createElement('img');
    const p = document.createElement('p');
    p.textContent = item.name;
    img.setAttribute('src', `./${item.portrait}`);
    div.appendChild(img);
    div.appendChild(p);
    target.appendChild(div);
    div.addEventListener('click', () => {
      clickHandler(item, div)
    }); 
  })
}

const clickHandler = (item, elem) => {
  const charPic = document.querySelector('#charPic');
  const charName = document.querySelector('#charName');
  const charBio = document.querySelector('#charBio');
  const housePic = document.querySelector('#housePic');
  const house = item.house || item.organization || '';

  charPic.setAttribute('src', `./${item.picture || './assets/pictures/got-placeholder.jpg'}`);
  charName.textContent = item.name || 'Character not found';
  if (house) housePic.setAttribute('src', `./assets/houses/${house}.png`)
  else housePic.setAttribute('src', '');
  charBio.textContent = item.bio || '';   
  toggleActive(elem);
  if (elem) elem.scrollIntoViewIfNeeded();
}

const createSearchListeners = (arr = [{}]) => {
  const btnSearch = document.querySelector('#btn-search');
  const searchInput = document.querySelector('#search');
  btnSearch.addEventListener('click', () => {
    searchHandler(arr)
  });
  searchInput.addEventListener('keyup', () => {
    if (event.key === 'Enter') searchHandler(arr);
  })
}

const searchHandler = (charList) => {
  const searchInput = document.querySelector('#search');
  const item = charList.filter(char => char.name.toLowerCase() === searchInput.value.toLowerCase())[0];

  if (item) {
    const elem = getElemByCharName(item.name);
    clickHandler(item, elem)
  } else clickHandler({}, '');    
}

const getElemByCharName = (name) => {
  const elems = [...document.querySelectorAll('.main-content div')];
  const elem = elems.filter(elem => elem.querySelector('p').textContent === name)[0];
  return elem;
}

const activeHandler = () => {
  let lastActive;
  return function(elem) {    
    if (lastActive) lastActive.classList.toggle('active');
    if (elem) elem.classList.toggle('active');
    lastActive = elem;    
  }  
}

const toggleActive = activeHandler();

getCaracters();
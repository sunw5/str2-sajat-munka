const getCaracters = async (url = '../json/got.json') => {
  try {
    const response = await fetch(url);
    const dataRaw = await response.json();
    const dataFiltered = customFilter(dataRaw);
    const dataSorted = sortByName(dataFiltered);
    //console.log(dataSorted);
    renderPortraits(dataSorted);
    createSearchListener(dataSorted);    
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
    div.addEventListener('click', (event) => {clickHandler(item, event)}); //todo: event not need to pass
  })
}

const clickHandler = (item, event) => {
  const charPic = document.querySelector('#charPic');
  const charName = document.querySelector('#charName');
  const charBio = document.querySelector('#charBio');
  const housePic = document.querySelector('#housePic');
  const house = item.house || item.organization || '';

  charPic.setAttribute('src', `../${item.picture || ''}`); //todo: placeholder for
  charName.textContent = item.name || 'Character not found';  
  if(house) housePic.setAttribute('src', `../assets/houses/${house}.png`)
  else housePic.setAttribute('src', '');
  charBio.textContent = item.bio || '';
}

const createSearchListener = (arr = [{}]) => {
  const btnSearch = document.querySelector('#btn-search');
  const searchInput = document.querySelector('#search');
  btnSearch.addEventListener('click', (event) => {searchHandler(arr, event)}); //todo: event
  searchInput.addEventListener('keyup', (event) => {
    if(event.key === 'Enter') searchHandler(arr, event);
  })
}

const searchHandler = (charList, event) => {
  const searchInput = document.querySelector('#search');  
  const item = charList.filter(char => char.name.toLowerCase() === searchInput.value.toLowerCase())[0];
  
  item ? clickHandler(item) : clickHandler({});
}

getCaracters();
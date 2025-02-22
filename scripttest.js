/* eslint-disable max-len */
/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/
/*
  ## Utility Functions
    Under this comment place any utility functions you need - like an inclusive random number selector
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
*/

function getRandomInclusive(min, max) {
  const newMin = Math.ceil(min);
  const newMax = Math.floor(max);
  return Math.floor(Math.random() * (newMax - newMin + 1) + newMin);
}

function injectHTML(list) {
  
  const target = document.querySelector('#speed_list'); //inputted // 
  target.innerHTML = '';

  const listEl = document.createElement('ol');
  target.appendChild(listEl);

  list.forEach((item) => {
    const el = document.createElement('li');
      el.innerText = item.school;
  ;
    listEl.appendChild(el);
    console.log('fired injectHTML');
  });
}
// Filtering data //
function filterList(list, filterInputValue) {
  return list.filter((item) => {
    const lowerCaseName = `${item.school} ${item.object_id} ${item.street_address} ${item.posted_speed}`.toLowerCase(); //inputted
    const lowerCaseQuery = filterInputValue.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

function processSpeed(list) { //inputted//
  const range = [...Array(10).keys()];
  const newArray = range.map((item) => {
    const index = getRandomInclusive(0, list.length);
    console.log('fired speed list');
    return list[index];
  });
  return newArray;
}
function initMap() {
  console.log('initMap');
  const map = L.map('map').setView([38.7849, -76.8721], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  return map;
}

function markerPlace(array, map) {
  console.log('markerPlace', array);
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });
  array.forEach((item, index) => {
    const lat = item.location_1.latitude;
    const long = item.location_1.longitude;
    const numLat = parseFloat(lat);
    const numLong = parseFloat(long);
    console.log([numLat, numLong]);
    L.marker([numLat, numLong]).addTo(map);
    if (index === 0) {
      map.setView([numLat, numLong], 10);
    }
  });
}


async function getData() {
  const url = 'https://data.princegeorgescountymd.gov/resource/mnkf-cu5c.json';
  const data = await fetch(url);
  const json = await data.json();
  const reply = json.filter((item) => Boolean(item.location)).filter((item) => Boolean(item.school)); //inputted//
  console.log(json);
  return reply;
}

async function mainEvent() {
  // initMap();
  
  const form = document.querySelector('.main_form'); 
  const submit = document.querySelector('#get-speed'); //inputed//
  const loadAnimation = document.querySelector('.lds-ellipsis');

  submit.style.display = 'none';
  const pageMap = initMap();
  
  const mapData = await getData();

  if (mapData?.length > 0) { //inputted// 
    submit.style.display = 'block';
    loadAnimation.classList.remove('lds-ellipsis');
    loadAnimation.classList.add('lds-ellipsis_hidden');

    let currentList = [];
    form.addEventListener('input', (event) => {
      console.log(event.target.value);
      const newFilterList = filterList(currentList, event.target.value);
      injectHTML(newFilterList);
      markerPlace(newFilterList, pageMap);
    });

    form.addEventListener('submit', (submitEvent) => {
      submitEvent.preventDefault();
      console.log('here')
      currentList = processSpeed(mapData); //inputted//

      injectHTML(currentList);
      markerPlace(currentList, pageMap);
    });
  }
}




document.addEventListener('DOMContentLoaded', async () => mainEvent());

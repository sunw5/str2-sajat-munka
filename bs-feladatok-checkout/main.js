const states = {
  HU: [
    "Baranya", "Bács-Kiskun", "Békés", "Borsod-Abaúj-Zemplén", "Budapest", "Csongrád-Csanád", "Fejér", "Győr-Moson-Sopron", "Hajdú-Bihar", "Heves", "Jász-Nagykun-Szolnok", "Komárom-Esztergom", "Nógrád", "Pest", "Somogy", "Szabolcs-Szatmár-Bereg", "Tolna", "Vas", "Veszprém", "Zala"
  ],
  USA: [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "MontanaNebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "PennsylvaniaRhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ]
}



function changeStates() {
  const elCountry = document.querySelector('#country');
  const elStates = document.querySelector('#states');
  const country = elCountry.options[elCountry.selectedIndex].value;

  while (elStates.options.length) {
    elStates.remove(0);
  };

  if (states[country]) {
    
    for (let i = 0; i < states[country].length; i++) {
      let stateOption = new Option(states[country][i], i);
      elStates.options.add(stateOption);
    }
  }
}
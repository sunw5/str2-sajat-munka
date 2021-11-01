const clock = document.querySelector("#clock");

setInterval(() => {
  let now = new Date().getTime();

  clock.textContent = new Date().toLocaleTimeString( [], { hour12: false });
}, 1000)
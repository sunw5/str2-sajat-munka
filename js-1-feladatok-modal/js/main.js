const modal = document.querySelector("#myModal");
const modalContent = modal.querySelector(".modal-content");

// When the user clicks the button, open the modal
function openModal() {
  modal.style.display = "flex";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modalExit();
  }
};

function modalExit() {
  modalContent.classList.add("modal-content-close");

  setTimeout(() => {
    modal.style.display = "none";
    modalContent.classList.remove("modal-content-close");
  }, 350);
}

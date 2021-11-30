const keys = ["id", "name", "address", "email"];
const keysEditable = {
  name: /^[A-Z]([\u00c0-\u01ffa-zA-Z'-])+([ ][A-Z]([\u00c0-\u01ffa-zA-Z'-])+){1,2}$/,
  address: /^\d{1,5}\s[A-Za-z]+\s(\b[A-Za-z]*\b\s){0,2}[A-Za-z]+$/,
  email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
};
let isUnlockedRow = false;
let activeRow = null;

document.querySelector("#getDataBtn").addEventListener("click", getUsers);

function getServerData(url) {
  let fetchOptions = {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
  };

  return fetch(url, fetchOptions).then(
    (response) => response.json(),
    (error) => console.error(err)
  );
}

function getUsers() {
  getServerData("http://localhost:3000/users").then((data) =>
    fillDataTable(data, "userTable")
  );
}

function fillDataTable(data, tableId) {
  let dataReversed = data.reverse();
  let table = document.querySelector(`#${tableId}`);
  if (!table) {
    console.error(`Table "${tableId}" is not found"`);
    return;
  }

  let tBody = table.querySelector("tbody");
  tBody.innerHTML = "";
  let newRow = newUserRow();
  tBody.appendChild(newRow);

  for (let row of dataReversed) {
    let tr = createAnyElement("tr");
    for (let k of keys) {
      let td = createAnyElement("td" /* {scope: "row"} */ );
      let input = createAnyElement("input", {
        class: "form-control",
        value: row[k],
        name: k,
        readonly: true,
      });
      td.appendChild(input);
      tr.appendChild(td);
    }
    tr.appendChild(createBtnGroupTd());
    tBody.appendChild(tr);
  }
}

function createBtnGroupTd() {
  let btnGrp = createAnyElement("div", {
    class: "btn-group"
  });
  let btnSave = createAnyElement("button", {
    class: "btn btn-info",
    onclick: "unlockRow(this)",
  });  
  btnSave.innerHTML = '<i class="bi bi-wrench"></i>';
  let btnDel = createAnyElement("button", {
    class: "btn btn-danger",
    onclick: "delRow(this)",
  });
  btnDel.innerHTML = '<i class="bi bi-trash" aria-hidden="true"></i>';
  btnGrp.appendChild(btnSave);
  btnGrp.appendChild(btnDel);
  let td = createAnyElement("td");
  td.appendChild(btnGrp);
  return td;
}

document.querySelector('#userTable').addEventListener('click', modalDisAllowedButtons);

function createNewUser(btn) {
  if(isUnlockedRow) return;  
  const rowIsAllValid = validateRow(btn);
  new bootstrap.Modal(document.getElementById('validationModal')).show();
  timedCloseModal(5000);
  if(!rowIsAllValid) return;

  let tr = btn.parentElement.parentElement;
  let data = getRowData(tr);
  delete data.id;
  let fetchOptions = {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch("http://localhost:3000/users", fetchOptions)
    .then(
      (resp) => resp.json(),
      (error) => console.error(error)
    )
    .then((d) => getUsers());
}

function unlockRow(btn) {
  if (isUnlockedRow) return;
  let tr = btn.closest("tr");
  activeRow = tr;
  for (const key of Object.keys(keysEditable)) {
    tr.querySelector(`input[name=${key}]`).readOnly = false;
  }
  swapBtnGrp(btn);
  isUnlockedRow = true;
}

function swapBtnGrp(btn) {
  const btn1 = btn.closest(".btn-group").querySelectorAll("button")[0];
  const btn2 = btn.closest(".btn-group").querySelectorAll("button")[1];
  const icon1 = btn1.querySelector("i");
  const icon2 = btn2.querySelector("i");
  icon1.classList[1] === "bi-wrench" ?
    icon1.classList.toggle("bi-check-lg") :
    icon1.classList.toggle("bi-wrench");
  icon1.classList.toggle(icon1.classList[1]);
  if (btn1.getAttribute("onclick") === "unlockRow(this)") {
    btn1.setAttribute("onclick", "setRowHandler(this)");
    btn1.setAttribute("data-bs-toggle", "modal");
    btn1.setAttribute("data-bs-target", "#validationModal");
  } else {
    btn1.removeAttribute("data-bs-toggle", "modal");
    btn1.removeAttribute("data-bs-target", "#validationModal");    
    btn1.setAttribute("onclick", "unlockRow(this)");
  };
    
  icon2.classList[1] === "bi-trash" ?
    icon2.classList.toggle("bi-arrow-right-circle") :
    icon2.classList.toggle("bi-trash");
  icon2.classList.toggle(icon2.classList[1]);
  btn2.getAttribute("onclick") === "delRow(this)" ?
    btn2.setAttribute("onclick", "resetRow(this)") :
    btn2.setAttribute("onclick", "delRow(this)");
}

function setRowHandler(btn) {
  /* const row = btn.closest("tr");
  const rowValidationObj = rowGetValidations(row);
  
  setModalMessage(rowValidationObj);  
  timedCloseModal(5000); */
  const rowIsAllValid = validateRow(btn);
  if(!rowIsAllValid) return;
  setRow(btn);
  isUnlockedRow = false;
}

function validateRow(btn) {
  const row = btn.closest("tr");
  const rowValidationObj = rowGetValidations(row);
  
  setModalMessage(rowValidationObj);  
  timedCloseModal(5000);
  return rowIsAllValid(rowValidationObj);
}

function setModalMessage(validationResult) {
  const modalBody = document.querySelector('.modal-body');
  let message = "";
  for (const key in validationResult) {
    if (validationResult.hasOwnProperty(key)) {
      validationResult[key] ? message += `<p class= "alert alert-success">${key} is valid</p>` : message += `<p class= "alert alert-danger">${key} is invalid</p>`;
    }
  }
  modalBody.innerHTML = message;
}

function timedCloseModal(msec) {
  setTimeout(() => {
    document.querySelector('#validationModal .btn-close').click();
  }, msec);
}

function rowGetValidations(row) {
  const data = getRowData(row);
  let validationResult = {};
  for (const key in data) {
    if (data.hasOwnProperty(key) && keysEditable.hasOwnProperty(key)) {
      let tester = keysEditable[key].test(data[key]);
      validationResult[key] = tester;
    }
  }
  return validationResult;  
}

function rowIsAllValid(rowValidationObj) {
  return Object.values(rowValidationObj).every(v => v === true) ? true : false;
}

function setRow(btn) {
  let tr = btn.parentElement.parentElement.parentElement;
  let data = getRowData(tr);
  let fetchOptions = {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  fetch(`http://localhost:3000/users/${data.id}`, fetchOptions)
    .then(
      (res) => res.json(),
      (err) => console.error(err)
    )
    .then((data) => getUsers(data));
    activeRow = null;
}

function resetRow(btn) {
  let tr = btn.closest("tr");
  for (const key of Object.keys(keysEditable)) {
    tr.querySelector(`input[name=${key}]`).readOnly = true;
  }
  swapBtnGrp(btn);
  getUsers();
  isUnlockedRow = false;
  activeRow = null;
}

function delRow(btn) {
  if (isUnlockedRow) return;
  btn.closest("tr").setAttribute("class", "bg-warning");
  let tr = btn.parentElement.parentElement.parentElement;
  let id = tr.querySelector("input[name=id]").value;

  let fetchOptions = {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
  };
  fetch(`http://localhost:3000/users/${id}`, fetchOptions)
    .then(
      (response) => response.json(),
      (err) => console.error(err)
    )
    .then((data) => {
      getUsers();
    });
}

function createAnyElement(name, attrs) {
  let elem = document.createElement(name);
  for (let attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      elem.setAttribute(attr, attrs[attr]);
    }
  }
  return elem;
}

function newUserRow() {
  let tr = createAnyElement("tr");
  for (let k of keys) {
    let td = createAnyElement("td");

    let input = createAnyElement("input", {
      class: "form-control",
      name: k,
    });
    if (k === "id") {
      input.setAttribute("readonly", true);
    }
    td.appendChild(input);
    tr.appendChild(td);
  }
  let newButton = createAnyElement("button", {
    class: "btn btn-success",
    onclick: "createNewUser(this)",
  });
  newButton.innerHTML = '<i class="fa fa-plus-circle" aria-hidden="true"></i>';
  let td = createAnyElement("td");
  td.appendChild(newButton);
  tr.appendChild(td);

  return tr;
}

function getRowData(tr) {
  let inputs = tr.querySelectorAll("input.form-control");
  let data = {};
  for (let i = 0; i < inputs.length; i++) {
    data[inputs[i].name] = inputs[i].value;
  }
  return data;
}

function modalDisAllowedButtons(e) {  
  let btn;  
  let thisRow;
  if(e.target.nodeName === "I") btn = e.target.closest('button');
  if(e.target.nodeName === "BUTTON") btn = e.target;

  if(btn) {
    thisRow = btn.closest('tr');    
  }else return;  

  if(isUnlockedRow && thisRow != activeRow) {   
    document.querySelector('#validationModal .modal-body').innerHTML = `<p class= "alert alert-warning">Először be kell fejezned az aktuális szerkesztést!</p>`;
    new bootstrap.Modal(document.getElementById('validationModal')).show();
    timedCloseModal(5000);
  }    
}


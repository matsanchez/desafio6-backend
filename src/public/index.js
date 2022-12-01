const socket = io();

let products = [];

const DOMform = document.getElementById("formAdd");

const handleSubmit = (e, form) => {
  e.preventDefault();
  let formData = new FormData(form);
  let obj = {};
  formData.forEach((value, key) => (obj[key] = value));
  socket.emit("product", obj);
  DOMform.reset();
};

DOMform.addEventListener("submit", (e) => handleSubmit(e, e.target));

const listProducts = (data) => {
  let content = "";
  let listHeader = "";
  let items = "";
  if (data.length === 0) {
    return (content = `<th class="rounded">
                          <h5 class="p-3 text-center">No hay productos en la lista</h5>
                      </th>`);
  } else {
    listHeader = `<thead>
                      <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Precio</th>
                        <th scope="col">Foto</th>
                      </tr>
                  </thead>`;
    data.forEach((item) => {
      items += `<tr class="align-middle">
                  <td>${item.title}</td>
                  <td>${item.price}</td>
                  <td><img src=${item.thumbnail} class="img-thumbnail shadow-sm" width="80" height="80" alt=${item.title}></td>
                </tr>`;
    });
    content = listHeader + items;
  }
  return content;
};

socket.on("products", (data) => {
  let content = listProducts(data);
  document.getElementById("listProducts").innerHTML = content;
});

const DOMchat = document.getElementById("formChat");

const chatHandleSubmit = (e, form) => {
  e.preventDefault();
  let formData = new FormData(form);
  let obj = {};
  formData.forEach((value, key) => (obj[key] = value));
  let message = { ...obj, date: new Date().toLocaleString() };
  socket.emit("new-message", message);
  document.getElementById("textarea").value = "";
};

DOMchat.addEventListener("submit", (e) => chatHandleSubmit(e, e.target));

socket.on("messages", (data) => {
  let html = data
    .map((elem, idx) => {
      return `<li id=${idx} class="bg-light p-1 rounded-2">
              <strong class="text-primary">${elem.email}</strong>:
              <strong class="text-danger">[${elem.date}]</strong>
              <em class="text-success">${elem.text}</em>
            </li>`;
    })
    .join(" ");

  document.getElementById("roomChat").innerHTML = html;
});

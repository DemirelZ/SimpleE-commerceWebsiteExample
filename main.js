const categoryList = document.querySelector(".categories");
const productsArea = document.querySelector(".products");
const basketBtn = document.querySelector("#basket");
const closeBtn = document.querySelector("#close");
const modal = document.querySelector(".modal-wrapper");
const basketList = document.querySelector("#list");
const totalSpan = document.querySelector("#total-price");
const totalCount = document.querySelector("#count");
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");

const baseUrl = "https://api.escuelajs.co/api/v1";

document.addEventListener("DOMContentLoaded", function () {
  fetchCategories();
  fetchProducts();
});

function fetchCategories() {
  fetch(`${baseUrl}/categories`)
    .then((response) => response.json())
    .then((data) => renderCategories(data.slice(1, 5)))
    .catch((err) => console.log(err));
}

function renderCategories(param) {
  param.forEach((par) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category-card");

    categoryDiv.innerHTML = `
    <img src="${par.image}"/>
    <p>${par.name}</p>
  `;
    categoryList.appendChild(categoryDiv);
  });
}

function fetchProducts() {
  fetch(`${baseUrl}/products`)
    .then((request) => request.json())
    .then((data) => renderProducts(data.slice(0, 25)));
}

function renderProducts(params) {
  params.forEach((par) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("card");
    productDiv.innerHTML = `
              <img src=${par.images[0]} />
              <h4>${par.title}</h4>
              <h4>${par.category.name ? par.category.name : "Diğer"}</h4>
              <div class="action">
                <span>${par.price} &#8378;</span>
                <button onclick="addToBasket({id:${par.id},title:'${
      par.title
    }',price:${par.price},img:'${
      par.images[0]
    }',amount:1})">Add to Card</button>
              </div>
            </div>
  `;

    productsArea.appendChild(productDiv);
  });
}

//-----------------------searchBox-------------------------------

async function searchProducts(keyword) {
  const results = [];
  //console.log(results);
  try {
    const response = await fetch(`${baseUrl}/products`);

    if (!response.ok) {
      throw new Error("API isteği başarısız!");
    }

    const data = await response.json();

    data.slice(0, 25).forEach((product) => {
      if (
        product.title.toLowerCase().includes(keyword.toLowerCase()) ||
        product.category.name.toLowerCase().includes(keyword.toLowerCase())
      ) {
        results.push(product);
      }
    });

    return results;
  } catch (error) {
    console.error("Hata oluştu:", error);
    throw error;
  }
}

searchBtn.addEventListener("click", async function () {
  const keyword = searchInput.value;
  const result = await searchProducts(keyword);
  console.log(result.length);
  displayResults(result);
});

function displayResults(results) {
  // console.log(results);
  productsArea.innerHTML = "";
  searchResults.innerHTML = "";
  //console.log(results.length);
  if (results.length === 0) {
    //console.log(results.length);
    searchResults.innerHTML = "No matching results found for the word you searched for :(";
  } else {
    results.forEach((result) => {
      const resultElement = document.createElement("div");
      resultElement.classList.add("card");
      resultElement.innerHTML = `
                <img src=${result.images[0]} />
                <h4>${result.title}</h4>
                <h4>${
                  result.category.name ? result.category.name : "Diğer"
                }</h4>
                <div class="action">
                  <span>${result.price} &#8378;</span>
                  <button onclick="addToBasket({id:${result.id},title:'${
        result.title
      }',price:${result.price},img:'${
        result.images[0]
      }',amount:1})">Add to Card</button>
                </div>
              </div>
    `;
      searchResults.classList.add("products");
      searchResults.appendChild(resultElement);
    });
  }
}

//-----------------------searchBox-------------------------------

//Sepet
let basket = [];
let total = 0;

basketBtn.addEventListener("click", () => {
  modal.classList.add("active");

  renderBasket();
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

function addToBasket(product) {
  const found = basket.find((i) => i.id === product.id);

  if (found) {
    found.amount++;
  } else {
    basket.push(product);
  }
}

function renderBasket() {
  const cardsHTML = basket
    .map(
      (product) => `
     <div class="item">
            <img src=${product.img} />
            <h3 class="title">${product.title}</h3>
            <h4 class="price">${product.price} &#8378;</h4>
            <p>Miktar: ${product.amount}</p>
            <img onclick="deleteItem(${product.id})" id="delete" src="/images/e-trash.png" />
      </div>
  `
    )
    .join(" ");

  basketList.innerHTML = cardsHTML;

  calculateTotal();
}

function calculateTotal() {
  const sum = basket.reduce((sum, i) => sum + i.price * i.amount, 0);

  const amount = basket.reduce((sum, i) => sum + i.amount, 0);

  totalSpan.innerText = sum;

  totalCount.innerText = amount ;
}

function deleteItem(deleteid) {
  basket = basket.filter((i) => i.id !== deleteid);

  renderBasket();
}

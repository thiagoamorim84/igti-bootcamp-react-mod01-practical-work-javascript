let allProducts;
let products;

//EXEMPLO DO CÓDIGO PARA UM PRODUTO
function productItem(product) {
  let convertedPrice = convertCurrency(product.price);
  let itemDetails = loadDetails(product);

  const item = `<div class="product" data-name="${product.name}" data-brand="${product.brand}" data-type="${product.type}" tabindex="508">
  <figure class="product-figure">
    <img src="${product.image_link}" width="215" height="215" alt="${product.name}" onerror="javascript:this.src='img/unavailable.png'">
  </figure>
  <section class="product-description">
    <h1 class="product-name">${product.name}</h1>
    <div class="product-brands"><span class="product-brand background-brand">${product.brand}</span>
<span class="product-brand background-price">${convertedPrice}</span></div>
  </section>
  ${itemDetails}
</div>`;
  return item;
}

function convertCurrency(value) {
  if (value) {
    return "R$ " + applyFactor(value, 5.5);
  }
  return "R$ 0.00";
}

function applyFactor(value, factor) {
  if (value && factor) {
    return (value * factor).toFixed(2);
  }
  return 0;
}

//EXEMPLO DO CÓDIGO PARA OS DETALHES DE UM PRODUTO
function loadDetails(product) {
  let convertedPrice = convertCurrency(product.price);

  let details = `<section class="product-details">`;

  if (product.brand) {
    details += `
    <div class="details-row">
    <div>Brand</div>
    <div class="details-bar">
      <div class="details-bar-bg" style="width= 250">${product.brand}</div>
    </div>
  </div>`;
  }
  details += `
        <div class="details-row">
        <div>Price</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${convertedPrice}</div>
        </div>
      </div>`;
  if (product.rating) {
    details += `<div class="details-row">
        <div>Rating</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.rating}</div>
        </div>
      </div>`;
  }
  if (product.category) {
    details += `<div class="details-row">
          <div>Category</div>
          <div class="details-bar">
            <div class="details-bar-bg" style="width= 250">${product.category}</div>
          </div>
        </div>`;
  }
  if (product.product_type) {
    details += `<div class="details-row">
          <div>Product_type</div>
          <div class="details-bar">
            <div class="details-bar-bg" style="width= 250">${product.product_type}</div>
          </div>
        </div>`;
  }
  `</section>`;
  return details;
}

const endPoint = "data/products.json";

//const endPoint = "http://makeup-api.herokuapp.com/api/v1/products.json";

function loadAll() {
  let productsPromise = fetch(endPoint);
  productsPromise.then((resp) => {
    resp.json().then((prods) => {
      allProducts = prods;
      products = prods;
      renderTable();

      let brands = products
        .map((item) => item.brand)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort();

      let types = products
        .map((item) => item.product_type)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort();

      let comboBrandsHTML = `<option value="">All</option>`;
      brands.forEach((brand, index) => {
        comboBrandsHTML += `<option value="${brand}">${brand}</option>`;
      });
      document.getElementById("filter-brand").innerHTML = comboBrandsHTML;

      let comboTypesHTML = `<option value="">All</option>`;
      types.forEach((type, index) => {
        comboTypesHTML += `<option value="${type}">${type}</option>`;
      });

      document.getElementById("filter-type").innerHTML = comboTypesHTML;
    });
  });

  document
    .getElementById("filter-name")
    .addEventListener("input", filterWithDelay(filterProducts, 1000));
}

function filterWithDelay(fn, delay) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  };
}

function renderTable() {
  sortProducts();
  let items = products.map((product) => {
    return productItem(product);
  });
  document.getElementById("catalog").innerHTML = `${items.join("")}`;
}

function sortProducts() {
  let sortType = document.getElementById("sort-type").value;
  if (sortType == "Best Rating") {
    products.sort(function (a, b) {
      ratingA = a.rating ? a.rating : 0;
      ratingB = b.rating ? b.rating : 0;
      return ratingA > ratingB ? -1 : ratingA < ratingB ? 1 : 0;
    });
  } else if (sortType == "Price: Low to High") {
    products.sort(function (a, b) {
      precoA = a.price ? +a.price : 0;
      precoB = b.price ? +b.price : 0;
      return precoA < precoB ? -1 : precoA > precoB ? 1 : 0;
    });
  } else if (sortType == "Price: High to Low") {
    products.sort(function (a, b) {
      precoA = a.price ? +a.price : 0;
      precoB = b.price ? +b.price : 0;
      return precoA > precoB ? -1 : precoA < precoB ? 1 : 0;
    });
  } else if (sortType == "A-Z") {
    products.sort(function (a, b) {
      nameA = a.name ? a.name : "";
      nameB = b.name ? b.name : "";
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    });
  } else if (sortType == "Z-A") {
    products.sort(function (a, b) {
      nameA = a.name ? a.name : "";
      nameB = b.name ? b.name : "";
      return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
    });
  }
}

function filterProducts() {
  let selectedBrand = document.getElementById("filter-brand").value;
  let selectedType = document.getElementById("filter-type").value;
  let name = document.getElementById("filter-name").value;

  let prods = allProducts;

  if (name && name.length > 0) {
    prods = prods.filter(
      (item) => item.name.toLowerCase().indexOf(name.toLowerCase()) > -1
    );
  }

  if (selectedBrand && selectedBrand != "Todos") {
    prods = prods.filter((item) => item.brand === selectedBrand);
  }
  if (selectedType && selectedType != "Todos") {
    prods = prods.filter((item) => item.product_type === selectedType);
  }
  products = prods;
  renderTable();
}

loadAll();

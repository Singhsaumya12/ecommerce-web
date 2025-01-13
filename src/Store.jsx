import React, { useState, useContext, useEffect } from "react";
import  UserContext from "./UserContext";
import { BrandsService, CategoriesService, ProductsService } from "./Service";
import Product from "./Product";

function Store() {
  //state
  let [brands, setBrands] = useState([]);
  let [categories, setCategories] = useState([]);
  let [products, setProducts] = useState([]);
  let [productsToShow, setProductsToShow] = useState([]);
  let [search, setSearch] = useState("");
  

  //get user context
  let userContext = useContext(UserContext);
  

  useEffect(() => {
    (async () => {
      try {
        // Get brands from DB
        let brandsResponse = await BrandsService.fetchBrands();
        let brandsResponseBody = await brandsResponse.json();
        brandsResponseBody.forEach((brand) => {
          brand.isChecked = true;
        });
        setBrands(brandsResponseBody);
  
        // Get categories from DB
        let categoriesResponse = await CategoriesService.fetchCategories();
        let categoriesResponseBody = await categoriesResponse.json();
        categoriesResponseBody.forEach((category) => {
          category.isChecked = true;
        });
        setCategories(categoriesResponseBody);
  
        // Get products from DB
        let productsResponse = await fetch(
          `http://localhost:5000/products?productName_like=${search}`,
          { method: "GET" }
        );
  
        if (productsResponse.ok) {
          let productsResponseBody = await productsResponse.json();
  
          // Process products
          productsResponseBody.forEach((product) => {
            // Set brand
            product.brand = BrandsService.getBrandByBrandId(
              brandsResponseBody,
              product.brandId
            );
  
            // Set category
            product.category = CategoriesService.getCategoryByCategoryId(
              categoriesResponseBody,
              product.categoryId
            );
            product.isOrdered = false;
          });
  
          // Update state with filtered products
          setProducts(productsResponseBody);
  
          // Filter products to show based on `search`
          const filteredProducts = productsResponseBody.filter((product) =>
            product.productName.toLowerCase().includes(search.toLowerCase())
          );
  
          setProductsToShow(filteredProducts);
        } else {
          console.error("Failed to fetch products:", productsResponse.statusText);
        }
  
        // Update document title
        document.title = "Store - eCommerce";
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    })();
  }, [search]);
  

 
  //updateBrandIsChecked
  
  let updateBrandIsChecked = (id) => {
    let brandsData = brands.map((brd) => {
      if (brd.id === id) brd.isChecked = !brd.isChecked;

      return brd;
    });
   
    setBrands(brandsData);
   
    updateProductsToShow();
  };

  //updateCategoryIsChecked
  let updateCategoryIsChecked = (id) => {
    let categoryData = categories.map((cat) => {
      if (cat.id == id) cat.isChecked = !cat.isChecked;
      return cat;
    });

    setCategories(categoryData);
    updateProductsToShow();
  };
  

  const updateProductsToShow = () => {
   const selectedBrands = brands.filter(brd => brd.isChecked).map((brd) => parseInt(brd.id));
   const selectedCategories = categories.filter(cat => cat.isChecked).map((cat) => parseInt(cat.id));
    setProductsToShow(
      products
        .filter((prod) => {
          return (
            selectedCategories.includes(prod.categoryId)
          );
        })
        .filter((prod) => {

          return (
            selectedBrands.includes(prod.brandId)
          );
        })
    );
  };

  
  //When the user clicks on Add to Cart function
  let onAddToCartClick = (prod) => {
    (async () => {
      let newOrder = {
        userId: userContext.user.currentUserId,
        productId: prod.id,
        quantity: 1,
        isPaymentCompleted: false,
      };

      let orderResponse = await fetch(`http://localhost:5000/orders`, {
        method: "POST",
        body: JSON.stringify(newOrder),
        headers: { "Content-Type": "application/json" },
      });
      if (orderResponse.ok) {
        //isOrdered = true
        let prods = products.map((p) => {
          if (p.id === prod.id) p.isOrdered = true;
          return p;
        });

        setProducts(prods);
        updateProductsToShow();
      } else {
        console.log(orderResponse);
      }
    })();
  };
  return (
    <div>
      <div className="row py-3 header">
        <div className="col-lg-3">
          <h4>
            <i className="fa fa-shopping-bag"></i> Store{" "}
            <span className="badge badge-secondary">
              {productsToShow.length}
            </span>
          </h4>
        </div>

        <div className="col-lg-9">
          <input
            type="search"
            value={search}
            placeholder="Search"
            className="form-control"
            autoFocus="autofucs"
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-3 py-2">
          <div className="my-2">
            <h5>Brands</h5>
            <ul className="list-group list-group-flush">
              {brands.map((brand) => (
                <li className="list-group-item" key={brand.id}>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      value="true"
                      checked={brand.isChecked}
                      onChange={() => {
                        updateBrandIsChecked(brand.id);
                      }}
                      id={`brand${brand.id}`}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`brand${brand.id}`}
                    >
                      {brand.brandName}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="my-2">
            <h5>Categories</h5>
            <ul className="list-group list-group-flush">
              {categories.map((category) => (
                <li className="list-group-item" key={category.id}>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      value="true"
                      checked={category.isChecked}
                      onChange={() => {
                        updateCategoryIsChecked(category.id);
                      }}
                      id={`category${category.id}`}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`category${category.id}`}
                    >
                      {category.categoryName}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-lg-9 py-2">
          <div className="row">
            {productsToShow.map((prod) => (
              <Product
                key={prod.id}
                product={prod}
                onAddToCartClick={onAddToCartClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Store;

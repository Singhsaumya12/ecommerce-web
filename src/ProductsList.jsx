import React, { useState, useEffect, useMemo } from "react";
import { BrandsService, CategoriesService, SortService, ProductsService } from "./Service";

function ProductsList(props) {
  // State
  let [products, setProducts] = useState([]);
  let [originalProducts, setOriginalProducts] = useState([]);
  let [search, setSearch] = useState("");
  let [sortBy, setSortBy] = useState("productName");
  let [sortOrder, setSortOrder] = useState("ASC");
  let [brands, setBrands] = useState([]);
  let [selectedBrand, setSelectedBrand] = useState("");

  useEffect(() => {
    const fetchDataAndApplyFilters = async () => {
      try {
        // Fetch brands and categories
        const brandsResponse = await BrandsService.fetchBrands();
        const brandsData = await brandsResponse.json();
        setBrands(brandsData); // Fix: Update `brands` state

        const categoriesResponse = await CategoriesService.fetchCategories();
        const categoriesData = await categoriesResponse.json();

        // Fetch products
        const productsResponse = await ProductsService.fetchProducts();
        const productsData = await productsResponse.json();

        // Enrich products with brand and category
        const enrichedProducts = productsData.map((product) => ({
          ...product,
          brand: BrandsService.getBrandByBrandId(brandsData, product.brandId),
          category: CategoriesService.getCategoryByCategoryId(categoriesData, product.categoryId),
        }));

        setOriginalProducts(enrichedProducts); // Store original products
        setProducts(enrichedProducts); // Initial display
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAndApplyFilters();
  }, []); // Run only once on mount

  // Filter products based on search and selected brand
  const filteredProducts = useMemo(() => {
    return originalProducts.filter((product) => {
      const matchesSearch = product.productName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesBrand =
        selectedBrand === "" ||
        (product.brand && product.brand.brandName === selectedBrand);
      return matchesSearch && matchesBrand;
    });
  }, [originalProducts, search, selectedBrand]);

  // Update sorted products when filtering or sorting criteria changes
  useEffect(() => {
    const sortedProducts = SortService.getSortedArray(filteredProducts, sortBy, sortOrder);
    setProducts(sortedProducts);
  }, [filteredProducts, sortBy, sortOrder]);

  // Handle sorting column clicks
  const onSortColumnNameClick = (event, columnName) => {
    event.preventDefault(); // Avoid page refresh
    const newSortOrder = sortBy === columnName && sortOrder === "ASC" ? "DESC" : "ASC";
    setSortBy(columnName);
    setSortOrder(newSortOrder);
  };

  // Render column headers with sorting indicators
  const getColumnHeader = (columnName, displayName) => {
    return (
      <>
        <a
          href="/#"
          onClick={(event) => onSortColumnNameClick(event, columnName)}
        >
          {displayName}
        </a>{" "}
        {sortBy === columnName && sortOrder === "ASC" && (
          <i className="fa fa-sort-up"></i>
        )}
        {sortBy === columnName && sortOrder === "DESC" && (
          <i className="fa fa-sort-down"></i>
        )}
      </>
    );
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="row p-3 header">
          <div className="col-lg-3">
            <h4>
              <i className="fa fa-suitcase"></i> Products{" "}
              <span className="badge badge-secondary">{products.length}</span>
            </h4>
          </div>

          <div className="col-lg-6">
            <input
              type="search"
              value={search}
              placeholder="Search"
              className="form-control"
              autoFocus
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="col-lg-3">
            <select
              className="form-control"
              value={selectedBrand}
              onChange={(event) => setSelectedBrand(event.target.value)}
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option value={brand.brandName} key={brand.id}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="col-lg-10 mx-auto mb-2">
        <div className="card my-2 shadow">
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th>{getColumnHeader("productName", "Product Name")}</th>
                  <th>{getColumnHeader("price", "Price")}</th>
                  <th>{getColumnHeader("brand", "Brand")}</th>
                  <th>{getColumnHeader("category", "Category")}</th>
                  <th>{getColumnHeader("rating", "Rating")}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.productName}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.brand?.brandName || "Unknown Brand"}</td>
                    <td>{product.category?.categoryName || "Unknown Category"}</td>
                    <td>
                      {[...Array(product.rating).keys()].map((n) => (
                        <i className="fa fa-star text-warning" key={n}></i>
                      ))}
                      {[...Array(5 - product.rating).keys()].map((n) => (
                        <i className="fa fa-star-o text-warning" key={n}></i>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsList;

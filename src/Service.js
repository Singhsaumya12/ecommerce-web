const env_Var = process.env.REACT_APP_BackendServerUrl;

export const OrdersService = {
    getPreviousOrders: (orders) => {
      return orders.filter((ord) => ord.isPaymentCompleted === true);
    },
    getCart: (orders) => {
      return orders.filter((ord) => ord.isPaymentCompleted === false);
    },
  };
  
  export const ProductsService = {
    getProductByProductId: (products, productId) => {
      return products.find((prod) => prod.id === String(productId));
    },
    fetchProducts: async () => {
      try {
        const response = await fetch(`${env_Var}/products`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }
        return response;
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
  };
  
  export const BrandsService = {
    fetchBrands: async () => {
      try {
        const response = await fetch(`${env_Var}/brands`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch brands.");
        }
        return response;
      } catch (error) {
        console.error("Error fetching brands:", error);
        throw error;
      }
    },
    getBrandByBrandId: (brands, brandId) => {
      const brand = brands.find((brand) => brand.id === String(brandId));
      return brand || { id: null, brandName: "Unknown Brand" }; // Fallback
    },
  };
  
  export const CategoriesService = {
    fetchCategories: async () => {
      try {
        const response = await fetch(`${env_Var}/categories`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch categories.");
        }
        return response;
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
    },
    getCategoryByCategoryId: (categories, categoryId) => {
      const category = categories.find((category) => category.id === String(categoryId));
      return category || { id: null, categoryName: "Unknown Category" }; // Fallback
    },
  };
  
  export const SortService = {
    getSortedArray: (elements, sortBy, sortOrder) => {
      if (!elements) return elements;
  
      let array = [...elements];
  
      array.sort((a, b) => {
        const valA = a[sortBy] ? a[sortBy].toString().toLowerCase() : "";
        const valB = b[sortBy] ? b[sortBy].toString().toLowerCase() : "";
  
        // Handle numeric and string sorting
        if (!isNaN(valA) && !isNaN(valB)) {
          // Numeric comparison
          return parseFloat(valA) - parseFloat(valB);
        } else {
          // String comparison
          return valA.localeCompare(valB);
        }
      });
  
      if (sortOrder === "DESC") array.reverse();
  
      return array;
    },
  };
  
  
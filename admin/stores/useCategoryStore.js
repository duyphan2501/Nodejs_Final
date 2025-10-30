import { create } from "zustand";

const useCategoryStore = create((set) => {
  const setShoeCategories = (categories) => {
    set({
      shoeCategories: categories,
    });
  };
  const setBackpackCategories = (categories) => {
    set({
      backPackCategories: categories,
    });
  };
  const setSandalCategories = (categories) => {
    set({
      sandalCategories: categories,
    });
  };
  const setSearchTerm = (term) => {
    set({
      searchTerm: term,
    });
  };

  return {
    shoeCategories: [],
    sandalCategories: [],
    backPackCategories: [],
    searchTerm: "",

    setShoeCategories,
    setBackpackCategories,
    setSandalCategories,
    setSearchTerm,
  };
});

export default useCategoryStore;

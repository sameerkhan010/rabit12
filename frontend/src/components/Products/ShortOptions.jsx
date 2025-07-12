import React from "react";
import { useSearchParams } from "react-router-dom";

const ShortOptions = () => {
  const [searchParams , setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    searchParams.set("sortBy", sortBy)
    setSearchParams(searchParams);
  }
  return (
    <div className="mb-4 flex items-center justify-end">
      <select
        name=""
        id="sort"
        value={searchParams.get("sortBy")||""}
        onChange={handleSortChange}
        className="border p-2 rounded-md focus:outline-none"
      >
        <option value="">Default</option>
        <option value="priceAsc">Price : Low to High</option>
        <option value="priceDesc">Price : High to Low</option>
        <option value="popularity">popularity</option>
      </select>
    </div>
  );
};

export default ShortOptions;

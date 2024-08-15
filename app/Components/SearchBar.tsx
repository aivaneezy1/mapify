"use client";
import React, { useState } from "react";

const SearchBar = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [openTab, setOpenTab] = useState<Boolean>(false);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Toggle search bar visibility
  const handleOpenTab = () => {
    setOpenTab(!openTab);
  };

  // Close the search bar
  const handleCloseTab = () => {
    setOpenTab(false);
    setInputValue(""); // Clear the input value when closing
  };

  const handleClearText = () =>{
     setInputValue(""); // Clear the input value when closing
  }

  return (
    <div className="relative flex items-center sm:w-1/2 w-full">
      <input
        id="search-input"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search for a location"
        className="w-full p-3 pl-10 text-gray-700 bg-white border-2 border-black rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black "
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-black"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.9 14.32a8 8 0 111.414-1.414l4.243 4.243-1.415 1.414-4.242-4.243zM8 14a6 6 0 100-12 6 6 0 000 12z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {inputValue && (
        <div 
        onClick={handleClearText}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer border rounded-full border-black p-1 ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="h-4 w-4"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

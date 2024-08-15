"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useState, useEffect } from "react";
import PlaceDetailsComponent from "./PlaceDetails";
const ListComponent = () => {
  // State for selected category and rating
  const [selectedCategory, setSelectedCategory] =
    useState<string>("restaurant");
  const [selectedRating, setSelectedRating] = useState<string>("5");
  const [places, setPlaces] = useState<string>("");
  // Categories array
  const categories = [
    {
      value: "",
      label: "Select Category",
    },

    {
      value: "restaurant",
      label: "Restaurant",
    },
    {
      value: "hotel",
      label: "Hotel",
    },
    {
      value: "parking",
      label: "Parking",
    },
    {
      value: "attraction",
      label: "Attraction",
    },
  ];

  // Ratings array
  const ratings = [
    {
      value: "",
      label: "Select Rating",
    },
    {
      value: "1",
      label: "1  ⭐",
    },
    {
      value: "2",
      label: "2  ⭐⭐",
    },
    {
      value: "3",
      label: "3  ⭐⭐⭐",
    },
    {
      value: "4",
      label: "4  ⭐⭐⭐⭐",
    },
    {
      value: "5",
      label: "5  ⭐⭐⭐⭐⭐",
    },
  ];

  // GET data from places
  useEffect(() => {
    const handleGetData = async () => {
      try {
        const res = await fetch("/api/restaurantData");
        const data = await res.json();
        if (res.ok) {
          setPlaces(data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    //handleGetData();
  }, []);
  
  console.log("places", places)
  // Handle changes to category selection
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(event.target.value);
  };

  // Handle changes to rating selection
  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRating(event.target.value);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold whitespace-normal">
        Find Restaurants, Hotels, Parking & Attractions.
      </h2>

      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <div className="mt-5">
          {/* Category Dropdown */}
          <TextField
            id="outlined-select-category"
            select
            label="Select Category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            helperText={`Selected: ${
              categories.find((cat) => cat.value === selectedCategory)?.label
            }`}
          >
            {categories.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Rating Dropdown */}
          <TextField
            id="outlined-select-rating"
            select
            label="Select Rating"
            value={selectedRating}
            onChange={handleRatingChange}
            helperText={`Selected: ${
              ratings.find((rate) => rate.value === selectedRating)?.label
            }`}
          >
            {ratings.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>

        {/*Calling the palceDetails */}
      </Box>
    </div>
  );
};

export default ListComponent;

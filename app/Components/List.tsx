"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import PlaceDetailsComponent from "./PlaceDetails";
import Image from "next/image";
import { PlaceType } from "./RenderMap";
import Loading from "@/utils/Loading";
interface ListComponentProp {
  places: PlaceType[] | null;
  loading: Boolean;
  setLoading: React.Dispatch<React.SetStateAction<Boolean>>;
}

const ListComponent = ({ places, loading, setLoading }: ListComponentProp) => {
  // State for selected category and rating
  const [selectedCategory, setSelectedCategory] =
    useState<string>("restaurant");
  const [selectedRating, setSelectedRating] = useState<string>("5");
  const [selectedRadius, setSelectedRadius] = useState<string>("0");
  const [timeoutReached, setTimeoutReached] = useState<boolean>(false);
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

  const radius = [
    {
      value: "",
      label: "Select a radius",
    },
    {
      value: "500",
      label: "0.5 km",
    },
    {
      value: "1000",
      label: "1 km",
    },
    {
      value: "2000",
      label: "2 km",
    },
    {
      value: "5000",
      label: "5 km",
    },
    {
      value: "10000",
      label: "10 km",
    },
  ];

  // Handle changes to category selection
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(event.target.value);
  };

  // Handle changes to rating selection
  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRating(event.target.value);
  };

  // Handle changes to radius selection
  const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRadius(event.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [places]);

  return (
    <div className="">
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

        <TextField
          id="outlined-select-radius"
          select
          label="Select Radius"
          value={selectedRadius}
          onChange={handleRadiusChange}
          helperText={`Selected: ${
            radius.find((r) => r.value === selectedRadius)?.label
          }`}
        >
          {radius.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {/*Calling the palceDetails */}

        {/* Calling the placeDetails */}
        {!loading ? (
          <div className="flex justify-center h-screen items-center">
            <Loading />
          </div>
        ) : places && places.length > 0 ? (
          places.map((item, index) => (
            <div key={index} className="flex gap-10">
              <PlaceDetailsComponent
                name={item.name}
                address={item.address}
                rating={item.rating}
                pictures={item.pictures}
              />
            </div>
          ))
        ) : (
          <h2 className="h-screen flex justify-center items-center text-2xl font-bold">
            No data Found  😔
          </h2>
        )}
      </Box>
    </div>
  );
};

export default ListComponent;

"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import {
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
  useContext,
} from "react";
import PlaceDetailsComponent from "./PlaceDetails";
import Image from "next/image";
import { PlaceType } from "@/types";
import Loading from "@/utils/Loading";
import { DataContext } from "../context/Provider";

interface ListComponentProp {
  places: PlaceType[] | null;
  loading: Boolean;
  setLoading: React.Dispatch<React.SetStateAction<Boolean>>;
}

const ListComponent = ({ places, loading, setLoading }: ListComponentProp) => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedRating,
    setSelectedRating,
    selectedRadius,
    setSelectedRadius,
  } = useContext(DataContext);

  const categories = [
    { value: "", label: "Select Category" },
    { value: "4d4b7105d754a06374d81259", label: "Restaurant" },
    { value: "4bf58dd8d48988d1fa931735", label: "Hotel" },
    { value: "4c38df4de52ce0d596b336e1", label: "Parking" },
    { value: "5109983191d435c0d71c2bb1", label: "Attraction" },
    { value: "4bf58dd8d48988d11f941735", label: "Night Club" },
  ];

  // Ratings array
  const ratings = [
    { value: "", label: "Select Rating" },
    { value: "1", label: "1  ⭐" },
    { value: "2", label: "2  ⭐⭐" },
    { value: "3", label: "3  ⭐⭐⭐" },
    { value: "4", label: "4  ⭐⭐⭐⭐" },
    { value: "5", label: "5  ⭐⭐⭐⭐⭐" },
  ];

  const radius = [
    { value: "", label: "Select a radius" },
    { value: "500", label: "0.5 km" },
    { value: "1000", label: "1 km" },
    { value: "2000", label: "2 km" },
    { value: "5000", label: "5 km" },
    { value: "10000", label: "10 km" },
  ];

  // Handle changes to category selection
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;

    switch (selectedValue) {
      case "4d4b7105d754a06374d81259":
        setSelectedCategory("4d4b7105d754a06374d81259");
        break;

      case "4bf58dd8d48988d1fa931735":
        setSelectedCategory("4bf58dd8d48988d1fa931735");
        break;

      case "4c38df4de52ce0d596b336e1":
        setSelectedCategory("4c38df4de52ce0d596b336e1");
        break;

      case "5109983191d435c0d71c2bb1":
        setSelectedCategory("5109983191d435c0d71c2bb1");
        break;

      case "4bf58dd8d48988d11f941735":
        setSelectedCategory("4bf58dd8d48988d11f941735");
        break;

      default:
        setSelectedCategory("");
        break;
    }
  };

  // Handle changes to rating selection
  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;

    switch (selectedValue) {
      case "1":
        setSelectedRating("1");
        break;

      case "2":
        setSelectedRating("2");
        break;

      case "3":
        setSelectedRating("3");
        break;

      case "4":
        setSelectedRating("4");
        break;

      case "5":
        setSelectedRating("5");
        break;

      default:
        setSelectedRating("");
        break;
    }
  };

  // Handle changes to radius selection
  const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;

    switch (selectedValue) {
      case "500":
        setSelectedRadius("500");
        break;

      case "1000":
        setSelectedRadius("1000");
        break;

      case "2000":
        setSelectedRadius("2000");
        break;

      case "5000":
        setSelectedRadius("5000");
        break;

      case "10000":
        setSelectedRadius("10000");
        break;

      default:
        setSelectedRadius("");
        break;
    }
  };

  // Timer incase theres no data found after 10 secs.
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [places]);

  console.log("category", selectedCategory);
  console.log("rating", selectedRating);
  console.log("radius", selectedRadius);

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

        {/* Radius Dropdown */}
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
            No data Found 😔
          </h2>
        )}
      </Box>
    </div>
  );
};

export default ListComponent;

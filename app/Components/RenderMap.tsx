"use client";
import React, { useContext, useEffect, useState } from "react";
import ListComponent from "./List";
import MapComponent from "./Map";
import SearchBar from "./SearchBar";
import { DataContext } from "../context/Provider";
import { handleGetData } from "../api/restaurantData/route";
import { PlaceType } from "@/types";



const RenderMap = () => {
  const [places, setPlaces] = useState<PlaceType[] | null>(null)
  const [loading, setLoading] = useState<Boolean>(false)
  const { coordinates } = useContext(DataContext);
  const lat = coordinates.lat.toString();
  const lng = coordinates.lng.toString();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await handleGetData({
          lat: lat,
          long: lng,
          radius: 2000,
          categories: "4d4b7105d754a06374d81259",
        });
        const data = await res.json();
        setPlaces(data)
        setLoading(true);
      ;
        
      } catch (err) {
        console.log(err);
      }
    };
    getData()

    // call the function when the coordinates change.
  }, [coordinates]);

  return (
    <>
      
      <div className="flex justify-center items-center p-4 w-full">
        <SearchBar />
      </div>
      <div className="w-full h-full flex justify-between">
        {/* Container for the ListComponent with a scrollbar on the left */}
        <div className="w-2/3 h-full overflow-y-auto scrollbar-right">
          <ListComponent places={places} loading={loading} setLoading={setLoading} />
        </div>

        {/* Container for the MapComponent */}
        <div className="sm:w-full w-1/2">
          <MapComponent places={places}/>
        </div>
      </div>
    </>
  );
};

export default RenderMap;

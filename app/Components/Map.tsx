// src/Map.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const apiKey: string | undefined = process.env.NEXT_PUBLIC_MAPS_API_KEY;

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: apiKey as string,
        version: "weekly",
        libraries: ["places"],
      });

      const { Map } = await loader.importLibrary("maps");
      const { AdvancedMarkerElement } = (await loader.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;
      const { Autocomplete } = await loader.importLibrary("places");

      // Default location (fallback)
      const defaultLocation = {
        lat: 41.8719,
        lng: 12.5674,
      };

      // Map options
      const options: google.maps.MapOptions = {
        center: defaultLocation,
        zoom: 15,
        mapId: "NEXT_MAP_LOCATION",
      };

      // Initialize the map
      const mapInstance = new Map(mapRef.current as HTMLDivElement, options);
      setMap(mapInstance);

      // Initialize the marker
      let markerInstance = new AdvancedMarkerElement({
        map: mapInstance,
        position: defaultLocation,
      });
      setMarker(markerInstance);

      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position) =>{
          const userLocation = {
            lat : position.coords.latitude,
            lng : position.coords.longitude
          };

          mapInstance.setCenter(userLocation);
          mapInstance.setZoom(15);

          markerInstance.position = userLocation
        },
        () =>{
           console.error("User denied Geolocation");
        }
        )


      }else {
         console.error("Geolocation is not supported by this browser.");
      }

      // Initialize the Autocomplete functionality
      const autocomplete = new Autocomplete(
        document.getElementById("search-input") as HTMLInputElement,
        {
          types: ["geocode"],
        }
      );

      // Event listener when a place is selected from the search suggestions
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (place.geometry && place.geometry.location) {
          const newLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          // Update the map center and marker position
          mapInstance.setCenter(newLocation);
          mapInstance.setZoom(15);

          markerInstance.position = newLocation;
        }
      });
    };

    initMap();
  }, []);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Handle form submit
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Trigger autocomplete or map update based on the input value
    // Example: Here you might use Geocoding API to convert the input to lat/lng
    console.log("Search value:", inputValue);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100">
      <form onSubmit={handleSearch} className="w-full max-w-md mb-4">
        <input
          id="search-input"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search for a location"
          className="w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full mt-2 p-3 text-white bg-blue-500 border border-blue-500 rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700"
        >
          Search
        </button>
      </form>
      <div
        className="w-full h-[600px] max-w-4xl rounded-lg shadow-lg overflow-hidden"
        ref={mapRef}
      >
        {/* The map will render here */}
      </div>
    </div>
  );
};

export default MapComponent;

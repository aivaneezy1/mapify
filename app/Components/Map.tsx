// src/Map.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import SearchBar from "./SearchBar";
const apiKey: string | undefined = process.env.NEXT_PUBLIC_MAPS_API_KEY;

const MapComponent = () => {
  // Longitude – the vertical lines
  // Latitude - the orizzontal lines
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);

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

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            mapInstance.setCenter(userLocation);
            mapInstance.setZoom(15);

            markerInstance.position = userLocation;
          },
          () => {
            console.error("User denied Geolocation");
          }
        );
      } else {
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

      // Function to get the map bounds and coordinates
      const getMapBounds = () => {
        const bounds = mapInstance.getBounds();
        if (bounds) {
          const ne = bounds.getNorthEast(); // Top-right coordinates
          const sw = bounds.getSouthWest(); // Bottom-left coordinates

          const tr_latitude = ne.lat();
          const tr_longitude = ne.lng();
          const bl_latitude = sw.lat();
          const bl_longitude = sw.lng();
          console.log(
            `bl_latitude=${bl_latitude}&bl_longitude=${bl_longitude}&tr_latitude=${tr_latitude}&tr_longitude=${tr_longitude}`
          );
          return {
            bl_latitude: bl_latitude,
            bl_longitude: bl_longitude,
            tr_latitude: tr_latitude,
            tr_longitude: tr_longitude,
          };
        }
        return null;
      };

      mapInstance.addListener("bounds_changed", () => {
        const bounds = getMapBounds();
        if (bounds) {
          // Use the bounds to make API requests or update your UI
          console.log(bounds);
        }
      });
    };


    initMap();
  }, []);

  // Handle form submit
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Trigger autocomplete or map update based on the input value
    // Example: Here you might use Geocoding API to convert the input to lat/lng
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-screen"
      ref={mapRef}
    >
      <form
        onSubmit={handleSearch}
        className="w-full max-w-md mb-6 p-4 bg-white rounded-lg shadow-lg"
      ></form>
    </div>
  );
};

export default MapComponent;

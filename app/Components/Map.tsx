// src/Map.tsx
"use client";
import React, { useState, useEffect, useRef,useContext } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import SearchBar from "./SearchBar";
import { DataContext } from "../context/Provider";

const apiKey: string | undefined = process.env.NEXT_PUBLIC_MAPS_API_KEY;
const MapComponent = () => {
  // Longitude – the vertical lines
  // Latitude - the orizzontal lines

  const {coordinates, setCoordinates} = useContext(DataContext)

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

      // Event listener when a user click a map to put a market
      mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const clickedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };
          // Update new marker position
          markerInstance.position = clickedLocation;
          // Update coordinates
          setCoordinates(clickedLocation);
        }
      });

      // User current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            mapInstance.setCenter(userLocation);
            mapInstance.setZoom(15);
            // Update market to the user current location
            markerInstance.position = userLocation;
            // Update coordinate to the user current location
            setCoordinates(userLocation);
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

          // Update the map center, marker position and coordinates
          mapInstance.setCenter(newLocation);
          mapInstance.setZoom(15);
          setCoordinates({
            lat: newLocation.lat,
            lng: newLocation.lng,
          });

          markerInstance.position = newLocation;
        }
      });

    //   // Function to geocode an address(address ---- > latitude and longitude))
    //   const geocodeAddresses = (
    //     addresses: string[],
    //     mapInstance: google.maps.Map
    //   ) => {
    //     const geocoder = new google.maps.Geocoder();

    //     addresses.forEach((address) => {
    //       // Geocode takes 2 paramaters(address, callbackFunc)
    //       geocoder.geocode({ address: address }, (results, status) => {
    //         if (
    //           status === google.maps.GeocoderStatus.OK &&
    //           results &&
    //           results[0]
    //         ) {
    //           const location = results[0].geometry.location;

    //           // Create and set a marker on the map for this location
    //           new google.maps.marker.AdvancedMarkerElement({
    //             map: mapInstance,
    //             position: location,
    //           });
    //         } else {
    //           console.error("Geocode failed: " + status);
    //         }
    //       });
    //     });
    //   };

    //   // Example usage with multiple addresses
    //   const addresses: string[] = [
    //     "Piazza Giuseppe Garibaldi 11, 56126 Pisa Toscana",
    //     "Via delle Case Dipinte 6, 56127 Pisa Toscana",
    //     "Via Santa Maria 30, 56126 Pisa Toscana",
    //   ];
    //   geocodeAddresses(addresses, mapInstance);

    
     };

    initMap();
  }, []);

  // useEffect(() => {
  //   console.log("coordinates updated:", coordinates);
  // }, [coordinates]);

  // Handle form submit
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

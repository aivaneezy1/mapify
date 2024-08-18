"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import SearchBar from "./SearchBar";
import { DataContext } from "../context/Provider";

const apiKey: string | undefined = process.env.NEXT_PUBLIC_MAPS_API_KEY;

import { PlaceType } from "@/types";

interface MapProps {
  places: PlaceType[] | null;
}

const MapComponent = ({ places }: MapProps) => {
  const { coordinates, setCoordinates } = useContext(DataContext);

  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(
    null
  );

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

      const defaultLocation = {
        lat: 41.8719,
        lng: 12.5674,
      };

      const options: google.maps.MapOptions = {
        center: defaultLocation,
        zoom: 15,
        mapId: "NEXT_MAP_LOCATION",
      };

      const mapInstance = new Map(mapRef.current as HTMLDivElement, options);
      setMap(mapInstance);

      let markerInstance = new google.maps.Marker({
        map: mapInstance,
        position: defaultLocation,
        icon: {
          url: "https://aivan-image.s3.eu-north-1.amazonaws.com/mapImage/man.png", 
           scaledSize: new google.maps.Size(50, 50),
        },
      });
      setMarker(markerInstance);

      const infoWindowInstance = new google.maps.InfoWindow({
        content:
          "<div style='font-size: 16px; color: black;'>Current Position</div>",
      });
      setInfoWindow(infoWindowInstance);

      // Show the info window above the marker
      infoWindowInstance.open({
        anchor: markerInstance,
        map: mapInstance,
        shouldFocus: false,
      });

      mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const clickedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };
          markerInstance.setPosition(clickedLocation);
          setCoordinates(clickedLocation);

          // Update the info window position
          infoWindowInstance.open({
            anchor: markerInstance,
            map: mapInstance,
            shouldFocus: false,
          });
        }
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            mapInstance.setCenter(userLocation);
            mapInstance.setZoom(15);
            markerInstance.setPosition(userLocation);
            setCoordinates(userLocation);

            // Update the info window position for the new marker position
            infoWindowInstance.open({
              anchor: markerInstance,
              map: mapInstance,
              shouldFocus: false,
            });
          },
          () => {
            console.error("User denied Geolocation");
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }

      const autocomplete = new Autocomplete(
        document.getElementById("search-input") as HTMLInputElement,
        {
          types: ["geocode"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (place.geometry && place.geometry.location) {
          const newLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          mapInstance.setCenter(newLocation);
          mapInstance.setZoom(15);
          setCoordinates({
            lat: newLocation.lat,
            lng: newLocation.lng,
          });

          markerInstance.setPosition(newLocation);

          // Update the info window position
          infoWindowInstance.open({
            anchor: markerInstance,
            map: mapInstance,
            shouldFocus: false,
          });
        }
      });
    };

    initMap();
  }, []);

  const geocodeAddresses = (
    places: PlaceType[],
    mapInstance: google.maps.Map
  ) => {
    const geocoder = new google.maps.Geocoder();

    if (places && places.length > 0) {
      places.forEach((place, index) => {
        geocoder.geocode({ address: place.address }, (results, status) => {
          if (
            status === google.maps.GeocoderStatus.OK &&
            results &&
            results[0]
          ) {
            const location = results[0].geometry.location;

            // Create a custom info window with the place details
            const infoWindowContent = `
             <div style="display: flex; flex-direction: column; align-items: center; max-width: 250px; background-color: #f9f9f9; padding: 15px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
  <h3 style="font-size: 1.2em; color: #333; margin-bottom: 10px; text-align: center; font-weight:bold;">${place.name}</h3>

  <img src="${place.pictures[0]}" alt="Restaurant Image" style="width: 80%; height: auto; object-fit: cover; border-radius: 10px; margin-bottom: 10px; border: 1px solid #ddd;" />

  <p style="font-size: 1em; color: #666; margin: 0;">Rating: 
    <span style="color: #ff9800; font-weight: bold;">${place.rating}</span>
  </p>
</div>

            `;

            const infoWindow = new google.maps.InfoWindow({
              content: infoWindowContent,
            });

            const marker = new google.maps.Marker({
              map: mapInstance,
              position: location,
              icon: {
                url: "https://aivan-image.s3.eu-north-1.amazonaws.com/mapImage/restaurant.png",
                scaledSize: new google.maps.Size(40, 40), // Resize the icon to 40x40 pixels
              },
            });

            // Add a click listener to open the info window when the marker is clicked
            marker.addListener("click", () => {
              infoWindow.open(mapInstance, marker);
            });
          } else {
            console.error("Geocode failed: " + status);
          }
        });
      });
    }
  };

  useEffect(() => {
    if (places && map) {
      geocodeAddresses(places, map);
    }
  }, [places, map]);

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-screen"
      ref={mapRef}
    >
      <form
        onSubmit={(event) => event.preventDefault()}
        className="w-full max-w-md mb-6 p-4 bg-white rounded-lg shadow-lg"
      ></form>
    </div>
  );
};

export default MapComponent;

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

      let markerInstance = new AdvancedMarkerElement({
        map: mapInstance,
        position: defaultLocation,
      });
      setMarker(markerInstance);

      mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const clickedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };
          markerInstance.position = clickedLocation;
          setCoordinates(clickedLocation);
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
            markerInstance.position = userLocation;
            setCoordinates(userLocation);
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

          markerInstance.position = newLocation;
        }
      });
    };

    initMap();
  }, []);

  // Geocode the addresses and place markers on the map
  const geocodeAddresses = (
    addresses: string[], 
    mapInstance: google.maps.Map
  ) => {
    const geocoder = new google.maps.Geocoder();

    if (addresses && addresses.length > 0) {
      addresses.forEach((address) => {
        geocoder.geocode({ address: address }, (results, status) => {
          if (
            status === google.maps.GeocoderStatus.OK &&
            results &&
            results[0]
          ) {
            const location = results[0].geometry.location;

            new google.maps.marker.AdvancedMarkerElement({
              map: mapInstance,
              position: location,
            });
          } else {
            console.error("Geocode failed: " + status);
          }
        });
      });
    }
  };

  // Watch for changes to places and update the markers
  useEffect(() => {
    if (places && map) {
      const addresses = places.map((place) => place.address);
      geocodeAddresses(addresses, map);
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

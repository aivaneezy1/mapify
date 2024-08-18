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
  const { coordinates, setCoordinates, selectedCategory } =
    useContext(DataContext);

  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(
    null
  );
  const mapLibraries = useRef<{
    AdvancedMarkerElement: any;
    Autocomplete: any;
  } | null>(null);

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

      // USING ref
      mapLibraries.current = { AdvancedMarkerElement, Autocomplete };

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
        content: document.createElement("div"), // A div is used as a custom marker element
      });

      const customMarkerContent = document.createElement("div");
      customMarkerContent.style.width = "50px";
      customMarkerContent.style.height = "50px";
      customMarkerContent.style.backgroundImage =
        "url('https://aivan-image.s3.eu-north-1.amazonaws.com/mapImage/man.png')";
      customMarkerContent.style.backgroundSize = "contain";
      customMarkerContent.style.backgroundRepeat = "no-repeat";

      markerInstance.content = customMarkerContent;
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
          markerInstance.position = clickedLocation;
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
            markerInstance.position = userLocation;
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

          markerInstance.position = newLocation;

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

  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
  const customIcons = () => {
    let url: string = "";

    switch (selectedCategory) {
      // Restaurant
      case "4d4b7105d754a06374d81259":
        url =
          "https://aivan-image.s3.eu-north-1.amazonaws.com/mapImage/restaurant.png";
        break;

      // Hotel
      case "4bf58dd8d48988d1fa931735":
        url =
          "https://aivan-image.s3.eu-north-1.amazonaws.com/mapImage/hotel.png";
        break;

      // Parking
      case "4c38df4de52ce0d596b336e1":
        url =
          "https://aivan-image.s3.eu-north-1.amazonaws.com/mapImage/placeholder.png";
        break;

      // Attraction
      case "5109983191d435c0d71c2bb1":
        url =
          "https://aivan-image.s3.eu-north-1.amazonaws.com/mapImage/park.png";
        break;

      // Night Club
      case "4bf58dd8d48988d11f941735":
        url =
          "https://aivan-image.s3.eu-north-1.amazonaws.com/mapImage/location.png";
        break;

      default:
        url = "";
        break;
    }
    console.log("selected", selectedCategory);
    return url;
  };

  const geocodeAddresses = (
    places: PlaceType[],
    mapInstance: google.maps.Map
  ) => {
    if (mapLibraries.current && mapLibraries.current.AdvancedMarkerElement) {
      const { AdvancedMarkerElement } = mapLibraries.current;
      const geocoder = new google.maps.Geocoder();

      // Clear previous markers
    if (markers.length > 0) {
      // .map on which to display the marker.
      markers.forEach((marker) => marker.map = null); // Remove the marker from the map
      setMarkers([]);
    }
      
    
      if (places && places.length > 0) {
        places.forEach((place, index) => {
          geocoder.geocode({ address: place.address }, (results, status) => {
            if (
              status === google.maps.GeocoderStatus.OK &&
              results &&
              results[0]
            ) {
              const location = results[0].geometry.location;
              const infoWindowContent = `
              <div style="display: flex; flex-direction: column; align-items: center; max-width: 250px; background-color: #f9f9f9; padding: 15px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <h3 style="font-size: 1.2em; color: #333; margin-bottom: 10px; text-align: center; font-weight:bold;">${place.name}</h3>
                <img src="${place.pictures[0]}" alt="Restaurant Image" style="width: 80%; height: auto; object-fit: cover; border-radius: 10px; margin-bottom: 10px; border: 1px solid #ddd;" />
                <p style="font-size: 1em; color: #666; margin: 0;">Rating: <span style="color: #ff9800; font-weight: bold;">${place.rating}</span></p>
              </div>
            `;

              const infoWindow = new google.maps.InfoWindow({
                content: infoWindowContent,
              });

              const customMarkerContent = document.createElement("div");
              customMarkerContent.style.width = "40px";
              customMarkerContent.style.height = "40px";
              customMarkerContent.style.backgroundImage = `url(${customIcons()})`;
              customMarkerContent.style.backgroundSize = "contain";
              customMarkerContent.style.backgroundRepeat = "no-repeat";
              customMarkerContent.style.transform = "translate(-50%, -100%)";

              const marker = new AdvancedMarkerElement({
                map: mapInstance,
                position: location,
                content: customMarkerContent,
              });

              // Update the markers state
              setMarkers((prevMarkers) => [...prevMarkers, marker]);

              marker.addListener("click", () => {
                infoWindow.open(mapInstance, marker);
              });
            } else {
              console.error("Geocode failed: " + status);
            }
          });
        });
      }
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

import PlaceDetailsComponent from "@/app/Components/PlaceDetails";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

type handleApiProps = {
  lat: string;
  long: string;
  radius: number;
  categories: string;
};

// Define TypeScript interfaces for place data


interface Geocode {
  latitude: number;
  longitude: number;
}

interface Geocodes {
  main: Geocode;
}


interface Location {
  formatted_address?: string;
}

interface Photo {
  prefix: string;
  suffix: string;
}

interface Place {
  name: string;
  rating?: number;
  geocodes?: Geocodes; // Add this line
  location?: Location;
  photos?: Photo[];
}

interface SearchResult {
  results: Place[];
}

// Define TypeScript interfaces for the formatted response
interface FormattedPlace {
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  rating: string;
  pictures: string[];
}

const API_KEY: string | undefined = process.env.NEXT_PUBLIC_FOURSQAURE_API_KEY

export const handleGetData = async ({
  lat,
  long,
  radius,
  categories,
}: handleApiProps) => {

   if (!API_KEY) {
    throw new Error("API_KEY is not defined");
  }


  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: API_KEY,
    },
  };

  try {
    // Specify the fields you want to return in the response
    const fields = "name,rating,location,photos";

    // Include the fields parameter in the API request
    const res = await fetch(
      `https://api.foursquare.com/v3/places/search?ll=${lat},${long}&radius=${radius}&categories=${categories}&fields=${fields}`,
      options
    );
    const result: SearchResult = await res.json(); // Parse the response as JSON and use the SearchResult type
  
    // Extract only the necessary information
    const formattedPlaces: FormattedPlace[] = result.results.map((place) => ({
      name: place.name,
      address: place.location?.formatted_address || "No address available",
      rating: place.rating ? place.rating.toString() : "No rating available",
      pictures: place.photos
        ? place.photos.map((photo) => `${photo.prefix}original${photo.suffix}`)
        : [],
      lat: place.geocodes?.main.latitude || 0,
      lng: place.geocodes?.main.longitude || 0,
    }));

    if (Array.isArray(formattedPlaces)) {
      return NextResponse.json(formattedPlaces, { status: 200 });
    } else {
      // If the data is not an array, return an empty array or handle as needed
      return NextResponse.json([], { status: 200 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

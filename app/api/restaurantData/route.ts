import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

type handleApiProps = {
  lat: string;
  long: string;
  radius: number;
  categories: string;
};

// Define TypeScript interfaces for place data
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
  rating: string;
  pictures: string[];
}

export const GET = async ({lat,long,radius,categories}: handleApiProps) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "fsq3QLwaaaOEJE3+jK9EjRMJb6uv7AM/T/kzqaXyRszIs+Q=", 
    },
  };

  try {
    // Specify the fields you want to return in the response
    const fields = "name,rating,location,photos";

    // Include the fields parameter in the API request
    const res = await fetch(
      `https://api.foursquare.com/v3/places/search?ll=43.7085,10.3987&radius=2000&categories=4d4b7105d754a06374d81259&fields=${fields}`,
      options
    );
    const result: SearchResult = await res.json(); // Parse the response as JSON and use the SearchResult type

    // Extract only the necessary information
    const formattedPlaces: FormattedPlace[] = result.results.map(place => ({
      name: place.name,
      address: place.location?.formatted_address || "No address available",
      rating: place.rating ? place.rating.toString() : "No rating available",
      pictures: place.photos ? place.photos.map(photo => `${photo.prefix}original${photo.suffix}`) : []
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
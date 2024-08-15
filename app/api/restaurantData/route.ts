import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const url =
    "https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary?bl_latitude=11.847676&tr_latitude=12.838442&bl_longitude=109.095887&tr_longitude=109.149359&lang=en_US";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "9fb2021882msh171e8240522b6d4p1ba2b0jsnf7b0f2d14298",
      "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json(); // Parse the response as JSON

    // Assuming `result.data` contains an array of restaurant objects
    // Adjust this based on the actual structure of the API response
    const restaurantsArray = result.data;

    if (Array.isArray(restaurantsArray)) {
      return NextResponse.json(restaurantsArray, { status: 200 });
    } else {
      // If the data is not an array, return an empty array or handle as needed
      return NextResponse.json([], { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

"use client";
import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type CoordinatesType = {
  lat: number;
  lng: number;
};

interface DatiContextType {
  coordinates: CoordinatesType;
  setCoordinates: Dispatch<SetStateAction<CoordinatesType>>;
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
  selectedRating: string;
  setSelectedRating: Dispatch<SetStateAction<string>>;
  selectedRadius: string;
  setSelectedRadius: Dispatch<SetStateAction<string>>;
}

// Set default values for the context
const defaultContextValue: DatiContextType = {
  coordinates: {
    lat: 0,
    lng: 0,
  },
  setCoordinates: () => {
    throw new Error("setCoordinates function must be overridden");
  },
  selectedCategory: "",
  setSelectedCategory: () => {
    throw new Error("setSelectedCategory function must be overridden");
  },
  selectedRating: "",
  setSelectedRating: () => {
    throw new Error("setSelectedRating function must be overridden");
  },
  selectedRadius: "",
  setSelectedRadius: () => {
    throw new Error("setSelectedRadius function must be overridden");
  },
};

export const DataContext = createContext<DatiContextType>(defaultContextValue);

const DataContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [coordinates, setCoordinates] = useState<CoordinatesType>({
    lat: 0,
    lng: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [selectedRadius, setSelectedRadius] = useState<string>("");

  return (
    <DataContext.Provider
      value={{
        coordinates,
        setCoordinates,
        selectedCategory,
        setSelectedCategory,
        selectedRating,
        setSelectedRating,
        selectedRadius,
        setSelectedRadius,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;

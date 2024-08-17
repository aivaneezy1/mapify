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
}

// Set default values for the context
const defaultContextValue: DatiContextType = {
  coordinates: {
    lat: 0,
    lng: 0,
  },
  setCoordinates: () => {},
};

export const DataContext = createContext<DatiContextType>(defaultContextValue);

const DataContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [coordinates, setCoordinates] = useState<CoordinatesType>({
    lat: 0,
    lng: 0,
  });

  return (
    <DataContext.Provider value={{ coordinates, setCoordinates }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;

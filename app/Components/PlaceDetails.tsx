import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";

type PlaceDetailsProps = {
  name: string;
  address: string;
  rating: string;
  pictures: string[];
};

const PlaceDetailsComponent = ({
  name,
  address,
  rating,
  pictures,
}: PlaceDetailsProps) => {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [current, setCurrent] = useState<number>(1);
  const [count, setCount] = useState<number>(pictures.length);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6 bg-yellow-100 rounded-lg shadow-lg w-full sm:max-w-sm sm:ml-20 relative mt-5 mb-5">
      <Carousel setApi={setApi} className="w-full max-w-xs">
      {pictures.length > 0 ? (
        <CarouselContent>
          {pictures.map((src, index) => (
            <CarouselItem key={index}>
              <Card className="border border-black overflow-hidden w-full h-64">
                {" "}
                {/* Set a fixed height for the card */}
                <CardContent className="relative w-full h-full p-0  bg-white">
                  <Image
                    src={src}
                    alt={`Picture ${index + 1} of ${name}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg w-full h-full"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      ) : <h2 className="text-center">No Media Avaibleable</h2>}
        
        <div
          onClick={(e) => e.preventDefault()}
          className="absolute left-0 top-1/2 transform -translate-y-1/2"
        >
          <CarouselPrevious className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-200 transition duration-200" />
        </div>
        <div
          onClick={(e) => e.preventDefault()}
          className="absolute right-0 top-1/2 transform -translate-y-1/2"
        >
          <CarouselNext className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-200 transition duration-200" />
        </div>
      </Carousel>
      <div className="py-2 text-center text-sm text-gray-500">
        Slide {current} of {count}
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
        <h2 className="text-sm text-gray-600">{address}</h2>
        <h2 className="text-sm text-gray-600"><span className="font-semibold">Rating:</span> {rating}</h2>
      </div>
    </div>
  );
};

export default PlaceDetailsComponent;

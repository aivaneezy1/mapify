import React from 'react'

type PlaceDetailsProps = {
    placeName:string,
    placeRating: string
}

const PlaceDetailsComponent = ({placeName, placeRating}: PlaceDetailsProps) => {
  return (
    <div>
      <h2>{placeName}</h2>
       <h2>{placeRating}</h2>
    </div>
  )
}

export default PlaceDetailsComponent

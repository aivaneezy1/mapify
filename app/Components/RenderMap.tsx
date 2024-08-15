import React from 'react'
import ListComponent from './List'
import MapComponent from './Map'
import SearchBar from './SearchBar'

const RenderMap = () => {
  return (
    <>
      <div className='flex justify-center items-center p-4 w-full'>
        <SearchBar />
      </div>
      <div className='w-full h-full flex justify-between'>
        
        {/* Container for the ListComponent with a scrollbar on the left */}
        <div className='w-1/2 h-full overflow-y-auto scrollbar-right'>
          <ListComponent />
        </div>
        
        {/* Container for the MapComponent */}
        <div className='w-1/2'>
          <MapComponent />
        </div>
      </div>
    </>
  )
}

export default RenderMap

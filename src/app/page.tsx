import Navbar from '@/components/Navbar'
import React from 'react'
import { Vortex } from "@/components/ui/vortex";


const page = () => {

  return (
      <Vortex
        backgroundColor="black"
        // rangeY={800}
        // particleCount={500}
        // baseHue={120}
        className="w-[calc(100%-4rem)] mx-auto rounded-md  h-screen overflow-hidden flex items-center flex-col justify-center px-2 md:px-10  py-4"
      >
    <div className="">
        <Navbar />
    </div>
      </Vortex>
  )
}

export default page

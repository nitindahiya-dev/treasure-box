import Navbar from '@/components/Navbar'
import React from 'react'
import { Vortex } from "@/components/ui/vortex";
import Footer from '@/components/Footer';

const page = () => {

  return (
    <Vortex
      backgroundColor="black"
      className="mx-auto rounded-md  min-h-screen overflow-hidden flex items-center flex-col justify-between px-2 md:px-10  py-6"
    >
      <Navbar />
      <div className="bg-white shadow-lg rounded-xl md:w-[22vw] ">
        <div className="h-[40vh] pt-5 rounded-xl relative">
          <iframe
            src="https://giphy.com/embed/prhu1VNvjvJQNaJnEc"
            title="Giphy Embed"
            width="100%"
            height="100%"
            className="pointer-events-none"
          ></iframe>
          <div className="absolute inset-0"></div>
        </div>
        <div className="flex flex-col gap-1 p-5">
          <p className='font-bold text-md text-black'>Mint the master key to win a Prize Poll of $30,000</p>
          <p className='text-md text-gray-700'>18 hrs 19 min left vdr6e8v68...1y6etv1 to win</p>
          <button className='w-full font-bold text-md h-8 text-white bg-black rounded-md'>Mint for 0.32 SOL</button>
        </div>
      </div>

      <Footer />

    </Vortex>
  )
}

export default page

'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="absolute top-0 w-full h-20 bg-[#00000099] backdrop-blur-sm flex items-center justify-between text-white z-20">
      
      {/* Left: Logo */}
      <div className="flex items-center justify-center w-[40vh] bg-[#01292B] h-full">
        <Image src={'/images/logo.png'} width={100} height={100} alt='Logo' />
      </div>

      {/* Middle: Navbar (pushed to the right) */}
      <nav className="flex items-center space-x-8 ml-auto mr-10">
        <Link href="#" className="hover:text-[#F0DE9C] transition-colors duration-300">Home</Link>
        <Link href="#" className="hover:text-[#F0DE9C] transition-colors duration-300">About Us</Link>
        <Link href="#" className="hover:text-[#F0DE9C] transition-colors duration-300">Projects</Link>
        <Link href="#" className="hover:text-[#F0DE9C] transition-colors duration-300">Blogs</Link>
      </nav>

      {/* Right: Contact Us Button */}
      <div className="flex items-center justify-center bg-[#00000033] w-[40vh] h-full px-4">
        <button className="rounded-md px-6 py-2 text-[#01292B] font-semibold shadow-lg cursor-pointer hover:scale-105 transition-all duration-500"
          style={{
            background: 'radial-gradient(114.24% 114.24% at -15.51% 0%, #C3912F 0%, #F5E7A8 16.95%, #C3912F 100%)'
          }}>
          Contact Us
        </button>
      </div>
    </header>
  )
}

'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const properties = [
  {
    id: 1,
    defaultImage: '/images/projects/project-1.jpg',
    hoverImage: '/images/projects/project-5.jpg',
    title: 'Dummy Dummy',
  },
  {
    id: 2,
    defaultImage: '/images/projects/project-6.jpg',
    hoverImage: '/images/projects/project-5.jpg',
    title: 'Dummy Dummy',
  },
  {
    id: 3,
    defaultImage: '/images/projects/project-5.jpg',
    hoverImage: '/images/projects/project-1.jpg',
    title: 'Dummy Dummy',
  },
  {
    id: 4,
    defaultImage: '/images/projects/project-4.jpg',
    hoverImage: '/images/projects/project-1.jpg',
    title: 'Dummy Dummy',
  },
  {
    id: 5,
    defaultImage: '/images/projects/project-5.jpg',
    hoverImage: '/images/projects/project-1.jpg',
    title: 'Dummy Dummy',
  },
  {
    id: 6,
    defaultImage: '/images/projects/project-6.jpg',
    hoverImage: '/images/projects/project-1.jpg',
    title: 'Dummy Dummy',
  },
  {
    id: 7,
    defaultImage: '/images/projects/project-7.jpg',
    hoverImage: '/images/projects/project-1.jpg',
    title: 'Dummy Dummy',
  },
  {
    id: 8,
    defaultImage: '/images/projects/project-8.jpg',
    hoverImage: '/images/projects/project-1.jpg',
    title: 'Dummy Dummy',
  },
  {
    id: 9,
    defaultImage: '/images/projects/project-9.jpg',
    hoverImage: '/images/projects/project-1.jpg',
    title: 'Dummy Dummy',
  },
]

export default function ProjectHighlights() {
  return (
    <section className="bg-background text-white py-16 px-4 md:px-10 lg:px-20">
      <div className="font-cinzel max-w-6xl mx-auto text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl md:text-[40px] font-normal uppercase">
          Discover Tranquility at <span className="text-primary font-bold">Layan Verde, <div>Phuket</div></span>
        </h2>
        <p className="font-josefin font-light max-w-5xl mx-auto text-sm md:text-base lowercase text-white leading-6">
          Layan Verde is a luxury condominium in Phuket, set in lush tropical greenery. Managed by top hospitality brands, it blends five-star living with natural serenity. Each unit features curated landscapes, wellness-focused design, and premium amenities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {properties.map((property) => (
          <HoverImageCard key={property.id} {...property} />
        ))}
      </div>
    </section>
  )
}

const HoverImageCard = ({
  defaultImage,
  hoverImage,
  title,
}: {
  defaultImage: string
  hoverImage: string
  title: string
}) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-lg"
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      <motion.div
        className="w-full h-64 sm:h-72 md:h-80 bg-gradient-to-b from-[#00000000] to-[#000000];
"
        variants={{
          rest: { opacity: 1 },
          hover: { opacity: 0 },
        }}
        transition={{ duration: 0.4 }}
      >
        <Image
          src={defaultImage}
          alt={title}
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 w-full h-full"
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.4 }}
      >
        <Image
          src={hoverImage}
          alt={title}
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
        <h3 className="text-white text-lg font-semibold">{title}</h3>
      </div>
    </motion.div>
  )
}

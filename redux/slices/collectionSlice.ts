import { createSlice } from "@reduxjs/toolkit";

type Region = 'Thailand' | 'UAE' | 'Europe';

export type PropertyType = {
  id: number
  name: string
  price: string
  images: string[]
  location : string
  description: string
  badge?: string
}

interface CuratedState {
  selectedRegion: Region;
  allData: Record<Region, PropertyType[]>; // Replace PropertyType with your actual type
}


const initialState : CuratedState = {
  selectedRegion: "Thailand",
  allData: {
    Thailand: [
      {
        id: 1,
        name: "Layan Verde",
        price: "₹ 4.8 Cr",
        images: [
          "/collections/collection1.png",
          "/collections/collection2.jpg",
          "/collections/collection3.png",
        ],
        location : "Phuket , Thailand",
        description:
          "A simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      },
      {
        id: 2,
        name: "Banyan Group",
        price: "₹ 5.6 Cr",
        images: [
          "/collections/collection1.png",
          "/collections/collection2.jpg",
          "/collections/collection3.png",
        ],
        location : "Phuket ,Thailand",
        description:
          "A simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
        badge: "Elora",
      },
      {
        id: 3,
        name: "Momentum",
        price: "₹ 4.8 Cr",
        images: [
          "/collections/collection1.png",
          "/collections/collection2.jpg",
          "/collections/collection3.png",
        ], location : "Phuket , Thailand",
        description:
          "A simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      },
    ],
    UAE: [
      {
        id: 4,
        name: "Dubai Marina",
        price: "₹ 6.5 Cr",
        images: [
          "/collections/collection1.png",
          "/collections/collection2.jpg",
          "/collections/collection3.png",
        ], location : "Phuket , UAE",
        description:
          "A simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      },
      {
        id: 5,
        name: "Palm Jumeirah",
        price: "₹ 7.8 Cr",
        images: [
          "/collections/collection1.png",
          "/collections/collection2.jpg",
          "/collections/collection3.png",
        ], location : "Phuket , UAE",
        description:
          "A simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      },
      {
        id: 6,
        name: "Downtown Dubai",
        price: "₹ 8.5 Cr",
        images: [
          "/collections/collection1.png",
          "/collections/collection2.jpg",
          "/collections/collection3.png",
        ], location : "Phuket , UAE",
        description:
          "A simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      },
    ],
    Europe: [
      {
        id: 7,
        name: "Monaco Bay",
        price: "₹ 9.5 Cr",
        images: [
          "/collections/collection1.png",
          "/collections/collection2.jpg",
          "/collections/collection3.png",
        ], location : "Phuket , Europe",
        description:
          "A simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      },
      {
        id: 8,
        name: "Swiss Alps",
        price: "₹ 12.0 Cr",
        images: [
          "/collections/collection1.png",
          "/collections/collection2.jpg",
          "/collections/collection3.png",
        ], location : "Phuket , Europe",
        description:
          "A simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      },
      {
        id: 9,
        name: "Santorini Villa",
        price: "₹ 7.5 Cr",
        images: [
          "/collections/collection1.png",
          "/collections/collection2.jpg",
          "/collections/collection3.png",
        ], location : "Phuket , Europe",
        description:
          "A simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      },
    ],
  },
};

const curatedSlice = createSlice({
  name: "curated",
  initialState,
  reducers: {
    setRegion: (state, action) => {
      state.selectedRegion = action.payload;
    },
  },
});

export const { setRegion } = curatedSlice.actions;

export default curatedSlice.reducer;

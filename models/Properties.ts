// import { ObjectId } from "mongoose";

// export interface LocationModel {
//   id: string;
//   name: string;
//   image: string;
//   coords: {
//     top: string;
//     left: string;
//   };
//   icon: string;
// }

// export interface CategoryModel {
//   id: string;
//   title: string;
//   icon: string;
//   locations: LocationModel[];
// }

// export interface PhuketPropertiesModel {
//   _id?: ObjectId;
//   type: 'phuket-properties';
//   mainHeading: string;
//   subHeading: string;
//   description: string;
//   explorerHeading: string;
//   explorerDescription: string;
//   categories: CategoryModel[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// // Default data structure for initial setup
// export const defaultPhuketPropertiesData: Omit<PhuketPropertiesModel, '_id'> = {
//   type: 'phuket-properties',
//   mainHeading: 'DISCOVER PRIME PROPERTIES',
//   subHeading: 'ACROSS PHUKET',
//   description: `<p>Explore a Curated Selection of Luxury Residences. Whether you're seeking a beachfront retreat, an investment opportunity, or a peaceful escape amidst nature, these developments represent the best of lifestyle and location in Phuket.</p>`,
//   explorerHeading: 'Phuket Explorer',
//   explorerDescription: '<p>Discover the beauty and development of Phuket Island</p>',
//   categories: [
//     {
//       id: 'beaches',
//       title: 'Beaches Locations',
//       icon: '/icons/beach.svg',
//       locations: [
//         {
//           id: 'patong',
//           name: 'Patong Beach',
//           image: 'https://placehold.co/200x150/C3912F/FFFFFF?text=Patong+Beach',
//           coords: { top: '35%', left: '20%' },
//           icon: '/icons/map-pin.svg'
//         },
//         {
//           id: 'karon',
//           name: 'Karon Beach',
//           image: 'https://placehold.co/200x150/C3912F/FFFFFF?text=Karon+Beach',
//           coords: { top: '55%', left: '30%' },
//           icon: '/icons/map-pin.svg'
//         },
//         {
//           id: 'kata',
//           name: 'Kata Beach',
//           image: 'https://placehold.co/200x150/C3912F/FFFFFF?text=Kata+Beach',
//           coords: { top: '60%', left: '50%' },
//           icon: '/icons/map-pin.svg'
//         },
//         {
//           id: 'kamala',
//           name: 'Kamala Beach',
//           image: 'https://placehold.co/200x150/C3912F/FFFFFF?text=Kamala+Beach',
//           coords: { top: '35%', left: '40%' },
//           icon: '/icons/map-pin.svg'
//         },
//         {
//           id: 'surin',
//           name: 'Surin Beach',
//           image: 'https://placehold.co/200x150/C3912F/FFFFFF?text=Surin+Beach',
//           coords: { top: '70%', left: '25%' },
//           icon: '/icons/map-pin.svg'
//         }
//       ]
//     },
//     {
//       id: 'projects',
//       title: 'Projects Locations',
//       icon: '/icons/project.svg',
//       locations: [
//         {
//           id: 'origin',
//           name: 'Origin Project',
//           image: 'https://placehold.co/200x150/01292B/FFFFFF?text=Origin',
//           coords: { top: '35%', left: '20%' },
//           icon: '/icons/map-pin.svg'
//         },
//         {
//           id: 'banyan',
//           name: 'Banyan Tree Hub',
//           image: 'https://placehold.co/200x150/01292B/FFFFFF?text=Banyan',
//           coords: { top: '35%', left: '45%' },
//           icon: '/icons/map-pin.svg'
//         },
//         {
//           id: 'laguna',
//           name: 'Laguna Complex',
//           image: 'https://placehold.co/200x150/01292B/FFFFFF?text=Laguna',
//           coords: { top: '60%', left: '50%' },
//           icon: '/icons/map-pin.svg'
//         },
//         {
//           id: 'central',
//           name: 'Central Mall',
//           image: 'https://placehold.co/200x150/01292B/FFFFFF?text=Central',
//           coords: { top: '70%', left: '25%' },
//           icon: '/icons/map-pin.svg'
//         },
//         {
//           id: 'villas',
//           name: 'Island Villas',
//           image: 'https://placehold.co/200x150/01292B/FFFFFF?text=Villas',
//           coords: { top: '50%', left: '25%' },
//           icon: '/icons/map-pin.svg'
//         }
//       ]
//     },
//     {
//       id: 'alliance',
//       title: 'Government Alliance',
//       icon: '/icons/alliance.svg',
//       locations: [
//         {
//           id: 'townhall',
//           name: 'Phuket Town Hall',
//           image: 'https://placehold.co/200x150/5B21B6/FFFFFF?text=Town+Hall',
//           coords: { top: '35%', left: '20%' },
//           icon: '/icons/map-pin.svg'
//         },
//         {
//           id: 'tourism1',
//           name: 'Tourism Authority',
//           image: 'https://placehold.co/200x150/5B21B6/FFFFFF?text=Tourism',
//           coords: { top: '55%', left: '25%' },
//           icon: '/icons/map-pin.svg'
//         },
//         {
//           id: 'marine1',
//           name: 'Marine Department',
//           image: 'https://placehold.co/200x150/5B21B6/FFFFFF?text=Marine',
//           coords: { top: '55%', left: '45%' },
//           icon: '/icons/map-pin.svg'
//         },
//         {
//           id: 'tourism2',
//           name: 'Tourism Authority',
//           image: 'https://placehold.co/200x150/5B21B6/FFFFFF?text=Tourism',
//           coords: { top: '50%', left: '15%' },
//           icon: '/icons/map-pin.svg'
//         },
//         {
//           id: 'marine2',
//           name: 'Marine Department',
//           image: 'https://placehold.co/200x150/5B21B6/FFFFFF?text=Marine',
//           coords: { top: '65%', left: '35%' },
//           icon: '/icons/map-pin.svg'
//         }
//       ]
//     }
//   ],
//   createdAt: new Date(),
//   updatedAt: new Date()
// };

// // Database operations
// export class PropertiesRepository {
//   private db: any;

//   constructor(database: any) {
//     this.db = database;
//   }

//   async getPropertiesData(): Promise<PhuketPropertiesModel | null> {
//     try {
//       const collection = this.db.collection('properties');
//       const result = await collection.findOne({ type: 'phuket-properties' });
//       return result;
//     } catch (error) {
//       console.error('Error fetching properties data:', error);
//       throw error;
//     }
//   }

//   async createPropertiesData(data: Omit<PhuketPropertiesModel, '_id'>): Promise<any> {
//     try {
//       const collection = this.db.collection('properties');
//       const result = await collection.insertOne({
//         ...data,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       });
//       return result;
//     } catch (error) {
//       console.error('Error creating properties data:', error);
//       throw error;
//     }
//   }

//   async updatePropertiesData(data: Partial<PhuketPropertiesModel>): Promise<any> {
//     try {
//       const collection = this.db.collection('properties');
//       const result = await collection.updateOne(
//         { type: 'phuket-properties' },
//         {
//           $set: {
//             ...data,
//             updatedAt: new Date()
//           },
//           $setOnInsert: {
//             type: 'phuket-properties',
//             createdAt: new Date()
//           }
//         },
//         { upsert: true }
//       );
//       return result;
//     } catch (error) {
//       console.error('Error updating properties data:', error);
//       throw error;
//     }
//   }

//   async deletePropertiesData(): Promise<any> {
//     try {
//       const collection = this.db.collection('properties');
//       const result = await collection.deleteOne({ type: 'phuket-properties' });
//       return result;
//     } catch (error) {
//       console.error('Error deleting properties data:', error);
//       throw error;
//     }
//   }

//   async initializeDefaultData(): Promise<any> {
//     try {
//       const existingData = await this.getPropertiesData();
//       if (!existingData) {
//         return await this.createPropertiesData(defaultPhuketPropertiesData);
//       }
//       return existingData;
//     } catch (error) {
//       console.error('Error initializing default data:', error);
//       throw error;
//     }
//   }
// }

// models/Properties.ts
import mongoose, { Schema, Document } from 'mongoose';

interface ILocation {
  id: string;
  name: string;
  image: string;
  coords: {
    top: string;
    left: string;
  };
  icon: string;
}

interface ICategory {
  id: string;
  title: string;
  icon: string;
  locations: ILocation[];
}

export interface IProperties extends Document {
  mainHeading: string;
  subHeading: string;
  description: string;
  explorerHeading: string;
  explorerDescription: string;
  categories: ICategory[];
}

const LocationSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  coords: {
    top: { type: String, required: true },
    left: { type: String, required: true }
  },
  icon: { type: String, default: '/icons/map-pin.svg' }
});

const CategorySchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  icon: { type: String, required: true },
  locations: [LocationSchema]
});

const PropertiesSchema: Schema = new Schema({
  mainHeading: { 
    type: String, 
    default: 'DISCOVER PRIME PROPERTIES' 
  },
  subHeading: { 
    type: String, 
    default: 'ACROSS PHUKET' 
  },
  description: { 
    type: String, 
    default: 'Explore a Curated Selection of Luxury Residences. Whether you\'re seeking a beachfront retreat, an investment opportunity, or a peaceful escape amidst nature, these developments represent the best of lifestyle and location in Phuket.' 
  },
  explorerHeading: { 
    type: String, 
    default: 'Phuket Explorer' 
  },
  explorerDescription: { 
    type: String, 
    default: 'Discover the beauty and development of Phuket Island' 
  },
  categories: {
    type: [CategorySchema],
    default: [
      {
        id: 'beaches',
        title: 'Beaches Locations',
        icon: '/icons/beach.svg',
        locations: [
          {
            id: 'patong',
            name: 'Patong Beach',
            image: 'https://placehold.co/200x150/C3912F/FFFFFF?text=Patong+Beach',
            coords: { top: '35%', left: '20%' },
            icon: '/icons/map-pin.svg'
          },
          {
            id: 'karon',
            name: 'Karon Beach',
            image: 'https://placehold.co/200x150/C3912F/FFFFFF?text=Karon+Beach',
            coords: { top: '55%', left: '30%' },
            icon: '/icons/map-pin.svg'
          },
          {
            id: 'kata',
            name: 'Kata Beach',
            image: 'https://placehold.co/200x150/C3912F/FFFFFF?text=Kata+Beach',
            coords: { top: '60%', left: '50%' },
            icon: '/icons/map-pin.svg'
          },
          {
            id: 'kamala',
            name: 'Kamala Beach',
            image: 'https://placehold.co/200x150/C3912F/FFFFFF?text=Kamala+Beach',
            coords: { top: '35%', left: '40%' },
            icon: '/icons/map-pin.svg'
          },
          {
            id: 'surin',
            name: 'Surin Beach',
            image: 'https://placehold.co/200x150/C3912F/FFFFFF?text=Surin+Beach',
            coords: { top: '70%', left: '25%' },
            icon: '/icons/map-pin.svg'
          }
        ]
      },
      {
        id: 'projects',
        title: 'Projects Locations',
        icon: '/icons/project.svg',
        locations: [
          {
            id: 'origin',
            name: 'Origin Project',
            image: 'https://placehold.co/200x150/01292B/FFFFFF?text=Origin',
            coords: { top: '35%', left: '20%' },
            icon: '/icons/map-pin.svg'
          },
          {
            id: 'banyan',
            name: 'Banyan Tree Hub',
            image: 'https://placehold.co/200x150/01292B/FFFFFF?text=Banyan',
            coords: { top: '35%', left: '45%' },
            icon: '/icons/map-pin.svg'
          },
          {
            id: 'laguna',
            name: 'Laguna Complex',
            image: 'https://placehold.co/200x150/01292B/FFFFFF?text=Laguna',
            coords: { top: '60%', left: '50%' },
            icon: '/icons/map-pin.svg'
          },
          {
            id: 'central',
            name: 'Central Mall',
            image: 'https://placehold.co/200x150/01292B/FFFFFF?text=Central',
            coords: { top: '70%', left: '25%' },
            icon: '/icons/map-pin.svg'
          },
          {
            id: 'villas',
            name: 'Island Villas',
            image: 'https://placehold.co/200x150/01292B/FFFFFF?text=Villas',
            coords: { top: '50%', left: '25%' },
            icon: '/icons/map-pin.svg'
          }
        ]
      },
      {
        id: 'alliance',
        title: 'Government Alliance',
        icon: '/icons/alliance.svg',
        locations: [
          {
            id: 'townhall',
            name: 'Phuket Town Hall',
            image: 'https://placehold.co/200x150/5B21B6/FFFFFF?text=Town+Hall',
            coords: { top: '35%', left: '20%' },
            icon: '/icons/map-pin.svg'
          },
          {
            id: 'tourism',
            name: 'Tourism Authority',
            image: 'https://placehold.co/200x150/5B21B6/FFFFFF?text=Tourism',
            coords: { top: '55%', left: '25%' },
            icon: '/icons/map-pin.svg'
          },
          {
            id: 'marine',
            name: 'Marine Department',
            image: 'https://placehold.co/200x150/5B21B6/FFFFFF?text=Marine',
            coords: { top: '55%', left: '45%' },
            icon: '/icons/map-pin.svg'
          },
          {
            id: 'tourism2',
            name: 'Tourism Authority',
            image: 'https://placehold.co/200x150/5B21B6/FFFFFF?text=Tourism',
            coords: { top: '50%', left: '15%' },
            icon: '/icons/map-pin.svg'
          },
          {
            id: 'marine2',
            name: 'Marine Department',
            image: 'https://placehold.co/200x150/5B21B6/FFFFFF?text=Marine',
            coords: { top: '55%', left: '45%' },
            icon: '/icons/map-pin.svg'
          }
        ]
      }
    ]
  }
}, { timestamps: true });

// Prevent model overwrite in Next.js hot-reloading
export default mongoose.models.Properties || mongoose.model<IProperties>('Properties', PropertiesSchema);
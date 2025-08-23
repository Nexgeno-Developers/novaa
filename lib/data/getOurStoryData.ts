import dbConnect from '@/lib/mongodb';
import OurStory from '@/models/OurStory';
import { cache } from 'react';

export const getOurStoryData = cache(async (slug: string) => {
  try {
    await dbConnect();
    const data = await OurStory.findOne({ pageSlug: slug }).lean();
    if (!data) {
      return {
          pageSlug: slug,
        title: 'OUR STORY',
        description: '<p>Please fill out this content.</p>',
        mediaType: 'video',
        mediaUrl: '/images/dummyvid.mp4'
      }
    };
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Failed to get info section data:", error);
    return null;
  }
});
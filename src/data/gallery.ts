import type { ImageAsset } from '@/types';
import { collegePhotos } from './images';

/**
 * CAMPUS GALLERY — Bapuji College Karwar's own photographs (campus building and the event photos
 * published on bgvsacc.org). Every item needs a meaningful caption; the image alt text describes
 * what is in the picture, the caption adds context.
 */
export type GalleryCategory = 'Campus' | 'Academics' | 'Events' | 'Sports' | 'Student Life' | 'Hostel';

export interface GalleryItem {
  id: string;
  image: ImageAsset;
  category: GalleryCategory;
  caption: string;
  /** Layout hint for the varied grid: tall items span two rows, wide items two columns on large screens */
  shape?: 'tall' | 'wide';
}

/** Only categories that have photos are offered as filters. */
export const galleryCategories: GalleryCategory[] = ['Campus', 'Events', 'Student Life'];

export const galleryItems: GalleryItem[] = [
  { id: 'g01', image: collegePhotos.building, category: 'Campus', caption: 'The main college building at Sadashivgad, Karwar.', shape: 'wide' },
  { id: 'g02', image: collegePhotos.function, category: 'Events', caption: 'Guests on the dais at a college function.', shape: 'wide' },
  { id: 'g03', image: collegePhotos.certificates, category: 'Events', caption: 'Students receive their certificates.' },
  { id: 'g04', image: collegePhotos.treePlanting, category: 'Campus', caption: 'Planting saplings to keep the campus green.' },
  { id: 'g05', image: collegePhotos.felicitation, category: 'Events', caption: 'A felicitation programme with staff and guests.' },
  { id: 'g06', image: collegePhotos.address, category: 'Events', caption: 'A guest address at a college programme.' },
  { id: 'g07', image: collegePhotos.mehendi, category: 'Student Life', caption: 'Students at the mehendi competition.' },
];

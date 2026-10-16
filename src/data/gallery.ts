import type { ImageAsset } from '@/types';
import { images } from './images';

/**
 * CAMPUS GALLERY — stock photographs used as stand-ins (see data/images).
 * Replace with the institution's own consented photography. Every item needs a meaningful caption;
 * the image alt text describes what is in the picture, the caption adds context.
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

export const galleryCategories: GalleryCategory[] = ['Campus', 'Academics', 'Events', 'Sports', 'Student Life', 'Hostel'];

export const galleryItems: GalleryItem[] = [
  { id: 'g01', image: images.heroCampus, category: 'Campus', caption: 'The main academic building at golden hour.', shape: 'wide' },
  { id: 'g02', image: images.campusAerial, category: 'Campus', caption: 'The central lawn between classes — the heart of campus life.', shape: 'tall' },
  { id: 'g03', image: images.library, category: 'Academics', caption: 'Open stacks in the four-floor central library.' },
  { id: 'g04', image: images.scienceLab, category: 'Academics', caption: 'Hands-on experiments in the chemistry laboratory.' },
  { id: 'g05', image: images.concert, category: 'Events', caption: 'A headline performance at the annual cultural festival.', shape: 'tall' },
  { id: 'g06', image: images.sportsTrack, category: 'Sports', caption: 'Morning training on the athletics track.' },
  { id: 'g07', image: images.groupStudy, category: 'Student Life', caption: 'Project teams collaborating in a group-study space.' },
  { id: 'g08', image: images.hostel, category: 'Hostel', caption: 'A furnished twin-sharing hostel room.' },
  { id: 'g09', image: images.robotics, category: 'Academics', caption: 'Student-built robotics prototype in the innovation lab.', shape: 'wide' },
  { id: 'g10', image: images.graduation, category: 'Events', caption: 'Convocation day — graduates celebrate with their families.' },
  { id: 'g11', image: images.basketball, category: 'Sports', caption: 'Inter-department basketball league on the outdoor courts.', shape: 'tall' },
  { id: 'g12', image: images.cafeteria, category: 'Student Life', caption: 'Lunch hour at the campus cafeteria.' },
  { id: 'g13', image: images.libraryReading, category: 'Academics', caption: 'The quiet reading hall during examination season.' },
  { id: 'g14', image: images.festival, category: 'Events', caption: 'Students celebrating at the annual fest.' },
  { id: 'g15', image: images.football, category: 'Sports', caption: 'A league match on the college football ground.', shape: 'wide' },
  { id: 'g16', image: images.friends, category: 'Student Life', caption: 'Friends catching up between lectures.' },
  { id: 'g17', image: images.studentsLaptops, category: 'Hostel', caption: 'Evening study session in the hostel common room.' },
  { id: 'g18', image: images.auditorium, category: 'Events', caption: 'A full house in the main auditorium for a guest lecture.' },
  { id: 'g19', image: images.gym, category: 'Sports', caption: 'The campus fitness centre with cardio and strength equipment.' },
  { id: 'g20', image: images.microscope, category: 'Academics', caption: 'Microscopy practicals in the biology laboratory.' },
  { id: 'g21', image: images.studentsOutdoor, category: 'Campus', caption: 'Conversations on the walkway outside the academic blocks.' },
  { id: 'g22', image: images.writing, category: 'Hostel', caption: 'Quiet study hours in the hostel reading room.' },
];

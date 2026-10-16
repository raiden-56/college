import type { ImageAsset } from '@/types';
import { images } from '@/data/images';

/**
 * Virtual tour stops.
 *
 * INTEGRATION POINT (360° / panoramic media): when the college commissions panoramic photography,
 * set `panoramaUrl` on each stop to the embeddable URL of its 360° scene (e.g. a hosted tour
 * provider's iframe URL, or an equirectangular image for a viewer component). The tour page shows
 * the "integration pending" panel until a stop has a panoramaUrl.
 *
 * `videoUrl` is reserved for the full walkthrough video, which must ship with captions (WebVTT) and a transcript.
 */
export interface TourStop {
  id: string;
  name: string;
  image: ImageAsset;
  description: string;
  highlights: string[];
  /** Links to the matching facility block on /campus */
  facilitySlug?: string;
  panoramaUrl?: string;
}

export const tourStops: TourStop[] = [
  {
    id: 'main-gate',
    name: 'Main Gate & Admin Block',
    image: images.heroCampus,
    description:
      'Your visit begins at the main gate, where security registers visitors. Straight ahead is the administrative block with the admissions office, accounts and the principal’s office.',
    highlights: ['Visitor registration at the gate', 'Admissions help desk on the ground floor', 'Accessible ramps and lifts'],
    facilitySlug: 'security-parking',
  },
  {
    id: 'central-lawn',
    name: 'Central Lawn',
    image: images.campusAerial,
    description: 'The green heart of campus connects the academic blocks. Students gather here between classes, and it hosts the annual homecoming and open-air events.',
    highlights: ['Shaded walkways between blocks', 'Venue for fests and alumni homecoming', 'Wi-Fi coverage across the lawn'],
    facilitySlug: 'wifi',
  },
  {
    id: 'library',
    name: 'Central & Digital Library',
    image: images.libraryReading,
    description: 'Four floors of print collections, a silent reading hall, group discussion rooms and terminals for e-journals and the institutional repository.',
    highlights: ['Silent reading hall', 'Group discussion rooms', 'E-resources and plagiarism-check support'],
    facilitySlug: 'library',
  },
  {
    id: 'labs',
    name: 'Laboratories',
    image: images.engineeringLab,
    description: 'Computing, engineering and science laboratories where students spend a large share of their week — from programming studios to instrumentation labs.',
    highlights: ['Networked computing labs', 'Engineering workshops', 'Science and biotechnology labs'],
    facilitySlug: 'laboratories',
  },
  {
    id: 'innovation',
    name: 'Innovation Lab',
    image: images.robotics,
    description: 'The maker space and incubation centre, with 3D printers, electronics benches and mentoring for student start-ups.',
    highlights: ['3D printing and prototyping', 'Start-up mentoring', 'Hackathons and pitch events'],
    facilitySlug: 'innovation-incubation',
  },
  {
    id: 'auditorium',
    name: 'Auditorium',
    image: images.auditorium,
    description: 'An air-conditioned auditorium with professional sound and lighting for conferences, performances, guest lectures and convocation.',
    highlights: ['Professional sound and lighting', 'Seminar halls with video-conferencing', 'Open-air theatre nearby'],
    facilitySlug: 'auditorium',
  },
  {
    id: 'cafeteria',
    name: 'Cafeteria',
    image: images.cafeteria,
    description: 'A bright food court with multiple counters serving healthy, affordable meals and snacks throughout the day.',
    highlights: ['Regional cuisines', 'Hygiene audits by the food committee', 'Open 7:30 AM – 8:00 PM'],
    facilitySlug: 'cafeteria',
  },
  {
    id: 'hostel',
    name: 'Hostels',
    image: images.hostel,
    description: 'Separate, secure hostels for men and women with resident wardens, Wi-Fi, study rooms and a mess serving vegetarian and non-vegetarian menus.',
    highlights: ['Twin and triple sharing rooms', '24×7 security and CCTV', 'Resident wardens'],
    facilitySlug: 'hostels',
  },
  {
    id: 'sports',
    name: 'Sports Complex',
    image: images.sportsTrack,
    description: 'An athletics track, football and cricket grounds, outdoor courts, an indoor games hall and a fitness centre.',
    highlights: ['Athletics track and grounds', 'Indoor badminton and table tennis', 'Gym with trained instructors'],
    facilitySlug: 'sports',
  },
];

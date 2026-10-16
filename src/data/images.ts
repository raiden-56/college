import type { ImageAsset } from '@/types';

/**
 * Central image library. These are royalty-free Unsplash stock photos used as stand-ins.
 * Replace with the institution's own photography (ideally served from a CDN in WebP/AVIF).
 * `SmartImage` shows a branded fallback if any remote image fails to load.
 */
export const unsplash = (id: string, width = 1200, quality = 75) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=${quality}`;

const img = (id: string, alt: string, width?: number): ImageAsset => ({ src: unsplash(id, width), alt });

/**
 * The college's own photographs. The building photo is served from /public; the event photos are
 * the ones published on the college's official website (bgvsacc.org).
 */
const officialPhoto = (file: string, alt: string): ImageAsset => ({
  src: `https://bgvsacc.org/wp-content/uploads/2017/12/${file}`,
  alt,
});

export const collegePhotos = {
  building: { src: '/images/college/campus-building.webp', alt: 'Main building of Bapuji College Karwar at Sadashivgad' },
  certificates: officialPhoto('DSC03239-1.jpg', 'Students holding certificates on stage at a college programme'),
  function: officialPhoto('DSC_0045.jpg', 'Guests on the dais at a function of B.G.V.S Arts and Commerce College'),
  treePlanting: officialPhoto('IMG_20170422_104515.jpg', 'Staff and guests planting a sapling on campus'),
  felicitation: officialPhoto('felecitation.jpg', 'Staff and guests at a felicitation programme'),
  address: officialPhoto('DSC_0040.jpg', 'A guest addressing a college programme from the podium'),
  mehendi: officialPhoto('Photo1118.jpg', 'Students taking part in a mehendi competition'),
} satisfies Record<string, ImageAsset>;

export const images = {
  heroCampus: collegePhotos.building,
  campusAerial: img('1541339907198-e08756dedf3f', 'Students walking across the central campus lawn', 1800),
  graduation: img('1523050854058-8df90110c9f1', 'Graduates tossing their caps at convocation', 1600),
  lecture: img('1524178232363-1fb2b075b655', 'Faculty member teaching in a modern lecture hall'),
  groupStudy: img('1522202176988-66273c2fd55f', 'Students collaborating around a table with laptops'),
  studentsOutdoor: img('1523240795612-9a054b0db644', 'Students talking together outdoors on campus'),
  studentsLaptops: img('1498243691581-b145c3f54a5a', 'Students working on laptops in a study space'),
  library: img('1481627834876-b7833e8f5570', 'Rows of bookshelves in the central library'),
  libraryReading: img('1507842217343-583bb7270b66', 'Reading hall in the library'),
  scienceLab: img('1532094349884-543bc11b234d', 'Researcher working with lab glassware'),
  microscope: img('1576086213369-97a306d36557', 'Student using a microscope in the biology lab'),
  engineeringLab: img('1581092160562-40aa08e78837', 'Engineering students working on equipment'),
  robotics: img('1485827404703-89b55fcc595e', 'Robotics project in the innovation lab'),
  circuit: img('1518770660439-4636190af475', 'Close-up of an electronic circuit board'),
  coding: img('1517694712202-14dd9538aa97', 'Laptop showing source code in the computing lab'),
  business: img('1552664730-d307ca884978', 'Management students presenting in a seminar room'),
  analytics: img('1460925895917-afdab827c52f', 'Analytics dashboards on a laptop screen'),
  law: img('1589829545856-d10d557cf95f', 'Gavel and law books in the moot court'),
  lawBooks: img('1505664194779-8beaceb93744', 'Law library shelves'),
  education: img('1503676260728-1c00da094a0b', 'Teacher education classroom'),
  teacher: img('1544717305-2782549b5136', 'Teacher guiding a student'),
  humanities: img('1497633762265-9d179a990aa6', 'Stack of books in the humanities library'),
  health: img('1576091160399-112ba8d25d1d', 'Health sciences students in training'),
  auditorium: img('1540575467063-178a50c2df87', 'Audience seated in the college auditorium'),
  conference: img('1505373877841-8d25f7d46678', 'Speaker at an academic conference'),
  workshop: img('1531482615713-2afd69097998', 'Students in a hands-on workshop'),
  sportsTrack: img('1461896836934-ffe607ba8211', 'Athletes on the running track'),
  football: img('1574629810360-7efbbe195018', 'Football match on the college ground'),
  basketball: img('1546519638-68e109498ffc', 'Basketball court on campus'),
  gym: img('1534438327276-14e5300c3a48', 'Fitness centre with training equipment'),
  cafeteria: img('1555396273-367ea4eb4db5', 'Bright cafeteria dining area'),
  hostel: img('1555854877-bab0e564b8d5', 'Furnished hostel room'),
  bus: img('1544620347-c4fd4a3d5957', 'College transport bus'),
  concert: img('1501386761578-eac5c94b800a', 'Cultural festival performance on stage'),
  festival: img('1492684223066-81342ee5ff30', 'Students celebrating at the annual fest'),
  classroom: img('1427504494785-3a9ca7044f45', 'Students in a smart classroom'),
  writing: img('1434030216411-0b793f4b4173', 'Student writing notes'),
  friends: img('1529156069898-49953e39b3ac', 'Group of friends on campus'),
  meeting: img('1556761175-5973dc0f32e7', 'Industry mentors meeting students'),
  online: img('1516321318423-f06f85e504b3', 'Student attending an online class'),
};

/** Portrait placeholders for demo people. Replace with consented, approved photographs. */
const portrait = (id: string, alt: string): ImageAsset => ({ src: unsplash(id, 600, 70), alt });

export const portraits = {
  m1: portrait('1507679799987-c73779587ccf', 'Portrait of a man in a suit'),
  m2: portrait('1560250097-0b93528c311a', 'Portrait of a smiling man in formal wear'),
  m3: portrait('1472099645785-5658abf4ff4e', 'Portrait of a man with a beard'),
  m4: portrait('1500648767791-00dcc994a43e', 'Portrait of a young man'),
  m5: portrait('1506794778202-cad84cf45f1d', 'Portrait of a man outdoors'),
  m6: portrait('1519085360753-af0119f7cbe7', 'Portrait of a man in a blazer'),
  m7: portrait('1557862921-37829c790f19', 'Portrait of a man smiling'),
  m8: portrait('1599566150163-29194dcaad36', 'Portrait of a man wearing glasses'),
  f1: portrait('1573496359142-b8d87734a5a2', 'Portrait of a woman in professional attire'),
  f2: portrait('1580489944761-15a19d654956', 'Portrait of a smiling woman'),
  f3: portrait('1438761681033-6461ffad8d80', 'Portrait of a woman'),
  f4: portrait('1494790108377-be9c29b29330', 'Portrait of a young woman'),
  f5: portrait('1544005313-94ddf0286df2', 'Portrait of a woman with long hair'),
  f6: portrait('1531123897727-8f129e1688ce', 'Portrait of a woman smiling'),
  f7: portrait('1488426862026-3ee34a7d66df', 'Portrait of a young woman outdoors'),
  f8: portrait('1517841905240-472988babdf9', 'Portrait of a woman in natural light'),
};

import { Seo } from '@/components/layout/Seo';
import { EnquiryCTA } from '@/components/sections/EnquiryCTA';
import { HomeHero } from '@/components/home/HomeHero';
import { AccreditationStrip } from '@/components/home/AccreditationStrip';
import { IntroSection } from '@/components/home/IntroSection';
import { StatsBand } from '@/components/home/StatsBand';
import { FeaturedPrograms } from '@/components/home/FeaturedPrograms';
import { DepartmentsBrowse } from '@/components/home/DepartmentsBrowse';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { PrincipalMessage } from '@/components/home/PrincipalMessage';
import { FeaturedFaculty } from '@/components/home/FeaturedFaculty';
import { FacilitiesBento } from '@/components/home/FacilitiesBento';
import { PlacementHighlights } from '@/components/home/PlacementHighlights';
import { StudentAchievements } from '@/components/home/StudentAchievements';
import { EventsAndNews } from '@/components/home/EventsAndNews';
import { AlumniStories } from '@/components/home/AlumniStories';
import { TestimonialsBand } from '@/components/home/TestimonialsBand';
import { AdmissionProcess } from '@/components/home/AdmissionProcess';
import { ScholarshipsSection } from '@/components/home/ScholarshipsSection';
import { CampusGalleryTeaser } from '@/components/home/CampusGalleryTeaser';
import { HomeFaq } from '@/components/home/HomeFaq';
import { organizationLd } from '@/utils/structuredData';

export default function HomePage() {
  return (
    <>
      <Seo
        title="Home"
        description="Crestwood College, Bengaluru: UG, PG and doctoral programs in engineering, science, management, law, humanities and education. Admissions 2027–28 open."
        jsonLd={organizationLd()}
      />
      <HomeHero />
      <AccreditationStrip />
      <IntroSection />
      <StatsBand />
      <FeaturedPrograms />
      <DepartmentsBrowse />
      <WhyChooseUs />
      <PrincipalMessage />
      <FeaturedFaculty />
      <FacilitiesBento />
      <PlacementHighlights />
      <StudentAchievements />
      <EventsAndNews />
      <AlumniStories />
      <TestimonialsBand />
      <AdmissionProcess />
      <ScholarshipsSection />
      <CampusGalleryTeaser />
      <HomeFaq />
      <EnquiryCTA />
    </>
  );
}

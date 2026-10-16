import { lazy } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import ErrorPage from '@/pages/ErrorPage';

/** Route-level code splitting: every page is its own chunk. */
const HomePage = lazy(() => import('@/pages/home/HomePage'));
const AboutPage = lazy(() => import('@/pages/about/AboutPage'));
const LeadershipPage = lazy(() => import('@/pages/about/LeadershipPage'));
const ProgramsPage = lazy(() => import('@/pages/programs/ProgramsPage'));
const ProgramDetailPage = lazy(() => import('@/pages/programs/ProgramDetailPage'));
const DepartmentsPage = lazy(() => import('@/pages/departments/DepartmentsPage'));
const DepartmentDetailPage = lazy(() => import('@/pages/departments/DepartmentDetailPage'));
const FacultyPage = lazy(() => import('@/pages/faculty/FacultyPage'));
const FacultyProfilePage = lazy(() => import('@/pages/faculty/FacultyProfilePage'));
const AdmissionsPage = lazy(() => import('@/pages/admissions/AdmissionsPage'));
const ApplyPage = lazy(() => import('@/pages/admissions/ApplyPage'));
const FeesPage = lazy(() => import('@/pages/fees/FeesPage'));
const CampusPage = lazy(() => import('@/pages/campus/CampusPage'));
const GalleryPage = lazy(() => import('@/pages/campus/GalleryPage'));
const VirtualTourPage = lazy(() => import('@/pages/campus/VirtualTourPage'));
const PlacementsPage = lazy(() => import('@/pages/placements/PlacementsPage'));
const AlumniPage = lazy(() => import('@/pages/alumni/AlumniPage'));
const TestimonialsPage = lazy(() => import('@/pages/testimonials/TestimonialsPage'));
const FeedbackPage = lazy(() => import('@/pages/feedback/FeedbackPage'));
const ResearchPage = lazy(() => import('@/pages/research/ResearchPage'));
const StudentCornerPage = lazy(() => import('@/pages/student/StudentCornerPage'));
const NewsPage = lazy(() => import('@/pages/news/NewsPage'));
const NewsDetailPage = lazy(() => import('@/pages/news/NewsDetailPage'));
const EventsPage = lazy(() => import('@/pages/events/EventsPage'));
const EventDetailPage = lazy(() => import('@/pages/events/EventDetailPage'));
const DisclosuresPage = lazy(() => import('@/pages/disclosures/DisclosuresPage'));
const ContactPage = lazy(() => import('@/pages/contact/ContactPage'));
const SearchPage = lazy(() => import('@/pages/search/SearchPage'));
const PrivacyPage = lazy(() => import('@/pages/legal/PrivacyPage'));
const AccessibilityPage = lazy(() => import('@/pages/legal/AccessibilityPage'));
const SitemapPage = lazy(() => import('@/pages/legal/SitemapPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'about/leadership', element: <LeadershipPage /> },
      { path: 'programs', element: <ProgramsPage /> },
      { path: 'programs/:slug', element: <ProgramDetailPage /> },
      { path: 'departments', element: <DepartmentsPage /> },
      { path: 'departments/:slug', element: <DepartmentDetailPage /> },
      { path: 'faculty', element: <FacultyPage /> },
      { path: 'faculty/:slug', element: <FacultyProfilePage /> },
      { path: 'admissions', element: <AdmissionsPage /> },
      { path: 'admissions/apply', element: <ApplyPage /> },
      { path: 'fees', element: <FeesPage /> },
      { path: 'campus', element: <CampusPage /> },
      { path: 'campus/gallery', element: <GalleryPage /> },
      { path: 'campus/virtual-tour', element: <VirtualTourPage /> },
      { path: 'placements', element: <PlacementsPage /> },
      { path: 'alumni', element: <AlumniPage /> },
      { path: 'testimonials', element: <TestimonialsPage /> },
      { path: 'feedback', element: <FeedbackPage /> },
      { path: 'research', element: <ResearchPage /> },
      { path: 'student-corner', element: <StudentCornerPage /> },
      { path: 'news', element: <NewsPage /> },
      { path: 'news/:slug', element: <NewsDetailPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'events/:slug', element: <EventDetailPage /> },
      { path: 'disclosures', element: <DisclosuresPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'accessibility', element: <AccessibilityPage /> },
      { path: 'sitemap', element: <SitemapPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);

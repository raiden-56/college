import { ArrowRight, BookOpen, Building2, CalendarDays, FileText, HelpCircle, Megaphone, User, type LucideIcon } from 'lucide-react';
import type { SearchResult } from '@/types';

/** Icon per search result type (shared by the search dialog and the /search page). */
export const resultIcons: Record<SearchResult['type'], LucideIcon> = {
  Page: ArrowRight,
  Program: BookOpen,
  Department: Building2,
  Faculty: User,
  'News & Notices': Megaphone,
  Event: CalendarDays,
  Download: FileText,
  FAQ: HelpCircle,
};

import { MotionConfig } from 'framer-motion';
import { RouterProvider } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { router } from '@/routes';

export default function App() {
  return (
    // reducedMotion="user" disables transform animations for visitors who prefer reduced motion
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </MotionConfig>
  );
}

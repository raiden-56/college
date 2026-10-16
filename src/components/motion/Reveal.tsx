import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

/*
 * Entrance offsets are animated through CSS variables feeding the independent `translate`
 * property — NOT `transform`. framer-motion leaves an inline `transform` on elements it moves,
 * which would override Tailwind hover lifts (`card-hover`, `hover:-translate-y-*`) on the same element.
 */
const offsetVars = (direction: Direction, distance: number) => {
  switch (direction) {
    case 'up':
      return { '--reveal-x': '0px', '--reveal-y': `${distance}px` };
    case 'down':
      return { '--reveal-x': '0px', '--reveal-y': `${-distance}px` };
    case 'left':
      return { '--reveal-x': `${distance}px`, '--reveal-y': '0px' };
    case 'right':
      return { '--reveal-x': `${-distance}px`, '--reveal-y': '0px' };
    default:
      return { '--reveal-x': '0px', '--reveal-y': '0px' };
  }
};

const rest0 = { '--reveal-x': '0px', '--reveal-y': '0px' };
const translateStyle = { translate: 'var(--reveal-x, 0px) var(--reveal-y, 0px)' };

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  distance?: number;
  duration?: number;
  /** Render as a different element, e.g. 'li' or 'section' */
  as?: 'div' | 'li' | 'section' | 'article' | 'span';
}

/** Fades and slides content in once when it scrolls into view. Fade only under prefers-reduced-motion. */
export function Reveal({ children, direction = 'up', delay = 0, distance = 28, duration = 0.6, as = 'div', style, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      initial={{ opacity: 0, ...offsetVars(reduce ? 'none' : direction, distance) }}
      whileInView={{ opacity: 1, ...rest0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ ...translateStyle, ...style }}
      {...rest}
    >
      {children}
    </Component>
  );
}

const containerVariants: Variants = {
  hidden: {},
  visible: (stagger: number) => ({ transition: { staggerChildren: stagger, delayChildren: 0.05 } }),
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, '--reveal-x': '0px', '--reveal-y': '24px' },
  visible: { opacity: 1, ...rest0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const staggerItemVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

interface StaggerProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  stagger?: number;
  as?: 'div' | 'ul' | 'ol';
}

/** Parent that staggers the entrance of its <StaggerItem> children. */
export function Stagger({ children, stagger = 0.08, as = 'div', ...rest }: StaggerProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component initial="hidden" whileInView="visible" viewport={{ once: true, margin: '0px 0px -60px 0px' }} variants={containerVariants} custom={stagger} {...rest}>
      {children}
    </Component>
  );
}

interface StaggerItemProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  as?: 'div' | 'li' | 'article';
}

export function StaggerItem({ children, as = 'div', style, ...rest }: StaggerItemProps) {
  const reduce = useReducedMotion();
  const Component = motion[as] as typeof motion.div;
  return (
    <Component variants={reduce ? staggerItemVariantsReduced : staggerItemVariants} style={{ ...translateStyle, ...style }} {...rest}>
      {children}
    </Component>
  );
}

import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { formatNumber } from '@/utils/format';

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}

/** Animates a number from 0 when scrolled into view. Screen readers get the final value immediately. */
export function CountUp({ value, prefix = '', suffix = '', duration = 1.8, decimals = 0, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, reduce, value, duration]);

  const shown = reduce ? value : display;
  const formatted = decimals > 0 ? shown.toFixed(decimals) : formatNumber(Math.round(shown));
  const final = decimals > 0 ? value.toFixed(decimals) : formatNumber(value);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">
        {prefix}
        {formatted}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {final}
        {suffix}
      </span>
    </span>
  );
}

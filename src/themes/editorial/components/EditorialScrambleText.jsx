import React, { useState, useEffect, useRef, useCallback } from 'react';
import { editorialAudio } from '../editorialAudio';

const CAD_GLYPHS = '0123456789ABCDEF_//\\[]+-*=<>~#%!?';

/**
 * useTextScramble Hook
 * Simulates a high-precision CAD / terminal cypher text unscramble effect.
 * Resolves character-by-character from left to right.
 * 
 * Features:
 * - IntersectionObserver: Automatically unscrambles when scrolled into view
 * - Hover Interaction: Keeps unscrambling whenever hovered by the user
 * - Mount Option: For immediate hero header reveal on initial page load
 * - Accessible: Respects prefers-reduced-motion and provides aria-label
 */
export function useTextScramble(originalText, {
  triggerOnMount = false,
  triggerOnScroll = true,
  triggerOnHover = true,
  once = true,
  speed = 26,
  playAudio = false
} = {}) {
  const [displayText, setDisplayText] = useState(originalText);
  const isAnimatingRef = useRef(false);
  const intervalRef = useRef(null);
  const elementRef = useRef(null);
  const hasScrolledIntoViewRef = useRef(false);

  const startScramble = useCallback(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayText(originalText);
      return;
    }

    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    if (playAudio) {
      editorialAudio.playKey();
    }

    const length = originalText.length;
    let step = 0;

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return originalText
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '\n' || char === '\t') return char;
            if (index < Math.floor(step)) {
              return originalText[index];
            }
            return CAD_GLYPHS[Math.floor(Math.random() * CAD_GLYPHS.length)];
          })
          .join('');
      });

      step += 0.6; // Snappy left-to-right cadence

      if (step >= length) {
        clearInterval(intervalRef.current);
        setDisplayText(originalText);
        isAnimatingRef.current = false;
      }
    }, speed);
  }, [originalText, speed, playAudio]);

  // Mount Trigger (if explicitly enabled)
  useEffect(() => {
    if (triggerOnMount) {
      const timer = setTimeout(() => {
        startScramble();
      }, 80);
      return () => {
        clearTimeout(timer);
        clearInterval(intervalRef.current);
      };
    } else {
      setDisplayText(originalText);
    }
    return () => clearInterval(intervalRef.current);
  }, [originalText, triggerOnMount, startScramble]);

  // Scroll into view (IntersectionObserver) Trigger
  useEffect(() => {
    if (!triggerOnScroll) return;
    const el = elementRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (once && hasScrolledIntoViewRef.current) return;
            hasScrolledIntoViewRef.current = true;
            startScramble();
            if (once) {
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [triggerOnScroll, startScramble, once]);

  // Hover Trigger (Always allows interactive re-scramble on mouse enter)
  const handleMouseEnter = useCallback(() => {
    if (triggerOnHover && !isAnimatingRef.current) {
      startScramble();
    }
  }, [triggerOnHover, startScramble]);

  return { displayText, trigger: startScramble, onMouseEnter: handleMouseEnter, ref: elementRef };
}

/**
 * EditorialScrambleText Component
 * Wraps text in an accessible animated CAD cypher container.
 */
export default function EditorialScrambleText({
  text,
  children,
  as: Component = 'span',
  className = '',
  triggerOnMount = false,
  triggerOnScroll = true,
  triggerOnHover = true,
  once = true,
  speed = 26,
  playAudio = false,
  ...props
}) {
  const targetText = text || (typeof children === 'string' ? children : '') || '';
  const { displayText, onMouseEnter, ref } = useTextScramble(targetText, {
    triggerOnMount,
    triggerOnScroll,
    triggerOnHover,
    once,
    speed,
    playAudio
  });

  return (
    <Component
      ref={ref}
      className={`editorial-scramble-text ${className}`}
      onMouseEnter={onMouseEnter}
      aria-label={targetText}
      {...props}
    >
      {displayText}
    </Component>
  );
}

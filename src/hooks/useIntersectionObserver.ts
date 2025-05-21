import { useEffect, useRef, useState } from "react";

type UseIntersectionObserverProps = {
  threshold?: number;
  rootMargin?: string;
};

export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = "0px",
}: UseIntersectionObserverProps = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold, rootMargin },
    );

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [threshold, rootMargin]);

  return { targetRef, isIntersecting };
};

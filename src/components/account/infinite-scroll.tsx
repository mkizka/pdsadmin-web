import { useEffect, useRef } from "react";

type InfiniteScrollProps = {
  onIntersect: () => void;
  isLoading: boolean;
  hasNextPage: boolean;
  rootMargin?: string;
};

export function InfiniteScroll({
  onIntersect,
  isLoading,
  hasNextPage,
  rootMargin = "100px",
}: InfiniteScrollProps) {
  const targetRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isLoading) {
          onIntersect();
        }
      },
      { threshold: 0.1, rootMargin },
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
  }, [onIntersect, hasNextPage, isLoading, rootMargin]);

  if (!hasNextPage) {
    return null;
  }

  return (
    <li ref={targetRef} className="list-row h-14">
      <div className="list-col-grow flex justify-center items-center">
        {isLoading && <span className="loading loading-spinner"></span>}
      </div>
    </li>
  );
}

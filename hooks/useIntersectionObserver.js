import { useEffect, useState } from "react";

export function useIntersectionObserver(
  node,
  { threshold = 0, root = null, rootMargin = "0%", onIntersect } = {}
) {
  const [entry, setEntry] = useState();

  const updateEntry = ([entry]) => {
    setEntry(entry);

    if (entry.isIntersecting && onIntersect) {
      onIntersect();
    }
  };

  useEffect(() => {
    const hasSupport = !!window.IntersectionObserver;

    if (!hasSupport || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node, threshold, root, rootMargin]);

  return entry;
}

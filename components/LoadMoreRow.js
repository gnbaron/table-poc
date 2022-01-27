import { useState } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

export const LoadMoreRow = ({ className, isLoading, onLoadMore }) => {
  const [loadMoreRef, setLoadMoreRef] = useState(null);

  useIntersectionObserver(loadMoreRef, { onIntersect: onLoadMore });

  return (
    <div className={className} ref={setLoadMoreRef}>
      {isLoading ? "loading" : null}
    </div>
  );
};

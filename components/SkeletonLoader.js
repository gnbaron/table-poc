import React from "react"
import ContentLoader from "react-content-loader"

export const SkeletonLoader = ({ odd, width, ...props }) => (
  <ContentLoader
    {...props}
    animate={odd ? false : true}
    backgroundColor={odd ? "#f9f9f9" : "#f4f2f9"}
    foregroundColor={odd ? "#f9f9f9" : "#eceaf0"}
    speed={1}
    viewBox={`0 0 ${width} 40`}
  >
    <rect x="0" y="0" width={width} height="40" />
  </ContentLoader>
)

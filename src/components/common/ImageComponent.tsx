"use client";

import Image from "next/image";
import { FC, useState } from "react";

interface ImageComponentProps {
  width?: number;
  height?: number;
  src: string | undefined;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
}

const ImageComponent: FC<ImageComponentProps> = ({
  width,
  height,
  src,
  alt,
  fill,
  className,
  sizes,
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(src);

  const handleOnError = () => {
    setImageUrl("/images/no-image-icon.jpg");
  };

  return (
    <Image
      width={width}
      height={height}
      fill={fill}
      src={imageUrl ?? "/images/no-image-icon.jpg"}
      alt={alt}
      className={className}
      onError={handleOnError}
      sizes={sizes}
    />
  );
};

export default ImageComponent;

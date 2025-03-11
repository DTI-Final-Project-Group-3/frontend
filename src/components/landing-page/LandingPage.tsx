import Image from "next/image";
import { useEffect, useState } from "react";

const dummyImages = Array.from({ length: 7 }, (_, i) => `/images/carousel-${i + 1}.jpg`);

export default function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleImages, setVisibleImages] = useState(3);
  const totalImages = dummyImages.length;

  useEffect(() => {
    const updateVisibleImages = () => {
      setVisibleImages(window.innerWidth < 768 ? 1 : 3);
    };
    updateVisibleImages();
    window.addEventListener("resize", updateVisibleImages);
    return () => window.removeEventListener("resize", updateVisibleImages);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
  };

  return (
    <div className="relative flex h-[60vh] w-full flex-col items-center justify-center bg-gray-800 text-white md:h-[60vh]">
      {/* Background Image */}
      <Image
        src="/images/landing-bg.jpg"
        alt="Landing Page Background"
        fill
        className="absolute object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center px-6">
        <h1 className="text-4xl font-bold md:text-5xl">Welcome to Our Store</h1>
        <p className="mt-2 text-lg md:text-xl">
          Explore our amazing collection of products with high-quality standards.
        </p>
      </div>

      {/* Product Carousel */}
      <div className="relative mt-6 w-full max-w-3xl flex items-center justify-center md:mt-4">
        <button
          className="absolute left-0 z-10 p-3 bg-white/80 rounded-full shadow-md hover:bg-white transition"
          onClick={prevSlide}
        >
          ←
        </button>
        <div className="flex items-center justify-center w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {[...Array(visibleImages)].map((_, i) => {
              const imageIndex = (currentIndex + i) % totalImages;
              return (
                <div key={imageIndex} className="flex-shrink-0 w-40 h-40 md:w-48 md:h-48">
                  <Image src={dummyImages[imageIndex]} alt={`Carousel ${imageIndex + 1}`} width={192} height={192} className="object-cover rounded-lg" />
                </div>
              );
            })}
          </div>
        </div>
        <button
          className="absolute right-0 z-10 p-3 bg-white/80 rounded-full shadow-md hover:bg-white transition"
          onClick={nextSlide}
        >
          →
        </button>
      </div>
    </div>
  );
}
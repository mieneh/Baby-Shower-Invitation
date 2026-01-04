import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";

interface PlayfulGalleryProps {
  images: string[];
}

export function PlayfulGallery({ images }: PlayfulGalleryProps) {
  if (!images || images.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative max-w-md mx-auto">
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl">
        <div className="aspect-[3/4] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.35 }}
              className="w-full h-full"
            >
              <ImageWithFallback
                src={images[currentIndex]}
                alt={`Khoảnh khắc ${currentIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2.5 h-2.5 rounded-full ${
                i === currentIndex ? "bg-pink-400" : "bg-pink-200"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import React from 'react';

interface ImageGridProps {
  images: string[];
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
  const count = images.length;

  if (count === 0) return null;

  const containerStyle = "mt-3 overflow-hidden border border-zinc-200 dark:border-zinc-800 rounded-2xl grid gap-0.5";

  if (count === 1) {
    return (
      <div className="mt-3 overflow-hidden border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-100 dark:bg-zinc-900">
        <img 
          src={images[0]} 
          alt="Tweet" 
          className="w-full h-auto max-h-[600px] object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className={`${containerStyle} grid-cols-2`}>
        {images.map((img, i) => (
          <div key={i} className="aspect-[7/8] overflow-hidden">
            <img 
              src={img} 
              alt={`Tweet ${i}`} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className={`${containerStyle} grid-cols-2 aspect-[14/9]`}>
        <div className="h-full overflow-hidden border-r border-zinc-200 dark:border-zinc-800">
          <img 
            src={images[0]} 
            alt="Tweet 0" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="grid grid-rows-[1fr_1fr] gap-0.5 h-full overflow-hidden">
          <div className="relative h-full w-full overflow-hidden">
            <img 
              src={images[1]} 
              alt="Tweet 1" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative h-full w-full overflow-hidden">
            <img 
              src={images[2]} 
              alt="Tweet 2" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    );
  }

  if (count >= 4) {
    // Twitter usually shows 4 images in a 2x2 grid.
    // User requested 2:1 ratio for 4 images.
    return (
      <div className={`${containerStyle} grid-cols-2 grid-rows-2`}>
        {images.slice(0, 4).map((img, i) => (
          <div key={i} className="aspect-[2/1] overflow-hidden">
            <img 
              src={img} 
              alt={`Tweet ${i}`} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
      </div>
    );
  }

  return null;
};

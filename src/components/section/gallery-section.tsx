/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import { ImageIcon } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

const ASPECT_RATIOS = [
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-square",
];

export default function GallerySection() {
  return (
    <div className="columns-2 sm:columns-3 gap-4 [&>*]:mb-4">
      {DATA.gallery.map((photo, id) => {
        const aspect = ASPECT_RATIOS[id % ASPECT_RATIOS.length];
        return (
          <BlurFade
            key={photo.alt || id}
            delay={BLUR_FADE_DELAY * 6 + id * 0.05}
            className="break-inside-avoid"
          >
            {photo.src ? (
              <img
                src={photo.src}
                alt={photo.alt}
                className={`w-full rounded-xl border border-border object-cover ${aspect}`}
              />
            ) : (
              <div
                className={`w-full rounded-xl border border-dashed border-border bg-muted/40 flex flex-col items-center justify-center gap-1.5 text-muted-foreground ${aspect}`}
              >
                <ImageIcon className="size-5" aria-hidden />
                <span className="text-xs">{photo.alt}</span>
              </div>
            )}
          </BlurFade>
        );
      })}
    </div>
  );
}

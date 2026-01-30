"use client";

/**
 * Homepage grid: three collection tiles. First row = Chairs, Paintings; second row = Interior Design (full width).
 * Each tile uses RotatingCover to crossfade through random images from that collection, with per-tile phase offset.
 */

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { CollectionInfo } from "@/lib/photos";

/**
 * Renders the three collection tiles with rotating covers and minimal spacing.
 */
export default function CollectionGrid({ collections }: { collections: CollectionInfo[] }) {
  if (collections.length === 0) return null;

  return (
    <div className="w-full p-0.5 sm:p-1 box-border">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-0.5 sm:grid-cols-2 sm:gap-1">
        {collections.map((col, i) => (
          <Link
            key={col.slug}
            href={`/collections/${col.slug}`}
            className={`relative block aspect-[4/3] overflow-hidden rounded-md group ${i === 2 ? "sm:col-span-2 sm:aspect-[3/1]" : ""}`}
          >
            <RotatingCover photos={col.photos} alt={col.title} phaseOffset={i * 1200} />
            <div
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-start p-1.5"
              aria-hidden
            >
              <span className="text-white text-sm font-medium">
                {col.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const CROSSFADE_DURATION_MS = 700;
const ROTATION_INTERVAL_MS = 4500;

/**
 * Crossfades through random images from the collection. phaseOffset (ms) delays the first transition so tiles are dephased.
 */
function RotatingCover({
  photos,
  alt,
  phaseOffset = 0,
}: {
  photos: { src: string }[];
  alt: string;
  phaseOffset?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [incomingOpacity, setIncomingOpacity] = useState(0);
  const currentRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  currentRef.current = currentIndex;

  // Trigger incoming image to fade in (0 → 1) after mount
  useEffect(() => {
    if (!isTransitioning) {
      setIncomingOpacity(0);
      return;
    }
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIncomingOpacity(1));
    });
    return () => cancelAnimationFrame(raf);
  }, [isTransitioning, nextIndex]);

  useEffect(() => {
    if (photos.length <= 1) return;

    const phaseTimeout = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        let next = Math.floor(Math.random() * photos.length);
        if (photos.length > 1 && next === currentRef.current) {
          next = (next + 1) % photos.length;
        }
        setNextIndex(next);
        setIsTransitioning(true);

        if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = setTimeout(() => {
          setCurrentIndex(next);
          setIsTransitioning(false);
          transitionTimeoutRef.current = null;
        }, CROSSFADE_DURATION_MS);
      }, ROTATION_INTERVAL_MS);
    }, phaseOffset);

    return () => {
      clearTimeout(phaseTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    };
  }, [photos.length, phaseOffset]);

  const currentSrc = photos[currentIndex]?.src ?? photos[0].src;
  const nextSrc = photos[nextIndex]?.src ?? photos[0].src;
  const showTwo = isTransitioning && nextSrc !== currentSrc;

  return (
    <div className="absolute inset-0 bg-muted">
      {/* Outgoing: fades out when transitioning */}
      <Image
        key={`current-${currentIndex}`}
        src={currentSrc}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        style={{
          opacity: showTwo ? 0 : 1,
          transition: `opacity ${CROSSFADE_DURATION_MS}ms ease-in-out`,
        }}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      {/* Incoming: fades in from 0 to 1 */}
      {showTwo && (
        <Image
          key={`next-${nextIndex}`}
          src={nextSrc}
          alt={alt}
          fill
          className="absolute inset-0 object-cover transition-transform duration-300 group-hover:scale-105"
          style={{
            opacity: incomingOpacity,
            transition: `opacity ${CROSSFADE_DURATION_MS}ms ease-in-out`,
          }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      )}
    </div>
  );
}

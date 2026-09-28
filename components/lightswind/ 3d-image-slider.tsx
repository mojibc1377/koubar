/* eslint-disable @next/next/no-img-element */
/*Ensure you have installed the package
or read our installation document. (go to lightswind.com/components/Installation)
npm i lightswind@latest*/

"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getImageUrl } from "@/lib/storage";

const DEFAULT_DATA = [
  "/images/Koubar-1.webp",

  "/images/Koubar-48.webp",
  "/images/Koubar-55.webp",
      "/images/Koubar-25.webp",
  "/images/Koubar-14.webp",
  "/images/Koubar-1.webp",
  "/images/Koubar-49.webp",
  "/images/Koubar-56.webp",
  "/images/Koubar-67.webp",
  "/images/Koubar-25.webp",
  "/images/Koubar-48.webp",
];

interface Slider3DProps {
  /** Array of image URLs to display */
  images?: string[];
  /** Duration of one full 360-degree rotation (in seconds) */
  duration?: number;
  /** Width of each card. Can be px, rem, em, etc. */
  cardWidth?: string;
  /** CSS aspect ratio of the cards */
  cardAspectRatio?: string;
  /** CSS perspective value for the 3D container */
  perspective?: string;
  /** Additional classes for the outermost container */
  containerClassName?: string;
  /** Additional classes for the individual image elements */
  imageClassName?: string;
  /** Direction of the rotation */
  rotationDirection?: "left" | "right";
  /** Whether to apply a gradient fade mask on the edges */
  withMask?: boolean;
}

export default function ImageSlider3D({
  images = DEFAULT_DATA,
  duration = 32,
  cardWidth = "17.5em",
  cardAspectRatio = "7/10",
  perspective = "35em",
  containerClassName = "",
  imageClassName = "",
  rotationDirection = "left",
  withMask = true,
}: Slider3DProps) {
  const n = images.length;
  const prefersReducedMotion = useReducedMotion();
  const animationDuration = prefersReducedMotion ? duration * 4 : duration;

  // rotation angles based on direction
  const rotationValues = rotationDirection === "left" ? [0, 360] : [360, 0];

  const maskStyles = withMask
    ? {
      WebkitMask:
        "linear-gradient(90deg, transparent, #000 20% 80%, transparent)",
      mask: "linear-gradient(90deg, transparent, #000 20% 80%, transparent)",
    }
    : {};

  return (
    <div
      className={`grid w-full h-full min-h-125 overflow-hidden place-items-center ${containerClassName}`}
      style={{
        perspective: perspective,
        ...maskStyles,
      }}
    >
      <motion.div
        className="grid place-self-center pointer-events-auto"
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateY: rotationValues,
        }}
        transition={{
          duration: animationDuration,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        
        {images.map((src, i) => (

<img
            key={i}
            src={getImageUrl(src)}
            alt={`Slide ${i}`}
            className={`col-start-1 bg-foreground row-start-1 object-cover rounded-[1.5em] ${imageClassName}`}
            style={{
              width: cardWidth,
              aspectRatio: cardAspectRatio,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: `rotateY(calc(${i} * (1turn / ${n}))) translateZ(calc(-1 * (0.5 * ${cardWidth} + 0.5em) / tan(0.5 * (1turn / ${n}))))`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

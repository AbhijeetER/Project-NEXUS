"use client";
import { motion } from "motion/react";
import React from "react";

export const Loader = ({ text = "Starting Neural Engine...." }) => {
  return (
    <div
      className="
        w-full 
        flex justify-center items-center 
        px-4   /* padding on mobile to avoid overflow */
      "
    >
      <div
        className="
          relative font-bold text-black dark:text-white 
          max-w-full 
          text-center 
          break-words 
          text-lg sm:text-xl md:text-2xl 
        "
        style={{ perspective: "1000px" }}
      >
        {/* Main Text */}
        <motion.span
          animate={{
            skew: [0, -40, 0],
            scaleX: [1, 2, 1],
          }}
          transition={{
            duration: 0.05,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 2,
            ease: "linear",
            times: [0, 0.2, 0.5, 0.8, 1],
          }}
          className="relative z-20 inline-block"
        >
          {text}
        </motion.span>

        {/* Green Glow Layer */}
        <motion.span
          className="absolute inset-0 text-[#00e571]/50 blur-[0.5px] dark:text-[#00e571]"
          animate={{
            x: [-2, 4, -3, 1.5, -2],
            y: [-2, 4, -3, 1.5, -2],
            opacity: [0.3, 0.9, 0.4, 0.8, 0.3],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
            times: [0, 0.2, 0.5, 0.8, 1],
          }}
        >
          {text}
        </motion.span>

        {/* Purple Glow Layer */}
        <motion.span
          className="absolute inset-0 text-[#8b00ff]/50 dark:text-[#8b00ff]"
          animate={{
            x: [0, 1, -1.5, 1.5, -1, 0],
            y: [0, -1, 1.5, -0.5, 0],
            opacity: [0.4, 0.8, 0.3, 0.9, 0.4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
            times: [0, 0.3, 0.6, 0.8, 1],
          }}
        >
          {text}
        </motion.span>
      </div>
    </div>
  );
};

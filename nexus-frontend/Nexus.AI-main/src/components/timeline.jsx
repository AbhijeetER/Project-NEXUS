"use client";;
import { useScroll, useTransform, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

/* ── Per-item reveal component (hook in component = valid) ── */
function TimelineItem({ item, index }) {
  const rowRef = useRef(null);
  const DELAYS = ['reveal-d0', 'reveal-d1', 'reveal-d2', 'reveal-d3'];
  const delayClass = DELAYS[index % 4];

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      className={`reveal ${delayClass} flex justify-start pt-10 md:pt-20 md:gap-10`}
    >
      {/* ── Sticky title column ── */}
      <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
        {/* Timeline dot */}
        <div
          className="h-10 absolute left-3 md:left-3 w-10 rounded-full flex items-center justify-center"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
        >
          <div
            className="h-3 w-3 rounded-full"
            style={{ background: 'var(--accent)', opacity: 0.65 }}
          />
        </div>

        {/* Desktop: title beside dot */}
        <h3
          className="hidden md:block text-xl md:pl-20 md:text-4xl font-semibold"
          style={{ color: 'var(--text-muted)', letterSpacing: '-0.01em', lineHeight: 1.2 }}
        >
          {item.title}
        </h3>
      </div>

      {/* ── Content column ── */}
      <div className="relative pl-20 pr-4 md:pl-4 w-full">
        {/* Mobile: title above content */}
        <h3
          className="md:hidden block text-2xl mb-4 text-left font-semibold"
          style={{ color: 'var(--text-muted)' }}
        >
          {item.title}
        </h3>

        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '1.5rem',
          }}
        >
          {item.content}
        </div>
      </div>
    </div>
  );
}

export const Timeline = ({ data }) => {
  const ref          = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) setHeight(ref.current.getBoundingClientRect().height);
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform  = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full font-sans md:px-10"
      style={{ backgroundColor: "var(--bg-base)" }}
      ref={containerRef}
    >
      <div ref={ref} className="relative max-w-7xl mx-auto pb-24">
        {data.map((item, index) => (
          <TimelineItem key={index} item={item} index={index} />
        ))}

        {/* ── Vertical progress track ── */}
        <div
          style={{
            position: 'absolute',
            left: 32,
            top: 0,
            width: 2,
            height: height + "px",
            background: 'var(--border-subtle)',
            overflow: 'hidden',
          }}
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-full rounded-full"
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 0%, #4a6fa5 40%, #2d4a72 100%)',
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

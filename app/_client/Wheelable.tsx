"use client";

import { gsap } from "gsap";
import { zoomStore } from "@/app/_hooks/useZoomStore";
import useWheelEvent from "@/app/_hooks/useWheelEvent";
import { subV } from "@/app/_hooks/utils";
import React, { useRef, useEffect } from "react";

export default function Wheelable(props: React.HTMLProps<HTMLDivElement>) {
  const { children } = props;
  const ref = useRef<HTMLDivElement>(null!);
  const cache = useRef({ clientX: 0, clientY: 0 }).current;

  const wheel = useWheelEvent((state) => {
    const { active, offset, delta, event } = state;
    const isZoom = (event as any).ctrlKey;
    if (isZoom && active) subV(offset, delta, offset); // revert

    let [x, y] = offset;
    // reverse
    x *= -1;
    y *= -1;

    event.preventDefault();

    if (isZoom) {
      const { clientX, clientY } = cache;
      const dz = (-delta[1] / 750) * (zoomStore.zoom * 10);
      const dx = (-dz * (clientX - 240 - x)) / zoomStore.zoom;
      const dy = (-dz * (clientY - 48 - y)) / zoomStore.zoom;

      // coord
      x += dx;
      y += dy;

      offset[0] = -x;
      offset[1] = -y;

      zoomStore.zoom = Math.max(0.02, zoomStore.zoom + dz);

      gsap.set(ref.current, { x, y, scale: zoomStore.zoom, duration: 0.1 });

      return;
    }

    // @TODO FIX
    zoomStore.zoom = zoomStore.zoom;
    gsap.set(ref.current, { x, y, duration: 0.1 });
  });

  useEffect(() => {
    const handleMove = (e: { clientX: number; clientY: number }) => {
      const { clientX, clientY } = e;
      Object.assign(cache, { clientX, clientY });
    };

    window.addEventListener("mousemove", handleMove);
    wheel.onMount(ref.current.parentElement as any);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      wheel.onClean();
    };
  });

  return (
    <div ref={ref} className="scale-[0.5] origin-top-left w-full h-full">
      {children}
    </div>
  );
}

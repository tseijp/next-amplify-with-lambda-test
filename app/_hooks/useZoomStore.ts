"use client";

import { useSyncExternalStore } from "react";

let zoom = 0.5;

const listeners = new Set<Function>();

const sub = (update = () => {}) => {
  listeners.add(update);

  return () => {
    listeners.delete(update);
  };
};

export const zoomStore = {
  get zoom() {
    return zoom;
  },
  set zoom(value) {
    zoom = value;
    listeners.forEach((f) => f());
  },
  sub,
};

export default function useZoomStore() {
  return useSyncExternalStore(
    sub,
    () => zoom,
    () => zoom
  );
}

export function ZoomPercent() {
  const zoom = useZoomStore();
  return `${(zoom * 100) << 0}%`;
}

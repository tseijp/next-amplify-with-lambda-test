"use client";

import React from "react";
import useBounding from "@/app/_hooks/useBounding";

export default function Bounding(props: React.HTMLProps<HTMLDivElement>) {
  const ref = useBounding<HTMLDivElement>();
  return <div ref={ref} {...props} />;
}

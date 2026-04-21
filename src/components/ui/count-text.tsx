"use client";

import { animate, useMotionValue } from "motion/react";
import { useEffect, useState } from "react";

export default function CountText({ target }: { target: number }) {
  const count = useMotionValue(0);
  const [countEnd, setCountEnd] = useState(0);

  useEffect(() => {
    const start = Math.floor(Math.random() * 500);

    count.set(start);

    const controls = animate(count, target, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate(latest) {
        setCountEnd(Math.floor(latest));
      },
    });

    return () => controls.stop();
  }, [count, target]);

  return <>{countEnd}</>;
}

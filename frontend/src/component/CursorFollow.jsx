import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CursorFollow = () => {
    const [hasMoved, setHasMoved] = useState(false);
  // Valeurs brutes du curseur
  const mouseX = useMotionValue(window.innerWidth / 2);
  const mouseY = useMotionValue(window.innerHeight / 2);

  // On lisse le mouvement avec useSpring
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });


  useEffect(() => {
    const moveCursor = (event) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      if (!hasMoved) setHasMoved(true);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [mouseX, mouseY, hasMoved]);

  if (!hasMoved) return null; // Ne rien afficher tant que la souris n'a pas bougé

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "min-content",
        height: 30,
        whiteSpace: "nowrap",
        padding: "10px 15px",
        borderRadius: "0.5rem",
        backgroundColor: "white",
        pointerEvents: "none",
        zIndex: 9999,
        translateX: springX,
        translateY: springY,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        color: "black",
        userSelect: "none",
        transform: "translate(-50%, -50%)", 
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
      }}
    >
      Droppez une carte dessus
    </motion.div>
  );
};

export default CursorFollow;

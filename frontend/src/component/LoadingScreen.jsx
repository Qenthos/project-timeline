import React from "react";
import "./LoadingScreen.scss";
import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <p className="loading-screen__text">En cours de chargement</p>
      <div className="loading-screen__dots">
        {[0, 1, 2].map((dot, index) => (
          <motion.div
            key={index}
            className="loading-screen__dot"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              repeatType: "loop",
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;

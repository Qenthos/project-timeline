import React from "react";
import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 0 25px 0",
        height: "100vh",
      }}
    >
      <p style={{fontSize: '1.5rem'}}>En cours de chargement</p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "14px",
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((dot, index) => (
          <motion.div
            key={index}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              repeatType: "loop",
              delay: index * 0.2,
              ease: "easeInOut",
            }}
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "red",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;

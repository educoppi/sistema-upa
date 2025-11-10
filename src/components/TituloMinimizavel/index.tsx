'use client';
import React from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  title: string;
  isOpen: boolean;
  onAlterna: () => void;
  children?: React.ReactNode;
}

export default function TituloMinimizavel({ title, isOpen, onAlterna, children }: Props) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <h2
        onClick={onAlterna}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          fontSize: "1.4rem",
          color: "#0D9276",
          fontWeight: 700,
          userSelect: "none"
        }}
      >
        {isOpen ? (
          <FiChevronDown style={{ marginRight: "8px" }} />
        ) : (
          <FiChevronRight style={{ marginRight: "8px" }} />
        )}
        {title}
      </h2>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

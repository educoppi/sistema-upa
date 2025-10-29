'use client';
import React from "react";

interface Props {
  title: string;
  isOpen: boolean;
  onAlterna: () => void;
  children?: React.ReactNode; // permite conteúdo dentro
}

export default function TituloMinimizavel({ title, isOpen, onAlterna, children }: Props) {
  return (
    <div>
      <h2 
        style={{ cursor: "pointer" }}
        onClick={onAlterna}
      >
        {isOpen ? "▼" : "▶"} {title}
      </h2>

      {isOpen && children}
    </div>
  );
}

// components/ToggleTitle.tsx
import React from "react";

interface Props {
  title: string;
  isOpen: boolean;
  onAlterna: () => void;
}

export default function TituloMinimizavel({ title, isOpen, onAlterna }: Props) {
  return (
    <h2 
      style={{ cursor: "pointer" }}
      onClick={onAlterna}
    >
      {isOpen ? "▼" : "▶"} {title}
    </h2>
  );
}

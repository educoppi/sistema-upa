// components/ToggleTitle.tsx
import React from "react";

interface Props {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ToggleTitle({ title, isOpen, onToggle }: Props) {
  return (
    <h2 
      style={{ cursor: "pointer" }}
      onClick={onToggle}
    >
      {isOpen ? "▼" : "▶"} {title}
    </h2>
  );
}

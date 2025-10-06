// components/SegmentoCard.tsx
import React from "react";
import styles from "./styles.module.css";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function SegmentoCard({ children, className }: Props) {
  return (
    <div className={`${styles.segmentoCard} ${className ?? ""}`}>
      {children}
    </div>
  );
}


// pra quem nao conhece o CHILDREN é o conteudo que fica dentro do componente quando ele é usado, ou seja, tudo que for colocado entre as tags <SegmentoCard> e </SegmentoCard> vai ser passado como CHILDREN
//em vez de passar props específicas, o CHILDREN permite que o componente seja mais flexível e reutilizável, aceitando qualquer conteúdo que você queira colocar dentro dele
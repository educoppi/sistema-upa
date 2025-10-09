'use client'

import { Header } from "@/components/Header";

export default function Reception() {

  const token = localStorage.getItem('token');
  const usuarioString = localStorage.getItem('usuario');
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;

    return (
      <>
      <Header name={usuario?.name || "Usuário"}/>
      </>
    );
  }
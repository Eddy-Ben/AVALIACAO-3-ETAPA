import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

import * as regras from '../logic/livros';
import { livroStorage } from '../storage/asyncStorage';
import { DadosLivro, Livro } from '../types/Livro';

interface LivrosContextValue {
  livros: Livro[];
  carregando: boolean;
  buscarPorId: (id: string) => Livro | undefined;
  adicionar: (dados: DadosLivro) => void;
  editar: (id: string, dados: DadosLivro) => void;
  alternarLido: (id: string) => void;
  excluir: (id: string) => void;
}

const LivrosContext = createContext<LivrosContextValue | null>(null);

export function LivrosProvider({ children }: { children: ReactNode }) {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  // Evita salvar a lista vazia inicial por cima do que está no aparelho
  const jaCarregou = useRef(false);

  // Recupera os livros salvos quando o app abre
  useEffect(() => {
    livroStorage
      .carregar()
      .then(setLivros)
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar seus livros.'))
      .finally(() => {
        jaCarregou.current = true;
        setCarregando(false);
      });
  }, []);

  // Toda mudança na lista (cadastro, edição, leitura, exclusão) é salva
  useEffect(() => {
    if (!jaCarregou.current) return;
    livroStorage.salvar(livros).catch(() => {
      Alert.alert('Erro ao salvar', 'A última alteração pode não ter sido guardada no aparelho.');
    });
  }, [livros]);

  const valor: LivrosContextValue = {
    livros,
    carregando,
    buscarPorId: (id) => livros.find((livro) => livro.id === id),
    adicionar: (dados) =>
      setLivros((atuais) => regras.adicionarLivro(atuais, regras.criarLivro(dados, Date.now().toString()))),
    editar: (id, dados) => setLivros((atuais) => regras.atualizarLivro(atuais, id, dados)),
    alternarLido: (id) => setLivros((atuais) => regras.alternarLido(atuais, id)),
    excluir: (id) => setLivros((atuais) => regras.excluirLivro(atuais, id)),
  };

  return <LivrosContext.Provider value={valor}>{children}</LivrosContext.Provider>;
}

export function useLivros(): LivrosContextValue {
  const contexto = useContext(LivrosContext);
  if (!contexto) throw new Error('useLivros precisa estar dentro de <LivrosProvider>');
  return contexto;
}

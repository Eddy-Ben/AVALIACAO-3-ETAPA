// Guarda e recupera os livros. Recebe o armazenamento por parâmetro:
// no app é o AsyncStorage, nos testes é um objeto em memória.
import { Livro } from '../types/Livro';

export const CHAVE_LIVROS = '@minha-biblioteca/livros';

// Só o pedaço do AsyncStorage que o app usa
export interface ArmazenamentoChaveValor {
  getItem(chave: string): Promise<string | null>;
  setItem(chave: string, valor: string): Promise<void>;
}

export interface LivroStorage {
  carregar(): Promise<Livro[]>;
  salvar(livros: Livro[]): Promise<void>;
}

function ehLivro(valor: unknown): valor is Livro {
  if (typeof valor !== 'object' || valor === null) return false;
  const v = valor as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.titulo === 'string' &&
    typeof v.autor === 'string' &&
    typeof v.genero === 'string' &&
    typeof v.lido === 'boolean' &&
    (v.capaUri === null || typeof v.capaUri === 'string')
  );
}

export function criarLivroStorage(armazenamento: ArmazenamentoChaveValor): LivroStorage {
  return {
    async carregar() {
      const texto = await armazenamento.getItem(CHAVE_LIVROS);
      if (!texto) return [];
      try {
        const dados: unknown = JSON.parse(texto);
        return Array.isArray(dados) ? dados.filter(ehLivro) : [];
      } catch {
        return [];
      }
    },
    async salvar(livros) {
      await armazenamento.setItem(CHAVE_LIVROS, JSON.stringify(livros));
    },
  };
}

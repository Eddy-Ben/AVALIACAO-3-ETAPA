// Regras da biblioteca. Nada aqui depende do React Native,
// então dá para testar com o test runner do Node.
import { DadosLivro, ErrosLivro, Livro, ResumoLivros } from '../types/Livro';

export function validarLivro(dados: Pick<DadosLivro, 'titulo' | 'autor' | 'genero'>): ErrosLivro {
  const erros: ErrosLivro = {};
  if (!dados.titulo.trim()) erros.titulo = 'Informe o título.';
  if (!dados.autor.trim()) erros.autor = 'Informe o autor.';
  if (!dados.genero.trim()) erros.genero = 'Informe o gênero.';
  return erros;
}

function limpar(dados: DadosLivro): DadosLivro {
  return {
    titulo: dados.titulo.trim(),
    autor: dados.autor.trim(),
    genero: dados.genero.trim(),
    capaUri: dados.capaUri,
  };
}

export function criarLivro(dados: DadosLivro, id: string): Livro {
  return { id, ...limpar(dados), lido: false };
}

export function adicionarLivro(lista: Livro[], livro: Livro): Livro[] {
  return [livro, ...lista];
}

export function atualizarLivro(lista: Livro[], id: string, dados: DadosLivro): Livro[] {
  return lista.map((livro) => (livro.id === id ? { ...livro, ...limpar(dados) } : livro));
}

export function alternarLido(lista: Livro[], id: string): Livro[] {
  return lista.map((livro) => (livro.id === id ? { ...livro, lido: !livro.lido } : livro));
}

export function excluirLivro(lista: Livro[], id: string): Livro[] {
  return lista.filter((livro) => livro.id !== id);
}

export function resumirLivros(lista: Livro[]): ResumoLivros {
  const lidos = lista.filter((livro) => livro.lido).length;
  return { total: lista.length, lidos, naFila: lista.length - lidos };
}

// Tira acentos e deixa minúsculo, para "Ficção" casar com "ficcao"
function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function filtrarLivros(lista: Livro[], busca: string): Livro[] {
  const termo = normalizar(busca.trim());
  if (!termo) return lista;
  return lista.filter((livro) =>
    [livro.titulo, livro.autor, livro.genero].some((campo) => normalizar(campo).includes(termo))
  );
}

export function pluralizar(quantidade: number, singular: string, plural: string): string {
  return `${quantidade} ${quantidade === 1 ? singular : plural}`;
}

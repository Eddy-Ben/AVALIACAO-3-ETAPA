// Formato de cada livro guardado na biblioteca
export interface Livro {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  lido: boolean;
  // Endereço da foto da capa no aparelho, ou null quando o livro não tem capa
  capaUri: string | null;
}

// Dados que o formulário entrega (o id e o status de leitura são definidos pelo app)
export type DadosLivro = Pick<Livro, 'titulo' | 'autor' | 'genero' | 'capaUri'>;

// Campos de texto que o formulário valida
export type CampoObrigatorio = 'titulo' | 'autor' | 'genero';

export type ErrosLivro = Partial<Record<CampoObrigatorio, string>>;

export interface ResumoLivros {
  total: number;
  lidos: number;
  naFila: number;
}

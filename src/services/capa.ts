// Escolha da foto da capa pela câmera ou pela galeria.
// O expo-image-picker entra por parâmetro (veja capaNativa.ts), assim os
// casos de permissão negada e câmera indisponível podem ser testados.

export interface RespostaPermissao {
  granted: boolean;
  canAskAgain: boolean;
}

export interface ResultadoPicker {
  canceled: boolean;
  assets: { uri: string }[] | null;
}

export interface OpcoesPicker {
  mediaTypes: 'images'[];
  allowsEditing: boolean;
  aspect: [number, number];
  quality: number;
}

// Só as funções do expo-image-picker que o app usa
export interface PickerDeImagem {
  requestCameraPermissionsAsync(): Promise<RespostaPermissao>;
  requestMediaLibraryPermissionsAsync(): Promise<RespostaPermissao>;
  launchCameraAsync(opcoes: OpcoesPicker): Promise<ResultadoPicker>;
  launchImageLibraryAsync(opcoes: OpcoesPicker): Promise<ResultadoPicker>;
}

// Copia a imagem para uma pasta que o sistema não limpa e devolve o novo endereço
export type GuardarImagem = (uri: string) => Promise<string>;

export type ResultadoCapa =
  | { status: 'ok'; uri: string }
  | { status: 'cancelado' }
  | { status: 'sem-permissao'; podePerguntarDeNovo: boolean }
  | { status: 'indisponivel' };

export interface SeletorDeCapa {
  tirarFoto(): Promise<ResultadoCapa>;
  escolherDaGaleria(): Promise<ResultadoCapa>;
}

// Capa em pé, no formato de livro
const OPCOES: OpcoesPicker = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [2, 3],
  quality: 0.7,
};

export function criarSeletorDeCapa(picker: PickerDeImagem, guardarImagem: GuardarImagem): SeletorDeCapa {
  async function escolher(
    pedirPermissao: () => Promise<RespostaPermissao>,
    abrir: (opcoes: OpcoesPicker) => Promise<ResultadoPicker>
  ): Promise<ResultadoCapa> {
    let resultado: ResultadoPicker;
    try {
      const permissao = await pedirPermissao();
      if (!permissao.granted) {
        return { status: 'sem-permissao', podePerguntarDeNovo: permissao.canAskAgain };
      }
      resultado = await abrir(OPCOES);
    } catch {
      return { status: 'indisponivel' };
    }

    const uri = resultado.assets?.[0]?.uri;
    if (resultado.canceled || !uri) return { status: 'cancelado' };

    try {
      return { status: 'ok', uri: await guardarImagem(uri) };
    } catch {
      return { status: 'ok', uri };
    }
  }

  return {
    tirarFoto: () =>
      escolher(
        () => picker.requestCameraPermissionsAsync(),
        (opcoes) => picker.launchCameraAsync(opcoes)
      ),
    escolherDaGaleria: () =>
      escolher(
        () => picker.requestMediaLibraryPermissionsAsync(),
        (opcoes) => picker.launchImageLibraryAsync(opcoes)
      ),
  };
}

// Liga o seletor de capa ao expo-image-picker e ao expo-file-system
import * as ImagePicker from 'expo-image-picker';
import { Directory, File, Paths } from 'expo-file-system';

import { criarSeletorDeCapa, PickerDeImagem } from './capa';

const pickerExpo: PickerDeImagem = {
  requestCameraPermissionsAsync: () => ImagePicker.requestCameraPermissionsAsync(),
  requestMediaLibraryPermissionsAsync: () => ImagePicker.requestMediaLibraryPermissionsAsync(),
  launchCameraAsync: (opcoes) => ImagePicker.launchCameraAsync(opcoes),
  launchImageLibraryAsync: (opcoes) => ImagePicker.launchImageLibraryAsync(opcoes),
};

// A foto do picker fica numa pasta de cache que o sistema pode limpar.
// Copiamos para a pasta de documentos do app para a capa continuar lá depois de reabrir.
async function guardarNaPastaDoApp(uri: string): Promise<string> {
  const pasta = new Directory(Paths.document, 'capas');
  if (!pasta.exists) pasta.create();

  const extensao = uri.split('.').pop() || 'jpg';
  const destino = new File(pasta, `capa-${Date.now()}.${extensao}`);
  new File(uri).copy(destino);
  return destino.uri;
}

export const seletorDeCapa = criarSeletorDeCapa(pickerExpo, guardarNaPastaDoApp);

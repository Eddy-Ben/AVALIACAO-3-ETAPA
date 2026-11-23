/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { criarSeletorDeCapa, PickerDeImagem, RespostaPermissao, ResultadoPicker } from './capa';

const PERMITIDO: RespostaPermissao = { granted: true, canAskAgain: true };
const NEGADO: RespostaPermissao = { granted: false, canAskAgain: true };
const NEGADO_DE_VEZ: RespostaPermissao = { granted: false, canAskAgain: false };
const FOTO: ResultadoPicker = { canceled: false, assets: [{ uri: 'file:///cache/foto.jpg' }] };
const CANCELADO: ResultadoPicker = { canceled: true, assets: null };

// Picker de mentira que imita o expo-image-picker e conta quantas vezes abriu
function picker(config: {
  permissaoCamera?: () => Promise<RespostaPermissao>;
  permissaoGaleria?: () => Promise<RespostaPermissao>;
  camera?: () => Promise<ResultadoPicker>;
  galeria?: () => Promise<ResultadoPicker>;
}) {
  const aberturas = { camera: 0, galeria: 0 };
  const fake: PickerDeImagem = {
    requestCameraPermissionsAsync: config.permissaoCamera ?? (async () => PERMITIDO),
    requestMediaLibraryPermissionsAsync: config.permissaoGaleria ?? (async () => PERMITIDO),
    async launchCameraAsync() {
      aberturas.camera++;
      return (config.camera ?? (async () => FOTO))();
    },
    async launchImageLibraryAsync() {
      aberturas.galeria++;
      return (config.galeria ?? (async () => FOTO))();
    },
  };
  return { fake, aberturas };
}

const copiaParaDocumentos = async (uri: string) => uri.replace('/cache/', '/documentos/');

test('galeria sem permissão não abre o seletor e avisa que dá para pedir de novo', async () => {
  const { fake, aberturas } = picker({ permissaoGaleria: async () => NEGADO });
  const resultado = await criarSeletorDeCapa(fake, copiaParaDocumentos).escolherDaGaleria();
  assert.deepEqual(resultado, { status: 'sem-permissao', podePerguntarDeNovo: true });
  assert.equal(aberturas.galeria, 0);
});

test('câmera negada de vez informa que o usuário precisa ir nas configurações', async () => {
  const { fake, aberturas } = picker({ permissaoCamera: async () => NEGADO_DE_VEZ });
  const resultado = await criarSeletorDeCapa(fake, copiaParaDocumentos).tirarFoto();
  assert.deepEqual(resultado, { status: 'sem-permissao', podePerguntarDeNovo: false });
  assert.equal(aberturas.camera, 0);
});

test('usuário que fecha o seletor recebe status cancelado', async () => {
  const { fake } = picker({ galeria: async () => CANCELADO });
  const resultado = await criarSeletorDeCapa(fake, copiaParaDocumentos).escolherDaGaleria();
  assert.deepEqual(resultado, { status: 'cancelado' });
});

test('foto escolhida é copiada para uma pasta permanente antes de ser usada', async () => {
  const { fake } = picker({});
  const resultado = await criarSeletorDeCapa(fake, copiaParaDocumentos).escolherDaGaleria();
  assert.deepEqual(resultado, { status: 'ok', uri: 'file:///documentos/foto.jpg' });
});

test('câmera que lança erro (ex.: emulador sem câmera) vira status indisponível', async () => {
  const { fake } = picker({
    camera: async () => {
      throw new Error('Camera not available on simulator');
    },
  });
  const resultado = await criarSeletorDeCapa(fake, copiaParaDocumentos).tirarFoto();
  assert.deepEqual(resultado, { status: 'indisponivel' });
});

test('erro ao pedir permissão também vira status indisponível', async () => {
  const { fake } = picker({
    permissaoCamera: async () => {
      throw new Error('falhou');
    },
  });
  const resultado = await criarSeletorDeCapa(fake, copiaParaDocumentos).tirarFoto();
  assert.deepEqual(resultado, { status: 'indisponivel' });
});

test('se a cópia falhar, a capa usa o endereço original em vez de se perder', async () => {
  const { fake } = picker({});
  const copiaQuebrada = async () => {
    throw new Error('sem espaço');
  };
  const resultado = await criarSeletorDeCapa(fake, copiaQuebrada).tirarFoto();
  assert.deepEqual(resultado, { status: 'ok', uri: 'file:///cache/foto.jpg' });
});

test('resultado sem imagem é tratado como cancelado', async () => {
  const { fake } = picker({ galeria: async () => ({ canceled: false, assets: [] }) });
  const resultado = await criarSeletorDeCapa(fake, copiaParaDocumentos).escolherDaGaleria();
  assert.deepEqual(resultado, { status: 'cancelado' });
});

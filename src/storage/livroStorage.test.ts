/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { ArmazenamentoChaveValor, CHAVE_LIVROS, criarLivroStorage } from './livroStorage';
import { Livro } from '../types/Livro';

// Armazenamento em memória com a mesma interface do AsyncStorage
function armazenamentoEmMemoria(inicial: Record<string, string> = {}): ArmazenamentoChaveValor {
  const dados = { ...inicial };
  return {
    async getItem(chave) {
      return chave in dados ? dados[chave] : null;
    },
    async setItem(chave, valor) {
      dados[chave] = valor;
    },
  };
}

const exemplo: Livro = {
  id: '1',
  titulo: 'Dom Casmurro',
  autor: 'Machado de Assis',
  genero: 'Romance',
  lido: true,
  capaUri: 'file:///capa.jpg',
};

test('carregar devolve lista vazia quando nada foi salvo ainda', async () => {
  const storage = criarLivroStorage(armazenamentoEmMemoria());
  assert.deepEqual(await storage.carregar(), []);
});

test('o que foi salvo volta igual numa nova instância (app fechado e reaberto)', async () => {
  const disco = armazenamentoEmMemoria();
  await criarLivroStorage(disco).salvar([exemplo]);

  const depoisDeReabrir = criarLivroStorage(disco);
  assert.deepEqual(await depoisDeReabrir.carregar(), [exemplo]);
});

test('salvar uma lista menor mantém a exclusão depois de reabrir', async () => {
  const disco = armazenamentoEmMemoria();
  const storage = criarLivroStorage(disco);
  await storage.salvar([exemplo, { ...exemplo, id: '2' }]);
  await storage.salvar([exemplo]);
  assert.deepEqual((await criarLivroStorage(disco).carregar()).map((l) => l.id), ['1']);
});

test('carregar não quebra o app se o conteúdo salvo estiver corrompido', async () => {
  const storage = criarLivroStorage(armazenamentoEmMemoria({ [CHAVE_LIVROS]: '{isso não é json' }));
  assert.deepEqual(await storage.carregar(), []);
});

test('carregar ignora conteúdo que não é uma lista', async () => {
  const storage = criarLivroStorage(armazenamentoEmMemoria({ [CHAVE_LIVROS]: '{"a":1}' }));
  assert.deepEqual(await storage.carregar(), []);
});

test('carregar descarta itens sem os campos de um livro', async () => {
  const salvo = JSON.stringify([exemplo, { id: '2' }, null]);
  const storage = criarLivroStorage(armazenamentoEmMemoria({ [CHAVE_LIVROS]: salvo }));
  assert.deepEqual(await storage.carregar(), [exemplo]);
});

test('salvar repassa a falha do armazenamento para a tela poder avisar', async () => {
  const quebrado: ArmazenamentoChaveValor = {
    async getItem() {
      return null;
    },
    async setItem() {
      throw new Error('disco cheio');
    },
  };
  await assert.rejects(criarLivroStorage(quebrado).salvar([exemplo]), /disco cheio/);
});

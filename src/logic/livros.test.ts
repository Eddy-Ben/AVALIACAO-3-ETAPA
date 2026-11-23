/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  adicionarLivro,
  alternarLido,
  atualizarLivro,
  criarLivro,
  excluirLivro,
  filtrarLivros,
  pluralizar,
  resumirLivros,
  validarLivro,
} from './livros';
import { Livro } from '../types/Livro';

function livro(parcial: Partial<Livro> = {}): Livro {
  return {
    id: '1',
    titulo: 'Dom Casmurro',
    autor: 'Machado de Assis',
    genero: 'Romance',
    lido: false,
    capaUri: null,
    ...parcial,
  };
}

test('validarLivro aponta cada campo obrigatório vazio', () => {
  const erros = validarLivro({ titulo: '', autor: '', genero: '' });
  assert.ok(erros.titulo);
  assert.ok(erros.autor);
  assert.ok(erros.genero);
});

test('validarLivro trata campo só com espaços como vazio', () => {
  const erros = validarLivro({ titulo: '   ', autor: 'Machado', genero: 'Romance' });
  assert.ok(erros.titulo);
  assert.equal(erros.autor, undefined);
  assert.equal(erros.genero, undefined);
});

test('validarLivro não devolve erro quando tudo está preenchido', () => {
  const erros = validarLivro({ titulo: 'A', autor: 'B', genero: 'C' });
  assert.deepEqual(erros, {});
});

test('criarLivro limpa espaços, começa como não lido e guarda a capa', () => {
  const novo = criarLivro(
    { titulo: '  Dom Casmurro ', autor: ' Machado ', genero: ' Romance ', capaUri: 'file:///capa.jpg' },
    'abc'
  );
  assert.deepEqual(novo, {
    id: 'abc',
    titulo: 'Dom Casmurro',
    autor: 'Machado',
    genero: 'Romance',
    lido: false,
    capaUri: 'file:///capa.jpg',
  });
});

test('adicionarLivro coloca o novo livro no topo sem mudar a lista original', () => {
  const original = [livro({ id: '1' })];
  const resultado = adicionarLivro(original, livro({ id: '2' }));
  assert.deepEqual(resultado.map((l) => l.id), ['2', '1']);
  assert.equal(original.length, 1);
});

test('atualizarLivro troca os dados do livro certo e mantém id e status de leitura', () => {
  const lista = [livro({ id: '1', lido: true }), livro({ id: '2' })];
  const resultado = atualizarLivro(lista, '1', {
    titulo: ' Memórias Póstumas ',
    autor: 'Machado',
    genero: 'Romance',
    capaUri: null,
  });
  assert.equal(resultado[0].titulo, 'Memórias Póstumas');
  assert.equal(resultado[0].lido, true);
  assert.equal(resultado[0].id, '1');
  assert.equal(resultado[1], lista[1]);
});

test('alternarLido inverte o status só do livro indicado', () => {
  const lista = [livro({ id: '1' }), livro({ id: '2' })];
  const resultado = alternarLido(lista, '2');
  assert.equal(resultado[0].lido, false);
  assert.equal(resultado[1].lido, true);
});

test('excluirLivro remove o livro indicado', () => {
  const lista = [livro({ id: '1' }), livro({ id: '2' })];
  assert.deepEqual(excluirLivro(lista, '1').map((l) => l.id), ['2']);
});

test('resumirLivros conta total, lidos e na fila', () => {
  const lista = [livro({ id: '1', lido: true }), livro({ id: '2' }), livro({ id: '3' })];
  assert.deepEqual(resumirLivros(lista), { total: 3, lidos: 1, naFila: 2 });
});

test('filtrarLivros acha por título, autor ou gênero ignorando maiúsculas e acentos', () => {
  const lista = [
    livro({ id: '1', titulo: 'Memórias Póstumas', autor: 'Machado', genero: 'Romance' }),
    livro({ id: '2', titulo: 'Duna', autor: 'Frank Herbert', genero: 'Ficção científica' }),
  ];
  assert.deepEqual(filtrarLivros(lista, 'memorias').map((l) => l.id), ['1']);
  assert.deepEqual(filtrarLivros(lista, 'HERBERT').map((l) => l.id), ['2']);
  assert.deepEqual(filtrarLivros(lista, 'ficcao').map((l) => l.id), ['2']);
});

test('filtrarLivros com busca vazia devolve a lista inteira', () => {
  const lista = [livro({ id: '1' }), livro({ id: '2' })];
  assert.equal(filtrarLivros(lista, '  ').length, 2);
});

test('pluralizar escolhe singular só para 1', () => {
  assert.equal(pluralizar(1, 'livro', 'livros'), '1 livro');
  assert.equal(pluralizar(0, 'livro', 'livros'), '0 livros');
  assert.equal(pluralizar(3, 'livro', 'livros'), '3 livros');
});

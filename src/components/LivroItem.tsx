import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores } from '../theme';
import { Livro } from '../types/Livro';
import Botao from './Botao';
import CapaLivro from './CapaLivro';

interface LivroItemProps {
  livro: Livro;
  onAbrir: (id: string) => void;
  onAlternarLido: (id: string) => void;
}

// Card de cada livro na lista. Tocar no card abre os detalhes.
export default function LivroItem({ livro, onAbrir, onAlternarLido }: LivroItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${livro.titulo}, de ${livro.autor}. ${livro.lido ? 'Lido' : 'Não lido'}. Toque para ver detalhes.`}
      onPress={() => onAbrir(livro.id)}
      style={({ pressed }) => [styles.card, livro.lido && styles.cardLido, pressed && styles.pressionado]}
    >
      <CapaLivro uri={livro.capaUri} titulo={livro.titulo} largura={48} />

      <View style={styles.info}>
        <Text style={[styles.titulo, livro.lido && styles.tituloLido]} numberOfLines={2}>
          {livro.titulo}
        </Text>
        <Text style={styles.autor} numberOfLines={1}>
          {livro.autor}
        </Text>
        <View style={styles.tags}>
          <Text style={styles.genero}>{livro.genero}</Text>
          <Text style={[styles.status, livro.lido ? styles.statusLido : styles.statusPendente]}>
            {livro.lido ? 'Lido' : 'Não lido'}
          </Text>
        </View>
      </View>

      <Botao
        pequeno
        variante={livro.lido ? 'secundario' : 'primario'}
        titulo={livro.lido ? 'Desmarcar' : 'Marcar lido'}
        accessibilityLabel={`${livro.lido ? 'Desmarcar' : 'Marcar como lido'}: ${livro.titulo}`}
        onPress={() => onAlternarLido(livro.id)}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.cartao,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: cores.bege,
    gap: 12,
  },
  cardLido: {
    borderLeftColor: cores.verde,
    backgroundColor: cores.verdeClaro,
  },
  pressionado: {
    opacity: 0.85,
  },
  info: {
    flex: 1,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.textoForte,
  },
  tituloLido: {
    color: '#4C6B4A',
  },
  autor: {
    fontSize: 14,
    color: cores.texto,
    marginTop: 2,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 6,
  },
  genero: {
    fontSize: 12,
    color: cores.marrom,
    backgroundColor: cores.begeClaro,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  status: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  statusLido: {
    color: '#FFFFFF',
    backgroundColor: cores.verde,
  },
  statusPendente: {
    color: cores.amarelo,
    backgroundColor: cores.amareloClaro,
  },
});

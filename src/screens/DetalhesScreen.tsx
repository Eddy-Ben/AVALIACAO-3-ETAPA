import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import Botao from '../components/Botao';
import CapaLivro from '../components/CapaLivro';
import { useLivros } from '../context/LivrosContext';
import { PropsDaTela } from '../navigation/tipos';
import { cores } from '../theme';

// Consulta de um livro, com as ações de marcar como lido, editar e excluir
export default function DetalhesScreen({ navigation, route }: PropsDaTela<'Detalhes'>) {
  const { buscarPorId, alternarLido, excluir } = useLivros();
  const livro = buscarPorId(route.params.id);

  // Acontece por um instante depois da exclusão, antes de voltar para a lista
  if (!livro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.rotulo}>Este livro não existe mais.</Text>
      </View>
    );
  }

  function confirmarExclusao() {
    if (!livro) return;
    Alert.alert('Excluir livro', `Tem certeza que quer excluir "${livro.titulo}"? Não dá para desfazer.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          excluir(livro.id);
          navigation.goBack();
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <View style={styles.topo}>
        <CapaLivro uri={livro.capaUri} titulo={livro.titulo} largura={140} />
        <Text style={styles.titulo}>{livro.titulo}</Text>
        <Text style={styles.autor}>{livro.autor}</Text>
      </View>

      <View style={styles.card}>
        <Linha rotulo="Gênero" valor={livro.genero} />
        <Linha rotulo="Status" valor={livro.lido ? 'Lido' : 'Ainda não lido'} destaque={livro.lido} />
      </View>

      <View style={styles.acoes}>
        <Botao
          titulo={livro.lido ? 'Marcar como não lido' : 'Marcar como lido'}
          onPress={() => alternarLido(livro.id)}
        />
        <Botao
          variante="secundario"
          titulo="Editar"
          onPress={() => navigation.navigate('Formulario', { id: livro.id })}
        />
        <Botao variante="perigo" titulo="Excluir" onPress={confirmarExclusao} />
      </View>
    </ScrollView>
  );
}

function Linha({ rotulo, valor, destaque }: { rotulo: string; valor: string; destaque?: boolean }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={[styles.valor, destaque && styles.valorDestaque]}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: 16,
    paddingBottom: 40,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.fundo,
  },
  topo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: cores.textoForte,
    textAlign: 'center',
    marginTop: 14,
  },
  autor: {
    fontSize: 16,
    color: cores.texto,
    marginTop: 4,
  },
  card: {
    backgroundColor: cores.cartao,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: cores.borda,
  },
  rotulo: {
    color: cores.textoSuave,
    fontSize: 15,
  },
  valor: {
    color: cores.textoForte,
    fontSize: 15,
    fontWeight: '600',
  },
  valorDestaque: {
    color: cores.verde,
  },
  acoes: {
    gap: 10,
  },
});

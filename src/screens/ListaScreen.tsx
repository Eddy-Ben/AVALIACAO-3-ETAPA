import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Botao from '../components/Botao';
import LivroItem from '../components/LivroItem';
import ResumoLeitura from '../components/ResumoLeitura';
import { useLivros } from '../context/LivrosContext';
import { filtrarLivros, resumirLivros } from '../logic/livros';
import { PropsDaTela } from '../navigation/tipos';
import { cores } from '../theme';

// Tela inicial: indicadores, busca e lista de livros
export default function ListaScreen({ navigation }: PropsDaTela<'Lista'>) {
  const { livros, carregando, alternarLido } = useLivros();
  const [busca, setBusca] = useState<string>('');
  const insets = useSafeAreaInsets();

  const visiveis = filtrarLivros(livros, busca);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={cores.marromMedio} />
        <Text style={styles.vazio}>Abrindo sua estante...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ResumoLeitura resumo={resumirLivros(livros)} />

      <FlatList
        data={visiveis}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          livros.length > 0 ? (
            <TextInput
              style={styles.busca}
              placeholder="Buscar por título, autor ou gênero"
              placeholderTextColor={cores.textoSuave}
              value={busca}
              onChangeText={setBusca}
              clearButtonMode="while-editing"
              accessibilityLabel="Buscar livros"
            />
          ) : undefined
        }
        renderItem={({ item }) => (
          <LivroItem
            livro={item}
            onAbrir={(id) => navigation.navigate('Detalhes', { id })}
            onAlternarLido={alternarLido}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            {livros.length === 0
              ? 'Sua estante está vazia. Toque em "Adicionar livro" para cadastrar o primeiro.'
              : `Nenhum livro encontrado para "${busca.trim()}".`}
          </Text>
        }
      />

      <View style={[styles.rodape, { paddingBottom: 12 + insets.bottom }]}>
        <Botao titulo="Adicionar livro" onPress={() => navigation.navigate('Formulario')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.fundo,
  },
  lista: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  busca: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: cores.cartao,
    color: cores.textoForte,
  },
  vazio: {
    textAlign: 'center',
    color: cores.textoSuave,
    marginTop: 16,
    marginHorizontal: 32,
    fontSize: 15,
  },
  rodape: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: cores.fundo,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
});

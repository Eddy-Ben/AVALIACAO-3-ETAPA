import React, { useLayoutEffect } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import LivroForm from '../components/LivroForm';
import { useLivros } from '../context/LivrosContext';
import { PropsDaTela } from '../navigation/tipos';
import { cores } from '../theme';
import { DadosLivro } from '../types/Livro';

const VAZIO: DadosLivro = { titulo: '', autor: '', genero: '', capaUri: null };

// Cadastro de um livro novo ou edição de um existente (quando recebe id)
export default function FormularioScreen({ navigation, route }: PropsDaTela<'Formulario'>) {
  const { adicionar, editar, buscarPorId } = useLivros();
  const id = route.params?.id;
  const livro = id ? buscarPorId(id) : undefined;
  const editando = id !== undefined;

  useLayoutEffect(() => {
    navigation.setOptions({ title: editando ? 'Editar livro' : 'Novo livro' });
  }, [navigation, editando]);

  if (editando && !livro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.aviso}>Este livro não existe mais.</Text>
      </View>
    );
  }

  function salvar(dados: DadosLivro) {
    if (id) {
      editar(id, dados);
      Alert.alert('Livro atualizado', 'As alterações foram salvas.');
    } else {
      adicionar(dados);
      Alert.alert('Livro cadastrado', `"${dados.titulo.trim()}" entrou na sua estante.`);
    }
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <LivroForm
          valoresIniciais={livro ?? VAZIO}
          textoBotao={editando ? 'Salvar alterações' : 'Adicionar livro'}
          onSalvar={salvar}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  aviso: {
    color: cores.textoSuave,
    fontSize: 15,
  },
});

import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { TextInputInstance } from 'react-native';

import { validarLivro } from '../logic/livros';
import { cores } from '../theme';
import { CampoObrigatorio, DadosLivro, ErrosLivro } from '../types/Livro';
import Botao from './Botao';
import CapaPicker from './CapaPicker';

interface LivroFormProps {
  valoresIniciais: DadosLivro;
  textoBotao: string;
  onSalvar: (dados: DadosLivro) => void;
}

// Formulário usado tanto no cadastro quanto na edição
export default function LivroForm({ valoresIniciais, textoBotao, onSalvar }: LivroFormProps) {
  const [titulo, setTitulo] = useState<string>(valoresIniciais.titulo);
  const [autor, setAutor] = useState<string>(valoresIniciais.autor);
  const [genero, setGenero] = useState<string>(valoresIniciais.genero);
  const [capaUri, setCapaUri] = useState<string | null>(valoresIniciais.capaUri);
  const [erros, setErros] = useState<ErrosLivro>({});

  const autorRef = useRef<TextInputInstance>(null);
  const generoRef = useRef<TextInputInstance>(null);

  // Ao digitar num campo com erro, o aviso daquele campo some
  function alterar(campo: CampoObrigatorio, setter: (valor: string) => void) {
    return (valor: string) => {
      setter(valor);
      if (erros[campo]) setErros((atuais) => ({ ...atuais, [campo]: undefined }));
    };
  }

  function salvar() {
    const encontrados = validarLivro({ titulo, autor, genero });
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) return;
    onSalvar({ titulo, autor, genero, capaUri });
  }

  return (
    <View style={styles.card}>
      <CapaPicker uri={capaUri} titulo={titulo} onChange={setCapaUri} />

      <Campo
        rotulo="Título *"
        valor={titulo}
        erro={erros.titulo}
        placeholder="Ex.: Dom Casmurro"
        onChangeText={alterar('titulo', setTitulo)}
        onSubmitEditing={() => autorRef.current?.focus()}
      />
      <Campo
        ref={autorRef}
        rotulo="Autor *"
        valor={autor}
        erro={erros.autor}
        placeholder="Ex.: Machado de Assis"
        onChangeText={alterar('autor', setAutor)}
        onSubmitEditing={() => generoRef.current?.focus()}
      />
      <Campo
        ref={generoRef}
        rotulo="Gênero *"
        valor={genero}
        erro={erros.genero}
        placeholder="Ex.: Romance"
        onChangeText={alterar('genero', setGenero)}
        onSubmitEditing={salvar}
        ultimo
      />

      <Botao titulo={textoBotao} onPress={salvar} style={styles.botao} />
    </View>
  );
}

interface CampoProps {
  rotulo: string;
  valor: string;
  erro?: string;
  placeholder: string;
  onChangeText: (valor: string) => void;
  onSubmitEditing: () => void;
  ultimo?: boolean;
  ref?: React.Ref<TextInputInstance>;
}

function Campo({ rotulo, valor, erro, placeholder, onChangeText, onSubmitEditing, ultimo, ref }: CampoProps) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{rotulo}</Text>
      <TextInput
        ref={ref}
        style={[styles.input, erro && styles.inputErro]}
        placeholder={placeholder}
        placeholderTextColor={cores.textoSuave}
        value={valor}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={ultimo ? 'done' : 'next'}
        submitBehavior={ultimo ? 'blurAndSubmit' : 'submit'}
        autoCapitalize="sentences"
        accessibilityLabel={rotulo.replace(' *', '')}
      />
      {erro && <Text style={styles.erro}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.cartao,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  campo: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.marrom,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: cores.campo,
    color: cores.textoForte,
  },
  inputErro: {
    borderColor: cores.erro,
  },
  erro: {
    color: cores.erro,
    marginTop: 4,
    fontSize: 13,
  },
  botao: {
    marginTop: 4,
  },
});

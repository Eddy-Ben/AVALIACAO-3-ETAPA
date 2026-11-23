import React from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';

import { ResultadoCapa } from '../services/capa';
import { seletorDeCapa } from '../services/capaNativa';
import { cores } from '../theme';
import Botao from './Botao';
import CapaLivro from './CapaLivro';

interface CapaPickerProps {
  uri: string | null;
  titulo: string;
  onChange: (uri: string | null) => void;
}

// Recurso nativo: foto da capa pela câmera ou pela galeria
export default function CapaPicker({ uri, titulo, onChange }: CapaPickerProps) {
  function tratar(resultado: ResultadoCapa, origem: 'câmera' | 'galeria') {
    switch (resultado.status) {
      case 'ok':
        onChange(resultado.uri);
        return;
      case 'cancelado':
        return;
      case 'sem-permissao':
        if (resultado.podePerguntarDeNovo) {
          Alert.alert(
            'Permissão necessária',
            `Sem acesso à ${origem} não dá para escolher a capa. Tente de novo e toque em "Permitir".`
          );
        } else {
          Alert.alert(
            'Permissão negada',
            `O acesso à ${origem} foi bloqueado. Você pode liberar nas configurações do aparelho.`,
            [
              { text: 'Agora não', style: 'cancel' },
              { text: 'Abrir configurações', onPress: () => Linking.openSettings() },
            ]
          );
        }
        return;
      case 'indisponivel':
        Alert.alert(
          'Recurso indisponível',
          `Não foi possível usar a ${origem} neste aparelho. Tente a outra opção.`
        );
        return;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Capa (opcional)</Text>
      <View style={styles.linha}>
        <CapaLivro uri={uri} titulo={titulo} largura={80} />
        <View style={styles.botoes}>
          <Botao
            pequeno
            variante="secundario"
            titulo="Tirar foto"
            onPress={async () => tratar(await seletorDeCapa.tirarFoto(), 'câmera')}
          />
          <Botao
            pequeno
            variante="secundario"
            titulo="Escolher da galeria"
            onPress={async () => tratar(await seletorDeCapa.escolherDaGaleria(), 'galeria')}
          />
          {uri && <Botao pequeno variante="perigo" titulo="Remover capa" onPress={() => onChange(null)} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.marrom,
    marginBottom: 6,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  botoes: {
    flex: 1,
    gap: 8,
  },
});

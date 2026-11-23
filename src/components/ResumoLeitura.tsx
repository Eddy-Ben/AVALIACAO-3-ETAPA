import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { pluralizar } from '../logic/livros';
import { cores } from '../theme';
import { ResumoLivros } from '../types/Livro';

interface ResumoLeituraProps {
  resumo: ResumoLivros;
}

// Indicadores do topo da tela inicial
export default function ResumoLeitura({ resumo }: ResumoLeituraProps) {
  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={`${pluralizar(resumo.total, 'livro', 'livros')}, ${resumo.lidos} lidos, ${resumo.naFila} na fila`}
    >
      <Indicador valor={resumo.total} rotulo={resumo.total === 1 ? 'livro' : 'livros'} />
      <Indicador valor={resumo.lidos} rotulo={resumo.lidos === 1 ? 'lido' : 'lidos'} />
      <Indicador valor={resumo.naFila} rotulo="na fila" />
    </View>
  );
}

function Indicador({ valor, rotulo }: { valor: number; rotulo: string }) {
  return (
    <View style={styles.indicador}>
      <Text style={styles.valor}>{valor}</Text>
      <Text style={styles.rotulo}>{rotulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: cores.marrom,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  indicador: {
    flex: 1,
    alignItems: 'center',
  },
  valor: {
    color: cores.textoClaro,
    fontSize: 24,
    fontWeight: 'bold',
  },
  rotulo: {
    color: '#E8D5C0',
    fontSize: 13,
  },
});

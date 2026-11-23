import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { cores } from '../theme';

interface CapaLivroProps {
  uri: string | null;
  titulo: string;
  largura: number;
}

// Mostra a foto da capa ou, se não houver (ou o arquivo sumir), a inicial do título
export default function CapaLivro({ uri, titulo, largura }: CapaLivroProps) {
  const [falhou, setFalhou] = useState<boolean>(false);
  const altura = Math.round(largura * 1.5);

  // Se a capa mudar, tenta carregar a nova
  useEffect(() => setFalhou(false), [uri]);

  if (uri && !falhou) {
    return (
      <Image
        source={{ uri }}
        style={[styles.capa, { width: largura, height: altura }]}
        onError={() => setFalhou(true)}
        accessibilityLabel={`Capa de ${titulo}`}
      />
    );
  }

  return (
    <View style={[styles.capa, styles.semCapa, { width: largura, height: altura }]}>
      <Text style={[styles.inicial, { fontSize: largura * 0.4 }]}>
        {titulo.trim().charAt(0).toUpperCase() || '?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  capa: {
    borderRadius: 6,
    backgroundColor: cores.begeClaro,
  },
  semCapa: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: cores.borda,
  },
  inicial: {
    color: cores.bege,
    fontWeight: 'bold',
  },
});

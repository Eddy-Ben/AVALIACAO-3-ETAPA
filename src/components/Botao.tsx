import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

import { cores } from '../theme';

type Variante = 'primario' | 'secundario' | 'perigo';

interface BotaoProps {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  pequeno?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

// Botão padrão do app, para todas as ações terem a mesma cara
export default function Botao({
  titulo,
  onPress,
  variante = 'primario',
  pequeno = false,
  style,
  accessibilityLabel,
}: BotaoProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? titulo}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        pequeno && styles.pequeno,
        styles[variante],
        pressed && styles.pressionado,
        style,
      ]}
    >
      <Text style={[styles.texto, pequeno && styles.textoPequeno, styles[`texto_${variante}`]]}>{titulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pequeno: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  primario: {
    backgroundColor: cores.marromMedio,
  },
  secundario: {
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.marromMedio,
  },
  perigo: {
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.erro,
  },
  pressionado: {
    opacity: 0.75,
  },
  texto: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textoPequeno: {
    fontSize: 13,
    fontWeight: '600',
  },
  texto_primario: {
    color: '#FFFFFF',
  },
  texto_secundario: {
    color: cores.marromMedio,
  },
  texto_perigo: {
    color: cores.erro,
  },
});

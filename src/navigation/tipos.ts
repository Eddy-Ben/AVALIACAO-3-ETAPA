import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Telas do app e os parâmetros que cada uma recebe
export type RotasParamList = {
  Lista: undefined;
  // Sem id: cadastro. Com id: edição do livro
  Formulario: { id?: string } | undefined;
  Detalhes: { id: string };
};

export type PropsDaTela<Nome extends keyof RotasParamList> = NativeStackScreenProps<RotasParamList, Nome>;

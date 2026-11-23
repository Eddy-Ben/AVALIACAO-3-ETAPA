import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DetalhesScreen from '../screens/DetalhesScreen';
import FormularioScreen from '../screens/FormularioScreen';
import ListaScreen from '../screens/ListaScreen';
import { cores } from '../theme';
import { RotasParamList } from './tipos';

const Stack = createNativeStackNavigator<RotasParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Lista"
      screenOptions={{
        headerStyle: { backgroundColor: cores.marrom },
        headerTintColor: cores.textoClaro,
        headerTitleStyle: { fontWeight: 'bold' },
        headerShadowVisible: false,
        headerBackTitle: 'Voltar',
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Stack.Screen name="Lista" component={ListaScreen} options={{ title: 'Minha Biblioteca' }} />
      <Stack.Screen name="Formulario" component={FormularioScreen} options={{ title: 'Novo livro' }} />
      <Stack.Screen name="Detalhes" component={DetalhesScreen} options={{ title: 'Detalhes do livro' }} />
    </Stack.Navigator>
  );
}

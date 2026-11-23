// Liga o livroStorage ao AsyncStorage de verdade
import AsyncStorage from '@react-native-async-storage/async-storage';

import { criarLivroStorage } from './livroStorage';

export const livroStorage = criarLivroStorage(AsyncStorage);

# Minha Biblioteca

Aplicativo para organizar os livros que eu tenho: cadastrar, ver os detalhes, marcar quais já li, editar e excluir. Cada livro pode ter uma foto da capa, tirada na hora com a câmera ou escolhida na galeria. Os dados ficam guardados no aparelho e continuam lá depois que o app é fechado.

Avaliação da 3ª etapa da disciplina de Desenvolvimento para Dispositivos Móveis, feita em React Native com TypeScript e Expo. É a continuação do app do trabalho anterior (tema 4, Minha biblioteca).

## Funcionalidades

- Cadastro de livro com título, autor e gênero (obrigatórios) e capa (opcional). Se algum campo obrigatório ficar vazio, o aviso aparece embaixo dele e o livro não é salvo.
- Lista dos livros em uma `FlatList`, com o mais recente no topo.
- Indicadores no topo da tela inicial com o total de livros, quantos foram lidos e quantos estão na fila.
- Busca por título, autor ou gênero, sem diferenciar maiúsculas nem acentos ("ficcao" encontra "Ficção").
- Tela de detalhes para consultar um livro.
- Edição de todos os dados do livro, inclusive a capa.
- Marcar e desmarcar como lido, tanto na lista quanto nos detalhes.
- Exclusão com pedido de confirmação.
- Mensagens de sucesso ao cadastrar e ao editar, e mensagens para lista vazia, busca sem resultado, permissão negada e câmera indisponível.

## Telas e navegação

A navegação usa Stack (React Navigation) com três telas:

1. Lista (tela inicial): indicadores, busca, lista de livros e o botão "Adicionar livro".
2. Formulário: cadastra um livro novo ou, quando recebe o `id` de um livro, edita esse livro.
3. Detalhes: mostra a capa e os dados do livro, com os botões de marcar como lido, editar e excluir.

## Persistência

Os livros são salvos com o AsyncStorage (`@react-native-async-storage/async-storage`) na chave `@minha-biblioteca/livros`, em formato JSON.

Quando o app abre, a lista é lida do armazenamento. Depois disso, qualquer mudança (cadastro, edição, leitura ou exclusão) grava a lista inteira de novo. Se o conteúdo salvo estiver corrompido, o app abre com a lista vazia em vez de travar, e se a gravação falhar aparece um aviso.

O código fica em `src/storage/livroStorage.ts`. Ele recebe o armazenamento por parâmetro, o que permite testar a persistência sem o celular.

## Recurso nativo: câmera e galeria

A capa do livro vem do `expo-image-picker`. No formulário há dois botões, "Tirar foto" (câmera) e "Escolher da galeria", e a imagem é recortada no formato 2:3 de uma capa.

A foto escolhida é copiada com o `expo-file-system` para a pasta de documentos do app. O picker entrega a imagem numa pasta de cache que o sistema pode limpar, e a cópia garante que a capa continua aparecendo depois de reabrir o app.

Os casos em que o recurso não funciona são tratados assim:

- Permissão negada: o app explica por que precisa do acesso e não abre o seletor.
- Permissão bloqueada de vez: o aviso oferece um botão que abre as configurações do aparelho.
- Câmera indisponível (por exemplo, num emulador sem câmera): o app avisa e sugere a outra opção.
- Seletor fechado sem escolher nada: a capa atual continua como estava.
- Arquivo da capa apagado: o card mostra a inicial do título no lugar da foto.

A lógica fica em `src/services/capa.ts`, e a ligação com as bibliotecas nativas em `src/services/capaNativa.ts`.

## Estrutura

```
AVALIACAO-3-ETAPA/
├── App.tsx                      providers e navegação
├── index.ts                     ponto de entrada do Expo
└── src/
    ├── components/
    │   ├── Botao.tsx            botão padrão (primário, secundário e perigo)
    │   ├── CapaLivro.tsx        foto da capa ou inicial do título
    │   ├── CapaPicker.tsx       botões de câmera e galeria e tratamento de permissão
    │   ├── LivroForm.tsx        formulário de cadastro e edição, com validação
    │   ├── LivroItem.tsx        card de cada livro na lista
    │   └── ResumoLeitura.tsx    indicadores da tela inicial
    ├── context/
    │   └── LivrosContext.tsx    estado da lista (useState) e gravação automática
    ├── logic/
    │   └── livros.ts            validação, cadastro, edição, exclusão, busca e resumo
    ├── navigation/
    │   ├── AppNavigator.tsx     Stack com as três telas
    │   └── tipos.ts             parâmetros de cada rota
    ├── screens/
    │   ├── ListaScreen.tsx
    │   ├── FormularioScreen.tsx
    │   └── DetalhesScreen.tsx
    ├── services/
    │   ├── capa.ts              escolha da capa e tratamento de permissão
    │   └── capaNativa.ts        ligação com expo-image-picker e expo-file-system
    ├── storage/
    │   ├── livroStorage.ts      salvar e carregar os livros
    │   └── asyncStorage.ts      ligação com o AsyncStorage
    ├── types/
    │   └── Livro.ts             tipos dos registros
    └── theme.ts                 cores do app
```

Os arquivos `*.test.ts` ficam ao lado do código que testam.

## Como instalar e rodar

Precisa do Node.js instalado e do app Expo Go no celular (ou de um emulador).

```bash
npm install
npx expo start
```

Depois é só ler o QR code com o Expo Go. A câmera só funciona num celular de verdade. No emulador, use a galeria.

Para rodar os testes:

```bash
npm test
```

## Bibliotecas adicionais

| Biblioteca | Para que serve |
| --- | --- |
| `@react-native-async-storage/async-storage` | Persistência dos livros |
| `expo-image-picker` | Câmera e galeria para a capa |
| `expo-file-system` | Copiar a foto da capa para uma pasta permanente |
| `@react-navigation/native` e `@react-navigation/native-stack` | Navegação entre as telas |
| `react-native-screens` e `react-native-safe-area-context` | Exigidas pelo React Navigation |
| `tsx` (desenvolvimento) | Rodar os testes em TypeScript com o test runner do Node |

## Testes

A lógica que não depende da interface tem testes automatizados (`npm test`): validação dos campos, cadastro, edição, marcar como lido, exclusão, busca, indicadores, persistência (inclusive dados corrompidos e o app fechado e reaberto) e a escolha da capa (permissão negada, permissão bloqueada, seletor cancelado e câmera indisponível).

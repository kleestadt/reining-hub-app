# reining-hub-app
Plataforma completa para competições de rédeas no Brasil, conectando organizadores, competidores e resultados em tempo real

# Reining Hub App

Aplicação Ionic + Angular para gestão de competições de rédeas, com autenticação e persistência no Firebase Realtime Database.

## 📌 Descrição
O app permite cadastrar competições, categorias, inscrições e juízes, além de registrar notas e gerar ranking automático por média.

## 🎯 Objetivo
Centralizar a operação de competições de rédeas em uma interface simples, substituindo planilhas e facilitando o controle de inscritos, notas e resultados.

## 🧰 Tecnologias utilizadas
- Angular 20 (standalone)
- Ionic 8
- Firebase 12 (Authentication, Realtime Database, Analytics)
- Capacitor 8 (dependências instaladas)
- TypeScript 5.9 e RxJS 7
- Karma + Jasmine (testes)
- ESLint

## 🗂️ Estrutura de pastas
A aplicação Angular está dentro da pasta `app/`.

```text
reining-hub-app/
  README.md
  app/
    angular.json
    package.json
    ionic.config.json
    src/
      app/
        pages/
        services/
      environments/
      assets/
      theme/
```

## ✅ Pré-requisitos
- Node.js e npm
- Projeto Firebase com Authentication (email/senha) e Realtime Database habilitados
- Credenciais do Firebase para aplicação web

## ⚙️ Instalação
1. Acesse a pasta do app.
```bash
cd app
```
2. Instale as dependências.
```bash
npm install
```

## ▶️ Como executar o projeto
```bash
npm start
```
Por padrão, o Angular serve em `http://localhost:4200`.

## 🧪 Scripts disponíveis
- `npm run ng` - executa o Angular CLI
- `npm start` - inicia o servidor de desenvolvimento (`ng serve`)
- `npm run build` - build de produção
- `npm run watch` - build em modo watch com configuração `development`
- `npm test` - testes unitários com Karma
- `npm run lint` - lint com ESLint

## 🛠️ Como rodar em ambiente de desenvolvimento
- Use `npm start` para `ng serve` com configuração `development`.
- Use `npm run watch` quando precisar gerar build contínuo com `--watch`.

## 🏗️ Como gerar build
```bash
npm run build
```
Saída padrão em `app/www` (configurado no `angular.json`).

## 🔐 Configurações importantes
- Firebase: `app/src/environments/firebase.config.ts` contém as credenciais e inicializa o app Firebase.
- Ambientes: `app/src/environments/environment.ts` e `app/src/environments/environment.prod.ts` controlam `production` e são trocados via `fileReplacements` no build de produção.
- Não há uso de `.env`; as chaves do Firebase estão no arquivo de configuração acima.

## ✨ Principais funcionalidades
- Login e registro via e-mail/senha (Firebase Auth)
- CRUD de competições, associadas ao usuário autenticado (`ownerId`)
- CRUD de categorias por competição
- CRUD de juízes por competição
- CRUD de inscrições por categoria (competidor e cavalo)
- Geração de ordem de entrada aleatória para inscritos sem ordem
- Lançamento de notas por juiz e cálculo de média
- Ranking automático por média de notas

## 🧭 Fluxo da aplicação
1. Usuário realiza login ou cria conta.
2. Usuário cria/edita/exclui competições.
3. Dentro de uma competição, cadastra categorias.
4. Para cada competição, cadastra juízes.
5. Em cada categoria, cadastra inscrições.
6. Juízes lançam notas e o ranking é atualizado.

## 🧩 Serviços e responsabilidades
- `AuthService` (`app/src/app/services/auth.ts`): autenticação e usuário atual.
- `CompetitionService` (`app/src/app/services/competition.ts`): CRUD de competições e filtro por `ownerId`.
- `CategoryService` (`app/src/app/services/category.ts`): CRUD de categorias por competição.
- `EntryService` (`app/src/app/services/entry.ts`): CRUD de inscrições e atualização de notas/ordem.
- `JudgeService` (`app/src/app/services/judge.ts`): CRUD de juízes por competição.

## 💡 Exemplos de uso
Estrutura esperada no Firebase Realtime Database (simplificada):
```json
{
  "competitions": {
    "{competitionId}": {
      "name": "Campeonato X",
      "ownerId": "{uid}"
    }
  },
  "categories": {
    "{competitionId}": {
      "{categoryId}": {
        "name": "Categoria A"
      }
    }
  },
  "judges": {
    "{competitionId}": {
      "{judgeId}": {
        "name": "Juiz 1"
      }
    }
  },
  "entries": {
    "{competitionId}": {
      "{categoryId}": {
        "{entryId}": {
          "name": "Competidor",
          "horse": "Cavalo",
          "order": 1,
          "scores": {
            "{judgeId}": 72.5
          }
        }
      }
    }
  }
}
```

## 🏛️ Padrões arquiteturais identificados
- Componentes standalone do Angular (sem `NgModule`)
- Separação por camadas simples: Pages (UI) e Services (dados)
- Roteamento com `loadComponent` e lazy loading
- Backend-as-a-Service com Firebase

## 🧠 Decisões técnicas importantes
- Uso de Ionic para UI e componentes mobile-friendly.
- Persistência em Firebase Realtime Database com estrutura hierárquica por competição/categoria.
- Autenticação via Firebase Auth com email/senha.
- Preload de rotas com `PreloadAllModules` para melhorar navegação.

## 🗺️ Possíveis melhorias / roadmap
- Adicionar guards de rota para proteger páginas de usuários não autenticados.
- Remover rota duplicada de `competitions` e revisar rota `/entries` sem parâmetros.
- Unificar a inicialização do Firebase (há inicialização no `main.ts` e no `firebase.config.ts`).
- Criar interfaces TypeScript no lugar de `any` nos modelos.
- Centralizar tratamento de erros e estados de carregamento.
- Ampliar cobertura de testes unitários.

## 📝 Observações técnicas relevantes
- O projeto principal está em `app/`; existe também uma pasta `app/app` com estrutura similar que pode ser um artefato/duplicação.
- A página `home` existe em `app/src/app/home`, mas não está referenciada nas rotas atuais.
- O build padrão gera arquivos em `app/www`.
# IMPACT Prompt Generator

O "IMPACT Prompt Generator" é uma aplicação web de alta performance construída com React, Vite e Tailwind CSS, projetada para rodar na infraestrutura Serverless da Vercel. Sua finalidade é transformar ideias cruas e pedidos vagos em prompts estruturados de altíssima performance para LLMs, utilizando o framework **RTCROS**.

---

## Estrutura do Projeto

```
Impact-Prompt-Generator/
├── api/
│   └── generate.js         # Vercel Serverless Function (Backend / Comunicação com IA)
├── src/
│   ├── App.jsx             # Componente Principal React (Frontend / UX / Lógica Client-side)
│   ├── index.css           # Estilos Globais + Tailwind CSS + Dark Mode Personalizado
│   └── main.jsx            # Ponto de entrada do React
├── index.html              # Arquivo HTML principal
├── vercel.json             # Configuração de roteamento da Vercel
├── vite.config.js          # Configuração do Vite
├── tailwind.config.js      # Configuração do Tailwind (Dark Mode, Paths)
├── postcss.config.js       # Autoprefixer / Tailwind processor
├── package.json            # Dependências (React, Lucide-React, GenAI SDK)
├── .env.example            # Exemplo de variável de ambiente
└── README.md               # Este arquivo
```

---

## Como Iniciar e Testar Localmente

Siga os passos abaixo, no terminal do seu computador, para instalar dependências e testar toda a aplicação localmente.

### 1. Pré-requisitos
- **Node.js**: Certifique-se de que o Node.js está instalado (`node -v`).
- **Conta no Google AI Studio**: Você precisará de uma API Key do Gemini (Gemini 1.5 Pro/Flash).

### 2. Comandos Exatos de Terminal
Se você for começar o projeto do ZERO usando nosso setup (como gerado nesta pasta), navegue até a pasta do projeto e execute:

```bash
# Entre na pasta do projeto
cd Impact-Prompt-Generator

# Instale os pacotes e dependências (React, Tailwind, Lucide, Google GenAI SDK)
npm install
```

*(Nota: Os arquivos de configuração do Vite, Tailwind e as dependências já estão prontas no `package.json`).*

### 3. Configurar sua API Key
1. Crie um arquivo chamado `.env` na raiz do projeto.
2. Adicione sua chave de API do Gemini no formato abaixo:

```env
VITE_API_KEY=sua_chave_aqui
```

### 4. Rodando o Ambiente Local
Para testar a aplicação localmente de forma rápida, rodaremos tudo diretamente no servidor de desenvolvimento do Vite.

```bash
# Execute o ambiente de desenvolvimento local
npm run dev
```

O Vercel CLI pode fazer algumas perguntas na primeira vez:
- Responder `Y` para configurar e vincular a um projeto na Vercel.
- O link local aparecerá no terminal (ex: `http://localhost:3000`).
- Ao abrir o link, digite uma ideia crua, preencha (opcionalmente) Contexto e Objetivo, e clique no botão para **Sintetizar o Prompt**. 

O backend da Vercel irá interceptar a chamada do botão, injetar remotamente (na RAM do servidor) o *System Prompt* obrigatório para a IA, realizar a geração RTCROS remotamente, e devolver apenas o prompt final pro lado do cliente em grande estilo na interface lateral.

---

### Deploy 🚀
Para colocar no ar na arquitetura real da Vercel:
1. Suba este código para um repositório no GitHub.
2. Na Vercel, crie um Novo Projeto e conecte o repositório.
3. Nas configurações do projeto (Environment Variables) da Vercel, adicione a variável:
   - Name: `VITE_API_KEY`
   - Value: `(sua chave do gemini)`
4. Faça o deploy! Em 30 segundos sua aplicação estará pública.

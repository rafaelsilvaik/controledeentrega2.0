# Supabase Project

Este projeto é uma aplicação que utiliza o Supabase como backend. Abaixo estão as instruções para instalação e uso.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)
- Conta no Supabase

## Instalação

1. Clone o repositório:
   ```
   git clone <URL_DO_REPOSITORIO>
   cd supabase-project
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto e adicione suas variáveis de ambiente:
   ```
   SUPABASE_URL=<sua_url_do_supabase>
   SUPABASE_ANON_KEY=<sua_chave_anonima>
   ```

## Uso

Para iniciar a aplicação, execute:
```
npm start
```

## Estrutura do Projeto

- `src/index.js`: Ponto de entrada da aplicação.
- `src/services/supabaseClient.js`: Configuração do cliente Supabase.
- `src/utils/helpers.js`: Funções utilitárias.
- `.env`: Variáveis de ambiente.
- `package.json`: Configuração do npm.
- `supabase/migrations`: Arquivos de migração do banco de dados.
- `supabase/seed.sql`: Comandos SQL para popular o banco de dados.

## Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções. Faça um fork do repositório e envie um pull request.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.
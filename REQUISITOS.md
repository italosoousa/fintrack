# REQUISITOS.md — Checklist da Atividade

## ✅ Aplicação funcional com interface GUI
**Onde está:** pasta `client/` — interface React com Vite.
**Como usar:** `cd client && npm install && npm run dev` — acesse http://localhost:5173

## ✅ Repositório público no GitHub
**Onde está:** link do repositório público.
**Como usar:** acesse o repositório, ele está configurado como público.

## ✅ README.md completo
**Onde está:** arquivo `README.md` na raiz do projeto.
**O que contém:** descrição do problema, proposta da solução, público-alvo, funcionalidades, tecnologias, instalação, execução, testes e lint.

## ✅ Versionamento semântico
**Onde está:** campo `"version": "1.0.0"` no `package.json` da raiz.
**Padrão usado:** MAJOR.MINOR.PATCH conforme especificação SemVer.

## ✅ Dependências declaradas
**Onde está:** `package.json` na raiz (backend) e `client/package.json` (frontend).
**Como instalar:** `npm install` na raiz e `cd client && npm install`.

## ✅ Testes automatizados
**Onde está:** `tests/financas.test.js` — testes com Jest.
**Cobertura:** caminho feliz, entradas inválidas e casos limite.
**Como rodar:** `npm test`

## ✅ Linting / análise estática
**Onde está:** `eslint.config.js` na raiz com regras ESLint configuradas.
**Como rodar:** `npm run lint`

## ✅ GitHub Actions — CI
**Onde está:** `.github/workflows/ci.yml`
**O que faz:** executa automaticamente em push e pull_request — instala dependências, roda lint e roda testes.
**Como verificar:** aba "Actions" no repositório GitHub.

## ⏳ PDF de entrega
**Status:** a ser gerado separadamente conforme orientação do professor.
**Deve conter:** nome do aluno, nome da disciplina, nome do projeto, descrição da proposta e link do repositório público.

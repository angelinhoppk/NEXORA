# Feitiva

Repositório oficial da Feitiva, empresa de tecnologia especializada em desenvolvimento de sites, softwares, inteligência artificial, chatbots e automações empresariais.

Este repositório contém o **site institucional** da empresa.

## Estrutura

```
index.html              Página única com todas as seções
assets/css/styles.css   Identidade visual, layout e responsividade
assets/js/config.js     Contatos e envio do formulário (preencher com dados reais)
assets/js/main.js       Menu mobile, navegação, animação de entrada e formulário
assets/fonts/           Fontes hospedadas no próprio site (Cormorant Garamond e Albert Sans)
assets/img/             Telas reais do Feitiva Clinic (WebP) e favicon
```

Sem dependências e sem etapa de build: é HTML, CSS e JavaScript puros.

## Como executar localmente

1. Abra a pasta no VS Code.
2. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.

Abrir o arquivo direto (duplo clique) também funciona, mas as fontes só carregam
corretamente quando o site é servido por um servidor (Live Server ou a Vercel).

## Configuração (assets/js/config.js)

- `contact.email` e `contact.whatsapp`: aparecem no contato e no rodapé somente se preenchidos.
- `form.endpointUrl`: endereço que recebe as mensagens do formulário (POST em JSON).
  - Sem endpoint, mas com e-mail: o formulário abre o e-mail do visitante com a mensagem pronta.
  - Sem nenhum dos dois: o site informa que o envio ainda não está ativo (nada é simulado).

## Seções

Início, Sobre, Soluções, Feitiva Clinic (com telas reais do sistema), Processo e Contato.

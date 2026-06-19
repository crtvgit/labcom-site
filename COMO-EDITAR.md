# ✏️ Como editar o site do LAB.COM

Este guia é para **pessoas não técnicas**. Quase tudo que você vai querer
mudar no dia a dia (textos, links, contatos e o aviso de reservas) fica em
**um único arquivo**:

```
SITE/lib/siteConfig.ts
```

Abra esse arquivo em qualquer editor de texto (recomendamos o
[VS Code](https://code.visualstudio.com/)) e altere apenas o texto **entre
aspas** `"assim"`.

---

## 🔴 Ligar / desligar o aviso vermelho de "Reservas Bloqueadas"

No arquivo `lib/siteConfig.ts`, procure por **`avisoReservas`**:

```ts
avisoReservas: {
  ativo: true,                       // true = aviso LIGADO  |  false = DESLIGADO
  titulo: "RESERVAS BLOQUEADAS",
  mensagem: "No momento, as reservas estão bloqueadas até o próximo semestre.",
},
```

- Para **mostrar** o aviso: deixe `ativo: true`
- Para **esconder** o aviso: troque para `ativo: false`
- Para mudar o texto: edite `titulo` e `mensagem`

> 💡 Quando o aviso está **ligado**, o botão do formulário de reserva também
> fica bloqueado automaticamente. Você não precisa mexer em mais nada.

---

## ✨ Mudar a seção de destaque (logo abaixo do cabeçalho)

Procure por **`destaque`**. Lá você muda a frase grande e os 3 atalhos
(cartões clicáveis).

---

## 📝 Trocar os formulários de reserva

Existem **dois tipos de reserva**, cada um com seu próprio formulário.
Procure por **`reservas`**:

```ts
reservas: {
  // SALAS DE AULA (ex.: Sala K212) — continua disponível mesmo com o aviso ligado
  salas: {
    formulario: "https://forms.office.com/r/f5XwYnwRy0",
  },
  // EQUIPAMENTOS E LABORATÓRIOS — fica bloqueado quando o aviso está ligado
  equipamentos: {
    formulario: "https://forms.cloud.microsoft/r/iAjrCMt6KQ",
  },
},
```

> 💡 As reservas de **salas de aula NÃO são bloqueadas** pelo aviso vermelho —
> apenas as de **equipamentos e laboratórios** ficam bloqueadas quando
> `avisoReservas.ativo` está `true`.

Para mudar o link do documento **"Regras Vigentes"**, procure por **`links`**:

```ts
links: {
  regrasVigentes: "https://...",
},
```

---

## 📞 Mudar e-mail, telefone e horários

Procure por **`contato`**. Para adicionar um novo horário, copie uma linha
existente e cole logo abaixo (sem esquecer a vírgula no final).

---

## 📊 Mudar os números, 🏫 os espaços e 📄 os documentos

- **Números** (contadores da seção "sobre"): procure por `numeros`
- **Espaços** (cartões "nossos espaços"): procure por `espacos`
- **Documentos & recursos**: procure por `documentos`

Para **trocar a foto de um espaço**: coloque a imagem na pasta
`SITE/public/espacos/` e escreva o nome do arquivo no campo `imagem`
(ex.: `"/espacos/radio.png"`).

---

## 📅 Mudar os calendários

O calendário aparece **dentro do site** (a grade do mês é desenhada na própria
página, sem abrir aba). Procure por **`calendarios`**. Cada calendário tem:

```ts
{
  chave: "crtv",            // identificador curto, sem espaços
  nome: "CRTV",             // nome que aparece na aba
  descricao: "…",           // texto curto
  ics: "https://outlook.office365.com/owa/calendar/.../calendar.ics",
},
```

Para pegar o link **`.ics`** de um calendário: no Outlook, vá em
**Calendário → (botão direito no calendário) → Compartilhar e permissões →
Publicar calendário** e copie o link **ICS** (termina em `calendar.ics`).

> 💡 Use sempre o link que termina em **`.ics`** (não o `.html`). É ele que
> permite mostrar o calendário embutido na página.

---

## ✅ Regras de ouro (para não quebrar o site)

1. Só altere o texto que está **entre aspas**.
2. **Nunca apague** vírgulas `,`, aspas `"`, chaves `{ }` ou colchetes `[ ]`.
3. `true` e `false` são escritos em **minúsculo e sem aspas**.
4. Salve o arquivo. Em ambiente de desenvolvimento, o site atualiza sozinho.

---

## 🖥️ Como ver o site no seu computador (opcional)

Se você tiver o [Node.js](https://nodejs.org/) instalado, abra um terminal na
pasta `SITE` e rode uma única vez:

```bash
npm install
```

Depois, sempre que quiser ver o site rodando:

```bash
npm run dev
```

E abra **http://localhost:3000** no navegador. Para publicar a versão final:

```bash
npm run build
```

---

## 🗂️ Onde fica cada coisa (referência rápida para desenvolvedores)

| O que                              | Arquivo                                         |
| ---------------------------------- | ----------------------------------------------- |
| **Conteúdo editável (textos/links)** | `lib/siteConfig.ts`                           |
| Aviso vermelho de reservas         | `components/ReservationNotice.tsx`              |
| Seção de destaque (ex-vídeo)       | `components/sections/IntroSection.tsx`          |
| Formulário de reserva              | `components/ReservaContent.tsx`                 |
| Estilos / cores globais            | `app/globals.css` (tokens `:root` no topo)      |
| Estrutura da página inicial        | `app/page.tsx`                                  |

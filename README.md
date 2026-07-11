# ⚡ Pokédex 

Uma aplicação interativa e responsiva para explorar o mundo Pokémon, consumindo dados diretamente da PokéAPI. 

## 🛠️ Tecnologias Utilizadas

* **React** (via Vite)
* **Tailwind CSS** (Estilização responsiva e componentizada)
* **React Router Dom** (Navegação entre páginas)
* **Lucide React** (Ícones)

## ✨ Funcionalidades Extras Implementadas

Além dos requisitos base do projeto, desenvolvi algumas funcionalidades adicionais focadas em melhorar a Experiência do Usuário (UX) e a retenção de dados:

* **🌙 Modo Escuro (Dark Mode):** Implementação de um botão de alternância entre temas Claro e Escuro. O layout foi totalmente adaptado com classes de inversão de cores nativas do Tailwind. A preferência de tema do usuário é persistida no `localStorage`, garantindo que a tela não pisque ou perca o tema ao recarregar.

* **⭐ Sistema de Favoritos:** Adicionado um sistema que permite favoritar Pokémons diretamente na tela de informações. 
  * Os IDs dos Pokémons selecionados são salvos no `localStorage` do navegador.
  * Na página inicial (Home), foi criada uma seção de destaque no topo ("Meus Favoritos") que cruza os dados salvos com o dicionário da API para exibir os cards favoritados de forma inteligente, sem bloquear a navegação principal.

## 📱 Responsividade

O projeto foi construído no conceito de *Mobile First*, garantindo que a visualização em smartphones seja tão fluida e organizada quanto em telas de monitores maiores, com grades flexíveis e textos que se adaptam matematicamente (Aspect Ratio e Viewport Width) ao tamanho da tela.

## 🚀 Como rodar o projeto localmente

1. Clone o repositório:
   ```bash
   git clone <https://github.com/guiflorence05-sudo/>
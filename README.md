# Flappy Bird com Poderes

Uma versão modificada do clássico Flappy Bird, onde o pássaro pode atirar e destruir os canos! Desenvolvido com Phaser 3.

![Flappy Bird Screenshot](https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/screenshot.png)

## Como Jogar

### Controles
- **Barra de Espaço**: Faz o pássaro pular
- **Tecla X**: Atira (novo poder!)

### Objetivo
- Evite colidir com os canos verdes
- Passe entre os canos para ganhar pontos
- Use os tiros para destruir os canos e ganhar pontos extras

### Sistema de Pontuação
- **+1 ponto**: Por passar entre os canos
- **+2 pontos**: Por destruir um cano com tiro

## Como Executar o Jogo

1. **Usando VS Code (Recomendado)**:
   - Instale a extensão "Live Server"
   - Clique com o botão direito no `index.html`
   - Selecione "Open with Live Server"

2. **Usando Python**:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   Depois abra `http://localhost:8000` no navegador

3. **Usando Node.js**:
   ```bash
   # Instale o http-server globalmente
   npm install -g http-server
   
   # Execute na pasta do projeto
   http-server
   ```
   Acesse `http://localhost:8080` no navegador

## Tecnologias Utilizadas

- HTML5
- JavaScript
- [Phaser 3](https://phaser.io/phaser3) - Framework de jogos
- Sprites do Flappy Bird original

## Estrutura do Projeto 
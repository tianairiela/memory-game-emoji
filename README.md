#  Memory Game Emoji

Un petit jeu de **Memory** (paires à retrouver) en **HTML, CSS et JavaScript pur**, sans aucune dépendance. Un projet 100% pour le fun ! 🎉

![Status](https://img.shields.io/badge/status-fun%20project-ff69b4)

## 🎮 Démo

Ouvre simplement `index.html` dans ton navigateur, ou utilise une extension type *Live Server*.

## ✨ Fonctionnalités

- 🃏 16 cartes (8 paires d'emojis) mélangées aléatoirement à chaque partie
- 🔄 Animation de retournement en 3D (CSS `transform`)
- 🔢 Compteur de coups
- ⏱️ Chronomètre démarrant au premier coup
- 🏆 Meilleur score (nombre de coups) sauvegardé dans le `localStorage`
- 🎉 Message de victoire avec récapitulatif (coups + temps)
- 🔁 Bouton "Recommencer" à tout moment
- 📱 Interface responsive

## 🛠️ Technologies

- HTML5
- CSS3 (Flexbox, Grid, animations/transitions)
- JavaScript (vanilla, ES6+)
- `localStorage` pour la persistance du meilleur score

## 📂 Structure du projet

```
memory-game-emoji/
├── index.html   # Structure de la page
├── style.css    # Mise en forme et animations
├── script.js    # Logique du jeu
└── README.md
```

## 🚀 Lancer le projet

Aucune installation nécessaire :

```bash
git clone https://github.com/tianairiela/memory-game-emoji.git
cd memory-game-emoji
# puis ouvre index.html dans ton navigateur
```

## 📝 Règles du jeu

1. Clique sur une carte pour la retourner.
2. Clique sur une deuxième carte pour tenter de trouver sa paire.
3. Si les deux cartes correspondent, elles restent visibles.
4. Sinon, elles se retournent automatiquement après un court délai.
5. Trouve toutes les paires en un minimum de coups et de temps pour battre ton record ! 🏆

## 📄 Licence

Projet libre, à usage personnel et pédagogique.

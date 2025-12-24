# 20 Strong helper

## How to Run
 1. Install Dependencies:
```shell
npm install
```
 
2. Start Development Server:
```shell
npm run dev
```
Open the URL shown (usually http://localhost:5173).

3. Build for Production (PWA):
```shell
npm run build
npm run preview
```

## Prompt

In the 20 strong board game, there are dice with various numbers of successes:
- Yellow - 1 critical hit, 1 hit, 4 misses
- Green - 1 crit, 2 hits, 3 misses
- Blue - 1 crit, 3 hits, 2 misses
- Purple - 1 crit, 4 hits, 1 miss
- Red - 1 crit, 5 hits, 0 misses

1 crit (critical hit) deals 2 damage, and 1 hit deals 1 damage. A miss deals no damage.

Generate a single-page PWA with the following functions:
A user adds dice he has one by one selecting the color of each die. All colors are visible at the same time (i.e. represented as 5 stylized buttons). It's possible to add multiple dice of the same color. 
1. The application calculates the mean of the total expected damage of the selected dice
2. Additionally, a user enters the health of the monster, and the application calculates the probability with which the chosen dice will kill the monster (i.e. deal at least as much damage as the monster's health).

It's possible to reset the selected dice.

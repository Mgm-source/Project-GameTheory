<template>
  <div class="h-screen w-screen">
    <h1>This is where the spatial game information graph and stats goes</h1>
    <button class="bg-yellow-500 py-2 px-4 bg-light-blue-500 text-white font-semibold rounded-lg" @click="initGame">Start</button>
    <spatial class="m-8"
      :players="players"
      @select-pos="currentPlayer"
      :game="game"
      v-if="gamestart"
    ></spatial>
  </div>
</template>

<script>
import Spatial from "@/components/Spatial";
// @ is an alias to /src

export default {
  name: "Game",
  components: {
    Spatial,
  },
  data() {
    return {
      game: [],
      players: [],
      size: 50,
      gamestart: false,
      currentPlayer: null,
    };
  },
  methods: {
    createMatrix(size) {
      let gameMatrix = [];
      let count = 0;
      for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
          row.push({ strategy: "", payOff: 0, id: count++ });
        }
        gameMatrix.push(row);
      }
      return gameMatrix;
    },
    initGame() {
      this.gamestart = true;
      this.game = this.createMatrix(this.size);
      this.game.forEach((matrix) =>
        matrix.forEach((player) => {
          const testS = ["C", "D"];
          player.strategy = testS[Math.floor(Math.random() * testS.length)];
          this.players.push(player);
        })
      );
      this.checkStrategy();
      console.log(this.players);
    },
    checkStrategy() {
      //const neighbours = [[0, 1],[1, 0],[0, -1],[-1, 0]];
      this.game.forEach((matrix, i) => {
        console.log(matrix);
        matrix.forEach((player, j) => {
          this.checkneighbours(this.game, i, j);
          console.log(i, j, player);
        });
      });
    },
    checkneighbours(game, i, j) {
      // right
      if (j < this.game.length - 1) {
        if (game[i][j + 1].strategy == "C" && game[i][j].strategy == "C") {
          game[i][j].payOff += 4;
        }

        if (game[i][j + 1].strategy == "D" && game[i][j].strategy == "C") {
          game[i][j].payOff += 0;
        }
        if (game[i][j + 1].strategy == "C" && game[i][j].strategy == "D") {
          game[i][j].payOff += 3;
        }
        if (game[i][j + 1].strategy == "D" && game[i][j].strategy == "D") {
          game[i][j].payOff += 2;
        }
      }
      // left
      if (j > 0) {
        if (game[i][j - 1].strategy == "C" && game[i][j].strategy == "C") {
          game[i][j].payOff += 4;
        }
        if (game[i][j - 1].strategy == "D" && game[i][j].strategy == "C") {
          game[i][j].payOff += 0;
        }
        if (game[i][j - 1].strategy == "C" && game[i][j].strategy == "D") {
          game[i][j].payOff += 3;
        }
        if (game[i][j - 1].strategy == "D" && game[i][j].strategy == "D") {
          game[i][j].payOff += 2;
        }
      }

      // down
      if (i < this.game.length - 1) {
        if (game[i + 1][j].strategy == "C" && game[i][j].strategy == "C") {
          game[i][j].payOff += 4;
        }
        if (game[i + 1][j].strategy == "D" && game[i][j].strategy == "C") {
          game[i][j].payOff += 0;
        }
        if (game[i + 1][j].strategy == "C" && game[i][j].strategy == "D") {
          game[i][j].payOff += 3;
        }
        if (game[i + 1][j].strategy == "D" && game[i][j].strategy == "D") {
          game[i][j].payOff += 2;
        }
      }
      // up
      if (i > 0) {
        if (game[i - 1][j].strategy == "C" && game[i][j].strategy == "C") {
          game[i][j].payOff += 4;
        }
        if (game[i - 1][j].strategy == "D" && game[i][j].strategy == "C") {
          game[i][j].payOff += 0;
        }
        if (game[i - 1][j].strategy == "C" && game[i][j].strategy == "D") {
          game[i][j].payOff += 3;
        }
        if (game[i - 1][j].strategy == "D" && game[i][j].strategy == "D") {
          game[i][j].payOff += 2;
        }
      }
    },
  },
};
</script>

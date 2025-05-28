// import { makeAutoObservable } from "mobx";

// export default class GameStore {
//     timer = 120;
//     timerGame = 120;
//     score = 100;
//     isPaused = false;
//     isUnlimited = false;
//     endGame = false;
//     win = false;
//     round = 1;
//     roundFinish = 1;
  
//     selectedInstruments = [];
//     currentIndex = 0;

//     constructor() {
//         makeAutoObservable(this);
//       }
    
//       decrementTimer() {
//         if (this.timer > 0) this.timer--;
//         else this.endGame = true;
//       }
    
//       reset() {
//         this.timer = 120;
//         this.score = 100;
//         this.endGame = false;
//       }

//   }
  
export class Game {
  constructor(input1, input2) {
    this.Input1 = input1;
    this.Input2 = input2;
  }
}

export class Player {
  constructor(name) {
    this.Name = name;
  }
}

export default { Game, Player };

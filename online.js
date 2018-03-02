var game_tab = new Object();

/*Timothée Guy Reynald Barbeaut
*/


//A class which represent a game
class Game{
  constructor(id,gameCreator){
    this.id = id;
    this.redPlayer = gameCreator;
    this.nbPlayer = 1;
    this.isFinished = false;
    this.blueRobot = '';
    this.redRobot = '';
    this.tabFlag = '';
    this.tabBoard = '';
    this.blueDeck = '';
    this.redDeck = '';
  }

  addBluePlayer(id){
    this.bluePLayer = id;
    this.nbPlayer ++;
  }

}


/*gameAvailable
*check if a game is available
*/
exports.gameAvailable = function(id){
  if(!this.gameAvailable || game_tab[id].nbPlayer == 2){
    return false;
  }
  return true;
}

/*gameExists
*check if a game exists
*/
exports.gameExists = function(id){
  if(game_tab[id] == null){
    return false;
  }
  return true;
}
/*getGame
*return the information of a game
*/
exports.getGame = function(id){
  if(this.gameAvailable){
    return game_tab[id];
  }
  return null;
}

/*addGame
*Create and add a game in the table
*/
exports.addGame = function(id,gameCreator){
  game_tab[id] = new Game(id, gameCreator);
  console.log(game_tab[id]);
}


/*joinGame
*Add the blue player to the game
*/
exports.joinGame = function(idGame,joiner){
  game_tab[idGame].addBluePlayer(joiner);
  console.log(game_tab[idGame]);
}

/*initGame
*Take the init params of a game
*/
exports.initGame = function (id, blueRobot, redRobot, tabFlag, tabBoard){
  game_tab[id].blueRobot = blueRobot;
  game_tab[id].redRobot = redRobot;
  game_tab[id].tabFlag = tabFlag;
  game_tab[id].tabBoard = tabBoard;
}


/*addDeck
*Add a deck to the game
*/
exports.addDeck = function (id, color, deck){
  if(color == "blue"){
    game_tab[id].blueDeck = deck;
  }else{
    game_tab[id].redDeck = deck;
  }
}



/*
*
*/

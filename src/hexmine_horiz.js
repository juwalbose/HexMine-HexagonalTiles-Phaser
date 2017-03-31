/*global Phaser*/
/* activity spawns pickups randomly which the character can collect by walking over */

var game = new Phaser.Game(800, 680, Phaser.AUTO, 'TutContainer', { preload: preload, create: create});

//horizontal tile shaped level
var levelData=
[[-1,-1,-1,0,0,0,0,0,0,0,-1,-1,-1],
[-1,-1,0,0,0,0,0,0,0,0,-1,-1,-1],
[-1,-1,0,0,0,0,0,0,0,0,0,-1,-1],
[-1,0,0,0,0,0,0,0,0,0,0,-1,-1],
[-1,0,0,0,0,0,0,0,0,0,0,0,-1],
[0,0,0,0,0,0,0,0,0,0,0,0,-1],
[0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,-1],
[-1,0,0,0,0,0,0,0,0,0,0,0,-1],
[-1,0,0,0,0,0,0,0,0,0,0,-1,-1],
[-1,-1,0,0,0,0,0,0,0,0,0,-1,-1],
[-1,-1,0,0,0,0,0,0,0,0,-1,-1,-1],
[-1,-1,-1,0,0,0,0,0,0,0,-1,-1,-1]];

var bmpText;
var hexTileHeight=61;//this is for horizontal
var hexTileWidth=52;//for horizontal
var hexGrid;
var infoTxt;
var numMines=20;
var blankTiles=0;
var revealedTiles=0;


function preload() {
    //load all necessary assets
    game.load.bitmapFont('font', 'assets/font.png', 'assets/font.xml');
    game.load.image('hex', 'assets/hexsmall.png');
}

function create() {
    bmpText = game.add.bitmapText(10, 10, 'font', 'Horizontal HexMine', 18);
    game.stage.backgroundColor = '#cccccc';
    createLevel();
    infoTxt=game.add.text(10,30,'hi');
    //game.input.addMoveCallback(findHexTile, this);
    game.input.activePointer.leftButton.onUp.add(onTap);
}

function createLevel(){
    hexGrid=game.add.group();
   
    var verticalOffset=hexTileHeight*3/4;
    var horizontalOffset=hexTileWidth;
    var startX;
    var startY;
    var startXInit=hexTileWidth/2;
    var startYInit=hexTileHeight/2;
    
    addMines();
    
    var hexTile;
    for (var i = 0; i < levelData.length; i++)
    {
        if(i%2!=0){
            startX=2*startXInit;
        }else{
            startX=startXInit;
        }
        startY=startYInit+(i*verticalOffset);
        for (var j = 0; j < levelData[0].length; j++)
        {
            if(levelData[i][j]!=-1){
                hexTile= new HexTile(game, startX, startY, 'hex',false,i,j,levelData[i][j]);
                hexGrid.add(hexTile);
                if(levelData[i][j]!=10){
                    blankTiles++;
                }
            }
            
            startX+=horizontalOffset;
        }
        
    }
    //hexGrid.scale=new Phaser.Point(0.4,0.4);
    hexGrid.x=50;
    hexGrid.y=50;
}
function addMines(){
    var tileType=0;
    var tempArray=[];
    var newPt=new Phaser.Point();
    for (var i = 0; i < levelData.length; i++)
    {
        for (var j = 0; j < levelData[0].length; j++)
        {
            tileType=levelData[i][j];
            if(tileType==0){
                newPt=new Phaser.Point();
                newPt.x=i;
                newPt.y=j;
                tempArray.push(newPt);
            }
        }
    }
    for (var i = 0; i < numMines; i++)
    {
        newPt=Phaser.ArrayUtils.removeRandomItem(tempArray);
        levelData[newPt.x][newPt.y]=10;//10 is mine
        updateNeighbors(newPt.x,newPt.y);
    }
}
function updateNeighbors(i,j){//update neighbors around this mine
    var tileType=0;
    var tempArray=getNeighbors(i,j);
    var tmpPt;
    for (var k = 0; k < tempArray.length; k++)
    {
        tmpPt=tempArray[k];
        tileType=levelData[tmpPt.x][tmpPt.y];
        levelData[tmpPt.x][tmpPt.y]=tileType+1;
    }
}
function getNeighbors(i,j){
    //first add common elements for odd & even rows
    var tempArray=[];
    var newi=i-1;//tr even tl odd
    var newj=j;
    populateNeighbor(newi,newj,tempArray);
    newi=i;
    newj=j-1;//l even odd
    populateNeighbor(newi,newj,tempArray);
    newi=i+1;
    newj=j;//br even bl odd
    populateNeighbor(newi,newj,tempArray);
    newi=i;//r even odd
    newj=j+1;
    populateNeighbor(newi,newj,tempArray);
    //now add the different neighbours for odd & even rows
    if(i%2==0){
        newi=i-1;
        newj=j-1;//tl even
        populateNeighbor(newi,newj,tempArray);
        newi=i+1;//bl even 
        populateNeighbor(newi,newj,tempArray);
    }else{
        newi=i-1;
        newj=j+1;//tr odd
        populateNeighbor(newi,newj,tempArray);
        newi=i+1;//br odd
        populateNeighbor(newi,newj,tempArray);
    }
    
    return tempArray;
}
function checkForOccuppancy(i,j){//check if the tile is outside effective area or has a mine
    var tileType=levelData[i][j];
    if(tileType==-1 || tileType==10){
        return true;
    }
    return false;
}
function checkforBoundary(i,j){//check if the tile is outside level data array
    if(i<0 || j<0 || i >levelData.length-1 || j>levelData[0].length-1){
        return true;
    }
    return false;
}
function populateNeighbor(i,j, tempArray){//check & add new neighbor
    var newPt=new Phaser.Point();
    if(!checkforBoundary(i,j)){
        if(!checkForOccuppancy(i,j)){
            newPt=new Phaser.Point();
            newPt.x=i;
            newPt.y=j;
            tempArray.push(newPt);
        }
    }
}
function onTap(){
    var tile= findHexTile();
    if (game.input.activePointer.duration > 400) {//long press to toggle marking suspicious tile
        var hexTile=hexGrid.getByName("tile"+tile.x+"_"+tile.y);
        hexTile.toggleMark();
        return;
    }
    if(!checkforBoundary(tile.x,tile.y)){
        if(checkForOccuppancy(tile.x,tile.y)){
            if(levelData[tile.x][tile.y]==10){
                console.log('boom');
                var hexTile=hexGrid.getByName("tile"+tile.x+"_"+tile.y);
                if(!hexTile.revealed){
                    hexTile.reveal();
                    //game over
                }
            }
        }else{
            var hexTile=hexGrid.getByName("tile"+tile.x+"_"+tile.y);
                    
            if(!hexTile.revealed){
                if(levelData[tile.x][tile.y]==0){
                    console.log('recursive reveal');
                    recursiveReveal(tile.x,tile.y);
                }else{
                    //console.log('reveal');
                    hexTile.reveal();
                    revealedTiles++;
                }
                
            }
        }
    }
    infoTxt.text='found '+revealedTiles +' of '+blankTiles;
}
function findHexTile(){
    var pos=game.input.activePointer.position;
    pos.x-=hexGrid.x;
    pos.y-=hexGrid.y;
    var xVal = Math.floor((pos.x)/hexTileWidth);
    var yVal = Math.floor((pos.y)/(hexTileHeight*3/4));
    var dX = (pos.x)%hexTileWidth;
    var dY = (pos.y)%(hexTileHeight*3/4); 
    var slope = (hexTileHeight/4)/(hexTileWidth/2);
    var caldY=dX*slope;
    var delta=hexTileHeight/4-caldY;
    
    if(yVal%2==0){
       //correction needs to happen in triangular portions & the offset rows
       if(Math.abs(delta)>dY){
           if(delta>0){//odd row bottom right half
                xVal--;
                yVal--;
           }else{//odd row bottom left half
                yVal--;
           }
       }
    }else{
        if(dX>hexTileWidth/2){// available values don't work for even row bottom right half
            //console.log(delta+':'+dY+':'+((hexTileHeight/2)-caldY)); 
            if(dY<((hexTileHeight/2)-caldY)){//even row bottom right half
                yVal--;
            }
        }else{
           if(dY>caldY){//odd row top right & mid right halves
               xVal--;
           }else{//even row bottom left half
               yVal--;
           }
        }
    }
   
   //infoTxt.text='i'+yVal +'j'+xVal;
   pos.x=yVal;
   pos.y=xVal;
   return pos;
}
function recursiveReveal(i,j){
    var newPt=new Phaser.Point(i,j);
    var hexTile;
    var tempArray=[newPt];
    var neighbors;
    while (tempArray.length){
        newPt=tempArray[0];
        var neighbors=getNeighbors(newPt.x,newPt.y);
        
        while(neighbors.length){
            newPt=neighbors.shift();
            hexTile=hexGrid.getByName("tile"+newPt.x+"_"+newPt.y);
            if(!hexTile.revealed){
                hexTile.reveal();
                revealedTiles++;
                if(levelData[newPt.x][newPt.y]==0){
                    tempArray.push(newPt);
                }
            }
        }
        tempArray.shift();
    }
}
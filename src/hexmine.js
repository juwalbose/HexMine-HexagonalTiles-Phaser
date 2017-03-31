/*global Phaser*/
/* activity spawns pickups randomly which the character can collect by walking over */

var game = new Phaser.Game(800, 680, Phaser.AUTO, 'TutContainer', { preload: preload, create: create});

//horizontal tile shaped level
var levelData=
[[0,0,0,1,1,1,1,1,1,1,0,0,0],
[0,0,1,1,1,1,1,1,1,1,0,0,0],
[0,0,1,1,1,1,1,1,1,1,1,0,0],
[0,1,1,1,1,1,1,1,1,1,1,0,0],
[0,1,1,1,1,1,1,1,1,1,1,1,0],
[1,1,1,1,1,1,1,1,1,1,1,1,0],
[1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,0],
[0,1,1,1,1,1,1,1,1,1,1,1,0],
[0,1,1,1,1,1,1,1,1,1,1,0,0],
[0,0,1,1,1,1,1,1,1,1,1,0,0],
[0,0,1,1,1,1,1,1,1,1,0,0,0],
[0,0,0,1,1,1,1,1,1,1,0,0,0]];

var bmpText;
var hexTileHeight=61;//this is for horizontal
var hexTileWidth=52;//for horizontal
var hexGrid;
var isVertical=false;
var infoTxt;
var numMines=10;


function preload() {
    //load all necessary assets
    game.load.bitmapFont('font', 'assets/font.png', 'assets/font.xml');
    game.load.image('hex', 'assets/hexsmall.png');
}

function create() {
    bmpText = game.add.bitmapText(10, 10, 'font', 'Hex Tutorial', 18);
    game.stage.backgroundColor = '#cccccc';
    createLevel();
    infoTxt=game.add.text(10,30,'hi');
    game.input.addMoveCallback(findHexTile, this);
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
   
   infoTxt.text='i'+yVal +'j'+xVal;
}

function createLevel(){
    hexGrid=game.add.group();
   
    var verticalOffset=hexTileHeight*3/4;
    var horizontalOffset=hexTileWidth;
    var startX;
    var startY;
    var startXInit=hexTileWidth/2;
    var startYInit=hexTileHeight/2;
    
    if(isVertical){// we need to swap width & height values of the sprite used as its rotated by 90
        startYInit=hexTileWidth/2;
        startXInit=hexTileWidth/2;
        verticalOffset=hexTileWidth;
        horizontalOffset=hexTileHeight*3/4;
        levelData=transpose(levelData);// we transpose the level array so that it creates proper shape
    }
    
    addMines();
    
    var hexTile;
    for (var i = 0; i < levelData.length; i++)
    {
        if(isVertical){
            startX=0;
            startY=startYInit+(i*verticalOffset);
            for (var j = 0; j < levelData[0].length; j++)
            {
                if(j%2!=0){
                    startY=startY+startXInit;
                }else{
                    startY=startY-startXInit;
                }
                if(levelData[i][j]!=0){
                    hexTile= new HexTile(game, startX, startY, 'hex',isVertical, true,i,j);
                    hexGrid.add(hexTile);
                }
            
                startX+=horizontalOffset;
            }
        }else{
            if(i%2!=0){
                startX=2*startXInit;
            }else{
                startX=startXInit;
            }
            startY=startYInit+(i*verticalOffset);
            for (var j = 0; j < levelData[0].length; j++)
            {
                if(levelData[i][j]!=0){
                    hexTile= new HexTile(game, startX, startY, 'hex',isVertical, true,i,j,levelData[i][j]);
                    hexGrid.add(hexTile);
                }
            
                startX+=horizontalOffset;
            }
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
            if(tileType==1){
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
    }
}

function transpose(a) {
    return Object.keys(a[0]).map(
        function (c) { return a.map(function (r) { return r[c]; }); }
        );
}
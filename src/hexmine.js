/*global Phaser*/
/* activity spawns pickups randomly which the character can collect by walking over */

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'TutContainer', { preload: preload, create: create, update:update });

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
var hexTileHeight=102;//this is for horizontal
var hexTileWidth=88;//for horizontal
var hexGrid;
var isVertical=false;


function preload() {
    //load all necessary assets
    game.load.bitmapFont('font', 'assets/font.png', 'assets/font.xml');
    game.load.image('hex', 'assets/hexsmall.png');
}

function create() {
    bmpText = game.add.bitmapText(10, 10, 'font', 'Hex Tutorial', 18);
    game.stage.backgroundColor = '#cccccc';
    createLevel();
}

function update(){
   
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
                    hexTile= new HexTile(game, startX, startY, 'hex',isVertical, true,j,i);
                    hexGrid.add(hexTile);
                }
            
                startX+=horizontalOffset;
            }
        }else{
            if(i%2!=0){
                startX=startXInit;
            }else{
                startX=0;
            }
            startY=startYInit+(i*verticalOffset);
            for (var j = 0; j < levelData[0].length; j++)
            {
                if(levelData[i][j]!=0){
                    hexTile= new HexTile(game, startX, startY, 'hex',isVertical, true,j,i);
                    hexGrid.add(hexTile);
                }
            
                startX+=horizontalOffset;
            }
        }
    }
    hexGrid.scale=new Phaser.Point(0.4,0.4);
    hexGrid.x=50;
    hexGrid.y=60;
}

function transpose(a) {
    return Object.keys(a[0]).map(
        function (c) { return a.map(function (r) { return r[c]; }); }
        );
}
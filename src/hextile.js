//  Here is a custom game object
HexTile = function (game, x, y, tileImage,isVertical, isDebug, i,j) {

    Phaser.Sprite.call(this, game, x, y, tileImage);
    this.anchor.setTo(0.5, 0.5);
    if(isDebug){
        //var z=-i-j;
        var tileTag = game.make.text(0,0,'i'+i+',j'+j);
        tileTag.anchor.setTo(0.5, 0.5);
        tileTag.addColor('#ffffff',0);
        if(isVertical){
            tileTag.rotation=-Math.PI/2;
        }
        this.addChild(tileTag);
    }
    if(isVertical){
        this.rotation=Math.PI/2;
    }
    //this.inputEnabled=true;
    //this.events.onInputDown.add(paintRed, this);
};

HexTile.prototype = Object.create(Phaser.Sprite.prototype);
HexTile.prototype.constructor = HexTile;

/**
 * Automatically called by World.update
 */
HexTile.prototype.update = function() {

};
/*
paintRed=function(){
    this.tint='#ff0000';
}*/
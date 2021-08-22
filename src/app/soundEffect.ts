import { AsteroidsGame } from './asteroidsGame';
import { GameTimer } from './gameTimer';
import { Howl } from 'howler';
import { throws } from 'assert';

export class SoundEffect {
    private sound:Howl;
    private repeatTimer;
    private repeatCounter;
    
    constructor(url:string,gameEngine:AsteroidsGame) {
        this.sound=new Howl({src:[url]})
        this.repeatTimer=gameEngine.createTimer(1000,()=>{this.repeatSound()})
    }
    

    private repeatSound() {
        this.play()
        if(this.repeatCounter-- > 0)
            this.repeatTimer.restart();
        
    }

    public play(loop:boolean=false) {
        if(loop) 
            this.sound.loop(true)
        this.sound.play();
    }

    public loop() {
        this.sound.loop(true)
        this.sound.play();
    }

    public stop() {
        this.sound.mute();
        this.sound.stop();
    }

    public volume(level:number) {
        this.sound.volume(level)
    }

    public isPlaying():boolean {
        return this.sound.playing();
    }

    public repeat(repeatNo:number, delay:number) {
        this.repeatTimer.time=delay;
        this.repeatCounter=repeatNo-1;
        this.play();
        this.repeatTimer.restart();
    }
}
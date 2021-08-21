import { Howl } from 'howler';

export class SoundEffect {
    private sound:Howl;
    
    constructor(url:string) {
        this.sound=new Howl({src:[url]})
    }

    public play(loop:boolean=false) {
        if(loop) 
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
}
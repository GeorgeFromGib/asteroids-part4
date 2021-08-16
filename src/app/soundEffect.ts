import { Howl } from 'howler';


export class SoundEffect {
    private sound:Howl;
    
    constructor(url:string) {
        this.sound=new Howl({src:[url],html5:true})
    }

    public play(loop:boolean=false) {
        this.sound.play();
        if(loop) 
            this.sound.loop(true)
    }

    public stop() {
        this.sound.stop();
    }

    public isPlaying():boolean {
        return this.sound.playing();
    }
}
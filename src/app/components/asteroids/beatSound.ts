import { GameTimer } from "../../gameTimer";
import { SoundEffect } from "../../soundEffect";
import { AsteroidsGame } from "./../../asteroidsGame";

export class BeatSoundEffect {
    levelBeatSounds: SoundEffect[];
    beatSoundTimer: GameTimer;
    beatDelays: number[] = [1000, 500, 300];
    increaseBeatTimer: GameTimer;
    increaseBeatIndex: number = 0;
    beatIndex: number = 0;

    constructor(protected gameEngine: AsteroidsGame) {
        this.levelBeatSounds = [
            this.gameEngine.soundEffects.get("beat1"),
            this.gameEngine.soundEffects.get("beat2"),
        ];
        this.levelBeatSounds.forEach((s) => s.volume(0.5));
        this.beatSoundTimer = new GameTimer(500, () => {
            this.levelBeatSounds[this.beatIndex].play();
            this.beatIndex = 1 - this.beatIndex;
            this.beatSoundTimer.restart();
        });
        this.increaseBeatTimer = new GameTimer(30000, () => {
            this.increaseBeatIndex = Math.min(
                this.beatDelays.length - 1,
                this.increaseBeatIndex + 1
            );
            this.beatSoundTimer.time = this.beatDelays[this.increaseBeatIndex];
            this.increaseBeatTimer.restart();
        });
    }

    public reset() {
        this.beatSoundTimer.reset();
    }

    public start() {
        this.increaseBeatIndex = 0;
        this.beatSoundTimer.time = this.beatDelays[0];
        this.beatSoundTimer.restart();
        this.increaseBeatTimer.restart();
    }
}

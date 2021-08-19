import { SoundEffect } from './../../soundEffect';
import { GameTimer } from "../../gameTimer";
import { Vector } from "p5";
import { ManagerBase } from "../../shared/managers/base/managerBase";
import { SpaceshipActor } from "./spaceshipActor";
import { ISpaceship } from "../../shared/interfaces/iConfig";


export enum ShipTurn {
    LEFT = -1,
    RIGHT = 1,
    STOP = 0,
}

export class PlayerShipManager extends ManagerBase {
    ship: SpaceshipActor;
    firing: boolean;
    lastShot = 0;
    spaceship: ISpaceship;
    safeShipTimer: GameTimer;
    hyperSpaceTimer: GameTimer;
    fireTimer:GameTimer;
    thrustSound: SoundEffect;
    shipExplosion: SoundEffect;
    shipIsPlacing:boolean;

    public setup() {
        this.spaceship = this.gameEngine.configData.spaceship;
        this.shipIsPlacing=false;
        this.safeShipTimer = this.gameEngine.createTimer(500, () => {
            this.shipIsPlacing=true;
            this.placeShipInSafeSpace(this.gameEngine.screenSize.center,this.safeShipTimer);
        });
        this.hyperSpaceTimer = this.gameEngine.createTimer(1000, () => {
            const constraintPct=0.2;
            const safeRadius=20;
            this.placeShipInSafeSpace(
                this.gameEngine.getRandomScreenPosition(constraintPct),
                this.hyperSpaceTimer,
                safeRadius,
            );
        });
        this.fireTimer=this.gameEngine.createTimer(this.spaceship.rateOfFire)
        //this.createShip();
    }

    public loadSounds() {
        this.thrustSound=this.gameEngine.soundEffects.get('thrust')
        this.shipExplosion=this.gameEngine.soundEffects.get('bangMedium')
    }

    public update(timeDelta: number) {
        this._actors = [];
        if (this.firing && this.ship)
            if (this.fireTimer.expired) {
                this.fireProjectile();
                this.fireTimer.restart();
            }
       
        if (this.ship) {
            this._actors.push(this.ship);
        }
        super.update(timeDelta);
    }

    public createShip() {
        this.ship = new SpaceshipActor(this.spaceship);
        this.ship.position = this.gameEngine.screenSize.center;
        this.firing = false;
    }

    public showShip() {
        this.placeShipInSafeSpace(this.gameEngine.screenSize.center,this.safeShipTimer)
    }

    public placeShipInSafeSpace(position: Vector,timer:GameTimer,safeRadius: number = 200 ) {
        let show = true;
        show=this.gameEngine.asteroidsManager.asteroids.every(a=>  
            (position.dist(a.position) > safeRadius && this.gameEngine.saucerManager.saucer==undefined)
        );
        if (show) {
            this.shipIsPlacing=false;
            this.createShip();
            this.ship.position = position.copy();
        } else {
            timer.restart();
        }
    }

    public shipHit() {
        this.gameEngine.scoresManager.lives--;
        this.thrustSound.stop();
        this.shipExplosion.play();
        this.gameEngine.explosionsManager.createShipExplosion(
            this.spaceship.model,
            this.ship
        );
        this.ship=undefined;
    }

    public turn(turn: ShipTurn) {
        this.ship.turn(turn);
    }

    public engine(on: boolean) {
        this.ship.thrusting = on;
        this.playThrustSound(on);
    }

    public fire(on: boolean) {
        this.firing = on;
    }

    public hyperSpace() {
        if (!this.hyperSpaceTimer.expired) return;
        this.ship=undefined;
        this.hyperSpaceTimer.restart();
    }

    private fireProjectile() {
        this.gameEngine.projectilesManager.addPlayerProjectile(this.ship,this.spaceship.projectileVel,this.spaceship.projectileLife)
    }

    private playThrustSound(thrust:boolean) {
    if(!this.thrustSound.isPlaying() && thrust)
        this.thrustSound.play(true);
    if(!thrust)
        this.thrustSound.stop();
    }
}

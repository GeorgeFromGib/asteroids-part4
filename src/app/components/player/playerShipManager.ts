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
    shipShowTimer: GameTimer;
    hyperSpaceTimer: GameTimer;
    fireTimer:GameTimer;

    public setup() {
        this.spaceship = this.gameEngine.configData.spaceship;
        this.shipShowTimer = this.gameEngine.createTimer(3000, () => {
            this.placeShipInSafeSpace(this.gameEngine.screenSize.center,this.shipShowTimer);
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
        this.createShip();
    }

    public update(timeDelta: number) {
        this._actors = [];
        if (this.firing && this.ship.show)
            if (this.fireTimer.expired) {
                this.fireProjectile();
                this.fireTimer.restart();
            }
       
        if (this.ship.show) {
            this._actors.push(this.ship);
        }
        super.update(timeDelta);
    }

    public createShip() {
        this.ship = new SpaceshipActor(this.spaceship);
        this.ship.position = this.gameEngine.screenSize.center;
        this.ship.show = false;
        this.firing = false;
    }

    public showShip() {
        this.placeShipInSafeSpace(this.gameEngine.screenSize.center,this.shipShowTimer)
    }

    public displayShip(show: boolean) {
        this.ship.show = show;
        if (!show) {
            this.ship.thrusting = false;
        }
    }

    public startNewLife() {
        this.shipShowTimer.restart();
    }

    public placeShipInSafeSpace(position: Vector,timer:GameTimer,safeRadius: number = 200 ) {
        let show = true;
        show=this.gameEngine.asteroidsManager.asteroids.every(a=>  
            (position.dist(a.position) > safeRadius && this.gameEngine.saucerManager.saucer==undefined)
        );
        if (show) {
            this.createShip();
            this.ship.position = position.copy();
            this.displayShip(true);
        } else {
            timer.restart();
        }
    }

    public shipHit() {
        this.gameEngine.scoresManager.lives--;
        this.displayShip(false);
        this.gameEngine.explosionsManager.createShipExplosion(
            this.spaceship.model,
            this.ship
        );
        if (this.gameEngine.scoresManager.lives > 0) this.startNewLife();
    }

    public turn(turn: ShipTurn) {
        this.ship.turn(turn);
    }

    public engine(on: boolean) {
        this.ship.thrusting = on;
    }

    public fire(on: boolean) {
        this.firing = on;
    }

    public hyperSpace() {
        if (!this.hyperSpaceTimer.expired) return;
        this.displayShip(false);
        this.hyperSpaceTimer.restart();
    }

    private fireProjectile() {
        this.gameEngine.projectilesManager.addPlayerProjectile(this.ship,this.spaceship.projectileVel,this.spaceship.projectileLife)
    }
}

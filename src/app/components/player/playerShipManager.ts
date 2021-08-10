import { GameTimer } from "../../gameTimer";
import { Vector } from "p5";
import { AsteroidsGame } from "../../asteroidsGame";
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

    constructor(gameEngine: AsteroidsGame) {
        super(gameEngine);
        this.shipShowTimer = gameEngine.createTimer(3000, () => {
            this.placeShipInSafeSpace(gameEngine.screenSize.center);
        });
        this.hyperSpaceTimer = gameEngine.createTimer(1000, () => {
            this.placeShipInSafeSpace(
                gameEngine.getRandomScreenPosition(0.2),
                20
            );
        });
        this.spaceship = gameEngine.configData.spaceship;
        this.createShip();
    }

    public createShip() {
        this.ship = new SpaceshipActor(this.spaceship);
        this.ship.position = this.gameEngine.screenSize.center;
        this.ship.show = false;
        this.firing = false;
    }

    public showShip(show: boolean) {
        this.ship.show = show;
        if (!show) {
            this.ship.thrusting = false;
        }
    }

    public startNewLife() {
        this.shipShowTimer.restart();
    }

    public placeShipInSafeSpace(position: Vector, safeRadius: number = 200) {

        let show = true;

        this.gameEngine.asteroidsManager.asteroids.forEach((asteroid) => {
            show = (position.dist(asteroid.position) > safeRadius && this.gameEngine.saucerManager.saucer==undefined);
            if (!show) return;
        });

        if (show) {
            this.createShip();
            this.ship.position = position.copy();
            this.showShip(true);
        } else {
            this.shipShowTimer.restart();
        }
    }

    public update(timeDelta: number) {
        this._actors = [];
        if (this.firing && this.ship.show)
            if (
                this.gameEngine.elapsedTime - this.lastShot >
                this.spaceship.rateOfFire
            ) {
                this.fireProjectile();
                this.lastShot = this.gameEngine.elapsedTime;
            }
       
        if (this.ship.show) {
            this._actors.push(this.ship);
        }
        super.update(timeDelta);
    }

    public shipHit() {
        this.gameEngine.scoresManager.lives--;
        this.showShip(false);
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
        this.showShip(false);
        this.hyperSpaceTimer.restart();
    }

    private fireProjectile() {
        this.gameEngine.projectilesManager.addPlayerProjectile(this.ship,this.spaceship.projectileVel,this.spaceship.projectileLife)
    }
}

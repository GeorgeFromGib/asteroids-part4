import {GameTimer} from "../../gameTimer";
import {ManagerBase} from "../../shared/managers/base/managerBase";
import {ShipTurn, SpaceshipActor} from "./spaceshipActor";
import {ISpaceship} from "../../shared/interfaces/iConfig";
import {Vector2D} from '../../vector2d';


export class PlayerShipManager extends ManagerBase {
    ship: SpaceshipActor;
    firing: boolean;
    spaceship: ISpaceship;
    safeShipTimer: GameTimer;
    hyperSpaceTimer: GameTimer;
    fireTimer: GameTimer;
    shipIsPlacing: boolean;

    public setup() {
        this.spaceship = this.gameEngine.configData.spaceship;
        this.shipIsPlacing = false;
        this.fireTimer = new GameTimer(this.spaceship.rateOfFire)
        this.safeShipTimer = new GameTimer(200, () => {
            this.placeShipInSafeSpace(this.gameEngine.screenSize.center, this.safeShipTimer);
        });
        this.hyperSpaceTimer = new GameTimer(1000, () => {
            this.goToHyperspace();
        });
    }

    public loadSounds() {
    }

    public update(timeDelta: number) {
        this._actors = [];
        this.checkIfFiring();

        if (this.ship) {
            this._actors.push(this.ship);
        }
        super.update(timeDelta);
    }

    public showShip() {
        this.shipIsPlacing = true;
        this.placeShipInSafeSpace(this.gameEngine.screenSize.center, this.safeShipTimer)
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
        this.ship = undefined;
        this.shipIsPlacing = true;
        this.hyperSpaceTimer.restart();
    }

    private checkIfFiring() {
        if (this.firing && this.ship)
            if (this.fireTimer.expired) {
                this.fireProjectile();
                this.fireTimer.restart();
            }
    }

    private placeShipInSafeSpace(position: Vector2D, timer: GameTimer, safeRadius: number = 200) {
        let show: boolean;
        show = this.canShipShow(position, safeRadius);
        if (show) {
            this.createShip(position);
            this.shipIsPlacing = false;
        } else {
            timer.restart();
        }
    }

    private createShip(position: Vector2D) {
        this.ship = new SpaceshipActor(this.spaceship);
        this.ship.position = position.copy()
        this.firing = false;
    }

    private canShipShow(position: Vector2D, safeRadius: number) {
        return this.gameEngine.asteroidsManager.asteroids.every(a =>
            (position.dist(a.position) > safeRadius)
        );
    }

    private goToHyperspace() {
        const constraintPct = 0.2;
        const safeRadius = 20;
        this.placeShipInSafeSpace(
            this.gameEngine.getRandomScreenPosition(constraintPct),
            this.hyperSpaceTimer,
            safeRadius,
        );
    }

    private fireProjectile() {
        this.gameEngine.projectilesManager.addPlayerProjectile(
            this.ship,
            this.spaceship.projectileVel,
            this.spaceship.projectileLife)
    }

}
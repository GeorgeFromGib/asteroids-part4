import { Keys } from "./../asteroidsGame";
import { GameTimer } from "../gameTimer";
import { GameOverState } from "./GameOverState";
import { GameStateBase } from "../shared/gameStates/base/gameStateBase";
import { Asteroid } from "../components/asteroids/asteroid";
import { SaucerActor } from "../components/saucer/saucerActor";
import {
    PlayerShipManager,
    ShipTurn,
} from "../components/player/playerShipManager";
import { SpaceshipActor } from "../components/player/spaceshipActor";
import { AsteroidsManager } from "../components/asteroids/asteroidsManager";
import {
    ProjectileActor,
    ProjectileSource,
} from "../components/projectiles/ProjectileActor";
import { ActorBase } from "../shared/actors/base/actorBase";

export class PlayGameState extends GameStateBase {
    playerMan: PlayerShipManager;
    asteroidsMan: AsteroidsManager;
    newLevelTimer: GameTimer;
    level: number = 0;
    saucerTimer: GameTimer;

    public setup() {
        this.asteroidsMan = this.gameEngine.asteroidsManager;
        this.newLevelTimer = this.gameEngine.createTimer(2000, () => {
            this.newLevel();
        });
        this.playerMan = this.gameEngine.playerManager;
        this.playerMan.showShip();
        this.saucerTimer = this.gameEngine.createTimer(4000, () => {
            this.showSaucer();
        });
    }

    public update(timeDelta: number) {
        if (this.gameEngine.scoresManager.lives <= 0) this.nextState();
        if (
            this.asteroidsMan.levelCompleted &&
            !this.gameEngine.saucerManager.saucer &&
            this.newLevelTimer.expired
        ) {
            this.newLevelTimer.restart();
        }
        // if (!this.gameEngine.saucerManager.saucer && this.saucerTimer.expired) {
        //     const timeDecrement = this.level * 1000;
        //     const minDelay = Math.max(1000, 10000 - timeDecrement);
        //     const maxDelay = Math.max(1500, 15000 - timeDecrement);
        //     this.saucerTimer.time = this.gameEngine.randomRange(
        //         minDelay,
        //         maxDelay
        //     );
        //     this.saucerTimer.restart();
        // }

        this.checkCollisions();
    }

    public showShip() {}

    public showSaucer() {
        this.gameEngine.saucerManager.createSaucer(this.level);
    }

    public newLevel() {
        this.level++;
        this.asteroidsMan.startLevel(this.level);
    }

    public handleKeyPress(key: Keys) {
        if (!this.playerMan.ship) return;
        if (key == Keys.RIGHT_ARROW) this.playerMan.turn(ShipTurn.RIGHT);
        if (key == Keys.LEFT_ARROW) this.playerMan.turn(ShipTurn.LEFT);
        if (key == Keys.UP_ARROW) this.playerMan.engine(true);
        if (key == Keys.SPACE) this.playerMan.fire(true);
        if (key == Keys.RIGHT_CTRL) this.playerMan.hyperSpace();
    }

    public handleKeyRelease(key: Keys) {
        if (!this.playerMan.ship) return;
        if (key == Keys.RIGHT_ARROW || key == Keys.LEFT_ARROW)
            this.playerMan.turn(ShipTurn.STOP);
        if (key == Keys.UP_ARROW) this.playerMan.engine(false);
        if (key == Keys.SPACE) this.playerMan.fire(false);
    }

    public nextState() {
        //this.playerMan.displayShip(false);
        this.saucerTimer.reset();
        this.gameEngine.saucerManager.clear();
        this.gameEngine.gameState = new GameOverState(this.gameEngine);
    }

    private checkCollisions() {
        const asteroids = this.gameEngine.asteroidsManager.actors;
        const saucers = this.gameEngine.saucerManager.actors;
        const ship = this.gameEngine.playerManager.ship;
        const shipProjectiles =
            this.gameEngine.projectilesManager.sourceProjectiles(
                ProjectileSource.PLAYER
            );
        const saucerProjectiles =
            this.gameEngine.projectilesManager.sourceProjectiles(
                ProjectileSource.SAUCER
            );
        if (ship) {
            this.checkShipCollisions(ship, asteroids, saucers);
        }
        this.checkSaucerCollisions(saucers, asteroids);
        this.checkShipProjectileCollisions(shipProjectiles, asteroids, saucers);
        this.checkSaucerProjectileCollisions(
            saucerProjectiles,
            asteroids,
            ship
        );
    }

    private checkSaucerCollisions(
        saucers: ActorBase[],
        asteroids: ActorBase[]
    ) {
        saucers.forEach((s) => {
            const colA = s.hasCollided(asteroids) as Asteroid;
        });
    }

    private checkSaucerProjectileCollisions(
        saucerProjectiles: ProjectileActor[],
        asteroids: ActorBase[],
        ship: SpaceshipActor
    ) {
        saucerProjectiles.forEach((p) => {
            const colA = p.hasCollided(asteroids) as Asteroid;
            if (ship) {
                const colP = p.hasCollided([ship]) as SpaceshipActor;
                if (colP) this.gameEngine.playerManager.shipHit();
            }
        });
    }

    private checkShipProjectileCollisions(
        shipProjectiles: ProjectileActor[],
        asteroids: ActorBase[],
        saucers: ActorBase[]
    ) {
        shipProjectiles.forEach((p) => {
            const colA = p.hasCollided(asteroids) as Asteroid;
            if (colA != undefined) {
                this.gameEngine.scoresManager.addToScore(colA.points);
                return;
            }
            const colS = p.hasCollided(saucers) as SaucerActor;
            if (colS != undefined) {
                this.gameEngine.scoresManager.addToScore(colS.points);
            }
        });
    }

    private checkShipCollisions(
        ship: SpaceshipActor,
        asteroids: ActorBase[],
        saucers: ActorBase[]
    ) {
        if (!ship) return;
        const colA = ship.hasCollided(asteroids) as Asteroid;
        const colS = ship.hasCollided(saucers) as SaucerActor;
        if (colA != undefined || colS != undefined) {
            this.gameEngine.playerManager.shipHit();
        }
    }
}

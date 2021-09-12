import {GameTimer} from "../gameTimer";
import {GameStateBase} from "../shared/gameStates/base/gameStateBase";
import {PlayerShipManager} from "../components/player/playerShipManager";
import {ShipTurn} from "../components/player/spaceshipActor";
import {AsteroidsManager} from "../components/asteroids/asteroidsManager";
import {Keys} from "../asteroidsGame";
import {ProjectileSource} from "../components/projectiles/projectileActor";
import {AsteroidActor} from "../components/asteroids/asteroidActor";

export class PlayGameState extends GameStateBase {
    playerMan: PlayerShipManager;
    asteroidsMan: AsteroidsManager;
    newLevelTimer: GameTimer;
    level: number = 0;
    shipShowTimer: GameTimer;


    protected setup() {
        this.playerMan = this.gameEngine.playerManager;
        this.asteroidsMan = this.gameEngine.asteroidsManager;
        this.newLevelTimer = new GameTimer(2000, () => {
            this.newLevel();
        });
        this.shipShowTimer = new GameTimer(2000, () => {
            this.showShip();
        });
        this.playerMan.showShip();
    }

    public update(timeDelta: number) {
        if (!this.playerHasMoreLives()) {
            this.nextState();
            return
        }

        if (this.shouldNewAsteroidsLevelStart())
            this.newLevelTimer.restart();

        if (this.shouldPlayerShipBeShown())
            this.shipShowTimer.restart();

        this.checkCollisions();
    }

    public showShip() {
        this.playerMan.showShip();
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
        if (key == Keys.CTRL) this.playerMan.hyperSpace();
    }

    public handleKeyRelease(key: Keys) {
        if (!this.playerMan.ship) return;
        if (key == Keys.RIGHT_ARROW || key == Keys.LEFT_ARROW)
            this.playerMan.turn(ShipTurn.STOP);
        if (key == Keys.UP_ARROW) this.playerMan.engine(false);
        if (key == Keys.SPACE) this.playerMan.fire(false);
    }

    public nextState() {
    }

    private playerHasMoreLives() {
        return true;
    }

    private shouldPlayerShipBeShown() {
        return (!this.playerMan.ship && this.shipShowTimer.expired && !this.playerMan.shipIsPlacing)
    }

    private shouldNewAsteroidsLevelStart() {
        return (this.asteroidsMan.levelCompleted && this.newLevelTimer.expired)
    }

    private checkCollisions() {
        this.checkShipProjectileCollisions()
    }

    private checkShipProjectileCollisions() {
        const shipProjectiles =
            this.gameEngine.projectilesManager.sourceProjectiles(
                ProjectileSource.PLAYER
            );
        const asteroids = this.asteroidsMan.actors;
        shipProjectiles.forEach((p) => {
            const colA = p.hasCollided(asteroids) as AsteroidActor;
            if (colA != undefined) {
                return;
            }
        });
    }
}
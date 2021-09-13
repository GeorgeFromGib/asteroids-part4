import { AsteroidActor, SizeTypes } from "./asteroidActor";
import { ManagerBase } from "../../shared/managers/base/managerBase";
import { IAsteroids } from "../../shared/interfaces/iConfig";
import { Vector2D } from "../../vector2d";

export class AsteroidsManager extends ManagerBase {
    asteroids: AsteroidActor[] = [];
    asteroidModels: IAsteroids;
    levelCompleted: boolean = true;
    level: number = 1;

    public setup() {
        this.asteroidModels = this.gameEngine.configData.asteroids;
        this.levelCompleted = true;
    }

    public loadSounds() {}

    public update(timeDelta: number) {
        this._actors = [];

        if (this.hasLevelEnded()) {
            this.levelCompleted = true;
        }

        this.checkForCollidedAsteroids();

        this.asteroids = this.filterAsteroids();

        this._actors.push(...this.asteroids);

        super.update(timeDelta);
    }

    public startLevel(level: number) {
        this.levelCompleted = false;
        this.level = level;
        this.createAsteroidsField(6);
    }

    public createAsteroidsField(noOfAsteroids: number) {
        const screen = this.gameEngine.screenSize;
        const noGoRadius = screen.width / 4;
        const scrCntr = this.gameEngine.screenSize.center;
        for (let i = 0; i <= noOfAsteroids; i++) {
            let outside = false;
            let randPos: Vector2D;
            while (!outside) {
                const contstraintPct = 1;
                randPos =
                    this.gameEngine.getRandomScreenPosition(contstraintPct);
                outside = Vector2D.dist(randPos, scrCntr) > noGoRadius;
            }
            const position = randPos.copy();
            this.createAsteroid(position, SizeTypes.LARGE);
        }
    }

    public clear() {
        this.asteroids = [];
    }

    private checkForCollidedAsteroids() {
        this.asteroids.forEach((a) => {
            if (a.collidedWith !== undefined) this.hit(a);
        });
    }

    private filterAsteroids() {
        return this.asteroids.filter((a) => a.collidedWith == undefined);
    }

    private createAsteroid(pos: Vector2D, size: SizeTypes) {
        const aSize = this.GetAsteroidSizeProfile(size);
        const designModel = this.getRandomAsteroidDesignModel();
        const asteroid = new AsteroidActor(
            designModel,
            aSize.size as SizeTypes,
            aSize.points
        );
        asteroid.position = pos.copy();
        asteroid.velocity = this.getRandomVelocity(aSize.speed);
        asteroid.scale = aSize.scale;
        this.asteroids.push(asteroid);
    }

    private GetAsteroidSizeProfile(size: SizeTypes) {
        return this.asteroidModels.sizes.find((s) => s.size == size);
    }

    private getRandomAsteroidDesignModel() {
        const index = Math.floor(
            this.gameEngine.random(this.asteroidModels.designs.length)
        );
        return this.asteroidModels.designs[index];
    }

    private getRandomVelocity(speed: number) {
        const minSpeed = 30 * (1 + this.level / 100);
        const maxSpeed = 80 * speed;
        const vel = this.gameEngine.randomRange(minSpeed, maxSpeed);
        return Vector2D.random2D().mult(vel / 1000);
    }

    private hit(hitAsteroid: AsteroidActor) {
        if (hitAsteroid.size === SizeTypes.SMALL) {
            return;
        }
        const nextSize =
            hitAsteroid.size === SizeTypes.LARGE ? SizeTypes.MEDIUM : SizeTypes.SMALL;
        const posOffset=Vector2D.random2D().mult(1.5);
        const pos = hitAsteroid.position.add(posOffset);
        this.createAsteroid(pos, nextSize);
        this.createAsteroid(pos, nextSize);
    }

    private hasLevelEnded() {
        return (this.asteroids.length == 0)
    }
}

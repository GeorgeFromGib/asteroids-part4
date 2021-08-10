export interface IConfig {
    settings:  ISettings;
    spaceship: ISpaceship;
    asteroids: IAsteroids;
    saucer:    ISaucer;
    text:      ITextModel;
}

export interface IAsteroids {
    designs: IModel[];
    sizes:   ISaucerTypeProfile[];
}

export interface IModel {
    vertexes: number[][]
    vertices: number[][]
    radius:   number;
}

export interface ISaucerTypeProfile {
    size:      string;
    scale:     number;
    speed:     number;
    points:    number;
    fudgeAim?: number;
}

export interface ISaucer {
    model:          IModel;
    profiles:       ISaucerTypeProfile[];
    projectileVel:  number;
    projectileLife: number;
    rateOfFire:     number;
}

export interface ISettings {
    lives:     number;
    extraLife: number;
}

export interface ISpaceship {
    model:          IModel;
    thrust:         IModel;
    rotationVel:    number;
    thrustVel:      number;
    friction:       number;
    projectileVel:  number;
    projectileLife: number;
    rateOfFire:     number;
}

export interface ITextModel {
    vertexes:   number[][];
    radius:     number;
    characters: ICharacterModel[];
}

export interface ICharacterModel {
    char:     string;
    vertices: number[][]
}

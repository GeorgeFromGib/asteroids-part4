import { Vector } from 'p5';
import { Actor, IModel } from '../actors/actor';
import { AsteroidsGame } from './../asteroidsGame';
import { Manager } from "./manager";

export interface ICharacterModel {
    char:string;
    vertices:number[][];
}

export interface ITextModel {
    vertexes:number[][];
    radius:number;
    characters: ICharacterModel[];
}

export interface IText {
    name:string;
    characters:Actor[];
    position:Vector;

}

export class TextManager extends Manager {
    texts:IText[]=[];

    constructor(gameEngine:AsteroidsGame,protected textModel:ITextModel) {
        super(gameEngine);
    }

    public write(name:string, message:string,position:Vector, scale:number) {
        const messChars=[...message];
        const space=6;
        let xpos=0;
        const actors:Actor[]=[];
        messChars.forEach(c => {
            const model:IModel={
                vertexes:this.textModel.vertexes.map(v=>[v[0]+xpos,v[1]]),
                vertices:this.textModel.characters.find(h=>h.char===c).vertices,
                radius:this.textModel.radius
            }
            const charActor=new Actor(model,"VERTICED");
            charActor.position=position.copy();
            actors.push(charActor);
            xpos+=(this.textModel.radius*scale) + space;
        });
        this.texts=this.texts.filter(t=>t.name!==name);
        const text:IText={name:name,characters:actors,position:position.copy()}
        this.texts.push(text);
    }

    public update(timeDelta:number) {
        this._actors=[];
        this.texts.forEach(t=>{
            this._actors.push(...t.characters);
        })
        super.update(timeDelta);

    }

    

}
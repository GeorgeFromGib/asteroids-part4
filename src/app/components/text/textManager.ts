import { Vector } from 'p5';
import { ActorBase, IModel } from '../../shared/actors/base/actorBase';
import { ManagerBase } from '../../shared/managers/base/managerBase';
import { AsteroidsGame } from '../../asteroidsGame';
import { TextActor } from './textActor';
import { ITextModel } from '../../shared/interfaces/iConfig';
import { FlashingTextActor } from './FlashingTextActor';

export enum Justify {
    RIGHT,
    CENTER
}

export interface IText {
    name:string;
    characters:ActorBase;
    position:Vector;
    show:boolean;
    flashing:boolean;

}

export class TextManager extends ManagerBase {
    texts:IText[]=[];
    protected textModel:ITextModel


    public setup() {
        this.textModel=this.gameEngine.configData.text;
    }

    public update(timeDelta:number) {
        this._actors=[];
        this.texts.forEach(t=>{
            if(t.show)
                this._actors.push(t.characters);
        })
        super.update(timeDelta);
    }

   

    public write(name:string, message:string,xPos:number,yPos:number, scale:number, justify:Justify,show:boolean=true,flashing:boolean=false) {
        const space=4;
        const pos= this.getXpos(justify,  xPos, space, scale, message, yPos);
        const model= this.createMessageModel(message,space);
        const charActor = this.createMessageActor(flashing, model, pos, scale);
        this.clear(name);
        const text:IText={name:name,characters:charActor,position:pos,show:show,flashing:flashing}
        this.texts.push(text);
    }

    private createMessageActor(flashing: boolean, model: IModel, pos: Vector, scale: number) {
        const charActor = flashing ? new FlashingTextActor(model, 500) : new TextActor(model);
        charActor.position = pos;
        charActor.scale = scale;
        return charActor;
    }

    private getXpos(justify: Justify, xPos: number, space: number, scale: number, message: string, yPos: number) {
        let adjXpos=0;
        if (justify === Justify.RIGHT)
            adjXpos = xPos - ((this.textModel.radius + space) * scale * message.length);
        else if (justify === Justify.CENTER)
            adjXpos = xPos - ((this.textModel.radius + space) * scale * message.length / 2);
        const pos = new Vector().set(adjXpos, yPos);
        return pos;
    }

    private createMessageModel(message:string, space:number) {
        const messChars=[...message.toUpperCase()];
        const modelVerts=this.textModel.vertexes;
        const vertOffsetDiff=modelVerts.length;
        let xPosOffset = 0;
        let vertOffset = 0;
        let model: IModel = { vertexes: [], vertices: [], radius: 0 };
        messChars.forEach(c => {
            const vertices = this.textModel.characters.find(h => h.char === c).vertices;
            model.vertexes.push(...modelVerts.map(v => [v[0] + xPosOffset, v[1]]));
            model.vertices.push(...vertices.map(v => [v[0] + vertOffset, v[1] + vertOffset]));
            vertOffset += vertOffsetDiff;
            xPosOffset += this.textModel.radius + space;
        });
        model.radius = this.textModel.radius * messChars.length;
        return model;
    }

    public clear(name:string) {
        this.texts=this.texts.filter(t=>t.name!==name);
    }

    public show(name:string,show:boolean) {
        const text=this.texts.find(c=>c.name==name)
        if(text)
            text.show=show;
    }

   

    

}
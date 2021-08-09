
export class GameTimer {
  protected _countDown: number;
  protected _expired: boolean = true;

  constructor(public time: number, protected callback?: () => void) {
    this._countDown = time;
  }

  public get expired(): boolean {
    return this._expired;
  }

  public start() {
    this._expired = false;
  }

  public reset() {
    this._countDown = this.time;
    this._expired = true;
  }

  public restart() {
    this.reset();
    this.start();
  }

  public update(timeDelta: number) {
    if (!this._expired) {
      this._countDown -= timeDelta;
      if (this._countDown <= 0) {
        this._expired = true;
        this.callback && this.callback();
      }
    }
  }
}

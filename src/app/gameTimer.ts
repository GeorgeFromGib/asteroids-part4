
export class GameTimer {
  protected _countDown: number;
  protected _expired: boolean = true;
  protected _timer;

  constructor(public time: number, protected callback?: () => void) {
    this._countDown = time;
  }

  public get expired(): boolean {
    return this._expired;
  }

  public start() {
    this._expired = false;
    this._timer=setTimeout(this.timedOut,this.time)
  }

  private timedOut(timedOut: any) {
    this._expired=true;
    this.callback && this.callback();
  }

  public reset() {
    this._countDown = this.time;
    this._expired = true;
    clearTimeout(this._timer);
  }

  public restart() {
    this.reset();
    this.start();
  }

  // public update(timeDelta: number) {
  //   if (!this._expired) {
  //     this._countDown -= timeDelta;
  //     if (this._countDown <= 0) {
  //       this._expired = true;
  //       this.callback && this.callback();
  //     }
  //   }
  // }
}

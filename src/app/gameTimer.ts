
export class GameTimer {
  protected _countDown: number;
  protected _expired: boolean = true;
  protected _timer:any;

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

  private timedOut=()=> {
    this._expired=true;
    this.callback?.call(this)
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

}

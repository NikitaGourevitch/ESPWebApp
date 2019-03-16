class Esp{
    constructor(ip,tempNow,tempMin,radiatorOn, captorName,modeAuto) {
        this.ip = ip;
        this.tempNow = tempNow;
        this.tempMin = Math.trunc(tempMin);
        this.radiatorOn = radiatorOn;
        this.connected  = true;
        this.modeAuto  = modeAuto;
        this.lastTime = Date.now();
        this.captorName = captorName;
    }
}
module.exports = Esp;


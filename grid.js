class Grid {
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.grid = new Uint32Array((this.width * this.height + 31)/32);
        this.clear();
    }
    
    clear(){
        this.grid.fill(0);
    }

    set(x, y) {
        this._checkBounds(x, y)

        const pos = y * this.width + x;
        const bitfieldIndex = Math.floor(pos/32);
        let bitfield = this.grid[bitfieldIndex];
        const bitmask = 1 << (pos % 32)
        bitfield |= bitmask;
        this.grid[bitfieldIndex] = bitfield;
    }

    unset(x, y) {
        this._checkBounds(x, y)

        const pos = y * this.width + x;
        const bitfieldIndex = Math.floor(pos/32);
        let bitfield = this.grid[bitfieldIndex];
        const bitmask = 1 << (pos % 32)
        bitfield &= ~bitmask;
        this.grid[bitfieldIndex] = bitfield;
    }

    get(x, y) {
        this._checkBounds(x, y)

        const pos = y * this.width + x;
        const bitfieldIndex = Math.floor(pos/32);
        let bitfield = this.grid[bitfieldIndex];
        const bitmask = 1 << (pos % 32)
        return (bitfield & bitmask) != 0;
    }

    flip(x, y) {
        this._checkBounds(x, y)

        const pos = y * this.width + x;
        const bitfieldIndex = Math.floor(pos/32);
        let bitfield = this.grid[bitfieldIndex];
        const bitmask = 1 << (pos % 32)
        //const bitvalue = (bitfield & bitmask);
        bitfield ^= bitmask;
        this.grid[bitfieldIndex] = bitfield;
    }

    clone() {
        let res = new Grid(this.width, this.height);
        res.grid = [...this.grid];
        return res;
    }

    _checkBounds(x, y){
        if (x < 0 || x >= this.width || y < 0 || y >= this.height){
            throw new Error("Unable to access coordinates (" + x + ", " + y + ") in grid with size " + this.width + " " + this.height);
        }
    }
}
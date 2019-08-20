export default class Screen {
    constructor(
        width = 800,
        height = 600, 
        canvas = "canvas", 
        preventInit = false
    ) {
        this.canvas = document.getElementById(canvas);
        this.context = this.canvas.getContext("2d");
        this.canvasName = canvas;
        this.canvas.width = width;
        this.canvas.height = height;
        if(!preventInit) this.init();
        console.log("Screen '" + canvas + "' loaded.")
    }    
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
    setBackground(color) {
        this.canvas.style.background = color;
    }
    init() {
        this.canvas.style.background = "#FFAA00";
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    getMouse(event) {
        const rect = this.canvas.getBoundingClientRect();
        return { 
            x: event.clientX - rect.left, 
            y: event.clientY - rect.top 
        };
    }
    getTouch(event) {
        // NB! If you have a border, it is added to the position;
        event.preventDefault();
        return { x: event.changedTouches[0].pageX  , y: event.changedTouches[0].pageY };
    }
}
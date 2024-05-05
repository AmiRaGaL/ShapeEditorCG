var gridEnabled = false;
var gridLayer = new Konva.Layer(); // Separate layer for grid to easily show/hide
var snapToGridEnabled = false;

function toggleGrid() {
    gridEnabled = !gridEnabled;
    if (gridEnabled) {
        drawGrid();
    } else {
        gridLayer.destroyChildren(); // Clears the grid
    }
    stageDraw.add(gridLayer);
    gridLayer.draw();
}

function drawGrid() {
    gridLayer.destroyChildren(); // Clear previous grid lines if any
    var gridSize = 20; // Grid size in pixels
    for (var i = 0; i < stageDraw.width() / gridSize; i++) {
        var line = new Konva.Line({
            points: [i * gridSize, 0, i * gridSize, stageDraw.height()],
            stroke: '#ccc',
            strokeWidth: 1,
        });
        gridLayer.add(line);

        line = new Konva.Line({
            points: [0, i * gridSize, stageDraw.width(), i * gridSize],
            stroke: '#ccc',
            strokeWidth: 1,
        });
        gridLayer.add(line);
    }
}
function enableSnapToGrid(shape) {
    shape.on('dragmove', function () {
        var gridSize = 20; // Same as grid size
        shape.x(Math.floor(shape.x() / gridSize) * gridSize + gridSize / 2);
        shape.y(Math.floor(shape.y() / gridSize) * gridSize + gridSize / 2);
    });
}
function toggleSnapToGrid() {
    snapToGridEnabled = !snapToGridEnabled;
}

function enableSnapToGrid(shape) {
    shape.on('dragmove', function () {
        if (!snapToGridEnabled) return;
        var gridSize = 20; // Grid size in pixels
        shape.x(Math.round(shape.x() / gridSize) * gridSize);
        shape.y(Math.round(shape.y() / gridSize) * gridSize);
    });
}

//Drawing the grid on canvas, if user chooses so
function showGrid() {
    for (var i = 0; i <= (stageDraw.width() / 20); i++) {
        var hGridLines = new Konva.Line({
            points: [i * 20, 0, i * 20, stageDraw.height()],
            stroke: '#ccc',
            strokeWidth: 1
        });
        var vGridLines = new Konva.Line({
            points: [0, i * 20, stageDraw.width(), i * 20],
            stroke: '#ccc',
            strokeWidth: 1
        });

        layerDraw.add(hGridLines);
        layerDraw.add(vGridLines);
    }
    stageDraw.add(layerDraw);
}
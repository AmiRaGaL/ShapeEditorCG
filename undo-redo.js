var undoStack = [];
var redoStack = [];
var clipboard = null;

function undoAction() {
    if (undoStack.length > 0) {
        const action = undoStack.pop();
        redoStack.push(action);

        switch (action.action) {
            case 'create':
                action.shape.remove();
                layerDraw.draw();
                break;
            case 'transform':
                // Reverting to initial state
                action.shape.setAttrs(action.initialState);
                layerDraw.draw();
                break;
            // Handle other actions like move, transform, etc.
        }
    }
}

function redoAction() {
    if (redoStack.length > 0) {
        const action = redoStack.pop();
        undoStack.push(action);

        switch (action.action) {
            case 'create':
                layerDraw.add(action.shape);
                layerDraw.draw();
                break;
            case 'transform':
                // Applying the stored state for redo
                action.shape.setAttrs(action.finalState);
                layerDraw.draw();
                break;
            // Handle other actions like move, transform, etc.
        }
    }
}
function copyShape() {
    if (selectedShape) {
        clipboard = selectedShape.toJSON();
    }
}
function pasteShape() {
    if (clipboard) {
        var newShape = Konva.Node.create(clipboard);
        newShape.x(newShape.x() + 10); // Offset the x position
        newShape.y(newShape.y() + 10); // Offset the y position
        layerDraw.add(newShape);
        layerDraw.draw();
    }
}
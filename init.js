var stageDraw;          // The Konva Stage element which is our canvas for drawing
var container;          // The container links the canvas drawing area to the Konva stage object
var layerDraw;          // The Konva Layer that is added to the stage
var nextShape = "";    // The next shape to be drawn on canvas
var selectedShape;      // The currently selected Konva Shape to be drawn on canvas
var nextShapeID = 1;    // Next number to be used for shape ID
var modal;              // The modal for displaying error messages
var shapeInfoTable = "";  // To build Shape Info table in the sideToolBar
var textarea = "";      // To edit the text content for text element
var json;
var defaultText = "Welcome to the 2D shape drawing app";      // Default text for text element
var defaultShapeInfoHTML =     // Default text for the Shape Info tab
    "<h1>Shape Info</h1>" +
    "<p>Click a shape on the canvas for its info.<br>" +
    "No Info displayed in case of poly-line.<br>" +
    "Create a new shape, using the Shapes tab.</p>";


var isDirty = false;

let selectedShapes = [];

var polyLine;
var linePoints = [];
var tempLine;
var isDrawing = false;

let selectionStart = { x: 0, y: 0 };
let selecting = false;

/******************************************************************************
initApp() called on body load
******************************************************************************/

function initApp() {

    // Setting up the canvas
    stageDraw = new Konva.Stage({
        container: 'canvas',
        width: "640",
        height: "480"
    });

    container = stageDraw.container();
    container.tabIndex = 1;

    // adding a layer to the stage
    layerDraw = new Konva.Layer();

    stageDraw.add(layerDraw);

    // Add selection rectangle
    let selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
        visible: false
    });
    layerDraw.add(selectionRectangle);


    //modal dialog for error messages
    modal = document.getElementById('myModal');



    /**************************************************************************
    Event-handling functions for the canvas
    **************************************************************************/

    // 1. User clicks a blank area to deselect all Shapes
    // 2. User selects a new Shape to draw on canvas
    // 3. User selects an existing Shape to change it
    stageDraw.on('click', function (e) {
        // If 1. then remove all transformers, clear selectedShape, and clear Shape Info tab
        if (e.target === stageDraw && nextShape == "") {
            stageDraw.find('Transformer').destroy();
            layerDraw.draw();
            selectedShape = undefined;
            clearShapeInfo();
            return;
        }

        // Destroy any existing Transformers
        stageDraw.find('Transformer').destroy();

        // obtaining mouse position coordinates
        var pointerPosition = stageDraw.getPointerPosition();

        // Check for newshape creation
        var newShape;
        switch (nextShape) {
            case "circle":
                newShape = new Konva.Circle({
                    x: pointerPosition.x,
                    y: pointerPosition.y,
                    radius: 70,
                    fill: $c.name2hex('white'),
                    fillEnabled: true,
                    stroke: $c.name2hex('black'),
                    strokeWidth: 4,
                    strokeEnabled: true,
                    strokeScaleEnabled: false,
                });
                break;
            case "rectangle":
                newShape = new Konva.Rect({
                    x: pointerPosition.x,
                    y: pointerPosition.y,
                    width: 100,
                    height: 50,
                    fill: $c.name2hex('white'),
                    fillEnabled: true,
                    stroke: $c.name2hex('black'),
                    strokeWidth: 4,
                    strokeEnabled: true,
                    strokeScaleEnabled: false
                });
                break;
            case "ellipse":
                newShape = new Konva.Ellipse({
                    x: pointerPosition.x,
                    y: pointerPosition.y,
                    radius: {
                        x: 100,
                        y: 50
                    },
                    fill: $c.name2hex('white'),
                    fillEnabled: true,
                    stroke: $c.name2hex('black'),
                    strokeWidth: 4,
                    strokeEnabled: true,
                    strokeScaleEnabled: false
                });
                break;
            case "line":
                newShape = new Konva.Line({
                    points: [pointerPosition.x + 5, pointerPosition.y + 70,
                    pointerPosition.x + 140, pointerPosition.y + 23,],
                    stroke: $c.name2hex('black'),
                    strokeWidth: 4,
                    strokeEnabled: true,
                    lineCap: 'round',
                    lineJoin: 'round',
                    strokeScaleEnabled: false
                });
                break;
            case "arrow":
                newShape = new Konva.Arrow({
                    points: [pointerPosition.x + 5, pointerPosition.y + 70,
                    pointerPosition.x + 140, pointerPosition.y + 23],
                    pointerLength: 20,
                    pointerWidth: 20,
                    stroke: $c.name2hex('black'),
                    fill: $c.name2hex('black'),
                    fillEnabled: true,
                    strokeWidth: 4,
                    strokeEnabled: true,
                    lineCap: 'round',
                    lineJoin: 'round',
                    strokeScaleEnabled: false
                });
                break;
            case "triangle":
                newShape = new Konva.RegularPolygon({
                    x: pointerPosition.x,
                    y: pointerPosition.y,
                    sides: 3,
                    radius: 70,
                    fill: $c.name2hex('white'),
                    fillEnabled: true,
                    stroke: $c.name2hex('black'),
                    strokeWidth: 4,
                    strokeEnabled: true,
                    strokeScaleEnabled: false
                })
                break;
            case "text":
                newShape = new Konva.Text({
                    text: defaultText,
                    fontSize: 20,
                    x: pointerPosition.x,
                    y: pointerPosition.y,
                    width: 300,
                    height: 50,
                    fill: $c.name2hex('black'),
                    fillEnabled: true,
                    stroke: $c.name2hex('black'),
                    strokeWidth: 0,
                    strokeEnabled: false,
                    strokeScaleEnabled: false,
                    ellipsis: false
                });
                break;
            case "square":
                newShape = new Konva.RegularPolygon({
                    x: pointerPosition.x,
                    y: pointerPosition.y,
                    sides: 4,
                    radius: 70,
                    fill: $c.name2hex('white'),
                    fillEnabled: true,
                    stroke: $c.name2hex('black'),
                    strokeWidth: 4,
                    strokeEnabled: true,
                    strokeScaleEnabled: false
                })
                break;
            case "curve":
                newShape = new Konva.Shape({
                    stroke: $c.name2hex('black'),
                    strokeWidth: 4,
                    lineCap: 'round',
                    strokeEnabled: true,
                    strokeScaleEnabled: false,
                    sceneFunc: function (context) {
                        context.beginPath();
                        context.moveTo(pointerPosition.x, pointerPosition.y);
                        context.bezierCurveTo(pointerPosition.x, pointerPosition.y + 200,
                            pointerPosition.x + 200, pointerPosition.y + 200,
                            pointerPosition.x + 200, pointerPosition.y);
                        context.strokeShape(this);
                    }
                });

                break;
            case "pentagon":
                newShape = new Konva.RegularPolygon({
                    x: pointerPosition.x,
                    y: pointerPosition.y,
                    sides: 5,
                    radius: 70,
                    fill: $c.name2hex('white'),
                    fillEnabled: true,
                    stroke: $c.name2hex('black'),
                    strokeWidth: 4,
                    strokeEnabled: true,
                    strokeScaleEnabled: false
                })
                break;
            case "hexagon":
                newShape = new Konva.RegularPolygon({
                    x: pointerPosition.x,
                    y: pointerPosition.y,
                    sides: 6,
                    radius: 70,
                    fill: $c.name2hex('white'),
                    fillEnabled: true,
                    stroke: $c.name2hex('black'),
                    strokeWidth: 4,
                    strokeEnabled: true,
                    strokeScaleEnabled: false
                })
                break;
            case "star":
                var newShape = new Konva.Star({
                    x: pointerPosition.x,
                    y: pointerPosition.y,
                    numPoints: 5,
                    innerRadius: 40,
                    outerRadius: 70,
                    fill: $c.name2hex('white'),
                    fillEnabled: true,
                    stroke: $c.name2hex('black'),
                    lineCap: 'round',
                    lineJoin: 'round',
                    strokeWidth: 4,
                    strokeEnabled: true,
                    strokeScaleEnabled: false
                });
                break;
            case "ring":
                var newShape = new Konva.Ring({
                    x: pointerPosition.x,
                    y: pointerPosition.y,
                    innerRadius: 40,
                    outerRadius: 70,
                    fill: $c.name2hex('white'),
                    fillEnabled: true,
                    stroke: $c.name2hex('black'),
                    strokeWidth: 4,
                    strokeEnabled: true,
                    strokeScaleEnabled: false
                });
                break;
            case "polygon":
                // var numSides = parseInt(prompt("Enter the number of sides for the polygon:"));
                // var radius = parseInt(prompt("Enter the radius of the polygon:"));
                var numSides = 8;
                var radius = 70;
                var newShape = new Konva.RegularPolygon({
                    x: pointerPosition.x,
                    y: pointerPosition.y,
                    sides: numSides,
                    radius: radius,
                    fill: $c.name2hex('white'),
                    fillEnabled: true,
                    stroke: $c.name2hex('black'),
                    strokeWidth: 4,
                    closed: true, // This closes the path to form a polygon
                    draggable: true
                });
                layerDraw.add(newShape);
                layerDraw.draw();
                break;
            case "group":
                // Create a group from selected shapes
                if (selectedShapes.length > 0) {
                    let group = new Konva.Group({
                        draggable: true
                    });
                    selectedShapes.forEach(shape => {
                        group.add(shape);
                        // Optionally remove the shape from the layer if it should only exist in the group
                        // shape.remove();
                    });
                    layerDraw.add(group);
                    layerDraw.draw();

                    // Clear selected shapes array and reset their strokes
                    selectedShapes.forEach(shape => shape.stroke('black'));
                    selectedShapes = [];
                } else {
                    alert("No shapes selected!");
                    nextShape = ""; // Reset nextShape if no shapes were grouped
                }

            case "polyline":
                var polyLine;
                var onShape = false;
                var linePoints = [{ x: pointerPosition.x, y: pointerPosition.y }];
                var mousePos;
                var group = new Konva.Group({
                    draggable: true
                });
                stageDraw.on('mousedown', function () {
                    linePoints.push({ x: stageDraw.getPointerPosition().x, y: stageDraw.getPointerPosition().y });
                });
                stageDraw.on('dblclick', function () {
                    if (linePoints.length >= 2 && !onShape) {
                        for (var i = 0; i < linePoints.length - 1; i++) {
                            var x1 = linePoints[i].x;
                            var y1 = linePoints[i].y;
                            var x2 = linePoints[i + 1].x;
                            var y2 = linePoints[i + 1].y;
                            polyLine = new Konva.Line({
                                id: "polyline",
                                points: [x1, y1, x2, y2],
                                stroke: $c.name2hex('black'),
                                strokeWidth: 4,
                                strokeEnabled: true,
                                lineCap: 'round',
                                lineJoin: 'round',
                                strokeScaleEnabled: false,
                                draggable: false,
                                resizeEnabled: false,
                                rotateEnabled: false,
                            });
                            group.add(polyLine);
                        }
                        group.on('mouseover', function () {
                            onShape = true;
                            document.body.style.cursor = 'pointer';
                            polyLine.transformsEnabled('none');
                        });
                        group.on('mouseout', function () {
                            document.body.style.cursor = 'default';
                        });
                        layerDraw.add(group);
                        stageDraw.add(layerDraw);
                    }
                });
                //}
                newShape = group;
                break;
            default:
                break;
        }

        if (newShape) {
            if (newShape.getClassName() != 'Group') {
                finishNewShape(newShape);
            }
            nextShape = "";
            selectedShape = newShape;
        } else {
            selectedShape = e.target;
        }


        // Creating a new transformer
        var tr = new Konva.Transformer();
        tr.rotationSnaps([0, 90, 180, 270]);  // Snapping to 90-degree increments
        layerDraw.add(tr);

        //not attaching the transformer to curve, and polyline
        if (selectedShape.getClassName() != "Shape" && selectedShape.getClassName() != "Group" && selectedShape.getAttrs().id != 'polyline') {
            tr.attachTo(selectedShape);
        }
        layerDraw.draw();
        getShapeAttributes(selectedShape);
        openNav();
        openTab('Shape Info', this, 'red');
    });

    // Keyboard event listener
    container.addEventListener('keydown', function (e) {
        // delete selected shape and its transformer
        if (e.keyCode === 8 || e.keyCode === 46) {
            stageDraw.find('Transformer').destroy();
            selectedShape.destroy();
            selectedShape = undefined;
            clearShapeInfo();
        }
        layerDraw.draw();
    });

    // Key Board shortcuts
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 'z') {
            undoAction();
        } else if (event.ctrlKey && event.key === 'y') {
            redoAction();
        } else if (event.ctrlKey && event.key === 'c') {
            copyShape();
        } else if (event.ctrlKey && event.key === 'v') {
            pasteShape();
        } else if (event.ctrlKey && event.key === 'g') {
            toggleGrid();
        } else if (event.ctrlKey && event.key === 's') {
            saveDiagram();
        } else if (event.ctrlKey && event.key === 'o') {
            openDiagram();
        } else if (event.ctrlKey && event.key === ' ') {
            newDiagram();
            //event.preventDefault();
        }
    });

    //event listener to close the modal error dialog
    document.getElementsByClassName("close")[0].onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    //Zoom-in and Zoom-out functionality
    var scaleBy = 1.01;
    stageDraw.on('wheel', e => {
        e.evt.preventDefault();
        var oldScale = stageDraw.scaleX();

        var mousePointTo = {
            x: stageDraw.getPointerPosition().x / oldScale - stageDraw.x() / oldScale,
            y: stageDraw.getPointerPosition().y / oldScale - stageDraw.y() / oldScale
        };

        var newScale =
            e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        stageDraw.scale({ x: newScale, y: newScale });

        var newPos = {
            x:
                -(mousePointTo.x - stageDraw.getPointerPosition().x / newScale) *
                newScale,
            y:
                -(mousePointTo.y - stageDraw.getPointerPosition().y / newScale) *
                newScale
        };
        stageDraw.position(newPos);
        stageDraw.batchDraw();
    });
    // Finalize initialization by drawing the layer
    layerDraw.draw();
    // Initialize the Transformer here
    tr = new Konva.Transformer();
    layerDraw.add(tr);

    stageDraw.on('mousedown', (e) => {
        // Only start the selection if clicking on an empty area (not on a shape)
        if (e.target !== stageDraw) {
            return;
        }
        selecting = true;
        const pos = stageDraw.getPointerPosition();
        selectionStart = pos;
        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        selectionRectangle.move({ x: pos.x, y: pos.y });
    });

    stageDraw.on('mousemove', (e) => {
        if (!selecting) {
            return;
        }
        const pos = stageDraw.getPointerPosition();
        selectionRectangle.setAttrs({
            x: Math.min(pos.x, selectionStart.x),
            y: Math.min(pos.y, selectionStart.y),
            width: Math.abs(pos.x - selectionStart.x),
            height: Math.abs(pos.y - selectionStart.y),
        });
        layerDraw.batchDraw();
    });
    stageDraw.on('mouseup', function (e) {
        if (!selecting) {
            return;
        }
        selecting = false;
        selectionRectangle.visible(false);
        const selectionBox = selectionRectangle.getClientRect();

        const shapes = layerDraw.getChildren(shape => {
            return shape !== selectionRectangle && Konva.Util.haveIntersection(shape.getClientRect(), selectionBox);
        });

        if (shapes.length > 0) {
            let group = new Konva.Group({
                draggable: true
            });
            shapes.forEach(shape => {
                shape.draggable(false); // Ensure shapes are not draggable individually
                group.add(shape);
                shape.stroke('red');
                shape.strokeWidth(4);
            });

            layerDraw.add(group);
            layerDraw.batchDraw();

            // Use the transformer on the group
            //tr.nodes([group]); // getting Error
        }
    });
    stageDraw.on('mouseup touchend', (e) => {
        // do nothing if we didn't start selection
        selecting = false;
        if (!selectionRectangle.visible()) {
            return;
        }
        e.evt.preventDefault();
        // update visibility in timeout, so we can check it in click event
        selectionRectangle.visible(false);
        var shapes = stageDraw.find('.rect');
        var box = selectionRectangle.getClientRect();
        var selected = shapes.filter((shape) =>
            Konva.Util.haveIntersection(box, shape.getClientRect())
        );

        // Group the selected shapes
        var group = new Konva.Group({
            draggable: true // Ensure the group is draggable
        });
        selected.forEach((shape) => {
            group.add(shape);
        });
        layerDraw.add(group); // Add the group to the layer
        tr.nodes([group]); // Update the Transformer to include the group
        layerDraw.draw(); // Redraw the layer to reflect changes
    });

}   // function initApp()

function newDiagram() {
    if (isDirty) {
        if (confirm('Do you want to save your changes before starting a new diagram?')) {
            saveDiagram();  // Implement this function based on your existing save functionality
        }
    }
    clearCanvas();
    isDirty = false; // Reset the dirty flag after clearing the canvas
}

function clearCanvas() {
    layerDraw.destroyChildren(); // This removes all shapes from the layer
    layerDraw.draw();
}
function markAsDirty() {
    isDirty = true;
}

function showHelp() {
    // Navigate to the help page
    window.location.href = "help.html";
}
function getPolygonPoints(centerX, centerY, sides, radius) {
    let points = [];
    const angleStep = (2 * Math.PI) / sides;

    for (let i = 0; i < sides; i++) {
        const dx = centerX + radius * Math.sin(i * angleStep);
        const dy = centerY - radius * Math.cos(i * angleStep);
        points.push(dx);
        points.push(dy);
    }
    return points;
}
function selectAllShapes() {
    // Get all checkboxes under the "shapeList" ul element
    var checkboxes = document.querySelectorAll('#shapeList input[type="checkbox"]');

    // Iterate over each checkbox and set its checked property to true
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
        if (checkbox.id == "selectAll") {
            checkbox.checked = false;
        }
    });
}
function selectAllOperations() {
    var checkboxes = document.querySelectorAll('#operationList input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}
function selectAllExtraCredit() {
    var checkboxes = document.querySelectorAll('#extraCreditList input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}

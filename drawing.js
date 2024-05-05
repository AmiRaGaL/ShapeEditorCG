/******************************************************************************
Create and update Shapes
******************************************************************************/

// Setting the nextShape to be drawn on canvas
function setShape(shape) {
    nextShape = shape;
}

// Clearing the Shape Info tab
function clearShapeInfo() {
    document.getElementById("Shape Info").innerHTML = defaultShapeInfoHTML;
}

// Finish creating a new Shape
function finishNewShape(newShape) {

    newShape.on('transform', () => {
        if (newShape.getClassName() != "Line" && newShape.getClassName() != "Arrow") {
            newShape.setAttrs({
                width: newShape.width() * newShape.scaleX(),
                height: newShape.height() * newShape.scaleY(),
                scaleX: 1,
                scaleY: 1
            });
        }
        else {
            newShape.setAttrs({
                scaleX: newShape.scaleX(),
                scaleY: newShape.scaleY()
            });
        }
        getShapeAttributes(newShape);
    })

    // After Transformer has updated the shape, update the contents of Shape Info tab
    newShape.on('transformend', function () {
        getShapeAttributes(newShape);
        stageDraw.find('Transformer').forceUpdate();
        layerDraw.draw();
    });

    // When starting to drag a Shape
    newShape.on("dragstart", function () {
        this.moveToTop();
        //         layerDraw.draw();
    });

    // On drag complete for a shape, updating the contents of Shape Info tab
    newShape.on('dragmove', function () {
        getShapeAttributes(newShape);
    });


    // Setting the pointer to indicate dragging possible
    newShape.on('mouseover', function () {
        document.body.style.cursor = 'pointer';
    });
    newShape.on('mouseout', function () {
        document.body.style.cursor = 'default';
    });
    newShape.on('transformstart dragstart', function () {
        const initialState = {
            x: this.x(),
            y: this.y(),
            scaleX: this.scaleX(),
            scaleY: this.scaleY(),
            rotation: this.rotation()
            // Add other properties that might change due to transformation
        };

        undoStack.push({
            action: 'transform',
            shape: this,
            initialState: initialState
        });
    });
    newShape.on('transformend dragend', function () {
        const action = undoStack.pop(); // Get the last action to update it
        action.finalState = {
            x: this.x(),
            y: this.y(),
            scaleX: this.scaleX(),
            scaleY: this.scaleY(),
            rotation: this.rotation()
            // Add other properties that might change due to transformation
        };
        undoStack.push(action); // Push it back with final state
    });
    newShape.on('dragend transformend', function () {
        markAsDirty();
    });

    undoStack.push({
        action: "create",
        shape: newShape
    });

    // Make the shape draggable
    newShape.draggable(true);

    // Enable snapping to grid
    enableSnapToGrid(newShape);

    setShapeID(newShape);
    layerDraw.add(newShape);

    layerDraw.draw();
    newShape.draggable(true);
}

// Getting attributes of selected shape to display on Shape Info tab
function getShapeAttributes(shape) {
    var isShapeValid = true;
    shapeInfoTable = "<h1>Shape Info</h1>" +
        "<table class=\"shapeInfoTable\"><tbody>";

    //getting the shape attributes
    switch (shape.getClassName()) {
        case "Circle":
            createShapeAttributeString(shape, "ID (Make Unique): ", "id");
            createShapeAttributeString(shape, "Radius (Pixels): ", "radius", "number");
            createShapeAttributeString(shape, "Fill Color: ", "fill", "color");
            createShapeAttributeString(shape, "Fill Enabled (true/false): ", "fillEnabled", "checkbox");
            createShapeAttributeString(shape, "Shape Outline Color: ", "stroke", "color");
            createShapeAttributeString(shape, "Shape Outline Width: ", "strokeWidth", "number");
            createShapeAttributeString(shape, "Shape Outline Enabled (true/false): ", "strokeEnabled", "checkbox");
            break;
        case "Rect":
            createShapeAttributeString(shape, "ID (Make Unique): ", "id");
            createShapeAttributeString(shape, "Rotation (Degrees): ", "rotation", "number");
            createShapeAttributeString(shape, "Fill Color: ", "fill", "color");
            createShapeAttributeString(shape, "Fill Enabled (true/false): ", "fillEnabled", "checkbox");
            createShapeAttributeString(shape, "Shape Outline Color: ", "stroke", "color");
            createShapeAttributeString(shape, "Shape Outline Width: ", "strokeWidth", "number");
            createShapeAttributeString(shape, "Shape Outline Enabled (true/false): ", "strokeEnabled", "checkbox");
            break;
        case "Ellipse":
            createShapeAttributeString(shape, "ID (Make Unique): ", "id");;
            createShapeAttributeString(shape, "Rotation (Degrees): ", "rotation", "number");
            createShapeAttributeString(shape, "Radius X (Pixels): ", "radiusX", "number");
            createShapeAttributeString(shape, "Radius Y (Pixels): ", "radiusY", "number");
            createShapeAttributeString(shape, "Fill Color: ", "fill", "color");
            createShapeAttributeString(shape, "Fill Enabled (true/false): ", "fillEnabled", "checkbox");
            createShapeAttributeString(shape, "Shape Outline Color: ", "stroke", "color");
            createShapeAttributeString(shape, "Shape Outline Width: ", "strokeWidth", "number");
            createShapeAttributeString(shape, "Shape Outline Enabled (true/false): ", "strokeEnabled", "checkbox");
            break;
        case "Line":
            createShapeAttributeString(shape, "ID (Make Unique): ", "id");
            createShapeAttributeString(shape, "Line Join Point Shape (miter, round, or bevel): ", "lineJoin", "String");
            createShapeAttributeString(shape, "Line Cap Shape (butt, round, or square): ", "lineCap", "String");
            createShapeAttributeString(shape, "Rotation (Degrees): ", "rotation", "number");
            createShapeAttributeString(shape, "Line Color: ", "stroke", "color");
            createShapeAttributeString(shape, "Line Width: ", "strokeWidth", "number");
            createShapeAttributeString(shape, "Line Width Enabled (true/false): ", "strokeEnabled", "checkbox");
            break;
        case "Arrow":
            createShapeAttributeString(shape, "ID (Make Unique): ", "id");
            createShapeAttributeString(shape, "Line Join Point Shape (miter, round, or bevel): ", "lineJoin", "String");
            createShapeAttributeString(shape, "Line Cap Shape (butt, round, or square): ", "lineCap", "String");
            createShapeAttributeString(shape, "Rotation (Degrees): ", "rotation", "number");
            createShapeAttributeString(shape, "Fill Color: ", "fill", "color");
            createShapeAttributeString(shape, "Fill Pointer Enabled (true/false): ", "fillEnabled", "checkbox");
            createShapeAttributeString(shape, "Line Color: ", "stroke", "color");
            createShapeAttributeString(shape, "Line Width: ", "strokeWidth", "number");
            createShapeAttributeString(shape, "Line Width Enabled (true/false): ", "strokeEnabled", "checkbox");
            break;
        case "Text":
            createShapeAttributeString(shape, "ID (Make Unique): ", "id");
            createShapeAttributeString(shape, "Rotation (Degrees): ", "rotation", "number");
            createShapeAttributeString(shape, "Text Color: ", "fill", "color");
            createShapeAttributeString(shape, "Fill Enabled (true/false): ", "fillEnabled", "checkbox");
            createShapeAttributeString(shape, "Text Outline Color: ", "stroke", "color");
            createShapeAttributeString(shape, "Text Outline Width: ", "strokeWidth", "number");
            createShapeAttributeString(shape, "Text Outline Enabled (true/false): ", "strokeEnabled", "checkbox");
            createShapeAttributeString(shape, "Font Family (Arial, Times, etc.): ", "fontFamily");
            createShapeAttributeString(shape, "Font Size: ", "fontSize");
            createShapeAttributeString(shape, "Font Style (italic, bold): ", "fontStyle");
            createShapeAttributeString(shape, "Font Variant (normal, small-caps): ", "fontVariant");
            createShapeAttributeString(shape, "Horizontal Align (left, center, right): ", "align");
            createShapeAttributeString(shape, "Vertical Align (top, middle, bottom): ", "verticalAlign");
            createShapeAttributeString(shape, "Padding (Pixels): ", "padding", "number");
            createShapeAttributeString(shape, "Line Height (1, 2, ...): ", "lineHeight", "number");
            createShapeAttributeString(shape, "Wrap (word, char, none): ", "wrap");
            break;
        case "Star":
            createShapeAttributeString(shape, "ID (Make Unique): ", "id");
            createShapeAttributeString(shape, "Number of Points: ", "numPoints", "Integer");
            createShapeAttributeString(shape, "Line Join Point Shape (miter, round, or bevel): ", "lineJoin", "String");
            createShapeAttributeString(shape, "Line Cap Shape (butt, round, or square): ", "lineCap", "String");
            createShapeAttributeString(shape, "Rotation (Degrees): ", "rotation", "number");
            createShapeAttributeString(shape, "Fill Color: ", "fill", "color");
            createShapeAttributeString(shape, "Fill Enabled (true/false): ", "fillEnabled", "checkbox");
            createShapeAttributeString(shape, "Shape Outline Color: ", "stroke", "color");
            createShapeAttributeString(shape, "Shape Outline Width: ", "strokeWidth", "number");
            createShapeAttributeString(shape, "Shape Outline Enabled (true/false): ", "strokeEnabled", "checkbox");
            break;
        case "Ring":
            createShapeAttributeString(shape, "ID (Make Unique): ", "id");
            createShapeAttributeString(shape, "Inner Radius (Pixels): ", "innerRadius", "number");
            createShapeAttributeString(shape, "Outer Radius (Pixels): ", "outerRadius", "number");
            createShapeAttributeString(shape, "Fill Color: ", "fill", "color");
            createShapeAttributeString(shape, "Fill Enabled (true/false): ", "fillEnabled", "checkbox");
            createShapeAttributeString(shape, "Shape Outline Color: ", "stroke", "color");
            createShapeAttributeString(shape, "Shape Outline Width: ", "strokeWidth", "number");
            createShapeAttributeString(shape, "Shape Outline Enabled (true/false): ", "strokeEnabled", "checkbox");
            break;
        case "Shape":
            createShapeAttributeString(shape, "ID (Make Unique): ", "id");
            createShapeAttributeString(shape, "Line Cap Shape (butt, round, or square): ", "lineCap", "String");
            createShapeAttributeString(shape, "Rotation (Degrees): ", "rotation", "number");
            createShapeAttributeString(shape, "curve Color: ", "stroke", "color");
            createShapeAttributeString(shape, "curve Width: ", "strokeWidth", "number");
            createShapeAttributeString(shape, "curve Width Enabled (true/false): ", "strokeEnabled", "checkbox");
            break;
        case "Group":
            createShapeAttributeString(shape, "ID (Make Unique): ", "id");
        case "RegularPolygon":
            var polygonSides = shape.attrs["sides"];
            if (polygonSides == 3) {
                createShapeAttributeString(shape, "ID (Make Unique): ", "id");
                createShapeAttributeString(shape, "Rotation (Degrees): ", "rotation", "number");
                createShapeAttributeString(shape, "Fill Color: ", "fill", "color");
                createShapeAttributeString(shape, "Fill Enabled (true/false): ", "fillEnabled", "checkbox");
                createShapeAttributeString(shape, "Shape Outline Color: ", "stroke", "color");
                createShapeAttributeString(shape, "Shape Outline Width: ", "strokeWidth", "number");
                createShapeAttributeString(shape, "Shape Outline Enabled (true/false): ", "strokeEnabled", "checkbox");
            }
            else if (polygonSides == 4) {
                createShapeAttributeString(shape, "ID (Make Unique): ", "id");
                createShapeAttributeString(shape, "Rotation (Degrees): ", "rotation", "number");
                createShapeAttributeString(shape, "Fill Color: ", "fill", "color");
                createShapeAttributeString(shape, "Fill Enabled (true/false): ", "fillEnabled", "checkbox");
                createShapeAttributeString(shape, "Shape Outline Color: ", "stroke", "color");
                createShapeAttributeString(shape, "Shape Outline Width: ", "strokeWidth", "number");
                createShapeAttributeString(shape, "Shape Outline Enabled (true/false): ", "strokeEnabled", "checkbox");
            }
            else if (polygonSides == 5) {
                createShapeAttributeString(shape, "ID (Make Unique): ", "id");
                createShapeAttributeString(shape, "Rotation (Degrees): ", "rotation", "number");
                createShapeAttributeString(shape, "Fill Color: ", "fill", "color");
                createShapeAttributeString(shape, "Fill Enabled (true/false): ", "fillEnabled", "checkbox");
                createShapeAttributeString(shape, "Shape Outline Color: ", "stroke", "color");
                createShapeAttributeString(shape, "Shape Outline Width: ", "strokeWidth", "number");
                createShapeAttributeString(shape, "Shape Outline Enabled (true/false): ", "strokeEnabled", "checkbox");
            }
            else if (polygonSides == 6) {
                createShapeAttributeString(shape, "ID (Make Unique): ", "id");
                createShapeAttributeString(shape, "Rotation (Degrees): ", "rotation", "number");
                createShapeAttributeString(shape, "Fill Color: ", "fill", "color");
                createShapeAttributeString(shape, "Fill Enabled (true/false): ", "fillEnabled", "checkbox");
                createShapeAttributeString(shape, "Shape Outline Color: ", "stroke", "color");
                createShapeAttributeString(shape, "Shape Outline Width: ", "strokeWidth", "number");
                createShapeAttributeString(shape, "Shape Outline Enabled (true/false): ", "strokeEnabled", "checkbox");
            }
            else {
                createShapeAttributeString(shape, "ID (Make Unique): ", "id");
                createShapeAttributeString(shape, "Rotation (Degrees): ", "rotation", "number");
                createShapeAttributeString(shape, "Fill Color: ", "fill", "color");
                createShapeAttributeString(shape, "Fill Enabled (true/false): ", "fillEnabled", "checkbox");
                createShapeAttributeString(shape, "Shape Outline Color: ", "stroke", "color");
                createShapeAttributeString(shape, "Polygon Outline Width: ", "strokeWidth", "number");
                createShapeAttributeString(shape, "Polygon Outline Enabled (true/false): ", "strokeEnabled", "checkbox");
                createShapeAttributeString(shape, "Number of Sides: ", "sides", "number", false);
                createShapeAttributeString(shape, "Radius: ", "radius", "number", false);
                break;
            }
            break;

        default:
            isShapeValid = false;
            alert("Shape not valid");
            break;
    }

    // updating Shape Info tab with the table having editing widgets and an Update button (polyline not included)
    if (isShapeValid && shape.getAttrs().id != 'polyline') {
        shapeInfoTable += "</tbody></table><br>";
        var objInfo = document.getElementById("Shape Info");
        objInfo.innerHTML = shapeInfoTable;
        if (shape.getClassName() == "Text") {
            // Handling of text edit
            textarea = document.createElement('textarea');
            textarea.value = shape.getAttr("text");
            textarea.style.width = "300px";
            textarea.setAttribute("id", shape.id() + "textarea");

            objInfo.insertAdjacentHTML('beforeend', "Text:<br>");
            objInfo.appendChild(textarea);
            objInfo.insertAdjacentHTML('beforeend', "<br>");
            objInfo.insertAdjacentHTML('beforeend', "<br>");
        }

        var btn = document.createElement("BUTTON");
        btn.setAttribute("class", "updatebtn");
        var t = document.createTextNode("Update");
        btn.appendChild(t);
        objInfo.appendChild(btn);
        btn.onclick = function () {
            setSelectedShapeAttributes(shape);
        };
    } else {
        clearShapeInfo();
    }
}

function createShapeAttributeString(shape, string, value, inputType, readonly) {
    if (inputType === undefined) {
        inputType = "text";
    }
    var tempBox = document.createElement('INPUT');
    tempBox.setAttribute("type", inputType);
    if (inputType === "checkbox") {
        tempBox.setAttribute("checked", "checked");
        if (shape.getAttr(value) == "false"
            || shape.getAttr(value) == false) {
            tempBox.removeAttribute("checked");
        }
    } else {
        tempBox.setAttribute("value", shape.getAttr(value));
        if (value == "image") {
            tempBox.setAttribute("value", shape.getImage().src);
        }
    }
    tempBox.setAttribute("id", shape.id() + value);
    if (readonly) {
        tempBox.setAttribute("readonly", "true");
    }

    var rowPrefix = "<tr><td class=\"leftCol\">";
    var rowMiddle = "</td><td class=\"rightCol\">";
    var rowSuffix = "</td></tr>"
    shapeInfoTable += rowPrefix + string + rowMiddle + tempBox.outerHTML + rowSuffix;
}

// Assigning unique shape ID
function setShapeID(shape) {
    if (!shape.id()) {
        shape.id(shape.getClassName() + "ID" + ("000000" + nextShapeID++).slice(-6));
    }
}

//set Shape attribute to reflect in the Shape Info Tab
function setSelectedShapeAttributes(shape) {
    var isShapeValid = true;
    switch (shape.getClassName()) {
        case "Circle":
            shape.setAttr("id", document.getElementById(shape.id() + "id").value);
            shape.setAttr("radius", +(document.getElementById(shape.id() + "radius").value));
            shape.setAttr("fill", document.getElementById(shape.id() + "fill").value);
            shape.setAttr("fillEnabled", document.getElementById(shape.id() + "fillEnabled").checked);
            shape.setAttr("stroke", document.getElementById(shape.id() + "stroke").value);
            shape.setAttr("strokeWidth", +(document.getElementById(shape.id() + "strokeWidth").value));
            shape.setAttr("strokeEnabled", document.getElementById(shape.id() + "strokeEnabled").checked);
            break;
        case "Ellipse":
            shape.setAttr("id", document.getElementById(shape.id() + "id").value);
            shape.setAttr("rotation", +(document.getElementById(shape.id() + "rotation").value));
            shape.setAttr("radiusX", +(document.getElementById(shape.id() + "radiusX").value));
            shape.setAttr("radiusY", +(document.getElementById(shape.id() + "radiusY").value));
            shape.setAttr("fill", document.getElementById(shape.id() + "fill").value);
            shape.setAttr("fillEnabled", document.getElementById(shape.id() + "fillEnabled").checked);
            shape.setAttr("stroke", document.getElementById(shape.id() + "stroke").value);
            shape.setAttr("strokeWidth", +(document.getElementById(shape.id() + "strokeWidth").value));
            shape.setAttr("strokeEnabled", document.getElementById(shape.id() + "strokeEnabled").checked);
            break;
        case "Rect":
            shape.setAttr("id", document.getElementById(shape.id() + "id").value);
            shape.setAttr("rotation", +(document.getElementById(shape.id() + "rotation").value));
            shape.setAttr("fill", document.getElementById(shape.id() + "fill").value);
            shape.setAttr("fillEnabled", document.getElementById(shape.id() + "fillEnabled").checked);
            shape.setAttr("stroke", document.getElementById(shape.id() + "stroke").value);
            shape.setAttr("strokeWidth", +(document.getElementById(shape.id() + "strokeWidth").value));
            shape.setAttr("strokeEnabled", document.getElementById(shape.id() + "strokeEnabled").checked);
            break;
        case "Line":
            shape.setAttr("id", document.getElementById(shape.id() + "id").value);
            shape.setAttr("lineJoin", document.getElementById(shape.id() + "lineJoin").value);
            shape.setAttr("lineCap", document.getElementById(shape.id() + "lineCap").value);
            shape.setAttr("rotation", +(document.getElementById(shape.id() + "rotation").value));
            shape.setAttr("stroke", document.getElementById(shape.id() + "stroke").value);
            shape.setAttr("strokeWidth", +(document.getElementById(shape.id() + "strokeWidth").value));
            shape.setAttr("strokeEnabled", document.getElementById(shape.id() + "strokeEnabled").checked);
            break;
        case "Arrow":
            shape.setAttr("id", document.getElementById(shape.id() + "id").value);
            shape.setAttr("lineJoin", document.getElementById(shape.id() + "lineJoin").value);
            shape.setAttr("lineCap", document.getElementById(shape.id() + "lineCap").value);
            shape.setAttr("rotation", +(document.getElementById(shape.id() + "rotation").value));
            shape.setAttr("fill", document.getElementById(shape.id() + "fill").value);
            shape.setAttr("fillEnabled", document.getElementById(shape.id() + "fillEnabled").checked);
            shape.setAttr("stroke", document.getElementById(shape.id() + "stroke").value);
            shape.setAttr("strokeWidth", +(document.getElementById(shape.id() + "strokeWidth").value));
            shape.setAttr("strokeEnabled", document.getElementById(shape.id() + "strokeEnabled").checked);
            break;
        case "Group":
            shape.setAttr("id", document.getElementById(shape.id() + "id").value);
            break;
        case "Text":
            shape.setAttr("id", document.getElementById(shape.id() + "id").value);
            shape.setAttr("text", document.getElementById(shape.id() + "textarea").value);
            shape.setAttr("rotation", +(document.getElementById(shape.id() + "rotation").value));
            shape.setAttr("fill", document.getElementById(shape.id() + "fill").value);
            shape.setAttr("fillEnabled", document.getElementById(shape.id() + "fillEnabled").checked);
            shape.setAttr("stroke", document.getElementById(shape.id() + "stroke").value);
            shape.setAttr("strokeWidth", +(document.getElementById(shape.id() + "strokeWidth").value));
            shape.setAttr("strokeEnabled", document.getElementById(shape.id() + "strokeEnabled").checked);
            shape.setAttr("fontFamily", document.getElementById(shape.id() + "fontFamily").value);
            shape.setAttr("fontSize", +(document.getElementById(shape.id() + "fontSize").value));
            shape.setAttr("fontStyle", document.getElementById(shape.id() + "fontStyle").value);
            shape.setAttr("fontVariant", document.getElementById(shape.id() + "fontVariant").value);
            shape.setAttr("align", document.getElementById(shape.id() + "align").value);
            shape.setAttr("verticalAlign", document.getElementById(shape.id() + "verticalAlign").value);
            shape.setAttr("padding", +(document.getElementById(shape.id() + "padding").value));
            shape.setAttr("lineHeight", +(document.getElementById(shape.id() + "lineHeight").value));
            shape.setAttr("wrap", document.getElementById(shape.id() + "wrap").value);
            break;
        case "Shape":
            shape.setAttr("id", document.getElementById(shape.id() + "id").value);
            shape.setAttr("lineCap", document.getElementById(shape.id() + "lineCap").value);
            shape.setAttr("rotation", +(document.getElementById(shape.id() + "rotation").value));
            shape.setAttr("stroke", document.getElementById(shape.id() + "stroke").value);
            shape.setAttr("strokeWidth", +(document.getElementById(shape.id() + "strokeWidth").value));
            shape.setAttr("strokeEnabled", document.getElementById(shape.id() + "strokeEnabled").checked);
            break;
        case "Star":
            shape.setAttr("id", document.getElementById(shape.id() + "id").value);
            shape.setAttr("numPoints", document.getElementById(shape.id() + "numPoints").value);
            shape.setAttr("rotation", +(document.getElementById(shape.id() + "rotation").value));
            shape.setAttr("fill", document.getElementById(shape.id() + "fill").value);
            shape.setAttr("lineJoin", document.getElementById(shape.id() + "lineJoin").value);
            shape.setAttr("lineCap", document.getElementById(shape.id() + "lineCap").value);

            shape.setAttr("fillEnabled", document.getElementById(shape.id() + "fillEnabled").checked);
            shape.setAttr("stroke", document.getElementById(shape.id() + "stroke").value);
            shape.setAttr("strokeWidth", +(document.getElementById(shape.id() + "strokeWidth").value));

            shape.setAttr("strokeEnabled", document.getElementById(shape.id() + "strokeEnabled").checked);
            break;
        case "Ring":
            shape.setAttr("id", document.getElementById(shape.id() + "id").value);
            shape.setAttr("innerRadius", +(document.getElementById(shape.id() + "innerRadius").value));
            shape.setAttr("outerRadius", +(document.getElementById(shape.id() + "outerRadius").value));
            shape.setAttr("fill", document.getElementById(shape.id() + "fill").value);

            shape.setAttr("fillEnabled", document.getElementById(shape.id() + "fillEnabled").checked);
            shape.setAttr("stroke", document.getElementById(shape.id() + "stroke").value);
            shape.setAttr("strokeWidth", +(document.getElementById(shape.id() + "strokeWidth").value));

            shape.setAttr("strokeEnabled", document.getElementById(shape.id() + "strokeEnabled").checked);
            break;
        case "RegularPolygon":
            var polygonSides = shape.attrs["sides"];
            if (polygonSides == 3) {
                shape.setAttr("id", document.getElementById(shape.id() + "id").value);
                shape.setAttr("rotation", +(document.getElementById(shape.id() + "rotation").value));
                shape.setAttr("fill", document.getElementById(shape.id() + "fill").value);
                shape.setAttr("fillEnabled", document.getElementById(shape.id() + "fillEnabled").checked);
                shape.setAttr("stroke", document.getElementById(shape.id() + "stroke").value);
                shape.setAttr("strokeWidth", +(document.getElementById(shape.id() + "strokeWidth").value));
                shape.setAttr("strokeEnabled", document.getElementById(shape.id() + "strokeEnabled").checked);
            }
            else if (polygonSides == 4) {
                shape.setAttr("id", document.getElementById(shape.id() + "id").value);
                shape.setAttr("rotation", +(document.getElementById(shape.id() + "rotation").value));
                shape.setAttr("fill", document.getElementById(shape.id() + "fill").value);
                shape.setAttr("fillEnabled", document.getElementById(shape.id() + "fillEnabled").checked);
                shape.setAttr("stroke", document.getElementById(shape.id() + "stroke").value);
                shape.setAttr("strokeWidth", +(document.getElementById(shape.id() + "strokeWidth").value));
                shape.setAttr("strokeEnabled", document.getElementById(shape.id() + "strokeEnabled").checked);
            }
            else if (polygonSides == 5) {
                shape.setAttr("id", document.getElementById(shape.id() + "id").value);
                shape.setAttr("rotation", +(document.getElementById(shape.id() + "rotation").value));
                shape.setAttr("fill", document.getElementById(shape.id() + "fill").value);
                shape.setAttr("fillEnabled", document.getElementById(shape.id() + "fillEnabled").checked);
                shape.setAttr("stroke", document.getElementById(shape.id() + "stroke").value);
                shape.setAttr("strokeWidth", +(document.getElementById(shape.id() + "strokeWidth").value));
                shape.setAttr("strokeEnabled", document.getElementById(shape.id() + "strokeEnabled").checked);

            }
            else if (polygonSides == 6) {
                shape.setAttr("id", document.getElementById(shape.id() + "id").value);
                shape.setAttr("rotation", +(document.getElementById(shape.id() + "rotation").value));
                shape.setAttr("fill", document.getElementById(shape.id() + "fill").value);
                shape.setAttr("fillEnabled", document.getElementById(shape.id() + "fillEnabled").checked);
                shape.setAttr("stroke", document.getElementById(shape.id() + "stroke").value);
                shape.setAttr("strokeWidth", +(document.getElementById(shape.id() + "strokeWidth").value));
                shape.setAttr("strokeEnabled", document.getElementById(shape.id() + "strokeEnabled").checked);
            }
            else {
                shape.setAttr("id", document.getElementById(shape.id() + "id").value);
                shape.setAttr("rotation", +(document.getElementById(shape.id() + "rotation").value));
                shape.setAttr("fill", document.getElementById(shape.id() + "fill").value);
                shape.setAttr("fillEnabled", document.getElementById(shape.id() + "fillEnabled").checked);
                shape.setAttr("stroke", document.getElementById(shape.id() + "stroke").value);
                shape.setAttr("strokeWidth", +(document.getElementById(shape.id() + "strokeWidth").value));
                shape.setAttr("strokeEnabled", document.getElementById(shape.id() + "strokeEnabled").checked);
                shape.setAttr("sides", +(document.getElementById(shape.id() + "sides").value));
                shape.setAttr("radius", +(document.getElementById(shape.id() + "radius").value));
            }
            break;
        default:
            isShapeValid = false;
            alert("Shape not valid");
            break;
    }

    //updating the canvas with the valid shape
    if (isShapeValid) {
        stageDraw.find('Transformer').forceUpdate();      // fitting Transformer to the shape drawn
        layerDraw.draw();
    }
}
const scaleFactor = 0.05;
//creating download link for the canvas
function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

//saving the canvas as jpeg file
function canvasToJpg() {
    var dataURL = stageDraw.toDataURL();
    downloadURI(dataURL, 'canvasimage.jpg');
}

//saving the canvas as PDF
function canvasToPdf() {
    var pdf = new jsPDF('l', 'px', 'a3');
    pdf.setTextColor('#000000');
    stageDraw.find('Text').forEach(text => {
        const size = text.fontSize() / 0.75; // converting pixels to points
        pdf.setFontSize(size);
    });
    pdf.addImage(
        stageDraw.toDataURL({ pixelRatio: 3 }),
        0,
        0,
        stageDraw.width(),
        stageDraw.height()
    );

    pdf.save('canvasPDF.pdf');
}

//converting the existing canvas with shapes on it to a JSON format and saving it as a .json file
function canvasToJson() {
    json = stageDraw.toJSON();
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
    var link = document.createElement("a");
    link.setAttribute("href", "data:" + data);
    link.setAttribute("download", "canvas.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

//open the file explorer and load the .json file and display it on the canvas
function loadJson() {
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        var selectedFile = e.target.files[0];
        var fileread = new FileReader();
        fileread.readAsText(selectedFile);
        fileread.onload = function (e) {
            var content = e.target.result;
            var intern = JSON.parse(content);
            stageDraw = Konva.Node.create(intern, 'canvas');
        };
    }
    input.click();
}
function saveDiagram() {
    // Example: Saving as JSON
    var json = stageDraw.toJSON();
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
    var link = document.createElement("a");
    link.setAttribute("href", "data:" + data);
    link.setAttribute("download", "canvas.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;

    isDirty = false;  // Reset the dirty flag after saving
}

function exportToLaTeX() {
    let header = "\\documentclass{article}\n\\usepackage{tikz}\n\\begin{document}\n";
    let body = "\\begin{tikzpicture}\n";
    let footer = "\\end{tikzpicture}\n\\end{document}";

    // Initialize latexContent with the starting part of the TikZ environment
    let latexContent = body;

    layerDraw.children.each(function (shape) {
        if (shape.className === 'Circle') {
            latexContent += convertCircleToLaTeX(shape);
        } else if (shape.className === 'Rect') {
            latexContent += convertRectToLaTeX(shape);
        } else if (shape.className === 'Text') {
            latexContent += convertTextToLaTeX(shape);
        } else if (shape.className === 'Ellipse') {
            latexContent += convertEllipseToLaTeX(shape);
        } else if (shape.className === 'Line') {
            latexContent += convertLineToLaTeX(shape);
        } else if (shape.className === 'Arrow') {
            latexContent += convertArrowToLaTeX(shape);
        } else if (shape.className === 'Star') {
            latexContent += convertStarToLaTeX(shape);
        } else if (shape.className === 'Ring') {
            latexContent += convertRingToLaTeX(shape);
        } else if (shape.className === 'Shape') {
            latexContent += convertShapeToLaTeX(shape);
        } else if (shape.className === 'Triangle') {
            latexContent += convertTriangleToLaTeX(shape);
        } else if (shape.className === 'RegularPolygon') {
            latexContent += convertPolygonToLaTeX(shape);
        } else if (shape.className === 'Polygon') {
            latexContent += convertPolygonToLaTeX(shape);
        }
    });

    latexContent += footer;

    return header + latexContent; // Return the complete LaTeX content
}

function convertTriangleToLaTeX(triangle) {
    const x1 = (triangle.x() * scaleFactor).toFixed(2);
    const y1 = (triangle.y() * scaleFactor).toFixed(2);
    const x2 = ((triangle.x() + triangle.radius()) * scaleFactor).toFixed(2);
    const y2 = ((triangle.y() - triangle.radius() / Math.sqrt(3)) * scaleFactor).toFixed(2);
    const x3 = ((triangle.x() - triangle.radius()) * scaleFactor).toFixed(2);
    const y3 = ((triangle.y() - triangle.radius() / Math.sqrt(3)) * scaleFactor).toFixed(2);
    return `\\draw (${x1}cm, ${y1}cm) -- (${x2}cm, ${y2}cm) -- (${x3}cm, ${y3}cm) -- cycle;\n`;
}


function convertCircleToLaTeX(circle) {
    // Assuming the center and radius are needed
    const x = (circle.x() * scaleFactor).toFixed(2);
    const y = (circle.y() * scaleFactor).toFixed(2);
    const radius = (circle.radius() * scaleFactor).toFixed(2);
    return `\\draw (${x}cm, ${y}cm) circle (${radius}cm);\n`;
}

function convertRectToLaTeX(rect) {
    const x = (rect.x() * scaleFactor).toFixed(2);
    const y = (rect.y() * scaleFactor).toFixed(2);
    const width = (rect.width() * scaleFactor).toFixed(2);
    const height = (rect.height() * scaleFactor).toFixed(2);
    return `\\draw (${x}cm, ${y}cm) rectangle (${x + width}cm, ${y + height}cm);\n`;
}

function convertTextToLaTeX(text) {
    const x = (text.x() * scaleFactor).toFixed(2);
    const y = (text.y() * scaleFactor).toFixed(2);
    const content = text.text();
    return `\\node at (${x}cm, ${y}cm) {${content}};\n`;
}

function convertEllipseToLaTeX(ellipse) {
    const x = (ellipse.x() * scaleFactor).toFixed(2);
    const y = (ellipse.y() * scaleFactor).toFixed(2);
    const radiusX = (ellipse.radiusX() * scaleFactor).toFixed(2);
    const radiusY = (ellipse.radiusY() * scaleFactor).toFixed(2);
    return `\\draw (${x}cm, ${y}cm) ellipse (${radiusX}cm and ${radiusY}cm);\n`;
}

function convertLineToLaTeX(line) {
    const x1 = (line.points()[0] * scaleFactor).toFixed(2);
    const y1 = (line.points()[1] * scaleFactor).toFixed(2);
    const x2 = (line.points()[2] * scaleFactor).toFixed(2);
    const y2 = (line.points()[3] * scaleFactor).toFixed(2);
    return `\\draw (${x1}cm, ${y1}cm) -- (${x2}cm, ${y2}cm);\n`;
}

function convertArrowToLaTeX(arrow) {
    const x1 = (arrow.points()[0] * scaleFactor).toFixed(2);
    const y1 = (arrow.points()[1] * scaleFactor).toFixed(2);
    const x2 = (arrow.points()[2] * scaleFactor).toFixed(2);
    const y2 = (arrow.points()[3] * scaleFactor).toFixed(2);
    return `\\draw[->] (${x1}cm, ${y1}cm) -- (${x2}cm, ${y2}cm);\n`;
}

function convertStarToLaTeX(star) {
    const x = (star.x() * scaleFactor).toFixed(2);
    const y = (star.y() * scaleFactor).toFixed(2);
    const numPoints = star.numPoints();
    const innerRadius = (star.innerRadius() * scaleFactor).toFixed(2);
    const outerRadius = (star.outerRadius() * scaleFactor).toFixed(2);
    return `\\draw (${x}cm, ${y}cm) -- (${numPoints}) -- (${innerRadius}cm) -- (${outerRadius}cm);\n`;
}

function convertRingToLaTeX(ring) {
    const x = (ring.x() * scaleFactor).toFixed(2);
    const y = (ring.y() * scaleFactor).toFixed(2);
    const innerRadius = (ring.innerRadius() * scaleFactor).toFixed(2);
    const outerRadius = (ring.outerRadius() * scaleFactor).toFixed(2);
    return `\\draw (${x}cm, ${y}cm) circle (${innerRadius}cm) circle (${outerRadius}cm);\n`;
}

// function convertShapeToLaTeX(shape) {
//     // Assuming the points are needed
//     const points = shape.points();
//     let latexContent = "\\draw";
//     points.forEach((point, index) => {
//         const x = (point * scaleFactor).toFixed(2);
//         const y = (point * scaleFactor).toFixed(2);
//         latexContent += ` (${x}cm, ${y}cm)`;
//         if (index < points.length - 1) {
//             latexContent += " --";
//         }
//     });
//     latexContent += ";\n";
//     return latexContent;
// }

// function convertRegularPolygonToLaTeX(polygon) {
//     let code = `\\draw (0:0)`;

//     for (let i = 0; i <= polygon.sides; i++) {
//         let angle = i * 360 / polygon.sides;
//         code += ` -- (${angle}:${polygon.radius}cm)`;
//     }
//     code += " -- cycle;\n";
//     return code;
// }
function convertPolygonToLaTeX(polygon) {
    let code = `\\draw (${polygon.attrs.x * scaleFactor}:${polygon.attrs.y * scaleFactor})`;

    for (let i = 0; i <= polygon.attrs.sides; i++) {
        let angle = i * 360 / polygon.attrs.sides;
        code += ` -- (${angle}:${polygon.attrs.radius * scaleFactor}cm)`;
    }
    code += " -- cycle;\n";
    return code;
}

function downloadLaTeX(latexContent) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(latexContent));
    element.setAttribute('download', 'diagram.tex');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
// setup the control gui
const controls = new function () {
    this.amount = 2;
    this.curveSegments = 12;

    this.asGeom = function () {
        // remove the old plane
        scene.remove(shape);
        // create a new one

        const options = {
            amount: controls.amount,
            curveSegments: controls.curveSegments,
        };

        shape = createMesh(new THREE.ExtrudeGeometry(drawShape(), options));
        // add it to the scene.
        scene.add(shape);
    };

};

function createLine(shape, spaced) {
    if (!spaced) {
        const mesh = new THREE.Line(shape.createPointsGeometry(), new THREE.LineBasicMaterial({
            color: 0xff3333,
            linewidth: 2
        }));
        return mesh;
    } else {
        const mesh = new THREE.Line(shape.createSpacedPointsGeometry(20), new THREE.LineBasicMaterial({
            color: 0xff3333,
            linewidth: 2
        }));
        return mesh;
    }

}

// draw while rotating the solid figure
function drawShape() {

    // create a basic shape
    const shape = new THREE.Shape();

    // startpoint
    shape.moveTo(10, 10);

    // straight line upwards
    shape.lineTo(10, 40);

    // the top of the figure, curve to the right
    shape.bezierCurveTo(15, 25, 25, 25, 30, 40);

    // spline back down
    shape.splineThru(
            [new THREE.Vector2(32, 30),
                new THREE.Vector2(28, 20),
                new THREE.Vector2(30, 10),
            ]);

    // curve at the bottom
    shape.quadraticCurveTo(20, 15, 10, 10);

    // // add 'eye' hole one
    // const hole1 = new THREE.Path();
    // hole1.absellipse(16, 24, 2, 3, 0, Math.PI * 2, true);
    // shape.holes.push(hole1);

    // // add 'eye hole 2'
    // const hole2 = new THREE.Path();
    // hole2.absellipse(23, 24, 2, 3, 0, Math.PI * 2, true);
    // shape.holes.push(hole2);

    // // add 'mouth'
    // const hole3 = new THREE.Path();
    // hole3.absarc(20, 16, 2, 0, Math.PI, true);
    // shape.holes.push(hole3);

    // return the shape
    return shape;
}

// create a mesh of geometry and materials
function createMesh(geom) {

    geom.applyMatrix(new THREE.Matrix4().makeTranslation(-20, 0, 0));

    // assign two materials
    const meshMaterial = new THREE.MeshNormalMaterial({
        transparent: true,
        opacity: 0.7
    });

    //  meshMaterial.side = THREE.DoubleSide;
    const wireFrameMat = new THREE.MeshBasicMaterial();
    wireFrameMat.wireframe = true;

    // create a multimaterial
    const mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);

    return mesh;
}

function rendering() {

    shape.rotation.y = step += 0.01;

    // render using requestAnimationFrame
    requestAnimationFrame(rendering);
    webGLRenderer.render(scene, camera);
}


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const webGLRenderer = new THREE.WebGLRenderer();
webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));
webGLRenderer.setSize(window.innerWidth, window.innerHeight);
webGLRenderer.shadowMap.enabled = true;

let shape = createMesh(new THREE.ShapeGeometry(drawShape()));
// add the sphere to the scene
scene.add(shape);

// position and point the camera to the center of the scene
camera.position.x = -20;
camera.position.y = 60;
camera.position.z = 60;
camera.lookAt(new THREE.Vector3(20, 20, 0));

// add the output destination of the renderer as an HTML element
document.getElementById("WebGL-div").appendChild(webGLRenderer.domElement);

// call the render function
let step = 0;

const gui = new dat.GUI();
gui.add(controls, 'amount', 0, 20).onChange(controls.asGeom);
gui.add(controls, 'curveSegments', 1, 30).step(1).onChange(controls.asGeom);

controls.asGeom();

// drawing of scene
rendering();
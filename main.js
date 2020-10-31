// setup the control panel..
const controls = new function () {
    // default value for slider
    this.thickness = 8;
    this.upperPull = 10;
    this.lowerPull = 5;

    this.asGeom = function () {
        // remove the old shape
        scene.remove(shape);

        const options = {
            // Specify the thickness with the slider
            amount: controls.thickness,
            // bevel off
            bevelEnabled: false
        };

        // create the new shape
        shape = createMesh(new THREE.ExtrudeGeometry(drawShape(), options));
        scene.add(shape);
    };
};


// Create basic shapes for extruded geometry
function drawShape() {

    // create a basic shape
    const shape = new THREE.Shape();

    // starting point
    shape.moveTo(-10, 0);

    // vertical line
    shape.lineTo(-10, 30);
    // horizon line
    shape.lineTo( 0, 30);

    // spline curve
    shape.splineThru(
        [new THREE.Vector2(controls.upperPull, 20),
         new THREE.Vector2(controls.lowerPull, 10),
         new THREE.Vector2(13, 0),
        ]);

    // vertical line
    shape.lineTo(-10, 0);

    // hole
    const hole = new THREE.Path();
    hole.absellipse(-5, 19, 4, 4, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    return shape;
}


// create a mesh of geometry and materials
function createMesh(geom) {

    geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

    // create a mesh material
    const meshMaterial = new THREE.MeshNormalMaterial({
        transparent: false,
//        opacity: 1.0
    });

    // create a mesh
    const mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);

    return mesh;
}


function rendering() {

    shape.rotation.y = step += 0.02;

    // render using requestAnimationFrame
    requestAnimationFrame(rendering);
    webGLRenderer.render(scene, camera);
}


const scene = new THREE.Scene();


// create a render
const webGLRenderer = new THREE.WebGLRenderer();
webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));
webGLRenderer.setSize(window.innerWidth, window.innerHeight);

// x, y, z axes from the origin (for debug)
const axes = new THREE.AxisHelper(35);
scene.add(axes);

let shape = createMesh(new THREE.ShapeGeometry(drawShape()));
scene.add(shape);

const base = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 0.1, 30), new THREE.MeshPhongMaterial({
    color: 0x004400
}));

base.position.x = 0;
base.position.y = -10;
base.rotation.x = -0.4 * Math.PI;
scene.add(base);

// create a ambient light
const ambiLight = new THREE.AmbientLight(0x777777);
scene.add(ambiLight);

// create a spotlight
const light = new THREE.SpotLight(0xffffff);
light.position.set(0, 60, 0);
light.intensity = 2.0;
scene.add(light);

// create a camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 40;
camera.position.z = 120;
camera.lookAt(new THREE.Vector3(0, 0, 0));

// add the output destination of the renderer as an HTML element
document.getElementById("WebGL-div").appendChild(webGLRenderer.domElement);

// call the render function
let step = 0;

// create a contorl panel
const gui = new dat.GUI();
gui.add(controls, 'thickness', 0, 40, 0.1).onChange(controls.asGeom);
gui.add(controls, 'upperPull', 0, 20, 0.1).onChange(controls.asGeom);
gui.add(controls, 'lowerPull', -5, 20, 0.1).onChange(controls.asGeom);

controls.asGeom();

// drawing of scene
rendering();

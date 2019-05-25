let scene;
let camera;
let aspect;
let fovy;
let near;
let far;
let renderer;

let gameOver = false;
let blockver = false;
let blockhor = false;
let iniciou = false;
let ver = 0;
let hor = 0;
let frame = 0;
let cobra = [];
let maca;
let cont = 2;

function main(){
    // 1 - SETUP DA CENA / CAMERA E RENDERER
    setup();

    // 2.0 - CRIAR CUBO 
    cobra[0] = getSnakeData();
    cobra[0].position.x = -1;
    cobra[0].material.emissive.setRGB(0, 1, 0);
    cobra[1] = getSnakeData();
    cobra[1].position.x = -1.5;
    cobra[2] = getSnakeData();
    cobra[2].position.x = -2.0;

    maca = getAppleData();

    criaMaca();

    // 2.1 - ADICIONAR À CENA
    scene.add( cobra[0] );
    scene.add( cobra[1] );
    scene.add( cobra[2] );
    scene.add( maca );

    // 3 - CRIAR LUZES
    createLights();

    // 4 - POSICIONAR CAMERA
    posicionarCamera();

    // 5 - INICIA LOOP DE REDESENHO
    animate();
}

function animate() {
    //cube.rotateY(Math.PI/60);
    //cube.position.x += 0.01;

    if (iniciou){
        frame++
        if(frame % 10 === 0){
            
            movimentaCobra();

            
            //if(colisaoProprioCorpo() || colisaoCenario()){
            if(colisaoProprioCorpo()){
                gameOver = true;
                iniciou = false;
                console.log("Voce Perdeu!");
            }

            if(colisaoCabecaMaca()){
                console.log("Passou aqui");
                cont = cont +1;
                cobra[cont] = getSnakeData();
                cobra[cont].position.x = cobra[0].position.x;
                cobra[cont].position.y = cobra[0].position.y;
                cobra[cont].position.z = cobra[0].position.z;
                scene.add( cobra[cont] );

                criaMaca();
            }
            
            if(ver!=0){
                blockhor = false;
            }

            if(hor!=0){
                blockver = false;
            }

        }

    }

    renderer.render( scene, camera );
    window.requestAnimationFrame( animate );
}

function movimentaCobra(){
    for(let i = cobra.length-1; i>0; i--){
        cobra[i].position.x = cobra[i-1].position.x;
        cobra[i].position.z = cobra[i-1].position.z;
    }

    cobra[0].position.x += hor;
    cobra[0].position.z += ver;

    return;
}

function criaMaca(){
    while(colisaoCorpoMaca()){
        maca.position.x = (Math.floor(Math.random() * 14 + 1)) -7;
        maca.position.z = (Math.floor(Math.random() * 14 + 1)) -7;
    }
    return;
}

function colisaoCabecaMaca(){
    if(cobra[0].position.x == maca.position.x && cobra[0].position.z == maca.position.z){
        return true;
    }
    return false;
}

function colisaoCorpoMaca(){
    let i;
    for(i = 0; i < cobra.length; i++){
        if(cobra[i].position.x == maca.position.x && cobra[i].position.z == maca.position.z){
            return true;
        }
    }
    return false;
}

function colisaoProprioCorpo(){
    let i;
    for(i = 1; i < cobra.length; i++){
        if(cobra[i].position.x == cobra[0].position.x && cobra[i].position.z == cobra[0].position.z){
            return true;
        }
    }
    return false;
}

function createLights(){
    let ambiente = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( ambiente );

    let point = new THREE.PointLight( 0xffffff, 1, 100 );
    point.position.set( 50, 50, 50 );
    scene.add( point );
}

function getSnakeData(){
    let geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
    let material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
    let cube = new THREE.Mesh( geometry, material );

    return cube;
}

function getAppleData(){
    let geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
    let material = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
    let cube = new THREE.Mesh( geometry, material );
    
    return cube;
}

function setup(){
    aspect = window.innerWidth / window.innerHeight;
    fovy = 90;
    near = 0.001;
    far = 1000;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(fovy, aspect, near, far);
    renderer = new THREE.WebGLRenderer();

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}

function resize(){
    aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(fovy, aspect, near, far);
    renderer.setSize( window.innerWidth, window.innerHeight );
    posicionarCamera();
}

function posicionarCamera(){
    camera.position.z = 10;
    camera.position.y = 9;
    camera.lookAt(0, 0, 0);
}

function keyDown(evt){
    if(!gameOver){
        if(evt.key === "ArrowDown"){ 
            if (!blockver){
                ver = .5, hor = 0.0, blockver = true, iniciou=true;
            }
            return;
        }
        
        if(evt.key === "ArrowUp"){
            if (!blockver){
                ver = -.5, hor = 0.0, blockver = true, iniciou=true;
            }
            return;
        }

        if(evt.key === "ArrowLeft"){
            if (!blockhor){
                hor = -.5, ver = 0.0, blockhor = true;
            }
            return;
        }

        if(evt.key === "ArrowRight"){
            if (!blockhor){
                hor = .5, ver = 0.0, blockhor = true, iniciou=true;
            }
            return;
        }
    }
}

main();
window.addEventListener("resize", resize);
window.addEventListener("keydown", keyDown); 
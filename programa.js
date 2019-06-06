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
let parede = [];
let chao = [];
let controle = false;

function main(){
    // 1 - SETUP DA CENA / CAMERA E RENDERER
    setup();

    // 2.0 - CRIAR COBRA 
    cobra[0] = getSnakeData();
    cobra[0].position.x = -1;
    cobra[0].material.emissive.setRGB(0, 1, 0);
    cobra[0].rotation.z = Math.PI/2;
    cobra[1] = getSnakeData();
    cobra[1].position.x = -1.5;
    cobra[1].rotation.z = Math.PI/2;
    
    cobra[2] = getSnakeData();
    cobra[2].position.x = -2.0;
    cobra[2].rotation.z = Math.PI/2;

    maca = getAppleData();

    criaMaca();
    
    desenhaCenario();
    desenhaSolo();

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
    
    if (iniciou){
        frame++
        if(frame % 10 === 0){
            
            movimentaCobra();

            
            if(colisaoProprioCorpo() || colisaoCenario()){
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
                cobra[cont].rotation.z = Math.PI/2;
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
    if(!gameOver){
        window.requestAnimationFrame( animate );
    }
}

function movimentaCobra(){

    for(let i = cobra.length-1; i>0; i--){
        let x = cobra[i-1].position.x - cobra[i].position.x;
        let z = cobra[i-1].position.z - cobra[i].position.z;
        let a = Math.atan2(z, -x);
        cobra[i].position.x = cobra[i-1].position.x;
        cobra[i].position.z = cobra[i-1].position.z;

        cobra[i].rotation.y = a;

    }
    let x = cobra[0].position.x + hor - cobra[0].position.x;
    let z = cobra[0].position.z + ver - cobra[0].position.z;
    let a = Math.atan2(z, -x);
    cobra[0].rotation.y = a;

    cobra[0].position.x += hor;
    cobra[0].position.z += ver;
    controle=false;
    return;
}

function criaMaca(){
    maca.position.x = (Math.floor(Math.random() * 10 + 1)) -5;
    maca.position.z = (Math.floor(Math.random() * 10 + 1)) -5;

    while(colisaoCorpoMaca()){
        maca.position.x = (Math.floor(Math.random() * 10 + 1)) -5;
        maca.position.z = (Math.floor(Math.random() * 10 + 1)) -5;
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
    point.position.set( 0, 5, 5 );
    scene.add( point );
}

function getSnakeData(){
    let geometry = new THREE.CylinderGeometry( 0.3, 0.3, 0.5 , 20.0, 20.0);
    let material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    let cube = new THREE.Mesh( geometry, material );
    return cube;
}

function getAppleData(){
    let geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
    let material = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
    let cube = new THREE.Mesh( geometry, material );
    
    return cube;
}

function getWallData(){
    let geometry = new THREE.ConeGeometry( 0.5, 1.5, 0.5 );
    let material = new THREE.MeshLambertMaterial( { color: 0x0000ff } );
    let cone = new THREE.Mesh( geometry, material );
    return cone;
}

function getFloorData(){
    let geometry = new THREE.PlaneGeometry( 1, 1, 1 );
    let material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    let floor = new THREE.Mesh( geometry, material );
    return floor;
}

function setup(){
    aspect = window.innerWidth / window.innerHeight;
    fovy = 80;
    near = 0.001;
    far = 1000;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(fovy, aspect, near, far);
    renderer = new THREE.WebGLRenderer({ antialias: true });

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
    camera.position.z = 7;
    camera.position.y = 7;
    camera.lookAt(0, 0, 0);
}

function keyDown(evt){
    if(!gameOver){
        if(evt.key === "ArrowDown"){ 
            if (!blockver){
                ver = .5, hor = 0.0, blockver = true, iniciou=true, controle=true;
            }
            return;
        }
        
        if(evt.key === "ArrowUp"){
            if (!blockver){
                ver = -.5, hor = 0.0, blockver = true, iniciou=true, controle=true;
            }
            return;
        }

        if(evt.key === "ArrowLeft"){
            if (!blockhor){
                hor = -.5, ver = 0.0, blockhor = true, controle=true;
            }
            return;
        }

        if(evt.key === "ArrowRight"){
            if (!blockhor){
                hor = .5, ver = 0.0, blockhor = true, iniciou=true, controle=true;
            }
            return;
        }
    }
    
    if(evt.key === "a"){
        gameOver = true;
    }

    if(evt.key === "b" && gameOver){
        gameOver = false;
        animate();
    }
}

function desenhaCenario(){
    let cont = 0;
    // Desenha borda superior da tela
    for(let i=-6; i <= 6; i++){
        parede[cont] = getWallData();
        parede[cont].position.x = i;
        parede[cont].position.z = -6;
        scene.add(parede[cont]);
        cont++;
    }

    // Desenha borda inferior da tela
    for(let i=-6; i <= 6; i++){
        parede[cont] = getWallData();
        parede[cont].position.x = i;
        parede[cont].position.z = 6;
        scene.add(parede[cont]);
        cont++;
    }

    // Desenha borda esquerda da tela
    for(let i=-6; i <= 6; i++){
        parede[cont] = getWallData();
        parede[cont].position.x = -6;
        parede[cont].position.z = i;
        scene.add(parede[cont]);
        cont++;
    }   

    // Desenha borda direita da tela
    for(let i=-6; i <= 6; i++){
        parede[cont] = getWallData();
        parede[cont].position.x = 6;
        parede[cont].position.z = i;
        scene.add(parede[cont]);
        cont++;
    }

    return;
}

function desenhaSolo(){
    
    let cont = 0;

    for(let i=-6; i <= 6; i++){
        for(let j = -6; j <=6; j++){
            chao[cont] = getFloorData();
            chao[cont].position.x = i;
            chao[cont].position.y = -1;
            chao[cont].position.z = j;
            chao[cont].rotation.x = Math.PI/2;
            scene.add(chao[cont]);
            cont++;
        }
    }

}

function colisaoCenario(){
    // Borda direita
    if(cobra[0].position.x >= 6){
        return true;
    }

    // Borda esquerda
    if(cobra[0].position.x <= -6){
        return true;
    }

    // Borda Inferior
    if(cobra[0].position.z >= 6){
        return true;
    }

    // Borda Superior
    if(cobra[0].position.z <= -6){
        return true;
    }

    return false;

}

main();
window.addEventListener("resize", resize);
window.addEventListener("keydown", keyDown); 
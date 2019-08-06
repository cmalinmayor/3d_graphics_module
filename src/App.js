import "./App.css"
import React, { Component } from 'react';
import * as THREE from 'three-full';

class App extends Component{
   constructor(props) {
    super(props)
    this.rotation = 0
    this.mount = React.createRef()
  }

  componentDidMount(){
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    
    //ADD SCENE
    this.scene = new THREE.Scene()
    
    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    this.camera.position.z = 10
    
    //ADD ORBIT CONTROLS
    this.controls = new THREE.OrbitControls( this.camera )
    this.controls.addEventListener( 'change', this.renderScene )

    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor(0x000000)
    this.renderer.setSize(width, height)
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.mount.appendChild(this.renderer.domElement)
    
    // instantiate a loader
    var loader = new THREE.OBJLoader();

    // load a resource
    loader.load(
        // resource URL
        '435501.obj',
        // called when resource is loaded
        this.load_object,
        // called when loading is in progresses
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
    
    var matteMaterial = THREE.MeshLambertMaterial
    //ADD PLANE
    var planeGeometry = new THREE.PlaneBufferGeometry( 10, 10, 32, 32 );
    var planeMaterial = new matteMaterial( { color: 0xeee5de, side: THREE.DoubleSide } );
    var plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.receiveShadow = true;
    this.scene.add( plane );
      
    //ADD AMBIENT LIGHT
    var alight = new THREE.AmbientLight( 0xFFFFFF, 0.8 );
    this.scene.add(alight);
    
    //ADD SPOT LIGHT
    var light = new THREE.SpotLight( 0xFFFFFF, 1 );
    light.position.set(1, -5, 10);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this.scene.add(light);
    
    //START ANIMATION
    this.start()
  }

  load_object = (object) => {
    var material = new THREE.MeshStandardMaterial({color: 'yellow', side: THREE.DoubleSide});
    object.traverse( (mesh) => {

        if (mesh instanceof THREE.Mesh) {
            mesh.material = material;
            mesh.geometry.computeBoundingBox()
            const bbox = new THREE.Box3().setFromObject(mesh)
            // ...and scale the mesh down by the largest dimension of this box.
            const size = new THREE.Vector3()
            bbox.getSize(size)
            const max = Math.max(size.x, size.y, size.z)
            const scale = 5.0 / max
            mesh.scale.set(scale, scale, scale)
            // Then update the vertices of the mesh so the center of the bounding box is
            // moved to the origin.
            mesh.geometry.center()
            mesh.castShadow = true
            mesh.position.set(0, 0, 5)
            this.scene.add(mesh)
            this.renderer.render(this.scene, this.camera)
            // this.setState({ loadedMesh: mesh})
            return
        }
    })
  }

  componentWillUnmount(){
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }
  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }
  stop = () => {
    cancelAnimationFrame(this.frameId)
  }
  animate = () => {
    this.controls.update()
    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }
  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }
  render(){
    return(
      <div className="App">
        <div className="App-header">
          <div
            style={{ width: '800px', height: '800px' }}
            ref={(mount) => { this.mount = mount }}
          />
        </div>
      </div>
    )
  }
}
export default App

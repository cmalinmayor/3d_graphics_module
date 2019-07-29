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
    this.camera.position.z = 100
    this.camera.lookAt(0, 0, 0)

    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor(0x000000)
    this.renderer.setSize(width, height)
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.mount.appendChild(this.renderer.domElement)
    
    // instantiate a loader
    var loader = new THREE.OBJLoader();
    var material = new THREE.MeshBasicMaterial({color: 'yellow', side: THREE.DoubleSide});

    // load a resource
    loader.load(
        // resource URL
        '435501.obj',
        // called when resource is loaded
        function ( object ) {
            object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {
                child.material = material;
                child.geometry.computeBoundingBox()
                const bbox = new THREE.Box3().setFromObject(child)
                // ...and scale the mesh down by the largest dimension of this box.
                const size = new THREE.Vector3()
                bbox.getSize(size)
                const max = Math.max(size.x, size.y, size.z)
                const scale = 1.0 / max
                child.scale.set(scale, scale, scale)
                // Then update the vertices of the mesh so the center of the bounding box is
                // moved to the origin.
                child.geometry.center()
                // The first mesh is the one that will be viewed.
                this.setState({ loadedMesh: child })
                return
            }
            })

        },
        // called when loading is in progresses
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
    
    //ADD AMBIENT LIGHT
    var alight = new THREE.AmbientLight( 0xFFFFFF, 0.8 );
    this.scene.add(alight);
    
    //ADD SPOT LIGHT
    var light = new THREE.SpotLight( 0xFFFFFF, 1 );
    light.position.set(1, -5, 10);
    light.castShadow = true;
    this.scene.add(light);
    
    //START ANIMATION
    this.start()
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
    //PAN CAMERA IN CIRCLE AROUND Z AXIS
    this.rotation += 0.01
    this.camera.position.x = 2 * Math.sin(this.rotation)
    this.camera.position.y = 2 * Math.cos(this.rotation)
    this.camera.lookAt(0, 0, 0)
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

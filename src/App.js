import "./App.css"
import React, { Component } from 'react';
import * as THREE from 'three-full';

class App extends Component{
   state = { loadedMesh: null }

   constructor(props) {
    super(props)
    this.mount = React.createRef()
  }

  componentDidMount(){
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    
    //ADD SCENE
    this.scene = new THREE.Scene()
    
    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      65,
      width / height,
      0.1,
      100
    )
    this.camera.position.z = 1.5

    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor(0x000000)
    this.renderer.setSize(width, height)
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
    
    //ADD AMBIENT LIGHT
    var alight = new THREE.AmbientLight( 0xFFFFFF, 0.8 );
    this.scene.add(alight);
    
    //ADD SPOT LIGHT
    var light = new THREE.SpotLight( 0xFFFFFF, 1 );
    light.position.set(10, 35, 25);
    this.scene.add(light);
  }

  load_object = (object) => {
    var material = new THREE.MeshBasicMaterial({color: 'yellow', side: THREE.DoubleSide});
    object.traverse( (mesh) => {

        if (mesh instanceof THREE.Mesh) {
            mesh.material = material;
            mesh.geometry.computeBoundingBox()
            const bbox = new THREE.Box3().setFromObject(mesh)
            // ...and scale the mesh down by the largest dimension of this box.
            const size = new THREE.Vector3()
            bbox.getSize(size)
            const max = Math.max(size.x, size.y, size.z)
            const scale = 1.0 / max
            mesh.scale.set(scale, scale, scale)
            // Then update the vertices of the mesh so the center of the bounding box is
            // moved to the origin.
            mesh.geometry.center()
            this.scene.add(mesh)
            this.renderer.render(this.scene, this.camera)
            // this.setState({ loadedMesh: mesh})
            return
        }
    })
  }

  componentWillUnmount(){
    this.mount.removeChild(this.renderer.domElement)
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

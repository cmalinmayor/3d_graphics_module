import "./App.css"
import React, { Component } from 'react';
import * as THREE from 'three-full';

class App extends Component{
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
    this.camera = new THREE.OrthographicCamera(
      10,
      -10,
      10,
      -10,
      0,
      1000
    )
    /*this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    this.camera.position.z = 5
    this.camera.position.x = -5
    this.camera.position.y = 8
    this.camera.lookAt(0, 0, 0)*/

    this.camera.position.z = 5
    this.camera.position.x = 5 
    this.camera.position.y = 15
    this.camera.lookAt(0, 0, 0)

    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.shadowMap.enabled = true;
    this.renderer.setClearColor(0x000000)
    this.renderer.setSize(width, height)
    this.mount.appendChild(this.renderer.domElement)
    
    //ADD PLANE
    var planeGeometry = new THREE.PlaneBufferGeometry( 10, 10, 32, 32 );
    var planeMaterial = new THREE.MeshLambertMaterial( { color: 0xb69a77, side: THREE.DoubleSide } );
    var plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.receiveShadow = true;
    plane.rotation.x = - Math.PI / 2;
    this.scene.add( plane );
      
    //ADD CUBE
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshLambertMaterial({ color: '#433F81'     })
    this.cube = new THREE.Mesh(geometry, material)
    this.cube.position.y = 2
    this.cube.castShadow = true
    this.scene.add(this.cube)
    
    //ADD SPHERE
      var sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), new THREE.MeshLambertMaterial({color: 0xFFFFFF}))
    sphere.position.set(2, 2, 2);
    sphere.castShadow = true
    sphere.recieveShadow = true
    this.scene.add(sphere)
    
    //ADD sphere to show where light is
    const sun_geometry = new THREE.SphereGeometry(0.1, 16, 16)
    const sun_material = new THREE.MeshStandardMaterial({color: 0x000000})
    var sun = new THREE.Mesh(sun_geometry, sun_material)
    sun.position.set(5, 0, 5);
    this.scene.add(sun)
    
    //ADD AMBIENT LIGHT
    var alight = new THREE.AmbientLight( 0xFFFFFF, 0.6 );
    this.scene.add(alight);
    
    //ADD POINT LIGHT
    
    var light = new THREE.DirectionalLight( 0xFFFFFF, 1 );
    light.position.set(10, -10, 10);
    light.target = sun
    light.castShadow = true;
    this.scene.add(light);

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
    //this.cube.rotation.x += 0.01
    //this.cube.rotation.y += 0.01
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

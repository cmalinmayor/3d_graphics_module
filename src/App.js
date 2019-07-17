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
    this.camera.position.z = 9
    this.camera.lookAt(0, 0, 0)

    var shinyMaterial = THREE.MeshStandardMaterial
    var matteMaterial = THREE.MeshLambertMaterial

    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor(0x000000)
    this.renderer.setSize(width, height)
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.mount.appendChild(this.renderer.domElement)
    
    //ADD PLANE
    var planeGeometry = new THREE.PlaneBufferGeometry( 10, 10, 32, 32 );
    var planeMaterial = new matteMaterial( { color: 0xb69a77, side: THREE.DoubleSide } );
    var plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.receiveShadow = true;
    this.scene.add( plane );
      
    //ADD CUBE
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
    const cubeMaterial = new shinyMaterial({ color: '#433F81' })
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    this.cube.position.z = 2
    this.cube.receiveShadow = true
    this.cube.castShadow = true
    this.scene.add(this.cube)
    
    //ADD SPHERE
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), new shinyMaterial({color: 0xFFFFFF}))
    sphere.position.set(1, 1, 0);
    sphere.castShadow = true
    sphere.receiveShadow = true
    this.scene.add(sphere)
    
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

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
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    this.camera.position.z = 5
    this.camera.position.y = 2
    this.camera.position.y = 3
    this.camera.lookAt(0, 0, 0)

    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor(0x000000)
    this.renderer.setSize(width, height)
    this.mount.appendChild(this.renderer.domElement)
    
    //ADD CUBE
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: '#433F81' })
    this.cube = new THREE.Mesh(geometry, material)
    this.scene.add(this.cube)
    
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
    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01
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

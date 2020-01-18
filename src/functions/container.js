import React, { useRef, useEffect, useState, useContext, useReducer } from 'react'
import * as THREE from 'three'
import BassShader from '../shaders/BassShader.glsl'
import GuitarShader from '../shaders/GuitarShader.glsl'
import AudioVertexShader from '../shaders/AudioVertexShader.glsl'
import GridShader from '../shaders/GridShader.glsl'
import Scene from '../objects/Scene'

const AudioContext = React.createContext()

const initialState = {
  loading: true
}

const reducer = (state, action) => {
  switch (action.type) {
  case "SET_LOADING":
    return {
      ...state,
      loading: action.payload
    }
  }
}

export const Container = ({url}) => {
  const mount = useRef(null)
  const [points, setPoints] = useState(null)
  const [isAnimating, setAnimating] = useState(false)
  const controls = useRef(null)
  
  useEffect(() => {
    const loadData = (data) => setPoints(data.points)
    loadData({
      points: [{
        x: 0,
        y: 0,
        z: 0
      }]
    })
  }, [])
  
  useEffect(() => {
    console.log(points)
    if (!points) return
    
    // initate scene
    let width = mount.current.clientWidth
    let height = mount.current.clientHeight
    let frameId
    let models = points.map((point, index) => {
      return {
        geometry: new THREE.SphereGeometry(100, 10, 6),
        name: `disco-ball-${index}`,
        position: point,
        vectorFieldConfig: "LORENZ"
      }
    })

    models.push({
      geometry: new THREE.PlaneGeometry(50, 50, 50),
      name: 'floor',
      position: {x: 0, y:0, z: -10},
      vertexShader: AudioVertexShader,
      fragmentShader: GridShader
    })
    
    let scene = new Scene({
      width,
      height,
      models: models
    })

    console.log('url', url)
    scene.loadAudioObject({url: url}).then(({uniforms}) => {
      scene.loadMeshes(uniforms)
    })
    
    const handleResize = () => {
      scene.handleResize(mount.current.clientWidth, mount.current.clientHeight)
    }
      
    const animate = () => {
      scene.renderScene()
      frameId = window.requestAnimationFrame(animate)
    }

    const start = () => {
      if (!frameId) {
        scene.play()
        frameId = requestAnimationFrame(animate)
      }
    }

    const stop = () => {
      cancelAnimationFrame(frameId)
      scene.pause()
      frameId = null
    }

    mount.current.appendChild(scene.renderer.domElement)
    window.addEventListener('resize', handleResize)
    //start()

    controls.current = { start, stop }
      
    return () => {
      stop()
      window.removeEventListener('resize', handleResize)
      //mount.current.removeChild(renderer.domElement)

      //scene.remove(cube)
      //geometry.dispose()
      //material.dispose()
    }
  }, [points])

  useEffect(() => {
    //console.log(state)
  }, [])

  useEffect(() => {
    try {
      if (isAnimating) {
        controls.current.start()
      } else {
        controls.current.stop()
      }
    }

    catch {
      console.log('waiyting for media')
    }
  }, [isAnimating])
  
  return <div className="container" ref={mount} onClick={() => setAnimating(!isAnimating)} />
}

export const AudioContainer = ({url}) => {
  return (
    <Container url={url}/>
  )
}






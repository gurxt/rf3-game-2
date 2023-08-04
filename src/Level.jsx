import { useFrame } from "@react-three/fiber"
import { CuboidCollider, RigidBody } from "@react-three/rapier"
import { useMemo, useRef, useState } from "react"
import * as THREE from "three"

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' })
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 'orangered' })
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' })

const BlockStart = ({position = [0, 0, 0]}) => {
  return (
    <group position={position}>
      <mesh 
        geometry={boxGeometry} 
        material={floor1Material}
        scale={[4, 0.2, 4]} 
        position={[0, -0.1, 0]} 
        receiveShadow
      />
    </group>
  )
}

export const BlockSpinner = ({position = [0, 0, 0]}) => {
  const obstacle = useRef()
  const [speed] = useState(() => {
    return (
      (Math.random() + 0.5) * 
      (Math.random() < 0.5 ? -1 : 1)
    )
  })

  useFrame(({ clock }) => {
    if (obstacle?.current) {
      const time = clock.getElapsedTime()

      const rotation = new THREE.Quaternion()
      rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
      obstacle.current.setNextKinematicRotation(rotation)
    }
  })

  return (
    <group position={position}>
      <mesh 
        geometry={boxGeometry} 
        material={floor2Material}
        scale={[4, 0.2, 4]} 
        position={[0, -0.1, 0]} 
        receiveShadow
      />
      <RigidBody 
        ref={obstacle}
        type="kinematicPosition" 
        position={[0, 0.3, 0]}
        restitution={0.3}
        friction={0}
      >
        <mesh
          geometry={boxGeometry} 
          material={obstacleMaterial} 
          scale={[3.5, 0.3, 0.3]}
          castShadow 
          receiveShadow
        />
      </RigidBody>
    </group>
  )
}

export const BlockLimbo = ({position = [0, 0, 0]}) => {
  const obstacle = useRef()
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

  useFrame(({ clock }) => {
    if (obstacle?.current) {
      const time = clock.getElapsedTime()

      const y = Math.sin(time + timeOffset) + 1.15
      obstacle.current.setNextKinematicTranslation({
        x: position[0],
        y: position[1] + y,
        z: position[2]
      })
    }
  })

  return (
    <group position={position}>
      <mesh 
        geometry={boxGeometry} 
        material={floor2Material}
        scale={[4, 0.2, 4]} 
        position={[0, -0.1, 0]} 
        receiveShadow
      />
      <RigidBody 
        ref={obstacle}
        type="kinematicPosition" 
        position={[0, 0.3, 0]}
        restitution={0.3}
        friction={0}
      >
        <mesh
          geometry={boxGeometry} 
          material={obstacleMaterial} 
          scale={[3.5, 0.3, 0.3]}
          castShadow 
          receiveShadow
        />
      </RigidBody>
    </group>
  )
}
export const BlockAxe = ({position = [0, 0, 0]}) => {
  const obstacle = useRef()
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

  useFrame(({ clock }) => {
    if (obstacle?.current) {
      const time = clock.getElapsedTime()

      const x = Math.sin(time + timeOffset) * 1.25
      obstacle.current.setNextKinematicTranslation({
        x: position[0] + x,
        y: position[1] + 0.75,
        z: position[2]
      })

    }
  })

  return (
    <group position={position}>
      <mesh 
        geometry={boxGeometry} 
        material={floor2Material}
        scale={[4, 0.2, 4]} 
        position={[0, -0.1, 0]} 
        receiveShadow
      />
      <RigidBody 
        ref={obstacle}
        type="kinematicPosition" 
        position={[0, 0.3, 0]}
        restitution={0.3}
        friction={0}
      >
        <mesh
          geometry={boxGeometry} 
          material={obstacleMaterial} 
          scale={[1.5, 1.5, 0.3]}
          castShadow 
          receiveShadow
        />
      </RigidBody>
    </group>
  )
}

const BlockEnd = ({position = [0, 0, 0]}) => {
  return (
    <group position={position}>
      <mesh 
        geometry={boxGeometry} 
        material={floor1Material}
        scale={[4, 0.2, 4]} 
        position={[0, 0, 0]} 
        receiveShadow
      />
    </group>
  )
}

const Bounds = ({length = 1}) => {
  const bounds = useMemo(() => {
    const bounds = []

    for (let i=0; i < length; i++) {
      bounds.push(
        <RigidBody type="fixed" restitution={0.2} friction={0} key={i}>
          <mesh 
            geometry={boxGeometry}
            material={wallMaterial}
            scale={[0.3, 1.5, 4]}
            position={[2.15, 0.55, i * -4]}
          />
          <mesh 
            geometry={boxGeometry}
            material={wallMaterial}
            scale={[0.3, 1.5, 4]}
            position={[-2.15, 0.55, i * -4]}
          />
        </RigidBody>
      )
    }

    bounds.push(
      <RigidBody type="fixed" restitution={0.2} friction={0} key={length}>
        <mesh
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[4.6, 1.5, 0.3]}
          position={[0, 0.55, length * -4 + 1.85]}
        />
        <CuboidCollider 
          args={[2, 0.1, 2 * length]}
          position={[ 0, -0.1, -(length * 2) + 2]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    )

    return bounds
  })

  return bounds
}

export function Level({ count = 5, types = [BlockSpinner, BlockAxe, BlockLimbo ]}) {
  const blocks = useMemo(() => {
    const blocks = []

    for (let i=0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      blocks.push(type)
    }

    return blocks
  }, [count, types])

  return (
    <>
    <BlockStart position={[0, 0, 0]} />
    { blocks.map((Block, idx) => <Block key={idx} position={[0, 0, (idx + 1) * -4]} />) }
    <BlockEnd position={[0, 0, (count + 1) * -4 ]} />
    <Bounds length={count + 2} />
    </>
  )
}
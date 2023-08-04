import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Level, BlockSpinner, BlockAxe, BlockLimbo } from './Level'

export default function Experience() {
  return (
    <>
    <OrbitControls makeDefault />
    <Physics debug>
      <ambientLight intensity={0.25} />
      <directionalLight
        castShadow
        position={ [-1, 4, 4] }
        intensity={ 1.5 }
      />
      <Level />
    </Physics>
    </>
  )
}
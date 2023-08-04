import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";

export default function App() {
  return (
    <Canvas
      camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [ 2.5, 4, 6 ]
      }}
      shadows
    >
      <Experience />
    </Canvas>
  )
}

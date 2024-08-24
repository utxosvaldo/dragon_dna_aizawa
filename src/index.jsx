import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { onDoubleClick } from './Experience.jsx';

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <Canvas
        camera={{
            fov: 45,
            near: 0.01,
            far: 200,
            // position: [ - 0.16, 0.1, -1 ],
            position: [4, 0, 0]
        }}
        onDoubleClick={onDoubleClick}
    >
        <group rotation={[Math.PI/2, 0,0]} position={[0,1,0]}>
            <Experience />
        </group>
    </Canvas>
);
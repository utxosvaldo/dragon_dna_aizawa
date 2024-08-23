import { useFrame } from '@react-three/fiber'
import { Cylinder, Line, OrbitControls, Sphere } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { Perf } from 'r3f-perf'
import { PivotControls } from '@react-three/drei'
import DNAStrand from './DNAStrand'

export default function Experience()
{
    const [ sphereGeometry, setSphereGeometry ] = useState()
    const spheres = useRef([])
    const testSphere = useRef()


    const [a, b, c, d, e, f] = [0.95, 0.7, 0.6, 3.5, 0.25, 0.1]
    const dt = 0.01

    useFrame((state, delta) => {
        // for(const sphere of spheres.current){
        //     const [x, y, z] = sphere.position

        //     const dx = (z - b) * x - d * y;
        //     const dy = d * x + (z - b) * y;
        //     const dz = c + (a * z) - (z ** 3) / 3 - (x**2 + y**2) * (1 + e * z) + f * z * x ** 3

        //     sphere.position.x = x + dx * delta
        //     sphere.position.y = y + dy * delta
        //     sphere.position.z = z + dz * delta
        // }

        // testSphere.current.scale.z = Math.sin(state.clock.elapsedTime)
        // console.log(testSphere.current.scale)
    })


    return (
        <>
            <Perf position='top-left' />

            <OrbitControls makeDefault target={[0, 0, 0.5]} />
            <sphereGeometry ref={setSphereGeometry} />

            <directionalLight position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <Sphere position={[0, 0, -0.5]} scale={0.02}>
                <meshBasicMaterial color={'red'} />
            </Sphere>

            {/* <Sphere ref={testSphere} position={[0, 0, 0.5]} scale={[0.01, 0.01, 0.2]}>
                <meshBasicMaterial color={'blue'} />
            </Sphere> */}

            <Sphere position={[0, 0, 1.5]} scale={0.02}>
                <meshBasicMaterial color={'blue'} />
            </Sphere>

            <Sphere
                position={[0, 0, 0.5]}
                scale={1.5}
                rotation={[Math.PI / 2, 0, 0]}
            >
                <meshBasicMaterial color={'red'} wireframe />
            </Sphere>

            <DNAStrand />

            {/* {[...Array(1000)].map((value, index) => (
                <mesh
                    ref={element => (spheres.current[index] = element)}
                    key={index}
                    geometry={sphereGeometry}
                    position={[
                        (Math.random() - 0.5) * 1,
                        (Math.random() - 0.5) * 1,
                        Math.random() * 0.5
                    ]}
                    scale={0.01}
                >
                    <meshStandardMaterial color='orange' />
                </mesh>
            ))} */}
        </>
    );
}
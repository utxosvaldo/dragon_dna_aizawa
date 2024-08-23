import { useFrame } from '@react-three/fiber'
import { Cylinder, Line, OrbitControls, Sphere, Trail } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { Perf } from 'r3f-perf'
import { PivotControls } from '@react-three/drei'
import DNAStrand from './DNAStrand'


const seq2Color = {
    0: 'green',
    1: 'deepPink',
    2: 'blue',
    3: 'red'
};

function index2Color(index) {
    const sel = index % 4
    return seq2Color[sel]
}

function genRandomCylinder(r, L, zOffset=0){
    // Generate a random z-coordinate uniformly between -L/2 and L/2 and apply the z-offset
    const z = Math.random() * L - L / 2 + zOffset;

    // Generate a random value for u between 0 and 1
    const u = Math.random();

    // Calculate the radial distance using the formula r * sqrt(u)
    const rho = r * Math.sqrt(u);

    // Generate a random angle theta between 0 and 2*pi
    const theta = Math.random() * 2 * Math.PI;

    // Convert to Cartesian coordinates
    const x = rho * Math.cos(theta);
    const y = rho * Math.sin(theta);
    
    return [x,y,z]
}

export default function Experience()
{
    const [ sphereGeometry, setSphereGeometry ] = useState()
    const spheres = useRef([])
    const testSphere = useRef()


    const [a, b, c, d, e, f] = [0.95, 0.7, 0.6, 3.5, 0.25, 0.1]
    const dt = 0.01

    useFrame((state, delta) => {
        for(const sphere of spheres.current){
            const [x, y, z] = sphere.position

            const dx = (z - b) * x - d * y;
            const dy = d * x + (z - b) * y;
            const dz = c + (a * z) - (z ** 3) / 3 - (x**2 + y**2) * (1 + e * z) + f * z * x ** 3

            sphere.position.x = x + dx * delta/2
            sphere.position.y = y + dy * delta/2
            sphere.position.z = z + dz * delta/2
        }
    })


    return (
        <>
            <Perf position='top-left' />

            <OrbitControls makeDefault target={[0, 0, 0.5]} />
            <sphereGeometry ref={setSphereGeometry} />

            <directionalLight position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            {/* <Sphere
                position={[0, 0, 0.5]}
                scale={1.5}
                rotation={[Math.PI / 2, 0, 0]}
            >
                <meshBasicMaterial color={'red'} wireframe />
            </Sphere> */}

            <DNAStrand />

            {[...Array(300)].map((value, index) => (
                <Trail
                    width={0.2} // Width of the line
                    color={index2Color(index)} // Color of the line
                    length={5} // Length of the line
                    decay={1} // How fast the line fades away
                    local={false} // Wether to use the target's world or local positions
                    stride={0} // Min distance between previous and current point
                    interval={1} // Number of frames to wait before next calculation
                    target={undefined} // Optional target. This object will produce the trail.
                    attenuation={width => width} // A function to define the width in each point along it.
                >
                    <mesh
                        ref={element => (spheres.current[index] = element)}
                        key={index}
                        geometry={sphereGeometry}
                        // position={[
                        //     (Math.random() - 0.5) * 1,
                        //     (Math.random() - 0.5) * 1,
                        //     Math.random() * 0.5
                        // ]}
                        position={genRandomCylinder(1, 2, -0.5)}
                        scale={0.005}
                    >
                        <meshStandardMaterial color={index2Color(index)} />
                    </mesh>
                </Trail>
            ))}
        </>
    );
}
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

function randomPointOnCircle(radius, zOffset = 0) {
    // Generate a random angle theta between 0 and 2*pi
    const theta = Math.random() * 2 * Math.PI;

    // Since the point is on the surface of the circular plane, the radius is fixed
    const x = radius * Math.cos(theta);
    const y = radius * Math.sin(theta);

    // The z-coordinate is simply the zOffset since the plane is parallel to the XY plane
    const z = zOffset;

    // Return the point as an object
    return [x,y,z];
}

function randomPointOnSphere(r) {
    // Generate a random value for theta between 0 and 2*pi
    const theta = Math.random() * 2 * Math.PI;
    
    // Generate a random value for phi using the formula phi = acos(1 - 2 * u)
    const u = Math.random();
    const phi = Math.acos(1 - 2 * u);
    
    // Convert spherical coordinates to Cartesian coordinates
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi) + r;
    return [x,y,z]
}

function genRandomCylinder(r, L, zOffset=0){
    // Generate a random z-coordinate uniformly between -L/2 and L/2 and apply the z-offset
    const z = Math.random() * L - L / 2 + zOffset;

    // Generate a random value for u between 0 and 1
    const u = Math.random();

    // Calculate the radial distance using the formula r * sqrt(u)
    const rho = r //* Math.sqrt(u);

    // Generate a random angle theta between 0 and 2*pi
    const theta = Math.random() * 2 * Math.PI;

    // Convert to Cartesian coordinates
    const x = rho * Math.cos(theta);
    const y = rho * Math.sin(theta);
    
    return [x,y,z]
}

export function onDoubleClick(){
    // console.log('doubleclick')
    alertDoubleClick = true
    // framesSinceLastRestart = 0
}

let alertDoubleClick = false
let framesSinceLastRestart = 0
let firstRenderComplete = false
let trailSteps = 5

export default function Experience()
{
    const [ sphereGeometry, setSphereGeometry ] = useState()
    const spheres = useRef([])
    const trails = useRef([])


    const [a, b, c, d, e, f] = [0.95, 0.7, 0.6, 3.5, 0.25, 0.1]
    const dt = 0.01
    useFrame((state, delta) => {


        if(alertDoubleClick){
            // restart particles

            const radius = Math.random() + 0.1;
            const zoffset = Math.random() * 1.5;
            const choice = Math.floor(Math.random() * 3);
            function randomPosition() {
                if(choice ==0){
                    return randomPointOnCircle(radius, zoffset);
                } else if (choice ==1 ){
                    // const l = Math.random() * 2.5
                    return genRandomCylinder(radius, 2.5, 0.7);
                } else if (choice == 2){
                    return randomPointOnSphere(radius);
                }
            }
            
            for (const sphere of spheres.current) {

                // const position = randomPointOnCircle(radius, zoffset);
                // console.log(zoffset)
                const position = randomPosition()
                sphere.position.x = position[0]
                sphere.position.y = position[1]
                sphere.position.z = position[2]
                
            }
            alertDoubleClick = false;
            return
        } 
        if(!firstRenderComplete){
            if(framesSinceLastRestart < trailSteps*11){
                framesSinceLastRestart += 1;

                trails.current.map(mesh => {
                    mesh.visible = false;
                });
                spheres.current.map(mesh => {
                    mesh.visible = false;
                });
                return;
            }  else {
            trails.current.map((mesh) => {
                mesh.visible = true
            })
            spheres.current.map(mesh => {
                mesh.visible = true;
            });
            firstRenderComplete = true;
        }

        }
        for(const sphere of spheres.current){
            const [x, y, z] = sphere.position;

            const dx = (z - b) * x - d * y;
            const dy = d * x + (z - b) * y;
            const dz =
                c +
                a * z -
                z ** 3 / 3 -
                (x ** 2 + y ** 2) * (1 + e * z) +
                f * z * x ** 3;

            sphere.position.x = x + dx * dt
            sphere.position.y = y + dy * dt
            sphere.position.z = z + dz * dt
        }
        
    })

    const lightPosition =[1,2,-2]

    return (
        <>
            {/* <Perf position='top-left' /> */}

            <OrbitControls makeDefault target={[0, 0.5, 0]} />
            <sphereGeometry ref={setSphereGeometry} />
            <directionalLight position={lightPosition} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <DNAStrand />

            {[...Array(300)].map((value, index) => (
                <Trail
                    key={index}
                    ref={element => (trails.current[index] = element)}
                    width={0.2} // Width of the line
                    color={index2Color(index)} // Color of the line
                    length={trailSteps} // Length of the line
                    decay={1} // How fast the line fades away
                    local={false} // Wether to use the target's world or local positions
                    // stride={0.001} // Min distance between previous and current point
                    interval={1} // Number of frames to wait before next calculation
                    target={undefined} // Optional target. This object will produce the trail.
                    attenuation={width => width} // A function to define the width in each point along it.
                >
                    <mesh
                        ref={element => (spheres.current[index] = element)}
                        geometry={sphereGeometry}
                        position={genRandomCylinder(0.2, 2.5, 0.7)}
                        // position={randomPointOnSphere(1)}
                        scale={0.005}
                    >
                        <meshStandardMaterial color={index2Color(index)} />
                    </mesh>
                </Trail>
            ))}
        </>
    );
}
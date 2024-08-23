import { Line, Sphere, Tube } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Line3 } from "three";
import * as THREE from 'three'

function zAngle(pair) {
    const pointA = pair[0];
    const pointB = pair[1];
    const deltaX = pointB[0] - pointA[0];
    const deltaY = pointB[1] - pointA[1];
    const angleRadians = Math.atan2(deltaY, deltaX);

    return angleRadians + Math.PI/2
}


export default function DNAStrand(){
    const baseASphere = useRef()

    const t = 5 // tiempo en recorrer de un lado a otro
    const n = 200 // segmentos de linea para las helices
    const l = 2 // longitud a recorrer
    const nGroves = 9 // numero de groves 

    const nBases = 10 * nGroves // Number of base pairs total along L

    const r = 0.1
    const omegaStrand = - (2 * Math.PI) * nGroves / l
    const alpha = 0
    const beta = 2.4
    const v = l/n
    const z0 = -0.5

    const strandAPoints = [...Array(n)].map((value, index) =>{
        return new THREE.Vector3(
            r * Math.cos(omegaStrand * (index * l / n) + alpha),
            r * Math.sin(omegaStrand * (index * l / n) + alpha),
            index * v + z0
        )
    })

    const strandBPoints = [...Array(n)].map((value, index) => {
        return new THREE.Vector3(
            r * Math.cos(omegaStrand * (index * l / n) + beta),
            r * Math.sin(omegaStrand * (index * l / n) + beta),
            index * v + z0
        )
    });

    const basePairs = [...Array(nBases)].map((value, index) => {
        const strandAPoint = [
            r * Math.cos(omegaStrand * (index * l / nBases) + alpha),
            r * Math.sin(omegaStrand * (index * l / nBases) + alpha),
            index * l / nBases + z0
        ];
        const strandBPoint = [
            r * Math.cos(omegaStrand * (index * l / nBases) + beta),
            r * Math.sin(omegaStrand * (index * l / nBases) + beta),
            index * l / nBases + z0
        ];
        return [strandAPoint, strandBPoint]
    })

    const strandGroup = useRef()

    const wZ = 2 * Math.PI  * nGroves/t

    // base length scale and width scale
    const baseLengthScale = 0.9 * r / 2 ;
    const baseWidthScale = baseLengthScale / 10;
    const strandLineWidth = 20

    const baseGroup = useRef()

    useFrame((status, delta) => {
        // strandGroup.current.rotation.z += wZ * delta

        // const z = ((status.clock.elapsedTime % t) * l / t) 

        // baseGroup.current.position.z = z 
        // baseGroup.current.rotation.z += wZ*delta

    })

    const [sphereGeometry, setSphereGeometry] = useState();

    

    return (
        <>
            <sphereGeometry ref={setSphereGeometry} />

            <group ref={baseGroup}>
                <Sphere
                    position={[
                        (basePairs[0][0][0] * 3) / 4 + basePairs[0][1][0] / 4,
                        (basePairs[0][0][1] * 3) / 4 + basePairs[0][1][1] / 4,
                        basePairs[0][0][2]
                    ]}
                    scale={[baseWidthScale, baseLengthScale, baseWidthScale]}
                    rotation={[0, 0, zAngle(basePairs[0])]}
                >
                    <meshNormalMaterial color={'red'} />
                </Sphere>
            </group>

            {[...basePairs].map((pair, index) => (
                <mesh
                    // ref={element => (spheres.current[index] = element)}
                    key={index}
                    geometry={sphereGeometry}
                    position={[
                        (pair[0][0] * 3) / 4 + pair[1][0] / 4,
                        (pair[0][1] * 3) / 4 + pair[1][1] / 4,
                        pair[0][2]
                    ]}
                    scale={[baseWidthScale, baseLengthScale, baseWidthScale]}
                    rotation={[0, 0, zAngle(pair)]}
                >
                    <meshStandardMaterial color='red' />
                </mesh>
            ))}

            {[...basePairs].map((pair, index) => (
                <mesh
                    // ref={element => (spheres.current[index] = element)}
                    key={index}
                    geometry={sphereGeometry}
                    position={[
                        (pair[1][0] * 3) / 4 + pair[0][0] / 4,
                        (pair[1][1] * 3) / 4 + pair[0][1] / 4,
                        pair[0][2]
                    ]}
                    scale={[baseWidthScale, baseLengthScale, baseWidthScale]}
                    rotation={[0, 0, zAngle(pair)]}
                >
                    <meshStandardMaterial color='blue' />
                </mesh>
            ))}

            <group ref={strandGroup}>
                {/* <Line
                    points={strandAPoints}
                    color={'blue'}
                    lineWidth={strandLineWidth}
                    resolution={
                        new THREE.Vector2(window.innerWidth, window.innerHeight)
                    }
                /> */}
                {/* <Line
                    points={strandBPoints}
                    color={'red'}
                    lineWidth={strandLineWidth}
                /> */}
                <Tube
                    args={[
                        new THREE.CatmullRomCurve3(strandBPoints), //path
                        500, // tubular segments
                        0.01, // radius
                        100, //  radial segments
                        false // closed
                    ]}
                >
                    <meshNormalMaterial />
                </Tube>

                <Tube
                    args={[
                        new THREE.CatmullRomCurve3(strandAPoints), //path
                        500, // tubular segments
                        0.01, // radius
                        100, //  radial segments
                        false // closed
                    ]}
                >
                    <meshNormalMaterial />
                </Tube>

                {/* <mesh>
                    <tubeGeometry
                        args={[
                            new THREE.CatmullRomCurve3(strandBPoints), //path
                            20, // tubular segments
                            0.1, // radius
                            8, //  radial segments
                            false // closed
                        ]}
                    />
                    <meshNormalMaterial />
                </mesh> */}
            </group>
        </>
    );
}
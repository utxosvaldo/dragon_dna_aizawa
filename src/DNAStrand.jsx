import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Line3 } from "three";

export default function DNAStrand(){


    const [lineGeometry, setLineGeometry] = useState();

    const t = 5 // tiempo en recorrer de un lado a otro
    const n = 200 // segmentos de linea para las helices
    const l = 2 // longitud a recorrer
    const nGroves = 5 // numero de groves 

    const nBases = 10 * nGroves // Number of base pairs total along L

    const r = 0.1
    const omegaStrand = - (2 * Math.PI) * nGroves / l
    const alpha = 0
    const beta = 2.4
    const v = l/n
    const z0 = -0.5

    const strandAPoints = [...Array(n)].map((value, index) =>{
        return [
            r * Math.cos(omegaStrand * (index * l / n) + alpha),
            r * Math.sin(omegaStrand * (index * l / n) + alpha),
            index * v + z0
        ];
    })

    const strandBPoints = [...Array(n)].map((value, index) => {
        return [
            r * Math.cos(omegaStrand * (index * l / n) + beta),
            r * Math.sin(omegaStrand * (index * l / n) + beta),
            index * v + z0
        ];
    });

    const basePoints = [
        strandAPoints[0],
        strandBPoints[0]
    ]

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
    // console.log(basePairs)

    const strandGroup = useRef()
    const base = useRef()
    const bases = useRef([])
    // const baseGroup = useRef()

    const wZ = 2 * Math.PI  * nGroves/t
    useFrame((status, delta) => {
        strandGroup.current.rotation.z += wZ * delta

        // const z = ((status.clock.elapsedTime % t) * l / t) 
        // base.current.position.z = z 
        // for(const basePair of bases.current){
        //     basePair.position.z = ((status.clock.elapsedTime % t) * l) / t; 
        // }
        console.log(base)
    })



    return (
        <>
            <group ref={strandGroup}>
                <Line points={strandAPoints} color={'blue'} />
                <Line points={strandBPoints} color={'red'} />
            </group>

            <Line ref={base} points={basePairs[6]} lineWidth={7} color={'green'} />
            {/* <lineGeometry ref={setLineGeometry} /> */}

            {/* {[...Array(10)].map((value, index) => (
                <mesh
                    ref={element => (bases.current[index] = element)}
                    key={index}
                    geometry={lineGeometry}
                    position={[
                        (Math.random() - 0.5) * 1,
                        (Math.random() - 0.5) * 1,
                        Math.random() * 0.5
                    ]}
                    scale={0.01}
                >
                    <meshStandardMaterial color='black' />
                </mesh>
            ))} */}

            
        </>
    );
}
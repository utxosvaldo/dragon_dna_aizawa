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

function every4Color(index){
    if(index%10 == 0){
        return 'blue'
    } else {
        return 'red'
    }
}

const seq =
    'ATGAGCCGTTCCGTGACCTTTTCAAGTCGTAGCGCTGCAATGCCTGGAATTTCTCAGGTCAGGGTCTCAACCGTCTCATCCAGCAGGGGCGTGGGCGGGGGAGCTGGGGTGGGCAGGGCTGATGGATTCGGCTCCTCTAGCTTGTATTCACTGGGCTCCAGCAGTAAACGTGAGAGCCCTATTGTTCGCGGATCATCTTATTCCGTTAGAAGTGGCTTCGGCTATGGTGGGAACTTGAACGCAGGACTCGGAATCGGGCTTCGCTCCGGAGGTATCCAGGAAGTAACTATTAACCCTAATCTGTTGGCACCTCTCAATCTGGAAATCGATCCCACCATGCAAAAAGTTAGGCAGGAGGAGAAGGAACAGATAAAAACTCTGAATAACAAGTTTGCAAGTTTTATAGATAAAGTCAGGTTTCTGGAACAACAAAATAAAATGCTCGAGACCAAATGGTCTCTCCTTCAAGATCAGAAAACAGCAAGGTCCAATATAGCACCTCTCTTCGAGGCATACATCAATAACCTTCGCCGCCAACTTGATGGACTGATGAATGATAAGGGGCGCTTGGAGGGAGAACTGAAAAATATGCAAGATCTTGTGGAAGATTTCAAGAACAAATACGAGGATGAAATCAATAGGAGGACTACAGCAGAGAACGAATTTGTCGTTCTGAAGAAAGACGTGGATGGCGCCTATATGAACAAAGTTGAACTGGAGGCCAAAGTTGACGCCCTTACCGACGAAATCCTGTATGAAGCCGAGCTTCGTGAGCTTCAGGCCCAGATCTCCGACACATCTGTAGTACTCTCTATGGACAATAGCCGTAATCTTGATCTCGACTCAATCATTGCAGAAGTAAAAGCACAATATGAAGACATTGCCAATAGATCCAGAGCTGAGGCTGAGAGTTGGTATCAAAGCAAATTTGAAGCATTGCAAGTTACAGCTGGTAAACATGGGGATGATTTGCGTAACACAAAAAATGAGATTACAGAAATTAACAGGGTCATACAGAGACTTCAGGGGGAGATCGAGAATGCAAAGGCTCAGCGCGCAAAAATGGAGGCCGCAATTGCAGAGGCCGAAGAGAGAGGCGAGCTTGCCGTCAAGGACGCACGCGCCAAACTCGAAGAGCTTGAGGCCGCATTGCAAAAGGCCAAGCAGGATATGGCTCGTCAATTGAGGGAATATCAGGAGCTGATGAACGTGAAGTTGGCTCTGGACATCGAAATCGCAACCTATCGCAAGCTTCTGGAGGGCGAAGAGTCCAGACTTGCCGGCGATGGCGTGGGTTCCGTAAATATATCTATGGTTAGCTCATCTGGTGGAGGATCTTCCGGCTTTCTCGGTGGTGGAGTTAGGGGCGGTTTGGCTCTTGGTGCAGGTATGGGATCCGGAGCACTGGGTTTCAGCAGCGGAGGTTCCACTAAGTCATATACAGTTACAACCACTTCTTCAACTCGTTCCTTTCGTAAA';

const seq2Color = {
    A: "green",
    T: "deepPink",
    G: "blue",
    C: "red"
}

const seq2ColorInverted = {
    A: seq2Color['T'],
    T: seq2Color['A'],
    G: seq2Color['C'],
    C: seq2Color['G']
};

function index2SeqColor(index) {
    return seq2Color[seq[index]]
}
function index2SeqColorInverted(index) {

    return seq2ColorInverted[seq[index]];
}

export default function DNAStrand(){
    const baseASphere = useRef()

    const t = 10 // tiempo en recorrer de un lado a otro
    const n = 200 // segmentos de linea para las helices
    const l = 2 // longitud a recorrer
    const nGroves = 10 // numero de groves 

    const nBases = 10 * nGroves // Number of base pairs total along L

    const r = 0.15
    const omegaStrand = - (2 * Math.PI) * nGroves / l
    const alpha = 0
    const beta = 2.4
    const v = l/n
    const z0 = -0.5

    // rotational velocity of dna strand
    const wZ = 0.7 * (2 * Math.PI * nGroves) / t  ;

    // rotational velocity of bases

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
    const baseGroupA = useRef([])
    const baseGroupB = useRef([]);


    // base length scale and width scale
    const baseLengthScale =  r / 2 ;
    const baseWidthScale = baseLengthScale / 10;

    const vBases = 0.5* l/t

    useFrame((status, delta) => {
        const elapsedTime = status.clock.elapsedTime
        // giramos doble helix
        strandGroup.current.rotation.z = wZ * elapsedTime
        // giramos las bases

        baseGroupA.current.map((baseGroup, index) => {
            const z = z0 + (((index * l) / nBases + vBases * elapsedTime) % l);
            baseGroup.rotation.z = - (2*Math.PI*nGroves*vBases*elapsedTime/l) + wZ * elapsedTime + alpha
            baseGroup.children[0].position.z = z 
        })

        baseGroupB.current.map((baseGroup, index) => {
            const z = z0 + (((index * l) / nBases + vBases * elapsedTime) % l);
            baseGroup.rotation.z =
                -((2 * Math.PI * nGroves * vBases * elapsedTime) / l) +
                wZ * elapsedTime //+ beta;
            baseGroup.children[0].position.z = z;
        });

    })

    const [sphereGeometry, setSphereGeometry] = useState();

    

    return (
        <>
            <sphereGeometry ref={setSphereGeometry} />

            {[...basePairs].map((pair, index) => (
                <group
                    ref={element => (baseGroupA.current[index] = element)}
                    key={index}
                >
                    <mesh
                        geometry={sphereGeometry}
                        position={[
                            (pair[0][0] * 3) / 4 + pair[1][0] / 4,
                            (pair[0][1] * 3) / 4 + pair[1][1] / 4,
                            pair[0][2]
                        ]}
                        scale={[
                            baseWidthScale,
                            baseLengthScale,
                            baseWidthScale
                        ]}
                        rotation={[0, 0, zAngle(pair)]}
                    >
                        <meshStandardMaterial color={index2SeqColor(index)} />
                    </mesh>
                </group>
            ))}

            {[...basePairs].map((pair, index) => (
                <group
                    ref={element => (baseGroupB.current[index] = element)}
                    key={index}
                >
                    <mesh
                        geometry={sphereGeometry}
                        position={[
                            (pair[1][0] * 3) / 4 + pair[0][0] / 4,
                            (pair[1][1] * 3) / 4 + pair[0][1] / 4,
                            pair[0][2]
                        ]}
                        scale={[
                            baseWidthScale,
                            baseLengthScale,
                            baseWidthScale
                        ]}
                        rotation={[0, 0, zAngle(pair) - Math.PI]}
                    >
                        <meshStandardMaterial color={index2SeqColorInverted(index)} />
                    </mesh>
                </group>
            ))}

            <group ref={strandGroup}>
                <Tube
                    args={[
                        new THREE.CatmullRomCurve3(strandBPoints), //path
                        500, // tubular segments
                        0.01, // radius
                        100, //  radial segments
                        // true // closed
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
                        // true // closed
                    ]}
                >
                    <meshNormalMaterial />
                </Tube>
            </group>
        </>
    );
}
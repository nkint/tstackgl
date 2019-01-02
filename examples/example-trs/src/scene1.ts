import { createDrawPointDebug } from '@tstackgl/regl-draw'
import * as tx from '@thi.ng/transducers'
import { createDrawMeshWireframe } from './draw-mesh-wireframe'
import { createBasicMesh, PropsBasicMaterial } from './draw-basic-mesh'
import { pointTowardsMat } from './pointTowards'
import { initScene } from './initScene'
import vec3 from 'gl-vec3'
import mat4 from 'gl-mat4'
import { createDrawMeshNormalLine } from './draw-normal-line'

let loop = { cancel: function() {} }

export function createReglScene1() {
  // canvas init hook
  const init = (canvas: HTMLCanvasElement, __: WebGLRenderingContext) => {
    const { regl, frameCatch, camera, axis, icosphere, cylinder, center, dir } = initScene(canvas)

    const cyinderHalfHeight = 50
    const delta = vec3.dist([0, 0, 0], center)

    const mat = mat4.create()
    const rotationMat = pointTowardsMat(dir)
    const translate = mat4.fromTranslation(mat4.create(), [0, cyinderHalfHeight + delta, 0])
    const scale = mat4.fromScaling(mat4.create(), [1.7, 1, 1.7])
    const rotation = mat4.fromRotation(mat4.create(), 0.66, [0, 1, 0])
    mat4.multiply(mat, mat, rotationMat)
    mat4.multiply(mat, mat, translate)
    mat4.multiply(mat, mat, scale)
    mat4.multiply(mat, mat, rotation)

    cylinder.positions = cylinder.positions.map(pos => {
      return vec3.transformMat4(pos, pos, mat)
    })

    const drawIcosphere = createDrawMeshWireframe(regl, icosphere)
    const drawCylinder = createBasicMesh(regl, cylinder)
    const drawDebug = createDrawPointDebug(regl, 5)
    const drawNormal = createDrawMeshNormalLine(regl, center, dir, 50)

    const props: PropsBasicMaterial = {
      translate: [0, 0, 0],
      scale: [1, 1, 1],
      rotationMat: mat4.create(),

      diffuseColor: [1, 0.2, 0.2],
      ambientColor: [0.1, 0.1, 0.1],
      lightDirection: [100, 0, 0],
    }

    loop = frameCatch(function({}) {
      camera((cameraState: any) => {
        if (!cameraState.dirty) {
          return
        }

        regl.clear({ color: [1, 1, 1, 1] })

        axis.draw()
        drawIcosphere.draw({ color: [0, 0, 0], fogColor: [1, 1, 1], fogDensity: 0.006 })
        drawCylinder.draw(props)

        drawDebug.draw({
          color: [0, 0, 0],
          translate: center,
        })
        drawNormal.draw({
          color: [0, 0, 0],
        })
      })
    })
  }

  const update = () => {}
  return { init, update }
}

if ((module as any).hot) {
  ;(module as any).hot.dispose(() => {
    loop.cancel()
  })
}

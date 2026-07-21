import { useEffect, useRef } from 'react'

const vertexShader = `
  attribute vec2 position;
  void main() { gl_Position = vec4(position, 0.0, 1.0); }
`

const fragmentShader = `
  precision highp float;
  uniform vec2 resolution;
  uniform vec2 pointer;
  uniform float time;

  float band(float value, float width) {
    return smoothstep(width, 0.0, abs(value));
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    vec2 mouse = (pointer * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * 0.32;

    float warp = sin(uv.y * 4.2 - t * 2.0) * 0.18 + cos(uv.x * 3.1 + t) * 0.12;
    float ribbons = band(sin((uv.x + warp) * 5.0 + sin(uv.y * 2.0 + t)), 0.16);
    float rings = band(sin(length(uv - mouse * 0.15) * 10.0 - t * 3.0), 0.13);
    float prism = band(sin((uv.x - uv.y) * 8.0 + t * 1.7), 0.1);

    vec3 acid = vec3(0.76, 1.0, 0.08);
    vec3 orange = vec3(1.0, 0.23, 0.08);
    vec3 violet = vec3(0.42, 0.18, 1.0);
    vec3 cyan = vec3(0.05, 0.95, 0.83);
    vec3 color = mix(violet, orange, smoothstep(-0.8, 0.8, uv.y + warp));
    color = mix(color, acid, ribbons * 0.88);
    color = mix(color, cyan, rings * 0.72);
    color += prism * vec3(0.35, 0.22, 0.5);
    color *= 0.82 + 0.18 * sin(uv.x * 12.0 + uv.y * 7.0 + t);

    gl_FragColor = vec4(color, 1.0);
  }
`

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function ShaderField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl', { alpha: false, antialias: false })
    if (!canvas || !gl) return

    const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader)
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader)
    const program = gl.createProgram()
    if (!vertex || !fragment || !program) return
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.useProgram(program)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const resolution = gl.getUniformLocation(program, 'resolution')
    const pointer = gl.getUniformLocation(program, 'pointer')
    const time = gl.getUniformLocation(program, 'time')
    const mouse = { x: 0.5, y: 0.5 }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio, 1.5)
      canvas.width = Math.floor(canvas.clientWidth * ratio)
      canvas.height = Math.floor(canvas.clientHeight * ratio)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    const move = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect()
      mouse.x = (event.clientX - bounds.left) / bounds.width
      mouse.y = 1 - (event.clientY - bounds.top) / bounds.height
    }
    const render = (now: number) => {
      resize()
      gl.uniform2f(resolution, canvas.width, canvas.height)
      gl.uniform2f(pointer, mouse.x, mouse.y)
      gl.uniform1f(time, reduceMotion ? 0 : now / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (!reduceMotion && !document.hidden) frame = requestAnimationFrame(render)
    }

    canvas.addEventListener('pointermove', move)
    frame = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(frame)
      canvas.removeEventListener('pointermove', move)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
      gl.deleteBuffer(buffer)
    }
  }, [])

  return <canvas className="shader-field" ref={canvasRef} aria-hidden="true" />
}

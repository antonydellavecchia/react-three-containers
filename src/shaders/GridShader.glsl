varying vec4 vUv;
uniform vec4 params;
uniform float time;

// adapted from https://thebookofshaders.com/edit.php#10/ikeda-simple-grid.frag
 
float grid(vec2 st, float res)
{
  float motion = fract(time);
  vec2 grid = fract(st*res);
  return (step(res, grid.x) * step(res, grid.y));
}
 
void main()
{
  vec2 grid_uv = vec2(vUv.x * 0.5, vUv.y * 0.5 + fract(time) * 10.0); //params.x; // scale
  float x = grid(grid_uv, 0.2);//params.y); // resolution
  gl_FragColor.rgb = vec3(0.5, 0.4, 0.1) * (1.0 - x);  
  gl_FragColor.a = 1.0;
} 

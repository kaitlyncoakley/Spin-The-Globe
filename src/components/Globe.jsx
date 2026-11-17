import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const textureUrl = 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg';
export default function Globe({ target }) {
  const host = useRef(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = host.current;
    let renderer, frame, disposed = false, marker;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);
    } catch { setFailed(true); return; }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.z = 4.8;
    scene.add(new THREE.AmbientLight(0xffffff, 1.25));
    const sunlight = new THREE.DirectionalLight(0xffffff, 2.1);
    sunlight.position.set(-3, 2, 5); scene.add(sunlight);
    const group = new THREE.Group(); scene.add(group);
    const geometry = new THREE.SphereGeometry(1.25, 64, 64);
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 9 });
    const earth = new THREE.Mesh(geometry, material); group.add(earth);
    const loader = new THREE.TextureLoader();
    loader.load(textureUrl, texture => { if (disposed) { texture.dispose(); return; } texture.colorSpace = THREE.SRGBColorSpace; material.map = texture; material.needsUpdate = true; }, undefined, () => { if (!disposed) setFailed(true); });
    const haloGeometry = new THREE.SphereGeometry(1.29, 64, 64);
    const haloMaterial = new THREE.MeshBasicMaterial({ color: 0xaed5e5, transparent: true, opacity: 0.09, side: THREE.BackSide });
    group.add(new THREE.Mesh(haloGeometry, haloMaterial));
    group.rotation.y = -0.5; group.rotation.z = 0.1;
    if(target){const lat=THREE.MathUtils.degToRad(target[0]),lon=THREE.MathUtils.degToRad(target[1]);marker=new THREE.Mesh(new THREE.SphereGeometry(.025,16,16),new THREE.MeshBasicMaterial({color:0xa64d70}));marker.position.set(1.26*Math.cos(lat)*Math.cos(lon),1.26*Math.sin(lat),-1.26*Math.cos(lat)*Math.sin(lon));marker.visible=false;group.add(marker);}
    const startTime=performance.now(), startY=group.rotation.y, targetY=target ? -Math.PI/2-THREE.MathUtils.degToRad(target[1]):0, targetX=target ? THREE.MathUtils.degToRad(target[0]):0;
    let dragging = false, lastX = 0, lastY = 0;
    const down = e => { if(target) return; dragging = true; lastX = e.clientX; lastY = e.clientY; renderer.domElement.setPointerCapture(e.pointerId); };
    const move = e => { if (!dragging) return; group.rotation.y += (e.clientX-lastX)*0.008; group.rotation.x = Math.max(-0.9, Math.min(0.9, group.rotation.x+(e.clientY-lastY)*0.006)); lastX=e.clientX; lastY=e.clientY; };
    const up = () => { dragging = false; };
    const canvas = renderer.domElement;
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    const resize = () => { const size = el.clientWidth; renderer.setSize(size, size); camera.aspect = 1; camera.updateProjectionMatrix(); };
    const observer = new ResizeObserver(resize); observer.observe(el); resize();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let previous = 0;
    const animate = time => { frame=requestAnimationFrame(animate); if(target){const t=reduced.matches?1:Math.min((time-startTime)/4000,1);const ease=t*t*(3-2*t); marker.visible=t>=1;group.rotation.y=startY+(targetY+Math.PI*4-startY)*ease;group.rotation.x=targetX*ease;group.rotation.z=0;}else if (!dragging && !reduced.matches && previous) group.rotation.y += Math.min((time-previous)/1000, 0.1)*0.09; previous=time; renderer.render(scene,camera); };
    frame=requestAnimationFrame(animate);
    return () => { disposed=true; cancelAnimationFrame(frame); observer.disconnect(); canvas.removeEventListener('pointerdown',down); canvas.removeEventListener('pointermove',move); canvas.removeEventListener('pointerup',up); canvas.removeEventListener('pointercancel',up); marker?.geometry.dispose(); marker?.material.dispose(); geometry.dispose(); material.map?.dispose(); material.dispose(); haloGeometry.dispose(); haloMaterial.dispose(); renderer.dispose(); canvas.remove(); };
  }, [target]);
  return <div className="globe-wrap"><div ref={host} className={'globe '+(failed?'globe-failed':'')} aria-label={target ? 'Globe showing your destination' : 'Interactive globe of Earth. Drag to rotate.'} role="img" />{failed && <div className="globe-fallback" role="img" aria-label="Earth viewed from space"/>}</div>;
}

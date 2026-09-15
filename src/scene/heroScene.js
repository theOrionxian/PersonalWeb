import * as THREE from 'three';

// A single icosahedron "gem" in the hero frame, with neuron-style
// activation pulses travelling its edges. It continuously tilts to
// follow the cursor wherever it is on the page, and when you hover
// and swipe across it, it spins like a trackball in the direction of
// that stroke, gradually settling once you stop.
export function initHeroScene() {
  var container = document.querySelector('.hero-frame');
  var canvas = document.getElementById('hero-canvas');
  if (!container || !canvas) return;

  var css = getComputedStyle(document.documentElement);
  var accentColor = new THREE.Color(css.getPropertyValue('--accent').trim() || '#33447A');
  var signalColor = new THREE.Color(css.getPropertyValue('--signal').trim() || '#C2703C');

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 4.4);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  function size(){
    var w = container.clientWidth, h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  size();

  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  var key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(3, 4, 5);
  scene.add(key);
  var rim = new THREE.DirectionalLight(accentColor, 0.5);
  rim.position.set(-4, -2, -3);
  scene.add(rim);

  var group = new THREE.Group();
  scene.add(group);

  var geo = new THREE.IcosahedronGeometry(1.3, 1);
  var solid = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color: 0xEDEBE2, flatShading: true, roughness: 0.55, metalness: 0.12
  }));
  group.add(solid);
  var edgesGeo = new THREE.EdgesGeometry(geo);
  var wire = new THREE.LineSegments(edgesGeo, new THREE.LineBasicMaterial({
    color: accentColor, transparent: true, opacity: 0.55
  }));
  group.add(wire);

  var pos = edgesGeo.attributes.position;
  var edgePairs = [];
  for (var i = 0; i < pos.count; i += 2) {
    edgePairs.push([
      new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)),
      new THREE.Vector3(pos.getX(i + 1), pos.getY(i + 1), pos.getZ(i + 1))
    ]);
  }
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pulseGeo = new THREE.SphereGeometry(0.045, 8, 8);
  var pulses = [];
  var pulseCount = reduced ? 0 : 6;
  for (var p = 0; p < pulseCount; p++) {
    var mat = new THREE.MeshBasicMaterial({ color: signalColor, transparent: true, opacity: 0 });
    var mesh = new THREE.Mesh(pulseGeo, mat);
    group.add(mesh);
    pulses.push({
      mesh: mesh,
      edge: edgePairs[Math.floor(Math.random() * edgePairs.length)],
      t: Math.random(),
      speed: 0.006 + Math.random() * 0.007
    });
  }

  // ambient: the gem always tilts toward wherever the cursor is on the page
  var mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  // hover: swiping across the frame spins it like a trackball, in the
  // direction of the stroke, decaying after you stop
  var lastLocal = null;
  var vel = { x: 0, y: 0 };
  var STROKE_SENSITIVITY = 0.0026, MAX_DELTA = 40;
  container.addEventListener('pointerenter', function () { lastLocal = null; });
  container.addEventListener('pointerleave', function () { lastLocal = null; });
  container.addEventListener('pointermove', function (e) {
    var rect = container.getBoundingClientRect();
    var lx = e.clientX - rect.left, ly = e.clientY - rect.top;
    if (lastLocal) {
      var dx = Math.max(-MAX_DELTA, Math.min(MAX_DELTA, lx - lastLocal.x));
      var dy = Math.max(-MAX_DELTA, Math.min(MAX_DELTA, ly - lastLocal.y));
      vel.y += dx * STROKE_SENSITIVITY;
      vel.x += dy * STROKE_SENSITIVITY;
    }
    lastLocal = { x: lx, y: ly };
  });

  if (reduced) {
    group.rotation.set(0.28, -0.4, 0);
    renderer.render(scene, camera);
  } else {
    var followX = 0, followZ = 0, spin = { x: 0, y: 0 };
    (function animate(){
      requestAnimationFrame(animate);

      followX += ((-mouse.y) * 0.22 - followX) * 0.05;
      followZ += (mouse.x * 0.16 - followZ) * 0.05;

      vel.x *= 0.94;
      vel.y *= 0.94;
      spin.x += vel.x;
      spin.y += vel.y;

      group.rotation.x = 0.28 + followX + spin.x;
      group.rotation.y = spin.y;
      group.rotation.z = followZ;

      pulses.forEach(function (pl) {
        pl.t += pl.speed;
        if (pl.t >= 1) { pl.t = 0; pl.edge = edgePairs[Math.floor(Math.random() * edgePairs.length)]; }
        pl.mesh.position.lerpVectors(pl.edge[0], pl.edge[1], pl.t);
        pl.mesh.material.opacity = Math.sin(Math.PI * pl.t) * 0.9;
      });

      renderer.render(scene, camera);
    })();
  }

  window.addEventListener('resize', size);
}

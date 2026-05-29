import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const PRESETS = [
  { id: 1, title: "Машина", model: "models/Range Rover.glb" },
  { id: 3, title: "Дерево", model: "models/Big Tree.glb" },
  { id: 4, title: "Пальма", model: "models/Palm_Tree.glb" },
  { id: 5, title: "Машина + Дерево", models: [
    { title: "Машина", model: "models/Range Rover.glb" },
    { title: "Дерево", model: "models/Big Tree.glb" },
  ]}
];

let camera, controls;
let scene, renderer;
let loadedModels = [];

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const userId = params.get('user');

let modelData = null;
let title = '';
let toRender = [];

if (id) {
  modelData = PRESETS.find(m => m.id === Number(id));
  title = modelData?.title || '';
  if (modelData?.models) {
    toRender = modelData.models.map(x => ({ model: x.model }));
  } else if (modelData?.model) {
    toRender = [{ model: modelData.model }];
  }
  renderModel();
} else if (userId) {
  getModelByIdFromDB(userId).then(userModel => {
    if (!userModel) {
      document.getElementById('model-title').textContent = "Модель не найдена";
      return;
    }
    title = userModel.title;
    toRender = [{ buffer: userModel.buffer, filename: userModel.filename }];
    renderModel();
  });
} else {
  document.getElementById('model-title').textContent = 'Нет данных';
}

function renderModel() {
  document.getElementById('model-title').textContent = title || "3D модель";
  const canvas = document.getElementById('viewer-canvas');
  
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f0f1a);

  const gridHelper = new THREE.GridHelper(20, 40, 0x333355, 0x222244);
  scene.add(gridHelper);

  camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(3, 4, 6);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enableZoom = true;
  controls.minDistance = 2;
  controls.maxDistance = 50;
  controls.target.set(0, 0.5, 0);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(8, 15, 10);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 50;
  dirLight.shadow.camera.left = -15;
  dirLight.shadow.camera.right = 15;
  dirLight.shadow.camera.top = 15;
  dirLight.shadow.camera.bottom = -15;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0x667eea, 0.4);
  fillLight.position.set(-5, 5, -5);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xe94560, 0.3);
  rimLight.position.set(0, 3, -8);
  scene.add(rimLight);

  const loader = new GLTFLoader();
  let loadedCount = 0;
  let hasTimedOut = false;
  const gap = 1.8;

  setTimeout(() => {
    if (loadedCount === 0 && !hasTimedOut) {
      hasTimedOut = true;
      const fallbackGeo = new THREE.ConeGeometry(0.4, 1.5, 8);
      const fallbackMat = new THREE.MeshStandardMaterial({ color: 0x4a7c4e });
      const fallback = new THREE.Mesh(fallbackGeo, fallbackMat);
      fallback.position.y = 0.75;
      fallback.castShadow = true;
      scene.add(fallback);
      centerCameraOnModels();
    }
  }, 5000);

  function normalizeModel(model) {
    model.updateMatrixWorld(true);
    
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const min = box.min;
    
    model.position.x = -center.x;
    model.position.z = -center.z;
    model.position.y = -min.y;
    
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const scale = 2 / maxDim;
      model.scale.set(scale, scale, scale);
    }
    
    model.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  function onLoad(model, idx) {
    if (hasTimedOut) return;
    loadedCount++;
    normalizeModel(model);
    if (toRender.length === 2) {
      model.position.x = idx === 0 ? -gap : gap;
    }
    scene.add(model);
    loadedModels.push(model);
    if (loadedCount === toRender.length) {
      centerCameraOnModels();
    }
  }

  if (toRender.length === 2) {
    toRender.forEach((item, idx) => {
      loader.load(item.model, gltf => onLoad(gltf.scene, idx));
    });
  } else if (toRender.length === 1) {
    const item = toRender[0];
    if (item.model) {
      loader.load(item.model, gltf => onLoad(gltf.scene, 0));
    } else if (item.buffer) {
      loader.parse(item.buffer, '', gltf => onLoad(gltf.scene, 0));
    }
  }

  function centerCameraOnModels() {
    if (loadedModels.length === 0) return;
    const box = new THREE.Box3();
    loadedModels.forEach(m => box.expandByObject(m));
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    controls.target.copy(center);
    const distance = Math.max(size.x, size.y, size.z) * 2.5;
    camera.position.set(distance * 0.6, distance * 0.8, distance);
    controls.update();
  }

  document.getElementById('zoom-in').onclick = () => {
    const direction = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
    camera.position.addScaledVector(direction, -0.5);
    controls.update();
  };

  document.getElementById('zoom-out').onclick = () => {
    const direction = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
    camera.position.addScaledVector(direction, 0.5);
    controls.update();
  };

  const distance = () => camera.position.distanceTo(controls.target);

  function setCameraDirection(dir) {
    const d = distance();
    const targetY = controls.target.y;
    let pos = new THREE.Vector3();
    
    switch(dir) {
      case "top":
        pos.set(0, d, 0.01);
        break;
      case "front":
        pos.set(0, targetY, d);
        break;
      case "back":
        pos.set(0, targetY, -d);
        break;
      case "left":
        pos.set(-d, targetY, 0);
        break;
      case "right":
        pos.set(d, targetY, 0);
        break;
    }
    
    camera.position.copy(pos);
    controls.update();
    
    document.querySelectorAll('.ctrl-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('view-' + dir)?.classList.add('active');
  }

  document.getElementById('view-top').onclick = () => setCameraDirection('top');
  document.getElementById('view-front').onclick = () => setCameraDirection('front');
  document.getElementById('view-back').onclick = () => setCameraDirection('back');
  document.getElementById('view-left').onclick = () => setCameraDirection('left');
  document.getElementById('view-right').onclick = () => setCameraDirection('right');
  document.getElementById('view-reset').onclick = () => {
    camera.position.set(3, 4, 6);
    controls.target.set(0, 0.5, 0);
    controls.update();
    document.querySelectorAll('.ctrl-btn').forEach(btn => btn.classList.remove('active'));
  };

  const hint = document.getElementById('hint');
  setTimeout(() => hint.classList.add('show'), 500);
  setTimeout(() => hint.classList.remove('show'), 3000);

  function resizeRenderer() {
    const wrap = document.querySelector('.viewer-canvas-wrap');
    const width = wrap.clientWidth;
    const height = wrap.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    resizeRenderer();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', resizeRenderer);
}
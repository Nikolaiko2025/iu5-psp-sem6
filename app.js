import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const PRESETS = [
  { id: 1, title: "Машина", model: "models/Range Rover.glb" },
  { id: 3, title: "Дерево", model: "models/Big Tree.glb" },
  { id: 4, title: "Пальма", model: "models/Palm_Tree.glb" },
  { id: 5, title: "Машина + Дерево", models: [
    { model: "models/Range Rover.glb" },
    { model: "models/Big Tree.glb" },
  ]}
];

let userModels = [];
const cardList = document.getElementById('card-list');

getAllModelsFromDB().then(models => {
  userModels = models;
  renderCards();
});

function renderCards() {
  cardList.innerHTML = '';
  PRESETS.forEach(model => addCard(model, false, model.id));
  userModels.forEach(model => addCard(model, true, model.id));
}

function addCard(model, isUser, userId) {
  const card = document.createElement('div');
  card.className = 'card';
  card.tabIndex = 0;

  const previewCanvas = document.createElement('canvas');
  previewCanvas.className = 'preview-canvas';
  previewCanvas.width = 280;
  previewCanvas.height = 280;
  card.appendChild(previewCanvas);

  renderPreviewModelToCanvas(model, isUser, previewCanvas);

  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = model.title || 'Загруженная модель';
  card.appendChild(title);

  if (isUser) {
    const meta = document.createElement('div');
    meta.className = 'card-meta';
    meta.textContent = 'Загружено вами';
    card.appendChild(meta);
  }

  card.onclick = () => {
    if (isUser) {
      window.location.href = `detail.html?user=${userId}`;
    } else {
      window.location.href = `detail.html?id=${model.id}`;
    }
  };

  cardList.appendChild(card);
}

function renderPreviewModelToCanvas(model, isUser, canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(canvas.width, canvas.height, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
  camera.position.set(2, 2, 3);
  camera.lookAt(0, 0.3, 0);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(3, 5, 4);
  scene.add(dirLight);
  
  const fillLight = new THREE.DirectionalLight(0x667eea, 0.3);
  fillLight.position.set(-3, 2, -2);
  scene.add(fillLight);

  const loader = new GLTFLoader();

  function normalizeModel(obj) {
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const min = box.min;
    
    obj.position.x = -center.x;
    obj.position.z = -center.z;
    obj.position.y = -min.y;
    
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const scale = 1.2 / maxDim;
      obj.scale.set(scale, scale, scale);
    }
  }

  function doRender(obj) {
    normalizeModel(obj);
    scene.add(obj);
    renderer.render(scene, camera);
  }

  function drawFallback() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#667eea";
    ctx.font = "bold 48px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("3D", canvas.width / 2, canvas.height / 2);
  }

  if (isUser && model.buffer) {
    loader.parse(model.buffer, '', gltf => doRender(gltf.scene), () => drawFallback());
  } else if (model.model) {
    loader.load(model.model, gltf => doRender(gltf.scene), undefined, () => drawFallback());
  } else if (model.models && Array.isArray(model.models)) {
    const gap = 0.6;
    let loaded = 0;
    model.models.forEach((m, idx) => {
      loader.load(m.model, gltf => {
        const obj = gltf.scene;
        normalizeModel(obj);
        obj.position.x = idx === 0 ? -gap : gap;
        scene.add(obj);
        loaded++;
        if (loaded === 2) renderer.render(scene, camera);
      }, undefined, () => {
        loaded++;
        if (loaded === 2) renderer.render(scene, camera);
      });
    });
  } else {
    drawFallback();
  }
}

const uploadInput = document.getElementById('uploadModel');
uploadInput.addEventListener('change', (event) => {
  const files = Array.from(event.target.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const modelObj = {
        title: file.name.replace('.glb', ''),
        buffer: e.target.result,
        filename: file.name
      };
      addModelToDB(modelObj).then(id => {
        modelObj.id = id;
        userModels.push(modelObj);
        renderCards();
      });
    };
    reader.readAsArrayBuffer(file);
  });
  event.target.value = '';
});
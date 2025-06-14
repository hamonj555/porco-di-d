/**
 * Questo script sostituisce il componente CameraRecorder esistente
 * con la versione che utilizza Storage Access Framework (SAF)
 */

const fs = require('fs');
const path = require('path');

// Percorsi dei file
const safComponentPath = path.join(__dirname, 'components', 'CameraRecorder_SAF.tsx');
const componentPath = path.join(__dirname, 'components', 'CameraRecorder.tsx');
const backupPath = path.join(__dirname, 'components', 'CameraRecorder.tsx.backup');

// Verifica che i file esistano
if (!fs.existsSync(safComponentPath)) {
  console.error('Errore: File CameraRecorder_SAF.tsx non trovato');
  process.exit(1);
}

// Crea backup se non esiste già
if (!fs.existsSync(backupPath) && fs.existsSync(componentPath)) {
  console.log('Creazione backup di CameraRecorder.tsx...');
  fs.copyFileSync(componentPath, backupPath);
  console.log('Backup creato con successo');
}

// Sostituisci il file
console.log('Applicazione della soluzione SAF...');
fs.copyFileSync(safComponentPath, componentPath);
console.log('Soluzione SAF applicata con successo');
console.log('');
console.log('Per testare la soluzione:');
console.log('1. Esegui `expo start`');
console.log('2. Registra un video');
console.log('3. Premi "Scegli Cartella" per salvare il video in una posizione specifica');
console.log('');
console.log('Per tornare alla versione precedente, esegui:');
console.log('node -e "require(\'fs\').copyFileSync(\'./components/CameraRecorder.tsx.backup\', \'./components/CameraRecorder.tsx\')"');

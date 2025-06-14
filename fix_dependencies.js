const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Percorso del progetto
const projectPath = path.resolve(__dirname);

// Funzione per eseguire un comando e mostrare l'output
function runCommand(command) {
  console.log(`\n\nEseguo: ${command}\n`);
  try {
    execSync(command, { stdio: 'inherit', cwd: projectPath });
    return true;
  } catch (error) {
    console.error(`Errore durante l'esecuzione di: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Funzione principale
async function main() {
  console.log('🚀 Avvio del processo di riparazione delle dipendenze...');
  
  // Elimina node_modules
  console.log('\n1. Elimina node_modules...');
  try {
    if (fs.existsSync(path.join(projectPath, 'node_modules'))) {
      if (process.platform === 'win32') {
        runCommand('rmdir /s /q node_modules');
      } else {
        runCommand('rm -rf node_modules');
      }
    }
  } catch (error) {
    console.error('Errore nella rimozione di node_modules:', error);
  }
  
  // Cancella la cache di npm
  console.log('\n2. Pulizia della cache npm...');
  runCommand('npm cache clean --force');
  
  // Reinstalla le dipendenze
  console.log('\n3. Reinstallazione delle dipendenze...');
  const installSuccess = runCommand('npm install --force');
  
  // Installa specificamente expo-camera
  if (installSuccess) {
    console.log('\n4. Installazione di expo-camera...');
    runCommand('npx expo install expo-camera --force');
  }
  
  console.log('\n✅ Processo di riparazione completato!');
  console.log('\nPer avviare l\'app:');
  console.log('  npx expo start');
}

// Esegui il programma principale
main().catch(console.error);

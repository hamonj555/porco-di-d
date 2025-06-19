// scripts/testApi.js
import axios from 'axios';

const BASE = 'https://mocky-1-5c18b152b1ae.herokuapp.com';

async function ping() {
  try {
    const res = await axios.get(`${BASE}/ping`);
    console.log('PING status:', res.status, res.data);
  } catch (e) {
    console.error('PING failed:', e.response?.status, e.message);
    process.exit(1);
  }
}

async function listEffects() {
  try {
    const res = await axios.get(`${BASE}/effects`);
    console.log('EFFECTS:', res.data.effects.map(e => e.id).join(', '));
  } catch (e) {
    console.error('LIST EFFECTS failed:', e.response?.status, e.message);
    process.exit(1);
  }
}

async function runAll() {
  await ping();
  await listEffects();
  console.log('✅ Tutti i test OK');
  process.exit(0);
}

runAll();

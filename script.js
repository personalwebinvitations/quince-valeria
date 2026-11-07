
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true });
  const targetDate = new Date(document.body.getAttribute('data-target-date') || '2027-12-20T17:00').getTime();
  setInterval(() => {
    const diff = targetDate - new Date().getTime();
    if (diff <= 0) return;
    document.getElementById('days').innerText = String(Math.floor(diff / 86400000)).padStart(2, '0');
    document.getElementById('hours').innerText = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    document.getElementById('minutes').innerText = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    document.getElementById('seconds').innerText = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  }, 1000);

  const btnMusic = document.getElementById('musicToggleBtn');
  const bgAudio = document.getElementById('bgAudio');
  if (btnMusic && bgAudio) {
    let play = false;
    document.addEventListener('click', () => { bgAudio.play().then(() => play = true).catch(()=>{}); }, { once: true });
    btnMusic.addEventListener('click', (e) => {
      e.stopPropagation();
      if (play) { bgAudio.pause(); play = false; }
      else { bgAudio.play().then(() => play = true); }
    });
  }

  const form = document.getElementById('rsvpForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const webhook = form.getAttribute('data-webhook');
      const submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      const data = {
        nombre: form.querySelector('#nombre').value,
        asistencia: form.querySelector('input[name="asistencia"]:checked').value,
        adultos: form.querySelector('#adultos') ? form.querySelector('#adultos').value : 1,
        ninos: form.querySelector('#ninos') ? form.querySelector('#ninos').value : 0,
        telefono: form.querySelector('#telefono').value,
        alergias: form.querySelector('#alergias').value,
        mensaje: form.querySelector('#mensaje').value,
        timestamp: new Date().toISOString()
      };
      try {
        if (webhook && webhook.startsWith('http')) {
          await fetch(webhook, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
        }
        if (data.asistencia === 'Sí' && typeof confetti === 'function') confetti({ particleCount: 100, spread: 70 });
        form.style.display = 'none';
        document.getElementById('rsvpSuccess').style.display = 'block';
      } catch(err) {
        alert('Error al enviar: ' + err.message);
        submitBtn.disabled = false;
      }
    });
  }
});
function copyClabe() {
  const el = document.getElementById('clabeVal');
  if (el) navigator.clipboard.writeText(el.innerText).then(() => alert('¡CLABE copiada!'));
}

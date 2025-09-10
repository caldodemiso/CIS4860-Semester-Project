<!-- put this as a real file: partials.js -->
<script>
(async function () {
  // 1) include the partial
  const mount = document.querySelector('[data-include="deliverables.partial.html"]');
  if (mount) {
    const html = await fetch('deliverables.partial.html').then(r => r.text());
    mount.outerHTML = html; // replace placeholder with real section
  }

  // 2) after it’s in the DOM, wire up filtering (wait a tick)
  requestAnimationFrame(() => {
    const select = document.getElementById('typeFilter');
    const tbody  = document.getElementById('deliverables-body');
    if (!select || !tbody) return;

    const rows = Array.from(tbody.querySelectorAll('tr'));
    // Optional: render simple mobile cards if your template hides tables on small screens
    const tableWrap = document.querySelector('.table-wrap');
    const cardsWrap = document.createElement('div');
    cardsWrap.className = 'cards'; // your template can style this if desired
    tableWrap && tableWrap.after(cardsWrap);

    function render(type='all'){
      rows.forEach(r=>{
        const t = r.getAttribute('data-type');
        r.style.display = (type==='all'||t===type)?'table-row':'none';
      });

      // cards (inherit default styles; or style .cards/.card in your CSS if you want)
      if (!tableWrap) return;
      cardsWrap.innerHTML='';
      rows.forEach(r=>{
        const visible = (type==='all'||r.getAttribute('data-type')===type);
        if(!visible) return;
        const name = r.querySelector('.name')?.textContent?.trim() || '';
        const typeTxt = r.querySelector('.badge')?.textContent?.trim() || '';
        const smart = r.children[2]?.innerHTML || '';
        const dod = r.children[3]?.innerHTML || '';
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
          <h3>${name}</h3>
          <p><strong>Type:</strong> ${typeTxt}</p>
          <p><strong>SMART:</strong> ${smart}</p>
          <div><strong>Definition of Done:</strong> ${dod}</div>
        `;
        cardsWrap.appendChild(card);
      });
    }

    select.addEventListener('change', e => render(e.target.value));
    render('all');
  });
})();
</script>

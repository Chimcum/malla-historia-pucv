let malla = [];
let ramosAprobados = JSON.parse(localStorage.getItem('ramosAprobados')) || [];

fetch('malla.json')
  .then(response => response.json())
  .then(data => {
    malla = data;
    renderMalla();
  });

function toggleRamo(codigo) {
  if (ramosAprobados.includes(codigo)) {
    ramosAprobados = ramosAprobados.filter(c => c !== codigo);
  } else {
    ramosAprobados.push(codigo);
  }
  localStorage.setItem('ramosAprobados', JSON.stringify(ramosAprobados));
  renderMalla();
}

function renderMalla() {
  const contenedor = document.getElementById('malla');
  contenedor.innerHTML = '';

  let creditosTotales = 0;

  for (let semestre = 1; semestre <= 10; semestre++) {
    const divSem = document.createElement('div');
    divSem.className = 'semestre';
    divSem.innerHTML = `<h2>Semestre ${semestre}</h2>`;

    malla.filter(ramo => ramo.semestre === semestre).forEach(ramo => {
      const div = document.createElement('div');
      div.className = 'ramo';

      const desbloqueado = ramo.prerrequisitos.every(pr => ramosAprobados.includes(pr));

      if (ramosAprobados.includes(ramo.codigo)) {
        div.classList.add('aprobado');
        creditosTotales += ramo.creditos;
      } else if (desbloqueado) {
        div.classList.add('desbloqueado');
      } else {
        div.classList.add('bloqueado');
      }

      div.innerText = `${ramo.codigo}\n${ramo.nombre}\n${ramo.creditos} créditos`;
      div.onclick = () => {
        if (desbloqueado || ramosAprobados.includes(ramo.codigo)) {
          toggleRamo(ramo.codigo);
        }
      };

      divSem.appendChild(div);
    });

    contenedor.appendChild(divSem);
  }

  document.getElementById('creditos').innerText = `Créditos aprobados: ${creditosTotales}`;
}

function addRow() {
  const table = document.getElementById('dataTable');
  const row = table.insertRow();
  for (let i = 0; i < 3; i++) {
    const cell = row.insertCell();
    const input = document.createElement('input');
    input.type = 'number';
    if (i === 2){
    input.step = '0.1';
    }
    else{
    input.step = '1'
    }
    if (i === 0) {
      input.min = '0';
      input.max = '360';
    }
    cell.appendChild(input);
  }
}

async function generateMap() {
  const rows = document.querySelectorAll('#dataTable tr');
  const data = [];

  rows.forEach((row, index) => {
    if (index === 0) return; // skip header
    const inputs = row.querySelectorAll('input');
    const angle = inputs[0].value;
    const distance = inputs[1].value;
    const dose = inputs[2].value;
    if (angle && distance && dose) {
      data.push({ angle, distance, dose });
    }
  });

  const response = await fetch('/generate_map', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  document.getElementById('doseMap').src = `data:image/png;base64,${result.image}`;
}

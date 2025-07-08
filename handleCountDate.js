function formatDateToInput(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Definir data inicial (25 do mês anterior)
function setDefaultDates() {
    const today = new Date();

    // Data final = hoje
    const endDate = formatDateToInput(today);
    document.getElementById("endDate").value = endDate;

    // Data inicial = 25 do mês anterior
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 25);
    const startDate = formatDateToInput(start);
    document.getElementById("startDate").value = startDate;
}

document.addEventListener("DOMContentLoaded", setDefaultDates);

document.getElementById("calcularBtn").addEventListener("click", function () {
    const startDateInput = document.getElementById("startDate").value;
    const endDateInput = document.getElementById("endDate").value;
    const incluirInicio = document.getElementById("incluirInicio").checked;
    const planRadio = document.querySelector('input[name="plan"]:checked');
    const output = document.getElementById("output");

    if (!startDateInput || !endDateInput) {
        output.textContent = "Por favor, preencha as duas datas.";
        return;
    }

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    if (startDate > endDate) {
        output.textContent = "A data inicial deve ser anterior ou igual à final.";
        return;
    }

    if (!planRadio) {
        output.textContent = "Por favor, selecione um plano.";
        return;
    }

    const dailyRate = parseFloat(planRadio.value);
    const diffTime = endDate - startDate;
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24) - 1);

    if (incluirInicio) {
        diffDays += 1;
    }

    const total = diffDays * dailyRate;

    const formattedTotal = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    output.textContent = `Período: ${diffDays} dia(s) • Valor total: ${formattedTotal}`;
});


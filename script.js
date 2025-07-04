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
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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

function gerarTabelaVencimentos() {
    const corpoTabela = document.getElementById("tabelaVencimentos");
    corpoTabela.innerHTML = "";

    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth();

    const datasAnteriores = [20, 25].map(dia => new Date(anoAtual, mesAtual - 1, dia));
    const datasAtuais = [5, 10, 15, 20, 25].map(dia => new Date(anoAtual, mesAtual, dia));
    const todasDatas = [...datasAnteriores, ...datasAtuais];

    // função para pular fim de semana
    function pularFimDeSemana(data) {
        const diaSemana = data.getDay(); // 0 = domingo, 6 = sábado
        if (diaSemana === 6) data.setDate(data.getDate() + 2); // sábado → segunda
        else if (diaSemana === 0) data.setDate(data.getDate() + 1); // domingo → segunda
        return data;
    }

    todasDatas.forEach(dataVenc => {
        let dataBloqueio = new Date(dataVenc);
        dataBloqueio.setDate(dataBloqueio.getDate() + 15);
        dataBloqueio = pularFimDeSemana(dataBloqueio);

        let dataMax = new Date(dataBloqueio);
        dataMax.setDate(dataMax.getDate() + 6);
        dataMax = pularFimDeSemana(dataMax);

        const formatar = data =>
            data.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

        const linha = `
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc;">${formatar(dataVenc)}</td>
          <td style="padding: 10px; border: 1px solid #ccc;">${formatar(dataBloqueio)}</td>
          <td style="padding: 10px; border: 1px solid #ccc;">${formatar(dataMax)}</td>
        </tr>
      `;

        corpoTabela.innerHTML += linha;
    });
}

document.addEventListener("DOMContentLoaded", gerarTabelaVencimentos);
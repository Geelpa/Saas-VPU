function gerarTabelaVencimentos() {
    const corpoTabela = document.getElementById("tabelaVencimentos");
    corpoTabela.innerHTML = "";

    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth();

    const feriadosFixos = [
        "01-01", "21-04", "01-05", "07-09", "12-10", "02-11", "15-11", "25-12"
    ];

    function isFeriado(data) {
        const dia = data.getDate().toString().padStart(2, "0");
        const mes = (data.getMonth() + 1).toString().padStart(2, "0");
        const chave = `${dia}-${mes}`;
        return feriadosFixos.includes(chave);
    }

    function pularNaoUteis(data, ignorarSexta = false) {
        while (
            data.getDay() === 0 || // domingo
            data.getDay() === 6 || // sábado
            (ignorarSexta && data.getDay() === 5) || // sexta-feira (bloqueio)
            isFeriado(data)
        ) {
            data.setDate(data.getDate() + 1);
        }
        return data;
    }

    const diasVencimento = [20, 25]; // mês anterior
    const diasVencimentoAtual = [5, 10, 15, 20, 25]; // mês atual

    const datasAnteriores = diasVencimento.map(dia => new Date(anoAtual, mesAtual - 1, dia));
    const datasAtuais = diasVencimentoAtual.map(dia => new Date(anoAtual, mesAtual, dia));
    const todasDatas = [...datasAnteriores, ...datasAtuais];

    todasDatas.forEach(vencimentoOriginal => {
        // Ajustar vencimento para próximo dia útil
        let dataVenc = new Date(vencimentoOriginal);
        dataVenc = pularNaoUteis(dataVenc);

        // Bloqueio = +15 dias (sem cair em sexta/sábado/domingo/feriado)
        let dataBloqueio = new Date(dataVenc);
        dataBloqueio.setDate(dataBloqueio.getDate() + 15);
        dataBloqueio = pularNaoUteis(dataBloqueio, true); // ignora sexta

        // Liberação máxima = exatamente +7 dias, sem ajuste
        let dataMax = new Date(dataBloqueio);
        dataMax.setDate(dataMax.getDate() + 6);

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
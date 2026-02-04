function gerarTabelaVencimentos() {
    const corpoTabela = document.getElementById("tabelaVencimentos");
    corpoTabela.innerHTML = "";

    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth();

    // Feriados fixos (DD-MM)
    const feriadosFixos = [
        "01-01", "21-04", "01-05", "07-09",
        "12-10", "02-11", "15-11", "25-12"
    ];

    function isFeriado(data) {
        const dia = data.getDate().toString().padStart(2, "0");
        const mes = (data.getMonth() + 1).toString().padStart(2, "0");
        return feriadosFixos.includes(`${dia}-${mes}`);
    }

    function isDiaProtegido(data, protegerSexta = false) {
        const diaSemana = data.getDay();
        return (
            diaSemana === 0 || // domingo
            diaSemana === 6 || // sábado
            (protegerSexta && diaSemana === 5) || // sexta
            isFeriado(data)
        );
    }

    function proximoDiaPermitido(data, protegerSexta = false) {
        const novaData = new Date(data);
        while (isDiaProtegido(novaData, protegerSexta)) {
            novaData.setDate(novaData.getDate() + 1);
        }
        return novaData;
    }

    // 🔹 Dias de vencimento configuráveis
    const diasVencimentoMesAnterior = [15, 20, 25];
    const diasVencimentoMesAtual = [5, 10, 15, 20, 25];

    const datas = [
        ...diasVencimentoMesAnterior.map(d =>
            new Date(anoAtual, mesAtual - 1, d)
        ),
        ...diasVencimentoMesAtual.map(d =>
            new Date(anoAtual, mesAtual, d)
        )
    ];

    datas.forEach(vencimentoBase => {
        // 📌 Ajustar vencimento
        const dataVencimento = proximoDiaPermitido(vencimentoBase);

        // 📌 Bloqueio = vencimento + 15 dias (não pode sex/sáb/dom/feriado)
        let dataBloqueio = new Date(dataVencimento);
        dataBloqueio.setDate(dataBloqueio.getDate() + 15);
        dataBloqueio = proximoDiaPermitido(dataBloqueio, true);

        // 📌 Liberação máxima
        let dataLiberacao = new Date(dataBloqueio);
        // +6 porque o dia do bloqueio conta como o 1º dia
        dataLiberacao.setDate(dataLiberacao.getDate() + 6);

        // Se cair em dia protegido, empurra
        dataLiberacao = proximoDiaPermitido(dataLiberacao, true);

        const formatar = data =>
            data.toLocaleDateString("pt-BR", {
                timeZone: "America/Sao_Paulo"
            });

        corpoTabela.innerHTML += `
              <tr>
                <td style="padding: 10px; border: 1px solid #ccc;">${formatar(dataVencimento)}</td>
                <td style="padding: 10px; border: 1px solid #ccc;">${formatar(dataBloqueio)}</td>
                <td style="padding: 10px; border: 1px solid #ccc;">${formatar(dataLiberacao)}</td>
            </tr>
        `;
    });
}

document.addEventListener("DOMContentLoaded", gerarTabelaVencimentos);

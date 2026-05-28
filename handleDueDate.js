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

    function gerarLembretes(dataVencimento) {

        const regras = [
            { nome: "7 dias antes", dias: -7 },
            { nome: "1 dia antes", dias: -1 },
            { nome: "2 dias depois", dias: 2 },
            { nome: "14 dias depois", dias: 14 },
            { nome: "20 dias depois", dias: 20 }
        ];

        return regras.map(regra => {

            let dataAviso = new Date(dataVencimento);

            dataAviso.setDate(dataAviso.getDate() + regra.dias);

            // segue a mesma lógica do bloqueio
            dataAviso = proximoDiaPermitido(dataAviso);

            return {

                data: dataAviso
            };
        });
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
        const lembretes = gerarLembretes(dataVencimento);

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

        const formatarCurto = data =>
            data.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit"
            });

        const coresAvisos = [
            "purple-500 font-semibold text-white", // 7 dias antes
            "purple-500 font-semibold text-white", // 1 dia antes
            "yellow-400 font-semibold", // 2 dias depois
            "yellow-400 font-semibold", // 14 dias depois
            "red-500 font-semibold text-white"     // 20 dias depois
        ];

        const lembretesHTML = `
    <div class="flex flex-wrap justify-between">

        ${lembretes.map((lembrete, index) => `
            <span class=" rounded-md bg-${coresAvisos[index]} p-1 m-1 w-[54px]">
                ${formatarCurto(lembrete.data)}
            </span>
        `).join(`<span></span>`)}

    </div>
`;

        corpoTabela.innerHTML += `
    <tr>

        <td class="border text-center">
            ${formatar(dataVencimento)}
        </td>

        <td class="border text-center">
            ${formatar(dataBloqueio)}
        </td>

        <td class="border text-center">
            ${formatar(dataLiberacao)}
        </td>

        <td class="border text-center">
            ${lembretesHTML}
        </td>

    </tr>
`;
    });
}

document.addEventListener("DOMContentLoaded", gerarTabelaVencimentos);

$(document).ready(function () {
    const $form = $("#form-tarefa");
    const $input = $("#titulo");
    const $ul = $("#lista-tarefas");
    const $btnListar = $("#btn-listar");
    const $btnLimpar = $("#btn-limpar");

    // Adicionar nova tarefa
    $form.on("submit", function (e) {
        e.preventDefault();

        const titulo = $input.val().trim();
        if (titulo === "") {
            alert("Por favor, insira um título para a tarefa.");
            return;
        }

        const tarefa = {
            titulo: titulo,
            concluido: false
        };

        $.ajax({
            url: "http://localhost:8080/todo/tarefas",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(tarefa),
            success: function (data) {
                console.log("Tarefa criada:", data);
                adicionarTarefa(data);
                $input.val("");
            },
            error: function (xhr, status, error) {
                console.error("Erro ao enviar tarefa:", error);
                alert("Erro ao enviar a tarefa.");
            }
        });
    });

    // Adicionar uma tarefa na lista
    function adicionarTarefa(tarefa) {
        const $li = $(`
            <li data-id="${tarefa.id}">
                <span style="${tarefa.concluido ? 'text-decoration: line-through;' : ''}">${tarefa.titulo}</span>
                <button class="btn-concluir" ${tarefa.concluido ? 'disabled' : ''}>Concluir</button>
                <button class="btn-editar">Editar</button>
                <button class="btn-deletar">Deletar</button>
            </li>
        `);
        $ul.append($li);
    }

    // Botão: Concluir tarefa
    $ul.on("click", ".btn-concluir", function () {
        const $li = $(this).closest("li");
        const $span = $li.find("span");
        const id = $li.data("id");

        const tarefaAtualizada = {
            titulo: $span.text(),
            concluido: true
        };

        $.ajax({
            url: `http://localhost:8080/todo/tarefas/${id}`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(tarefaAtualizada),
            success: function () {
                $span.css("text-decoration", "line-through");
                $li.find(".btn-concluir").prop("disabled", true);
            },
            error: function () {
                alert("Erro ao concluir a tarefa.");
            }
        });
    });

    // Botão: Editar tarefa
    $ul.on("click", ".btn-editar", function () {
        const $li = $(this).closest("li");
        const $span = $li.find("span");
        const id = $li.data("id");
        const concluido = $span.css("text-decoration").includes("line-through");
        const novoTitulo = prompt("Edite a tarefa:", $span.text());

        if (novoTitulo && id !== undefined) {
            $.ajax({
                url: `http://localhost:8080/todo/tarefas/${id}`,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify({
                    id: id,
                    titulo: novoTitulo,
                    concluido: concluido
                }),
                success: function (data) {
                    $span.text(data.titulo);
                },
                error: function () {
                    alert("Erro ao atualizar a tarefa.");
                }
            });
        }
    });

    // Botão: Deletar tarefa
    $ul.on("click", ".btn-deletar", function () {
        const $li = $(this).closest("li");
        const id = $li.data("id");

        $.ajax({
            url: `http://localhost:8080/todo/tarefas/${id}`,
            method: "DELETE",
            success: function () {
                $li.remove();
            },
            error: function () {
                alert("Erro ao deletar a tarefa.");
            }
        });
    });

    // Botão: Listar tarefas do banco
    $btnListar.on("click", function () {
        $.ajax({
            url: "http://localhost:8080/todo/tarefas",
            method: "GET",
            success: function (tarefas) {
                $ul.empty(); // limpa lista antes de preencher
                tarefas.forEach(adicionarTarefa);
            },
            error: function () {
                alert("Erro ao listar as tarefas.");
            }
        });
    });

    // Botão: Limpar lista da tela
    $btnLimpar.on("click", function () {
        $ul.empty(); // apenas limpa visualmente, sem deletar do banco
    });
});

let listaTarefas = [];
let programaAtivo = true; // Controle do loop principal

while (programaAtivo) {  // Menu principal
    console.log("\n=== Gerenciador de Tarefas ===");
    console.log("1. Adicionar tarefa");
    console.log("2. Remover tarefa");
    console.log("3. Listar tarefas");
    console.log("4. Sair");

    let escolhaUsuario = Number(prompt("Escolha a opção desejada (1-4):"));  // Usuário escolhe a opção

    if (escolhaUsuario === 1) {
        let tarefa = prompt("Digite a tarefa que deseja adicionar:");
        if (tarefa && tarefa.trim() !== "") { // Verifica se a tarefa não está vazia, .trim() remove espaços extras
            listaTarefas.push(tarefa.trim()); // Adiciona a tarefa à lista
            console.log(`Tarefa "${tarefa}" adicionada com sucesso!`);
        } else {
            console.log("Nenhuma tarefa foi adicionada (campo vazio ou cancelado).");
        }
    } else if (escolhaUsuario === 2) {
        if (listaTarefas.length === 0) { // Verifica se a lista está vazia
            console.log("A lista está vazia!");
            continue;
        }
        
        console.log("\nTarefas disponíveis:");
        listaTarefas.forEach((t, i) => console.log(`${i+1}. ${t}`)); // Recebe o elemento t e o índice i, .forEach exibe as tarefas
        
        let indice = Number(prompt("Digite o NÚMERO da tarefa a remover:")) - 1; // O usuário escolhe o número da tarefa a remover
        
        if (indice >= 0 && indice < listaTarefas.length) { // Verifica se o índice é válido
            let removida = listaTarefas.splice(indice, 1); // Remove a tarefa da lista com .splice
            console.log(`"${removida}" removida com sucesso!`);
        } else {
            console.log("Número inválido!");
        }
    } else if (escolhaUsuario === 3) {
        if (listaTarefas.length > 0) {
            console.log("\nLista de Tarefas:"); 
            listaTarefas.forEach((tarefa, index) => { // Exibe cada tarefa com seu índice
                console.log(`${index + 1}. ${tarefa}`); 
            });
        } else {
            console.log("Nenhuma tarefa na lista.");
        }
    } else if (escolhaUsuario === 4) {
        programaAtivo = false; // Encerra o programa
        console.log("Saindo do programa. Até logo!");
    } else {
        console.log("Opção inválida. Por favor, escolha 1-4.");
    }
}
import fs from "fs";
import chalk from "chalk";
import readline from "readline";
// pré-definição das cores
const status_colors = {
    "pendente" : chalk.red,
    "em progresso" : chalk.yellow,
    "finalizado" : chalk.green
};

const task_file = "tasks.json"




// captação do prompt
const args = process.argv.slice(2)
const command = args[0]
const input = args.slice(1)
if (command == "add") {
    addTasks(input.join(" "))
} else if (command ==  "list") {
    listTasks()
} else if ( command == "update") {
    updateTask(input[0], input.slice(1).join(" "))
} else if ( command == "mark") {
    marktask( input[0], input.slice(1).join(" "))
} else if ( command == "delete") {
    deleteTask(input[0])
}
 else {
    console.log("Comando inválido. Use: add, list, update, delete, mark-in-progress, mark-done")
}








// FUNÇÕES

// função carregar tasks
function loadTasks() {
    if (!fs.existsSync("tasks.json")) {
        fs.writeFileSync("tasks.json", "[]")
    }

    const data = fs.readFileSync("tasks.json", "utf-8")
    return JSON.parse(data)
}

//função para salvar tarefas
function saveTasks(tasks) {
    fs.writeFileSync(task_file, JSON.stringify(tasks, null, 4))
}


// função para adicionar tarefas
function addTasks(description) {
    const tasks = loadTasks()

    const newTask = {
        id: tasks.length + 1, 
        description: description,
        status : "pendente",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }

    tasks.push(newTask)
    saveTasks(tasks)

    console.log(chalk.green.bold(` ✅ Tarefa adicioada com sucesso ! (ID: ${newTask.id}) \x07`))


}

// função para ler e exebir as tasks
function listTasks() {
    const tasks = loadTasks() 

    if (tasks.length == 0 ) {
        console.log(chalk.blue.bold("Nenhuma Tarefa encontrada"))
        return
    } 

    console.log(chalk.blue("\n 📋 Lista de Tarefas: "))
    console.log(chalk.gray("-----------------------------------------------------------"))

    tasks.forEach(task => {
        const statusColor = status_colors[task.status] || chalk.white;
        console.log(`${chalk.magenta(`#${task.id}`)} | ${chalk.yellow(task.description)} → ${statusColor(task.status)} | Criado: ${chalk.green(task.createdAt)}`);  
    })

    console.log(chalk.gray("-----------------------------------------------------------\n"))

}

// função para atualizar tarefa
function updateTask (taskId, newDescription) {
    const tasks = loadTasks()

    const task = tasks.find(t => t.id == parseInt(taskId))

    if (!task) {
        console.log(`Tarefa do ID: [${taskId}] não encontrada`)
        return
    }

    task.description = newDescription
    task.updatedAt = new Date().toISOString()

    saveTasks(tasks)

    console.log(chalk.yellow.bold(`✏️ Tarefa ${taskId} atualizada com sucesso, nova descrição ${newDescription} \x07`))

}

// função para marcar task
function marktask (taskId, newStatus) {
    const tasks = loadTasks()

    const validStatus = [ "pendente", "em progresso", "finalizado"]

    if (!validStatus.includes(newStatus)) {
        console.log(`Status ${newStatus} é um formato invalido, Use : Pendente, Em Progresso, ou Finalizado`)
        return
    }

    const task = tasks.find(t => t.id == parseInt(taskId))

    if(!task) {
        console.log(`Task de ID [${taskId}] não encontrada`)
        return
    }

    task.status  = newStatus
    task.updatedAt =  new Date().toISOString()

    saveTasks(tasks)

    console.log(chalk.blue.bold(`🔄 A tarefa de ID [${taskId}] teve seu status modificado para ${newStatus} \x07`))

}

// função para deletar tasks

function deleteTask(taskID) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === parseInt(taskID));

    if (!task) {
        console.log(chalk.red.bold(`❌ Tarefa com ID ${taskID} NÃO encontrada.`));
        return;
    }

    // Criar interface de leitura do terminal
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Perguntar antes de excluir
    rl.question(chalk.yellow.bold(`⚠️ Tem certeza que deseja excluir a tarefa "${task.description}"? (s/n): `), (answer) => {
        if (answer.toLowerCase() === "s") {
            const filteredTasks = tasks.filter(t => t.id !== parseInt(taskID));
            filteredTasks.forEach((t, index) => t.id = index + 1);
            saveTasks(filteredTasks);
            console.log(chalk.red.bold(`❌ Tarefa ${taskID} removida com sucesso!`));
        } else {
            console.log(chalk.green.bold(`✅ Ação cancelada. A tarefa ${taskID} continua na lista.`));
        }
        rl.close(); // Fecha a interface de leitura do terminal
    });
}





























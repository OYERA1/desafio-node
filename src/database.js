import { writeFile, readFile } from "fs/promises";
import { getDate } from "./utils/date-formates.js";

const databasePath = new URL("./database/db.json", import.meta.url);

// Função para formatar e dar get na data
const { day, month, year } = getDate();

export class Database {
	// Variavel onde todos os dados do banco de dados estão
	#database = {};

	constructor() {
		// Metodo usado ao executar o servidor para ler o banco de dados e salvar
		// no objeto #database para que dê continuidade nas requisições

		readFile(databasePath, "utf-8")
			.then((data) => {
				this.#database = JSON.parse(data);
			})
			.catch(() => {
				this.#persist();
			});
	}

	#persist() {
		// Escreve num arquivo .json "fisico", dentro de uma pasta, todos os dados
		// do banco de dados
		writeFile(databasePath, JSON.stringify(this.#database));
	}

	getTasks(table) {
		// Retorna todos os dados do banco de dados
		const data = this.#database[table] ?? [];
		return data;
	}

	createTask(table, data) {
		// Cria um anova task na tabela que foi nomeada pelas rotas ao chamar
		// a função
		for (const prop in data) {
			if (data[prop] === undefined || null) {
				// Retorna uma mensagem de erro mostrando qual prop está vazia
				return {
					message: `O campo '${prop}' não existe.`,
					ok: false,
				};
			}
		}

		// Verifica se a tabela existe
		if (Array.isArray(this.#database[table])) {
			// Se não existir, cria uma nova tabela com os valores passados
			// na data
			this.#database[table].push(data);
		}

		// Se existir, armazena a data na tabela designada
		this.#database[table] = [data];

		this.#persist();

		// Retorna uma mensagem de sucesso e o conteúdo que foi salvo
		return { message: "Usuário criado!", ok: true, data: data };
	}

	deleteTask(table, id) {
		// Verifica se o id existe
		const rowIndex = this.#database[table].findIndex((task) => task.id === id);

		// Se o id existir, continua a requisição
		if (rowIndex > -1) {
			// Se o id existir, deleta a task
			this.#database[table].splice(rowIndex, 1);
			this.#persist();

			// Retorna uma mensagem de sucesso dizendo que deletou a task
			return { message: "Task deletada!", ok: true };
		}
		return { message: "id não encontrado", ok: false };
	}

	updateTask(table, data, id) {
		// Verifica se o id existe
		const rowIndex = this.#database[table].findIndex((task) => task.id === id);

		// Se o id existir, continua a requisição
		if (rowIndex > -1) {
			for (const prop in data) {
				if (prop in data) {
					// Atualiza as props existentes
					this.#database[table][rowIndex][prop] = data[prop];

					// Atualiza a data
					this.#database[table][rowIndex].updated_at =
						`${month}/${day}/${year}`;
				}

				// Retorna uma mensagem de erro e mostra qual o campo não foi preenchido
				if (!data[prop]) {
					return { message: `Campo '${prop}' não encontrado`, ok: false };
				}
			}

			// Retorna uma mensagem de sucesso caso a requisição dê certo
			this.#persist();
			return { message: "Task atualizada!", ok: true };
		}

		// Retorna uma mensagem de erro caso o id não for encontrado
		return { message: "id não encontrado", ok: false };
	}

	completeTask(table, id) {
		// Verifica se o id existe
		const rowIndex = this.#database[table].findIndex((task) => task.id === id);

		// Se o id existir, continua a requisição
		if (rowIndex > -1) {
			// Muda apenas a prop completed_at adicionando um true e a data em
			// que foi completada
			this.#database[table][rowIndex].completed_at = {
				completed: true,
				date: `${month}/${day}/${year}`,
			};
			this.#persist();

			// Retorna uma mensagem de sucesso caso a requisição dê certo
			return { message: "Task completada!", ok: true };
		}
		// Retorna uma mensagem de erro caso o id não for encontrado

		return { message: "id não encontrado", ok: false };
	}

	purge(data) {
		// Verifica se a data contem a string 'purge' para deletar o banco de dados
		if (data === "purge") this.#database = {};
		this.#persist();
	}
}

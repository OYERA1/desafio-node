import { Database } from "./database.js";
import { randomUUID } from "crypto";
import { buildRoutePath } from "./utils/build-route-path.js";
import { getDate } from "./utils/date-formates.js";

const db = new Database();

export const routes = [
	{
		// Retorna um array de tasks que estão no banco de dados
		method: "GET",
		path: buildRoutePath("/tasks"),
		handler: (req, res) => {
			const users = db.getTasks("tasks");
			return res.writeHead(200).end(JSON.stringify(users));
		},
	},
	{
		// Cria a task e retorna uma mensagem de sucesso ou erro
		method: "POST",
		path: buildRoutePath("/tasks"),
		handler: (req, res) => {
			const { taskName, taskTitle, taskDescription } = req.body;
			const { day, month, year } = getDate();

			const response = db.createTask("tasks", {
				id: randomUUID(),
				taskName,
				taskTitle,
				taskDescription,
				created_at: `${month}/${day}/${year}`,
				updated_at: null,
				completed_at: null,
			});

			if (!response.ok) return res.writeHead(404).end(response.message);

			return res.writeHead(201).end(response.message);
		},
	},
	{
		// Deleta a task e retorna uma mensagem caso o id não for encontrado
		method: "DELETE",
		path: buildRoutePath("/tasks/:id"),
		handler: (req, res) => {
			const { id } = req.params;
			const response = db.deleteTask("tasks", id);
			if (!response) return res.writeHead(404).end();
			return res.writeHead(204).end("deleted");
		},
	},
	{
		// Modifica as tasks e faz a validação se o body da requisição
		// possue o titulo e a descrição
		method: "PUT",
		path: buildRoutePath("/tasks/:id"),
		handler: (req, res) => {
			const { id } = req.params;
			const { taskTitle, taskDescription } = req.body;
			const response = db.updateTask(
				"tasks",
				{ taskTitle, taskDescription },
				id,
			);
			if (!response.ok) return res.writeHead(404).end(response.message);
			return res.writeHead(200).end(response.message);
		},
	},
	{
		// Completa a task mandando a data e se a propriedade "true"
		method: "PATCH",
		path: buildRoutePath("/tasks/:id/complete"),
		handler: (req, res) => {
			const { id } = req.params;
			const response = db.completeTask("tasks", id);
			if (!response.ok) return res.writeHead(404).end(response.message);
			return res.writeHead(200).end(response.message);
		},
	},
	{
		// Utilizado apenas para desenvolvimento para limpar o banco de dados.
		method: "PURGE",
		path: buildRoutePath("/tasks"),
		handler: (req, res) => {
			const { kill } = req.body;

			if (kill === "purge") db.purge(kill);

			return res.writeHead(200).end();
		},
	},
];

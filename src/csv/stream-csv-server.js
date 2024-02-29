import { parse } from "csv-parse";
import { createServer } from "http";
import { createReadStream } from "fs";

const csvPath = new URL("./csvData.csv", import.meta.url);
const stream = createReadStream(csvPath, "utf-8");
const parser = parse({
	delimiter: ",",
	skipEmptyLines: true,
	fromLine: 2,
});

const server = createServer(async (req, res) => {
	if (req.method === "POST") {
		const buf = stream.pipe(parser);
		for await (const chunk of buf) {
			const [taskTitle, taskDescription] = chunk;
			await fetch("http://localhost:3333/tasks", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({ taskTitle, taskDescription }),
				duplex: "half",
			});
		}
		return res.writeHead(200).end();
	}
});

server.listen(3334);

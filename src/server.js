import { json } from "./middleware/json.js";
import { routes } from "./routes.js";
import { createServer } from "http";
import { extractQuery } from "./utils/extract-query-params.js";

const server = createServer(async (req, res) => {
	const { method, url } = req;

	await json(req, res);
	const route = routes.find((route) => {
		return route.method === method && route.path.test(url);
	});

	if (route) {
		const routeParams = req.url.match(route.path);
		const { query, ...params } = routeParams.groups;

		req.params = params;
		req.query = query ? extractQuery(query) : {};
		return route.handler(req, res);
	}

	return res.writeHead(404).end();
});

server.listen(3333);

# Desafio Node Ignite

### Para iniciar o projeto, primeiro instale as dependencias com `npm i` e depois rode o comando `npm run dev` na pasta raiz do projeto, o servidor irá iniciar

* #### GET
>Mande uma requisição GET para http://localhost:3333/tasks para obter todas as tasks do banco de dados em formato de array

* #### POST
>Mande uma requisição POST para http://localhost:3333/tasks. Exemplo de body mais a baixo

* #### DELETE
> Mande uma requisição DELETE para http://localhost:3333/tasks/[id] com a ID da sua task


* #### PATCH
>Mande uma requisição PATCH para http://localhost:3333/tasks/[id]/complete para marcar uma task como completa

* #### PUT
>Mande uma requisição PUT para http://localhost:3333/tasks/[id] com o mesmo body previsto pelo POST, para mudar os atributos de titulo e descrição



* #### PURGE
>Requisição especial para limpar o banco de dados para testes, mande uma requisição PURGE para http://localhost:3333/tasks com o body 
	{
		"kill": "purge"
	} 
>para limpar o banco de dados

***

# Formato JSON esperado

~~~json
{
	"taskTitle": "<Algum Texto>",
	"taskDescription": "<Algum Texto>"
}
~~~

***

# CSV Stream

* ## Enviar dados de arquivos CSV

> Para enviar arquivos CSV para o banco de dados, coloque seu arquivo na pasta `./src/csv` com o nome de `csvData.csv`, rode o servidor com `node stream-csv-server.js` e apenas mande sua requisição "POST" para https://localhost:3334

import { useState } from "react";
import axios from 'axios';

interface RequestBody {
	inputText: string;
	tableSchema?: string;
}

async function fetchData(sqlQuery: any) {
	const axios = require('axios');
	let data = JSON.stringify({
		"sqlQuery": sqlQuery
	});

	let config = {
		method: 'post',
		maxBodyLength: Infinity,
		url: 'https://k7i6qgtut5.execute-api.us-east-1.amazonaws.com/dev',
		headers: {
			'Content-Type': 'application/json'
		},
		data: data
	};

	const output = axios.request(config)
		.then((response: any) => {
			console.log(response.data.body);
			const sqlOutput = response.data.body;
			return sqlOutput;
		})
		.catch((error: any) => {
			console.log(error);
			return "";
		});
	return output;
}


export function useTranslate() {
	const [translating, setTranslating] = useState(false);
	const [outputText, setOutputText] = useState("");
	const [sqlQuery, setSqlQuery] = useState("");
	const [translationError, setTranslationError] = useState("");

	const translate = async ({
		inputText,
		tableSchema,
		isHumanToSql,
	}: {
		inputText: string;
		tableSchema: string;
		isHumanToSql: boolean;
	}) => {
		setTranslating(true);
		try {
			const requestBody: RequestBody = { inputText };
			if (tableSchema !== "") {
				requestBody.tableSchema = tableSchema;
			}
			const response1 = await axios.post(
				`/api/${isHumanToSql ? "translate" : "sql-to-human"}`,
				requestBody,
				{
					headers: { "Content-Type": "application/json" },
				}
			);
			if (response1.status === 200) {
				const data2 = response1.data;// Retrieve the SQL query

				const sqlQuery = data2.outputText.toLowerCase();
				setSqlQuery(sqlQuery);
				const sqlOutput = fetchData(sqlQuery);
				setOutputText(await sqlOutput);
			} else {
				setTranslationError(
					`Error translating ${isHumanToSql ? "to SQL" : "to human"}.`
				);
			}
		} catch (error) {
			console.error(error);
			setTranslationError(
				`Error translating ${isHumanToSql ? "to SQL" : "to human"}.`
			);
		} finally {
			setTranslating(false);
		}
	};

	return {
		outputText,
		setOutputText,
		sqlQuery,
		setSqlQuery,
		translate,
		translating,
		translationError,
	};
}
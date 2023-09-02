import { SettingsObject } from "../SettingsDef";

export function getVerbList(settings: SettingsObject): {kanji: string, kana: string}[] | Error {

	const requestResult: object = processAndMakeRequest();
	return [];
}

function processAndMakeRequest(): object | Error {

	const res = makeRequest();
	console.log(res);

	return {};
}

function makeRequest(): object | Error {

	const corsPrefix = "https://cors-anywhere.herokuapp.com/";
	const jishoURL = "https://jisho.org/api/v1/search/words?keyword=";
	const params = "%23jlpt-n5%20%23v1";
	const page = 1;
	const pageSuffix: string = "&page=" + page;
	const request: RequestInfo = new Request(corsPrefix + jishoURL + params + pageSuffix, {
		method: "GET"
	});

	return fetch(request)
		.then(res => {
			console.log(res);
			return res.json();
		})
		.then(res => {
			console.log(res);
			return res;
		})
		.catch(err => console.log(err));
}
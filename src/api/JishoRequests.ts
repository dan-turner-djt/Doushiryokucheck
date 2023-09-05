import { SettingsObject } from "../SettingsDef";
import { VerbInfo, VerbType } from "jv-conjugator";

export function getVerbList(settings: SettingsObject): {kanji: string, kana: string}[] | Error {

	//const requestResult: object = processAndMakeRequest();
	return [];
}

export function pullInfo() {
	console.log("pull");

	//processAndMakeRequest("jlpt-n5", "v1");

	const request: RequestInfo = new Request("./verbData/unprocessed/test.json");
	fetch(request)
		.then(res => {
			console.log(res);
			return res.json();
		})
		.then((res) => {
			console.log(res.data);
			const all: {data: any}[] = res.info;

			const newData: VerbInfo[] = [];
			all.forEach(info => {
				const data: {slug: string, japanese: {reading: string}[]}[] = info.data;
				data.forEach(d => {
					const newInfo: VerbInfo = {
						verb: {
							kanji: d.slug,
							kana: d.japanese[0].reading
						},
						type: VerbType.Ichidan
					};
					newData.push(newInfo);
				});
			});
			console.log(newData);
			const toWrite = newData;

			const writeRequest: RequestInfo = new Request("./verbData/processed/test.json");
			fetch(writeRequest, {
				method: "POST",
				body: JSON.stringify(toWrite),
				headers: {
					"Content-type": "application/json; charset=UTF-8"
				}
			}).catch(err => {
				console.log(err);
			});

		})
		.catch(err => {
			console.log(err);
		});
}

function processAndMakeRequest(level: string, verbType: string): object | Error {
	makeRequest(level, verbType);

	return {};
}



async function makeRequest(level: string, verbType: string) {
	const totalInfo: object[] = [];

	const corsPrefix = "https://cors-anywhere.herokuapp.com/";
	const jishoURL = "https://jisho.org/api/v1/search/words?keyword=";
	const params = "%23" + level + "%20%23" + verbType;

	/*return fetch(request)
		.then(res => {
			console.log(res);
			return res.json();
		})
		.then(res => {
			console.log(res);
			if ((res.data as object[]).length === 0) {
				return [];
			}
			//return (res.data as object[]).concat(makeRequest(level, verbType, page+1).then(value => value));

			return makeRequest(level, verbType, page+1).then(value => {
				return (res.data as object[]).concat(value);
			});
		})
		.catch(err => {
			console.log(err);
			Promise.resolve();
		});*/

	let success = true;
	let page = 0;
	while(success) {
		page++;
		const pageSuffix: string = "&page=" + page;
		const request: RequestInfo = new Request(corsPrefix + jishoURL + params + pageSuffix, {
			method: "GET"
		});

		const res: object[] = await resolveRequest(request);
		if (res.length === 0) {
			success = false;
		}
		console.log("res: " + res);
		totalInfo.concat(res);
	}

	console.log("full: " + totalInfo);
}

function resolveRequest(request: RequestInfo): Promise<object[]> {
	return fetch(request)
		.then(res => {
			console.log(res);
			return res.json();
		})
		.then(res => {
			console.log(res);
			if ((res.data as object[]).length === 0) {
				return [];
			}
			return res.data as object[];
		})
		.catch(err => {
			console.log(err);
			return [];
		});
}
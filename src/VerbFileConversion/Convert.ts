import { SettingsObject } from "../SettingsDef";
import { VerbInfo, VerbType } from "jv-conjugator";
import { saveAs } from "file-saver";

export function getVerbList(settings: SettingsObject): {kanji: string, kana: string}[] | Error {

	//const requestResult: object = processAndMakeRequest();
	return [];
}

export function convertFiles() {
	convertSingleFile(5, "ichidan");
	convertSingleFile(4, "ichidan");
	convertSingleFile(3, "ichidan");
	convertSingleFile(2, "ichidan");
	convertSingleFile(1, "ichidan");
}

function convertSingleFile(level: number, type: string): void {
	const fileName = "n" + level + "_" + type;
	console.log("convert " + fileName);

	const request: RequestInfo = new Request("./verbData/unprocessed/" + fileName + ".json");
	fetch(request)
		.then(res => {
			console.log(res);
			return res.json();
		})
		.then((res) => {
			console.log(res);
			const all: {data: any}[] = res.info;

			const newData: VerbInfo[] = [];
			all.forEach(info => {
				const data: {slug: string, japanese: {reading: string}[], jlpt: string[]}[] = info.data;
				data.forEach(d => {
					if (checkContainsLowerLevels(level, d.jlpt)) {
						return;
					}
					const slug = processSlug(d.slug);
					const newInfo: VerbInfo = {
						verb: {
							kanji: slug,
							kana: d.japanese[0].reading
						},
						type: VerbType.Ichidan
					};
					newData.push(newInfo);
				});
			});
			const toWrite = {
				data: newData
			};
			console.log(toWrite);

			const file = new Blob([JSON.stringify(toWrite)], { type: "text/plain; charset=utf-8"});
			saveAs(file, fileName + ".json");
		})
		.catch(err => {
			console.log(err);
		});
}

function processSlug(slug: string): string {
	return slug.split("-")[0];
}

function checkContainsLowerLevels(level: number, list: string[]): boolean {
	if (level < 5) {
		if (list.includes("jlpt-n5")) {
			return true;
		}
	}
	if (level < 4) {
		if (list.includes("jlpt-n4")) {
			return true;
		}
	}
	if (level < 3) {
		if (list.includes("jlpt-n3")) {
			return true;
		}
	}
	if (level < 2) {
		if (list.includes("jlpt-n2")) {
			return true;
		}
	}
	
	return false;
}


async function makeRequest(level: string, verbType: string) {
	const totalInfo: object[] = [];

	const corsPrefix = "https://cors-anywhere.herokuapp.com/";
	const jishoURL = "https://jisho.org/api/v1/search/words?keyword=";
	const params = "%23" + level + "%20%23" + verbType;
}
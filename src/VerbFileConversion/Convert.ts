import { VerbInfo, VerbType } from "jv-conjugator";
import { saveAs } from "file-saver";
import { ROOT_ENDPOINT } from "../Connection/settings";

export function convertFiles() {
	convertSingleFile(5, "godan");
}

type data = {slug: string, japanese: {reading: string}[], jlpt: string[]};
type fileInfo = {data: data[]}[];

function convertSingleFile(level: number, type: string): void {
	const fileName = "n" + level + "_" + type;

	const request: RequestInfo = new Request("./verbData/unprocessed/" + fileName + ".json");
	fetch(request)
		.then(res => {
			return res.json();
		})
		.then((res) => {
			let toWrite;

			if (type === "godan") {
				const all: {bu: fileInfo, gu: fileInfo, ku: fileInfo, mu: fileInfo, nu: fileInfo, ru: fileInfo, su: fileInfo, tsu: fileInfo, u: fileInfo} = res.info;

				const newDataBu = processData(all.bu, level);
				const newDataGu = processData(all.gu, level);
				const newDataKu = processData(all.ku, level);
				const newDataMu = processData(all.mu, level);
				const newDataNu = processData(all.nu, level);
				const newDataRu = processData(all.ru, level);
				const newDataSu = processData(all.su, level);
				const newDataTsu = processData(all.tsu, level);
				const newDataU = processData(all.u, level);

				toWrite = {
					data: {
						bu: newDataBu,
						gu: newDataGu,
						ku: newDataKu,
						mu: newDataMu,
						nu: newDataNu,
						ru: newDataRu,
						su: newDataSu,
						tsu: newDataTsu,
						u: newDataU
					}
				};

			} else {
				const all: fileInfo = res.info;
				const newData = processData(all, level);

				toWrite = {
					data: newData
				};
			}

			const file = new Blob([JSON.stringify(toWrite)], { type: "text/plain; charset=utf-8"});
			saveAs(file, fileName + ".json");
		})
		.catch(err => {
			throw new Error;
		});
}

function processData(all: fileInfo, level: number): VerbInfo[] {
	const newData: VerbInfo[] = [];
	all.forEach(info => {
		const data: data[] = info.data;
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

	return newData;
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

export function sendConvertRequest() {
	const endpoint = ROOT_ENDPOINT + "/convert";
	fetch(endpoint, {
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify({type: 0})
	})
		.then((response: Response) => {
			if (response.status !== 200) {
				throw new Error(response.status.toString());
			}
		})
		.catch((err) => {
			console.log(err);
		});
}
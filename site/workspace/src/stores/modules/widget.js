import { createSlice } from "@reduxjs/toolkit";

import { randomNumber } from "@/utils";

// 默认历史数据数组
const defaultHistoryData = [
	{
		text: "Egyptian coup d'état: President of Egypt Mohamed Morsi is overthrown by the military after four days of protests all over the country calling for Morsi's resignation, to which he did not respond. President of the Supreme Constitutional Court of Egypt Adly Mansour is declared acting president.",
		pages: [
			{
				type: "standard",
				title: "2013_Egyptian_coup_d'état",
				displaytitle: "2013 Egyptian coup d'état",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q13605743",
				titles: {
					canonical: "2013_Egyptian_coup_d'état",
					normalized: "2013 Egyptian coup d'état",
					display: "2013 Egyptian coup d'état",
				},
				pageid: 39822702,
				thumbnail: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Anti-coup_sit-in_at_Rabaa_Adiweya_mosque_2013.jpg/320px-Anti-coup_sit-in_at_Rabaa_Adiweya_mosque_2013.jpg",
					width: 320,
					height: 213,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/7/71/Anti-coup_sit-in_at_Rabaa_Adiweya_mosque_2013.jpg",
					width: 1600,
					height: 1067,
				},
				lang: "en",
				dir: "ltr",
				revision: "1031458861",
				tid: "59647ad0-da9d-11eb-a935-dd6e8c340184",
				timestamp: "2021-07-01T18:51:16Z",
				description: "2013 military coup against President of Egypt Mohamed Morsi",
				description_source: "local",
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/2013_Egyptian_coup_d'%C3%A9tat",
						revisions: "https://en.wikipedia.org/wiki/2013_Egyptian_coup_d'%C3%A9tat?action=history",
						edit: "https://en.wikipedia.org/wiki/2013_Egyptian_coup_d'%C3%A9tat?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:2013_Egyptian_coup_d'%C3%A9tat",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/2013_Egyptian_coup_d'%C3%A9tat",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/2013_Egyptian_coup_d'%C3%A9tat",
						edit: "https://en.m.wikipedia.org/wiki/2013_Egyptian_coup_d'%C3%A9tat?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:2013_Egyptian_coup_d'%C3%A9tat",
					},
				},
				extract:
					"The 2013 Egyptian coup d'état took place on 3 July 2013. Egyptian army chief General Abdel Fattah al-Sisi led a coalition to remove the President of Egypt, Mohamed Morsi, from power and suspended the Egyptian constitution of 2012. The move came after the military's ultimatum for the government to \"resolve its differences\" with protesters during widespread national protests. The military arrested Morsi and Muslim Brotherhood leaders, and declared Chief Justice of the Supreme Constitutional Court Adly Mansour as the interim president of Egypt. The announcement was followed by demonstrations and clashes between supporters and opponents of the move throughout Egypt.",
				extract_html:
					"<p>The <b>2013 Egyptian coup d'état</b> took place on 3 July 2013. Egyptian army chief General Abdel Fattah al-Sisi led a coalition to remove the President of Egypt, Mohamed Morsi, from power and suspended the Egyptian constitution of 2012. The move came after the military's ultimatum for the government to \"resolve its differences\" with protesters during widespread national protests. The military arrested Morsi and Muslim Brotherhood leaders, and declared Chief Justice of the Supreme Constitutional Court Adly Mansour as the interim president of Egypt. The announcement was followed by demonstrations and clashes between supporters and opponents of the move throughout Egypt.</p>",
				normalizedtitle: "2013 Egyptian coup d'état",
			},
			{
				type: "standard",
				title: "President_of_Egypt",
				displaytitle: "President of Egypt",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q15618993",
				titles: {
					canonical: "President_of_Egypt",
					normalized: "President of Egypt",
					display: "President of Egypt",
				},
				pageid: 335341,
				thumbnail: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Flag_of_the_President_of_Egypt.svg/320px-Flag_of_the_President_of_Egypt.svg.png",
					width: 320,
					height: 213,
				},
				originalimage: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Flag_of_the_President_of_Egypt.svg/900px-Flag_of_the_President_of_Egypt.svg.png",
					width: 900,
					height: 600,
				},
				lang: "en",
				dir: "ltr",
				revision: "1027361048",
				tid: "60ff7140-d724-11eb-95d4-790d9b98e751",
				timestamp: "2021-06-07T13:37:40Z",
				description: "Head of state of Egypt",
				description_source: "local",
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/President_of_Egypt",
						revisions: "https://en.wikipedia.org/wiki/President_of_Egypt?action=history",
						edit: "https://en.wikipedia.org/wiki/President_of_Egypt?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:President_of_Egypt",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/President_of_Egypt",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/President_of_Egypt",
						edit: "https://en.m.wikipedia.org/wiki/President_of_Egypt?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:President_of_Egypt",
					},
				},
				extract:
					"The president of Egypt  is the executive head of state of Egypt. Under the various iterations of the Constitution of Egypt following the Egyptian Revolution of 1952, the president is also the supreme commander of the Armed Forces, and head of the executive branch of the Egyptian government. The current president is Abdel Fattah el-Sisi, in office since 8 June 2014.",
				extract_html:
					"<p>The <b>president of Egypt </b> is the executive head of state of Egypt. Under the various iterations of the Constitution of Egypt following the Egyptian Revolution of 1952, the president is also the supreme commander of the Armed Forces, and head of the executive branch of the Egyptian government. The current president is Abdel Fattah el-Sisi, in office since 8 June 2014.</p>",
				normalizedtitle: "President of Egypt",
			},
			{
				type: "standard",
				title: "Mohamed_Morsi",
				displaytitle: "Mohamed Morsi",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q4631",
				titles: {
					canonical: "Mohamed_Morsi",
					normalized: "Mohamed Morsi",
					display: "Mohamed Morsi",
				},
				pageid: 32253721,
				thumbnail: {
					source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Mohamed_Morsi-05-2013.jpg/240px-Mohamed_Morsi-05-2013.jpg",
					width: 240,
					height: 320,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Mohamed_Morsi-05-2013.jpg",
					width: 672,
					height: 896,
				},
				lang: "en",
				dir: "ltr",
				revision: "1029069366",
				tid: "53b69aa0-d48f-11eb-8e5c-d793e3519f97",
				timestamp: "2021-06-17T18:13:23Z",
				description: "Egyptian politician and engineer (1951–2019)",
				description_source: "local",
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Mohamed_Morsi",
						revisions: "https://en.wikipedia.org/wiki/Mohamed_Morsi?action=history",
						edit: "https://en.wikipedia.org/wiki/Mohamed_Morsi?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Mohamed_Morsi",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Mohamed_Morsi",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Mohamed_Morsi",
						edit: "https://en.m.wikipedia.org/wiki/Mohamed_Morsi?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Mohamed_Morsi",
					},
				},
				extract:
					"Mohamed Mohamed Morsi Eissa Al-Ayyat was an Egyptian politician and engineer who served as the fifth President of Egypt, from 30 June 2012 to 3 July 2013, when General Abdel Fattah el-Sisi removed him from office in a coup d'état after protests in June. An Islamist affiliated with the Muslim Brotherhood organisation, Morsi led the Freedom and Justice Party from 2011 to 2012.",
				extract_html:
					"<p><b>Mohamed Mohamed Morsi Eissa Al-Ayyat</b> was an Egyptian politician and engineer who served as the fifth President of Egypt, from 30 June 2012 to 3 July 2013, when General Abdel Fattah el-Sisi removed him from office in a coup d'état after protests in June. An Islamist affiliated with the Muslim Brotherhood organisation, Morsi led the Freedom and Justice Party from 2011 to 2012.</p>",
				normalizedtitle: "Mohamed Morsi",
			},
			{
				type: "standard",
				title: "Egyptian_Armed_Forces",
				displaytitle: "Egyptian Armed Forces",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q1075553",
				titles: {
					canonical: "Egyptian_Armed_Forces",
					normalized: "Egyptian Armed Forces",
					display: "Egyptian Armed Forces",
				},
				pageid: 9354,
				thumbnail: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Emblem_of_the_Egyptian_Armed_Forces.png/320px-Emblem_of_the_Egyptian_Armed_Forces.png",
					width: 320,
					height: 319,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Emblem_of_the_Egyptian_Armed_Forces.png",
					width: 522,
					height: 521,
				},
				lang: "en",
				dir: "ltr",
				revision: "1029876519",
				tid: "67d33f40-d75d-11eb-810e-c90aaec445fd",
				timestamp: "2021-06-22T15:20:12Z",
				description: "combined military forces of Egypt",
				description_source: "local",
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Egyptian_Armed_Forces",
						revisions: "https://en.wikipedia.org/wiki/Egyptian_Armed_Forces?action=history",
						edit: "https://en.wikipedia.org/wiki/Egyptian_Armed_Forces?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Egyptian_Armed_Forces",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Egyptian_Armed_Forces",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Egyptian_Armed_Forces",
						edit: "https://en.m.wikipedia.org/wiki/Egyptian_Armed_Forces?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Egyptian_Armed_Forces",
					},
				},
				extract:
					"The Egyptian Armed Forces are the state military organisation responsible for the defense of Egypt. They consist of the Egyptian Army, Egyptian Navy, Egyptian Air Force and Egyptian Air Defense Forces.",
				extract_html:
					"<p>The <b>Egyptian Armed Forces</b> are the state military organisation responsible for the defense of Egypt. They consist of the Egyptian Army, Egyptian Navy, Egyptian Air Force and Egyptian Air Defense Forces.</p>",
				normalizedtitle: "Egyptian Armed Forces",
			},
			{
				type: "standard",
				title: "Supreme_Constitutional_Court_(Egypt)",
				displaytitle: "Supreme Constitutional Court (Egypt)",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q2156821",
				titles: {
					canonical: "Supreme_Constitutional_Court_(Egypt)",
					normalized: "Supreme Constitutional Court (Egypt)",
					display: "Supreme Constitutional Court (Egypt)",
				},
				pageid: 3246408,
				thumbnail: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Supreme_Constitutional_Court_of_Egypt.JPG/320px-Supreme_Constitutional_Court_of_Egypt.JPG",
					width: 320,
					height: 240,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/7/76/Supreme_Constitutional_Court_of_Egypt.JPG",
					width: 4000,
					height: 3000,
				},
				lang: "en",
				dir: "ltr",
				revision: "1014835611",
				tid: "456efdf0-d766-11eb-9b06-9518b2e9a21b",
				timestamp: "2021-03-29T10:29:35Z",
				description: "Highest judiciary body in Egypt",
				description_source: "local",
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Supreme_Constitutional_Court_(Egypt)",
						revisions: "https://en.wikipedia.org/wiki/Supreme_Constitutional_Court_(Egypt)?action=history",
						edit: "https://en.wikipedia.org/wiki/Supreme_Constitutional_Court_(Egypt)?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Supreme_Constitutional_Court_(Egypt)",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Supreme_Constitutional_Court_(Egypt)",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Supreme_Constitutional_Court_(Egypt)",
						edit: "https://en.m.wikipedia.org/wiki/Supreme_Constitutional_Court_(Egypt)?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Supreme_Constitutional_Court_(Egypt)",
					},
				},
				extract: "The Supreme Constitutional Court is an independent judicial body in Egypt, located in the Cairo suburb of Maadi.",
				extract_html:
					"<p>The <b>Supreme Constitutional Court</b> is an independent judicial body in Egypt, located in the Cairo suburb of Maadi.</p>",
				normalizedtitle: "Supreme Constitutional Court (Egypt)",
			},
			{
				type: "standard",
				title: "Adly_Mansour",
				displaytitle: "Adly Mansour",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q13593432",
				titles: {
					canonical: "Adly_Mansour",
					normalized: "Adly Mansour",
					display: "Adly Mansour",
				},
				pageid: 39851806,
				thumbnail: {
					source: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Adly_Mansour.JPG/214px-Adly_Mansour.JPG",
					width: 214,
					height: 320,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/2/21/Adly_Mansour.JPG",
					width: 355,
					height: 531,
				},
				lang: "en",
				dir: "ltr",
				revision: "1030389417",
				tid: "881205b0-d79a-11eb-8848-01b557da4441",
				timestamp: "2021-06-25T16:40:36Z",
				description: "Egyptian judge and statesman; former interim President of Egypt",
				description_source: "local",
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Adly_Mansour",
						revisions: "https://en.wikipedia.org/wiki/Adly_Mansour?action=history",
						edit: "https://en.wikipedia.org/wiki/Adly_Mansour?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Adly_Mansour",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Adly_Mansour",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Adly_Mansour",
						edit: "https://en.m.wikipedia.org/wiki/Adly_Mansour?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Adly_Mansour",
					},
				},
				extract:
					"Adly Mahmoud Mansour is an Egyptian judge and politician who served as President of the Supreme Constitutional Court of Egypt. He also served as interim President of Egypt from 4 July 2013 to 8 June 2014 following the 2013 Egyptian coup d'état by the military which deposed President Mohamed Morsi. Several secular and religious figures, such as the Grand Imam of al-Azhar, the Coptic Pope, and Mohamed ElBaradei supported the coup against President Morsi and the military appointed Mansour interim-president until an election could take place. Morsi refused to acknowledge his removal as valid and continued to maintain that only he could be considered the legitimate President of Egypt. Mansour was sworn into office in front of the Supreme Constitutional Court on 4 July 2013.",
				extract_html:
					"<p><b>Adly Mahmoud Mansour</b> is an Egyptian judge and politician who served as President of the Supreme Constitutional Court of Egypt. He also served as interim President of Egypt from 4 July 2013 to 8 June 2014 following the 2013 Egyptian coup d'état by the military which deposed President Mohamed Morsi. Several secular and religious figures, such as the Grand Imam of al-Azhar, the Coptic Pope, and Mohamed ElBaradei supported the coup against President Morsi and the military appointed Mansour interim-president until an election could take place. Morsi refused to acknowledge his removal as valid and continued to maintain that only he could be considered the legitimate President of Egypt. Mansour was sworn into office in front of the Supreme Constitutional Court on 4 July 2013.</p>",
				normalizedtitle: "Adly Mansour",
			},
		],
		year: 2013,
	},
	{
		text: "British Prime Minister John Major announced the Stone of Scone would be returned to Scotland.",
		pages: [
			{
				type: "standard",
				title: "John_Major",
				displaytitle: "John Major",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q9559",
				titles: {
					canonical: "John_Major",
					normalized: "John Major",
					display: "John Major",
				},
				pageid: 15898,
				thumbnail: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Prime_Minister_John_Major_%28cropped%29.jpg/215px-Prime_Minister_John_Major_%28cropped%29.jpg",
					width: 215,
					height: 320,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Prime_Minister_John_Major_%28cropped%29.jpg",
					width: 1190,
					height: 1771,
				},
				lang: "en",
				dir: "ltr",
				revision: "1031056647",
				tid: "79c8b410-d8ec-11eb-8707-a18e58c8e57a",
				timestamp: "2021-06-29T15:12:35Z",
				description: "Prime Minister of the United Kingdom from 1990 to 1997",
				description_source: "local",
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/John_Major",
						revisions: "https://en.wikipedia.org/wiki/John_Major?action=history",
						edit: "https://en.wikipedia.org/wiki/John_Major?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:John_Major",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/John_Major",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/John_Major",
						edit: "https://en.m.wikipedia.org/wiki/John_Major?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:John_Major",
					},
				},
				extract:
					"Sir John Major is a British politician who served as Prime Minister of the United Kingdom and Leader of the Conservative Party from 1990 to 1997. Major served in the Thatcher government from 1987 to 1990 as Chancellor of the Exchequer and Foreign Secretary, and was Member of Parliament (MP) for Huntingdon, formerly Huntingdonshire, from 1979 to 2001.",
				extract_html:
					"<p><b>Sir John Major</b> is a British politician who served as Prime Minister of the United Kingdom and Leader of the Conservative Party from 1990 to 1997. Major served in the Thatcher government from 1987 to 1990 as Chancellor of the Exchequer and Foreign Secretary, and was Member of Parliament (MP) for Huntingdon, formerly Huntingdonshire, from 1979 to 2001.</p>",
				normalizedtitle: "John Major",
			},
			{
				type: "standard",
				title: "Stone_of_Scone",
				displaytitle: "Stone of Scone",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q756442",
				titles: {
					canonical: "Stone_of_Scone",
					normalized: "Stone of Scone",
					display: "Stone of Scone",
				},
				pageid: 43795,
				thumbnail: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Replica_of_the_Stone_of_Scone%2C_Scone_Palace%2C_Scotland_%288924541883%29.jpg/320px-Replica_of_the_Stone_of_Scone%2C_Scone_Palace%2C_Scotland_%288924541883%29.jpg",
					width: 320,
					height: 240,
				},
				originalimage: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/1/1f/Replica_of_the_Stone_of_Scone%2C_Scone_Palace%2C_Scotland_%288924541883%29.jpg",
					width: 4000,
					height: 3000,
				},
				lang: "en",
				dir: "ltr",
				revision: "1031028078",
				tid: "db011740-d8c9-11eb-8755-a5a962405b75",
				timestamp: "2021-06-29T11:05:00Z",
				description: "Scottish stone block used in coronations for centuries",
				description_source: "local",
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Stone_of_Scone",
						revisions: "https://en.wikipedia.org/wiki/Stone_of_Scone?action=history",
						edit: "https://en.wikipedia.org/wiki/Stone_of_Scone?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Stone_of_Scone",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Stone_of_Scone",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Stone_of_Scone",
						edit: "https://en.m.wikipedia.org/wiki/Stone_of_Scone?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Stone_of_Scone",
					},
				},
				extract:
					"The Stone of Scone —also known as the Stone of Destiny, and often referred to in England as The Coronation Stone—is an oblong block of red sandstone that has been used for centuries in the coronation of the monarchs of Scotland. It is also known as Jacob's Pillow Stone and the Tanist Stone, and as clach-na-cinneamhain in Scottish Gaelic.",
				extract_html:
					"<p>The <b>Stone of Scone</b> —also known as the <b>Stone of Destiny</b>, and often referred to in England as <b>The Coronation Stone</b>—is an oblong block of red sandstone that has been used for centuries in the coronation of the monarchs of Scotland. It is also known as Jacob's Pillow Stone and the Tanist Stone, and as <i>clach-na-cinneamhain</i> in Scottish Gaelic.</p>",
				normalizedtitle: "Stone of Scone",
			},
		],
		year: 1996,
	},
	{
		text: "The Fatih Sultan Mehmet Bridge in Istanbul, Turkey is completed, providing the second connection between the continents of Europe and Asia over the Bosphorus.",
		pages: [
			{
				type: "standard",
				title: "Fatih_Sultan_Mehmet_Bridge",
				displaytitle: "Fatih Sultan Mehmet Bridge",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q369967",
				titles: {
					canonical: "Fatih_Sultan_Mehmet_Bridge",
					normalized: "Fatih Sultan Mehmet Bridge",
					display: "Fatih Sultan Mehmet Bridge",
				},
				pageid: 957768,
				thumbnail: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Fatih_Sultan_Mehmet_Bridge_panorama.jpg/320px-Fatih_Sultan_Mehmet_Bridge_panorama.jpg",
					width: 320,
					height: 172,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/5/52/Fatih_Sultan_Mehmet_Bridge_panorama.jpg",
					width: 4782,
					height: 2576,
				},
				lang: "en",
				dir: "ltr",
				revision: "1031236310",
				tid: "8b509b10-d9ac-11eb-9a42-0373a75090f7",
				timestamp: "2021-06-30T14:07:40Z",
				coordinates: {
					lat: 41.0913,
					lon: 29.062,
				},
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Fatih_Sultan_Mehmet_Bridge",
						revisions: "https://en.wikipedia.org/wiki/Fatih_Sultan_Mehmet_Bridge?action=history",
						edit: "https://en.wikipedia.org/wiki/Fatih_Sultan_Mehmet_Bridge?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Fatih_Sultan_Mehmet_Bridge",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Fatih_Sultan_Mehmet_Bridge",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Fatih_Sultan_Mehmet_Bridge",
						edit: "https://en.m.wikipedia.org/wiki/Fatih_Sultan_Mehmet_Bridge?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Fatih_Sultan_Mehmet_Bridge",
					},
				},
				extract:
					"The Fatih Sultan Mehmet Bridge, also known as the Second Bosphorus Bridge, is a bridge in Istanbul, Turkey spanning the Bosphorus strait. When completed in 1988, it was the 5th-longest suspension bridge span in the world; today it is the 24th.",
				extract_html:
					"<p>The <b>Fatih Sultan Mehmet Bridge</b>, also known as the <b>Second Bosphorus Bridge</b>, is a bridge in Istanbul, Turkey spanning the Bosphorus strait. When completed in 1988, it was the 5th-longest suspension bridge span in the world; today it is the 24th.</p>",
				normalizedtitle: "Fatih Sultan Mehmet Bridge",
			},
			{
				type: "standard",
				title: "Bosporus",
				displaytitle: "Bosporus",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q35958",
				titles: {
					canonical: "Bosporus",
					normalized: "Bosporus",
					display: "Bosporus",
				},
				pageid: 3705,
				thumbnail: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Europe_relief_laea_location_map.jpg/320px-Europe_relief_laea_location_map.jpg",
					width: 320,
					height: 274,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/7/79/Europe_relief_laea_location_map.jpg",
					width: 1580,
					height: 1351,
				},
				lang: "en",
				dir: "ltr",
				revision: "1030392818",
				tid: "3420c5a0-d5d7-11eb-aa69-9f1f66561e2c",
				timestamp: "2021-06-25T17:02:56Z",
				description: "Narrow strait in northwestern Turkey",
				description_source: "local",
				coordinates: {
					lat: 41.11944444,
					lon: 29.07527778,
				},
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Bosporus",
						revisions: "https://en.wikipedia.org/wiki/Bosporus?action=history",
						edit: "https://en.wikipedia.org/wiki/Bosporus?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Bosporus",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Bosporus",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Bosporus",
						edit: "https://en.m.wikipedia.org/wiki/Bosporus?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Bosporus",
					},
				},
				extract:
					"The Bosporus or Bosphorus, also known as the Strait of Istanbul, is a narrow, natural strait and an internationally significant waterway located in northwestern Turkey. It forms part of the continental boundary between Europe and Asia, and divides Turkey by separating Anatolia from Thrace. It is the world's narrowest strait used for international navigation. The Bosporus connects the Black Sea with the Sea of Marmara, and, by extension via the Dardanelles, the Aegean and Mediterranean seas, and by the Kerch Strait, the sea of Azov.",
				extract_html:
					"<p>The <b>Bosporus</b> or <b>Bosphorus</b>, also known as the <b>Strait of Istanbul</b>, is a narrow, natural strait and an internationally significant waterway located in northwestern Turkey. It forms part of the continental boundary between Europe and Asia, and divides Turkey by separating Anatolia from Thrace. It is the world's narrowest strait used for international navigation. The Bosporus connects the Black Sea with the Sea of Marmara, and, by extension via the Dardanelles, the Aegean and Mediterranean seas, and by the Kerch Strait, the sea of Azov.</p>",
				normalizedtitle: "Bosporus",
			},
		],
		year: 1988,
	},
	{
		text: "United States Navy warship USS Vincennes shoots down Iran Air Flight 655 over the Persian Gulf, killing all 290 people aboard.",
		pages: [
			{
				type: "standard",
				title: "United_States_Navy",
				displaytitle: "United States Navy",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q11220",
				titles: {
					canonical: "United_States_Navy",
					normalized: "United States Navy",
					display: "United States Navy",
				},
				pageid: 20518076,
				thumbnail: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Emblem_of_the_United_States_Navy.svg/320px-Emblem_of_the_United_States_Navy.svg.png",
					width: 320,
					height: 320,
				},
				originalimage: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Emblem_of_the_United_States_Navy.svg/720px-Emblem_of_the_United_States_Navy.svg.png",
					width: 720,
					height: 720,
				},
				lang: "en",
				dir: "ltr",
				revision: "1030961587",
				tid: "9a4ef650-db43-11eb-82c6-adad2381d8c5",
				timestamp: "2021-06-29T00:48:34Z",
				description: "Maritime service branch of the U.S. Armed Forces",
				description_source: "local",
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/United_States_Navy",
						revisions: "https://en.wikipedia.org/wiki/United_States_Navy?action=history",
						edit: "https://en.wikipedia.org/wiki/United_States_Navy?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:United_States_Navy",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/United_States_Navy",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/United_States_Navy",
						edit: "https://en.m.wikipedia.org/wiki/United_States_Navy?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:United_States_Navy",
					},
				},
				extract:
					"The United States Navy (USN) is the maritime service branch of the United States Armed Forces and one of the eight uniformed services of the United States. It is the largest and most powerful navy in the world, with the estimated tonnage of its active battle fleet alone exceeding the next 13 navies combined, including 11 U.S. allies or partner nations as of 2015. It has the highest combined battle fleet tonnage and the world's largest aircraft carrier fleet, with eleven in service, two new carriers under construction, and five other carriers planned. With 336,978 personnel on active duty and 101,583 in the Ready Reserve, the U.S. Navy is the third largest of the U.S. military service branches in terms of personnel. It has 290 deployable combat vessels and more than 3,700 operational aircraft as of June 2019.",
				extract_html:
					"<p>The <b>United States Navy</b> (<b>USN</b>) is the maritime service branch of the United States Armed Forces and one of the eight uniformed services of the United States. It is the largest and most powerful navy in the world, with the estimated tonnage of its active battle fleet alone exceeding the next 13 navies combined, including 11 U.S. allies or partner nations as of 2015. It has the highest combined battle fleet tonnage and the world's largest aircraft carrier fleet, with eleven in service, two new carriers under construction, and five other carriers planned. With 336,978 personnel on active duty and 101,583 in the Ready Reserve, the U.S. Navy is the third largest of the U.S. military service branches in terms of personnel. It has 290 deployable combat vessels and more than 3,700 operational aircraft as of June 2019.</p>",
				normalizedtitle: "United States Navy",
			},
			{
				type: "standard",
				title: "USS_Vincennes_(CG-49)",
				displaytitle: "USS <i>Vincennes</i> (CG-49)",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q385541",
				titles: {
					canonical: "USS_Vincennes_(CG-49)",
					normalized: "USS Vincennes (CG-49)",
					display: "USS <i>Vincennes</i> (CG-49)",
				},
				pageid: 211540,
				thumbnail: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/USS_Vincennes_returns_to_San_Diego_Oct_1988.jpg/320px-USS_Vincennes_returns_to_San_Diego_Oct_1988.jpg",
					width: 320,
					height: 208,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/0/06/USS_Vincennes_returns_to_San_Diego_Oct_1988.jpg",
					width: 2860,
					height: 1860,
				},
				lang: "en",
				dir: "ltr",
				revision: "1027703481",
				tid: "6e3b94d0-d623-11eb-8755-a5a962405b75",
				timestamp: "2021-06-09T13:51:30Z",
				description: "Ticonderoga-class cruiser",
				description_source: "local",
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/USS_Vincennes_(CG-49)",
						revisions: "https://en.wikipedia.org/wiki/USS_Vincennes_(CG-49)?action=history",
						edit: "https://en.wikipedia.org/wiki/USS_Vincennes_(CG-49)?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:USS_Vincennes_(CG-49)",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/USS_Vincennes_(CG-49)",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/USS_Vincennes_(CG-49)",
						edit: "https://en.m.wikipedia.org/wiki/USS_Vincennes_(CG-49)?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:USS_Vincennes_(CG-49)",
					},
				},
				extract:
					"USS Vincennes (CG-49) was a  Ticonderoga-class guided missile cruiser outfitted with the Aegis combat system that was in service with the United States Navy from July 1985 to June 2005. She was one of 27 ships of the Ticonderoga class constructed for the United States Navy, and one of five equipped with the Mark 26 Guided Missile Launching System.",
				extract_html:
					"<p><b>USS <i>Vincennes</i> (CG-49)</b> was a <span><i> Ticonderoga</i>-class</span> guided missile cruiser outfitted with the Aegis combat system that was in service with the United States Navy from July 1985 to June 2005. She was one of 27 ships of the <i>Ticonderoga</i> class constructed for the United States Navy, and one of five equipped with the Mark 26 Guided Missile Launching System.</p>",
				normalizedtitle: "USS Vincennes (CG-49)",
			},
			{
				type: "standard",
				title: "Iran_Air_Flight_655",
				displaytitle: "Iran Air Flight 655",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q743060",
				titles: {
					canonical: "Iran_Air_Flight_655",
					normalized: "Iran Air Flight 655",
					display: "Iran Air Flight 655",
				},
				pageid: 390520,
				thumbnail: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/A300_Iran_Air_EP-IBT_THR_May_2010.jpg/320px-A300_Iran_Air_EP-IBT_THR_May_2010.jpg",
					width: 320,
					height: 213,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/9/9a/A300_Iran_Air_EP-IBT_THR_May_2010.jpg",
					width: 1021,
					height: 680,
				},
				lang: "en",
				dir: "ltr",
				revision: "1031018528",
				tid: "5fd86100-db43-11eb-a42d-dd8f7336f054",
				timestamp: "2021-06-29T09:33:43Z",
				description: "1988 scheduled civilian flight shot down by the United States Navy en route to Dubai from Tehran",
				description_source: "local",
				coordinates: {
					lat: 26.66833333,
					lon: 56.04472222,
				},
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Iran_Air_Flight_655",
						revisions: "https://en.wikipedia.org/wiki/Iran_Air_Flight_655?action=history",
						edit: "https://en.wikipedia.org/wiki/Iran_Air_Flight_655?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Iran_Air_Flight_655",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Iran_Air_Flight_655",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Iran_Air_Flight_655",
						edit: "https://en.m.wikipedia.org/wiki/Iran_Air_Flight_655?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Iran_Air_Flight_655",
					},
				},
				extract:
					"Iran Air Flight 655 was a scheduled passenger flight from Tehran to Dubai via Bandar Abbas that was shot down on 3 July 1988 by an SM-2MR surface-to-air missile fired from USS Vincennes, a guided-missile cruiser of the United States Navy. The aircraft, an Airbus A300, was destroyed and all 290 people on board were killed. The jet was hit while flying over Iran's territorial waters in the Persian Gulf, along the flight's usual route, shortly after departing Bandar Abbas International Airport, the flight's stopover location. The incident occurred during the Iran–Iraq War, which had been continuing for nearly eight years. Vincennes had entered Iranian territory after one of its helicopters drew warning fire from Iranian speedboats operating within Iranian territorial limits.",
				extract_html:
					"<p><b>Iran Air Flight 655</b> was a scheduled passenger flight from Tehran to Dubai via Bandar Abbas that was shot down on 3<span class=\"nowrap\"> </span>July 1988 by an SM-2MR surface-to-air missile fired from <span>USS <i>Vincennes</i></span>, a guided-missile cruiser of the United States Navy. The aircraft, an Airbus A300, was destroyed and all 290 people on board were killed. The jet was hit while flying over Iran's territorial waters in the Persian Gulf, along the flight's usual route, shortly after departing Bandar Abbas International Airport, the flight's stopover location. The incident occurred during the Iran–Iraq War, which had been continuing for nearly eight years. <i>Vincennes</i> had entered Iranian territory after one of its helicopters drew warning fire from Iranian speedboats operating within Iranian territorial limits.</p>",
				normalizedtitle: "Iran Air Flight 655",
			},
			{
				type: "standard",
				title: "Persian_Gulf",
				displaytitle: "Persian Gulf",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q34675",
				titles: {
					canonical: "Persian_Gulf",
					normalized: "Persian Gulf",
					display: "Persian Gulf",
				},
				pageid: 24761,
				thumbnail: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/PersianGulf_vue_satellite_du_golfe_persique.jpg/246px-PersianGulf_vue_satellite_du_golfe_persique.jpg",
					width: 246,
					height: 320,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/b/be/PersianGulf_vue_satellite_du_golfe_persique.jpg",
					width: 4000,
					height: 5200,
				},
				lang: "en",
				dir: "ltr",
				revision: "1031582929",
				tid: "74748030-db2f-11eb-ba33-ff54b8408584",
				timestamp: "2021-07-02T12:17:14Z",
				description: "Arm of the Indian Ocean in western Asia",
				description_source: "local",
				coordinates: {
					lat: 26,
					lon: 52,
				},
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Persian_Gulf",
						revisions: "https://en.wikipedia.org/wiki/Persian_Gulf?action=history",
						edit: "https://en.wikipedia.org/wiki/Persian_Gulf?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Persian_Gulf",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Persian_Gulf",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Persian_Gulf",
						edit: "https://en.m.wikipedia.org/wiki/Persian_Gulf?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Persian_Gulf",
					},
				},
				extract:
					"The Persian Gulf is a mediterranean sea in Western Asia. The body of water is an extension of the Arabian Sea through the Strait of Hormuz and lies between Iran to the northeast and the Arabian Peninsula to the southwest. The Shatt al-Arab river delta forms the northwest shoreline.",
				extract_html:
					"<p>The <b>Persian Gulf</b> is a mediterranean sea in Western Asia. The body of water is an extension of the Arabian Sea through the Strait of Hormuz and lies between Iran to the northeast and the Arabian Peninsula to the southwest. The Shatt al-Arab river delta forms the northwest shoreline.</p>",
				normalizedtitle: "Persian Gulf",
			},
		],
		year: 1988,
	},
	{
		text: "U.S. President Jimmy Carter signs the first directive for secret aid to the opponents of the pro-Soviet regime in Kabul.",
		pages: [
			{
				type: "standard",
				title: "Jimmy_Carter",
				displaytitle: "Jimmy Carter",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q23685",
				titles: {
					canonical: "Jimmy_Carter",
					normalized: "Jimmy Carter",
					display: "Jimmy Carter",
				},
				pageid: 15992,
				thumbnail: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/JimmyCarterPortrait_%28cropped%29.jpg/240px-JimmyCarterPortrait_%28cropped%29.jpg",
					width: 240,
					height: 320,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/e/ea/JimmyCarterPortrait_%28cropped%29.jpg",
					width: 1809,
					height: 2411,
				},
				lang: "en",
				dir: "ltr",
				revision: "1030060830",
				tid: "1d64d040-db68-11eb-90ef-03384ae764c7",
				timestamp: "2021-06-23T16:54:16Z",
				description: "39th president of the United States",
				description_source: "local",
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Jimmy_Carter",
						revisions: "https://en.wikipedia.org/wiki/Jimmy_Carter?action=history",
						edit: "https://en.wikipedia.org/wiki/Jimmy_Carter?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Jimmy_Carter",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Jimmy_Carter",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Jimmy_Carter",
						edit: "https://en.m.wikipedia.org/wiki/Jimmy_Carter?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Jimmy_Carter",
					},
				},
				extract:
					"James Earl Carter Jr. is an American philanthropist, former politician and businessman who served as the 39th president of the United States from 1977 to 1981. A member of the Democratic Party, he previously served as a Georgia State Senator from 1963 to 1967 and as the 76th governor of Georgia from 1971 to 1975. Since leaving the presidency, Carter has remained engaged in political and social projects as a private citizen. In 2002, he was awarded the Nobel Peace Prize for his work in co-founding The Carter Center.",
				extract_html:
					"<p><b>James Earl Carter Jr.</b> is an American philanthropist, former politician and businessman who served as the 39th president of the United States from 1977 to 1981. A member of the Democratic Party, he previously served as a Georgia State Senator from 1963 to 1967 and as the 76th governor of Georgia from 1971 to 1975. Since leaving the presidency, Carter has remained engaged in political and social projects as a private citizen. In 2002, he was awarded the Nobel Peace Prize for his work in co-founding The Carter Center.</p>",
				normalizedtitle: "Jimmy Carter",
			},
			{
				type: "standard",
				title: "Operation_Cyclone",
				displaytitle: "Operation Cyclone",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q1585785",
				titles: {
					canonical: "Operation_Cyclone",
					normalized: "Operation Cyclone",
					display: "Operation Cyclone",
				},
				pageid: 8868782,
				lang: "en",
				dir: "ltr",
				revision: "1031072445",
				tid: "6019c840-d8fd-11eb-86c6-7fe7795e2e45",
				timestamp: "2021-06-29T17:13:46Z",
				description: "1979–1989 CIA program to fund Islamic jihadists in the Soviet–Afghan War",
				description_source: "local",
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Operation_Cyclone",
						revisions: "https://en.wikipedia.org/wiki/Operation_Cyclone?action=history",
						edit: "https://en.wikipedia.org/wiki/Operation_Cyclone?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Operation_Cyclone",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Operation_Cyclone",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Operation_Cyclone",
						edit: "https://en.m.wikipedia.org/wiki/Operation_Cyclone?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Operation_Cyclone",
					},
				},
				extract:
					"Operation Cyclone was the code name for the United States Central Intelligence Agency (CIA) program to arm and finance the mujahideen in Afghanistan from 1979 to 1989, prior to and during the military intervention by the USSR in support of its client, the Democratic Republic of Afghanistan. The mujahideen were also supported by Britain's MI6, who conducted separate covert actions. The program leaned heavily towards supporting militant Islamic groups, including groups with jihadist ties, that were favored by the regime of Muhammad Zia-ul-Haq in neighboring Pakistan, rather than other, less ideological Afghan resistance groups that had also been fighting the Soviet-oriented Democratic Republic of Afghanistan regime since before the Soviet intervention.",
				extract_html:
					"<p><b>Operation Cyclone</b> was the code name for the United States Central Intelligence Agency (CIA) program to arm and finance the mujahideen in Afghanistan from 1979 to 1989, prior to and during the military intervention by the USSR in support of its client, the Democratic Republic of Afghanistan. The mujahideen were also supported by Britain's MI6, who conducted separate covert actions. The program leaned heavily towards supporting militant Islamic groups, including groups with jihadist ties, that were favored by the regime of Muhammad Zia-ul-Haq in neighboring Pakistan, rather than other, less ideological Afghan resistance groups that had also been fighting the Soviet-oriented Democratic Republic of Afghanistan regime since before the Soviet intervention.</p>",
				normalizedtitle: "Operation Cyclone",
			},
		],
		year: 1979,
	},
	{
		text: "Dan-Air Flight 1903 crashes into the Les Agudes mountain in the Montseny Massif near the village of Arbúcies in Catalonia, Spain, killing all 112 people aboard.",
		pages: [
			{
				type: "standard",
				title: "Dan-Air_Flight_1903",
				displaytitle: "Dan-Air Flight 1903",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q8186827",
				titles: {
					canonical: "Dan-Air_Flight_1903",
					normalized: "Dan-Air Flight 1903",
					display: "Dan-Air Flight 1903",
				},
				pageid: 34018395,
				thumbnail: {
					source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/BOAC_Comet_Manteufel.jpg/320px-BOAC_Comet_Manteufel.jpg",
					width: 320,
					height: 213,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/8/85/BOAC_Comet_Manteufel.jpg",
					width: 1024,
					height: 681,
				},
				lang: "en",
				dir: "ltr",
				revision: "1031398046",
				tid: "8e34fb70-da5e-11eb-a59d-cdcfd7f4f80b",
				timestamp: "2021-07-01T11:21:58Z",
				description: "1970 aviation accident",
				description_source: "local",
				coordinates: {
					lat: 41.79583333,
					lon: 2.45944444,
				},
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Dan-Air_Flight_1903",
						revisions: "https://en.wikipedia.org/wiki/Dan-Air_Flight_1903?action=history",
						edit: "https://en.wikipedia.org/wiki/Dan-Air_Flight_1903?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Dan-Air_Flight_1903",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Dan-Air_Flight_1903",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Dan-Air_Flight_1903",
						edit: "https://en.m.wikipedia.org/wiki/Dan-Air_Flight_1903?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Dan-Air_Flight_1903",
					},
				},
				extract:
					"Dan-Air Flight 1903 was a de Havilland Comet 4 aircraft operated by Dan Air Services Limited that, on Friday, 3 July 1970, crashed into the wooded slopes of the Serralada del Montseny near Arbúcies, in the Province of Girona of Catalonia, Spain. The flight was on a non-scheduled international passenger service from Manchester to Barcelona. British tour operator Clarksons Holidays had contracted the aircraft to carry a group of holidaymakers who had booked an all-inclusive package holiday with the operator. The crash resulted in the aircraft's destruction and the deaths of all 112 on board. It was the deadliest aviation accident in 1970, and remains the deadliest aviation accident involving the De Havilland Comet.",
				extract_html:
					"<p><b>Dan-Air Flight 1903</b> was a de Havilland Comet 4 aircraft operated by Dan Air Services Limited that, on Friday, 3 July 1970, crashed into the wooded slopes of the Serralada del Montseny near Arbúcies, in the Province of Girona of Catalonia, Spain. The flight was on a non-scheduled international passenger service from Manchester to Barcelona. British tour operator Clarksons Holidays had contracted the aircraft to carry a group of holidaymakers who had booked an all-inclusive package holiday with the operator. The crash resulted in the aircraft's destruction and the deaths of all 112 on board. It was the deadliest aviation accident in 1970, and remains the deadliest aviation accident involving the De Havilland Comet.</p>",
				normalizedtitle: "Dan-Air Flight 1903",
			},
			{
				type: "standard",
				title: "Les_Agudes",
				displaytitle: "Les Agudes",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q6529125",
				titles: {
					canonical: "Les_Agudes",
					normalized: "Les Agudes",
					display: "Les Agudes",
				},
				pageid: 27439920,
				thumbnail: {
					source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Les_agudes.jpg/320px-Les_agudes.jpg",
					width: 320,
					height: 214,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Les_agudes.jpg",
					width: 1600,
					height: 1071,
				},
				lang: "en",
				dir: "ltr",
				revision: "911531874",
				tid: "776a5770-caa3-11eb-bb26-0f019c3e2c9b",
				timestamp: "2019-08-19T13:39:46Z",
				coordinates: {
					lat: 41.78944444,
					lon: 2.44388889,
				},
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Les_Agudes",
						revisions: "https://en.wikipedia.org/wiki/Les_Agudes?action=history",
						edit: "https://en.wikipedia.org/wiki/Les_Agudes?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Les_Agudes",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Les_Agudes",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Les_Agudes",
						edit: "https://en.m.wikipedia.org/wiki/Les_Agudes?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Les_Agudes",
					},
				},
				extract:
					"Les Agudes is a mountain of Catalonia, Spain. It has an elevation of 1,706 metres above sea level. It is straddling the municipalities of Arbúcies in the Selva comarca and Fogars de Montclús and Montseny in the Vallès Oriental.",
				extract_html:
					"<p><b>Les Agudes</b> is a mountain of Catalonia, Spain. It has an elevation of 1,706 metres above sea level. It is straddling the municipalities of Arbúcies in the Selva <i>comarca</i> and Fogars de Montclús and Montseny in the Vallès Oriental.</p>",
				normalizedtitle: "Les Agudes",
			},
			{
				type: "standard",
				title: "Montseny_Massif",
				displaytitle: "Montseny Massif",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q937042",
				titles: {
					canonical: "Montseny_Massif",
					normalized: "Montseny Massif",
					display: "Montseny Massif",
				},
				pageid: 7473647,
				thumbnail: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Les_Agudes_des_del_Matagalls_P1230682.JPG/320px-Les_Agudes_des_del_Matagalls_P1230682.JPG",
					width: 320,
					height: 240,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Les_Agudes_des_del_Matagalls_P1230682.JPG",
					width: 3264,
					height: 2448,
				},
				lang: "en",
				dir: "ltr",
				revision: "933963014",
				tid: "47ddb440-ca92-11eb-9f51-cd251dcb5c8e",
				timestamp: "2020-01-03T23:52:19Z",
				coordinates: {
					lat: 41.79333333,
					lon: 2.40305556,
				},
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Montseny_Massif",
						revisions: "https://en.wikipedia.org/wiki/Montseny_Massif?action=history",
						edit: "https://en.wikipedia.org/wiki/Montseny_Massif?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Montseny_Massif",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Montseny_Massif",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Montseny_Massif",
						edit: "https://en.m.wikipedia.org/wiki/Montseny_Massif?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Montseny_Massif",
					},
				},
				extract: "Montseny is a mountain range west of the coastal hills north of Barcelona. It is part of the Catalan Pre-Coastal Range.",
				extract_html:
					"<p><b>Montseny</b> is a mountain range west of the coastal hills north of Barcelona. It is part of the Catalan Pre-Coastal Range.</p>",
				normalizedtitle: "Montseny Massif",
			},
			{
				type: "standard",
				title: "Arbúcies",
				displaytitle: "Arbúcies",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q13010",
				titles: {
					canonical: "Arbúcies",
					normalized: "Arbúcies",
					display: "Arbúcies",
				},
				pageid: 32999971,
				thumbnail: {
					source: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Arb%C3%BAcies.JPG/320px-Arb%C3%BAcies.JPG",
					width: 320,
					height: 213,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Arb%C3%BAcies.JPG",
					width: 3008,
					height: 2000,
				},
				lang: "en",
				dir: "ltr",
				revision: "993623835",
				tid: "579ee930-d50f-11eb-8707-a18e58c8e57a",
				timestamp: "2020-12-11T16:12:32Z",
				description: "Municipality in Catalonia, Spain",
				description_source: "local",
				coordinates: {
					lat: 41.81777778,
					lon: 2.51694444,
				},
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Arb%C3%BAcies",
						revisions: "https://en.wikipedia.org/wiki/Arb%C3%BAcies?action=history",
						edit: "https://en.wikipedia.org/wiki/Arb%C3%BAcies?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Arb%C3%BAcies",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Arb%C3%BAcies",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Arb%C3%BAcies",
						edit: "https://en.m.wikipedia.org/wiki/Arb%C3%BAcies?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Arb%C3%BAcies",
					},
				},
				extract:
					"Arbúcies is a village in the province of Girona, in the autonomous community of Catalonia, Spain. The municipality covers an area of 86.24 square kilometres (33.30 sq mi) with a population of 6481 in 2014.",
				extract_html:
					"<p><b>Arbúcies</b> is a village in the province of Girona, in the autonomous community of Catalonia, Spain. The municipality covers an area of 86.24 square kilometres (33.30 sq mi) with a population of 6481 in 2014.</p>",
				normalizedtitle: "Arbúcies",
			},
			{
				type: "standard",
				title: "Catalonia",
				displaytitle: "Catalonia",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q5705",
				titles: {
					canonical: "Catalonia",
					normalized: "Catalonia",
					display: "Catalonia",
				},
				pageid: 6822,
				thumbnail: {
					source: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Catalonia.svg/320px-Flag_of_Catalonia.svg.png",
					width: 320,
					height: 213,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Catalonia.svg/810px-Flag_of_Catalonia.svg.png",
					width: 810,
					height: 540,
				},
				lang: "en",
				dir: "ltr",
				revision: "1029825019",
				tid: "55b46860-d53d-11eb-82eb-4b528d53f9a5",
				timestamp: "2021-06-22T07:33:27Z",
				description: "Autonomous community in northeastern Spain",
				description_source: "local",
				coordinates: {
					lat: 41.81666667,
					lon: 1.46666667,
				},
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Catalonia",
						revisions: "https://en.wikipedia.org/wiki/Catalonia?action=history",
						edit: "https://en.wikipedia.org/wiki/Catalonia?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Catalonia",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Catalonia",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Catalonia",
						edit: "https://en.m.wikipedia.org/wiki/Catalonia?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Catalonia",
					},
				},
				extract: "Catalonia is an autonomous community in the northeastern corner of Spain, designated as a nationality by its Statute of Autonomy.",
				extract_html:
					"<p><b>Catalonia</b> is an autonomous community in the northeastern corner of Spain, designated as a <i>nationality</i> by its Statute of Autonomy.</p>",
				normalizedtitle: "Catalonia",
			},
			{
				type: "standard",
				title: "Spain",
				displaytitle: "Spain",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q29",
				titles: {
					canonical: "Spain",
					normalized: "Spain",
					display: "Spain",
				},
				pageid: 26667,
				thumbnail: {
					source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Bandera_de_Espa%C3%B1a.svg/320px-Bandera_de_Espa%C3%B1a.svg.png",
					width: 320,
					height: 213,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Bandera_de_Espa%C3%B1a.svg/750px-Bandera_de_Espa%C3%B1a.svg.png",
					width: 750,
					height: 500,
				},
				lang: "en",
				dir: "ltr",
				revision: "1031246084",
				tid: "9a93d660-d9b5-11eb-97fd-bd5be961be2e",
				timestamp: "2021-06-30T15:12:14Z",
				description: "Country in Southwestern Europe",
				description_source: "local",
				coordinates: {
					lat: 40,
					lon: -4,
				},
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Spain",
						revisions: "https://en.wikipedia.org/wiki/Spain?action=history",
						edit: "https://en.wikipedia.org/wiki/Spain?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Spain",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Spain",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Spain",
						edit: "https://en.m.wikipedia.org/wiki/Spain?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Spain",
					},
				},
				extract:
					"Spain, formally the Kingdom of Spain, is a country in Southwestern Europe with some pockets of territory across the Strait of Gibraltar and the Atlantic Ocean. Its continental European territory is situated on the Iberian Peninsula. Its territory also includes two archipelagos: the Canary Islands off the coast of North Africa, and the Balearic Islands in the Mediterranean Sea. The African exclaves of Ceuta, Melilla, and Peñón de Vélez de la Gomera make Spain the only European country to have a physical border with an African country (Morocco). Several small islands in the Alboran Sea are also part of Spanish territory. The country's mainland is bordered to the south and east by the Mediterranean Sea; to the north and northeast by France, Andorra, and the Bay of Biscay; and to the west and northwest by Portugal and the Atlantic Ocean respectively.",
				extract_html:
					"<p><b>Spain</b>, formally the <b>Kingdom of Spain</b>, is a country in Southwestern Europe with some pockets of territory across the Strait of Gibraltar and the Atlantic Ocean. Its continental European territory is situated on the Iberian Peninsula. Its territory also includes two archipelagos: the Canary Islands off the coast of North Africa, and the Balearic Islands in the Mediterranean Sea. The African exclaves of Ceuta, Melilla, and Peñón de Vélez de la Gomera make Spain the only European country to have a physical border with an African country (Morocco). Several small islands in the Alboran Sea are also part of Spanish territory. The country's mainland is bordered to the south and east by the Mediterranean Sea; to the north and northeast by France, Andorra, and the Bay of Biscay; and to the west and northwest by Portugal and the Atlantic Ocean respectively.</p>",
				normalizedtitle: "Spain",
			},
			{
				type: "standard",
				title: "July_3",
				displaytitle: "July 3",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q2699",
				titles: {
					canonical: "July_3",
					normalized: "July 3",
					display: "July 3",
				},
				pageid: 15848,
				lang: "en",
				dir: "ltr",
				revision: "1031623312",
				tid: "1e603320-db5b-11eb-9c9e-fbee7470a275",
				timestamp: "2021-07-02T17:29:50Z",
				description: "Date",
				description_source: "local",
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/July_3",
						revisions: "https://en.wikipedia.org/wiki/July_3?action=history",
						edit: "https://en.wikipedia.org/wiki/July_3?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:July_3",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/July_3",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/July_3",
						edit: "https://en.m.wikipedia.org/wiki/July_3?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:July_3",
					},
				},
				extract: "July 3 is the 184th day of the year in the Gregorian calendar; 181 days remain until the end of the year.",
				extract_html: "<p><b>July 3</b> is the 184th day of the year in the Gregorian calendar; 181 days remain until the end of the year.</p>",
				normalizedtitle: "July 3",
			},
		],
		year: 1970,
	},
	{
		text: 'The Troubles: The "Falls Curfew" begins in Belfast, Northern Ireland.',
		pages: [
			{
				type: "standard",
				title: "The_Troubles",
				displaytitle: "The Troubles",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q815436",
				titles: {
					canonical: "The_Troubles",
					normalized: "The Troubles",
					display: "The Troubles",
				},
				pageid: 30770,
				thumbnail: {
					source: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Map_of_Ireland%27s_capitals.png/251px-Map_of_Ireland%27s_capitals.png",
					width: 251,
					height: 320,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Map_of_Ireland%27s_capitals.png",
					width: 1630,
					height: 2078,
				},
				lang: "en",
				dir: "ltr",
				revision: "1031607769",
				tid: "3ceb79a0-db4a-11eb-841d-4d33904e4b4b",
				timestamp: "2021-07-02T15:28:44Z",
				description: "1960s–1998 ethno-nationalist conflict in Northern Ireland",
				description_source: "local",
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/The_Troubles",
						revisions: "https://en.wikipedia.org/wiki/The_Troubles?action=history",
						edit: "https://en.wikipedia.org/wiki/The_Troubles?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:The_Troubles",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/The_Troubles",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/The_Troubles",
						edit: "https://en.m.wikipedia.org/wiki/The_Troubles?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:The_Troubles",
					},
				},
				extract:
					'The Troubles were an ethno-nationalist period of conflict in Northern Ireland that lasted about 30 years from the late 1960s to the late 1990s. Also known internationally as the Northern Ireland conflict, it is sometimes described as an "irregular war" or "low-level war". The conflict began in the late 1960s and is usually deemed to have ended with the Good Friday Agreement of 1998. Although the Troubles mostly took place in Northern Ireland, at times the violence spilled over into parts of the Republic of Ireland, England, and mainland Europe.',
				extract_html:
					'<p><b>The Troubles</b> were an ethno-nationalist period of conflict in Northern Ireland that lasted about 30 years from the late 1960s to the late 1990s. Also known internationally as the <b>Northern Ireland conflict</b>, it is sometimes described as an "irregular war" or "low-level war". The conflict began in the late 1960s and is usually deemed to have ended with the Good Friday Agreement of 1998. Although the Troubles mostly took place in Northern Ireland, at times the violence spilled over into parts of the Republic of Ireland, England, and mainland Europe.</p>',
				normalizedtitle: "The Troubles",
			},
			{
				type: "standard",
				title: "Falls_Curfew",
				displaytitle: "Falls Curfew",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q1394698",
				titles: {
					canonical: "Falls_Curfew",
					normalized: "Falls Curfew",
					display: "Falls Curfew",
				},
				pageid: 9344058,
				thumbnail: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Divis_Street_Murals%2C_Belfast%2C_May_2011_%2807%29.JPG/320px-Divis_Street_Murals%2C_Belfast%2C_May_2011_%2807%29.JPG",
					width: 320,
					height: 213,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Divis_Street_Murals%2C_Belfast%2C_May_2011_%2807%29.JPG",
					width: 4272,
					height: 2848,
				},
				lang: "en",
				dir: "ltr",
				revision: "1016999425",
				tid: "03da45e0-d3e5-11eb-a215-a7ff5d647714",
				timestamp: "2021-04-10T06:40:08Z",
				description: "British Army operation in Belfast in 1970",
				description_source: "local",
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Falls_Curfew",
						revisions: "https://en.wikipedia.org/wiki/Falls_Curfew?action=history",
						edit: "https://en.wikipedia.org/wiki/Falls_Curfew?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Falls_Curfew",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Falls_Curfew",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Falls_Curfew",
						edit: "https://en.m.wikipedia.org/wiki/Falls_Curfew?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Falls_Curfew",
					},
				},
				extract:
					"The Falls Curfew, also called the Battle of the Falls, was a British Army operation during 3–5 July 1970 in the Falls district of Belfast, Northern Ireland. The operation began as a search for weapons in the staunchly Irish nationalist district. As the search ended, local youths attacked the British soldiers with stones and petrol bombs and the soldiers responded with CS gas. This quickly developed into gun battles between British soldiers and the Irish Republican Army (IRA). After four hours of continuous clashes, the British commander sealed off the area, which comprised 3,000 homes, and imposed a curfew which would last for 36 hours. Thousands of British troops moved into the curfew zone and carried out house-to-house searches for weapons, while coming under intermittent attack from the IRA and rioters. The searches caused much destruction, and a large amount of CS gas was fired into the area. Many residents complained of suffering abuse at the hands of the soldiers. On 5 July, the curfew was brought to an end when thousands of women and children from Andersonstown marched into the curfew zone with food and other supplies for the locals.",
				extract_html:
					"<p>The <b>Falls Curfew</b>, also called the <b>Battle of the Falls</b>, was a British Army operation during 3–5 July 1970 in the Falls district of Belfast, Northern Ireland. The operation began as a search for weapons in the staunchly Irish nationalist district. As the search ended, local youths attacked the British soldiers with stones and petrol bombs and the soldiers responded with CS gas. This quickly developed into gun battles between British soldiers and the Irish Republican Army (IRA). After four hours of continuous clashes, the British commander sealed off the area, which comprised 3,000 homes, and imposed a curfew which would last for 36 hours. Thousands of British troops moved into the curfew zone and carried out house-to-house searches for weapons, while coming under intermittent attack from the IRA and rioters. The searches caused much destruction, and a large amount of CS gas was fired into the area. Many residents complained of suffering abuse at the hands of the soldiers. On 5 July, the curfew was brought to an end when thousands of women and children from Andersonstown marched into the curfew zone with food and other supplies for the locals.</p>",
				normalizedtitle: "Falls Curfew",
			},
			{
				type: "standard",
				title: "Belfast",
				displaytitle: "Belfast",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q10686",
				titles: {
					canonical: "Belfast",
					normalized: "Belfast",
					display: "Belfast",
				},
				pageid: 5046,
				thumbnail: {
					source: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Wikibelfast1.jpg/254px-Wikibelfast1.jpg",
					width: 254,
					height: 320,
				},
				originalimage: {
					source: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Wikibelfast1.jpg",
					width: 586,
					height: 737,
				},
				lang: "en",
				dir: "ltr",
				revision: "1030505952",
				tid: "03cea7f0-d668-11eb-b4f3-ab338388251a",
				timestamp: "2021-06-26T10:19:07Z",
				description: "Capital and chief port of Northern Ireland",
				description_source: "local",
				coordinates: {
					lat: 54.59638889,
					lon: -5.93,
				},
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Belfast",
						revisions: "https://en.wikipedia.org/wiki/Belfast?action=history",
						edit: "https://en.wikipedia.org/wiki/Belfast?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Belfast",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Belfast",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Belfast",
						edit: "https://en.m.wikipedia.org/wiki/Belfast?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Belfast",
					},
				},
				extract:
					"Belfast is the capital and largest city of Northern Ireland, standing on the banks of the River Lagan on the east coast. It is the 12th-largest city in the United Kingdom and the second-largest in Ireland. It had a population of 343,542 as of 2019. Belfast suffered greatly during the violence that accompanied the partition of Ireland, and especially during the more recent conflict known as the Troubles.",
				extract_html:
					"<p><b>Belfast</b> is the capital and largest city of Northern Ireland, standing on the banks of the River Lagan on the east coast. It is the 12th-largest city in the United Kingdom and the second-largest in Ireland. It had a population of 343,542 as of 2019. Belfast suffered greatly during the violence that accompanied the partition of Ireland, and especially during the more recent conflict known as the Troubles.</p>",
				normalizedtitle: "Belfast",
			},
			{
				type: "standard",
				title: "Northern_Ireland",
				displaytitle: "Northern Ireland",
				namespace: {
					id: 0,
					text: "",
				},
				wikibase_item: "Q26",
				titles: {
					canonical: "Northern_Ireland",
					normalized: "Northern Ireland",
					display: "Northern Ireland",
				},
				pageid: 21265,
				thumbnail: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Northern_Ireland_in_the_UK_and_Europe.svg/320px-Northern_Ireland_in_the_UK_and_Europe.svg.png",
					width: 320,
					height: 269,
				},
				originalimage: {
					source:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Northern_Ireland_in_the_UK_and_Europe.svg/2045px-Northern_Ireland_in_the_UK_and_Europe.svg.png",
					width: 2045,
					height: 1720,
				},
				lang: "en",
				dir: "ltr",
				revision: "1030503929",
				tid: "64cd3ce0-d7fa-11eb-8620-61ef2f1f0557",
				timestamp: "2021-06-26T09:57:01Z",
				description: "Part of the United Kingdom situated on the island of Ireland",
				description_source: "local",
				coordinates: {
					lat: 54.66666667,
					lon: -6.66666667,
				},
				content_urls: {
					desktop: {
						page: "https://en.wikipedia.org/wiki/Northern_Ireland",
						revisions: "https://en.wikipedia.org/wiki/Northern_Ireland?action=history",
						edit: "https://en.wikipedia.org/wiki/Northern_Ireland?action=edit",
						talk: "https://en.wikipedia.org/wiki/Talk:Northern_Ireland",
					},
					mobile: {
						page: "https://en.m.wikipedia.org/wiki/Northern_Ireland",
						revisions: "https://en.m.wikipedia.org/wiki/Special:History/Northern_Ireland",
						edit: "https://en.m.wikipedia.org/wiki/Northern_Ireland?action=edit",
						talk: "https://en.m.wikipedia.org/wiki/Talk:Northern_Ireland",
					},
				},
				extract:
					"Northern Ireland is a part of the United Kingdom that is variously described as a country, province, territory or region. Located in the northeast of the island of Ireland, Northern Ireland shares a border to the south and west with the Republic of Ireland. In 2011, its population was 1,810,863, constituting about 30% of the island's population and about 3% of the UK's population. The Northern Ireland Assembly, established by the Northern Ireland Act 1998, holds responsibility for a range of devolved policy matters, while other areas are reserved for the British government. Northern Ireland co-operates with the Republic of Ireland in several areas.",
				extract_html:
					"<p><b>Northern Ireland</b> is a part of the United Kingdom that is variously described as a country, province, territory or region. Located in the northeast of the island of Ireland, Northern Ireland shares a border to the south and west with the Republic of Ireland. In 2011, its population was 1,810,863, constituting about 30% of the island's population and about 3% of the UK's population. The Northern Ireland Assembly, established by the Northern Ireland Act 1998, holds responsibility for a range of devolved policy matters, while other areas are reserved for the British government. Northern Ireland co-operates with the Republic of Ireland in several areas.</p>",
				normalizedtitle: "Northern Ireland",
			},
		],
		year: 1970,
	},
];

// 默认新闻数据对象
const defaultNewsData = {
	status: "ok",
	totalResults: 44,
	articles: [
		{
			source: {
				id: null,
				name: "India Today",
			},
			author: null,
			title: "Bengaluru civic staff 'force' people to take Covid-19 test before vaccination - India Today",
			description:
				"Staff at various Bruhat Bengaluru Mahanagara Palike (BBMP) primary health centres allegedly forced people to undergo Covid-19 test before vaccination.",
			url: "https://www.indiatoday.in/cities/bengaluru/story/bengaluru-civic-staff-forces-people-to-take-covid-19-test-before-vaccination-1822949-2021-07-02",
			urlToImage: "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202107/covidtest-647x363.jpeg?3uy6iSvPrnjelTWbMi4rR3LbId4ge3Vj",
			publishedAt: "2021-07-02T06:31:50Z",
			content: null,
		},
		{
			source: {
				id: "the-times-of-india",
				name: "The Times of India",
			},
			author: "TIMESOFINDIA.COM",
			title: "Coronavirus vaccine: How side-effects differ in younger people and older people, as per studies - Times of India",
			description:
				"Side-effects with the vaccine, which are usually said to be inflammatory reactions, could also differ based on gender, one's age and the type of vaccine one gets.",
			url: "https://timesofindia.indiatimes.com/life-style/health-fitness/health-news/coronavirus-vaccine-how-side-effects-differ-in-younger-people-and-older-people-as-per-studies/photostory/84038767.cms",
			urlToImage: "https://static.toiimg.com/photo/84039002.cms",
			publishedAt: "2021-07-02T05:30:00Z",
			content:
				"Our immunity is at its peak when we are young- in a way, it also makes younger people, i.e. those below the age of 50 less vulnerable to illnesses and frail health. However, as with a vaccine, a 'hea… [+1051 chars]",
		},
		{
			source: {
				id: null,
				name: "Moneycontrol",
			},
			author: null,
			title: "Johnson & Johnson says its single-shot COVID-19 vaccine offers durable protection against Delta, other... - Moneycontrol",
			description:
				"The data from Johnson & Johnson showed that the durability of the immune response lasted through at least eight months, the length of time evaluated to date.",
			url: "https://www.moneycontrol.com/news/business/companies/johnson-johnson-says-its-single-shot-covid-19-vaccine-offers-durable-protection-against-delta-other-variants-7116351.html",
			urlToImage: "https://images.moneycontrol.com/static-mcnews/2021/03/JJ-vaccine_who-770x433.jpg",
			publishedAt: "2021-07-02T04:37:20Z",
			content:
				"Johnson &amp; Johnson (J&amp;J), on July 2, said that its single-shot COVID-19 vaccine had generated strong, persistent activity against the rapidly spreading Delta variant and other highly prevalent… [+5116 chars]",
		},
		{
			source: {
				id: null,
				name: "Free Press Journal",
			},
			author: "IANS",
			title: "Covid infection in your pet dogs, cats may be common than thought - Free Press Journal",
			description:
				"Are you Covid-positive? Stay away from your feline and pooch friends to avoid the risk of passing on the infection to them, suggests a study, which found that infection in pets is more common than thought.",
			url: "https://www.freepressjournal.in/health/covid-infection-in-your-pet-dogs-cats-may-be-common-than-thought",
			urlToImage:
				"https://gumlet.assettype.com/freepressjournal%2F2021-07%2F69284b9b-baa5-421f-9e2b-75c26a1181f7%2Finfo_lead_july_1.png?w=1200&auto=format%2Ccompress&ogImage=true",
			publishedAt: "2021-07-02T03:52:05Z",
			content:
				"London: Are you Covid-positive? Stay away from your feline and pooch friends to avoid the risk of passing on the infection to them, suggests a study, which found that infection in pets is more common… [+2231 chars]",
		},
		{
			source: {
				id: "the-times-of-india",
				name: "The Times of India",
			},
			author: "TIMESOFINDIA.COM",
			title: "Can contraceptive pills cause PCOS? - Times of India",
			description:
				"Polycystic ovary syndrome (PCOS), an endocrine disorder in females, is also a common cause of infertility and skin related problems in females. However, birth control pills that help to avert or contracept unwanted pregnancies are often related to PCOS. Let’s…",
			url: "https://timesofindia.indiatimes.com/life-style/health-fitness/health-news/can-contraceptive-pills-cause-pcos/photostory/84039250.cms",
			urlToImage: "https://static.toiimg.com/photo/84039329.cms",
			publishedAt: "2021-07-02T03:30:00Z",
			content:
				"Polycystic ovary syndrome (PCOS), an endocrine disorder in females, is also a common cause of infertility and skin related problems in females. However, birth control pills that help to avert or cont… [+114 chars]",
		},
		{
			source: {
				id: null,
				name: "The Sentinel Assam",
			},
			author: "Sentinel Digital Desk",
			title: "Patient suffering from black fungus passes away in Assam Medical College and Hospital - Sentinelassam - The Sentinel Assam",
			description: "The 47-year-old man from Lakhimpur, Subash Sahu, who was undergoing treatment in Assam Medical...",
			url: "https://www.sentinelassam.com/north-east-india-news/assam-news/patient-suffering-from-black-fungus-passes-away-in-assam-medical-college-and-hospital-545122",
			urlToImage: "https://assets.sentinelassam.com/h-upload/2021/07/02/239150-black.jpg",
			publishedAt: "2021-07-02T03:06:31Z",
			content:
				"Staff Correspondent\r\nDIBRUGARH: The 47-year-old man from Lakhimpur, Subash Sahu, who was undergoing treatment in Assam Medical College and Hospital (AMCH) for mucormycosis, commonly known as black fu… [+651 chars]",
		},
		{
			source: {
				id: null,
				name: "India Today",
			},
			author: null,
			title: "Health and frontline workers, vulnerable groups given priority in Covid vaccination: Centre - India Today",
			description:
				'Refuting reports alleging that the vaccination strategy is "neglecting" the elderly and vulnerable and "privileges the rich", the Centre has said that the inoculation programme gives priority to health and frontline workers and the most vulnerable groups.',
			url: "https://www.indiatoday.in/coronavirus-outbreak/story/health-frontline-workers-vulnerable-groups-priority-covid-vaccination-centre-1822816-2021-07-02",
			urlToImage: "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202107/old-647x363.jpeg?4AxOxIRJ9vms4zcXM6c8N9W28fYRvrew",
			publishedAt: "2021-07-02T02:27:24Z",
			content: null,
		},
		{
			source: {
				id: null,
				name: "Daily Mail",
			},
			author: "Eleanor Hayward",
			title: "Almost 1M in UK are battling long Covid and TWO-THIRDS say it is affecting their daily life - Daily Mail",
			description:
				"Nearly one million Britons were found in May to be experiencing long Covid - defined as symptoms which last for more than four weeks after infection.",
			url: "https://www.dailymail.co.uk/news/article-9747923/Almost-million-people-battling-long-Covid-TWO-THIRDS-say-affecting-daily-life.html",
			urlToImage: "https://i.dailymail.co.uk/1s/2021/07/02/01/44938685-0-image-a-27_1625185655986.jpg",
			publishedAt: "2021-07-02T00:27:41Z",
			content:
				"Hundreds of thousands of people across the UK have been suffering from long Covid, figures suggest.\r\nNearly one million people were found in May to be experiencing long Covid defined as symptoms which… [+2605 chars]",
		},
		{
			source: {
				id: null,
				name: "Daily Mail",
			},
			author: "Chris Ciaccia",
			title: "How tens of thousands of fire ants form living 'rafts' to help them escape floods - Daily Mail",
			description:
				"One species of fire ants can survive dangerous floods, creating a living 'raft' using their bodies to link together and create a conveyor belt-like structure that changes shape almost constantly.",
			url: "https://www.dailymail.co.uk/sciencetech/article-9746845/Tens-thousands-fire-ants-form-living-rafts-help-escape-floods.html",
			urlToImage: "https://i.dailymail.co.uk/1s/2021/07/01/19/44927771-0-image-a-95_1625164861724.jpg",
			publishedAt: "2021-07-01T20:02:59Z",
			content:
				"Texas Health and Human Secretary Dr Tom Price declared a public health emergency on Sunday after flood waters created opened up a slew of hazards.\r\nAs well as the more immediate risks of drowning or … [+3577 chars]",
		},
		{
			source: {
				id: null,
				name: "Dailyexcelsior.com",
			},
			author: "https://www.facebook.com/dailyexcelsior",
			title: "Covid vaccines reduce severity, symptoms, viral load in re-infected people: Study - Daily Excelsior",
			description:
				"WASHINGTON, July 1: People who contract COVID-19 even after vaccination are likely to have a lower viral load or quantity, experience a shorter infection",
			url: "https://www.dailyexcelsior.com/covid-vaccines-reduce-severity-symptoms-viral-load-in-re-infected-people-study/",
			urlToImage: "https://www.dailyexcelsior.com/wp-content/uploads/2021/07/COVID-VAccine1.jpg",
			publishedAt: "2021-07-01T19:29:32Z",
			content:
				"WASHINGTON, July 1: People who contract COVID-19 even after vaccination are likely to have a lower viral load or quantity, experience a shorter infection time and have milder symptoms than unvaccinat… [+3183 chars]",
		},
		{
			source: {
				id: null,
				name: "Science Daily",
			},
			author: null,
			title:
				"COVID-19 aggravates antibiotic misuse in India, study finds: Sales of antibiotics soar as threat of drug-resistant bacteria worsens - Science Daily",
			description:
				"Antibiotic sales soared during India's first surge of COVID-19, suggesting that the drugs were inappropriately used to treat mild and moderate COVID-19 infections, according to new research. The excessive usage is especially concerning because antibiotic over…",
			url: "https://www.sciencedaily.com/releases/2021/07/210701140624.htm",
			urlToImage: "https://www.sciencedaily.com/images/scidaily-icon.png",
			publishedAt: "2021-07-01T18:45:24Z",
			content:
				"The COVID-19 catastrophe in India has resulted in more than 30 million people infected with the virus and nearly 400,000 deaths, though experts are concerned that the figures most likely are much hig… [+7697 chars]",
		},
		{
			source: {
				id: null,
				name: "Daily Mail",
			},
			author: "Jonathan Chadwick",
			title: "Rare genetic variants protect against obesity, study says - Daily Mail",
			description:
				"A new study provides potential therapeutic targets for treating obesity in humans, according to a team led by Regeneron, a New York-based biotechnology firm.",
			url: "https://www.dailymail.co.uk/sciencetech/article-9746507/Rare-genetic-variants-protect-against-obesity-study-says.html",
			urlToImage: "https://i.dailymail.co.uk/1s/2021/07/01/18/29447632-0-image-a-4_1625158816707.jpg",
			publishedAt: "2021-07-01T18:00:49Z",
			content:
				"Sixteen rare genetic variants could protect people from being obese, a new study claims. \r\nResearchers performed 'whole exome sequencing' an extensive genetic test that looks at thousands of genes at… [+5723 chars]",
		},
		{
			source: {
				id: null,
				name: "Cgtn.com",
			},
			author: "",
			title: "How did China achieve malaria-free status? - CGTN",
			description: "China has been declared malaria-free by the World Health Organization, after a 70-year effort to wipe it out.",
			url: "https://newseu.cgtn.com/news/2021-07-02/How-did-China-achieve-malaria-free-status--11y2iO2mCNq/index.html",
			urlToImage:
				"https://newseu.cgtn.com/news/2021-07-02/How-did-China-achieve-malaria-free-status--11y2iO2mCNq/img/69a50994c7c14e6dbcbc14dec191975b/69a50994c7c14e6dbcbc14dec191975b-1280.png",
			publishedAt: "2021-07-01T16:18:45Z",
			content:
				"China has been declared malaria-free by the World Health Organization (WHO), after a 70-year effort to wipe out the disease. It has been four years since the country has registered a case. \r\nDuring t… [+2595 chars]",
		},
		{
			source: {
				id: null,
				name: "LatestLY",
			},
			author: "ANI",
			title: "Health News | 94% of Patients with Cancer Respond Well to COVID-19 Vaccines: Study - LatestLY",
			description:
				"Get latest articles and stories on Health at LatestLY. According to a new study, nearly all patients with cancer developed a good immune response to the COVID-19 mRNA vaccines three to four weeks after receiving their second dose.",
			url: "https://www.latestly.com/agency-news/health-news-94-of-patients-with-cancer-respond-well-to-covid-19-vaccines-study-2602410.html",
			urlToImage: "https://st1.latestly.com/wp-content/uploads/2021/07/cancceerr_repa.jpg",
			publishedAt: "2021-07-01T15:27:05Z",
			content:
				"Washington [US], July 1 (ANI): According to a new study, nearly all patients with cancer developed a good immune response to the COVID-19 mRNA vaccines three to four weeks after receiving their secon… [+3738 chars]",
		},
		{
			source: {
				id: null,
				name: "ANI News",
			},
			author: null,
			title: "94% of patients with cancer respond well to COVID-19 vaccines: Study - ANI News",
			description:
				"Washington [US], July 1 (ANI): According to a new study, nearly all patients with cancer developed a good immune response to the COVID-19 mRNA vaccines three to four weeks after receiving their second dose.",
			url: "https://www.aninews.in/news/health/94-of-patients-with-cancer-respond-well-to-covid-19-vaccines-study20210701205116",
			urlToImage: "https://aniportalimages.s3.amazonaws.com/media/details/__sized__/cancceerr_repa-thumbnail-154x87-70.jpg",
			publishedAt: "2021-07-01T15:21:00Z",
			content:
				"ANI | Updated: Jul 01, 2021 20:51 IST\r\nWashington [US], July 1 (ANI): According to a new study, nearly all patients with cancer developed a good immune response to the COVID-19 mRNA vaccines three to… [+3559 chars]",
		},
		{
			source: {
				id: null,
				name: "Daily Mail",
			},
			author: "Luke Andrews, Joe Davies",
			title: "Covid UK: Cases spike 68% to 27,989 but deaths rise by just 5% - Daily Mail",
			description:
				"Department of Health chiefs posted more than 20,000 positive tests for the fourth day in a row. Scientists say the rise is being fuelled by the Indian 'Delta' variant and Euro 2020 tournament.",
			url: "https://www.dailymail.co.uk/news/article-9745925/Covid-cases-surging-area-England-one-doubled-fifth-local-authorities.html",
			urlToImage: "https://i.dailymail.co.uk/1s/2021/07/01/17/44922233-0-image-a-56_1625155667341.jpg",
			publishedAt: "2021-07-01T14:47:19Z",
			content:
				"This graph shows hospitalisations in the third wave (blue line) are far lower than in the second wave (red line) thanks to jabs\r\nBritain's daily Covid cases spiked 68 per cent in a week today to 27,9… [+18681 chars]",
		},
		{
			source: {
				id: null,
				name: "GQ India",
			},
			author: "Shikha Sethi",
			title: "4 healthy snacks you can easily make at home this monsoon - GQ India",
			description: "Healthy snacks for monsoon: A few simple swaps and you can tuck in to your favourite snacks, guilt-free",
			url: "https://www.gqindia.com/live-well/content/healthy-snacks-you-can-easily-make-at-home-this-monsoon",
			urlToImage: "https://assets.gqindia.com/photos/60dd592b7829f66368dd36b0/16:9/w_1280,c_limit/TOP-IMAGE-03.jpg",
			publishedAt: "2021-07-01T14:00:00Z",
			content:
				"The Smart Swap: This is a traditional recipe, but isn't as unhealthy as we've been brainwashed to believe. Besan is gram flour, and protein rich, so enjoy that damn bhajiya instead of feeling guilty. C… [+599 chars]",
		},
		{
			source: {
				id: null,
				name: "The Indian Express",
			},
			author: "Lifestyle Desk",
			title: "Twinkle Khanna shares the many ways in which she uses citrus peel - The Indian Express",
			description: "Citrus peel is known to have a high nutritional value",
			url: "https://indianexpress.com/article/lifestyle/health/twinkle-khanna-citrus-peel-health-benefits-7384290/",
			urlToImage: "https://images.indianexpress.com/2021/07/twinklekhanna-1200.jpg",
			publishedAt: "2021-07-01T13:40:56Z",
			content:
				"While citrus is good for boosting immunity levels, its peel is not any less beneficial. You can use it in many ways; Twinkle Khanna recently showed how.\r\nTaking to Instagram, the 47-year-old shared s… [+894 chars]",
		},
		{
			source: {
				id: "the-times-of-india",
				name: "The Times of India",
			},
			author: "PTI",
			title: "Covid vaccination gives priority to health and frontline workers, most vulnerable groups: Govt - Economic Times",
			description:
				"It is anchored in systematic end-to-end planning and is implemented through effective and efficient participation of states, Union Territories (UTs) and people at large, it said and added that the government's commitment towards the programme has been unwaver…",
			url: "https://economictimes.indiatimes.com/industry/healthcare/biotech/healthcare/covid-vaccination-gives-priority-to-health-and-frontline-workers-most-vulnerable-groups-govt/articleshow/84037155.cms",
			urlToImage: "https://img.etimg.com/thumb/msid-84037310,width-1070,height-580,imgsize-1650823,overlay-economictimes/photo.jpg",
			publishedAt: "2021-07-01T13:11:00Z",
			content:
				"The Covid vaccination programme gives priority to strengthening the country's healthcare system by protecting health and frontline workers as well as the most vulnerable groups, the government said o… [+4433 chars]",
		},
		{
			source: {
				id: null,
				name: "Deccan Herald",
			},
			author: "DH Web Desk",
			title: "Everything you need to know about Cytomegalovirus affecting those who recovered from Covid-19 - Deccan Herald",
			description:
				"New Delhi's Sri Ganga Ram Hospital has reported cases of a new virus - Cytomegalovirus. The hospital in a statement to the media said that this has affected more than five people and has even caused one fatality.  As per the hospital, this is diagnosed in pat…",
			url: "https://www.deccanherald.com/science-and-environment/everything-you-need-to-know-about-cytomegalovirus-affecting-those-who-recovered-from-covid-19-1003621.html",
			urlToImage:
				"https://www.deccanherald.com/sites/dh/files/articleimages/2021/07/01/2021-06-03t233722z1523821445rc21tn922z0hrtrmadp3health-coronavirus-india-witnessjpg-1003621-1625144368.jpg",
			publishedAt: "2021-07-01T12:59:28Z",
			content:
				"New Delhi's Sri Ganga Ram Hospital has reported cases of a new virus - Cytomegalovirus. The hospital in a statement to the media said that this has affected more than five people and has even caused … [+3487 chars]",
		},
		{
			source: {
				id: null,
				name: "Asianetnews.com",
			},
			author: "Team Newsable",
			title: "Mask jointly developed by MIT and Harvard University can detect COVID infection in 90 minutes - Asianet Newsable ",
			description:
				"The need for new technology in detecting Covid virus led to developing a face mask with tiny sensors that can detect the presence of the virus in a person in just 90 minutes.",
			url: "https://newsable.asianetnews.com/top-stories/mask-jointly-developed-by-mit-and-harvard-university-can-detect-covid-infection-in-90-minutes-ycb-qvkgpi",
			urlToImage: "https://static-ai.asianetnews.com/images/01f9bqyhrt619gmqak1zwdwae7/mask-jpg_1200x630xt.jpg",
			publishedAt: "2021-07-01T12:44:07Z",
			content:
				"The need for new technology in detecting Covid virus led to developing a face mask with tiny sensors that can detect the presence of the virus in a person in just 90 minutes.In a major development in… [+1955 chars]",
		},
		{
			source: {
				id: "the-times-of-india",
				name: "The Times of India",
			},
			author: "ET HealthWorld",
			title: "Chinese researchers develops a new surgical technique for heart attacks led wall rupture repair - ETHealthworld.com",
			description:
				"The technique has been named as SurCOP and the study behind this technique development has been published in the Chinese Medical Journal.",
			url: "https://health.economictimes.indiatimes.com/news/industry/chinese-researchers-develops-a-new-surgical-technique-for-heart-attacks-led-wall-rupture-repair/84016769",
			urlToImage:
				"https://etimg.etb2bimg.com/thumb/msid-84016769,imgsize-277372,width-800,height-434,overlay-ethealthworld/chinese-researchers-develops-a-new-surgical-technique-for-heart-attacks-led-wall-rupture-repair.jpg",
			publishedAt: "2021-07-01T10:20:27Z",
			content:
				"Medical researchers have recently devised a new way to repair the ruptured wall of the heart from a severe heart attack. In a relief for patients suffering from severe heart attacks and vulnerability… [+3223 chars]",
		},
		{
			source: {
				id: null,
				name: "DNA India",
			},
			author: "DNA Video Team",
			title: "People living with HIV have a significantly higher risk of suicide: Study - DNA India",
			description:
				"A new study by researchers at Penn State College of Medicine indicated that people living with human immunodeficiency virus (HIV) and acquired immune deficiency syndrome (AIDS) are more likely to have suicidal thoughts and die from suicide. The findings of th…",
			url: "https://www.dnaindia.com/india/video-people-living-with-hiv-have-a-significantly-higher-risk-of-suicide-study-2898318",
			urlToImage: "https://cdn.dnaindia.com/sites/default/files/2021/07/01/982780-00000003.jpg",
			publishedAt: "2021-07-01T09:46:10Z",
			content: "©2021 Diligent Media Corporation Ltd.",
		},
		{
			source: {
				id: null,
				name: "Oneindia.com",
			},
			author: "Simran Kashyap",
			title: "Over 1.24 crore unutilised COVID-19 vaccine doses still with states: Centre - Oneindia",
			description:
				"Over 32.92 crore vaccine doses have been provided to states and UTs so far through Government of India (free of cost channel) and direct state procurement category.",
			url: "https://www.oneindia.com/india/over-1-24-crore-unutilised-covid-19-vaccine-doses-still-with-states-centre-3280313.html",
			urlToImage: "https://www.oneindia.com/img/1200x80/2020/03/vaccine-1584005318.jpg",
			publishedAt: "2021-07-01T09:37:15Z",
			content:
				"New Delhi, July 01: More than 1.24 crore balance and unutilised COVID-19 vaccine doses are still available with the states and UTs and over 94,66,420 doses are in the pipeline and will be received by… [+963 chars]",
		},
		{
			source: {
				id: null,
				name: "Ahmedabadmirror.com",
			},
			author: null,
			title: "Delta variant threat forces US to reconsider mask mandate - Ahmedabad Mirror",
			description:
				"With the highly transmissible Delta variant accounting for more than a quarter of the new coronavirus cases in the US, the country&#39;s health authorities were are reconsidering the mask mandate for the public.\n\n\nThe Delta variant, which is more contagious a…",
			url: "https://ahmedabadmirror.com/delta-variant-threat-forces-us-to-reconsider-mask-mandate/81802404.html",
			urlToImage: "https://ngs-space1.sgp1.digitaloceanspaces.com/am/uploads/mediaGallery/image/1625130612658.jpg-org",
			publishedAt: "2021-07-01T09:31:10Z",
			content:
				"With the highly transmissible Delta variant accounting for more than a quarter of the new coronavirus cases in the US, the country's health authorities were are reconsidering the mask mandate for the… [+2153 chars]",
		},
		{
			source: {
				id: "the-times-of-india",
				name: "The Times of India",
			},
			author: "ET HealthWorld",
			title: "Mental health of India’s healthcare professionals: deflecting the Covid-19 blow - ETHealthworld.com",
			description:
				"There are many things they are fighting: the novelty of the virus, mounting death toll, dejection of not being able to save people, acute shortage of basic necessities at the hospital, spending the entire day stuffed in a PPE suit without a break, and other t…",
			url: "https://health.economictimes.indiatimes.com/news/industry/mental-health-of-indias-healthcare-professionals-deflecting-the-covid-19-blow/84013786",
			urlToImage:
				"https://etimg.etb2bimg.com/thumb/msid-84013786,imgsize-47970,width-800,height-434,overlay-ethealthworld/mental-health-of-india-s-healthcare-professionals-deflecting-the-covid-19-blow.jpg",
			publishedAt: "2021-07-01T08:06:25Z",
			content:
				"by Dr Vishal SehgalWhen the Covid-19 pandemic struck last year and a lockdown ensued, people across the world gathered in their balconies to applaud healthcare workers risking their lives to save eve… [+3856 chars]",
		},
		{
			source: {
				id: null,
				name: "Daily Mail",
			},
			author: "Charlotte Karp",
			title: "Limo driver who sparked Sydney Covid outbreak banned from work until vaccination - Daily Mail",
			description:
				"The 60-year-old and his wife are finally allowed to leave their apartment in Bondi after two weeks in isolation from his positive test on June 15, but has nothing to do until he gets vaccinated.",
			url: "https://www.dailymail.co.uk/news/article-9743935/Limo-driver-sparked-Sydney-Covid-outbreak-banned-work-vaccination.html",
			urlToImage: "https://i.dailymail.co.uk/1s/2021/07/01/08/44902483-0-image-a-50_1625122987334.jpg",
			publishedAt: "2021-07-01T07:03:15Z",
			content:
				"The airport limousine driver who sparked Sydney's Covid outbreak has recovered from the virus but can't return to work until he is vaccinated.\r\nThe 60-year-old and his wife are finally allowed to lea… [+5099 chars]",
		},
		{
			source: {
				id: null,
				name: "India Today",
			},
			author: null,
			title: "Doctors warn of cocktail Covid wave due to rapid mutations - India Today",
			description: "Doctors have warned of a wave of Covid due to the rapid mutations in the virus - terming it the 'cocktail infection wave'.",
			url: "https://www.indiatoday.in/coronavirus-outbreak/story/cocktail-covid-wave-mutation-delta-kappa-lambda-1821412-2021-07-01",
			urlToImage: "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202107/covidnew1-647x363.jpeg?RxBhLcgtorIVtnyg9_HSj8v45OFpTHRM",
			publishedAt: "2021-07-01T02:14:03Z",
			content:
				"The danger of the four coronavirus variants apart from the newest Delta Plus variant is looming over Uttar Pradesh and medical experts are warning about the possibility of a 'cocktail infection wave'… [+1737 chars]",
		},
		{
			source: {
				id: null,
				name: "IOL",
			},
			author: "Rudolph Nkgadima",
			title: "Why elderly are prioritised for Covid-19 vaccine despite reduced demand - IOL",
			description: "Six weeks into the vaccine rollout to those older than 60, less than half of this age group has been vaccinated.",
			url: "https://www.iol.co.za/news/south-africa/why-elderly-are-prioritised-for-covid-19-vaccine-despite-reduced-demand-174c2bea-5d28-4e28-ad5b-25c257f77a1d",
			urlToImage:
				"https://image-prod.iol.co.za/resize/650x366/?source=https://xlibris.public.prod.oc.inl.infomaker.io:8443/opencontent/objects/2294f252-2e98-5212-a2c7-352bbb910a84&operation=CROP&offset=0x115&resize=2362x1329",
			publishedAt: "2021-07-01T00:22:29Z",
			content:
				"THERE are growing calls for the registration for Covid-19 vaccines to be opened to everyone above the age of 18, as the demand for vaccination among the elderly has reduced exponentially.\r\nSix weeks … [+1867 chars]",
		},
		{
			source: {
				id: null,
				name: "Abc-7.com",
			},
			author: "Meagan Miller",
			title: "More than a disorder: Understanding the autism spectrum through the eyes of the diagnosed - ABC7 News",
			description: "SWFL residents explain how broad the autism spectrum is and how much more the world still has to understand.",
			url: "https://abc-7.com/news/cover-story/2021/06/30/more-than-a-disorder-understanding-the-autism-spectrum-through-the-eyes-of-the-diagnosed/",
			urlToImage: "https://abc-7.com/wp-content/uploads/2021/06/Autism-1.jpg",
			publishedAt: "2021-06-30T23:36:00Z",
			content:
				"This story was produced in partnership with Florida Weekly. \r\nSOUTHWEST FLORIDA – Like a lot of teenagers, Sean Sullivan loves video games and sports.\r\n“I like to watch golf, hockey. I play baseball,… [+9518 chars]",
		},
		{
			source: {
				id: null,
				name: "Daily Mail",
			},
			author: "Janet Street-Porter",
			title: "JANET STREET PORTER on how the Covid numbers used to justify lockdown - Daily Mail",
			description:
				"JANET STREET PORTER: You may have noticed we haven't had one for a while and, so far as I am concerned, the Covid Press conferences ought to be scrapped.",
			url: "https://www.dailymail.co.uk/debate/article-9743289/JANET-STREET-PORTER-Covid-numbers-used-justify-lockdown.html",
			urlToImage: "https://i.dailymail.co.uk/1s/2021/06/30/23/44887553-0-image-a-2_1625092641129.jpg",
			publishedAt: "2021-06-30T22:33:45Z",
			content:
				"You may have noticed we haven't had one for a while and, so far as I am concerned, the government's awful Covid Press conferences ought to be scrapped forever.\r\nAlong with the with the daily infectio… [+8437 chars]",
		},
		{
			source: {
				id: null,
				name: "The Indian Express",
			},
			author: "Express News Service",
			title: "Adolescents in India have high level of exposure to risk factors for developing non-communicable diseases: Survey - The Indian Express",
			description:
				"Adolescents from urban areas had a higher proportion of risk factors than those from rural areas. Only two-thirds reported being imparted health education on NCD risk factors in their schools and colleges, and lower proportions said they saw any health promot…",
			url: "https://indianexpress.com/article/india/india-adolescents-non-communicable-disease-level-of-exposure-7383402/",
			urlToImage: "https://images.indianexpress.com/2021/02/students13.jpg",
			publishedAt: "2021-06-30T17:38:35Z",
			content:
				"One in every 10 adolescents in India had experimented with smoke or smokeless forms of tobacco, one-fourth were insufficiently physically active, 6.2 per cent adolescents were overweight and nearly h… [+2209 chars]",
		},
		{
			source: {
				id: null,
				name: "BloombergQuint",
			},
			author: "Katharine Gemmell",
			title: "U.K.’s Most Vulnerable Could Get Covid Boosters From September - BloombergQuint",
			description: "U.K.’s Most Vulnerable Could Get Covid Boosters From September",
			url: "https://www.bloombergquint.com/onweb/u-k-s-most-vulnerable-could-get-covid-boosters-from-september",
			urlToImage:
				"https://gumlet.assettype.com/bloombergquint%2F2018-08%2F3a8e2237-2edb-4494-bcf2-231993fb6108%2FBLOOMBERG_LOGO.png?rect=0%2C56%2C1920%2C1008&w=1200&auto=format%2Ccompress&ogImage=true",
			publishedAt: "2021-06-30T17:22:44Z",
			content:
				"Vulnerable groups in the U.K. may be given Covid-19 booster vaccines starting from September to maintain their immunity during the winter and help ward off new variants.\r\nThe countrys independent vac… [+1975 chars]",
		},
		{
			source: {
				id: null,
				name: "Republic World",
			},
			author: "Press Trust Of India",
			title: "Private hospital in Delhi treating two patients with cytomegalovirus infection - Republic World",
			description: "Private hospital in Delhi treating two patients with cytomegalovirus infection",
			url: "https://www.republicworld.com/india-news/city-news/private-hospital-in-delhi-treating-two-patients-with-cytomegalovirus-infection.html",
			urlToImage: "https://img.republicworld.com/republic-prod/stories/promolarge/xhdpi/m5ybyh3tm6gfplbj_1618399351.jpeg",
			publishedAt: "2021-06-30T16:17:21Z",
			content:
				"New Delhi, Jun 30 (PTI) Two people suffering from cytomegalovirus infection following recovery from COVID-19 have been admitted to a leading private hospital in Delhi during the second wave of the pa… [+2063 chars]",
		},
		{
			source: {
				id: null,
				name: "Nature.com",
			},
			author: null,
			title: "Malaria vaccine gets a parasite boost in the liver - Nature.com",
			description: "Clinical evidence points to an effective vaccination approach.",
			url: "https://www.nature.com/articles/d41586-021-01720-6",
			urlToImage: "https://media.nature.com/lw1024/magazine-assets/d41586-021-01720-6/d41586-021-01720-6_19299160.png",
			publishedAt: "2021-06-30T15:14:27Z",
			content:
				"Malaria has long remained among the worst infectious-disease threats to human health. There were 229 million clinical cases of malaria and more than 400,000 deaths from this disease reported during 2… [+9581 chars]",
		},
		{
			source: {
				id: null,
				name: "CNBC",
			},
			author: "Ian Thomas",
			title: "How CRISPR gene editing will treat diseases in future: Nobel-winning Intellia co-founder Jennifer Doudna - CNBC",
			description:
				"Jennifer Doudna, 2020 Nobel Prize winner in chemistry for CRISPR gene editing and co-founder of Intellia Therapeutics, on future of the breakthrough technology.",
			url: "https://www.cnbc.com/2021/06/30/how-crispr-gene-editing-will-treat-disease-intellia-founder-doudna-.html",
			urlToImage: "https://image.cnbcfm.com/api/v1/image/105924772-1558442732965gettyimages-528038980.jpeg?v=1624980369",
			publishedAt: "2021-06-30T14:04:55Z",
			content:
				"Gene-editing technology CRISPR reached a major milestone this past weekend, completing its first systemic delivery as a medicine to a human body.\r\nCRISPR, or clustered regularly interspaced short pal… [+4678 chars]",
		},
		{
			source: {
				id: "usa-today",
				name: "USA Today",
			},
			author: "Brett Molina, USA TODAY",
			title: "Facebook ramps up plans to deliver COVID-19 vaccines to underserved communities - USA TODAY",
			description: "Facebook said Wednesday it will partner with nonprofits to deliver vaccines via mobile truck to schools and community spaces.",
			url: "https://www.usatoday.com/story/tech/2021/06/30/facebook-covid-vaccine-mobile-truck-austin-new-york-seattle/7808732002/",
			urlToImage:
				"https://www.gannett-cdn.com/presto/2021/06/03/USAT/c946279a-ec69-484f-9d26-f56398727996-AP_Facebook-Covid_Posts.jpg?auto=webp&crop=5999,3374,x0,y27&format=pjpg&width=1200",
			publishedAt: "2021-06-30T14:03:39Z",
			content:
				"Facebook said it is expanding plans to deliver COVID-19 vaccines to underserved communities.\r\nThe company said in a statement Wednesday it will partner with local nonprofits near their Menlo Park, Ca… [+2267 chars]",
		},
		{
			source: {
				id: null,
				name: "India.com",
			},
			author: "Zee Media Bureau",
			title: "No scientific evidence to prove COVID vaccine causes infertility, says Health Ministry - Zee News",
			description:
				"The Centre on Wednesday reiterated that there is no scientific evidence suggesting COVID-19 vaccination can cause infertility in men and women and asserted the vaccines have been found to be safe and effective.",
			url: "https://zeenews.india.com/india/no-scientific-evidence-to-prove-covid-vaccine-causes-infertility-says-health-ministry-2372947.html",
			urlToImage: "https://english.cdn.zeenews.com/sites/default/files/2021/06/30/947973-vaccination-india-reuters.jpg",
			publishedAt: "2021-06-30T11:43:32Z",
			content:
				"New Delhi: The Centre on Wednesday reiterated that there is no scientific evidence suggesting COVID-19 vaccination can cause infertility in men and women and asserted the vaccines have been found to … [+2263 chars]",
		},
		{
			source: {
				id: null,
				name: "Hindustan Times",
			},
			author: "hindustantimes.com",
			title: "Delta Plus: What should diabetic, high BP people do? All you need to know - Hindustan Times",
			description:
				"People with uncontrolled diabetes are at an increased risk of all infections in general, experts have said earlier. | Latest News India",
			url: "https://www.hindustantimes.com/india-news/delta-plus-what-should-diabetic-high-bp-people-do-all-you-need-to-know-101625052587694.html",
			urlToImage: "https://images.hindustantimes.com/img/2021/06/30/1600x900/PTI04_28_2021_000089B_1625052832441_1625052852076.jpg",
			publishedAt: "2021-06-30T11:38:28Z",
			content:
				"The new variant of SARS-CoV-2 Delta Plus has brought back some containment at local levels. Maharashtra has reimposed some curbs while Karnataka has again made negative RT-PCR results or vaccine cert… [+2336 chars]",
		},
	],
};

// 默认天气缩写数组
var defaultWeatherAbbreviations = ["sn", "sl", "h", "t", "hr", "lr", "s", "hc", "lc", "c"];
// 默认天气状态数组
var defaultWeatherStates = ["Snow", "Sleet", "Hail", "Thunderstorm", "Heavy Rain", "Light Rain", "Showers", "Heavy Cloud", "Light Cloud", "Clear"];

// 获取当前日期
var date = new Date();
// 从默认历史数据中随机选择一个事件
var historyEvent = defaultHistoryData[Math.floor(Math.random() * defaultHistoryData.length)];
// 设置日期的年份为历史事件的年份
date.setYear(historyEvent.year);

// 新闻数据数组
var news = [];
// 遍历默认新闻数据的文章列表
for (var i = 0; i < defaultNewsData.articles.length; i++) {
	// 复制新闻数据对象
	var item = { ...defaultNewsData.articles[i] };
	// 对新闻标题进行处理，去除特定字符
	item.title = item.title.split("-").reverse().splice(1).reverse().join("-").trim();
	// 将处理后的新闻数据添加到news数组中
	news.push(item);
}

// 记忆的值
var rememberedValue = null;

// 初始化状态数据对象
export const initialState = {
	data: {
		weather: {
			city: "New Delhi", // 城市名称
			country: "India", // 国家名称
			wstate: defaultWeatherStates[randomNumber(rememberedValue, true)], // 获取随机天气状态
			icon: defaultWeatherAbbreviations[randomNumber(rememberedValue)], // 获取随机天气图标
			temp: 30 + randomNumber(rememberedValue, false, 20), // 生成随机温度
			rain: 10 + randomNumber(rememberedValue, false, 80), // 生成随机降雨量
			wind: 4 + randomNumber(rememberedValue, false, 5), // 生成随机风速
			days: [0, 1, 2, 3].map((i) => {
				return {
					day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][(new Date().getDay() + i) % 7], // 获取星期几
					icon: defaultWeatherAbbreviations[randomNumber(rememberedValue)], // 获取随机天气图标
					min: 30 + randomNumber(rememberedValue), // 生成随机最低温度
					max: 40 + randomNumber(rememberedValue), // 生成随机最高温度
				};
			}),
		},
		stock: [
			[
				Number(parseFloat(2300 + Math.random() * 200).toFixed(2)).toLocaleString(), // 格式化股票数据
				parseFloat(Math.random() * 2).toFixed(2), // 生成随机股价变动
				Math.round(Math.random()), // 生成随机涨跌情况
			],
			[
				Number(parseFloat(600 + Math.random() * 200).toFixed(2)).toLocaleString(), // 格式化股票数据
				parseFloat(Math.random() * 2).toFixed(2), // 生成随机股价变动
				Math.round(Math.random()), // 生成随机涨跌情况
			],
		],
		date: date.toLocaleDateString("zh-CN", { year: "numeric", month: "short", day: "numeric" }), // 格式化日期
		event: historyEvent, // 历史事件数据
		news: news, // 新闻数据
	},
	hide: true, // 默认隐藏状态
};

/**
 * 创建小部件面板切片，用于管理小部件面板状态。
 */
export const widgetSlice = createSlice({
	name: "widget", // 切片名称，用于标识状态的一部分
	initialState, // 初始状态对象

	reducers: {
		/**
		 * 隐藏小部件面板
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		hide: (state, action) => {
			return {
				...state,
				hide: true, // 将隐藏属性设置为true
			};
		},

		/**
		 * 切换小部件面板显示状态
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		toggle: (state, action) => {
			return {
				...state,
				hide: !state.hide, // 将隐藏属性取反
			};
		},

		/**
		 * 重置小部件面板状态
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		reset: (state, action) => {
			return action.payload; // 使用传入的动作载荷直接重置状态
		},
	},
	extraReducers: (builder) => {
		builder.addDefaultCase((state) => state); // 处理其他类型的动作，默认情况下返回当前状态
	},
});

// 每个 case reducer 函数会生成对应的 Action creators
export const actions = widgetSlice.actions;

export default widgetSlice.reducer;

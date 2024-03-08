<script setup lang="ts">
import {
	computed,
	onMounted,
	onUnmounted,
	defineAsyncComponent,
	ref,
} from "vue";
import { useRoute } from "vue-router";
import { NButton, NInput, useDialog, useMessage } from "naive-ui";
import html2canvas from "html2canvas";
import { storeToRefs } from "pinia";
import { NAutoComplete } from "naive-ui";
import { Message } from "./components";
import { useScroll } from "./hooks/useScroll";
import { useChat } from "./hooks/useChat";
import { useCopyCode } from "./hooks/useCopyCode";
import { useUsingContext } from "./hooks/useUsingContext";
import HeaderComponent from "./components/Header/index.vue";
import { HoverButton, SvgIcon } from "@/components/common";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { useChatStore, usePromptStore } from "@/store";
import { fetchChatAPIProcess } from "@/api";
import { t } from "@/locales";
import aliPay from "@/assets/ali_pay.jpg";
import wechatPay from "@/assets/wechat_pay.jpg";

let controller = new AbortController();

// const openLongReply = import.meta.env.VITE_GLOB_OPEN_LONG_REPLY === 'true'

const route = useRoute();
const dialog = useDialog();
const ms = useMessage();

const chatStore = useChatStore();

useCopyCode();

const { isMobile } = useBasicLayout();
const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex } =
	useChat();
const { scrollRef, scrollToBottom } = useScroll();
const { usingContext, toggleUsingContext } = useUsingContext();

const { uuid } = route.params as { uuid: string };

const dataSources = computed(() => chatStore.getChatByUuid(+uuid));
const getEnabledNetwork = computed(() => chatStore.getEnabledNetwork);
// const conversationList = computed(() => dataSources.value.filter(item => (!item.inversion && !item.error)))

const prompt = ref<string>("");
const loading = ref<boolean>(false);

const showDonate = ref<boolean>(false);

const Donate = defineAsyncComponent(
	() => import("@/components/custom/Donate.vue")
);

// 添加PromptStore
const promptStore = usePromptStore();
// 使用storeToRefs，保证store修改后，联想部分能够重新渲染
const { promptList: promptTemplate } = storeToRefs<any>(promptStore);

function handleSubmit() {
	onConversation();
}

async function onConversation() {
	let message = prompt.value;

	if (loading.value) return;

	if (!message || message.trim() === "") return;

	controller = new AbortController();

	addChat(+uuid, {
		dateTime: new Date().toLocaleString(),
		text: message,
		inversion: true,
		error: false,
		conversationOptions: null,
		requestOptions: { prompt: message, options: null },
	});
	scrollToBottom();

	loading.value = true;
	prompt.value = "";

	let options: Chat.ConversationRequest = {
		conversationId: usingContext.value
			? window.location.hash
			: Math.random().toString(),
	};
	// const lastContext = conversationList.value[conversationList.value.length - 1]?.conversationOptions

	// if (lastContext && usingContext.value)
	//   options = { ...lastContext }

	addChat(+uuid, {
		dateTime: new Date().toLocaleString(),
		text: "",
		loading: true,
		inversion: false,
		error: false,
		conversationOptions: null,
		requestOptions: { prompt: message, options: { ...options } },
	});
	scrollToBottom();

	try {
		await fetchChatAPIProcess<Chat.ConversationResponse>({
			prompt: message,
			options,
			signal: controller.signal,
			network: !!chatStore.getEnabledNetwork,
			onDownloadProgress: ({ event }) => {
				debugger;
				const xhr = event.target;
				const { responseText } = xhr;
				// Always process the final line
				// const lastIndex = responseText.lastIndexOf('\n')
				let chunk = responseText
					.replace(/\binjie/g, "zhongjyuan")
					.replace(/\Binjie/g, "zhongjyuan")
					.replace(/\18616222919/g, "17370115370")
					.replace(/https:\/\/chat18\.aichatos\.xyz/g, "http://zhongjyuan.club");
				// if (lastIndex !== -1)
				//   chunk = responseText.substring(lastIndex)
				try {
					// const data = JSON.parse(chunk)
					debugger;
					updateChat(+uuid, dataSources.value.length - 1, {
						dateTime: new Date().toLocaleString(),
						text: chunk ?? "",
						inversion: false,
						error: false,
						loading: false,
						conversationOptions: {},
						requestOptions: { prompt: message, options: { ...options } },
					});
					scrollToBottom();
				} catch (error) {
					//
				}
			},
		});
	} catch (error: any) {
		const errorMessage = error?.text ?? t("common.wrong");

		if (error.text === "canceled") {
			updateChatSome(+uuid, dataSources.value.length - 1, {
				loading: false,
			});
			scrollToBottom();
			return;
		}

		const currentChat = getChatByUuidAndIndex(
			+uuid,
			dataSources.value.length - 1
		);

		if (currentChat?.text && currentChat.text !== "") {
			updateChatSome(+uuid, dataSources.value.length - 1, {
				text: `${currentChat.text}\n[${errorMessage}]`,
				error: false,
				loading: false,
			});
			return;
		}

		updateChat(+uuid, dataSources.value.length - 1, {
			dateTime: new Date().toLocaleString(),
			text: errorMessage,
			inversion: false,
			error: true,
			loading: false,
			conversationOptions: null,
			requestOptions: { prompt: message, options: { ...options } },
		});
		scrollToBottom();
	} finally {
		loading.value = false;
	}
}

async function onRegenerate(index: number) {
	debugger;
	if (loading.value) return;

	controller = new AbortController();

	const { requestOptions } = dataSources.value[index];

	let message = requestOptions?.prompt ?? "";

	let options: Chat.ConversationRequest = {};

	if (requestOptions.options) options = { ...requestOptions.options };

	loading.value = true;

	updateChat(+uuid, index, {
		dateTime: new Date().toLocaleString(),
		text: "",
		inversion: false,
		error: false,
		loading: true,
		conversationOptions: null,
		requestOptions: { prompt: message, ...options },
	});
	// debugger;
	try {
		await fetchChatAPIProcess<Chat.ConversationResponse>({
			prompt: message,
			options,
			network: !!chatStore.getEnabledNetwork,
			signal: controller.signal,
			onDownloadProgress: ({ event }) => {
				const xhr = event.target;
				const { responseText } = xhr;
				// Always process the final line
				// const lastIndex = responseText.lastIndexOf('\n')
				let chunk = responseText
					.replace(/\binjie/g, "zhongjyuan")
					.replace(/\Binjie/g, "zhongjyuan")
					.replace(/\18616222919/g, "17370115370")
					.replace(/https:\/\/chat18\.aichatos\.xyz/g, "http://zhongjyuan.club");
				// if (lastIndex !== -1)
				// chunk = responseText.substring(lastIndex)
				try {
					// const data = JSON.parse(chunk)
					updateChat(+uuid, dataSources.value.length - 1, {
						dateTime: new Date().toLocaleString(),
						text: chunk ?? "",
						inversion: false,
						error: false,
						loading: false,
						conversationOptions: {},
						requestOptions: { prompt: message, options: { ...options } },
					});
					scrollToBottom();
				} catch (error) {
					//
				}
			},
		});
	} catch (error: any) {
		if (error.text === "canceled") {
			updateChatSome(+uuid, index, {
				loading: false,
			});
			return;
		}

		const errorMessage = error?.text ?? t("common.wrong");

		updateChat(+uuid, index, {
			dateTime: new Date().toLocaleString(),
			text: errorMessage,
			inversion: false,
			error: true,
			loading: false,
			conversationOptions: null,
			requestOptions: { prompt: message, ...options },
		});
	} finally {
		loading.value = false;
	}
}

function handleExport() {
	if (loading.value) return;

	const d = dialog.warning({
		title: t("chat.exportImage"),
		content: t("chat.exportImageConfirm"),
		positiveText: t("common.yes"),
		negativeText: t("common.no"),
		onPositiveClick: async () => {
			try {
				d.loading = true;
				const ele = document.getElementById("image-wrapper");
				const canvas = await html2canvas(ele as HTMLDivElement, {
					useCORS: true,
				});
				const imgUrl = canvas.toDataURL("image/png");
				const tempLink = document.createElement("a");
				tempLink.style.display = "none";
				tempLink.href = imgUrl;
				tempLink.setAttribute("download", "chat-shot.png");
				if (typeof tempLink.download === "undefined")
					tempLink.setAttribute("target", "_blank");

				document.body.appendChild(tempLink);
				tempLink.click();
				document.body.removeChild(tempLink);
				window.URL.revokeObjectURL(imgUrl);
				d.loading = false;
				ms.success(t("chat.exportSuccess"));
				Promise.resolve();
			} catch (error: any) {
				console.error("error", error);
				ms.error(t("chat.exportFailed"));
			} finally {
				d.loading = false;
			}
		},
	});
}

function handleDelete(index: number) {
	if (loading.value) return;

	dialog.warning({
		title: t("chat.deleteMessage"),
		content: t("chat.deleteMessageConfirm"),
		positiveText: t("common.yes"),
		negativeText: t("common.no"),
		onPositiveClick: () => {
			chatStore.deleteChatByUuid(+uuid, index);
		},
	});
}

function handleClear() {
	chatStore.toggleNetwork();
}

function handleEnter(event: KeyboardEvent) {
	if (!isMobile.value) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	} else {
		if (event.key === "Enter" && event.ctrlKey) {
			event.preventDefault();
			handleSubmit();
		}
	}
}

function handleStop() {
	if (loading.value) {
		controller.abort();
		loading.value = false;
	}
}

// 可优化部分
// 搜索选项计算，这里使用value作为索引项，所以当出现重复value时渲染异常(多项同时出现选中效果)
// 理想状态下其实应该是key作为索引项,但官方的renderOption会出现问题，所以就需要value反renderLabel实现
const searchOptions = computed(() => {
	if (prompt.value.startsWith("/")) {
		return promptTemplate.value
			.filter((item: { key: string }) =>
				item.key.toLowerCase().includes(prompt.value.substring(1).toLowerCase())
			)
			.map((obj: { value: any }) => {
				return {
					label: obj.value,
					value: obj.value,
				};
			});
	} else {
		return [];
	}
});
// value反渲染key
const renderOption = (option: { label: string }) => {
	for (const i of promptTemplate.value) {
		if (i.value === option.label) return [i.key];
	}
	return [];
};

const placeholder = computed(() => {
	if (isMobile.value) return t("chat.placeholderMobile");
	return t("chat.placeholder");
});

const buttonDisabled = computed(() => {
	return loading.value || !prompt.value || prompt.value.trim() === "";
});

const footerClass = computed(() => {
	let classes = ["p-4"];
	if (isMobile.value)
		classes = [
			"sticky",
			"left-0",
			"bottom-0",
			"right-0",
			"p-2",
			"pr-3",
			"overflow-hidden",
		];
	return classes;
});

onMounted(() => {
	scrollToBottom();
});

onUnmounted(() => {
	if (loading.value) controller.abort();
});
</script>

<template>
	<div class="flex flex-col w-full h-full">
		<HeaderComponent
			v-if="isMobile"
			:using-context="usingContext"
			@export="handleExport"
			@toggle-using-context="toggleUsingContext"
		/>
		<main class="flex-1 overflow-hidden">
			<div
				id="scrollRef"
				ref="scrollRef"
				class="h-full overflow-hidden overflow-y-auto"
			>
				<div
					id="image-wrapper"
					class="w-full max-w-screen-xl m-auto dark:bg-[#101014]"
					:class="[isMobile ? 'p-2' : 'p-4']"
				>
					<template v-if="!dataSources.length">
						<div
							class="flex items-center flex-col justify-center mt-4 text-center"
						>
							<SvgIcon icon="carbon:pcn-z-node" class="mr-2 text-3xl" /><br />
							<div>
								<div>
									<b style="color: red"
										>二维码是自愿捐赠！请确保网站您能使用，并且用了很久觉得好再捐赠！</b
									><br />
									<b style="color: red"
										>网站成本平均一人一月大概3元，只要每月捐三元网站就能活下去！</b
									><br />
									<b style="color: red"
										>网站完全免费，就算不捐，站长也会自费运营网站！</b
									><br />
								</div>
								<div>
									<b style="color: red; font-weight: bold"
										>PS: 所有捐赠将用于维护免费站运行！</b
									><br />
								</div>
								<div>
									禁止发布、传播任何违法、违规内容，使用本网站，视您接受并同意<a
										target="_blank"
										style="color: #006eff"
										href="https://docs.qq.com/doc/DU2RieVhSWUN2RkxC"
										>《免责声明》</a
									>
								</div>
								<div>📢此处为公告: 请低调试用</div>
								<div
									style="
										display: flex;
										align-items: center;
										justify-content: center;
									"
								>
									<img :src="aliPay" width="200" height="100" alt="kele" />
									<img :src="wechatPay" width="200" height="100" alt="kele" />
								</div>
							</div>
						</div>
					</template>
					<template v-else>
						<Message
							v-for="(item, index) of dataSources"
							:key="index"
							:date-time="item.dateTime"
							:text="item.text"
							:inversion="item.inversion"
							:error="item.error"
							:loading="item.loading"
							@regenerate="onRegenerate(index)"
							@delete="handleDelete(index)"
						/>
						<div class="sticky bottom-0 left-0 flex justify-center">
							<NButton v-if="loading" type="warning" @click="handleStop">
								<template #icon>
									<SvgIcon icon="ri:stop-circle-line" />
								</template>
								Stop Responding
							</NButton>
						</div>
					</template>
				</div>
			</div>
		</main>
		<footer :class="footerClass">
			<div class="flex items-center justify-between space-x-2">
				<HoverButton
					tooltip="点击开启或关闭联网功能,开启后AI会使用搜索引擎来回答问题,关闭能极大提升响应速度"
				>
					<span class="text-xl text-[#4f555e]" @click="handleClear">
						<SvgIcon
							icon="mdi:web-check"
							color="#2979ff"
							v-if="getEnabledNetwork"
						/>
						<SvgIcon
							icon="mdi:web-minus"
							color="#ba3329"
							v-if="!getEnabledNetwork"
						/>
					</span>
				</HoverButton>
				<HoverButton tooltip="捐赠" @click="showDonate = true">
					<span class="text-xl text-[#4f555e]">
						<SvgIcon icon="ph:gift-fill" color="#4b9d5f" />
					</span>
				</HoverButton>
				<NAutoComplete
					v-model:value="prompt"
					:options="searchOptions"
					:render-label="renderOption"
				>
					<template #default="{ handleInput, handleBlur, handleFocus }">
						<NInput
							v-model:value="prompt"
							type="textarea"
							:placeholder="placeholder"
							:autosize="{ minRows: 1, maxRows: 2 }"
							@input="handleInput"
							@focus="handleFocus"
							@blur="handleBlur"
							@keypress="handleEnter"
						/>
					</template>
				</NAutoComplete>
				<HoverButton v-if="!isMobile" @click="handleExport">
					<span class="text-xl text-[#4f555e] dark:text-white">
						<SvgIcon icon="ri:download-2-line" />
					</span>
				</HoverButton>

				<HoverButton v-if="!isMobile" @click="toggleUsingContext">
					<span
						class="text-xl"
						:class="{
							'text-[#4b9e5f]': usingContext,
							'text-[#a8071a]': !usingContext,
						}"
					>
						<SvgIcon icon="ri:chat-history-line" />
					</span>
				</HoverButton>
				<NButton
					type="primary"
					:disabled="buttonDisabled"
					@click="handleSubmit"
				>
					<template #icon>
						<span class="dark:text-black">
							<SvgIcon icon="ri:send-plane-fill" />
						</span>
					</template>
				</NButton>
			</div>

			<Donate v-if="showDonate" v-model:visible="showDonate" />
		</footer>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NModal } from "naive-ui";
import { SvgIcon } from "@/components/common";
import aliPay from "@/assets/ali_pay.jpg";
import wechatPay from "@/assets/wechat_pay.jpg";

const props = defineProps<Props>();

const emit = defineEmits<Emit>();

interface Props {
	visible: boolean;
}

interface Emit {
	(e: "update:visible", visible: boolean): void;
}

const show = computed({
	get() {
		return props.visible;
	},
	set(visible: boolean) {
		emit("update:visible", visible);
	},
});
</script>

<template>
	<NModal v-model:show="show" :auto-focus="false">
		<NCard
			role="dialog"
			aria-modal="true"
			:bordered="false"
			style="width: 95%; max-width: 640px; background: white"
		>
			<div class="flex items-center flex-col justify-center mt-4 text-center">
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
						禁止发布、传播任何违法、违规内容，使用本网站，视您接受并同意
						<a
							target="_blank"
							style="color: #006eff"
							href="https://docs.qq.com/doc/DVFdaY1lvWHFSWU5w"
							>《免责声明》</a
						>
					</div>
					<div>📢此处为公告: 请低调试用</div>
					<div
						style="display: flex; align-items: center; justify-content: center"
					>
						<img :src="aliPay" width="200" height="100" alt="kele" />
						<img :src="wechatPay" width="200" height="100" alt="kele" />
					</div>
				</div>
			</div>
		</NCard>
	</NModal>
</template>

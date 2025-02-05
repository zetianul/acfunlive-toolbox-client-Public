<template>
	<div class="outer">
		<div class="title shadow">设置</div>
		<div class="votePanel">
			<div class="row">
				<span class="shadow">公告内容</span>
				<el-input size="mini" v-model="settings.content" :maxlength="45" />
			</div>
			<div class="row">
				<span class="shadow">公告周期（秒）</span>
				<el-input-number size="mini" v-model="settings.period" :min="10" />
			</div>
			<div class="row">
				<el-button type="primary" size="mini" @click="startRobot">启动</el-button>
				<el-button type="danger" size="mini" @click="stopRobot">停止</el-button>
			</div>
		</div>
		<el-dialog v-model="settingShow">
			<div class="block">
				<div>不透明度</div>
				<el-slider @change="upgradeSettings" v-model="settings.opacity" :min="10" :max="100" />
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { registerClient, closeWorker } from "@front/util_function/storeWorker";
import { wsevent } from "@front/api/wsbus";
import { getContent } from "@front/components/danmakuFlow/utils/getter";
import { isOnline, isConnecting, init } from "@front/api/server";
import { chat } from "@front/api/chat";
import { ElMessage } from "element-plus";
export default defineComponent({
	name: "danmakuRobot",
	cname: "公告机器人",
	icon: "self-jiqiren",
	description: "简单的公告机器人，定期发出公告弹幕",
	configurations: {
		width: 400,
		height: 200,
		resizable: true,
		multiple: false,
		liveOnly: false
	},
	data() {
		return {
			settings: {
				opacity: 50,
				zoom: 100,
				content: "",
				period: 10
			},
			settingShow: false,
			preContent: "",
			robotTimer: null,
			timer: null
		};
	},
	mounted() {
		registerClient(["userSession", "roomProfile"], e => {
			Object.assign(this.$store.state, e);
		});
		this.$emit("hasSetting", this.showSetting);
		this.registerOBS();
		this.loadSettings();
		window.onbeforeunload = this.saveSettings;
	},
	beforeUnmount() {
		closeWorker();
		clearTimeout(this.timer);
		this.saveSettings();
	},
	computed: {
		...mapState(["userSession", "roomProfile"])
	},
	methods: {
		startRobot() {
			clearTimeout(this.robotTimer);
			this.robotTimer = setTimeout(() => {
				this.sendMessage();
			}, 4000);
			ElMessage({
				message:
					"启动成功！将会在直播开启后自动发出消息；直播途中更改设置不需要重新启动;如果上一条弹幕也是鸡鸡人发的则不会重新发送",
				duration: 1500,
				type: "success"
			});
		},
		stopRobot() {
			clearTimeout(this.robotTimer);
			ElMessage({
				message: "停止成功！",
				duration: 1500,
				type: "success"
			});
		},
		sendMessage() {
			clearTimeout(this.robotTimer);
			if (this.roomProfile.liveID && this.settings.content) {
				chat({
					userID: this.userSession.userID,
					deviceID: this.userSession.deviceID,
					serviceToken: this.userSession.serviceToken,
					data: {
						visitorId: this.userSession.userID,
						liveId: this.roomProfile.liveID,
						content: this.settings.content
					}
				});
			}
			this.robotTimer = setTimeout(() => {
				this.sendMessage();
			}, this.settings.period * 1000);
		},
		registerOBS() {
			clearTimeout(this.timer);
			if (!isOnline() && !isConnecting()) {
				init({
					onOpen: () => {
						wsevent.register(`client-${this.$options.name}`);
					}
				});
			} else {
				wsevent.wsEmit(
					"voteUpdate",
					{
						status: this.status,
						title: this.title,
						voteItem: this.voteItem,
						backgroundImage: this.settings.backgroundImage,
						max: this.max,
						zoom: this.settings.zoom
					},
					`obs-${this.$options.name}`
				);
			}

			this.timer = setTimeout(() => {
				this.registerOBS();
			}, 3000);
		},
		showSetting() {
			this.settingShow = !this.settingShow;
		},
		loadSettings() {
			let settings = localStorage.getItem(`applet$${this.$options.name}`);
			if (settings) {
				settings = JSON.parse(settings);
				Object.assign(this.settings, settings);
			}

			this.upgradeSettings();
		},
		upgradeSettings() {
			document.body.style.setProperty(
				"--opacity",
				this.settings.opacity / 100
			);
			document.body.style.setProperty("--zoom", `${this.settings.zoom}%`);
		},
		saveSettings() {
			localStorage.setItem(
				`applet$${this.$options.name}`,
				JSON.stringify(this.settings)
			);
		}
	}
});
</script>
<style scoped lang='scss'>
.center-column {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.center-column > * {
	margin-bottom: 8px;
}
@font-face {
	font-family: "站酷快乐体";
	src: url("/fonts/站酷快乐体.ttf") format("truetype");
}
.shadow {
	text-shadow: rgb(0, 0, 0) -0.8px -0.8px 0px, rgb(0, 0, 0) 0px -0.8px 0px,
		rgb(0, 0, 0) 0.8px -0.8px 0px, rgb(0, 0, 0) 0.8px 0px 0px,
		rgb(0, 0, 0) 0.8px 0.8px 0px, rgb(0, 0, 0) 0px 0.8px 0px,
		rgb(0, 0, 0) -0.8px 0.8px 0px, rgb(0, 0, 0) -0.8px 0px 0px;
	color: white;
	font-family: 站酷快乐体;
}
.title {
	font-size: 18px;

	box-sizing: border-box;
	width: 100%;
	padding: 16px;
	text-align: center;
}
.outer {
	position: absolute;
	width: 100%;
	height: 100%;
	background-size: cover;
	background-position: center;
}
.block {
	padding: 0px 16px;
	width: calc(100% - 32px);
}

.row {
	justify-content: space-between;
	display: flex;
	align-items: center;
	padding: 0px 16px 8px 16px;
}
.row span {
	white-space: nowrap;
	flex-shrink: 0;
	font-size: 16px;
}
.graph {
	width: 100%;
	height: calc(100% - 40px);
	display: flex;
	justify-content: space-around;
	align-items: flex-end;
}
.set {
	height: 100%;
	position: relative;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
}
.set span {
	font-size: 18px;
}
.column {
	width: 90%;
	max-width: 50px;
	background-color: rgb(64, 158, 255);
	border-radius: 8px 8px 0px 0px;
	cursor: pointer;
	transition: height 0.3s ease;
}
.column:hover {
	background-color: rgb(138, 196, 255);
}
.votePanel {
	width: 100%;
	height: calc(100% - 53px);
	overflow-y: auto;
}
</style>

<template>
	<yt-live-chat-text-message-renderer :author-type="authorTypeText">
		<img-shadow id="author-photo" height="24" width="24" class="style-scope yt-live-chat-text-message-renderer"
			:imgUrl="avatarUrl"></img-shadow>
		<div id="content" class="style-scope yt-live-chat-text-message-renderer">
			<span id="timestamp" class="style-scope yt-live-chat-text-message-renderer">{{timeText}}</span>
			<yt-live-chat-author-chip class="style-scope yt-live-chat-text-message-renderer">
				<span id="author-name" dir="auto" class="style-scope yt-live-chat-author-chip" :type="authorTypeText">{{
          authorName
          }}
					<!-- 这里是已验证勋章 -->
					<span id="chip-badges" class="style-scope yt-live-chat-author-chip"></span>
				</span>
				<span id="chat-badges" class="style-scope yt-live-chat-author-chip">
					<author-badge class="style-scope yt-live-chat-author-chip" :isAdmin="authorType === 2"
						:privilegeType="privilegeType"></author-badge>
				</span>
			</yt-live-chat-author-chip>
			<span id="loveMessage" class="style-scope yt-live-chat-text-message-renderer">{{
        content
        }}<el-badge :value="repeated" :max="99" v-show="repeated > 1"
					class="style-scope yt-live-chat-text-message-renderer" :style="{'--repeated-mark-color': repeatedMarkColor}">
				</el-badge>
			</span>
		</div>
	</yt-live-chat-text-message-renderer>
</template>

<script>
import ImgShadow from "./ImgShadow.vue";
import AuthorBadge from "./AuthorBadge.vue";
import * as constants from "./api/constants";
import * as utils from "./api/utils";
import { defineComponent } from "vue";
// HSL
const REPEATED_MARK_COLOR_START = [210, 100.0, 62.5];
const REPEATED_MARK_COLOR_END = [360, 87.3, 69.2];

export default defineComponent({
	name: "LoveMessage",
	components: {
		ImgShadow,
		AuthorBadge
	},
	props: {
		avatarUrl: String,
		time: Date,
		authorName: String,
		authorType: Number,
		content: String,
		privilegeType: Number,
		repeated: Number
	},
	computed: {
		timeText() {
			return utils.getTimeTextHourMin(this.time);
		},
		authorTypeText() {
			return constants.AUTHOR_TYPE_TO_TEXT[this.authorType];
		},
		repeatedMarkColor() {
			let color = REPEATED_MARK_COLOR_START;
			if (this.repeated <= 2) {
				color = REPEATED_MARK_COLOR_START;
			} else if (this.repeated >= 10) {
				color = REPEATED_MARK_COLOR_END;
			} else {
				color = [0, 0, 0];
				const t = (this.repeated - 2) / (10 - 2);
				for (let i = 0; i < 3; i++) {
					color[i] =
						REPEATED_MARK_COLOR_START[i] +
						(REPEATED_MARK_COLOR_END[i] -
							REPEATED_MARK_COLOR_START[i]) *
							t;
				}
			}
			return `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`;
		}
	}
});
</script>

<style>
yt-live-chat-text-message-renderer > #content > #loveMessage > .el-badge {
	margin-left: 10px;
}

yt-live-chat-text-message-renderer
	> #content
	> #loveMessage
	> .el-badge
	.el-badge__content {
	font-size: 12px !important;
	line-height: 18px !important;
	text-shadow: none !important;
	font-family: sans-serif !important;
	color: #fff !important;
	background-color: var(--repeated-mark-color) !important;
	border: none;
}
</style>

<style src="./style/yt-live-chat-text-message-renderer.css"></style>
<style src="./style/yt-live-chat-author-chip.css"></style>

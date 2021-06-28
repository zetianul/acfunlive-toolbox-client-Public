export const hint = (): any => {
	return [
		{
			q: "要咋用？导入是啥？",
			a:
				"本工具箱支持样式导入导出，并且自带了2种样式（点击导入-主播版/观众版查看）,因此你可与其他同样使用工具箱的主播共享样式，或者让DD帮你定制样式;导入并编辑样式后应用到主播/观众端就可以啦"
		},
		{
			q: "什么是主播端/观众端？有什么区别？为什么要分两种？",
			a:
				"主播端就是开播以后主播看的弹幕,观众端同上,在开发过程中我们发现a站的弹幕姬样式在主播一侧看来非常累人，显示信息不清晰，因此将样式分开设置，主播端可以把样式调整的更简约，清晰显示弹幕，观众端可以更花哨"
		},
		{
			q: "那么怎么调整样式呢？",
			a:
				"一条弹幕由多个组件组成，如头像、用户名、评论等，选择某类型弹幕后在左下方添加/删除组件,点击齿轮编辑相应组件，点击上/下箭头调整组件左右排列,样式调整需要对一些基础的html/css知识有所了解,如果不是太懂建议只调整字体、颜色等,或者随便点点看看"
		},
		{
			q: "编辑完以后咋弄？",
			a:
				"直接保存到主播端/观众端即可，如果是在直播中，弹幕样式会实时更新上去"
		},
		{
			q: "每个类型弹幕都要设置一次，好麻烦！",
			a:
				"为此我们做了样式拉取功能，例如您在“评论”类型的弹幕中调整好了用户名的样式，在“点赞”类型的弹幕中只需添加用户名的组件并选中，点击右侧的“样式拉取”即可把评论的用户名样式拉过来"
		},
		{
			q: "啊我不懂/有点麻烦/懒",
			a:
				"可以找DD或站内@<a href='http&#58&#47&#47www.acfun.cn/u/45443067' target='_blank'>ACFUN-FOSS_开源⑨课</a>进行定制(免费)"
		}
	];
};
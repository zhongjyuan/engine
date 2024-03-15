var urlManagement = require("../utils/urlManagement.js");

/**
 * 搜索了帮助对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日19:59:23
 */
const searchbarHelper = {
	/**保存当前时间戳，用于最后一个项的删除操作 */
	lastItemDeletion: Date.now(),

	/**
	 * 提取文本中的标记
	 * @param {string} text - 待处理的文本
	 * @param {Array} tokens - 要提取的标记数组
	 * @returns {Array} - 处理结果数组
	 */
	extractTokens: function (text, tokens) {
		/**存储处理结果 */
		var out = [];

		/**剩余待处理的文本 */
		var remainingText = text;

		/**一个要提取的标记 */
		var nextToken;

		// 当仍然有下一个标记需要提取时
		while (nextToken?.index !== -1) {
			nextToken = tokens
				.map((token) => ({ token, index: remainingText.toLowerCase().indexOf(token) })) // 在剩余文本中查找每个标记的索引
				.reduce((a, b) => {
					// 返回第一个具有最小索引的标记
					if ((a.index <= b.index && a.index !== -1) || b.index === -1) {
						return a;
					} else {
						return b;
					}
				});

			// 如果找到了下一个标记
			if (nextToken.index !== -1) {
				// 将标记之前的文本添加到结果中
				out.push(remainingText.substring(0, nextToken.index));

				// 将标记添加到结果中
				out.push({ token: remainingText.substring(nextToken.index, nextToken.index + nextToken.token.length) });

				// 更新剩余文本
				remainingText = remainingText.substring(nextToken.index + nextToken.token.length);
			}
		}

		// 将剩余文本添加到结果中
		out.push(remainingText);

		// 返回处理结果
		return out;
	},

	/**
	 * 创建一个带有文本内容的标题元素。
	 * @param {Object} data - 标题数据对象
	 * @param {string} data.text - 要显示的文本内容
	 * @returns {HTMLHeadingElement} - 返回一个包含指定文本内容的 `<h4>` 标题元素
	 */
	createHeading: function (data) {
		var heading = document.createElement("h4");
		heading.className = "searchbar-heading";
		heading.textContent = data.text || "";
		return heading;
	},

	/**
	 * 从给定的文本中提取真实标题。
	 * @param {string} text - 要解析的文本
	 * @returns {string} - 返回提取到的真实标题
	 */
	getRealTitle: function (text) {
		// 不要尝试解析URL
		if (urlManagement.isURL(text)) {
			return text;
		}

		var possibleCharacters = ["|", ":", " - ", " — "];

		for (var i = 0; i < possibleCharacters.length; i++) {
			var char = possibleCharacters[i];
			// 匹配 title | website name 类型的URL
			var titleChunks = text.split(char);

			if (titleChunks.length >= 2) {
				var titleChunksTrimmed = titleChunks.map((c) => c.trim());
				if (
					titleChunksTrimmed[titleChunksTrimmed.length - 1].length < 5 ||
					titleChunksTrimmed[titleChunksTrimmed.length - 1].length / text.length <= 0.3
				) {
					return titleChunks.slice(0, -1).join(char);
				}
			}
		}

		// 如果无法解析，则回退到原始标题
		return text;
	},

	/**
	 * 创建一个搜索结果项
	 * @param {Object} data - 包含项数据的对象
	 * @property {string} data.title - 项的标题
	 * @property {string[]} data.metadata - 要在次要文本前显示的字符串列表（用连字符分隔）
	 * @property {string} data.secondaryText - 项的次要文本
	 * @property {string} data.icon - Carbon 图标的名称
	 * @property {string} data.image - 要显示的图像的 URL
	 * @property {string} data.iconImage - 要显示为图标的图像的 URL
	 * @property {string} data.descriptionBlock - 描述块中的文本
	 * @property {string} data.attribution - 当项被聚焦时要显示的归属文本
	 * @property {function} data.delete - 删除结果项的函数，在检测到向左滑动时调用
	 * @property {boolean} data.showDeleteButton - 是否显示 [x] 按钮，并调用删除函数
	 * @property {Object} data.button - 出现在项右侧的按钮（如果 showDeleteButton 为 false）
	 * @property {string} data.button.icon - 按钮的图标名称
	 * @property {function} data.button.fn - 按钮的点击事件处理函数
	 * @property {string[]} data.classList - 要添加到项上的类列表
	 * @property {boolean} data.fakeFocus - 项是否应该显得聚焦
	 * @property {string} data.colorCircle - 使用给定颜色显示的颜色圆圈
	 * @property {number} data.opacity - 项的不透明度
	 * @returns {HTMLElement} - 返回一个包含搜索结果项的 div 元素
	 */
	createItem: function (data) {
		/**创建一个 div 元素，并添加 searchbar-item 类 */
		var item = document.createElement("div");
		item.classList.add("searchbar-item");

		// 设置 tabindex 属性为 -1，使元素可以接收焦点但不会通过 tab 键聚焦到该元素
		item.setAttribute("tabindex", "-1");

		// 如果 data 对象中包含 classList 属性，则将其值作为类名添加到元素上
		if (data.classList) {
			for (var i = 0; i < data.classList.length; i++) {
				item.classList.add(data.classList[i]);
			}
		}

		// 如果 data 对象中包含 fakeFocus 属性且为 true，则为元素添加 fakefocus 类
		if (data.fakeFocus) {
			item.classList.add("fakefocus");
		}

		// 如果 data 对象中包含 opacity 属性，则设置元素的透明度
		if (data.opacity) {
			item.style.opacity = data.opacity;
		}

		// 如果 data 对象中包含 colorCircle 属性，则创建一个带有指定颜色的 color-circle 元素，并将其添加到 item 中
		if (data.colorCircle) {
			var colorCircle = document.createElement("div");
			colorCircle.className = "image color-circle";
			colorCircle.style.backgroundColor = data.colorCircle;

			item.appendChild(colorCircle);
		}

		// 如果 data 对象中包含 icon 属性，则创建一个 i 元素，并添加指定的 icon 类，并将其添加到 item 中
		if (data.icon) {
			var el = document.createElement("i");
			el.className = "i " + data.icon;
			item.appendChild(el);
		}

		// 如果 data 对象中包含 title 属性，则创建一个 span 元素，并添加 title 类，如果没有 secondaryText 属性，则添加 wide 类，设置元素的文本内容为 title 的值，并将其添加到 item 中
		if (data.title) {
			var title = document.createElement("span");
			title.classList.add("title");

			if (!data.secondaryText) {
				title.classList.add("wide");
			}

			title.textContent = data.title.substring(0, 1000);

			item.appendChild(title);
		}

		// 如果 data 对象中包含 secondaryText 属性，则创建一个 span 元素，并添加 secondary-text 类，设置元素的文本内容为 secondaryText 的值，并将其添加到 item 中
		if (data.secondaryText) {
			var secondaryText = document.createElement("span");
			secondaryText.classList.add("secondary-text");

			secondaryText.textContent = data.secondaryText.substring(0, 1000);

			item.appendChild(secondaryText);

			// 如果 data 对象中包含 metadata 属性，则遍历 metadata 数组，创建包含每个元素值的 span 元素，并添加 md-info 类，并将其添加到 secondaryText 中
			if (data.metadata) {
				data.metadata.forEach(function (str) {
					var metadataElement = document.createElement("span");
					metadataElement.className = "md-info";

					metadataElement.textContent = str;

					secondaryText.insertBefore(metadataElement, secondaryText.firstChild);
				});
			}
		}

		// 如果 data 对象中包含 image 属性，则创建一个 img 元素，并添加 image 类，设置元素的 src 属性为 image 的值，并将其添加到 item 中
		if (data.image) {
			var image = document.createElement("img");
			image.className = "image";
			image.src = data.image;

			item.insertBefore(image, item.childNodes[0]);
		}

		// 如果 data 对象中包含 iconImage 属性，则创建一个 img 元素，并添加 icon-image 类，设置元素的 src 属性为 iconImage 的值，并将其添加到 item 中
		if (data.iconImage) {
			var iconImage = document.createElement("img");
			iconImage.className = "icon-image";
			iconImage.src = data.iconImage;
			iconImage.setAttribute("aria-hidden", true);

			item.insertBefore(iconImage, item.childNodes[0]);
		}

		// 如果 data 对象中包含 descriptionBlock 属性，则创建一个 span 元素，并添加 description-block 类
		if (data.descriptionBlock) {
			var dBlock = document.createElement("span");
			dBlock.classList.add("description-block");

			// 如果 data 对象中包含 highlightedTerms 属性，则提取出其中的关键词，并使用强调标签包裹关键词，然后将其添加到 dBlock 中；否则直接将 descriptionBlock 的值设置为文本内容
			if (data.highlightedTerms) {
				searchbarHelper.extractTokens(data.descriptionBlock, data.highlightedTerms).forEach(function (span) {
					if (typeof span === "string") {
						dBlock.appendChild(document.createTextNode(span));
					} else {
						var s = document.createElement("strong");
						s.textContent = span.token;
						dBlock.appendChild(s);
					}
				});
			} else {
				dBlock.textContent = data.descriptionBlock;
			}

			item.appendChild(dBlock);
		}

		// 如果 data 对象中包含 attribution 属性，则创建一个 span 元素，并添加 attribution 类，设置元素的文本内容为 attribution 的值，并将其添加到 item 中
		if (data.attribution) {
			var attrBlock = document.createElement("span");
			attrBlock.classList.add("attribution");

			attrBlock.textContent = data.attribution;
			if (data.descriptionBlock) {
				// 用于使 attribution 与文本对齐，即使左侧有图像存在
				dBlock.appendChild(attrBlock);
			} else {
				item.appendChild(attrBlock);
			}
		}

		// 如果 data 对象中包含 delete 属性，则为 item 添加 mousewheel 事件和 auxclick 事件的监听器，以执行删除操作
		if (data.delete) {
			item.addEventListener("mousewheel", function (e) {
				var self = this;
				if (e.deltaX > 50 && e.deltaY < 3 && Date.now() - searchbarHelper.lastItemDeletion > 700) {
					searchbarHelper.lastItemDeletion = Date.now();

					self.style.opacity = "0";
					self.style.transform = "translateX(-100%)";

					setTimeout(function () {
						data.delete(self);
						self.parentNode.removeChild(self);
						searchbarHelper.lastItemDeletion = Date.now();
					}, 200);
				}
			});

			item.addEventListener("auxclick", function (e) {
				if (e.button === 1) {
					// 中键点击
					data.delete(item);
					item.parentNode.removeChild(item);
				}
			});
		}

		// 如果 data 对象中包含 showDeleteButton 属性且为 true，则将 button 对象赋值，该对象包含 icon 和 fn 属性，用于定义按钮的图标和点击事件
		if (data.showDeleteButton) {
			data.button = {
				icon: "carbon:close",
				fn: function () {
					data.delete(item);
					item.parentNode.removeChild(item);
				},
			};
		}

		// 如果 data 对象中包含 button 属性，则创建一个 button 元素，添加 action-button、ignores-keyboard-focus 类，并设置 tabindex 为 -1，将 button.icon 设置为元素的类名，添加点击事件监听器，并将其添加到 item 中
		if (data.button) {
			var button = document.createElement("button");
			button.classList.add("action-button");
			button.classList.add("ignores-keyboard-focus"); // for keyboardNavigationHelper
			button.tabIndex = -1;
			button.classList.add("i");
			button.classList.add(data.button.icon);

			button.addEventListener("click", function (e) {
				e.stopPropagation();
				data.button.fn(this);
			});
			item.appendChild(button);
			item.classList.add("has-action-button");
		}

		// 如果 data 对象中包含 click 属性，则为 item 添加 click 事件监听器
		if (data.click) {
			item.addEventListener("click", data.click);
		}

		// 为 item 添加 keydown 事件监听器，如果按下的是回车键，则触发 click 事件
		item.addEventListener("keydown", function (e) {
			if (e.key === "Enter") {
				item.click();
			}
		});

		return item;
	},

	/**
	 * 创建一个懒加载列表。
	 * @param {Element} scrollRoot - 滚动容器元素，用于监视可见性变化
	 * @returns {Object} - 返回包含相关方法和属性的对象
	 */
	createLazyList: function (scrollRoot) {
		// 创建 IntersectionObserver 实例
		const observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						// 获取数据项的索引
						const itemIndex = parseInt(entry.target.getAttribute("data-index"));

						// 使用实际数据项替换占位符元素
						entry.target.parentNode.replaceChild(searchbarHelper.createItem(dataEntries[itemIndex]), entry.target);
					}
				});
			},
			{
				root: scrollRoot, // 观察器的根元素，即滚动容器
				threshold: 0, // 阈值，表示元素可见性的变化程度
				rootMargin: "750px", // 根元素的边距
			}
		);

		let itemCount = 0;
		const dataEntries = [];

		return {
			/**
			 * 创建一个占位符元素。
			 * @returns {Element} - 返回创建的占位符元素
			 */
			createPlaceholder: function () {
				const el = document.createElement("div");
				el.className = "searchbar-item placeholder";
				el.setAttribute("data-index", itemCount);
				itemCount++;
				return el;
			},

			/**
			 * 懒加载渲染数据项。
			 * @param {Element} placeholder - 占位符元素
			 * @param {*} data - 实际的数据项
			 */
			lazyRenderItem: function (placeholder, data) {
				dataEntries.push(data);
				const itemIndex = parseInt(placeholder.getAttribute("data-index"));
				// IntersectionObserver 异步渲染数据项，导致数据项一开始出现时出现闪烁
				// 为了避免这种情况，前 25 个数据项（大约是屏幕上的一屏）会立即渲染
				if (itemIndex < 25) {
					placeholder.parentNode.replaceChild(searchbarHelper.createItem(dataEntries[itemIndex]), placeholder);
				} else {
					observer.observe(placeholder);
				}
			},
		};
	},
};

module.exports = searchbarHelper;

<template>
	<view class="homePage">
		<!-- 状态栏 -->
		<statusBar></statusBar>
		<!-- 漂浮头部 -->
		<view class="header">
			<!-- 切换地理位置 -->
			<view class="location">
				<view class="local" @tap="showPicker">
					<view class="text uni-ellipsis">{{picker.pickerText}}</view>
					<view class="icon">
						<uni-icon type="arrowdown" size="18"></uni-icon>
					</view>
				</view>
				<mpvue-picker ref="mpvuePicker" :mode="picker.mode" :deepLength="picker.deepLength" :pickerValueDefault="picker.pickerValueDefault"
				 :themeColor="picker.themeColor" @onChange="onChange" @onConfirm="onConfirm" @onCancel="onCancel"
				 :pickerValueArray="picker.pickerValueArray"></mpvue-picker>
			</view>
			<!-- 搜索 -->
			<view class="search-wrap">
				<view class="search uni-flex">
					<view class="icon uni-inline-item flex-center-center">
						<uni-icon type="search" size="20"></uni-icon>
					</view>
					<view class="input uni-flex-item" @tap="toSearch()">
						名称,类型
					</view>
				</view>
			</view>
			<!-- 消息 -->
			<view class="messages" @tap="toSubCategoryNav">
				<view class="icon">
					<uni-icon type="bars" size="24"></uni-icon>
				</view>
				<!-- <uni-badge text="2" type="error" size="small"></uni-badge> -->
			</view>
		</view>
		<!-- 占位 -->
		<!-- <view class="place"></view> -->
		<!-- 内容 -->
		<view class="swiper-content">
			<view class="uni-tab-bar">
				<view class="custom-tabs">
					<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
						<view v-for="(tab,index) in tabBars" :key="tab.id" class="swiper-tab-list" :class="tabIndex==index ? 'active' : ''" :id="'tar'+index"
						 :data-current="index" @tap="tapTab">
							{{tab.name}}
							<view class="bottom-line"></view>
						 </view>
					</scroll-view>
					<!-- <view class="subCategory" @tap="toSubCategoryNav" v-if="isShowSubCategoryNav">
						分类
					</view> -->
				</view>
				<swiper :current="tabIndex" class="swiper-box" :duration="300" @change="changeTab">
					<swiper-item v-for="(tab,index1) in dataList" :key="index1">
						<scroll-view class="list" :class="'list'+ index1" scroll-y @scrolltolower="loadMore(index1)" scroll-top="0" @scroll="onPageScroll">		
							<!-- 轮播图 -->
							<customSwiper :swiperList="tab.swiperList" @toSwiper="toSwiper" :isDotsInside="false"></customSwiper>
							<view class="goods-list">
								<view class="title">好物热卖</view>
								<!-- 商品列表 -->
								<view class="product-list">
									<view class="product" v-for="(item,index2) in tab.data" :key="index2" @tap="toGoods(item)" :id="'swiper'+index1">		
										<view class="uni-media-list-logo">
											<image class="image" lazy-load :class="{lazy:!item.show}" :data-index="index2" @load="onLoad" :src="item.show?item.img:''" />
											<image class="image placeholder" :class="{loaded:item.loaded}" :src="placeholderSrc" />
										</view>
										<view class="name">{{item.name}}</view>
										<view class="info">
											<view class="price">{{item.price}}</view>
											<view class="slogan">{{item.slogan}}</view>
										</view>	
									</view>
								</view>
							</view>
							<!-- 底部信息 -->
							<bottomInfo></bottomInfo>
							<!-- 加载更多 -->
							<view class="uni-tab-bar-loading">
								{{tab.loadingText}}
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>
<script>
	import { uniBadge,uniIcon } from '@dcloudio/uni-ui';
	import mpvuePicker from 'mpvue-picker';
	import _ from "lodash";
	import topTabMenu from "../../components/common/topTabMenu.vue";
	import customSwiper from "../../components/common/custom-swiper.vue";
	import cityData from "../../common/city.data.js";
	import service from '../../common/service.js';
	import util from "../../common/util.js";
	//高德SDK
	import amap from '../../common/SDK/amap-wx.js';
	const tpl = {
		data0: {
			goods_id: 0,
			img: '/static/img/common/good1.jpg',
			name: '老街口-红糖麻花500g/袋',
			price: '￥58',
			slogan: '1096人付款'
		},
		data1: {
			goods_id: 1,
			img: '/static/img/common/good2.jpg',
			name: '阿玛熊红豆薏米粉480g熟早餐五谷核桃黑豆粉牛奶燕麦熟早餐五谷核桃黑豆粉牛奶燕麦',
			price: '￥68',
			slogan: '686人付款'
		},
		data2: {
			goods_id: 2,
			img: '/static/img/common/good3.jpg',
			name: '刘涛推荐负离子乳胶枕，享有氧睡眠',
			price: '￥368',
			slogan: '1234人付款'
		},
		data3: {
			goods_id: 3,
			img: '/static/img/common/good4.jpg',
			name: '阿迪达斯SUPERSTAR金标贝壳头小白鞋',
			price: '￥668',
			slogan: '678人付款'
		},
		data4: {
			goods_id: 4,
			img: '/static/img/common/good5.jpg',
			name: '【第二件半价】雅思嘉猴头菇饼干整箱750g 早餐休闲零食',
			price: '￥218',
			slogan: '52244人付款'	
		}
	};
	
	export default {
		components: {
			topTabMenu,
			uniIcon,
			uniBadge,
			mpvuePicker,
			customSwiper
			// dropDownRefresh
		},
		data() {
			return {
				scrollLeft: 0,
				isClickChange: false,
				isShowSubCategoryNav: false,
				tabIndex: 0,
				dataList: [],
				tabBars: [],
				// 图片默认路径
				placeholderSrc: "/static/img/logo@0.5x.png",
				// 设备屏幕高度
				windowHeight: 0,
				picker: {
					mode: 'multiLinkageSelector',
					deepLength: 2, // 几级联动
					pickerValueDefault: [], // 初始化值
					pickerValueArray: cityData, // picker 数组值
					pickerText: '武汉',
					themeColor: '#000', // 颜色主题
				},
				//轮播
				swiperList: [{
						sid: 0,
						src: '自定义src0',
						img: '/static/img/common/banner1.jpg',
					},
					{
						sid: 1,
						src: '自定义src1',
						img: '/static/img/common/banner2.jpg'
					},
					{
						sid: 2,
						src: '自定义src2',
						img: '/static/img/common/banner3.jpg'
					},
					{
						sid: 3,
						src: '自定义src3',
						img: '/static/img/common/banner4.jpg'
					}
				],

			};
		},
		computed: {

		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 pullToRefresh
		onPullDownRefresh() {
			this.dataList[this.tabIndex].data =  [];
			this.dataList[this.tabIndex].swiperList = [];
			this.dataList[this.tabIndex].loadingText = '加载更多...',
			setTimeout(() => {
				if(this.dataList[this.tabIndex].swiperList.length === 0) {
					this.dataList[this.tabIndex].swiperList = this.swiperList;
				}
				if(this.dataList[this.tabIndex].data.length === 0){
					this.addData(this.tabIndex)
				}
			
				let timer = setTimeout(()=>{
					this.load();
					timer = null;
				},100)	
				uni.stopPullDownRefresh();
			}, 1000);
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			// uni.showToast({title: '触发上拉加载'});
		},
		methods: {
			init() {
				// 获取设备高度
				this.windowHeight = uni.getSystemInfoSync().windowHeight;
				// 初始化navbar
				this.initBar();
				// 获取当前地图定位
				this.getPosition();
			},
			// 获取当前地图定位
			getPosition(){
				// #ifdef APP-PLUS
				this.amapPlugin = new amap.AMapWX({
					//高德地图KEY，参考：http://ask.dcloud.net.cn/article/35070
					key: '7da2bb476a91a511d0c3b6626f7be558'
				});
				//定位地址
				this.amapPlugin.getRegeo({
					success: data => {
						this.picker.pickerText = data[0].regeocodeData.addressComponent.city.replace(/市/g, ''); //把"市"去掉
					}
				});
				// #endif
			},
			// 是否开启刷新
			isSupportRefresh(){
				// 获取内容主体的高度
				uni.createSelectorQuery().in(this).select(`.list${this.tabIndex}`).scrollOffset((res) => {
					// console.log("竖直滚动位置" + res.scrollTop);
					// 滚动到顶部才开启
					let isSupport = res.scrollTop === 0 ? true : false;
					// #ifdef APP-PLUS
					// 下拉刷新的起始位置(状态栏高度+导航栏高度+导航tab的高度)
					const offset = uni.getSystemInfoSync().statusBarHeight + 100 + 100;
					util.setRefreshMode(isSupport, offset);
					// #endif
				}).exec()
			},
			// 初始化navBar
			async initBar(){
				let parms = {
					"classScheme": "cat1"
				}
				uni.showLoading({
					title: "加载中..."
				})
				service.getGoodTopClass(parms).then(res=>{
					uni.hideLoading();
					let data = res.data.data;
					this.tabBars = data;
					this.isShowSubCategoryNav = true;
					this.dataList = this.randomfn();
					let timer = setTimeout(()=>{
						this.load();
						timer = null;
					},100)
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon:"none",
						title: "获取顶部导航数据失败"
					})
				})
			},
			// 获取推荐数据
			getHotListByBar(){
				
			},
			// 二级联动
			showPicker() {
				this.$refs.mpvuePicker.show();
			},
			onConfirm(e) {
				console.log(e);
				if (e && e.label) {
					this.picker.pickerText = e.label.split('-')[1];
				}
			},
			onChange(e) {
				console.log(e);
			},
			onCancel(e) {
				console.log(e);
			},
			//消息页跳转
			goMessagesPage() {
				uni.navigateTo({
					url: '/pages/home/messages'
				})
			},
			//搜索跳转
			toSearch() {
				uni.hideKeyboard();
				uni.navigateTo({
					url: '/pages/home/search'
				})
			},
			//轮播图跳转
			toSwiper(e) {
				// this.initBar()
				uni.showToast({
					title: e.src
				});
			},
			//商品跳转
			toGoods(e) {
				uni.navigateTo({
					url: `/pages/home/goods_detail?id=${e.id}`
				})
			},
			loadMore(e) {
				// console.log(123123)
				// setTimeout(() => {
					this.addData(e);
				// }, 500);
				let timer = setTimeout(()=>{
					this.load();
					timer = null;
				},30)	
			},
			addData(e) {
				if (this.dataList[e].data.length > 30) {
					this.dataList[e].loadingText = '没有更多了';
					return;
				}
				for (let i = 1; i <= 10; i++) {
					this.dataList[e].data.push(tpl['data' + Math.floor(Math.random() * 5)]);
				}
			},
			//去二级分类页面
			toSubCategoryNav(){
				uni.navigateTo({
					url: "/pages/home/subCategory_nav"
				})
			},
			async changeTab(e) {
				let index = e.target.current;
				if(this.dataList[index].swiperList.length === 0) {
					this.dataList[index].swiperList = this.swiperList;
				}
				if(this.dataList[index].data.length === 0){
					this.addData(index)
				}
				if (this.isClickChange) {
					this.tabIndex = index;
					this.isClickChange = false;
					return;
				}
				this.setScrollLeft(index);
				this.isClickChange = false;
				this.tabIndex = index; //一旦访问data就会出问题
				
				let timer = setTimeout(()=>{
					this.load();
					timer = null;
				},100)	
				// 控制刷新开启关闭
				this.isSupportRefresh();
			},
			 //得到元素的size
			getElSize(id) {
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select("#" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				})
			},
			//点击tab-bar
			async tapTab(e) {
				let tabIndex = e.target.dataset.current;
				if(this.dataList[tabIndex].swiperList.length === 0) {
					this.dataList[tabIndex].swiperList = this.swiperList;
				}
				if(this.dataList[tabIndex].data.length === 0){
					this.addData(tabIndex)
				}
				if (this.tabIndex === tabIndex) {
					return false;
				} else {
					this.setScrollLeft(tabIndex);
					this.isClickChange = true;
					this.tabIndex = tabIndex;
				}
				let timer = setTimeout(()=>{
					this.load();
					timer = null;
				},100)	
				
				// 控制刷新开启关闭
				this.isSupportRefresh();
			},
			// 设置顶部nav的滚动距离
			async setScrollLeft(index){
				let tabBar = await this.getElSize("tab-bar"),
					tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
				// let subCategoryNavWidth = uni.upx2px(100);
				let width = 0;
				for (let i = 0; i < index; i++) {
					let result = await this.getElSize('tar'+i);
					width += result.width;
				}
				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getElSize('tar'+index),
					nowWidth = nowElement.width;
// 				if (width + nowWidth - tabBarScrollLeft > winWidth - subCategoryNavWidth) {
// 					this.scrollLeft = width + nowWidth - winWidth + subCategoryNavWidth;
// 				}
				if (width + nowWidth - tabBarScrollLeft > winWidth) {
					this.scrollLeft = width + nowWidth - winWidth;
				}
				if (width < tabBarScrollLeft) {
					this.scrollLeft = width;
				}
			},
			randomfn() {
				let ary = [];
				for (let i = 0, length = this.tabBars.length; i < length; i++) {
					let aryItem = {
						loadingText: '加载更多...',
						data: [],
						swiperList: []
					};
					if(i < 1){
						for (let j = 1; j <= 10; j++) {
							let item = tpl['data' + Math.floor(Math.random() * 5)];
							item.show = false;
							item.loaded = false;
							aryItem.data.push(item);
							aryItem.swiperList = this.swiperList;
						}
					}
					ary.push(aryItem);
				}
				return ary;
			},
			// 图片懒加载
			load() {
				uni.createSelectorQuery().in(this).selectAll(`#swiper${this.tabIndex} .lazy`).boundingClientRect((images) => {
					images.forEach((image, index) => {
						if (image.top <= this.windowHeight) {
							// this.dataList[this.tabIndex].data[image.dataset.index].show = true;
							let item = Object.assign({}, this.dataList[this.tabIndex].data[image.dataset.index]);
							item.show = true;
							// 重新刷新数据
							this.$set(this.dataList[this.tabIndex].data, image.dataset.index, item);
						}
					})
				}).exec()
			},
			// 图片加载完毕的回调
			onLoad(e) {
				// 图片url为空就不会执行这里
				// this.dataList[this.tabIndex].data[e.target.dataset.index].loaded = true;
				let item = Object.assign({}, this.dataList[this.tabIndex].data[e.target.dataset.index]);
				item.loaded = true;
				this.$set(this.dataList[this.tabIndex].data, e.target.dataset.index, item);
			},
			// Scroll-view组件的滚动监听
			onPageScroll: _.throttle(function(){
				// 控制图片懒加载
				this.load();
				// 控制刷新开启关闭
				this.isSupportRefresh();
			}, 100)
		},
		created() {
			this.init();
			// #ifdef APP-PLUS
			// 下拉刷新的起始位置(状态栏高度+导航栏高度+导航tab的高度)
			const offset = uni.getSystemInfoSync().statusBarHeight + 100 + 100;
			util.setRefreshMode(true, offset);
			// #endif
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		background-color: #f0f0f0;
	}

	.homePage {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		.header {
			width: 100%;
			height: 88upx;
			background-color: $uni-bg-color-status;
			color: $uni-text-color-status;
			display: flex;
			position: fixed;
			top: 0;
			/*  #ifdef  APP-PLUS  */
			top: var(--status-bar-height);
			/*  #endif  */
			z-index: 996;

			.messages {
				width: 100upx;
				height: 88upx;
				flex-shrink: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;

				.uni-badge {
					position: absolute;
					top: 12upx;
					right: 4upx;
				}
			}

			.search-wrap {
				width: calc(100% - 246upx);
				height: 88upx;
				display: flex;
				justify-content: center;
				align-items: center;
				.search{
					width: 100%;
					height: 56upx;
					background-color: #ffffff;
					font-size: 28upx;
					border-radius: 4upx;
					.icon {
						width: 56upx;
						height: 56upx;
						color: #666;
					}
					.input {
						line-height: 56upx;
						color: #999;
					}
				}

				
			}

			.location {
				width: 146upx;
				height: 100%;
				font-size: 30upx;

				.local {
					width: 100%;
					height: 100%;
					flex-shrink: 1;
					display: flex;
					justify-content: center;
					align-items: center;

					.text {
						max-width: 65%;
					}
				}

			}
		}

		.place {
			/*  #ifdef  APP-PLUS  */
			margin-top: var(--status-bar-height);
			/*  #endif  */
			background-color: #ff570a;
			height: 88upx;
		}
	
		.swiper-content {
			width: 100%;
			height: 100%;
			position: relative;
			/* #ifdef H5 */
			top: 88upx;
			/* #endif */	
			/*  #ifdef  APP-PLUS  */
			top: calc(var(--status-bar-height) + 88upx);
			/*  #endif  */
			padding-bottom: 100upx;
			box-sizing: border-box;
			.custom-tabs{	
// 				.subCategory{
// 					width: 100upx;
// 					line-height: 88upx;
// 					height: 88upx;
// 					border:none;
// 					background-color: #fff;
// 					z-index: 1000;
// 					position: fixed;
// 					right: 0;
// 					/* #ifdef H5 */
// 					top: 88upx;
// 					/* #endif */	
// 					/*  #ifdef  APP-PLUS  */
// 					top: calc(var(--status-bar-height) + 88upx);
// 					/* #endif */
// 					text-align: center;
// 					box-shadow: -2upx 0upx 20upx -2upx #242424;
// 				}
				.uni-swiper-tab{
					// width: calc(100% - 100upx);
					width: 100%;
					height: 88upx;
					line-height: 88upx;
					border:none;
					background-color: #fff;
					z-index: 100;
					position: fixed;
					left: 0;
					/* #ifdef H5 */
					top: 88upx;
					/* #endif */	
					/*  #ifdef  APP-PLUS  */
					top: calc(var(--status-bar-height) + 88upx);
					/* #endif */
// 					padding-right: 20upx;
// 					box-sizing: border-box;
					.swiper-tab-list{
						width:auto;
						position: relative;
						font-size: 26upx;
						color: #707070;
						padding: 0 20upx;
						box-sizing: border-box;
						&.active{
							color: #242424;
							font-size: 27upx;
							.bottom-line{
								width: 20%;
								height: 6upx;
								position: absolute;
								bottom: -20upx;
								left: 50%;
								transform: translateX(-50%);
								background-color: #242424;
							}
						}
					}
				}
			}
			
			.swiper-box{
				height: calc(100% - 100upx);
				padding-top: 88upx;
				box-sizing: border-box;
			}
			
			.goods-list {
				background-color: #fff;
				font-weight: 600;
			
				.title {
					width: 100%;
					height: 60upx;
					color: #242424;
					font-size: 40upx;
					margin-bottom: 36upx;
					padding: 0 30upx;
					box-sizing: border-box;
				}			
				.product-list {
					width: 100%;
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					padding: 0 30upx;
					box-sizing: border-box;
			
					.product {
						width: 47.75%;
						border-radius: 20upx;
						background-color: #fff;
						margin: 0 0 15upx 0;
						.placeholder {
							opacity: 0.1;
							// transition: opacity 0.2s linear;
						}
						
						.placeholder.loaded {
							opacity: 0;
						}
						
						.uni-media-list-logo {
							width: 100%;
							height: 300upx;
							position: relative;
						}
						
						.uni-media-list-logo .image {
							position: absolute;
						}
			
						.name {
							width: 100%;
							padding: 10upx 0;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
							font-weight: 400;
							font-size: 26upx;
						}
			
						.info {
							display: flex;
							justify-content: space-between;
							align-items: center;
							width: 100%;
							font-weight: 100;
			
							.price {
								color: #4c9bfa;
								font-size: 30upx;
								font-weight: 600;
							}
			
							.slogan {
								color: #c2c2c2;
								font-size: 24upx;
							}
						}
					}
			
				}
			}
			.uni-tab-bar-loading{
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 60upx;
				color: #979797;
				font-size: 24upx;
				background-color: #f0f0f0;
				padding: 0;
			}
		}
		
	}
</style>

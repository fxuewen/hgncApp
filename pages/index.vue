<template>
	<view class="indexPage">
		<homePage v-if="page_code=='home'"></homePage>
		<nearbyPage v-if="page_code=='nearby'"></nearbyPage>
		<vipCenterPage v-if="page_code=='vipCenter'"></vipCenterPage>
		<shopCartPage v-if="page_code=='shopCart'"></shopCartPage>
		<minePage v-if="page_code=='mine'"></minePage>
		<footerNav></footerNav>
	</view>
</template>

<script>
	import homePage from "../components/index/home_page.vue";
	import nearbyPage from "../components/index/nearby_page.vue";
	import vipCenterPage from "../components/index/vipCenter_page.vue";
	import shopCartPage from "../components/index/shopCart_page.vue";
	import minePage from "../components/index/mine_page.vue";
	import footerNav from "../components/index/footer_nav.vue";
	
	import { mapMutations, mapState } from "vuex";
	import service from "../common/service.js";
	export default {
		data() {
			return {}
		},
		components: {
			homePage,
			nearbyPage,
			vipCenterPage,
			shopCartPage,
			minePage,
			footerNav
		},	
		computed: {
			...mapState(["footer_store"]),
			page_code() {
				return this.footer_store.footer_nav[this.footer_store.now_page_index].name_code;
			}
		},
		onLoad() {
			this.getConfigs();
		},
		methods: {
			...mapMutations(['SET_CONFIGS']), 
			// 获取后台相关配置
			getConfigs(){
				uni.showLoading({
					title: "加载中"
				})
				service.getConfigs().then(res=>{
					uni.hideLoading();
					let data = res.data.data;
					this.SET_CONFIGS(data);
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.errMsg,
					})
				})
			},
		},
		
	}
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100%;
	}
	.indexPage {
		width: 100%;
		height: 100%;;
	}
</style>

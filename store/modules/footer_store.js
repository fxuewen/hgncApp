import _ from "lodash";
export default {
	state:{
		footer_nav:[
			{
				name:'首页',
				name_code:'home',
				icon:'/static/img/index/icon_home_nor@2x.png',
				select_icon:'/static/img/index/icon_home_sel@2x.png',
				size:'small'
			},
			{
				name:'附近',
				name_code:'nearby',
				icon:'/static/img/index/icon_nearby_nor@2x.png',
				select_icon:'/static/img/index/icon_nearby_sel@2x.png',
				size:'small'
			},
			{
				name:'购物车',
				name_code:'shopCart',
				icon:'/static/img/index/icon_shopping-cart_nor@2x.png',
				select_icon:'/static/img/index/icon_shopping-cart_sel@2x.png',
				size:'small'
			},
			{
				name:'我的',
				name_code:'mine',
				icon:'/static/img/index/icon_mine_nor@2x.png',
				select_icon:'/static/img/index/icon_mine_sel@2x.png',
				size:'small'
			}
		],
		now_page_index:0,
	},
	mutations:{
		CHANGE_NAV_LIST(state, data){
			state.footer_nav = data;
		},
		CHANGE_PAGE(state, index){
			state.now_page_index = index;
		}
	},
	actions:{
		change_page(ctx, code){
			let index = _.findIndex(ctx.state.footer_nav, item => item.name_code === code);
			index = index > -1 ? index : 0;
			ctx.commit("CHANGE_PAGE", index)
		},
		menu_4(ctx){
			let menu_list = [
				{
					name:'首页',
					name_code:'home',
					icon:'/static/img/index/icon_home_nor@2x.png',
					select_icon:'/static/img/index/icon_home_sel@2x.png',
					size:'small'
				},
				{
					name:'附近',
					name_code:'nearby',
					icon:'/static/img/index/icon_nearby_nor@2x.png',
					select_icon:'/static/img/index/icon_nearby_sel@2x.png',
					size:'small'
				},
				{
					name:'购物车',
					name_code:'shopCart',
					icon:'/static/img/index/icon_shopping-cart_nor@2x.png',
					select_icon:'/static/img/index/icon_shopping-cart_sel@2x.png',
					size:'small'
				},
				{
					name:'我的',
					name_code:'mine',
					icon:'/static/img/index/icon_mine_nor@2x.png',
					select_icon:'/static/img/index/icon_mine_sel@2x.png',
					size:'small'
				}
			]
			
			ctx.commit("CHANGE_NAV_LIST",menu_list)
		},
		menu_5(ctx){
			let menu_list = [
				{
					name:'首页',
					name_code:'home',
					icon:'/static/img/index/icon_home_nor@2x.png',
					select_icon:'/static/img/index/icon_home_sel@2x.png',
					size:'small'
				},
				{
					name:'附近',
					name_code:'nearby',
					icon:'/static/img/index/icon_nearby_nor@2x.png',
					select_icon:'/static/img/index/icon_nearby_sel@2x.png',
					size:'small'
				},
				{
					name:'会员中心',
					name_code:'vipCenter',
					icon:'/static/img/index/icon_member-center_nor@2x.png',
					select_icon:'/static/img/index/icon_member-center_sel@2x.png',
					size:'small'
				},
				{
					name:'购物车',
					name_code:'shopCart',
					icon:'/static/img/index/icon_shopping-cart_nor@2x.png',
					select_icon:'/static/img/index/icon_shopping-cart_sel@2x.png',
					size:'small'
				},
				{
					name:'我的',
					name_code:'mine',
					icon:'/static/img/index/icon_mine_nor@2x.png',
					select_icon:'/static/img/index/icon_mine_sel@2x.png',
					size:'small'
				},
			]
			
			ctx.commit("CHANGE_NAV_LIST",menu_list)
		}
	}
}
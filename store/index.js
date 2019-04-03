import Vue from 'vue';
import Vuex from 'vuex';
import footer_store from "./modules/footer_store.js";
import shopCart_store from "./modules/shopCart_store.js";
import address_store from "./modules/address_store.js";
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		// 是否强制登录
		forcedLogin: false,
		// 是否已经登录
		hasLogin: false,
		// 用户名
		userName: "",
		// 用户等级，分为0,1,2,3,4五个等级
		userLevel: 0,
		// 用户id
		userId: "",
		// 是否校验用户密码
		isCheckPassword: false,
		// 全局的自定义标题栏的样式
		titleNView: Object.freeze({
			bg: '#242424',
			textColor: '#fff'
		})	
	},
	mutations: {
		// 登录动作
		LOGIN(state, data) {
		    state.userName = data.userName || 'PY_'+data.inviteCode;
			state.userLevel = data.role;
			state.userId = data.id;
		    state.hasLogin = true;
		},
		// 退出登录
		LOGOUT(state) {  
            state.hasLogin = false;   
            state.userName = '';  
			state.userLevel = 0;  
        },
		// 设置密码校验状态
		SET_PASSWORD_CHECKSTATUS(state, status) {
			state.isCheckPassword = status;
		}
	},
	actions: {
		
	},
	modules:{
		footer_store,
		shopCart_store,
		address_store
	}
})

export default store

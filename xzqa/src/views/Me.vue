<template>
    <div>
        <!-- 顶部导航开始 -->
        <mt-header title="个人中心">
            <router-link to="/" slot="left">
               <mt-button icon='back'></mt-button>
            </router-link>
        </mt-header>
        <!-- 顶部导航结束 -->
        <!-- 个人中心选项列表开始 -->
          <div>
              <mt-cell title='个人设置' isLink to="profile">
                  <img src="../assets/images/settings.png" alt="" slot="icon">
              </mt-cell>
              <mt-cell title='我的文章' isLink to="posts">
                  <img src="../assets/images/articles.png" alt="" slot="icon">
                  <mt-badge type="success" size="small">{{article_number}}篇</mt-badge>
              </mt-cell>
          </div>
        <!-- 个人中心选项列表结束 -->
        <!-- 底部选项卡开始 -->
        <mt-tabbar v-model="activeTabbar" fixed>
            <mt-tab-item id="index">
                <img src="../assets/images/index_enabled.png" alt="" slot="icon" v-if="activeTabbar=='index'">
                <img src="../assets/images/index_disabled.png" alt="" slot="icon" v-else>
                首页
            </mt-tab-item>
            <mt-tab-item id="me">
                <img src="../assets/images/my_enabled.png" alt="" slot="icon" v-if="activeTabbar=='me'">
                <img src="../assets/images/my_disabled.png" alt="" slot="icon" v-else>
                我的
            </mt-tab-item>
        </mt-tabbar>
        <!-- 底部选项卡结束 -->
    </div>
</template>

<script>
import {mapState} from 'vuex';
export default {
    computed:{
        ...mapState([
            "article_number"
        ])
    },
    data(){
        return{
            activeTabbar:'me'
        }
    },
    //事件的监听
    watch:{
        activeTabbar(){
            if(this.activeTabbar=="index"){
                //切换到首页路由
                this.$router.push("/");
            }else if(this.activeTabbar=="me"){
                this.$router.push("/me");
            }
        }
    }
}
</script>
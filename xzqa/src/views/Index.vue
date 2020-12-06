<template>
    <div>
        <!-- 顶部导航开始 -->
        <mt-header title='学前端，上学问'>
            <div slot="right" class="shortcut" v-if="!isLogined">
                <router-link to="/register">
                    <mt-button>注册</mt-button>
                </router-link>
                <router-link to="/login">
                    <mt-button>登录</mt-button>
                </router-link>
            </div>
            <div slot="right" v-else>
                <mt-button @click="loginout">
                <img src="../assets/images/user.png" alt="" slot="icon">
                </mt-button>
            </div>
        </mt-header>
        <!-- 顶部导航结束 -->
        <!-- 顶部选项卡开始 -->
        <mt-navbar v-model="active">
            <mt-tab-item 
                     v-for="(item,index) of category" 
                     :key="index"
                     :id="`${item.id}`">
                 {{item.category_name}}
            </mt-tab-item>
        </mt-navbar>
        <!-- 顶部选项卡结束 -->
        <!-- 面板区域开始 -->
        <!-- 在面板中设置无限滚动 -->
        <div class="main-panel"
             infinite-scroll-distance="10"
             v-infinite-scroll="loadMore"
             infinite-scroll-disabled="busy"
             infinite-scroll-immediate-check="true"
        >
            <mt-tab-container v-model="active">
                <mt-tab-container-item 
                     v-for="(item,key) of category"
                     :key="key"
                     :id="`${item.id}`">
                    <!-- 单一文章开始 -->
                    <div class="infoItem"
                       v-for="(articles,key) of articles"
                       :key="key"
                    >
                    <!-- 文章标题开始 -->
                    <div class="infoItemHead">
                        <router-link :to='`/article/${articles.id}`'>
                            {{articles.subject}}
                        </router-link>
                    </div>
                    <!-- 文章标题结束 -->
                    <!-- 文章内容区域开始 -->
                        <div class="infoItemContent">
                            <div class="infoItemImage" v-if="articles.image!=null">
                            <router-link :to="{name:'Article',params:{id:articles.id}}">
                                <img v-lazy="articles.image" alt="">
                            </router-link>
                            </div>
                            <div class="infoItemDes">
                                {{articles.description}}
                            </div>
                        </div>
                    <!-- 文章内容区域结束 -->
                    </div>
                    <!-- 单一文章结束 -->
                </mt-tab-container-item>
            </mt-tab-container>
        </div>
        <!-- 面板区域结束 -->
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

<style scoped>
  .shortcut a{
      color: #fff;
      margin-left: 5px;
  }
  .infoItem{
     padding: 10px 0;
     margin: 0 10px;
     border-bottom: .5px solid #333;
  }
  /* 文章标题 */
  .infoItemHead{
      font-size:16px;
      color: #1a1a1a;
      line-height: 22px;
      font-weight: bold;
      margin-bottom: 10px;
  }
  .infoItemHead a{
      color: #000;
      text-decoration: none;
  }
  /* 文章内容 */
  .infoItemContent{
      display: flex;
      align-items: center;
  }
  .infoItemImage{
      margin-right: 15px;
  }
  .infoItemImage img{
      width:112px;
      border-radius: 5px;
  }
  .infoItemDes{
      font-size: 15px;
      font-weight: 400;
      line-height: 21px;
      color: #444;
      height: 66px;
      overflow: hidden;
  }
.main-panel{
    margin-bottom: 55px;
}
</style>

<script>
import {mapState,mapMutations} from 'vuex';
export default {
    computed:{
       ...mapState([
           'isLogined'
       ])
    },
    data(){
        return{
            //默认顶部选项卡及面板
            active:"1",
            //默认的底部选项卡
            activeTabbar:'index',
            //存储文章分类的信息
            category:[],
            //存储文章的信息
            articles:[],
            //标识加载的状态
            busy:false,
            //存储当前的页码
            page:1,
            //存储总页码
            pageCount:""
        }
    },
    //事件的监听(active顶部导航的变化)
    watch:{
        //监听active顶部导航变化
        active(){
        //可能会出现数据的累加,清除之前选项卡所包含的文章列表，
        this.articles=[];
        //保证在切换选项卡后从当前选项卡的第一页获取数据
        this.page=1;
        this.getArticle();
        },
        activeTabbar(){
            if(this.activeTabbar=="index"){
                //切换到首页路由
                this.$router.push("/");
            }else if(this.activeTabbar=="me"){
                this.$router.push("/me");
            }
        }
    },
    //钩子函数
    created(){
        //获取文章的分类信息（UI,电商..）
        this.axios.get("/category").then(res=>{
            //console.log(res.data);
            this.category=res.data.category;
        });
        //获取默认选项卡的文章列表
        this.getArticle();
    },
    methods:{
        ...mapMutations([
            'loginoutMutations'
        ]),
        //用户注销
        loginout(){
             this.loginoutMutations();
        },
        //获取指定分类下的某一页的文章列表
        getArticle(){
            //将服务器的状态进行切换，处理中...
            this.busy=true;
            //显示加载提示框
            this.$indicator.open({
                text:"加载中",
                spinnerText:"snake"
            })
            //获取当前分页下的第几页的数据
            this.axios.get("/list?cid="+this.active+"&page="+this.page).then(res=>{
                var array=res.data.articles;
                this.pageCount=res.data.pageCount;
                array.forEach((item)=>{
                    //如果图片不为空就加载
                    if(item.image!=null){
                    item.image=require("../assets/articles/"+item.image);
                    }
                    this.articles.push(item);
                });
                //将服务器的状态进行切换（可以发送请求）
                this.busy=false;
                //关闭加载的提示框
                this.$indicator.close();
            })
        },
        loadMore(){
            //页码递增
            this.page++;
            //分页当前页码的值与总页数的比较运算决定是否像服务器发送请求
            if(this.page<=this.pageCount){
                this.getArticle();
            }
        }
    }
}
</script>
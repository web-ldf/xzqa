<template>
    <div>
        <!-- 顶部导航开始 -->
        <mt-header title="我的文章">
            <router-link to="/me" slot="left">
               <mt-button icon='back'></mt-button>
            </router-link>
        </mt-header>
        <!-- 顶部导航结束 -->
        <!-- 复选框区域开始 -->
        <div class="checklist-region">
            <!-- 控制复选框 -->
            <mt-checklist v-model="toggleValue" 
                          :options="toggleOptions" 
                          @change="handler"></mt-checklist>
            <!-- 文章列表复选框 -->
            <!-- 删除按钮 -->
            <div class="button-region">
               <a href="#" @click="remove">删除</a>
            </div>
            <mt-checklist v-model="posts" :options="articleOptions"></mt-checklist>
        </div>
        <!-- 复选框区域结束 -->
    </div>
</template>

<style scoped>
  .checklist-region{
      position: relative;
  }
  .button-region{
      position: absolute;
      right:10px;
      top:6px;
      padding: 3px;
  }
  .button-region a{
      display: block;
      width: 60px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      font-size: 14px;
      border-radius: 15px;
      background-color: #002a4b;
      color: #fff;
      text-decoration: none;
  }
</style>

<script>
import {mapState,mapMutations} from 'vuex';
export default {
    computed:{
      ...mapState([
          'id'
      ])
    },
    methods:{
        ...mapMutations([
            'minusArticleMutations'
        ]),
        //已选文章的删除
        remove(){
            //没有选中任何文章的提示
          if(this.posts.length==0){
              this.$messagebox.alert("请选择要删除的文章","系统提示");
          }else{
              this.$messagebox.confirm("确认要删除吗？删除后无法恢复","删除确认").then((action)=>{
                    this.axios.post("/removeArticles",'id='+this.posts).then(res=>{
                        if(res.data.code==200){
                            var a=this.articleOptions;
                            var b=this.posts;
                            //进行过滤，实现删除后自动刷新
                            this.articleOptions=a.filter(function(v){
                                return b.indexOf(v.value)==-1
                            });
                            this.minusArticleMutations(b.length);
                            this.$toast({
                               message:"删除成功",
                               position:"bottom"
                            });
                        }
                    });
              }).catch(()=>{
                  
              });
          }
        },
        //复选框的全选/不选
        handler(){
            //查看当前的toggleValue是什么，用join进行分割拿到1
            console.log(this.toggleValue.join());
            //清理掉之前的信息
            this.posts=[];
            if(this.toggleValue.join()=='1'){
                this.articleOptions.forEach((item)=>{
                    this.posts.push(item.value);
                })
            }
        }
    },
    data(){
        return{
            //控制复选框的变量
            toggleValue:[],
            //控制复选框的选项
            toggleOptions:[
                {
                    label:'全部选择',
                    value:'1'
                }
            ],
            //用户选定的ID
            posts:[],
            //用户发表的文章
            articleOptions:[ ]
        }
    },
    created(){
      this.axios.get("/getArticles?id="+this.id).then(res=>{
         this.articleOptions=res.data.articles;
      });
    }
}
</script>
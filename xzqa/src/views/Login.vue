<template>
    <div>
        <!-- 顶部导航开始 -->
        <mt-header title='学前端，上学问'>
                <router-link to="/" slot="left">
                    <mt-button icon="back"></mt-button>
                </router-link>
                <router-link to="/register" slot="right">
                    <mt-button>注册</mt-button>
                </router-link>
        </mt-header>
        <!-- 顶部导航结束 -->
        <!-- 表单区域开始 -->
        <div>
            <mt-field type="text"
                      label="用户名"
                      placeholder="请输入用户名"
                      v-model="username"
                      :state="usernameState"
                      @blur.native.capture="checkUsername"
                      >
            </mt-field>
            <mt-field type="password"
                      label="密码"
                      placeholder="请输入密码"
                      v-model="password"
                      :state="passwordState"
                      @blur.native.capture="checkPassword"
                      >
            </mt-field>
            <button class="confirm-button" @click="handler">登录</button>
        </div>
        <!-- 表单区域结束 -->
    </div>
</template>

<style scoped>
    .confirm-button{
        width:100%;
      line-height: 40px;
      margin: 12px auto;
      border: none;
      outline: none;
      background-color: #26a2ff;
      color: #fff;
    }
</style>

<script>
import {mapMutations} from 'vuex';
export default {
    data(){
        return{
            username:"",
            password:'',
            usernameState:"",
            passwordState:"",
        }
    },
    methods:{
        ...mapMutations([
            'loginedMutations'
        ]),
        checkUsername(){
            //定义用户名的正则表达式
            var usernameRegExp=/^[a-zA-Z0-9]{6,12}$/;
            //验证当前的用户名是否符合正则
            if(usernameRegExp.test(this.username)){
                this.usernameState="success";
                return true;
            }else{
                this.usernameState="error";
                return false;
            }
        },
       checkPassword(){
           //定义密码正则表达式
           var passwordRegExp=/^[a-zA-Z0-9]{8,18}$/;
           if(passwordRegExp.test(this.password)){
               this.passwordState="success";
               return true;
           }else{
               this.passwordState="error";
               return false;
           }
       },
       handler(){
           if(this.checkUsername() && this.checkPassword()){
               console.log("登录成功");
               var data={
                   username:this.username,
                   password:this.password
               }
               this.axios.post("/login",this.qs.stringify(data)).then(results=>{
                   console.log(results.data);
                   if(results.data.code==200){
                       this.loginedMutations(results.data.info);
                       if(this.$route.query.path){
                           this.$router.push(this.$route.query.path);
                       }else{
                           this.$router.push("/");
                       }
                       
                   }else if(results.data.code==202){
                       this.$messagebox.alert("用户名或密码错误","系统提示");
                   }
               });
           }
       }
    }
}
</script>
<template>
    <div>
        <!-- 顶部导航开始 -->
        <mt-header title='学前端，上学问'>
                <router-link to="/" slot="left">
                    <mt-button icon="back"></mt-button>
                </router-link>
                <router-link to="/login" slot="right">
                    <mt-button>登录</mt-button>
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
            <mt-field type="password"
                      label="确认密码"
                      placeholder="请再次输入密码"
                      v-model="check_password"
                      :state="check_passwordState"
                      @blur.native.capture="check_conPassword"
                      >
            </mt-field>
            <button class="confirm-button" @click="handler">免费注册</button>
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
export default {
    data(){
        return{
            username:"",
            password:'',
            check_password:"",
            usernameState:"",
            passwordState:"",
            check_passwordState:""
        }
    },
    methods:{
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
       check_conPassword(){
           if(this.password!=this.check_password){
               this.check_passwordState="error";
               return false;
           }else{
               this.check_passwordState="success";
               return true;
           }
       },
       handler(){
           if(this.checkUsername() && this.checkPassword() && this.check_conPassword()){
               console.log("注册成功");
               var data={
                   username:this.username,
                   password:this.password
               }
               this.axios.post("/register",this.qs.stringify(data)).then(res=>{
                   if(res.data.code==201){
                       this.$messagebox.alert("用户名已经存在","系统提示");
                   }else if(res.data.code==200){
                       this.$route.push("/");
                   }

               });
           }
       }
    }
}
</script>
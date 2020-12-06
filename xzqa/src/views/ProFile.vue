<template>
    <div>
        <!-- 顶部导航开始 -->
        <mt-header title="个人中心">
            <router-link to="/me" slot="left">
               <mt-button icon='back'></mt-button>
            </router-link>
        </mt-header>
        <!-- 顶部导航结束 -->
        <!-- 个人头像开始 -->
        <div class="profile-intro">
           <img src="../assets/avatar/17.jpg" alt="">
        </div>
        <!-- 个人头像结束 -->
        <!-- 表单控件区域开始 -->
        <div>
            <mt-field 
                    type="text" 
                    label="用户昵称"
                    placeholder="请输入用户昵称"
                    v-model="userNickname"
                    ></mt-field>
            <mt-field type="password" 
                      label="新密码"
                      placeholder="请输入新密码"
                      :state="passwordState"
                      v-model="password"
                      ></mt-field>
            <mt-field 
                      type="password" 
                      label="确认新密码"
                      placeholder="请再次确认新密码"
                      :state="check_passwordState"
                      v-model="checkpassword"
            ></mt-field>
            <button class="confirm-button" @click="handler">确认修改</button>
        </div>
        <!-- 表单控件区域结束 -->
    </div>
</template>

<style scoped>
  .profile-intro{
      text-align: center;
      padding: 30px 15px;
  }
  .profile-intro img{
      width: 80px;
      height: 80px;
      border-radius: 50%;
  }
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
import {mapState,mapMutations} from 'vuex';
export default {
    computed:{
        ...mapState([
          'nickname',
          'id'
        ])
    },
    data(){
        return{
            userNickname:"",
            password:"",
            checkpassword:"",
            passwordState:"",
            check_passwordState:""
        }
    },
    methods:{
        ...mapMutations([
            'updateNicknameMutations'
        ]),
        handler(){
            //定义密码的正则表达式
            var passwordRegExp=/^[a-zA-Z0-9_]{8,12}$/;
            //校验用户输入的密码
            if(passwordRegExp.test(this.password)){
                this.passwordState="success";
            }else{
                this.passwordState="error";
                //如果当前输入密码不正确，后面的就不必再校验了，进行终止
                return false;
            }
            //校验新密码及确认新密码
            if(this.password!=this.checkpassword){
                this.check_passwordState="error";
                return false;
            }else{
                this.check_passwordState="success";
            }
            var data={
                id:this.id,
                nickname:this.userNickname,
                password:this.password
            }
            this.axios.post("/profile",this.qs.stringify(data)).then(res=>{
                if(res.data.code==200){
                   this.updateNicknameMutations(this.userNickname);
                   this.$toast({
                       message:"修改成功",
                       position:"bottom"
                   })
                }
            });
        }
    },
    created(){
        this.userNickname=this.nickname;
    }
}
</script>
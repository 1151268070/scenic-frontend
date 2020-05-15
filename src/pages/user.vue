<template>
  <div>
    <div class="table-button">
      <Button type="primary" @click="handleEmployess('add')">新增用户</Button>
    </div>
    <Table border :columns="columns" :loading="modalLoading" :data="userData"></Table>
    <Modal
      v-model="modalShow"
      @on-ok="modalok()"
      width="50"
      :title="isAdd ? '新增用户' : '编辑用户'"
      :loading="modalLoading"
      :okText="isAdd ? '新增' : '保存'">
      <Form :label-width="150" :model="data" :rules="rules">
        <FormItem label="名字" prop="name">
          <Input v-model.trim="data.name"/>
        </FormItem>
        <FormItem label="用户名" prop="username" v-if="isAdd">
          <Input v-model.trim="data.username"/>
        </FormItem>
        <FormItem label="密码" prop="password" v-if="isAdd">
          <Input type="password" v-model.trim="data.password"/>
        </FormItem>
        <FormItem label="手机号" prop="mobile">
          <Input v-model.trim="data.mobile"/>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="changeShow"
      width="50"
      :title="'修改密码'"
      :loading="modalLoading"
      :okText="'修改'">
      <Form ref="userPasswd" :label-width="150" :model="data" :rules="ruleCustom">
        <FormItem label="名字" prop="name">
          <Input readonly v-model.trim="changePwdUser.name"/>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="password" v-model.trim="changePwdUser.password"/>
        </FormItem>
        <FormItem label="确认密码" prop="passwdCheck">
          <Input type="password" v-model.trim="changePwdUser.passwdCheck"/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "user",
    data() {
      const validatePass = (rule, value, callback) => {
        if (this.changePwdUser.password === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.changePwdUser.passwdCheck !== '') {
            // 对第二个密码框单独验证
            this.$refs.userPasswd.validateField('passwdCheck');
          }
          callback();
        }
      };
      const validatePassCheck = (rule, value, callback) => {
        if (this.changePwdUser.passwdCheck === '') {
          callback(new Error('请再次输入密码'));
        } else if (this.changePwdUser.passwdCheck !== this.changePwdUser.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        modalShow: false,
        changeShow: false,
        modalLoading: false,
        isAdd: false,
        indexs: 0,
        data: {
          departmentId: 0,
          genderName: 0,
          mobile: "",
          name: "",
          password: "",
          position: "",
          username: ""
        },
        changePwdUser: { // 当前修改密码的用户
          id: "",
          name: "芜湖大司马",
          password: "",
          passwdCheck: "",
        },
        userData: [{
          name: "芜湖大司马",
          username: "DSM",
          mobile: "12345678901",
          createTime: "2020-5-14 20:50:00",
          modifyTime: "2020-5-14 20:50:00"
        }],
        columns: [
          {
            title: "名字",
            key: "name"
          },
          {
            title: "用户名",
            key: "username"
          },
          {
            title: "手机号",
            key: "mobile"
          },
          {
            title: "创建时间",
            key: "createTime"
          },
          {
            title: "修改时间",
            key: "modifyTime"
          },
          {
            title: "操作",
            render: (h, param) => h("div", [
              h("ButtonGroup", [
                h("i-button", {
                  props: {
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.data = param.row;
                      this.indexs = param.index;
                      this.handleEmployess("edit", this.indexs);
                    }
                  }
                }, "编辑"),
                h("i-button", {
                  props: {
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.changeShow = true;
                      this.changePwdUser.id = param.row.id;
                      this.changePwdUser.username = param.row.username;
                    }
                  }
                }, "修改密码")
              ])
            ])
          }
        ],
        rules: {
          name: [
            { required: true, message: "员工姓名不能为空" }
          ]
        },
        ruleCustom: {
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          passwdCheck: [
            { validator: validatePassCheck, trigger: 'blur' }
          ],
        }
      };
    },
    methods: {
      handleEmployess(type, index) {
        this.modalShow = true;
        this.isAdd = type === "add";
        if (this.isAdd) {
          this.clean();
          this.rules.password = [
            { required: true, message: "密码不能为空" }
          ];
          this.rules.username = [
            { required: true, message: "用户名不能为空" }
          ];
        }
        console.log(index);
      },
      clean() {
        this.data.genderName = 0;
        this.data.mobile = "";
        this.data.name = "";
        this.data.password = "";
        this.data.position = "";
        this.data.username = "";
      },
      modalok() {
        console.log(1111);
        let timestamp = new Date().getTime();
        if (this.isAdd) {
          this.data.createTime = this.handleCreteTime(timestamp);
          this.data.modifyTime = this.data.createTime;
          this.userData.push(this.data);
        } else {
          this.data.modifierTime = this.handleCreteTime(timestamp);
        }
      },
      handleCreteTime(timeData) {
        let time = new Date(timeData);
        let y = time.getFullYear();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        let h = time.getHours();
        let mm = time.getMinutes();
        let s = time.getSeconds();
        return y + "-" + this.add0(m) + "-" + this.add0(d) + " " + this.add0(h) + ":" + this.add0(mm) + ":" + this.add0(s);
      },
      add0(m) {
        return m < 10 ? "0" + m : m;
      }

    },
    mounted() {
      console.log(this.userData);
    }
  };
</script>

<style scoped>

</style>

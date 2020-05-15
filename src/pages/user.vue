<template>
  <div>
    <div class="table-button">
      <Button type="primary" @click="handleEmployess('add')">新增用户</Button>
    </div>
    <Table border :columns="columns" :loading="modalLoading" :data="userData"></Table>
    <Modal
      v-model="modalShow"
      @on-ok="modalok('adminForm')"
      width="50"
      :title="isAdd ? '新增用户' : '编辑用户'"
      :loading="modalLoading"
      :okText="isAdd ? '新增' : '保存'">
      <Form ref="adminForm" :label-width="150" :model="data" :rules="rules">
        <FormItem label="名字" prop="name">
          <Input v-model.trim="data.name"/>
        </FormItem>
        <FormItem label="用户名" prop="username" v-if="isAdd">
          <Input v-model.trim="data.username"/>
        </FormItem>
        <FormItem label="密码" prop="password" v-if="isAdd">
          <Input v-model.trim="data.password"/>
        </FormItem>
        <FormItem label="手机号" prop="mobile">
          <Input v-model.trim="data.mobile"/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "emplyees",
    data() {
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
                      this.handleEmployess("edit");
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
                      this.useData.id = param.row.id;
                      this.useData.username = param.row.username;
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
      this.userData.forEach(item => {
        if (item.genderName === 1) {
          item.genderName = "男";
        } else if (item.genderName === 2) {
          item.genderName = "女";
        }
      });
      console.log(this.userData);
    }
  };
</script>

<style scoped>

</style>

<template>
  <div>
    <h3 style="display: inline-block; color: white; padding-left: 40px;">欢迎使用后台系统</h3>
    <Dropdown class="user-profile" trigger="hover" placement="bottom-end" @on-click="handleClick">
      <a href="javascript:void(0);" :style="{color: 'white'}">
        <!--<i-avatar shape="square" size="small" :src="admin.picture"/>-->
        <span>你好，{{userInfo.name}} </span>
        <Icon type="ios-arrow-down"/>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem name="logout">退出</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  import Vue from 'vue';
  export default {
    name: "HeaderUserProfile",
    data() {
      return {
        isFullscreen: false,
        admin: {},
        storagesData: [],
        selectStorage: {},
        userInfo: [], // 用户信息
      }
    },
    props: {
      collapsed: Boolean,
    },
    components: {
    },
    methods: {
      handleClick(name) {
        switch (name) {
          case 'logout':
            Vue.axios.post('/api/logout')
              .then((data) => {
                if (data.code === 0) {
                  this.$router.push('/login');
                }
              });
            break;
          default:
        }
      },
    }
  };
</script>

<style scoped>
  .user-profile {
    float: right;
  }
  .storages {
    margin-left: 20px;
  }
  .collapsed-icon {
    transform: rotate(-90deg);
    margin-top: -2px !important;
    transition: all .3s;
  }
</style>

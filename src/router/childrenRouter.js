const childrenRouter = [
  /*首页*/
  {
    path: "/",
    name: "Home",
    component: () => import("@/pages/Home"),
    meta: {
      title: "首页",
      permission: "home"
    }
  },
  {
    path: "/order",
    name: "Order",
    component: () => import("@/pages/Order.vue"),
    meta: {
      title: "订单管理",
      permission: "order"
    }
  },
  {
    path: "/employees",
    name: "Employees",
    component: () => import("@/pages/emplyees.vue"),
    meta: {
      title: "员工管理",
      permission: "Employees"
    }
  },
  {
    path: "/user",
    name: "User",
    component: () => import("@/pages/user.vue"),
    meta: {
      title: "用户管理",
      permission: "User"
    }
  }
];

export default childrenRouter;

<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
        <el-form-item label="角色名称" label-width="120px">
          <el-input v-model="user.rolename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" label-width="120px">
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="id"
            ref="tree"
            :props="{children: 'children',label: 'title'}"
          ></el-tree>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title=='添加角色'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqMenuList,
  reqRoleAdd,
  reqRoleDetail,
  reqRoleUpdate,
} from "../../../utils/http";
import { successAlert,errorAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      user: {
        rolename: "",
        status: 1,
        menus: "",
      },
      menuList: [],
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      (this.user = {
        rolename: "",
        status: 1,
        menus: "",
      }),
        this.$refs.tree.setCheckedKeys([]);
    },
    //验证
    check() {
      return new Promise((resolve, reject) => {
        //验证
        if (this.user.rolename === "") {
          errorAlert("角色名称不能为空");
          return;
        }
        //验证
        if (this.$refs.tree.getCheckedKeys().length === 0) {
          errorAlert("角色权限不能为空");
          return;
        }
        resolve();
      });
    },
    add() {
      this.check().then(() => {
        this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
        reqRoleAdd(this.user).then((res) => {
          if (res.data.code == 200) {
            successAlert("添加成功");
            this.cancel();
            this.empty();
            this.$emit("init");
          }
        });
      });
    },
    getOne(id) {
      reqRoleDetail(id).then((res) => {
        this.user = res.data.list;
        this.$refs.tree.setCheckedKeys(JSON.parse(this.user.menus));
        this.user.id = id;
      });
    },
    update() {
      this.check().then(() => {
        this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
        reqRoleUpdate(this.user).then((res) => {
          if (res.data.code == 200) {
            successAlert("修改成功");
            this.cancel();
            this.empty();
            this.$emit("init");
          }
        });
      });
    },
    closed() {
      if (this.info.title === "编辑角色") {
        this.empty();
      }
    },
  },
  mounted() {
    reqMenuList().then((res) => {
      console.log(res);
      if (res.data.code == 200) {
        this.menuList = res.data.list;
      }
    });
  },
};
</script>
<style scoped>
</style>
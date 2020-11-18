<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" >
      <el-form :model="user">
        <el-form-item label="手机号" label-width="120px">
          <el-input v-model="user.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" label-width="120px">
          <el-input v-model="user.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
          <el-input v-model="user.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary"  @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqmemberList,
  reqmemberDetail,
  reqmemberUpdate,
} from "../../../utils/http";
import { successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      user: {
        nickname: "",
        status: 1,
        phone: "",
        password: "",
      },
      userList: [],
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
      this.user = {
        nickname: "",
        status: 1,
        phone: "",
        password: "",
      };
      this.userList=[]
    },
    getOne(uid) {
      reqmemberDetail(uid).then((res) => {
        this.user = res.data.list;
         this.user.password = ""
        // this.user.uid = uid;
      });
    },
    update() {
      reqmemberUpdate(this.user).then((res) => {
        if (res.data.code == 200) {
          successAlert("修改成功");
          this.cancel();
          this.empty();
          this.$emit("init");
        }
      });
    },
    
  },
  mounted() {
    reqmemberList().then((res) => {
      if (res.data.code == 200) {
        this.userList = res.data.list;
      }
    });
  },
};
</script>
<style scoped>
</style>
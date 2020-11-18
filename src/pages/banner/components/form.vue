<template>
  <div class="add">
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
        <el-form-item label="标题" label-width="120px">
          <el-input v-model="user.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" label-width="120px">
          <!-- 1.原生js上传图片 -->
          <!-- 1.绘制html +css  -->
          <!-- 如果添加成功，此时，input上的文件应该清掉，所以直接将input节点清除 -->
          <div class="myupload" >
            <h3>+</h3>
            <img class="img" v-if="imgUrl" :src="imgUrl" alt >

            <input v-if="info.isshow" type="file" class="ipt" @change="changeFile" />
          </div>

          <!-- 2.element-ui 上传文件 -->
          <!-- <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="changeFile2"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>-->
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title=='轮播图添加'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import path from "path";
import { mapGetters, mapActions } from "vuex";
import {
  reqbannerAdd,
  reqbannerDetail,
  reqbannerUpdate,
} from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      user: {
        title: "",
        status: 1,
        img: null,
      },
      imgUrl:""
    };
  },
  computed: {
    ...mapGetters({
      bannerList:"banner/list"
    }),
  },
  methods: {
    ...mapActions({
      reqList:"banner/reqList"
    }),
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.user = {
        title: "",
        status: 1,
        img: null,
      };
      this.imgUrl = "";
    },
    add() {
      reqbannerAdd(this.user).then(res => {
        if (res.data.code == 200) {
     
          successAlert("添加成功");
          this.cancel();
          this.empty();
          this.reqList()
        }
      });
    },
    getOne(id) {
      reqbannerDetail(id).then((res) => {
        this.user = res.data.list;
        this.imgUrl = this.$imgPre +this.user.img;
        this.user.id = id;
      });
    },
    update() {
      reqbannerUpdate(this.user).then((res) => {
        if (res.data.code == 200) {
          successAlert("修改成功");
          this.cancel();
          this.empty();
          this.reqList();
        }
      });
    },
    changeFile(e) {
      // 判断文件大小
      let file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        errorAlert("文件不能超过2M");
        return;
      }

      // 判断文件类型
      let extname = path.extname(file.name);
      let arr = [".jpg", ".jpeg", ".png", ".gif"];
      if (!arr.includes(extname)) {
        errorAlert("请上传正确的图片格式");
        return;
      }

      // URL.createObjectURL(file)将一个文件生成一个URL地址
      this.imgUrl = URL.createObjectURL(file);
      // 给user.img赋值
      this.user.img = file;
    },
    closed() {
      if (this.info.title === "轮播图修改") {
        this.empty();
      }
    },
  },
  mounted() {
    // reqbannerList().then((res) => {
    //   console.log(res)
    //   if (res.data.code == 200) {
    //     this.bannerList = res.data.list;
    //   }
    // });
  },
};
</script>
<style scoped>
.myupload {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  border: 1px dashed #ccc;
  position: relative;
}

.myupload h3 {
  width: 100%;
  height: 100px;
  font-size: 30px;
  text-align: center;
  line-height: 100px;
  color: #666;
  font-weight: 100;
}

.myupload .ipt {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}

.myupload .img {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
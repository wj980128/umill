<template>
  <div class="add">
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user" :rules="rules">
        <el-form-item label="活动名称" label-width="120px">
          <el-input v-model="user.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动期限" label-width="120px">
          <div class="block">
            <!-- <span class="demonstration">起始日期时刻为 12:00:00，结束日期时刻为 08:00:00</span> -->
            <el-date-picker
              v-model="value2"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']"
              value-format="timestamp"
            ></el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="一级分类" label-width="120px" prop="first_cateid">
          <el-select placeholder="请选择一级分类" v-model="user.first_cateid" @change="changeFirst">
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类" label-width="120px" prop="second_cateid">
          <el-select placeholder="请选择二级分类" v-model="user.second_cateid" @change="changeSecond">
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品" label-width="120px" prop="second_cateid">
          <el-select placeholder="请选择商品" v-model="user.goodsid">
            <el-option
              v-for="item in goodsList"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title=='活动添加'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import path from "path";
import { mapGetters, mapActions } from "vuex";
import {
  reqseckAdd,
  reqseckDetail,
  reqseckUpdate,
  reqcateList,
  reqgoodsList,
} from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      rules: {
        title: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        first_cateid: [
          { required: true, message: "请选择一级分类", trigger: "change" },
        ],
        second_cateid: [
          { required: true, message: "请选择二级分类", trigger: "change" },
        ],
        goodsid: [{ required: true, message: "请选择商品", trigger: "change" }],
      },
      user: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      },
      secondCateList: [],
      goodsList: [],
      value2: "",
    };
  },
  computed: {
    ...mapGetters({
      seckList: "seck/list",
      //一级分类list
      cateList: "cate/list",
    }),
  },
  methods: {
    ...mapActions({
      reqList: "seck/reqList",
      // 请求一级分类list
      reqCateList: "cate/reqList",
      reqSpecsList: "specs/reqList",
      reqGoodsList: "goods/reqList",
      reqseckList: "seck/reqList",
    }),
    changeFirst() {
      // this.user.second_cateid = "";
      //获取二级分类list
      reqcateList({ pid: this.user.first_cateid }).then((res) => {
        this.secondCateList = res.data.list;
      });
    },
    changeSecond() {
      //获取二级分类list
      reqgoodsList({
        fid: this.user.first_cateid,
        sid: this.user.second_cateid,
      }).then((res) => {
        console.log(res);
        this.goodsList = res.data.list;
      });
    },
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.user = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      };
      (this.secondCateList = []), (this.goodsList = []), (this.value2 = "");
    },
    check() {
      return new Promise((resolve, reject) => {
        if (this.user.title === "") {
          errorAlert("活动名称不能为空");
          return;
        }
        if (this.value2.length === 0) {
          errorAlert("请选择时间");
          return;
        }
        if (this.user.first_cateid === "") {
          errorAlert("请选择一级分类");
          return;
        }
        if (this.user.second_cateid === "") {
          errorAlert("请选择二级分类");
          return;
        }

        if (this.user.goodsid === "") {
          errorAlert("商品不能为空");
          return;
        }
        resolve();
      });
    },
    add() {
      this.check().then(() => {
        (this.user.begintime = this.value2[0]),
          (this.user.endtime = this.value2[1]);
        reqseckAdd(this.user).then((res) => {
          if (res.data.code == 200) {
            successAlert("添加成功");
            this.cancel();
            this.empty();
            this.reqList();
          }
        });
      });
    },
    getOne(id) {
      reqseckDetail(id).then((res) => {
        this.user = res.data.list;
        this.user.id = id;
        this.changeFirst();
        this.changeSecond();
        this.value2 = [
          new Date(Number(res.data.list.begintime)),
          new Date(Number(res.data.list.endtime)),
        ];
      });
    },
    update() {
      this.check().then(()=>{
         (this.user.begintime = this.value2[0]),
        (this.user.endtime = this.value2[1]);
      reqseckUpdate(this.user).then((res) => {
        if (res.data.code == 200) {
          successAlert("修改成功");
          this.cancel();
          this.empty();
          this.reqList();
          this.reqseckList();
        }
      });
      })
      
    },
    closed() {
      if (this.info.title === "活动修改") {
        this.empty();
      }
    },
  },
  mounted() {
    // 5.一进来请求一级分类list
    this.reqCateList();
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
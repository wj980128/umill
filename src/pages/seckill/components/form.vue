<template>
  <div class="add">
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
        <el-form-item label="活动名称" label-width="120px">
          <el-input v-model="user.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动期限" label-width="120px">
        <el-time-picker
        
          is-range
          arrow-control
          v-model="value2"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        ></el-time-picker>
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
          <el-select placeholder="请选择二级分类" v-model="user.second_cateid">
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
              :label="item.catename"
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
} from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      user: {
        title: "",
        begintime:"",
        endtime:"",
        first_cateid:"",
        second_cateid:"",
        goodsid:"",
        status: 1
      },
      secondCateList: [],
      goodsList: [],
      value2:""
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
    }),
    changeFirst() {
      //二级分类的id重置
      this.user.second_cateid = "";
      this.getSecondList();
      
    },
    getSecondList() {
      //获取二级分类list
      reqcateList({ pid: this.user.first_cateid }).then((res) => {
        console.log(res)
        this.secondCateList = res.data.list;
      });
    },
    getgoodsList() {
      //获取二级分类list
      reqgoodsList({ id: this.user.second_cateid }).then((res) => {
        console.log(res)
        this.goodsList = res.data.list;
      });
    },
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.user = {
        title: "",
        begintime:"",
        endtime:"",
        first_cateid:"",
        second_cateid:"",
        goodsid:"",
        status: 1
      };
       this.secondCateList= [],
      this.goodsList=[],
      this.value2=""
    },
    add() {
      reqseckAdd(this.user).then((res) => {
        if (res.data.code == 200) {
          successAlert("添加成功");
          this.cancel();
          this.empty();
          this.reqList();
        }
      });
    },
    getOne(id) {
      reqseckDetail(id).then((res) => {
        this.user = res.data.list;
        this.user.id = id;
      });
    },
    update() {
      reqseckUpdate(this.user).then((res) => {
        if (res.data.code == 200) {
          successAlert("修改成功");
          this.cancel();
          this.empty();
          this.reqList();
        }
      });
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
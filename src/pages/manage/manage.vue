<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>

    <v-list :list="list" @init="newInit" @edit="edit"></v-list>

    <el-pagination background 
    @current-change="changePage" 
    layout="prev, pager, next" :total="total" :page-size="2"></el-pagination>

    <v-form :info="info" @init="init" ref="form"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vList from "./components/list";
import vForm from "./components/form";
import { reqUserList,reqUserCont} from "../../utils/http";
export default {
  data() {
    return {
      info: {
        isshow: false,
        title: "添加角色",
      },
      list: [],
      total:0,
      size:2,
      page:1
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    willAdd() {
      this.info = {
        isshow: true,
        title: "添加管理员",
      };
    },
    init() {
      // 刷新列表数据
      reqUserList({ size:this.size, page: this.page}).then((res) => {
        let list = res.data.list?res.data.list:[]
        if(list.length===0&&this.page>1){
          this.page--;
          this.init();
          return
        }
        this.list = list
      });
    },
    getCount(){
     reqUserCont().then(res=>{
       this.total = res.data.list[0].total
     })
    },
    changePage(page){
      this.page = page;
      this.init()
    },
    newInit(){
        this.init()
        this.getCount()
    },
    edit(uid) {
      this.info = {
        isshow: true,
        title: "编辑管理员",
      };
      this.$refs.form.getOne(uid);
    },
  },
  mounted() {
    this.init();
    this.getCount()
  },
  components: {
    vList,
    vForm,
  },
};
</script>
<style scoped>
</style>
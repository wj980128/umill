<template>
  <div>
    <v-list :list="list" @init="newInit" @edit="edit"></v-list>

    <!-- <el-pagination background 
    @current-change="changePage" 
    layout="prev, pager, next" :total="total" :page-size="2"></el-pagination> -->

    <v-form :info="info" @init="init" ref="form"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vList from "./components/list";
import vForm from "./components/form";
import { reqmemberList} from "../../utils/http";
export default {
  data() {
    return {
      info: {
        isshow: false,
        title: "",
      },
      list: []
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    init() {
      // 刷新列表数据
      reqmemberList().then((res) => {
        let list = res.data.list?res.data.list:[]
        this.list = list
      });
    },
    newInit(){
        this.init()
    },
    edit(uid) {
      this.info = {
        isshow: true,
        title: "编辑会员",
      };
      this.$refs.form.getOne(uid);
    },
  },
  mounted() {
    this.init();
  },
  components: {
    vList,
    vForm,
  },
};
</script>
<style scoped>
</style>
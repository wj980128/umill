<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>

   
    <v-list  @edit="edit"></v-list>

    
    <v-form :info="info" ref="form"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vList from "./components/list";
import vForm from "./components/form";
import { reqbannerList } from "../../utils/http";
export default {
  data() {
    return {
      info: {
        isshow: false,
        title: "轮播图添加",
      },
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
        title: "轮播图添加",
      };
    },
    edit(id){
      this.info={
        isshow : true,
        title :"轮播图修改"
      }
      this.$refs.form.getOne(id)
    }
  },
  mounted() {
  },
  components: {
    vList,
    vForm,
  },
};
</script>
<style scoped>
</style>
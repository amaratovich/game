<template>
  <div class="table-body">
    <div class="table-header">
      <div>Игрок</div>
      <div>Дата</div>
      <div>Неправильные ответы</div>
      <div>Правильные ответы</div>
      <div>Общий балл</div>
    </div>
    <div v-if="getUserHistory.length">
      <div
        v-for="history in getUserHistory"
        :key="history.date + Math.random()"
        class="table"
      >
        <span>{{ history.name }}</span>
        <span>{{ history.date }}</span>
        <span>{{ history.wrongAnswer }}</span
        ><span>{{ history.rightAnswer }}</span
        ><span>{{ history.totalScore }}</span>
        
      </div>
        <q-btn
        style="margin-top: 5px"
        color="green"
        class="full-width"
        label="Очистить историю!"
        v-show="getUserHistory.length"
        @click="clearLocalStorage"
      />
    </div>
    <h2 v-else style="margin-left: 15px">История пуст...</h2>
  </div>

</template>

<script>
import { defineComponent } from "vue";
import {  mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: "RatingPage",
  computed: {
    ...mapGetters(["getUserHistory"]),
  },
  methods: {
    ...mapActions(['clearStatistics']),

    clearLocalStorage() {
      localStorage.removeItem('statistics')
      this.clearStatistics( )
    }
  }
});
</script>

<style scoped>
.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  margin: 0;
}
.table-body {
  margin: 20px;
  border: 0.3px solid rgb(0, 0, 0);
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}
.table-header div {
  border-bottom: 1px solid;
  padding: 10px;
  font-weight: bold;
  border-right: 1px solid rgb(231, 231, 231);
}
.table {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  padding: 10px;
  background: rgb(231, 240, 240);
}
.table span:nth-child(1) {
  margin-left: -10px;
}
.table span {
  padding-left: 10px;
  font-size: 16px;
}
</style>

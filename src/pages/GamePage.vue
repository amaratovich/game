<template>
  <div>
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="dialog" :position="position">
        <q-card
        :class="{'success-alert': answer, 'danger-alert': !answer}"
        >
          <q-card-section class="row items-center no-wrap">
            <div>
              <div class="text-weight-bold">
                {{
                  this.answer
                    ? "Вы ответили правильно!"
                    : "Вы ответили неправильно!"
                }}
              </div>
            </div>

            <q-space />
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
    <div v-if="showTable">
      <div class="card-main" v-if="currentElem.value">
        <div class="first">
          <div class="question-elem">{{ currentElem.question }}?</div>
          <q-input
            outlined
            v-model="text"
            label="Enter the answer"
            @keypress.enter="hideAnswerModal"
            autofocus
          />
          <b class="answer-elem">credit: {{ currentElem.value }}</b>
          <div class="answer-elem">answer: {{ currentElem.answer }}</div>
        </div>
        <q-linear-progress :value="progress / 100" color="pink" />
        <div class="second">
          <div class="btn-group">
            <span></span>
            <q-btn
              color="secondary"
              label="Ok"
              @click="hideAnswerModal"
              v-if="text"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="game-table" v-else>
      <div
        v-for="(category, idx) of getState"
        :key="category.id"
        class="game-table-row"
      >
        <b>{{ category.title }}</b>
        <span
          v-for="(question, i) in category.clues"
          :key="question"
          :style="{
            background: question.success ? 'yellow' : 'green',
            pointerEvents: question.success === undefined ? 'auto' : 'none',
          }"
          :class="{success: question.success, danger: !question.success}"
          @click="showAnswerModal(question, idx, i)"
          >{{ question.value }}</span
        >
      </div>
      <q-btn
        style="margin-top: 5px"
        color="red"
        class="full-width"
        label="Завершить игру!"
        @click="clearData()"
      />
    </div>
  </div>

  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      v-model="persistent"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-teal text-white" style="width: 300px">
        <q-card-section> </q-card-section>

        <q-card-section class="q-pt-none"> Начать игру </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-input outlined v-model="name" label="Enter your name..." />
          <q-btn
            :disable="name.trim()"
            flat
            label="OK"
            v-close-popup
            @click="show()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <q-footer reveal elevated>
    <q-toolbar>
      <q-toolbar-title
        ><span v-show="!showTable">{{ name }}</span></q-toolbar-title
      >
      <div class="footer-result">
        кл-во пр-от: <b>{{ rigthAnswer }}</b>
      </div>
      <div class="footer-result">
        кл-во непр-от: <b>{{ wrongAnswer }}</b>
      </div>
      <div class="footer-result">
        общий балл: <b>{{ numberOfPoints }}</b>
      </div>
    </q-toolbar>
  </q-footer>
</template>

<script>
import { defineComponent } from "vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { ref } from "vue";
const dialog = ref(false);
const position = ref("top");
export default defineComponent({
  name: "GamePage",
  data: () => ({
    questionCount: 0,
    currentElem: { value: "", question: "", answer: "" },
    isStart: false,
    second: 59,
    timer: null,
    showTable: true,
    answer: false,
    progress: 100,
    wrongAnswer: 0,
    rigthAnswer: 0,
    numberOfPoints: 0,
    name: "",
  }),

  computed: {
    ...mapGetters(["getState", "getUserHistory"]),
  },
  methods: {
    ...mapActions(["addStatistics", "findWrongElem"]),
    ...mapMutations(["newState"]),

    show() {
      this.showTable = false;
      this.second = 60;
      this.setSecond();
      this.text = "";
      clearTimeout(this.timer);
      this.isStart = false;
    },
    hide() {
      this.showTable = true;
      this.second = 59;
      this.progress = 100;
      this.isStart = true;
      this.setSecond();
    },
    countAnswers() {
      this.questionCount++;
      if (this.answer) {
        (this.numberOfPoints = this.numberOfPoints + this.currentElem.value),
          this.rigthAnswer++;
      } else {
        this.wrongAnswer++,
          (this.numberOfPoints =
            this.numberOfPoints - this.currentElem.value / 2);
      }
      if (this.questionCount === 25) {
        this.addStatistics({
          name: this.name,
          date: new Date().toLocaleDateString("en-US"),
          wrongAnswer: this.wrongAnswer,
          rightAnswer: this.rigthAnswer,
          totalScore: this.numberOfPoints,
        });
        setTimeout(() => {
          localStorage.setItem(
            "statistics",
            JSON.stringify(this.getUserHistory)
          );
          this.$router.push("/rating");
        }, 1000);
      }
    },

    setSecond() {
      if (this.isStart) {
        this.timer = setTimeout(() => {
          if (this.second === 0) {
            this.second = 60;
            this.countAnswers();
            this.open("top");
            this.show();
            return;
          } else if (this.second === 60) {
            return;
          } else {
            this.second--;
            this.progress = this.progress - 1.7;
          }
          this.setSecond();
        }, 1000);
      }
    },
    getCurrentElem(el) {
      this.currentElem = el;
      this.answer = 0;
    },
    showAnswerModal(question, idx, i) {
      this.getCurrentElem(question);
      this.findWrongElem([idx, i]);
      this.hide();
    },
    hideAnswerModal() {
      this.show();
      this.open("top");
      this.countAnswers();
    },
    clearData() {
      this.questionCount = 0;
      this.currentElem = { value: "", question: "", answer: "" };
      this.isStart = false;
      this.second = 59;
      this.timer = null;
      this.showTable = true;
      this.answer = false;
      this.progress = 100;
      this.wrongAnswer = 0;
      this.rigthAnswer = 0;
      this.numberOfPoints = 0;
      this.name = "";
      this.persistent = true;
      this.$store.dispatch("clearLocalData");
      setTimeout(() => this.$store.dispatch("getDataFromDataBase"), 0);
    },
  },
  watch: {
    second() {
      if (this.currentElem && this.text) {
        this.answer =
          this.text.toLowerCase() === this.currentElem.answer.toLowerCase();
      }
    },
  },
  mounted() {
    this.persistent = true;
    this.$store.dispatch("getDataFromDataBase");
  },
  unmounted() {
    this.$store.dispatch("clearLocalData");
  },
  setup() {
    return {
      persistent: ref(false),
      text: ref(""),
      ph: ref(""),
      dense: ref(false),
      dialog,
      position,

      open(pos) {
        position.value = pos;
        dialog.value = true;
        setTimeout(() => {
          dialog.value = false;
        }, 1000);
      },
      close() {
        dialog.value = false;
      },
    };
  },
});
</script>

<style scoped>
.game-table {
  width: 70%;
  height: 10vh;
  margin: 15px auto;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  font-weight: bold;
  font-size: 1.2rem;
  text-transform: uppercase;
  text-align: center;
}
.game-table-row {
  display: grid;
  height: 100%;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  border-bottom: 1px solid;
}
.game-table-row span {
  background: rgb(18, 243, 18);
  border: 1px solid darkgreen;
  cursor: pointer;
}
.game-table-row b {
  background: rgb(201, 19, 19);
  padding: 5px;
}
.card-main {
  width: 70%;
  height: 70vh;
  margin: 15px auto;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.danger-alert {
  width: 350px;
  background: red;
}
.success-alert {
  width: 350px;
  background: green;
}
.first {
  height: 85%;
  box-sizing: border-box;
  border-radius: 20px 20px 0 0;
  padding: 20px;
}
.second {
  height: 15%;
  display: flex;
  justify-content: flex-end;
  box-sizing: border-box;
  border-top: 1px solid rgb(190, 187, 187);
  border-radius: 0 0 20px 20px;
}
.btn-group {
  height: 40%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-right: 25px;
  margin-top: 10px;
  margin: 10px 25px;
}
.question-elem {
  font-size: 1.5rem;
  font-weight: bold;
  padding: 10px;
  color: rgb(15, 18, 136);
}
.answer-elem {
  font-weight: bold;
  font-style: italic;
  padding: 10px;
  color: rgb(15, 18, 136);
}
.footer-result {
  margin-right: 10px;
  color: rgb(255, 236, 236);
  font-size: 1.5rem;
}
.footer-result b {
  color: black;
}
</style>

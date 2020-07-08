const app = new Vue({
  el: '#app',
  data: {
    name: {},
    description: '',
    degree: {},
    traits: [],
    problemList: {},
    questions: [],
    questionList: [],
    questionIndex: 0,
    showResult: false,
    resultList: [],
    resultIndex: 0,
    isCheck: false,
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      const vm = this;
      const url =
        'https://raw.githubusercontent.com/hexschool/js-training-task/master/api/BigFive.json';
      axios
        .get(url)
        .then((res) => {
          const { name, description, degree, traits, problemList } = res.data;
          vm.name = name;
          vm.description = description;
          vm.degree = degree;
          vm.traits = traits;
          vm.problemList = problemList;
          for (index in vm.problemList) {
            vm.questionList.push({
              category: index,
              categoryZH: vm.problemList[index].name,
              description: vm.problemList[index].description,
              point: [0, 0],
            });
            vm.problemList[index].problems.forEach((problem) => {
              vm.questions.push(problem);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    nextPage(questionID) {
      if (document.querySelector(`[name="${questionID}"]:checked`)) {
        this.isCheck = true;
        this.questionIndex += 1;
      } else {
        this.isCheck = false;
        Swal.fire({
          toast: true,
          text: '尚未選擇',
          icon: 'warning',
          showConfirmButton: false,
          timer: 1500,
          padding: '2em',
        });
      }
    },
    result(questionID) {
      if (document.querySelector(`[name="${questionID}"]:checked`)) {
        this.isCheck = true;
        this.showResult = true;
        for (index in this.questionList) {
          const item = this.questionList[index];
          let total = item.point.reduce((pre, cur) => pre + cur, 0);
          if (total <= 5) {
            this.resultList.push({
              total: total,
              degree: '低',
              category: item.categoryZH,
              description: item.description,
            });
          } else if (total <= 6) {
            this.resultList.push({
              total: total,
              degree: '中',
              category: item.categoryZH,
              description: item.description,
            });
          } else {
            this.resultList.push({
              total: total,
              degree: '高',
              category: item.categoryZH,
              description: item.description,
            });
          }
        }
      } else {
        this.isCheck = false;
        Swal.fire({
          toast: true,
          text: '尚未選擇',
          icon: 'warning',
          showConfirmButton: false,
          timer: 1500,
          padding: '2em',
        });
      }
    },
    reset() {
      this.showResult = false;
      this.questionIndex = 0;
      this.resultIndex = 0;
      this.resultList = [];
      for (index in this.questionList) {
        this.questionList[index].point = [0, 0];
      }
    },
  },
});

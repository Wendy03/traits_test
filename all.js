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
      const vm = this;
      if (document.querySelector(`[name="${questionID}"]:checked`)) {
        vm.isCheck = true;
        vm.questionIndex += 1;
      } else {
        vm.isCheck = false;
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
      const vm = this;
      if (document.querySelector(`[name="${questionID}"]:checked`)) {
        vm.isCheck = true;
        vm.showResult = true;
        for (index in vm.questionList) {
          const item = vm.questionList[index];
          const total = item.point.reduce((pre, cur) => pre + cur, 0);
          if (total <= 5) {
            vm.resultList.push({
              total: total,
              degree: '低',
              category: item.categoryZH,
              description: item.description,
            });
          } else if (total <= 6) {
            vm.resultList.push({
              total: total,
              degree: '中',
              category: item.categoryZH,
              description: item.description,
            });
          } else {
            vm.resultList.push({
              total: total,
              degree: '高',
              category: item.categoryZH,
              description: item.description,
            });
          }
        }
      } else {
        vm.isCheck = false;
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
      const vm = this;
      vm.showResult = false;
      vm.questionIndex = 0;
      vm.resultIndex = 0;
      vm.resultList = [];
      for (index in vm.questionList) {
        vm.questionList[index].point = [0, 0];
      }
    },
  },
});

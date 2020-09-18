import Vue from 'vue'

Vue.directive('focus', function (el) {
  el.focus();
})
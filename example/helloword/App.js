

export const App = {
  //.vue



  render() {

    // ui
    return h('div','hi, ' + this.msg);
  }


  setup() {


    return {
      msg:'mini-vue'
    }
  }
}
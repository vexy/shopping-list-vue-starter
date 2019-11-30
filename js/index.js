const vm = new Vue({
  el: "#app",
  data: {
    name: "",
    cost: "",
    quantity: "",
    items: [],
    isLoggedIn: false
  },
  computed: {
    total: function() {
      return this.items.reduce(
        (accumulator, currentValue) => accumulator + currentValue.subTotal,
        0
      );
    }
  },
  methods: {
    toggleLoggedIn: function() {
      this.isLoggedIn = !this.isLoggedIn;
    },
    onSubmit: function(event) {
      if (this.name && this.cost && this.quantity) {
        hoodie.store.withIdPrefix("item").add({
          name: this.name,
          cost: this.cost,
          quantity: this.quantity,
          subTotal: this.cost * this.quantity
        });

        this.name = "";
        this.cost = "";
        this.quantity = "";
      } else {
        const snackbarContainer = document.querySelector("#toast");
        snackbarContainer.MaterialSnackbar.showSnackbar({
          message: "All fields are required"
        });
      }
    }
  },
  created() {
    hoodie.store.withIdPrefix("item").on("add", item => vm.items.push(item));

    //retrieve items on the current list
    hoodie.store
      .withIdPrefix("item")
      .findAll()
      .then(items => (vm.items = items));

    hoodie.account.get("session").then(function(session) {
      // user is signed in
      vm.isLoggedIn = true;

      /*
      if (!session) {
        // user is singed out
        vm.isLoggedIn = false;
      } else if (session.invalid) {
        vm.isLoggedIn = false;
      } else {
        // user is signed in
        vm.isLoggedIn = true;
      }
      */
    });
  }
});
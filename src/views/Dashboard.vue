<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-form-radio-group v-model="view" :options="options" button-variant="outline-primary" buttons></b-form-radio-group>
    </b-navbar>

    <b-overlay :show="overlay" variant="secondary">
      <b-container fluid class="min-vh-100 pt-5 pb-5">
        <b-card v-show="items.length" bg-variant="dark" class="mx-auto w-75">
          <template #default>
            <b-table borderless hover striped table-variant="dark" :items="items" :fields="fields"></b-table>
          </template>
        </b-card>
      </b-container>
    </b-overlay>
  </div>
</template>

<script>
export default {
  data() {
    return {
      view: '',
      options: [
        { text: 'Images', value: 'images' },
        { text: 'Containers', value: 'containers' }
      ],

      items: [],
      fields: [],

      overlay: false
    }
  },
  methods: {
    loadImages() {
      axios.get('/images/json')
        .then(response => {
          this.fields = [
            { key: 'Id' },
            { key: 'Containers' }
          ];

          this.items = response.data;
        }).finally(() => {
          this.overlay = false;
        });
    },
    loadContainers() {
      axios.get('/containers/json')
        .then(response => {
          this.fields = [
            { key: 'Id' },
            { key: 'Image' }
          ];

          this.items = response.data;
        }).finally(() => {
          this.overlay = false;
        });
    }
  },
  watch: {
    view: function(value) {
      this.overlay = true;

      if (value == 'images')
        this.loadImages()
      else if (value == 'containers')
        this.loadContainers()
    }
  }
}
</script>

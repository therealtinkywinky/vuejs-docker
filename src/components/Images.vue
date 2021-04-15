<template>
  <div>
    <b-table borderless hover striped table-variant="dark" :items="items" :fields="fields"></b-table>
  </div>
</template>

<script>
export default {
  props: [
    'filters'
  ],
  data() {
    return {
      items: [],
      fields: [
        { key: 'Id', class: 'column-font align-middle' },
        { key: 'Containers', class: 'column-font align-middle' }
      ]
    }
  },
  methods: {
    loadImages() {
      var data = {
        params: {
          filters: {
            reference: [
              this.reference
            ]
          }
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      };

      axios.get('/images/json', data)
        .then(response => {
          this.items = response.data;
        }).finally(() => {
          this.overlay = false;
        });
    }
  },
  computed: {
    reference: function() {
      return this.filters.reference;
    }
  },
  watch: {
    reference: function() {
      this.loadImages();
    }
  },
  mounted() {
    this.loadImages();
  }
}
</script>

<style>
.column-font {
  font-size: 12px;
}
</style>

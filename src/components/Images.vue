<template>
  <div>
    <b-table borderless hover striped table-variant="dark" :items="items" :fields="fields">
      <template #cell(actions)="row">
        <b-button-group size="sm">
          <b-button variant="outline-warning" @click="inspect(row.item.Id)">Inspect</b-button>
        </b-button-group>
      </template>
    </b-table>
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
        { key: 'Containers', class: 'column-font align-middle' },
        { key: 'Actions', label: '' }
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
    },
    inspect(id) {

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

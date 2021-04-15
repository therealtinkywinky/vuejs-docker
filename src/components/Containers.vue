<template>
  <div>
    <b-table borderless hover striped table-variant="dark" :items="items" :fields="fields">
      <template #cell(actions)="row">
        <b-button-group size="sm">
          <b-button variant="outline-primary">Start</b-button>
          <b-button variant="outline-secondary">Stop</b-button>
          <b-button variant="outline-info">Restart</b-button>
          <b-button variant="outline-warning">Inspect</b-button>
          <b-button variant="outline-danger">Remove</b-button>
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
        { key: 'Id', class: 'column-font align-middle', formatter: v => v.slice(0, 12) },
        { key: 'Image', class: 'column-font align-middle' },
        { key: 'Names', class: 'column-font align-middle', formatter: v => v.map(v => v.slice(1)).join('|') },
        { key: 'State', class: 'column-font align-middle' },
        { key: 'Status', class: 'column-font align-middle' },
        { key: 'Actions', label: '' }
      ]
    }
  },
  methods: {
    loadContainers() {
      var data = {
        params: {
          filters: {
            status: this.state.map(status => status.toLowerCase())
          }
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      };

      axios.get('/containers/json', data)
        .then(response => {
          this.items = response.data;
        }).finally(() => {
          this.overlay = false;
        });
    }
  },
  computed: {
    state: function() {
      return this.filters.state;
    }
  },
  watch: {
    state: function() {
      this.loadContainers();
    }
  },
  mounted() {
    this.loadContainers();
  }
}
</script>

<style>
.column-font {
  font-size: 12px;
}
</style>

<template>
  <div>
    <b-table borderless hover striped table-variant="dark" :items="items" :fields="fields">
      <template #cell(actions)="row">
        <b-button-group size="sm">
          <b-button variant="outline-primary" @click="start(row.item.Id)">Start</b-button>
          <b-button variant="outline-secondary" @click="stop(row.item.Id)">Stop</b-button>
          <b-button variant="outline-info" @click="restart(row.item.Id)">Restart</b-button>
          <b-button variant="outline-warning" @click="inspect(row.item.Id)">Inspect</b-button>
          <b-button variant="outline-danger" @click="remove(row.item.Id)">Remove</b-button>
        </b-button-group>
      </template>
    </b-table>

    <b-modal id="inspect" title="Inspect">
      <p class="my-4">Args: {{ container.Args.join(' ') }}</p>
    </b-modal>
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
      ],
      container: {
        Args: []
      }
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
    },
    start(id) {

    },
    stop(id) {

    },
    restart(id) {

    },
    inspect(id) {
      axios.get('/containers/' + id + '/json')
        .then(response => {
          this.container = response.data;

          this.$bvModal.show('inspect');
        });
    },
    remove(id) {

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

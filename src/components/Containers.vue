<template>
  <div>
    <b-table borderless hover striped table-variant="dark" :items="items" :fields="fields">
      <template #cell(names)="row">
        <b-button v-b-tooltip.click="row.value.join('\n')" size="sm" variant="outline-primary">{{ row.value[0] }}</b-button>
      </template>

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
        {
          key: 'Id',
          class: 'column-font align-middle',
          formatter: v => v.slice(0, 12)
        },
        {
          key: 'Image',
          class: 'column-font align-middle',
          formatter: v => {
            if (v.startsWith('sha256:'))
              return v.slice(7, 19);
            return v;
          }
        },
        {
          key: 'Names',
          class: 'column-font align-middle'
        },
        {
          key: 'State',
          class: 'column-font align-middle'
        },
        {
          key: 'Status',
          class: 'column-font align-middle'
        },
        {
          key: 'Actions',
          label: ''
        }
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

      this.$emit('status', 'Loading containers...');

      axios.get('/containers/json', data)
        .then(response => {
          this.items = response.data;

          this.$emit('status', 'Containers loaded!');
        }).catch(() => {
          this.$emit('status', 'There was an error when loading the containers');
        });

    },
    start(id) {

      this.$emit('status', 'Starting container...');

      axios.post('/containers/' + id + '/start')
        .then(response => {
          this.$emit('status', 'Container started!');
        }).catch(error => {
          this.$emit('status', 'Could not start container');
        });

    },
    stop(id) {

      this.$emit('status', 'Stopping container...');

      axios.post('/containers/' + id + '/stop')
        .then(response => {
          this.$emit('status', 'Container stopped!');
        }).catch(error => {
          this.$emit('status', 'Could not stop container');
        });

    },
    restart(id) {

      this.$emit('status', 'Restarting container...');

      axios.post('/containers/' + id + '/restart')
        .then(response => {
          this.$emit('status', 'Container restarted!');
        }).catch(error => {
          this.$emit('status', 'Could not restart container');
        });

    },
    inspect(id) {

      this.$emit('status', 'Inspecting container...');

      axios.get('/containers/' + id + '/json')
        .then(response => {
          this.container = response.data;

          this.$bvModal.show('inspect');

          this.$emit('status', 'Container inspected!');
        }).catch(error => {
          this.$emit('status', 'Could not inspect container');
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

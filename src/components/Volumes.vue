<template>
  <div>
    <b-table borderless hover striped table-variant="dark" :items="items" :fields="fields">
      <template #cell(actions)="row">
        <b-button-group size="sm">
          <b-button variant="outline-warning" @click="inspect(row.item.Name)">Inspect</b-button>
        </b-button-group>
      </template>
    </b-table>

    <b-modal id="inspect" title="Inspect" size="xl" ok-only ok-title="Close">
      <div v-for="(value, key) in volume">
        <template v-if="Array.isArray(value)">
          <p>{{ key }}:</p>
          <ul>
            <li v-for="v in value">{{ v }}</li>
          </ul>
        </template>
        <template v-else>
          <p>{{ key }}: {{ value }}</p>
        </template>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      fields: [
        {
          key: 'Driver',
          class: 'column-font align-middle'
        },
        {
          key: 'Name',
          class: 'column-font align-middle'
        },
        {
          key: 'Actions',
          label: ''
        }
      ],
      volume: {}
    }
  },
  methods: {
    loadVolumes() {

      this.$emit('status', 'Loading volumes...');

      axios.get('/volumes')
        .then(response => {
          this.items = response.data.Volumes;

          this.$emit('status', 'Volumes loaded!');
        }).catch(() => {
          this.$emit('status', 'There was an error when loading the volumes');
        });

    },
    inspect(name) {

      this.$emit('status', 'Inspecting volume...');

      axios.get('/volumes/' + name)
        .then(response => {
          this.volume = {
            Name: response.data.Name,
            Driver: response.data.Driver,
            Mountpoint: response.data.Mountpoint,
            Scope: response.data.Scope,
            CreatedAt: response.data.CreatedAt
          };

          this.$bvModal.show('inspect');

          this.$emit('status', 'Volume inspected!');
        }).catch(error => {
          this.$emit('status', 'Could not inspect volume');
        });

    }
  },
  mounted() {
    this.loadVolumes();
  }
}
</script>

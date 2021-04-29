<template>
  <div>
    <b-table borderless hover striped table-variant="dark" :items="items" :fields="fields">
      <template #cell(actions)="row">
        <b-button-group size="sm">
          <b-button variant="outline-warning" @click="inspect(row.item.Id)">Inspect</b-button>
        </b-button-group>
      </template>
    </b-table>

    <b-modal id="inspect" title="Inspect" size="lg" ok-only ok-title="Close">
      <div v-for="(value, key) in network">
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
          key: 'Name',
          class: 'column-font align-middle'
        },
        {
          key: 'Scope',
          class: 'column-font align-middle'
        },
        {
          key: 'Driver',
          class: 'column-font align-middle'
        },
        {
          key: 'Actions',
          label: ''
        }
      ],
      network: {}
    }
  },
  methods: {
    loadNetworks() {

      this.$emit('status', 'Loading networks...');

      axios.get('/networks')
        .then(response => {
          this.items = response.data;

          this.$emit('status', 'Networks loaded!');
        }).catch(() => {
          this.$emit('status', 'There was an error when loading the networks');
        });

    },
    inspect(id) {

      this.$emit('status', 'Inspecting network...');

      axios.get('/networks/' + id)
        .then(response => {
          this.network = {
            Name: response.data.Name,
            Id: response.data.Id,
            Created: response.data.Created,
            Scope: response.data.Scope,
            Driver: response.data.Driver,
            IPv6: response.data.EnableIPv6,
            Internal: response.data.Internal,
            Attachable: response.data.Attachable
          };

          this.$bvModal.show('inspect');

          this.$emit('status', 'Network inspected!');
        }).catch(error => {
          this.$emit('status', 'Could not inspect network');
        });

    }
  },
  mounted() {
    this.loadNetworks();
  }
}
</script>

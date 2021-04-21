<template>
  <div>
    <b-table borderless hover striped table-variant="dark" :items="items" :fields="fields">
      <template #cell(repotags)="row">
        <b-button v-if="row.value != ''" v-b-tooltip.click="row.value.join('\n')" size="sm" variant="outline-primary">{{ row.value[0] }}</b-button>
      </template>

      <template #cell(actions)="row">
        <b-button-group size="sm">
          <b-button variant="outline-warning" @click="inspect(row.item.Id)">Inspect</b-button>
          <b-button variant="outline-info" @click="history(row.item.Id)">History</b-button>
        </b-button-group>
      </template>
    </b-table>

    <b-modal id="inspect" title="Inspect" size="lg" ok-only ok-title="Close">
      <div v-for="(value, key) in image">
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

    <b-modal id="history" size="lg" title="History" ok-only ok-title="Close">
      <div v-for="layer in layers" class="ellipsis" style="cursor: default;">
        <span v-b-popover.hover.bottom="layer.CreatedBy">{{ layer.CreatedBy }}</span>
      </div>
    </b-modal>
  </div>
</template>

<script>
import xbytes from 'xbytes';

export default {
  props: [
    'filters'
  ],
  data() {
    return {
      items: [],
      image: [],
      layers: [],
      fields: [
        {
          key: 'Id',
          class: 'column-font align-middle',
          formatter: v => {
            if (v.startsWith('sha256:'))
              return v.slice(7, 19);
            return v;
          }
        },
        {
          key: 'RepoTags',
          class: 'column-font align-middle'
        },
        {
          key: 'Created',
          class: 'column-font align-middle',
          formatter: v => {
            var d = new Date(v * 1000);

            return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
          }
        },
        {
          key: 'Size',
          class: 'column-font align-middle',
          formatter: v => xbytes(v)
        },
        {
          key: 'VirtualSize',
          class: 'column-font align-middle',
          formatter: v => xbytes(v)
        },
        {
          key: 'Actions',
          label: ''
        }
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

      this.$emit('status', 'Loading images...');

      axios.get('/images/json', data)
        .then(response => {
          this.items = response.data;

          this.$emit('status', 'Images loaded!');
        }).catch(() => {
          this.$emit('status', 'There was an error when loading the images');
        });
    },
    inspect(id) {

      this.$emit('status', 'Inspecting image...');

      axios.get('/images/' + id + '/json')
        .then(response => {
          this.image = {
            Os: response.data.Os,
            Architecture: response.data.Architecture,
            DockerVersion: response.data.DockerVersion,
            WorkingDir: response.data.ContainerConfig.WorkingDir,
            Env: response.data.ContainerConfig.Env,
            RepoTags: response.data.RepoTags
          };

          this.$bvModal.show('inspect');

          this.$emit('status', 'Image inspected!');
        }).catch(error => {
          this.$emit('status', 'Could not inspect image');
        });

    },
    history(id) {

      this.$emit('status', 'Getting history...');

      axios.get('/images/' + id + '/history')
        .then(response => {
          this.$emit('status', 'History obtained!');
          this.layers = response.data.reverse();
          this.$bvModal.show('history');
        }).catch(error => {
          this.$emit('status', 'There was an error when obtaining history');
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

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

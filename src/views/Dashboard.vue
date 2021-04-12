<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-form-radio-group v-model="view" :options="options" button-variant="outline-primary" buttons></b-form-radio-group>

      <b-navbar-nav v-if="view == 'images'" class="ml-5">
        <b-nav-form>
          <b-input-group prepend="Image Name">
            <b-form-input v-model="imagesReference"></b-form-input>
            <b-input-group-append>
              <b-button variant="info" @click="loadImages">Search</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-nav-form>
      </b-navbar-nav>

      <b-navbar-nav v-else-if="view == 'containers'" class="ml-5">
        <b-nav-form>
          <b-form-checkbox-group v-model="containersState" :options="filter.containers.state" button-variant="outline-success" buttons></b-form-checkbox-group>
        </b-nav-form>
      </b-navbar-nav>
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

      imagesReference: '',
      containersState: [],
      filter: {
        containers: {
          state: [
            'Created',
            'Running',
            'Paused',
            'Exited',
            'Dead'
          ]
        }
      },

      items: [],
      fields: [],

      overlay: false
    }
  },
  methods: {
    loadImages() {
      var data = {
        params: {
          filters: {
            reference: [
              this.imagesReference
            ]
          }
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      };

      axios.get('/images/json', data)
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
      var data = {
        params: {
          filters: {
            status: this.containersState.map(status => status.toLowerCase())
          }
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      };

      axios.get('/containers/json', data)
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
    },
    containersState: function(value) {
      this.loadContainers();
    }
  }
}
</script>

<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-form-radio-group buttons v-model="view" :options="buttons" button-variant="outline-primary"></b-form-radio-group>

      <b-navbar-nav v-if="view == 'images'" class="ml-5">
        <b-nav-form>
          <b-input-group prepend="Image Name">
            <b-form-input v-model="filters.images.reference"></b-form-input>
            <b-input-group-append>
              <b-button variant="info">Search</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-nav-form>
      </b-navbar-nav>

      <b-navbar-nav v-else-if="view == 'containers'" class="ml-5">
        <b-nav-form>
          <b-form-checkbox-group
            v-model="filters.containers.state"
            :options="options.containers.state"
            button-variant="outline-success"
            buttons>
          </b-form-checkbox-group>
        </b-nav-form>
      </b-navbar-nav>
    </b-navbar>

    <b-overlay :show="overlay" variant="secondary">
      <b-container fluid class="min-vh-100 pt-5 pb-5">
        <b-card bg-variant="dark" class="mx-auto w-75">
          <template #default>
            <images v-if="view == 'images'"></images>
            <containers v-else-if="view == 'containers'"></containers>
          </template>
        </b-card>
      </b-container>
    </b-overlay>
  </div>
</template>

<script>
import Images from '../components/Images';
import Containers from '../components/Containers';

export default {
  components: {
    Images,
    Containers
  },
  data() {
    return {
      view: '',
      buttons: [
        { text: 'Images', value: 'images' },
        { text: 'Containers', value: 'containers' }
      ],

      options: {
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

      filters: {
        images: {
          reference: ''
        },
        containers: {
          state: []
        }
      },

      overlay: false
    }
  },
  watch: {
    view: function(value) {
      /*
      this.overlay = true;

      if (value == 'images')
        this.loadImages()
      else if (value == 'containers')
        this.loadContainers()
      */
    },
    containersState: function(value) {
      // this.loadContainers();
    }
  }
}
</script>

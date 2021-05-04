<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-form-radio-group buttons v-model="view" :options="buttons" button-variant="outline-primary"></b-form-radio-group>

      <b-navbar-nav v-if="view == 'images'" class="ml-5">
        <b-nav-form>
          <b-input-group prepend="Image Name">
            <b-form-input v-model="filters.images.reference"></b-form-input>
          </b-input-group>
        </b-nav-form>
      </b-navbar-nav>

      <b-navbar-nav v-else-if="view == 'containers'" class="ml-5">
        <b-nav-form>
          <b-form-checkbox-group
            :options="options.containers.state"
            v-model="filters.containers.state"
            button-variant="outline-success"
            buttons>
          </b-form-checkbox-group>
        </b-nav-form>
      </b-navbar-nav>

      <b-navbar-nav v-else-if="view == 'search'" class="ml-5">
        <b-nav-form>
          <b-input-group prepend="Image Name">
            <b-form-input v-model="filters.search.term"></b-form-input>
            <b-form-spinbutton v-model="filters.search.stars" min="0" max="10000" :formatter-fn="v => v == 0 ? 'All' : v"></b-form-spinbutton>

            <template #append>
              <b-dropdown :text="labels.search.automated" variant="success">
                <b-dropdown-item @click="filters.search.automated = null, labels.search.automated = 'All'">All</b-dropdown-item>
                <b-dropdown-item @click="filters.search.automated = true, labels.search.automated = 'Automated'">Automated</b-dropdown-item>
                <b-dropdown-item @click="filters.search.automated = false, labels.search.automated = 'Not Automated'">Not Automated</b-dropdown-item>
              </b-dropdown>

              <b-dropdown :text="labels.search.official" variant="success">
                <b-dropdown-item @click="filters.search.official = null, labels.search.official = 'All'">All</b-dropdown-item>
                <b-dropdown-item @click="filters.search.official = true, labels.search.official = 'Official'">Official</b-dropdown-item>
                <b-dropdown-item @click="filters.search.official = false, labels.search.official = 'Not Official'">Not Official</b-dropdown-item>
              </b-dropdown>
            </template>
          </b-input-group>
        </b-nav-form>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item>
          <b-icon-arrow-left-circle @click="$router.go(-1)"></b-icon-arrow-left-circle>
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-nav>
        <b-nav-text>{{ status }}</b-nav-text>
      </b-navbar-nav>
    </b-navbar>

    <b-overlay :show="overlay" variant="secondary">
      <b-container v-if="view != ''" fluid class="min-vh-100 pt-5 pb-5">
        <b-card bg-variant="dark" class="mx-auto">
          <template #default>
            <images v-if="view == 'images'" v-on:status="status = $event" :filters="filters.images"></images>
            <containers v-else-if="view == 'containers'" v-on:status="status = $event" :filters="filters.containers"></containers>
            <networks v-else-if="view == 'networks'" v-on:status="status = $event"></networks>
            <volumes v-else-if="view == 'volumes'" v-on:status="status = $event"></volumes>
            <search v-else-if="view == 'search'" v-on:status="status = $event" :filters="filters.search"></search>
          </template>
        </b-card>
      </b-container>
    </b-overlay>
  </div>
</template>

<script>
import Images from '../components/Images';
import Containers from '../components/Containers';
import Networks from '../components/Networks';
import Volumes from '../components/Volumes';
import Search from '../components/Search';

export default {
  components: {
    Images,
    Containers,
    Networks,
    Volumes,
    Search
  },
  data() {
    return {
      view: '',
      buttons: [
        { text: 'Images', value: 'images' },
        { text: 'Containers', value: 'containers' },
        { text: 'Networks', value: 'networks' },
        { text: 'Volumes', value: 'volumes' },
        { text: 'Search', value: 'search' }
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
          reference: '*'
        },
        containers: {
          state: []
        },
        search: {
          term: '',
          stars: 0,
          automated: null,
          official: null
        }
      },

      labels: {
        search: {
          automated: 'All',
          official: 'All'
        }
      },

      overlay: false,
      status: ''
    }
  }
}
</script>

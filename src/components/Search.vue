<template>
  <div>
    <b-table borderless hover striped table-variant="dark" :items="items" :fields="fields">
      <template #cell(actions)="row">
        <b-button-group size="sm">
          <b-button variant="outline-warning" @click="pull(row.item.name)">Pull</b-button>
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
        {
          key: 'name',
          class: 'column-font align-middle'
        },
        {
          key: 'description',
          class: 'column-font align-middle'
        },
        {
          key: 'is_automated',
          label: 'Automated',
          class: 'column-font align-middle'
        },
        {
          key: 'is_official',
          label: 'Official',
          class: 'column-font align-middle'
        },
        {
          key: 'star_count',
          label: 'Stars',
          class: 'column-font align-middle'
        },
        {
          key: 'actions',
          label: ''
        }
      ]
    }
  },
  methods: {
    loadSearch() {

      var data = {
        params: {
          term: this.term,
          filters: {
            ...this.automated !== null && { 'is-automated': [this.automated.toString()] },
            ...this.official !== null && { 'is-official': [this.official.toString()] },
            ...this.stars > 0 && { stars: [this.stars.toString()] }
          }
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      };

      this.$emit('status', 'Loading images...');

      axios.get('/images/search', data)
        .then(response => {
          this.items = response.data;

          this.$emit('status', 'Images loaded!');
        }).catch(() => {
          this.$emit('status', 'There was an error when loading the images');
        });

    },
    pull(name) {
      console.log(name);
    }
  },
  computed: {
    term: function() {
      return this.filters.term;
    },
    automated: function() {
      return this.filters.automated;
    },
    official: function() {
      return this.filters.official;
    },
    stars: function() {
      return this.filters.stars;
    }
  },
  watch: {
    term: function() {
      this.loadSearch();
    },
    automated: function() {
      this.loadSearch();
    },
    official: function() {
      this.loadSearch();
    },
    stars: function() {
      this.loadSearch();
    }
  },
  mounted() {
    this.loadSearch();
  }
}
</script>

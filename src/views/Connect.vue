<template>
  <div class="h-100">
    <b-overlay :show="overlay" variant="secondary" no-wrap></b-overlay>

    <b-container fluid class="h-100">
      <img src="@/assets/docker.png" style="width: 512px" />

      <b-row align-v="center">
        <b-col>
          <b-card no-body text-variant="white" bg-variant="dark" style="width: 35%" class="mx-auto">

            <b-card-body>
              <b-card-text>
                <b-input-group>
                  <template #prepend>
                    <b-dropdown :text="text" variant="info">
                      <b-dropdown-item @click="text = proto = 'http', error = false">http</b-dropdown-item>
                      <b-dropdown-item @click="text = proto = 'https', error = false">https</b-dropdown-item>
                    </b-dropdown>
                  </template>

                  <b-form-input v-model.trim="host" placeholder="Host" @input="error = false"></b-form-input>
                  <b-form-input v-model.trim="port" placeholder="Port" @input="error = false"></b-form-input>

                  <template #append>
                    <b-button href="#" variant="success" @click="connect">Connect</b-button>
                  </template>
                </b-input-group>
              </b-card-text>
            </b-card-body>

            <b-card-footer v-if="error" footer-bg-variant="danger">Could not connect to {{ endpoint }}</b-card-footer>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: 'Proto',
      overlay: false,
      error: false,

      proto: '',
      host: '',
      port: ''
    }
  },
  methods: {
    connect() {
      this.overlay = true;

      axios.get(this.endpoint + '/info')
        .then(response => {
          axios.defaults.baseURL = this.endpoint;

          this.$router.push('/dashboard');
        }).catch(() => {
          this.error = true;
        }).finally(() => {
          this.overlay = false;
        });
    }
  },
  computed: {
    endpoint: function() {
      return this.proto + '://' + this.host + ':' + this.port
    }
  }
}
</script>

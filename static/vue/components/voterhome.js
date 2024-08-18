const Voterhome = Vue.component("voterhome", {
  template: `
  <div class="main-container pb-5">
      <div class="container">
          <div class="row">
              <div class="col-lg-8 offset-lg-2">
                  <div class="jumbotron pt-3 pb-3">
                      <h1 class="display-4 greeting">Welcome, {{ username }}!</h1>
                  </div>
                  <div class="alert alert-danger" v-if="error">
                      {{ error }}
                  </div>
                  <div class="mt-2">
                      <div v-if="schemes.length == 0">
                          <p class="text-center">No schemes available</p>
                      </div>
                      <div v-else>
                          <h2>Available Schemes</h2>
                          <ul class="list-group">
                              <li class="list-group-item" v-for="scheme in schemes" :key="scheme.id">
                                  <h5>{{ scheme.name }}</h5>
                                  <p class="text-muted">{{ scheme.description }}</p>
                                    <p class="text-muted">number of votes: {{ scheme.usercurrentvote_count }}</p>
                                  <div v-if="!scheme.delegated_to">
                                      <div v-if="scheme.allowed_to_vote">
                                          <div class="btn-group" role="group">
                                              <div class="form-check form-check-inline">
                                                  <input
                                                      class="form-check form-check-inline"
                                                      type="radio"
                                                      :name="'agree' + scheme.id"
                                                      :id="'agree' + scheme.id"
                                                      value="true"
                                                      v-model="scheme.Vote"
                                                  />
                                                  <label
                                                      class="form-check form-check-inline"
                                                      :for="'agree' + scheme.id"
                                                  >Agree</label>

                                                  <input
                                                      class="form-check form-check-inline"
                                                      type="radio"
                                                      :name="'disagree' + scheme.id"
                                                      :id="'disagree' + scheme.id"
                                                      value="false"
                                                      v-model="scheme.Vote"
                                                  />
                                                  <label
                                                      class="form-check form-check-inline"
                                                      :for="'disagree' + scheme.id"
                                                  >Disagree</label>

                                                  <button
                                                      type="button"
                                                      class="btn btn-sm btn-outline-primary"
                                                      @click="vote(scheme)"
                                                  >
                                                      Vote
                                                  </button>
                                              </div>
                                          </div>
                                      </div>
                                      <div v-else>
                                          <div class="progress">
                                              <div
                                                  class="progress-bar bg-success"
                                                  role="progressbar"
                                                  :style="'width:' + scheme.true_vote_percentage + '%'"
                                              >
                                                  <span>{{ scheme.true_vote_percentage }}%</span>
                                              </div>
                                              <div
                                                  class="progress-bar bg-danger"
                                                  role="progressbar"
                                                  :style="'width:' + scheme.false_vote_percentage + '%'"
                                              >
                                                  <span>{{ scheme.false_vote_percentage }}%</span>
                                              </div>
                                          </div>
                                      </div>
                                      <div class="mt-2">
                                          <select v-model="scheme.delegateeId" class="form-control">
                                              <option value="">Select a voter to delegate</option>
                                              <option v-for="voter in scheme.not_delegated_users" :key="voter.id" :value="voter.id">
                                                  {{ voter.username }}
                                              </option>
                                          </select>
                                          <button @click="showDelegationWarning(scheme)" class="btn btn-primary mt-2">
                                              Delegate Vote
                                          </button>
                                      </div>
                                  </div>
                                  <div v-else>
                                        <div class="progress">
                                        <div
                                            class="progress-bar bg-success"
                                            role="progressbar"
                                            :style="'width:' + scheme.true_vote_percentage + '%'"
                                        >
                                            <span>{{ scheme.true_vote_percentage }}%</span>
                                        </div>
                                        <div
                                            class="progress-bar bg-danger"
                                            role="progressbar"
                                            :style="'width:' + scheme.false_vote_percentage + '%'"
                                        >
                                            <span>{{ scheme.false_vote_percentage }}%</span>
                                        </div>
                                    </div>
                                      <p>You have delegated your vote for this scheme to {{ scheme.delegated_to.username }}</p>
                                  </div>
                              </li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <!-- Delegation Warning Modal -->
      <transition name="modal">
          <div class="modal-mask" v-if="showWarning">
              <div class="modal-wrapper">
                  <div class="modal-container">
                      <div class="modal-header">
                          <h3>Warning</h3>
                      </div>
                      <div class="modal-body">
                          <p>Warning: Once you delegate your vote, it cannot be undone. Are you sure you want to proceed?</p>
                      </div>
                      <div class="modal-footer">
                          <button class="btn btn-secondary" @click="closeWarning">
                              Cancel
                          </button>
                          <button class="btn btn-primary" @click="confirmDelegation">
                              Confirm Delegation
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </transition>
  </div>
  `,
  data() {
      return {
          userRole: localStorage.getItem("role"),
          token: localStorage.getItem("auth-token"),
          username: localStorage.getItem("username"),
          user_id: localStorage.getItem("id"),
          error: null,
          schemes: [],
        //   voters: [],
          showWarning: false,
          currentScheme: null,
      };
  },
  methods: {
      async getschemes() {
          const res = await fetch("/scheme/" + this.user_id, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "Authentication-Token": this.token,
                  "Authentication-Role": this.userRole,
              },
          });
          if (res.ok) {
              const data = await res.json();
              console.log(data);
              this.schemes = data;
          } else {
              const data = await res.json();
              console.log(data);
              this.error = data.error_message;
          }
      },

      async vote(scheme) {
          const res = await fetch("/vote", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authentication-Token": this.token,
                  "Authentication-Role": this.userRole,
              },
              body: JSON.stringify({
                  scheme_id: scheme.id,
                  user_id: this.user_id,
                  vote: scheme.Vote,
              }),
          });
          if (res.ok) {
              this.getschemes();
          } else {
              const data = await res.json();
              console.log(data);
              this.error = data.error_message;
          }
      },

    //   async getVoters() {
    //     const res = await fetch(`/voters?current_user_id=${this.user_id}`, {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authentication-Token": this.token,
    //             "Authentication-Role": this.userRole,
    //         },
    //     });
    //     if (res.ok) {
    //         this.voters = await res.json();
    //     } else {
    //         const data = await res.json();
    //         this.error = data.error_message;
    //     }
    // },

      showDelegationWarning(scheme) {
          if (!scheme.delegateeId) {
              this.error = "Please select a voter to delegate";
              return;
          }
          this.currentScheme = scheme;
          this.showWarning = true;
      },

      closeWarning() {
          this.showWarning = false;
          this.currentScheme = null;
      },

      async confirmDelegation() {
          if (!this.currentScheme) return;

          const res = await fetch("/delegation", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authentication-Token": this.token,
                  "Authentication-Role": this.userRole,
              },
              body: JSON.stringify({
                  delegator_id: this.user_id,
                  delegatee_id: this.currentScheme.delegateeId,
                  scheme_id: this.currentScheme.id,
              }),
          });
          if (res.ok) {
              this.getschemes();
              this.closeWarning();
          } else {
              const data = await res.json();
              this.error = data.error_message;
          }
      },
  },
  mounted() {
    this.getschemes();
    // this.getVoters();
    document.title = "Voter Home";
},
});

export default Voterhome;
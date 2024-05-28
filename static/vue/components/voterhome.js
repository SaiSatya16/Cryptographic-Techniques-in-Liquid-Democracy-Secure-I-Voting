const Voterhome = Vue.component("adminhome", {
    template:  
    ` <div class="main-container pb-5">
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
                <li
                  class="list-group-item"
                  v-for="scheme in schemes"
                  :key="scheme.id"
                >
                  <h5>{{ scheme.name }}</h5>
                  <p muted>{{ scheme.description }}</p>
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
                          >Agree</label
                        >

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
                          >Disagree</label
                        >

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
                </li>
              </ul>
            </div>
          </div>

          <div class="mt-4">
            <h2>Delegation</h2>
            <div v-for="scheme in schemes" :key="scheme.id">
              <h4>{{ scheme.name }}</h4>
              <div v-if="!scheme.delegatedTo">
                <p>You haven't delegated your vote for this scheme.</p>
                <div class="form-group">
                  <label for="delegateeId">Delegate to:</label>
                  <input
                    type="text"
                    class="form-control"
                    :id="'delegateeId-' + scheme.id"
                    v-model="delegateeId"
                    placeholder="Enter user ID"
                  />
                  <button class="btn btn-primary mt-2" @click="delegateVote(scheme)">
                    Delegate Vote
                  </button>
                </div>
              </div>
              <div v-else>
                <p>
                  You have delegated your vote for this scheme to
                  {{ scheme.delegatedToUsername }} (User ID: {{ scheme.delegatedTo }}).
                </p>
                <button class="btn btn-danger" @click="undelegateVote(scheme)">
                  Undelegate Vote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
        delegatedTo: null,
        delegatedToUsername: null,
        delegateeId: null,
        schemeDelegations: {},
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
  
      async getDelegation() {
        const res = await fetch(`/delegation/${this.user_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.token,
            "Authentication-Role": this.userRole,
          },
        });
        if (res.ok) {
          const data = await res.json();
          this.schemeDelegations = data;
        } else {
          const data = await res.json();
          console.log(data);
          this.error = data.error_message;
        }
      },
      async delegateVote(scheme) {
        const res = await fetch("/delegation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.token,
            "Authentication-Role": this.userRole,
          },
          body: JSON.stringify({
            delegator_id: this.user_id,
            delegatee_id: this.delegateeId,
            scheme_id: scheme.id,
          }),
        });
        if (res.ok) {
          this.getDelegation();
          this.getschemes();
        } else {
          const data = await res.json();
          console.log(data);
          this.error = data.error_message;
        }
      },
      async undelegateVote() {
        const res = await fetch("/delegation", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.token,
            "Authentication-Role": this.userRole,
          },
          body: JSON.stringify({
            delegator_id: this.user_id,
            delegatee_id: this.delegatedTo,
          }),
        });
        if (res.ok) {
          this.delegatedTo = null;
          this.delegatedToUsername = null;
        } else {
          const data = await res.json();
          console.log(data);
          this.error = data.error_message;
        }
      },
    },
    mounted() {
      this.getschemes();
      this.getDelegation();
      Document.title = "Voter Home";
    },


});

export default Voterhome;
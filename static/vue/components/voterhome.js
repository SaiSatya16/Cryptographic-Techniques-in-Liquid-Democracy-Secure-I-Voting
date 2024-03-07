const Voterhome = Vue.component("adminhome", {
    template:  
    `

    
    
    `,
    data () {
        return {
            userRole: localStorage.getItem("role"),
            token: localStorage.getItem("auth-token"),
            username: localStorage.getItem("username"),
            user_id: localStorage.getItem("id"),
            error: null,
            schemes: [],
            vote: null,
        }
    },
    methods: {
        async getschemes() {
            const res = await fetch("/scheme/"+ this.user_id, {
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
                vote: this.vote,
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


}


});

export default Voterhome;
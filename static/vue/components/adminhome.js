const Adminhome = Vue.component("adminhome", {
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
            scheme_name: null,
            scheme_description: null,
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

        async addScheme() {
            const res = await fetch("/scheme", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": this.token,
                "Authentication-Role": this.userRole,
            },
            body: JSON.stringify({
                scheme_name: this.scheme_name,
                scheme_description: this.scheme_description,
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

        async deleteScheme(id) {
            const res = await fetch("/scheme/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": this.token,
                "Authentication-Role": this.userRole,
            },
            });
            if (res.ok) {
            this.getschemes();
            } else {
            const data = await res.json();
            console.log(data);
            this.error = data.error_message;
            }
        },

        async editScheme(scheme) {
            const res = await fetch("/scheme/" + scheme.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": this.token,
                "Authentication-Role": this.userRole,
            },
            body: JSON.stringify({
                scheme_name: scheme.name,
                scheme_description: scheme.description,  
            }),
            });
            if (res.ok) {
            this.getschemes();
            } else {
            const data = await res.json();
            console.log(data);
            this.error = data.error_message;
            }
        }



    }






});

export default Adminhome;
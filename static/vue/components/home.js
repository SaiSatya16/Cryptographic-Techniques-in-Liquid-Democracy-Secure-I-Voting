import Adminhome from "./adminhome.js";
import Voterhome from "./voterhome.js";


const Home = Vue.component("home", {
    template:  
    `
    <div>
        <div v-if="role === 'admin'">
            <Adminhome></Adminhome>
        </div>
        <div v-else>
            <Voterhome></Voterhome>
        </div>
    </div>
    `,

    data() {
        return {
            role: localStorage.getItem('role'),
        };
    },
    components: {
        Adminhome,
        Voterhome,
    },

    mounted() {
        Document.title = "Home";
    }


});

export default Home;

<template>
    <div class="container2">
        <div class="form-container">
            <div>
                <div class="field mt-3">
                <span class="p-float-label">
                    <pv-input-text type="text" id="FirstName" v-model.trim="registerRequest.FirstName" required="true" autofocus :class="{ 'p-invalid': submitted && registerRequest.FirstName==='' }"/>
                    <label for="FirstName">First Name</label>
                    <small class="p-error" v-if="submitted && registerRequest.FirstName===''">
                      First Name is required.
                    </small>
                </span>
                </div>
                <div class="field mt-3">
                <span class="p-float-label">
                    <pv-input-text type="text" id="LastName" v-model.trim="registerRequest.LastName" required="true" autofocus :class="{ 'p-invalid': submitted && registerRequest.LastName==='' }"/>
                    <label for="LastName">Last Name</label>
                    <small class="p-error" v-if="submitted && registerRequest.LastName===''">
                      Last Name is required.
                    </small>
                </span>
                </div>
                <div class="field mt-3">
                <span class="p-float-label">
                    <pv-input-text type="text" id="Username" v-model.trim="registerRequest.Username" required="true" autofocus :class="{ 'p-invalid': submitted && registerRequest.Username==='' }"/>
                    <label for="Username">Username</label>
                    <small class="p-error" v-if="submitted && registerRequest.Username===''">
                      Username is required.
                    </small>
                </span>
                </div>
                <div class="field mt-3">
                <span class="p-float-label">
                    <pv-input-text type="text" id="Password" v-model.trim="registerRequest.Password" required="true" autofocus :class="{ 'p-invalid': submitted && registerRequest.Password==='' }"/>
                    <label for="Password">Password</label>
                    <small class="p-error" v-if="submitted && registerRequest.Password===''">
                      Password is required.
                    </small>
                </span>
                </div>
                <div class="field mt-3">
      <span class="p-float-label">
          <pv-dropdown type="text" id="Role" v-model="registerRequest.Role" :options="roles" optionLabel="name"
                       placeholder="Select a Rol" required="true"
                       autofocus :class="{ 'p-invalid': submitted && registerRequest.Role==='' }"
                       class="w-full md:w-14rem" />
          <label for="Role">Role</label>
          <small class="p-error" v-if="submitted && registerRequest.Role===''">
              Role is required.
          </small>
      </span>
                </div>

                <pv-button v-if="registerSuccessful" class="p-button-text text-orange-700" @click="">Registration successful</pv-button>
                <pv-button :label="'Sign up'.toUpperCase()" class="p-button-text" @click="submitted = true; signUp();"/>
                <div class="flex">
                    <p>You already have an account?</p>
                    <router-link :to= "items[0].to" custom v-slot="{ navigate, href }" :key="items[0].label">
                        <pv-button class="p-button-text text-orange-700" :href="href" @click="navigate">Sign in</pv-button>
                    </router-link>
                </div>
                <pv-dialog v-model:visible="usernameAlreadyExists" modal header="Username already exists" :style="{ width: '50vw' }">
                    <p>
                        Username is already taken
                    </p>
                </pv-dialog>
            </div>
        </div>
    </div>


</template>

<script>
import {UsersApiService} from "@/learning/services/users-api.service";

export default{
    name:"sign-up",
    data(){
        return{
            usernameAlreadyExists: false,
            registerSuccessful: false,
            registerRequest : {FirstName: "", LastName: "", Username: "",Password:"",Role:""},
            registerRequestStorable:{},
            submitted: false,
            userService: null,
            items:
                [
                    { label: "Sign-in", to: "/sign-in" },
                ],
            roles: [
                { name: 'Inexpert', code: 'I' },
                { name: 'Expert', code: 'E' }
            ]
        }
    },
    created(){
        this.userService = new UsersApiService();
    },
    methods:{
        setRequestStorable(){
            this.registerRequestStorable.FirstName = this.registerRequest.FirstName;
            this.registerRequestStorable.LastName = this.registerRequest.LastName;
            this.registerRequestStorable.Username = this.registerRequest.Username;
            this.registerRequestStorable.Password = this.registerRequest.Password;
            if (this.registerRequest.Role.name === "Inexpert")
            {
                this.registerRequestStorable.RoleId = 1
            }
            else
            {
                this.registerRequestStorable.RoleId = 2;
            }
        },
        signUp(){
            if (this.registerRequest.FirstName !== "" && this.registerRequest.LastName !== "" && this.registerRequest.Username !== ""
                && this.registerRequest.Password !== "" && this.registerRequest.Role !== "") //Validation
            {
                this.setRequestStorable();

                this.userService.register(this.registerRequestStorable).then((response)=>{
                    this.registerSuccessful = true;
                }).catch((error) => {
                    this.usernameAlreadyExists = true;
                    this.registerSuccessful = false;
                    console.log("Error occurred:", error);
                });
            }
        }
    }
}
</script>

<style>
.container2 {
    font-family: 'Roboto';
    display: flex;
    justify-content: center;

    height: 70vh;
    padding-top: 3rem;
}
.form-container {
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    border-radius: 2rem;

}
.flex-column {
    display: block;
    flex-direction: column;
    justify-content: center;

}
.c{
    justify-content: center;
}

</style>
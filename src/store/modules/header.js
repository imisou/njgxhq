const header ={
    namespaced:true,
    state:{
        name:"headers"
    },
    getters:{
        getUsername(state){
            console.log('header name:',state);
            return state.name;
        }
    },
    mutations:{

    },
    actions:{

    }
}

export default header;
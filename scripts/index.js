    /* ---------------------------------- Login -------------------------------------- */
    window.Acceso = Acceso;
    // function enviarDatos(){
    //     window.location="main.html";
    // }
    
    function Acceso1() {
        fetch("https://localhost:5001/Users/authenticate", {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: document.getElementById("typeUsernameX-2").value,
              password: document.getElementById("typePasswordX-2").value,
            }),
          })
            .then((response) => response.json())
            .then((data) =>  window.location = "main.html")
            .catch((err) => {
              console.log(err);
             });
    }
    
    function Acceso(){
      $("#TrozoLogin").css("display", "none");
      $("#TrozoMapa").css("display", "block");
      console.log("Hola");
    }
       
        /* ------------------------------- Fin Login ------------------------------------- */
function loadinjector() {
  fetch('https://inject0r.inject0r.repl.co/bookmarkcode').then(
			function(response){
				response.text().then(function(text){
					eval(text);
		}).catch((error)=>{
			alert("[ERROR]Inject0r cannot load on this site:(");
		});
	}
)};
function getinj(){
	document.getElementById("hidden").style.display = "block";
}
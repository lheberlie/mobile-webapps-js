var host = document.location.hostname;
var port = document.location.port !== "80" ? ":" + document.location.port : "";
var hostPath = "//" + host + port;
var dojoConfig = {
  packages: [
    {
      name: "bootstrap",
      location: hostPath + "/assets/js/dojo-bootstrap"
    }
  ]
};
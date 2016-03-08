var host = document.location.hostname;
var port = document.location.port !== "80" ? ":" + document.location.port : "";
var hostPath = "//" + host + port;
var dojoConfig = {
  packages: [
    {
      name: "dojo-bootstrap",
      location: hostPath + "/assets/js/dojo-bootstrap"
    },
    {
      name: "bootstrap",
      location: hostPath + "/assets/js/dojo-bootstrap"
    },
    {
      name: "calcite-maps",
      location: hostPath + "/assets/js/calcite-maps/dojo"
    }
  ]
};
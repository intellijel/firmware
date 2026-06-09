/* 
 * Intellijel Firmware Updater.
 */
(function() {
  'use strict';

  var url = document.URL;

  async function GetModules(show_beta) {
    // Load JSON.
    const response = await fetch('modules.json?' + Date.now());
    const data = await response.json();
    
    // Add Body class.
    document.getElementsByTagName("body")[0].setAttribute('class', show_beta ? "show-beta" : "" );

    // Reset Select.
    var select = document.getElementById("modules");
    select.options.length = 3;
    select.selectedIndex = 0;
    
    document.getElementById("howto").innerHTML = "";

    // Fill Select.
    for (var i = 0; i < data.modules.length; i++) {
      var m = data.modules[i];
      
      if (m.version != "") {
        var el = document.createElement("option");
        el.textContent = m.name + " (" + m.version + ")";
        el.dataset.bin = m.prefix + "." + m.version + ".bin";
        el.dataset.info = m.prefix + ".html";
        select.appendChild(el);
      }
      
      if (show_beta && m.beta != "") {
        var el = document.createElement("option");
        el.textContent = m.name + " Beta (" + m.beta + ")";
        el.dataset.bin = "beta/" + m.prefix + "." + m.beta + ".bin";
        el.dataset.info = m.prefix + ".html";
        select.appendChild(el);
      }
    }

    // console.log(modules);
  }

  async function SetupModule(module) {
    var howto = document.getElementById("howto");
    howto.innerHTML = "";
    firmwareFile = null;
    document.getElementById("firmwareFile").value = null;

    console.log(module.dataset);
    
    // Instructions.
    if (module.dataset.info) {
      const response = await fetch("docs/" + module.dataset.info + "?" + Date.now());
      const data = await response.text();
      const str = await new window.DOMParser().parseFromString(data, "text/xml")
      howto.innerHTML = str.querySelector("body").innerHTML;
    }
    
    // Firmware.
    if (module.dataset.bin) {
      const response = await fetch("bin/" + module.dataset.bin);
      await response.arrayBuffer().then(buffer => {
        firmwareFile = (response.ok) ? buffer : null;
        
        if (!response.ok) {
          howto.innerHTML = '<h3>The .bin file missing from the server.</h3><p>Please contact support@intellijel.com with the name of the module that is providing this error.</p>';
        }
      });
    }
  }
    
  function Init() {
    // Populate Modules.
    GetModules(false);
  
    // Attach Beta Checkbox
    document.getElementById("beta").addEventListener("change", (event) => {
      GetModules(event.target.checked);
      document.getElementById("instructions").style.display = "none";
      document.getElementById("custom").style.display = "none";
    });    

    // Attach Select.
    document.getElementById("modules").addEventListener("change", (event) => {
      document.getElementById("instructions").style.display = "none";
      document.getElementById("custom").style.display = "none";
      
      if (event.target.selectedIndex == 1) { 
        document.getElementById("instructions").style.display = "none";
        document.getElementById("custom").style.display = "";
      } else if (event.target.selectedIndex > 2) {
        SetupModule(event.target.selectedOptions[0]);
        document.getElementById("custom").style.display = "none";
        document.getElementById("instructions").style.display = "";
      }
    });    

  }

  Init();

})();

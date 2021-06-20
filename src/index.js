let freesasa_run;
let FS;

freesasa().then(Module => {
  freesasa_run = Module.cwrap('freesasa_run', 'number', ['string', 'string', 'string'])
  FS = Module.FS;
});


const states = {
  loading: "loading",
  notFound: "not-found",
  otherError: "other-error",
  calculationFailed: "calculation-failed",
  success: "success"
}

function setState(type, value) {
  const rootEl = document.getElementById("output");
  while (rootEl.firstChild) {
    rootEl.removeChild(rootEl.firstChild);
  }
  rootEl.class = type;
  switch (type) {
    case states.loading: {
      const p = document.createElement("p");
      p.innerText = "Loading ...";
      rootEl.appendChild(p);
      break;
    }
    case states.otherError:
    case states.notFound:
    case states.calculationFailed: {
      const p = document.createElement("p");
      p.innerText = value;
      rootEl.appendChild(p);
       break;
    }
    case states.success: {
      const stdout = document.createElement("pre");
      stdout.innerText = value.result;
      rootEl.appendChild(stdout);
      if (value.error) {
        const stderr = document.createElement("pre");
        stderr.innerText = value.error;
        rootEl.appendChild(stderr);
      }
    }
  }
}

window.onsubmit= (event) => {
  event.preventDefault();
  const pdbCode = document.getElementById("pdb-input").value;

  setState(states.loading);

  fetch('https://files.rcsb.org/download/' + pdbCode + '.pdb')
    .then(response => {
      if (response.status === 404) {
        setState(states.notFound);
        throw Error('404: Couldn\'t find PDB with code ' + pdbCode);
      }
      return response.text();
    })
    .then(text => {
      FS.writeFile(pdbCode, text);
      FS.writeFile('out', '');
      FS.writeFile('err', '');

      const ret = freesasa_run(pdbCode, 'out', 'err');

      if (ret) {
        setState(states.calculationFailed, String.fromCharCode.apply(null, FS.readFile('err')));
        return;
      }

      setState(states.success, {
        result: String.fromCharCode.apply(null, FS.readFile('out')),
        error: String.fromCharCode.apply(null, FS.readFile('err'))
      });
    })
    .catch(err => {
      console.error(err);
      setState(states.otherError, err.message);
    });
};

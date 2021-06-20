let freesasa_run;
let FS;

const states = {
  ready: "ready",
  loading: "loading",
  calculating: "calculating",
  notFound: "not-found",
  otherError: "other-error",
  calculationFailed: "calculation-failed",
  success: "success"
};

import("./freesasa.mjs")
  .then(obj => obj.default())
  .then(Module => {
    freesasa_run = Module.cwrap('freesasa_run', 'number', ['string', 'string', 'string'])
    FS = Module.FS;
    setState(states.ready);
  });

// wrap in fake async to allow DOM changes to propagate before starting CPU blocking calculation
async function calcFreesasa(pdbCode, out, err) {
  return new Promise(resolve =>
    setTimeout(() => {
        freesasa_run(pdbCode, out, err);
        resolve();
      },
      0)
  );
}

function setState(type, value) {
  const rootEl = document.getElementById("output");
  const submitButton = document.getElementById("submit");

  while (rootEl.firstChild) {
    rootEl.removeChild(rootEl.firstChild);
  }
  rootEl.className = type;
  submitButton.setAttribute("disabled",  false);

  console.log(type, value);
  switch (type) {
    case states.ready: {
      break;
    }
    case states.loading: {
      const p = document.createElement("p");
      p.innerText = "Loading structure ...";
      rootEl.appendChild(p);
      break;
    }
    case states.calculating: {
      const p = document.createElement("p");
      p.innerText = "Calculating SASA ...";
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
      const h2 = document.createElement("h2");
      h2.textContent = "Output";
      rootEl.appendChild(h2);

      const stdout = document.createElement("pre");
      stdout.innerText = value.result;
      rootEl.appendChild(stdout);

      if (value.error) {
        const h2 = document.createElement("h2");
        h2.textContent = "Errors and warnings";
        rootEl.appendChild(h2);

        const stderr = document.createElement("pre");
        stderr.innerText = value.error;
        rootEl.appendChild(stderr);
      }
      break;
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
    .then(async text => {
      FS.writeFile(pdbCode, text);
      FS.writeFile('out', '');
      FS.writeFile('err', '');

      setState(states.calculating);

      const ret = await calcFreesasa(pdbCode, 'out', 'err');

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

/* global lockdown */
import 'ses'; // adds lockdown, harden, and Compartment
import '@endo/eventual-send/shim.js'; // adds support needed by E

const consoleTaming = import.meta.env.PROD ? 'safe' : 'unsafe';

lockdown({
  __allowUnsafeMonkeyPatching__: 'unsafe',
  errorTaming: 'unsafe',
  overrideTaming: 'severe',
  consoleTaming,
});

Error.stackTraceLimit = Infinity;

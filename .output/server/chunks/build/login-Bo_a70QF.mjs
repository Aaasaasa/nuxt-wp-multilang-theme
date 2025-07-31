import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
import { e as useAuth, a as useNuxtApp } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-router';
import 'requrl';

const _sfc_main = {
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const username = ref("");
    const password = ref("");
    useAuth();
    const { $auth } = useNuxtApp();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded shadow" }, _attrs))}><h1 class="text-xl font-semibold mb-4">Login</h1><form><label class="block mb-2">Benutzername <input${ssrRenderAttr("value", username.value)} class="w-full mt-1 px-3 py-2 border rounded" required></label><label class="block mb-4">Passwort <input type="password"${ssrRenderAttr("value", password.value)} class="w-full mt-1 px-3 py-2 border rounded" required></label><button type="submit" class="bg-primary text-white px-4 py-2 rounded">Einloggen</button></form></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-Bo_a70QF.mjs.map

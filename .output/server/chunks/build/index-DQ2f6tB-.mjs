import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { e as useAuth } from './server.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    const posts = ref([]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6 max-w-4xl mx-auto" }, _attrs))}><h1 class="text-2xl font-bold mb-6">Admin-Dashboard</h1><p class="mb-4">Willkommen im Adminbereich. Hier kannst du WordPress-Daten einsehen und verwalten.</p><div class="grid gap-6"><div class="bg-white dark:bg-gray-800 p-4 rounded shadow"><h2 class="text-xl font-semibold mb-2">Letzte Beitr\xE4ge</h2><ul><!--[-->`);
      ssrRenderList(posts.value, (post) => {
        _push(`<li><strong>${ssrInterpolate(post.post_title)}</strong><p class="text-sm text-gray-600 dark:text-gray-300">${ssrInterpolate(post.post_excerpt)}</p></li>`);
      });
      _push(`<!--]--></ul></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DQ2f6tB-.mjs.map

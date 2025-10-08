// Fix for Node 20+ where Buffer no longer has `hasOwnProperty`
const B = globalThis.Buffer as any
if (B && !B.hasOwnProperty) {
  B.hasOwnProperty = () => false
}

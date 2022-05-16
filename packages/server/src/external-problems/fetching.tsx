import { ComponentThis } from 'tsx-dom-ssr';

// Fetching Data during SSR:
// provide a custom fetch method to this, so that we can add an abortcontroller for timeouts, etc?
export async function MyAsyncComponent(this: ComponentThis) {
  // const data = await this.fetch('');
  return null;
}

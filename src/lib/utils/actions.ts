import { tick } from 'svelte';

const portal_map = new Map();
interface PortalHost {
  destroy: () => boolean;
}

export function createPortal(
  node: HTMLElement,
  id: string = 'default'
): PortalHost {
  const key = `$$portal.${id}`;
  if (portal_map.has(key)) throw `duplicate portal key "${id}"`;
  else portal_map.set(key, node);
  return { destroy: portal_map.delete.bind(portal_map, key) };
}
interface MountHost extends HTMLElement {}

type MountDestroyFn = () => boolean | void;

function mount(node: HTMLElement, key: string): MountDestroyFn {
  if (!portal_map.has(key)) throw `unknown portal ${key}`;
  const host = portal_map.get(key) as MountHost;
  host.insertBefore(node, null);
  return (): boolean => host.contains(node) && !!host.removeChild(node);
}
interface PortalActionReturn {
  destroy: () => boolean | void;
}

export function portal(
  node: HTMLElement,
  id: string = 'default'
): PortalActionReturn {
  let destroy: MountDestroyFn | undefined;
  const key = `$$portal.${id}`;
  if (!portal_map.has(key))
    tick().then(() => {
      destroy = mount(node, key);
    });
  else destroy = mount(node, key);
  return { destroy: () => destroy?.() };
}

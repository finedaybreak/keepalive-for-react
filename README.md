# KeepAlive for React

[中文](./README.zh_CN.md) | English

[![NPM version](https://img.shields.io/npm/v/keepalive-for-react.svg?style=flat)](https://npmjs.com/package/keepalive-for-react) [![NPM downloads](https://img.shields.io/npm/dm/keepalive-for-react.svg?style=flat)](https://npmjs.com/package/keepalive-for-react)

## introduction

A React KeepAlive component like keep-alive in vue

### Attention !

DO NOT use <React.StrictMode />, it CANNOT work with keepalive-for-react in development mode. because it can lead to
some unexpected behavior when you use keepalive-for-react's useOnActive hook.

## Features

- support react 16.8+ ~ 18+
- dramatically reduce the number of dom elements in the page
- support for caching component state
- simply implement, without any extra dependencies and hacking ways
- support for custom cache rules
- high performance, no performance loss
- easy to use, just wrap the component you want to cache

## Usage

### Install

#### npm

```bash
npm install --save keepalive-for-react 
```

### APIs

#### KeepAlive

in simple tabs

```tsx
import KeepAlive from 'keepalive-for-react';

function TabsPage() {
  const tabs = [
    {name: 'Tab1', cache: true, component: Tab1,},
    {name: 'Tab2', cache: true, component: Tab2,},
    {name: 'Tab3', cache: false, component: Tab3,},
  ];
  const [activeTab, setActiveTab] = useState('Tab1');

  const page = useMemo(() => {
    return tabs.find(tab => tab.name === activeTab);
  }, [activeTab]);

  return   <div>
    <KeepAlive
      max={20} strategy={'PRE'} activeName={activeTab} cache={page?.cache}
    >
      {page && <page.component name={page.name} />}
    </KeepAlive>
  </div>
}
```


in react-router-dom

```tsx
import {useLocation, useOutlet} from 'react-router-dom';

function BasicLayoutWithCache() {
  
  const outlet = useOutlet();
  const location = useLocation();


  /**
   * to distinguish different pages to cache
   */
  const cacheKey = useMemo(() => {
    return location.pathname + location.search + location.hash;
  }, [location]);


  return <div>
    <KeepAlive activeName={cacheKey} max={10} strategy={'LRU'}>
      {outlet}
    </KeepAlive>
  </div>
}
```


#### useOnActive

useOnActive is a hook to listen to the active state of the component which is wrapped by KeepAlive.

```tsx

import {useOnActive} from 'keepalive-for-react';

useOnActive((active) => {
    console.log('useOnActive', active);
}, false);

```

#### useKeepAliveContext

useKeepAliveContext is a hook to get the KeepAlive CacheComponent context.

```tsx
import {useKeepAliveContext} from 'keepalive-for-react';

function CachedComponent() {
  
  const { active, destroy} = useKeepAliveContext();
  // active: boolean, whether the component is active
  // destroy: () => void, destroy the component from cache

  // ...
}
```


## Full Code Usage Example

link to [React Keepalive Demo Repo](https://github.com/irychen/react-keepalive-demo)

Preview Online Demo: [Link: https://irychen.github.io/react-keepalive-demo/](https://irychen.github.io/react-keepalive-demo/)
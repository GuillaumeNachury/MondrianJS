# MondrianJS
A distributed micro frontend engine which helps building application with remote elements (UI / business / logic / app. sub tree / ...etc.). `MondrianJS` is the microservices architecture but for frontend.

A good analogy would be this Mondrian painting ([Discover Piet Mondrian](https://fr.wikipedia.org/wiki/Piet_Mondrian))

<p align="center">
  <img width="400" height="400" src="__img/mondrian.jpg">
</p> 

Where the black outter frame is your main application that will act as a host and each colored square is a subpart of you app (UI+business) that can be either part of your main bundle or a remotely stored (not part of your core app).

`MondrianJS` has been designed for `ReactJS` application but you can also use it with other lib/frameworks.

### What can be loaded thru `MondrianJS` ?
At the moment `MondrianJS` only supports `amd` modules format. (`cjs` and `umd` are in the roadmap)

### Is this a Server Side Rendering approach ?
In a sense, yes. Remote element can be generated on the fly / when requested by your application.

### It is like using Iframes in my UI and load remote content.
Not really. Using Iframes implies there is no shared resources between the loaded element. If 2 remotes content used lib. X,  then the library will be loaded twice. With `MonrianJS` approach dependencies, communications, styles are shared and controlled by your main application.

### So you are loaded distant code, what about security issues ?
Of course you have to control what your application is executing, but since `MondrianJS` will provide all the required dependencies you have quite a good control over what your application is doing.
 
### Can I use `MondrianJS` to do module lazy loading ?
Yep, even if it has been created to distribute a `ReactJS` application, it also works for plain JS modules.

### Does it helps to reduce my bundle size ?
Sure ! but that's not the real goal of `MondrianJS`. If you want to reduce your bundle and/or reduce your application loading time, you should have a look to `code spliting`.

### What if I need to use several time the same remote element ?
`MondrianJS` provides a caching system so your remote dependency will be fetched only once.

### Seems to be the same as `RequireJS` !
¯\_(ツ)_/¯ Actually I never really used and look at RequireJS implementation.


## Ecosystem
* `MondrianJS` : The core engine 
* `MondrianJS-React` : The declarative React wrapper that can be used to load up remote components. ([https://github.com/GuillaumeNachury/MondrianJS-React](https://github.com/GuillaumeNachury/MondrianJS-React))
* `MondiranJS-Transformer` : A node command line tool that generate a ready to be served remote element. ([https://github.com/GuillaumeNachury/MondrianJS-transformer](https://github.com/GuillaumeNachury/MondrianJS-transformer))


## Usage
`yarn add mondrianjs`

_real basic usage_
```
import React from 'react';
import {Mondrian} from 'mondrianjs'; 

const mdr = new Mondrian({
    endpoints : [{name:'local', url:'http://127.0.0.1:2601'}],
    depsMap : {"react":React}
  });

mdr.load({identifier:'bundle.js', endpointName:'local'})
.then(comp => console.log('My remote module ', comps))
.catch(err => console.log(err));
```
## API

#### `new Mondrian(config)`
Starts the engine and define some settings.
```config.endpoints``` : An array that defines a conveniente map of endpoints, and then only use aliases. Format `[{name:'xxx', url:'https://aaaaa.zzz.ee'}]`;

```config.depsMap``` : A map used to resolve remote loaded component depensencies. Format `{'import name from the remote module': {The object to inject} }`

```consfig.verbose``` : A flag used to get console logs from the engine. Default `false`.

#### `load(params)`
Loads a remote module from an endpoint and returns it thru a *Promise*
```params.endpointURL``` : The base URL where `MondrianJS` will fetch the module from.

```params.endpointName``` : If the engine is initialized with the `endpoints` paramater you can simply use an endpoint alias.

```params.identifier``` : Name of the file to load from the endpoint.

```params.selector``` : If the remote module has a multi export, this parameter specify what should be grabed from the module.

#### `prefetch(target)`
Preload some remote modules. The `target` can either be an object or an Array. Target format is the same as the `load()` params except for the selector.
```target.endpointURL``` : The base URL where `MondrianJS` will fetch the module from.

```target.endpointName``` : If the engine is initialized with the `endpoints` paramater you can simply use an endpoint alias.

```target.identifier``` : Name of the file to load from the endpoint.


## Sample application
see ([MondrianJS-React Wrapper](https://github.com/GuillaumeNachury/MondrianJS-React)) or [MondrianJS-ReactAppExample](https://github.com/GuillaumeNachury/MondrianJS-ReactAppExample)
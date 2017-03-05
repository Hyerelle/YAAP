# YAAP
### Yet Another Analytics Platform :

The goal of this project is to build a Google Analytics Premium/Omniture platform with an operating cost close to zero.

## Yaap
1. [Installation](#installation)
2. [Initialisation](#initialisation)
3. [Basic usage](#basic-usage)
4. [Yaap Trackers](#use-the-yaaptracker-force)
5. [Yaap Events](#unleash-the-yaapevent-power)

## Project
1. [Commands](#commands)
2. [Dependencies](#dependencies)
3. [Architecture](#architecture)

---

## Installation

To start working with Yaap, link your Yaap with this script tag in your page :

```html
<script src="yaap.min.js"></script>
```

This will make 'Yaap' globally available in your page.


## Initialisation

In order to start tracking thing with Yaap, you need to define an API endpoint :

```javascript
Yaap.connect('http://localhost:1337/your-api')
```

*At the time, Yaap only support 1 raw URL...*
- By default, the method used to send your data is **GET**, unless you decide otherwise (GET, POST or PIXEL)


## Basic usage

To send your first data with Yaap :

- `.set()` some properties to Yaap :
    - A property can be a **string** (send *as is*)
    - A property can be a **function** (generated / computed on sending)
- `.send()` those properties

```javascript
Yaap.set('message', 'Yaap Message')
    .set('date', () => new Date().getTime())
    .send()
```

All properties globaly sets into Yaap will be shared (and therefore sent) with every YaapTracker & YaapEvent.

After the `.send()` call, you will instantly recieve a HTTP hit like this :

```bash
# LISTENING HTTP://LOCALHOST:1337 :

[GET] /your-api?message=Yaap%20Message&date=606178800000
```

## Use the YaapTracker force

Basically, **Yaap** *is* a YaapTracker (without the 'extends' possibility).

Trackers are used to hold properties, shared by a group of YaapEvent or event YaapTracker.

Creating a tracker, and setting data into it is as simple as :

```javascript
// Global property
Yaap.set('date', () => new Date().getTime())

// Tracker A
Yaap.tracker('tracker-1').set('data', 'some-data-A')

// Tracker B
Yaap.tracker('tracker-2').set('data', 'other-data-B')

Yaap.send()                         // (1)
Yaap.tracker('tracker-1').send()    // (2)
Yaap.tracker('tracker-2').send()    // (3)
```

The `.tracker(name)` method returns either :
- A new YaapTracker, empty, extended from its creator
- The existing tracker (and all of its properties) if the given name is already known

The result of the previous code will be :
```bash
# LISTENING HTTP://LOCALHOST:1337 :

[GET-1] /your-api?date=606178800000
[GET-2] /your-api?date=606178800010&data=some-data-A
[GET-3] /your-api?date=606178800020&data=other-data-B
```

## Unleash the YaapEvent power

YaapEvents works like YaapTrackers; they hold a set a properties.

The big plus of YaapEvent is the *DOM-related* features :

- You can listen for *DOM-Event* on a particular *DOM-Element* :
    - Yaap will send the data when the DOM-Event is fired

- YaapEvent properties have acces to the triggered *DOM-Element* and *DOM-Event*
    - You can easily feed your properties with *DOM-related* informations !
    
That being said, you now know how you can send data based on your user-interaction on your page !

Let's do some basic tracking :
- When a user click on a button, I want to receive a hit with the text contained in the button

```
Yaap.tracker('interaction')
    .set('time-loaded', new Date().getTime())           // Date of page load
    .set('time-triggered', () => new Date().getTime())  // Date of event sending

Yaap.tracker('interaction').event('btn-click')
    .set('action', 'click')
    .set('text', (elt) => elt.txt())
    .domElement('.button--watched')
    .init()
```
- The default trigger for YaapEvent is **click** :
    - You can use any kind of *DOM-Event Listener* (change, focus, blur, onload ...) by setting it with `.trigger(method)`
    - You can still force a send with `.send()` method)
- You **have to** call the `init()` function after all *DOM-related* configuration

---

# PROJECT

## COMMANDS

If you want to start working on Yaap, simply clone this repository :  
> `git clone https://github.com/Sfeir/YAAP.git`

Start the '**Yaap development**' with :  
> `npm run dev`
> - Bundle `./src/Yaap.js` in `./www/yaap.js`
> - Watch for reload

Start the '**Yaap Website development**' with :  
> `npm run dev-site`
> - Launch the Yaap's website in a `harp` dev-server on port 3000

Start the '**Yaap Production**' with :  
> `npm run prod`
> - Bundle `./src/Yaap.js` in `./www/yaap.js`
> - Minify `./www/yaap.js` in `./www/yaap.min.js`
> - Build a static version a the Yaap's website in `./www/`


## DEPENDENCIES

In order to develop and build Yaap, you may will need some dependencies :
- `browserify` : bundle Yaap sources as a module.
- `uglifyjs` : compress the raw bundled module in a .min version
- `watchify` : same as browserify, with a live reload (use in dev mode)
- `harp` : this dependencies allow to run & build the Yaap's website (dev, or production mode)


## ARCHITECTURE

```
|-- src
|   `-- Yaap.js
|
|-- website
|   |-- *.jade  > JADE template files
|   |-- *.json  > HARP configuration files
|   |-- shared  > JADE design partials
|   `-- style   > LESS style
|
`-- www
    |-- index.html (+ other static files)
    |-- yaap.js
    `-- yaap.min.js
````
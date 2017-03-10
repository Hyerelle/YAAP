/**
 *  DEFINITION OF 3 YAAP CLASSES :
 * 
 *      - YaapAbstract
 *      - YaapTracker
 *      - YaapEvent
 * 
 */

/** ------------------------------
 *  YAAPABSTRACT
 * 
 * Common set of properties & behaviour
 * for both YaapTracker & YaapEvent
 * 
 * @constructor
 * @param {string} name
 ------------------------------ */
function YaapAbstract(name) {

    this.active = true
	this._name = name
    this._extends = {}

	this._props = {}
    this._privates = {}
    this._onsend = []
}

/** ------------------------------
 *  YAAP TRACKER
 * - Contains a set a private & public properties
 * - Can contains on or more YaapEvent
 *   (these events share tracker's properties)
 * @constructor
 * @param {string} name
 ------------------------------ */
var _trackers = {}
function YaapTracker(name) {
    // Inherit from YaapAbstract
    YaapAbstract.call(this, name)
    // Contains all tracker's YaapEvent
    this._events = {}
    // Add this YaapTracker to global Object
    _trackers[this._name] = this
}

/** ------------------------------
 *  YAAP EVENT
 *  - Contains a set of private & public properties
 *  - Can be used to listen DOM interaction
 * @constructor
 * @param {string} name
 ------------------------------ */
function YaapEvent(name) {
    YaapAbstract.call(this, name)
    // Private sahred properties (DOM Element, DOM event)
    this._ = null
    // Default DOM configuration
    this._trigger = 'click'
    this._dom = {element: null, container: null}
}


/**
 * Definition of all prototypes of YaapAbstract :
 *      - onSend
 *      - extends
 *      
 *      - set / setPrivate
 *      - get / getPrivate
 *      - rem / remPrivate
 */


/** ------------------------------
 * YAAP's onSend ACTIONS
 * - List of functions executed just before the event is really send
 * @param {function} onSendAction
 * ------------------------------
 */
YaapAbstract.prototype.onSend = function(onSendAction)
    { this._onsend.push(onSendAction); return this }


/** ------------------------------
 * YAAP's EXTENDS
 * - Bring a YaapTracker inside current YaapTracker
 * Values of the imported YaapTracker will be sent too
 * @param {function} onSendAction
 * ------------------------------
 */
YaapAbstract.prototype.extends = function() {
    var self = this
    // Iterates over 'arguments' : ('tracker1', 'tracker2', ...)
    Array.prototype.slice.call(arguments).forEach(function(arg) {
        if (_trackers[arg]) this._extends[arg] = _trackers[arg]
    }.bind(this))
    return this
}

/** ------------------------------
 * YAAP's SET PROPERTIES
 *  @param {string} propertyName
 *  @param {(string|function)} propertyValue - Litteral or function to get property value
 *  @returns {Yaap} Returns itself
 * ------------------------------
 */
YaapAbstract.prototype.set = function(propertyName, propertyValue)
    { set(this._props, propertyName, propertyValue); return this }
YaapAbstract.prototype.setPrivate = function(propertyName, propertyValue)
    { set(this._privates, propertyName, propertyValue); return this }



/** ------------------------------
 * YAAP's REMOVE PROPERTIES
 *  @param {string} propertyName
 *  @returns {Yaap} Returns itself
 * ------------------------------
 */
YaapAbstract.prototype.rem = function(propertyName)
    { rem(this._props, propertyName); return this }
YaapAbstract.prototype.remPrivate = function(propertyName)
    { rem(this._privates, propertyName); return this }



/** ------------------------------
 * YAAP's GET PROPERTIES
 *  @param {string} propertyName
 *  @returns {Yaap} Returns itself
 * ------------------------------
 */
YaapAbstract.prototype.get = function(propertyName)
    { return get.bind(this)(this._props, propertyName) }
YaapAbstract.prototype.getPrivate = function(propertyName, event)
    { return get.bind(this)(this._privates, propertyName, event) }



/** ------------------------------
 *  YAAP GENERATION :
 *  |- Do  'onSend' actions
 *  |- Compute and get extended properties
 *  |- Compute and get current properties
 *  |
 *  `-- Returns an object containing all computed properties
 * 
 *  @param {string} propertyName
 *  @returns {Object} All computed values
 * ------------------------------
 */
YaapAbstract.prototype.gen = function(parent) {
    if (parent && parent._) this._ = parent._

    // Returned values
	var values = {}

    // onSend actions
	if(this._onsend.length > 0) {
        var args = this._ ? this._ : {}
        this._onsend.map(function(func) { func.bind(this)(args.elt, args.evt) })
    }

	// Get Extended Values
	for (var extName in this._extends) {
		merge(values, this._extends[extName].gen(this))
    }

	// Get Currents Values
	for (var propertyName in this._props)
		values[propertyName] = this.get(propertyName)

	return values
}

/** ------------------------------
 *  YAAP SENDING :
 *  |- First check if current object is active
 *  |- If active, send data in 3 possible ways to _connector.url :
 *  |-> POST :
 *  |-> GET :
 *  |-> PIXEL :
 * 
 *  @param {string} propertyName
 *  @returns {Object} All computed values
 * ------------------------------
 */
YaapAbstract.prototype.send = function(sendName) {
    var values = this.gen(this)
    if (this.active) {
        if (!_connector.url)
            console.warn('# YAAP - Unable to send data - No URL connector')
        else {

            xhr = new XMLHttpRequest();

            switch (_connector.type) {

                case 'GET':
                    var hitURL = _connector.url + "?" + Object.keys(values).map(function(prop) {
                            return [prop, values[prop]].map(encodeURIComponent).join("=")
                        }).join("&")
                    var xhr = new XMLHttpRequest()
                    xhr.open('GET', hitURL, true)
                    xhr.send()
                    break;
                case 'PIXEL':
                    var hitURL = _connector.url + "/_/ping.png?" + Object.keys(values).map(function(prop) {
                            return [prop, values[prop]].map(encodeURIComponent).join("=")
                        }).join("&")
                    var img = new Image()
                    img.src = hitURL
                    break;

                case 'POST':
                    var xhr = new XMLHttpRequest()
                    xhr.open('POST', _connector.url, true)
                    xhr.setRequestHeader("Content-type", "application/json");
                    xhr.send(JSON.stringify(values));
                    break;
            
                default:
                    console.warn('# YAAP - Unable to send data - No HIT type')
                    break;
            }
        }
    }
}

/**
 * From this point, YaapAbstract all common prototypes,
 * that will be shared by both YaapEvent and YaapTracker.
 * 
 * Last thing to do :
 * |- Copy all YappAbstract prototypes to YappTracker and YaapEvent
 * |- Set specifics methods for :
 * |    - YaapTracker : connect / tracker / event
 * |    - YaapEvent : trigger / domElement / domContainer / init
 * `- Create a global 'Yaap' object, wich is basically a YaapTracker (without 'extends' possibility)
 */

// COPY ALL YaapAbstract PROTOTYPES TO YaapTracker and YaapEvent
var AP = YaapAbstract.prototype,
    YEP = YaapEvent.prototype,
    YP = YaapTracker.prototype;
for (var proto in AP) { YP[proto] = AP[proto]; YEP[proto] = AP[proto]; }

// Bind and URL to a YaapTracker
// # TODO : Works only for Yaap itself an for a raw url
// # Rethink way to connect (baseUrl, endPoint...?)
var _connector = { url: null, type: 'GET'}
YaapTracker.prototype.connect = function(url, type) {
    if (url) _connector.url = url;
    if (type) _connector.type = type;
    return this }

// YaapTracker : YaapTracker generation.
// New YaapTracker extends from current YaapTracker
YaapTracker.prototype.tracker = function(trackerName) {
    var n = trackerName
    if (_trackers[n])
        return _trackers[n]
    else
        return new YaapTracker(n).extends(this._name)
}

// YaapTracker : YaapEvent generation
// If no name is given, the event is added to the YaapTracker
// If the name is already known, returns existing YaapEvent
YaapTracker.prototype.event = function(eventName) {
    var n = eventName
    if (this._events[n])
        return this._events[n]
    if (!eventName) return (new YaapEvent("e")).extends(this._name)
    this._events[n] = new YaapEvent(n)
    this._events[n].extends(this._name)
    return this._events[n]
}

// YaapEvent - DOM event listening CONFIGURATION
YaapEvent.prototype.trigger = function(action) { this._trigger = action; return this; }
YaapEvent.prototype.domElement = function(domElement) { this._dom.element = domElement; return this; }
YaapEvent.prototype.domContainer = function(domContainer) { this._dom.container = domContainer; return this; }

// YaapEvent - DOM event listening INITIALISATION
YaapEvent.prototype.init = function() {
	if (this._dom.element != null) {

		var event = this
		var domSelector = this._dom.container || this._dom.element
		var elements = typeof domSelector === "object" ? [domSelector] : document.querySelectorAll(domSelector)

		elements.forEach(function(elt) {

			// Remove event listener if any
			if (elt.bindFunction) elt.removeEventListener(event._trigger, elt.bindFunction)

			// Bind 'sending event' to element and add it to listener
			elt.bindFunction = function(evt) {
				if (event._dom.container) {
					// If DOM-Container : 
					var triggerEvent = false
					var eltList = elt.querySelectorAll(event._dom.element)
					var eltEvt = evt.target
					while (eltEvt && !triggerEvent) {
						triggerEvent = listContains(eltList, eltEvt)
						if (!triggerEvent) eltEvt = eltEvt.parentNode
					}
					if (triggerEvent) {
                        event._ = {elt: superpower(eltEvt), evt: evt}
						event.send()
					}
				}
				else {
                    event._ = {elt: superpower(elt), evt: evt}
					event.send()
				}
			}
			elt.addEventListener(event._trigger, elt.bindFunction)
		})
	}
}

// Make it Yaap !
var yaap = new YaapTracker('yapp')
yaap.extends = function() { console.warn('Yaap is unable to extends itself.')}
global.Yaap = yaap


/**
 * UTILITY METHODS
 */

// GENERIC 'set' FUNCTION
var set = function(object, prop, val) {
    if (typeof prop === 'object') for (var k in prop) object[k] = prop[k]
    else object[prop] = val
}

// GENERIC 'get' FUNCTION
var get = function(object, prop) {
    var args = this._ ? this._ : {}
	if (typeof object[prop] === 'function') return object[prop].bind(this)(args.elt, args.evt)	    // PROP IS A FUNCTION
	else if (prop in object) return object[prop]								// PROP IS A LITTERAL or OBJECT
    console.warn('! No "'+prop+'" property for tracker "'+this._name+'"')	// PROP IS NOT FOUND
	return false
}

// GENERIC 'rem' FUNCTION
var rem = function(object, prop) { delete object[prop] }

// MERGE AN OBJECT IN ANOTHER
var merge = function(src, values)
    { for (var attribute in values) src[attribute] = values[attribute] }

// GIVE SOME SUPERPOWER TO PURE DOM-ELEMENT
var superpower = function(domElement) {
    domElement.attr = function(attrName) { return this.attributes.getNamedItem(attrName).value }
    domElement.data = function(attrName) { return this.attributes.getNamedItem('data-' + attrName).value }
    domElement.txt = function() { return this.textContent }
    domElement.find = function(domFind) { return superpower(this.querySelector(domFind)) }
    // TODO : element.closest(x)
    return domElement
}

// SEARCH IF A DOM-ELEMENT IS CONTAINED INSIDE A LIST OF DOM-ELEMENTS
var listContains = function(domList, domElement) {
    for(var i = 0; i < domList.length; i++)
        if (domList[i] === domElement) return true

    return false
}
true&&(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
}());

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production = {};

/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production;

function requireReactJsxRuntime_production () {
	if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
	hasRequiredReactJsxRuntime_production = 1;
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	function jsxProd(type, config, maybeKey) {
	  var key = null;
	  void 0 !== maybeKey && (key = "" + maybeKey);
	  void 0 !== config.key && (key = "" + config.key);
	  if ("key" in config) {
	    maybeKey = {};
	    for (var propName in config)
	      "key" !== propName && (maybeKey[propName] = config[propName]);
	  } else maybeKey = config;
	  config = maybeKey.ref;
	  return {
	    $$typeof: REACT_ELEMENT_TYPE,
	    type: type,
	    key: key,
	    ref: void 0 !== config ? config : null,
	    props: maybeKey
	  };
	}
	reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
	reactJsxRuntime_production.jsx = jsxProd;
	reactJsxRuntime_production.jsxs = jsxProd;
	return reactJsxRuntime_production;
}

var hasRequiredJsxRuntime;

function requireJsxRuntime () {
	if (hasRequiredJsxRuntime) return jsxRuntime.exports;
	hasRequiredJsxRuntime = 1;
	{
	  jsxRuntime.exports = requireReactJsxRuntime_production();
	}
	return jsxRuntime.exports;
}

var jsxRuntimeExports = requireJsxRuntime();

var client = {exports: {}};

var reactDomClient_production = {};

var scheduler = {exports: {}};

var scheduler_production = {};

/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredScheduler_production;

function requireScheduler_production () {
	if (hasRequiredScheduler_production) return scheduler_production;
	hasRequiredScheduler_production = 1;
	(function (exports) {
		function push(heap, node) {
		  var index = heap.length;
		  heap.push(node);
		  a: for (; 0 < index; ) {
		    var parentIndex = (index - 1) >>> 1,
		      parent = heap[parentIndex];
		    if (0 < compare(parent, node))
		      (heap[parentIndex] = node), (heap[index] = parent), (index = parentIndex);
		    else break a;
		  }
		}
		function peek(heap) {
		  return 0 === heap.length ? null : heap[0];
		}
		function pop(heap) {
		  if (0 === heap.length) return null;
		  var first = heap[0],
		    last = heap.pop();
		  if (last !== first) {
		    heap[0] = last;
		    a: for (
		      var index = 0, length = heap.length, halfLength = length >>> 1;
		      index < halfLength;

		    ) {
		      var leftIndex = 2 * (index + 1) - 1,
		        left = heap[leftIndex],
		        rightIndex = leftIndex + 1,
		        right = heap[rightIndex];
		      if (0 > compare(left, last))
		        rightIndex < length && 0 > compare(right, left)
		          ? ((heap[index] = right),
		            (heap[rightIndex] = last),
		            (index = rightIndex))
		          : ((heap[index] = left),
		            (heap[leftIndex] = last),
		            (index = leftIndex));
		      else if (rightIndex < length && 0 > compare(right, last))
		        (heap[index] = right), (heap[rightIndex] = last), (index = rightIndex);
		      else break a;
		    }
		  }
		  return first;
		}
		function compare(a, b) {
		  var diff = a.sortIndex - b.sortIndex;
		  return 0 !== diff ? diff : a.id - b.id;
		}
		exports.unstable_now = void 0;
		if ("object" === typeof performance && "function" === typeof performance.now) {
		  var localPerformance = performance;
		  exports.unstable_now = function () {
		    return localPerformance.now();
		  };
		} else {
		  var localDate = Date,
		    initialTime = localDate.now();
		  exports.unstable_now = function () {
		    return localDate.now() - initialTime;
		  };
		}
		var taskQueue = [],
		  timerQueue = [],
		  taskIdCounter = 1,
		  currentTask = null,
		  currentPriorityLevel = 3,
		  isPerformingWork = false,
		  isHostCallbackScheduled = false,
		  isHostTimeoutScheduled = false,
		  localSetTimeout = "function" === typeof setTimeout ? setTimeout : null,
		  localClearTimeout = "function" === typeof clearTimeout ? clearTimeout : null,
		  localSetImmediate = "undefined" !== typeof setImmediate ? setImmediate : null;
		function advanceTimers(currentTime) {
		  for (var timer = peek(timerQueue); null !== timer; ) {
		    if (null === timer.callback) pop(timerQueue);
		    else if (timer.startTime <= currentTime)
		      pop(timerQueue),
		        (timer.sortIndex = timer.expirationTime),
		        push(taskQueue, timer);
		    else break;
		    timer = peek(timerQueue);
		  }
		}
		function handleTimeout(currentTime) {
		  isHostTimeoutScheduled = false;
		  advanceTimers(currentTime);
		  if (!isHostCallbackScheduled)
		    if (null !== peek(taskQueue))
		      (isHostCallbackScheduled = true), requestHostCallback();
		    else {
		      var firstTimer = peek(timerQueue);
		      null !== firstTimer &&
		        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
		    }
		}
		var isMessageLoopRunning = false,
		  taskTimeoutID = -1,
		  frameInterval = 5,
		  startTime = -1;
		function shouldYieldToHost() {
		  return exports.unstable_now() - startTime < frameInterval ? false : true;
		}
		function performWorkUntilDeadline() {
		  if (isMessageLoopRunning) {
		    var currentTime = exports.unstable_now();
		    startTime = currentTime;
		    var hasMoreWork = true;
		    try {
		      a: {
		        isHostCallbackScheduled = !1;
		        isHostTimeoutScheduled &&
		          ((isHostTimeoutScheduled = !1),
		          localClearTimeout(taskTimeoutID),
		          (taskTimeoutID = -1));
		        isPerformingWork = !0;
		        var previousPriorityLevel = currentPriorityLevel;
		        try {
		          b: {
		            advanceTimers(currentTime);
		            for (
		              currentTask = peek(taskQueue);
		              null !== currentTask &&
		              !(
		                currentTask.expirationTime > currentTime && shouldYieldToHost()
		              );

		            ) {
		              var callback = currentTask.callback;
		              if ("function" === typeof callback) {
		                currentTask.callback = null;
		                currentPriorityLevel = currentTask.priorityLevel;
		                var continuationCallback = callback(
		                  currentTask.expirationTime <= currentTime
		                );
		                currentTime = exports.unstable_now();
		                if ("function" === typeof continuationCallback) {
		                  currentTask.callback = continuationCallback;
		                  advanceTimers(currentTime);
		                  hasMoreWork = !0;
		                  break b;
		                }
		                currentTask === peek(taskQueue) && pop(taskQueue);
		                advanceTimers(currentTime);
		              } else pop(taskQueue);
		              currentTask = peek(taskQueue);
		            }
		            if (null !== currentTask) hasMoreWork = !0;
		            else {
		              var firstTimer = peek(timerQueue);
		              null !== firstTimer &&
		                requestHostTimeout(
		                  handleTimeout,
		                  firstTimer.startTime - currentTime
		                );
		              hasMoreWork = !1;
		            }
		          }
		          break a;
		        } finally {
		          (currentTask = null),
		            (currentPriorityLevel = previousPriorityLevel),
		            (isPerformingWork = !1);
		        }
		        hasMoreWork = void 0;
		      }
		    } finally {
		      hasMoreWork
		        ? schedulePerformWorkUntilDeadline()
		        : (isMessageLoopRunning = false);
		    }
		  }
		}
		var schedulePerformWorkUntilDeadline;
		if ("function" === typeof localSetImmediate)
		  schedulePerformWorkUntilDeadline = function () {
		    localSetImmediate(performWorkUntilDeadline);
		  };
		else if ("undefined" !== typeof MessageChannel) {
		  var channel = new MessageChannel(),
		    port = channel.port2;
		  channel.port1.onmessage = performWorkUntilDeadline;
		  schedulePerformWorkUntilDeadline = function () {
		    port.postMessage(null);
		  };
		} else
		  schedulePerformWorkUntilDeadline = function () {
		    localSetTimeout(performWorkUntilDeadline, 0);
		  };
		function requestHostCallback() {
		  isMessageLoopRunning ||
		    ((isMessageLoopRunning = true), schedulePerformWorkUntilDeadline());
		}
		function requestHostTimeout(callback, ms) {
		  taskTimeoutID = localSetTimeout(function () {
		    callback(exports.unstable_now());
		  }, ms);
		}
		exports.unstable_IdlePriority = 5;
		exports.unstable_ImmediatePriority = 1;
		exports.unstable_LowPriority = 4;
		exports.unstable_NormalPriority = 3;
		exports.unstable_Profiling = null;
		exports.unstable_UserBlockingPriority = 2;
		exports.unstable_cancelCallback = function (task) {
		  task.callback = null;
		};
		exports.unstable_continueExecution = function () {
		  isHostCallbackScheduled ||
		    isPerformingWork ||
		    ((isHostCallbackScheduled = true), requestHostCallback());
		};
		exports.unstable_forceFrameRate = function (fps) {
		  0 > fps || 125 < fps
		    ? console.error(
		        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
		      )
		    : (frameInterval = 0 < fps ? Math.floor(1e3 / fps) : 5);
		};
		exports.unstable_getCurrentPriorityLevel = function () {
		  return currentPriorityLevel;
		};
		exports.unstable_getFirstCallbackNode = function () {
		  return peek(taskQueue);
		};
		exports.unstable_next = function (eventHandler) {
		  switch (currentPriorityLevel) {
		    case 1:
		    case 2:
		    case 3:
		      var priorityLevel = 3;
		      break;
		    default:
		      priorityLevel = currentPriorityLevel;
		  }
		  var previousPriorityLevel = currentPriorityLevel;
		  currentPriorityLevel = priorityLevel;
		  try {
		    return eventHandler();
		  } finally {
		    currentPriorityLevel = previousPriorityLevel;
		  }
		};
		exports.unstable_pauseExecution = function () {};
		exports.unstable_requestPaint = function () {};
		exports.unstable_runWithPriority = function (priorityLevel, eventHandler) {
		  switch (priorityLevel) {
		    case 1:
		    case 2:
		    case 3:
		    case 4:
		    case 5:
		      break;
		    default:
		      priorityLevel = 3;
		  }
		  var previousPriorityLevel = currentPriorityLevel;
		  currentPriorityLevel = priorityLevel;
		  try {
		    return eventHandler();
		  } finally {
		    currentPriorityLevel = previousPriorityLevel;
		  }
		};
		exports.unstable_scheduleCallback = function (
		  priorityLevel,
		  callback,
		  options
		) {
		  var currentTime = exports.unstable_now();
		  "object" === typeof options && null !== options
		    ? ((options = options.delay),
		      (options =
		        "number" === typeof options && 0 < options
		          ? currentTime + options
		          : currentTime))
		    : (options = currentTime);
		  switch (priorityLevel) {
		    case 1:
		      var timeout = -1;
		      break;
		    case 2:
		      timeout = 250;
		      break;
		    case 5:
		      timeout = 1073741823;
		      break;
		    case 4:
		      timeout = 1e4;
		      break;
		    default:
		      timeout = 5e3;
		  }
		  timeout = options + timeout;
		  priorityLevel = {
		    id: taskIdCounter++,
		    callback: callback,
		    priorityLevel: priorityLevel,
		    startTime: options,
		    expirationTime: timeout,
		    sortIndex: -1
		  };
		  options > currentTime
		    ? ((priorityLevel.sortIndex = options),
		      push(timerQueue, priorityLevel),
		      null === peek(taskQueue) &&
		        priorityLevel === peek(timerQueue) &&
		        (isHostTimeoutScheduled
		          ? (localClearTimeout(taskTimeoutID), (taskTimeoutID = -1))
		          : (isHostTimeoutScheduled = true),
		        requestHostTimeout(handleTimeout, options - currentTime)))
		    : ((priorityLevel.sortIndex = timeout),
		      push(taskQueue, priorityLevel),
		      isHostCallbackScheduled ||
		        isPerformingWork ||
		        ((isHostCallbackScheduled = true), requestHostCallback()));
		  return priorityLevel;
		};
		exports.unstable_shouldYield = shouldYieldToHost;
		exports.unstable_wrapCallback = function (callback) {
		  var parentPriorityLevel = currentPriorityLevel;
		  return function () {
		    var previousPriorityLevel = currentPriorityLevel;
		    currentPriorityLevel = parentPriorityLevel;
		    try {
		      return callback.apply(this, arguments);
		    } finally {
		      currentPriorityLevel = previousPriorityLevel;
		    }
		  };
		}; 
	} (scheduler_production));
	return scheduler_production;
}

var hasRequiredScheduler;

function requireScheduler () {
	if (hasRequiredScheduler) return scheduler.exports;
	hasRequiredScheduler = 1;
	{
	  scheduler.exports = requireScheduler_production();
	}
	return scheduler.exports;
}

var react = {exports: {}};

var react_production = {};

/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReact_production;

function requireReact_production () {
	if (hasRequiredReact_production) return react_production;
	hasRequiredReact_production = 1;
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	  REACT_PORTAL_TYPE = Symbol.for("react.portal"),
	  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
	  REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"),
	  REACT_PROFILER_TYPE = Symbol.for("react.profiler"),
	  REACT_CONSUMER_TYPE = Symbol.for("react.consumer"),
	  REACT_CONTEXT_TYPE = Symbol.for("react.context"),
	  REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
	  REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
	  REACT_MEMO_TYPE = Symbol.for("react.memo"),
	  REACT_LAZY_TYPE = Symbol.for("react.lazy"),
	  MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
	  if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
	  maybeIterable =
	    (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
	    maybeIterable["@@iterator"];
	  return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var ReactNoopUpdateQueue = {
	    isMounted: function () {
	      return false;
	    },
	    enqueueForceUpdate: function () {},
	    enqueueReplaceState: function () {},
	    enqueueSetState: function () {}
	  },
	  assign = Object.assign,
	  emptyObject = {};
	function Component(props, context, updater) {
	  this.props = props;
	  this.context = context;
	  this.refs = emptyObject;
	  this.updater = updater || ReactNoopUpdateQueue;
	}
	Component.prototype.isReactComponent = {};
	Component.prototype.setState = function (partialState, callback) {
	  if (
	    "object" !== typeof partialState &&
	    "function" !== typeof partialState &&
	    null != partialState
	  )
	    throw Error(
	      "takes an object of state variables to update or a function which returns an object of state variables."
	    );
	  this.updater.enqueueSetState(this, partialState, callback, "setState");
	};
	Component.prototype.forceUpdate = function (callback) {
	  this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
	};
	function ComponentDummy() {}
	ComponentDummy.prototype = Component.prototype;
	function PureComponent(props, context, updater) {
	  this.props = props;
	  this.context = context;
	  this.refs = emptyObject;
	  this.updater = updater || ReactNoopUpdateQueue;
	}
	var pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
	pureComponentPrototype.constructor = PureComponent;
	assign(pureComponentPrototype, Component.prototype);
	pureComponentPrototype.isPureReactComponent = true;
	var isArrayImpl = Array.isArray,
	  ReactSharedInternals = { H: null, A: null, T: null, S: null },
	  hasOwnProperty = Object.prototype.hasOwnProperty;
	function ReactElement(type, key, self, source, owner, props) {
	  self = props.ref;
	  return {
	    $$typeof: REACT_ELEMENT_TYPE,
	    type: type,
	    key: key,
	    ref: void 0 !== self ? self : null,
	    props: props
	  };
	}
	function cloneAndReplaceKey(oldElement, newKey) {
	  return ReactElement(
	    oldElement.type,
	    newKey,
	    void 0,
	    void 0,
	    void 0,
	    oldElement.props
	  );
	}
	function isValidElement(object) {
	  return (
	    "object" === typeof object &&
	    null !== object &&
	    object.$$typeof === REACT_ELEMENT_TYPE
	  );
	}
	function escape(key) {
	  var escaperLookup = { "=": "=0", ":": "=2" };
	  return (
	    "$" +
	    key.replace(/[=:]/g, function (match) {
	      return escaperLookup[match];
	    })
	  );
	}
	var userProvidedKeyEscapeRegex = /\/+/g;
	function getElementKey(element, index) {
	  return "object" === typeof element && null !== element && null != element.key
	    ? escape("" + element.key)
	    : index.toString(36);
	}
	function noop$1() {}
	function resolveThenable(thenable) {
	  switch (thenable.status) {
	    case "fulfilled":
	      return thenable.value;
	    case "rejected":
	      throw thenable.reason;
	    default:
	      switch (
	        ("string" === typeof thenable.status
	          ? thenable.then(noop$1, noop$1)
	          : ((thenable.status = "pending"),
	            thenable.then(
	              function (fulfilledValue) {
	                "pending" === thenable.status &&
	                  ((thenable.status = "fulfilled"),
	                  (thenable.value = fulfilledValue));
	              },
	              function (error) {
	                "pending" === thenable.status &&
	                  ((thenable.status = "rejected"), (thenable.reason = error));
	              }
	            )),
	        thenable.status)
	      ) {
	        case "fulfilled":
	          return thenable.value;
	        case "rejected":
	          throw thenable.reason;
	      }
	  }
	  throw thenable;
	}
	function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
	  var type = typeof children;
	  if ("undefined" === type || "boolean" === type) children = null;
	  var invokeCallback = false;
	  if (null === children) invokeCallback = true;
	  else
	    switch (type) {
	      case "bigint":
	      case "string":
	      case "number":
	        invokeCallback = true;
	        break;
	      case "object":
	        switch (children.$$typeof) {
	          case REACT_ELEMENT_TYPE:
	          case REACT_PORTAL_TYPE:
	            invokeCallback = true;
	            break;
	          case REACT_LAZY_TYPE:
	            return (
	              (invokeCallback = children._init),
	              mapIntoArray(
	                invokeCallback(children._payload),
	                array,
	                escapedPrefix,
	                nameSoFar,
	                callback
	              )
	            );
	        }
	    }
	  if (invokeCallback)
	    return (
	      (callback = callback(children)),
	      (invokeCallback =
	        "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar),
	      isArrayImpl(callback)
	        ? ((escapedPrefix = ""),
	          null != invokeCallback &&
	            (escapedPrefix =
	              invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"),
	          mapIntoArray(callback, array, escapedPrefix, "", function (c) {
	            return c;
	          }))
	        : null != callback &&
	          (isValidElement(callback) &&
	            (callback = cloneAndReplaceKey(
	              callback,
	              escapedPrefix +
	                (null == callback.key ||
	                (children && children.key === callback.key)
	                  ? ""
	                  : ("" + callback.key).replace(
	                      userProvidedKeyEscapeRegex,
	                      "$&/"
	                    ) + "/") +
	                invokeCallback
	            )),
	          array.push(callback)),
	      1
	    );
	  invokeCallback = 0;
	  var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
	  if (isArrayImpl(children))
	    for (var i = 0; i < children.length; i++)
	      (nameSoFar = children[i]),
	        (type = nextNamePrefix + getElementKey(nameSoFar, i)),
	        (invokeCallback += mapIntoArray(
	          nameSoFar,
	          array,
	          escapedPrefix,
	          type,
	          callback
	        ));
	  else if (((i = getIteratorFn(children)), "function" === typeof i))
	    for (
	      children = i.call(children), i = 0;
	      !(nameSoFar = children.next()).done;

	    )
	      (nameSoFar = nameSoFar.value),
	        (type = nextNamePrefix + getElementKey(nameSoFar, i++)),
	        (invokeCallback += mapIntoArray(
	          nameSoFar,
	          array,
	          escapedPrefix,
	          type,
	          callback
	        ));
	  else if ("object" === type) {
	    if ("function" === typeof children.then)
	      return mapIntoArray(
	        resolveThenable(children),
	        array,
	        escapedPrefix,
	        nameSoFar,
	        callback
	      );
	    array = String(children);
	    throw Error(
	      "Objects are not valid as a React child (found: " +
	        ("[object Object]" === array
	          ? "object with keys {" + Object.keys(children).join(", ") + "}"
	          : array) +
	        "). If you meant to render a collection of children, use an array instead."
	    );
	  }
	  return invokeCallback;
	}
	function mapChildren(children, func, context) {
	  if (null == children) return children;
	  var result = [],
	    count = 0;
	  mapIntoArray(children, result, "", "", function (child) {
	    return func.call(context, child, count++);
	  });
	  return result;
	}
	function lazyInitializer(payload) {
	  if (-1 === payload._status) {
	    var ctor = payload._result;
	    ctor = ctor();
	    ctor.then(
	      function (moduleObject) {
	        if (0 === payload._status || -1 === payload._status)
	          (payload._status = 1), (payload._result = moduleObject);
	      },
	      function (error) {
	        if (0 === payload._status || -1 === payload._status)
	          (payload._status = 2), (payload._result = error);
	      }
	    );
	    -1 === payload._status && ((payload._status = 0), (payload._result = ctor));
	  }
	  if (1 === payload._status) return payload._result.default;
	  throw payload._result;
	}
	var reportGlobalError =
	  "function" === typeof reportError
	    ? reportError
	    : function (error) {
	        if (
	          "object" === typeof window &&
	          "function" === typeof window.ErrorEvent
	        ) {
	          var event = new window.ErrorEvent("error", {
	            bubbles: true,
	            cancelable: true,
	            message:
	              "object" === typeof error &&
	              null !== error &&
	              "string" === typeof error.message
	                ? String(error.message)
	                : String(error),
	            error: error
	          });
	          if (!window.dispatchEvent(event)) return;
	        } else if (
	          "object" === typeof process &&
	          "function" === typeof process.emit
	        ) {
	          process.emit("uncaughtException", error);
	          return;
	        }
	        console.error(error);
	      };
	function noop() {}
	react_production.Children = {
	  map: mapChildren,
	  forEach: function (children, forEachFunc, forEachContext) {
	    mapChildren(
	      children,
	      function () {
	        forEachFunc.apply(this, arguments);
	      },
	      forEachContext
	    );
	  },
	  count: function (children) {
	    var n = 0;
	    mapChildren(children, function () {
	      n++;
	    });
	    return n;
	  },
	  toArray: function (children) {
	    return (
	      mapChildren(children, function (child) {
	        return child;
	      }) || []
	    );
	  },
	  only: function (children) {
	    if (!isValidElement(children))
	      throw Error(
	        "React.Children.only expected to receive a single React element child."
	      );
	    return children;
	  }
	};
	react_production.Component = Component;
	react_production.Fragment = REACT_FRAGMENT_TYPE;
	react_production.Profiler = REACT_PROFILER_TYPE;
	react_production.PureComponent = PureComponent;
	react_production.StrictMode = REACT_STRICT_MODE_TYPE;
	react_production.Suspense = REACT_SUSPENSE_TYPE;
	react_production.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE =
	  ReactSharedInternals;
	react_production.act = function () {
	  throw Error("act(...) is not supported in production builds of React.");
	};
	react_production.cache = function (fn) {
	  return function () {
	    return fn.apply(null, arguments);
	  };
	};
	react_production.cloneElement = function (element, config, children) {
	  if (null === element || void 0 === element)
	    throw Error(
	      "The argument must be a React element, but you passed " + element + "."
	    );
	  var props = assign({}, element.props),
	    key = element.key,
	    owner = void 0;
	  if (null != config)
	    for (propName in (void 0 !== config.ref && (owner = void 0),
	    void 0 !== config.key && (key = "" + config.key),
	    config))
	      !hasOwnProperty.call(config, propName) ||
	        "key" === propName ||
	        "__self" === propName ||
	        "__source" === propName ||
	        ("ref" === propName && void 0 === config.ref) ||
	        (props[propName] = config[propName]);
	  var propName = arguments.length - 2;
	  if (1 === propName) props.children = children;
	  else if (1 < propName) {
	    for (var childArray = Array(propName), i = 0; i < propName; i++)
	      childArray[i] = arguments[i + 2];
	    props.children = childArray;
	  }
	  return ReactElement(element.type, key, void 0, void 0, owner, props);
	};
	react_production.createContext = function (defaultValue) {
	  defaultValue = {
	    $$typeof: REACT_CONTEXT_TYPE,
	    _currentValue: defaultValue,
	    _currentValue2: defaultValue,
	    _threadCount: 0,
	    Provider: null,
	    Consumer: null
	  };
	  defaultValue.Provider = defaultValue;
	  defaultValue.Consumer = {
	    $$typeof: REACT_CONSUMER_TYPE,
	    _context: defaultValue
	  };
	  return defaultValue;
	};
	react_production.createElement = function (type, config, children) {
	  var propName,
	    props = {},
	    key = null;
	  if (null != config)
	    for (propName in (void 0 !== config.key && (key = "" + config.key), config))
	      hasOwnProperty.call(config, propName) &&
	        "key" !== propName &&
	        "__self" !== propName &&
	        "__source" !== propName &&
	        (props[propName] = config[propName]);
	  var childrenLength = arguments.length - 2;
	  if (1 === childrenLength) props.children = children;
	  else if (1 < childrenLength) {
	    for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
	      childArray[i] = arguments[i + 2];
	    props.children = childArray;
	  }
	  if (type && type.defaultProps)
	    for (propName in ((childrenLength = type.defaultProps), childrenLength))
	      void 0 === props[propName] &&
	        (props[propName] = childrenLength[propName]);
	  return ReactElement(type, key, void 0, void 0, null, props);
	};
	react_production.createRef = function () {
	  return { current: null };
	};
	react_production.forwardRef = function (render) {
	  return { $$typeof: REACT_FORWARD_REF_TYPE, render: render };
	};
	react_production.isValidElement = isValidElement;
	react_production.lazy = function (ctor) {
	  return {
	    $$typeof: REACT_LAZY_TYPE,
	    _payload: { _status: -1, _result: ctor },
	    _init: lazyInitializer
	  };
	};
	react_production.memo = function (type, compare) {
	  return {
	    $$typeof: REACT_MEMO_TYPE,
	    type: type,
	    compare: void 0 === compare ? null : compare
	  };
	};
	react_production.startTransition = function (scope) {
	  var prevTransition = ReactSharedInternals.T,
	    currentTransition = {};
	  ReactSharedInternals.T = currentTransition;
	  try {
	    var returnValue = scope(),
	      onStartTransitionFinish = ReactSharedInternals.S;
	    null !== onStartTransitionFinish &&
	      onStartTransitionFinish(currentTransition, returnValue);
	    "object" === typeof returnValue &&
	      null !== returnValue &&
	      "function" === typeof returnValue.then &&
	      returnValue.then(noop, reportGlobalError);
	  } catch (error) {
	    reportGlobalError(error);
	  } finally {
	    ReactSharedInternals.T = prevTransition;
	  }
	};
	react_production.unstable_useCacheRefresh = function () {
	  return ReactSharedInternals.H.useCacheRefresh();
	};
	react_production.use = function (usable) {
	  return ReactSharedInternals.H.use(usable);
	};
	react_production.useActionState = function (action, initialState, permalink) {
	  return ReactSharedInternals.H.useActionState(action, initialState, permalink);
	};
	react_production.useCallback = function (callback, deps) {
	  return ReactSharedInternals.H.useCallback(callback, deps);
	};
	react_production.useContext = function (Context) {
	  return ReactSharedInternals.H.useContext(Context);
	};
	react_production.useDebugValue = function () {};
	react_production.useDeferredValue = function (value, initialValue) {
	  return ReactSharedInternals.H.useDeferredValue(value, initialValue);
	};
	react_production.useEffect = function (create, deps) {
	  return ReactSharedInternals.H.useEffect(create, deps);
	};
	react_production.useId = function () {
	  return ReactSharedInternals.H.useId();
	};
	react_production.useImperativeHandle = function (ref, create, deps) {
	  return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
	};
	react_production.useInsertionEffect = function (create, deps) {
	  return ReactSharedInternals.H.useInsertionEffect(create, deps);
	};
	react_production.useLayoutEffect = function (create, deps) {
	  return ReactSharedInternals.H.useLayoutEffect(create, deps);
	};
	react_production.useMemo = function (create, deps) {
	  return ReactSharedInternals.H.useMemo(create, deps);
	};
	react_production.useOptimistic = function (passthrough, reducer) {
	  return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
	};
	react_production.useReducer = function (reducer, initialArg, init) {
	  return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
	};
	react_production.useRef = function (initialValue) {
	  return ReactSharedInternals.H.useRef(initialValue);
	};
	react_production.useState = function (initialState) {
	  return ReactSharedInternals.H.useState(initialState);
	};
	react_production.useSyncExternalStore = function (
	  subscribe,
	  getSnapshot,
	  getServerSnapshot
	) {
	  return ReactSharedInternals.H.useSyncExternalStore(
	    subscribe,
	    getSnapshot,
	    getServerSnapshot
	  );
	};
	react_production.useTransition = function () {
	  return ReactSharedInternals.H.useTransition();
	};
	react_production.version = "19.0.0";
	return react_production;
}

var hasRequiredReact;

function requireReact () {
	if (hasRequiredReact) return react.exports;
	hasRequiredReact = 1;
	{
	  react.exports = requireReact_production();
	}
	return react.exports;
}

var reactDom = {exports: {}};

var reactDom_production = {};

/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactDom_production;

function requireReactDom_production () {
	if (hasRequiredReactDom_production) return reactDom_production;
	hasRequiredReactDom_production = 1;
	var React = requireReact();
	function formatProdErrorMessage(code) {
	  var url = "https://react.dev/errors/" + code;
	  if (1 < arguments.length) {
	    url += "?args[]=" + encodeURIComponent(arguments[1]);
	    for (var i = 2; i < arguments.length; i++)
	      url += "&args[]=" + encodeURIComponent(arguments[i]);
	  }
	  return (
	    "Minified React error #" +
	    code +
	    "; visit " +
	    url +
	    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
	  );
	}
	function noop() {}
	var Internals = {
	    d: {
	      f: noop,
	      r: function () {
	        throw Error(formatProdErrorMessage(522));
	      },
	      D: noop,
	      C: noop,
	      L: noop,
	      m: noop,
	      X: noop,
	      S: noop,
	      M: noop
	    },
	    p: 0,
	    findDOMNode: null
	  },
	  REACT_PORTAL_TYPE = Symbol.for("react.portal");
	function createPortal$1(children, containerInfo, implementation) {
	  var key =
	    3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
	  return {
	    $$typeof: REACT_PORTAL_TYPE,
	    key: null == key ? null : "" + key,
	    children: children,
	    containerInfo: containerInfo,
	    implementation: implementation
	  };
	}
	var ReactSharedInternals =
	  React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function getCrossOriginStringAs(as, input) {
	  if ("font" === as) return "";
	  if ("string" === typeof input)
	    return "use-credentials" === input ? input : "";
	}
	reactDom_production.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE =
	  Internals;
	reactDom_production.createPortal = function (children, container) {
	  var key =
	    2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
	  if (
	    !container ||
	    (1 !== container.nodeType &&
	      9 !== container.nodeType &&
	      11 !== container.nodeType)
	  )
	    throw Error(formatProdErrorMessage(299));
	  return createPortal$1(children, container, null, key);
	};
	reactDom_production.flushSync = function (fn) {
	  var previousTransition = ReactSharedInternals.T,
	    previousUpdatePriority = Internals.p;
	  try {
	    if (((ReactSharedInternals.T = null), (Internals.p = 2), fn)) return fn();
	  } finally {
	    (ReactSharedInternals.T = previousTransition),
	      (Internals.p = previousUpdatePriority),
	      Internals.d.f();
	  }
	};
	reactDom_production.preconnect = function (href, options) {
	  "string" === typeof href &&
	    (options
	      ? ((options = options.crossOrigin),
	        (options =
	          "string" === typeof options
	            ? "use-credentials" === options
	              ? options
	              : ""
	            : void 0))
	      : (options = null),
	    Internals.d.C(href, options));
	};
	reactDom_production.prefetchDNS = function (href) {
	  "string" === typeof href && Internals.d.D(href);
	};
	reactDom_production.preinit = function (href, options) {
	  if ("string" === typeof href && options && "string" === typeof options.as) {
	    var as = options.as,
	      crossOrigin = getCrossOriginStringAs(as, options.crossOrigin),
	      integrity =
	        "string" === typeof options.integrity ? options.integrity : void 0,
	      fetchPriority =
	        "string" === typeof options.fetchPriority
	          ? options.fetchPriority
	          : void 0;
	    "style" === as
	      ? Internals.d.S(
	          href,
	          "string" === typeof options.precedence ? options.precedence : void 0,
	          {
	            crossOrigin: crossOrigin,
	            integrity: integrity,
	            fetchPriority: fetchPriority
	          }
	        )
	      : "script" === as &&
	        Internals.d.X(href, {
	          crossOrigin: crossOrigin,
	          integrity: integrity,
	          fetchPriority: fetchPriority,
	          nonce: "string" === typeof options.nonce ? options.nonce : void 0
	        });
	  }
	};
	reactDom_production.preinitModule = function (href, options) {
	  if ("string" === typeof href)
	    if ("object" === typeof options && null !== options) {
	      if (null == options.as || "script" === options.as) {
	        var crossOrigin = getCrossOriginStringAs(
	          options.as,
	          options.crossOrigin
	        );
	        Internals.d.M(href, {
	          crossOrigin: crossOrigin,
	          integrity:
	            "string" === typeof options.integrity ? options.integrity : void 0,
	          nonce: "string" === typeof options.nonce ? options.nonce : void 0
	        });
	      }
	    } else null == options && Internals.d.M(href);
	};
	reactDom_production.preload = function (href, options) {
	  if (
	    "string" === typeof href &&
	    "object" === typeof options &&
	    null !== options &&
	    "string" === typeof options.as
	  ) {
	    var as = options.as,
	      crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
	    Internals.d.L(href, as, {
	      crossOrigin: crossOrigin,
	      integrity:
	        "string" === typeof options.integrity ? options.integrity : void 0,
	      nonce: "string" === typeof options.nonce ? options.nonce : void 0,
	      type: "string" === typeof options.type ? options.type : void 0,
	      fetchPriority:
	        "string" === typeof options.fetchPriority
	          ? options.fetchPriority
	          : void 0,
	      referrerPolicy:
	        "string" === typeof options.referrerPolicy
	          ? options.referrerPolicy
	          : void 0,
	      imageSrcSet:
	        "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
	      imageSizes:
	        "string" === typeof options.imageSizes ? options.imageSizes : void 0,
	      media: "string" === typeof options.media ? options.media : void 0
	    });
	  }
	};
	reactDom_production.preloadModule = function (href, options) {
	  if ("string" === typeof href)
	    if (options) {
	      var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
	      Internals.d.m(href, {
	        as:
	          "string" === typeof options.as && "script" !== options.as
	            ? options.as
	            : void 0,
	        crossOrigin: crossOrigin,
	        integrity:
	          "string" === typeof options.integrity ? options.integrity : void 0
	      });
	    } else Internals.d.m(href);
	};
	reactDom_production.requestFormReset = function (form) {
	  Internals.d.r(form);
	};
	reactDom_production.unstable_batchedUpdates = function (fn, a) {
	  return fn(a);
	};
	reactDom_production.useFormState = function (action, initialState, permalink) {
	  return ReactSharedInternals.H.useFormState(action, initialState, permalink);
	};
	reactDom_production.useFormStatus = function () {
	  return ReactSharedInternals.H.useHostTransitionStatus();
	};
	reactDom_production.version = "19.0.0";
	return reactDom_production;
}

var hasRequiredReactDom;

function requireReactDom () {
	if (hasRequiredReactDom) return reactDom.exports;
	hasRequiredReactDom = 1;
	function checkDCE() {
	  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
	    return;
	  }
	  try {
	    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
	  } catch (err) {
	    console.error(err);
	  }
	}
	{
	  checkDCE();
	  reactDom.exports = requireReactDom_production();
	}
	return reactDom.exports;
}

/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactDomClient_production;

function requireReactDomClient_production () {
	if (hasRequiredReactDomClient_production) return reactDomClient_production;
	hasRequiredReactDomClient_production = 1;
	var Scheduler = requireScheduler(),
	  React = requireReact(),
	  ReactDOM = requireReactDom();
	function formatProdErrorMessage(code) {
	  var url = "https://react.dev/errors/" + code;
	  if (1 < arguments.length) {
	    url += "?args[]=" + encodeURIComponent(arguments[1]);
	    for (var i = 2; i < arguments.length; i++)
	      url += "&args[]=" + encodeURIComponent(arguments[i]);
	  }
	  return (
	    "Minified React error #" +
	    code +
	    "; visit " +
	    url +
	    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
	  );
	}
	function isValidContainer(node) {
	  return !(
	    !node ||
	    (1 !== node.nodeType && 9 !== node.nodeType && 11 !== node.nodeType)
	  );
	}
	var REACT_LEGACY_ELEMENT_TYPE = Symbol.for("react.element"),
	  REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	  REACT_PORTAL_TYPE = Symbol.for("react.portal"),
	  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
	  REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"),
	  REACT_PROFILER_TYPE = Symbol.for("react.profiler"),
	  REACT_PROVIDER_TYPE = Symbol.for("react.provider"),
	  REACT_CONSUMER_TYPE = Symbol.for("react.consumer"),
	  REACT_CONTEXT_TYPE = Symbol.for("react.context"),
	  REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
	  REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
	  REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"),
	  REACT_MEMO_TYPE = Symbol.for("react.memo"),
	  REACT_LAZY_TYPE = Symbol.for("react.lazy");
	var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
	var REACT_MEMO_CACHE_SENTINEL = Symbol.for("react.memo_cache_sentinel"),
	  MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
	  if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
	  maybeIterable =
	    (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
	    maybeIterable["@@iterator"];
	  return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
	function getComponentNameFromType(type) {
	  if (null == type) return null;
	  if ("function" === typeof type)
	    return type.$$typeof === REACT_CLIENT_REFERENCE
	      ? null
	      : type.displayName || type.name || null;
	  if ("string" === typeof type) return type;
	  switch (type) {
	    case REACT_FRAGMENT_TYPE:
	      return "Fragment";
	    case REACT_PORTAL_TYPE:
	      return "Portal";
	    case REACT_PROFILER_TYPE:
	      return "Profiler";
	    case REACT_STRICT_MODE_TYPE:
	      return "StrictMode";
	    case REACT_SUSPENSE_TYPE:
	      return "Suspense";
	    case REACT_SUSPENSE_LIST_TYPE:
	      return "SuspenseList";
	  }
	  if ("object" === typeof type)
	    switch (type.$$typeof) {
	      case REACT_CONTEXT_TYPE:
	        return (type.displayName || "Context") + ".Provider";
	      case REACT_CONSUMER_TYPE:
	        return (type._context.displayName || "Context") + ".Consumer";
	      case REACT_FORWARD_REF_TYPE:
	        var innerType = type.render;
	        type = type.displayName;
	        type ||
	          ((type = innerType.displayName || innerType.name || ""),
	          (type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef"));
	        return type;
	      case REACT_MEMO_TYPE:
	        return (
	          (innerType = type.displayName || null),
	          null !== innerType
	            ? innerType
	            : getComponentNameFromType(type.type) || "Memo"
	        );
	      case REACT_LAZY_TYPE:
	        innerType = type._payload;
	        type = type._init;
	        try {
	          return getComponentNameFromType(type(innerType));
	        } catch (x) {}
	    }
	  return null;
	}
	var ReactSharedInternals =
	    React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
	  assign = Object.assign,
	  prefix,
	  suffix;
	function describeBuiltInComponentFrame(name) {
	  if (void 0 === prefix)
	    try {
	      throw Error();
	    } catch (x) {
	      var match = x.stack.trim().match(/\n( *(at )?)/);
	      prefix = (match && match[1]) || "";
	      suffix =
	        -1 < x.stack.indexOf("\n    at")
	          ? " (<anonymous>)"
	          : -1 < x.stack.indexOf("@")
	            ? "@unknown:0:0"
	            : "";
	    }
	  return "\n" + prefix + name + suffix;
	}
	var reentry = false;
	function describeNativeComponentFrame(fn, construct) {
	  if (!fn || reentry) return "";
	  reentry = true;
	  var previousPrepareStackTrace = Error.prepareStackTrace;
	  Error.prepareStackTrace = void 0;
	  try {
	    var RunInRootFrame = {
	      DetermineComponentFrameRoot: function () {
	        try {
	          if (construct) {
	            var Fake = function () {
	              throw Error();
	            };
	            Object.defineProperty(Fake.prototype, "props", {
	              set: function () {
	                throw Error();
	              }
	            });
	            if ("object" === typeof Reflect && Reflect.construct) {
	              try {
	                Reflect.construct(Fake, []);
	              } catch (x) {
	                var control = x;
	              }
	              Reflect.construct(fn, [], Fake);
	            } else {
	              try {
	                Fake.call();
	              } catch (x$0) {
	                control = x$0;
	              }
	              fn.call(Fake.prototype);
	            }
	          } else {
	            try {
	              throw Error();
	            } catch (x$1) {
	              control = x$1;
	            }
	            (Fake = fn()) &&
	              "function" === typeof Fake.catch &&
	              Fake.catch(function () {});
	          }
	        } catch (sample) {
	          if (sample && control && "string" === typeof sample.stack)
	            return [sample.stack, control.stack];
	        }
	        return [null, null];
	      }
	    };
	    RunInRootFrame.DetermineComponentFrameRoot.displayName =
	      "DetermineComponentFrameRoot";
	    var namePropDescriptor = Object.getOwnPropertyDescriptor(
	      RunInRootFrame.DetermineComponentFrameRoot,
	      "name"
	    );
	    namePropDescriptor &&
	      namePropDescriptor.configurable &&
	      Object.defineProperty(
	        RunInRootFrame.DetermineComponentFrameRoot,
	        "name",
	        { value: "DetermineComponentFrameRoot" }
	      );
	    var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(),
	      sampleStack = _RunInRootFrame$Deter[0],
	      controlStack = _RunInRootFrame$Deter[1];
	    if (sampleStack && controlStack) {
	      var sampleLines = sampleStack.split("\n"),
	        controlLines = controlStack.split("\n");
	      for (
	        namePropDescriptor = RunInRootFrame = 0;
	        RunInRootFrame < sampleLines.length &&
	        !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot");

	      )
	        RunInRootFrame++;
	      for (
	        ;
	        namePropDescriptor < controlLines.length &&
	        !controlLines[namePropDescriptor].includes(
	          "DetermineComponentFrameRoot"
	        );

	      )
	        namePropDescriptor++;
	      if (
	        RunInRootFrame === sampleLines.length ||
	        namePropDescriptor === controlLines.length
	      )
	        for (
	          RunInRootFrame = sampleLines.length - 1,
	            namePropDescriptor = controlLines.length - 1;
	          1 <= RunInRootFrame &&
	          0 <= namePropDescriptor &&
	          sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor];

	        )
	          namePropDescriptor--;
	      for (
	        ;
	        1 <= RunInRootFrame && 0 <= namePropDescriptor;
	        RunInRootFrame--, namePropDescriptor--
	      )
	        if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
	          if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
	            do
	              if (
	                (RunInRootFrame--,
	                namePropDescriptor--,
	                0 > namePropDescriptor ||
	                  sampleLines[RunInRootFrame] !==
	                    controlLines[namePropDescriptor])
	              ) {
	                var frame =
	                  "\n" +
	                  sampleLines[RunInRootFrame].replace(" at new ", " at ");
	                fn.displayName &&
	                  frame.includes("<anonymous>") &&
	                  (frame = frame.replace("<anonymous>", fn.displayName));
	                return frame;
	              }
	            while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
	          }
	          break;
	        }
	    }
	  } finally {
	    (reentry = false), (Error.prepareStackTrace = previousPrepareStackTrace);
	  }
	  return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "")
	    ? describeBuiltInComponentFrame(previousPrepareStackTrace)
	    : "";
	}
	function describeFiber(fiber) {
	  switch (fiber.tag) {
	    case 26:
	    case 27:
	    case 5:
	      return describeBuiltInComponentFrame(fiber.type);
	    case 16:
	      return describeBuiltInComponentFrame("Lazy");
	    case 13:
	      return describeBuiltInComponentFrame("Suspense");
	    case 19:
	      return describeBuiltInComponentFrame("SuspenseList");
	    case 0:
	    case 15:
	      return (fiber = describeNativeComponentFrame(fiber.type, false)), fiber;
	    case 11:
	      return (
	        (fiber = describeNativeComponentFrame(fiber.type.render, false)), fiber
	      );
	    case 1:
	      return (fiber = describeNativeComponentFrame(fiber.type, true)), fiber;
	    default:
	      return "";
	  }
	}
	function getStackByFiberInDevAndProd(workInProgress) {
	  try {
	    var info = "";
	    do
	      (info += describeFiber(workInProgress)),
	        (workInProgress = workInProgress.return);
	    while (workInProgress);
	    return info;
	  } catch (x) {
	    return "\nError generating stack: " + x.message + "\n" + x.stack;
	  }
	}
	function getNearestMountedFiber(fiber) {
	  var node = fiber,
	    nearestMounted = fiber;
	  if (fiber.alternate) for (; node.return; ) node = node.return;
	  else {
	    fiber = node;
	    do
	      (node = fiber),
	        0 !== (node.flags & 4098) && (nearestMounted = node.return),
	        (fiber = node.return);
	    while (fiber);
	  }
	  return 3 === node.tag ? nearestMounted : null;
	}
	function getSuspenseInstanceFromFiber(fiber) {
	  if (13 === fiber.tag) {
	    var suspenseState = fiber.memoizedState;
	    null === suspenseState &&
	      ((fiber = fiber.alternate),
	      null !== fiber && (suspenseState = fiber.memoizedState));
	    if (null !== suspenseState) return suspenseState.dehydrated;
	  }
	  return null;
	}
	function assertIsMounted(fiber) {
	  if (getNearestMountedFiber(fiber) !== fiber)
	    throw Error(formatProdErrorMessage(188));
	}
	function findCurrentFiberUsingSlowPath(fiber) {
	  var alternate = fiber.alternate;
	  if (!alternate) {
	    alternate = getNearestMountedFiber(fiber);
	    if (null === alternate) throw Error(formatProdErrorMessage(188));
	    return alternate !== fiber ? null : fiber;
	  }
	  for (var a = fiber, b = alternate; ; ) {
	    var parentA = a.return;
	    if (null === parentA) break;
	    var parentB = parentA.alternate;
	    if (null === parentB) {
	      b = parentA.return;
	      if (null !== b) {
	        a = b;
	        continue;
	      }
	      break;
	    }
	    if (parentA.child === parentB.child) {
	      for (parentB = parentA.child; parentB; ) {
	        if (parentB === a) return assertIsMounted(parentA), fiber;
	        if (parentB === b) return assertIsMounted(parentA), alternate;
	        parentB = parentB.sibling;
	      }
	      throw Error(formatProdErrorMessage(188));
	    }
	    if (a.return !== b.return) (a = parentA), (b = parentB);
	    else {
	      for (var didFindChild = false, child$2 = parentA.child; child$2; ) {
	        if (child$2 === a) {
	          didFindChild = true;
	          a = parentA;
	          b = parentB;
	          break;
	        }
	        if (child$2 === b) {
	          didFindChild = true;
	          b = parentA;
	          a = parentB;
	          break;
	        }
	        child$2 = child$2.sibling;
	      }
	      if (!didFindChild) {
	        for (child$2 = parentB.child; child$2; ) {
	          if (child$2 === a) {
	            didFindChild = true;
	            a = parentB;
	            b = parentA;
	            break;
	          }
	          if (child$2 === b) {
	            didFindChild = true;
	            b = parentB;
	            a = parentA;
	            break;
	          }
	          child$2 = child$2.sibling;
	        }
	        if (!didFindChild) throw Error(formatProdErrorMessage(189));
	      }
	    }
	    if (a.alternate !== b) throw Error(formatProdErrorMessage(190));
	  }
	  if (3 !== a.tag) throw Error(formatProdErrorMessage(188));
	  return a.stateNode.current === a ? fiber : alternate;
	}
	function findCurrentHostFiberImpl(node) {
	  var tag = node.tag;
	  if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return node;
	  for (node = node.child; null !== node; ) {
	    tag = findCurrentHostFiberImpl(node);
	    if (null !== tag) return tag;
	    node = node.sibling;
	  }
	  return null;
	}
	var isArrayImpl = Array.isArray,
	  ReactDOMSharedInternals =
	    ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
	  sharedNotPendingObject = {
	    pending: false,
	    data: null,
	    method: null,
	    action: null
	  },
	  valueStack = [],
	  index = -1;
	function createCursor(defaultValue) {
	  return { current: defaultValue };
	}
	function pop(cursor) {
	  0 > index ||
	    ((cursor.current = valueStack[index]), (valueStack[index] = null), index--);
	}
	function push(cursor, value) {
	  index++;
	  valueStack[index] = cursor.current;
	  cursor.current = value;
	}
	var contextStackCursor = createCursor(null),
	  contextFiberStackCursor = createCursor(null),
	  rootInstanceStackCursor = createCursor(null),
	  hostTransitionProviderCursor = createCursor(null);
	function pushHostContainer(fiber, nextRootInstance) {
	  push(rootInstanceStackCursor, nextRootInstance);
	  push(contextFiberStackCursor, fiber);
	  push(contextStackCursor, null);
	  fiber = nextRootInstance.nodeType;
	  switch (fiber) {
	    case 9:
	    case 11:
	      nextRootInstance = (nextRootInstance = nextRootInstance.documentElement)
	        ? (nextRootInstance = nextRootInstance.namespaceURI)
	          ? getOwnHostContext(nextRootInstance)
	          : 0
	        : 0;
	      break;
	    default:
	      if (
	        ((fiber = 8 === fiber ? nextRootInstance.parentNode : nextRootInstance),
	        (nextRootInstance = fiber.tagName),
	        (fiber = fiber.namespaceURI))
	      )
	        (fiber = getOwnHostContext(fiber)),
	          (nextRootInstance = getChildHostContextProd(fiber, nextRootInstance));
	      else
	        switch (nextRootInstance) {
	          case "svg":
	            nextRootInstance = 1;
	            break;
	          case "math":
	            nextRootInstance = 2;
	            break;
	          default:
	            nextRootInstance = 0;
	        }
	  }
	  pop(contextStackCursor);
	  push(contextStackCursor, nextRootInstance);
	}
	function popHostContainer() {
	  pop(contextStackCursor);
	  pop(contextFiberStackCursor);
	  pop(rootInstanceStackCursor);
	}
	function pushHostContext(fiber) {
	  null !== fiber.memoizedState && push(hostTransitionProviderCursor, fiber);
	  var context = contextStackCursor.current;
	  var JSCompiler_inline_result = getChildHostContextProd(context, fiber.type);
	  context !== JSCompiler_inline_result &&
	    (push(contextFiberStackCursor, fiber),
	    push(contextStackCursor, JSCompiler_inline_result));
	}
	function popHostContext(fiber) {
	  contextFiberStackCursor.current === fiber &&
	    (pop(contextStackCursor), pop(contextFiberStackCursor));
	  hostTransitionProviderCursor.current === fiber &&
	    (pop(hostTransitionProviderCursor),
	    (HostTransitionContext._currentValue = sharedNotPendingObject));
	}
	var hasOwnProperty = Object.prototype.hasOwnProperty,
	  scheduleCallback$3 = Scheduler.unstable_scheduleCallback,
	  cancelCallback$1 = Scheduler.unstable_cancelCallback,
	  shouldYield = Scheduler.unstable_shouldYield,
	  requestPaint = Scheduler.unstable_requestPaint,
	  now = Scheduler.unstable_now,
	  getCurrentPriorityLevel = Scheduler.unstable_getCurrentPriorityLevel,
	  ImmediatePriority = Scheduler.unstable_ImmediatePriority,
	  UserBlockingPriority = Scheduler.unstable_UserBlockingPriority,
	  NormalPriority$1 = Scheduler.unstable_NormalPriority,
	  LowPriority = Scheduler.unstable_LowPriority,
	  IdlePriority = Scheduler.unstable_IdlePriority,
	  log$1 = Scheduler.log,
	  unstable_setDisableYieldValue = Scheduler.unstable_setDisableYieldValue,
	  rendererID = null,
	  injectedHook = null;
	function onCommitRoot(root) {
	  if (injectedHook && "function" === typeof injectedHook.onCommitFiberRoot)
	    try {
	      injectedHook.onCommitFiberRoot(
	        rendererID,
	        root,
	        void 0,
	        128 === (root.current.flags & 128)
	      );
	    } catch (err) {}
	}
	function setIsStrictModeForDevtools(newIsStrictMode) {
	  "function" === typeof log$1 && unstable_setDisableYieldValue(newIsStrictMode);
	  if (injectedHook && "function" === typeof injectedHook.setStrictMode)
	    try {
	      injectedHook.setStrictMode(rendererID, newIsStrictMode);
	    } catch (err) {}
	}
	var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback,
	  log = Math.log,
	  LN2 = Math.LN2;
	function clz32Fallback(x) {
	  x >>>= 0;
	  return 0 === x ? 32 : (31 - ((log(x) / LN2) | 0)) | 0;
	}
	var nextTransitionLane = 128,
	  nextRetryLane = 4194304;
	function getHighestPriorityLanes(lanes) {
	  var pendingSyncLanes = lanes & 42;
	  if (0 !== pendingSyncLanes) return pendingSyncLanes;
	  switch (lanes & -lanes) {
	    case 1:
	      return 1;
	    case 2:
	      return 2;
	    case 4:
	      return 4;
	    case 8:
	      return 8;
	    case 16:
	      return 16;
	    case 32:
	      return 32;
	    case 64:
	      return 64;
	    case 128:
	    case 256:
	    case 512:
	    case 1024:
	    case 2048:
	    case 4096:
	    case 8192:
	    case 16384:
	    case 32768:
	    case 65536:
	    case 131072:
	    case 262144:
	    case 524288:
	    case 1048576:
	    case 2097152:
	      return lanes & 4194176;
	    case 4194304:
	    case 8388608:
	    case 16777216:
	    case 33554432:
	      return lanes & 62914560;
	    case 67108864:
	      return 67108864;
	    case 134217728:
	      return 134217728;
	    case 268435456:
	      return 268435456;
	    case 536870912:
	      return 536870912;
	    case 1073741824:
	      return 0;
	    default:
	      return lanes;
	  }
	}
	function getNextLanes(root, wipLanes) {
	  var pendingLanes = root.pendingLanes;
	  if (0 === pendingLanes) return 0;
	  var nextLanes = 0,
	    suspendedLanes = root.suspendedLanes,
	    pingedLanes = root.pingedLanes,
	    warmLanes = root.warmLanes;
	  root = 0 !== root.finishedLanes;
	  var nonIdlePendingLanes = pendingLanes & 134217727;
	  0 !== nonIdlePendingLanes
	    ? ((pendingLanes = nonIdlePendingLanes & ~suspendedLanes),
	      0 !== pendingLanes
	        ? (nextLanes = getHighestPriorityLanes(pendingLanes))
	        : ((pingedLanes &= nonIdlePendingLanes),
	          0 !== pingedLanes
	            ? (nextLanes = getHighestPriorityLanes(pingedLanes))
	            : root ||
	              ((warmLanes = nonIdlePendingLanes & ~warmLanes),
	              0 !== warmLanes &&
	                (nextLanes = getHighestPriorityLanes(warmLanes)))))
	    : ((nonIdlePendingLanes = pendingLanes & ~suspendedLanes),
	      0 !== nonIdlePendingLanes
	        ? (nextLanes = getHighestPriorityLanes(nonIdlePendingLanes))
	        : 0 !== pingedLanes
	          ? (nextLanes = getHighestPriorityLanes(pingedLanes))
	          : root ||
	            ((warmLanes = pendingLanes & ~warmLanes),
	            0 !== warmLanes &&
	              (nextLanes = getHighestPriorityLanes(warmLanes))));
	  return 0 === nextLanes
	    ? 0
	    : 0 !== wipLanes &&
	        wipLanes !== nextLanes &&
	        0 === (wipLanes & suspendedLanes) &&
	        ((suspendedLanes = nextLanes & -nextLanes),
	        (warmLanes = wipLanes & -wipLanes),
	        suspendedLanes >= warmLanes ||
	          (32 === suspendedLanes && 0 !== (warmLanes & 4194176)))
	      ? wipLanes
	      : nextLanes;
	}
	function checkIfRootIsPrerendering(root, renderLanes) {
	  return (
	    0 ===
	    (root.pendingLanes &
	      ~(root.suspendedLanes & ~root.pingedLanes) &
	      renderLanes)
	  );
	}
	function computeExpirationTime(lane, currentTime) {
	  switch (lane) {
	    case 1:
	    case 2:
	    case 4:
	    case 8:
	      return currentTime + 250;
	    case 16:
	    case 32:
	    case 64:
	    case 128:
	    case 256:
	    case 512:
	    case 1024:
	    case 2048:
	    case 4096:
	    case 8192:
	    case 16384:
	    case 32768:
	    case 65536:
	    case 131072:
	    case 262144:
	    case 524288:
	    case 1048576:
	    case 2097152:
	      return currentTime + 5e3;
	    case 4194304:
	    case 8388608:
	    case 16777216:
	    case 33554432:
	      return -1;
	    case 67108864:
	    case 134217728:
	    case 268435456:
	    case 536870912:
	    case 1073741824:
	      return -1;
	    default:
	      return -1;
	  }
	}
	function claimNextTransitionLane() {
	  var lane = nextTransitionLane;
	  nextTransitionLane <<= 1;
	  0 === (nextTransitionLane & 4194176) && (nextTransitionLane = 128);
	  return lane;
	}
	function claimNextRetryLane() {
	  var lane = nextRetryLane;
	  nextRetryLane <<= 1;
	  0 === (nextRetryLane & 62914560) && (nextRetryLane = 4194304);
	  return lane;
	}
	function createLaneMap(initial) {
	  for (var laneMap = [], i = 0; 31 > i; i++) laneMap.push(initial);
	  return laneMap;
	}
	function markRootUpdated$1(root, updateLane) {
	  root.pendingLanes |= updateLane;
	  268435456 !== updateLane &&
	    ((root.suspendedLanes = 0), (root.pingedLanes = 0), (root.warmLanes = 0));
	}
	function markRootFinished(
	  root,
	  finishedLanes,
	  remainingLanes,
	  spawnedLane,
	  updatedLanes,
	  suspendedRetryLanes
	) {
	  var previouslyPendingLanes = root.pendingLanes;
	  root.pendingLanes = remainingLanes;
	  root.suspendedLanes = 0;
	  root.pingedLanes = 0;
	  root.warmLanes = 0;
	  root.expiredLanes &= remainingLanes;
	  root.entangledLanes &= remainingLanes;
	  root.errorRecoveryDisabledLanes &= remainingLanes;
	  root.shellSuspendCounter = 0;
	  var entanglements = root.entanglements,
	    expirationTimes = root.expirationTimes,
	    hiddenUpdates = root.hiddenUpdates;
	  for (
	    remainingLanes = previouslyPendingLanes & ~remainingLanes;
	    0 < remainingLanes;

	  ) {
	    var index$7 = 31 - clz32(remainingLanes),
	      lane = 1 << index$7;
	    entanglements[index$7] = 0;
	    expirationTimes[index$7] = -1;
	    var hiddenUpdatesForLane = hiddenUpdates[index$7];
	    if (null !== hiddenUpdatesForLane)
	      for (
	        hiddenUpdates[index$7] = null, index$7 = 0;
	        index$7 < hiddenUpdatesForLane.length;
	        index$7++
	      ) {
	        var update = hiddenUpdatesForLane[index$7];
	        null !== update && (update.lane &= -536870913);
	      }
	    remainingLanes &= ~lane;
	  }
	  0 !== spawnedLane && markSpawnedDeferredLane(root, spawnedLane, 0);
	  0 !== suspendedRetryLanes &&
	    0 === updatedLanes &&
	    0 !== root.tag &&
	    (root.suspendedLanes |=
	      suspendedRetryLanes & ~(previouslyPendingLanes & ~finishedLanes));
	}
	function markSpawnedDeferredLane(root, spawnedLane, entangledLanes) {
	  root.pendingLanes |= spawnedLane;
	  root.suspendedLanes &= ~spawnedLane;
	  var spawnedLaneIndex = 31 - clz32(spawnedLane);
	  root.entangledLanes |= spawnedLane;
	  root.entanglements[spawnedLaneIndex] =
	    root.entanglements[spawnedLaneIndex] |
	    1073741824 |
	    (entangledLanes & 4194218);
	}
	function markRootEntangled(root, entangledLanes) {
	  var rootEntangledLanes = (root.entangledLanes |= entangledLanes);
	  for (root = root.entanglements; rootEntangledLanes; ) {
	    var index$8 = 31 - clz32(rootEntangledLanes),
	      lane = 1 << index$8;
	    (lane & entangledLanes) | (root[index$8] & entangledLanes) &&
	      (root[index$8] |= entangledLanes);
	    rootEntangledLanes &= ~lane;
	  }
	}
	function lanesToEventPriority(lanes) {
	  lanes &= -lanes;
	  return 2 < lanes
	    ? 8 < lanes
	      ? 0 !== (lanes & 134217727)
	        ? 32
	        : 268435456
	      : 8
	    : 2;
	}
	function resolveUpdatePriority() {
	  var updatePriority = ReactDOMSharedInternals.p;
	  if (0 !== updatePriority) return updatePriority;
	  updatePriority = window.event;
	  return void 0 === updatePriority ? 32 : getEventPriority(updatePriority.type);
	}
	function runWithPriority(priority, fn) {
	  var previousPriority = ReactDOMSharedInternals.p;
	  try {
	    return (ReactDOMSharedInternals.p = priority), fn();
	  } finally {
	    ReactDOMSharedInternals.p = previousPriority;
	  }
	}
	var randomKey = Math.random().toString(36).slice(2),
	  internalInstanceKey = "__reactFiber$" + randomKey,
	  internalPropsKey = "__reactProps$" + randomKey,
	  internalContainerInstanceKey = "__reactContainer$" + randomKey,
	  internalEventHandlersKey = "__reactEvents$" + randomKey,
	  internalEventHandlerListenersKey = "__reactListeners$" + randomKey,
	  internalEventHandlesSetKey = "__reactHandles$" + randomKey,
	  internalRootNodeResourcesKey = "__reactResources$" + randomKey,
	  internalHoistableMarker = "__reactMarker$" + randomKey;
	function detachDeletedInstance(node) {
	  delete node[internalInstanceKey];
	  delete node[internalPropsKey];
	  delete node[internalEventHandlersKey];
	  delete node[internalEventHandlerListenersKey];
	  delete node[internalEventHandlesSetKey];
	}
	function getClosestInstanceFromNode(targetNode) {
	  var targetInst = targetNode[internalInstanceKey];
	  if (targetInst) return targetInst;
	  for (var parentNode = targetNode.parentNode; parentNode; ) {
	    if (
	      (targetInst =
	        parentNode[internalContainerInstanceKey] ||
	        parentNode[internalInstanceKey])
	    ) {
	      parentNode = targetInst.alternate;
	      if (
	        null !== targetInst.child ||
	        (null !== parentNode && null !== parentNode.child)
	      )
	        for (
	          targetNode = getParentSuspenseInstance(targetNode);
	          null !== targetNode;

	        ) {
	          if ((parentNode = targetNode[internalInstanceKey])) return parentNode;
	          targetNode = getParentSuspenseInstance(targetNode);
	        }
	      return targetInst;
	    }
	    targetNode = parentNode;
	    parentNode = targetNode.parentNode;
	  }
	  return null;
	}
	function getInstanceFromNode(node) {
	  if (
	    (node = node[internalInstanceKey] || node[internalContainerInstanceKey])
	  ) {
	    var tag = node.tag;
	    if (
	      5 === tag ||
	      6 === tag ||
	      13 === tag ||
	      26 === tag ||
	      27 === tag ||
	      3 === tag
	    )
	      return node;
	  }
	  return null;
	}
	function getNodeFromInstance(inst) {
	  var tag = inst.tag;
	  if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return inst.stateNode;
	  throw Error(formatProdErrorMessage(33));
	}
	function getResourcesFromRoot(root) {
	  var resources = root[internalRootNodeResourcesKey];
	  resources ||
	    (resources = root[internalRootNodeResourcesKey] =
	      { hoistableStyles: new Map(), hoistableScripts: new Map() });
	  return resources;
	}
	function markNodeAsHoistable(node) {
	  node[internalHoistableMarker] = true;
	}
	var allNativeEvents = new Set(),
	  registrationNameDependencies = {};
	function registerTwoPhaseEvent(registrationName, dependencies) {
	  registerDirectEvent(registrationName, dependencies);
	  registerDirectEvent(registrationName + "Capture", dependencies);
	}
	function registerDirectEvent(registrationName, dependencies) {
	  registrationNameDependencies[registrationName] = dependencies;
	  for (
	    registrationName = 0;
	    registrationName < dependencies.length;
	    registrationName++
	  )
	    allNativeEvents.add(dependencies[registrationName]);
	}
	var canUseDOM = !(
	    "undefined" === typeof window ||
	    "undefined" === typeof window.document ||
	    "undefined" === typeof window.document.createElement
	  ),
	  VALID_ATTRIBUTE_NAME_REGEX = RegExp(
	    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
	  ),
	  illegalAttributeNameCache = {},
	  validatedAttributeNameCache = {};
	function isAttributeNameSafe(attributeName) {
	  if (hasOwnProperty.call(validatedAttributeNameCache, attributeName))
	    return true;
	  if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return false;
	  if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName))
	    return (validatedAttributeNameCache[attributeName] = true);
	  illegalAttributeNameCache[attributeName] = true;
	  return false;
	}
	function setValueForAttribute(node, name, value) {
	  if (isAttributeNameSafe(name))
	    if (null === value) node.removeAttribute(name);
	    else {
	      switch (typeof value) {
	        case "undefined":
	        case "function":
	        case "symbol":
	          node.removeAttribute(name);
	          return;
	        case "boolean":
	          var prefix$10 = name.toLowerCase().slice(0, 5);
	          if ("data-" !== prefix$10 && "aria-" !== prefix$10) {
	            node.removeAttribute(name);
	            return;
	          }
	      }
	      node.setAttribute(name, "" + value);
	    }
	}
	function setValueForKnownAttribute(node, name, value) {
	  if (null === value) node.removeAttribute(name);
	  else {
	    switch (typeof value) {
	      case "undefined":
	      case "function":
	      case "symbol":
	      case "boolean":
	        node.removeAttribute(name);
	        return;
	    }
	    node.setAttribute(name, "" + value);
	  }
	}
	function setValueForNamespacedAttribute(node, namespace, name, value) {
	  if (null === value) node.removeAttribute(name);
	  else {
	    switch (typeof value) {
	      case "undefined":
	      case "function":
	      case "symbol":
	      case "boolean":
	        node.removeAttribute(name);
	        return;
	    }
	    node.setAttributeNS(namespace, name, "" + value);
	  }
	}
	function getToStringValue(value) {
	  switch (typeof value) {
	    case "bigint":
	    case "boolean":
	    case "number":
	    case "string":
	    case "undefined":
	      return value;
	    case "object":
	      return value;
	    default:
	      return "";
	  }
	}
	function isCheckable(elem) {
	  var type = elem.type;
	  return (
	    (elem = elem.nodeName) &&
	    "input" === elem.toLowerCase() &&
	    ("checkbox" === type || "radio" === type)
	  );
	}
	function trackValueOnNode(node) {
	  var valueField = isCheckable(node) ? "checked" : "value",
	    descriptor = Object.getOwnPropertyDescriptor(
	      node.constructor.prototype,
	      valueField
	    ),
	    currentValue = "" + node[valueField];
	  if (
	    !node.hasOwnProperty(valueField) &&
	    "undefined" !== typeof descriptor &&
	    "function" === typeof descriptor.get &&
	    "function" === typeof descriptor.set
	  ) {
	    var get = descriptor.get,
	      set = descriptor.set;
	    Object.defineProperty(node, valueField, {
	      configurable: true,
	      get: function () {
	        return get.call(this);
	      },
	      set: function (value) {
	        currentValue = "" + value;
	        set.call(this, value);
	      }
	    });
	    Object.defineProperty(node, valueField, {
	      enumerable: descriptor.enumerable
	    });
	    return {
	      getValue: function () {
	        return currentValue;
	      },
	      setValue: function (value) {
	        currentValue = "" + value;
	      },
	      stopTracking: function () {
	        node._valueTracker = null;
	        delete node[valueField];
	      }
	    };
	  }
	}
	function track(node) {
	  node._valueTracker || (node._valueTracker = trackValueOnNode(node));
	}
	function updateValueIfChanged(node) {
	  if (!node) return false;
	  var tracker = node._valueTracker;
	  if (!tracker) return true;
	  var lastValue = tracker.getValue();
	  var value = "";
	  node &&
	    (value = isCheckable(node)
	      ? node.checked
	        ? "true"
	        : "false"
	      : node.value);
	  node = value;
	  return node !== lastValue ? (tracker.setValue(node), true) : false;
	}
	function getActiveElement(doc) {
	  doc = doc || ("undefined" !== typeof document ? document : void 0);
	  if ("undefined" === typeof doc) return null;
	  try {
	    return doc.activeElement || doc.body;
	  } catch (e) {
	    return doc.body;
	  }
	}
	var escapeSelectorAttributeValueInsideDoubleQuotesRegex = /[\n"\\]/g;
	function escapeSelectorAttributeValueInsideDoubleQuotes(value) {
	  return value.replace(
	    escapeSelectorAttributeValueInsideDoubleQuotesRegex,
	    function (ch) {
	      return "\\" + ch.charCodeAt(0).toString(16) + " ";
	    }
	  );
	}
	function updateInput(
	  element,
	  value,
	  defaultValue,
	  lastDefaultValue,
	  checked,
	  defaultChecked,
	  type,
	  name
	) {
	  element.name = "";
	  null != type &&
	  "function" !== typeof type &&
	  "symbol" !== typeof type &&
	  "boolean" !== typeof type
	    ? (element.type = type)
	    : element.removeAttribute("type");
	  if (null != value)
	    if ("number" === type) {
	      if ((0 === value && "" === element.value) || element.value != value)
	        element.value = "" + getToStringValue(value);
	    } else
	      element.value !== "" + getToStringValue(value) &&
	        (element.value = "" + getToStringValue(value));
	  else
	    ("submit" !== type && "reset" !== type) || element.removeAttribute("value");
	  null != value
	    ? setDefaultValue(element, type, getToStringValue(value))
	    : null != defaultValue
	      ? setDefaultValue(element, type, getToStringValue(defaultValue))
	      : null != lastDefaultValue && element.removeAttribute("value");
	  null == checked &&
	    null != defaultChecked &&
	    (element.defaultChecked = !!defaultChecked);
	  null != checked &&
	    (element.checked =
	      checked && "function" !== typeof checked && "symbol" !== typeof checked);
	  null != name &&
	  "function" !== typeof name &&
	  "symbol" !== typeof name &&
	  "boolean" !== typeof name
	    ? (element.name = "" + getToStringValue(name))
	    : element.removeAttribute("name");
	}
	function initInput(
	  element,
	  value,
	  defaultValue,
	  checked,
	  defaultChecked,
	  type,
	  name,
	  isHydrating
	) {
	  null != type &&
	    "function" !== typeof type &&
	    "symbol" !== typeof type &&
	    "boolean" !== typeof type &&
	    (element.type = type);
	  if (null != value || null != defaultValue) {
	    if (
	      !(
	        ("submit" !== type && "reset" !== type) ||
	        (void 0 !== value && null !== value)
	      )
	    )
	      return;
	    defaultValue =
	      null != defaultValue ? "" + getToStringValue(defaultValue) : "";
	    value = null != value ? "" + getToStringValue(value) : defaultValue;
	    isHydrating || value === element.value || (element.value = value);
	    element.defaultValue = value;
	  }
	  checked = null != checked ? checked : defaultChecked;
	  checked =
	    "function" !== typeof checked && "symbol" !== typeof checked && !!checked;
	  element.checked = isHydrating ? element.checked : !!checked;
	  element.defaultChecked = !!checked;
	  null != name &&
	    "function" !== typeof name &&
	    "symbol" !== typeof name &&
	    "boolean" !== typeof name &&
	    (element.name = name);
	}
	function setDefaultValue(node, type, value) {
	  ("number" === type && getActiveElement(node.ownerDocument) === node) ||
	    node.defaultValue === "" + value ||
	    (node.defaultValue = "" + value);
	}
	function updateOptions(node, multiple, propValue, setDefaultSelected) {
	  node = node.options;
	  if (multiple) {
	    multiple = {};
	    for (var i = 0; i < propValue.length; i++)
	      multiple["$" + propValue[i]] = true;
	    for (propValue = 0; propValue < node.length; propValue++)
	      (i = multiple.hasOwnProperty("$" + node[propValue].value)),
	        node[propValue].selected !== i && (node[propValue].selected = i),
	        i && setDefaultSelected && (node[propValue].defaultSelected = true);
	  } else {
	    propValue = "" + getToStringValue(propValue);
	    multiple = null;
	    for (i = 0; i < node.length; i++) {
	      if (node[i].value === propValue) {
	        node[i].selected = true;
	        setDefaultSelected && (node[i].defaultSelected = true);
	        return;
	      }
	      null !== multiple || node[i].disabled || (multiple = node[i]);
	    }
	    null !== multiple && (multiple.selected = true);
	  }
	}
	function updateTextarea(element, value, defaultValue) {
	  if (
	    null != value &&
	    ((value = "" + getToStringValue(value)),
	    value !== element.value && (element.value = value),
	    null == defaultValue)
	  ) {
	    element.defaultValue !== value && (element.defaultValue = value);
	    return;
	  }
	  element.defaultValue =
	    null != defaultValue ? "" + getToStringValue(defaultValue) : "";
	}
	function initTextarea(element, value, defaultValue, children) {
	  if (null == value) {
	    if (null != children) {
	      if (null != defaultValue) throw Error(formatProdErrorMessage(92));
	      if (isArrayImpl(children)) {
	        if (1 < children.length) throw Error(formatProdErrorMessage(93));
	        children = children[0];
	      }
	      defaultValue = children;
	    }
	    null == defaultValue && (defaultValue = "");
	    value = defaultValue;
	  }
	  defaultValue = getToStringValue(value);
	  element.defaultValue = defaultValue;
	  children = element.textContent;
	  children === defaultValue &&
	    "" !== children &&
	    null !== children &&
	    (element.value = children);
	}
	function setTextContent(node, text) {
	  if (text) {
	    var firstChild = node.firstChild;
	    if (
	      firstChild &&
	      firstChild === node.lastChild &&
	      3 === firstChild.nodeType
	    ) {
	      firstChild.nodeValue = text;
	      return;
	    }
	  }
	  node.textContent = text;
	}
	var unitlessNumbers = new Set(
	  "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
	    " "
	  )
	);
	function setValueForStyle(style, styleName, value) {
	  var isCustomProperty = 0 === styleName.indexOf("--");
	  null == value || "boolean" === typeof value || "" === value
	    ? isCustomProperty
	      ? style.setProperty(styleName, "")
	      : "float" === styleName
	        ? (style.cssFloat = "")
	        : (style[styleName] = "")
	    : isCustomProperty
	      ? style.setProperty(styleName, value)
	      : "number" !== typeof value ||
	          0 === value ||
	          unitlessNumbers.has(styleName)
	        ? "float" === styleName
	          ? (style.cssFloat = value)
	          : (style[styleName] = ("" + value).trim())
	        : (style[styleName] = value + "px");
	}
	function setValueForStyles(node, styles, prevStyles) {
	  if (null != styles && "object" !== typeof styles)
	    throw Error(formatProdErrorMessage(62));
	  node = node.style;
	  if (null != prevStyles) {
	    for (var styleName in prevStyles)
	      !prevStyles.hasOwnProperty(styleName) ||
	        (null != styles && styles.hasOwnProperty(styleName)) ||
	        (0 === styleName.indexOf("--")
	          ? node.setProperty(styleName, "")
	          : "float" === styleName
	            ? (node.cssFloat = "")
	            : (node[styleName] = ""));
	    for (var styleName$16 in styles)
	      (styleName = styles[styleName$16]),
	        styles.hasOwnProperty(styleName$16) &&
	          prevStyles[styleName$16] !== styleName &&
	          setValueForStyle(node, styleName$16, styleName);
	  } else
	    for (var styleName$17 in styles)
	      styles.hasOwnProperty(styleName$17) &&
	        setValueForStyle(node, styleName$17, styles[styleName$17]);
	}
	function isCustomElement(tagName) {
	  if (-1 === tagName.indexOf("-")) return false;
	  switch (tagName) {
	    case "annotation-xml":
	    case "color-profile":
	    case "font-face":
	    case "font-face-src":
	    case "font-face-uri":
	    case "font-face-format":
	    case "font-face-name":
	    case "missing-glyph":
	      return false;
	    default:
	      return true;
	  }
	}
	var aliases = new Map([
	    ["acceptCharset", "accept-charset"],
	    ["htmlFor", "for"],
	    ["httpEquiv", "http-equiv"],
	    ["crossOrigin", "crossorigin"],
	    ["accentHeight", "accent-height"],
	    ["alignmentBaseline", "alignment-baseline"],
	    ["arabicForm", "arabic-form"],
	    ["baselineShift", "baseline-shift"],
	    ["capHeight", "cap-height"],
	    ["clipPath", "clip-path"],
	    ["clipRule", "clip-rule"],
	    ["colorInterpolation", "color-interpolation"],
	    ["colorInterpolationFilters", "color-interpolation-filters"],
	    ["colorProfile", "color-profile"],
	    ["colorRendering", "color-rendering"],
	    ["dominantBaseline", "dominant-baseline"],
	    ["enableBackground", "enable-background"],
	    ["fillOpacity", "fill-opacity"],
	    ["fillRule", "fill-rule"],
	    ["floodColor", "flood-color"],
	    ["floodOpacity", "flood-opacity"],
	    ["fontFamily", "font-family"],
	    ["fontSize", "font-size"],
	    ["fontSizeAdjust", "font-size-adjust"],
	    ["fontStretch", "font-stretch"],
	    ["fontStyle", "font-style"],
	    ["fontVariant", "font-variant"],
	    ["fontWeight", "font-weight"],
	    ["glyphName", "glyph-name"],
	    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
	    ["glyphOrientationVertical", "glyph-orientation-vertical"],
	    ["horizAdvX", "horiz-adv-x"],
	    ["horizOriginX", "horiz-origin-x"],
	    ["imageRendering", "image-rendering"],
	    ["letterSpacing", "letter-spacing"],
	    ["lightingColor", "lighting-color"],
	    ["markerEnd", "marker-end"],
	    ["markerMid", "marker-mid"],
	    ["markerStart", "marker-start"],
	    ["overlinePosition", "overline-position"],
	    ["overlineThickness", "overline-thickness"],
	    ["paintOrder", "paint-order"],
	    ["panose-1", "panose-1"],
	    ["pointerEvents", "pointer-events"],
	    ["renderingIntent", "rendering-intent"],
	    ["shapeRendering", "shape-rendering"],
	    ["stopColor", "stop-color"],
	    ["stopOpacity", "stop-opacity"],
	    ["strikethroughPosition", "strikethrough-position"],
	    ["strikethroughThickness", "strikethrough-thickness"],
	    ["strokeDasharray", "stroke-dasharray"],
	    ["strokeDashoffset", "stroke-dashoffset"],
	    ["strokeLinecap", "stroke-linecap"],
	    ["strokeLinejoin", "stroke-linejoin"],
	    ["strokeMiterlimit", "stroke-miterlimit"],
	    ["strokeOpacity", "stroke-opacity"],
	    ["strokeWidth", "stroke-width"],
	    ["textAnchor", "text-anchor"],
	    ["textDecoration", "text-decoration"],
	    ["textRendering", "text-rendering"],
	    ["transformOrigin", "transform-origin"],
	    ["underlinePosition", "underline-position"],
	    ["underlineThickness", "underline-thickness"],
	    ["unicodeBidi", "unicode-bidi"],
	    ["unicodeRange", "unicode-range"],
	    ["unitsPerEm", "units-per-em"],
	    ["vAlphabetic", "v-alphabetic"],
	    ["vHanging", "v-hanging"],
	    ["vIdeographic", "v-ideographic"],
	    ["vMathematical", "v-mathematical"],
	    ["vectorEffect", "vector-effect"],
	    ["vertAdvY", "vert-adv-y"],
	    ["vertOriginX", "vert-origin-x"],
	    ["vertOriginY", "vert-origin-y"],
	    ["wordSpacing", "word-spacing"],
	    ["writingMode", "writing-mode"],
	    ["xmlnsXlink", "xmlns:xlink"],
	    ["xHeight", "x-height"]
	  ]),
	  isJavaScriptProtocol =
	    /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function sanitizeURL(url) {
	  return isJavaScriptProtocol.test("" + url)
	    ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
	    : url;
	}
	var currentReplayingEvent = null;
	function getEventTarget(nativeEvent) {
	  nativeEvent = nativeEvent.target || nativeEvent.srcElement || window;
	  nativeEvent.correspondingUseElement &&
	    (nativeEvent = nativeEvent.correspondingUseElement);
	  return 3 === nativeEvent.nodeType ? nativeEvent.parentNode : nativeEvent;
	}
	var restoreTarget = null,
	  restoreQueue = null;
	function restoreStateOfTarget(target) {
	  var internalInstance = getInstanceFromNode(target);
	  if (internalInstance && (target = internalInstance.stateNode)) {
	    var props = target[internalPropsKey] || null;
	    a: switch (((target = internalInstance.stateNode), internalInstance.type)) {
	      case "input":
	        updateInput(
	          target,
	          props.value,
	          props.defaultValue,
	          props.defaultValue,
	          props.checked,
	          props.defaultChecked,
	          props.type,
	          props.name
	        );
	        internalInstance = props.name;
	        if ("radio" === props.type && null != internalInstance) {
	          for (props = target; props.parentNode; ) props = props.parentNode;
	          props = props.querySelectorAll(
	            'input[name="' +
	              escapeSelectorAttributeValueInsideDoubleQuotes(
	                "" + internalInstance
	              ) +
	              '"][type="radio"]'
	          );
	          for (
	            internalInstance = 0;
	            internalInstance < props.length;
	            internalInstance++
	          ) {
	            var otherNode = props[internalInstance];
	            if (otherNode !== target && otherNode.form === target.form) {
	              var otherProps = otherNode[internalPropsKey] || null;
	              if (!otherProps) throw Error(formatProdErrorMessage(90));
	              updateInput(
	                otherNode,
	                otherProps.value,
	                otherProps.defaultValue,
	                otherProps.defaultValue,
	                otherProps.checked,
	                otherProps.defaultChecked,
	                otherProps.type,
	                otherProps.name
	              );
	            }
	          }
	          for (
	            internalInstance = 0;
	            internalInstance < props.length;
	            internalInstance++
	          )
	            (otherNode = props[internalInstance]),
	              otherNode.form === target.form && updateValueIfChanged(otherNode);
	        }
	        break a;
	      case "textarea":
	        updateTextarea(target, props.value, props.defaultValue);
	        break a;
	      case "select":
	        (internalInstance = props.value),
	          null != internalInstance &&
	            updateOptions(target, !!props.multiple, internalInstance, false);
	    }
	  }
	}
	var isInsideEventHandler = false;
	function batchedUpdates$1(fn, a, b) {
	  if (isInsideEventHandler) return fn(a, b);
	  isInsideEventHandler = true;
	  try {
	    var JSCompiler_inline_result = fn(a);
	    return JSCompiler_inline_result;
	  } finally {
	    if (
	      ((isInsideEventHandler = false),
	      null !== restoreTarget || null !== restoreQueue)
	    )
	      if (
	        (flushSyncWork$1(),
	        restoreTarget &&
	          ((a = restoreTarget),
	          (fn = restoreQueue),
	          (restoreQueue = restoreTarget = null),
	          restoreStateOfTarget(a),
	          fn))
	      )
	        for (a = 0; a < fn.length; a++) restoreStateOfTarget(fn[a]);
	  }
	}
	function getListener(inst, registrationName) {
	  var stateNode = inst.stateNode;
	  if (null === stateNode) return null;
	  var props = stateNode[internalPropsKey] || null;
	  if (null === props) return null;
	  stateNode = props[registrationName];
	  a: switch (registrationName) {
	    case "onClick":
	    case "onClickCapture":
	    case "onDoubleClick":
	    case "onDoubleClickCapture":
	    case "onMouseDown":
	    case "onMouseDownCapture":
	    case "onMouseMove":
	    case "onMouseMoveCapture":
	    case "onMouseUp":
	    case "onMouseUpCapture":
	    case "onMouseEnter":
	      (props = !props.disabled) ||
	        ((inst = inst.type),
	        (props = !(
	          "button" === inst ||
	          "input" === inst ||
	          "select" === inst ||
	          "textarea" === inst
	        )));
	      inst = !props;
	      break a;
	    default:
	      inst = false;
	  }
	  if (inst) return null;
	  if (stateNode && "function" !== typeof stateNode)
	    throw Error(
	      formatProdErrorMessage(231, registrationName, typeof stateNode)
	    );
	  return stateNode;
	}
	var passiveBrowserEventsSupported = false;
	if (canUseDOM)
	  try {
	    var options = {};
	    Object.defineProperty(options, "passive", {
	      get: function () {
	        passiveBrowserEventsSupported = !0;
	      }
	    });
	    window.addEventListener("test", options, options);
	    window.removeEventListener("test", options, options);
	  } catch (e) {
	    passiveBrowserEventsSupported = false;
	  }
	var root = null,
	  startText = null,
	  fallbackText = null;
	function getData() {
	  if (fallbackText) return fallbackText;
	  var start,
	    startValue = startText,
	    startLength = startValue.length,
	    end,
	    endValue = "value" in root ? root.value : root.textContent,
	    endLength = endValue.length;
	  for (
	    start = 0;
	    start < startLength && startValue[start] === endValue[start];
	    start++
	  );
	  var minEnd = startLength - start;
	  for (
	    end = 1;
	    end <= minEnd &&
	    startValue[startLength - end] === endValue[endLength - end];
	    end++
	  );
	  return (fallbackText = endValue.slice(start, 1 < end ? 1 - end : void 0));
	}
	function getEventCharCode(nativeEvent) {
	  var keyCode = nativeEvent.keyCode;
	  "charCode" in nativeEvent
	    ? ((nativeEvent = nativeEvent.charCode),
	      0 === nativeEvent && 13 === keyCode && (nativeEvent = 13))
	    : (nativeEvent = keyCode);
	  10 === nativeEvent && (nativeEvent = 13);
	  return 32 <= nativeEvent || 13 === nativeEvent ? nativeEvent : 0;
	}
	function functionThatReturnsTrue() {
	  return true;
	}
	function functionThatReturnsFalse() {
	  return false;
	}
	function createSyntheticEvent(Interface) {
	  function SyntheticBaseEvent(
	    reactName,
	    reactEventType,
	    targetInst,
	    nativeEvent,
	    nativeEventTarget
	  ) {
	    this._reactName = reactName;
	    this._targetInst = targetInst;
	    this.type = reactEventType;
	    this.nativeEvent = nativeEvent;
	    this.target = nativeEventTarget;
	    this.currentTarget = null;
	    for (var propName in Interface)
	      Interface.hasOwnProperty(propName) &&
	        ((reactName = Interface[propName]),
	        (this[propName] = reactName
	          ? reactName(nativeEvent)
	          : nativeEvent[propName]));
	    this.isDefaultPrevented = (
	      null != nativeEvent.defaultPrevented
	        ? nativeEvent.defaultPrevented
	        : false === nativeEvent.returnValue
	    )
	      ? functionThatReturnsTrue
	      : functionThatReturnsFalse;
	    this.isPropagationStopped = functionThatReturnsFalse;
	    return this;
	  }
	  assign(SyntheticBaseEvent.prototype, {
	    preventDefault: function () {
	      this.defaultPrevented = true;
	      var event = this.nativeEvent;
	      event &&
	        (event.preventDefault
	          ? event.preventDefault()
	          : "unknown" !== typeof event.returnValue && (event.returnValue = false),
	        (this.isDefaultPrevented = functionThatReturnsTrue));
	    },
	    stopPropagation: function () {
	      var event = this.nativeEvent;
	      event &&
	        (event.stopPropagation
	          ? event.stopPropagation()
	          : "unknown" !== typeof event.cancelBubble &&
	            (event.cancelBubble = true),
	        (this.isPropagationStopped = functionThatReturnsTrue));
	    },
	    persist: function () {},
	    isPersistent: functionThatReturnsTrue
	  });
	  return SyntheticBaseEvent;
	}
	var EventInterface = {
	    eventPhase: 0,
	    bubbles: 0,
	    cancelable: 0,
	    timeStamp: function (event) {
	      return event.timeStamp || Date.now();
	    },
	    defaultPrevented: 0,
	    isTrusted: 0
	  },
	  SyntheticEvent = createSyntheticEvent(EventInterface),
	  UIEventInterface = assign({}, EventInterface, { view: 0, detail: 0 }),
	  SyntheticUIEvent = createSyntheticEvent(UIEventInterface),
	  lastMovementX,
	  lastMovementY,
	  lastMouseEvent,
	  MouseEventInterface = assign({}, UIEventInterface, {
	    screenX: 0,
	    screenY: 0,
	    clientX: 0,
	    clientY: 0,
	    pageX: 0,
	    pageY: 0,
	    ctrlKey: 0,
	    shiftKey: 0,
	    altKey: 0,
	    metaKey: 0,
	    getModifierState: getEventModifierState,
	    button: 0,
	    buttons: 0,
	    relatedTarget: function (event) {
	      return void 0 === event.relatedTarget
	        ? event.fromElement === event.srcElement
	          ? event.toElement
	          : event.fromElement
	        : event.relatedTarget;
	    },
	    movementX: function (event) {
	      if ("movementX" in event) return event.movementX;
	      event !== lastMouseEvent &&
	        (lastMouseEvent && "mousemove" === event.type
	          ? ((lastMovementX = event.screenX - lastMouseEvent.screenX),
	            (lastMovementY = event.screenY - lastMouseEvent.screenY))
	          : (lastMovementY = lastMovementX = 0),
	        (lastMouseEvent = event));
	      return lastMovementX;
	    },
	    movementY: function (event) {
	      return "movementY" in event ? event.movementY : lastMovementY;
	    }
	  }),
	  SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface),
	  DragEventInterface = assign({}, MouseEventInterface, { dataTransfer: 0 }),
	  SyntheticDragEvent = createSyntheticEvent(DragEventInterface),
	  FocusEventInterface = assign({}, UIEventInterface, { relatedTarget: 0 }),
	  SyntheticFocusEvent = createSyntheticEvent(FocusEventInterface),
	  AnimationEventInterface = assign({}, EventInterface, {
	    animationName: 0,
	    elapsedTime: 0,
	    pseudoElement: 0
	  }),
	  SyntheticAnimationEvent = createSyntheticEvent(AnimationEventInterface),
	  ClipboardEventInterface = assign({}, EventInterface, {
	    clipboardData: function (event) {
	      return "clipboardData" in event
	        ? event.clipboardData
	        : window.clipboardData;
	    }
	  }),
	  SyntheticClipboardEvent = createSyntheticEvent(ClipboardEventInterface),
	  CompositionEventInterface = assign({}, EventInterface, { data: 0 }),
	  SyntheticCompositionEvent = createSyntheticEvent(CompositionEventInterface),
	  normalizeKey = {
	    Esc: "Escape",
	    Spacebar: " ",
	    Left: "ArrowLeft",
	    Up: "ArrowUp",
	    Right: "ArrowRight",
	    Down: "ArrowDown",
	    Del: "Delete",
	    Win: "OS",
	    Menu: "ContextMenu",
	    Apps: "ContextMenu",
	    Scroll: "ScrollLock",
	    MozPrintableKey: "Unidentified"
	  },
	  translateToKey = {
	    8: "Backspace",
	    9: "Tab",
	    12: "Clear",
	    13: "Enter",
	    16: "Shift",
	    17: "Control",
	    18: "Alt",
	    19: "Pause",
	    20: "CapsLock",
	    27: "Escape",
	    32: " ",
	    33: "PageUp",
	    34: "PageDown",
	    35: "End",
	    36: "Home",
	    37: "ArrowLeft",
	    38: "ArrowUp",
	    39: "ArrowRight",
	    40: "ArrowDown",
	    45: "Insert",
	    46: "Delete",
	    112: "F1",
	    113: "F2",
	    114: "F3",
	    115: "F4",
	    116: "F5",
	    117: "F6",
	    118: "F7",
	    119: "F8",
	    120: "F9",
	    121: "F10",
	    122: "F11",
	    123: "F12",
	    144: "NumLock",
	    145: "ScrollLock",
	    224: "Meta"
	  },
	  modifierKeyToProp = {
	    Alt: "altKey",
	    Control: "ctrlKey",
	    Meta: "metaKey",
	    Shift: "shiftKey"
	  };
	function modifierStateGetter(keyArg) {
	  var nativeEvent = this.nativeEvent;
	  return nativeEvent.getModifierState
	    ? nativeEvent.getModifierState(keyArg)
	    : (keyArg = modifierKeyToProp[keyArg])
	      ? !!nativeEvent[keyArg]
	      : false;
	}
	function getEventModifierState() {
	  return modifierStateGetter;
	}
	var KeyboardEventInterface = assign({}, UIEventInterface, {
	    key: function (nativeEvent) {
	      if (nativeEvent.key) {
	        var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
	        if ("Unidentified" !== key) return key;
	      }
	      return "keypress" === nativeEvent.type
	        ? ((nativeEvent = getEventCharCode(nativeEvent)),
	          13 === nativeEvent ? "Enter" : String.fromCharCode(nativeEvent))
	        : "keydown" === nativeEvent.type || "keyup" === nativeEvent.type
	          ? translateToKey[nativeEvent.keyCode] || "Unidentified"
	          : "";
	    },
	    code: 0,
	    location: 0,
	    ctrlKey: 0,
	    shiftKey: 0,
	    altKey: 0,
	    metaKey: 0,
	    repeat: 0,
	    locale: 0,
	    getModifierState: getEventModifierState,
	    charCode: function (event) {
	      return "keypress" === event.type ? getEventCharCode(event) : 0;
	    },
	    keyCode: function (event) {
	      return "keydown" === event.type || "keyup" === event.type
	        ? event.keyCode
	        : 0;
	    },
	    which: function (event) {
	      return "keypress" === event.type
	        ? getEventCharCode(event)
	        : "keydown" === event.type || "keyup" === event.type
	          ? event.keyCode
	          : 0;
	    }
	  }),
	  SyntheticKeyboardEvent = createSyntheticEvent(KeyboardEventInterface),
	  PointerEventInterface = assign({}, MouseEventInterface, {
	    pointerId: 0,
	    width: 0,
	    height: 0,
	    pressure: 0,
	    tangentialPressure: 0,
	    tiltX: 0,
	    tiltY: 0,
	    twist: 0,
	    pointerType: 0,
	    isPrimary: 0
	  }),
	  SyntheticPointerEvent = createSyntheticEvent(PointerEventInterface),
	  TouchEventInterface = assign({}, UIEventInterface, {
	    touches: 0,
	    targetTouches: 0,
	    changedTouches: 0,
	    altKey: 0,
	    metaKey: 0,
	    ctrlKey: 0,
	    shiftKey: 0,
	    getModifierState: getEventModifierState
	  }),
	  SyntheticTouchEvent = createSyntheticEvent(TouchEventInterface),
	  TransitionEventInterface = assign({}, EventInterface, {
	    propertyName: 0,
	    elapsedTime: 0,
	    pseudoElement: 0
	  }),
	  SyntheticTransitionEvent = createSyntheticEvent(TransitionEventInterface),
	  WheelEventInterface = assign({}, MouseEventInterface, {
	    deltaX: function (event) {
	      return "deltaX" in event
	        ? event.deltaX
	        : "wheelDeltaX" in event
	          ? -event.wheelDeltaX
	          : 0;
	    },
	    deltaY: function (event) {
	      return "deltaY" in event
	        ? event.deltaY
	        : "wheelDeltaY" in event
	          ? -event.wheelDeltaY
	          : "wheelDelta" in event
	            ? -event.wheelDelta
	            : 0;
	    },
	    deltaZ: 0,
	    deltaMode: 0
	  }),
	  SyntheticWheelEvent = createSyntheticEvent(WheelEventInterface),
	  ToggleEventInterface = assign({}, EventInterface, {
	    newState: 0,
	    oldState: 0
	  }),
	  SyntheticToggleEvent = createSyntheticEvent(ToggleEventInterface),
	  END_KEYCODES = [9, 13, 27, 32],
	  canUseCompositionEvent = canUseDOM && "CompositionEvent" in window,
	  documentMode = null;
	canUseDOM &&
	  "documentMode" in document &&
	  (documentMode = document.documentMode);
	var canUseTextInputEvent = canUseDOM && "TextEvent" in window && !documentMode,
	  useFallbackCompositionData =
	    canUseDOM &&
	    (!canUseCompositionEvent ||
	      (documentMode && 8 < documentMode && 11 >= documentMode)),
	  SPACEBAR_CHAR = String.fromCharCode(32),
	  hasSpaceKeypress = false;
	function isFallbackCompositionEnd(domEventName, nativeEvent) {
	  switch (domEventName) {
	    case "keyup":
	      return -1 !== END_KEYCODES.indexOf(nativeEvent.keyCode);
	    case "keydown":
	      return 229 !== nativeEvent.keyCode;
	    case "keypress":
	    case "mousedown":
	    case "focusout":
	      return true;
	    default:
	      return false;
	  }
	}
	function getDataFromCustomEvent(nativeEvent) {
	  nativeEvent = nativeEvent.detail;
	  return "object" === typeof nativeEvent && "data" in nativeEvent
	    ? nativeEvent.data
	    : null;
	}
	var isComposing = false;
	function getNativeBeforeInputChars(domEventName, nativeEvent) {
	  switch (domEventName) {
	    case "compositionend":
	      return getDataFromCustomEvent(nativeEvent);
	    case "keypress":
	      if (32 !== nativeEvent.which) return null;
	      hasSpaceKeypress = true;
	      return SPACEBAR_CHAR;
	    case "textInput":
	      return (
	        (domEventName = nativeEvent.data),
	        domEventName === SPACEBAR_CHAR && hasSpaceKeypress ? null : domEventName
	      );
	    default:
	      return null;
	  }
	}
	function getFallbackBeforeInputChars(domEventName, nativeEvent) {
	  if (isComposing)
	    return "compositionend" === domEventName ||
	      (!canUseCompositionEvent &&
	        isFallbackCompositionEnd(domEventName, nativeEvent))
	      ? ((domEventName = getData()),
	        (fallbackText = startText = root = null),
	        (isComposing = false),
	        domEventName)
	      : null;
	  switch (domEventName) {
	    case "paste":
	      return null;
	    case "keypress":
	      if (
	        !(nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) ||
	        (nativeEvent.ctrlKey && nativeEvent.altKey)
	      ) {
	        if (nativeEvent.char && 1 < nativeEvent.char.length)
	          return nativeEvent.char;
	        if (nativeEvent.which) return String.fromCharCode(nativeEvent.which);
	      }
	      return null;
	    case "compositionend":
	      return useFallbackCompositionData && "ko" !== nativeEvent.locale
	        ? null
	        : nativeEvent.data;
	    default:
	      return null;
	  }
	}
	var supportedInputTypes = {
	  color: true,
	  date: true,
	  datetime: true,
	  "datetime-local": true,
	  email: true,
	  month: true,
	  number: true,
	  password: true,
	  range: true,
	  search: true,
	  tel: true,
	  text: true,
	  time: true,
	  url: true,
	  week: true
	};
	function isTextInputElement(elem) {
	  var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
	  return "input" === nodeName
	    ? !!supportedInputTypes[elem.type]
	    : "textarea" === nodeName
	      ? true
	      : false;
	}
	function createAndAccumulateChangeEvent(
	  dispatchQueue,
	  inst,
	  nativeEvent,
	  target
	) {
	  restoreTarget
	    ? restoreQueue
	      ? restoreQueue.push(target)
	      : (restoreQueue = [target])
	    : (restoreTarget = target);
	  inst = accumulateTwoPhaseListeners(inst, "onChange");
	  0 < inst.length &&
	    ((nativeEvent = new SyntheticEvent(
	      "onChange",
	      "change",
	      null,
	      nativeEvent,
	      target
	    )),
	    dispatchQueue.push({ event: nativeEvent, listeners: inst }));
	}
	var activeElement$1 = null,
	  activeElementInst$1 = null;
	function runEventInBatch(dispatchQueue) {
	  processDispatchQueue(dispatchQueue, 0);
	}
	function getInstIfValueChanged(targetInst) {
	  var targetNode = getNodeFromInstance(targetInst);
	  if (updateValueIfChanged(targetNode)) return targetInst;
	}
	function getTargetInstForChangeEvent(domEventName, targetInst) {
	  if ("change" === domEventName) return targetInst;
	}
	var isInputEventSupported = false;
	if (canUseDOM) {
	  var JSCompiler_inline_result$jscomp$283;
	  if (canUseDOM) {
	    var isSupported$jscomp$inline_418 = "oninput" in document;
	    if (!isSupported$jscomp$inline_418) {
	      var element$jscomp$inline_419 = document.createElement("div");
	      element$jscomp$inline_419.setAttribute("oninput", "return;");
	      isSupported$jscomp$inline_418 =
	        "function" === typeof element$jscomp$inline_419.oninput;
	    }
	    JSCompiler_inline_result$jscomp$283 = isSupported$jscomp$inline_418;
	  } else JSCompiler_inline_result$jscomp$283 = false;
	  isInputEventSupported =
	    JSCompiler_inline_result$jscomp$283 &&
	    (!document.documentMode || 9 < document.documentMode);
	}
	function stopWatchingForValueChange() {
	  activeElement$1 &&
	    (activeElement$1.detachEvent("onpropertychange", handlePropertyChange),
	    (activeElementInst$1 = activeElement$1 = null));
	}
	function handlePropertyChange(nativeEvent) {
	  if (
	    "value" === nativeEvent.propertyName &&
	    getInstIfValueChanged(activeElementInst$1)
	  ) {
	    var dispatchQueue = [];
	    createAndAccumulateChangeEvent(
	      dispatchQueue,
	      activeElementInst$1,
	      nativeEvent,
	      getEventTarget(nativeEvent)
	    );
	    batchedUpdates$1(runEventInBatch, dispatchQueue);
	  }
	}
	function handleEventsForInputEventPolyfill(domEventName, target, targetInst) {
	  "focusin" === domEventName
	    ? (stopWatchingForValueChange(),
	      (activeElement$1 = target),
	      (activeElementInst$1 = targetInst),
	      activeElement$1.attachEvent("onpropertychange", handlePropertyChange))
	    : "focusout" === domEventName && stopWatchingForValueChange();
	}
	function getTargetInstForInputEventPolyfill(domEventName) {
	  if (
	    "selectionchange" === domEventName ||
	    "keyup" === domEventName ||
	    "keydown" === domEventName
	  )
	    return getInstIfValueChanged(activeElementInst$1);
	}
	function getTargetInstForClickEvent(domEventName, targetInst) {
	  if ("click" === domEventName) return getInstIfValueChanged(targetInst);
	}
	function getTargetInstForInputOrChangeEvent(domEventName, targetInst) {
	  if ("input" === domEventName || "change" === domEventName)
	    return getInstIfValueChanged(targetInst);
	}
	function is(x, y) {
	  return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y);
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is;
	function shallowEqual(objA, objB) {
	  if (objectIs(objA, objB)) return true;
	  if (
	    "object" !== typeof objA ||
	    null === objA ||
	    "object" !== typeof objB ||
	    null === objB
	  )
	    return false;
	  var keysA = Object.keys(objA),
	    keysB = Object.keys(objB);
	  if (keysA.length !== keysB.length) return false;
	  for (keysB = 0; keysB < keysA.length; keysB++) {
	    var currentKey = keysA[keysB];
	    if (
	      !hasOwnProperty.call(objB, currentKey) ||
	      !objectIs(objA[currentKey], objB[currentKey])
	    )
	      return false;
	  }
	  return true;
	}
	function getLeafNode(node) {
	  for (; node && node.firstChild; ) node = node.firstChild;
	  return node;
	}
	function getNodeForCharacterOffset(root, offset) {
	  var node = getLeafNode(root);
	  root = 0;
	  for (var nodeEnd; node; ) {
	    if (3 === node.nodeType) {
	      nodeEnd = root + node.textContent.length;
	      if (root <= offset && nodeEnd >= offset)
	        return { node: node, offset: offset - root };
	      root = nodeEnd;
	    }
	    a: {
	      for (; node; ) {
	        if (node.nextSibling) {
	          node = node.nextSibling;
	          break a;
	        }
	        node = node.parentNode;
	      }
	      node = void 0;
	    }
	    node = getLeafNode(node);
	  }
	}
	function containsNode(outerNode, innerNode) {
	  return outerNode && innerNode
	    ? outerNode === innerNode
	      ? true
	      : outerNode && 3 === outerNode.nodeType
	        ? false
	        : innerNode && 3 === innerNode.nodeType
	          ? containsNode(outerNode, innerNode.parentNode)
	          : "contains" in outerNode
	            ? outerNode.contains(innerNode)
	            : outerNode.compareDocumentPosition
	              ? !!(outerNode.compareDocumentPosition(innerNode) & 16)
	              : false
	    : false;
	}
	function getActiveElementDeep(containerInfo) {
	  containerInfo =
	    null != containerInfo &&
	    null != containerInfo.ownerDocument &&
	    null != containerInfo.ownerDocument.defaultView
	      ? containerInfo.ownerDocument.defaultView
	      : window;
	  for (
	    var element = getActiveElement(containerInfo.document);
	    element instanceof containerInfo.HTMLIFrameElement;

	  ) {
	    try {
	      var JSCompiler_inline_result =
	        "string" === typeof element.contentWindow.location.href;
	    } catch (err) {
	      JSCompiler_inline_result = false;
	    }
	    if (JSCompiler_inline_result) containerInfo = element.contentWindow;
	    else break;
	    element = getActiveElement(containerInfo.document);
	  }
	  return element;
	}
	function hasSelectionCapabilities(elem) {
	  var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
	  return (
	    nodeName &&
	    (("input" === nodeName &&
	      ("text" === elem.type ||
	        "search" === elem.type ||
	        "tel" === elem.type ||
	        "url" === elem.type ||
	        "password" === elem.type)) ||
	      "textarea" === nodeName ||
	      "true" === elem.contentEditable)
	  );
	}
	function restoreSelection(priorSelectionInformation, containerInfo) {
	  var curFocusedElem = getActiveElementDeep(containerInfo);
	  containerInfo = priorSelectionInformation.focusedElem;
	  var priorSelectionRange = priorSelectionInformation.selectionRange;
	  if (
	    curFocusedElem !== containerInfo &&
	    containerInfo &&
	    containerInfo.ownerDocument &&
	    containsNode(containerInfo.ownerDocument.documentElement, containerInfo)
	  ) {
	    if (null !== priorSelectionRange && hasSelectionCapabilities(containerInfo))
	      if (
	        ((priorSelectionInformation = priorSelectionRange.start),
	        (curFocusedElem = priorSelectionRange.end),
	        void 0 === curFocusedElem &&
	          (curFocusedElem = priorSelectionInformation),
	        "selectionStart" in containerInfo)
	      )
	        (containerInfo.selectionStart = priorSelectionInformation),
	          (containerInfo.selectionEnd = Math.min(
	            curFocusedElem,
	            containerInfo.value.length
	          ));
	      else if (
	        ((curFocusedElem =
	          ((priorSelectionInformation =
	            containerInfo.ownerDocument || document) &&
	            priorSelectionInformation.defaultView) ||
	          window),
	        curFocusedElem.getSelection)
	      ) {
	        curFocusedElem = curFocusedElem.getSelection();
	        var length = containerInfo.textContent.length,
	          start = Math.min(priorSelectionRange.start, length);
	        priorSelectionRange =
	          void 0 === priorSelectionRange.end
	            ? start
	            : Math.min(priorSelectionRange.end, length);
	        !curFocusedElem.extend &&
	          start > priorSelectionRange &&
	          ((length = priorSelectionRange),
	          (priorSelectionRange = start),
	          (start = length));
	        length = getNodeForCharacterOffset(containerInfo, start);
	        var endMarker = getNodeForCharacterOffset(
	          containerInfo,
	          priorSelectionRange
	        );
	        length &&
	          endMarker &&
	          (1 !== curFocusedElem.rangeCount ||
	            curFocusedElem.anchorNode !== length.node ||
	            curFocusedElem.anchorOffset !== length.offset ||
	            curFocusedElem.focusNode !== endMarker.node ||
	            curFocusedElem.focusOffset !== endMarker.offset) &&
	          ((priorSelectionInformation =
	            priorSelectionInformation.createRange()),
	          priorSelectionInformation.setStart(length.node, length.offset),
	          curFocusedElem.removeAllRanges(),
	          start > priorSelectionRange
	            ? (curFocusedElem.addRange(priorSelectionInformation),
	              curFocusedElem.extend(endMarker.node, endMarker.offset))
	            : (priorSelectionInformation.setEnd(
	                endMarker.node,
	                endMarker.offset
	              ),
	              curFocusedElem.addRange(priorSelectionInformation)));
	      }
	    priorSelectionInformation = [];
	    for (
	      curFocusedElem = containerInfo;
	      (curFocusedElem = curFocusedElem.parentNode);

	    )
	      1 === curFocusedElem.nodeType &&
	        priorSelectionInformation.push({
	          element: curFocusedElem,
	          left: curFocusedElem.scrollLeft,
	          top: curFocusedElem.scrollTop
	        });
	    "function" === typeof containerInfo.focus && containerInfo.focus();
	    for (
	      containerInfo = 0;
	      containerInfo < priorSelectionInformation.length;
	      containerInfo++
	    )
	      (curFocusedElem = priorSelectionInformation[containerInfo]),
	        (curFocusedElem.element.scrollLeft = curFocusedElem.left),
	        (curFocusedElem.element.scrollTop = curFocusedElem.top);
	  }
	}
	var skipSelectionChangeEvent =
	    canUseDOM && "documentMode" in document && 11 >= document.documentMode,
	  activeElement = null,
	  activeElementInst = null,
	  lastSelection = null,
	  mouseDown = false;
	function constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget) {
	  var doc =
	    nativeEventTarget.window === nativeEventTarget
	      ? nativeEventTarget.document
	      : 9 === nativeEventTarget.nodeType
	        ? nativeEventTarget
	        : nativeEventTarget.ownerDocument;
	  mouseDown ||
	    null == activeElement ||
	    activeElement !== getActiveElement(doc) ||
	    ((doc = activeElement),
	    "selectionStart" in doc && hasSelectionCapabilities(doc)
	      ? (doc = { start: doc.selectionStart, end: doc.selectionEnd })
	      : ((doc = (
	          (doc.ownerDocument && doc.ownerDocument.defaultView) ||
	          window
	        ).getSelection()),
	        (doc = {
	          anchorNode: doc.anchorNode,
	          anchorOffset: doc.anchorOffset,
	          focusNode: doc.focusNode,
	          focusOffset: doc.focusOffset
	        })),
	    (lastSelection && shallowEqual(lastSelection, doc)) ||
	      ((lastSelection = doc),
	      (doc = accumulateTwoPhaseListeners(activeElementInst, "onSelect")),
	      0 < doc.length &&
	        ((nativeEvent = new SyntheticEvent(
	          "onSelect",
	          "select",
	          null,
	          nativeEvent,
	          nativeEventTarget
	        )),
	        dispatchQueue.push({ event: nativeEvent, listeners: doc }),
	        (nativeEvent.target = activeElement))));
	}
	function makePrefixMap(styleProp, eventName) {
	  var prefixes = {};
	  prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
	  prefixes["Webkit" + styleProp] = "webkit" + eventName;
	  prefixes["Moz" + styleProp] = "moz" + eventName;
	  return prefixes;
	}
	var vendorPrefixes = {
	    animationend: makePrefixMap("Animation", "AnimationEnd"),
	    animationiteration: makePrefixMap("Animation", "AnimationIteration"),
	    animationstart: makePrefixMap("Animation", "AnimationStart"),
	    transitionrun: makePrefixMap("Transition", "TransitionRun"),
	    transitionstart: makePrefixMap("Transition", "TransitionStart"),
	    transitioncancel: makePrefixMap("Transition", "TransitionCancel"),
	    transitionend: makePrefixMap("Transition", "TransitionEnd")
	  },
	  prefixedEventNames = {},
	  style = {};
	canUseDOM &&
	  ((style = document.createElement("div").style),
	  "AnimationEvent" in window ||
	    (delete vendorPrefixes.animationend.animation,
	    delete vendorPrefixes.animationiteration.animation,
	    delete vendorPrefixes.animationstart.animation),
	  "TransitionEvent" in window ||
	    delete vendorPrefixes.transitionend.transition);
	function getVendorPrefixedEventName(eventName) {
	  if (prefixedEventNames[eventName]) return prefixedEventNames[eventName];
	  if (!vendorPrefixes[eventName]) return eventName;
	  var prefixMap = vendorPrefixes[eventName],
	    styleProp;
	  for (styleProp in prefixMap)
	    if (prefixMap.hasOwnProperty(styleProp) && styleProp in style)
	      return (prefixedEventNames[eventName] = prefixMap[styleProp]);
	  return eventName;
	}
	var ANIMATION_END = getVendorPrefixedEventName("animationend"),
	  ANIMATION_ITERATION = getVendorPrefixedEventName("animationiteration"),
	  ANIMATION_START = getVendorPrefixedEventName("animationstart"),
	  TRANSITION_RUN = getVendorPrefixedEventName("transitionrun"),
	  TRANSITION_START = getVendorPrefixedEventName("transitionstart"),
	  TRANSITION_CANCEL = getVendorPrefixedEventName("transitioncancel"),
	  TRANSITION_END = getVendorPrefixedEventName("transitionend"),
	  topLevelEventsToReactNames = new Map(),
	  simpleEventPluginEvents =
	    "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll scrollEnd toggle touchMove waiting wheel".split(
	      " "
	    );
	function registerSimpleEvent(domEventName, reactName) {
	  topLevelEventsToReactNames.set(domEventName, reactName);
	  registerTwoPhaseEvent(reactName, [domEventName]);
	}
	var concurrentQueues = [],
	  concurrentQueuesIndex = 0,
	  concurrentlyUpdatedLanes = 0;
	function finishQueueingConcurrentUpdates() {
	  for (
	    var endIndex = concurrentQueuesIndex,
	      i = (concurrentlyUpdatedLanes = concurrentQueuesIndex = 0);
	    i < endIndex;

	  ) {
	    var fiber = concurrentQueues[i];
	    concurrentQueues[i++] = null;
	    var queue = concurrentQueues[i];
	    concurrentQueues[i++] = null;
	    var update = concurrentQueues[i];
	    concurrentQueues[i++] = null;
	    var lane = concurrentQueues[i];
	    concurrentQueues[i++] = null;
	    if (null !== queue && null !== update) {
	      var pending = queue.pending;
	      null === pending
	        ? (update.next = update)
	        : ((update.next = pending.next), (pending.next = update));
	      queue.pending = update;
	    }
	    0 !== lane && markUpdateLaneFromFiberToRoot(fiber, update, lane);
	  }
	}
	function enqueueUpdate$1(fiber, queue, update, lane) {
	  concurrentQueues[concurrentQueuesIndex++] = fiber;
	  concurrentQueues[concurrentQueuesIndex++] = queue;
	  concurrentQueues[concurrentQueuesIndex++] = update;
	  concurrentQueues[concurrentQueuesIndex++] = lane;
	  concurrentlyUpdatedLanes |= lane;
	  fiber.lanes |= lane;
	  fiber = fiber.alternate;
	  null !== fiber && (fiber.lanes |= lane);
	}
	function enqueueConcurrentHookUpdate(fiber, queue, update, lane) {
	  enqueueUpdate$1(fiber, queue, update, lane);
	  return getRootForUpdatedFiber(fiber);
	}
	function enqueueConcurrentRenderForLane(fiber, lane) {
	  enqueueUpdate$1(fiber, null, null, lane);
	  return getRootForUpdatedFiber(fiber);
	}
	function markUpdateLaneFromFiberToRoot(sourceFiber, update, lane) {
	  sourceFiber.lanes |= lane;
	  var alternate = sourceFiber.alternate;
	  null !== alternate && (alternate.lanes |= lane);
	  for (var isHidden = false, parent = sourceFiber.return; null !== parent; )
	    (parent.childLanes |= lane),
	      (alternate = parent.alternate),
	      null !== alternate && (alternate.childLanes |= lane),
	      22 === parent.tag &&
	        ((sourceFiber = parent.stateNode),
	        null === sourceFiber || sourceFiber._visibility & 1 || (isHidden = true)),
	      (sourceFiber = parent),
	      (parent = parent.return);
	  isHidden &&
	    null !== update &&
	    3 === sourceFiber.tag &&
	    ((parent = sourceFiber.stateNode),
	    (isHidden = 31 - clz32(lane)),
	    (parent = parent.hiddenUpdates),
	    (sourceFiber = parent[isHidden]),
	    null === sourceFiber
	      ? (parent[isHidden] = [update])
	      : sourceFiber.push(update),
	    (update.lane = lane | 536870912));
	}
	function getRootForUpdatedFiber(sourceFiber) {
	  if (50 < nestedUpdateCount)
	    throw (
	      ((nestedUpdateCount = 0),
	      (rootWithNestedUpdates = null),
	      Error(formatProdErrorMessage(185)))
	    );
	  for (var parent = sourceFiber.return; null !== parent; )
	    (sourceFiber = parent), (parent = sourceFiber.return);
	  return 3 === sourceFiber.tag ? sourceFiber.stateNode : null;
	}
	var emptyContextObject = {},
	  CapturedStacks = new WeakMap();
	function createCapturedValueAtFiber(value, source) {
	  if ("object" === typeof value && null !== value) {
	    var existing = CapturedStacks.get(value);
	    if (void 0 !== existing) return existing;
	    source = {
	      value: value,
	      source: source,
	      stack: getStackByFiberInDevAndProd(source)
	    };
	    CapturedStacks.set(value, source);
	    return source;
	  }
	  return {
	    value: value,
	    source: source,
	    stack: getStackByFiberInDevAndProd(source)
	  };
	}
	var forkStack = [],
	  forkStackIndex = 0,
	  treeForkProvider = null,
	  treeForkCount = 0,
	  idStack = [],
	  idStackIndex = 0,
	  treeContextProvider = null,
	  treeContextId = 1,
	  treeContextOverflow = "";
	function pushTreeFork(workInProgress, totalChildren) {
	  forkStack[forkStackIndex++] = treeForkCount;
	  forkStack[forkStackIndex++] = treeForkProvider;
	  treeForkProvider = workInProgress;
	  treeForkCount = totalChildren;
	}
	function pushTreeId(workInProgress, totalChildren, index) {
	  idStack[idStackIndex++] = treeContextId;
	  idStack[idStackIndex++] = treeContextOverflow;
	  idStack[idStackIndex++] = treeContextProvider;
	  treeContextProvider = workInProgress;
	  var baseIdWithLeadingBit = treeContextId;
	  workInProgress = treeContextOverflow;
	  var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
	  baseIdWithLeadingBit &= ~(1 << baseLength);
	  index += 1;
	  var length = 32 - clz32(totalChildren) + baseLength;
	  if (30 < length) {
	    var numberOfOverflowBits = baseLength - (baseLength % 5);
	    length = (
	      baseIdWithLeadingBit &
	      ((1 << numberOfOverflowBits) - 1)
	    ).toString(32);
	    baseIdWithLeadingBit >>= numberOfOverflowBits;
	    baseLength -= numberOfOverflowBits;
	    treeContextId =
	      (1 << (32 - clz32(totalChildren) + baseLength)) |
	      (index << baseLength) |
	      baseIdWithLeadingBit;
	    treeContextOverflow = length + workInProgress;
	  } else
	    (treeContextId =
	      (1 << length) | (index << baseLength) | baseIdWithLeadingBit),
	      (treeContextOverflow = workInProgress);
	}
	function pushMaterializedTreeId(workInProgress) {
	  null !== workInProgress.return &&
	    (pushTreeFork(workInProgress, 1), pushTreeId(workInProgress, 1, 0));
	}
	function popTreeContext(workInProgress) {
	  for (; workInProgress === treeForkProvider; )
	    (treeForkProvider = forkStack[--forkStackIndex]),
	      (forkStack[forkStackIndex] = null),
	      (treeForkCount = forkStack[--forkStackIndex]),
	      (forkStack[forkStackIndex] = null);
	  for (; workInProgress === treeContextProvider; )
	    (treeContextProvider = idStack[--idStackIndex]),
	      (idStack[idStackIndex] = null),
	      (treeContextOverflow = idStack[--idStackIndex]),
	      (idStack[idStackIndex] = null),
	      (treeContextId = idStack[--idStackIndex]),
	      (idStack[idStackIndex] = null);
	}
	var hydrationParentFiber = null,
	  nextHydratableInstance = null,
	  isHydrating = false,
	  hydrationErrors = null,
	  rootOrSingletonContext = false,
	  HydrationMismatchException = Error(formatProdErrorMessage(519));
	function throwOnHydrationMismatch(fiber) {
	  var error = Error(formatProdErrorMessage(418, ""));
	  queueHydrationError(createCapturedValueAtFiber(error, fiber));
	  throw HydrationMismatchException;
	}
	function prepareToHydrateHostInstance(fiber) {
	  var instance = fiber.stateNode,
	    type = fiber.type,
	    props = fiber.memoizedProps;
	  instance[internalInstanceKey] = fiber;
	  instance[internalPropsKey] = props;
	  switch (type) {
	    case "dialog":
	      listenToNonDelegatedEvent("cancel", instance);
	      listenToNonDelegatedEvent("close", instance);
	      break;
	    case "iframe":
	    case "object":
	    case "embed":
	      listenToNonDelegatedEvent("load", instance);
	      break;
	    case "video":
	    case "audio":
	      for (type = 0; type < mediaEventTypes.length; type++)
	        listenToNonDelegatedEvent(mediaEventTypes[type], instance);
	      break;
	    case "source":
	      listenToNonDelegatedEvent("error", instance);
	      break;
	    case "img":
	    case "image":
	    case "link":
	      listenToNonDelegatedEvent("error", instance);
	      listenToNonDelegatedEvent("load", instance);
	      break;
	    case "details":
	      listenToNonDelegatedEvent("toggle", instance);
	      break;
	    case "input":
	      listenToNonDelegatedEvent("invalid", instance);
	      initInput(
	        instance,
	        props.value,
	        props.defaultValue,
	        props.checked,
	        props.defaultChecked,
	        props.type,
	        props.name,
	        true
	      );
	      track(instance);
	      break;
	    case "select":
	      listenToNonDelegatedEvent("invalid", instance);
	      break;
	    case "textarea":
	      listenToNonDelegatedEvent("invalid", instance),
	        initTextarea(instance, props.value, props.defaultValue, props.children),
	        track(instance);
	  }
	  type = props.children;
	  ("string" !== typeof type &&
	    "number" !== typeof type &&
	    "bigint" !== typeof type) ||
	  instance.textContent === "" + type ||
	  true === props.suppressHydrationWarning ||
	  checkForUnmatchedText(instance.textContent, type)
	    ? (null != props.popover &&
	        (listenToNonDelegatedEvent("beforetoggle", instance),
	        listenToNonDelegatedEvent("toggle", instance)),
	      null != props.onScroll && listenToNonDelegatedEvent("scroll", instance),
	      null != props.onScrollEnd &&
	        listenToNonDelegatedEvent("scrollend", instance),
	      null != props.onClick && (instance.onclick = noop$1),
	      (instance = true))
	    : (instance = false);
	  instance || throwOnHydrationMismatch(fiber);
	}
	function popToNextHostParent(fiber) {
	  for (hydrationParentFiber = fiber.return; hydrationParentFiber; )
	    switch (hydrationParentFiber.tag) {
	      case 3:
	      case 27:
	        rootOrSingletonContext = true;
	        return;
	      case 5:
	      case 13:
	        rootOrSingletonContext = false;
	        return;
	      default:
	        hydrationParentFiber = hydrationParentFiber.return;
	    }
	}
	function popHydrationState(fiber) {
	  if (fiber !== hydrationParentFiber) return false;
	  if (!isHydrating) return popToNextHostParent(fiber), (isHydrating = true), false;
	  var shouldClear = false,
	    JSCompiler_temp;
	  if ((JSCompiler_temp = 3 !== fiber.tag && 27 !== fiber.tag)) {
	    if ((JSCompiler_temp = 5 === fiber.tag))
	      (JSCompiler_temp = fiber.type),
	        (JSCompiler_temp =
	          !("form" !== JSCompiler_temp && "button" !== JSCompiler_temp) ||
	          shouldSetTextContent(fiber.type, fiber.memoizedProps));
	    JSCompiler_temp = !JSCompiler_temp;
	  }
	  JSCompiler_temp && (shouldClear = true);
	  shouldClear && nextHydratableInstance && throwOnHydrationMismatch(fiber);
	  popToNextHostParent(fiber);
	  if (13 === fiber.tag) {
	    fiber = fiber.memoizedState;
	    fiber = null !== fiber ? fiber.dehydrated : null;
	    if (!fiber) throw Error(formatProdErrorMessage(317));
	    a: {
	      fiber = fiber.nextSibling;
	      for (shouldClear = 0; fiber; ) {
	        if (8 === fiber.nodeType)
	          if (((JSCompiler_temp = fiber.data), "/$" === JSCompiler_temp)) {
	            if (0 === shouldClear) {
	              nextHydratableInstance = getNextHydratable(fiber.nextSibling);
	              break a;
	            }
	            shouldClear--;
	          } else
	            ("$" !== JSCompiler_temp &&
	              "$!" !== JSCompiler_temp &&
	              "$?" !== JSCompiler_temp) ||
	              shouldClear++;
	        fiber = fiber.nextSibling;
	      }
	      nextHydratableInstance = null;
	    }
	  } else
	    nextHydratableInstance = hydrationParentFiber
	      ? getNextHydratable(fiber.stateNode.nextSibling)
	      : null;
	  return true;
	}
	function resetHydrationState() {
	  nextHydratableInstance = hydrationParentFiber = null;
	  isHydrating = false;
	}
	function queueHydrationError(error) {
	  null === hydrationErrors
	    ? (hydrationErrors = [error])
	    : hydrationErrors.push(error);
	}
	var SuspenseException = Error(formatProdErrorMessage(460)),
	  SuspenseyCommitException = Error(formatProdErrorMessage(474)),
	  noopSuspenseyCommitThenable = { then: function () {} };
	function isThenableResolved(thenable) {
	  thenable = thenable.status;
	  return "fulfilled" === thenable || "rejected" === thenable;
	}
	function noop$3() {}
	function trackUsedThenable(thenableState, thenable, index) {
	  index = thenableState[index];
	  void 0 === index
	    ? thenableState.push(thenable)
	    : index !== thenable && (thenable.then(noop$3, noop$3), (thenable = index));
	  switch (thenable.status) {
	    case "fulfilled":
	      return thenable.value;
	    case "rejected":
	      thenableState = thenable.reason;
	      if (thenableState === SuspenseException)
	        throw Error(formatProdErrorMessage(483));
	      throw thenableState;
	    default:
	      if ("string" === typeof thenable.status) thenable.then(noop$3, noop$3);
	      else {
	        thenableState = workInProgressRoot;
	        if (null !== thenableState && 100 < thenableState.shellSuspendCounter)
	          throw Error(formatProdErrorMessage(482));
	        thenableState = thenable;
	        thenableState.status = "pending";
	        thenableState.then(
	          function (fulfilledValue) {
	            if ("pending" === thenable.status) {
	              var fulfilledThenable = thenable;
	              fulfilledThenable.status = "fulfilled";
	              fulfilledThenable.value = fulfilledValue;
	            }
	          },
	          function (error) {
	            if ("pending" === thenable.status) {
	              var rejectedThenable = thenable;
	              rejectedThenable.status = "rejected";
	              rejectedThenable.reason = error;
	            }
	          }
	        );
	      }
	      switch (thenable.status) {
	        case "fulfilled":
	          return thenable.value;
	        case "rejected":
	          thenableState = thenable.reason;
	          if (thenableState === SuspenseException)
	            throw Error(formatProdErrorMessage(483));
	          throw thenableState;
	      }
	      suspendedThenable = thenable;
	      throw SuspenseException;
	  }
	}
	var suspendedThenable = null;
	function getSuspendedThenable() {
	  if (null === suspendedThenable) throw Error(formatProdErrorMessage(459));
	  var thenable = suspendedThenable;
	  suspendedThenable = null;
	  return thenable;
	}
	var thenableState$1 = null,
	  thenableIndexCounter$1 = 0;
	function unwrapThenable(thenable) {
	  var index = thenableIndexCounter$1;
	  thenableIndexCounter$1 += 1;
	  null === thenableState$1 && (thenableState$1 = []);
	  return trackUsedThenable(thenableState$1, thenable, index);
	}
	function coerceRef(workInProgress, element) {
	  element = element.props.ref;
	  workInProgress.ref = void 0 !== element ? element : null;
	}
	function throwOnInvalidObjectType(returnFiber, newChild) {
	  if (newChild.$$typeof === REACT_LEGACY_ELEMENT_TYPE)
	    throw Error(formatProdErrorMessage(525));
	  returnFiber = Object.prototype.toString.call(newChild);
	  throw Error(
	    formatProdErrorMessage(
	      31,
	      "[object Object]" === returnFiber
	        ? "object with keys {" + Object.keys(newChild).join(", ") + "}"
	        : returnFiber
	    )
	  );
	}
	function resolveLazy(lazyType) {
	  var init = lazyType._init;
	  return init(lazyType._payload);
	}
	function createChildReconciler(shouldTrackSideEffects) {
	  function deleteChild(returnFiber, childToDelete) {
	    if (shouldTrackSideEffects) {
	      var deletions = returnFiber.deletions;
	      null === deletions
	        ? ((returnFiber.deletions = [childToDelete]), (returnFiber.flags |= 16))
	        : deletions.push(childToDelete);
	    }
	  }
	  function deleteRemainingChildren(returnFiber, currentFirstChild) {
	    if (!shouldTrackSideEffects) return null;
	    for (; null !== currentFirstChild; )
	      deleteChild(returnFiber, currentFirstChild),
	        (currentFirstChild = currentFirstChild.sibling);
	    return null;
	  }
	  function mapRemainingChildren(currentFirstChild) {
	    for (var existingChildren = new Map(); null !== currentFirstChild; )
	      null !== currentFirstChild.key
	        ? existingChildren.set(currentFirstChild.key, currentFirstChild)
	        : existingChildren.set(currentFirstChild.index, currentFirstChild),
	        (currentFirstChild = currentFirstChild.sibling);
	    return existingChildren;
	  }
	  function useFiber(fiber, pendingProps) {
	    fiber = createWorkInProgress(fiber, pendingProps);
	    fiber.index = 0;
	    fiber.sibling = null;
	    return fiber;
	  }
	  function placeChild(newFiber, lastPlacedIndex, newIndex) {
	    newFiber.index = newIndex;
	    if (!shouldTrackSideEffects)
	      return (newFiber.flags |= 1048576), lastPlacedIndex;
	    newIndex = newFiber.alternate;
	    if (null !== newIndex)
	      return (
	        (newIndex = newIndex.index),
	        newIndex < lastPlacedIndex
	          ? ((newFiber.flags |= 33554434), lastPlacedIndex)
	          : newIndex
	      );
	    newFiber.flags |= 33554434;
	    return lastPlacedIndex;
	  }
	  function placeSingleChild(newFiber) {
	    shouldTrackSideEffects &&
	      null === newFiber.alternate &&
	      (newFiber.flags |= 33554434);
	    return newFiber;
	  }
	  function updateTextNode(returnFiber, current, textContent, lanes) {
	    if (null === current || 6 !== current.tag)
	      return (
	        (current = createFiberFromText(textContent, returnFiber.mode, lanes)),
	        (current.return = returnFiber),
	        current
	      );
	    current = useFiber(current, textContent);
	    current.return = returnFiber;
	    return current;
	  }
	  function updateElement(returnFiber, current, element, lanes) {
	    var elementType = element.type;
	    if (elementType === REACT_FRAGMENT_TYPE)
	      return updateFragment(
	        returnFiber,
	        current,
	        element.props.children,
	        lanes,
	        element.key
	      );
	    if (
	      null !== current &&
	      (current.elementType === elementType ||
	        ("object" === typeof elementType &&
	          null !== elementType &&
	          elementType.$$typeof === REACT_LAZY_TYPE &&
	          resolveLazy(elementType) === current.type))
	    )
	      return (
	        (current = useFiber(current, element.props)),
	        coerceRef(current, element),
	        (current.return = returnFiber),
	        current
	      );
	    current = createFiberFromTypeAndProps(
	      element.type,
	      element.key,
	      element.props,
	      null,
	      returnFiber.mode,
	      lanes
	    );
	    coerceRef(current, element);
	    current.return = returnFiber;
	    return current;
	  }
	  function updatePortal(returnFiber, current, portal, lanes) {
	    if (
	      null === current ||
	      4 !== current.tag ||
	      current.stateNode.containerInfo !== portal.containerInfo ||
	      current.stateNode.implementation !== portal.implementation
	    )
	      return (
	        (current = createFiberFromPortal(portal, returnFiber.mode, lanes)),
	        (current.return = returnFiber),
	        current
	      );
	    current = useFiber(current, portal.children || []);
	    current.return = returnFiber;
	    return current;
	  }
	  function updateFragment(returnFiber, current, fragment, lanes, key) {
	    if (null === current || 7 !== current.tag)
	      return (
	        (current = createFiberFromFragment(
	          fragment,
	          returnFiber.mode,
	          lanes,
	          key
	        )),
	        (current.return = returnFiber),
	        current
	      );
	    current = useFiber(current, fragment);
	    current.return = returnFiber;
	    return current;
	  }
	  function createChild(returnFiber, newChild, lanes) {
	    if (
	      ("string" === typeof newChild && "" !== newChild) ||
	      "number" === typeof newChild ||
	      "bigint" === typeof newChild
	    )
	      return (
	        (newChild = createFiberFromText(
	          "" + newChild,
	          returnFiber.mode,
	          lanes
	        )),
	        (newChild.return = returnFiber),
	        newChild
	      );
	    if ("object" === typeof newChild && null !== newChild) {
	      switch (newChild.$$typeof) {
	        case REACT_ELEMENT_TYPE:
	          return (
	            (lanes = createFiberFromTypeAndProps(
	              newChild.type,
	              newChild.key,
	              newChild.props,
	              null,
	              returnFiber.mode,
	              lanes
	            )),
	            coerceRef(lanes, newChild),
	            (lanes.return = returnFiber),
	            lanes
	          );
	        case REACT_PORTAL_TYPE:
	          return (
	            (newChild = createFiberFromPortal(
	              newChild,
	              returnFiber.mode,
	              lanes
	            )),
	            (newChild.return = returnFiber),
	            newChild
	          );
	        case REACT_LAZY_TYPE:
	          var init = newChild._init;
	          newChild = init(newChild._payload);
	          return createChild(returnFiber, newChild, lanes);
	      }
	      if (isArrayImpl(newChild) || getIteratorFn(newChild))
	        return (
	          (newChild = createFiberFromFragment(
	            newChild,
	            returnFiber.mode,
	            lanes,
	            null
	          )),
	          (newChild.return = returnFiber),
	          newChild
	        );
	      if ("function" === typeof newChild.then)
	        return createChild(returnFiber, unwrapThenable(newChild), lanes);
	      if (newChild.$$typeof === REACT_CONTEXT_TYPE)
	        return createChild(
	          returnFiber,
	          readContextDuringReconciliation(returnFiber, newChild),
	          lanes
	        );
	      throwOnInvalidObjectType(returnFiber, newChild);
	    }
	    return null;
	  }
	  function updateSlot(returnFiber, oldFiber, newChild, lanes) {
	    var key = null !== oldFiber ? oldFiber.key : null;
	    if (
	      ("string" === typeof newChild && "" !== newChild) ||
	      "number" === typeof newChild ||
	      "bigint" === typeof newChild
	    )
	      return null !== key
	        ? null
	        : updateTextNode(returnFiber, oldFiber, "" + newChild, lanes);
	    if ("object" === typeof newChild && null !== newChild) {
	      switch (newChild.$$typeof) {
	        case REACT_ELEMENT_TYPE:
	          return newChild.key === key
	            ? updateElement(returnFiber, oldFiber, newChild, lanes)
	            : null;
	        case REACT_PORTAL_TYPE:
	          return newChild.key === key
	            ? updatePortal(returnFiber, oldFiber, newChild, lanes)
	            : null;
	        case REACT_LAZY_TYPE:
	          return (
	            (key = newChild._init),
	            (newChild = key(newChild._payload)),
	            updateSlot(returnFiber, oldFiber, newChild, lanes)
	          );
	      }
	      if (isArrayImpl(newChild) || getIteratorFn(newChild))
	        return null !== key
	          ? null
	          : updateFragment(returnFiber, oldFiber, newChild, lanes, null);
	      if ("function" === typeof newChild.then)
	        return updateSlot(
	          returnFiber,
	          oldFiber,
	          unwrapThenable(newChild),
	          lanes
	        );
	      if (newChild.$$typeof === REACT_CONTEXT_TYPE)
	        return updateSlot(
	          returnFiber,
	          oldFiber,
	          readContextDuringReconciliation(returnFiber, newChild),
	          lanes
	        );
	      throwOnInvalidObjectType(returnFiber, newChild);
	    }
	    return null;
	  }
	  function updateFromMap(
	    existingChildren,
	    returnFiber,
	    newIdx,
	    newChild,
	    lanes
	  ) {
	    if (
	      ("string" === typeof newChild && "" !== newChild) ||
	      "number" === typeof newChild ||
	      "bigint" === typeof newChild
	    )
	      return (
	        (existingChildren = existingChildren.get(newIdx) || null),
	        updateTextNode(returnFiber, existingChildren, "" + newChild, lanes)
	      );
	    if ("object" === typeof newChild && null !== newChild) {
	      switch (newChild.$$typeof) {
	        case REACT_ELEMENT_TYPE:
	          return (
	            (existingChildren =
	              existingChildren.get(
	                null === newChild.key ? newIdx : newChild.key
	              ) || null),
	            updateElement(returnFiber, existingChildren, newChild, lanes)
	          );
	        case REACT_PORTAL_TYPE:
	          return (
	            (existingChildren =
	              existingChildren.get(
	                null === newChild.key ? newIdx : newChild.key
	              ) || null),
	            updatePortal(returnFiber, existingChildren, newChild, lanes)
	          );
	        case REACT_LAZY_TYPE:
	          var init = newChild._init;
	          newChild = init(newChild._payload);
	          return updateFromMap(
	            existingChildren,
	            returnFiber,
	            newIdx,
	            newChild,
	            lanes
	          );
	      }
	      if (isArrayImpl(newChild) || getIteratorFn(newChild))
	        return (
	          (existingChildren = existingChildren.get(newIdx) || null),
	          updateFragment(returnFiber, existingChildren, newChild, lanes, null)
	        );
	      if ("function" === typeof newChild.then)
	        return updateFromMap(
	          existingChildren,
	          returnFiber,
	          newIdx,
	          unwrapThenable(newChild),
	          lanes
	        );
	      if (newChild.$$typeof === REACT_CONTEXT_TYPE)
	        return updateFromMap(
	          existingChildren,
	          returnFiber,
	          newIdx,
	          readContextDuringReconciliation(returnFiber, newChild),
	          lanes
	        );
	      throwOnInvalidObjectType(returnFiber, newChild);
	    }
	    return null;
	  }
	  function reconcileChildrenArray(
	    returnFiber,
	    currentFirstChild,
	    newChildren,
	    lanes
	  ) {
	    for (
	      var resultingFirstChild = null,
	        previousNewFiber = null,
	        oldFiber = currentFirstChild,
	        newIdx = (currentFirstChild = 0),
	        nextOldFiber = null;
	      null !== oldFiber && newIdx < newChildren.length;
	      newIdx++
	    ) {
	      oldFiber.index > newIdx
	        ? ((nextOldFiber = oldFiber), (oldFiber = null))
	        : (nextOldFiber = oldFiber.sibling);
	      var newFiber = updateSlot(
	        returnFiber,
	        oldFiber,
	        newChildren[newIdx],
	        lanes
	      );
	      if (null === newFiber) {
	        null === oldFiber && (oldFiber = nextOldFiber);
	        break;
	      }
	      shouldTrackSideEffects &&
	        oldFiber &&
	        null === newFiber.alternate &&
	        deleteChild(returnFiber, oldFiber);
	      currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
	      null === previousNewFiber
	        ? (resultingFirstChild = newFiber)
	        : (previousNewFiber.sibling = newFiber);
	      previousNewFiber = newFiber;
	      oldFiber = nextOldFiber;
	    }
	    if (newIdx === newChildren.length)
	      return (
	        deleteRemainingChildren(returnFiber, oldFiber),
	        isHydrating && pushTreeFork(returnFiber, newIdx),
	        resultingFirstChild
	      );
	    if (null === oldFiber) {
	      for (; newIdx < newChildren.length; newIdx++)
	        (oldFiber = createChild(returnFiber, newChildren[newIdx], lanes)),
	          null !== oldFiber &&
	            ((currentFirstChild = placeChild(
	              oldFiber,
	              currentFirstChild,
	              newIdx
	            )),
	            null === previousNewFiber
	              ? (resultingFirstChild = oldFiber)
	              : (previousNewFiber.sibling = oldFiber),
	            (previousNewFiber = oldFiber));
	      isHydrating && pushTreeFork(returnFiber, newIdx);
	      return resultingFirstChild;
	    }
	    for (
	      oldFiber = mapRemainingChildren(oldFiber);
	      newIdx < newChildren.length;
	      newIdx++
	    )
	      (nextOldFiber = updateFromMap(
	        oldFiber,
	        returnFiber,
	        newIdx,
	        newChildren[newIdx],
	        lanes
	      )),
	        null !== nextOldFiber &&
	          (shouldTrackSideEffects &&
	            null !== nextOldFiber.alternate &&
	            oldFiber.delete(
	              null === nextOldFiber.key ? newIdx : nextOldFiber.key
	            ),
	          (currentFirstChild = placeChild(
	            nextOldFiber,
	            currentFirstChild,
	            newIdx
	          )),
	          null === previousNewFiber
	            ? (resultingFirstChild = nextOldFiber)
	            : (previousNewFiber.sibling = nextOldFiber),
	          (previousNewFiber = nextOldFiber));
	    shouldTrackSideEffects &&
	      oldFiber.forEach(function (child) {
	        return deleteChild(returnFiber, child);
	      });
	    isHydrating && pushTreeFork(returnFiber, newIdx);
	    return resultingFirstChild;
	  }
	  function reconcileChildrenIterator(
	    returnFiber,
	    currentFirstChild,
	    newChildren,
	    lanes
	  ) {
	    if (null == newChildren) throw Error(formatProdErrorMessage(151));
	    for (
	      var resultingFirstChild = null,
	        previousNewFiber = null,
	        oldFiber = currentFirstChild,
	        newIdx = (currentFirstChild = 0),
	        nextOldFiber = null,
	        step = newChildren.next();
	      null !== oldFiber && !step.done;
	      newIdx++, step = newChildren.next()
	    ) {
	      oldFiber.index > newIdx
	        ? ((nextOldFiber = oldFiber), (oldFiber = null))
	        : (nextOldFiber = oldFiber.sibling);
	      var newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);
	      if (null === newFiber) {
	        null === oldFiber && (oldFiber = nextOldFiber);
	        break;
	      }
	      shouldTrackSideEffects &&
	        oldFiber &&
	        null === newFiber.alternate &&
	        deleteChild(returnFiber, oldFiber);
	      currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
	      null === previousNewFiber
	        ? (resultingFirstChild = newFiber)
	        : (previousNewFiber.sibling = newFiber);
	      previousNewFiber = newFiber;
	      oldFiber = nextOldFiber;
	    }
	    if (step.done)
	      return (
	        deleteRemainingChildren(returnFiber, oldFiber),
	        isHydrating && pushTreeFork(returnFiber, newIdx),
	        resultingFirstChild
	      );
	    if (null === oldFiber) {
	      for (; !step.done; newIdx++, step = newChildren.next())
	        (step = createChild(returnFiber, step.value, lanes)),
	          null !== step &&
	            ((currentFirstChild = placeChild(step, currentFirstChild, newIdx)),
	            null === previousNewFiber
	              ? (resultingFirstChild = step)
	              : (previousNewFiber.sibling = step),
	            (previousNewFiber = step));
	      isHydrating && pushTreeFork(returnFiber, newIdx);
	      return resultingFirstChild;
	    }
	    for (
	      oldFiber = mapRemainingChildren(oldFiber);
	      !step.done;
	      newIdx++, step = newChildren.next()
	    )
	      (step = updateFromMap(oldFiber, returnFiber, newIdx, step.value, lanes)),
	        null !== step &&
	          (shouldTrackSideEffects &&
	            null !== step.alternate &&
	            oldFiber.delete(null === step.key ? newIdx : step.key),
	          (currentFirstChild = placeChild(step, currentFirstChild, newIdx)),
	          null === previousNewFiber
	            ? (resultingFirstChild = step)
	            : (previousNewFiber.sibling = step),
	          (previousNewFiber = step));
	    shouldTrackSideEffects &&
	      oldFiber.forEach(function (child) {
	        return deleteChild(returnFiber, child);
	      });
	    isHydrating && pushTreeFork(returnFiber, newIdx);
	    return resultingFirstChild;
	  }
	  function reconcileChildFibersImpl(
	    returnFiber,
	    currentFirstChild,
	    newChild,
	    lanes
	  ) {
	    "object" === typeof newChild &&
	      null !== newChild &&
	      newChild.type === REACT_FRAGMENT_TYPE &&
	      null === newChild.key &&
	      (newChild = newChild.props.children);
	    if ("object" === typeof newChild && null !== newChild) {
	      switch (newChild.$$typeof) {
	        case REACT_ELEMENT_TYPE:
	          a: {
	            for (var key = newChild.key; null !== currentFirstChild; ) {
	              if (currentFirstChild.key === key) {
	                key = newChild.type;
	                if (key === REACT_FRAGMENT_TYPE) {
	                  if (7 === currentFirstChild.tag) {
	                    deleteRemainingChildren(
	                      returnFiber,
	                      currentFirstChild.sibling
	                    );
	                    lanes = useFiber(
	                      currentFirstChild,
	                      newChild.props.children
	                    );
	                    lanes.return = returnFiber;
	                    returnFiber = lanes;
	                    break a;
	                  }
	                } else if (
	                  currentFirstChild.elementType === key ||
	                  ("object" === typeof key &&
	                    null !== key &&
	                    key.$$typeof === REACT_LAZY_TYPE &&
	                    resolveLazy(key) === currentFirstChild.type)
	                ) {
	                  deleteRemainingChildren(
	                    returnFiber,
	                    currentFirstChild.sibling
	                  );
	                  lanes = useFiber(currentFirstChild, newChild.props);
	                  coerceRef(lanes, newChild);
	                  lanes.return = returnFiber;
	                  returnFiber = lanes;
	                  break a;
	                }
	                deleteRemainingChildren(returnFiber, currentFirstChild);
	                break;
	              } else deleteChild(returnFiber, currentFirstChild);
	              currentFirstChild = currentFirstChild.sibling;
	            }
	            newChild.type === REACT_FRAGMENT_TYPE
	              ? ((lanes = createFiberFromFragment(
	                  newChild.props.children,
	                  returnFiber.mode,
	                  lanes,
	                  newChild.key
	                )),
	                (lanes.return = returnFiber),
	                (returnFiber = lanes))
	              : ((lanes = createFiberFromTypeAndProps(
	                  newChild.type,
	                  newChild.key,
	                  newChild.props,
	                  null,
	                  returnFiber.mode,
	                  lanes
	                )),
	                coerceRef(lanes, newChild),
	                (lanes.return = returnFiber),
	                (returnFiber = lanes));
	          }
	          return placeSingleChild(returnFiber);
	        case REACT_PORTAL_TYPE:
	          a: {
	            for (key = newChild.key; null !== currentFirstChild; ) {
	              if (currentFirstChild.key === key)
	                if (
	                  4 === currentFirstChild.tag &&
	                  currentFirstChild.stateNode.containerInfo ===
	                    newChild.containerInfo &&
	                  currentFirstChild.stateNode.implementation ===
	                    newChild.implementation
	                ) {
	                  deleteRemainingChildren(
	                    returnFiber,
	                    currentFirstChild.sibling
	                  );
	                  lanes = useFiber(currentFirstChild, newChild.children || []);
	                  lanes.return = returnFiber;
	                  returnFiber = lanes;
	                  break a;
	                } else {
	                  deleteRemainingChildren(returnFiber, currentFirstChild);
	                  break;
	                }
	              else deleteChild(returnFiber, currentFirstChild);
	              currentFirstChild = currentFirstChild.sibling;
	            }
	            lanes = createFiberFromPortal(newChild, returnFiber.mode, lanes);
	            lanes.return = returnFiber;
	            returnFiber = lanes;
	          }
	          return placeSingleChild(returnFiber);
	        case REACT_LAZY_TYPE:
	          return (
	            (key = newChild._init),
	            (newChild = key(newChild._payload)),
	            reconcileChildFibersImpl(
	              returnFiber,
	              currentFirstChild,
	              newChild,
	              lanes
	            )
	          );
	      }
	      if (isArrayImpl(newChild))
	        return reconcileChildrenArray(
	          returnFiber,
	          currentFirstChild,
	          newChild,
	          lanes
	        );
	      if (getIteratorFn(newChild)) {
	        key = getIteratorFn(newChild);
	        if ("function" !== typeof key) throw Error(formatProdErrorMessage(150));
	        newChild = key.call(newChild);
	        return reconcileChildrenIterator(
	          returnFiber,
	          currentFirstChild,
	          newChild,
	          lanes
	        );
	      }
	      if ("function" === typeof newChild.then)
	        return reconcileChildFibersImpl(
	          returnFiber,
	          currentFirstChild,
	          unwrapThenable(newChild),
	          lanes
	        );
	      if (newChild.$$typeof === REACT_CONTEXT_TYPE)
	        return reconcileChildFibersImpl(
	          returnFiber,
	          currentFirstChild,
	          readContextDuringReconciliation(returnFiber, newChild),
	          lanes
	        );
	      throwOnInvalidObjectType(returnFiber, newChild);
	    }
	    return ("string" === typeof newChild && "" !== newChild) ||
	      "number" === typeof newChild ||
	      "bigint" === typeof newChild
	      ? ((newChild = "" + newChild),
	        null !== currentFirstChild && 6 === currentFirstChild.tag
	          ? (deleteRemainingChildren(returnFiber, currentFirstChild.sibling),
	            (lanes = useFiber(currentFirstChild, newChild)),
	            (lanes.return = returnFiber),
	            (returnFiber = lanes))
	          : (deleteRemainingChildren(returnFiber, currentFirstChild),
	            (lanes = createFiberFromText(newChild, returnFiber.mode, lanes)),
	            (lanes.return = returnFiber),
	            (returnFiber = lanes)),
	        placeSingleChild(returnFiber))
	      : deleteRemainingChildren(returnFiber, currentFirstChild);
	  }
	  return function (returnFiber, currentFirstChild, newChild, lanes) {
	    try {
	      thenableIndexCounter$1 = 0;
	      var firstChildFiber = reconcileChildFibersImpl(
	        returnFiber,
	        currentFirstChild,
	        newChild,
	        lanes
	      );
	      thenableState$1 = null;
	      return firstChildFiber;
	    } catch (x) {
	      if (x === SuspenseException) throw x;
	      var fiber = createFiberImplClass(29, x, null, returnFiber.mode);
	      fiber.lanes = lanes;
	      fiber.return = returnFiber;
	      return fiber;
	    } finally {
	    }
	  };
	}
	var reconcileChildFibers = createChildReconciler(true),
	  mountChildFibers = createChildReconciler(false),
	  currentTreeHiddenStackCursor = createCursor(null),
	  prevEntangledRenderLanesCursor = createCursor(0);
	function pushHiddenContext(fiber, context) {
	  fiber = entangledRenderLanes;
	  push(prevEntangledRenderLanesCursor, fiber);
	  push(currentTreeHiddenStackCursor, context);
	  entangledRenderLanes = fiber | context.baseLanes;
	}
	function reuseHiddenContextOnStack() {
	  push(prevEntangledRenderLanesCursor, entangledRenderLanes);
	  push(currentTreeHiddenStackCursor, currentTreeHiddenStackCursor.current);
	}
	function popHiddenContext() {
	  entangledRenderLanes = prevEntangledRenderLanesCursor.current;
	  pop(currentTreeHiddenStackCursor);
	  pop(prevEntangledRenderLanesCursor);
	}
	var suspenseHandlerStackCursor = createCursor(null),
	  shellBoundary = null;
	function pushPrimaryTreeSuspenseHandler(handler) {
	  var current = handler.alternate;
	  push(suspenseStackCursor, suspenseStackCursor.current & 1);
	  push(suspenseHandlerStackCursor, handler);
	  null === shellBoundary &&
	    (null === current || null !== currentTreeHiddenStackCursor.current
	      ? (shellBoundary = handler)
	      : null !== current.memoizedState && (shellBoundary = handler));
	}
	function pushOffscreenSuspenseHandler(fiber) {
	  if (22 === fiber.tag) {
	    if (
	      (push(suspenseStackCursor, suspenseStackCursor.current),
	      push(suspenseHandlerStackCursor, fiber),
	      null === shellBoundary)
	    ) {
	      var current = fiber.alternate;
	      null !== current &&
	        null !== current.memoizedState &&
	        (shellBoundary = fiber);
	    }
	  } else reuseSuspenseHandlerOnStack();
	}
	function reuseSuspenseHandlerOnStack() {
	  push(suspenseStackCursor, suspenseStackCursor.current);
	  push(suspenseHandlerStackCursor, suspenseHandlerStackCursor.current);
	}
	function popSuspenseHandler(fiber) {
	  pop(suspenseHandlerStackCursor);
	  shellBoundary === fiber && (shellBoundary = null);
	  pop(suspenseStackCursor);
	}
	var suspenseStackCursor = createCursor(0);
	function findFirstSuspended(row) {
	  for (var node = row; null !== node; ) {
	    if (13 === node.tag) {
	      var state = node.memoizedState;
	      if (
	        null !== state &&
	        ((state = state.dehydrated),
	        null === state || "$?" === state.data || "$!" === state.data)
	      )
	        return node;
	    } else if (19 === node.tag && void 0 !== node.memoizedProps.revealOrder) {
	      if (0 !== (node.flags & 128)) return node;
	    } else if (null !== node.child) {
	      node.child.return = node;
	      node = node.child;
	      continue;
	    }
	    if (node === row) break;
	    for (; null === node.sibling; ) {
	      if (null === node.return || node.return === row) return null;
	      node = node.return;
	    }
	    node.sibling.return = node.return;
	    node = node.sibling;
	  }
	  return null;
	}
	var AbortControllerLocal =
	    "undefined" !== typeof AbortController
	      ? AbortController
	      : function () {
	          var listeners = [],
	            signal = (this.signal = {
	              aborted: false,
	              addEventListener: function (type, listener) {
	                listeners.push(listener);
	              }
	            });
	          this.abort = function () {
	            signal.aborted = true;
	            listeners.forEach(function (listener) {
	              return listener();
	            });
	          };
	        },
	  scheduleCallback$2 = Scheduler.unstable_scheduleCallback,
	  NormalPriority = Scheduler.unstable_NormalPriority,
	  CacheContext = {
	    $$typeof: REACT_CONTEXT_TYPE,
	    Consumer: null,
	    Provider: null,
	    _currentValue: null,
	    _currentValue2: null,
	    _threadCount: 0
	  };
	function createCache() {
	  return {
	    controller: new AbortControllerLocal(),
	    data: new Map(),
	    refCount: 0
	  };
	}
	function releaseCache(cache) {
	  cache.refCount--;
	  0 === cache.refCount &&
	    scheduleCallback$2(NormalPriority, function () {
	      cache.controller.abort();
	    });
	}
	var currentEntangledListeners = null,
	  currentEntangledPendingCount = 0,
	  currentEntangledLane = 0,
	  currentEntangledActionThenable = null;
	function entangleAsyncAction(transition, thenable) {
	  if (null === currentEntangledListeners) {
	    var entangledListeners = (currentEntangledListeners = []);
	    currentEntangledPendingCount = 0;
	    currentEntangledLane = requestTransitionLane();
	    currentEntangledActionThenable = {
	      status: "pending",
	      value: void 0,
	      then: function (resolve) {
	        entangledListeners.push(resolve);
	      }
	    };
	  }
	  currentEntangledPendingCount++;
	  thenable.then(pingEngtangledActionScope, pingEngtangledActionScope);
	  return thenable;
	}
	function pingEngtangledActionScope() {
	  if (
	    0 === --currentEntangledPendingCount &&
	    null !== currentEntangledListeners
	  ) {
	    null !== currentEntangledActionThenable &&
	      (currentEntangledActionThenable.status = "fulfilled");
	    var listeners = currentEntangledListeners;
	    currentEntangledListeners = null;
	    currentEntangledLane = 0;
	    currentEntangledActionThenable = null;
	    for (var i = 0; i < listeners.length; i++) (0, listeners[i])();
	  }
	}
	function chainThenableValue(thenable, result) {
	  var listeners = [],
	    thenableWithOverride = {
	      status: "pending",
	      value: null,
	      reason: null,
	      then: function (resolve) {
	        listeners.push(resolve);
	      }
	    };
	  thenable.then(
	    function () {
	      thenableWithOverride.status = "fulfilled";
	      thenableWithOverride.value = result;
	      for (var i = 0; i < listeners.length; i++) (0, listeners[i])(result);
	    },
	    function (error) {
	      thenableWithOverride.status = "rejected";
	      thenableWithOverride.reason = error;
	      for (error = 0; error < listeners.length; error++)
	        (0, listeners[error])(void 0);
	    }
	  );
	  return thenableWithOverride;
	}
	var prevOnStartTransitionFinish = ReactSharedInternals.S;
	ReactSharedInternals.S = function (transition, returnValue) {
	  "object" === typeof returnValue &&
	    null !== returnValue &&
	    "function" === typeof returnValue.then &&
	    entangleAsyncAction(transition, returnValue);
	  null !== prevOnStartTransitionFinish &&
	    prevOnStartTransitionFinish(transition, returnValue);
	};
	var resumedCache = createCursor(null);
	function peekCacheFromPool() {
	  var cacheResumedFromPreviousRender = resumedCache.current;
	  return null !== cacheResumedFromPreviousRender
	    ? cacheResumedFromPreviousRender
	    : workInProgressRoot.pooledCache;
	}
	function pushTransition(offscreenWorkInProgress, prevCachePool) {
	  null === prevCachePool
	    ? push(resumedCache, resumedCache.current)
	    : push(resumedCache, prevCachePool.pool);
	}
	function getSuspendedCache() {
	  var cacheFromPool = peekCacheFromPool();
	  return null === cacheFromPool
	    ? null
	    : { parent: CacheContext._currentValue, pool: cacheFromPool };
	}
	var renderLanes = 0,
	  currentlyRenderingFiber$1 = null,
	  currentHook = null,
	  workInProgressHook = null,
	  didScheduleRenderPhaseUpdate = false,
	  didScheduleRenderPhaseUpdateDuringThisPass = false,
	  shouldDoubleInvokeUserFnsInHooksDEV = false,
	  localIdCounter = 0,
	  thenableIndexCounter = 0,
	  thenableState = null,
	  globalClientIdCounter = 0;
	function throwInvalidHookError() {
	  throw Error(formatProdErrorMessage(321));
	}
	function areHookInputsEqual(nextDeps, prevDeps) {
	  if (null === prevDeps) return false;
	  for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++)
	    if (!objectIs(nextDeps[i], prevDeps[i])) return false;
	  return true;
	}
	function renderWithHooks(
	  current,
	  workInProgress,
	  Component,
	  props,
	  secondArg,
	  nextRenderLanes
	) {
	  renderLanes = nextRenderLanes;
	  currentlyRenderingFiber$1 = workInProgress;
	  workInProgress.memoizedState = null;
	  workInProgress.updateQueue = null;
	  workInProgress.lanes = 0;
	  ReactSharedInternals.H =
	    null === current || null === current.memoizedState
	      ? HooksDispatcherOnMount
	      : HooksDispatcherOnUpdate;
	  shouldDoubleInvokeUserFnsInHooksDEV = false;
	  nextRenderLanes = Component(props, secondArg);
	  shouldDoubleInvokeUserFnsInHooksDEV = false;
	  didScheduleRenderPhaseUpdateDuringThisPass &&
	    (nextRenderLanes = renderWithHooksAgain(
	      workInProgress,
	      Component,
	      props,
	      secondArg
	    ));
	  finishRenderingHooks(current);
	  return nextRenderLanes;
	}
	function finishRenderingHooks(current) {
	  ReactSharedInternals.H = ContextOnlyDispatcher;
	  var didRenderTooFewHooks = null !== currentHook && null !== currentHook.next;
	  renderLanes = 0;
	  workInProgressHook = currentHook = currentlyRenderingFiber$1 = null;
	  didScheduleRenderPhaseUpdate = false;
	  thenableIndexCounter = 0;
	  thenableState = null;
	  if (didRenderTooFewHooks) throw Error(formatProdErrorMessage(300));
	  null === current ||
	    didReceiveUpdate ||
	    ((current = current.dependencies),
	    null !== current &&
	      checkIfContextChanged(current) &&
	      (didReceiveUpdate = true));
	}
	function renderWithHooksAgain(workInProgress, Component, props, secondArg) {
	  currentlyRenderingFiber$1 = workInProgress;
	  var numberOfReRenders = 0;
	  do {
	    didScheduleRenderPhaseUpdateDuringThisPass && (thenableState = null);
	    thenableIndexCounter = 0;
	    didScheduleRenderPhaseUpdateDuringThisPass = false;
	    if (25 <= numberOfReRenders) throw Error(formatProdErrorMessage(301));
	    numberOfReRenders += 1;
	    workInProgressHook = currentHook = null;
	    if (null != workInProgress.updateQueue) {
	      var children = workInProgress.updateQueue;
	      children.lastEffect = null;
	      children.events = null;
	      children.stores = null;
	      null != children.memoCache && (children.memoCache.index = 0);
	    }
	    ReactSharedInternals.H = HooksDispatcherOnRerender;
	    children = Component(props, secondArg);
	  } while (didScheduleRenderPhaseUpdateDuringThisPass);
	  return children;
	}
	function TransitionAwareHostComponent() {
	  var dispatcher = ReactSharedInternals.H,
	    maybeThenable = dispatcher.useState()[0];
	  maybeThenable =
	    "function" === typeof maybeThenable.then
	      ? useThenable(maybeThenable)
	      : maybeThenable;
	  dispatcher = dispatcher.useState()[0];
	  (null !== currentHook ? currentHook.memoizedState : null) !== dispatcher &&
	    (currentlyRenderingFiber$1.flags |= 1024);
	  return maybeThenable;
	}
	function checkDidRenderIdHook() {
	  var didRenderIdHook = 0 !== localIdCounter;
	  localIdCounter = 0;
	  return didRenderIdHook;
	}
	function bailoutHooks(current, workInProgress, lanes) {
	  workInProgress.updateQueue = current.updateQueue;
	  workInProgress.flags &= -2053;
	  current.lanes &= ~lanes;
	}
	function resetHooksOnUnwind(workInProgress) {
	  if (didScheduleRenderPhaseUpdate) {
	    for (
	      workInProgress = workInProgress.memoizedState;
	      null !== workInProgress;

	    ) {
	      var queue = workInProgress.queue;
	      null !== queue && (queue.pending = null);
	      workInProgress = workInProgress.next;
	    }
	    didScheduleRenderPhaseUpdate = false;
	  }
	  renderLanes = 0;
	  workInProgressHook = currentHook = currentlyRenderingFiber$1 = null;
	  didScheduleRenderPhaseUpdateDuringThisPass = false;
	  thenableIndexCounter = localIdCounter = 0;
	  thenableState = null;
	}
	function mountWorkInProgressHook() {
	  var hook = {
	    memoizedState: null,
	    baseState: null,
	    baseQueue: null,
	    queue: null,
	    next: null
	  };
	  null === workInProgressHook
	    ? (currentlyRenderingFiber$1.memoizedState = workInProgressHook = hook)
	    : (workInProgressHook = workInProgressHook.next = hook);
	  return workInProgressHook;
	}
	function updateWorkInProgressHook() {
	  if (null === currentHook) {
	    var nextCurrentHook = currentlyRenderingFiber$1.alternate;
	    nextCurrentHook =
	      null !== nextCurrentHook ? nextCurrentHook.memoizedState : null;
	  } else nextCurrentHook = currentHook.next;
	  var nextWorkInProgressHook =
	    null === workInProgressHook
	      ? currentlyRenderingFiber$1.memoizedState
	      : workInProgressHook.next;
	  if (null !== nextWorkInProgressHook)
	    (workInProgressHook = nextWorkInProgressHook),
	      (currentHook = nextCurrentHook);
	  else {
	    if (null === nextCurrentHook) {
	      if (null === currentlyRenderingFiber$1.alternate)
	        throw Error(formatProdErrorMessage(467));
	      throw Error(formatProdErrorMessage(310));
	    }
	    currentHook = nextCurrentHook;
	    nextCurrentHook = {
	      memoizedState: currentHook.memoizedState,
	      baseState: currentHook.baseState,
	      baseQueue: currentHook.baseQueue,
	      queue: currentHook.queue,
	      next: null
	    };
	    null === workInProgressHook
	      ? (currentlyRenderingFiber$1.memoizedState = workInProgressHook =
	          nextCurrentHook)
	      : (workInProgressHook = workInProgressHook.next = nextCurrentHook);
	  }
	  return workInProgressHook;
	}
	var createFunctionComponentUpdateQueue;
	createFunctionComponentUpdateQueue = function () {
	  return { lastEffect: null, events: null, stores: null, memoCache: null };
	};
	function useThenable(thenable) {
	  var index = thenableIndexCounter;
	  thenableIndexCounter += 1;
	  null === thenableState && (thenableState = []);
	  thenable = trackUsedThenable(thenableState, thenable, index);
	  index = currentlyRenderingFiber$1;
	  null ===
	    (null === workInProgressHook
	      ? index.memoizedState
	      : workInProgressHook.next) &&
	    ((index = index.alternate),
	    (ReactSharedInternals.H =
	      null === index || null === index.memoizedState
	        ? HooksDispatcherOnMount
	        : HooksDispatcherOnUpdate));
	  return thenable;
	}
	function use(usable) {
	  if (null !== usable && "object" === typeof usable) {
	    if ("function" === typeof usable.then) return useThenable(usable);
	    if (usable.$$typeof === REACT_CONTEXT_TYPE) return readContext(usable);
	  }
	  throw Error(formatProdErrorMessage(438, String(usable)));
	}
	function useMemoCache(size) {
	  var memoCache = null,
	    updateQueue = currentlyRenderingFiber$1.updateQueue;
	  null !== updateQueue && (memoCache = updateQueue.memoCache);
	  if (null == memoCache) {
	    var current = currentlyRenderingFiber$1.alternate;
	    null !== current &&
	      ((current = current.updateQueue),
	      null !== current &&
	        ((current = current.memoCache),
	        null != current &&
	          (memoCache = {
	            data: current.data.map(function (array) {
	              return array.slice();
	            }),
	            index: 0
	          })));
	  }
	  null == memoCache && (memoCache = { data: [], index: 0 });
	  null === updateQueue &&
	    ((updateQueue = createFunctionComponentUpdateQueue()),
	    (currentlyRenderingFiber$1.updateQueue = updateQueue));
	  updateQueue.memoCache = memoCache;
	  updateQueue = memoCache.data[memoCache.index];
	  if (void 0 === updateQueue)
	    for (
	      updateQueue = memoCache.data[memoCache.index] = Array(size), current = 0;
	      current < size;
	      current++
	    )
	      updateQueue[current] = REACT_MEMO_CACHE_SENTINEL;
	  memoCache.index++;
	  return updateQueue;
	}
	function basicStateReducer(state, action) {
	  return "function" === typeof action ? action(state) : action;
	}
	function updateReducer(reducer) {
	  var hook = updateWorkInProgressHook();
	  return updateReducerImpl(hook, currentHook, reducer);
	}
	function updateReducerImpl(hook, current, reducer) {
	  var queue = hook.queue;
	  if (null === queue) throw Error(formatProdErrorMessage(311));
	  queue.lastRenderedReducer = reducer;
	  var baseQueue = hook.baseQueue,
	    pendingQueue = queue.pending;
	  if (null !== pendingQueue) {
	    if (null !== baseQueue) {
	      var baseFirst = baseQueue.next;
	      baseQueue.next = pendingQueue.next;
	      pendingQueue.next = baseFirst;
	    }
	    current.baseQueue = baseQueue = pendingQueue;
	    queue.pending = null;
	  }
	  pendingQueue = hook.baseState;
	  if (null === baseQueue) hook.memoizedState = pendingQueue;
	  else {
	    current = baseQueue.next;
	    var newBaseQueueFirst = (baseFirst = null),
	      newBaseQueueLast = null,
	      update = current,
	      didReadFromEntangledAsyncAction$54 = false;
	    do {
	      var updateLane = update.lane & -536870913;
	      if (
	        updateLane !== update.lane
	          ? (workInProgressRootRenderLanes & updateLane) === updateLane
	          : (renderLanes & updateLane) === updateLane
	      ) {
	        var revertLane = update.revertLane;
	        if (0 === revertLane)
	          null !== newBaseQueueLast &&
	            (newBaseQueueLast = newBaseQueueLast.next =
	              {
	                lane: 0,
	                revertLane: 0,
	                action: update.action,
	                hasEagerState: update.hasEagerState,
	                eagerState: update.eagerState,
	                next: null
	              }),
	            updateLane === currentEntangledLane &&
	              (didReadFromEntangledAsyncAction$54 = true);
	        else if ((renderLanes & revertLane) === revertLane) {
	          update = update.next;
	          revertLane === currentEntangledLane &&
	            (didReadFromEntangledAsyncAction$54 = true);
	          continue;
	        } else
	          (updateLane = {
	            lane: 0,
	            revertLane: update.revertLane,
	            action: update.action,
	            hasEagerState: update.hasEagerState,
	            eagerState: update.eagerState,
	            next: null
	          }),
	            null === newBaseQueueLast
	              ? ((newBaseQueueFirst = newBaseQueueLast = updateLane),
	                (baseFirst = pendingQueue))
	              : (newBaseQueueLast = newBaseQueueLast.next = updateLane),
	            (currentlyRenderingFiber$1.lanes |= revertLane),
	            (workInProgressRootSkippedLanes |= revertLane);
	        updateLane = update.action;
	        shouldDoubleInvokeUserFnsInHooksDEV &&
	          reducer(pendingQueue, updateLane);
	        pendingQueue = update.hasEagerState
	          ? update.eagerState
	          : reducer(pendingQueue, updateLane);
	      } else
	        (revertLane = {
	          lane: updateLane,
	          revertLane: update.revertLane,
	          action: update.action,
	          hasEagerState: update.hasEagerState,
	          eagerState: update.eagerState,
	          next: null
	        }),
	          null === newBaseQueueLast
	            ? ((newBaseQueueFirst = newBaseQueueLast = revertLane),
	              (baseFirst = pendingQueue))
	            : (newBaseQueueLast = newBaseQueueLast.next = revertLane),
	          (currentlyRenderingFiber$1.lanes |= updateLane),
	          (workInProgressRootSkippedLanes |= updateLane);
	      update = update.next;
	    } while (null !== update && update !== current);
	    null === newBaseQueueLast
	      ? (baseFirst = pendingQueue)
	      : (newBaseQueueLast.next = newBaseQueueFirst);
	    if (
	      !objectIs(pendingQueue, hook.memoizedState) &&
	      ((didReceiveUpdate = true),
	      didReadFromEntangledAsyncAction$54 &&
	        ((reducer = currentEntangledActionThenable), null !== reducer))
	    )
	      throw reducer;
	    hook.memoizedState = pendingQueue;
	    hook.baseState = baseFirst;
	    hook.baseQueue = newBaseQueueLast;
	    queue.lastRenderedState = pendingQueue;
	  }
	  null === baseQueue && (queue.lanes = 0);
	  return [hook.memoizedState, queue.dispatch];
	}
	function rerenderReducer(reducer) {
	  var hook = updateWorkInProgressHook(),
	    queue = hook.queue;
	  if (null === queue) throw Error(formatProdErrorMessage(311));
	  queue.lastRenderedReducer = reducer;
	  var dispatch = queue.dispatch,
	    lastRenderPhaseUpdate = queue.pending,
	    newState = hook.memoizedState;
	  if (null !== lastRenderPhaseUpdate) {
	    queue.pending = null;
	    var update = (lastRenderPhaseUpdate = lastRenderPhaseUpdate.next);
	    do (newState = reducer(newState, update.action)), (update = update.next);
	    while (update !== lastRenderPhaseUpdate);
	    objectIs(newState, hook.memoizedState) || (didReceiveUpdate = true);
	    hook.memoizedState = newState;
	    null === hook.baseQueue && (hook.baseState = newState);
	    queue.lastRenderedState = newState;
	  }
	  return [newState, dispatch];
	}
	function updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
	  var fiber = currentlyRenderingFiber$1,
	    hook = updateWorkInProgressHook(),
	    isHydrating$jscomp$0 = isHydrating;
	  if (isHydrating$jscomp$0) {
	    if (void 0 === getServerSnapshot) throw Error(formatProdErrorMessage(407));
	    getServerSnapshot = getServerSnapshot();
	  } else getServerSnapshot = getSnapshot();
	  var snapshotChanged = !objectIs(
	    (currentHook || hook).memoizedState,
	    getServerSnapshot
	  );
	  snapshotChanged &&
	    ((hook.memoizedState = getServerSnapshot), (didReceiveUpdate = true));
	  hook = hook.queue;
	  updateEffect(subscribeToStore.bind(null, fiber, hook, subscribe), [
	    subscribe
	  ]);
	  if (
	    hook.getSnapshot !== getSnapshot ||
	    snapshotChanged ||
	    (null !== workInProgressHook && workInProgressHook.memoizedState.tag & 1)
	  ) {
	    fiber.flags |= 2048;
	    pushEffect(
	      9,
	      updateStoreInstance.bind(
	        null,
	        fiber,
	        hook,
	        getServerSnapshot,
	        getSnapshot
	      ),
	      { destroy: void 0 },
	      null
	    );
	    if (null === workInProgressRoot) throw Error(formatProdErrorMessage(349));
	    isHydrating$jscomp$0 ||
	      0 !== (renderLanes & 60) ||
	      pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
	  }
	  return getServerSnapshot;
	}
	function pushStoreConsistencyCheck(fiber, getSnapshot, renderedSnapshot) {
	  fiber.flags |= 16384;
	  fiber = { getSnapshot: getSnapshot, value: renderedSnapshot };
	  getSnapshot = currentlyRenderingFiber$1.updateQueue;
	  null === getSnapshot
	    ? ((getSnapshot = createFunctionComponentUpdateQueue()),
	      (currentlyRenderingFiber$1.updateQueue = getSnapshot),
	      (getSnapshot.stores = [fiber]))
	    : ((renderedSnapshot = getSnapshot.stores),
	      null === renderedSnapshot
	        ? (getSnapshot.stores = [fiber])
	        : renderedSnapshot.push(fiber));
	}
	function updateStoreInstance(fiber, inst, nextSnapshot, getSnapshot) {
	  inst.value = nextSnapshot;
	  inst.getSnapshot = getSnapshot;
	  checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
	}
	function subscribeToStore(fiber, inst, subscribe) {
	  return subscribe(function () {
	    checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
	  });
	}
	function checkIfSnapshotChanged(inst) {
	  var latestGetSnapshot = inst.getSnapshot;
	  inst = inst.value;
	  try {
	    var nextValue = latestGetSnapshot();
	    return !objectIs(inst, nextValue);
	  } catch (error) {
	    return true;
	  }
	}
	function forceStoreRerender(fiber) {
	  var root = enqueueConcurrentRenderForLane(fiber, 2);
	  null !== root && scheduleUpdateOnFiber(root, fiber, 2);
	}
	function mountStateImpl(initialState) {
	  var hook = mountWorkInProgressHook();
	  if ("function" === typeof initialState) {
	    var initialStateInitializer = initialState;
	    initialState = initialStateInitializer();
	    if (shouldDoubleInvokeUserFnsInHooksDEV) {
	      setIsStrictModeForDevtools(true);
	      try {
	        initialStateInitializer();
	      } finally {
	        setIsStrictModeForDevtools(false);
	      }
	    }
	  }
	  hook.memoizedState = hook.baseState = initialState;
	  hook.queue = {
	    pending: null,
	    lanes: 0,
	    dispatch: null,
	    lastRenderedReducer: basicStateReducer,
	    lastRenderedState: initialState
	  };
	  return hook;
	}
	function updateOptimisticImpl(hook, current, passthrough, reducer) {
	  hook.baseState = passthrough;
	  return updateReducerImpl(
	    hook,
	    currentHook,
	    "function" === typeof reducer ? reducer : basicStateReducer
	  );
	}
	function dispatchActionState(
	  fiber,
	  actionQueue,
	  setPendingState,
	  setState,
	  payload
	) {
	  if (isRenderPhaseUpdate(fiber)) throw Error(formatProdErrorMessage(485));
	  fiber = actionQueue.action;
	  if (null !== fiber) {
	    var actionNode = {
	      payload: payload,
	      action: fiber,
	      next: null,
	      isTransition: true,
	      status: "pending",
	      value: null,
	      reason: null,
	      listeners: [],
	      then: function (listener) {
	        actionNode.listeners.push(listener);
	      }
	    };
	    null !== ReactSharedInternals.T
	      ? setPendingState(true)
	      : (actionNode.isTransition = false);
	    setState(actionNode);
	    setPendingState = actionQueue.pending;
	    null === setPendingState
	      ? ((actionNode.next = actionQueue.pending = actionNode),
	        runActionStateAction(actionQueue, actionNode))
	      : ((actionNode.next = setPendingState.next),
	        (actionQueue.pending = setPendingState.next = actionNode));
	  }
	}
	function runActionStateAction(actionQueue, node) {
	  var action = node.action,
	    payload = node.payload,
	    prevState = actionQueue.state;
	  if (node.isTransition) {
	    var prevTransition = ReactSharedInternals.T,
	      currentTransition = {};
	    ReactSharedInternals.T = currentTransition;
	    try {
	      var returnValue = action(prevState, payload),
	        onStartTransitionFinish = ReactSharedInternals.S;
	      null !== onStartTransitionFinish &&
	        onStartTransitionFinish(currentTransition, returnValue);
	      handleActionReturnValue(actionQueue, node, returnValue);
	    } catch (error) {
	      onActionError(actionQueue, node, error);
	    } finally {
	      ReactSharedInternals.T = prevTransition;
	    }
	  } else
	    try {
	      (prevTransition = action(prevState, payload)),
	        handleActionReturnValue(actionQueue, node, prevTransition);
	    } catch (error$60) {
	      onActionError(actionQueue, node, error$60);
	    }
	}
	function handleActionReturnValue(actionQueue, node, returnValue) {
	  null !== returnValue &&
	  "object" === typeof returnValue &&
	  "function" === typeof returnValue.then
	    ? returnValue.then(
	        function (nextState) {
	          onActionSuccess(actionQueue, node, nextState);
	        },
	        function (error) {
	          return onActionError(actionQueue, node, error);
	        }
	      )
	    : onActionSuccess(actionQueue, node, returnValue);
	}
	function onActionSuccess(actionQueue, actionNode, nextState) {
	  actionNode.status = "fulfilled";
	  actionNode.value = nextState;
	  notifyActionListeners(actionNode);
	  actionQueue.state = nextState;
	  actionNode = actionQueue.pending;
	  null !== actionNode &&
	    ((nextState = actionNode.next),
	    nextState === actionNode
	      ? (actionQueue.pending = null)
	      : ((nextState = nextState.next),
	        (actionNode.next = nextState),
	        runActionStateAction(actionQueue, nextState)));
	}
	function onActionError(actionQueue, actionNode, error) {
	  var last = actionQueue.pending;
	  actionQueue.pending = null;
	  if (null !== last) {
	    last = last.next;
	    do
	      (actionNode.status = "rejected"),
	        (actionNode.reason = error),
	        notifyActionListeners(actionNode),
	        (actionNode = actionNode.next);
	    while (actionNode !== last);
	  }
	  actionQueue.action = null;
	}
	function notifyActionListeners(actionNode) {
	  actionNode = actionNode.listeners;
	  for (var i = 0; i < actionNode.length; i++) (0, actionNode[i])();
	}
	function actionStateReducer(oldState, newState) {
	  return newState;
	}
	function mountActionState(action, initialStateProp) {
	  if (isHydrating) {
	    var ssrFormState = workInProgressRoot.formState;
	    if (null !== ssrFormState) {
	      a: {
	        var JSCompiler_inline_result = currentlyRenderingFiber$1;
	        if (isHydrating) {
	          if (nextHydratableInstance) {
	            b: {
	              var JSCompiler_inline_result$jscomp$0 = nextHydratableInstance;
	              for (
	                var inRootOrSingleton = rootOrSingletonContext;
	                8 !== JSCompiler_inline_result$jscomp$0.nodeType;

	              ) {
	                if (!inRootOrSingleton) {
	                  JSCompiler_inline_result$jscomp$0 = null;
	                  break b;
	                }
	                JSCompiler_inline_result$jscomp$0 = getNextHydratable(
	                  JSCompiler_inline_result$jscomp$0.nextSibling
	                );
	                if (null === JSCompiler_inline_result$jscomp$0) {
	                  JSCompiler_inline_result$jscomp$0 = null;
	                  break b;
	                }
	              }
	              inRootOrSingleton = JSCompiler_inline_result$jscomp$0.data;
	              JSCompiler_inline_result$jscomp$0 =
	                "F!" === inRootOrSingleton || "F" === inRootOrSingleton
	                  ? JSCompiler_inline_result$jscomp$0
	                  : null;
	            }
	            if (JSCompiler_inline_result$jscomp$0) {
	              nextHydratableInstance = getNextHydratable(
	                JSCompiler_inline_result$jscomp$0.nextSibling
	              );
	              JSCompiler_inline_result =
	                "F!" === JSCompiler_inline_result$jscomp$0.data;
	              break a;
	            }
	          }
	          throwOnHydrationMismatch(JSCompiler_inline_result);
	        }
	        JSCompiler_inline_result = false;
	      }
	      JSCompiler_inline_result && (initialStateProp = ssrFormState[0]);
	    }
	  }
	  ssrFormState = mountWorkInProgressHook();
	  ssrFormState.memoizedState = ssrFormState.baseState = initialStateProp;
	  JSCompiler_inline_result = {
	    pending: null,
	    lanes: 0,
	    dispatch: null,
	    lastRenderedReducer: actionStateReducer,
	    lastRenderedState: initialStateProp
	  };
	  ssrFormState.queue = JSCompiler_inline_result;
	  ssrFormState = dispatchSetState.bind(
	    null,
	    currentlyRenderingFiber$1,
	    JSCompiler_inline_result
	  );
	  JSCompiler_inline_result.dispatch = ssrFormState;
	  JSCompiler_inline_result = mountStateImpl(false);
	  inRootOrSingleton = dispatchOptimisticSetState.bind(
	    null,
	    currentlyRenderingFiber$1,
	    false,
	    JSCompiler_inline_result.queue
	  );
	  JSCompiler_inline_result = mountWorkInProgressHook();
	  JSCompiler_inline_result$jscomp$0 = {
	    state: initialStateProp,
	    dispatch: null,
	    action: action,
	    pending: null
	  };
	  JSCompiler_inline_result.queue = JSCompiler_inline_result$jscomp$0;
	  ssrFormState = dispatchActionState.bind(
	    null,
	    currentlyRenderingFiber$1,
	    JSCompiler_inline_result$jscomp$0,
	    inRootOrSingleton,
	    ssrFormState
	  );
	  JSCompiler_inline_result$jscomp$0.dispatch = ssrFormState;
	  JSCompiler_inline_result.memoizedState = action;
	  return [initialStateProp, ssrFormState, false];
	}
	function updateActionState(action) {
	  var stateHook = updateWorkInProgressHook();
	  return updateActionStateImpl(stateHook, currentHook, action);
	}
	function updateActionStateImpl(stateHook, currentStateHook, action) {
	  currentStateHook = updateReducerImpl(
	    stateHook,
	    currentStateHook,
	    actionStateReducer
	  )[0];
	  stateHook = updateReducer(basicStateReducer)[0];
	  currentStateHook =
	    "object" === typeof currentStateHook &&
	    null !== currentStateHook &&
	    "function" === typeof currentStateHook.then
	      ? useThenable(currentStateHook)
	      : currentStateHook;
	  var actionQueueHook = updateWorkInProgressHook(),
	    actionQueue = actionQueueHook.queue,
	    dispatch = actionQueue.dispatch;
	  action !== actionQueueHook.memoizedState &&
	    ((currentlyRenderingFiber$1.flags |= 2048),
	    pushEffect(
	      9,
	      actionStateActionEffect.bind(null, actionQueue, action),
	      { destroy: void 0 },
	      null
	    ));
	  return [currentStateHook, dispatch, stateHook];
	}
	function actionStateActionEffect(actionQueue, action) {
	  actionQueue.action = action;
	}
	function rerenderActionState(action) {
	  var stateHook = updateWorkInProgressHook(),
	    currentStateHook = currentHook;
	  if (null !== currentStateHook)
	    return updateActionStateImpl(stateHook, currentStateHook, action);
	  updateWorkInProgressHook();
	  stateHook = stateHook.memoizedState;
	  currentStateHook = updateWorkInProgressHook();
	  var dispatch = currentStateHook.queue.dispatch;
	  currentStateHook.memoizedState = action;
	  return [stateHook, dispatch, false];
	}
	function pushEffect(tag, create, inst, deps) {
	  tag = { tag: tag, create: create, inst: inst, deps: deps, next: null };
	  create = currentlyRenderingFiber$1.updateQueue;
	  null === create &&
	    ((create = createFunctionComponentUpdateQueue()),
	    (currentlyRenderingFiber$1.updateQueue = create));
	  inst = create.lastEffect;
	  null === inst
	    ? (create.lastEffect = tag.next = tag)
	    : ((deps = inst.next),
	      (inst.next = tag),
	      (tag.next = deps),
	      (create.lastEffect = tag));
	  return tag;
	}
	function updateRef() {
	  return updateWorkInProgressHook().memoizedState;
	}
	function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
	  var hook = mountWorkInProgressHook();
	  currentlyRenderingFiber$1.flags |= fiberFlags;
	  hook.memoizedState = pushEffect(
	    1 | hookFlags,
	    create,
	    { destroy: void 0 },
	    void 0 === deps ? null : deps
	  );
	}
	function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
	  var hook = updateWorkInProgressHook();
	  deps = void 0 === deps ? null : deps;
	  var inst = hook.memoizedState.inst;
	  null !== currentHook &&
	  null !== deps &&
	  areHookInputsEqual(deps, currentHook.memoizedState.deps)
	    ? (hook.memoizedState = pushEffect(hookFlags, create, inst, deps))
	    : ((currentlyRenderingFiber$1.flags |= fiberFlags),
	      (hook.memoizedState = pushEffect(1 | hookFlags, create, inst, deps)));
	}
	function mountEffect(create, deps) {
	  mountEffectImpl(8390656, 8, create, deps);
	}
	function updateEffect(create, deps) {
	  updateEffectImpl(2048, 8, create, deps);
	}
	function updateInsertionEffect(create, deps) {
	  return updateEffectImpl(4, 2, create, deps);
	}
	function updateLayoutEffect(create, deps) {
	  return updateEffectImpl(4, 4, create, deps);
	}
	function imperativeHandleEffect(create, ref) {
	  if ("function" === typeof ref) {
	    create = create();
	    var refCleanup = ref(create);
	    return function () {
	      "function" === typeof refCleanup ? refCleanup() : ref(null);
	    };
	  }
	  if (null !== ref && void 0 !== ref)
	    return (
	      (create = create()),
	      (ref.current = create),
	      function () {
	        ref.current = null;
	      }
	    );
	}
	function updateImperativeHandle(ref, create, deps) {
	  deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
	  updateEffectImpl(4, 4, imperativeHandleEffect.bind(null, create, ref), deps);
	}
	function mountDebugValue() {}
	function updateCallback(callback, deps) {
	  var hook = updateWorkInProgressHook();
	  deps = void 0 === deps ? null : deps;
	  var prevState = hook.memoizedState;
	  if (null !== deps && areHookInputsEqual(deps, prevState[1]))
	    return prevState[0];
	  hook.memoizedState = [callback, deps];
	  return callback;
	}
	function updateMemo(nextCreate, deps) {
	  var hook = updateWorkInProgressHook();
	  deps = void 0 === deps ? null : deps;
	  var prevState = hook.memoizedState;
	  if (null !== deps && areHookInputsEqual(deps, prevState[1]))
	    return prevState[0];
	  prevState = nextCreate();
	  if (shouldDoubleInvokeUserFnsInHooksDEV) {
	    setIsStrictModeForDevtools(true);
	    try {
	      nextCreate();
	    } finally {
	      setIsStrictModeForDevtools(false);
	    }
	  }
	  hook.memoizedState = [prevState, deps];
	  return prevState;
	}
	function mountDeferredValueImpl(hook, value, initialValue) {
	  if (void 0 === initialValue || 0 !== (renderLanes & 1073741824))
	    return (hook.memoizedState = value);
	  hook.memoizedState = initialValue;
	  hook = requestDeferredLane();
	  currentlyRenderingFiber$1.lanes |= hook;
	  workInProgressRootSkippedLanes |= hook;
	  return initialValue;
	}
	function updateDeferredValueImpl(hook, prevValue, value, initialValue) {
	  if (objectIs(value, prevValue)) return value;
	  if (null !== currentTreeHiddenStackCursor.current)
	    return (
	      (hook = mountDeferredValueImpl(hook, value, initialValue)),
	      objectIs(hook, prevValue) || (didReceiveUpdate = true),
	      hook
	    );
	  if (0 === (renderLanes & 42))
	    return (didReceiveUpdate = true), (hook.memoizedState = value);
	  hook = requestDeferredLane();
	  currentlyRenderingFiber$1.lanes |= hook;
	  workInProgressRootSkippedLanes |= hook;
	  return prevValue;
	}
	function startTransition(fiber, queue, pendingState, finishedState, callback) {
	  var previousPriority = ReactDOMSharedInternals.p;
	  ReactDOMSharedInternals.p =
	    0 !== previousPriority && 8 > previousPriority ? previousPriority : 8;
	  var prevTransition = ReactSharedInternals.T,
	    currentTransition = {};
	  ReactSharedInternals.T = currentTransition;
	  dispatchOptimisticSetState(fiber, false, queue, pendingState);
	  try {
	    var returnValue = callback(),
	      onStartTransitionFinish = ReactSharedInternals.S;
	    null !== onStartTransitionFinish &&
	      onStartTransitionFinish(currentTransition, returnValue);
	    if (
	      null !== returnValue &&
	      "object" === typeof returnValue &&
	      "function" === typeof returnValue.then
	    ) {
	      var thenableForFinishedState = chainThenableValue(
	        returnValue,
	        finishedState
	      );
	      dispatchSetStateInternal(
	        fiber,
	        queue,
	        thenableForFinishedState,
	        requestUpdateLane(fiber)
	      );
	    } else
	      dispatchSetStateInternal(
	        fiber,
	        queue,
	        finishedState,
	        requestUpdateLane(fiber)
	      );
	  } catch (error) {
	    dispatchSetStateInternal(
	      fiber,
	      queue,
	      { then: function () {}, status: "rejected", reason: error },
	      requestUpdateLane()
	    );
	  } finally {
	    (ReactDOMSharedInternals.p = previousPriority),
	      (ReactSharedInternals.T = prevTransition);
	  }
	}
	function noop$2() {}
	function startHostTransition(formFiber, pendingState, action, formData) {
	  if (5 !== formFiber.tag) throw Error(formatProdErrorMessage(476));
	  var queue = ensureFormComponentIsStateful(formFiber).queue;
	  startTransition(
	    formFiber,
	    queue,
	    pendingState,
	    sharedNotPendingObject,
	    null === action
	      ? noop$2
	      : function () {
	          requestFormReset$1(formFiber);
	          return action(formData);
	        }
	  );
	}
	function ensureFormComponentIsStateful(formFiber) {
	  var existingStateHook = formFiber.memoizedState;
	  if (null !== existingStateHook) return existingStateHook;
	  existingStateHook = {
	    memoizedState: sharedNotPendingObject,
	    baseState: sharedNotPendingObject,
	    baseQueue: null,
	    queue: {
	      pending: null,
	      lanes: 0,
	      dispatch: null,
	      lastRenderedReducer: basicStateReducer,
	      lastRenderedState: sharedNotPendingObject
	    },
	    next: null
	  };
	  var initialResetState = {};
	  existingStateHook.next = {
	    memoizedState: initialResetState,
	    baseState: initialResetState,
	    baseQueue: null,
	    queue: {
	      pending: null,
	      lanes: 0,
	      dispatch: null,
	      lastRenderedReducer: basicStateReducer,
	      lastRenderedState: initialResetState
	    },
	    next: null
	  };
	  formFiber.memoizedState = existingStateHook;
	  formFiber = formFiber.alternate;
	  null !== formFiber && (formFiber.memoizedState = existingStateHook);
	  return existingStateHook;
	}
	function requestFormReset$1(formFiber) {
	  var resetStateQueue = ensureFormComponentIsStateful(formFiber).next.queue;
	  dispatchSetStateInternal(formFiber, resetStateQueue, {}, requestUpdateLane());
	}
	function useHostTransitionStatus() {
	  return readContext(HostTransitionContext);
	}
	function updateId() {
	  return updateWorkInProgressHook().memoizedState;
	}
	function updateRefresh() {
	  return updateWorkInProgressHook().memoizedState;
	}
	function refreshCache(fiber) {
	  for (var provider = fiber.return; null !== provider; ) {
	    switch (provider.tag) {
	      case 24:
	      case 3:
	        var lane = requestUpdateLane();
	        fiber = createUpdate(lane);
	        var root$63 = enqueueUpdate(provider, fiber, lane);
	        null !== root$63 &&
	          (scheduleUpdateOnFiber(root$63, provider, lane),
	          entangleTransitions(root$63, provider, lane));
	        provider = { cache: createCache() };
	        fiber.payload = provider;
	        return;
	    }
	    provider = provider.return;
	  }
	}
	function dispatchReducerAction(fiber, queue, action) {
	  var lane = requestUpdateLane();
	  action = {
	    lane: lane,
	    revertLane: 0,
	    action: action,
	    hasEagerState: false,
	    eagerState: null,
	    next: null
	  };
	  isRenderPhaseUpdate(fiber)
	    ? enqueueRenderPhaseUpdate(queue, action)
	    : ((action = enqueueConcurrentHookUpdate(fiber, queue, action, lane)),
	      null !== action &&
	        (scheduleUpdateOnFiber(action, fiber, lane),
	        entangleTransitionUpdate(action, queue, lane)));
	}
	function dispatchSetState(fiber, queue, action) {
	  var lane = requestUpdateLane();
	  dispatchSetStateInternal(fiber, queue, action, lane);
	}
	function dispatchSetStateInternal(fiber, queue, action, lane) {
	  var update = {
	    lane: lane,
	    revertLane: 0,
	    action: action,
	    hasEagerState: false,
	    eagerState: null,
	    next: null
	  };
	  if (isRenderPhaseUpdate(fiber)) enqueueRenderPhaseUpdate(queue, update);
	  else {
	    var alternate = fiber.alternate;
	    if (
	      0 === fiber.lanes &&
	      (null === alternate || 0 === alternate.lanes) &&
	      ((alternate = queue.lastRenderedReducer), null !== alternate)
	    )
	      try {
	        var currentState = queue.lastRenderedState,
	          eagerState = alternate(currentState, action);
	        update.hasEagerState = !0;
	        update.eagerState = eagerState;
	        if (objectIs(eagerState, currentState))
	          return (
	            enqueueUpdate$1(fiber, queue, update, 0),
	            null === workInProgressRoot && finishQueueingConcurrentUpdates(),
	            !1
	          );
	      } catch (error) {
	      } finally {
	      }
	    action = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
	    if (null !== action)
	      return (
	        scheduleUpdateOnFiber(action, fiber, lane),
	        entangleTransitionUpdate(action, queue, lane),
	        true
	      );
	  }
	  return false;
	}
	function dispatchOptimisticSetState(fiber, throwIfDuringRender, queue, action) {
	  action = {
	    lane: 2,
	    revertLane: requestTransitionLane(),
	    action: action,
	    hasEagerState: false,
	    eagerState: null,
	    next: null
	  };
	  if (isRenderPhaseUpdate(fiber)) {
	    if (throwIfDuringRender) throw Error(formatProdErrorMessage(479));
	  } else
	    (throwIfDuringRender = enqueueConcurrentHookUpdate(
	      fiber,
	      queue,
	      action,
	      2
	    )),
	      null !== throwIfDuringRender &&
	        scheduleUpdateOnFiber(throwIfDuringRender, fiber, 2);
	}
	function isRenderPhaseUpdate(fiber) {
	  var alternate = fiber.alternate;
	  return (
	    fiber === currentlyRenderingFiber$1 ||
	    (null !== alternate && alternate === currentlyRenderingFiber$1)
	  );
	}
	function enqueueRenderPhaseUpdate(queue, update) {
	  didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate =
	    true;
	  var pending = queue.pending;
	  null === pending
	    ? (update.next = update)
	    : ((update.next = pending.next), (pending.next = update));
	  queue.pending = update;
	}
	function entangleTransitionUpdate(root, queue, lane) {
	  if (0 !== (lane & 4194176)) {
	    var queueLanes = queue.lanes;
	    queueLanes &= root.pendingLanes;
	    lane |= queueLanes;
	    queue.lanes = lane;
	    markRootEntangled(root, lane);
	  }
	}
	var ContextOnlyDispatcher = {
	  readContext: readContext,
	  use: use,
	  useCallback: throwInvalidHookError,
	  useContext: throwInvalidHookError,
	  useEffect: throwInvalidHookError,
	  useImperativeHandle: throwInvalidHookError,
	  useLayoutEffect: throwInvalidHookError,
	  useInsertionEffect: throwInvalidHookError,
	  useMemo: throwInvalidHookError,
	  useReducer: throwInvalidHookError,
	  useRef: throwInvalidHookError,
	  useState: throwInvalidHookError,
	  useDebugValue: throwInvalidHookError,
	  useDeferredValue: throwInvalidHookError,
	  useTransition: throwInvalidHookError,
	  useSyncExternalStore: throwInvalidHookError,
	  useId: throwInvalidHookError
	};
	ContextOnlyDispatcher.useCacheRefresh = throwInvalidHookError;
	ContextOnlyDispatcher.useMemoCache = throwInvalidHookError;
	ContextOnlyDispatcher.useHostTransitionStatus = throwInvalidHookError;
	ContextOnlyDispatcher.useFormState = throwInvalidHookError;
	ContextOnlyDispatcher.useActionState = throwInvalidHookError;
	ContextOnlyDispatcher.useOptimistic = throwInvalidHookError;
	var HooksDispatcherOnMount = {
	  readContext: readContext,
	  use: use,
	  useCallback: function (callback, deps) {
	    mountWorkInProgressHook().memoizedState = [
	      callback,
	      void 0 === deps ? null : deps
	    ];
	    return callback;
	  },
	  useContext: readContext,
	  useEffect: mountEffect,
	  useImperativeHandle: function (ref, create, deps) {
	    deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
	    mountEffectImpl(
	      4194308,
	      4,
	      imperativeHandleEffect.bind(null, create, ref),
	      deps
	    );
	  },
	  useLayoutEffect: function (create, deps) {
	    return mountEffectImpl(4194308, 4, create, deps);
	  },
	  useInsertionEffect: function (create, deps) {
	    mountEffectImpl(4, 2, create, deps);
	  },
	  useMemo: function (nextCreate, deps) {
	    var hook = mountWorkInProgressHook();
	    deps = void 0 === deps ? null : deps;
	    var nextValue = nextCreate();
	    if (shouldDoubleInvokeUserFnsInHooksDEV) {
	      setIsStrictModeForDevtools(true);
	      try {
	        nextCreate();
	      } finally {
	        setIsStrictModeForDevtools(false);
	      }
	    }
	    hook.memoizedState = [nextValue, deps];
	    return nextValue;
	  },
	  useReducer: function (reducer, initialArg, init) {
	    var hook = mountWorkInProgressHook();
	    if (void 0 !== init) {
	      var initialState = init(initialArg);
	      if (shouldDoubleInvokeUserFnsInHooksDEV) {
	        setIsStrictModeForDevtools(true);
	        try {
	          init(initialArg);
	        } finally {
	          setIsStrictModeForDevtools(false);
	        }
	      }
	    } else initialState = initialArg;
	    hook.memoizedState = hook.baseState = initialState;
	    reducer = {
	      pending: null,
	      lanes: 0,
	      dispatch: null,
	      lastRenderedReducer: reducer,
	      lastRenderedState: initialState
	    };
	    hook.queue = reducer;
	    reducer = reducer.dispatch = dispatchReducerAction.bind(
	      null,
	      currentlyRenderingFiber$1,
	      reducer
	    );
	    return [hook.memoizedState, reducer];
	  },
	  useRef: function (initialValue) {
	    var hook = mountWorkInProgressHook();
	    initialValue = { current: initialValue };
	    return (hook.memoizedState = initialValue);
	  },
	  useState: function (initialState) {
	    initialState = mountStateImpl(initialState);
	    var queue = initialState.queue,
	      dispatch = dispatchSetState.bind(null, currentlyRenderingFiber$1, queue);
	    queue.dispatch = dispatch;
	    return [initialState.memoizedState, dispatch];
	  },
	  useDebugValue: mountDebugValue,
	  useDeferredValue: function (value, initialValue) {
	    var hook = mountWorkInProgressHook();
	    return mountDeferredValueImpl(hook, value, initialValue);
	  },
	  useTransition: function () {
	    var stateHook = mountStateImpl(false);
	    stateHook = startTransition.bind(
	      null,
	      currentlyRenderingFiber$1,
	      stateHook.queue,
	      true,
	      false
	    );
	    mountWorkInProgressHook().memoizedState = stateHook;
	    return [false, stateHook];
	  },
	  useSyncExternalStore: function (subscribe, getSnapshot, getServerSnapshot) {
	    var fiber = currentlyRenderingFiber$1,
	      hook = mountWorkInProgressHook();
	    if (isHydrating) {
	      if (void 0 === getServerSnapshot)
	        throw Error(formatProdErrorMessage(407));
	      getServerSnapshot = getServerSnapshot();
	    } else {
	      getServerSnapshot = getSnapshot();
	      if (null === workInProgressRoot) throw Error(formatProdErrorMessage(349));
	      0 !== (workInProgressRootRenderLanes & 60) ||
	        pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
	    }
	    hook.memoizedState = getServerSnapshot;
	    var inst = { value: getServerSnapshot, getSnapshot: getSnapshot };
	    hook.queue = inst;
	    mountEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [
	      subscribe
	    ]);
	    fiber.flags |= 2048;
	    pushEffect(
	      9,
	      updateStoreInstance.bind(
	        null,
	        fiber,
	        inst,
	        getServerSnapshot,
	        getSnapshot
	      ),
	      { destroy: void 0 },
	      null
	    );
	    return getServerSnapshot;
	  },
	  useId: function () {
	    var hook = mountWorkInProgressHook(),
	      identifierPrefix = workInProgressRoot.identifierPrefix;
	    if (isHydrating) {
	      var JSCompiler_inline_result = treeContextOverflow;
	      var idWithLeadingBit = treeContextId;
	      JSCompiler_inline_result =
	        (
	          idWithLeadingBit & ~(1 << (32 - clz32(idWithLeadingBit) - 1))
	        ).toString(32) + JSCompiler_inline_result;
	      identifierPrefix =
	        ":" + identifierPrefix + "R" + JSCompiler_inline_result;
	      JSCompiler_inline_result = localIdCounter++;
	      0 < JSCompiler_inline_result &&
	        (identifierPrefix += "H" + JSCompiler_inline_result.toString(32));
	      identifierPrefix += ":";
	    } else
	      (JSCompiler_inline_result = globalClientIdCounter++),
	        (identifierPrefix =
	          ":" +
	          identifierPrefix +
	          "r" +
	          JSCompiler_inline_result.toString(32) +
	          ":");
	    return (hook.memoizedState = identifierPrefix);
	  },
	  useCacheRefresh: function () {
	    return (mountWorkInProgressHook().memoizedState = refreshCache.bind(
	      null,
	      currentlyRenderingFiber$1
	    ));
	  }
	};
	HooksDispatcherOnMount.useMemoCache = useMemoCache;
	HooksDispatcherOnMount.useHostTransitionStatus = useHostTransitionStatus;
	HooksDispatcherOnMount.useFormState = mountActionState;
	HooksDispatcherOnMount.useActionState = mountActionState;
	HooksDispatcherOnMount.useOptimistic = function (passthrough) {
	  var hook = mountWorkInProgressHook();
	  hook.memoizedState = hook.baseState = passthrough;
	  var queue = {
	    pending: null,
	    lanes: 0,
	    dispatch: null,
	    lastRenderedReducer: null,
	    lastRenderedState: null
	  };
	  hook.queue = queue;
	  hook = dispatchOptimisticSetState.bind(
	    null,
	    currentlyRenderingFiber$1,
	    true,
	    queue
	  );
	  queue.dispatch = hook;
	  return [passthrough, hook];
	};
	var HooksDispatcherOnUpdate = {
	  readContext: readContext,
	  use: use,
	  useCallback: updateCallback,
	  useContext: readContext,
	  useEffect: updateEffect,
	  useImperativeHandle: updateImperativeHandle,
	  useInsertionEffect: updateInsertionEffect,
	  useLayoutEffect: updateLayoutEffect,
	  useMemo: updateMemo,
	  useReducer: updateReducer,
	  useRef: updateRef,
	  useState: function () {
	    return updateReducer(basicStateReducer);
	  },
	  useDebugValue: mountDebugValue,
	  useDeferredValue: function (value, initialValue) {
	    var hook = updateWorkInProgressHook();
	    return updateDeferredValueImpl(
	      hook,
	      currentHook.memoizedState,
	      value,
	      initialValue
	    );
	  },
	  useTransition: function () {
	    var booleanOrThenable = updateReducer(basicStateReducer)[0],
	      start = updateWorkInProgressHook().memoizedState;
	    return [
	      "boolean" === typeof booleanOrThenable
	        ? booleanOrThenable
	        : useThenable(booleanOrThenable),
	      start
	    ];
	  },
	  useSyncExternalStore: updateSyncExternalStore,
	  useId: updateId
	};
	HooksDispatcherOnUpdate.useCacheRefresh = updateRefresh;
	HooksDispatcherOnUpdate.useMemoCache = useMemoCache;
	HooksDispatcherOnUpdate.useHostTransitionStatus = useHostTransitionStatus;
	HooksDispatcherOnUpdate.useFormState = updateActionState;
	HooksDispatcherOnUpdate.useActionState = updateActionState;
	HooksDispatcherOnUpdate.useOptimistic = function (passthrough, reducer) {
	  var hook = updateWorkInProgressHook();
	  return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
	};
	var HooksDispatcherOnRerender = {
	  readContext: readContext,
	  use: use,
	  useCallback: updateCallback,
	  useContext: readContext,
	  useEffect: updateEffect,
	  useImperativeHandle: updateImperativeHandle,
	  useInsertionEffect: updateInsertionEffect,
	  useLayoutEffect: updateLayoutEffect,
	  useMemo: updateMemo,
	  useReducer: rerenderReducer,
	  useRef: updateRef,
	  useState: function () {
	    return rerenderReducer(basicStateReducer);
	  },
	  useDebugValue: mountDebugValue,
	  useDeferredValue: function (value, initialValue) {
	    var hook = updateWorkInProgressHook();
	    return null === currentHook
	      ? mountDeferredValueImpl(hook, value, initialValue)
	      : updateDeferredValueImpl(
	          hook,
	          currentHook.memoizedState,
	          value,
	          initialValue
	        );
	  },
	  useTransition: function () {
	    var booleanOrThenable = rerenderReducer(basicStateReducer)[0],
	      start = updateWorkInProgressHook().memoizedState;
	    return [
	      "boolean" === typeof booleanOrThenable
	        ? booleanOrThenable
	        : useThenable(booleanOrThenable),
	      start
	    ];
	  },
	  useSyncExternalStore: updateSyncExternalStore,
	  useId: updateId
	};
	HooksDispatcherOnRerender.useCacheRefresh = updateRefresh;
	HooksDispatcherOnRerender.useMemoCache = useMemoCache;
	HooksDispatcherOnRerender.useHostTransitionStatus = useHostTransitionStatus;
	HooksDispatcherOnRerender.useFormState = rerenderActionState;
	HooksDispatcherOnRerender.useActionState = rerenderActionState;
	HooksDispatcherOnRerender.useOptimistic = function (passthrough, reducer) {
	  var hook = updateWorkInProgressHook();
	  if (null !== currentHook)
	    return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
	  hook.baseState = passthrough;
	  return [passthrough, hook.queue.dispatch];
	};
	function applyDerivedStateFromProps(
	  workInProgress,
	  ctor,
	  getDerivedStateFromProps,
	  nextProps
	) {
	  ctor = workInProgress.memoizedState;
	  getDerivedStateFromProps = getDerivedStateFromProps(nextProps, ctor);
	  getDerivedStateFromProps =
	    null === getDerivedStateFromProps || void 0 === getDerivedStateFromProps
	      ? ctor
	      : assign({}, ctor, getDerivedStateFromProps);
	  workInProgress.memoizedState = getDerivedStateFromProps;
	  0 === workInProgress.lanes &&
	    (workInProgress.updateQueue.baseState = getDerivedStateFromProps);
	}
	var classComponentUpdater = {
	  isMounted: function (component) {
	    return (component = component._reactInternals)
	      ? getNearestMountedFiber(component) === component
	      : false;
	  },
	  enqueueSetState: function (inst, payload, callback) {
	    inst = inst._reactInternals;
	    var lane = requestUpdateLane(),
	      update = createUpdate(lane);
	    update.payload = payload;
	    void 0 !== callback && null !== callback && (update.callback = callback);
	    payload = enqueueUpdate(inst, update, lane);
	    null !== payload &&
	      (scheduleUpdateOnFiber(payload, inst, lane),
	      entangleTransitions(payload, inst, lane));
	  },
	  enqueueReplaceState: function (inst, payload, callback) {
	    inst = inst._reactInternals;
	    var lane = requestUpdateLane(),
	      update = createUpdate(lane);
	    update.tag = 1;
	    update.payload = payload;
	    void 0 !== callback && null !== callback && (update.callback = callback);
	    payload = enqueueUpdate(inst, update, lane);
	    null !== payload &&
	      (scheduleUpdateOnFiber(payload, inst, lane),
	      entangleTransitions(payload, inst, lane));
	  },
	  enqueueForceUpdate: function (inst, callback) {
	    inst = inst._reactInternals;
	    var lane = requestUpdateLane(),
	      update = createUpdate(lane);
	    update.tag = 2;
	    void 0 !== callback && null !== callback && (update.callback = callback);
	    callback = enqueueUpdate(inst, update, lane);
	    null !== callback &&
	      (scheduleUpdateOnFiber(callback, inst, lane),
	      entangleTransitions(callback, inst, lane));
	  }
	};
	function checkShouldComponentUpdate(
	  workInProgress,
	  ctor,
	  oldProps,
	  newProps,
	  oldState,
	  newState,
	  nextContext
	) {
	  workInProgress = workInProgress.stateNode;
	  return "function" === typeof workInProgress.shouldComponentUpdate
	    ? workInProgress.shouldComponentUpdate(newProps, newState, nextContext)
	    : ctor.prototype && ctor.prototype.isPureReactComponent
	      ? !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
	      : true;
	}
	function callComponentWillReceiveProps(
	  workInProgress,
	  instance,
	  newProps,
	  nextContext
	) {
	  workInProgress = instance.state;
	  "function" === typeof instance.componentWillReceiveProps &&
	    instance.componentWillReceiveProps(newProps, nextContext);
	  "function" === typeof instance.UNSAFE_componentWillReceiveProps &&
	    instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
	  instance.state !== workInProgress &&
	    classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
	}
	function resolveClassComponentProps(Component, baseProps) {
	  var newProps = baseProps;
	  if ("ref" in baseProps) {
	    newProps = {};
	    for (var propName in baseProps)
	      "ref" !== propName && (newProps[propName] = baseProps[propName]);
	  }
	  if ((Component = Component.defaultProps)) {
	    newProps === baseProps && (newProps = assign({}, newProps));
	    for (var propName$67 in Component)
	      void 0 === newProps[propName$67] &&
	        (newProps[propName$67] = Component[propName$67]);
	  }
	  return newProps;
	}
	var reportGlobalError =
	  "function" === typeof reportError
	    ? reportError
	    : function (error) {
	        if (
	          "object" === typeof window &&
	          "function" === typeof window.ErrorEvent
	        ) {
	          var event = new window.ErrorEvent("error", {
	            bubbles: true,
	            cancelable: true,
	            message:
	              "object" === typeof error &&
	              null !== error &&
	              "string" === typeof error.message
	                ? String(error.message)
	                : String(error),
	            error: error
	          });
	          if (!window.dispatchEvent(event)) return;
	        } else if (
	          "object" === typeof process &&
	          "function" === typeof process.emit
	        ) {
	          process.emit("uncaughtException", error);
	          return;
	        }
	        console.error(error);
	      };
	function defaultOnUncaughtError(error) {
	  reportGlobalError(error);
	}
	function defaultOnCaughtError(error) {
	  console.error(error);
	}
	function defaultOnRecoverableError(error) {
	  reportGlobalError(error);
	}
	function logUncaughtError(root, errorInfo) {
	  try {
	    var onUncaughtError = root.onUncaughtError;
	    onUncaughtError(errorInfo.value, { componentStack: errorInfo.stack });
	  } catch (e$68) {
	    setTimeout(function () {
	      throw e$68;
	    });
	  }
	}
	function logCaughtError(root, boundary, errorInfo) {
	  try {
	    var onCaughtError = root.onCaughtError;
	    onCaughtError(errorInfo.value, {
	      componentStack: errorInfo.stack,
	      errorBoundary: 1 === boundary.tag ? boundary.stateNode : null
	    });
	  } catch (e$69) {
	    setTimeout(function () {
	      throw e$69;
	    });
	  }
	}
	function createRootErrorUpdate(root, errorInfo, lane) {
	  lane = createUpdate(lane);
	  lane.tag = 3;
	  lane.payload = { element: null };
	  lane.callback = function () {
	    logUncaughtError(root, errorInfo);
	  };
	  return lane;
	}
	function createClassErrorUpdate(lane) {
	  lane = createUpdate(lane);
	  lane.tag = 3;
	  return lane;
	}
	function initializeClassErrorUpdate(update, root, fiber, errorInfo) {
	  var getDerivedStateFromError = fiber.type.getDerivedStateFromError;
	  if ("function" === typeof getDerivedStateFromError) {
	    var error = errorInfo.value;
	    update.payload = function () {
	      return getDerivedStateFromError(error);
	    };
	    update.callback = function () {
	      logCaughtError(root, fiber, errorInfo);
	    };
	  }
	  var inst = fiber.stateNode;
	  null !== inst &&
	    "function" === typeof inst.componentDidCatch &&
	    (update.callback = function () {
	      logCaughtError(root, fiber, errorInfo);
	      "function" !== typeof getDerivedStateFromError &&
	        (null === legacyErrorBoundariesThatAlreadyFailed
	          ? (legacyErrorBoundariesThatAlreadyFailed = new Set([this]))
	          : legacyErrorBoundariesThatAlreadyFailed.add(this));
	      var stack = errorInfo.stack;
	      this.componentDidCatch(errorInfo.value, {
	        componentStack: null !== stack ? stack : ""
	      });
	    });
	}
	function throwException(
	  root,
	  returnFiber,
	  sourceFiber,
	  value,
	  rootRenderLanes
	) {
	  sourceFiber.flags |= 32768;
	  if (
	    null !== value &&
	    "object" === typeof value &&
	    "function" === typeof value.then
	  ) {
	    returnFiber = sourceFiber.alternate;
	    null !== returnFiber &&
	      propagateParentContextChanges(
	        returnFiber,
	        sourceFiber,
	        rootRenderLanes,
	        true
	      );
	    sourceFiber = suspenseHandlerStackCursor.current;
	    if (null !== sourceFiber) {
	      switch (sourceFiber.tag) {
	        case 13:
	          return (
	            null === shellBoundary
	              ? renderDidSuspendDelayIfPossible()
	              : null === sourceFiber.alternate &&
	                0 === workInProgressRootExitStatus &&
	                (workInProgressRootExitStatus = 3),
	            (sourceFiber.flags &= -257),
	            (sourceFiber.flags |= 65536),
	            (sourceFiber.lanes = rootRenderLanes),
	            value === noopSuspenseyCommitThenable
	              ? (sourceFiber.flags |= 16384)
	              : ((returnFiber = sourceFiber.updateQueue),
	                null === returnFiber
	                  ? (sourceFiber.updateQueue = new Set([value]))
	                  : returnFiber.add(value),
	                attachPingListener(root, value, rootRenderLanes)),
	            false
	          );
	        case 22:
	          return (
	            (sourceFiber.flags |= 65536),
	            value === noopSuspenseyCommitThenable
	              ? (sourceFiber.flags |= 16384)
	              : ((returnFiber = sourceFiber.updateQueue),
	                null === returnFiber
	                  ? ((returnFiber = {
	                      transitions: null,
	                      markerInstances: null,
	                      retryQueue: new Set([value])
	                    }),
	                    (sourceFiber.updateQueue = returnFiber))
	                  : ((sourceFiber = returnFiber.retryQueue),
	                    null === sourceFiber
	                      ? (returnFiber.retryQueue = new Set([value]))
	                      : sourceFiber.add(value)),
	                attachPingListener(root, value, rootRenderLanes)),
	            false
	          );
	      }
	      throw Error(formatProdErrorMessage(435, sourceFiber.tag));
	    }
	    attachPingListener(root, value, rootRenderLanes);
	    renderDidSuspendDelayIfPossible();
	    return false;
	  }
	  if (isHydrating)
	    return (
	      (returnFiber = suspenseHandlerStackCursor.current),
	      null !== returnFiber
	        ? (0 === (returnFiber.flags & 65536) && (returnFiber.flags |= 256),
	          (returnFiber.flags |= 65536),
	          (returnFiber.lanes = rootRenderLanes),
	          value !== HydrationMismatchException &&
	            ((root = Error(formatProdErrorMessage(422), { cause: value })),
	            queueHydrationError(createCapturedValueAtFiber(root, sourceFiber))))
	        : (value !== HydrationMismatchException &&
	            ((returnFiber = Error(formatProdErrorMessage(423), {
	              cause: value
	            })),
	            queueHydrationError(
	              createCapturedValueAtFiber(returnFiber, sourceFiber)
	            )),
	          (root = root.current.alternate),
	          (root.flags |= 65536),
	          (rootRenderLanes &= -rootRenderLanes),
	          (root.lanes |= rootRenderLanes),
	          (value = createCapturedValueAtFiber(value, sourceFiber)),
	          (rootRenderLanes = createRootErrorUpdate(
	            root.stateNode,
	            value,
	            rootRenderLanes
	          )),
	          enqueueCapturedUpdate(root, rootRenderLanes),
	          4 !== workInProgressRootExitStatus &&
	            (workInProgressRootExitStatus = 2)),
	      false
	    );
	  var wrapperError = Error(formatProdErrorMessage(520), { cause: value });
	  wrapperError = createCapturedValueAtFiber(wrapperError, sourceFiber);
	  null === workInProgressRootConcurrentErrors
	    ? (workInProgressRootConcurrentErrors = [wrapperError])
	    : workInProgressRootConcurrentErrors.push(wrapperError);
	  4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2);
	  if (null === returnFiber) return true;
	  value = createCapturedValueAtFiber(value, sourceFiber);
	  sourceFiber = returnFiber;
	  do {
	    switch (sourceFiber.tag) {
	      case 3:
	        return (
	          (sourceFiber.flags |= 65536),
	          (root = rootRenderLanes & -rootRenderLanes),
	          (sourceFiber.lanes |= root),
	          (root = createRootErrorUpdate(sourceFiber.stateNode, value, root)),
	          enqueueCapturedUpdate(sourceFiber, root),
	          false
	        );
	      case 1:
	        if (
	          ((returnFiber = sourceFiber.type),
	          (wrapperError = sourceFiber.stateNode),
	          0 === (sourceFiber.flags & 128) &&
	            ("function" === typeof returnFiber.getDerivedStateFromError ||
	              (null !== wrapperError &&
	                "function" === typeof wrapperError.componentDidCatch &&
	                (null === legacyErrorBoundariesThatAlreadyFailed ||
	                  !legacyErrorBoundariesThatAlreadyFailed.has(wrapperError)))))
	        )
	          return (
	            (sourceFiber.flags |= 65536),
	            (rootRenderLanes &= -rootRenderLanes),
	            (sourceFiber.lanes |= rootRenderLanes),
	            (rootRenderLanes = createClassErrorUpdate(rootRenderLanes)),
	            initializeClassErrorUpdate(
	              rootRenderLanes,
	              root,
	              sourceFiber,
	              value
	            ),
	            enqueueCapturedUpdate(sourceFiber, rootRenderLanes),
	            false
	          );
	    }
	    sourceFiber = sourceFiber.return;
	  } while (null !== sourceFiber);
	  return false;
	}
	var SelectiveHydrationException = Error(formatProdErrorMessage(461)),
	  didReceiveUpdate = false;
	function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
	  workInProgress.child =
	    null === current
	      ? mountChildFibers(workInProgress, null, nextChildren, renderLanes)
	      : reconcileChildFibers(
	          workInProgress,
	          current.child,
	          nextChildren,
	          renderLanes
	        );
	}
	function updateForwardRef(
	  current,
	  workInProgress,
	  Component,
	  nextProps,
	  renderLanes
	) {
	  Component = Component.render;
	  var ref = workInProgress.ref;
	  if ("ref" in nextProps) {
	    var propsWithoutRef = {};
	    for (var key in nextProps)
	      "ref" !== key && (propsWithoutRef[key] = nextProps[key]);
	  } else propsWithoutRef = nextProps;
	  prepareToReadContext(workInProgress);
	  nextProps = renderWithHooks(
	    current,
	    workInProgress,
	    Component,
	    propsWithoutRef,
	    ref,
	    renderLanes
	  );
	  key = checkDidRenderIdHook();
	  if (null !== current && !didReceiveUpdate)
	    return (
	      bailoutHooks(current, workInProgress, renderLanes),
	      bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes)
	    );
	  isHydrating && key && pushMaterializedTreeId(workInProgress);
	  workInProgress.flags |= 1;
	  reconcileChildren(current, workInProgress, nextProps, renderLanes);
	  return workInProgress.child;
	}
	function updateMemoComponent(
	  current,
	  workInProgress,
	  Component,
	  nextProps,
	  renderLanes
	) {
	  if (null === current) {
	    var type = Component.type;
	    if (
	      "function" === typeof type &&
	      !shouldConstruct(type) &&
	      void 0 === type.defaultProps &&
	      null === Component.compare
	    )
	      return (
	        (workInProgress.tag = 15),
	        (workInProgress.type = type),
	        updateSimpleMemoComponent(
	          current,
	          workInProgress,
	          type,
	          nextProps,
	          renderLanes
	        )
	      );
	    current = createFiberFromTypeAndProps(
	      Component.type,
	      null,
	      nextProps,
	      workInProgress,
	      workInProgress.mode,
	      renderLanes
	    );
	    current.ref = workInProgress.ref;
	    current.return = workInProgress;
	    return (workInProgress.child = current);
	  }
	  type = current.child;
	  if (!checkScheduledUpdateOrContext(current, renderLanes)) {
	    var prevProps = type.memoizedProps;
	    Component = Component.compare;
	    Component = null !== Component ? Component : shallowEqual;
	    if (Component(prevProps, nextProps) && current.ref === workInProgress.ref)
	      return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
	  }
	  workInProgress.flags |= 1;
	  current = createWorkInProgress(type, nextProps);
	  current.ref = workInProgress.ref;
	  current.return = workInProgress;
	  return (workInProgress.child = current);
	}
	function updateSimpleMemoComponent(
	  current,
	  workInProgress,
	  Component,
	  nextProps,
	  renderLanes
	) {
	  if (null !== current) {
	    var prevProps = current.memoizedProps;
	    if (
	      shallowEqual(prevProps, nextProps) &&
	      current.ref === workInProgress.ref
	    )
	      if (
	        ((didReceiveUpdate = false),
	        (workInProgress.pendingProps = nextProps = prevProps),
	        checkScheduledUpdateOrContext(current, renderLanes))
	      )
	        0 !== (current.flags & 131072) && (didReceiveUpdate = true);
	      else
	        return (
	          (workInProgress.lanes = current.lanes),
	          bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes)
	        );
	  }
	  return updateFunctionComponent(
	    current,
	    workInProgress,
	    Component,
	    nextProps,
	    renderLanes
	  );
	}
	function updateOffscreenComponent(current, workInProgress, renderLanes) {
	  var nextProps = workInProgress.pendingProps,
	    nextChildren = nextProps.children,
	    nextIsDetached = 0 !== (workInProgress.stateNode._pendingVisibility & 2),
	    prevState = null !== current ? current.memoizedState : null;
	  markRef(current, workInProgress);
	  if ("hidden" === nextProps.mode || nextIsDetached) {
	    if (0 !== (workInProgress.flags & 128)) {
	      nextProps =
	        null !== prevState ? prevState.baseLanes | renderLanes : renderLanes;
	      if (null !== current) {
	        nextChildren = workInProgress.child = current.child;
	        for (nextIsDetached = 0; null !== nextChildren; )
	          (nextIsDetached =
	            nextIsDetached | nextChildren.lanes | nextChildren.childLanes),
	            (nextChildren = nextChildren.sibling);
	        workInProgress.childLanes = nextIsDetached & ~nextProps;
	      } else (workInProgress.childLanes = 0), (workInProgress.child = null);
	      return deferHiddenOffscreenComponent(
	        current,
	        workInProgress,
	        nextProps,
	        renderLanes
	      );
	    }
	    if (0 !== (renderLanes & 536870912))
	      (workInProgress.memoizedState = { baseLanes: 0, cachePool: null }),
	        null !== current &&
	          pushTransition(
	            workInProgress,
	            null !== prevState ? prevState.cachePool : null
	          ),
	        null !== prevState
	          ? pushHiddenContext(workInProgress, prevState)
	          : reuseHiddenContextOnStack(),
	        pushOffscreenSuspenseHandler(workInProgress);
	    else
	      return (
	        (workInProgress.lanes = workInProgress.childLanes = 536870912),
	        deferHiddenOffscreenComponent(
	          current,
	          workInProgress,
	          null !== prevState ? prevState.baseLanes | renderLanes : renderLanes,
	          renderLanes
	        )
	      );
	  } else
	    null !== prevState
	      ? (pushTransition(workInProgress, prevState.cachePool),
	        pushHiddenContext(workInProgress, prevState),
	        reuseSuspenseHandlerOnStack(),
	        (workInProgress.memoizedState = null))
	      : (null !== current && pushTransition(workInProgress, null),
	        reuseHiddenContextOnStack(),
	        reuseSuspenseHandlerOnStack());
	  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
	  return workInProgress.child;
	}
	function deferHiddenOffscreenComponent(
	  current,
	  workInProgress,
	  nextBaseLanes,
	  renderLanes
	) {
	  var JSCompiler_inline_result = peekCacheFromPool();
	  JSCompiler_inline_result =
	    null === JSCompiler_inline_result
	      ? null
	      : { parent: CacheContext._currentValue, pool: JSCompiler_inline_result };
	  workInProgress.memoizedState = {
	    baseLanes: nextBaseLanes,
	    cachePool: JSCompiler_inline_result
	  };
	  null !== current && pushTransition(workInProgress, null);
	  reuseHiddenContextOnStack();
	  pushOffscreenSuspenseHandler(workInProgress);
	  null !== current &&
	    propagateParentContextChanges(current, workInProgress, renderLanes, true);
	  return null;
	}
	function markRef(current, workInProgress) {
	  var ref = workInProgress.ref;
	  if (null === ref)
	    null !== current &&
	      null !== current.ref &&
	      (workInProgress.flags |= 2097664);
	  else {
	    if ("function" !== typeof ref && "object" !== typeof ref)
	      throw Error(formatProdErrorMessage(284));
	    if (null === current || current.ref !== ref)
	      workInProgress.flags |= 2097664;
	  }
	}
	function updateFunctionComponent(
	  current,
	  workInProgress,
	  Component,
	  nextProps,
	  renderLanes
	) {
	  prepareToReadContext(workInProgress);
	  Component = renderWithHooks(
	    current,
	    workInProgress,
	    Component,
	    nextProps,
	    void 0,
	    renderLanes
	  );
	  nextProps = checkDidRenderIdHook();
	  if (null !== current && !didReceiveUpdate)
	    return (
	      bailoutHooks(current, workInProgress, renderLanes),
	      bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes)
	    );
	  isHydrating && nextProps && pushMaterializedTreeId(workInProgress);
	  workInProgress.flags |= 1;
	  reconcileChildren(current, workInProgress, Component, renderLanes);
	  return workInProgress.child;
	}
	function replayFunctionComponent(
	  current,
	  workInProgress,
	  nextProps,
	  Component,
	  secondArg,
	  renderLanes
	) {
	  prepareToReadContext(workInProgress);
	  workInProgress.updateQueue = null;
	  nextProps = renderWithHooksAgain(
	    workInProgress,
	    Component,
	    nextProps,
	    secondArg
	  );
	  finishRenderingHooks(current);
	  Component = checkDidRenderIdHook();
	  if (null !== current && !didReceiveUpdate)
	    return (
	      bailoutHooks(current, workInProgress, renderLanes),
	      bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes)
	    );
	  isHydrating && Component && pushMaterializedTreeId(workInProgress);
	  workInProgress.flags |= 1;
	  reconcileChildren(current, workInProgress, nextProps, renderLanes);
	  return workInProgress.child;
	}
	function updateClassComponent(
	  current,
	  workInProgress,
	  Component,
	  nextProps,
	  renderLanes
	) {
	  prepareToReadContext(workInProgress);
	  if (null === workInProgress.stateNode) {
	    var context = emptyContextObject,
	      contextType = Component.contextType;
	    "object" === typeof contextType &&
	      null !== contextType &&
	      (context = readContext(contextType));
	    context = new Component(nextProps, context);
	    workInProgress.memoizedState =
	      null !== context.state && void 0 !== context.state ? context.state : null;
	    context.updater = classComponentUpdater;
	    workInProgress.stateNode = context;
	    context._reactInternals = workInProgress;
	    context = workInProgress.stateNode;
	    context.props = nextProps;
	    context.state = workInProgress.memoizedState;
	    context.refs = {};
	    initializeUpdateQueue(workInProgress);
	    contextType = Component.contextType;
	    context.context =
	      "object" === typeof contextType && null !== contextType
	        ? readContext(contextType)
	        : emptyContextObject;
	    context.state = workInProgress.memoizedState;
	    contextType = Component.getDerivedStateFromProps;
	    "function" === typeof contextType &&
	      (applyDerivedStateFromProps(
	        workInProgress,
	        Component,
	        contextType,
	        nextProps
	      ),
	      (context.state = workInProgress.memoizedState));
	    "function" === typeof Component.getDerivedStateFromProps ||
	      "function" === typeof context.getSnapshotBeforeUpdate ||
	      ("function" !== typeof context.UNSAFE_componentWillMount &&
	        "function" !== typeof context.componentWillMount) ||
	      ((contextType = context.state),
	      "function" === typeof context.componentWillMount &&
	        context.componentWillMount(),
	      "function" === typeof context.UNSAFE_componentWillMount &&
	        context.UNSAFE_componentWillMount(),
	      contextType !== context.state &&
	        classComponentUpdater.enqueueReplaceState(context, context.state, null),
	      processUpdateQueue(workInProgress, nextProps, context, renderLanes),
	      suspendIfUpdateReadFromEntangledAsyncAction(),
	      (context.state = workInProgress.memoizedState));
	    "function" === typeof context.componentDidMount &&
	      (workInProgress.flags |= 4194308);
	    nextProps = true;
	  } else if (null === current) {
	    context = workInProgress.stateNode;
	    var unresolvedOldProps = workInProgress.memoizedProps,
	      oldProps = resolveClassComponentProps(Component, unresolvedOldProps);
	    context.props = oldProps;
	    var oldContext = context.context,
	      contextType$jscomp$0 = Component.contextType;
	    contextType = emptyContextObject;
	    "object" === typeof contextType$jscomp$0 &&
	      null !== contextType$jscomp$0 &&
	      (contextType = readContext(contextType$jscomp$0));
	    var getDerivedStateFromProps = Component.getDerivedStateFromProps;
	    contextType$jscomp$0 =
	      "function" === typeof getDerivedStateFromProps ||
	      "function" === typeof context.getSnapshotBeforeUpdate;
	    unresolvedOldProps = workInProgress.pendingProps !== unresolvedOldProps;
	    contextType$jscomp$0 ||
	      ("function" !== typeof context.UNSAFE_componentWillReceiveProps &&
	        "function" !== typeof context.componentWillReceiveProps) ||
	      ((unresolvedOldProps || oldContext !== contextType) &&
	        callComponentWillReceiveProps(
	          workInProgress,
	          context,
	          nextProps,
	          contextType
	        ));
	    hasForceUpdate = false;
	    var oldState = workInProgress.memoizedState;
	    context.state = oldState;
	    processUpdateQueue(workInProgress, nextProps, context, renderLanes);
	    suspendIfUpdateReadFromEntangledAsyncAction();
	    oldContext = workInProgress.memoizedState;
	    unresolvedOldProps || oldState !== oldContext || hasForceUpdate
	      ? ("function" === typeof getDerivedStateFromProps &&
	          (applyDerivedStateFromProps(
	            workInProgress,
	            Component,
	            getDerivedStateFromProps,
	            nextProps
	          ),
	          (oldContext = workInProgress.memoizedState)),
	        (oldProps =
	          hasForceUpdate ||
	          checkShouldComponentUpdate(
	            workInProgress,
	            Component,
	            oldProps,
	            nextProps,
	            oldState,
	            oldContext,
	            contextType
	          ))
	          ? (contextType$jscomp$0 ||
	              ("function" !== typeof context.UNSAFE_componentWillMount &&
	                "function" !== typeof context.componentWillMount) ||
	              ("function" === typeof context.componentWillMount &&
	                context.componentWillMount(),
	              "function" === typeof context.UNSAFE_componentWillMount &&
	                context.UNSAFE_componentWillMount()),
	            "function" === typeof context.componentDidMount &&
	              (workInProgress.flags |= 4194308))
	          : ("function" === typeof context.componentDidMount &&
	              (workInProgress.flags |= 4194308),
	            (workInProgress.memoizedProps = nextProps),
	            (workInProgress.memoizedState = oldContext)),
	        (context.props = nextProps),
	        (context.state = oldContext),
	        (context.context = contextType),
	        (nextProps = oldProps))
	      : ("function" === typeof context.componentDidMount &&
	          (workInProgress.flags |= 4194308),
	        (nextProps = false));
	  } else {
	    context = workInProgress.stateNode;
	    cloneUpdateQueue(current, workInProgress);
	    contextType = workInProgress.memoizedProps;
	    contextType$jscomp$0 = resolveClassComponentProps(Component, contextType);
	    context.props = contextType$jscomp$0;
	    getDerivedStateFromProps = workInProgress.pendingProps;
	    oldState = context.context;
	    oldContext = Component.contextType;
	    oldProps = emptyContextObject;
	    "object" === typeof oldContext &&
	      null !== oldContext &&
	      (oldProps = readContext(oldContext));
	    unresolvedOldProps = Component.getDerivedStateFromProps;
	    (oldContext =
	      "function" === typeof unresolvedOldProps ||
	      "function" === typeof context.getSnapshotBeforeUpdate) ||
	      ("function" !== typeof context.UNSAFE_componentWillReceiveProps &&
	        "function" !== typeof context.componentWillReceiveProps) ||
	      ((contextType !== getDerivedStateFromProps || oldState !== oldProps) &&
	        callComponentWillReceiveProps(
	          workInProgress,
	          context,
	          nextProps,
	          oldProps
	        ));
	    hasForceUpdate = false;
	    oldState = workInProgress.memoizedState;
	    context.state = oldState;
	    processUpdateQueue(workInProgress, nextProps, context, renderLanes);
	    suspendIfUpdateReadFromEntangledAsyncAction();
	    var newState = workInProgress.memoizedState;
	    contextType !== getDerivedStateFromProps ||
	    oldState !== newState ||
	    hasForceUpdate ||
	    (null !== current &&
	      null !== current.dependencies &&
	      checkIfContextChanged(current.dependencies))
	      ? ("function" === typeof unresolvedOldProps &&
	          (applyDerivedStateFromProps(
	            workInProgress,
	            Component,
	            unresolvedOldProps,
	            nextProps
	          ),
	          (newState = workInProgress.memoizedState)),
	        (contextType$jscomp$0 =
	          hasForceUpdate ||
	          checkShouldComponentUpdate(
	            workInProgress,
	            Component,
	            contextType$jscomp$0,
	            nextProps,
	            oldState,
	            newState,
	            oldProps
	          ) ||
	          (null !== current &&
	            null !== current.dependencies &&
	            checkIfContextChanged(current.dependencies)))
	          ? (oldContext ||
	              ("function" !== typeof context.UNSAFE_componentWillUpdate &&
	                "function" !== typeof context.componentWillUpdate) ||
	              ("function" === typeof context.componentWillUpdate &&
	                context.componentWillUpdate(nextProps, newState, oldProps),
	              "function" === typeof context.UNSAFE_componentWillUpdate &&
	                context.UNSAFE_componentWillUpdate(
	                  nextProps,
	                  newState,
	                  oldProps
	                )),
	            "function" === typeof context.componentDidUpdate &&
	              (workInProgress.flags |= 4),
	            "function" === typeof context.getSnapshotBeforeUpdate &&
	              (workInProgress.flags |= 1024))
	          : ("function" !== typeof context.componentDidUpdate ||
	              (contextType === current.memoizedProps &&
	                oldState === current.memoizedState) ||
	              (workInProgress.flags |= 4),
	            "function" !== typeof context.getSnapshotBeforeUpdate ||
	              (contextType === current.memoizedProps &&
	                oldState === current.memoizedState) ||
	              (workInProgress.flags |= 1024),
	            (workInProgress.memoizedProps = nextProps),
	            (workInProgress.memoizedState = newState)),
	        (context.props = nextProps),
	        (context.state = newState),
	        (context.context = oldProps),
	        (nextProps = contextType$jscomp$0))
	      : ("function" !== typeof context.componentDidUpdate ||
	          (contextType === current.memoizedProps &&
	            oldState === current.memoizedState) ||
	          (workInProgress.flags |= 4),
	        "function" !== typeof context.getSnapshotBeforeUpdate ||
	          (contextType === current.memoizedProps &&
	            oldState === current.memoizedState) ||
	          (workInProgress.flags |= 1024),
	        (nextProps = false));
	  }
	  context = nextProps;
	  markRef(current, workInProgress);
	  nextProps = 0 !== (workInProgress.flags & 128);
	  context || nextProps
	    ? ((context = workInProgress.stateNode),
	      (Component =
	        nextProps && "function" !== typeof Component.getDerivedStateFromError
	          ? null
	          : context.render()),
	      (workInProgress.flags |= 1),
	      null !== current && nextProps
	        ? ((workInProgress.child = reconcileChildFibers(
	            workInProgress,
	            current.child,
	            null,
	            renderLanes
	          )),
	          (workInProgress.child = reconcileChildFibers(
	            workInProgress,
	            null,
	            Component,
	            renderLanes
	          )))
	        : reconcileChildren(current, workInProgress, Component, renderLanes),
	      (workInProgress.memoizedState = context.state),
	      (current = workInProgress.child))
	    : (current = bailoutOnAlreadyFinishedWork(
	        current,
	        workInProgress,
	        renderLanes
	      ));
	  return current;
	}
	function mountHostRootWithoutHydrating(
	  current,
	  workInProgress,
	  nextChildren,
	  renderLanes
	) {
	  resetHydrationState();
	  workInProgress.flags |= 256;
	  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
	  return workInProgress.child;
	}
	var SUSPENDED_MARKER = { dehydrated: null, treeContext: null, retryLane: 0 };
	function mountSuspenseOffscreenState(renderLanes) {
	  return { baseLanes: renderLanes, cachePool: getSuspendedCache() };
	}
	function getRemainingWorkInPrimaryTree(
	  current,
	  primaryTreeDidDefer,
	  renderLanes
	) {
	  current = null !== current ? current.childLanes & ~renderLanes : 0;
	  primaryTreeDidDefer && (current |= workInProgressDeferredLane);
	  return current;
	}
	function updateSuspenseComponent(current, workInProgress, renderLanes) {
	  var nextProps = workInProgress.pendingProps,
	    showFallback = false,
	    didSuspend = 0 !== (workInProgress.flags & 128),
	    JSCompiler_temp;
	  (JSCompiler_temp = didSuspend) ||
	    (JSCompiler_temp =
	      null !== current && null === current.memoizedState
	        ? false
	        : 0 !== (suspenseStackCursor.current & 2));
	  JSCompiler_temp && ((showFallback = true), (workInProgress.flags &= -129));
	  JSCompiler_temp = 0 !== (workInProgress.flags & 32);
	  workInProgress.flags &= -33;
	  if (null === current) {
	    if (isHydrating) {
	      showFallback
	        ? pushPrimaryTreeSuspenseHandler(workInProgress)
	        : reuseSuspenseHandlerOnStack();
	      if (isHydrating) {
	        var nextInstance = nextHydratableInstance,
	          JSCompiler_temp$jscomp$0;
	        if ((JSCompiler_temp$jscomp$0 = nextInstance)) {
	          c: {
	            JSCompiler_temp$jscomp$0 = nextInstance;
	            for (
	              nextInstance = rootOrSingletonContext;
	              8 !== JSCompiler_temp$jscomp$0.nodeType;

	            ) {
	              if (!nextInstance) {
	                nextInstance = null;
	                break c;
	              }
	              JSCompiler_temp$jscomp$0 = getNextHydratable(
	                JSCompiler_temp$jscomp$0.nextSibling
	              );
	              if (null === JSCompiler_temp$jscomp$0) {
	                nextInstance = null;
	                break c;
	              }
	            }
	            nextInstance = JSCompiler_temp$jscomp$0;
	          }
	          null !== nextInstance
	            ? ((workInProgress.memoizedState = {
	                dehydrated: nextInstance,
	                treeContext:
	                  null !== treeContextProvider
	                    ? { id: treeContextId, overflow: treeContextOverflow }
	                    : null,
	                retryLane: 536870912
	              }),
	              (JSCompiler_temp$jscomp$0 = createFiberImplClass(
	                18,
	                null,
	                null,
	                0
	              )),
	              (JSCompiler_temp$jscomp$0.stateNode = nextInstance),
	              (JSCompiler_temp$jscomp$0.return = workInProgress),
	              (workInProgress.child = JSCompiler_temp$jscomp$0),
	              (hydrationParentFiber = workInProgress),
	              (nextHydratableInstance = null),
	              (JSCompiler_temp$jscomp$0 = true))
	            : (JSCompiler_temp$jscomp$0 = false);
	        }
	        JSCompiler_temp$jscomp$0 || throwOnHydrationMismatch(workInProgress);
	      }
	      nextInstance = workInProgress.memoizedState;
	      if (
	        null !== nextInstance &&
	        ((nextInstance = nextInstance.dehydrated), null !== nextInstance)
	      )
	        return (
	          "$!" === nextInstance.data
	            ? (workInProgress.lanes = 16)
	            : (workInProgress.lanes = 536870912),
	          null
	        );
	      popSuspenseHandler(workInProgress);
	    }
	    nextInstance = nextProps.children;
	    nextProps = nextProps.fallback;
	    if (showFallback)
	      return (
	        reuseSuspenseHandlerOnStack(),
	        (showFallback = workInProgress.mode),
	        (nextInstance = mountWorkInProgressOffscreenFiber(
	          { mode: "hidden", children: nextInstance },
	          showFallback
	        )),
	        (nextProps = createFiberFromFragment(
	          nextProps,
	          showFallback,
	          renderLanes,
	          null
	        )),
	        (nextInstance.return = workInProgress),
	        (nextProps.return = workInProgress),
	        (nextInstance.sibling = nextProps),
	        (workInProgress.child = nextInstance),
	        (showFallback = workInProgress.child),
	        (showFallback.memoizedState = mountSuspenseOffscreenState(renderLanes)),
	        (showFallback.childLanes = getRemainingWorkInPrimaryTree(
	          current,
	          JSCompiler_temp,
	          renderLanes
	        )),
	        (workInProgress.memoizedState = SUSPENDED_MARKER),
	        nextProps
	      );
	    pushPrimaryTreeSuspenseHandler(workInProgress);
	    return mountSuspensePrimaryChildren(workInProgress, nextInstance);
	  }
	  JSCompiler_temp$jscomp$0 = current.memoizedState;
	  if (
	    null !== JSCompiler_temp$jscomp$0 &&
	    ((nextInstance = JSCompiler_temp$jscomp$0.dehydrated),
	    null !== nextInstance)
	  ) {
	    if (didSuspend)
	      workInProgress.flags & 256
	        ? (pushPrimaryTreeSuspenseHandler(workInProgress),
	          (workInProgress.flags &= -257),
	          (workInProgress = retrySuspenseComponentWithoutHydrating(
	            current,
	            workInProgress,
	            renderLanes
	          )))
	        : null !== workInProgress.memoizedState
	          ? (reuseSuspenseHandlerOnStack(),
	            (workInProgress.child = current.child),
	            (workInProgress.flags |= 128),
	            (workInProgress = null))
	          : (reuseSuspenseHandlerOnStack(),
	            (showFallback = nextProps.fallback),
	            (nextInstance = workInProgress.mode),
	            (nextProps = mountWorkInProgressOffscreenFiber(
	              { mode: "visible", children: nextProps.children },
	              nextInstance
	            )),
	            (showFallback = createFiberFromFragment(
	              showFallback,
	              nextInstance,
	              renderLanes,
	              null
	            )),
	            (showFallback.flags |= 2),
	            (nextProps.return = workInProgress),
	            (showFallback.return = workInProgress),
	            (nextProps.sibling = showFallback),
	            (workInProgress.child = nextProps),
	            reconcileChildFibers(
	              workInProgress,
	              current.child,
	              null,
	              renderLanes
	            ),
	            (nextProps = workInProgress.child),
	            (nextProps.memoizedState =
	              mountSuspenseOffscreenState(renderLanes)),
	            (nextProps.childLanes = getRemainingWorkInPrimaryTree(
	              current,
	              JSCompiler_temp,
	              renderLanes
	            )),
	            (workInProgress.memoizedState = SUSPENDED_MARKER),
	            (workInProgress = showFallback));
	    else if (
	      (pushPrimaryTreeSuspenseHandler(workInProgress),
	      "$!" === nextInstance.data)
	    ) {
	      JSCompiler_temp =
	        nextInstance.nextSibling && nextInstance.nextSibling.dataset;
	      if (JSCompiler_temp) var digest = JSCompiler_temp.dgst;
	      JSCompiler_temp = digest;
	      nextProps = Error(formatProdErrorMessage(419));
	      nextProps.stack = "";
	      nextProps.digest = JSCompiler_temp;
	      queueHydrationError({ value: nextProps, source: null, stack: null });
	      workInProgress = retrySuspenseComponentWithoutHydrating(
	        current,
	        workInProgress,
	        renderLanes
	      );
	    } else if (
	      (didReceiveUpdate ||
	        propagateParentContextChanges(current, workInProgress, renderLanes, false),
	      (JSCompiler_temp = 0 !== (renderLanes & current.childLanes)),
	      didReceiveUpdate || JSCompiler_temp)
	    ) {
	      JSCompiler_temp = workInProgressRoot;
	      if (null !== JSCompiler_temp) {
	        nextProps = renderLanes & -renderLanes;
	        if (0 !== (nextProps & 42)) nextProps = 1;
	        else
	          switch (nextProps) {
	            case 2:
	              nextProps = 1;
	              break;
	            case 8:
	              nextProps = 4;
	              break;
	            case 32:
	              nextProps = 16;
	              break;
	            case 128:
	            case 256:
	            case 512:
	            case 1024:
	            case 2048:
	            case 4096:
	            case 8192:
	            case 16384:
	            case 32768:
	            case 65536:
	            case 131072:
	            case 262144:
	            case 524288:
	            case 1048576:
	            case 2097152:
	            case 4194304:
	            case 8388608:
	            case 16777216:
	            case 33554432:
	              nextProps = 64;
	              break;
	            case 268435456:
	              nextProps = 134217728;
	              break;
	            default:
	              nextProps = 0;
	          }
	        nextProps =
	          0 !== (nextProps & (JSCompiler_temp.suspendedLanes | renderLanes))
	            ? 0
	            : nextProps;
	        if (0 !== nextProps && nextProps !== JSCompiler_temp$jscomp$0.retryLane)
	          throw (
	            ((JSCompiler_temp$jscomp$0.retryLane = nextProps),
	            enqueueConcurrentRenderForLane(current, nextProps),
	            scheduleUpdateOnFiber(JSCompiler_temp, current, nextProps),
	            SelectiveHydrationException)
	          );
	      }
	      "$?" === nextInstance.data || renderDidSuspendDelayIfPossible();
	      workInProgress = retrySuspenseComponentWithoutHydrating(
	        current,
	        workInProgress,
	        renderLanes
	      );
	    } else
	      "$?" === nextInstance.data
	        ? ((workInProgress.flags |= 128),
	          (workInProgress.child = current.child),
	          (workInProgress = retryDehydratedSuspenseBoundary.bind(
	            null,
	            current
	          )),
	          (nextInstance._reactRetry = workInProgress),
	          (workInProgress = null))
	        : ((current = JSCompiler_temp$jscomp$0.treeContext),
	          (nextHydratableInstance = getNextHydratable(
	            nextInstance.nextSibling
	          )),
	          (hydrationParentFiber = workInProgress),
	          (isHydrating = true),
	          (hydrationErrors = null),
	          (rootOrSingletonContext = false),
	          null !== current &&
	            ((idStack[idStackIndex++] = treeContextId),
	            (idStack[idStackIndex++] = treeContextOverflow),
	            (idStack[idStackIndex++] = treeContextProvider),
	            (treeContextId = current.id),
	            (treeContextOverflow = current.overflow),
	            (treeContextProvider = workInProgress)),
	          (workInProgress = mountSuspensePrimaryChildren(
	            workInProgress,
	            nextProps.children
	          )),
	          (workInProgress.flags |= 4096));
	    return workInProgress;
	  }
	  if (showFallback)
	    return (
	      reuseSuspenseHandlerOnStack(),
	      (showFallback = nextProps.fallback),
	      (nextInstance = workInProgress.mode),
	      (JSCompiler_temp$jscomp$0 = current.child),
	      (digest = JSCompiler_temp$jscomp$0.sibling),
	      (nextProps = createWorkInProgress(JSCompiler_temp$jscomp$0, {
	        mode: "hidden",
	        children: nextProps.children
	      })),
	      (nextProps.subtreeFlags =
	        JSCompiler_temp$jscomp$0.subtreeFlags & 31457280),
	      null !== digest
	        ? (showFallback = createWorkInProgress(digest, showFallback))
	        : ((showFallback = createFiberFromFragment(
	            showFallback,
	            nextInstance,
	            renderLanes,
	            null
	          )),
	          (showFallback.flags |= 2)),
	      (showFallback.return = workInProgress),
	      (nextProps.return = workInProgress),
	      (nextProps.sibling = showFallback),
	      (workInProgress.child = nextProps),
	      (nextProps = showFallback),
	      (showFallback = workInProgress.child),
	      (nextInstance = current.child.memoizedState),
	      null === nextInstance
	        ? (nextInstance = mountSuspenseOffscreenState(renderLanes))
	        : ((JSCompiler_temp$jscomp$0 = nextInstance.cachePool),
	          null !== JSCompiler_temp$jscomp$0
	            ? ((digest = CacheContext._currentValue),
	              (JSCompiler_temp$jscomp$0 =
	                JSCompiler_temp$jscomp$0.parent !== digest
	                  ? { parent: digest, pool: digest }
	                  : JSCompiler_temp$jscomp$0))
	            : (JSCompiler_temp$jscomp$0 = getSuspendedCache()),
	          (nextInstance = {
	            baseLanes: nextInstance.baseLanes | renderLanes,
	            cachePool: JSCompiler_temp$jscomp$0
	          })),
	      (showFallback.memoizedState = nextInstance),
	      (showFallback.childLanes = getRemainingWorkInPrimaryTree(
	        current,
	        JSCompiler_temp,
	        renderLanes
	      )),
	      (workInProgress.memoizedState = SUSPENDED_MARKER),
	      nextProps
	    );
	  pushPrimaryTreeSuspenseHandler(workInProgress);
	  renderLanes = current.child;
	  current = renderLanes.sibling;
	  renderLanes = createWorkInProgress(renderLanes, {
	    mode: "visible",
	    children: nextProps.children
	  });
	  renderLanes.return = workInProgress;
	  renderLanes.sibling = null;
	  null !== current &&
	    ((JSCompiler_temp = workInProgress.deletions),
	    null === JSCompiler_temp
	      ? ((workInProgress.deletions = [current]), (workInProgress.flags |= 16))
	      : JSCompiler_temp.push(current));
	  workInProgress.child = renderLanes;
	  workInProgress.memoizedState = null;
	  return renderLanes;
	}
	function mountSuspensePrimaryChildren(workInProgress, primaryChildren) {
	  primaryChildren = mountWorkInProgressOffscreenFiber(
	    { mode: "visible", children: primaryChildren },
	    workInProgress.mode
	  );
	  primaryChildren.return = workInProgress;
	  return (workInProgress.child = primaryChildren);
	}
	function mountWorkInProgressOffscreenFiber(offscreenProps, mode) {
	  return createFiberFromOffscreen(offscreenProps, mode, 0, null);
	}
	function retrySuspenseComponentWithoutHydrating(
	  current,
	  workInProgress,
	  renderLanes
	) {
	  reconcileChildFibers(workInProgress, current.child, null, renderLanes);
	  current = mountSuspensePrimaryChildren(
	    workInProgress,
	    workInProgress.pendingProps.children
	  );
	  current.flags |= 2;
	  workInProgress.memoizedState = null;
	  return current;
	}
	function scheduleSuspenseWorkOnFiber(fiber, renderLanes, propagationRoot) {
	  fiber.lanes |= renderLanes;
	  var alternate = fiber.alternate;
	  null !== alternate && (alternate.lanes |= renderLanes);
	  scheduleContextWorkOnParentPath(fiber.return, renderLanes, propagationRoot);
	}
	function initSuspenseListRenderState(
	  workInProgress,
	  isBackwards,
	  tail,
	  lastContentRow,
	  tailMode
	) {
	  var renderState = workInProgress.memoizedState;
	  null === renderState
	    ? (workInProgress.memoizedState = {
	        isBackwards: isBackwards,
	        rendering: null,
	        renderingStartTime: 0,
	        last: lastContentRow,
	        tail: tail,
	        tailMode: tailMode
	      })
	    : ((renderState.isBackwards = isBackwards),
	      (renderState.rendering = null),
	      (renderState.renderingStartTime = 0),
	      (renderState.last = lastContentRow),
	      (renderState.tail = tail),
	      (renderState.tailMode = tailMode));
	}
	function updateSuspenseListComponent(current, workInProgress, renderLanes) {
	  var nextProps = workInProgress.pendingProps,
	    revealOrder = nextProps.revealOrder,
	    tailMode = nextProps.tail;
	  reconcileChildren(current, workInProgress, nextProps.children, renderLanes);
	  nextProps = suspenseStackCursor.current;
	  if (0 !== (nextProps & 2))
	    (nextProps = (nextProps & 1) | 2), (workInProgress.flags |= 128);
	  else {
	    if (null !== current && 0 !== (current.flags & 128))
	      a: for (current = workInProgress.child; null !== current; ) {
	        if (13 === current.tag)
	          null !== current.memoizedState &&
	            scheduleSuspenseWorkOnFiber(current, renderLanes, workInProgress);
	        else if (19 === current.tag)
	          scheduleSuspenseWorkOnFiber(current, renderLanes, workInProgress);
	        else if (null !== current.child) {
	          current.child.return = current;
	          current = current.child;
	          continue;
	        }
	        if (current === workInProgress) break a;
	        for (; null === current.sibling; ) {
	          if (null === current.return || current.return === workInProgress)
	            break a;
	          current = current.return;
	        }
	        current.sibling.return = current.return;
	        current = current.sibling;
	      }
	    nextProps &= 1;
	  }
	  push(suspenseStackCursor, nextProps);
	  switch (revealOrder) {
	    case "forwards":
	      renderLanes = workInProgress.child;
	      for (revealOrder = null; null !== renderLanes; )
	        (current = renderLanes.alternate),
	          null !== current &&
	            null === findFirstSuspended(current) &&
	            (revealOrder = renderLanes),
	          (renderLanes = renderLanes.sibling);
	      renderLanes = revealOrder;
	      null === renderLanes
	        ? ((revealOrder = workInProgress.child), (workInProgress.child = null))
	        : ((revealOrder = renderLanes.sibling), (renderLanes.sibling = null));
	      initSuspenseListRenderState(
	        workInProgress,
	        false,
	        revealOrder,
	        renderLanes,
	        tailMode
	      );
	      break;
	    case "backwards":
	      renderLanes = null;
	      revealOrder = workInProgress.child;
	      for (workInProgress.child = null; null !== revealOrder; ) {
	        current = revealOrder.alternate;
	        if (null !== current && null === findFirstSuspended(current)) {
	          workInProgress.child = revealOrder;
	          break;
	        }
	        current = revealOrder.sibling;
	        revealOrder.sibling = renderLanes;
	        renderLanes = revealOrder;
	        revealOrder = current;
	      }
	      initSuspenseListRenderState(
	        workInProgress,
	        true,
	        renderLanes,
	        null,
	        tailMode
	      );
	      break;
	    case "together":
	      initSuspenseListRenderState(workInProgress, false, null, null, void 0);
	      break;
	    default:
	      workInProgress.memoizedState = null;
	  }
	  return workInProgress.child;
	}
	function bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) {
	  null !== current && (workInProgress.dependencies = current.dependencies);
	  workInProgressRootSkippedLanes |= workInProgress.lanes;
	  if (0 === (renderLanes & workInProgress.childLanes))
	    if (null !== current) {
	      if (
	        (propagateParentContextChanges(
	          current,
	          workInProgress,
	          renderLanes,
	          false
	        ),
	        0 === (renderLanes & workInProgress.childLanes))
	      )
	        return null;
	    } else return null;
	  if (null !== current && workInProgress.child !== current.child)
	    throw Error(formatProdErrorMessage(153));
	  if (null !== workInProgress.child) {
	    current = workInProgress.child;
	    renderLanes = createWorkInProgress(current, current.pendingProps);
	    workInProgress.child = renderLanes;
	    for (renderLanes.return = workInProgress; null !== current.sibling; )
	      (current = current.sibling),
	        (renderLanes = renderLanes.sibling =
	          createWorkInProgress(current, current.pendingProps)),
	        (renderLanes.return = workInProgress);
	    renderLanes.sibling = null;
	  }
	  return workInProgress.child;
	}
	function checkScheduledUpdateOrContext(current, renderLanes) {
	  if (0 !== (current.lanes & renderLanes)) return true;
	  current = current.dependencies;
	  return null !== current && checkIfContextChanged(current) ? true : false;
	}
	function attemptEarlyBailoutIfNoScheduledUpdate(
	  current,
	  workInProgress,
	  renderLanes
	) {
	  switch (workInProgress.tag) {
	    case 3:
	      pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
	      pushProvider(workInProgress, CacheContext, current.memoizedState.cache);
	      resetHydrationState();
	      break;
	    case 27:
	    case 5:
	      pushHostContext(workInProgress);
	      break;
	    case 4:
	      pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
	      break;
	    case 10:
	      pushProvider(
	        workInProgress,
	        workInProgress.type,
	        workInProgress.memoizedProps.value
	      );
	      break;
	    case 13:
	      var state = workInProgress.memoizedState;
	      if (null !== state) {
	        if (null !== state.dehydrated)
	          return (
	            pushPrimaryTreeSuspenseHandler(workInProgress),
	            (workInProgress.flags |= 128),
	            null
	          );
	        if (0 !== (renderLanes & workInProgress.child.childLanes))
	          return updateSuspenseComponent(current, workInProgress, renderLanes);
	        pushPrimaryTreeSuspenseHandler(workInProgress);
	        current = bailoutOnAlreadyFinishedWork(
	          current,
	          workInProgress,
	          renderLanes
	        );
	        return null !== current ? current.sibling : null;
	      }
	      pushPrimaryTreeSuspenseHandler(workInProgress);
	      break;
	    case 19:
	      var didSuspendBefore = 0 !== (current.flags & 128);
	      state = 0 !== (renderLanes & workInProgress.childLanes);
	      state ||
	        (propagateParentContextChanges(
	          current,
	          workInProgress,
	          renderLanes,
	          false
	        ),
	        (state = 0 !== (renderLanes & workInProgress.childLanes)));
	      if (didSuspendBefore) {
	        if (state)
	          return updateSuspenseListComponent(
	            current,
	            workInProgress,
	            renderLanes
	          );
	        workInProgress.flags |= 128;
	      }
	      didSuspendBefore = workInProgress.memoizedState;
	      null !== didSuspendBefore &&
	        ((didSuspendBefore.rendering = null),
	        (didSuspendBefore.tail = null),
	        (didSuspendBefore.lastEffect = null));
	      push(suspenseStackCursor, suspenseStackCursor.current);
	      if (state) break;
	      else return null;
	    case 22:
	    case 23:
	      return (
	        (workInProgress.lanes = 0),
	        updateOffscreenComponent(current, workInProgress, renderLanes)
	      );
	    case 24:
	      pushProvider(workInProgress, CacheContext, current.memoizedState.cache);
	  }
	  return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
	}
	function beginWork(current, workInProgress, renderLanes) {
	  if (null !== current)
	    if (current.memoizedProps !== workInProgress.pendingProps)
	      didReceiveUpdate = true;
	    else {
	      if (
	        !checkScheduledUpdateOrContext(current, renderLanes) &&
	        0 === (workInProgress.flags & 128)
	      )
	        return (
	          (didReceiveUpdate = false),
	          attemptEarlyBailoutIfNoScheduledUpdate(
	            current,
	            workInProgress,
	            renderLanes
	          )
	        );
	      didReceiveUpdate = 0 !== (current.flags & 131072) ? true : false;
	    }
	  else
	    (didReceiveUpdate = false),
	      isHydrating &&
	        0 !== (workInProgress.flags & 1048576) &&
	        pushTreeId(workInProgress, treeForkCount, workInProgress.index);
	  workInProgress.lanes = 0;
	  switch (workInProgress.tag) {
	    case 16:
	      a: {
	        current = workInProgress.pendingProps;
	        var lazyComponent = workInProgress.elementType,
	          init = lazyComponent._init;
	        lazyComponent = init(lazyComponent._payload);
	        workInProgress.type = lazyComponent;
	        if ("function" === typeof lazyComponent)
	          shouldConstruct(lazyComponent)
	            ? ((current = resolveClassComponentProps(lazyComponent, current)),
	              (workInProgress.tag = 1),
	              (workInProgress = updateClassComponent(
	                null,
	                workInProgress,
	                lazyComponent,
	                current,
	                renderLanes
	              )))
	            : ((workInProgress.tag = 0),
	              (workInProgress = updateFunctionComponent(
	                null,
	                workInProgress,
	                lazyComponent,
	                current,
	                renderLanes
	              )));
	        else {
	          if (void 0 !== lazyComponent && null !== lazyComponent)
	            if (
	              ((init = lazyComponent.$$typeof), init === REACT_FORWARD_REF_TYPE)
	            ) {
	              workInProgress.tag = 11;
	              workInProgress = updateForwardRef(
	                null,
	                workInProgress,
	                lazyComponent,
	                current,
	                renderLanes
	              );
	              break a;
	            } else if (init === REACT_MEMO_TYPE) {
	              workInProgress.tag = 14;
	              workInProgress = updateMemoComponent(
	                null,
	                workInProgress,
	                lazyComponent,
	                current,
	                renderLanes
	              );
	              break a;
	            }
	          workInProgress =
	            getComponentNameFromType(lazyComponent) || lazyComponent;
	          throw Error(formatProdErrorMessage(306, workInProgress, ""));
	        }
	      }
	      return workInProgress;
	    case 0:
	      return updateFunctionComponent(
	        current,
	        workInProgress,
	        workInProgress.type,
	        workInProgress.pendingProps,
	        renderLanes
	      );
	    case 1:
	      return (
	        (lazyComponent = workInProgress.type),
	        (init = resolveClassComponentProps(
	          lazyComponent,
	          workInProgress.pendingProps
	        )),
	        updateClassComponent(
	          current,
	          workInProgress,
	          lazyComponent,
	          init,
	          renderLanes
	        )
	      );
	    case 3:
	      a: {
	        pushHostContainer(
	          workInProgress,
	          workInProgress.stateNode.containerInfo
	        );
	        if (null === current) throw Error(formatProdErrorMessage(387));
	        var nextProps = workInProgress.pendingProps;
	        init = workInProgress.memoizedState;
	        lazyComponent = init.element;
	        cloneUpdateQueue(current, workInProgress);
	        processUpdateQueue(workInProgress, nextProps, null, renderLanes);
	        var nextState = workInProgress.memoizedState;
	        nextProps = nextState.cache;
	        pushProvider(workInProgress, CacheContext, nextProps);
	        nextProps !== init.cache &&
	          propagateContextChanges(
	            workInProgress,
	            [CacheContext],
	            renderLanes,
	            true
	          );
	        suspendIfUpdateReadFromEntangledAsyncAction();
	        nextProps = nextState.element;
	        if (init.isDehydrated)
	          if (
	            ((init = {
	              element: nextProps,
	              isDehydrated: false,
	              cache: nextState.cache
	            }),
	            (workInProgress.updateQueue.baseState = init),
	            (workInProgress.memoizedState = init),
	            workInProgress.flags & 256)
	          ) {
	            workInProgress = mountHostRootWithoutHydrating(
	              current,
	              workInProgress,
	              nextProps,
	              renderLanes
	            );
	            break a;
	          } else if (nextProps !== lazyComponent) {
	            lazyComponent = createCapturedValueAtFiber(
	              Error(formatProdErrorMessage(424)),
	              workInProgress
	            );
	            queueHydrationError(lazyComponent);
	            workInProgress = mountHostRootWithoutHydrating(
	              current,
	              workInProgress,
	              nextProps,
	              renderLanes
	            );
	            break a;
	          } else
	            for (
	              nextHydratableInstance = getNextHydratable(
	                workInProgress.stateNode.containerInfo.firstChild
	              ),
	                hydrationParentFiber = workInProgress,
	                isHydrating = true,
	                hydrationErrors = null,
	                rootOrSingletonContext = true,
	                renderLanes = mountChildFibers(
	                  workInProgress,
	                  null,
	                  nextProps,
	                  renderLanes
	                ),
	                workInProgress.child = renderLanes;
	              renderLanes;

	            )
	              (renderLanes.flags = (renderLanes.flags & -3) | 4096),
	                (renderLanes = renderLanes.sibling);
	        else {
	          resetHydrationState();
	          if (nextProps === lazyComponent) {
	            workInProgress = bailoutOnAlreadyFinishedWork(
	              current,
	              workInProgress,
	              renderLanes
	            );
	            break a;
	          }
	          reconcileChildren(current, workInProgress, nextProps, renderLanes);
	        }
	        workInProgress = workInProgress.child;
	      }
	      return workInProgress;
	    case 26:
	      return (
	        markRef(current, workInProgress),
	        null === current
	          ? (renderLanes = getResource(
	              workInProgress.type,
	              null,
	              workInProgress.pendingProps,
	              null
	            ))
	            ? (workInProgress.memoizedState = renderLanes)
	            : isHydrating ||
	              ((renderLanes = workInProgress.type),
	              (current = workInProgress.pendingProps),
	              (lazyComponent = getOwnerDocumentFromRootContainer(
	                rootInstanceStackCursor.current
	              ).createElement(renderLanes)),
	              (lazyComponent[internalInstanceKey] = workInProgress),
	              (lazyComponent[internalPropsKey] = current),
	              setInitialProperties(lazyComponent, renderLanes, current),
	              markNodeAsHoistable(lazyComponent),
	              (workInProgress.stateNode = lazyComponent))
	          : (workInProgress.memoizedState = getResource(
	              workInProgress.type,
	              current.memoizedProps,
	              workInProgress.pendingProps,
	              current.memoizedState
	            )),
	        null
	      );
	    case 27:
	      return (
	        pushHostContext(workInProgress),
	        null === current &&
	          isHydrating &&
	          ((lazyComponent = workInProgress.stateNode =
	            resolveSingletonInstance(
	              workInProgress.type,
	              workInProgress.pendingProps,
	              rootInstanceStackCursor.current
	            )),
	          (hydrationParentFiber = workInProgress),
	          (rootOrSingletonContext = true),
	          (nextHydratableInstance = getNextHydratable(
	            lazyComponent.firstChild
	          ))),
	        (lazyComponent = workInProgress.pendingProps.children),
	        null !== current || isHydrating
	          ? reconcileChildren(
	              current,
	              workInProgress,
	              lazyComponent,
	              renderLanes
	            )
	          : (workInProgress.child = reconcileChildFibers(
	              workInProgress,
	              null,
	              lazyComponent,
	              renderLanes
	            )),
	        markRef(current, workInProgress),
	        workInProgress.child
	      );
	    case 5:
	      if (null === current && isHydrating) {
	        if ((init = lazyComponent = nextHydratableInstance))
	          (lazyComponent = canHydrateInstance(
	            lazyComponent,
	            workInProgress.type,
	            workInProgress.pendingProps,
	            rootOrSingletonContext
	          )),
	            null !== lazyComponent
	              ? ((workInProgress.stateNode = lazyComponent),
	                (hydrationParentFiber = workInProgress),
	                (nextHydratableInstance = getNextHydratable(
	                  lazyComponent.firstChild
	                )),
	                (rootOrSingletonContext = false),
	                (init = true))
	              : (init = false);
	        init || throwOnHydrationMismatch(workInProgress);
	      }
	      pushHostContext(workInProgress);
	      init = workInProgress.type;
	      nextProps = workInProgress.pendingProps;
	      nextState = null !== current ? current.memoizedProps : null;
	      lazyComponent = nextProps.children;
	      shouldSetTextContent(init, nextProps)
	        ? (lazyComponent = null)
	        : null !== nextState &&
	          shouldSetTextContent(init, nextState) &&
	          (workInProgress.flags |= 32);
	      null !== workInProgress.memoizedState &&
	        ((init = renderWithHooks(
	          current,
	          workInProgress,
	          TransitionAwareHostComponent,
	          null,
	          null,
	          renderLanes
	        )),
	        (HostTransitionContext._currentValue = init));
	      markRef(current, workInProgress);
	      reconcileChildren(current, workInProgress, lazyComponent, renderLanes);
	      return workInProgress.child;
	    case 6:
	      if (null === current && isHydrating) {
	        if ((current = renderLanes = nextHydratableInstance))
	          (renderLanes = canHydrateTextInstance(
	            renderLanes,
	            workInProgress.pendingProps,
	            rootOrSingletonContext
	          )),
	            null !== renderLanes
	              ? ((workInProgress.stateNode = renderLanes),
	                (hydrationParentFiber = workInProgress),
	                (nextHydratableInstance = null),
	                (current = true))
	              : (current = false);
	        current || throwOnHydrationMismatch(workInProgress);
	      }
	      return null;
	    case 13:
	      return updateSuspenseComponent(current, workInProgress, renderLanes);
	    case 4:
	      return (
	        pushHostContainer(
	          workInProgress,
	          workInProgress.stateNode.containerInfo
	        ),
	        (lazyComponent = workInProgress.pendingProps),
	        null === current
	          ? (workInProgress.child = reconcileChildFibers(
	              workInProgress,
	              null,
	              lazyComponent,
	              renderLanes
	            ))
	          : reconcileChildren(
	              current,
	              workInProgress,
	              lazyComponent,
	              renderLanes
	            ),
	        workInProgress.child
	      );
	    case 11:
	      return updateForwardRef(
	        current,
	        workInProgress,
	        workInProgress.type,
	        workInProgress.pendingProps,
	        renderLanes
	      );
	    case 7:
	      return (
	        reconcileChildren(
	          current,
	          workInProgress,
	          workInProgress.pendingProps,
	          renderLanes
	        ),
	        workInProgress.child
	      );
	    case 8:
	      return (
	        reconcileChildren(
	          current,
	          workInProgress,
	          workInProgress.pendingProps.children,
	          renderLanes
	        ),
	        workInProgress.child
	      );
	    case 12:
	      return (
	        reconcileChildren(
	          current,
	          workInProgress,
	          workInProgress.pendingProps.children,
	          renderLanes
	        ),
	        workInProgress.child
	      );
	    case 10:
	      return (
	        (lazyComponent = workInProgress.pendingProps),
	        pushProvider(workInProgress, workInProgress.type, lazyComponent.value),
	        reconcileChildren(
	          current,
	          workInProgress,
	          lazyComponent.children,
	          renderLanes
	        ),
	        workInProgress.child
	      );
	    case 9:
	      return (
	        (init = workInProgress.type._context),
	        (lazyComponent = workInProgress.pendingProps.children),
	        prepareToReadContext(workInProgress),
	        (init = readContext(init)),
	        (lazyComponent = lazyComponent(init)),
	        (workInProgress.flags |= 1),
	        reconcileChildren(current, workInProgress, lazyComponent, renderLanes),
	        workInProgress.child
	      );
	    case 14:
	      return updateMemoComponent(
	        current,
	        workInProgress,
	        workInProgress.type,
	        workInProgress.pendingProps,
	        renderLanes
	      );
	    case 15:
	      return updateSimpleMemoComponent(
	        current,
	        workInProgress,
	        workInProgress.type,
	        workInProgress.pendingProps,
	        renderLanes
	      );
	    case 19:
	      return updateSuspenseListComponent(current, workInProgress, renderLanes);
	    case 22:
	      return updateOffscreenComponent(current, workInProgress, renderLanes);
	    case 24:
	      return (
	        prepareToReadContext(workInProgress),
	        (lazyComponent = readContext(CacheContext)),
	        null === current
	          ? ((init = peekCacheFromPool()),
	            null === init &&
	              ((init = workInProgressRoot),
	              (nextProps = createCache()),
	              (init.pooledCache = nextProps),
	              nextProps.refCount++,
	              null !== nextProps && (init.pooledCacheLanes |= renderLanes),
	              (init = nextProps)),
	            (workInProgress.memoizedState = {
	              parent: lazyComponent,
	              cache: init
	            }),
	            initializeUpdateQueue(workInProgress),
	            pushProvider(workInProgress, CacheContext, init))
	          : (0 !== (current.lanes & renderLanes) &&
	              (cloneUpdateQueue(current, workInProgress),
	              processUpdateQueue(workInProgress, null, null, renderLanes),
	              suspendIfUpdateReadFromEntangledAsyncAction()),
	            (init = current.memoizedState),
	            (nextProps = workInProgress.memoizedState),
	            init.parent !== lazyComponent
	              ? ((init = { parent: lazyComponent, cache: lazyComponent }),
	                (workInProgress.memoizedState = init),
	                0 === workInProgress.lanes &&
	                  (workInProgress.memoizedState =
	                    workInProgress.updateQueue.baseState =
	                      init),
	                pushProvider(workInProgress, CacheContext, lazyComponent))
	              : ((lazyComponent = nextProps.cache),
	                pushProvider(workInProgress, CacheContext, lazyComponent),
	                lazyComponent !== init.cache &&
	                  propagateContextChanges(
	                    workInProgress,
	                    [CacheContext],
	                    renderLanes,
	                    true
	                  ))),
	        reconcileChildren(
	          current,
	          workInProgress,
	          workInProgress.pendingProps.children,
	          renderLanes
	        ),
	        workInProgress.child
	      );
	    case 29:
	      throw workInProgress.pendingProps;
	  }
	  throw Error(formatProdErrorMessage(156, workInProgress.tag));
	}
	var valueCursor = createCursor(null),
	  currentlyRenderingFiber = null,
	  lastContextDependency = null;
	function pushProvider(providerFiber, context, nextValue) {
	  push(valueCursor, context._currentValue);
	  context._currentValue = nextValue;
	}
	function popProvider(context) {
	  context._currentValue = valueCursor.current;
	  pop(valueCursor);
	}
	function scheduleContextWorkOnParentPath(parent, renderLanes, propagationRoot) {
	  for (; null !== parent; ) {
	    var alternate = parent.alternate;
	    (parent.childLanes & renderLanes) !== renderLanes
	      ? ((parent.childLanes |= renderLanes),
	        null !== alternate && (alternate.childLanes |= renderLanes))
	      : null !== alternate &&
	        (alternate.childLanes & renderLanes) !== renderLanes &&
	        (alternate.childLanes |= renderLanes);
	    if (parent === propagationRoot) break;
	    parent = parent.return;
	  }
	}
	function propagateContextChanges(
	  workInProgress,
	  contexts,
	  renderLanes,
	  forcePropagateEntireTree
	) {
	  var fiber = workInProgress.child;
	  null !== fiber && (fiber.return = workInProgress);
	  for (; null !== fiber; ) {
	    var list = fiber.dependencies;
	    if (null !== list) {
	      var nextFiber = fiber.child;
	      list = list.firstContext;
	      a: for (; null !== list; ) {
	        var dependency = list;
	        list = fiber;
	        for (var i = 0; i < contexts.length; i++)
	          if (dependency.context === contexts[i]) {
	            list.lanes |= renderLanes;
	            dependency = list.alternate;
	            null !== dependency && (dependency.lanes |= renderLanes);
	            scheduleContextWorkOnParentPath(
	              list.return,
	              renderLanes,
	              workInProgress
	            );
	            forcePropagateEntireTree || (nextFiber = null);
	            break a;
	          }
	        list = dependency.next;
	      }
	    } else if (18 === fiber.tag) {
	      nextFiber = fiber.return;
	      if (null === nextFiber) throw Error(formatProdErrorMessage(341));
	      nextFiber.lanes |= renderLanes;
	      list = nextFiber.alternate;
	      null !== list && (list.lanes |= renderLanes);
	      scheduleContextWorkOnParentPath(nextFiber, renderLanes, workInProgress);
	      nextFiber = null;
	    } else nextFiber = fiber.child;
	    if (null !== nextFiber) nextFiber.return = fiber;
	    else
	      for (nextFiber = fiber; null !== nextFiber; ) {
	        if (nextFiber === workInProgress) {
	          nextFiber = null;
	          break;
	        }
	        fiber = nextFiber.sibling;
	        if (null !== fiber) {
	          fiber.return = nextFiber.return;
	          nextFiber = fiber;
	          break;
	        }
	        nextFiber = nextFiber.return;
	      }
	    fiber = nextFiber;
	  }
	}
	function propagateParentContextChanges(
	  current,
	  workInProgress,
	  renderLanes,
	  forcePropagateEntireTree
	) {
	  current = null;
	  for (
	    var parent = workInProgress, isInsidePropagationBailout = false;
	    null !== parent;

	  ) {
	    if (!isInsidePropagationBailout)
	      if (0 !== (parent.flags & 524288)) isInsidePropagationBailout = true;
	      else if (0 !== (parent.flags & 262144)) break;
	    if (10 === parent.tag) {
	      var currentParent = parent.alternate;
	      if (null === currentParent) throw Error(formatProdErrorMessage(387));
	      currentParent = currentParent.memoizedProps;
	      if (null !== currentParent) {
	        var context = parent.type;
	        objectIs(parent.pendingProps.value, currentParent.value) ||
	          (null !== current ? current.push(context) : (current = [context]));
	      }
	    } else if (parent === hostTransitionProviderCursor.current) {
	      currentParent = parent.alternate;
	      if (null === currentParent) throw Error(formatProdErrorMessage(387));
	      currentParent.memoizedState.memoizedState !==
	        parent.memoizedState.memoizedState &&
	        (null !== current
	          ? current.push(HostTransitionContext)
	          : (current = [HostTransitionContext]));
	    }
	    parent = parent.return;
	  }
	  null !== current &&
	    propagateContextChanges(
	      workInProgress,
	      current,
	      renderLanes,
	      forcePropagateEntireTree
	    );
	  workInProgress.flags |= 262144;
	}
	function checkIfContextChanged(currentDependencies) {
	  for (
	    currentDependencies = currentDependencies.firstContext;
	    null !== currentDependencies;

	  ) {
	    if (
	      !objectIs(
	        currentDependencies.context._currentValue,
	        currentDependencies.memoizedValue
	      )
	    )
	      return true;
	    currentDependencies = currentDependencies.next;
	  }
	  return false;
	}
	function prepareToReadContext(workInProgress) {
	  currentlyRenderingFiber = workInProgress;
	  lastContextDependency = null;
	  workInProgress = workInProgress.dependencies;
	  null !== workInProgress && (workInProgress.firstContext = null);
	}
	function readContext(context) {
	  return readContextForConsumer(currentlyRenderingFiber, context);
	}
	function readContextDuringReconciliation(consumer, context) {
	  null === currentlyRenderingFiber && prepareToReadContext(consumer);
	  return readContextForConsumer(consumer, context);
	}
	function readContextForConsumer(consumer, context) {
	  var value = context._currentValue;
	  context = { context: context, memoizedValue: value, next: null };
	  if (null === lastContextDependency) {
	    if (null === consumer) throw Error(formatProdErrorMessage(308));
	    lastContextDependency = context;
	    consumer.dependencies = { lanes: 0, firstContext: context };
	    consumer.flags |= 524288;
	  } else lastContextDependency = lastContextDependency.next = context;
	  return value;
	}
	var hasForceUpdate = false;
	function initializeUpdateQueue(fiber) {
	  fiber.updateQueue = {
	    baseState: fiber.memoizedState,
	    firstBaseUpdate: null,
	    lastBaseUpdate: null,
	    shared: { pending: null, lanes: 0, hiddenCallbacks: null },
	    callbacks: null
	  };
	}
	function cloneUpdateQueue(current, workInProgress) {
	  current = current.updateQueue;
	  workInProgress.updateQueue === current &&
	    (workInProgress.updateQueue = {
	      baseState: current.baseState,
	      firstBaseUpdate: current.firstBaseUpdate,
	      lastBaseUpdate: current.lastBaseUpdate,
	      shared: current.shared,
	      callbacks: null
	    });
	}
	function createUpdate(lane) {
	  return { lane: lane, tag: 0, payload: null, callback: null, next: null };
	}
	function enqueueUpdate(fiber, update, lane) {
	  var updateQueue = fiber.updateQueue;
	  if (null === updateQueue) return null;
	  updateQueue = updateQueue.shared;
	  if (0 !== (executionContext & 2)) {
	    var pending = updateQueue.pending;
	    null === pending
	      ? (update.next = update)
	      : ((update.next = pending.next), (pending.next = update));
	    updateQueue.pending = update;
	    update = getRootForUpdatedFiber(fiber);
	    markUpdateLaneFromFiberToRoot(fiber, null, lane);
	    return update;
	  }
	  enqueueUpdate$1(fiber, updateQueue, update, lane);
	  return getRootForUpdatedFiber(fiber);
	}
	function entangleTransitions(root, fiber, lane) {
	  fiber = fiber.updateQueue;
	  if (null !== fiber && ((fiber = fiber.shared), 0 !== (lane & 4194176))) {
	    var queueLanes = fiber.lanes;
	    queueLanes &= root.pendingLanes;
	    lane |= queueLanes;
	    fiber.lanes = lane;
	    markRootEntangled(root, lane);
	  }
	}
	function enqueueCapturedUpdate(workInProgress, capturedUpdate) {
	  var queue = workInProgress.updateQueue,
	    current = workInProgress.alternate;
	  if (
	    null !== current &&
	    ((current = current.updateQueue), queue === current)
	  ) {
	    var newFirst = null,
	      newLast = null;
	    queue = queue.firstBaseUpdate;
	    if (null !== queue) {
	      do {
	        var clone = {
	          lane: queue.lane,
	          tag: queue.tag,
	          payload: queue.payload,
	          callback: null,
	          next: null
	        };
	        null === newLast
	          ? (newFirst = newLast = clone)
	          : (newLast = newLast.next = clone);
	        queue = queue.next;
	      } while (null !== queue);
	      null === newLast
	        ? (newFirst = newLast = capturedUpdate)
	        : (newLast = newLast.next = capturedUpdate);
	    } else newFirst = newLast = capturedUpdate;
	    queue = {
	      baseState: current.baseState,
	      firstBaseUpdate: newFirst,
	      lastBaseUpdate: newLast,
	      shared: current.shared,
	      callbacks: current.callbacks
	    };
	    workInProgress.updateQueue = queue;
	    return;
	  }
	  workInProgress = queue.lastBaseUpdate;
	  null === workInProgress
	    ? (queue.firstBaseUpdate = capturedUpdate)
	    : (workInProgress.next = capturedUpdate);
	  queue.lastBaseUpdate = capturedUpdate;
	}
	var didReadFromEntangledAsyncAction = false;
	function suspendIfUpdateReadFromEntangledAsyncAction() {
	  if (didReadFromEntangledAsyncAction) {
	    var entangledActionThenable = currentEntangledActionThenable;
	    if (null !== entangledActionThenable) throw entangledActionThenable;
	  }
	}
	function processUpdateQueue(
	  workInProgress$jscomp$0,
	  props,
	  instance$jscomp$0,
	  renderLanes
	) {
	  didReadFromEntangledAsyncAction = false;
	  var queue = workInProgress$jscomp$0.updateQueue;
	  hasForceUpdate = false;
	  var firstBaseUpdate = queue.firstBaseUpdate,
	    lastBaseUpdate = queue.lastBaseUpdate,
	    pendingQueue = queue.shared.pending;
	  if (null !== pendingQueue) {
	    queue.shared.pending = null;
	    var lastPendingUpdate = pendingQueue,
	      firstPendingUpdate = lastPendingUpdate.next;
	    lastPendingUpdate.next = null;
	    null === lastBaseUpdate
	      ? (firstBaseUpdate = firstPendingUpdate)
	      : (lastBaseUpdate.next = firstPendingUpdate);
	    lastBaseUpdate = lastPendingUpdate;
	    var current = workInProgress$jscomp$0.alternate;
	    null !== current &&
	      ((current = current.updateQueue),
	      (pendingQueue = current.lastBaseUpdate),
	      pendingQueue !== lastBaseUpdate &&
	        (null === pendingQueue
	          ? (current.firstBaseUpdate = firstPendingUpdate)
	          : (pendingQueue.next = firstPendingUpdate),
	        (current.lastBaseUpdate = lastPendingUpdate)));
	  }
	  if (null !== firstBaseUpdate) {
	    var newState = queue.baseState;
	    lastBaseUpdate = 0;
	    current = firstPendingUpdate = lastPendingUpdate = null;
	    pendingQueue = firstBaseUpdate;
	    do {
	      var updateLane = pendingQueue.lane & -536870913,
	        isHiddenUpdate = updateLane !== pendingQueue.lane;
	      if (
	        isHiddenUpdate
	          ? (workInProgressRootRenderLanes & updateLane) === updateLane
	          : (renderLanes & updateLane) === updateLane
	      ) {
	        0 !== updateLane &&
	          updateLane === currentEntangledLane &&
	          (didReadFromEntangledAsyncAction = true);
	        null !== current &&
	          (current = current.next =
	            {
	              lane: 0,
	              tag: pendingQueue.tag,
	              payload: pendingQueue.payload,
	              callback: null,
	              next: null
	            });
	        a: {
	          var workInProgress = workInProgress$jscomp$0,
	            update = pendingQueue;
	          updateLane = props;
	          var instance = instance$jscomp$0;
	          switch (update.tag) {
	            case 1:
	              workInProgress = update.payload;
	              if ("function" === typeof workInProgress) {
	                newState = workInProgress.call(instance, newState, updateLane);
	                break a;
	              }
	              newState = workInProgress;
	              break a;
	            case 3:
	              workInProgress.flags = (workInProgress.flags & -65537) | 128;
	            case 0:
	              workInProgress = update.payload;
	              updateLane =
	                "function" === typeof workInProgress
	                  ? workInProgress.call(instance, newState, updateLane)
	                  : workInProgress;
	              if (null === updateLane || void 0 === updateLane) break a;
	              newState = assign({}, newState, updateLane);
	              break a;
	            case 2:
	              hasForceUpdate = true;
	          }
	        }
	        updateLane = pendingQueue.callback;
	        null !== updateLane &&
	          ((workInProgress$jscomp$0.flags |= 64),
	          isHiddenUpdate && (workInProgress$jscomp$0.flags |= 8192),
	          (isHiddenUpdate = queue.callbacks),
	          null === isHiddenUpdate
	            ? (queue.callbacks = [updateLane])
	            : isHiddenUpdate.push(updateLane));
	      } else
	        (isHiddenUpdate = {
	          lane: updateLane,
	          tag: pendingQueue.tag,
	          payload: pendingQueue.payload,
	          callback: pendingQueue.callback,
	          next: null
	        }),
	          null === current
	            ? ((firstPendingUpdate = current = isHiddenUpdate),
	              (lastPendingUpdate = newState))
	            : (current = current.next = isHiddenUpdate),
	          (lastBaseUpdate |= updateLane);
	      pendingQueue = pendingQueue.next;
	      if (null === pendingQueue)
	        if (((pendingQueue = queue.shared.pending), null === pendingQueue))
	          break;
	        else
	          (isHiddenUpdate = pendingQueue),
	            (pendingQueue = isHiddenUpdate.next),
	            (isHiddenUpdate.next = null),
	            (queue.lastBaseUpdate = isHiddenUpdate),
	            (queue.shared.pending = null);
	    } while (1);
	    null === current && (lastPendingUpdate = newState);
	    queue.baseState = lastPendingUpdate;
	    queue.firstBaseUpdate = firstPendingUpdate;
	    queue.lastBaseUpdate = current;
	    null === firstBaseUpdate && (queue.shared.lanes = 0);
	    workInProgressRootSkippedLanes |= lastBaseUpdate;
	    workInProgress$jscomp$0.lanes = lastBaseUpdate;
	    workInProgress$jscomp$0.memoizedState = newState;
	  }
	}
	function callCallback(callback, context) {
	  if ("function" !== typeof callback)
	    throw Error(formatProdErrorMessage(191, callback));
	  callback.call(context);
	}
	function commitCallbacks(updateQueue, context) {
	  var callbacks = updateQueue.callbacks;
	  if (null !== callbacks)
	    for (
	      updateQueue.callbacks = null, updateQueue = 0;
	      updateQueue < callbacks.length;
	      updateQueue++
	    )
	      callCallback(callbacks[updateQueue], context);
	}
	function commitHookEffectListMount(flags, finishedWork) {
	  try {
	    var updateQueue = finishedWork.updateQueue,
	      lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
	    if (null !== lastEffect) {
	      var firstEffect = lastEffect.next;
	      updateQueue = firstEffect;
	      do {
	        if ((updateQueue.tag & flags) === flags) {
	          lastEffect = void 0;
	          var create = updateQueue.create,
	            inst = updateQueue.inst;
	          lastEffect = create();
	          inst.destroy = lastEffect;
	        }
	        updateQueue = updateQueue.next;
	      } while (updateQueue !== firstEffect);
	    }
	  } catch (error) {
	    captureCommitPhaseError(finishedWork, finishedWork.return, error);
	  }
	}
	function commitHookEffectListUnmount(
	  flags,
	  finishedWork,
	  nearestMountedAncestor$jscomp$0
	) {
	  try {
	    var updateQueue = finishedWork.updateQueue,
	      lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
	    if (null !== lastEffect) {
	      var firstEffect = lastEffect.next;
	      updateQueue = firstEffect;
	      do {
	        if ((updateQueue.tag & flags) === flags) {
	          var inst = updateQueue.inst,
	            destroy = inst.destroy;
	          if (void 0 !== destroy) {
	            inst.destroy = void 0;
	            lastEffect = finishedWork;
	            var nearestMountedAncestor = nearestMountedAncestor$jscomp$0;
	            try {
	              destroy();
	            } catch (error) {
	              captureCommitPhaseError(
	                lastEffect,
	                nearestMountedAncestor,
	                error
	              );
	            }
	          }
	        }
	        updateQueue = updateQueue.next;
	      } while (updateQueue !== firstEffect);
	    }
	  } catch (error) {
	    captureCommitPhaseError(finishedWork, finishedWork.return, error);
	  }
	}
	function commitClassCallbacks(finishedWork) {
	  var updateQueue = finishedWork.updateQueue;
	  if (null !== updateQueue) {
	    var instance = finishedWork.stateNode;
	    try {
	      commitCallbacks(updateQueue, instance);
	    } catch (error) {
	      captureCommitPhaseError(finishedWork, finishedWork.return, error);
	    }
	  }
	}
	function safelyCallComponentWillUnmount(
	  current,
	  nearestMountedAncestor,
	  instance
	) {
	  instance.props = resolveClassComponentProps(
	    current.type,
	    current.memoizedProps
	  );
	  instance.state = current.memoizedState;
	  try {
	    instance.componentWillUnmount();
	  } catch (error) {
	    captureCommitPhaseError(current, nearestMountedAncestor, error);
	  }
	}
	function safelyAttachRef(current, nearestMountedAncestor) {
	  try {
	    var ref = current.ref;
	    if (null !== ref) {
	      var instance = current.stateNode;
	      switch (current.tag) {
	        case 26:
	        case 27:
	        case 5:
	          var instanceToUse = instance;
	          break;
	        default:
	          instanceToUse = instance;
	      }
	      "function" === typeof ref
	        ? (current.refCleanup = ref(instanceToUse))
	        : (ref.current = instanceToUse);
	    }
	  } catch (error) {
	    captureCommitPhaseError(current, nearestMountedAncestor, error);
	  }
	}
	function safelyDetachRef(current, nearestMountedAncestor) {
	  var ref = current.ref,
	    refCleanup = current.refCleanup;
	  if (null !== ref)
	    if ("function" === typeof refCleanup)
	      try {
	        refCleanup();
	      } catch (error) {
	        captureCommitPhaseError(current, nearestMountedAncestor, error);
	      } finally {
	        (current.refCleanup = null),
	          (current = current.alternate),
	          null != current && (current.refCleanup = null);
	      }
	    else if ("function" === typeof ref)
	      try {
	        ref(null);
	      } catch (error$112) {
	        captureCommitPhaseError(current, nearestMountedAncestor, error$112);
	      }
	    else ref.current = null;
	}
	function commitHostMount(finishedWork) {
	  var type = finishedWork.type,
	    props = finishedWork.memoizedProps,
	    instance = finishedWork.stateNode;
	  try {
	    a: switch (type) {
	      case "button":
	      case "input":
	      case "select":
	      case "textarea":
	        props.autoFocus && instance.focus();
	        break a;
	      case "img":
	        props.src
	          ? (instance.src = props.src)
	          : props.srcSet && (instance.srcset = props.srcSet);
	    }
	  } catch (error) {
	    captureCommitPhaseError(finishedWork, finishedWork.return, error);
	  }
	}
	function commitHostUpdate(finishedWork, newProps, oldProps) {
	  try {
	    var domElement = finishedWork.stateNode;
	    updateProperties(domElement, finishedWork.type, oldProps, newProps);
	    domElement[internalPropsKey] = newProps;
	  } catch (error) {
	    captureCommitPhaseError(finishedWork, finishedWork.return, error);
	  }
	}
	function isHostParent(fiber) {
	  return (
	    5 === fiber.tag ||
	    3 === fiber.tag ||
	    26 === fiber.tag ||
	    27 === fiber.tag ||
	    4 === fiber.tag
	  );
	}
	function getHostSibling(fiber) {
	  a: for (;;) {
	    for (; null === fiber.sibling; ) {
	      if (null === fiber.return || isHostParent(fiber.return)) return null;
	      fiber = fiber.return;
	    }
	    fiber.sibling.return = fiber.return;
	    for (
	      fiber = fiber.sibling;
	      5 !== fiber.tag &&
	      6 !== fiber.tag &&
	      27 !== fiber.tag &&
	      18 !== fiber.tag;

	    ) {
	      if (fiber.flags & 2) continue a;
	      if (null === fiber.child || 4 === fiber.tag) continue a;
	      else (fiber.child.return = fiber), (fiber = fiber.child);
	    }
	    if (!(fiber.flags & 2)) return fiber.stateNode;
	  }
	}
	function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
	  var tag = node.tag;
	  if (5 === tag || 6 === tag)
	    (node = node.stateNode),
	      before
	        ? 8 === parent.nodeType
	          ? parent.parentNode.insertBefore(node, before)
	          : parent.insertBefore(node, before)
	        : (8 === parent.nodeType
	            ? ((before = parent.parentNode), before.insertBefore(node, parent))
	            : ((before = parent), before.appendChild(node)),
	          (parent = parent._reactRootContainer),
	          (null !== parent && void 0 !== parent) ||
	            null !== before.onclick ||
	            (before.onclick = noop$1));
	  else if (4 !== tag && 27 !== tag && ((node = node.child), null !== node))
	    for (
	      insertOrAppendPlacementNodeIntoContainer(node, before, parent),
	        node = node.sibling;
	      null !== node;

	    )
	      insertOrAppendPlacementNodeIntoContainer(node, before, parent),
	        (node = node.sibling);
	}
	function insertOrAppendPlacementNode(node, before, parent) {
	  var tag = node.tag;
	  if (5 === tag || 6 === tag)
	    (node = node.stateNode),
	      before ? parent.insertBefore(node, before) : parent.appendChild(node);
	  else if (4 !== tag && 27 !== tag && ((node = node.child), null !== node))
	    for (
	      insertOrAppendPlacementNode(node, before, parent), node = node.sibling;
	      null !== node;

	    )
	      insertOrAppendPlacementNode(node, before, parent), (node = node.sibling);
	}
	var offscreenSubtreeIsHidden = false,
	  offscreenSubtreeWasHidden = false,
	  needsFormReset = false,
	  PossiblyWeakSet = "function" === typeof WeakSet ? WeakSet : Set,
	  nextEffect = null,
	  shouldFireAfterActiveInstanceBlur = false;
	function commitBeforeMutationEffects(root, firstChild) {
	  root = root.containerInfo;
	  eventsEnabled = _enabled;
	  root = getActiveElementDeep(root);
	  if (hasSelectionCapabilities(root)) {
	    if ("selectionStart" in root)
	      var JSCompiler_temp = {
	        start: root.selectionStart,
	        end: root.selectionEnd
	      };
	    else
	      a: {
	        JSCompiler_temp =
	          ((JSCompiler_temp = root.ownerDocument) &&
	            JSCompiler_temp.defaultView) ||
	          window;
	        var selection =
	          JSCompiler_temp.getSelection && JSCompiler_temp.getSelection();
	        if (selection && 0 !== selection.rangeCount) {
	          JSCompiler_temp = selection.anchorNode;
	          var anchorOffset = selection.anchorOffset,
	            focusNode = selection.focusNode;
	          selection = selection.focusOffset;
	          try {
	            JSCompiler_temp.nodeType, focusNode.nodeType;
	          } catch (e$20) {
	            JSCompiler_temp = null;
	            break a;
	          }
	          var length = 0,
	            start = -1,
	            end = -1,
	            indexWithinAnchor = 0,
	            indexWithinFocus = 0,
	            node = root,
	            parentNode = null;
	          b: for (;;) {
	            for (var next; ; ) {
	              node !== JSCompiler_temp ||
	                (0 !== anchorOffset && 3 !== node.nodeType) ||
	                (start = length + anchorOffset);
	              node !== focusNode ||
	                (0 !== selection && 3 !== node.nodeType) ||
	                (end = length + selection);
	              3 === node.nodeType && (length += node.nodeValue.length);
	              if (null === (next = node.firstChild)) break;
	              parentNode = node;
	              node = next;
	            }
	            for (;;) {
	              if (node === root) break b;
	              parentNode === JSCompiler_temp &&
	                ++indexWithinAnchor === anchorOffset &&
	                (start = length);
	              parentNode === focusNode &&
	                ++indexWithinFocus === selection &&
	                (end = length);
	              if (null !== (next = node.nextSibling)) break;
	              node = parentNode;
	              parentNode = node.parentNode;
	            }
	            node = next;
	          }
	          JSCompiler_temp =
	            -1 === start || -1 === end ? null : { start: start, end: end };
	        } else JSCompiler_temp = null;
	      }
	    JSCompiler_temp = JSCompiler_temp || { start: 0, end: 0 };
	  } else JSCompiler_temp = null;
	  selectionInformation = { focusedElem: root, selectionRange: JSCompiler_temp };
	  _enabled = false;
	  for (nextEffect = firstChild; null !== nextEffect; )
	    if (
	      ((firstChild = nextEffect),
	      (root = firstChild.child),
	      0 !== (firstChild.subtreeFlags & 1028) && null !== root)
	    )
	      (root.return = firstChild), (nextEffect = root);
	    else
	      for (; null !== nextEffect; ) {
	        firstChild = nextEffect;
	        focusNode = firstChild.alternate;
	        root = firstChild.flags;
	        switch (firstChild.tag) {
	          case 0:
	            break;
	          case 11:
	          case 15:
	            break;
	          case 1:
	            if (0 !== (root & 1024) && null !== focusNode) {
	              root = void 0;
	              JSCompiler_temp = firstChild;
	              anchorOffset = focusNode.memoizedProps;
	              focusNode = focusNode.memoizedState;
	              selection = JSCompiler_temp.stateNode;
	              try {
	                var resolvedPrevProps = resolveClassComponentProps(
	                  JSCompiler_temp.type,
	                  anchorOffset,
	                  JSCompiler_temp.elementType === JSCompiler_temp.type
	                );
	                root = selection.getSnapshotBeforeUpdate(
	                  resolvedPrevProps,
	                  focusNode
	                );
	                selection.__reactInternalSnapshotBeforeUpdate = root;
	              } catch (error) {
	                captureCommitPhaseError(
	                  JSCompiler_temp,
	                  JSCompiler_temp.return,
	                  error
	                );
	              }
	            }
	            break;
	          case 3:
	            if (0 !== (root & 1024))
	              if (
	                ((root = firstChild.stateNode.containerInfo),
	                (JSCompiler_temp = root.nodeType),
	                9 === JSCompiler_temp)
	              )
	                clearContainerSparingly(root);
	              else if (1 === JSCompiler_temp)
	                switch (root.nodeName) {
	                  case "HEAD":
	                  case "HTML":
	                  case "BODY":
	                    clearContainerSparingly(root);
	                    break;
	                  default:
	                    root.textContent = "";
	                }
	            break;
	          case 5:
	          case 26:
	          case 27:
	          case 6:
	          case 4:
	          case 17:
	            break;
	          default:
	            if (0 !== (root & 1024)) throw Error(formatProdErrorMessage(163));
	        }
	        root = firstChild.sibling;
	        if (null !== root) {
	          root.return = firstChild.return;
	          nextEffect = root;
	          break;
	        }
	        nextEffect = firstChild.return;
	      }
	  resolvedPrevProps = shouldFireAfterActiveInstanceBlur;
	  shouldFireAfterActiveInstanceBlur = false;
	  return resolvedPrevProps;
	}
	function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork) {
	  var flags = finishedWork.flags;
	  switch (finishedWork.tag) {
	    case 0:
	    case 11:
	    case 15:
	      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
	      flags & 4 && commitHookEffectListMount(5, finishedWork);
	      break;
	    case 1:
	      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
	      if (flags & 4)
	        if (((finishedRoot = finishedWork.stateNode), null === current))
	          try {
	            finishedRoot.componentDidMount();
	          } catch (error) {
	            captureCommitPhaseError(finishedWork, finishedWork.return, error);
	          }
	        else {
	          var prevProps = resolveClassComponentProps(
	            finishedWork.type,
	            current.memoizedProps
	          );
	          current = current.memoizedState;
	          try {
	            finishedRoot.componentDidUpdate(
	              prevProps,
	              current,
	              finishedRoot.__reactInternalSnapshotBeforeUpdate
	            );
	          } catch (error$111) {
	            captureCommitPhaseError(
	              finishedWork,
	              finishedWork.return,
	              error$111
	            );
	          }
	        }
	      flags & 64 && commitClassCallbacks(finishedWork);
	      flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
	      break;
	    case 3:
	      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
	      if (flags & 64 && ((flags = finishedWork.updateQueue), null !== flags)) {
	        finishedRoot = null;
	        if (null !== finishedWork.child)
	          switch (finishedWork.child.tag) {
	            case 27:
	            case 5:
	              finishedRoot = finishedWork.child.stateNode;
	              break;
	            case 1:
	              finishedRoot = finishedWork.child.stateNode;
	          }
	        try {
	          commitCallbacks(flags, finishedRoot);
	        } catch (error) {
	          captureCommitPhaseError(finishedWork, finishedWork.return, error);
	        }
	      }
	      break;
	    case 26:
	      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
	      flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
	      break;
	    case 27:
	    case 5:
	      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
	      null === current && flags & 4 && commitHostMount(finishedWork);
	      flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
	      break;
	    case 12:
	      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
	      break;
	    case 13:
	      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
	      flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
	      break;
	    case 22:
	      prevProps =
	        null !== finishedWork.memoizedState || offscreenSubtreeIsHidden;
	      if (!prevProps) {
	        current =
	          (null !== current && null !== current.memoizedState) ||
	          offscreenSubtreeWasHidden;
	        var prevOffscreenSubtreeIsHidden = offscreenSubtreeIsHidden,
	          prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
	        offscreenSubtreeIsHidden = prevProps;
	        (offscreenSubtreeWasHidden = current) && !prevOffscreenSubtreeWasHidden
	          ? recursivelyTraverseReappearLayoutEffects(
	              finishedRoot,
	              finishedWork,
	              0 !== (finishedWork.subtreeFlags & 8772)
	            )
	          : recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
	        offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden;
	        offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
	      }
	      flags & 512 &&
	        ("manual" === finishedWork.memoizedProps.mode
	          ? safelyAttachRef(finishedWork, finishedWork.return)
	          : safelyDetachRef(finishedWork, finishedWork.return));
	      break;
	    default:
	      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
	  }
	}
	function detachFiberAfterEffects(fiber) {
	  var alternate = fiber.alternate;
	  null !== alternate &&
	    ((fiber.alternate = null), detachFiberAfterEffects(alternate));
	  fiber.child = null;
	  fiber.deletions = null;
	  fiber.sibling = null;
	  5 === fiber.tag &&
	    ((alternate = fiber.stateNode),
	    null !== alternate && detachDeletedInstance(alternate));
	  fiber.stateNode = null;
	  fiber.return = null;
	  fiber.dependencies = null;
	  fiber.memoizedProps = null;
	  fiber.memoizedState = null;
	  fiber.pendingProps = null;
	  fiber.stateNode = null;
	  fiber.updateQueue = null;
	}
	var hostParent = null,
	  hostParentIsContainer = false;
	function recursivelyTraverseDeletionEffects(
	  finishedRoot,
	  nearestMountedAncestor,
	  parent
	) {
	  for (parent = parent.child; null !== parent; )
	    commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, parent),
	      (parent = parent.sibling);
	}
	function commitDeletionEffectsOnFiber(
	  finishedRoot,
	  nearestMountedAncestor,
	  deletedFiber
	) {
	  if (injectedHook && "function" === typeof injectedHook.onCommitFiberUnmount)
	    try {
	      injectedHook.onCommitFiberUnmount(rendererID, deletedFiber);
	    } catch (err) {}
	  switch (deletedFiber.tag) {
	    case 26:
	      offscreenSubtreeWasHidden ||
	        safelyDetachRef(deletedFiber, nearestMountedAncestor);
	      recursivelyTraverseDeletionEffects(
	        finishedRoot,
	        nearestMountedAncestor,
	        deletedFiber
	      );
	      deletedFiber.memoizedState
	        ? deletedFiber.memoizedState.count--
	        : deletedFiber.stateNode &&
	          ((deletedFiber = deletedFiber.stateNode),
	          deletedFiber.parentNode.removeChild(deletedFiber));
	      break;
	    case 27:
	      offscreenSubtreeWasHidden ||
	        safelyDetachRef(deletedFiber, nearestMountedAncestor);
	      var prevHostParent = hostParent,
	        prevHostParentIsContainer = hostParentIsContainer;
	      hostParent = deletedFiber.stateNode;
	      recursivelyTraverseDeletionEffects(
	        finishedRoot,
	        nearestMountedAncestor,
	        deletedFiber
	      );
	      deletedFiber = deletedFiber.stateNode;
	      for (
	        nearestMountedAncestor = deletedFiber.attributes;
	        nearestMountedAncestor.length;

	      )
	        deletedFiber.removeAttributeNode(nearestMountedAncestor[0]);
	      detachDeletedInstance(deletedFiber);
	      hostParent = prevHostParent;
	      hostParentIsContainer = prevHostParentIsContainer;
	      break;
	    case 5:
	      offscreenSubtreeWasHidden ||
	        safelyDetachRef(deletedFiber, nearestMountedAncestor);
	    case 6:
	      prevHostParentIsContainer = hostParent;
	      var prevHostParentIsContainer$119 = hostParentIsContainer;
	      hostParent = null;
	      recursivelyTraverseDeletionEffects(
	        finishedRoot,
	        nearestMountedAncestor,
	        deletedFiber
	      );
	      hostParent = prevHostParentIsContainer;
	      hostParentIsContainer = prevHostParentIsContainer$119;
	      if (null !== hostParent)
	        if (hostParentIsContainer)
	          try {
	            (finishedRoot = hostParent),
	              (prevHostParent = deletedFiber.stateNode),
	              8 === finishedRoot.nodeType
	                ? finishedRoot.parentNode.removeChild(prevHostParent)
	                : finishedRoot.removeChild(prevHostParent);
	          } catch (error) {
	            captureCommitPhaseError(
	              deletedFiber,
	              nearestMountedAncestor,
	              error
	            );
	          }
	        else
	          try {
	            hostParent.removeChild(deletedFiber.stateNode);
	          } catch (error) {
	            captureCommitPhaseError(
	              deletedFiber,
	              nearestMountedAncestor,
	              error
	            );
	          }
	      break;
	    case 18:
	      null !== hostParent &&
	        (hostParentIsContainer
	          ? ((nearestMountedAncestor = hostParent),
	            (deletedFiber = deletedFiber.stateNode),
	            8 === nearestMountedAncestor.nodeType
	              ? clearSuspenseBoundary(
	                  nearestMountedAncestor.parentNode,
	                  deletedFiber
	                )
	              : 1 === nearestMountedAncestor.nodeType &&
	                clearSuspenseBoundary(nearestMountedAncestor, deletedFiber),
	            retryIfBlockedOn(nearestMountedAncestor))
	          : clearSuspenseBoundary(hostParent, deletedFiber.stateNode));
	      break;
	    case 4:
	      prevHostParent = hostParent;
	      prevHostParentIsContainer = hostParentIsContainer;
	      hostParent = deletedFiber.stateNode.containerInfo;
	      hostParentIsContainer = true;
	      recursivelyTraverseDeletionEffects(
	        finishedRoot,
	        nearestMountedAncestor,
	        deletedFiber
	      );
	      hostParent = prevHostParent;
	      hostParentIsContainer = prevHostParentIsContainer;
	      break;
	    case 0:
	    case 11:
	    case 14:
	    case 15:
	      offscreenSubtreeWasHidden ||
	        commitHookEffectListUnmount(2, deletedFiber, nearestMountedAncestor);
	      offscreenSubtreeWasHidden ||
	        commitHookEffectListUnmount(4, deletedFiber, nearestMountedAncestor);
	      recursivelyTraverseDeletionEffects(
	        finishedRoot,
	        nearestMountedAncestor,
	        deletedFiber
	      );
	      break;
	    case 1:
	      offscreenSubtreeWasHidden ||
	        (safelyDetachRef(deletedFiber, nearestMountedAncestor),
	        (prevHostParent = deletedFiber.stateNode),
	        "function" === typeof prevHostParent.componentWillUnmount &&
	          safelyCallComponentWillUnmount(
	            deletedFiber,
	            nearestMountedAncestor,
	            prevHostParent
	          ));
	      recursivelyTraverseDeletionEffects(
	        finishedRoot,
	        nearestMountedAncestor,
	        deletedFiber
	      );
	      break;
	    case 21:
	      recursivelyTraverseDeletionEffects(
	        finishedRoot,
	        nearestMountedAncestor,
	        deletedFiber
	      );
	      break;
	    case 22:
	      offscreenSubtreeWasHidden ||
	        safelyDetachRef(deletedFiber, nearestMountedAncestor);
	      offscreenSubtreeWasHidden =
	        (prevHostParent = offscreenSubtreeWasHidden) ||
	        null !== deletedFiber.memoizedState;
	      recursivelyTraverseDeletionEffects(
	        finishedRoot,
	        nearestMountedAncestor,
	        deletedFiber
	      );
	      offscreenSubtreeWasHidden = prevHostParent;
	      break;
	    default:
	      recursivelyTraverseDeletionEffects(
	        finishedRoot,
	        nearestMountedAncestor,
	        deletedFiber
	      );
	  }
	}
	function commitSuspenseHydrationCallbacks(finishedRoot, finishedWork) {
	  if (
	    null === finishedWork.memoizedState &&
	    ((finishedRoot = finishedWork.alternate),
	    null !== finishedRoot &&
	      ((finishedRoot = finishedRoot.memoizedState),
	      null !== finishedRoot &&
	        ((finishedRoot = finishedRoot.dehydrated), null !== finishedRoot)))
	  )
	    try {
	      retryIfBlockedOn(finishedRoot);
	    } catch (error) {
	      captureCommitPhaseError(finishedWork, finishedWork.return, error);
	    }
	}
	function getRetryCache(finishedWork) {
	  switch (finishedWork.tag) {
	    case 13:
	    case 19:
	      var retryCache = finishedWork.stateNode;
	      null === retryCache &&
	        (retryCache = finishedWork.stateNode = new PossiblyWeakSet());
	      return retryCache;
	    case 22:
	      return (
	        (finishedWork = finishedWork.stateNode),
	        (retryCache = finishedWork._retryCache),
	        null === retryCache &&
	          (retryCache = finishedWork._retryCache = new PossiblyWeakSet()),
	        retryCache
	      );
	    default:
	      throw Error(formatProdErrorMessage(435, finishedWork.tag));
	  }
	}
	function attachSuspenseRetryListeners(finishedWork, wakeables) {
	  var retryCache = getRetryCache(finishedWork);
	  wakeables.forEach(function (wakeable) {
	    var retry = resolveRetryWakeable.bind(null, finishedWork, wakeable);
	    retryCache.has(wakeable) ||
	      (retryCache.add(wakeable), wakeable.then(retry, retry));
	  });
	}
	function recursivelyTraverseMutationEffects(root$jscomp$0, parentFiber) {
	  var deletions = parentFiber.deletions;
	  if (null !== deletions)
	    for (var i = 0; i < deletions.length; i++) {
	      var childToDelete = deletions[i],
	        root = root$jscomp$0,
	        returnFiber = parentFiber,
	        parent = returnFiber;
	      a: for (; null !== parent; ) {
	        switch (parent.tag) {
	          case 27:
	          case 5:
	            hostParent = parent.stateNode;
	            hostParentIsContainer = false;
	            break a;
	          case 3:
	            hostParent = parent.stateNode.containerInfo;
	            hostParentIsContainer = true;
	            break a;
	          case 4:
	            hostParent = parent.stateNode.containerInfo;
	            hostParentIsContainer = true;
	            break a;
	        }
	        parent = parent.return;
	      }
	      if (null === hostParent) throw Error(formatProdErrorMessage(160));
	      commitDeletionEffectsOnFiber(root, returnFiber, childToDelete);
	      hostParent = null;
	      hostParentIsContainer = false;
	      root = childToDelete.alternate;
	      null !== root && (root.return = null);
	      childToDelete.return = null;
	    }
	  if (parentFiber.subtreeFlags & 13878)
	    for (parentFiber = parentFiber.child; null !== parentFiber; )
	      commitMutationEffectsOnFiber(parentFiber, root$jscomp$0),
	        (parentFiber = parentFiber.sibling);
	}
	var currentHoistableRoot = null;
	function commitMutationEffectsOnFiber(finishedWork, root) {
	  var current = finishedWork.alternate,
	    flags = finishedWork.flags;
	  switch (finishedWork.tag) {
	    case 0:
	    case 11:
	    case 14:
	    case 15:
	      recursivelyTraverseMutationEffects(root, finishedWork);
	      commitReconciliationEffects(finishedWork);
	      flags & 4 &&
	        (commitHookEffectListUnmount(3, finishedWork, finishedWork.return),
	        commitHookEffectListMount(3, finishedWork),
	        commitHookEffectListUnmount(5, finishedWork, finishedWork.return));
	      break;
	    case 1:
	      recursivelyTraverseMutationEffects(root, finishedWork);
	      commitReconciliationEffects(finishedWork);
	      flags & 512 &&
	        (offscreenSubtreeWasHidden ||
	          null === current ||
	          safelyDetachRef(current, current.return));
	      flags & 64 &&
	        offscreenSubtreeIsHidden &&
	        ((finishedWork = finishedWork.updateQueue),
	        null !== finishedWork &&
	          ((flags = finishedWork.callbacks),
	          null !== flags &&
	            ((current = finishedWork.shared.hiddenCallbacks),
	            (finishedWork.shared.hiddenCallbacks =
	              null === current ? flags : current.concat(flags)))));
	      break;
	    case 26:
	      var hoistableRoot = currentHoistableRoot;
	      recursivelyTraverseMutationEffects(root, finishedWork);
	      commitReconciliationEffects(finishedWork);
	      flags & 512 &&
	        (offscreenSubtreeWasHidden ||
	          null === current ||
	          safelyDetachRef(current, current.return));
	      if (flags & 4) {
	        var currentResource = null !== current ? current.memoizedState : null;
	        flags = finishedWork.memoizedState;
	        if (null === current)
	          if (null === flags)
	            if (null === finishedWork.stateNode) {
	              a: {
	                flags = finishedWork.type;
	                current = finishedWork.memoizedProps;
	                hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
	                b: switch (flags) {
	                  case "title":
	                    currentResource =
	                      hoistableRoot.getElementsByTagName("title")[0];
	                    if (
	                      !currentResource ||
	                      currentResource[internalHoistableMarker] ||
	                      currentResource[internalInstanceKey] ||
	                      "http://www.w3.org/2000/svg" ===
	                        currentResource.namespaceURI ||
	                      currentResource.hasAttribute("itemprop")
	                    )
	                      (currentResource = hoistableRoot.createElement(flags)),
	                        hoistableRoot.head.insertBefore(
	                          currentResource,
	                          hoistableRoot.querySelector("head > title")
	                        );
	                    setInitialProperties(currentResource, flags, current);
	                    currentResource[internalInstanceKey] = finishedWork;
	                    markNodeAsHoistable(currentResource);
	                    flags = currentResource;
	                    break a;
	                  case "link":
	                    var maybeNodes = getHydratableHoistableCache(
	                      "link",
	                      "href",
	                      hoistableRoot
	                    ).get(flags + (current.href || ""));
	                    if (maybeNodes)
	                      for (var i = 0; i < maybeNodes.length; i++)
	                        if (
	                          ((currentResource = maybeNodes[i]),
	                          currentResource.getAttribute("href") ===
	                            (null == current.href ? null : current.href) &&
	                            currentResource.getAttribute("rel") ===
	                              (null == current.rel ? null : current.rel) &&
	                            currentResource.getAttribute("title") ===
	                              (null == current.title ? null : current.title) &&
	                            currentResource.getAttribute("crossorigin") ===
	                              (null == current.crossOrigin
	                                ? null
	                                : current.crossOrigin))
	                        ) {
	                          maybeNodes.splice(i, 1);
	                          break b;
	                        }
	                    currentResource = hoistableRoot.createElement(flags);
	                    setInitialProperties(currentResource, flags, current);
	                    hoistableRoot.head.appendChild(currentResource);
	                    break;
	                  case "meta":
	                    if (
	                      (maybeNodes = getHydratableHoistableCache(
	                        "meta",
	                        "content",
	                        hoistableRoot
	                      ).get(flags + (current.content || "")))
	                    )
	                      for (i = 0; i < maybeNodes.length; i++)
	                        if (
	                          ((currentResource = maybeNodes[i]),
	                          currentResource.getAttribute("content") ===
	                            (null == current.content
	                              ? null
	                              : "" + current.content) &&
	                            currentResource.getAttribute("name") ===
	                              (null == current.name ? null : current.name) &&
	                            currentResource.getAttribute("property") ===
	                              (null == current.property
	                                ? null
	                                : current.property) &&
	                            currentResource.getAttribute("http-equiv") ===
	                              (null == current.httpEquiv
	                                ? null
	                                : current.httpEquiv) &&
	                            currentResource.getAttribute("charset") ===
	                              (null == current.charSet
	                                ? null
	                                : current.charSet))
	                        ) {
	                          maybeNodes.splice(i, 1);
	                          break b;
	                        }
	                    currentResource = hoistableRoot.createElement(flags);
	                    setInitialProperties(currentResource, flags, current);
	                    hoistableRoot.head.appendChild(currentResource);
	                    break;
	                  default:
	                    throw Error(formatProdErrorMessage(468, flags));
	                }
	                currentResource[internalInstanceKey] = finishedWork;
	                markNodeAsHoistable(currentResource);
	                flags = currentResource;
	              }
	              finishedWork.stateNode = flags;
	            } else
	              mountHoistable(
	                hoistableRoot,
	                finishedWork.type,
	                finishedWork.stateNode
	              );
	          else
	            finishedWork.stateNode = acquireResource(
	              hoistableRoot,
	              flags,
	              finishedWork.memoizedProps
	            );
	        else
	          currentResource !== flags
	            ? (null === currentResource
	                ? null !== current.stateNode &&
	                  ((current = current.stateNode),
	                  current.parentNode.removeChild(current))
	                : currentResource.count--,
	              null === flags
	                ? mountHoistable(
	                    hoistableRoot,
	                    finishedWork.type,
	                    finishedWork.stateNode
	                  )
	                : acquireResource(
	                    hoistableRoot,
	                    flags,
	                    finishedWork.memoizedProps
	                  ))
	            : null === flags &&
	              null !== finishedWork.stateNode &&
	              commitHostUpdate(
	                finishedWork,
	                finishedWork.memoizedProps,
	                current.memoizedProps
	              );
	      }
	      break;
	    case 27:
	      if (flags & 4 && null === finishedWork.alternate) {
	        hoistableRoot = finishedWork.stateNode;
	        currentResource = finishedWork.memoizedProps;
	        try {
	          for (var node = hoistableRoot.firstChild; node; ) {
	            var nextNode = node.nextSibling,
	              nodeName = node.nodeName;
	            node[internalHoistableMarker] ||
	              "HEAD" === nodeName ||
	              "BODY" === nodeName ||
	              "SCRIPT" === nodeName ||
	              "STYLE" === nodeName ||
	              ("LINK" === nodeName &&
	                "stylesheet" === node.rel.toLowerCase()) ||
	              hoistableRoot.removeChild(node);
	            node = nextNode;
	          }
	          for (
	            var type = finishedWork.type, attributes = hoistableRoot.attributes;
	            attributes.length;

	          )
	            hoistableRoot.removeAttributeNode(attributes[0]);
	          setInitialProperties(hoistableRoot, type, currentResource);
	          hoistableRoot[internalInstanceKey] = finishedWork;
	          hoistableRoot[internalPropsKey] = currentResource;
	        } catch (error) {
	          captureCommitPhaseError(finishedWork, finishedWork.return, error);
	        }
	      }
	    case 5:
	      recursivelyTraverseMutationEffects(root, finishedWork);
	      commitReconciliationEffects(finishedWork);
	      flags & 512 &&
	        (offscreenSubtreeWasHidden ||
	          null === current ||
	          safelyDetachRef(current, current.return));
	      if (finishedWork.flags & 32) {
	        hoistableRoot = finishedWork.stateNode;
	        try {
	          setTextContent(hoistableRoot, "");
	        } catch (error) {
	          captureCommitPhaseError(finishedWork, finishedWork.return, error);
	        }
	      }
	      flags & 4 &&
	        null != finishedWork.stateNode &&
	        ((hoistableRoot = finishedWork.memoizedProps),
	        commitHostUpdate(
	          finishedWork,
	          hoistableRoot,
	          null !== current ? current.memoizedProps : hoistableRoot
	        ));
	      flags & 1024 && (needsFormReset = true);
	      break;
	    case 6:
	      recursivelyTraverseMutationEffects(root, finishedWork);
	      commitReconciliationEffects(finishedWork);
	      if (flags & 4) {
	        if (null === finishedWork.stateNode)
	          throw Error(formatProdErrorMessage(162));
	        flags = finishedWork.memoizedProps;
	        current = finishedWork.stateNode;
	        try {
	          current.nodeValue = flags;
	        } catch (error) {
	          captureCommitPhaseError(finishedWork, finishedWork.return, error);
	        }
	      }
	      break;
	    case 3:
	      tagCaches = null;
	      hoistableRoot = currentHoistableRoot;
	      currentHoistableRoot = getHoistableRoot(root.containerInfo);
	      recursivelyTraverseMutationEffects(root, finishedWork);
	      currentHoistableRoot = hoistableRoot;
	      commitReconciliationEffects(finishedWork);
	      if (flags & 4 && null !== current && current.memoizedState.isDehydrated)
	        try {
	          retryIfBlockedOn(root.containerInfo);
	        } catch (error) {
	          captureCommitPhaseError(finishedWork, finishedWork.return, error);
	        }
	      needsFormReset &&
	        ((needsFormReset = false), recursivelyResetForms(finishedWork));
	      break;
	    case 4:
	      flags = currentHoistableRoot;
	      currentHoistableRoot = getHoistableRoot(
	        finishedWork.stateNode.containerInfo
	      );
	      recursivelyTraverseMutationEffects(root, finishedWork);
	      commitReconciliationEffects(finishedWork);
	      currentHoistableRoot = flags;
	      break;
	    case 12:
	      recursivelyTraverseMutationEffects(root, finishedWork);
	      commitReconciliationEffects(finishedWork);
	      break;
	    case 13:
	      recursivelyTraverseMutationEffects(root, finishedWork);
	      commitReconciliationEffects(finishedWork);
	      finishedWork.child.flags & 8192 &&
	        (null !== finishedWork.memoizedState) !==
	          (null !== current && null !== current.memoizedState) &&
	        (globalMostRecentFallbackTime = now());
	      flags & 4 &&
	        ((flags = finishedWork.updateQueue),
	        null !== flags &&
	          ((finishedWork.updateQueue = null),
	          attachSuspenseRetryListeners(finishedWork, flags)));
	      break;
	    case 22:
	      flags & 512 &&
	        (offscreenSubtreeWasHidden ||
	          null === current ||
	          safelyDetachRef(current, current.return));
	      node = null !== finishedWork.memoizedState;
	      nextNode = null !== current && null !== current.memoizedState;
	      nodeName = offscreenSubtreeIsHidden;
	      type = offscreenSubtreeWasHidden;
	      offscreenSubtreeIsHidden = nodeName || node;
	      offscreenSubtreeWasHidden = type || nextNode;
	      recursivelyTraverseMutationEffects(root, finishedWork);
	      offscreenSubtreeWasHidden = type;
	      offscreenSubtreeIsHidden = nodeName;
	      commitReconciliationEffects(finishedWork);
	      root = finishedWork.stateNode;
	      root._current = finishedWork;
	      root._visibility &= -3;
	      root._visibility |= root._pendingVisibility & 2;
	      if (
	        flags & 8192 &&
	        ((root._visibility = node
	          ? root._visibility & -2
	          : root._visibility | 1),
	        node &&
	          ((root = offscreenSubtreeIsHidden || offscreenSubtreeWasHidden),
	          null === current ||
	            nextNode ||
	            root ||
	            recursivelyTraverseDisappearLayoutEffects(finishedWork)),
	        null === finishedWork.memoizedProps ||
	          "manual" !== finishedWork.memoizedProps.mode)
	      )
	        a: for (current = null, root = finishedWork; ; ) {
	          if (5 === root.tag || 26 === root.tag || 27 === root.tag) {
	            if (null === current) {
	              nextNode = current = root;
	              try {
	                if (((hoistableRoot = nextNode.stateNode), node))
	                  (currentResource = hoistableRoot.style),
	                    "function" === typeof currentResource.setProperty
	                      ? currentResource.setProperty(
	                          "display",
	                          "none",
	                          "important"
	                        )
	                      : (currentResource.display = "none");
	                else {
	                  maybeNodes = nextNode.stateNode;
	                  i = nextNode.memoizedProps.style;
	                  var display =
	                    void 0 !== i && null !== i && i.hasOwnProperty("display")
	                      ? i.display
	                      : null;
	                  maybeNodes.style.display =
	                    null == display || "boolean" === typeof display
	                      ? ""
	                      : ("" + display).trim();
	                }
	              } catch (error) {
	                captureCommitPhaseError(nextNode, nextNode.return, error);
	              }
	            }
	          } else if (6 === root.tag) {
	            if (null === current) {
	              nextNode = root;
	              try {
	                nextNode.stateNode.nodeValue = node
	                  ? ""
	                  : nextNode.memoizedProps;
	              } catch (error) {
	                captureCommitPhaseError(nextNode, nextNode.return, error);
	              }
	            }
	          } else if (
	            ((22 !== root.tag && 23 !== root.tag) ||
	              null === root.memoizedState ||
	              root === finishedWork) &&
	            null !== root.child
	          ) {
	            root.child.return = root;
	            root = root.child;
	            continue;
	          }
	          if (root === finishedWork) break a;
	          for (; null === root.sibling; ) {
	            if (null === root.return || root.return === finishedWork) break a;
	            current === root && (current = null);
	            root = root.return;
	          }
	          current === root && (current = null);
	          root.sibling.return = root.return;
	          root = root.sibling;
	        }
	      flags & 4 &&
	        ((flags = finishedWork.updateQueue),
	        null !== flags &&
	          ((current = flags.retryQueue),
	          null !== current &&
	            ((flags.retryQueue = null),
	            attachSuspenseRetryListeners(finishedWork, current))));
	      break;
	    case 19:
	      recursivelyTraverseMutationEffects(root, finishedWork);
	      commitReconciliationEffects(finishedWork);
	      flags & 4 &&
	        ((flags = finishedWork.updateQueue),
	        null !== flags &&
	          ((finishedWork.updateQueue = null),
	          attachSuspenseRetryListeners(finishedWork, flags)));
	      break;
	    case 21:
	      break;
	    default:
	      recursivelyTraverseMutationEffects(root, finishedWork),
	        commitReconciliationEffects(finishedWork);
	  }
	}
	function commitReconciliationEffects(finishedWork) {
	  var flags = finishedWork.flags;
	  if (flags & 2) {
	    try {
	      if (27 !== finishedWork.tag) {
	        a: {
	          for (var parent = finishedWork.return; null !== parent; ) {
	            if (isHostParent(parent)) {
	              var JSCompiler_inline_result = parent;
	              break a;
	            }
	            parent = parent.return;
	          }
	          throw Error(formatProdErrorMessage(160));
	        }
	        switch (JSCompiler_inline_result.tag) {
	          case 27:
	            var parent$jscomp$0 = JSCompiler_inline_result.stateNode,
	              before = getHostSibling(finishedWork);
	            insertOrAppendPlacementNode(finishedWork, before, parent$jscomp$0);
	            break;
	          case 5:
	            var parent$113 = JSCompiler_inline_result.stateNode;
	            JSCompiler_inline_result.flags & 32 &&
	              (setTextContent(parent$113, ""),
	              (JSCompiler_inline_result.flags &= -33));
	            var before$114 = getHostSibling(finishedWork);
	            insertOrAppendPlacementNode(finishedWork, before$114, parent$113);
	            break;
	          case 3:
	          case 4:
	            var parent$115 = JSCompiler_inline_result.stateNode.containerInfo,
	              before$116 = getHostSibling(finishedWork);
	            insertOrAppendPlacementNodeIntoContainer(
	              finishedWork,
	              before$116,
	              parent$115
	            );
	            break;
	          default:
	            throw Error(formatProdErrorMessage(161));
	        }
	      }
	    } catch (error) {
	      captureCommitPhaseError(finishedWork, finishedWork.return, error);
	    }
	    finishedWork.flags &= -3;
	  }
	  flags & 4096 && (finishedWork.flags &= -4097);
	}
	function recursivelyResetForms(parentFiber) {
	  if (parentFiber.subtreeFlags & 1024)
	    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
	      var fiber = parentFiber;
	      recursivelyResetForms(fiber);
	      5 === fiber.tag && fiber.flags & 1024 && fiber.stateNode.reset();
	      parentFiber = parentFiber.sibling;
	    }
	}
	function recursivelyTraverseLayoutEffects(root, parentFiber) {
	  if (parentFiber.subtreeFlags & 8772)
	    for (parentFiber = parentFiber.child; null !== parentFiber; )
	      commitLayoutEffectOnFiber(root, parentFiber.alternate, parentFiber),
	        (parentFiber = parentFiber.sibling);
	}
	function recursivelyTraverseDisappearLayoutEffects(parentFiber) {
	  for (parentFiber = parentFiber.child; null !== parentFiber; ) {
	    var finishedWork = parentFiber;
	    switch (finishedWork.tag) {
	      case 0:
	      case 11:
	      case 14:
	      case 15:
	        commitHookEffectListUnmount(4, finishedWork, finishedWork.return);
	        recursivelyTraverseDisappearLayoutEffects(finishedWork);
	        break;
	      case 1:
	        safelyDetachRef(finishedWork, finishedWork.return);
	        var instance = finishedWork.stateNode;
	        "function" === typeof instance.componentWillUnmount &&
	          safelyCallComponentWillUnmount(
	            finishedWork,
	            finishedWork.return,
	            instance
	          );
	        recursivelyTraverseDisappearLayoutEffects(finishedWork);
	        break;
	      case 26:
	      case 27:
	      case 5:
	        safelyDetachRef(finishedWork, finishedWork.return);
	        recursivelyTraverseDisappearLayoutEffects(finishedWork);
	        break;
	      case 22:
	        safelyDetachRef(finishedWork, finishedWork.return);
	        null === finishedWork.memoizedState &&
	          recursivelyTraverseDisappearLayoutEffects(finishedWork);
	        break;
	      default:
	        recursivelyTraverseDisappearLayoutEffects(finishedWork);
	    }
	    parentFiber = parentFiber.sibling;
	  }
	}
	function recursivelyTraverseReappearLayoutEffects(
	  finishedRoot$jscomp$0,
	  parentFiber,
	  includeWorkInProgressEffects
	) {
	  includeWorkInProgressEffects =
	    includeWorkInProgressEffects && 0 !== (parentFiber.subtreeFlags & 8772);
	  for (parentFiber = parentFiber.child; null !== parentFiber; ) {
	    var current = parentFiber.alternate,
	      finishedRoot = finishedRoot$jscomp$0,
	      finishedWork = parentFiber,
	      flags = finishedWork.flags;
	    switch (finishedWork.tag) {
	      case 0:
	      case 11:
	      case 15:
	        recursivelyTraverseReappearLayoutEffects(
	          finishedRoot,
	          finishedWork,
	          includeWorkInProgressEffects
	        );
	        commitHookEffectListMount(4, finishedWork);
	        break;
	      case 1:
	        recursivelyTraverseReappearLayoutEffects(
	          finishedRoot,
	          finishedWork,
	          includeWorkInProgressEffects
	        );
	        current = finishedWork;
	        finishedRoot = current.stateNode;
	        if ("function" === typeof finishedRoot.componentDidMount)
	          try {
	            finishedRoot.componentDidMount();
	          } catch (error) {
	            captureCommitPhaseError(current, current.return, error);
	          }
	        current = finishedWork;
	        finishedRoot = current.updateQueue;
	        if (null !== finishedRoot) {
	          var instance = current.stateNode;
	          try {
	            var hiddenCallbacks = finishedRoot.shared.hiddenCallbacks;
	            if (null !== hiddenCallbacks)
	              for (
	                finishedRoot.shared.hiddenCallbacks = null, finishedRoot = 0;
	                finishedRoot < hiddenCallbacks.length;
	                finishedRoot++
	              )
	                callCallback(hiddenCallbacks[finishedRoot], instance);
	          } catch (error) {
	            captureCommitPhaseError(current, current.return, error);
	          }
	        }
	        includeWorkInProgressEffects &&
	          flags & 64 &&
	          commitClassCallbacks(finishedWork);
	        safelyAttachRef(finishedWork, finishedWork.return);
	        break;
	      case 26:
	      case 27:
	      case 5:
	        recursivelyTraverseReappearLayoutEffects(
	          finishedRoot,
	          finishedWork,
	          includeWorkInProgressEffects
	        );
	        includeWorkInProgressEffects &&
	          null === current &&
	          flags & 4 &&
	          commitHostMount(finishedWork);
	        safelyAttachRef(finishedWork, finishedWork.return);
	        break;
	      case 12:
	        recursivelyTraverseReappearLayoutEffects(
	          finishedRoot,
	          finishedWork,
	          includeWorkInProgressEffects
	        );
	        break;
	      case 13:
	        recursivelyTraverseReappearLayoutEffects(
	          finishedRoot,
	          finishedWork,
	          includeWorkInProgressEffects
	        );
	        includeWorkInProgressEffects &&
	          flags & 4 &&
	          commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
	        break;
	      case 22:
	        null === finishedWork.memoizedState &&
	          recursivelyTraverseReappearLayoutEffects(
	            finishedRoot,
	            finishedWork,
	            includeWorkInProgressEffects
	          );
	        safelyAttachRef(finishedWork, finishedWork.return);
	        break;
	      default:
	        recursivelyTraverseReappearLayoutEffects(
	          finishedRoot,
	          finishedWork,
	          includeWorkInProgressEffects
	        );
	    }
	    parentFiber = parentFiber.sibling;
	  }
	}
	function commitOffscreenPassiveMountEffects(current, finishedWork) {
	  var previousCache = null;
	  null !== current &&
	    null !== current.memoizedState &&
	    null !== current.memoizedState.cachePool &&
	    (previousCache = current.memoizedState.cachePool.pool);
	  current = null;
	  null !== finishedWork.memoizedState &&
	    null !== finishedWork.memoizedState.cachePool &&
	    (current = finishedWork.memoizedState.cachePool.pool);
	  current !== previousCache &&
	    (null != current && current.refCount++,
	    null != previousCache && releaseCache(previousCache));
	}
	function commitCachePassiveMountEffect(current, finishedWork) {
	  current = null;
	  null !== finishedWork.alternate &&
	    (current = finishedWork.alternate.memoizedState.cache);
	  finishedWork = finishedWork.memoizedState.cache;
	  finishedWork !== current &&
	    (finishedWork.refCount++, null != current && releaseCache(current));
	}
	function recursivelyTraversePassiveMountEffects(
	  root,
	  parentFiber,
	  committedLanes,
	  committedTransitions
	) {
	  if (parentFiber.subtreeFlags & 10256)
	    for (parentFiber = parentFiber.child; null !== parentFiber; )
	      commitPassiveMountOnFiber(
	        root,
	        parentFiber,
	        committedLanes,
	        committedTransitions
	      ),
	        (parentFiber = parentFiber.sibling);
	}
	function commitPassiveMountOnFiber(
	  finishedRoot,
	  finishedWork,
	  committedLanes,
	  committedTransitions
	) {
	  var flags = finishedWork.flags;
	  switch (finishedWork.tag) {
	    case 0:
	    case 11:
	    case 15:
	      recursivelyTraversePassiveMountEffects(
	        finishedRoot,
	        finishedWork,
	        committedLanes,
	        committedTransitions
	      );
	      flags & 2048 && commitHookEffectListMount(9, finishedWork);
	      break;
	    case 3:
	      recursivelyTraversePassiveMountEffects(
	        finishedRoot,
	        finishedWork,
	        committedLanes,
	        committedTransitions
	      );
	      flags & 2048 &&
	        ((finishedRoot = null),
	        null !== finishedWork.alternate &&
	          (finishedRoot = finishedWork.alternate.memoizedState.cache),
	        (finishedWork = finishedWork.memoizedState.cache),
	        finishedWork !== finishedRoot &&
	          (finishedWork.refCount++,
	          null != finishedRoot && releaseCache(finishedRoot)));
	      break;
	    case 12:
	      if (flags & 2048) {
	        recursivelyTraversePassiveMountEffects(
	          finishedRoot,
	          finishedWork,
	          committedLanes,
	          committedTransitions
	        );
	        finishedRoot = finishedWork.stateNode;
	        try {
	          var _finishedWork$memoize2 = finishedWork.memoizedProps,
	            id = _finishedWork$memoize2.id,
	            onPostCommit = _finishedWork$memoize2.onPostCommit;
	          "function" === typeof onPostCommit &&
	            onPostCommit(
	              id,
	              null === finishedWork.alternate ? "mount" : "update",
	              finishedRoot.passiveEffectDuration,
	              -0
	            );
	        } catch (error) {
	          captureCommitPhaseError(finishedWork, finishedWork.return, error);
	        }
	      } else
	        recursivelyTraversePassiveMountEffects(
	          finishedRoot,
	          finishedWork,
	          committedLanes,
	          committedTransitions
	        );
	      break;
	    case 23:
	      break;
	    case 22:
	      _finishedWork$memoize2 = finishedWork.stateNode;
	      null !== finishedWork.memoizedState
	        ? _finishedWork$memoize2._visibility & 4
	          ? recursivelyTraversePassiveMountEffects(
	              finishedRoot,
	              finishedWork,
	              committedLanes,
	              committedTransitions
	            )
	          : recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork)
	        : _finishedWork$memoize2._visibility & 4
	          ? recursivelyTraversePassiveMountEffects(
	              finishedRoot,
	              finishedWork,
	              committedLanes,
	              committedTransitions
	            )
	          : ((_finishedWork$memoize2._visibility |= 4),
	            recursivelyTraverseReconnectPassiveEffects(
	              finishedRoot,
	              finishedWork,
	              committedLanes,
	              committedTransitions,
	              0 !== (finishedWork.subtreeFlags & 10256)
	            ));
	      flags & 2048 &&
	        commitOffscreenPassiveMountEffects(
	          finishedWork.alternate,
	          finishedWork
	        );
	      break;
	    case 24:
	      recursivelyTraversePassiveMountEffects(
	        finishedRoot,
	        finishedWork,
	        committedLanes,
	        committedTransitions
	      );
	      flags & 2048 &&
	        commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
	      break;
	    default:
	      recursivelyTraversePassiveMountEffects(
	        finishedRoot,
	        finishedWork,
	        committedLanes,
	        committedTransitions
	      );
	  }
	}
	function recursivelyTraverseReconnectPassiveEffects(
	  finishedRoot$jscomp$0,
	  parentFiber,
	  committedLanes$jscomp$0,
	  committedTransitions$jscomp$0,
	  includeWorkInProgressEffects
	) {
	  includeWorkInProgressEffects =
	    includeWorkInProgressEffects && 0 !== (parentFiber.subtreeFlags & 10256);
	  for (parentFiber = parentFiber.child; null !== parentFiber; ) {
	    var finishedRoot = finishedRoot$jscomp$0,
	      finishedWork = parentFiber,
	      committedLanes = committedLanes$jscomp$0,
	      committedTransitions = committedTransitions$jscomp$0,
	      flags = finishedWork.flags;
	    switch (finishedWork.tag) {
	      case 0:
	      case 11:
	      case 15:
	        recursivelyTraverseReconnectPassiveEffects(
	          finishedRoot,
	          finishedWork,
	          committedLanes,
	          committedTransitions,
	          includeWorkInProgressEffects
	        );
	        commitHookEffectListMount(8, finishedWork);
	        break;
	      case 23:
	        break;
	      case 22:
	        var instance = finishedWork.stateNode;
	        null !== finishedWork.memoizedState
	          ? instance._visibility & 4
	            ? recursivelyTraverseReconnectPassiveEffects(
	                finishedRoot,
	                finishedWork,
	                committedLanes,
	                committedTransitions,
	                includeWorkInProgressEffects
	              )
	            : recursivelyTraverseAtomicPassiveEffects(
	                finishedRoot,
	                finishedWork
	              )
	          : ((instance._visibility |= 4),
	            recursivelyTraverseReconnectPassiveEffects(
	              finishedRoot,
	              finishedWork,
	              committedLanes,
	              committedTransitions,
	              includeWorkInProgressEffects
	            ));
	        includeWorkInProgressEffects &&
	          flags & 2048 &&
	          commitOffscreenPassiveMountEffects(
	            finishedWork.alternate,
	            finishedWork
	          );
	        break;
	      case 24:
	        recursivelyTraverseReconnectPassiveEffects(
	          finishedRoot,
	          finishedWork,
	          committedLanes,
	          committedTransitions,
	          includeWorkInProgressEffects
	        );
	        includeWorkInProgressEffects &&
	          flags & 2048 &&
	          commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
	        break;
	      default:
	        recursivelyTraverseReconnectPassiveEffects(
	          finishedRoot,
	          finishedWork,
	          committedLanes,
	          committedTransitions,
	          includeWorkInProgressEffects
	        );
	    }
	    parentFiber = parentFiber.sibling;
	  }
	}
	function recursivelyTraverseAtomicPassiveEffects(
	  finishedRoot$jscomp$0,
	  parentFiber
	) {
	  if (parentFiber.subtreeFlags & 10256)
	    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
	      var finishedRoot = finishedRoot$jscomp$0,
	        finishedWork = parentFiber,
	        flags = finishedWork.flags;
	      switch (finishedWork.tag) {
	        case 22:
	          recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
	          flags & 2048 &&
	            commitOffscreenPassiveMountEffects(
	              finishedWork.alternate,
	              finishedWork
	            );
	          break;
	        case 24:
	          recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
	          flags & 2048 &&
	            commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
	          break;
	        default:
	          recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
	      }
	      parentFiber = parentFiber.sibling;
	    }
	}
	var suspenseyCommitFlag = 8192;
	function recursivelyAccumulateSuspenseyCommit(parentFiber) {
	  if (parentFiber.subtreeFlags & suspenseyCommitFlag)
	    for (parentFiber = parentFiber.child; null !== parentFiber; )
	      accumulateSuspenseyCommitOnFiber(parentFiber),
	        (parentFiber = parentFiber.sibling);
	}
	function accumulateSuspenseyCommitOnFiber(fiber) {
	  switch (fiber.tag) {
	    case 26:
	      recursivelyAccumulateSuspenseyCommit(fiber);
	      fiber.flags & suspenseyCommitFlag &&
	        null !== fiber.memoizedState &&
	        suspendResource(
	          currentHoistableRoot,
	          fiber.memoizedState,
	          fiber.memoizedProps
	        );
	      break;
	    case 5:
	      recursivelyAccumulateSuspenseyCommit(fiber);
	      break;
	    case 3:
	    case 4:
	      var previousHoistableRoot = currentHoistableRoot;
	      currentHoistableRoot = getHoistableRoot(fiber.stateNode.containerInfo);
	      recursivelyAccumulateSuspenseyCommit(fiber);
	      currentHoistableRoot = previousHoistableRoot;
	      break;
	    case 22:
	      null === fiber.memoizedState &&
	        ((previousHoistableRoot = fiber.alternate),
	        null !== previousHoistableRoot &&
	        null !== previousHoistableRoot.memoizedState
	          ? ((previousHoistableRoot = suspenseyCommitFlag),
	            (suspenseyCommitFlag = 16777216),
	            recursivelyAccumulateSuspenseyCommit(fiber),
	            (suspenseyCommitFlag = previousHoistableRoot))
	          : recursivelyAccumulateSuspenseyCommit(fiber));
	      break;
	    default:
	      recursivelyAccumulateSuspenseyCommit(fiber);
	  }
	}
	function detachAlternateSiblings(parentFiber) {
	  var previousFiber = parentFiber.alternate;
	  if (
	    null !== previousFiber &&
	    ((parentFiber = previousFiber.child), null !== parentFiber)
	  ) {
	    previousFiber.child = null;
	    do
	      (previousFiber = parentFiber.sibling),
	        (parentFiber.sibling = null),
	        (parentFiber = previousFiber);
	    while (null !== parentFiber);
	  }
	}
	function recursivelyTraversePassiveUnmountEffects(parentFiber) {
	  var deletions = parentFiber.deletions;
	  if (0 !== (parentFiber.flags & 16)) {
	    if (null !== deletions)
	      for (var i = 0; i < deletions.length; i++) {
	        var childToDelete = deletions[i];
	        nextEffect = childToDelete;
	        commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
	          childToDelete,
	          parentFiber
	        );
	      }
	    detachAlternateSiblings(parentFiber);
	  }
	  if (parentFiber.subtreeFlags & 10256)
	    for (parentFiber = parentFiber.child; null !== parentFiber; )
	      commitPassiveUnmountOnFiber(parentFiber),
	        (parentFiber = parentFiber.sibling);
	}
	function commitPassiveUnmountOnFiber(finishedWork) {
	  switch (finishedWork.tag) {
	    case 0:
	    case 11:
	    case 15:
	      recursivelyTraversePassiveUnmountEffects(finishedWork);
	      finishedWork.flags & 2048 &&
	        commitHookEffectListUnmount(9, finishedWork, finishedWork.return);
	      break;
	    case 3:
	      recursivelyTraversePassiveUnmountEffects(finishedWork);
	      break;
	    case 12:
	      recursivelyTraversePassiveUnmountEffects(finishedWork);
	      break;
	    case 22:
	      var instance = finishedWork.stateNode;
	      null !== finishedWork.memoizedState &&
	      instance._visibility & 4 &&
	      (null === finishedWork.return || 13 !== finishedWork.return.tag)
	        ? ((instance._visibility &= -5),
	          recursivelyTraverseDisconnectPassiveEffects(finishedWork))
	        : recursivelyTraversePassiveUnmountEffects(finishedWork);
	      break;
	    default:
	      recursivelyTraversePassiveUnmountEffects(finishedWork);
	  }
	}
	function recursivelyTraverseDisconnectPassiveEffects(parentFiber) {
	  var deletions = parentFiber.deletions;
	  if (0 !== (parentFiber.flags & 16)) {
	    if (null !== deletions)
	      for (var i = 0; i < deletions.length; i++) {
	        var childToDelete = deletions[i];
	        nextEffect = childToDelete;
	        commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
	          childToDelete,
	          parentFiber
	        );
	      }
	    detachAlternateSiblings(parentFiber);
	  }
	  for (parentFiber = parentFiber.child; null !== parentFiber; ) {
	    deletions = parentFiber;
	    switch (deletions.tag) {
	      case 0:
	      case 11:
	      case 15:
	        commitHookEffectListUnmount(8, deletions, deletions.return);
	        recursivelyTraverseDisconnectPassiveEffects(deletions);
	        break;
	      case 22:
	        i = deletions.stateNode;
	        i._visibility & 4 &&
	          ((i._visibility &= -5),
	          recursivelyTraverseDisconnectPassiveEffects(deletions));
	        break;
	      default:
	        recursivelyTraverseDisconnectPassiveEffects(deletions);
	    }
	    parentFiber = parentFiber.sibling;
	  }
	}
	function commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
	  deletedSubtreeRoot,
	  nearestMountedAncestor
	) {
	  for (; null !== nextEffect; ) {
	    var fiber = nextEffect;
	    switch (fiber.tag) {
	      case 0:
	      case 11:
	      case 15:
	        commitHookEffectListUnmount(8, fiber, nearestMountedAncestor);
	        break;
	      case 23:
	      case 22:
	        if (
	          null !== fiber.memoizedState &&
	          null !== fiber.memoizedState.cachePool
	        ) {
	          var cache = fiber.memoizedState.cachePool.pool;
	          null != cache && cache.refCount++;
	        }
	        break;
	      case 24:
	        releaseCache(fiber.memoizedState.cache);
	    }
	    cache = fiber.child;
	    if (null !== cache) (cache.return = fiber), (nextEffect = cache);
	    else
	      a: for (fiber = deletedSubtreeRoot; null !== nextEffect; ) {
	        cache = nextEffect;
	        var sibling = cache.sibling,
	          returnFiber = cache.return;
	        detachFiberAfterEffects(cache);
	        if (cache === fiber) {
	          nextEffect = null;
	          break a;
	        }
	        if (null !== sibling) {
	          sibling.return = returnFiber;
	          nextEffect = sibling;
	          break a;
	        }
	        nextEffect = returnFiber;
	      }
	  }
	}
	function FiberNode(tag, pendingProps, key, mode) {
	  this.tag = tag;
	  this.key = key;
	  this.sibling =
	    this.child =
	    this.return =
	    this.stateNode =
	    this.type =
	    this.elementType =
	      null;
	  this.index = 0;
	  this.refCleanup = this.ref = null;
	  this.pendingProps = pendingProps;
	  this.dependencies =
	    this.memoizedState =
	    this.updateQueue =
	    this.memoizedProps =
	      null;
	  this.mode = mode;
	  this.subtreeFlags = this.flags = 0;
	  this.deletions = null;
	  this.childLanes = this.lanes = 0;
	  this.alternate = null;
	}
	function createFiberImplClass(tag, pendingProps, key, mode) {
	  return new FiberNode(tag, pendingProps, key, mode);
	}
	function shouldConstruct(Component) {
	  Component = Component.prototype;
	  return !(!Component || !Component.isReactComponent);
	}
	function createWorkInProgress(current, pendingProps) {
	  var workInProgress = current.alternate;
	  null === workInProgress
	    ? ((workInProgress = createFiberImplClass(
	        current.tag,
	        pendingProps,
	        current.key,
	        current.mode
	      )),
	      (workInProgress.elementType = current.elementType),
	      (workInProgress.type = current.type),
	      (workInProgress.stateNode = current.stateNode),
	      (workInProgress.alternate = current),
	      (current.alternate = workInProgress))
	    : ((workInProgress.pendingProps = pendingProps),
	      (workInProgress.type = current.type),
	      (workInProgress.flags = 0),
	      (workInProgress.subtreeFlags = 0),
	      (workInProgress.deletions = null));
	  workInProgress.flags = current.flags & 31457280;
	  workInProgress.childLanes = current.childLanes;
	  workInProgress.lanes = current.lanes;
	  workInProgress.child = current.child;
	  workInProgress.memoizedProps = current.memoizedProps;
	  workInProgress.memoizedState = current.memoizedState;
	  workInProgress.updateQueue = current.updateQueue;
	  pendingProps = current.dependencies;
	  workInProgress.dependencies =
	    null === pendingProps
	      ? null
	      : { lanes: pendingProps.lanes, firstContext: pendingProps.firstContext };
	  workInProgress.sibling = current.sibling;
	  workInProgress.index = current.index;
	  workInProgress.ref = current.ref;
	  workInProgress.refCleanup = current.refCleanup;
	  return workInProgress;
	}
	function resetWorkInProgress(workInProgress, renderLanes) {
	  workInProgress.flags &= 31457282;
	  var current = workInProgress.alternate;
	  null === current
	    ? ((workInProgress.childLanes = 0),
	      (workInProgress.lanes = renderLanes),
	      (workInProgress.child = null),
	      (workInProgress.subtreeFlags = 0),
	      (workInProgress.memoizedProps = null),
	      (workInProgress.memoizedState = null),
	      (workInProgress.updateQueue = null),
	      (workInProgress.dependencies = null),
	      (workInProgress.stateNode = null))
	    : ((workInProgress.childLanes = current.childLanes),
	      (workInProgress.lanes = current.lanes),
	      (workInProgress.child = current.child),
	      (workInProgress.subtreeFlags = 0),
	      (workInProgress.deletions = null),
	      (workInProgress.memoizedProps = current.memoizedProps),
	      (workInProgress.memoizedState = current.memoizedState),
	      (workInProgress.updateQueue = current.updateQueue),
	      (workInProgress.type = current.type),
	      (renderLanes = current.dependencies),
	      (workInProgress.dependencies =
	        null === renderLanes
	          ? null
	          : {
	              lanes: renderLanes.lanes,
	              firstContext: renderLanes.firstContext
	            }));
	  return workInProgress;
	}
	function createFiberFromTypeAndProps(
	  type,
	  key,
	  pendingProps,
	  owner,
	  mode,
	  lanes
	) {
	  var fiberTag = 0;
	  owner = type;
	  if ("function" === typeof type) shouldConstruct(type) && (fiberTag = 1);
	  else if ("string" === typeof type)
	    fiberTag = isHostHoistableType(
	      type,
	      pendingProps,
	      contextStackCursor.current
	    )
	      ? 26
	      : "html" === type || "head" === type || "body" === type
	        ? 27
	        : 5;
	  else
	    a: switch (type) {
	      case REACT_FRAGMENT_TYPE:
	        return createFiberFromFragment(pendingProps.children, mode, lanes, key);
	      case REACT_STRICT_MODE_TYPE:
	        fiberTag = 8;
	        mode |= 24;
	        break;
	      case REACT_PROFILER_TYPE:
	        return (
	          (type = createFiberImplClass(12, pendingProps, key, mode | 2)),
	          (type.elementType = REACT_PROFILER_TYPE),
	          (type.lanes = lanes),
	          type
	        );
	      case REACT_SUSPENSE_TYPE:
	        return (
	          (type = createFiberImplClass(13, pendingProps, key, mode)),
	          (type.elementType = REACT_SUSPENSE_TYPE),
	          (type.lanes = lanes),
	          type
	        );
	      case REACT_SUSPENSE_LIST_TYPE:
	        return (
	          (type = createFiberImplClass(19, pendingProps, key, mode)),
	          (type.elementType = REACT_SUSPENSE_LIST_TYPE),
	          (type.lanes = lanes),
	          type
	        );
	      case REACT_OFFSCREEN_TYPE:
	        return createFiberFromOffscreen(pendingProps, mode, lanes, key);
	      default:
	        if ("object" === typeof type && null !== type)
	          switch (type.$$typeof) {
	            case REACT_PROVIDER_TYPE:
	            case REACT_CONTEXT_TYPE:
	              fiberTag = 10;
	              break a;
	            case REACT_CONSUMER_TYPE:
	              fiberTag = 9;
	              break a;
	            case REACT_FORWARD_REF_TYPE:
	              fiberTag = 11;
	              break a;
	            case REACT_MEMO_TYPE:
	              fiberTag = 14;
	              break a;
	            case REACT_LAZY_TYPE:
	              fiberTag = 16;
	              owner = null;
	              break a;
	          }
	        fiberTag = 29;
	        pendingProps = Error(
	          formatProdErrorMessage(130, null === type ? "null" : typeof type, "")
	        );
	        owner = null;
	    }
	  key = createFiberImplClass(fiberTag, pendingProps, key, mode);
	  key.elementType = type;
	  key.type = owner;
	  key.lanes = lanes;
	  return key;
	}
	function createFiberFromFragment(elements, mode, lanes, key) {
	  elements = createFiberImplClass(7, elements, key, mode);
	  elements.lanes = lanes;
	  return elements;
	}
	function createFiberFromOffscreen(pendingProps, mode, lanes, key) {
	  pendingProps = createFiberImplClass(22, pendingProps, key, mode);
	  pendingProps.elementType = REACT_OFFSCREEN_TYPE;
	  pendingProps.lanes = lanes;
	  var primaryChildInstance = {
	    _visibility: 1,
	    _pendingVisibility: 1,
	    _pendingMarkers: null,
	    _retryCache: null,
	    _transitions: null,
	    _current: null,
	    detach: function () {
	      var fiber = primaryChildInstance._current;
	      if (null === fiber) throw Error(formatProdErrorMessage(456));
	      if (0 === (primaryChildInstance._pendingVisibility & 2)) {
	        var root = enqueueConcurrentRenderForLane(fiber, 2);
	        null !== root &&
	          ((primaryChildInstance._pendingVisibility |= 2),
	          scheduleUpdateOnFiber(root, fiber, 2));
	      }
	    },
	    attach: function () {
	      var fiber = primaryChildInstance._current;
	      if (null === fiber) throw Error(formatProdErrorMessage(456));
	      if (0 !== (primaryChildInstance._pendingVisibility & 2)) {
	        var root = enqueueConcurrentRenderForLane(fiber, 2);
	        null !== root &&
	          ((primaryChildInstance._pendingVisibility &= -3),
	          scheduleUpdateOnFiber(root, fiber, 2));
	      }
	    }
	  };
	  pendingProps.stateNode = primaryChildInstance;
	  return pendingProps;
	}
	function createFiberFromText(content, mode, lanes) {
	  content = createFiberImplClass(6, content, null, mode);
	  content.lanes = lanes;
	  return content;
	}
	function createFiberFromPortal(portal, mode, lanes) {
	  mode = createFiberImplClass(
	    4,
	    null !== portal.children ? portal.children : [],
	    portal.key,
	    mode
	  );
	  mode.lanes = lanes;
	  mode.stateNode = {
	    containerInfo: portal.containerInfo,
	    pendingChildren: null,
	    implementation: portal.implementation
	  };
	  return mode;
	}
	function markUpdate(workInProgress) {
	  workInProgress.flags |= 4;
	}
	function preloadResourceAndSuspendIfNeeded(workInProgress, resource) {
	  if ("stylesheet" !== resource.type || 0 !== (resource.state.loading & 4))
	    workInProgress.flags &= -16777217;
	  else if (((workInProgress.flags |= 16777216), !preloadResource(resource))) {
	    resource = suspenseHandlerStackCursor.current;
	    if (
	      null !== resource &&
	      ((workInProgressRootRenderLanes & 4194176) ===
	      workInProgressRootRenderLanes
	        ? null !== shellBoundary
	        : ((workInProgressRootRenderLanes & 62914560) !==
	            workInProgressRootRenderLanes &&
	            0 === (workInProgressRootRenderLanes & 536870912)) ||
	          resource !== shellBoundary)
	    )
	      throw (
	        ((suspendedThenable = noopSuspenseyCommitThenable),
	        SuspenseyCommitException)
	      );
	    workInProgress.flags |= 8192;
	  }
	}
	function scheduleRetryEffect(workInProgress, retryQueue) {
	  null !== retryQueue && (workInProgress.flags |= 4);
	  workInProgress.flags & 16384 &&
	    ((retryQueue =
	      22 !== workInProgress.tag ? claimNextRetryLane() : 536870912),
	    (workInProgress.lanes |= retryQueue),
	    (workInProgressSuspendedRetryLanes |= retryQueue));
	}
	function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
	  if (!isHydrating)
	    switch (renderState.tailMode) {
	      case "hidden":
	        hasRenderedATailFallback = renderState.tail;
	        for (var lastTailNode = null; null !== hasRenderedATailFallback; )
	          null !== hasRenderedATailFallback.alternate &&
	            (lastTailNode = hasRenderedATailFallback),
	            (hasRenderedATailFallback = hasRenderedATailFallback.sibling);
	        null === lastTailNode
	          ? (renderState.tail = null)
	          : (lastTailNode.sibling = null);
	        break;
	      case "collapsed":
	        lastTailNode = renderState.tail;
	        for (var lastTailNode$131 = null; null !== lastTailNode; )
	          null !== lastTailNode.alternate && (lastTailNode$131 = lastTailNode),
	            (lastTailNode = lastTailNode.sibling);
	        null === lastTailNode$131
	          ? hasRenderedATailFallback || null === renderState.tail
	            ? (renderState.tail = null)
	            : (renderState.tail.sibling = null)
	          : (lastTailNode$131.sibling = null);
	    }
	}
	function bubbleProperties(completedWork) {
	  var didBailout =
	      null !== completedWork.alternate &&
	      completedWork.alternate.child === completedWork.child,
	    newChildLanes = 0,
	    subtreeFlags = 0;
	  if (didBailout)
	    for (var child$132 = completedWork.child; null !== child$132; )
	      (newChildLanes |= child$132.lanes | child$132.childLanes),
	        (subtreeFlags |= child$132.subtreeFlags & 31457280),
	        (subtreeFlags |= child$132.flags & 31457280),
	        (child$132.return = completedWork),
	        (child$132 = child$132.sibling);
	  else
	    for (child$132 = completedWork.child; null !== child$132; )
	      (newChildLanes |= child$132.lanes | child$132.childLanes),
	        (subtreeFlags |= child$132.subtreeFlags),
	        (subtreeFlags |= child$132.flags),
	        (child$132.return = completedWork),
	        (child$132 = child$132.sibling);
	  completedWork.subtreeFlags |= subtreeFlags;
	  completedWork.childLanes = newChildLanes;
	  return didBailout;
	}
	function completeWork(current, workInProgress, renderLanes) {
	  var newProps = workInProgress.pendingProps;
	  popTreeContext(workInProgress);
	  switch (workInProgress.tag) {
	    case 16:
	    case 15:
	    case 0:
	    case 11:
	    case 7:
	    case 8:
	    case 12:
	    case 9:
	    case 14:
	      return bubbleProperties(workInProgress), null;
	    case 1:
	      return bubbleProperties(workInProgress), null;
	    case 3:
	      renderLanes = workInProgress.stateNode;
	      newProps = null;
	      null !== current && (newProps = current.memoizedState.cache);
	      workInProgress.memoizedState.cache !== newProps &&
	        (workInProgress.flags |= 2048);
	      popProvider(CacheContext);
	      popHostContainer();
	      renderLanes.pendingContext &&
	        ((renderLanes.context = renderLanes.pendingContext),
	        (renderLanes.pendingContext = null));
	      if (null === current || null === current.child)
	        popHydrationState(workInProgress)
	          ? markUpdate(workInProgress)
	          : null === current ||
	            (current.memoizedState.isDehydrated &&
	              0 === (workInProgress.flags & 256)) ||
	            ((workInProgress.flags |= 1024),
	            null !== hydrationErrors &&
	              (queueRecoverableErrors(hydrationErrors),
	              (hydrationErrors = null)));
	      bubbleProperties(workInProgress);
	      return null;
	    case 26:
	      return (
	        (renderLanes = workInProgress.memoizedState),
	        null === current
	          ? (markUpdate(workInProgress),
	            null !== renderLanes
	              ? (bubbleProperties(workInProgress),
	                preloadResourceAndSuspendIfNeeded(workInProgress, renderLanes))
	              : (bubbleProperties(workInProgress),
	                (workInProgress.flags &= -16777217)))
	          : renderLanes
	            ? renderLanes !== current.memoizedState
	              ? (markUpdate(workInProgress),
	                bubbleProperties(workInProgress),
	                preloadResourceAndSuspendIfNeeded(workInProgress, renderLanes))
	              : (bubbleProperties(workInProgress),
	                (workInProgress.flags &= -16777217))
	            : (current.memoizedProps !== newProps && markUpdate(workInProgress),
	              bubbleProperties(workInProgress),
	              (workInProgress.flags &= -16777217)),
	        null
	      );
	    case 27:
	      popHostContext(workInProgress);
	      renderLanes = rootInstanceStackCursor.current;
	      var type = workInProgress.type;
	      if (null !== current && null != workInProgress.stateNode)
	        current.memoizedProps !== newProps && markUpdate(workInProgress);
	      else {
	        if (!newProps) {
	          if (null === workInProgress.stateNode)
	            throw Error(formatProdErrorMessage(166));
	          bubbleProperties(workInProgress);
	          return null;
	        }
	        current = contextStackCursor.current;
	        popHydrationState(workInProgress)
	          ? prepareToHydrateHostInstance(workInProgress)
	          : ((current = resolveSingletonInstance(type, newProps, renderLanes)),
	            (workInProgress.stateNode = current),
	            markUpdate(workInProgress));
	      }
	      bubbleProperties(workInProgress);
	      return null;
	    case 5:
	      popHostContext(workInProgress);
	      renderLanes = workInProgress.type;
	      if (null !== current && null != workInProgress.stateNode)
	        current.memoizedProps !== newProps && markUpdate(workInProgress);
	      else {
	        if (!newProps) {
	          if (null === workInProgress.stateNode)
	            throw Error(formatProdErrorMessage(166));
	          bubbleProperties(workInProgress);
	          return null;
	        }
	        current = contextStackCursor.current;
	        if (popHydrationState(workInProgress))
	          prepareToHydrateHostInstance(workInProgress);
	        else {
	          type = getOwnerDocumentFromRootContainer(
	            rootInstanceStackCursor.current
	          );
	          switch (current) {
	            case 1:
	              current = type.createElementNS(
	                "http://www.w3.org/2000/svg",
	                renderLanes
	              );
	              break;
	            case 2:
	              current = type.createElementNS(
	                "http://www.w3.org/1998/Math/MathML",
	                renderLanes
	              );
	              break;
	            default:
	              switch (renderLanes) {
	                case "svg":
	                  current = type.createElementNS(
	                    "http://www.w3.org/2000/svg",
	                    renderLanes
	                  );
	                  break;
	                case "math":
	                  current = type.createElementNS(
	                    "http://www.w3.org/1998/Math/MathML",
	                    renderLanes
	                  );
	                  break;
	                case "script":
	                  current = type.createElement("div");
	                  current.innerHTML = "<script>\x3c/script>";
	                  current = current.removeChild(current.firstChild);
	                  break;
	                case "select":
	                  current =
	                    "string" === typeof newProps.is
	                      ? type.createElement("select", { is: newProps.is })
	                      : type.createElement("select");
	                  newProps.multiple
	                    ? (current.multiple = true)
	                    : newProps.size && (current.size = newProps.size);
	                  break;
	                default:
	                  current =
	                    "string" === typeof newProps.is
	                      ? type.createElement(renderLanes, { is: newProps.is })
	                      : type.createElement(renderLanes);
	              }
	          }
	          current[internalInstanceKey] = workInProgress;
	          current[internalPropsKey] = newProps;
	          a: for (type = workInProgress.child; null !== type; ) {
	            if (5 === type.tag || 6 === type.tag)
	              current.appendChild(type.stateNode);
	            else if (4 !== type.tag && 27 !== type.tag && null !== type.child) {
	              type.child.return = type;
	              type = type.child;
	              continue;
	            }
	            if (type === workInProgress) break a;
	            for (; null === type.sibling; ) {
	              if (null === type.return || type.return === workInProgress)
	                break a;
	              type = type.return;
	            }
	            type.sibling.return = type.return;
	            type = type.sibling;
	          }
	          workInProgress.stateNode = current;
	          a: switch (
	            (setInitialProperties(current, renderLanes, newProps), renderLanes)
	          ) {
	            case "button":
	            case "input":
	            case "select":
	            case "textarea":
	              current = !!newProps.autoFocus;
	              break a;
	            case "img":
	              current = true;
	              break a;
	            default:
	              current = false;
	          }
	          current && markUpdate(workInProgress);
	        }
	      }
	      bubbleProperties(workInProgress);
	      workInProgress.flags &= -16777217;
	      return null;
	    case 6:
	      if (current && null != workInProgress.stateNode)
	        current.memoizedProps !== newProps && markUpdate(workInProgress);
	      else {
	        if ("string" !== typeof newProps && null === workInProgress.stateNode)
	          throw Error(formatProdErrorMessage(166));
	        current = rootInstanceStackCursor.current;
	        if (popHydrationState(workInProgress)) {
	          current = workInProgress.stateNode;
	          renderLanes = workInProgress.memoizedProps;
	          newProps = null;
	          type = hydrationParentFiber;
	          if (null !== type)
	            switch (type.tag) {
	              case 27:
	              case 5:
	                newProps = type.memoizedProps;
	            }
	          current[internalInstanceKey] = workInProgress;
	          current =
	            current.nodeValue === renderLanes ||
	            (null !== newProps && true === newProps.suppressHydrationWarning) ||
	            checkForUnmatchedText(current.nodeValue, renderLanes)
	              ? true
	              : false;
	          current || throwOnHydrationMismatch(workInProgress);
	        } else
	          (current =
	            getOwnerDocumentFromRootContainer(current).createTextNode(
	              newProps
	            )),
	            (current[internalInstanceKey] = workInProgress),
	            (workInProgress.stateNode = current);
	      }
	      bubbleProperties(workInProgress);
	      return null;
	    case 13:
	      newProps = workInProgress.memoizedState;
	      if (
	        null === current ||
	        (null !== current.memoizedState &&
	          null !== current.memoizedState.dehydrated)
	      ) {
	        type = popHydrationState(workInProgress);
	        if (null !== newProps && null !== newProps.dehydrated) {
	          if (null === current) {
	            if (!type) throw Error(formatProdErrorMessage(318));
	            type = workInProgress.memoizedState;
	            type = null !== type ? type.dehydrated : null;
	            if (!type) throw Error(formatProdErrorMessage(317));
	            type[internalInstanceKey] = workInProgress;
	          } else
	            resetHydrationState(),
	              0 === (workInProgress.flags & 128) &&
	                (workInProgress.memoizedState = null),
	              (workInProgress.flags |= 4);
	          bubbleProperties(workInProgress);
	          type = false;
	        } else
	          null !== hydrationErrors &&
	            (queueRecoverableErrors(hydrationErrors), (hydrationErrors = null)),
	            (type = true);
	        if (!type) {
	          if (workInProgress.flags & 256)
	            return popSuspenseHandler(workInProgress), workInProgress;
	          popSuspenseHandler(workInProgress);
	          return null;
	        }
	      }
	      popSuspenseHandler(workInProgress);
	      if (0 !== (workInProgress.flags & 128))
	        return (workInProgress.lanes = renderLanes), workInProgress;
	      renderLanes = null !== newProps;
	      current = null !== current && null !== current.memoizedState;
	      if (renderLanes) {
	        newProps = workInProgress.child;
	        type = null;
	        null !== newProps.alternate &&
	          null !== newProps.alternate.memoizedState &&
	          null !== newProps.alternate.memoizedState.cachePool &&
	          (type = newProps.alternate.memoizedState.cachePool.pool);
	        var cache$144 = null;
	        null !== newProps.memoizedState &&
	          null !== newProps.memoizedState.cachePool &&
	          (cache$144 = newProps.memoizedState.cachePool.pool);
	        cache$144 !== type && (newProps.flags |= 2048);
	      }
	      renderLanes !== current &&
	        renderLanes &&
	        (workInProgress.child.flags |= 8192);
	      scheduleRetryEffect(workInProgress, workInProgress.updateQueue);
	      bubbleProperties(workInProgress);
	      return null;
	    case 4:
	      return (
	        popHostContainer(),
	        null === current &&
	          listenToAllSupportedEvents(workInProgress.stateNode.containerInfo),
	        bubbleProperties(workInProgress),
	        null
	      );
	    case 10:
	      return (
	        popProvider(workInProgress.type), bubbleProperties(workInProgress), null
	      );
	    case 19:
	      pop(suspenseStackCursor);
	      type = workInProgress.memoizedState;
	      if (null === type) return bubbleProperties(workInProgress), null;
	      newProps = 0 !== (workInProgress.flags & 128);
	      cache$144 = type.rendering;
	      if (null === cache$144)
	        if (newProps) cutOffTailIfNeeded(type, false);
	        else {
	          if (
	            0 !== workInProgressRootExitStatus ||
	            (null !== current && 0 !== (current.flags & 128))
	          )
	            for (current = workInProgress.child; null !== current; ) {
	              cache$144 = findFirstSuspended(current);
	              if (null !== cache$144) {
	                workInProgress.flags |= 128;
	                cutOffTailIfNeeded(type, false);
	                current = cache$144.updateQueue;
	                workInProgress.updateQueue = current;
	                scheduleRetryEffect(workInProgress, current);
	                workInProgress.subtreeFlags = 0;
	                current = renderLanes;
	                for (renderLanes = workInProgress.child; null !== renderLanes; )
	                  resetWorkInProgress(renderLanes, current),
	                    (renderLanes = renderLanes.sibling);
	                push(
	                  suspenseStackCursor,
	                  (suspenseStackCursor.current & 1) | 2
	                );
	                return workInProgress.child;
	              }
	              current = current.sibling;
	            }
	          null !== type.tail &&
	            now() > workInProgressRootRenderTargetTime &&
	            ((workInProgress.flags |= 128),
	            (newProps = true),
	            cutOffTailIfNeeded(type, false),
	            (workInProgress.lanes = 4194304));
	        }
	      else {
	        if (!newProps)
	          if (((current = findFirstSuspended(cache$144)), null !== current)) {
	            if (
	              ((workInProgress.flags |= 128),
	              (newProps = true),
	              (current = current.updateQueue),
	              (workInProgress.updateQueue = current),
	              scheduleRetryEffect(workInProgress, current),
	              cutOffTailIfNeeded(type, true),
	              null === type.tail &&
	                "hidden" === type.tailMode &&
	                !cache$144.alternate &&
	                !isHydrating)
	            )
	              return bubbleProperties(workInProgress), null;
	          } else
	            2 * now() - type.renderingStartTime >
	              workInProgressRootRenderTargetTime &&
	              536870912 !== renderLanes &&
	              ((workInProgress.flags |= 128),
	              (newProps = true),
	              cutOffTailIfNeeded(type, false),
	              (workInProgress.lanes = 4194304));
	        type.isBackwards
	          ? ((cache$144.sibling = workInProgress.child),
	            (workInProgress.child = cache$144))
	          : ((current = type.last),
	            null !== current
	              ? (current.sibling = cache$144)
	              : (workInProgress.child = cache$144),
	            (type.last = cache$144));
	      }
	      if (null !== type.tail)
	        return (
	          (workInProgress = type.tail),
	          (type.rendering = workInProgress),
	          (type.tail = workInProgress.sibling),
	          (type.renderingStartTime = now()),
	          (workInProgress.sibling = null),
	          (current = suspenseStackCursor.current),
	          push(suspenseStackCursor, newProps ? (current & 1) | 2 : current & 1),
	          workInProgress
	        );
	      bubbleProperties(workInProgress);
	      return null;
	    case 22:
	    case 23:
	      return (
	        popSuspenseHandler(workInProgress),
	        popHiddenContext(),
	        (newProps = null !== workInProgress.memoizedState),
	        null !== current
	          ? (null !== current.memoizedState) !== newProps &&
	            (workInProgress.flags |= 8192)
	          : newProps && (workInProgress.flags |= 8192),
	        newProps
	          ? 0 !== (renderLanes & 536870912) &&
	            0 === (workInProgress.flags & 128) &&
	            (bubbleProperties(workInProgress),
	            workInProgress.subtreeFlags & 6 && (workInProgress.flags |= 8192))
	          : bubbleProperties(workInProgress),
	        (renderLanes = workInProgress.updateQueue),
	        null !== renderLanes &&
	          scheduleRetryEffect(workInProgress, renderLanes.retryQueue),
	        (renderLanes = null),
	        null !== current &&
	          null !== current.memoizedState &&
	          null !== current.memoizedState.cachePool &&
	          (renderLanes = current.memoizedState.cachePool.pool),
	        (newProps = null),
	        null !== workInProgress.memoizedState &&
	          null !== workInProgress.memoizedState.cachePool &&
	          (newProps = workInProgress.memoizedState.cachePool.pool),
	        newProps !== renderLanes && (workInProgress.flags |= 2048),
	        null !== current && pop(resumedCache),
	        null
	      );
	    case 24:
	      return (
	        (renderLanes = null),
	        null !== current && (renderLanes = current.memoizedState.cache),
	        workInProgress.memoizedState.cache !== renderLanes &&
	          (workInProgress.flags |= 2048),
	        popProvider(CacheContext),
	        bubbleProperties(workInProgress),
	        null
	      );
	    case 25:
	      return null;
	  }
	  throw Error(formatProdErrorMessage(156, workInProgress.tag));
	}
	function unwindWork(current, workInProgress) {
	  popTreeContext(workInProgress);
	  switch (workInProgress.tag) {
	    case 1:
	      return (
	        (current = workInProgress.flags),
	        current & 65536
	          ? ((workInProgress.flags = (current & -65537) | 128), workInProgress)
	          : null
	      );
	    case 3:
	      return (
	        popProvider(CacheContext),
	        popHostContainer(),
	        (current = workInProgress.flags),
	        0 !== (current & 65536) && 0 === (current & 128)
	          ? ((workInProgress.flags = (current & -65537) | 128), workInProgress)
	          : null
	      );
	    case 26:
	    case 27:
	    case 5:
	      return popHostContext(workInProgress), null;
	    case 13:
	      popSuspenseHandler(workInProgress);
	      current = workInProgress.memoizedState;
	      if (null !== current && null !== current.dehydrated) {
	        if (null === workInProgress.alternate)
	          throw Error(formatProdErrorMessage(340));
	        resetHydrationState();
	      }
	      current = workInProgress.flags;
	      return current & 65536
	        ? ((workInProgress.flags = (current & -65537) | 128), workInProgress)
	        : null;
	    case 19:
	      return pop(suspenseStackCursor), null;
	    case 4:
	      return popHostContainer(), null;
	    case 10:
	      return popProvider(workInProgress.type), null;
	    case 22:
	    case 23:
	      return (
	        popSuspenseHandler(workInProgress),
	        popHiddenContext(),
	        null !== current && pop(resumedCache),
	        (current = workInProgress.flags),
	        current & 65536
	          ? ((workInProgress.flags = (current & -65537) | 128), workInProgress)
	          : null
	      );
	    case 24:
	      return popProvider(CacheContext), null;
	    case 25:
	      return null;
	    default:
	      return null;
	  }
	}
	function unwindInterruptedWork(current, interruptedWork) {
	  popTreeContext(interruptedWork);
	  switch (interruptedWork.tag) {
	    case 3:
	      popProvider(CacheContext);
	      popHostContainer();
	      break;
	    case 26:
	    case 27:
	    case 5:
	      popHostContext(interruptedWork);
	      break;
	    case 4:
	      popHostContainer();
	      break;
	    case 13:
	      popSuspenseHandler(interruptedWork);
	      break;
	    case 19:
	      pop(suspenseStackCursor);
	      break;
	    case 10:
	      popProvider(interruptedWork.type);
	      break;
	    case 22:
	    case 23:
	      popSuspenseHandler(interruptedWork);
	      popHiddenContext();
	      null !== current && pop(resumedCache);
	      break;
	    case 24:
	      popProvider(CacheContext);
	  }
	}
	var DefaultAsyncDispatcher = {
	    getCacheForType: function (resourceType) {
	      var cache = readContext(CacheContext),
	        cacheForType = cache.data.get(resourceType);
	      void 0 === cacheForType &&
	        ((cacheForType = resourceType()),
	        cache.data.set(resourceType, cacheForType));
	      return cacheForType;
	    }
	  },
	  PossiblyWeakMap = "function" === typeof WeakMap ? WeakMap : Map,
	  executionContext = 0,
	  workInProgressRoot = null,
	  workInProgress = null,
	  workInProgressRootRenderLanes = 0,
	  workInProgressSuspendedReason = 0,
	  workInProgressThrownValue = null,
	  workInProgressRootDidSkipSuspendedSiblings = false,
	  workInProgressRootIsPrerendering = false,
	  workInProgressRootDidAttachPingListener = false,
	  entangledRenderLanes = 0,
	  workInProgressRootExitStatus = 0,
	  workInProgressRootSkippedLanes = 0,
	  workInProgressRootInterleavedUpdatedLanes = 0,
	  workInProgressRootPingedLanes = 0,
	  workInProgressDeferredLane = 0,
	  workInProgressSuspendedRetryLanes = 0,
	  workInProgressRootConcurrentErrors = null,
	  workInProgressRootRecoverableErrors = null,
	  workInProgressRootDidIncludeRecursiveRenderUpdate = false,
	  globalMostRecentFallbackTime = 0,
	  workInProgressRootRenderTargetTime = Infinity,
	  workInProgressTransitions = null,
	  legacyErrorBoundariesThatAlreadyFailed = null,
	  rootDoesHavePassiveEffects = false,
	  rootWithPendingPassiveEffects = null,
	  pendingPassiveEffectsLanes = 0,
	  pendingPassiveEffectsRemainingLanes = 0,
	  pendingPassiveTransitions = null,
	  nestedUpdateCount = 0,
	  rootWithNestedUpdates = null;
	function requestUpdateLane() {
	  if (0 !== (executionContext & 2) && 0 !== workInProgressRootRenderLanes)
	    return workInProgressRootRenderLanes & -workInProgressRootRenderLanes;
	  if (null !== ReactSharedInternals.T) {
	    var actionScopeLane = currentEntangledLane;
	    return 0 !== actionScopeLane ? actionScopeLane : requestTransitionLane();
	  }
	  return resolveUpdatePriority();
	}
	function requestDeferredLane() {
	  0 === workInProgressDeferredLane &&
	    (workInProgressDeferredLane =
	      0 === (workInProgressRootRenderLanes & 536870912) || isHydrating
	        ? claimNextTransitionLane()
	        : 536870912);
	  var suspenseHandler = suspenseHandlerStackCursor.current;
	  null !== suspenseHandler && (suspenseHandler.flags |= 32);
	  return workInProgressDeferredLane;
	}
	function scheduleUpdateOnFiber(root, fiber, lane) {
	  if (
	    (root === workInProgressRoot && 2 === workInProgressSuspendedReason) ||
	    null !== root.cancelPendingCommit
	  )
	    prepareFreshStack(root, 0),
	      markRootSuspended(
	        root,
	        workInProgressRootRenderLanes,
	        workInProgressDeferredLane,
	        false
	      );
	  markRootUpdated$1(root, lane);
	  if (0 === (executionContext & 2) || root !== workInProgressRoot)
	    root === workInProgressRoot &&
	      (0 === (executionContext & 2) &&
	        (workInProgressRootInterleavedUpdatedLanes |= lane),
	      4 === workInProgressRootExitStatus &&
	        markRootSuspended(
	          root,
	          workInProgressRootRenderLanes,
	          workInProgressDeferredLane,
	          false
	        )),
	      ensureRootIsScheduled(root);
	}
	function performWorkOnRoot(root$jscomp$0, lanes, forceSync) {
	  if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
	  var shouldTimeSlice =
	      (!forceSync &&
	        0 === (lanes & 60) &&
	        0 === (lanes & root$jscomp$0.expiredLanes)) ||
	      checkIfRootIsPrerendering(root$jscomp$0, lanes),
	    exitStatus = shouldTimeSlice
	      ? renderRootConcurrent(root$jscomp$0, lanes)
	      : renderRootSync(root$jscomp$0, lanes, true),
	    renderWasConcurrent = shouldTimeSlice;
	  do {
	    if (0 === exitStatus) {
	      workInProgressRootIsPrerendering &&
	        !shouldTimeSlice &&
	        markRootSuspended(root$jscomp$0, lanes, 0, false);
	      break;
	    } else if (6 === exitStatus)
	      markRootSuspended(
	        root$jscomp$0,
	        lanes,
	        0,
	        !workInProgressRootDidSkipSuspendedSiblings
	      );
	    else {
	      forceSync = root$jscomp$0.current.alternate;
	      if (
	        renderWasConcurrent &&
	        !isRenderConsistentWithExternalStores(forceSync)
	      ) {
	        exitStatus = renderRootSync(root$jscomp$0, lanes, false);
	        renderWasConcurrent = false;
	        continue;
	      }
	      if (2 === exitStatus) {
	        renderWasConcurrent = lanes;
	        if (root$jscomp$0.errorRecoveryDisabledLanes & renderWasConcurrent)
	          var JSCompiler_inline_result = 0;
	        else
	          (JSCompiler_inline_result = root$jscomp$0.pendingLanes & -536870913),
	            (JSCompiler_inline_result =
	              0 !== JSCompiler_inline_result
	                ? JSCompiler_inline_result
	                : JSCompiler_inline_result & 536870912
	                  ? 536870912
	                  : 0);
	        if (0 !== JSCompiler_inline_result) {
	          lanes = JSCompiler_inline_result;
	          a: {
	            var root = root$jscomp$0;
	            exitStatus = workInProgressRootConcurrentErrors;
	            var wasRootDehydrated = root.current.memoizedState.isDehydrated;
	            wasRootDehydrated &&
	              (prepareFreshStack(root, JSCompiler_inline_result).flags |= 256);
	            JSCompiler_inline_result = renderRootSync(
	              root,
	              JSCompiler_inline_result,
	              false
	            );
	            if (2 !== JSCompiler_inline_result) {
	              if (
	                workInProgressRootDidAttachPingListener &&
	                !wasRootDehydrated
	              ) {
	                root.errorRecoveryDisabledLanes |= renderWasConcurrent;
	                workInProgressRootInterleavedUpdatedLanes |=
	                  renderWasConcurrent;
	                exitStatus = 4;
	                break a;
	              }
	              renderWasConcurrent = workInProgressRootRecoverableErrors;
	              workInProgressRootRecoverableErrors = exitStatus;
	              null !== renderWasConcurrent &&
	                queueRecoverableErrors(renderWasConcurrent);
	            }
	            exitStatus = JSCompiler_inline_result;
	          }
	          renderWasConcurrent = false;
	          if (2 !== exitStatus) continue;
	        }
	      }
	      if (1 === exitStatus) {
	        prepareFreshStack(root$jscomp$0, 0);
	        markRootSuspended(root$jscomp$0, lanes, 0, true);
	        break;
	      }
	      a: {
	        shouldTimeSlice = root$jscomp$0;
	        switch (exitStatus) {
	          case 0:
	          case 1:
	            throw Error(formatProdErrorMessage(345));
	          case 4:
	            if ((lanes & 4194176) === lanes) {
	              markRootSuspended(
	                shouldTimeSlice,
	                lanes,
	                workInProgressDeferredLane,
	                !workInProgressRootDidSkipSuspendedSiblings
	              );
	              break a;
	            }
	            break;
	          case 2:
	            workInProgressRootRecoverableErrors = null;
	            break;
	          case 3:
	          case 5:
	            break;
	          default:
	            throw Error(formatProdErrorMessage(329));
	        }
	        shouldTimeSlice.finishedWork = forceSync;
	        shouldTimeSlice.finishedLanes = lanes;
	        if (
	          (lanes & 62914560) === lanes &&
	          ((renderWasConcurrent = globalMostRecentFallbackTime + 300 - now()),
	          10 < renderWasConcurrent)
	        ) {
	          markRootSuspended(
	            shouldTimeSlice,
	            lanes,
	            workInProgressDeferredLane,
	            !workInProgressRootDidSkipSuspendedSiblings
	          );
	          if (0 !== getNextLanes(shouldTimeSlice, 0)) break a;
	          shouldTimeSlice.timeoutHandle = scheduleTimeout(
	            commitRootWhenReady.bind(
	              null,
	              shouldTimeSlice,
	              forceSync,
	              workInProgressRootRecoverableErrors,
	              workInProgressTransitions,
	              workInProgressRootDidIncludeRecursiveRenderUpdate,
	              lanes,
	              workInProgressDeferredLane,
	              workInProgressRootInterleavedUpdatedLanes,
	              workInProgressSuspendedRetryLanes,
	              workInProgressRootDidSkipSuspendedSiblings,
	              2,
	              -0,
	              0
	            ),
	            renderWasConcurrent
	          );
	          break a;
	        }
	        commitRootWhenReady(
	          shouldTimeSlice,
	          forceSync,
	          workInProgressRootRecoverableErrors,
	          workInProgressTransitions,
	          workInProgressRootDidIncludeRecursiveRenderUpdate,
	          lanes,
	          workInProgressDeferredLane,
	          workInProgressRootInterleavedUpdatedLanes,
	          workInProgressSuspendedRetryLanes,
	          workInProgressRootDidSkipSuspendedSiblings,
	          0,
	          -0,
	          0
	        );
	      }
	    }
	    break;
	  } while (1);
	  ensureRootIsScheduled(root$jscomp$0);
	}
	function queueRecoverableErrors(errors) {
	  null === workInProgressRootRecoverableErrors
	    ? (workInProgressRootRecoverableErrors = errors)
	    : workInProgressRootRecoverableErrors.push.apply(
	        workInProgressRootRecoverableErrors,
	        errors
	      );
	}
	function commitRootWhenReady(
	  root,
	  finishedWork,
	  recoverableErrors,
	  transitions,
	  didIncludeRenderPhaseUpdate,
	  lanes,
	  spawnedLane,
	  updatedLanes,
	  suspendedRetryLanes,
	  didSkipSuspendedSiblings,
	  suspendedCommitReason,
	  completedRenderStartTime,
	  completedRenderEndTime
	) {
	  var subtreeFlags = finishedWork.subtreeFlags;
	  if (subtreeFlags & 8192 || 16785408 === (subtreeFlags & 16785408))
	    if (
	      ((suspendedState = { stylesheets: null, count: 0, unsuspend: noop }),
	      accumulateSuspenseyCommitOnFiber(finishedWork),
	      (finishedWork = waitForCommitToBeReady()),
	      null !== finishedWork)
	    ) {
	      root.cancelPendingCommit = finishedWork(
	        commitRoot.bind(
	          null,
	          root,
	          recoverableErrors,
	          transitions,
	          didIncludeRenderPhaseUpdate,
	          spawnedLane,
	          updatedLanes,
	          suspendedRetryLanes,
	          1,
	          completedRenderStartTime,
	          completedRenderEndTime
	        )
	      );
	      markRootSuspended(root, lanes, spawnedLane, !didSkipSuspendedSiblings);
	      return;
	    }
	  commitRoot(
	    root,
	    recoverableErrors,
	    transitions,
	    didIncludeRenderPhaseUpdate,
	    spawnedLane,
	    updatedLanes,
	    suspendedRetryLanes,
	    suspendedCommitReason,
	    completedRenderStartTime,
	    completedRenderEndTime
	  );
	}
	function isRenderConsistentWithExternalStores(finishedWork) {
	  for (var node = finishedWork; ; ) {
	    var tag = node.tag;
	    if (
	      (0 === tag || 11 === tag || 15 === tag) &&
	      node.flags & 16384 &&
	      ((tag = node.updateQueue),
	      null !== tag && ((tag = tag.stores), null !== tag))
	    )
	      for (var i = 0; i < tag.length; i++) {
	        var check = tag[i],
	          getSnapshot = check.getSnapshot;
	        check = check.value;
	        try {
	          if (!objectIs(getSnapshot(), check)) return !1;
	        } catch (error) {
	          return false;
	        }
	      }
	    tag = node.child;
	    if (node.subtreeFlags & 16384 && null !== tag)
	      (tag.return = node), (node = tag);
	    else {
	      if (node === finishedWork) break;
	      for (; null === node.sibling; ) {
	        if (null === node.return || node.return === finishedWork) return true;
	        node = node.return;
	      }
	      node.sibling.return = node.return;
	      node = node.sibling;
	    }
	  }
	  return true;
	}
	function markRootSuspended(
	  root,
	  suspendedLanes,
	  spawnedLane,
	  didAttemptEntireTree
	) {
	  suspendedLanes &= ~workInProgressRootPingedLanes;
	  suspendedLanes &= ~workInProgressRootInterleavedUpdatedLanes;
	  root.suspendedLanes |= suspendedLanes;
	  root.pingedLanes &= ~suspendedLanes;
	  didAttemptEntireTree && (root.warmLanes |= suspendedLanes);
	  didAttemptEntireTree = root.expirationTimes;
	  for (var lanes = suspendedLanes; 0 < lanes; ) {
	    var index$6 = 31 - clz32(lanes),
	      lane = 1 << index$6;
	    didAttemptEntireTree[index$6] = -1;
	    lanes &= ~lane;
	  }
	  0 !== spawnedLane &&
	    markSpawnedDeferredLane(root, spawnedLane, suspendedLanes);
	}
	function flushSyncWork$1() {
	  return 0 === (executionContext & 6)
	    ? (flushSyncWorkAcrossRoots_impl(0), false)
	    : true;
	}
	function resetWorkInProgressStack() {
	  if (null !== workInProgress) {
	    if (0 === workInProgressSuspendedReason)
	      var interruptedWork = workInProgress.return;
	    else
	      (interruptedWork = workInProgress),
	        (lastContextDependency = currentlyRenderingFiber = null),
	        resetHooksOnUnwind(interruptedWork),
	        (thenableState$1 = null),
	        (thenableIndexCounter$1 = 0),
	        (interruptedWork = workInProgress);
	    for (; null !== interruptedWork; )
	      unwindInterruptedWork(interruptedWork.alternate, interruptedWork),
	        (interruptedWork = interruptedWork.return);
	    workInProgress = null;
	  }
	}
	function prepareFreshStack(root, lanes) {
	  root.finishedWork = null;
	  root.finishedLanes = 0;
	  var timeoutHandle = root.timeoutHandle;
	  -1 !== timeoutHandle &&
	    ((root.timeoutHandle = -1), cancelTimeout(timeoutHandle));
	  timeoutHandle = root.cancelPendingCommit;
	  null !== timeoutHandle &&
	    ((root.cancelPendingCommit = null), timeoutHandle());
	  resetWorkInProgressStack();
	  workInProgressRoot = root;
	  workInProgress = timeoutHandle = createWorkInProgress(root.current, null);
	  workInProgressRootRenderLanes = lanes;
	  workInProgressSuspendedReason = 0;
	  workInProgressThrownValue = null;
	  workInProgressRootDidSkipSuspendedSiblings = false;
	  workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root, lanes);
	  workInProgressRootDidAttachPingListener = false;
	  workInProgressSuspendedRetryLanes =
	    workInProgressDeferredLane =
	    workInProgressRootPingedLanes =
	    workInProgressRootInterleavedUpdatedLanes =
	    workInProgressRootSkippedLanes =
	    workInProgressRootExitStatus =
	      0;
	  workInProgressRootRecoverableErrors = workInProgressRootConcurrentErrors =
	    null;
	  workInProgressRootDidIncludeRecursiveRenderUpdate = false;
	  0 !== (lanes & 8) && (lanes |= lanes & 32);
	  var allEntangledLanes = root.entangledLanes;
	  if (0 !== allEntangledLanes)
	    for (
	      root = root.entanglements, allEntangledLanes &= lanes;
	      0 < allEntangledLanes;

	    ) {
	      var index$4 = 31 - clz32(allEntangledLanes),
	        lane = 1 << index$4;
	      lanes |= root[index$4];
	      allEntangledLanes &= ~lane;
	    }
	  entangledRenderLanes = lanes;
	  finishQueueingConcurrentUpdates();
	  return timeoutHandle;
	}
	function handleThrow(root, thrownValue) {
	  currentlyRenderingFiber$1 = null;
	  ReactSharedInternals.H = ContextOnlyDispatcher;
	  thrownValue === SuspenseException
	    ? ((thrownValue = getSuspendedThenable()),
	      (workInProgressSuspendedReason = 3))
	    : thrownValue === SuspenseyCommitException
	      ? ((thrownValue = getSuspendedThenable()),
	        (workInProgressSuspendedReason = 4))
	      : (workInProgressSuspendedReason =
	          thrownValue === SelectiveHydrationException
	            ? 8
	            : null !== thrownValue &&
	                "object" === typeof thrownValue &&
	                "function" === typeof thrownValue.then
	              ? 6
	              : 1);
	  workInProgressThrownValue = thrownValue;
	  null === workInProgress &&
	    ((workInProgressRootExitStatus = 1),
	    logUncaughtError(
	      root,
	      createCapturedValueAtFiber(thrownValue, root.current)
	    ));
	}
	function pushDispatcher() {
	  var prevDispatcher = ReactSharedInternals.H;
	  ReactSharedInternals.H = ContextOnlyDispatcher;
	  return null === prevDispatcher ? ContextOnlyDispatcher : prevDispatcher;
	}
	function pushAsyncDispatcher() {
	  var prevAsyncDispatcher = ReactSharedInternals.A;
	  ReactSharedInternals.A = DefaultAsyncDispatcher;
	  return prevAsyncDispatcher;
	}
	function renderDidSuspendDelayIfPossible() {
	  workInProgressRootExitStatus = 4;
	  workInProgressRootDidSkipSuspendedSiblings ||
	    ((workInProgressRootRenderLanes & 4194176) !==
	      workInProgressRootRenderLanes &&
	      null !== suspenseHandlerStackCursor.current) ||
	    (workInProgressRootIsPrerendering = true);
	  (0 === (workInProgressRootSkippedLanes & 134217727) &&
	    0 === (workInProgressRootInterleavedUpdatedLanes & 134217727)) ||
	    null === workInProgressRoot ||
	    markRootSuspended(
	      workInProgressRoot,
	      workInProgressRootRenderLanes,
	      workInProgressDeferredLane,
	      false
	    );
	}
	function renderRootSync(root, lanes, shouldYieldForPrerendering) {
	  var prevExecutionContext = executionContext;
	  executionContext |= 2;
	  var prevDispatcher = pushDispatcher(),
	    prevAsyncDispatcher = pushAsyncDispatcher();
	  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes)
	    (workInProgressTransitions = null), prepareFreshStack(root, lanes);
	  lanes = false;
	  var exitStatus = workInProgressRootExitStatus;
	  a: do
	    try {
	      if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
	        var unitOfWork = workInProgress,
	          thrownValue = workInProgressThrownValue;
	        switch (workInProgressSuspendedReason) {
	          case 8:
	            resetWorkInProgressStack();
	            exitStatus = 6;
	            break a;
	          case 3:
	          case 2:
	          case 6:
	            null === suspenseHandlerStackCursor.current && (lanes = !0);
	            var reason = workInProgressSuspendedReason;
	            workInProgressSuspendedReason = 0;
	            workInProgressThrownValue = null;
	            throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, reason);
	            if (
	              shouldYieldForPrerendering &&
	              workInProgressRootIsPrerendering
	            ) {
	              exitStatus = 0;
	              break a;
	            }
	            break;
	          default:
	            (reason = workInProgressSuspendedReason),
	              (workInProgressSuspendedReason = 0),
	              (workInProgressThrownValue = null),
	              throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, reason);
	        }
	      }
	      workLoopSync();
	      exitStatus = workInProgressRootExitStatus;
	      break;
	    } catch (thrownValue$164) {
	      handleThrow(root, thrownValue$164);
	    }
	  while (1);
	  lanes && root.shellSuspendCounter++;
	  lastContextDependency = currentlyRenderingFiber = null;
	  executionContext = prevExecutionContext;
	  ReactSharedInternals.H = prevDispatcher;
	  ReactSharedInternals.A = prevAsyncDispatcher;
	  null === workInProgress &&
	    ((workInProgressRoot = null),
	    (workInProgressRootRenderLanes = 0),
	    finishQueueingConcurrentUpdates());
	  return exitStatus;
	}
	function workLoopSync() {
	  for (; null !== workInProgress; ) performUnitOfWork(workInProgress);
	}
	function renderRootConcurrent(root, lanes) {
	  var prevExecutionContext = executionContext;
	  executionContext |= 2;
	  var prevDispatcher = pushDispatcher(),
	    prevAsyncDispatcher = pushAsyncDispatcher();
	  workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes
	    ? ((workInProgressTransitions = null),
	      (workInProgressRootRenderTargetTime = now() + 500),
	      prepareFreshStack(root, lanes))
	    : (workInProgressRootIsPrerendering = checkIfRootIsPrerendering(
	        root,
	        lanes
	      ));
	  a: do
	    try {
	      if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
	        lanes = workInProgress;
	        var thrownValue = workInProgressThrownValue;
	        b: switch (workInProgressSuspendedReason) {
	          case 1:
	            workInProgressSuspendedReason = 0;
	            workInProgressThrownValue = null;
	            throwAndUnwindWorkLoop(root, lanes, thrownValue, 1);
	            break;
	          case 2:
	            if (isThenableResolved(thrownValue)) {
	              workInProgressSuspendedReason = 0;
	              workInProgressThrownValue = null;
	              replaySuspendedUnitOfWork(lanes);
	              break;
	            }
	            lanes = function () {
	              2 === workInProgressSuspendedReason &&
	                workInProgressRoot === root &&
	                (workInProgressSuspendedReason = 7);
	              ensureRootIsScheduled(root);
	            };
	            thrownValue.then(lanes, lanes);
	            break a;
	          case 3:
	            workInProgressSuspendedReason = 7;
	            break a;
	          case 4:
	            workInProgressSuspendedReason = 5;
	            break a;
	          case 7:
	            isThenableResolved(thrownValue)
	              ? ((workInProgressSuspendedReason = 0),
	                (workInProgressThrownValue = null),
	                replaySuspendedUnitOfWork(lanes))
	              : ((workInProgressSuspendedReason = 0),
	                (workInProgressThrownValue = null),
	                throwAndUnwindWorkLoop(root, lanes, thrownValue, 7));
	            break;
	          case 5:
	            var resource = null;
	            switch (workInProgress.tag) {
	              case 26:
	                resource = workInProgress.memoizedState;
	              case 5:
	              case 27:
	                var hostFiber = workInProgress;
	                if (resource ? preloadResource(resource) : 1) {
	                  workInProgressSuspendedReason = 0;
	                  workInProgressThrownValue = null;
	                  var sibling = hostFiber.sibling;
	                  if (null !== sibling) workInProgress = sibling;
	                  else {
	                    var returnFiber = hostFiber.return;
	                    null !== returnFiber
	                      ? ((workInProgress = returnFiber),
	                        completeUnitOfWork(returnFiber))
	                      : (workInProgress = null);
	                  }
	                  break b;
	                }
	            }
	            workInProgressSuspendedReason = 0;
	            workInProgressThrownValue = null;
	            throwAndUnwindWorkLoop(root, lanes, thrownValue, 5);
	            break;
	          case 6:
	            workInProgressSuspendedReason = 0;
	            workInProgressThrownValue = null;
	            throwAndUnwindWorkLoop(root, lanes, thrownValue, 6);
	            break;
	          case 8:
	            resetWorkInProgressStack();
	            workInProgressRootExitStatus = 6;
	            break a;
	          default:
	            throw Error(formatProdErrorMessage(462));
	        }
	      }
	      workLoopConcurrent();
	      break;
	    } catch (thrownValue$166) {
	      handleThrow(root, thrownValue$166);
	    }
	  while (1);
	  lastContextDependency = currentlyRenderingFiber = null;
	  ReactSharedInternals.H = prevDispatcher;
	  ReactSharedInternals.A = prevAsyncDispatcher;
	  executionContext = prevExecutionContext;
	  if (null !== workInProgress) return 0;
	  workInProgressRoot = null;
	  workInProgressRootRenderLanes = 0;
	  finishQueueingConcurrentUpdates();
	  return workInProgressRootExitStatus;
	}
	function workLoopConcurrent() {
	  for (; null !== workInProgress && !shouldYield(); )
	    performUnitOfWork(workInProgress);
	}
	function performUnitOfWork(unitOfWork) {
	  var next = beginWork(unitOfWork.alternate, unitOfWork, entangledRenderLanes);
	  unitOfWork.memoizedProps = unitOfWork.pendingProps;
	  null === next ? completeUnitOfWork(unitOfWork) : (workInProgress = next);
	}
	function replaySuspendedUnitOfWork(unitOfWork) {
	  var next = unitOfWork;
	  var current = next.alternate;
	  switch (next.tag) {
	    case 15:
	    case 0:
	      next = replayFunctionComponent(
	        current,
	        next,
	        next.pendingProps,
	        next.type,
	        void 0,
	        workInProgressRootRenderLanes
	      );
	      break;
	    case 11:
	      next = replayFunctionComponent(
	        current,
	        next,
	        next.pendingProps,
	        next.type.render,
	        next.ref,
	        workInProgressRootRenderLanes
	      );
	      break;
	    case 5:
	      resetHooksOnUnwind(next);
	    default:
	      unwindInterruptedWork(current, next),
	        (next = workInProgress =
	          resetWorkInProgress(next, entangledRenderLanes)),
	        (next = beginWork(current, next, entangledRenderLanes));
	  }
	  unitOfWork.memoizedProps = unitOfWork.pendingProps;
	  null === next ? completeUnitOfWork(unitOfWork) : (workInProgress = next);
	}
	function throwAndUnwindWorkLoop(
	  root,
	  unitOfWork,
	  thrownValue,
	  suspendedReason
	) {
	  lastContextDependency = currentlyRenderingFiber = null;
	  resetHooksOnUnwind(unitOfWork);
	  thenableState$1 = null;
	  thenableIndexCounter$1 = 0;
	  var returnFiber = unitOfWork.return;
	  try {
	    if (
	      throwException(
	        root,
	        returnFiber,
	        unitOfWork,
	        thrownValue,
	        workInProgressRootRenderLanes
	      )
	    ) {
	      workInProgressRootExitStatus = 1;
	      logUncaughtError(
	        root,
	        createCapturedValueAtFiber(thrownValue, root.current)
	      );
	      workInProgress = null;
	      return;
	    }
	  } catch (error) {
	    if (null !== returnFiber) throw ((workInProgress = returnFiber), error);
	    workInProgressRootExitStatus = 1;
	    logUncaughtError(
	      root,
	      createCapturedValueAtFiber(thrownValue, root.current)
	    );
	    workInProgress = null;
	    return;
	  }
	  if (unitOfWork.flags & 32768) {
	    if (isHydrating || 1 === suspendedReason) root = true;
	    else if (
	      workInProgressRootIsPrerendering ||
	      0 !== (workInProgressRootRenderLanes & 536870912)
	    )
	      root = false;
	    else if (
	      ((workInProgressRootDidSkipSuspendedSiblings = root = true),
	      2 === suspendedReason || 3 === suspendedReason || 6 === suspendedReason)
	    )
	      (suspendedReason = suspenseHandlerStackCursor.current),
	        null !== suspendedReason &&
	          13 === suspendedReason.tag &&
	          (suspendedReason.flags |= 16384);
	    unwindUnitOfWork(unitOfWork, root);
	  } else completeUnitOfWork(unitOfWork);
	}
	function completeUnitOfWork(unitOfWork) {
	  var completedWork = unitOfWork;
	  do {
	    if (0 !== (completedWork.flags & 32768)) {
	      unwindUnitOfWork(
	        completedWork,
	        workInProgressRootDidSkipSuspendedSiblings
	      );
	      return;
	    }
	    unitOfWork = completedWork.return;
	    var next = completeWork(
	      completedWork.alternate,
	      completedWork,
	      entangledRenderLanes
	    );
	    if (null !== next) {
	      workInProgress = next;
	      return;
	    }
	    completedWork = completedWork.sibling;
	    if (null !== completedWork) {
	      workInProgress = completedWork;
	      return;
	    }
	    workInProgress = completedWork = unitOfWork;
	  } while (null !== completedWork);
	  0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 5);
	}
	function unwindUnitOfWork(unitOfWork, skipSiblings) {
	  do {
	    var next = unwindWork(unitOfWork.alternate, unitOfWork);
	    if (null !== next) {
	      next.flags &= 32767;
	      workInProgress = next;
	      return;
	    }
	    next = unitOfWork.return;
	    null !== next &&
	      ((next.flags |= 32768), (next.subtreeFlags = 0), (next.deletions = null));
	    if (
	      !skipSiblings &&
	      ((unitOfWork = unitOfWork.sibling), null !== unitOfWork)
	    ) {
	      workInProgress = unitOfWork;
	      return;
	    }
	    workInProgress = unitOfWork = next;
	  } while (null !== unitOfWork);
	  workInProgressRootExitStatus = 6;
	  workInProgress = null;
	}
	function commitRoot(
	  root,
	  recoverableErrors,
	  transitions,
	  didIncludeRenderPhaseUpdate,
	  spawnedLane,
	  updatedLanes,
	  suspendedRetryLanes,
	  suspendedCommitReason,
	  completedRenderStartTime,
	  completedRenderEndTime
	) {
	  var prevTransition = ReactSharedInternals.T,
	    previousUpdateLanePriority = ReactDOMSharedInternals.p;
	  try {
	    (ReactDOMSharedInternals.p = 2),
	      (ReactSharedInternals.T = null),
	      commitRootImpl(
	        root,
	        recoverableErrors,
	        transitions,
	        didIncludeRenderPhaseUpdate,
	        previousUpdateLanePriority,
	        spawnedLane,
	        updatedLanes,
	        suspendedRetryLanes,
	        suspendedCommitReason,
	        completedRenderStartTime,
	        completedRenderEndTime
	      );
	  } finally {
	    (ReactSharedInternals.T = prevTransition),
	      (ReactDOMSharedInternals.p = previousUpdateLanePriority);
	  }
	}
	function commitRootImpl(
	  root,
	  recoverableErrors,
	  transitions,
	  didIncludeRenderPhaseUpdate,
	  renderPriorityLevel,
	  spawnedLane,
	  updatedLanes,
	  suspendedRetryLanes
	) {
	  do flushPassiveEffects();
	  while (null !== rootWithPendingPassiveEffects);
	  if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
	  var finishedWork = root.finishedWork;
	  didIncludeRenderPhaseUpdate = root.finishedLanes;
	  if (null === finishedWork) return null;
	  root.finishedWork = null;
	  root.finishedLanes = 0;
	  if (finishedWork === root.current) throw Error(formatProdErrorMessage(177));
	  root.callbackNode = null;
	  root.callbackPriority = 0;
	  root.cancelPendingCommit = null;
	  var remainingLanes = finishedWork.lanes | finishedWork.childLanes;
	  remainingLanes |= concurrentlyUpdatedLanes;
	  markRootFinished(
	    root,
	    didIncludeRenderPhaseUpdate,
	    remainingLanes,
	    spawnedLane,
	    updatedLanes,
	    suspendedRetryLanes
	  );
	  root === workInProgressRoot &&
	    ((workInProgress = workInProgressRoot = null),
	    (workInProgressRootRenderLanes = 0));
	  (0 === (finishedWork.subtreeFlags & 10256) &&
	    0 === (finishedWork.flags & 10256)) ||
	    rootDoesHavePassiveEffects ||
	    ((rootDoesHavePassiveEffects = true),
	    (pendingPassiveEffectsRemainingLanes = remainingLanes),
	    (pendingPassiveTransitions = transitions),
	    scheduleCallback$1(NormalPriority$1, function () {
	      flushPassiveEffects();
	      return null;
	    }));
	  transitions = 0 !== (finishedWork.flags & 15990);
	  0 !== (finishedWork.subtreeFlags & 15990) || transitions
	    ? ((transitions = ReactSharedInternals.T),
	      (ReactSharedInternals.T = null),
	      (spawnedLane = ReactDOMSharedInternals.p),
	      (ReactDOMSharedInternals.p = 2),
	      (updatedLanes = executionContext),
	      (executionContext |= 4),
	      commitBeforeMutationEffects(root, finishedWork),
	      commitMutationEffectsOnFiber(finishedWork, root),
	      restoreSelection(selectionInformation, root.containerInfo),
	      (_enabled = !!eventsEnabled),
	      (selectionInformation = eventsEnabled = null),
	      (root.current = finishedWork),
	      commitLayoutEffectOnFiber(root, finishedWork.alternate, finishedWork),
	      requestPaint(),
	      (executionContext = updatedLanes),
	      (ReactDOMSharedInternals.p = spawnedLane),
	      (ReactSharedInternals.T = transitions))
	    : (root.current = finishedWork);
	  rootDoesHavePassiveEffects
	    ? ((rootDoesHavePassiveEffects = false),
	      (rootWithPendingPassiveEffects = root),
	      (pendingPassiveEffectsLanes = didIncludeRenderPhaseUpdate))
	    : releaseRootPooledCache(root, remainingLanes);
	  remainingLanes = root.pendingLanes;
	  0 === remainingLanes && (legacyErrorBoundariesThatAlreadyFailed = null);
	  onCommitRoot(finishedWork.stateNode);
	  ensureRootIsScheduled(root);
	  if (null !== recoverableErrors)
	    for (
	      renderPriorityLevel = root.onRecoverableError, finishedWork = 0;
	      finishedWork < recoverableErrors.length;
	      finishedWork++
	    )
	      (remainingLanes = recoverableErrors[finishedWork]),
	        renderPriorityLevel(remainingLanes.value, {
	          componentStack: remainingLanes.stack
	        });
	  0 !== (pendingPassiveEffectsLanes & 3) && flushPassiveEffects();
	  remainingLanes = root.pendingLanes;
	  0 !== (didIncludeRenderPhaseUpdate & 4194218) && 0 !== (remainingLanes & 42)
	    ? root === rootWithNestedUpdates
	      ? nestedUpdateCount++
	      : ((nestedUpdateCount = 0), (rootWithNestedUpdates = root))
	    : (nestedUpdateCount = 0);
	  flushSyncWorkAcrossRoots_impl(0);
	  return null;
	}
	function releaseRootPooledCache(root, remainingLanes) {
	  0 === (root.pooledCacheLanes &= remainingLanes) &&
	    ((remainingLanes = root.pooledCache),
	    null != remainingLanes &&
	      ((root.pooledCache = null), releaseCache(remainingLanes)));
	}
	function flushPassiveEffects() {
	  if (null !== rootWithPendingPassiveEffects) {
	    var root$170 = rootWithPendingPassiveEffects,
	      remainingLanes = pendingPassiveEffectsRemainingLanes;
	    pendingPassiveEffectsRemainingLanes = 0;
	    var renderPriority = lanesToEventPriority(pendingPassiveEffectsLanes),
	      prevTransition = ReactSharedInternals.T,
	      previousPriority = ReactDOMSharedInternals.p;
	    try {
	      ReactDOMSharedInternals.p = 32 > renderPriority ? 32 : renderPriority;
	      ReactSharedInternals.T = null;
	      if (null === rootWithPendingPassiveEffects)
	        var JSCompiler_inline_result = !1;
	      else {
	        renderPriority = pendingPassiveTransitions;
	        pendingPassiveTransitions = null;
	        var root = rootWithPendingPassiveEffects,
	          lanes = pendingPassiveEffectsLanes;
	        rootWithPendingPassiveEffects = null;
	        pendingPassiveEffectsLanes = 0;
	        if (0 !== (executionContext & 6))
	          throw Error(formatProdErrorMessage(331));
	        var prevExecutionContext = executionContext;
	        executionContext |= 4;
	        commitPassiveUnmountOnFiber(root.current);
	        commitPassiveMountOnFiber(root, root.current, lanes, renderPriority);
	        executionContext = prevExecutionContext;
	        flushSyncWorkAcrossRoots_impl(0, !1);
	        if (
	          injectedHook &&
	          "function" === typeof injectedHook.onPostCommitFiberRoot
	        )
	          try {
	            injectedHook.onPostCommitFiberRoot(rendererID, root);
	          } catch (err) {}
	        JSCompiler_inline_result = !0;
	      }
	      return JSCompiler_inline_result;
	    } finally {
	      (ReactDOMSharedInternals.p = previousPriority),
	        (ReactSharedInternals.T = prevTransition),
	        releaseRootPooledCache(root$170, remainingLanes);
	    }
	  }
	  return false;
	}
	function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
	  sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
	  sourceFiber = createRootErrorUpdate(rootFiber.stateNode, sourceFiber, 2);
	  rootFiber = enqueueUpdate(rootFiber, sourceFiber, 2);
	  null !== rootFiber &&
	    (markRootUpdated$1(rootFiber, 2), ensureRootIsScheduled(rootFiber));
	}
	function captureCommitPhaseError(sourceFiber, nearestMountedAncestor, error) {
	  if (3 === sourceFiber.tag)
	    captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
	  else
	    for (; null !== nearestMountedAncestor; ) {
	      if (3 === nearestMountedAncestor.tag) {
	        captureCommitPhaseErrorOnRoot(
	          nearestMountedAncestor,
	          sourceFiber,
	          error
	        );
	        break;
	      } else if (1 === nearestMountedAncestor.tag) {
	        var instance = nearestMountedAncestor.stateNode;
	        if (
	          "function" ===
	            typeof nearestMountedAncestor.type.getDerivedStateFromError ||
	          ("function" === typeof instance.componentDidCatch &&
	            (null === legacyErrorBoundariesThatAlreadyFailed ||
	              !legacyErrorBoundariesThatAlreadyFailed.has(instance)))
	        ) {
	          sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
	          error = createClassErrorUpdate(2);
	          instance = enqueueUpdate(nearestMountedAncestor, error, 2);
	          null !== instance &&
	            (initializeClassErrorUpdate(
	              error,
	              instance,
	              nearestMountedAncestor,
	              sourceFiber
	            ),
	            markRootUpdated$1(instance, 2),
	            ensureRootIsScheduled(instance));
	          break;
	        }
	      }
	      nearestMountedAncestor = nearestMountedAncestor.return;
	    }
	}
	function attachPingListener(root, wakeable, lanes) {
	  var pingCache = root.pingCache;
	  if (null === pingCache) {
	    pingCache = root.pingCache = new PossiblyWeakMap();
	    var threadIDs = new Set();
	    pingCache.set(wakeable, threadIDs);
	  } else
	    (threadIDs = pingCache.get(wakeable)),
	      void 0 === threadIDs &&
	        ((threadIDs = new Set()), pingCache.set(wakeable, threadIDs));
	  threadIDs.has(lanes) ||
	    ((workInProgressRootDidAttachPingListener = true),
	    threadIDs.add(lanes),
	    (root = pingSuspendedRoot.bind(null, root, wakeable, lanes)),
	    wakeable.then(root, root));
	}
	function pingSuspendedRoot(root, wakeable, pingedLanes) {
	  var pingCache = root.pingCache;
	  null !== pingCache && pingCache.delete(wakeable);
	  root.pingedLanes |= root.suspendedLanes & pingedLanes;
	  root.warmLanes &= ~pingedLanes;
	  workInProgressRoot === root &&
	    (workInProgressRootRenderLanes & pingedLanes) === pingedLanes &&
	    (4 === workInProgressRootExitStatus ||
	    (3 === workInProgressRootExitStatus &&
	      (workInProgressRootRenderLanes & 62914560) ===
	        workInProgressRootRenderLanes &&
	      300 > now() - globalMostRecentFallbackTime)
	      ? 0 === (executionContext & 2) && prepareFreshStack(root, 0)
	      : (workInProgressRootPingedLanes |= pingedLanes),
	    workInProgressSuspendedRetryLanes === workInProgressRootRenderLanes &&
	      (workInProgressSuspendedRetryLanes = 0));
	  ensureRootIsScheduled(root);
	}
	function retryTimedOutBoundary(boundaryFiber, retryLane) {
	  0 === retryLane && (retryLane = claimNextRetryLane());
	  boundaryFiber = enqueueConcurrentRenderForLane(boundaryFiber, retryLane);
	  null !== boundaryFiber &&
	    (markRootUpdated$1(boundaryFiber, retryLane),
	    ensureRootIsScheduled(boundaryFiber));
	}
	function retryDehydratedSuspenseBoundary(boundaryFiber) {
	  var suspenseState = boundaryFiber.memoizedState,
	    retryLane = 0;
	  null !== suspenseState && (retryLane = suspenseState.retryLane);
	  retryTimedOutBoundary(boundaryFiber, retryLane);
	}
	function resolveRetryWakeable(boundaryFiber, wakeable) {
	  var retryLane = 0;
	  switch (boundaryFiber.tag) {
	    case 13:
	      var retryCache = boundaryFiber.stateNode;
	      var suspenseState = boundaryFiber.memoizedState;
	      null !== suspenseState && (retryLane = suspenseState.retryLane);
	      break;
	    case 19:
	      retryCache = boundaryFiber.stateNode;
	      break;
	    case 22:
	      retryCache = boundaryFiber.stateNode._retryCache;
	      break;
	    default:
	      throw Error(formatProdErrorMessage(314));
	  }
	  null !== retryCache && retryCache.delete(wakeable);
	  retryTimedOutBoundary(boundaryFiber, retryLane);
	}
	function scheduleCallback$1(priorityLevel, callback) {
	  return scheduleCallback$3(priorityLevel, callback);
	}
	var firstScheduledRoot = null,
	  lastScheduledRoot = null,
	  didScheduleMicrotask = false,
	  mightHavePendingSyncWork = false,
	  isFlushingWork = false,
	  currentEventTransitionLane = 0;
	function ensureRootIsScheduled(root) {
	  root !== lastScheduledRoot &&
	    null === root.next &&
	    (null === lastScheduledRoot
	      ? (firstScheduledRoot = lastScheduledRoot = root)
	      : (lastScheduledRoot = lastScheduledRoot.next = root));
	  mightHavePendingSyncWork = true;
	  didScheduleMicrotask ||
	    ((didScheduleMicrotask = true),
	    scheduleImmediateTask(processRootScheduleInMicrotask));
	}
	function flushSyncWorkAcrossRoots_impl(syncTransitionLanes, onlyLegacy) {
	  if (!isFlushingWork && mightHavePendingSyncWork) {
	    isFlushingWork = true;
	    do {
	      var didPerformSomeWork = false;
	      for (var root$172 = firstScheduledRoot; null !== root$172; ) {
	        if (0 !== syncTransitionLanes) {
	            var pendingLanes = root$172.pendingLanes;
	            if (0 === pendingLanes) var JSCompiler_inline_result = 0;
	            else {
	              var suspendedLanes = root$172.suspendedLanes,
	                pingedLanes = root$172.pingedLanes;
	              JSCompiler_inline_result =
	                (1 << (31 - clz32(42 | syncTransitionLanes) + 1)) - 1;
	              JSCompiler_inline_result &=
	                pendingLanes & ~(suspendedLanes & ~pingedLanes);
	              JSCompiler_inline_result =
	                JSCompiler_inline_result & 201326677
	                  ? (JSCompiler_inline_result & 201326677) | 1
	                  : JSCompiler_inline_result
	                    ? JSCompiler_inline_result | 2
	                    : 0;
	            }
	            0 !== JSCompiler_inline_result &&
	              ((didPerformSomeWork = true),
	              performSyncWorkOnRoot(root$172, JSCompiler_inline_result));
	          } else
	            (JSCompiler_inline_result = workInProgressRootRenderLanes),
	              (JSCompiler_inline_result = getNextLanes(
	                root$172,
	                root$172 === workInProgressRoot ? JSCompiler_inline_result : 0
	              )),
	              0 === (JSCompiler_inline_result & 3) ||
	                checkIfRootIsPrerendering(root$172, JSCompiler_inline_result) ||
	                ((didPerformSomeWork = true),
	                performSyncWorkOnRoot(root$172, JSCompiler_inline_result));
	        root$172 = root$172.next;
	      }
	    } while (didPerformSomeWork);
	    isFlushingWork = false;
	  }
	}
	function processRootScheduleInMicrotask() {
	  mightHavePendingSyncWork = didScheduleMicrotask = false;
	  var syncTransitionLanes = 0;
	  0 !== currentEventTransitionLane &&
	    (shouldAttemptEagerTransition() &&
	      (syncTransitionLanes = currentEventTransitionLane),
	    (currentEventTransitionLane = 0));
	  for (
	    var currentTime = now(), prev = null, root = firstScheduledRoot;
	    null !== root;

	  ) {
	    var next = root.next,
	      nextLanes = scheduleTaskForRootDuringMicrotask(root, currentTime);
	    if (0 === nextLanes)
	      (root.next = null),
	        null === prev ? (firstScheduledRoot = next) : (prev.next = next),
	        null === next && (lastScheduledRoot = prev);
	    else if (
	      ((prev = root), 0 !== syncTransitionLanes || 0 !== (nextLanes & 3))
	    )
	      mightHavePendingSyncWork = true;
	    root = next;
	  }
	  flushSyncWorkAcrossRoots_impl(syncTransitionLanes);
	}
	function scheduleTaskForRootDuringMicrotask(root, currentTime) {
	  for (
	    var suspendedLanes = root.suspendedLanes,
	      pingedLanes = root.pingedLanes,
	      expirationTimes = root.expirationTimes,
	      lanes = root.pendingLanes & -62914561;
	    0 < lanes;

	  ) {
	    var index$5 = 31 - clz32(lanes),
	      lane = 1 << index$5,
	      expirationTime = expirationTimes[index$5];
	    if (-1 === expirationTime) {
	      if (0 === (lane & suspendedLanes) || 0 !== (lane & pingedLanes))
	        expirationTimes[index$5] = computeExpirationTime(lane, currentTime);
	    } else expirationTime <= currentTime && (root.expiredLanes |= lane);
	    lanes &= ~lane;
	  }
	  currentTime = workInProgressRoot;
	  suspendedLanes = workInProgressRootRenderLanes;
	  suspendedLanes = getNextLanes(
	    root,
	    root === currentTime ? suspendedLanes : 0
	  );
	  pingedLanes = root.callbackNode;
	  if (
	    0 === suspendedLanes ||
	    (root === currentTime && 2 === workInProgressSuspendedReason) ||
	    null !== root.cancelPendingCommit
	  )
	    return (
	      null !== pingedLanes &&
	        null !== pingedLanes &&
	        cancelCallback$1(pingedLanes),
	      (root.callbackNode = null),
	      (root.callbackPriority = 0)
	    );
	  if (
	    0 === (suspendedLanes & 3) ||
	    checkIfRootIsPrerendering(root, suspendedLanes)
	  ) {
	    currentTime = suspendedLanes & -suspendedLanes;
	    if (currentTime === root.callbackPriority) return currentTime;
	    null !== pingedLanes && cancelCallback$1(pingedLanes);
	    switch (lanesToEventPriority(suspendedLanes)) {
	      case 2:
	      case 8:
	        suspendedLanes = UserBlockingPriority;
	        break;
	      case 32:
	        suspendedLanes = NormalPriority$1;
	        break;
	      case 268435456:
	        suspendedLanes = IdlePriority;
	        break;
	      default:
	        suspendedLanes = NormalPriority$1;
	    }
	    pingedLanes = performWorkOnRootViaSchedulerTask.bind(null, root);
	    suspendedLanes = scheduleCallback$3(suspendedLanes, pingedLanes);
	    root.callbackPriority = currentTime;
	    root.callbackNode = suspendedLanes;
	    return currentTime;
	  }
	  null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes);
	  root.callbackPriority = 2;
	  root.callbackNode = null;
	  return 2;
	}
	function performWorkOnRootViaSchedulerTask(root, didTimeout) {
	  var originalCallbackNode = root.callbackNode;
	  if (flushPassiveEffects() && root.callbackNode !== originalCallbackNode)
	    return null;
	  var workInProgressRootRenderLanes$jscomp$0 = workInProgressRootRenderLanes;
	  workInProgressRootRenderLanes$jscomp$0 = getNextLanes(
	    root,
	    root === workInProgressRoot ? workInProgressRootRenderLanes$jscomp$0 : 0
	  );
	  if (0 === workInProgressRootRenderLanes$jscomp$0) return null;
	  performWorkOnRoot(root, workInProgressRootRenderLanes$jscomp$0, didTimeout);
	  scheduleTaskForRootDuringMicrotask(root, now());
	  return null != root.callbackNode && root.callbackNode === originalCallbackNode
	    ? performWorkOnRootViaSchedulerTask.bind(null, root)
	    : null;
	}
	function performSyncWorkOnRoot(root, lanes) {
	  if (flushPassiveEffects()) return null;
	  performWorkOnRoot(root, lanes, true);
	}
	function scheduleImmediateTask(cb) {
	  scheduleMicrotask(function () {
	    0 !== (executionContext & 6)
	      ? scheduleCallback$3(ImmediatePriority, cb)
	      : cb();
	  });
	}
	function requestTransitionLane() {
	  0 === currentEventTransitionLane &&
	    (currentEventTransitionLane = claimNextTransitionLane());
	  return currentEventTransitionLane;
	}
	function coerceFormActionProp(actionProp) {
	  return null == actionProp ||
	    "symbol" === typeof actionProp ||
	    "boolean" === typeof actionProp
	    ? null
	    : "function" === typeof actionProp
	      ? actionProp
	      : sanitizeURL("" + actionProp);
	}
	function createFormDataWithSubmitter(form, submitter) {
	  var temp = submitter.ownerDocument.createElement("input");
	  temp.name = submitter.name;
	  temp.value = submitter.value;
	  form.id && temp.setAttribute("form", form.id);
	  submitter.parentNode.insertBefore(temp, submitter);
	  form = new FormData(form);
	  temp.parentNode.removeChild(temp);
	  return form;
	}
	function extractEvents$1(
	  dispatchQueue,
	  domEventName,
	  maybeTargetInst,
	  nativeEvent,
	  nativeEventTarget
	) {
	  if (
	    "submit" === domEventName &&
	    maybeTargetInst &&
	    maybeTargetInst.stateNode === nativeEventTarget
	  ) {
	    var action = coerceFormActionProp(
	        (nativeEventTarget[internalPropsKey] || null).action
	      ),
	      submitter = nativeEvent.submitter;
	    submitter &&
	      ((domEventName = (domEventName = submitter[internalPropsKey] || null)
	        ? coerceFormActionProp(domEventName.formAction)
	        : submitter.getAttribute("formAction")),
	      null !== domEventName && ((action = domEventName), (submitter = null)));
	    var event = new SyntheticEvent(
	      "action",
	      "action",
	      null,
	      nativeEvent,
	      nativeEventTarget
	    );
	    dispatchQueue.push({
	      event: event,
	      listeners: [
	        {
	          instance: null,
	          listener: function () {
	            if (nativeEvent.defaultPrevented) {
	              if (0 !== currentEventTransitionLane) {
	                var formData = submitter
	                  ? createFormDataWithSubmitter(nativeEventTarget, submitter)
	                  : new FormData(nativeEventTarget);
	                startHostTransition(
	                  maybeTargetInst,
	                  {
	                    pending: true,
	                    data: formData,
	                    method: nativeEventTarget.method,
	                    action: action
	                  },
	                  null,
	                  formData
	                );
	              }
	            } else
	              "function" === typeof action &&
	                (event.preventDefault(),
	                (formData = submitter
	                  ? createFormDataWithSubmitter(nativeEventTarget, submitter)
	                  : new FormData(nativeEventTarget)),
	                startHostTransition(
	                  maybeTargetInst,
	                  {
	                    pending: true,
	                    data: formData,
	                    method: nativeEventTarget.method,
	                    action: action
	                  },
	                  action,
	                  formData
	                ));
	          },
	          currentTarget: nativeEventTarget
	        }
	      ]
	    });
	  }
	}
	for (
	  var i$jscomp$inline_1439 = 0;
	  i$jscomp$inline_1439 < simpleEventPluginEvents.length;
	  i$jscomp$inline_1439++
	) {
	  var eventName$jscomp$inline_1440 =
	      simpleEventPluginEvents[i$jscomp$inline_1439],
	    domEventName$jscomp$inline_1441 =
	      eventName$jscomp$inline_1440.toLowerCase(),
	    capitalizedEvent$jscomp$inline_1442 =
	      eventName$jscomp$inline_1440[0].toUpperCase() +
	      eventName$jscomp$inline_1440.slice(1);
	  registerSimpleEvent(
	    domEventName$jscomp$inline_1441,
	    "on" + capitalizedEvent$jscomp$inline_1442
	  );
	}
	registerSimpleEvent(ANIMATION_END, "onAnimationEnd");
	registerSimpleEvent(ANIMATION_ITERATION, "onAnimationIteration");
	registerSimpleEvent(ANIMATION_START, "onAnimationStart");
	registerSimpleEvent("dblclick", "onDoubleClick");
	registerSimpleEvent("focusin", "onFocus");
	registerSimpleEvent("focusout", "onBlur");
	registerSimpleEvent(TRANSITION_RUN, "onTransitionRun");
	registerSimpleEvent(TRANSITION_START, "onTransitionStart");
	registerSimpleEvent(TRANSITION_CANCEL, "onTransitionCancel");
	registerSimpleEvent(TRANSITION_END, "onTransitionEnd");
	registerDirectEvent("onMouseEnter", ["mouseout", "mouseover"]);
	registerDirectEvent("onMouseLeave", ["mouseout", "mouseover"]);
	registerDirectEvent("onPointerEnter", ["pointerout", "pointerover"]);
	registerDirectEvent("onPointerLeave", ["pointerout", "pointerover"]);
	registerTwoPhaseEvent(
	  "onChange",
	  "change click focusin focusout input keydown keyup selectionchange".split(" ")
	);
	registerTwoPhaseEvent(
	  "onSelect",
	  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
	    " "
	  )
	);
	registerTwoPhaseEvent("onBeforeInput", [
	  "compositionend",
	  "keypress",
	  "textInput",
	  "paste"
	]);
	registerTwoPhaseEvent(
	  "onCompositionEnd",
	  "compositionend focusout keydown keypress keyup mousedown".split(" ")
	);
	registerTwoPhaseEvent(
	  "onCompositionStart",
	  "compositionstart focusout keydown keypress keyup mousedown".split(" ")
	);
	registerTwoPhaseEvent(
	  "onCompositionUpdate",
	  "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
	);
	var mediaEventTypes =
	    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
	      " "
	    ),
	  nonDelegatedEvents = new Set(
	    "beforetoggle cancel close invalid load scroll scrollend toggle"
	      .split(" ")
	      .concat(mediaEventTypes)
	  );
	function processDispatchQueue(dispatchQueue, eventSystemFlags) {
	  eventSystemFlags = 0 !== (eventSystemFlags & 4);
	  for (var i = 0; i < dispatchQueue.length; i++) {
	    var _dispatchQueue$i = dispatchQueue[i],
	      event = _dispatchQueue$i.event;
	    _dispatchQueue$i = _dispatchQueue$i.listeners;
	    a: {
	      var previousInstance = void 0;
	      if (eventSystemFlags)
	        for (
	          var i$jscomp$0 = _dispatchQueue$i.length - 1;
	          0 <= i$jscomp$0;
	          i$jscomp$0--
	        ) {
	          var _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0],
	            instance = _dispatchListeners$i.instance,
	            currentTarget = _dispatchListeners$i.currentTarget;
	          _dispatchListeners$i = _dispatchListeners$i.listener;
	          if (instance !== previousInstance && event.isPropagationStopped())
	            break a;
	          previousInstance = _dispatchListeners$i;
	          event.currentTarget = currentTarget;
	          try {
	            previousInstance(event);
	          } catch (error) {
	            reportGlobalError(error);
	          }
	          event.currentTarget = null;
	          previousInstance = instance;
	        }
	      else
	        for (
	          i$jscomp$0 = 0;
	          i$jscomp$0 < _dispatchQueue$i.length;
	          i$jscomp$0++
	        ) {
	          _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0];
	          instance = _dispatchListeners$i.instance;
	          currentTarget = _dispatchListeners$i.currentTarget;
	          _dispatchListeners$i = _dispatchListeners$i.listener;
	          if (instance !== previousInstance && event.isPropagationStopped())
	            break a;
	          previousInstance = _dispatchListeners$i;
	          event.currentTarget = currentTarget;
	          try {
	            previousInstance(event);
	          } catch (error) {
	            reportGlobalError(error);
	          }
	          event.currentTarget = null;
	          previousInstance = instance;
	        }
	    }
	  }
	}
	function listenToNonDelegatedEvent(domEventName, targetElement) {
	  var JSCompiler_inline_result = targetElement[internalEventHandlersKey];
	  void 0 === JSCompiler_inline_result &&
	    (JSCompiler_inline_result = targetElement[internalEventHandlersKey] =
	      new Set());
	  var listenerSetKey = domEventName + "__bubble";
	  JSCompiler_inline_result.has(listenerSetKey) ||
	    (addTrappedEventListener(targetElement, domEventName, 2, false),
	    JSCompiler_inline_result.add(listenerSetKey));
	}
	function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
	  var eventSystemFlags = 0;
	  isCapturePhaseListener && (eventSystemFlags |= 4);
	  addTrappedEventListener(
	    target,
	    domEventName,
	    eventSystemFlags,
	    isCapturePhaseListener
	  );
	}
	var listeningMarker = "_reactListening" + Math.random().toString(36).slice(2);
	function listenToAllSupportedEvents(rootContainerElement) {
	  if (!rootContainerElement[listeningMarker]) {
	    rootContainerElement[listeningMarker] = true;
	    allNativeEvents.forEach(function (domEventName) {
	      "selectionchange" !== domEventName &&
	        (nonDelegatedEvents.has(domEventName) ||
	          listenToNativeEvent(domEventName, false, rootContainerElement),
	        listenToNativeEvent(domEventName, true, rootContainerElement));
	    });
	    var ownerDocument =
	      9 === rootContainerElement.nodeType
	        ? rootContainerElement
	        : rootContainerElement.ownerDocument;
	    null === ownerDocument ||
	      ownerDocument[listeningMarker] ||
	      ((ownerDocument[listeningMarker] = true),
	      listenToNativeEvent("selectionchange", false, ownerDocument));
	  }
	}
	function addTrappedEventListener(
	  targetContainer,
	  domEventName,
	  eventSystemFlags,
	  isCapturePhaseListener
	) {
	  switch (getEventPriority(domEventName)) {
	    case 2:
	      var listenerWrapper = dispatchDiscreteEvent;
	      break;
	    case 8:
	      listenerWrapper = dispatchContinuousEvent;
	      break;
	    default:
	      listenerWrapper = dispatchEvent;
	  }
	  eventSystemFlags = listenerWrapper.bind(
	    null,
	    domEventName,
	    eventSystemFlags,
	    targetContainer
	  );
	  listenerWrapper = void 0;
	  !passiveBrowserEventsSupported ||
	    ("touchstart" !== domEventName &&
	      "touchmove" !== domEventName &&
	      "wheel" !== domEventName) ||
	    (listenerWrapper = true);
	  isCapturePhaseListener
	    ? void 0 !== listenerWrapper
	      ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
	          capture: true,
	          passive: listenerWrapper
	        })
	      : targetContainer.addEventListener(domEventName, eventSystemFlags, true)
	    : void 0 !== listenerWrapper
	      ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
	          passive: listenerWrapper
	        })
	      : targetContainer.addEventListener(domEventName, eventSystemFlags, false);
	}
	function dispatchEventForPluginEventSystem(
	  domEventName,
	  eventSystemFlags,
	  nativeEvent,
	  targetInst$jscomp$0,
	  targetContainer
	) {
	  var ancestorInst = targetInst$jscomp$0;
	  if (
	    0 === (eventSystemFlags & 1) &&
	    0 === (eventSystemFlags & 2) &&
	    null !== targetInst$jscomp$0
	  )
	    a: for (;;) {
	      if (null === targetInst$jscomp$0) return;
	      var nodeTag = targetInst$jscomp$0.tag;
	      if (3 === nodeTag || 4 === nodeTag) {
	        var container = targetInst$jscomp$0.stateNode.containerInfo;
	        if (
	          container === targetContainer ||
	          (8 === container.nodeType && container.parentNode === targetContainer)
	        )
	          break;
	        if (4 === nodeTag)
	          for (nodeTag = targetInst$jscomp$0.return; null !== nodeTag; ) {
	            var grandTag = nodeTag.tag;
	            if (3 === grandTag || 4 === grandTag)
	              if (
	                ((grandTag = nodeTag.stateNode.containerInfo),
	                grandTag === targetContainer ||
	                  (8 === grandTag.nodeType &&
	                    grandTag.parentNode === targetContainer))
	              )
	                return;
	            nodeTag = nodeTag.return;
	          }
	        for (; null !== container; ) {
	          nodeTag = getClosestInstanceFromNode(container);
	          if (null === nodeTag) return;
	          grandTag = nodeTag.tag;
	          if (
	            5 === grandTag ||
	            6 === grandTag ||
	            26 === grandTag ||
	            27 === grandTag
	          ) {
	            targetInst$jscomp$0 = ancestorInst = nodeTag;
	            continue a;
	          }
	          container = container.parentNode;
	        }
	      }
	      targetInst$jscomp$0 = targetInst$jscomp$0.return;
	    }
	  batchedUpdates$1(function () {
	    var targetInst = ancestorInst,
	      nativeEventTarget = getEventTarget(nativeEvent),
	      dispatchQueue = [];
	    a: {
	      var reactName = topLevelEventsToReactNames.get(domEventName);
	      if (void 0 !== reactName) {
	        var SyntheticEventCtor = SyntheticEvent,
	          reactEventType = domEventName;
	        switch (domEventName) {
	          case "keypress":
	            if (0 === getEventCharCode(nativeEvent)) break a;
	          case "keydown":
	          case "keyup":
	            SyntheticEventCtor = SyntheticKeyboardEvent;
	            break;
	          case "focusin":
	            reactEventType = "focus";
	            SyntheticEventCtor = SyntheticFocusEvent;
	            break;
	          case "focusout":
	            reactEventType = "blur";
	            SyntheticEventCtor = SyntheticFocusEvent;
	            break;
	          case "beforeblur":
	          case "afterblur":
	            SyntheticEventCtor = SyntheticFocusEvent;
	            break;
	          case "click":
	            if (2 === nativeEvent.button) break a;
	          case "auxclick":
	          case "dblclick":
	          case "mousedown":
	          case "mousemove":
	          case "mouseup":
	          case "mouseout":
	          case "mouseover":
	          case "contextmenu":
	            SyntheticEventCtor = SyntheticMouseEvent;
	            break;
	          case "drag":
	          case "dragend":
	          case "dragenter":
	          case "dragexit":
	          case "dragleave":
	          case "dragover":
	          case "dragstart":
	          case "drop":
	            SyntheticEventCtor = SyntheticDragEvent;
	            break;
	          case "touchcancel":
	          case "touchend":
	          case "touchmove":
	          case "touchstart":
	            SyntheticEventCtor = SyntheticTouchEvent;
	            break;
	          case ANIMATION_END:
	          case ANIMATION_ITERATION:
	          case ANIMATION_START:
	            SyntheticEventCtor = SyntheticAnimationEvent;
	            break;
	          case TRANSITION_END:
	            SyntheticEventCtor = SyntheticTransitionEvent;
	            break;
	          case "scroll":
	          case "scrollend":
	            SyntheticEventCtor = SyntheticUIEvent;
	            break;
	          case "wheel":
	            SyntheticEventCtor = SyntheticWheelEvent;
	            break;
	          case "copy":
	          case "cut":
	          case "paste":
	            SyntheticEventCtor = SyntheticClipboardEvent;
	            break;
	          case "gotpointercapture":
	          case "lostpointercapture":
	          case "pointercancel":
	          case "pointerdown":
	          case "pointermove":
	          case "pointerout":
	          case "pointerover":
	          case "pointerup":
	            SyntheticEventCtor = SyntheticPointerEvent;
	            break;
	          case "toggle":
	          case "beforetoggle":
	            SyntheticEventCtor = SyntheticToggleEvent;
	        }
	        var inCapturePhase = 0 !== (eventSystemFlags & 4),
	          accumulateTargetOnly =
	            !inCapturePhase &&
	            ("scroll" === domEventName || "scrollend" === domEventName),
	          reactEventName = inCapturePhase
	            ? null !== reactName
	              ? reactName + "Capture"
	              : null
	            : reactName;
	        inCapturePhase = [];
	        for (
	          var instance = targetInst, lastHostComponent;
	          null !== instance;

	        ) {
	          var _instance = instance;
	          lastHostComponent = _instance.stateNode;
	          _instance = _instance.tag;
	          (5 !== _instance && 26 !== _instance && 27 !== _instance) ||
	            null === lastHostComponent ||
	            null === reactEventName ||
	            ((_instance = getListener(instance, reactEventName)),
	            null != _instance &&
	              inCapturePhase.push(
	                createDispatchListener(instance, _instance, lastHostComponent)
	              ));
	          if (accumulateTargetOnly) break;
	          instance = instance.return;
	        }
	        0 < inCapturePhase.length &&
	          ((reactName = new SyntheticEventCtor(
	            reactName,
	            reactEventType,
	            null,
	            nativeEvent,
	            nativeEventTarget
	          )),
	          dispatchQueue.push({ event: reactName, listeners: inCapturePhase }));
	      }
	    }
	    if (0 === (eventSystemFlags & 7)) {
	      a: {
	        reactName =
	          "mouseover" === domEventName || "pointerover" === domEventName;
	        SyntheticEventCtor =
	          "mouseout" === domEventName || "pointerout" === domEventName;
	        if (
	          reactName &&
	          nativeEvent !== currentReplayingEvent &&
	          (reactEventType =
	            nativeEvent.relatedTarget || nativeEvent.fromElement) &&
	          (getClosestInstanceFromNode(reactEventType) ||
	            reactEventType[internalContainerInstanceKey])
	        )
	          break a;
	        if (SyntheticEventCtor || reactName) {
	          reactName =
	            nativeEventTarget.window === nativeEventTarget
	              ? nativeEventTarget
	              : (reactName = nativeEventTarget.ownerDocument)
	                ? reactName.defaultView || reactName.parentWindow
	                : window;
	          if (SyntheticEventCtor) {
	            if (
	              ((reactEventType =
	                nativeEvent.relatedTarget || nativeEvent.toElement),
	              (SyntheticEventCtor = targetInst),
	              (reactEventType = reactEventType
	                ? getClosestInstanceFromNode(reactEventType)
	                : null),
	              null !== reactEventType &&
	                ((accumulateTargetOnly =
	                  getNearestMountedFiber(reactEventType)),
	                (inCapturePhase = reactEventType.tag),
	                reactEventType !== accumulateTargetOnly ||
	                  (5 !== inCapturePhase &&
	                    27 !== inCapturePhase &&
	                    6 !== inCapturePhase)))
	            )
	              reactEventType = null;
	          } else (SyntheticEventCtor = null), (reactEventType = targetInst);
	          if (SyntheticEventCtor !== reactEventType) {
	            inCapturePhase = SyntheticMouseEvent;
	            _instance = "onMouseLeave";
	            reactEventName = "onMouseEnter";
	            instance = "mouse";
	            if ("pointerout" === domEventName || "pointerover" === domEventName)
	              (inCapturePhase = SyntheticPointerEvent),
	                (_instance = "onPointerLeave"),
	                (reactEventName = "onPointerEnter"),
	                (instance = "pointer");
	            accumulateTargetOnly =
	              null == SyntheticEventCtor
	                ? reactName
	                : getNodeFromInstance(SyntheticEventCtor);
	            lastHostComponent =
	              null == reactEventType
	                ? reactName
	                : getNodeFromInstance(reactEventType);
	            reactName = new inCapturePhase(
	              _instance,
	              instance + "leave",
	              SyntheticEventCtor,
	              nativeEvent,
	              nativeEventTarget
	            );
	            reactName.target = accumulateTargetOnly;
	            reactName.relatedTarget = lastHostComponent;
	            _instance = null;
	            getClosestInstanceFromNode(nativeEventTarget) === targetInst &&
	              ((inCapturePhase = new inCapturePhase(
	                reactEventName,
	                instance + "enter",
	                reactEventType,
	                nativeEvent,
	                nativeEventTarget
	              )),
	              (inCapturePhase.target = lastHostComponent),
	              (inCapturePhase.relatedTarget = accumulateTargetOnly),
	              (_instance = inCapturePhase));
	            accumulateTargetOnly = _instance;
	            if (SyntheticEventCtor && reactEventType)
	              b: {
	                inCapturePhase = SyntheticEventCtor;
	                reactEventName = reactEventType;
	                instance = 0;
	                for (
	                  lastHostComponent = inCapturePhase;
	                  lastHostComponent;
	                  lastHostComponent = getParent(lastHostComponent)
	                )
	                  instance++;
	                lastHostComponent = 0;
	                for (
	                  _instance = reactEventName;
	                  _instance;
	                  _instance = getParent(_instance)
	                )
	                  lastHostComponent++;
	                for (; 0 < instance - lastHostComponent; )
	                  (inCapturePhase = getParent(inCapturePhase)), instance--;
	                for (; 0 < lastHostComponent - instance; )
	                  (reactEventName = getParent(reactEventName)),
	                    lastHostComponent--;
	                for (; instance--; ) {
	                  if (
	                    inCapturePhase === reactEventName ||
	                    (null !== reactEventName &&
	                      inCapturePhase === reactEventName.alternate)
	                  )
	                    break b;
	                  inCapturePhase = getParent(inCapturePhase);
	                  reactEventName = getParent(reactEventName);
	                }
	                inCapturePhase = null;
	              }
	            else inCapturePhase = null;
	            null !== SyntheticEventCtor &&
	              accumulateEnterLeaveListenersForEvent(
	                dispatchQueue,
	                reactName,
	                SyntheticEventCtor,
	                inCapturePhase,
	                !1
	              );
	            null !== reactEventType &&
	              null !== accumulateTargetOnly &&
	              accumulateEnterLeaveListenersForEvent(
	                dispatchQueue,
	                accumulateTargetOnly,
	                reactEventType,
	                inCapturePhase,
	                !0
	              );
	          }
	        }
	      }
	      a: {
	        reactName = targetInst ? getNodeFromInstance(targetInst) : window;
	        SyntheticEventCtor =
	          reactName.nodeName && reactName.nodeName.toLowerCase();
	        if (
	          "select" === SyntheticEventCtor ||
	          ("input" === SyntheticEventCtor && "file" === reactName.type)
	        )
	          var getTargetInstFunc = getTargetInstForChangeEvent;
	        else if (isTextInputElement(reactName))
	          if (isInputEventSupported)
	            getTargetInstFunc = getTargetInstForInputOrChangeEvent;
	          else {
	            getTargetInstFunc = getTargetInstForInputEventPolyfill;
	            var handleEventFunc = handleEventsForInputEventPolyfill;
	          }
	        else
	          (SyntheticEventCtor = reactName.nodeName),
	            !SyntheticEventCtor ||
	            "input" !== SyntheticEventCtor.toLowerCase() ||
	            ("checkbox" !== reactName.type && "radio" !== reactName.type)
	              ? targetInst &&
	                isCustomElement(targetInst.elementType) &&
	                (getTargetInstFunc = getTargetInstForChangeEvent)
	              : (getTargetInstFunc = getTargetInstForClickEvent);
	        if (
	          getTargetInstFunc &&
	          (getTargetInstFunc = getTargetInstFunc(domEventName, targetInst))
	        ) {
	          createAndAccumulateChangeEvent(
	            dispatchQueue,
	            getTargetInstFunc,
	            nativeEvent,
	            nativeEventTarget
	          );
	          break a;
	        }
	        handleEventFunc && handleEventFunc(domEventName, reactName, targetInst);
	        "focusout" === domEventName &&
	          targetInst &&
	          "number" === reactName.type &&
	          null != targetInst.memoizedProps.value &&
	          setDefaultValue(reactName, "number", reactName.value);
	      }
	      handleEventFunc = targetInst ? getNodeFromInstance(targetInst) : window;
	      switch (domEventName) {
	        case "focusin":
	          if (
	            isTextInputElement(handleEventFunc) ||
	            "true" === handleEventFunc.contentEditable
	          )
	            (activeElement = handleEventFunc),
	              (activeElementInst = targetInst),
	              (lastSelection = null);
	          break;
	        case "focusout":
	          lastSelection = activeElementInst = activeElement = null;
	          break;
	        case "mousedown":
	          mouseDown = !0;
	          break;
	        case "contextmenu":
	        case "mouseup":
	        case "dragend":
	          mouseDown = !1;
	          constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
	          break;
	        case "selectionchange":
	          if (skipSelectionChangeEvent) break;
	        case "keydown":
	        case "keyup":
	          constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
	      }
	      var fallbackData;
	      if (canUseCompositionEvent)
	        b: {
	          switch (domEventName) {
	            case "compositionstart":
	              var eventType = "onCompositionStart";
	              break b;
	            case "compositionend":
	              eventType = "onCompositionEnd";
	              break b;
	            case "compositionupdate":
	              eventType = "onCompositionUpdate";
	              break b;
	          }
	          eventType = void 0;
	        }
	      else
	        isComposing
	          ? isFallbackCompositionEnd(domEventName, nativeEvent) &&
	            (eventType = "onCompositionEnd")
	          : "keydown" === domEventName &&
	            229 === nativeEvent.keyCode &&
	            (eventType = "onCompositionStart");
	      eventType &&
	        (useFallbackCompositionData &&
	          "ko" !== nativeEvent.locale &&
	          (isComposing || "onCompositionStart" !== eventType
	            ? "onCompositionEnd" === eventType &&
	              isComposing &&
	              (fallbackData = getData())
	            : ((root = nativeEventTarget),
	              (startText = "value" in root ? root.value : root.textContent),
	              (isComposing = !0))),
	        (handleEventFunc = accumulateTwoPhaseListeners(targetInst, eventType)),
	        0 < handleEventFunc.length &&
	          ((eventType = new SyntheticCompositionEvent(
	            eventType,
	            domEventName,
	            null,
	            nativeEvent,
	            nativeEventTarget
	          )),
	          dispatchQueue.push({ event: eventType, listeners: handleEventFunc }),
	          fallbackData
	            ? (eventType.data = fallbackData)
	            : ((fallbackData = getDataFromCustomEvent(nativeEvent)),
	              null !== fallbackData && (eventType.data = fallbackData))));
	      if (
	        (fallbackData = canUseTextInputEvent
	          ? getNativeBeforeInputChars(domEventName, nativeEvent)
	          : getFallbackBeforeInputChars(domEventName, nativeEvent))
	      )
	        (eventType = accumulateTwoPhaseListeners(targetInst, "onBeforeInput")),
	          0 < eventType.length &&
	            ((handleEventFunc = new SyntheticCompositionEvent(
	              "onBeforeInput",
	              "beforeinput",
	              null,
	              nativeEvent,
	              nativeEventTarget
	            )),
	            dispatchQueue.push({
	              event: handleEventFunc,
	              listeners: eventType
	            }),
	            (handleEventFunc.data = fallbackData));
	      extractEvents$1(
	        dispatchQueue,
	        domEventName,
	        targetInst,
	        nativeEvent,
	        nativeEventTarget
	      );
	    }
	    processDispatchQueue(dispatchQueue, eventSystemFlags);
	  });
	}
	function createDispatchListener(instance, listener, currentTarget) {
	  return {
	    instance: instance,
	    listener: listener,
	    currentTarget: currentTarget
	  };
	}
	function accumulateTwoPhaseListeners(targetFiber, reactName) {
	  for (
	    var captureName = reactName + "Capture", listeners = [];
	    null !== targetFiber;

	  ) {
	    var _instance2 = targetFiber,
	      stateNode = _instance2.stateNode;
	    _instance2 = _instance2.tag;
	    (5 !== _instance2 && 26 !== _instance2 && 27 !== _instance2) ||
	      null === stateNode ||
	      ((_instance2 = getListener(targetFiber, captureName)),
	      null != _instance2 &&
	        listeners.unshift(
	          createDispatchListener(targetFiber, _instance2, stateNode)
	        ),
	      (_instance2 = getListener(targetFiber, reactName)),
	      null != _instance2 &&
	        listeners.push(
	          createDispatchListener(targetFiber, _instance2, stateNode)
	        ));
	    targetFiber = targetFiber.return;
	  }
	  return listeners;
	}
	function getParent(inst) {
	  if (null === inst) return null;
	  do inst = inst.return;
	  while (inst && 5 !== inst.tag && 27 !== inst.tag);
	  return inst ? inst : null;
	}
	function accumulateEnterLeaveListenersForEvent(
	  dispatchQueue,
	  event,
	  target,
	  common,
	  inCapturePhase
	) {
	  for (
	    var registrationName = event._reactName, listeners = [];
	    null !== target && target !== common;

	  ) {
	    var _instance3 = target,
	      alternate = _instance3.alternate,
	      stateNode = _instance3.stateNode;
	    _instance3 = _instance3.tag;
	    if (null !== alternate && alternate === common) break;
	    (5 !== _instance3 && 26 !== _instance3 && 27 !== _instance3) ||
	      null === stateNode ||
	      ((alternate = stateNode),
	      inCapturePhase
	        ? ((stateNode = getListener(target, registrationName)),
	          null != stateNode &&
	            listeners.unshift(
	              createDispatchListener(target, stateNode, alternate)
	            ))
	        : inCapturePhase ||
	          ((stateNode = getListener(target, registrationName)),
	          null != stateNode &&
	            listeners.push(
	              createDispatchListener(target, stateNode, alternate)
	            )));
	    target = target.return;
	  }
	  0 !== listeners.length &&
	    dispatchQueue.push({ event: event, listeners: listeners });
	}
	var NORMALIZE_NEWLINES_REGEX = /\r\n?/g,
	  NORMALIZE_NULL_AND_REPLACEMENT_REGEX = /\u0000|\uFFFD/g;
	function normalizeMarkupForTextOrAttribute(markup) {
	  return ("string" === typeof markup ? markup : "" + markup)
	    .replace(NORMALIZE_NEWLINES_REGEX, "\n")
	    .replace(NORMALIZE_NULL_AND_REPLACEMENT_REGEX, "");
	}
	function checkForUnmatchedText(serverText, clientText) {
	  clientText = normalizeMarkupForTextOrAttribute(clientText);
	  return normalizeMarkupForTextOrAttribute(serverText) === clientText ? true : false;
	}
	function noop$1() {}
	function setProp(domElement, tag, key, value, props, prevValue) {
	  switch (key) {
	    case "children":
	      "string" === typeof value
	        ? "body" === tag ||
	          ("textarea" === tag && "" === value) ||
	          setTextContent(domElement, value)
	        : ("number" === typeof value || "bigint" === typeof value) &&
	          "body" !== tag &&
	          setTextContent(domElement, "" + value);
	      break;
	    case "className":
	      setValueForKnownAttribute(domElement, "class", value);
	      break;
	    case "tabIndex":
	      setValueForKnownAttribute(domElement, "tabindex", value);
	      break;
	    case "dir":
	    case "role":
	    case "viewBox":
	    case "width":
	    case "height":
	      setValueForKnownAttribute(domElement, key, value);
	      break;
	    case "style":
	      setValueForStyles(domElement, value, prevValue);
	      break;
	    case "data":
	      if ("object" !== tag) {
	        setValueForKnownAttribute(domElement, "data", value);
	        break;
	      }
	    case "src":
	    case "href":
	      if ("" === value && ("a" !== tag || "href" !== key)) {
	        domElement.removeAttribute(key);
	        break;
	      }
	      if (
	        null == value ||
	        "function" === typeof value ||
	        "symbol" === typeof value ||
	        "boolean" === typeof value
	      ) {
	        domElement.removeAttribute(key);
	        break;
	      }
	      value = sanitizeURL("" + value);
	      domElement.setAttribute(key, value);
	      break;
	    case "action":
	    case "formAction":
	      if ("function" === typeof value) {
	        domElement.setAttribute(
	          key,
	          "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
	        );
	        break;
	      } else
	        "function" === typeof prevValue &&
	          ("formAction" === key
	            ? ("input" !== tag &&
	                setProp(domElement, tag, "name", props.name, props, null),
	              setProp(
	                domElement,
	                tag,
	                "formEncType",
	                props.formEncType,
	                props,
	                null
	              ),
	              setProp(
	                domElement,
	                tag,
	                "formMethod",
	                props.formMethod,
	                props,
	                null
	              ),
	              setProp(
	                domElement,
	                tag,
	                "formTarget",
	                props.formTarget,
	                props,
	                null
	              ))
	            : (setProp(domElement, tag, "encType", props.encType, props, null),
	              setProp(domElement, tag, "method", props.method, props, null),
	              setProp(domElement, tag, "target", props.target, props, null)));
	      if (
	        null == value ||
	        "symbol" === typeof value ||
	        "boolean" === typeof value
	      ) {
	        domElement.removeAttribute(key);
	        break;
	      }
	      value = sanitizeURL("" + value);
	      domElement.setAttribute(key, value);
	      break;
	    case "onClick":
	      null != value && (domElement.onclick = noop$1);
	      break;
	    case "onScroll":
	      null != value && listenToNonDelegatedEvent("scroll", domElement);
	      break;
	    case "onScrollEnd":
	      null != value && listenToNonDelegatedEvent("scrollend", domElement);
	      break;
	    case "dangerouslySetInnerHTML":
	      if (null != value) {
	        if ("object" !== typeof value || !("__html" in value))
	          throw Error(formatProdErrorMessage(61));
	        key = value.__html;
	        if (null != key) {
	          if (null != props.children) throw Error(formatProdErrorMessage(60));
	          domElement.innerHTML = key;
	        }
	      }
	      break;
	    case "multiple":
	      domElement.multiple =
	        value && "function" !== typeof value && "symbol" !== typeof value;
	      break;
	    case "muted":
	      domElement.muted =
	        value && "function" !== typeof value && "symbol" !== typeof value;
	      break;
	    case "suppressContentEditableWarning":
	    case "suppressHydrationWarning":
	    case "defaultValue":
	    case "defaultChecked":
	    case "innerHTML":
	    case "ref":
	      break;
	    case "autoFocus":
	      break;
	    case "xlinkHref":
	      if (
	        null == value ||
	        "function" === typeof value ||
	        "boolean" === typeof value ||
	        "symbol" === typeof value
	      ) {
	        domElement.removeAttribute("xlink:href");
	        break;
	      }
	      key = sanitizeURL("" + value);
	      domElement.setAttributeNS(
	        "http://www.w3.org/1999/xlink",
	        "xlink:href",
	        key
	      );
	      break;
	    case "contentEditable":
	    case "spellCheck":
	    case "draggable":
	    case "value":
	    case "autoReverse":
	    case "externalResourcesRequired":
	    case "focusable":
	    case "preserveAlpha":
	      null != value && "function" !== typeof value && "symbol" !== typeof value
	        ? domElement.setAttribute(key, "" + value)
	        : domElement.removeAttribute(key);
	      break;
	    case "inert":
	    case "allowFullScreen":
	    case "async":
	    case "autoPlay":
	    case "controls":
	    case "default":
	    case "defer":
	    case "disabled":
	    case "disablePictureInPicture":
	    case "disableRemotePlayback":
	    case "formNoValidate":
	    case "hidden":
	    case "loop":
	    case "noModule":
	    case "noValidate":
	    case "open":
	    case "playsInline":
	    case "readOnly":
	    case "required":
	    case "reversed":
	    case "scoped":
	    case "seamless":
	    case "itemScope":
	      value && "function" !== typeof value && "symbol" !== typeof value
	        ? domElement.setAttribute(key, "")
	        : domElement.removeAttribute(key);
	      break;
	    case "capture":
	    case "download":
	      true === value
	        ? domElement.setAttribute(key, "")
	        : false !== value &&
	            null != value &&
	            "function" !== typeof value &&
	            "symbol" !== typeof value
	          ? domElement.setAttribute(key, value)
	          : domElement.removeAttribute(key);
	      break;
	    case "cols":
	    case "rows":
	    case "size":
	    case "span":
	      null != value &&
	      "function" !== typeof value &&
	      "symbol" !== typeof value &&
	      !isNaN(value) &&
	      1 <= value
	        ? domElement.setAttribute(key, value)
	        : domElement.removeAttribute(key);
	      break;
	    case "rowSpan":
	    case "start":
	      null == value ||
	      "function" === typeof value ||
	      "symbol" === typeof value ||
	      isNaN(value)
	        ? domElement.removeAttribute(key)
	        : domElement.setAttribute(key, value);
	      break;
	    case "popover":
	      listenToNonDelegatedEvent("beforetoggle", domElement);
	      listenToNonDelegatedEvent("toggle", domElement);
	      setValueForAttribute(domElement, "popover", value);
	      break;
	    case "xlinkActuate":
	      setValueForNamespacedAttribute(
	        domElement,
	        "http://www.w3.org/1999/xlink",
	        "xlink:actuate",
	        value
	      );
	      break;
	    case "xlinkArcrole":
	      setValueForNamespacedAttribute(
	        domElement,
	        "http://www.w3.org/1999/xlink",
	        "xlink:arcrole",
	        value
	      );
	      break;
	    case "xlinkRole":
	      setValueForNamespacedAttribute(
	        domElement,
	        "http://www.w3.org/1999/xlink",
	        "xlink:role",
	        value
	      );
	      break;
	    case "xlinkShow":
	      setValueForNamespacedAttribute(
	        domElement,
	        "http://www.w3.org/1999/xlink",
	        "xlink:show",
	        value
	      );
	      break;
	    case "xlinkTitle":
	      setValueForNamespacedAttribute(
	        domElement,
	        "http://www.w3.org/1999/xlink",
	        "xlink:title",
	        value
	      );
	      break;
	    case "xlinkType":
	      setValueForNamespacedAttribute(
	        domElement,
	        "http://www.w3.org/1999/xlink",
	        "xlink:type",
	        value
	      );
	      break;
	    case "xmlBase":
	      setValueForNamespacedAttribute(
	        domElement,
	        "http://www.w3.org/XML/1998/namespace",
	        "xml:base",
	        value
	      );
	      break;
	    case "xmlLang":
	      setValueForNamespacedAttribute(
	        domElement,
	        "http://www.w3.org/XML/1998/namespace",
	        "xml:lang",
	        value
	      );
	      break;
	    case "xmlSpace":
	      setValueForNamespacedAttribute(
	        domElement,
	        "http://www.w3.org/XML/1998/namespace",
	        "xml:space",
	        value
	      );
	      break;
	    case "is":
	      setValueForAttribute(domElement, "is", value);
	      break;
	    case "innerText":
	    case "textContent":
	      break;
	    default:
	      if (
	        !(2 < key.length) ||
	        ("o" !== key[0] && "O" !== key[0]) ||
	        ("n" !== key[1] && "N" !== key[1])
	      )
	        (key = aliases.get(key) || key),
	          setValueForAttribute(domElement, key, value);
	  }
	}
	function setPropOnCustomElement(domElement, tag, key, value, props, prevValue) {
	  switch (key) {
	    case "style":
	      setValueForStyles(domElement, value, prevValue);
	      break;
	    case "dangerouslySetInnerHTML":
	      if (null != value) {
	        if ("object" !== typeof value || !("__html" in value))
	          throw Error(formatProdErrorMessage(61));
	        key = value.__html;
	        if (null != key) {
	          if (null != props.children) throw Error(formatProdErrorMessage(60));
	          domElement.innerHTML = key;
	        }
	      }
	      break;
	    case "children":
	      "string" === typeof value
	        ? setTextContent(domElement, value)
	        : ("number" === typeof value || "bigint" === typeof value) &&
	          setTextContent(domElement, "" + value);
	      break;
	    case "onScroll":
	      null != value && listenToNonDelegatedEvent("scroll", domElement);
	      break;
	    case "onScrollEnd":
	      null != value && listenToNonDelegatedEvent("scrollend", domElement);
	      break;
	    case "onClick":
	      null != value && (domElement.onclick = noop$1);
	      break;
	    case "suppressContentEditableWarning":
	    case "suppressHydrationWarning":
	    case "innerHTML":
	    case "ref":
	      break;
	    case "innerText":
	    case "textContent":
	      break;
	    default:
	      if (!registrationNameDependencies.hasOwnProperty(key))
	        a: {
	          if (
	            "o" === key[0] &&
	            "n" === key[1] &&
	            ((props = key.endsWith("Capture")),
	            (tag = key.slice(2, props ? key.length - 7 : void 0)),
	            (prevValue = domElement[internalPropsKey] || null),
	            (prevValue = null != prevValue ? prevValue[key] : null),
	            "function" === typeof prevValue &&
	              domElement.removeEventListener(tag, prevValue, props),
	            "function" === typeof value)
	          ) {
	            "function" !== typeof prevValue &&
	              null !== prevValue &&
	              (key in domElement
	                ? (domElement[key] = null)
	                : domElement.hasAttribute(key) &&
	                  domElement.removeAttribute(key));
	            domElement.addEventListener(tag, value, props);
	            break a;
	          }
	          key in domElement
	            ? (domElement[key] = value)
	            : true === value
	              ? domElement.setAttribute(key, "")
	              : setValueForAttribute(domElement, key, value);
	        }
	  }
	}
	function setInitialProperties(domElement, tag, props) {
	  switch (tag) {
	    case "div":
	    case "span":
	    case "svg":
	    case "path":
	    case "a":
	    case "g":
	    case "p":
	    case "li":
	      break;
	    case "img":
	      listenToNonDelegatedEvent("error", domElement);
	      listenToNonDelegatedEvent("load", domElement);
	      var hasSrc = false,
	        hasSrcSet = false,
	        propKey;
	      for (propKey in props)
	        if (props.hasOwnProperty(propKey)) {
	          var propValue = props[propKey];
	          if (null != propValue)
	            switch (propKey) {
	              case "src":
	                hasSrc = true;
	                break;
	              case "srcSet":
	                hasSrcSet = true;
	                break;
	              case "children":
	              case "dangerouslySetInnerHTML":
	                throw Error(formatProdErrorMessage(137, tag));
	              default:
	                setProp(domElement, tag, propKey, propValue, props, null);
	            }
	        }
	      hasSrcSet &&
	        setProp(domElement, tag, "srcSet", props.srcSet, props, null);
	      hasSrc && setProp(domElement, tag, "src", props.src, props, null);
	      return;
	    case "input":
	      listenToNonDelegatedEvent("invalid", domElement);
	      var defaultValue = (propKey = propValue = hasSrcSet = null),
	        checked = null,
	        defaultChecked = null;
	      for (hasSrc in props)
	        if (props.hasOwnProperty(hasSrc)) {
	          var propValue$186 = props[hasSrc];
	          if (null != propValue$186)
	            switch (hasSrc) {
	              case "name":
	                hasSrcSet = propValue$186;
	                break;
	              case "type":
	                propValue = propValue$186;
	                break;
	              case "checked":
	                checked = propValue$186;
	                break;
	              case "defaultChecked":
	                defaultChecked = propValue$186;
	                break;
	              case "value":
	                propKey = propValue$186;
	                break;
	              case "defaultValue":
	                defaultValue = propValue$186;
	                break;
	              case "children":
	              case "dangerouslySetInnerHTML":
	                if (null != propValue$186)
	                  throw Error(formatProdErrorMessage(137, tag));
	                break;
	              default:
	                setProp(domElement, tag, hasSrc, propValue$186, props, null);
	            }
	        }
	      initInput(
	        domElement,
	        propKey,
	        defaultValue,
	        checked,
	        defaultChecked,
	        propValue,
	        hasSrcSet,
	        false
	      );
	      track(domElement);
	      return;
	    case "select":
	      listenToNonDelegatedEvent("invalid", domElement);
	      hasSrc = propValue = propKey = null;
	      for (hasSrcSet in props)
	        if (
	          props.hasOwnProperty(hasSrcSet) &&
	          ((defaultValue = props[hasSrcSet]), null != defaultValue)
	        )
	          switch (hasSrcSet) {
	            case "value":
	              propKey = defaultValue;
	              break;
	            case "defaultValue":
	              propValue = defaultValue;
	              break;
	            case "multiple":
	              hasSrc = defaultValue;
	            default:
	              setProp(domElement, tag, hasSrcSet, defaultValue, props, null);
	          }
	      tag = propKey;
	      props = propValue;
	      domElement.multiple = !!hasSrc;
	      null != tag
	        ? updateOptions(domElement, !!hasSrc, tag, false)
	        : null != props && updateOptions(domElement, !!hasSrc, props, true);
	      return;
	    case "textarea":
	      listenToNonDelegatedEvent("invalid", domElement);
	      propKey = hasSrcSet = hasSrc = null;
	      for (propValue in props)
	        if (
	          props.hasOwnProperty(propValue) &&
	          ((defaultValue = props[propValue]), null != defaultValue)
	        )
	          switch (propValue) {
	            case "value":
	              hasSrc = defaultValue;
	              break;
	            case "defaultValue":
	              hasSrcSet = defaultValue;
	              break;
	            case "children":
	              propKey = defaultValue;
	              break;
	            case "dangerouslySetInnerHTML":
	              if (null != defaultValue) throw Error(formatProdErrorMessage(91));
	              break;
	            default:
	              setProp(domElement, tag, propValue, defaultValue, props, null);
	          }
	      initTextarea(domElement, hasSrc, hasSrcSet, propKey);
	      track(domElement);
	      return;
	    case "option":
	      for (checked in props)
	        if (
	          props.hasOwnProperty(checked) &&
	          ((hasSrc = props[checked]), null != hasSrc)
	        )
	          switch (checked) {
	            case "selected":
	              domElement.selected =
	                hasSrc &&
	                "function" !== typeof hasSrc &&
	                "symbol" !== typeof hasSrc;
	              break;
	            default:
	              setProp(domElement, tag, checked, hasSrc, props, null);
	          }
	      return;
	    case "dialog":
	      listenToNonDelegatedEvent("cancel", domElement);
	      listenToNonDelegatedEvent("close", domElement);
	      break;
	    case "iframe":
	    case "object":
	      listenToNonDelegatedEvent("load", domElement);
	      break;
	    case "video":
	    case "audio":
	      for (hasSrc = 0; hasSrc < mediaEventTypes.length; hasSrc++)
	        listenToNonDelegatedEvent(mediaEventTypes[hasSrc], domElement);
	      break;
	    case "image":
	      listenToNonDelegatedEvent("error", domElement);
	      listenToNonDelegatedEvent("load", domElement);
	      break;
	    case "details":
	      listenToNonDelegatedEvent("toggle", domElement);
	      break;
	    case "embed":
	    case "source":
	    case "link":
	      listenToNonDelegatedEvent("error", domElement),
	        listenToNonDelegatedEvent("load", domElement);
	    case "area":
	    case "base":
	    case "br":
	    case "col":
	    case "hr":
	    case "keygen":
	    case "meta":
	    case "param":
	    case "track":
	    case "wbr":
	    case "menuitem":
	      for (defaultChecked in props)
	        if (
	          props.hasOwnProperty(defaultChecked) &&
	          ((hasSrc = props[defaultChecked]), null != hasSrc)
	        )
	          switch (defaultChecked) {
	            case "children":
	            case "dangerouslySetInnerHTML":
	              throw Error(formatProdErrorMessage(137, tag));
	            default:
	              setProp(domElement, tag, defaultChecked, hasSrc, props, null);
	          }
	      return;
	    default:
	      if (isCustomElement(tag)) {
	        for (propValue$186 in props)
	          props.hasOwnProperty(propValue$186) &&
	            ((hasSrc = props[propValue$186]),
	            void 0 !== hasSrc &&
	              setPropOnCustomElement(
	                domElement,
	                tag,
	                propValue$186,
	                hasSrc,
	                props,
	                void 0
	              ));
	        return;
	      }
	  }
	  for (defaultValue in props)
	    props.hasOwnProperty(defaultValue) &&
	      ((hasSrc = props[defaultValue]),
	      null != hasSrc &&
	        setProp(domElement, tag, defaultValue, hasSrc, props, null));
	}
	function updateProperties(domElement, tag, lastProps, nextProps) {
	  switch (tag) {
	    case "div":
	    case "span":
	    case "svg":
	    case "path":
	    case "a":
	    case "g":
	    case "p":
	    case "li":
	      break;
	    case "input":
	      var name = null,
	        type = null,
	        value = null,
	        defaultValue = null,
	        lastDefaultValue = null,
	        checked = null,
	        defaultChecked = null;
	      for (propKey in lastProps) {
	        var lastProp = lastProps[propKey];
	        if (lastProps.hasOwnProperty(propKey) && null != lastProp)
	          switch (propKey) {
	            case "checked":
	              break;
	            case "value":
	              break;
	            case "defaultValue":
	              lastDefaultValue = lastProp;
	            default:
	              nextProps.hasOwnProperty(propKey) ||
	                setProp(domElement, tag, propKey, null, nextProps, lastProp);
	          }
	      }
	      for (var propKey$203 in nextProps) {
	        var propKey = nextProps[propKey$203];
	        lastProp = lastProps[propKey$203];
	        if (
	          nextProps.hasOwnProperty(propKey$203) &&
	          (null != propKey || null != lastProp)
	        )
	          switch (propKey$203) {
	            case "type":
	              type = propKey;
	              break;
	            case "name":
	              name = propKey;
	              break;
	            case "checked":
	              checked = propKey;
	              break;
	            case "defaultChecked":
	              defaultChecked = propKey;
	              break;
	            case "value":
	              value = propKey;
	              break;
	            case "defaultValue":
	              defaultValue = propKey;
	              break;
	            case "children":
	            case "dangerouslySetInnerHTML":
	              if (null != propKey)
	                throw Error(formatProdErrorMessage(137, tag));
	              break;
	            default:
	              propKey !== lastProp &&
	                setProp(
	                  domElement,
	                  tag,
	                  propKey$203,
	                  propKey,
	                  nextProps,
	                  lastProp
	                );
	          }
	      }
	      updateInput(
	        domElement,
	        value,
	        defaultValue,
	        lastDefaultValue,
	        checked,
	        defaultChecked,
	        type,
	        name
	      );
	      return;
	    case "select":
	      propKey = value = defaultValue = propKey$203 = null;
	      for (type in lastProps)
	        if (
	          ((lastDefaultValue = lastProps[type]),
	          lastProps.hasOwnProperty(type) && null != lastDefaultValue)
	        )
	          switch (type) {
	            case "value":
	              break;
	            case "multiple":
	              propKey = lastDefaultValue;
	            default:
	              nextProps.hasOwnProperty(type) ||
	                setProp(
	                  domElement,
	                  tag,
	                  type,
	                  null,
	                  nextProps,
	                  lastDefaultValue
	                );
	          }
	      for (name in nextProps)
	        if (
	          ((type = nextProps[name]),
	          (lastDefaultValue = lastProps[name]),
	          nextProps.hasOwnProperty(name) &&
	            (null != type || null != lastDefaultValue))
	        )
	          switch (name) {
	            case "value":
	              propKey$203 = type;
	              break;
	            case "defaultValue":
	              defaultValue = type;
	              break;
	            case "multiple":
	              value = type;
	            default:
	              type !== lastDefaultValue &&
	                setProp(
	                  domElement,
	                  tag,
	                  name,
	                  type,
	                  nextProps,
	                  lastDefaultValue
	                );
	          }
	      tag = defaultValue;
	      lastProps = value;
	      nextProps = propKey;
	      null != propKey$203
	        ? updateOptions(domElement, !!lastProps, propKey$203, false)
	        : !!nextProps !== !!lastProps &&
	          (null != tag
	            ? updateOptions(domElement, !!lastProps, tag, true)
	            : updateOptions(domElement, !!lastProps, lastProps ? [] : "", false));
	      return;
	    case "textarea":
	      propKey = propKey$203 = null;
	      for (defaultValue in lastProps)
	        if (
	          ((name = lastProps[defaultValue]),
	          lastProps.hasOwnProperty(defaultValue) &&
	            null != name &&
	            !nextProps.hasOwnProperty(defaultValue))
	        )
	          switch (defaultValue) {
	            case "value":
	              break;
	            case "children":
	              break;
	            default:
	              setProp(domElement, tag, defaultValue, null, nextProps, name);
	          }
	      for (value in nextProps)
	        if (
	          ((name = nextProps[value]),
	          (type = lastProps[value]),
	          nextProps.hasOwnProperty(value) && (null != name || null != type))
	        )
	          switch (value) {
	            case "value":
	              propKey$203 = name;
	              break;
	            case "defaultValue":
	              propKey = name;
	              break;
	            case "children":
	              break;
	            case "dangerouslySetInnerHTML":
	              if (null != name) throw Error(formatProdErrorMessage(91));
	              break;
	            default:
	              name !== type &&
	                setProp(domElement, tag, value, name, nextProps, type);
	          }
	      updateTextarea(domElement, propKey$203, propKey);
	      return;
	    case "option":
	      for (var propKey$219 in lastProps)
	        if (
	          ((propKey$203 = lastProps[propKey$219]),
	          lastProps.hasOwnProperty(propKey$219) &&
	            null != propKey$203 &&
	            !nextProps.hasOwnProperty(propKey$219))
	        )
	          switch (propKey$219) {
	            case "selected":
	              domElement.selected = false;
	              break;
	            default:
	              setProp(
	                domElement,
	                tag,
	                propKey$219,
	                null,
	                nextProps,
	                propKey$203
	              );
	          }
	      for (lastDefaultValue in nextProps)
	        if (
	          ((propKey$203 = nextProps[lastDefaultValue]),
	          (propKey = lastProps[lastDefaultValue]),
	          nextProps.hasOwnProperty(lastDefaultValue) &&
	            propKey$203 !== propKey &&
	            (null != propKey$203 || null != propKey))
	        )
	          switch (lastDefaultValue) {
	            case "selected":
	              domElement.selected =
	                propKey$203 &&
	                "function" !== typeof propKey$203 &&
	                "symbol" !== typeof propKey$203;
	              break;
	            default:
	              setProp(
	                domElement,
	                tag,
	                lastDefaultValue,
	                propKey$203,
	                nextProps,
	                propKey
	              );
	          }
	      return;
	    case "img":
	    case "link":
	    case "area":
	    case "base":
	    case "br":
	    case "col":
	    case "embed":
	    case "hr":
	    case "keygen":
	    case "meta":
	    case "param":
	    case "source":
	    case "track":
	    case "wbr":
	    case "menuitem":
	      for (var propKey$224 in lastProps)
	        (propKey$203 = lastProps[propKey$224]),
	          lastProps.hasOwnProperty(propKey$224) &&
	            null != propKey$203 &&
	            !nextProps.hasOwnProperty(propKey$224) &&
	            setProp(domElement, tag, propKey$224, null, nextProps, propKey$203);
	      for (checked in nextProps)
	        if (
	          ((propKey$203 = nextProps[checked]),
	          (propKey = lastProps[checked]),
	          nextProps.hasOwnProperty(checked) &&
	            propKey$203 !== propKey &&
	            (null != propKey$203 || null != propKey))
	        )
	          switch (checked) {
	            case "children":
	            case "dangerouslySetInnerHTML":
	              if (null != propKey$203)
	                throw Error(formatProdErrorMessage(137, tag));
	              break;
	            default:
	              setProp(
	                domElement,
	                tag,
	                checked,
	                propKey$203,
	                nextProps,
	                propKey
	              );
	          }
	      return;
	    default:
	      if (isCustomElement(tag)) {
	        for (var propKey$229 in lastProps)
	          (propKey$203 = lastProps[propKey$229]),
	            lastProps.hasOwnProperty(propKey$229) &&
	              void 0 !== propKey$203 &&
	              !nextProps.hasOwnProperty(propKey$229) &&
	              setPropOnCustomElement(
	                domElement,
	                tag,
	                propKey$229,
	                void 0,
	                nextProps,
	                propKey$203
	              );
	        for (defaultChecked in nextProps)
	          (propKey$203 = nextProps[defaultChecked]),
	            (propKey = lastProps[defaultChecked]),
	            !nextProps.hasOwnProperty(defaultChecked) ||
	              propKey$203 === propKey ||
	              (void 0 === propKey$203 && void 0 === propKey) ||
	              setPropOnCustomElement(
	                domElement,
	                tag,
	                defaultChecked,
	                propKey$203,
	                nextProps,
	                propKey
	              );
	        return;
	      }
	  }
	  for (var propKey$234 in lastProps)
	    (propKey$203 = lastProps[propKey$234]),
	      lastProps.hasOwnProperty(propKey$234) &&
	        null != propKey$203 &&
	        !nextProps.hasOwnProperty(propKey$234) &&
	        setProp(domElement, tag, propKey$234, null, nextProps, propKey$203);
	  for (lastProp in nextProps)
	    (propKey$203 = nextProps[lastProp]),
	      (propKey = lastProps[lastProp]),
	      !nextProps.hasOwnProperty(lastProp) ||
	        propKey$203 === propKey ||
	        (null == propKey$203 && null == propKey) ||
	        setProp(domElement, tag, lastProp, propKey$203, nextProps, propKey);
	}
	var eventsEnabled = null,
	  selectionInformation = null;
	function getOwnerDocumentFromRootContainer(rootContainerElement) {
	  return 9 === rootContainerElement.nodeType
	    ? rootContainerElement
	    : rootContainerElement.ownerDocument;
	}
	function getOwnHostContext(namespaceURI) {
	  switch (namespaceURI) {
	    case "http://www.w3.org/2000/svg":
	      return 1;
	    case "http://www.w3.org/1998/Math/MathML":
	      return 2;
	    default:
	      return 0;
	  }
	}
	function getChildHostContextProd(parentNamespace, type) {
	  if (0 === parentNamespace)
	    switch (type) {
	      case "svg":
	        return 1;
	      case "math":
	        return 2;
	      default:
	        return 0;
	    }
	  return 1 === parentNamespace && "foreignObject" === type
	    ? 0
	    : parentNamespace;
	}
	function shouldSetTextContent(type, props) {
	  return (
	    "textarea" === type ||
	    "noscript" === type ||
	    "string" === typeof props.children ||
	    "number" === typeof props.children ||
	    "bigint" === typeof props.children ||
	    ("object" === typeof props.dangerouslySetInnerHTML &&
	      null !== props.dangerouslySetInnerHTML &&
	      null != props.dangerouslySetInnerHTML.__html)
	  );
	}
	var currentPopstateTransitionEvent = null;
	function shouldAttemptEagerTransition() {
	  var event = window.event;
	  if (event && "popstate" === event.type) {
	    if (event === currentPopstateTransitionEvent) return false;
	    currentPopstateTransitionEvent = event;
	    return true;
	  }
	  currentPopstateTransitionEvent = null;
	  return false;
	}
	var scheduleTimeout = "function" === typeof setTimeout ? setTimeout : void 0,
	  cancelTimeout = "function" === typeof clearTimeout ? clearTimeout : void 0,
	  localPromise = "function" === typeof Promise ? Promise : void 0,
	  scheduleMicrotask =
	    "function" === typeof queueMicrotask
	      ? queueMicrotask
	      : "undefined" !== typeof localPromise
	        ? function (callback) {
	            return localPromise
	              .resolve(null)
	              .then(callback)
	              .catch(handleErrorInNextTick);
	          }
	        : scheduleTimeout;
	function handleErrorInNextTick(error) {
	  setTimeout(function () {
	    throw error;
	  });
	}
	function clearSuspenseBoundary(parentInstance, suspenseInstance) {
	  var node = suspenseInstance,
	    depth = 0;
	  do {
	    var nextNode = node.nextSibling;
	    parentInstance.removeChild(node);
	    if (nextNode && 8 === nextNode.nodeType)
	      if (((node = nextNode.data), "/$" === node)) {
	        if (0 === depth) {
	          parentInstance.removeChild(nextNode);
	          retryIfBlockedOn(suspenseInstance);
	          return;
	        }
	        depth--;
	      } else ("$" !== node && "$?" !== node && "$!" !== node) || depth++;
	    node = nextNode;
	  } while (node);
	  retryIfBlockedOn(suspenseInstance);
	}
	function clearContainerSparingly(container) {
	  var nextNode = container.firstChild;
	  nextNode && 10 === nextNode.nodeType && (nextNode = nextNode.nextSibling);
	  for (; nextNode; ) {
	    var node = nextNode;
	    nextNode = nextNode.nextSibling;
	    switch (node.nodeName) {
	      case "HTML":
	      case "HEAD":
	      case "BODY":
	        clearContainerSparingly(node);
	        detachDeletedInstance(node);
	        continue;
	      case "SCRIPT":
	      case "STYLE":
	        continue;
	      case "LINK":
	        if ("stylesheet" === node.rel.toLowerCase()) continue;
	    }
	    container.removeChild(node);
	  }
	}
	function canHydrateInstance(instance, type, props, inRootOrSingleton) {
	  for (; 1 === instance.nodeType; ) {
	    var anyProps = props;
	    if (instance.nodeName.toLowerCase() !== type.toLowerCase()) {
	      if (
	        !inRootOrSingleton &&
	        ("INPUT" !== instance.nodeName || "hidden" !== instance.type)
	      )
	        break;
	    } else if (!inRootOrSingleton)
	      if ("input" === type && "hidden" === instance.type) {
	        var name = null == anyProps.name ? null : "" + anyProps.name;
	        if (
	          "hidden" === anyProps.type &&
	          instance.getAttribute("name") === name
	        )
	          return instance;
	      } else return instance;
	    else if (!instance[internalHoistableMarker])
	      switch (type) {
	        case "meta":
	          if (!instance.hasAttribute("itemprop")) break;
	          return instance;
	        case "link":
	          name = instance.getAttribute("rel");
	          if ("stylesheet" === name && instance.hasAttribute("data-precedence"))
	            break;
	          else if (
	            name !== anyProps.rel ||
	            instance.getAttribute("href") !==
	              (null == anyProps.href ? null : anyProps.href) ||
	            instance.getAttribute("crossorigin") !==
	              (null == anyProps.crossOrigin ? null : anyProps.crossOrigin) ||
	            instance.getAttribute("title") !==
	              (null == anyProps.title ? null : anyProps.title)
	          )
	            break;
	          return instance;
	        case "style":
	          if (instance.hasAttribute("data-precedence")) break;
	          return instance;
	        case "script":
	          name = instance.getAttribute("src");
	          if (
	            (name !== (null == anyProps.src ? null : anyProps.src) ||
	              instance.getAttribute("type") !==
	                (null == anyProps.type ? null : anyProps.type) ||
	              instance.getAttribute("crossorigin") !==
	                (null == anyProps.crossOrigin ? null : anyProps.crossOrigin)) &&
	            name &&
	            instance.hasAttribute("async") &&
	            !instance.hasAttribute("itemprop")
	          )
	            break;
	          return instance;
	        default:
	          return instance;
	      }
	    instance = getNextHydratable(instance.nextSibling);
	    if (null === instance) break;
	  }
	  return null;
	}
	function canHydrateTextInstance(instance, text, inRootOrSingleton) {
	  if ("" === text) return null;
	  for (; 3 !== instance.nodeType; ) {
	    if (
	      (1 !== instance.nodeType ||
	        "INPUT" !== instance.nodeName ||
	        "hidden" !== instance.type) &&
	      !inRootOrSingleton
	    )
	      return null;
	    instance = getNextHydratable(instance.nextSibling);
	    if (null === instance) return null;
	  }
	  return instance;
	}
	function getNextHydratable(node) {
	  for (; null != node; node = node.nextSibling) {
	    var nodeType = node.nodeType;
	    if (1 === nodeType || 3 === nodeType) break;
	    if (8 === nodeType) {
	      nodeType = node.data;
	      if (
	        "$" === nodeType ||
	        "$!" === nodeType ||
	        "$?" === nodeType ||
	        "F!" === nodeType ||
	        "F" === nodeType
	      )
	        break;
	      if ("/$" === nodeType) return null;
	    }
	  }
	  return node;
	}
	function getParentSuspenseInstance(targetInstance) {
	  targetInstance = targetInstance.previousSibling;
	  for (var depth = 0; targetInstance; ) {
	    if (8 === targetInstance.nodeType) {
	      var data = targetInstance.data;
	      if ("$" === data || "$!" === data || "$?" === data) {
	        if (0 === depth) return targetInstance;
	        depth--;
	      } else "/$" === data && depth++;
	    }
	    targetInstance = targetInstance.previousSibling;
	  }
	  return null;
	}
	function resolveSingletonInstance(type, props, rootContainerInstance) {
	  props = getOwnerDocumentFromRootContainer(rootContainerInstance);
	  switch (type) {
	    case "html":
	      type = props.documentElement;
	      if (!type) throw Error(formatProdErrorMessage(452));
	      return type;
	    case "head":
	      type = props.head;
	      if (!type) throw Error(formatProdErrorMessage(453));
	      return type;
	    case "body":
	      type = props.body;
	      if (!type) throw Error(formatProdErrorMessage(454));
	      return type;
	    default:
	      throw Error(formatProdErrorMessage(451));
	  }
	}
	var preloadPropsMap = new Map(),
	  preconnectsSet = new Set();
	function getHoistableRoot(container) {
	  return "function" === typeof container.getRootNode
	    ? container.getRootNode()
	    : container.ownerDocument;
	}
	var previousDispatcher = ReactDOMSharedInternals.d;
	ReactDOMSharedInternals.d = {
	  f: flushSyncWork,
	  r: requestFormReset,
	  D: prefetchDNS,
	  C: preconnect,
	  L: preload,
	  m: preloadModule,
	  X: preinitScript,
	  S: preinitStyle,
	  M: preinitModuleScript
	};
	function flushSyncWork() {
	  var previousWasRendering = previousDispatcher.f(),
	    wasRendering = flushSyncWork$1();
	  return previousWasRendering || wasRendering;
	}
	function requestFormReset(form) {
	  var formInst = getInstanceFromNode(form);
	  null !== formInst && 5 === formInst.tag && "form" === formInst.type
	    ? requestFormReset$1(formInst)
	    : previousDispatcher.r(form);
	}
	var globalDocument = "undefined" === typeof document ? null : document;
	function preconnectAs(rel, href, crossOrigin) {
	  var ownerDocument = globalDocument;
	  if (ownerDocument && "string" === typeof href && href) {
	    var limitedEscapedHref =
	      escapeSelectorAttributeValueInsideDoubleQuotes(href);
	    limitedEscapedHref =
	      'link[rel="' + rel + '"][href="' + limitedEscapedHref + '"]';
	    "string" === typeof crossOrigin &&
	      (limitedEscapedHref += '[crossorigin="' + crossOrigin + '"]');
	    preconnectsSet.has(limitedEscapedHref) ||
	      (preconnectsSet.add(limitedEscapedHref),
	      (rel = { rel: rel, crossOrigin: crossOrigin, href: href }),
	      null === ownerDocument.querySelector(limitedEscapedHref) &&
	        ((href = ownerDocument.createElement("link")),
	        setInitialProperties(href, "link", rel),
	        markNodeAsHoistable(href),
	        ownerDocument.head.appendChild(href)));
	  }
	}
	function prefetchDNS(href) {
	  previousDispatcher.D(href);
	  preconnectAs("dns-prefetch", href, null);
	}
	function preconnect(href, crossOrigin) {
	  previousDispatcher.C(href, crossOrigin);
	  preconnectAs("preconnect", href, crossOrigin);
	}
	function preload(href, as, options) {
	  previousDispatcher.L(href, as, options);
	  var ownerDocument = globalDocument;
	  if (ownerDocument && href && as) {
	    var preloadSelector =
	      'link[rel="preload"][as="' +
	      escapeSelectorAttributeValueInsideDoubleQuotes(as) +
	      '"]';
	    "image" === as
	      ? options && options.imageSrcSet
	        ? ((preloadSelector +=
	            '[imagesrcset="' +
	            escapeSelectorAttributeValueInsideDoubleQuotes(
	              options.imageSrcSet
	            ) +
	            '"]'),
	          "string" === typeof options.imageSizes &&
	            (preloadSelector +=
	              '[imagesizes="' +
	              escapeSelectorAttributeValueInsideDoubleQuotes(
	                options.imageSizes
	              ) +
	              '"]'))
	        : (preloadSelector +=
	            '[href="' +
	            escapeSelectorAttributeValueInsideDoubleQuotes(href) +
	            '"]')
	      : (preloadSelector +=
	          '[href="' +
	          escapeSelectorAttributeValueInsideDoubleQuotes(href) +
	          '"]');
	    var key = preloadSelector;
	    switch (as) {
	      case "style":
	        key = getStyleKey(href);
	        break;
	      case "script":
	        key = getScriptKey(href);
	    }
	    preloadPropsMap.has(key) ||
	      ((href = assign(
	        {
	          rel: "preload",
	          href:
	            "image" === as && options && options.imageSrcSet ? void 0 : href,
	          as: as
	        },
	        options
	      )),
	      preloadPropsMap.set(key, href),
	      null !== ownerDocument.querySelector(preloadSelector) ||
	        ("style" === as &&
	          ownerDocument.querySelector(getStylesheetSelectorFromKey(key))) ||
	        ("script" === as &&
	          ownerDocument.querySelector(getScriptSelectorFromKey(key))) ||
	        ((as = ownerDocument.createElement("link")),
	        setInitialProperties(as, "link", href),
	        markNodeAsHoistable(as),
	        ownerDocument.head.appendChild(as)));
	  }
	}
	function preloadModule(href, options) {
	  previousDispatcher.m(href, options);
	  var ownerDocument = globalDocument;
	  if (ownerDocument && href) {
	    var as = options && "string" === typeof options.as ? options.as : "script",
	      preloadSelector =
	        'link[rel="modulepreload"][as="' +
	        escapeSelectorAttributeValueInsideDoubleQuotes(as) +
	        '"][href="' +
	        escapeSelectorAttributeValueInsideDoubleQuotes(href) +
	        '"]',
	      key = preloadSelector;
	    switch (as) {
	      case "audioworklet":
	      case "paintworklet":
	      case "serviceworker":
	      case "sharedworker":
	      case "worker":
	      case "script":
	        key = getScriptKey(href);
	    }
	    if (
	      !preloadPropsMap.has(key) &&
	      ((href = assign({ rel: "modulepreload", href: href }, options)),
	      preloadPropsMap.set(key, href),
	      null === ownerDocument.querySelector(preloadSelector))
	    ) {
	      switch (as) {
	        case "audioworklet":
	        case "paintworklet":
	        case "serviceworker":
	        case "sharedworker":
	        case "worker":
	        case "script":
	          if (ownerDocument.querySelector(getScriptSelectorFromKey(key)))
	            return;
	      }
	      as = ownerDocument.createElement("link");
	      setInitialProperties(as, "link", href);
	      markNodeAsHoistable(as);
	      ownerDocument.head.appendChild(as);
	    }
	  }
	}
	function preinitStyle(href, precedence, options) {
	  previousDispatcher.S(href, precedence, options);
	  var ownerDocument = globalDocument;
	  if (ownerDocument && href) {
	    var styles = getResourcesFromRoot(ownerDocument).hoistableStyles,
	      key = getStyleKey(href);
	    precedence = precedence || "default";
	    var resource = styles.get(key);
	    if (!resource) {
	      var state = { loading: 0, preload: null };
	      if (
	        (resource = ownerDocument.querySelector(
	          getStylesheetSelectorFromKey(key)
	        ))
	      )
	        state.loading = 5;
	      else {
	        href = assign(
	          { rel: "stylesheet", href: href, "data-precedence": precedence },
	          options
	        );
	        (options = preloadPropsMap.get(key)) &&
	          adoptPreloadPropsForStylesheet(href, options);
	        var link = (resource = ownerDocument.createElement("link"));
	        markNodeAsHoistable(link);
	        setInitialProperties(link, "link", href);
	        link._p = new Promise(function (resolve, reject) {
	          link.onload = resolve;
	          link.onerror = reject;
	        });
	        link.addEventListener("load", function () {
	          state.loading |= 1;
	        });
	        link.addEventListener("error", function () {
	          state.loading |= 2;
	        });
	        state.loading |= 4;
	        insertStylesheet(resource, precedence, ownerDocument);
	      }
	      resource = {
	        type: "stylesheet",
	        instance: resource,
	        count: 1,
	        state: state
	      };
	      styles.set(key, resource);
	    }
	  }
	}
	function preinitScript(src, options) {
	  previousDispatcher.X(src, options);
	  var ownerDocument = globalDocument;
	  if (ownerDocument && src) {
	    var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts,
	      key = getScriptKey(src),
	      resource = scripts.get(key);
	    resource ||
	      ((resource = ownerDocument.querySelector(getScriptSelectorFromKey(key))),
	      resource ||
	        ((src = assign({ src: src, async: true }, options)),
	        (options = preloadPropsMap.get(key)) &&
	          adoptPreloadPropsForScript(src, options),
	        (resource = ownerDocument.createElement("script")),
	        markNodeAsHoistable(resource),
	        setInitialProperties(resource, "link", src),
	        ownerDocument.head.appendChild(resource)),
	      (resource = {
	        type: "script",
	        instance: resource,
	        count: 1,
	        state: null
	      }),
	      scripts.set(key, resource));
	  }
	}
	function preinitModuleScript(src, options) {
	  previousDispatcher.M(src, options);
	  var ownerDocument = globalDocument;
	  if (ownerDocument && src) {
	    var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts,
	      key = getScriptKey(src),
	      resource = scripts.get(key);
	    resource ||
	      ((resource = ownerDocument.querySelector(getScriptSelectorFromKey(key))),
	      resource ||
	        ((src = assign({ src: src, async: true, type: "module" }, options)),
	        (options = preloadPropsMap.get(key)) &&
	          adoptPreloadPropsForScript(src, options),
	        (resource = ownerDocument.createElement("script")),
	        markNodeAsHoistable(resource),
	        setInitialProperties(resource, "link", src),
	        ownerDocument.head.appendChild(resource)),
	      (resource = {
	        type: "script",
	        instance: resource,
	        count: 1,
	        state: null
	      }),
	      scripts.set(key, resource));
	  }
	}
	function getResource(type, currentProps, pendingProps, currentResource) {
	  var JSCompiler_inline_result = (JSCompiler_inline_result =
	    rootInstanceStackCursor.current)
	    ? getHoistableRoot(JSCompiler_inline_result)
	    : null;
	  if (!JSCompiler_inline_result) throw Error(formatProdErrorMessage(446));
	  switch (type) {
	    case "meta":
	    case "title":
	      return null;
	    case "style":
	      return "string" === typeof pendingProps.precedence &&
	        "string" === typeof pendingProps.href
	        ? ((currentProps = getStyleKey(pendingProps.href)),
	          (pendingProps = getResourcesFromRoot(
	            JSCompiler_inline_result
	          ).hoistableStyles),
	          (currentResource = pendingProps.get(currentProps)),
	          currentResource ||
	            ((currentResource = {
	              type: "style",
	              instance: null,
	              count: 0,
	              state: null
	            }),
	            pendingProps.set(currentProps, currentResource)),
	          currentResource)
	        : { type: "void", instance: null, count: 0, state: null };
	    case "link":
	      if (
	        "stylesheet" === pendingProps.rel &&
	        "string" === typeof pendingProps.href &&
	        "string" === typeof pendingProps.precedence
	      ) {
	        type = getStyleKey(pendingProps.href);
	        var styles$242 = getResourcesFromRoot(
	            JSCompiler_inline_result
	          ).hoistableStyles,
	          resource$243 = styles$242.get(type);
	        resource$243 ||
	          ((JSCompiler_inline_result =
	            JSCompiler_inline_result.ownerDocument || JSCompiler_inline_result),
	          (resource$243 = {
	            type: "stylesheet",
	            instance: null,
	            count: 0,
	            state: { loading: 0, preload: null }
	          }),
	          styles$242.set(type, resource$243),
	          (styles$242 = JSCompiler_inline_result.querySelector(
	            getStylesheetSelectorFromKey(type)
	          )) &&
	            !styles$242._p &&
	            ((resource$243.instance = styles$242),
	            (resource$243.state.loading = 5)),
	          preloadPropsMap.has(type) ||
	            ((pendingProps = {
	              rel: "preload",
	              as: "style",
	              href: pendingProps.href,
	              crossOrigin: pendingProps.crossOrigin,
	              integrity: pendingProps.integrity,
	              media: pendingProps.media,
	              hrefLang: pendingProps.hrefLang,
	              referrerPolicy: pendingProps.referrerPolicy
	            }),
	            preloadPropsMap.set(type, pendingProps),
	            styles$242 ||
	              preloadStylesheet(
	                JSCompiler_inline_result,
	                type,
	                pendingProps,
	                resource$243.state
	              )));
	        if (currentProps && null === currentResource)
	          throw Error(formatProdErrorMessage(528, ""));
	        return resource$243;
	      }
	      if (currentProps && null !== currentResource)
	        throw Error(formatProdErrorMessage(529, ""));
	      return null;
	    case "script":
	      return (
	        (currentProps = pendingProps.async),
	        (pendingProps = pendingProps.src),
	        "string" === typeof pendingProps &&
	        currentProps &&
	        "function" !== typeof currentProps &&
	        "symbol" !== typeof currentProps
	          ? ((currentProps = getScriptKey(pendingProps)),
	            (pendingProps = getResourcesFromRoot(
	              JSCompiler_inline_result
	            ).hoistableScripts),
	            (currentResource = pendingProps.get(currentProps)),
	            currentResource ||
	              ((currentResource = {
	                type: "script",
	                instance: null,
	                count: 0,
	                state: null
	              }),
	              pendingProps.set(currentProps, currentResource)),
	            currentResource)
	          : { type: "void", instance: null, count: 0, state: null }
	      );
	    default:
	      throw Error(formatProdErrorMessage(444, type));
	  }
	}
	function getStyleKey(href) {
	  return 'href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"';
	}
	function getStylesheetSelectorFromKey(key) {
	  return 'link[rel="stylesheet"][' + key + "]";
	}
	function stylesheetPropsFromRawProps(rawProps) {
	  return assign({}, rawProps, {
	    "data-precedence": rawProps.precedence,
	    precedence: null
	  });
	}
	function preloadStylesheet(ownerDocument, key, preloadProps, state) {
	  ownerDocument.querySelector('link[rel="preload"][as="style"][' + key + "]")
	    ? (state.loading = 1)
	    : ((key = ownerDocument.createElement("link")),
	      (state.preload = key),
	      key.addEventListener("load", function () {
	        return (state.loading |= 1);
	      }),
	      key.addEventListener("error", function () {
	        return (state.loading |= 2);
	      }),
	      setInitialProperties(key, "link", preloadProps),
	      markNodeAsHoistable(key),
	      ownerDocument.head.appendChild(key));
	}
	function getScriptKey(src) {
	  return '[src="' + escapeSelectorAttributeValueInsideDoubleQuotes(src) + '"]';
	}
	function getScriptSelectorFromKey(key) {
	  return "script[async]" + key;
	}
	function acquireResource(hoistableRoot, resource, props) {
	  resource.count++;
	  if (null === resource.instance)
	    switch (resource.type) {
	      case "style":
	        var instance = hoistableRoot.querySelector(
	          'style[data-href~="' +
	            escapeSelectorAttributeValueInsideDoubleQuotes(props.href) +
	            '"]'
	        );
	        if (instance)
	          return (
	            (resource.instance = instance),
	            markNodeAsHoistable(instance),
	            instance
	          );
	        var styleProps = assign({}, props, {
	          "data-href": props.href,
	          "data-precedence": props.precedence,
	          href: null,
	          precedence: null
	        });
	        instance = (hoistableRoot.ownerDocument || hoistableRoot).createElement(
	          "style"
	        );
	        markNodeAsHoistable(instance);
	        setInitialProperties(instance, "style", styleProps);
	        insertStylesheet(instance, props.precedence, hoistableRoot);
	        return (resource.instance = instance);
	      case "stylesheet":
	        styleProps = getStyleKey(props.href);
	        var instance$248 = hoistableRoot.querySelector(
	          getStylesheetSelectorFromKey(styleProps)
	        );
	        if (instance$248)
	          return (
	            (resource.state.loading |= 4),
	            (resource.instance = instance$248),
	            markNodeAsHoistable(instance$248),
	            instance$248
	          );
	        instance = stylesheetPropsFromRawProps(props);
	        (styleProps = preloadPropsMap.get(styleProps)) &&
	          adoptPreloadPropsForStylesheet(instance, styleProps);
	        instance$248 = (
	          hoistableRoot.ownerDocument || hoistableRoot
	        ).createElement("link");
	        markNodeAsHoistable(instance$248);
	        var linkInstance = instance$248;
	        linkInstance._p = new Promise(function (resolve, reject) {
	          linkInstance.onload = resolve;
	          linkInstance.onerror = reject;
	        });
	        setInitialProperties(instance$248, "link", instance);
	        resource.state.loading |= 4;
	        insertStylesheet(instance$248, props.precedence, hoistableRoot);
	        return (resource.instance = instance$248);
	      case "script":
	        instance$248 = getScriptKey(props.src);
	        if (
	          (styleProps = hoistableRoot.querySelector(
	            getScriptSelectorFromKey(instance$248)
	          ))
	        )
	          return (
	            (resource.instance = styleProps),
	            markNodeAsHoistable(styleProps),
	            styleProps
	          );
	        instance = props;
	        if ((styleProps = preloadPropsMap.get(instance$248)))
	          (instance = assign({}, props)),
	            adoptPreloadPropsForScript(instance, styleProps);
	        hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
	        styleProps = hoistableRoot.createElement("script");
	        markNodeAsHoistable(styleProps);
	        setInitialProperties(styleProps, "link", instance);
	        hoistableRoot.head.appendChild(styleProps);
	        return (resource.instance = styleProps);
	      case "void":
	        return null;
	      default:
	        throw Error(formatProdErrorMessage(443, resource.type));
	    }
	  else
	    "stylesheet" === resource.type &&
	      0 === (resource.state.loading & 4) &&
	      ((instance = resource.instance),
	      (resource.state.loading |= 4),
	      insertStylesheet(instance, props.precedence, hoistableRoot));
	  return resource.instance;
	}
	function insertStylesheet(instance, precedence, root) {
	  for (
	    var nodes = root.querySelectorAll(
	        'link[rel="stylesheet"][data-precedence],style[data-precedence]'
	      ),
	      last = nodes.length ? nodes[nodes.length - 1] : null,
	      prior = last,
	      i = 0;
	    i < nodes.length;
	    i++
	  ) {
	    var node = nodes[i];
	    if (node.dataset.precedence === precedence) prior = node;
	    else if (prior !== last) break;
	  }
	  prior
	    ? prior.parentNode.insertBefore(instance, prior.nextSibling)
	    : ((precedence = 9 === root.nodeType ? root.head : root),
	      precedence.insertBefore(instance, precedence.firstChild));
	}
	function adoptPreloadPropsForStylesheet(stylesheetProps, preloadProps) {
	  null == stylesheetProps.crossOrigin &&
	    (stylesheetProps.crossOrigin = preloadProps.crossOrigin);
	  null == stylesheetProps.referrerPolicy &&
	    (stylesheetProps.referrerPolicy = preloadProps.referrerPolicy);
	  null == stylesheetProps.title && (stylesheetProps.title = preloadProps.title);
	}
	function adoptPreloadPropsForScript(scriptProps, preloadProps) {
	  null == scriptProps.crossOrigin &&
	    (scriptProps.crossOrigin = preloadProps.crossOrigin);
	  null == scriptProps.referrerPolicy &&
	    (scriptProps.referrerPolicy = preloadProps.referrerPolicy);
	  null == scriptProps.integrity &&
	    (scriptProps.integrity = preloadProps.integrity);
	}
	var tagCaches = null;
	function getHydratableHoistableCache(type, keyAttribute, ownerDocument) {
	  if (null === tagCaches) {
	    var cache = new Map();
	    var caches = (tagCaches = new Map());
	    caches.set(ownerDocument, cache);
	  } else
	    (caches = tagCaches),
	      (cache = caches.get(ownerDocument)),
	      cache || ((cache = new Map()), caches.set(ownerDocument, cache));
	  if (cache.has(type)) return cache;
	  cache.set(type, null);
	  ownerDocument = ownerDocument.getElementsByTagName(type);
	  for (caches = 0; caches < ownerDocument.length; caches++) {
	    var node = ownerDocument[caches];
	    if (
	      !(
	        node[internalHoistableMarker] ||
	        node[internalInstanceKey] ||
	        ("link" === type && "stylesheet" === node.getAttribute("rel"))
	      ) &&
	      "http://www.w3.org/2000/svg" !== node.namespaceURI
	    ) {
	      var nodeKey = node.getAttribute(keyAttribute) || "";
	      nodeKey = type + nodeKey;
	      var existing = cache.get(nodeKey);
	      existing ? existing.push(node) : cache.set(nodeKey, [node]);
	    }
	  }
	  return cache;
	}
	function mountHoistable(hoistableRoot, type, instance) {
	  hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
	  hoistableRoot.head.insertBefore(
	    instance,
	    "title" === type ? hoistableRoot.querySelector("head > title") : null
	  );
	}
	function isHostHoistableType(type, props, hostContext) {
	  if (1 === hostContext || null != props.itemProp) return false;
	  switch (type) {
	    case "meta":
	    case "title":
	      return true;
	    case "style":
	      if (
	        "string" !== typeof props.precedence ||
	        "string" !== typeof props.href ||
	        "" === props.href
	      )
	        break;
	      return true;
	    case "link":
	      if (
	        "string" !== typeof props.rel ||
	        "string" !== typeof props.href ||
	        "" === props.href ||
	        props.onLoad ||
	        props.onError
	      )
	        break;
	      switch (props.rel) {
	        case "stylesheet":
	          return (
	            (type = props.disabled),
	            "string" === typeof props.precedence && null == type
	          );
	        default:
	          return true;
	      }
	    case "script":
	      if (
	        props.async &&
	        "function" !== typeof props.async &&
	        "symbol" !== typeof props.async &&
	        !props.onLoad &&
	        !props.onError &&
	        props.src &&
	        "string" === typeof props.src
	      )
	        return true;
	  }
	  return false;
	}
	function preloadResource(resource) {
	  return "stylesheet" === resource.type && 0 === (resource.state.loading & 3)
	    ? false
	    : true;
	}
	var suspendedState = null;
	function noop() {}
	function suspendResource(hoistableRoot, resource, props) {
	  if (null === suspendedState) throw Error(formatProdErrorMessage(475));
	  var state = suspendedState;
	  if (
	    "stylesheet" === resource.type &&
	    ("string" !== typeof props.media ||
	      false !== matchMedia(props.media).matches) &&
	    0 === (resource.state.loading & 4)
	  ) {
	    if (null === resource.instance) {
	      var key = getStyleKey(props.href),
	        instance = hoistableRoot.querySelector(
	          getStylesheetSelectorFromKey(key)
	        );
	      if (instance) {
	        hoistableRoot = instance._p;
	        null !== hoistableRoot &&
	          "object" === typeof hoistableRoot &&
	          "function" === typeof hoistableRoot.then &&
	          (state.count++,
	          (state = onUnsuspend.bind(state)),
	          hoistableRoot.then(state, state));
	        resource.state.loading |= 4;
	        resource.instance = instance;
	        markNodeAsHoistable(instance);
	        return;
	      }
	      instance = hoistableRoot.ownerDocument || hoistableRoot;
	      props = stylesheetPropsFromRawProps(props);
	      (key = preloadPropsMap.get(key)) &&
	        adoptPreloadPropsForStylesheet(props, key);
	      instance = instance.createElement("link");
	      markNodeAsHoistable(instance);
	      var linkInstance = instance;
	      linkInstance._p = new Promise(function (resolve, reject) {
	        linkInstance.onload = resolve;
	        linkInstance.onerror = reject;
	      });
	      setInitialProperties(instance, "link", props);
	      resource.instance = instance;
	    }
	    null === state.stylesheets && (state.stylesheets = new Map());
	    state.stylesheets.set(resource, hoistableRoot);
	    (hoistableRoot = resource.state.preload) &&
	      0 === (resource.state.loading & 3) &&
	      (state.count++,
	      (resource = onUnsuspend.bind(state)),
	      hoistableRoot.addEventListener("load", resource),
	      hoistableRoot.addEventListener("error", resource));
	  }
	}
	function waitForCommitToBeReady() {
	  if (null === suspendedState) throw Error(formatProdErrorMessage(475));
	  var state = suspendedState;
	  state.stylesheets &&
	    0 === state.count &&
	    insertSuspendedStylesheets(state, state.stylesheets);
	  return 0 < state.count
	    ? function (commit) {
	        var stylesheetTimer = setTimeout(function () {
	          state.stylesheets &&
	            insertSuspendedStylesheets(state, state.stylesheets);
	          if (state.unsuspend) {
	            var unsuspend = state.unsuspend;
	            state.unsuspend = null;
	            unsuspend();
	          }
	        }, 6e4);
	        state.unsuspend = commit;
	        return function () {
	          state.unsuspend = null;
	          clearTimeout(stylesheetTimer);
	        };
	      }
	    : null;
	}
	function onUnsuspend() {
	  this.count--;
	  if (0 === this.count)
	    if (this.stylesheets) insertSuspendedStylesheets(this, this.stylesheets);
	    else if (this.unsuspend) {
	      var unsuspend = this.unsuspend;
	      this.unsuspend = null;
	      unsuspend();
	    }
	}
	var precedencesByRoot = null;
	function insertSuspendedStylesheets(state, resources) {
	  state.stylesheets = null;
	  null !== state.unsuspend &&
	    (state.count++,
	    (precedencesByRoot = new Map()),
	    resources.forEach(insertStylesheetIntoRoot, state),
	    (precedencesByRoot = null),
	    onUnsuspend.call(state));
	}
	function insertStylesheetIntoRoot(root, resource) {
	  if (!(resource.state.loading & 4)) {
	    var precedences = precedencesByRoot.get(root);
	    if (precedences) var last = precedences.get(null);
	    else {
	      precedences = new Map();
	      precedencesByRoot.set(root, precedences);
	      for (
	        var nodes = root.querySelectorAll(
	            "link[data-precedence],style[data-precedence]"
	          ),
	          i = 0;
	        i < nodes.length;
	        i++
	      ) {
	        var node = nodes[i];
	        if (
	          "LINK" === node.nodeName ||
	          "not all" !== node.getAttribute("media")
	        )
	          precedences.set(node.dataset.precedence, node), (last = node);
	      }
	      last && precedences.set(null, last);
	    }
	    nodes = resource.instance;
	    node = nodes.getAttribute("data-precedence");
	    i = precedences.get(node) || last;
	    i === last && precedences.set(null, nodes);
	    precedences.set(node, nodes);
	    this.count++;
	    last = onUnsuspend.bind(this);
	    nodes.addEventListener("load", last);
	    nodes.addEventListener("error", last);
	    i
	      ? i.parentNode.insertBefore(nodes, i.nextSibling)
	      : ((root = 9 === root.nodeType ? root.head : root),
	        root.insertBefore(nodes, root.firstChild));
	    resource.state.loading |= 4;
	  }
	}
	var HostTransitionContext = {
	  $$typeof: REACT_CONTEXT_TYPE,
	  Provider: null,
	  Consumer: null,
	  _currentValue: sharedNotPendingObject,
	  _currentValue2: sharedNotPendingObject,
	  _threadCount: 0
	};
	function FiberRootNode(
	  containerInfo,
	  tag,
	  hydrate,
	  identifierPrefix,
	  onUncaughtError,
	  onCaughtError,
	  onRecoverableError,
	  formState
	) {
	  this.tag = 1;
	  this.containerInfo = containerInfo;
	  this.finishedWork =
	    this.pingCache =
	    this.current =
	    this.pendingChildren =
	      null;
	  this.timeoutHandle = -1;
	  this.callbackNode =
	    this.next =
	    this.pendingContext =
	    this.context =
	    this.cancelPendingCommit =
	      null;
	  this.callbackPriority = 0;
	  this.expirationTimes = createLaneMap(-1);
	  this.entangledLanes =
	    this.shellSuspendCounter =
	    this.errorRecoveryDisabledLanes =
	    this.finishedLanes =
	    this.expiredLanes =
	    this.warmLanes =
	    this.pingedLanes =
	    this.suspendedLanes =
	    this.pendingLanes =
	      0;
	  this.entanglements = createLaneMap(0);
	  this.hiddenUpdates = createLaneMap(null);
	  this.identifierPrefix = identifierPrefix;
	  this.onUncaughtError = onUncaughtError;
	  this.onCaughtError = onCaughtError;
	  this.onRecoverableError = onRecoverableError;
	  this.pooledCache = null;
	  this.pooledCacheLanes = 0;
	  this.formState = formState;
	  this.incompleteTransitions = new Map();
	}
	function createFiberRoot(
	  containerInfo,
	  tag,
	  hydrate,
	  initialChildren,
	  hydrationCallbacks,
	  isStrictMode,
	  identifierPrefix,
	  onUncaughtError,
	  onCaughtError,
	  onRecoverableError,
	  transitionCallbacks,
	  formState
	) {
	  containerInfo = new FiberRootNode(
	    containerInfo,
	    tag,
	    hydrate,
	    identifierPrefix,
	    onUncaughtError,
	    onCaughtError,
	    onRecoverableError,
	    formState
	  );
	  tag = 1;
	  true === isStrictMode && (tag |= 24);
	  isStrictMode = createFiberImplClass(3, null, null, tag);
	  containerInfo.current = isStrictMode;
	  isStrictMode.stateNode = containerInfo;
	  tag = createCache();
	  tag.refCount++;
	  containerInfo.pooledCache = tag;
	  tag.refCount++;
	  isStrictMode.memoizedState = {
	    element: initialChildren,
	    isDehydrated: hydrate,
	    cache: tag
	  };
	  initializeUpdateQueue(isStrictMode);
	  return containerInfo;
	}
	function getContextForSubtree(parentComponent) {
	  if (!parentComponent) return emptyContextObject;
	  parentComponent = emptyContextObject;
	  return parentComponent;
	}
	function updateContainerImpl(
	  rootFiber,
	  lane,
	  element,
	  container,
	  parentComponent,
	  callback
	) {
	  parentComponent = getContextForSubtree(parentComponent);
	  null === container.context
	    ? (container.context = parentComponent)
	    : (container.pendingContext = parentComponent);
	  container = createUpdate(lane);
	  container.payload = { element: element };
	  callback = void 0 === callback ? null : callback;
	  null !== callback && (container.callback = callback);
	  element = enqueueUpdate(rootFiber, container, lane);
	  null !== element &&
	    (scheduleUpdateOnFiber(element, rootFiber, lane),
	    entangleTransitions(element, rootFiber, lane));
	}
	function markRetryLaneImpl(fiber, retryLane) {
	  fiber = fiber.memoizedState;
	  if (null !== fiber && null !== fiber.dehydrated) {
	    var a = fiber.retryLane;
	    fiber.retryLane = 0 !== a && a < retryLane ? a : retryLane;
	  }
	}
	function markRetryLaneIfNotHydrated(fiber, retryLane) {
	  markRetryLaneImpl(fiber, retryLane);
	  (fiber = fiber.alternate) && markRetryLaneImpl(fiber, retryLane);
	}
	function attemptContinuousHydration(fiber) {
	  if (13 === fiber.tag) {
	    var root = enqueueConcurrentRenderForLane(fiber, 67108864);
	    null !== root && scheduleUpdateOnFiber(root, fiber, 67108864);
	    markRetryLaneIfNotHydrated(fiber, 67108864);
	  }
	}
	var _enabled = true;
	function dispatchDiscreteEvent(
	  domEventName,
	  eventSystemFlags,
	  container,
	  nativeEvent
	) {
	  var prevTransition = ReactSharedInternals.T;
	  ReactSharedInternals.T = null;
	  var previousPriority = ReactDOMSharedInternals.p;
	  try {
	    (ReactDOMSharedInternals.p = 2),
	      dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
	  } finally {
	    (ReactDOMSharedInternals.p = previousPriority),
	      (ReactSharedInternals.T = prevTransition);
	  }
	}
	function dispatchContinuousEvent(
	  domEventName,
	  eventSystemFlags,
	  container,
	  nativeEvent
	) {
	  var prevTransition = ReactSharedInternals.T;
	  ReactSharedInternals.T = null;
	  var previousPriority = ReactDOMSharedInternals.p;
	  try {
	    (ReactDOMSharedInternals.p = 8),
	      dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
	  } finally {
	    (ReactDOMSharedInternals.p = previousPriority),
	      (ReactSharedInternals.T = prevTransition);
	  }
	}
	function dispatchEvent(
	  domEventName,
	  eventSystemFlags,
	  targetContainer,
	  nativeEvent
	) {
	  if (_enabled) {
	    var blockedOn = findInstanceBlockingEvent(nativeEvent);
	    if (null === blockedOn)
	      dispatchEventForPluginEventSystem(
	        domEventName,
	        eventSystemFlags,
	        nativeEvent,
	        return_targetInst,
	        targetContainer
	      ),
	        clearIfContinuousEvent(domEventName, nativeEvent);
	    else if (
	      queueIfContinuousEvent(
	        blockedOn,
	        domEventName,
	        eventSystemFlags,
	        targetContainer,
	        nativeEvent
	      )
	    )
	      nativeEvent.stopPropagation();
	    else if (
	      (clearIfContinuousEvent(domEventName, nativeEvent),
	      eventSystemFlags & 4 &&
	        -1 < discreteReplayableEvents.indexOf(domEventName))
	    ) {
	      for (; null !== blockedOn; ) {
	        var fiber = getInstanceFromNode(blockedOn);
	        if (null !== fiber)
	          switch (fiber.tag) {
	            case 3:
	              fiber = fiber.stateNode;
	              if (fiber.current.memoizedState.isDehydrated) {
	                var lanes = getHighestPriorityLanes(fiber.pendingLanes);
	                if (0 !== lanes) {
	                  var root = fiber;
	                  root.pendingLanes |= 2;
	                  for (root.entangledLanes |= 2; lanes; ) {
	                    var lane = 1 << (31 - clz32(lanes));
	                    root.entanglements[1] |= lane;
	                    lanes &= ~lane;
	                  }
	                  ensureRootIsScheduled(fiber);
	                  0 === (executionContext & 6) &&
	                    ((workInProgressRootRenderTargetTime = now() + 500),
	                    flushSyncWorkAcrossRoots_impl(0));
	                }
	              }
	              break;
	            case 13:
	              (root = enqueueConcurrentRenderForLane(fiber, 2)),
	                null !== root && scheduleUpdateOnFiber(root, fiber, 2),
	                flushSyncWork$1(),
	                markRetryLaneIfNotHydrated(fiber, 2);
	          }
	        fiber = findInstanceBlockingEvent(nativeEvent);
	        null === fiber &&
	          dispatchEventForPluginEventSystem(
	            domEventName,
	            eventSystemFlags,
	            nativeEvent,
	            return_targetInst,
	            targetContainer
	          );
	        if (fiber === blockedOn) break;
	        blockedOn = fiber;
	      }
	      null !== blockedOn && nativeEvent.stopPropagation();
	    } else
	      dispatchEventForPluginEventSystem(
	        domEventName,
	        eventSystemFlags,
	        nativeEvent,
	        null,
	        targetContainer
	      );
	  }
	}
	function findInstanceBlockingEvent(nativeEvent) {
	  nativeEvent = getEventTarget(nativeEvent);
	  return findInstanceBlockingTarget(nativeEvent);
	}
	var return_targetInst = null;
	function findInstanceBlockingTarget(targetNode) {
	  return_targetInst = null;
	  targetNode = getClosestInstanceFromNode(targetNode);
	  if (null !== targetNode) {
	    var nearestMounted = getNearestMountedFiber(targetNode);
	    if (null === nearestMounted) targetNode = null;
	    else {
	      var tag = nearestMounted.tag;
	      if (13 === tag) {
	        targetNode = getSuspenseInstanceFromFiber(nearestMounted);
	        if (null !== targetNode) return targetNode;
	        targetNode = null;
	      } else if (3 === tag) {
	        if (nearestMounted.stateNode.current.memoizedState.isDehydrated)
	          return 3 === nearestMounted.tag
	            ? nearestMounted.stateNode.containerInfo
	            : null;
	        targetNode = null;
	      } else nearestMounted !== targetNode && (targetNode = null);
	    }
	  }
	  return_targetInst = targetNode;
	  return null;
	}
	function getEventPriority(domEventName) {
	  switch (domEventName) {
	    case "beforetoggle":
	    case "cancel":
	    case "click":
	    case "close":
	    case "contextmenu":
	    case "copy":
	    case "cut":
	    case "auxclick":
	    case "dblclick":
	    case "dragend":
	    case "dragstart":
	    case "drop":
	    case "focusin":
	    case "focusout":
	    case "input":
	    case "invalid":
	    case "keydown":
	    case "keypress":
	    case "keyup":
	    case "mousedown":
	    case "mouseup":
	    case "paste":
	    case "pause":
	    case "play":
	    case "pointercancel":
	    case "pointerdown":
	    case "pointerup":
	    case "ratechange":
	    case "reset":
	    case "resize":
	    case "seeked":
	    case "submit":
	    case "toggle":
	    case "touchcancel":
	    case "touchend":
	    case "touchstart":
	    case "volumechange":
	    case "change":
	    case "selectionchange":
	    case "textInput":
	    case "compositionstart":
	    case "compositionend":
	    case "compositionupdate":
	    case "beforeblur":
	    case "afterblur":
	    case "beforeinput":
	    case "blur":
	    case "fullscreenchange":
	    case "focus":
	    case "hashchange":
	    case "popstate":
	    case "select":
	    case "selectstart":
	      return 2;
	    case "drag":
	    case "dragenter":
	    case "dragexit":
	    case "dragleave":
	    case "dragover":
	    case "mousemove":
	    case "mouseout":
	    case "mouseover":
	    case "pointermove":
	    case "pointerout":
	    case "pointerover":
	    case "scroll":
	    case "touchmove":
	    case "wheel":
	    case "mouseenter":
	    case "mouseleave":
	    case "pointerenter":
	    case "pointerleave":
	      return 8;
	    case "message":
	      switch (getCurrentPriorityLevel()) {
	        case ImmediatePriority:
	          return 2;
	        case UserBlockingPriority:
	          return 8;
	        case NormalPriority$1:
	        case LowPriority:
	          return 32;
	        case IdlePriority:
	          return 268435456;
	        default:
	          return 32;
	      }
	    default:
	      return 32;
	  }
	}
	var hasScheduledReplayAttempt = false,
	  queuedFocus = null,
	  queuedDrag = null,
	  queuedMouse = null,
	  queuedPointers = new Map(),
	  queuedPointerCaptures = new Map(),
	  queuedExplicitHydrationTargets = [],
	  discreteReplayableEvents =
	    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
	      " "
	    );
	function clearIfContinuousEvent(domEventName, nativeEvent) {
	  switch (domEventName) {
	    case "focusin":
	    case "focusout":
	      queuedFocus = null;
	      break;
	    case "dragenter":
	    case "dragleave":
	      queuedDrag = null;
	      break;
	    case "mouseover":
	    case "mouseout":
	      queuedMouse = null;
	      break;
	    case "pointerover":
	    case "pointerout":
	      queuedPointers.delete(nativeEvent.pointerId);
	      break;
	    case "gotpointercapture":
	    case "lostpointercapture":
	      queuedPointerCaptures.delete(nativeEvent.pointerId);
	  }
	}
	function accumulateOrCreateContinuousQueuedReplayableEvent(
	  existingQueuedEvent,
	  blockedOn,
	  domEventName,
	  eventSystemFlags,
	  targetContainer,
	  nativeEvent
	) {
	  if (
	    null === existingQueuedEvent ||
	    existingQueuedEvent.nativeEvent !== nativeEvent
	  )
	    return (
	      (existingQueuedEvent = {
	        blockedOn: blockedOn,
	        domEventName: domEventName,
	        eventSystemFlags: eventSystemFlags,
	        nativeEvent: nativeEvent,
	        targetContainers: [targetContainer]
	      }),
	      null !== blockedOn &&
	        ((blockedOn = getInstanceFromNode(blockedOn)),
	        null !== blockedOn && attemptContinuousHydration(blockedOn)),
	      existingQueuedEvent
	    );
	  existingQueuedEvent.eventSystemFlags |= eventSystemFlags;
	  blockedOn = existingQueuedEvent.targetContainers;
	  null !== targetContainer &&
	    -1 === blockedOn.indexOf(targetContainer) &&
	    blockedOn.push(targetContainer);
	  return existingQueuedEvent;
	}
	function queueIfContinuousEvent(
	  blockedOn,
	  domEventName,
	  eventSystemFlags,
	  targetContainer,
	  nativeEvent
	) {
	  switch (domEventName) {
	    case "focusin":
	      return (
	        (queuedFocus = accumulateOrCreateContinuousQueuedReplayableEvent(
	          queuedFocus,
	          blockedOn,
	          domEventName,
	          eventSystemFlags,
	          targetContainer,
	          nativeEvent
	        )),
	        true
	      );
	    case "dragenter":
	      return (
	        (queuedDrag = accumulateOrCreateContinuousQueuedReplayableEvent(
	          queuedDrag,
	          blockedOn,
	          domEventName,
	          eventSystemFlags,
	          targetContainer,
	          nativeEvent
	        )),
	        true
	      );
	    case "mouseover":
	      return (
	        (queuedMouse = accumulateOrCreateContinuousQueuedReplayableEvent(
	          queuedMouse,
	          blockedOn,
	          domEventName,
	          eventSystemFlags,
	          targetContainer,
	          nativeEvent
	        )),
	        true
	      );
	    case "pointerover":
	      var pointerId = nativeEvent.pointerId;
	      queuedPointers.set(
	        pointerId,
	        accumulateOrCreateContinuousQueuedReplayableEvent(
	          queuedPointers.get(pointerId) || null,
	          blockedOn,
	          domEventName,
	          eventSystemFlags,
	          targetContainer,
	          nativeEvent
	        )
	      );
	      return true;
	    case "gotpointercapture":
	      return (
	        (pointerId = nativeEvent.pointerId),
	        queuedPointerCaptures.set(
	          pointerId,
	          accumulateOrCreateContinuousQueuedReplayableEvent(
	            queuedPointerCaptures.get(pointerId) || null,
	            blockedOn,
	            domEventName,
	            eventSystemFlags,
	            targetContainer,
	            nativeEvent
	          )
	        ),
	        true
	      );
	  }
	  return false;
	}
	function attemptExplicitHydrationTarget(queuedTarget) {
	  var targetInst = getClosestInstanceFromNode(queuedTarget.target);
	  if (null !== targetInst) {
	    var nearestMounted = getNearestMountedFiber(targetInst);
	    if (null !== nearestMounted)
	      if (((targetInst = nearestMounted.tag), 13 === targetInst)) {
	        if (
	          ((targetInst = getSuspenseInstanceFromFiber(nearestMounted)),
	          null !== targetInst)
	        ) {
	          queuedTarget.blockedOn = targetInst;
	          runWithPriority(queuedTarget.priority, function () {
	            if (13 === nearestMounted.tag) {
	              var lane = requestUpdateLane(),
	                root = enqueueConcurrentRenderForLane(nearestMounted, lane);
	              null !== root &&
	                scheduleUpdateOnFiber(root, nearestMounted, lane);
	              markRetryLaneIfNotHydrated(nearestMounted, lane);
	            }
	          });
	          return;
	        }
	      } else if (
	        3 === targetInst &&
	        nearestMounted.stateNode.current.memoizedState.isDehydrated
	      ) {
	        queuedTarget.blockedOn =
	          3 === nearestMounted.tag
	            ? nearestMounted.stateNode.containerInfo
	            : null;
	        return;
	      }
	  }
	  queuedTarget.blockedOn = null;
	}
	function attemptReplayContinuousQueuedEvent(queuedEvent) {
	  if (null !== queuedEvent.blockedOn) return false;
	  for (
	    var targetContainers = queuedEvent.targetContainers;
	    0 < targetContainers.length;

	  ) {
	    var nextBlockedOn = findInstanceBlockingEvent(queuedEvent.nativeEvent);
	    if (null === nextBlockedOn) {
	      nextBlockedOn = queuedEvent.nativeEvent;
	      var nativeEventClone = new nextBlockedOn.constructor(
	        nextBlockedOn.type,
	        nextBlockedOn
	      );
	      currentReplayingEvent = nativeEventClone;
	      nextBlockedOn.target.dispatchEvent(nativeEventClone);
	      currentReplayingEvent = null;
	    } else
	      return (
	        (targetContainers = getInstanceFromNode(nextBlockedOn)),
	        null !== targetContainers &&
	          attemptContinuousHydration(targetContainers),
	        (queuedEvent.blockedOn = nextBlockedOn),
	        false
	      );
	    targetContainers.shift();
	  }
	  return true;
	}
	function attemptReplayContinuousQueuedEventInMap(queuedEvent, key, map) {
	  attemptReplayContinuousQueuedEvent(queuedEvent) && map.delete(key);
	}
	function replayUnblockedEvents() {
	  hasScheduledReplayAttempt = false;
	  null !== queuedFocus &&
	    attemptReplayContinuousQueuedEvent(queuedFocus) &&
	    (queuedFocus = null);
	  null !== queuedDrag &&
	    attemptReplayContinuousQueuedEvent(queuedDrag) &&
	    (queuedDrag = null);
	  null !== queuedMouse &&
	    attemptReplayContinuousQueuedEvent(queuedMouse) &&
	    (queuedMouse = null);
	  queuedPointers.forEach(attemptReplayContinuousQueuedEventInMap);
	  queuedPointerCaptures.forEach(attemptReplayContinuousQueuedEventInMap);
	}
	function scheduleCallbackIfUnblocked(queuedEvent, unblocked) {
	  queuedEvent.blockedOn === unblocked &&
	    ((queuedEvent.blockedOn = null),
	    hasScheduledReplayAttempt ||
	      ((hasScheduledReplayAttempt = true),
	      Scheduler.unstable_scheduleCallback(
	        Scheduler.unstable_NormalPriority,
	        replayUnblockedEvents
	      )));
	}
	var lastScheduledReplayQueue = null;
	function scheduleReplayQueueIfNeeded(formReplayingQueue) {
	  lastScheduledReplayQueue !== formReplayingQueue &&
	    ((lastScheduledReplayQueue = formReplayingQueue),
	    Scheduler.unstable_scheduleCallback(
	      Scheduler.unstable_NormalPriority,
	      function () {
	        lastScheduledReplayQueue === formReplayingQueue &&
	          (lastScheduledReplayQueue = null);
	        for (var i = 0; i < formReplayingQueue.length; i += 3) {
	          var form = formReplayingQueue[i],
	            submitterOrAction = formReplayingQueue[i + 1],
	            formData = formReplayingQueue[i + 2];
	          if ("function" !== typeof submitterOrAction)
	            if (null === findInstanceBlockingTarget(submitterOrAction || form))
	              continue;
	            else break;
	          var formInst = getInstanceFromNode(form);
	          null !== formInst &&
	            (formReplayingQueue.splice(i, 3),
	            (i -= 3),
	            startHostTransition(
	              formInst,
	              {
	                pending: true,
	                data: formData,
	                method: form.method,
	                action: submitterOrAction
	              },
	              submitterOrAction,
	              formData
	            ));
	        }
	      }
	    ));
	}
	function retryIfBlockedOn(unblocked) {
	  function unblock(queuedEvent) {
	    return scheduleCallbackIfUnblocked(queuedEvent, unblocked);
	  }
	  null !== queuedFocus && scheduleCallbackIfUnblocked(queuedFocus, unblocked);
	  null !== queuedDrag && scheduleCallbackIfUnblocked(queuedDrag, unblocked);
	  null !== queuedMouse && scheduleCallbackIfUnblocked(queuedMouse, unblocked);
	  queuedPointers.forEach(unblock);
	  queuedPointerCaptures.forEach(unblock);
	  for (var i = 0; i < queuedExplicitHydrationTargets.length; i++) {
	    var queuedTarget = queuedExplicitHydrationTargets[i];
	    queuedTarget.blockedOn === unblocked && (queuedTarget.blockedOn = null);
	  }
	  for (
	    ;
	    0 < queuedExplicitHydrationTargets.length &&
	    ((i = queuedExplicitHydrationTargets[0]), null === i.blockedOn);

	  )
	    attemptExplicitHydrationTarget(i),
	      null === i.blockedOn && queuedExplicitHydrationTargets.shift();
	  i = (unblocked.ownerDocument || unblocked).$$reactFormReplay;
	  if (null != i)
	    for (queuedTarget = 0; queuedTarget < i.length; queuedTarget += 3) {
	      var form = i[queuedTarget],
	        submitterOrAction = i[queuedTarget + 1],
	        formProps = form[internalPropsKey] || null;
	      if ("function" === typeof submitterOrAction)
	        formProps || scheduleReplayQueueIfNeeded(i);
	      else if (formProps) {
	        var action = null;
	        if (submitterOrAction && submitterOrAction.hasAttribute("formAction"))
	          if (
	            ((form = submitterOrAction),
	            (formProps = submitterOrAction[internalPropsKey] || null))
	          )
	            action = formProps.formAction;
	          else {
	            if (null !== findInstanceBlockingTarget(form)) continue;
	          }
	        else action = formProps.action;
	        "function" === typeof action
	          ? (i[queuedTarget + 1] = action)
	          : (i.splice(queuedTarget, 3), (queuedTarget -= 3));
	        scheduleReplayQueueIfNeeded(i);
	      }
	    }
	}
	function ReactDOMRoot(internalRoot) {
	  this._internalRoot = internalRoot;
	}
	ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render =
	  function (children) {
	    var root = this._internalRoot;
	    if (null === root) throw Error(formatProdErrorMessage(409));
	    var current = root.current,
	      lane = requestUpdateLane();
	    updateContainerImpl(current, lane, children, root, null, null);
	  };
	ReactDOMHydrationRoot.prototype.unmount = ReactDOMRoot.prototype.unmount =
	  function () {
	    var root = this._internalRoot;
	    if (null !== root) {
	      this._internalRoot = null;
	      var container = root.containerInfo;
	      0 === root.tag && flushPassiveEffects();
	      updateContainerImpl(root.current, 2, null, root, null, null);
	      flushSyncWork$1();
	      container[internalContainerInstanceKey] = null;
	    }
	  };
	function ReactDOMHydrationRoot(internalRoot) {
	  this._internalRoot = internalRoot;
	}
	ReactDOMHydrationRoot.prototype.unstable_scheduleHydration = function (target) {
	  if (target) {
	    var updatePriority = resolveUpdatePriority();
	    target = { blockedOn: null, target: target, priority: updatePriority };
	    for (
	      var i = 0;
	      i < queuedExplicitHydrationTargets.length &&
	      0 !== updatePriority &&
	      updatePriority < queuedExplicitHydrationTargets[i].priority;
	      i++
	    );
	    queuedExplicitHydrationTargets.splice(i, 0, target);
	    0 === i && attemptExplicitHydrationTarget(target);
	  }
	};
	var isomorphicReactPackageVersion$jscomp$inline_1686 = React.version;
	if (
	  "19.0.0" !==
	  isomorphicReactPackageVersion$jscomp$inline_1686
	)
	  throw Error(
	    formatProdErrorMessage(
	      527,
	      isomorphicReactPackageVersion$jscomp$inline_1686,
	      "19.0.0"
	    )
	  );
	ReactDOMSharedInternals.findDOMNode = function (componentOrElement) {
	  var fiber = componentOrElement._reactInternals;
	  if (void 0 === fiber) {
	    if ("function" === typeof componentOrElement.render)
	      throw Error(formatProdErrorMessage(188));
	    componentOrElement = Object.keys(componentOrElement).join(",");
	    throw Error(formatProdErrorMessage(268, componentOrElement));
	  }
	  componentOrElement = findCurrentFiberUsingSlowPath(fiber);
	  componentOrElement =
	    null !== componentOrElement
	      ? findCurrentHostFiberImpl(componentOrElement)
	      : null;
	  componentOrElement =
	    null === componentOrElement ? null : componentOrElement.stateNode;
	  return componentOrElement;
	};
	var internals$jscomp$inline_2165 = {
	  bundleType: 0,
	  version: "19.0.0",
	  rendererPackageName: "react-dom",
	  currentDispatcherRef: ReactSharedInternals,
	  findFiberByHostInstance: getClosestInstanceFromNode,
	  reconcilerVersion: "19.0.0"
	};
	if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
	  var hook$jscomp$inline_2166 = __REACT_DEVTOOLS_GLOBAL_HOOK__;
	  if (
	    !hook$jscomp$inline_2166.isDisabled &&
	    hook$jscomp$inline_2166.supportsFiber
	  )
	    try {
	      (rendererID = hook$jscomp$inline_2166.inject(
	        internals$jscomp$inline_2165
	      )),
	        (injectedHook = hook$jscomp$inline_2166);
	    } catch (err) {}
	}
	reactDomClient_production.createRoot = function (container, options) {
	  if (!isValidContainer(container)) throw Error(formatProdErrorMessage(299));
	  var isStrictMode = false,
	    identifierPrefix = "",
	    onUncaughtError = defaultOnUncaughtError,
	    onCaughtError = defaultOnCaughtError,
	    onRecoverableError = defaultOnRecoverableError,
	    transitionCallbacks = null;
	  null !== options &&
	    void 0 !== options &&
	    (true === options.unstable_strictMode && (isStrictMode = true),
	    void 0 !== options.identifierPrefix &&
	      (identifierPrefix = options.identifierPrefix),
	    void 0 !== options.onUncaughtError &&
	      (onUncaughtError = options.onUncaughtError),
	    void 0 !== options.onCaughtError && (onCaughtError = options.onCaughtError),
	    void 0 !== options.onRecoverableError &&
	      (onRecoverableError = options.onRecoverableError),
	    void 0 !== options.unstable_transitionCallbacks &&
	      (transitionCallbacks = options.unstable_transitionCallbacks));
	  options = createFiberRoot(
	    container,
	    1,
	    false,
	    null,
	    null,
	    isStrictMode,
	    identifierPrefix,
	    onUncaughtError,
	    onCaughtError,
	    onRecoverableError,
	    transitionCallbacks,
	    null
	  );
	  container[internalContainerInstanceKey] = options.current;
	  listenToAllSupportedEvents(
	    8 === container.nodeType ? container.parentNode : container
	  );
	  return new ReactDOMRoot(options);
	};
	reactDomClient_production.hydrateRoot = function (container, initialChildren, options) {
	  if (!isValidContainer(container)) throw Error(formatProdErrorMessage(299));
	  var isStrictMode = false,
	    identifierPrefix = "",
	    onUncaughtError = defaultOnUncaughtError,
	    onCaughtError = defaultOnCaughtError,
	    onRecoverableError = defaultOnRecoverableError,
	    transitionCallbacks = null,
	    formState = null;
	  null !== options &&
	    void 0 !== options &&
	    (true === options.unstable_strictMode && (isStrictMode = true),
	    void 0 !== options.identifierPrefix &&
	      (identifierPrefix = options.identifierPrefix),
	    void 0 !== options.onUncaughtError &&
	      (onUncaughtError = options.onUncaughtError),
	    void 0 !== options.onCaughtError && (onCaughtError = options.onCaughtError),
	    void 0 !== options.onRecoverableError &&
	      (onRecoverableError = options.onRecoverableError),
	    void 0 !== options.unstable_transitionCallbacks &&
	      (transitionCallbacks = options.unstable_transitionCallbacks),
	    void 0 !== options.formState && (formState = options.formState));
	  initialChildren = createFiberRoot(
	    container,
	    1,
	    true,
	    initialChildren,
	    null != options ? options : null,
	    isStrictMode,
	    identifierPrefix,
	    onUncaughtError,
	    onCaughtError,
	    onRecoverableError,
	    transitionCallbacks,
	    formState
	  );
	  initialChildren.context = getContextForSubtree(null);
	  options = initialChildren.current;
	  isStrictMode = requestUpdateLane();
	  identifierPrefix = createUpdate(isStrictMode);
	  identifierPrefix.callback = null;
	  enqueueUpdate(options, identifierPrefix, isStrictMode);
	  initialChildren.current.lanes = isStrictMode;
	  markRootUpdated$1(initialChildren, isStrictMode);
	  ensureRootIsScheduled(initialChildren);
	  container[internalContainerInstanceKey] = initialChildren.current;
	  listenToAllSupportedEvents(container);
	  return new ReactDOMHydrationRoot(initialChildren);
	};
	reactDomClient_production.version = "19.0.0";
	return reactDomClient_production;
}

var hasRequiredClient;

function requireClient () {
	if (hasRequiredClient) return client.exports;
	hasRequiredClient = 1;
	function checkDCE() {
	  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
	    return;
	  }
	  try {
	    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
	  } catch (err) {
	    console.error(err);
	  }
	}
	{
	  checkDCE();
	  client.exports = requireReactDomClient_production();
	}
	return client.exports;
}

var clientExports = requireClient();

var reactExports = requireReact();
const React = /*@__PURE__*/getDefaultExportFromCjs(reactExports);

const intro_hero = "/assets/intro-DAvzJtyr.png";

const map = "/assets/bg-DMunV097.png";

const hero1 = "/assets/hero-1-D_EBTvI0.png";

const hero2 = "/assets/hero-2-yK6uKOUs.png";

const enemy1 = "/assets/enemy-1-ZUKBWE0T.png";

const enemy2 = "/assets/enemy-2-r4xAtdSI.png";

const enemy3 = "/assets/enemy-3-CkLjgO4e.png";

const enemy4 = "/assets/enemy-4-DPz9ycA1.png";

const enemy5 = "/assets/enemy-5-C2E6k8ld.png";

const characters = [
    {
        name: "WEST",
        role: "Tech Hacker",
        description: "Disrupts enemy systems using high-tech gear. Silent but lethal.",
        image: enemy1,
    },
    {
        name: "CUPSEY",
        role: "Sniper Scout",
        description: "Quick-footed and sharp-eyed, takes down enemies from a distance.",
        image: enemy2,
    },
    {
        name: "GAKE",
        role: "Brute Tank",
        description: "Heavyweight defender, absorbs damage like a beast.",
        image: enemy3,
    },
    {
        name: "FIZZY",
        role: "Explosive Bomber",
        description: "Lays traps and grenades across the battlefield.",
        image: enemy4,
    },
    {
        name: "CRABBY",
        role: "Beach Ambusher",
        description: "Burrows under the sand and attacks unsuspecting players.",
        image: enemy5,
    },
];

const heros = [
    {
        name: "CASINO",
        role: "Main Fighter",
        description: "Leader of the resistance, brave and balanced in all aspects.",
        image: hero1,
        id: "player1"
    },
    {
        name: "RINA",
        role: "Agile Warrior",
        description: "Swift and tactical, masters close combat on the pixel shores.",
        image: hero2,
        id: "player2"
    },
];

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = React.createContext && /*#__PURE__*/React.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/React.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/React.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var {
        attr,
        size,
        title
      } = props,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/React.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/React.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/React.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function RiTwitterXFill (props) {
  return GenIcon({"attr":{"viewBox":"0 0 24 24","fill":"currentColor"},"child":[{"tag":"path","attr":{"d":"M17.6874 3.0625L12.6907 8.77425L8.37045 3.0625H2.11328L9.58961 12.8387L2.50378 20.9375H5.53795L11.0068 14.6886L15.7863 20.9375H21.8885L14.095 10.6342L20.7198 3.0625H17.6874ZM16.6232 19.1225L5.65436 4.78217H7.45745L18.3034 19.1225H16.6232Z"},"child":[]}]})(props);
}

// THIS FILE IS AUTO GENERATED
function GiRaiseZombie (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M30.653 470.114l55.34-20.32 84.09-19.62 10.78 18.22 25 15.92 41.34-5.41 27.86 8.41 39.41 1.4 36.71-34.72 46.68 19.3 37.84 9.11 58.628 32.737H17.67zm238.6-202.77l-6 10c10.09 6.1 21.58 6.39 32.88 3.21a92.26 92.26 0 0 0 15.72-6.22c-.31 6.28-.36 16.58-.19 29.29l-18.82-2.87 3.86 115 19.72-.85c.69 9.53 1.45 18.47 2.27 26.44l-10.72 10.14-30.09-1.07-25.79-7.77-3.5-1.06-3.62.47-35.2 4.59-4.89-3.12c8.11-37.88 17.45-123.11 19.51-141.7.89-7.27 1.226-14.6 1-21.92l9.89-5.34.7-6.39-3-6.52h-8.88l-4.65-9.13-1.83.63a30 30 0 0 0-2.63-3.11l-.08-.08-24-25.88 2.36-6-1.18-7.08-8.51-2.36-2.07-10-13.35.87-30.95-33.39c.53-4.33 3-9.83 6.9-14.16 3.7-4.16 8.26-6.81 11.88-7.54l59 62.41 9.49-6.55-43.09-89.08c1.73-4 5.71-8.14 10.73-10.83 4.84-2.6 10.11-3.49 13.75-3l45.5 92.27 11-3.53-16.29-98.92c2.68-2.68 7.66-5.23 13-6a27.14 27.14 0 0 1 3.55-.27h1.17a21.3 21.3 0 0 1 9.93 2.59l15.06 94.32 11.43.35 17.77-80.41c5.89 4.64 19.24 15.77 19.24 15.77l7.25-2.3-19.62 89.33h.06l-1.44 6.31-.64 2.88 8.88 5.78c14.3-8.86 28.38-18 40.27-22.17 7.78-2.7 14.2-3.2 19.36-1.17 4.25 1.67 8.26 5.37 11.9 12.43-29.73 14.51-55.85 34.55-78.25 48.74-11.87 7.52-22.69 13.34-32 16-9.31 2.66-16.73 2.22-23.75-2.03zm-9.84 65.39v26l11.38 9.15-4.78 6.2.28 18.89 8.3 9.15 11.94 9.9-3.6-107.26-8.34 5.56-7.74 22.43h-7.44z"},"child":[]}]})(props);
}

var dist = {};

var hasRequiredDist;

function requireDist () {
	if (hasRequiredDist) return dist;
	hasRequiredDist = 1;
	Object.defineProperty(dist, "__esModule", { value: true });
	dist.parse = parse;
	dist.serialize = serialize;
	/**
	 * RegExp to match cookie-name in RFC 6265 sec 4.1.1
	 * This refers out to the obsoleted definition of token in RFC 2616 sec 2.2
	 * which has been replaced by the token definition in RFC 7230 appendix B.
	 *
	 * cookie-name       = token
	 * token             = 1*tchar
	 * tchar             = "!" / "#" / "$" / "%" / "&" / "'" /
	 *                     "*" / "+" / "-" / "." / "^" / "_" /
	 *                     "`" / "|" / "~" / DIGIT / ALPHA
	 *
	 * Note: Allowing more characters - https://github.com/jshttp/cookie/issues/191
	 * Allow same range as cookie value, except `=`, which delimits end of name.
	 */
	const cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
	/**
	 * RegExp to match cookie-value in RFC 6265 sec 4.1.1
	 *
	 * cookie-value      = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )
	 * cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
	 *                     ; US-ASCII characters excluding CTLs,
	 *                     ; whitespace DQUOTE, comma, semicolon,
	 *                     ; and backslash
	 *
	 * Allowing more characters: https://github.com/jshttp/cookie/issues/191
	 * Comma, backslash, and DQUOTE are not part of the parsing algorithm.
	 */
	const cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
	/**
	 * RegExp to match domain-value in RFC 6265 sec 4.1.1
	 *
	 * domain-value      = <subdomain>
	 *                     ; defined in [RFC1034], Section 3.5, as
	 *                     ; enhanced by [RFC1123], Section 2.1
	 * <subdomain>       = <label> | <subdomain> "." <label>
	 * <label>           = <let-dig> [ [ <ldh-str> ] <let-dig> ]
	 *                     Labels must be 63 characters or less.
	 *                     'let-dig' not 'letter' in the first char, per RFC1123
	 * <ldh-str>         = <let-dig-hyp> | <let-dig-hyp> <ldh-str>
	 * <let-dig-hyp>     = <let-dig> | "-"
	 * <let-dig>         = <letter> | <digit>
	 * <letter>          = any one of the 52 alphabetic characters A through Z in
	 *                     upper case and a through z in lower case
	 * <digit>           = any one of the ten digits 0 through 9
	 *
	 * Keep support for leading dot: https://github.com/jshttp/cookie/issues/173
	 *
	 * > (Note that a leading %x2E ("."), if present, is ignored even though that
	 * character is not permitted, but a trailing %x2E ("."), if present, will
	 * cause the user agent to ignore the attribute.)
	 */
	const domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
	/**
	 * RegExp to match path-value in RFC 6265 sec 4.1.1
	 *
	 * path-value        = <any CHAR except CTLs or ";">
	 * CHAR              = %x01-7F
	 *                     ; defined in RFC 5234 appendix B.1
	 */
	const pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
	const __toString = Object.prototype.toString;
	const NullObject = /* @__PURE__ */ (() => {
	    const C = function () { };
	    C.prototype = Object.create(null);
	    return C;
	})();
	/**
	 * Parse a cookie header.
	 *
	 * Parse the given cookie header string into an object
	 * The object has the various cookies as keys(names) => values
	 */
	function parse(str, options) {
	    const obj = new NullObject();
	    const len = str.length;
	    // RFC 6265 sec 4.1.1, RFC 2616 2.2 defines a cookie name consists of one char minimum, plus '='.
	    if (len < 2)
	        return obj;
	    const dec = options?.decode || decode;
	    let index = 0;
	    do {
	        const eqIdx = str.indexOf("=", index);
	        if (eqIdx === -1)
	            break; // No more cookie pairs.
	        const colonIdx = str.indexOf(";", index);
	        const endIdx = colonIdx === -1 ? len : colonIdx;
	        if (eqIdx > endIdx) {
	            // backtrack on prior semicolon
	            index = str.lastIndexOf(";", eqIdx - 1) + 1;
	            continue;
	        }
	        const keyStartIdx = startIndex(str, index, eqIdx);
	        const keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
	        const key = str.slice(keyStartIdx, keyEndIdx);
	        // only assign once
	        if (obj[key] === undefined) {
	            let valStartIdx = startIndex(str, eqIdx + 1, endIdx);
	            let valEndIdx = endIndex(str, endIdx, valStartIdx);
	            const value = dec(str.slice(valStartIdx, valEndIdx));
	            obj[key] = value;
	        }
	        index = endIdx + 1;
	    } while (index < len);
	    return obj;
	}
	function startIndex(str, index, max) {
	    do {
	        const code = str.charCodeAt(index);
	        if (code !== 0x20 /*   */ && code !== 0x09 /* \t */)
	            return index;
	    } while (++index < max);
	    return max;
	}
	function endIndex(str, index, min) {
	    while (index > min) {
	        const code = str.charCodeAt(--index);
	        if (code !== 0x20 /*   */ && code !== 0x09 /* \t */)
	            return index + 1;
	    }
	    return min;
	}
	/**
	 * Serialize data into a cookie header.
	 *
	 * Serialize a name value pair into a cookie string suitable for
	 * http headers. An optional options object specifies cookie parameters.
	 *
	 * serialize('foo', 'bar', { httpOnly: true })
	 *   => "foo=bar; httpOnly"
	 */
	function serialize(name, val, options) {
	    const enc = options?.encode || encodeURIComponent;
	    if (!cookieNameRegExp.test(name)) {
	        throw new TypeError(`argument name is invalid: ${name}`);
	    }
	    const value = enc(val);
	    if (!cookieValueRegExp.test(value)) {
	        throw new TypeError(`argument val is invalid: ${val}`);
	    }
	    let str = name + "=" + value;
	    if (!options)
	        return str;
	    if (options.maxAge !== undefined) {
	        if (!Number.isInteger(options.maxAge)) {
	            throw new TypeError(`option maxAge is invalid: ${options.maxAge}`);
	        }
	        str += "; Max-Age=" + options.maxAge;
	    }
	    if (options.domain) {
	        if (!domainValueRegExp.test(options.domain)) {
	            throw new TypeError(`option domain is invalid: ${options.domain}`);
	        }
	        str += "; Domain=" + options.domain;
	    }
	    if (options.path) {
	        if (!pathValueRegExp.test(options.path)) {
	            throw new TypeError(`option path is invalid: ${options.path}`);
	        }
	        str += "; Path=" + options.path;
	    }
	    if (options.expires) {
	        if (!isDate(options.expires) ||
	            !Number.isFinite(options.expires.valueOf())) {
	            throw new TypeError(`option expires is invalid: ${options.expires}`);
	        }
	        str += "; Expires=" + options.expires.toUTCString();
	    }
	    if (options.httpOnly) {
	        str += "; HttpOnly";
	    }
	    if (options.secure) {
	        str += "; Secure";
	    }
	    if (options.partitioned) {
	        str += "; Partitioned";
	    }
	    if (options.priority) {
	        const priority = typeof options.priority === "string"
	            ? options.priority.toLowerCase()
	            : undefined;
	        switch (priority) {
	            case "low":
	                str += "; Priority=Low";
	                break;
	            case "medium":
	                str += "; Priority=Medium";
	                break;
	            case "high":
	                str += "; Priority=High";
	                break;
	            default:
	                throw new TypeError(`option priority is invalid: ${options.priority}`);
	        }
	    }
	    if (options.sameSite) {
	        const sameSite = typeof options.sameSite === "string"
	            ? options.sameSite.toLowerCase()
	            : options.sameSite;
	        switch (sameSite) {
	            case true:
	            case "strict":
	                str += "; SameSite=Strict";
	                break;
	            case "lax":
	                str += "; SameSite=Lax";
	                break;
	            case "none":
	                str += "; SameSite=None";
	                break;
	            default:
	                throw new TypeError(`option sameSite is invalid: ${options.sameSite}`);
	        }
	    }
	    return str;
	}
	/**
	 * URL-decode string value. Optimized to skip native call when no %.
	 */
	function decode(str) {
	    if (str.indexOf("%") === -1)
	        return str;
	    try {
	        return decodeURIComponent(str);
	    }
	    catch (e) {
	        return str;
	    }
	}
	/**
	 * Determine if value is a Date.
	 */
	function isDate(val) {
	    return __toString.call(val) === "[object Date]";
	}
	
	return dist;
}

requireDist();

var PopStateEventType = "popstate";
function createBrowserHistory(options = {}) {
  function createBrowserLocation(window2, globalHistory) {
    let { pathname, search, hash } = window2.location;
    return createLocation(
      "",
      { pathname, search, hash },
      // state defaults to `null` because `window.history.state` does
      globalHistory.state && globalHistory.state.usr || null,
      globalHistory.state && globalHistory.state.key || "default"
    );
  }
  function createBrowserHref(window2, to) {
    return typeof to === "string" ? to : createPath(to);
  }
  return getUrlBasedHistory(
    createBrowserLocation,
    createBrowserHref,
    null,
    options
  );
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined") console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
}
function createKey() {
  return Math.random().toString(36).substring(2, 10);
}
function getHistoryState(location, index) {
  return {
    usr: location.state,
    key: location.key,
    idx: index
  };
}
function createLocation(current, to, state = null, key) {
  let location = {
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: "",
    ...typeof to === "string" ? parsePath(to) : to,
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey()
  };
  return location;
}
function createPath({
  pathname = "/",
  search = "",
  hash = ""
}) {
  if (search && search !== "?")
    pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#")
    pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substring(hashIndex);
      path = path.substring(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substring(searchIndex);
      path = path.substring(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref2, validateLocation, options = {}) {
  let { window: window2 = document.defaultView, v5Compat = false } = options;
  let globalHistory = window2.history;
  let action = "POP";
  let listener = null;
  let index = getIndex();
  if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, "");
  }
  function getIndex() {
    let state = globalHistory.state || { idx: null };
    return state.idx;
  }
  function handlePop() {
    action = "POP";
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index;
    index = nextIndex;
    if (listener) {
      listener({ action, location: history.location, delta });
    }
  }
  function push(to, state) {
    action = "PUSH";
    let location = createLocation(history.location, to, state);
    index = getIndex() + 1;
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      if (error instanceof DOMException && error.name === "DataCloneError") {
        throw error;
      }
      window2.location.assign(url);
    }
    if (v5Compat && listener) {
      listener({ action, location: history.location, delta: 1 });
    }
  }
  function replace2(to, state) {
    action = "REPLACE";
    let location = createLocation(history.location, to, state);
    index = getIndex();
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    globalHistory.replaceState(historyState, "", url);
    if (v5Compat && listener) {
      listener({ action, location: history.location, delta: 0 });
    }
  }
  function createURL(to) {
    return createBrowserURLImpl(to);
  }
  let history = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window2, globalHistory);
    },
    listen(fn) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window2.addEventListener(PopStateEventType, handlePop);
      listener = fn;
      return () => {
        window2.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to) {
      return createHref2(window2, to);
    },
    createURL,
    encodeLocation(to) {
      let url = createURL(to);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash
      };
    },
    push,
    replace: replace2,
    go(n) {
      return globalHistory.go(n);
    }
  };
  return history;
}
function createBrowserURLImpl(to, isAbsolute = false) {
  let base = "http://localhost";
  if (typeof window !== "undefined") {
    base = window.location.origin !== "null" ? window.location.origin : window.location.href;
  }
  invariant(base, "No window.location.(origin|href) available to create URL");
  let href2 = typeof to === "string" ? to : createPath(to);
  href2 = href2.replace(/ $/, "%20");
  if (!isAbsolute && href2.startsWith("//")) {
    href2 = base + href2;
  }
  return new URL(href2, base);
}
function matchRoutes(routes, locationArg, basename = "/") {
  return matchRoutesImpl(routes, locationArg, basename, false);
}
function matchRoutesImpl(routes, locationArg, basename, allowPartial) {
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    let decoded = decodePath(pathname);
    matches = matchRouteBranch(
      branches[i],
      decoded,
      allowPartial
    );
  }
  return matches;
}
function flattenRoutes(routes, branches = [], parentsMeta = [], parentPath = "") {
  let flattenRoute = (route, index, relativePath) => {
    let meta = {
      relativePath: relativePath === void 0 ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      invariant(
        meta.relativePath.startsWith(parentPath),
        `Absolute route path "${meta.relativePath}" nested under path "${parentPath}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      );
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      invariant(
        // Our types know better, but runtime JS may not!
        // @ts-expect-error
        route.index !== true,
        `Index routes must not have child routes. Please remove all child routes from route path "${path}".`
      );
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index) => {
    if (route.path === "" || !route.path?.includes("?")) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, exploded);
      }
    }
  });
  return branches;
}
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0) return [];
  let [first, ...rest] = segments;
  let isOptional = first.endsWith("?");
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  result.push(
    ...restExploded.map(
      (subpath) => subpath === "" ? required : [required, subpath].join("/")
    )
  );
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map(
    (exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded
  );
}
function rankRouteBranches(branches) {
  branches.sort(
    (a, b) => a.score !== b.score ? b.score - a.score : compareIndexes(
      a.routesMeta.map((meta) => meta.childrenIndex),
      b.routesMeta.map((meta) => meta.childrenIndex)
    )
  );
}
var paramRe = /^:[\w-]+$/;
var dynamicSegmentValue = 3;
var indexRouteValue = 2;
var emptySegmentValue = 1;
var staticSegmentValue = 10;
var splatPenalty = -2;
var isSplat = (s) => s === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter((s) => !isSplat(s)).reduce(
    (score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue),
    initialScore
  );
}
function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  return siblings ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a[a.length - 1] - b[b.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function matchRouteBranch(branch, pathname, allowPartial = false) {
  let { routesMeta } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath(
      { path: meta.relativePath, caseSensitive: meta.caseSensitive, end },
      remainingPathname
    );
    let route = meta.route;
    if (!match && end && allowPartial && !routesMeta[routesMeta.length - 1].route.index) {
      match = matchPath(
        {
          path: meta.relativePath,
          caseSensitive: meta.caseSensitive,
          end: false
        },
        remainingPathname
      );
    }
    if (!match) {
      return null;
    }
    Object.assign(matchedParams, match.params);
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(
        joinPaths([matchedPathname, match.pathnameBase])
      ),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = { path: pattern, caseSensitive: false, end: true };
  }
  let [matcher, compiledParams] = compilePath(
    pattern.path,
    pattern.caseSensitive,
    pattern.end
  );
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce(
    (memo2, { paramName, isOptional }, index) => {
      if (paramName === "*") {
        let splatValue = captureGroups[index] || "";
        pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
      }
      const value = captureGroups[index];
      if (isOptional && !value) {
        memo2[paramName] = void 0;
      } else {
        memo2[paramName] = (value || "").replace(/%2F/g, "/");
      }
      return memo2;
    },
    {}
  );
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive = false, end = true) {
  warning(
    path === "*" || !path.endsWith("*") || path.endsWith("/*"),
    `Route path "${path}" will be treated as if it were "${path.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${path.replace(/\*$/, "/*")}".`
  );
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (_, paramName, isOptional) => {
      params.push({ paramName, isOptional: isOptional != null });
      return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
    }
  );
  if (path.endsWith("*")) {
    params.push({ paramName: "*" });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else ;
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map((v) => decodeURIComponent(v).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(
      false,
      `The URL path "${value}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${error}).`
    );
    return value;
  }
}
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
function resolvePath(to, fromPathname = "/") {
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname = toPathname ? toPathname.startsWith("/") ? toPathname : resolvePathname(toPathname, fromPathname) : fromPathname;
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach((segment) => {
    if (segment === "..") {
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return `Cannot include a '${char}' character in a manually specified \`to.${field}\` field [${JSON.stringify(
    path
  )}].  Please separate it out to the \`to.${dest}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function getPathContributingMatches(matches) {
  return matches.filter(
    (match, index) => index === 0 || match.route.path && match.route.path.length > 0
  );
}
function getResolveToMatches(matches) {
  let pathMatches = getPathContributingMatches(matches);
  return pathMatches.map(
    (match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase
  );
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative = false) {
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = { ...toArg };
    invariant(
      !to.pathname || !to.pathname.includes("?"),
      getInvalidPathError("?", "pathname", "search", to)
    );
    invariant(
      !to.pathname || !to.pathname.includes("#"),
      getInvalidPathError("#", "pathname", "hash", to)
    );
    invariant(
      !to.search || !to.search.includes("#"),
      getInvalidPathError("#", "search", "hash", to)
    );
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
var joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
var normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
var normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
var normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
var validMutationMethodsArr = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
new Set(
  validMutationMethodsArr
);
var validRequestMethodsArr = [
  "GET",
  ...validMutationMethodsArr
];
new Set(validRequestMethodsArr);
var DataRouterContext = reactExports.createContext(null);
DataRouterContext.displayName = "DataRouter";
var DataRouterStateContext = reactExports.createContext(null);
DataRouterStateContext.displayName = "DataRouterState";
var ViewTransitionContext = reactExports.createContext({
  isTransitioning: false
});
ViewTransitionContext.displayName = "ViewTransition";
var FetchersContext = reactExports.createContext(
  /* @__PURE__ */ new Map()
);
FetchersContext.displayName = "Fetchers";
var AwaitContext = reactExports.createContext(null);
AwaitContext.displayName = "Await";
var NavigationContext = reactExports.createContext(
  null
);
NavigationContext.displayName = "Navigation";
var LocationContext = reactExports.createContext(
  null
);
LocationContext.displayName = "Location";
var RouteContext = reactExports.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
RouteContext.displayName = "Route";
var RouteErrorContext = reactExports.createContext(null);
RouteErrorContext.displayName = "RouteError";
function useHref(to, { relative } = {}) {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useHref() may be used only in the context of a <Router> component.`
  );
  let { basename, navigator } = reactExports.useContext(NavigationContext);
  let { hash, pathname, search } = useResolvedPath(to, { relative });
  let joinedPathname = pathname;
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }
  return navigator.createHref({ pathname: joinedPathname, search, hash });
}
function useInRouterContext() {
  return reactExports.useContext(LocationContext) != null;
}
function useLocation() {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useLocation() may be used only in the context of a <Router> component.`
  );
  return reactExports.useContext(LocationContext).location;
}
var navigateEffectWarning = `You should call navigate() in a React.useEffect(), not when your component is first rendered.`;
function useIsomorphicLayoutEffect(cb) {
  let isStatic = reactExports.useContext(NavigationContext).static;
  if (!isStatic) {
    reactExports.useLayoutEffect(cb);
  }
}
function useNavigate() {
  let { isDataRoute } = reactExports.useContext(RouteContext);
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useNavigate() may be used only in the context of a <Router> component.`
  );
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  let { basename, navigator } = reactExports.useContext(NavigationContext);
  let { matches } = reactExports.useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches));
  let activeRef = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = reactExports.useCallback(
    (to, options = {}) => {
      warning(activeRef.current, navigateEffectWarning);
      if (!activeRef.current) return;
      if (typeof to === "number") {
        navigator.go(to);
        return;
      }
      let path = resolveTo(
        to,
        JSON.parse(routePathnamesJson),
        locationPathname,
        options.relative === "path"
      );
      if (dataRouterContext == null && basename !== "/") {
        path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
      }
      (!!options.replace ? navigator.replace : navigator.push)(
        path,
        options.state,
        options
      );
    },
    [
      basename,
      navigator,
      routePathnamesJson,
      locationPathname,
      dataRouterContext
    ]
  );
  return navigate;
}
var OutletContext = reactExports.createContext(null);
function useOutlet(context) {
  let outlet = reactExports.useContext(RouteContext).outlet;
  if (outlet) {
    return /* @__PURE__ */ reactExports.createElement(OutletContext.Provider, { value: context }, outlet);
  }
  return outlet;
}
function useParams() {
  let { matches } = reactExports.useContext(RouteContext);
  let routeMatch = matches[matches.length - 1];
  return routeMatch ? routeMatch.params : {};
}
function useResolvedPath(to, { relative } = {}) {
  let { matches } = reactExports.useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches));
  return reactExports.useMemo(
    () => resolveTo(
      to,
      JSON.parse(routePathnamesJson),
      locationPathname,
      relative === "path"
    ),
    [to, routePathnamesJson, locationPathname, relative]
  );
}
function useRoutes(routes, locationArg) {
  return useRoutesImpl(routes, locationArg);
}
function useRoutesImpl(routes, locationArg, dataRouterState, future) {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useRoutes() may be used only in the context of a <Router> component.`
  );
  let { navigator } = reactExports.useContext(NavigationContext);
  let { matches: parentMatches } = reactExports.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  let parentPathname = routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  let parentRoute = routeMatch && routeMatch.route;
  {
    let parentPath = parentRoute && parentRoute.path || "";
    warningOnce(
      parentPathname,
      !parentRoute || parentPath.endsWith("*") || parentPath.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${parentPathname}" (under <Route path="${parentPath}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${parentPath}"> to <Route path="${parentPath === "/" ? "*" : `${parentPath}/*`}">.`
    );
  }
  let locationFromContext = useLocation();
  let location;
  if (locationArg) {
    let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    invariant(
      parentPathnameBase === "/" || parsedLocationArg.pathname?.startsWith(parentPathnameBase),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${parentPathnameBase}" but pathname "${parsedLocationArg.pathname}" was given in the \`location\` prop.`
    );
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches = matchRoutes(routes, { pathname: remainingPathname });
  {
    warning(
      parentRoute || matches != null,
      `No routes matched location "${location.pathname}${location.search}${location.hash}" `
    );
    warning(
      matches == null || matches[matches.length - 1].route.element !== void 0 || matches[matches.length - 1].route.Component !== void 0 || matches[matches.length - 1].route.lazy !== void 0,
      `Matched leaf route at location "${location.pathname}${location.search}${location.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
    );
  }
  let renderedMatches = _renderMatches(
    matches && matches.map(
      (match) => Object.assign({}, match, {
        params: Object.assign({}, parentParams, match.params),
        pathname: joinPaths([
          parentPathnameBase,
          // Re-encode pathnames that were decoded inside matchRoutes
          navigator.encodeLocation ? navigator.encodeLocation(match.pathname).pathname : match.pathname
        ]),
        pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([
          parentPathnameBase,
          // Re-encode pathnames that were decoded inside matchRoutes
          navigator.encodeLocation ? navigator.encodeLocation(match.pathnameBase).pathname : match.pathnameBase
        ])
      })
    ),
    parentMatches,
    dataRouterState,
    future
  );
  if (locationArg && renderedMatches) {
    return /* @__PURE__ */ reactExports.createElement(
      LocationContext.Provider,
      {
        value: {
          location: {
            pathname: "/",
            search: "",
            hash: "",
            state: null,
            key: "default",
            ...location
          },
          navigationType: "POP"
          /* Pop */
        }
      },
      renderedMatches
    );
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = { padding: "0.5rem", backgroundColor: lightgrey };
  let codeStyles = { padding: "2px 4px", backgroundColor: lightgrey };
  let devInfo = null;
  {
    console.error(
      "Error handled by React Router default ErrorBoundary:",
      error
    );
    devInfo = /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ reactExports.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ reactExports.createElement("code", { style: codeStyles }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ reactExports.createElement("code", { style: codeStyles }, "errorElement"), " prop on your route."));
  }
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ reactExports.createElement("h3", { style: { fontStyle: "italic" } }, message), stack ? /* @__PURE__ */ reactExports.createElement("pre", { style: preStyles }, stack) : null, devInfo);
}
var defaultErrorElement = /* @__PURE__ */ reactExports.createElement(DefaultErrorComponent, null);
var RenderErrorBoundary = class extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }
    return {
      error: props.error !== void 0 ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error(
      "React Router caught the following error during render",
      error,
      errorInfo
    );
  }
  render() {
    return this.state.error !== void 0 ? /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, { value: this.props.routeContext }, /* @__PURE__ */ reactExports.createElement(
      RouteErrorContext.Provider,
      {
        value: this.state.error,
        children: this.props.component
      }
    )) : this.props.children;
  }
};
function RenderedRoute({ routeContext, match, children }) {
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, { value: routeContext }, children);
}
function _renderMatches(matches, parentMatches = [], dataRouterState = null, future = null) {
  if (matches == null) {
    if (!dataRouterState) {
      return null;
    }
    if (dataRouterState.errors) {
      matches = dataRouterState.matches;
    } else if (parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) {
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;
  let errors = dataRouterState?.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex(
      (m) => m.route.id && errors?.[m.route.id] !== void 0
    );
    invariant(
      errorIndex >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        errors
      ).join(",")}`
    );
    renderedMatches = renderedMatches.slice(
      0,
      Math.min(renderedMatches.length, errorIndex + 1)
    );
  }
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterState) {
    for (let i = 0; i < renderedMatches.length; i++) {
      let match = renderedMatches[i];
      if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
        fallbackIndex = i;
      }
      if (match.route.id) {
        let { loaderData, errors: errors2 } = dataRouterState;
        let needsToRunLoader = match.route.loader && !loaderData.hasOwnProperty(match.route.id) && (!errors2 || errors2[match.route.id] === void 0);
        if (match.route.lazy || needsToRunLoader) {
          renderFallback = true;
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  return renderedMatches.reduceRight((outlet, match, index) => {
    let error;
    let shouldRenderHydrateFallback = false;
    let errorElement = null;
    let hydrateFallbackElement = null;
    if (dataRouterState) {
      error = errors && match.route.id ? errors[match.route.id] : void 0;
      errorElement = match.route.errorElement || defaultErrorElement;
      if (renderFallback) {
        if (fallbackIndex < 0 && index === 0) {
          warningOnce(
            "route-fallback",
            false,
            "No `HydrateFallback` element provided to render during initial hydration"
          );
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = null;
        } else if (fallbackIndex === index) {
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = match.route.hydrateFallbackElement || null;
        }
      }
    }
    let matches2 = parentMatches.concat(renderedMatches.slice(0, index + 1));
    let getChildren = () => {
      let children;
      if (error) {
        children = errorElement;
      } else if (shouldRenderHydrateFallback) {
        children = hydrateFallbackElement;
      } else if (match.route.Component) {
        children = /* @__PURE__ */ reactExports.createElement(match.route.Component, null);
      } else if (match.route.element) {
        children = match.route.element;
      } else {
        children = outlet;
      }
      return /* @__PURE__ */ reactExports.createElement(
        RenderedRoute,
        {
          match,
          routeContext: {
            outlet,
            matches: matches2,
            isDataRoute: dataRouterState != null
          },
          children
        }
      );
    };
    return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /* @__PURE__ */ reactExports.createElement(
      RenderErrorBoundary,
      {
        location: dataRouterState.location,
        revalidation: dataRouterState.revalidation,
        component: errorElement,
        error,
        children: getChildren(),
        routeContext: { outlet: null, matches: matches2, isDataRoute: true }
      }
    ) : getChildren();
  }, null);
}
function getDataRouterConsoleError(hookName) {
  return `${hookName} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function useDataRouterContext(hookName) {
  let ctx = reactExports.useContext(DataRouterContext);
  invariant(ctx, getDataRouterConsoleError(hookName));
  return ctx;
}
function useDataRouterState(hookName) {
  let state = reactExports.useContext(DataRouterStateContext);
  invariant(state, getDataRouterConsoleError(hookName));
  return state;
}
function useRouteContext(hookName) {
  let route = reactExports.useContext(RouteContext);
  invariant(route, getDataRouterConsoleError(hookName));
  return route;
}
function useCurrentRouteId(hookName) {
  let route = useRouteContext(hookName);
  let thisRoute = route.matches[route.matches.length - 1];
  invariant(
    thisRoute.route.id,
    `${hookName} can only be used on routes that contain a unique "id"`
  );
  return thisRoute.route.id;
}
function useRouteId() {
  return useCurrentRouteId(
    "useRouteId"
    /* UseRouteId */
  );
}
function useRouteError() {
  let error = reactExports.useContext(RouteErrorContext);
  let state = useDataRouterState(
    "useRouteError"
    /* UseRouteError */
  );
  let routeId = useCurrentRouteId(
    "useRouteError"
    /* UseRouteError */
  );
  if (error !== void 0) {
    return error;
  }
  return state.errors?.[routeId];
}
function useNavigateStable() {
  let { router } = useDataRouterContext(
    "useNavigate"
    /* UseNavigateStable */
  );
  let id = useCurrentRouteId(
    "useNavigate"
    /* UseNavigateStable */
  );
  let activeRef = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = reactExports.useCallback(
    async (to, options = {}) => {
      warning(activeRef.current, navigateEffectWarning);
      if (!activeRef.current) return;
      if (typeof to === "number") {
        router.navigate(to);
      } else {
        await router.navigate(to, { fromRouteId: id, ...options });
      }
    },
    [router, id]
  );
  return navigate;
}
var alreadyWarned = {};
function warningOnce(key, cond, message) {
  if (!cond && !alreadyWarned[key]) {
    alreadyWarned[key] = true;
    warning(false, message);
  }
}
reactExports.memo(DataRoutes);
function DataRoutes({
  routes,
  future,
  state
}) {
  return useRoutesImpl(routes, void 0, state, future);
}
function Outlet(props) {
  return useOutlet(props.context);
}
function Route(_props) {
  invariant(
    false,
    `A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.`
  );
}
function Router({
  basename: basenameProp = "/",
  children = null,
  location: locationProp,
  navigationType = "POP",
  navigator,
  static: staticProp = false
}) {
  invariant(
    !useInRouterContext(),
    `You cannot render a <Router> inside another <Router>. You should never have more than one in your app.`
  );
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = reactExports.useMemo(
    () => ({
      basename,
      navigator,
      static: staticProp,
      future: {}
    }),
    [basename, navigator, staticProp]
  );
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = reactExports.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
  warning(
    locationContext != null,
    `<Router basename="${basename}"> is not able to match the URL "${pathname}${search}${hash}" because it does not start with the basename, so the <Router> won't render anything.`
  );
  if (locationContext == null) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(NavigationContext.Provider, { value: navigationContext }, /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, { children, value: locationContext }));
}
function Routes({
  children,
  location
}) {
  return useRoutes(createRoutesFromChildren(children), location);
}
function createRoutesFromChildren(children, parentPath = []) {
  let routes = [];
  reactExports.Children.forEach(children, (element, index) => {
    if (!reactExports.isValidElement(element)) {
      return;
    }
    let treePath = [...parentPath, index];
    if (element.type === reactExports.Fragment) {
      routes.push.apply(
        routes,
        createRoutesFromChildren(element.props.children, treePath)
      );
      return;
    }
    invariant(
      element.type === Route,
      `[${typeof element.type === "string" ? element.type : element.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    );
    invariant(
      !element.props.index || !element.props.children,
      "An index route cannot have child routes."
    );
    let route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      Component: element.props.Component,
      index: element.props.index,
      path: element.props.path,
      loader: element.props.loader,
      action: element.props.action,
      hydrateFallbackElement: element.props.hydrateFallbackElement,
      HydrateFallback: element.props.HydrateFallback,
      errorElement: element.props.errorElement,
      ErrorBoundary: element.props.ErrorBoundary,
      hasErrorBoundary: element.props.hasErrorBoundary === true || element.props.ErrorBoundary != null || element.props.errorElement != null,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle,
      lazy: element.props.lazy
    };
    if (element.props.children) {
      route.children = createRoutesFromChildren(
        element.props.children,
        treePath
      );
    }
    routes.push(route);
  });
  return routes;
}
var defaultMethod = "get";
var defaultEncType = "application/x-www-form-urlencoded";
function isHtmlElement(object) {
  return object != null && typeof object.tagName === "string";
}
function isButtonElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "button";
}
function isFormElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "form";
}
function isInputElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "input";
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && // Ignore everything but left clicks
  (!target || target === "_self") && // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event);
}
var _formDataSupportsSubmitter = null;
function isFormDataSubmitterSupported() {
  if (_formDataSupportsSubmitter === null) {
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      );
      _formDataSupportsSubmitter = false;
    } catch (e) {
      _formDataSupportsSubmitter = true;
    }
  }
  return _formDataSupportsSubmitter;
}
var supportedFormEncTypes = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function getFormEncType(encType) {
  if (encType != null && !supportedFormEncTypes.has(encType)) {
    warning(
      false,
      `"${encType}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${defaultEncType}"`
    );
    return null;
  }
  return encType;
}
function getFormSubmissionInfo(target, basename) {
  let method;
  let action;
  let encType;
  let formData;
  let body;
  if (isFormElement(target)) {
    let attr = target.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(target);
  } else if (isButtonElement(target) || isInputElement(target) && (target.type === "submit" || target.type === "image")) {
    let form = target.form;
    if (form == null) {
      throw new Error(
        `Cannot submit a <button> or <input type="submit"> without a <form>`
      );
    }
    let attr = target.getAttribute("formaction") || form.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("formmethod") || form.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("formenctype")) || getFormEncType(form.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(form, target);
    if (!isFormDataSubmitterSupported()) {
      let { name, type, value } = target;
      if (type === "image") {
        let prefix = name ? `${name}.` : "";
        formData.append(`${prefix}x`, "0");
        formData.append(`${prefix}y`, "0");
      } else if (name) {
        formData.append(name, value);
      }
    }
  } else if (isHtmlElement(target)) {
    throw new Error(
      `Cannot submit element that is not <form>, <button>, or <input type="submit|image">`
    );
  } else {
    method = defaultMethod;
    action = null;
    encType = defaultEncType;
    body = target;
  }
  if (formData && encType === "text/plain") {
    body = formData;
    formData = void 0;
  }
  return { action, method: method.toLowerCase(), encType, formData, body };
}
function invariant2(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
async function loadRouteModule(route, routeModulesCache) {
  if (route.id in routeModulesCache) {
    return routeModulesCache[route.id];
  }
  try {
    let routeModule = await import(
      /* @vite-ignore */
      /* webpackIgnore: true */
      route.module
    );
    routeModulesCache[route.id] = routeModule;
    return routeModule;
  } catch (error) {
    console.error(
      `Error loading route module \`${route.module}\`, reloading page...`
    );
    console.error(error);
    if (window.__reactRouterContext && window.__reactRouterContext.isSpaMode && // @ts-expect-error
    void 0) ;
    window.location.reload();
    return new Promise(() => {
    });
  }
}
function isHtmlLinkDescriptor(object) {
  if (object == null) {
    return false;
  }
  if (object.href == null) {
    return object.rel === "preload" && typeof object.imageSrcSet === "string" && typeof object.imageSizes === "string";
  }
  return typeof object.rel === "string" && typeof object.href === "string";
}
async function getKeyedPrefetchLinks(matches, manifest, routeModules) {
  let links = await Promise.all(
    matches.map(async (match) => {
      let route = manifest.routes[match.route.id];
      if (route) {
        let mod = await loadRouteModule(route, routeModules);
        return mod.links ? mod.links() : [];
      }
      return [];
    })
  );
  return dedupeLinkDescriptors(
    links.flat(1).filter(isHtmlLinkDescriptor).filter((link) => link.rel === "stylesheet" || link.rel === "preload").map(
      (link) => link.rel === "stylesheet" ? { ...link, rel: "prefetch", as: "style" } : { ...link, rel: "prefetch" }
    )
  );
}
function getNewMatchesForLinks(page, nextMatches, currentMatches, manifest, location, mode) {
  let isNew = (match, index) => {
    if (!currentMatches[index]) return true;
    return match.route.id !== currentMatches[index].route.id;
  };
  let matchPathChanged = (match, index) => {
    return (
      // param change, /users/123 -> /users/456
      currentMatches[index].pathname !== match.pathname || // splat param changed, which is not present in match.path
      // e.g. /files/images/avatar.jpg -> files/finances.xls
      currentMatches[index].route.path?.endsWith("*") && currentMatches[index].params["*"] !== match.params["*"]
    );
  };
  if (mode === "assets") {
    return nextMatches.filter(
      (match, index) => isNew(match, index) || matchPathChanged(match, index)
    );
  }
  if (mode === "data") {
    return nextMatches.filter((match, index) => {
      let manifestRoute = manifest.routes[match.route.id];
      if (!manifestRoute || !manifestRoute.hasLoader) {
        return false;
      }
      if (isNew(match, index) || matchPathChanged(match, index)) {
        return true;
      }
      if (match.route.shouldRevalidate) {
        let routeChoice = match.route.shouldRevalidate({
          currentUrl: new URL(
            location.pathname + location.search + location.hash,
            window.origin
          ),
          currentParams: currentMatches[0]?.params || {},
          nextUrl: new URL(page, window.origin),
          nextParams: match.params,
          defaultShouldRevalidate: true
        });
        if (typeof routeChoice === "boolean") {
          return routeChoice;
        }
      }
      return true;
    });
  }
  return [];
}
function getModuleLinkHrefs(matches, manifest, { includeHydrateFallback } = {}) {
  return dedupeHrefs(
    matches.map((match) => {
      let route = manifest.routes[match.route.id];
      if (!route) return [];
      let hrefs = [route.module];
      if (route.clientActionModule) {
        hrefs = hrefs.concat(route.clientActionModule);
      }
      if (route.clientLoaderModule) {
        hrefs = hrefs.concat(route.clientLoaderModule);
      }
      if (includeHydrateFallback && route.hydrateFallbackModule) {
        hrefs = hrefs.concat(route.hydrateFallbackModule);
      }
      if (route.imports) {
        hrefs = hrefs.concat(route.imports);
      }
      return hrefs;
    }).flat(1)
  );
}
function dedupeHrefs(hrefs) {
  return [...new Set(hrefs)];
}
function sortKeys(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}
function dedupeLinkDescriptors(descriptors, preloads) {
  let set = /* @__PURE__ */ new Set();
  new Set(preloads);
  return descriptors.reduce((deduped, descriptor) => {
    let key = JSON.stringify(sortKeys(descriptor));
    if (!set.has(key)) {
      set.add(key);
      deduped.push({ key, link: descriptor });
    }
    return deduped;
  }, []);
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var NO_BODY_STATUS_CODES = /* @__PURE__ */ new Set([100, 101, 204, 205]);
function singleFetchUrl(reqUrl, basename) {
  let url = typeof reqUrl === "string" ? new URL(
    reqUrl,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window === "undefined" ? "server://singlefetch/" : window.location.origin
  ) : reqUrl;
  if (url.pathname === "/") {
    url.pathname = "_root.data";
  } else if (basename && stripBasename(url.pathname, basename) === "/") {
    url.pathname = `${basename.replace(/\/$/, "")}/_root.data`;
  } else {
    url.pathname = `${url.pathname.replace(/\/$/, "")}.data`;
  }
  return url;
}
function useDataRouterContext2() {
  let context = reactExports.useContext(DataRouterContext);
  invariant2(
    context,
    "You must render this element inside a <DataRouterContext.Provider> element"
  );
  return context;
}
function useDataRouterStateContext() {
  let context = reactExports.useContext(DataRouterStateContext);
  invariant2(
    context,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  );
  return context;
}
var FrameworkContext = reactExports.createContext(void 0);
FrameworkContext.displayName = "FrameworkContext";
function useFrameworkContext() {
  let context = reactExports.useContext(FrameworkContext);
  invariant2(
    context,
    "You must render this element inside a <HydratedRouter> element"
  );
  return context;
}
function usePrefetchBehavior(prefetch, theirElementProps) {
  let frameworkContext = reactExports.useContext(FrameworkContext);
  let [maybePrefetch, setMaybePrefetch] = reactExports.useState(false);
  let [shouldPrefetch, setShouldPrefetch] = reactExports.useState(false);
  let { onFocus, onBlur, onMouseEnter, onMouseLeave, onTouchStart } = theirElementProps;
  let ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (prefetch === "render") {
      setShouldPrefetch(true);
    }
    if (prefetch === "viewport") {
      let callback = (entries) => {
        entries.forEach((entry) => {
          setShouldPrefetch(entry.isIntersecting);
        });
      };
      let observer = new IntersectionObserver(callback, { threshold: 0.5 });
      if (ref.current) observer.observe(ref.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [prefetch]);
  reactExports.useEffect(() => {
    if (maybePrefetch) {
      let id = setTimeout(() => {
        setShouldPrefetch(true);
      }, 100);
      return () => {
        clearTimeout(id);
      };
    }
  }, [maybePrefetch]);
  let setIntent = () => {
    setMaybePrefetch(true);
  };
  let cancelIntent = () => {
    setMaybePrefetch(false);
    setShouldPrefetch(false);
  };
  if (!frameworkContext) {
    return [false, ref, {}];
  }
  if (prefetch !== "intent") {
    return [shouldPrefetch, ref, {}];
  }
  return [
    shouldPrefetch,
    ref,
    {
      onFocus: composeEventHandlers(onFocus, setIntent),
      onBlur: composeEventHandlers(onBlur, cancelIntent),
      onMouseEnter: composeEventHandlers(onMouseEnter, setIntent),
      onMouseLeave: composeEventHandlers(onMouseLeave, cancelIntent),
      onTouchStart: composeEventHandlers(onTouchStart, setIntent)
    }
  ];
}
function composeEventHandlers(theirHandler, ourHandler) {
  return (event) => {
    theirHandler && theirHandler(event);
    if (!event.defaultPrevented) {
      ourHandler(event);
    }
  };
}
function PrefetchPageLinks({
  page,
  ...dataLinkProps
}) {
  let { router } = useDataRouterContext2();
  let matches = reactExports.useMemo(
    () => matchRoutes(router.routes, page, router.basename),
    [router.routes, page, router.basename]
  );
  if (!matches) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(PrefetchPageLinksImpl, { page, matches, ...dataLinkProps });
}
function useKeyedPrefetchLinks(matches) {
  let { manifest, routeModules } = useFrameworkContext();
  let [keyedPrefetchLinks, setKeyedPrefetchLinks] = reactExports.useState([]);
  reactExports.useEffect(() => {
    let interrupted = false;
    void getKeyedPrefetchLinks(matches, manifest, routeModules).then(
      (links) => {
        if (!interrupted) {
          setKeyedPrefetchLinks(links);
        }
      }
    );
    return () => {
      interrupted = true;
    };
  }, [matches, manifest, routeModules]);
  return keyedPrefetchLinks;
}
function PrefetchPageLinksImpl({
  page,
  matches: nextMatches,
  ...linkProps
}) {
  let location = useLocation();
  let { manifest, routeModules } = useFrameworkContext();
  let { basename } = useDataRouterContext2();
  let { loaderData, matches } = useDataRouterStateContext();
  let newMatchesForData = reactExports.useMemo(
    () => getNewMatchesForLinks(
      page,
      nextMatches,
      matches,
      manifest,
      location,
      "data"
    ),
    [page, nextMatches, matches, manifest, location]
  );
  let newMatchesForAssets = reactExports.useMemo(
    () => getNewMatchesForLinks(
      page,
      nextMatches,
      matches,
      manifest,
      location,
      "assets"
    ),
    [page, nextMatches, matches, manifest, location]
  );
  let dataHrefs = reactExports.useMemo(() => {
    if (page === location.pathname + location.search + location.hash) {
      return [];
    }
    let routesParams = /* @__PURE__ */ new Set();
    let foundOptOutRoute = false;
    nextMatches.forEach((m) => {
      let manifestRoute = manifest.routes[m.route.id];
      if (!manifestRoute || !manifestRoute.hasLoader) {
        return;
      }
      if (!newMatchesForData.some((m2) => m2.route.id === m.route.id) && m.route.id in loaderData && routeModules[m.route.id]?.shouldRevalidate) {
        foundOptOutRoute = true;
      } else if (manifestRoute.hasClientLoader) {
        foundOptOutRoute = true;
      } else {
        routesParams.add(m.route.id);
      }
    });
    if (routesParams.size === 0) {
      return [];
    }
    let url = singleFetchUrl(page, basename);
    if (foundOptOutRoute && routesParams.size > 0) {
      url.searchParams.set(
        "_routes",
        nextMatches.filter((m) => routesParams.has(m.route.id)).map((m) => m.route.id).join(",")
      );
    }
    return [url.pathname + url.search];
  }, [
    basename,
    loaderData,
    location,
    manifest,
    newMatchesForData,
    nextMatches,
    page,
    routeModules
  ]);
  let moduleHrefs = reactExports.useMemo(
    () => getModuleLinkHrefs(newMatchesForAssets, manifest),
    [newMatchesForAssets, manifest]
  );
  let keyedPrefetchLinks = useKeyedPrefetchLinks(newMatchesForAssets);
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, dataHrefs.map((href2) => /* @__PURE__ */ reactExports.createElement("link", { key: href2, rel: "prefetch", as: "fetch", href: href2, ...linkProps })), moduleHrefs.map((href2) => /* @__PURE__ */ reactExports.createElement("link", { key: href2, rel: "modulepreload", href: href2, ...linkProps })), keyedPrefetchLinks.map(({ key, link }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ reactExports.createElement("link", { key, ...link })
  )));
}
function mergeRefs(...refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}
var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
try {
  if (isBrowser) {
    window.__reactRouterVersion = "7.6.3";
  }
} catch (e) {
}
function BrowserRouter({
  basename,
  children,
  window: window2
}) {
  let historyRef = reactExports.useRef();
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({ window: window2, v5Compat: true });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = reactExports.useState({
    action: history.action,
    location: history.location
  });
  let setState = reactExports.useCallback(
    (newState) => {
      reactExports.startTransition(() => setStateImpl(newState));
    },
    [setStateImpl]
  );
  reactExports.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /* @__PURE__ */ reactExports.createElement(
    Router,
    {
      basename,
      children,
      location: state.location,
      navigationType: state.action,
      navigator: history
    }
  );
}
var ABSOLUTE_URL_REGEX2 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
var Link = reactExports.forwardRef(
  function LinkWithRef({
    onClick,
    discover = "render",
    prefetch = "none",
    relative,
    reloadDocument,
    replace: replace2,
    state,
    target,
    to,
    preventScrollReset,
    viewTransition,
    ...rest
  }, forwardedRef) {
    let { basename } = reactExports.useContext(NavigationContext);
    let isAbsolute = typeof to === "string" && ABSOLUTE_URL_REGEX2.test(to);
    let absoluteHref;
    let isExternal = false;
    if (typeof to === "string" && isAbsolute) {
      absoluteHref = to;
      if (isBrowser) {
        try {
          let currentUrl = new URL(window.location.href);
          let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
          let path = stripBasename(targetUrl.pathname, basename);
          if (targetUrl.origin === currentUrl.origin && path != null) {
            to = path + targetUrl.search + targetUrl.hash;
          } else {
            isExternal = true;
          }
        } catch (e) {
          warning(
            false,
            `<Link to="${to}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
          );
        }
      }
    }
    let href2 = useHref(to, { relative });
    let [shouldPrefetch, prefetchRef, prefetchHandlers] = usePrefetchBehavior(
      prefetch,
      rest
    );
    let internalOnClick = useLinkClickHandler(to, {
      replace: replace2,
      state,
      target,
      preventScrollReset,
      relative,
      viewTransition
    });
    function handleClick(event) {
      if (onClick) onClick(event);
      if (!event.defaultPrevented) {
        internalOnClick(event);
      }
    }
    let link = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ reactExports.createElement(
        "a",
        {
          ...rest,
          ...prefetchHandlers,
          href: absoluteHref || href2,
          onClick: isExternal || reloadDocument ? onClick : handleClick,
          ref: mergeRefs(forwardedRef, prefetchRef),
          target,
          "data-discover": !isAbsolute && discover === "render" ? "true" : void 0
        }
      )
    );
    return shouldPrefetch && !isAbsolute ? /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, link, /* @__PURE__ */ reactExports.createElement(PrefetchPageLinks, { page: href2 })) : link;
  }
);
Link.displayName = "Link";
var NavLink = reactExports.forwardRef(
  function NavLinkWithRef({
    "aria-current": ariaCurrentProp = "page",
    caseSensitive = false,
    className: classNameProp = "",
    end = false,
    style: styleProp,
    to,
    viewTransition,
    children,
    ...rest
  }, ref) {
    let path = useResolvedPath(to, { relative: rest.relative });
    let location = useLocation();
    let routerState = reactExports.useContext(DataRouterStateContext);
    let { navigator, basename } = reactExports.useContext(NavigationContext);
    let isTransitioning = routerState != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useViewTransitionState(path) && viewTransition === true;
    let toPathname = navigator.encodeLocation ? navigator.encodeLocation(path).pathname : path.pathname;
    let locationPathname = location.pathname;
    let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
    if (!caseSensitive) {
      locationPathname = locationPathname.toLowerCase();
      nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
      toPathname = toPathname.toLowerCase();
    }
    if (nextLocationPathname && basename) {
      nextLocationPathname = stripBasename(nextLocationPathname, basename) || nextLocationPathname;
    }
    const endSlashPosition = toPathname !== "/" && toPathname.endsWith("/") ? toPathname.length - 1 : toPathname.length;
    let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(endSlashPosition) === "/";
    let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
    let renderProps = {
      isActive,
      isPending,
      isTransitioning
    };
    let ariaCurrent = isActive ? ariaCurrentProp : void 0;
    let className;
    if (typeof classNameProp === "function") {
      className = classNameProp(renderProps);
    } else {
      className = [
        classNameProp,
        isActive ? "active" : null,
        isPending ? "pending" : null,
        isTransitioning ? "transitioning" : null
      ].filter(Boolean).join(" ");
    }
    let style = typeof styleProp === "function" ? styleProp(renderProps) : styleProp;
    return /* @__PURE__ */ reactExports.createElement(
      Link,
      {
        ...rest,
        "aria-current": ariaCurrent,
        className,
        ref,
        style,
        to,
        viewTransition
      },
      typeof children === "function" ? children(renderProps) : children
    );
  }
);
NavLink.displayName = "NavLink";
var Form = reactExports.forwardRef(
  ({
    discover = "render",
    fetcherKey,
    navigate,
    reloadDocument,
    replace: replace2,
    state,
    method = defaultMethod,
    action,
    onSubmit,
    relative,
    preventScrollReset,
    viewTransition,
    ...props
  }, forwardedRef) => {
    let submit = useSubmit();
    let formAction = useFormAction(action, { relative });
    let formMethod = method.toLowerCase() === "get" ? "get" : "post";
    let isAbsolute = typeof action === "string" && ABSOLUTE_URL_REGEX2.test(action);
    let submitHandler = (event) => {
      onSubmit && onSubmit(event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      let submitter = event.nativeEvent.submitter;
      let submitMethod = submitter?.getAttribute("formmethod") || method;
      submit(submitter || event.currentTarget, {
        fetcherKey,
        method: submitMethod,
        navigate,
        replace: replace2,
        state,
        relative,
        preventScrollReset,
        viewTransition
      });
    };
    return /* @__PURE__ */ reactExports.createElement(
      "form",
      {
        ref: forwardedRef,
        method: formMethod,
        action: formAction,
        onSubmit: reloadDocument ? onSubmit : submitHandler,
        ...props,
        "data-discover": !isAbsolute && discover === "render" ? "true" : void 0
      }
    );
  }
);
Form.displayName = "Form";
function getDataRouterConsoleError2(hookName) {
  return `${hookName} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function useDataRouterContext3(hookName) {
  let ctx = reactExports.useContext(DataRouterContext);
  invariant(ctx, getDataRouterConsoleError2(hookName));
  return ctx;
}
function useLinkClickHandler(to, {
  target,
  replace: replaceProp,
  state,
  preventScrollReset,
  relative,
  viewTransition
} = {}) {
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to, { relative });
  return reactExports.useCallback(
    (event) => {
      if (shouldProcessLinkClick(event, target)) {
        event.preventDefault();
        let replace2 = replaceProp !== void 0 ? replaceProp : createPath(location) === createPath(path);
        navigate(to, {
          replace: replace2,
          state,
          preventScrollReset,
          relative,
          viewTransition
        });
      }
    },
    [
      location,
      navigate,
      path,
      replaceProp,
      state,
      target,
      to,
      preventScrollReset,
      relative,
      viewTransition
    ]
  );
}
var fetcherId = 0;
var getUniqueFetcherId = () => `__${String(++fetcherId)}__`;
function useSubmit() {
  let { router } = useDataRouterContext3(
    "useSubmit"
    /* UseSubmit */
  );
  let { basename } = reactExports.useContext(NavigationContext);
  let currentRouteId = useRouteId();
  return reactExports.useCallback(
    async (target, options = {}) => {
      let { action, method, encType, formData, body } = getFormSubmissionInfo(
        target,
        basename
      );
      if (options.navigate === false) {
        let key = options.fetcherKey || getUniqueFetcherId();
        await router.fetch(key, currentRouteId, options.action || action, {
          preventScrollReset: options.preventScrollReset,
          formData,
          body,
          formMethod: options.method || method,
          formEncType: options.encType || encType,
          flushSync: options.flushSync
        });
      } else {
        await router.navigate(options.action || action, {
          preventScrollReset: options.preventScrollReset,
          formData,
          body,
          formMethod: options.method || method,
          formEncType: options.encType || encType,
          replace: options.replace,
          state: options.state,
          fromRouteId: currentRouteId,
          flushSync: options.flushSync,
          viewTransition: options.viewTransition
        });
      }
    },
    [router, basename, currentRouteId]
  );
}
function useFormAction(action, { relative } = {}) {
  let { basename } = reactExports.useContext(NavigationContext);
  let routeContext = reactExports.useContext(RouteContext);
  invariant(routeContext, "useFormAction must be used inside a RouteContext");
  let [match] = routeContext.matches.slice(-1);
  let path = { ...useResolvedPath(action ? action : ".", { relative }) };
  let location = useLocation();
  if (action == null) {
    path.search = location.search;
    let params = new URLSearchParams(path.search);
    let indexValues = params.getAll("index");
    let hasNakedIndexParam = indexValues.some((v) => v === "");
    if (hasNakedIndexParam) {
      params.delete("index");
      indexValues.filter((v) => v).forEach((v) => params.append("index", v));
      let qs = params.toString();
      path.search = qs ? `?${qs}` : "";
    }
  }
  if ((!action || action === ".") && match.route.index) {
    path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
  }
  if (basename !== "/") {
    path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
  }
  return createPath(path);
}
function useViewTransitionState(to, opts = {}) {
  let vtContext = reactExports.useContext(ViewTransitionContext);
  invariant(
    vtContext != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename } = useDataRouterContext3(
    "useViewTransitionState"
    /* useViewTransitionState */
  );
  let path = useResolvedPath(to, { relative: opts.relative });
  if (!vtContext.isTransitioning) {
    return false;
  }
  let currentPath = stripBasename(vtContext.currentLocation.pathname, basename) || vtContext.currentLocation.pathname;
  let nextPath = stripBasename(vtContext.nextLocation.pathname, basename) || vtContext.nextLocation.pathname;
  return matchPath(path.pathname, nextPath) != null || matchPath(path.pathname, currentPath) != null;
}
/* @__PURE__ */ new Set([
  ...NO_BODY_STATUS_CODES,
  304
]);

function App() {
  const navigate = useNavigate();
  const [selectedHero, setSelectedHero] = reactExports.useState(null);
  const [showHeroModal, setShowHeroModal] = reactExports.useState(false);
  const startGame = () => {
    navigate(`/game/${selectedHero.id}`);
    setShowHeroModal(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "intro-wrapper", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w100 df aic jcc pd-20 navbar", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w100 df aic jcsb", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Battle of Chaos" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "df aic gap-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("u", { children: "About Game" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("u", { children: "Token Info" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "df aic gap-15", children: [
          "Contact Us ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(RiTwitterXFill, {})
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w100 df aic jcc hero-section", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "df aic gap-20 hero-box", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: intro_hero, className: "hero-image", alt: "Main Hero" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "df fdc gap-15 hero-text", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "SAVE THE TRENCHES FROM CHAOS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Sign in to pre-register now and prepare for the battle. Sign in to pre-register now and prepare for the battle" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "start-button", onClick: () => setShowHeroModal(true), children: "Start Game" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w100 df aic info-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "df fdc gap-20 text-content", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "GAME INFO" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "In KelChago, you're the last hope in trenches, fighting relentless battles against evil KQLs to save your crypto comrades. Wield your skills in this fast-paced game to outsmart and defeat the influencers threatening your digital domain!" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-image", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: map, alt: "Stage Preview" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w100 df aic fw jcc character-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w100 df fdc aic jcc gap-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(GiRaiseZombie, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Types of Enemies" })
      ] }),
      characters.map((char, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "character-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: char.image, alt: char.name, className: "character-image" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: char.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "role", children: char.role }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "role", children: char.description })
      ] }, index))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w100 df fdc aic token-real-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "$CHAOS Token Info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "token-mainbox", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "df aic jcsb token-top", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "df aic gap-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RiTwitterXFill, { size: 24 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "$CHAOS" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "copy-button",
              onClick: () => {
                navigator.clipboard.writeText("0x4cHa0s...beACh");
                alert("Address copied!");
              },
              children: "Copy"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "token-address", children: "0x4cHa0sDa3dBeAChBabeC0in291cDEaD" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "df aic jcsb token-stats", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-box", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label", children: "FDV" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "value", children: "$5.3M" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-box", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label", children: "Holders" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "value", children: "12,842" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-box", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label", children: "Supply" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "value", children: "1,000,000" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-box", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label", children: "Chain" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "value", children: "Solana" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "w100 df fdc aic footer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Made with 💛 on the pixel shores of KelChago" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "df gap-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", children: "Privacy Policy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", children: "Terms of Service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", children: "Discord" })
      ] })
    ] }),
    showHeroModal ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hero-modal", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Choose Your Hero" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hero-options", children: heros.map((hero, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `df fdc aic gap-10 hero-card ${selectedHero === hero && "active"}`,
          onClick: () => {
            setSelectedHero(hero);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: hero.image, alt: hero.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: hero.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: hero.role }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: hero.description })
          ]
        },
        index
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "start-buton",
          onClick: startGame,
          children: "Select and Play"
        }
      )
    ] }) : null
  ] });
}

var yi=Object.defineProperty;var i=(n,e)=>yi(n,"name",{value:e,configurable:true});var gr=(()=>{for(var n=new Uint8Array(128),e=0;e<64;e++)n[e<26?e+65:e<52?e+71:e<62?e-4:e*4-205]=e;return o=>{for(var c=o.length,g=new Uint8Array((c-(o[c-1]=="=")-(o[c-2]=="="))*3/4|0),m=0,P=0;m<c;){var I=n[o.charCodeAt(m++)],j=n[o.charCodeAt(m++)],y=n[o.charCodeAt(m++)],X=n[o.charCodeAt(m++)];g[P++]=I<<2|j>>4,g[P++]=j<<4|y>>2,g[P++]=y<<6|X;}return g}})();function Ge(n){return n*Math.PI/180}i(Ge,"deg2rad");function ot(n){return n*180/Math.PI}i(ot,"rad2deg");function Le(n,e,o){return e>o?Le(n,o,e):Math.min(Math.max(n,e),o)}i(Le,"clamp");function Ve(n,e,o){if(typeof n=="number"&&typeof e=="number")return n+(e-n)*o;if(n instanceof v&&e instanceof v)return n.lerp(e,o);if(n instanceof W&&e instanceof W)return n.lerp(e,o);throw new Error(`Bad value for lerp(): ${n}, ${e}. Only number, Vec2 and Color is supported.`)}i(Ve,"lerp");function _e(n,e,o,c,g){return c+(n-e)/(o-e)*(g-c)}i(_e,"map");function br(n,e,o,c,g){return Le(_e(n,e,o,c,g),c,g)}i(br,"mapc");var v=class n{static{i(this,"Vec2");}x=0;y=0;constructor(e=0,o=e){this.x=e,this.y=o;}static fromAngle(e){let o=Ge(e);return new n(Math.cos(o),Math.sin(o))}static LEFT=new n(-1,0);static RIGHT=new n(1,0);static UP=new n(0,-1);static DOWN=new n(0,1);clone(){return new n(this.x,this.y)}add(...e){let o=T(...e);return new n(this.x+o.x,this.y+o.y)}sub(...e){let o=T(...e);return new n(this.x-o.x,this.y-o.y)}scale(...e){let o=T(...e);return new n(this.x*o.x,this.y*o.y)}dist(...e){let o=T(...e);return this.sub(o).len()}sdist(...e){let o=T(...e);return this.sub(o).slen()}len(){return Math.sqrt(this.dot(this))}slen(){return this.dot(this)}unit(){let e=this.len();return e===0?new n(0):this.scale(1/e)}normal(){return new n(this.y,-this.x)}reflect(e){return this.sub(e.scale(2*this.dot(e)))}project(e){return e.scale(e.dot(this)/e.len())}reject(e){return this.sub(this.project(e))}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}angle(...e){let o=T(...e);return ot(Math.atan2(this.y-o.y,this.x-o.x))}angleBetween(...e){let o=T(...e);return ot(Math.atan2(this.cross(o),this.dot(o)))}lerp(e,o){return new n(Ve(this.x,e.x,o),Ve(this.y,e.y,o))}slerp(e,o){let c=this.dot(e),g=this.cross(e),m=Math.atan2(g,c);return this.scale(Math.sin((1-o)*m)).add(e.scale(Math.sin(o*m))).scale(1/g)}isZero(){return this.x===0&&this.y===0}toFixed(e){return new n(Number(this.x.toFixed(e)),Number(this.y.toFixed(e)))}transform(e){return e.multVec2(this)}eq(e){return this.x===e.x&&this.y===e.y}bbox(){return new de(this,0,0)}toString(){return `vec2(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`}};function T(...n){if(n.length===1){if(n[0]instanceof v)return new v(n[0].x,n[0].y);if(Array.isArray(n[0])&&n[0].length===2)return new v(...n[0])}return new v(...n)}i(T,"vec2");var W=class n{static{i(this,"Color");}r=255;g=255;b=255;constructor(e,o,c){this.r=Le(e,0,255),this.g=Le(o,0,255),this.b=Le(c,0,255);}static fromArray(e){return new n(e[0],e[1],e[2])}static fromHex(e){if(typeof e=="number")return new n(e>>16&255,e>>8&255,e>>0&255);if(typeof e=="string"){let o=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return new n(parseInt(o[1],16),parseInt(o[2],16),parseInt(o[3],16))}else throw new Error("Invalid hex color format")}static fromHSL(e,o,c){if(o==0)return new n(255*c,255*c,255*c);let g=i((X,S,q)=>(q<0&&(q+=1),q>1&&(q-=1),q<1/6?X+(S-X)*6*q:q<1/2?S:q<2/3?X+(S-X)*(2/3-q)*6:X),"hue2rgb"),m=c<.5?c*(1+o):c+o-c*o,P=2*c-m,I=g(P,m,e+1/3),j=g(P,m,e),y=g(P,m,e-1/3);return new n(Math.round(I*255),Math.round(j*255),Math.round(y*255))}static RED=new n(255,0,0);static GREEN=new n(0,255,0);static BLUE=new n(0,0,255);static YELLOW=new n(255,255,0);static MAGENTA=new n(255,0,255);static CYAN=new n(0,255,255);static WHITE=new n(255,255,255);static BLACK=new n(0,0,0);clone(){return new n(this.r,this.g,this.b)}lighten(e){return new n(this.r+e,this.g+e,this.b+e)}darken(e){return this.lighten(-e)}invert(){return new n(255-this.r,255-this.g,255-this.b)}mult(e){return new n(this.r*e.r/255,this.g*e.g/255,this.b*e.b/255)}lerp(e,o){return new n(Ve(this.r,e.r,o),Ve(this.g,e.g,o),Ve(this.b,e.b,o))}toHSL(){let e=this.r/255,o=this.g/255,c=this.b/255,g=Math.max(e,o,c),m=Math.min(e,o,c),P=(g+m)/2,I=P,j=P;if(g==m)P=I=0;else {let y=g-m;switch(I=j>.5?y/(2-g-m):y/(g+m),g){case e:P=(o-c)/y+(o<c?6:0);break;case o:P=(c-e)/y+2;break;case c:P=(e-o)/y+4;break}P/=6;}return [P,I,j]}eq(e){return this.r===e.r&&this.g===e.g&&this.b===e.b}toString(){return `rgb(${this.r}, ${this.g}, ${this.b})`}toHex(){return "#"+((1<<24)+(this.r<<16)+(this.g<<8)+this.b).toString(16).slice(1)}};function J(...n){if(n.length===0)return new W(255,255,255);if(n.length===1){if(n[0]instanceof W)return n[0].clone();if(typeof n[0]=="string")return W.fromHex(n[0]);if(Array.isArray(n[0])&&n[0].length===3)return W.fromArray(n[0])}return new W(...n)}i(J,"rgb");var vr=i((n,e,o)=>W.fromHSL(n,e,o),"hsl2rgb"),oe=class n{static{i(this,"Quad");}x=0;y=0;w=1;h=1;constructor(e,o,c,g){this.x=e,this.y=o,this.w=c,this.h=g;}scale(e){return new n(this.x+this.w*e.x,this.y+this.h*e.y,this.w*e.w,this.h*e.h)}pos(){return new v(this.x,this.y)}clone(){return new n(this.x,this.y,this.w,this.h)}eq(e){return this.x===e.x&&this.y===e.y&&this.w===e.w&&this.h===e.h}toString(){return `quad(${this.x}, ${this.y}, ${this.w}, ${this.h})`}};function ce(n,e,o,c){return new oe(n,e,o,c)}i(ce,"quad");var Ue=class n{static{i(this,"Mat4");}m=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];constructor(e){e&&(this.m=e);}static translate(e){return new n([1,0,0,0,0,1,0,0,0,0,1,0,e.x,e.y,0,1])}static scale(e){return new n([e.x,0,0,0,0,e.y,0,0,0,0,1,0,0,0,0,1])}static rotateX(e){e=Ge(-e);let o=Math.cos(e),c=Math.sin(e);return new n([1,0,0,0,0,o,-c,0,0,c,o,0,0,0,0,1])}static rotateY(e){e=Ge(-e);let o=Math.cos(e),c=Math.sin(e);return new n([o,0,c,0,0,1,0,0,-c,0,o,0,0,0,0,1])}static rotateZ(e){e=Ge(-e);let o=Math.cos(e),c=Math.sin(e);return new n([o,-c,0,0,c,o,0,0,0,0,1,0,0,0,0,1])}translate(e){return this.m[12]+=this.m[0]*e.x+this.m[4]*e.y,this.m[13]+=this.m[1]*e.x+this.m[5]*e.y,this.m[14]+=this.m[2]*e.x+this.m[6]*e.y,this.m[15]+=this.m[3]*e.x+this.m[7]*e.y,this}scale(e){return this.m[0]*=e.x,this.m[4]*=e.y,this.m[1]*=e.x,this.m[5]*=e.y,this.m[2]*=e.x,this.m[6]*=e.y,this.m[3]*=e.x,this.m[7]*=e.y,this}rotate(e){e=Ge(-e);let o=Math.cos(e),c=Math.sin(e),g=this.m[0],m=this.m[1],P=this.m[4],I=this.m[5];return this.m[0]=g*o+m*c,this.m[1]=-g*c+m*o,this.m[4]=P*o+I*c,this.m[5]=-P*c+I*o,this}mult(e){let o=[];for(let c=0;c<4;c++)for(let g=0;g<4;g++)o[c*4+g]=this.m[0*4+g]*e.m[c*4+0]+this.m[1*4+g]*e.m[c*4+1]+this.m[2*4+g]*e.m[c*4+2]+this.m[3*4+g]*e.m[c*4+3];return new n(o)}multVec2(e){return new v(e.x*this.m[0]+e.y*this.m[4]+this.m[12],e.x*this.m[1]+e.y*this.m[5]+this.m[13])}getTranslation(){return new v(this.m[12],this.m[13])}getScale(){if(this.m[0]!=0||this.m[1]!=0){let e=this.m[0]*this.m[5]-this.m[1]*this.m[4],o=Math.sqrt(this.m[0]*this.m[0]+this.m[1]*this.m[1]);return new v(o,e/o)}else if(this.m[4]!=0||this.m[5]!=0){let e=this.m[0]*this.m[5]-this.m[1]*this.m[4],o=Math.sqrt(this.m[4]*this.m[4]+this.m[5]*this.m[5]);return new v(e/o,o)}else return new v(0,0)}getRotation(){if(this.m[0]!=0||this.m[1]!=0){let e=Math.sqrt(this.m[0]*this.m[0]+this.m[1]*this.m[1]);return ot(this.m[1]>0?Math.acos(this.m[0]/e):-Math.acos(this.m[0]/e))}else if(this.m[4]!=0||this.m[5]!=0){let e=Math.sqrt(this.m[4]*this.m[4]+this.m[5]*this.m[5]);return ot(Math.PI/2-(this.m[5]>0?Math.acos(-this.m[4]/e):-Math.acos(this.m[4]/e)))}else return 0}getSkew(){if(this.m[0]!=0||this.m[1]!=0){let e=Math.sqrt(this.m[0]*this.m[0]+this.m[1]*this.m[1]);return new v(Math.atan(this.m[0]*this.m[4]+this.m[1]*this.m[5])/(e*e),0)}else if(this.m[4]!=0||this.m[5]!=0){let e=Math.sqrt(this.m[4]*this.m[4]+this.m[5]*this.m[5]);return new v(0,Math.atan(this.m[0]*this.m[4]+this.m[1]*this.m[5])/(e*e))}else return new v(0,0)}invert(){let e=[],o=this.m[10]*this.m[15]-this.m[14]*this.m[11],c=this.m[9]*this.m[15]-this.m[13]*this.m[11],g=this.m[9]*this.m[14]-this.m[13]*this.m[10],m=this.m[8]*this.m[15]-this.m[12]*this.m[11],P=this.m[8]*this.m[14]-this.m[12]*this.m[10],I=this.m[8]*this.m[13]-this.m[12]*this.m[9],j=this.m[6]*this.m[15]-this.m[14]*this.m[7],y=this.m[5]*this.m[15]-this.m[13]*this.m[7],X=this.m[5]*this.m[14]-this.m[13]*this.m[6],S=this.m[4]*this.m[15]-this.m[12]*this.m[7],q=this.m[4]*this.m[14]-this.m[12]*this.m[6],E=this.m[5]*this.m[15]-this.m[13]*this.m[7],K=this.m[4]*this.m[13]-this.m[12]*this.m[5],Q=this.m[6]*this.m[11]-this.m[10]*this.m[7],te=this.m[5]*this.m[11]-this.m[9]*this.m[7],k=this.m[5]*this.m[10]-this.m[9]*this.m[6],pe=this.m[4]*this.m[11]-this.m[8]*this.m[7],C=this.m[4]*this.m[10]-this.m[8]*this.m[6],Ae=this.m[4]*this.m[9]-this.m[8]*this.m[5];e[0]=this.m[5]*o-this.m[6]*c+this.m[7]*g,e[4]=-(this.m[4]*o-this.m[6]*m+this.m[7]*P),e[8]=this.m[4]*c-this.m[5]*m+this.m[7]*I,e[12]=-(this.m[4]*g-this.m[5]*P+this.m[6]*I),e[1]=-(this.m[1]*o-this.m[2]*c+this.m[3]*g),e[5]=this.m[0]*o-this.m[2]*m+this.m[3]*P,e[9]=-(this.m[0]*c-this.m[1]*m+this.m[3]*I),e[13]=this.m[0]*g-this.m[1]*P+this.m[2]*I,e[2]=this.m[1]*j-this.m[2]*y+this.m[3]*X,e[6]=-(this.m[0]*j-this.m[2]*S+this.m[3]*q),e[10]=this.m[0]*E-this.m[1]*S+this.m[3]*K,e[14]=-(this.m[0]*X-this.m[1]*q+this.m[2]*K),e[3]=-(this.m[1]*Q-this.m[2]*te+this.m[3]*k),e[7]=this.m[0]*Q-this.m[2]*pe+this.m[3]*C,e[11]=-(this.m[0]*te-this.m[1]*pe+this.m[3]*Ae),e[15]=this.m[0]*k-this.m[1]*C+this.m[2]*Ae;let $=this.m[0]*e[0]+this.m[1]*e[4]+this.m[2]*e[8]+this.m[3]*e[12];for(let Te=0;Te<4;Te++)for(let ye=0;ye<4;ye++)e[Te*4+ye]*=1/$;return new n(e)}clone(){return new n([...this.m])}toString(){return this.m.toString()}};function In(n,e,o,c=g=>-Math.cos(g)){return n+(c(o)+1)/2*(e-n)}i(In,"wave");var xi=1103515245,Ui=12345,wr=2147483648,bt=class{static{i(this,"RNG");}seed;constructor(e){this.seed=e;}gen(){return this.seed=(xi*this.seed+Ui)%wr,this.seed/wr}genNumber(e,o){return e+this.gen()*(o-e)}genVec2(e,o){return new v(this.genNumber(e.x,o.x),this.genNumber(e.y,o.y))}genColor(e,o){return new W(this.genNumber(e.r,o.r),this.genNumber(e.g,o.g),this.genNumber(e.b,o.b))}genAny(...e){if(e.length===0)return this.gen();if(e.length===1){if(typeof e[0]=="number")return this.genNumber(0,e[0]);if(e[0]instanceof v)return this.genVec2(T(0,0),e[0]);if(e[0]instanceof W)return this.genColor(J(0,0,0),e[0])}else if(e.length===2){if(typeof e[0]=="number"&&typeof e[1]=="number")return this.genNumber(e[0],e[1]);if(e[0]instanceof v&&e[1]instanceof v)return this.genVec2(e[0],e[1]);if(e[0]instanceof W&&e[1]instanceof W)return this.genColor(e[0],e[1])}}},Bn=new bt(Date.now());function yr(n){return n!=null&&(Bn.seed=n),Bn.seed}i(yr,"randSeed");function xt(...n){return Bn.genAny(...n)}i(xt,"rand");function Ln(...n){return Math.floor(xt(...n))}i(Ln,"randi");function xr(n){return xt()<=n}i(xr,"chance");function Ur(n){return n[Ln(n.length)]}i(Ur,"choose");function Er(n,e){return n.pos.x+n.width>e.pos.x&&n.pos.x<e.pos.x+e.width&&n.pos.y+n.height>e.pos.y&&n.pos.y<e.pos.y+e.height}i(Er,"testRectRect");function Ei(n,e){if(n.p1.x===n.p2.x&&n.p1.y===n.p2.y||e.p1.x===e.p2.x&&e.p1.y===e.p2.y)return null;let o=(e.p2.y-e.p1.y)*(n.p2.x-n.p1.x)-(e.p2.x-e.p1.x)*(n.p2.y-n.p1.y);if(o===0)return null;let c=((e.p2.x-e.p1.x)*(n.p1.y-e.p1.y)-(e.p2.y-e.p1.y)*(n.p1.x-e.p1.x))/o,g=((n.p2.x-n.p1.x)*(n.p1.y-e.p1.y)-(n.p2.y-n.p1.y)*(n.p1.x-e.p1.x))/o;return c<0||c>1||g<0||g>1?null:c}i(Ei,"testLineLineT");function it(n,e){let o=Ei(n,e);return o?T(n.p1.x+o*(n.p2.x-n.p1.x),n.p1.y+o*(n.p2.y-n.p1.y)):null}i(it,"testLineLine");function Sr(n,e){if(vt(n,e.p1)||vt(n,e.p2))return  true;let o=n.points();return !!it(e,new Ie(o[0],o[1]))||!!it(e,new Ie(o[1],o[2]))||!!it(e,new Ie(o[2],o[3]))||!!it(e,new Ie(o[3],o[0]))}i(Sr,"testRectLine");function vt(n,e){return e.x>n.pos.x&&e.x<n.pos.x+n.width&&e.y>n.pos.y&&e.y<n.pos.y+n.height}i(vt,"testRectPoint");function Cr(n,e){let o=e.sub(n.p1),c=n.p2.sub(n.p1);if(Math.abs(o.cross(c))>Number.EPSILON)return  false;let g=o.dot(c)/c.dot(c);return g>=0&&g<=1}i(Cr,"testLinePoint");function Vn(n,e){let o=n.p2.sub(n.p1),c=o.dot(o),g=n.p1.sub(e.center),m=2*o.dot(g),P=g.dot(g)-e.radius*e.radius,I=m*m-4*c*P;if(c<=Number.EPSILON||I<0)return  false;if(I==0){let j=-m/(2*c);if(j>=0&&j<=1)return  true}else {let j=(-m+Math.sqrt(I))/(2*c),y=(-m-Math.sqrt(I))/(2*c);if(j>=0&&j<=1||y>=0&&y<=1)return  true}return Ar(e,n.p1)}i(Vn,"testLineCircle");function Ar(n,e){return n.center.sdist(e)<n.radius*n.radius}i(Ar,"testCirclePoint");function Tr(n,e){let o=e.pts[e.pts.length-1];for(let c of e.pts){if(Vn(new Ie(o,c),n))return  true;o=c;}return Ar(n,e.pts[0])?true:_n(e,n.center)}i(Tr,"testCirclePolygon");function _n(n,e){let o=false,c=n.pts;for(let g=0,m=c.length-1;g<c.length;m=g++)c[g].y>e.y!=c[m].y>e.y&&e.x<(c[m].x-c[g].x)*(e.y-c[g].y)/(c[m].y-c[g].y)+c[g].x&&(o=!o);return o}i(_n,"testPolygonPoint");var Ie=class n{static{i(this,"Line");}p1;p2;constructor(e,o){this.p1=e.clone(),this.p2=o.clone();}transform(e){return new n(e.multVec2(this.p1),e.multVec2(this.p2))}bbox(){return de.fromPoints(this.p1,this.p2)}area(){return this.p1.dist(this.p2)}clone(){return new n(this.p1,this.p2)}},de=class n{static{i(this,"Rect");}pos;width;height;constructor(e,o,c){this.pos=e.clone(),this.width=o,this.height=c;}static fromPoints(e,o){return new n(e.clone(),o.x-e.x,o.y-e.y)}center(){return new v(this.pos.x+this.width/2,this.pos.y+this.height/2)}points(){return [this.pos,this.pos.add(this.width,0),this.pos.add(this.width,this.height),this.pos.add(0,this.height)]}transform(e){return new Ke(this.points().map(o=>e.multVec2(o)))}bbox(){return this.clone()}area(){return this.width*this.height}clone(){return new n(this.pos.clone(),this.width,this.height)}distToPoint(e){return Math.sqrt(this.sdistToPoint(e))}sdistToPoint(e){let o=this.pos,c=this.pos.add(this.width,this.height),g=Math.max(o.x-e.x,0,e.x-c.x),m=Math.max(o.y-e.y,0,e.y-c.y);return g*g+m*m}},yt=class n{static{i(this,"Circle");}center;radius;constructor(e,o){this.center=e.clone(),this.radius=o;}transform(e){return new Fn(this.center,this.radius,this.radius).transform(e)}bbox(){return de.fromPoints(this.center.sub(T(this.radius)),this.center.add(T(this.radius)))}area(){return this.radius*this.radius*Math.PI}clone(){return new n(this.center,this.radius)}},Fn=class n{static{i(this,"Ellipse");}center;radiusX;radiusY;constructor(e,o,c){this.center=e.clone(),this.radiusX=o,this.radiusY=c;}transform(e){return new n(e.multVec2(this.center),e.m[0]*this.radiusX,e.m[5]*this.radiusY)}bbox(){return de.fromPoints(this.center.sub(T(this.radiusX,this.radiusY)),this.center.add(T(this.radiusX,this.radiusY)))}area(){return this.radiusX*this.radiusY*Math.PI}clone(){return new n(this.center,this.radiusX,this.radiusY)}},Ke=class n{static{i(this,"Polygon");}pts;constructor(e){if(e.length<3)throw new Error("Polygons should have at least 3 vertices");this.pts=e;}transform(e){return new n(this.pts.map(o=>e.multVec2(o)))}bbox(){let e=T(Number.MAX_VALUE),o=T(-Number.MAX_VALUE);for(let c of this.pts)e.x=Math.min(e.x,c.x),o.x=Math.max(o.x,c.x),e.y=Math.min(e.y,c.y),o.y=Math.max(o.y,c.y);return de.fromPoints(e,o)}area(){let e=0,o=this.pts.length;for(let c=0;c<o;c++){let g=this.pts[c],m=this.pts[(c+1)%o];e+=g.x*m.y*.5,e-=m.x*g.y*.5;}return Math.abs(e)}clone(){return new n(this.pts.map(e=>e.clone()))}};function Or(n,e){let o=Number.MAX_VALUE,c=T(0);for(let g of [n,e])for(let m=0;m<g.pts.length;m++){let P=g.pts[m],j=g.pts[(m+1)%g.pts.length].sub(P).normal().unit(),y=Number.MAX_VALUE,X=-Number.MAX_VALUE;for(let K=0;K<n.pts.length;K++){let Q=n.pts[K].dot(j);y=Math.min(y,Q),X=Math.max(X,Q);}let S=Number.MAX_VALUE,q=-Number.MAX_VALUE;for(let K=0;K<e.pts.length;K++){let Q=e.pts[K].dot(j);S=Math.min(S,Q),q=Math.max(q,Q);}let E=Math.min(X,q)-Math.max(y,S);if(E<0)return null;if(E<Math.abs(o)){let K=q-y,Q=S-X;o=Math.abs(K)<Math.abs(Q)?K:Q,c=j.scale(o);}}return c}i(Or,"sat");var Ut=class extends Map{static{i(this,"Registry");}lastID;constructor(...e){super(...e),this.lastID=0;}push(e){let o=this.lastID;return this.set(o,e),this.lastID++,o}pushd(e){let o=this.push(e);return ()=>this.delete(o)}},ke=class n{static{i(this,"EventController");}paused=false;cancel;constructor(e){this.cancel=e;}static join(e){let o=new n(()=>e.forEach(c=>c.cancel()));return Object.defineProperty(o,"paused",{get:()=>e[0].paused,set:c=>e.forEach(g=>g.paused=c)}),o.paused=false,o}},be=class{static{i(this,"Event");}handlers=new Ut;add(e){let o=this.handlers.pushd((...g)=>{c.paused||e(...g);}),c=new ke(o);return c}addOnce(e){let o=this.add((...c)=>{o.cancel(),e(...c);});return o}next(){return new Promise(e=>this.addOnce(e))}trigger(...e){this.handlers.forEach(o=>o(...e));}numListeners(){return this.handlers.size}clear(){this.handlers.clear();}},Ne=class{static{i(this,"EventHandler");}handlers={};on(e,o){return this.handlers[e]||(this.handlers[e]=new be),this.handlers[e].add(o)}onOnce(e,o){let c=this.on(e,(...g)=>{c.cancel(),o(...g);});return c}next(e){return new Promise(o=>{this.onOnce(e,(...c)=>o(c[0]));})}trigger(e,...o){this.handlers[e]&&this.handlers[e].trigger(...o);}remove(e){delete this.handlers[e];}clear(){this.handlers={};}numListeners(e){return this.handlers[e]?.numListeners()??0}};function Wt(n,e){if(n===e)return  true;let o=typeof n,c=typeof e;if(o!==c)return  false;if(o==="object"&&c==="object"&&n!==null&&e!==null){if(Array.isArray(n)!==Array.isArray(e))return  false;let g=Object.keys(n),m=Object.keys(e);if(g.length!==m.length)return  false;for(let P of g){let I=n[P],j=e[P];if(!Wt(I,j))return  false}return  true}return  false}i(Wt,"deepEq");function Si(n){let e=window.atob(n),o=e.length,c=new Uint8Array(o);for(let g=0;g<o;g++)c[g]=e.charCodeAt(g);return c.buffer}i(Si,"base64ToArrayBuffer");function Pr(n){return Si(n.split(",")[1])}i(Pr,"dataURLToArrayBuffer");function Xt(n,e){let o=document.createElement("a");o.href=e,o.download=n,o.click();}i(Xt,"download");function kn(n,e){Xt(n,"data:text/plain;charset=utf-8,"+e);}i(kn,"downloadText");function Dr(n,e){kn(n,JSON.stringify(e));}i(Dr,"downloadJSON");function Nn(n,e){let o=URL.createObjectURL(e);Xt(n,o),URL.revokeObjectURL(o);}i(Nn,"downloadBlob");var jn=i(n=>n.match(/^data:\w+\/\w+;base64,.+/),"isDataURL");var Mr=i(n=>n.split(".").slice(0,-1).join("."),"getFileName");function Ee(n,e){return (...o)=>{let c=o.length;if(c===n.length)return n(...o);if(c===e.length)return e(...o)}}i(Ee,"overload2");var Gr=(()=>{let n=0;return ()=>n++})(),Br=i(n=>n instanceof Error?n.message:String(n),"getErrorMessage");var Yt=class{static{i(this,"BinaryHeap");}_items;_compareFn;constructor(e=(o,c)=>o<c){this._compareFn=e,this._items=[];}insert(e){this._items.push(e),this.moveUp(this._items.length-1);}remove(){if(this._items.length===0)return null;let e=this._items[0],o=this._items.pop();return this._items.length!==0&&(this._items[0]=o,this.moveDown(0)),e}clear(){this._items.splice(0,this._items.length);}moveUp(e){for(;e>0;){let o=Math.floor((e-1)/2);if(!this._compareFn(this._items[e],this._items[o])&&this._items[e]>=this._items[o])break;this.swap(e,o),e=o;}}moveDown(e){for(;e<Math.floor(this._items.length/2);){let o=2*e+1;if(o<this._items.length-1&&!this._compareFn(this._items[o],this._items[o+1])&&++o,this._compareFn(this._items[e],this._items[o]))break;this.swap(e,o),e=o;}}swap(e,o){[this._items[e],this._items[o]]=[this._items[o],this._items[e]];}get length(){return this._items.length}};var Ci=Object.freeze([776,2359,2367,2984,3007,3021,3633,3635,3648,3657,4352,4449,4520]);function Fr(n){if(typeof n!="string")throw new TypeError("string cannot be undefined or null");let e=[],o=0,c=0;for(;o<n.length;){if(c+=Ai(o+c,n),Gi(n[o+c])&&c++,Pi(n[o+c])&&c++,Di(n[o+c])&&c++,Bi(n[o+c])){c++;continue}e.push(n.substring(o,o+c)),o+=c,c=0;}return e}i(Fr,"runes");function Ai(n,e){let o=e[n];if(!Ti(o)||n===e.length-1)return 1;let c=o+e[n+1],g=e.substring(n+2,n+5);return Rr(c)&&Rr(g)?4:Oi(c)&&Mi(g)?e.slice(n).indexOf(String.fromCodePoint(917631))+2:Ri(g)?4:2}i(Ai,"nextUnits");function Ti(n){return n&&tt(n[0].charCodeAt(0),55296,56319)}i(Ti,"isFirstOfSurrogatePair");function Rr(n){return tt(Hn(n),127462,127487)}i(Rr,"isRegionalIndicator");function Oi(n){return tt(Hn(n),127988,127988)}i(Oi,"isSubdivisionFlag");function Ri(n){return tt(Hn(n),127995,127999)}i(Ri,"isFitzpatrickModifier");function Pi(n){return typeof n=="string"&&tt(n.charCodeAt(0),65024,65039)}i(Pi,"isVariationSelector");function Di(n){return typeof n=="string"&&tt(n.charCodeAt(0),8400,8447)}i(Di,"isDiacriticalMark");function Mi(n){let e=n.codePointAt(0);return typeof n=="string"&&typeof e=="number"&&tt(e,917504,917631)}i(Mi,"isSupplementarySpecialpurposePlane");function Gi(n){return typeof n=="string"&&Ci.includes(n.charCodeAt(0))}i(Gi,"isGrapheme");function Bi(n){return typeof n=="string"&&n.charCodeAt(0)===8205}i(Bi,"isZeroWidthJoiner");function Hn(n){let e=n.charCodeAt(0)-55296,o=n.charCodeAt(1)-56320;return (e<<10)+o+65536}i(Hn,"codePointFromSurrogatePair");function tt(n,e,o){return n>=e&&n<=o}i(tt,"betweenInclusive");var qn={"Joy-Con L+R (STANDARD GAMEPAD Vendor: 057e Product: 200e)":{buttons:{"0":"south","1":"east","2":"west","3":"north","4":"lshoulder","5":"rshoulder","6":"ltrigger","7":"rtrigger","8":"select","9":"start","10":"lstick","11":"rstick","12":"dpad-up","13":"dpad-down","14":"dpad-left","15":"dpad-right","16":"home","17":"capture"},sticks:{left:{x:0,y:1},right:{x:2,y:3}}},"Joy-Con (L) (STANDARD GAMEPAD Vendor: 057e Product: 2006)":{buttons:{"0":"south","1":"east","2":"west","3":"north","4":"lshoulder","5":"rshoulder","9":"select","10":"lstick","16":"start"},sticks:{left:{x:0,y:1}}},"Joy-Con (R) (STANDARD GAMEPAD Vendor: 057e Product: 2007)":{buttons:{"0":"south","1":"east","2":"west","3":"north","4":"lshoulder","5":"rshoulder","9":"start","10":"lstick","16":"select"},sticks:{left:{x:0,y:1}}},"Pro Controller (STANDARD GAMEPAD Vendor: 057e Product: 2009)":{buttons:{"0":"south","1":"east","2":"west","3":"north","4":"lshoulder","5":"rshoulder","6":"ltrigger","7":"rtrigger","8":"select","9":"start","10":"lstick","11":"rstick","12":"dpad-up","13":"dpad-down","14":"dpad-left","15":"dpad-right","16":"home","17":"capture"},sticks:{left:{x:0,y:1},right:{x:2,y:3}}},default:{buttons:{"0":"south","1":"east","2":"west","3":"north","4":"lshoulder","5":"rshoulder","6":"ltrigger","7":"rtrigger","8":"select","9":"start","10":"lstick","11":"rstick","12":"dpad-up","13":"dpad-down","14":"dpad-left","15":"dpad-right","16":"home"},sticks:{left:{x:0,y:1},right:{x:2,y:3}}}};var at=class{static{i(this,"ButtonState");}pressed=new Set([]);pressedRepeat=new Set([]);released=new Set([]);down=new Set([]);update(){this.pressed.clear(),this.released.clear(),this.pressedRepeat.clear();}press(e){this.pressed.add(e),this.pressedRepeat.add(e),this.down.add(e);}pressRepeat(e){this.pressedRepeat.add(e);}release(e){this.down.delete(e),this.pressed.delete(e),this.released.add(e);}},$n=class{static{i(this,"GamepadState");}buttonState=new at;stickState=new Map},zn=class{static{i(this,"FPSCounter");}dts=[];timer=0;fps=0;tick(e){this.dts.push(e),this.timer+=e,this.timer>=1&&(this.timer=0,this.fps=Math.round(1/(this.dts.reduce((o,c)=>o+c)/this.dts.length)),this.dts=[]);}},Ir=i(n=>{if(!n.canvas)throw new Error("Please provide a canvas");let e={canvas:n.canvas,loopID:null,stopped:false,dt:0,time:0,realTime:0,fpsCounter:new zn,timeScale:1,skipTime:false,numFrames:0,mousePos:new v(0),mouseDeltaPos:new v(0),keyState:new at,mouseState:new at,mergedGamepadState:new $n,gamepadStates:new Map,gamepads:[],charInputted:[],isMouseMoved:false,lastWidth:n.canvas.offsetWidth,lastHeight:n.canvas.offsetHeight,events:new Ne};function o(){return e.dt*e.timeScale}i(o,"dt");function c(){return e.time}i(c,"time");function g(){return e.fpsCounter.fps}i(g,"fps");function m(){return e.numFrames}i(m,"numFrames");function P(){return e.canvas.toDataURL()}i(P,"screenshot");function I(l){e.canvas.style.cursor=l;}i(I,"setCursor");function j(){return e.canvas.style.cursor}i(j,"getCursor");function y(l){if(l)try{let x=e.canvas.requestPointerLock();x.catch&&x.catch(R=>console.error(R));}catch(x){console.error(x);}else document.exitPointerLock();}i(y,"setCursorLocked");function X(){return !!document.pointerLockElement}i(X,"isCursorLocked");function S(l){l.requestFullscreen?l.requestFullscreen():l.webkitRequestFullscreen&&l.webkitRequestFullscreen();}i(S,"enterFullscreen");function q(){document.exitFullscreen?document.exitFullscreen():document.webkitExitFullScreen&&document.webkitExitFullScreen();}i(q,"exitFullscreen");function E(){return document.fullscreenElement||document.webkitFullscreenElement}i(E,"getFullscreenElement");function K(l=true){l?S(e.canvas):q();}i(K,"setFullscreen");function Q(){return !!E()}i(Q,"isFullscreen");function te(){e.stopped=true;for(let l in se)e.canvas.removeEventListener(l,se[l]);for(let l in le)document.removeEventListener(l,le[l]);for(let l in ae)window.removeEventListener(l,ae[l]);ge.disconnect();}i(te,"quit");function k(l){e.loopID!==null&&cancelAnimationFrame(e.loopID);let x=0,R=i(L=>{if(e.stopped)return;if(document.visibilityState!=="visible"){e.loopID=requestAnimationFrame(R);return}let he=L/1e3,z=he-e.realTime,Oe=n.maxFPS?1/n.maxFPS:0;e.realTime=he,x+=z,x>Oe&&(e.skipTime||(e.dt=x,e.time+=o(),e.fpsCounter.tick(e.dt)),x=0,e.skipTime=false,e.numFrames++,ft(),l(),vn()),e.loopID=requestAnimationFrame(R);},"frame");R(0);}i(k,"run");function pe(){return "ontouchstart"in window||navigator.maxTouchPoints>0}i(pe,"isTouchscreen");function C(){return e.mousePos.clone()}i(C,"mousePos");function Ae(){return e.mouseDeltaPos.clone()}i(Ae,"mouseDeltaPos");function $(l="left"){return e.mouseState.pressed.has(l)}i($,"isMousePressed");function Te(l="left"){return e.mouseState.down.has(l)}i(Te,"isMouseDown");function ye(l="left"){return e.mouseState.released.has(l)}i(ye,"isMouseReleased");function Se(){return e.isMouseMoved}i(Se,"isMouseMoved");function st(l){return l===void 0?e.keyState.pressed.size>0:e.keyState.pressed.has(l)}i(st,"isKeyPressed");function on(l){return l===void 0?e.keyState.pressedRepeat.size>0:e.keyState.pressedRepeat.has(l)}i(on,"isKeyPressedRepeat");function Tt(l){return l===void 0?e.keyState.down.size>0:e.keyState.down.has(l)}i(Tt,"isKeyDown");function Ot(l){return l===void 0?e.keyState.released.size>0:e.keyState.released.has(l)}i(Ot,"isKeyReleased");function Rt(l){return l===void 0?e.mergedGamepadState.buttonState.pressed.size>0:e.mergedGamepadState.buttonState.pressed.has(l)}i(Rt,"isGamepadButtonPressed");function Ye(l){return l===void 0?e.mergedGamepadState.buttonState.down.size>0:e.mergedGamepadState.buttonState.down.has(l)}i(Ye,"isGamepadButtonDown");function an(l){return l===void 0?e.mergedGamepadState.buttonState.released.size>0:e.mergedGamepadState.buttonState.released.has(l)}i(an,"isGamepadButtonReleased");function un(l){return e.events.on("resize",l)}i(un,"onResize");let cn=Ee(l=>e.events.on("keyDown",l),(l,x)=>e.events.on("keyDown",R=>R===l&&x(l))),hn=Ee(l=>e.events.on("keyPress",l),(l,x)=>e.events.on("keyPress",R=>R===l&&x(l))),ln=Ee(l=>e.events.on("keyPressRepeat",l),(l,x)=>e.events.on("keyPressRepeat",R=>R===l&&x(l))),dn=Ee(l=>e.events.on("keyRelease",l),(l,x)=>e.events.on("keyRelease",R=>R===l&&x(l))),Pt=Ee(l=>e.events.on("mouseDown",x=>l(x)),(l,x)=>e.events.on("mouseDown",R=>R===l&&x(R))),Dt=Ee(l=>e.events.on("mousePress",x=>l(x)),(l,x)=>e.events.on("mousePress",R=>R===l&&x(R))),Mt=Ee(l=>e.events.on("mouseRelease",x=>l(x)),(l,x)=>e.events.on("mouseRelease",R=>R===l&&x(R)));function Gt(l){return e.events.on("mouseMove",()=>l(C(),Ae()))}i(Gt,"onMouseMove");function Bt(l){return e.events.on("charInput",l)}i(Bt,"onCharInput");function fn(l){return e.events.on("touchStart",l)}i(fn,"onTouchStart");function ct(l){return e.events.on("touchMove",l)}i(ct,"onTouchMove");function mn(l){return e.events.on("touchEnd",l)}i(mn,"onTouchEnd");function pn(l){return e.events.on("scroll",l)}i(pn,"onScroll");function Ft(l){return e.events.on("hide",l)}i(Ft,"onHide");function gn(l){return e.events.on("show",l)}i(gn,"onShow");function It(l,x){if(typeof l=="function")return e.events.on("gamepadButtonDown",l);if(typeof l=="string"&&typeof x=="function")return e.events.on("gamepadButtonDown",R=>R===l&&x(l))}i(It,"onGamepadButtonDown");function Lt(l,x){if(typeof l=="function")return e.events.on("gamepadButtonPress",l);if(typeof l=="string"&&typeof x=="function")return e.events.on("gamepadButtonPress",R=>R===l&&x(l))}i(Lt,"onGamepadButtonPress");function wn(l,x){if(typeof l=="function")return e.events.on("gamepadButtonRelease",l);if(typeof l=="string"&&typeof x=="function")return e.events.on("gamepadButtonRelease",R=>R===l&&x(l))}i(wn,"onGamepadButtonRelease");function ht(l,x){return e.events.on("gamepadStick",(R,L)=>R===l&&x(L))}i(ht,"onGamepadStick");function bn(l){e.events.on("gamepadConnect",l);}i(bn,"onGamepadConnect");function lt(l){e.events.on("gamepadDisconnect",l);}i(lt,"onGamepadDisconnect");function Pe(l){return e.mergedGamepadState.stickState.get(l)||new v(0)}i(Pe,"getGamepadStick");function dt(){return [...e.charInputted]}i(dt,"charInputted");function Vt(){return [...e.gamepads]}i(Vt,"getGamepads");function ft(){e.events.trigger("input"),e.keyState.down.forEach(l=>e.events.trigger("keyDown",l)),e.mouseState.down.forEach(l=>e.events.trigger("mouseDown",l)),He();}i(ft,"processInput");function vn(){e.keyState.update(),e.mouseState.update(),e.mergedGamepadState.buttonState.update(),e.mergedGamepadState.stickState.forEach((l,x)=>{e.mergedGamepadState.stickState.set(x,new v(0));}),e.charInputted=[],e.isMouseMoved=false,e.gamepadStates.forEach(l=>{l.buttonState.update(),l.stickState.forEach((x,R)=>{l.stickState.set(R,new v(0));});});}i(vn,"resetInput");function _t(l){let x={index:l.index,isPressed:R=>e.gamepadStates.get(l.index).buttonState.pressed.has(R),isDown:R=>e.gamepadStates.get(l.index).buttonState.down.has(R),isReleased:R=>e.gamepadStates.get(l.index).buttonState.released.has(R),getStick:R=>e.gamepadStates.get(l.index).stickState.get(R)};return e.gamepads.push(x),e.gamepadStates.set(l.index,{buttonState:new at,stickState:new Map([["left",new v(0)],["right",new v(0)]])}),x}i(_t,"registerGamepad");function ne(l){e.gamepads=e.gamepads.filter(x=>x.index!==l.index),e.gamepadStates.delete(l.index);}i(ne,"removeGamepad");function He(){for(let l of navigator.getGamepads())l&&!e.gamepadStates.has(l.index)&&_t(l);for(let l of e.gamepads){let x=navigator.getGamepads()[l.index],L=(n.gamepads??{})[x.id]??qn[x.id]??qn.default,he=e.gamepadStates.get(l.index);for(let z=0;z<x.buttons.length;z++)x.buttons[z].pressed?(he.buttonState.down.has(L.buttons[z])||(e.mergedGamepadState.buttonState.press(L.buttons[z]),he.buttonState.press(L.buttons[z]),e.events.trigger("gamepadButtonPress",L.buttons[z])),e.events.trigger("gamepadButtonDown",L.buttons[z])):he.buttonState.down.has(L.buttons[z])&&(e.mergedGamepadState.buttonState.release(L.buttons[z]),he.buttonState.release(L.buttons[z]),e.events.trigger("gamepadButtonRelease",L.buttons[z]));for(let z in L.sticks){let Oe=L.sticks[z],$e=new v(x.axes[Oe.x],x.axes[Oe.y]);he.stickState.set(z,$e),e.mergedGamepadState.stickState.set(z,$e),e.events.trigger("gamepadStick",z,$e);}}}i(He,"processGamepad");let se={},le={},ae={},Be=n.pixelDensity||window.devicePixelRatio||1;se.mousemove=l=>{let x=new v(l.offsetX,l.offsetY),R=new v(l.movementX,l.movementY);if(Q()){let L=e.canvas.width/Be,he=e.canvas.height/Be,z=window.innerWidth,Oe=window.innerHeight,$e=z/Oe,kt=L/he;if($e>kt){let De=Oe/he,Ce=(z-L*De)/2;x.x=_e(l.offsetX-Ce,0,L*De,0,L),x.y=_e(l.offsetY,0,he*De,0,he);}else {let De=z/L,Ce=(Oe-he*De)/2;x.x=_e(l.offsetX,0,L*De,0,L),x.y=_e(l.offsetY-Ce,0,he*De,0,he);}}e.events.onOnce("input",()=>{e.isMouseMoved=true,e.mousePos=x,e.mouseDeltaPos=R,e.events.trigger("mouseMove");});};let We=["left","middle","right","back","forward"];se.mousedown=l=>{e.events.onOnce("input",()=>{let x=We[l.button];x&&(e.mouseState.press(x),e.events.trigger("mousePress",x));});},se.mouseup=l=>{e.events.onOnce("input",()=>{let x=We[l.button];x&&(e.mouseState.release(x),e.events.trigger("mouseRelease",x));});};let yn=new Set([" ","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Tab"]),qe={ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down"," ":"space"};se.keydown=l=>{yn.has(l.key)&&l.preventDefault(),e.events.onOnce("input",()=>{let x=qe[l.key]||l.key.toLowerCase();x.length===1?(e.events.trigger("charInput",x),e.charInputted.push(x)):x==="space"&&(e.events.trigger("charInput"," "),e.charInputted.push(" ")),l.repeat?(e.keyState.pressRepeat(x),e.events.trigger("keyPressRepeat",x)):(e.keyState.press(x),e.events.trigger("keyPressRepeat",x),e.events.trigger("keyPress",x));});},se.keyup=l=>{e.events.onOnce("input",()=>{let x=qe[l.key]||l.key.toLowerCase();e.keyState.release(x),e.events.trigger("keyRelease",x);});},se.touchstart=l=>{l.preventDefault(),e.events.onOnce("input",()=>{let x=[...l.changedTouches],R=e.canvas.getBoundingClientRect();n.touchToMouse!==false&&(e.mousePos=new v(x[0].clientX-R.x,x[0].clientY-R.y),e.mouseState.press("left"),e.events.trigger("mousePress","left")),x.forEach(L=>{e.events.trigger("touchStart",new v(L.clientX-R.x,L.clientY-R.y),L);});});},se.touchmove=l=>{l.preventDefault(),e.events.onOnce("input",()=>{let x=[...l.changedTouches],R=e.canvas.getBoundingClientRect();n.touchToMouse!==false&&(e.mousePos=new v(x[0].clientX-R.x,x[0].clientY-R.y),e.events.trigger("mouseMove")),x.forEach(L=>{e.events.trigger("touchMove",new v(L.clientX-R.x,L.clientY-R.y),L);});});},se.touchend=l=>{e.events.onOnce("input",()=>{let x=[...l.changedTouches],R=e.canvas.getBoundingClientRect();n.touchToMouse!==false&&(e.mousePos=new v(x[0].clientX-R.x,x[0].clientY-R.y),e.mouseState.release("left"),e.events.trigger("mouseRelease","left")),x.forEach(L=>{e.events.trigger("touchEnd",new v(L.clientX-R.x,L.clientY-R.y),L);});});},se.touchcancel=l=>{e.events.onOnce("input",()=>{let x=[...l.changedTouches],R=e.canvas.getBoundingClientRect();n.touchToMouse!==false&&(e.mousePos=new v(x[0].clientX-R.x,x[0].clientY-R.y),e.mouseState.release("left"),e.events.trigger("mouseRelease","left")),x.forEach(L=>{e.events.trigger("touchEnd",new v(L.clientX-R.x,L.clientY-R.y),L);});});},se.wheel=l=>{l.preventDefault(),e.events.onOnce("input",()=>{e.events.trigger("scroll",new v(l.deltaX,l.deltaY));});},se.contextmenu=l=>l.preventDefault(),le.visibilitychange=()=>{document.visibilityState==="visible"?(e.skipTime=true,e.events.trigger("show")):e.events.trigger("hide");},ae.gamepadconnected=l=>{let x=_t(l.gamepad);e.events.onOnce("input",()=>{e.events.trigger("gamepadConnect",x);});},ae.gamepaddisconnected=l=>{let x=Vt().filter(R=>R.index===l.gamepad.index)[0];ne(l.gamepad),e.events.onOnce("input",()=>{e.events.trigger("gamepadDisconnect",x);});};for(let l in se)e.canvas.addEventListener(l,se[l]);for(let l in le)document.addEventListener(l,le[l]);for(let l in ae)window.addEventListener(l,ae[l]);let ge=new ResizeObserver(l=>{for(let x of l)if(x.target===e.canvas){if(e.lastWidth===e.canvas.offsetWidth&&e.lastHeight===e.canvas.offsetHeight)return;e.lastWidth=e.canvas.offsetWidth,e.lastHeight=e.canvas.offsetHeight,e.events.onOnce("input",()=>{e.events.trigger("resize");});}});return ge.observe(e.canvas),{dt:o,time:c,run:k,canvas:e.canvas,fps:g,numFrames:m,quit:te,setFullscreen:K,isFullscreen:Q,setCursor:I,screenshot:P,getGamepads:Vt,getCursor:j,setCursorLocked:y,isCursorLocked:X,isTouchscreen:pe,mousePos:C,mouseDeltaPos:Ae,isKeyDown:Tt,isKeyPressed:st,isKeyPressedRepeat:on,isKeyReleased:Ot,isMouseDown:Te,isMousePressed:$,isMouseReleased:ye,isMouseMoved:Se,isGamepadButtonPressed:Rt,isGamepadButtonDown:Ye,isGamepadButtonReleased:an,getGamepadStick:Pe,charInputted:dt,onResize:un,onKeyDown:cn,onKeyPress:hn,onKeyPressRepeat:ln,onKeyRelease:dn,onMouseDown:Pt,onMousePress:Dt,onMouseRelease:Mt,onMouseMove:Gt,onCharInput:Bt,onTouchStart:fn,onTouchMove:ct,onTouchEnd:mn,onScroll:pn,onHide:Ft,onShow:gn,onGamepadButtonDown:It,onGamepadButtonPress:Lt,onGamepadButtonRelease:wn,onGamepadStick:ht,onGamepadConnect:bn,onGamepadDisconnect:lt,events:e.events}},"default");var Re=class n{static{i(this,"Texture");}ctx;src=null;glTex;width;height;constructor(e,o,c,g={}){this.ctx=e;let m=e.gl;this.glTex=e.gl.createTexture(),e.onDestroy(()=>this.free()),this.width=o,this.height=c;let P={linear:m.LINEAR,nearest:m.NEAREST}[g.filter??e.opts.texFilter]??m.NEAREST,I={repeat:m.REPEAT,clampToEadge:m.CLAMP_TO_EDGE}[g.wrap]??m.CLAMP_TO_EDGE;this.bind(),o&&c&&m.texImage2D(m.TEXTURE_2D,0,m.RGBA,o,c,0,m.RGBA,m.UNSIGNED_BYTE,null),m.texParameteri(m.TEXTURE_2D,m.TEXTURE_MIN_FILTER,P),m.texParameteri(m.TEXTURE_2D,m.TEXTURE_MAG_FILTER,P),m.texParameteri(m.TEXTURE_2D,m.TEXTURE_WRAP_S,I),m.texParameteri(m.TEXTURE_2D,m.TEXTURE_WRAP_T,I),this.unbind();}static fromImage(e,o,c={}){let g=new n(e,o.width,o.height,c);return g.update(o),g.src=o,g}update(e,o=0,c=0){let g=this.ctx.gl;this.bind(),g.texSubImage2D(g.TEXTURE_2D,0,o,c,g.RGBA,g.UNSIGNED_BYTE,e),this.unbind();}bind(){this.ctx.pushTexture2D(this.glTex);}unbind(){this.ctx.popTexture2D();}free(){this.ctx.gl.deleteTexture(this.glTex);}},rt=class{static{i(this,"FrameBuffer");}ctx;tex;glFramebuffer;glRenderbuffer;constructor(e,o,c,g={}){this.ctx=e;let m=e.gl;e.onDestroy(()=>this.free()),this.tex=new Re(e,o,c,g),this.glFramebuffer=m.createFramebuffer(),this.glRenderbuffer=m.createRenderbuffer(),this.bind(),m.renderbufferStorage(m.RENDERBUFFER,m.DEPTH_STENCIL,o,c),m.framebufferTexture2D(m.FRAMEBUFFER,m.COLOR_ATTACHMENT0,m.TEXTURE_2D,this.tex.glTex,0),m.framebufferRenderbuffer(m.FRAMEBUFFER,m.DEPTH_STENCIL_ATTACHMENT,m.RENDERBUFFER,this.glRenderbuffer),this.unbind();}get width(){return this.tex.width}get height(){return this.tex.height}toImageData(){let e=this.ctx.gl,o=new Uint8ClampedArray(this.width*this.height*4);this.bind(),e.readPixels(0,0,this.width,this.height,e.RGBA,e.UNSIGNED_BYTE,o),this.unbind();let c=this.width*4,g=new Uint8Array(c);for(let m=0;m<(this.height/2|0);m++){let P=m*c,I=(this.height-m-1)*c;g.set(o.subarray(P,P+c)),o.copyWithin(P,I,I+c),o.set(g,I);}return new ImageData(o,this.width,this.height)}toDataURL(){let e=document.createElement("canvas"),o=e.getContext("2d");return e.width=this.width,e.height=this.height,o.putImageData(this.toImageData(),0,0),e.toDataURL()}draw(e){this.bind(),e(),this.unbind();}bind(){this.ctx.pushFramebuffer(this.glFramebuffer),this.ctx.pushRenderbuffer(this.glRenderbuffer),this.ctx.pushViewport({x:0,y:0,w:this.width,h:this.height});}unbind(){this.ctx.popFramebuffer(),this.ctx.popRenderbuffer(),this.ctx.popViewport();}free(){let e=this.ctx.gl;e.deleteFramebuffer(this.glFramebuffer),e.deleteRenderbuffer(this.glRenderbuffer),this.tex.free();}},Jt=class{static{i(this,"Shader");}ctx;glProgram;constructor(e,o,c,g){this.ctx=e,e.onDestroy(()=>this.free());let m=e.gl,P=m.createShader(m.VERTEX_SHADER),I=m.createShader(m.FRAGMENT_SHADER);m.shaderSource(P,o),m.shaderSource(I,c),m.compileShader(P),m.compileShader(I);let j=m.createProgram();if(this.glProgram=j,m.attachShader(j,P),m.attachShader(j,I),g.forEach((y,X)=>m.bindAttribLocation(j,X,y)),m.linkProgram(j),!m.getProgramParameter(j,m.LINK_STATUS)){let y=m.getShaderInfoLog(P);if(y)throw new Error("VERTEX SHADER "+y);let X=m.getShaderInfoLog(I);if(X)throw new Error("FRAGMENT SHADER "+X)}m.deleteShader(P),m.deleteShader(I);}bind(){this.ctx.pushProgram(this.glProgram);}unbind(){this.ctx.popProgram();}send(e){let o=this.ctx.gl;for(let c in e){let g=e[c],m=o.getUniformLocation(this.glProgram,c);typeof g=="number"?o.uniform1f(m,g):g instanceof Ue?o.uniformMatrix4fv(m,false,new Float32Array(g.m)):g instanceof W?o.uniform3f(m,g.r,g.g,g.b):g instanceof v&&o.uniform2f(m,g.x,g.y);}}free(){this.ctx.gl.deleteProgram(this.glProgram);}},Qt=class{static{i(this,"BatchRenderer");}ctx;glVBuf;glIBuf;vqueue=[];iqueue=[];stride;maxVertices;maxIndices;vertexFormat;numDraws=0;curPrimitive=null;curTex=null;curShader=null;curUniform={};constructor(e,o,c,g){let m=e.gl;this.vertexFormat=o,this.ctx=e,this.stride=o.reduce((P,I)=>P+I.size,0),this.maxVertices=c,this.maxIndices=g,this.glVBuf=m.createBuffer(),e.pushArrayBuffer(this.glVBuf),m.bufferData(m.ARRAY_BUFFER,c*4,m.DYNAMIC_DRAW),e.popArrayBuffer(),this.glIBuf=m.createBuffer(),e.pushElementArrayBuffer(this.glIBuf),m.bufferData(m.ELEMENT_ARRAY_BUFFER,g*4,m.DYNAMIC_DRAW),e.popElementArrayBuffer();}push(e,o,c,g,m=null,P={}){(e!==this.curPrimitive||m!==this.curTex||g!==this.curShader||!Wt(this.curUniform,P)||this.vqueue.length+o.length*this.stride>this.maxVertices||this.iqueue.length+c.length>this.maxIndices)&&this.flush();let I=this.vqueue.length/this.stride;for(let j of o)this.vqueue.push(j);for(let j of c)this.iqueue.push(j+I);this.curPrimitive=e,this.curShader=g,this.curTex=m,this.curUniform=P;}flush(){if(!this.curPrimitive||!this.curShader||this.vqueue.length===0||this.iqueue.length===0)return;let e=this.ctx.gl;this.ctx.pushArrayBuffer(this.glVBuf),e.bufferSubData(e.ARRAY_BUFFER,0,new Float32Array(this.vqueue)),this.ctx.pushElementArrayBuffer(this.glIBuf),e.bufferSubData(e.ELEMENT_ARRAY_BUFFER,0,new Uint16Array(this.iqueue)),this.ctx.setVertexFormat(this.vertexFormat),this.curShader.bind(),this.curShader.send(this.curUniform),this.curTex?.bind(),e.drawElements(this.curPrimitive,this.iqueue.length,e.UNSIGNED_SHORT,0),this.curTex?.unbind(),this.curShader.unbind(),this.ctx.popArrayBuffer(),this.ctx.popElementArrayBuffer(),this.vqueue=[],this.iqueue=[],this.numDraws++;}free(){let e=this.ctx.gl;e.deleteBuffer(this.glVBuf),e.deleteBuffer(this.glIBuf);}};function nt(n){let e=[],o=i(m=>{e.push(m),n(m);},"push"),c=i(()=>{e.pop(),n(g()??null);},"pop"),g=i(()=>e[e.length-1],"cur");return [o,c,g]}i(nt,"genStack");function Kn(n,e={}){let o=[];function c($){o.push($);}i(c,"onDestroy");function g(){o.forEach($=>$()),n.getExtension("WEBGL_lose_context").loseContext();}i(g,"destroy");let m=null;function P($){if(Wt($,m))return;m=$;let Te=$.reduce((ye,Se)=>ye+Se.size,0);$.reduce((ye,Se,st)=>(n.vertexAttribPointer(st,Se.size,n.FLOAT,false,Te*4,ye),n.enableVertexAttribArray(st),ye+Se.size*4),0);}i(P,"setVertexFormat");let[I,j]=nt($=>n.bindTexture(n.TEXTURE_2D,$)),[y,X]=nt($=>n.bindBuffer(n.ARRAY_BUFFER,$)),[S,q]=nt($=>n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,$)),[E,K]=nt($=>n.bindFramebuffer(n.FRAMEBUFFER,$)),[Q,te]=nt($=>n.bindRenderbuffer(n.RENDERBUFFER,$)),[k,pe]=nt(({x:$,y:Te,w:ye,h:Se})=>{n.viewport($,Te,ye,Se);}),[C,Ae]=nt($=>n.useProgram($));return k({x:0,y:0,w:n.drawingBufferWidth,h:n.drawingBufferHeight}),{gl:n,opts:e,onDestroy:c,destroy:g,pushTexture2D:I,popTexture2D:j,pushArrayBuffer:y,popArrayBuffer:X,pushElementArrayBuffer:S,popElementArrayBuffer:q,pushFramebuffer:E,popFramebuffer:K,pushRenderbuffer:Q,popRenderbuffer:te,pushViewport:k,popViewport:pe,pushProgram:C,popProgram:Ae,setVertexFormat:P}}i(Kn,"initGfx");var ve=class n{static{i(this,"Asset");}loaded=false;data=null;error=null;onLoadEvents=new be;onErrorEvents=new be;onFinishEvents=new be;constructor(e){e.then(o=>{this.data=o,this.onLoadEvents.trigger(o);}).catch(o=>{if(this.error=o,this.onErrorEvents.numListeners()>0)this.onErrorEvents.trigger(o);else throw o}).finally(()=>{this.onFinishEvents.trigger(),this.loaded=true;});}static loaded(e){let o=new n(Promise.resolve(e));return o.data=e,o.loaded=true,o}onLoad(e){return this.loaded&&this.data?e(this.data):this.onLoadEvents.add(e),this}onError(e){return this.loaded&&this.error?e(this.error):this.onErrorEvents.add(e),this}onFinish(e){return this.loaded?e():this.onFinishEvents.add(e),this}then(e){return this.onLoad(e)}catch(e){return this.onError(e)}finally(e){return this.onFinish(e)}},je=class{static{i(this,"AssetBucket");}assets=new Map;lastUID=0;add(e,o){let c=e??this.lastUID+++"",g=new ve(o);return this.assets.set(c,g),g}addLoaded(e,o){let c=e??this.lastUID+++"",g=ve.loaded(o);return this.assets.set(c,g),g}get(e){return this.assets.get(e)}progress(){if(this.assets.size===0)return 1;let e=0;return this.assets.forEach(o=>{o.loaded&&e++;}),e/this.assets.size}};function Yn(n){return fetch(n).then(e=>{if(!e.ok)throw new Error(`Failed to fetch "${n}"`);return e})}i(Yn,"fetchURL");function Et(n){return Yn(n).then(e=>e.json())}i(Et,"fetchJSON");function Lr(n){return Yn(n).then(e=>e.text())}i(Lr,"fetchText");function Vr(n){return Yn(n).then(e=>e.arrayBuffer())}i(Vr,"fetchArrayBuffer");function St(n){let e=new Image;return e.crossOrigin="anonymous",e.src=n,new Promise((o,c)=>{e.onload=()=>o(e),e.onerror=()=>c(new Error(`Failed to load image from "${n}"`));})}i(St,"loadImg");var Zt=2.5949095,_r=1.70158+1,kr=2*Math.PI/3,Nr=2*Math.PI/4.5,en={linear:n=>n,easeInSine:n=>1-Math.cos(n*Math.PI/2),easeOutSine:n=>Math.sin(n*Math.PI/2),easeInOutSine:n=>-(Math.cos(Math.PI*n)-1)/2,easeInQuad:n=>n*n,easeOutQuad:n=>1-(1-n)*(1-n),easeInOutQuad:n=>n<.5?2*n*n:1-Math.pow(-2*n+2,2)/2,easeInCubic:n=>n*n*n,easeOutCubic:n=>1-Math.pow(1-n,3),easeInOutCubic:n=>n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2,easeInQuart:n=>n*n*n*n,easeOutQuart:n=>1-Math.pow(1-n,4),easeInOutQuart:n=>n<.5?8*n*n*n*n:1-Math.pow(-2*n+2,4)/2,easeInQuint:n=>n*n*n*n*n,easeOutQuint:n=>1-Math.pow(1-n,5),easeInOutQuint:n=>n<.5?16*n*n*n*n*n:1-Math.pow(-2*n+2,5)/2,easeInExpo:n=>n===0?0:Math.pow(2,10*n-10),easeOutExpo:n=>n===1?1:1-Math.pow(2,-10*n),easeInOutExpo:n=>n===0?0:n===1?1:n<.5?Math.pow(2,20*n-10)/2:(2-Math.pow(2,-20*n+10))/2,easeInCirc:n=>1-Math.sqrt(1-Math.pow(n,2)),easeOutCirc:n=>Math.sqrt(1-Math.pow(n-1,2)),easeInOutCirc:n=>n<.5?(1-Math.sqrt(1-Math.pow(2*n,2)))/2:(Math.sqrt(1-Math.pow(-2*n+2,2))+1)/2,easeInBack:n=>_r*n*n*n-1.70158*n*n,easeOutBack:n=>1+_r*Math.pow(n-1,3)+1.70158*Math.pow(n-1,2),easeInOutBack:n=>n<.5?Math.pow(2*n,2)*((Zt+1)*2*n-Zt)/2:(Math.pow(2*n-2,2)*((Zt+1)*(n*2-2)+Zt)+2)/2,easeInElastic:n=>n===0?0:n===1?1:-Math.pow(2,10*n-10)*Math.sin((n*10-10.75)*kr),easeOutElastic:n=>n===0?0:n===1?1:Math.pow(2,-10*n)*Math.sin((n*10-.75)*kr)+1,easeInOutElastic:n=>n===0?0:n===1?1:n<.5?-(Math.pow(2,20*n-10)*Math.sin((20*n-11.125)*Nr))/2:Math.pow(2,-20*n+10)*Math.sin((20*n-11.125)*Nr)/2+1,easeInBounce:n=>1-en.easeOutBounce(1-n),easeOutBounce:n=>n<1/2.75?7.5625*n*n:n<2/2.75?7.5625*(n-=1.5/2.75)*n+.75:n<2.5/2.75?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375,easeInOutBounce:n=>n<.5?(1-en.easeOutBounce(1-2*n))/2:(1+en.easeOutBounce(2*n-1))/2},Ct=en;var At=class{static{i(this,"TexPacker");}textures=[];canvas;c2d;x=0;y=0;curHeight=0;gfx;constructor(e,o,c){this.gfx=e,this.canvas=document.createElement("canvas"),this.canvas.width=o,this.canvas.height=c,this.textures=[Re.fromImage(e,this.canvas)],this.c2d=this.canvas.getContext("2d");}add(e){if(e.width>this.canvas.width||e.height>this.canvas.height)throw new Error(`Texture size (${e.width} x ${e.height}) exceeds limit (${this.canvas.width} x ${this.canvas.height})`);this.x+e.width>this.canvas.width&&(this.x=0,this.y+=this.curHeight,this.curHeight=0),this.y+e.height>this.canvas.height&&(this.c2d.clearRect(0,0,this.canvas.width,this.canvas.height),this.textures.push(Re.fromImage(this.gfx,this.canvas)),this.x=0,this.y=0,this.curHeight=0);let o=this.textures[this.textures.length-1],c=new v(this.x,this.y);return this.x+=e.width,e.height>this.curHeight&&(this.curHeight=e.height),e instanceof ImageData?this.c2d.putImageData(e,c.x,c.y):this.c2d.drawImage(e,c.x,c.y),o.update(this.canvas),[o,new oe(c.x/this.canvas.width,c.y/this.canvas.height,e.width/this.canvas.width,e.height/this.canvas.height)]}free(){for(let e of this.textures)e.free();}};var jr="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAA1CAYAAADyMeOEAAAAAXNSR0IArs4c6QAAAoVJREFUaIHdm7txwkAQhheGAqACiCHzOKQDQrqgILpwSAeEDBnEUAF0gCMxZ7G72qce/mec2Lpf9+3unaS78wgSNZ8uX5729+d1FNWXUuGmXlBOUUEIMckEpeQJgBu6C+BSFngztBR2vd+ovY+7g+p6LbgaWgJrAeUkDYIUXgXdBBwNi6kpABJwMTQH3AZsXRR8GHTfgEth8E3gjdAUcNewpbTgY85sCMCUuOokozE0YM0YRzM9NGAAXd8+omAF5h4lnmBRvpSnZHyLoLEbaN+aKB9KWv/KWw0tAbbANnlG+UvB2dm77NxxdwgBpjrF/d7rW9cbmpvio2A5z8iAYpVU8pGZlo6/2+MSco2lHfd3rv9jAP038e1xef9o2mjvYb2OqpqKE81028/jeietlSEVO5FRWsxWsJit1G3aFpW8iWe5RwpiCZAk25QvV6nz6fIlynRGuTd5WqpJ4guAlDfVKBK87hXljflgv1ON6fV+4+5gVlA17SfeG0heKqQd4l4jI/wrmaA9N9R4ar+wpHJDZyrrfcH0nB66PqAzPi76pn+faSyJk/vzOorYhGurQrzj/P68jtBMawHaHBIR9xoD5O34dy0qQOSYHvqExq2TpT2nf76+w7y251OYF0CRaU+J920TwLUa6inx6OxE6g80lu2ux7Y2eJLF/rCXE6zEPdnenk9o+4ih9AEdnW2q81HXl5LuU6OTl2fXUhqganbXAGq3g6jJOWV/OnoesO6YqqEB/GdNsjf7uHtwj2DzmRNpp7iOZfm6D9oAxB6Yi1gC4oIYeo4MIPdopEQRB+cAko5J1tW386HpB2Kz1eop4Epdwls/kgZ1sh8gZsEjdcWkr//D8Qu3Z3l5Nl1NtAAAAABJRU5ErkJggg==";var Hr=gr("SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwPj4+Pj4+TExMTExZWVlZWVlnZ2dnZ3V1dXV1dYODg4ODkZGRkZGRn5+fn5+frKysrKy6urq6urrIyMjIyNbW1tbW1uTk5OTk8vLy8vLy//////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAQKAAAAAAAAHjOZTf9/AAAAAAAAAAAAAAAAAAAAAP/7kGQAAANUMEoFPeACNQV40KEYABEY41g5vAAA9RjpZxRwAImU+W8eshaFpAQgALAAYALATx/nYDYCMJ0HITQYYA7AH4c7MoGsnCMU5pnW+OQnBcDrQ9Xx7w37/D+PimYavV8elKUpT5fqx5VjV6vZ38eJR48eRKa9KUp7v396UgPHkQwMAAAAAA//8MAOp39CECAAhlIEEIIECBAgTT1oj///tEQYT0wgEIYxgDC09aIiE7u7u7uIiIz+LtoIQGE/+XAGYLjpTAIOGYYy0ZACgDgSNFxC7YYiINocwERjAEDhIy0mRoGwAE7lOTBsGhj1qrXNCU9GrgwSPr80jj0dIpT9DRUNHKJbRxiWSiifVHuD2b0EbjLkOUzSXztP3uE1JpHzV6NPq+f3P5T0/f/lNH7lWTavQ5Xz1yLVe653///qf93B7f/vMdaKJAAJAMAIwIMAHMpzDkoYwD8CR717zVb8/p54P3MikXGCEWhQOEAOAdP6v8b8oNL/EzdnROC8Zo+z+71O8VVAGIKFEglKbidkoLam0mAFiwo0ZoVExf/7kmQLgAQyZFxvPWAENcVKXeK0ABAk2WFMaSNIzBMptBYfArbkZgpWjEQpcmjxQoG2qREWQcvpzuuIm29THt3ElhDNlrXV///XTGbm7Kbx0ymcRX///x7GVvquf5vk/dPs0Wi5Td1vggDxqbNII4bAPTU3Ix5h9FJTe7zv1LHG/uPsPrvth0ejchVzVT3giirs6sQAACgQAAIAdaXbRAYra/2t0//3HwqLKIlBOJhOg4BzAOkt+MOL6H8nlNvKyi3rOnqP//zf6AATwBAKIcHKixxwjl1TjDVIrvTqdmKQOFQBUBDwZ1EhHlDEGEVyGQWBAHrcJgRSXYbkvHK/8/6rbYjs4Qj0C8mRy2hwRv/82opGT55fROgRoBTjanaiQiMRHUu1/P3V9yGFffaVv78U1/6l/kpo0cz73vuSv/9GeaqDVRA5bWdHRKQKIEAAAAoIktKeEmdQFKN5sguv/ZSC0oxCAR7CzcJgEsd8cA0M/x0tzv15E7//5L5KCqoIAAmBFIKM1UxYtMMFjLKESTE8lhaelUyCBYeA2IN4rK1iDt//+5JkEgAkZzlVq29D8DJDWo0YLLARwPFZrL0PyLsUazTAlpI+hKSx01VSOfbjXg0iW9/jVPDleLJ15QQA4Okdc5ByMDFIeuCCE5CvevwBGH8YibiX9FtaIIgUikF42wrZw6ZJ6WlHrA+Ki5++NNMeYH1lEkwwJAIJB4ugVFguXFc20Vd/FLlvq1GSiSwAFABABABA47k6BFeNvxEQZO9v3L1IE4iEVElfrXmEmlyWIyGslFA55gH/sW7////o9AAFIBIIAAIUMzYTTNkgsAmYObfwQyzplrOmYvq0BKCKNN+nUTbvD7cJzvHxrEWG5QqvP8U1vFx6CwE8NoRc2ADBeEb/HoXh60N7ST8nw9QiiGoYvf/r6GtC9+vLwXHjaSkIp3iupC5+Nii81Zhu85pNYbFvrf+UFThDOYYY26off+W6b//73GTiN9xDfl0AAwBAiMBO8qsDBPOZtuT/dTbjVVbY/KSGH6ppHwKv/6X+s8gUCN/lODzv////GQAGAMQAADlXAUCBJiY0wFQZusYQOaQzaTwDBTcx0IvVp8m7uxKp//uSZBMCBHRI1eNPLHAyxNqWGeoYUIEnWYyxD8DUFSn0l6iojcd+oEOkzV6uWqyHNzjqmv+7V5xGUfY9yEmbziTzjRscm9OqFQp1PKFrqu3PX/7YuGtDU6bt0OUTpv38rdc+37dVDQLKUchaJ853E9edNDGqWwsYz1VoiSStEJtZvw6+sNqFWqaIXJjQCGAAGWAYVwmag/x3BRJw1wYF7IzVqDcNzn85d//FzK7IgwbQwccLoB4AsF8Nj/1ESRUAAVJwAFh0YOFEhmSJEHKQRDyhszgLUpHIgFrb5cySFg5jv10ImlYuvaaGBItfXqnNPmic+XNkmb5fW49vdhq97nQMQyGIlM2v8oQSrxKSxE4F1WqrduqvuJCRof1R7Gsre9KszUVF1/t3PzH2tnp+iSUG3rDwGNcDzxCGA8atuQF0paZAAkAhAQAEAC240yJV+nJgUrqq8axAYtVpYjZyFGb13/17jwiClQDaCdytZpyHHf1R/EG/+lUAgAAAChhmJvioVGGBCFgqdpsGAkUUrbTstwTCJgLQpFIsELW7t/68Iv/7kmQUgAQ9NFO9aeAAPAU6RKwUABClY2e5hoARGpDvPydCAsY8WO10fSvUOnfT98+n/l/6/+hxslhQ1DEOaevNKGocvIYba8WJpaP/15pX0NQ1DUNn/////k6lPp/N61rBi8RJFfERV3IgrqDsJA64sjCoKxDDQ9xEcWDpMBDwVFDIAEIAAzryxsjGi4q/oWpixKjhklAF4pUrDPjFhFVupDFZ/t/t0YPAygUBhADPR/KLCKJ8h2Oxhpxz/zNRAAFl0MAZLAYEAiVbEiz36LSgZ5QoQVat69KNy8FyM5Z80ACHAzgnISEkxUSJIDyBSwi5KF4mjBl4xJdbrG9ComLrL8YATiodhQKCkj6ROdyg1y5XmZlvMVmpJzYppJDwLi/Lp9vT3TfmimOGpuezi2U/9FNav0zX9Oja2r//8+hvuihuQAAMAVmqFgAgCcuboAEAAAUcqy8ca0BHBmwbFkED0CNA1YYDPkhcQrRJxcY3BzfxxltAz9vX62Xl3plAzWmRO+FkZyH///1qAAEjQBAACUpgU5o2AIBmFBGMamrGg0b/+5JkC4ADxyLWb2ngAEEkGofsoACP7U1JLaxTkOqFaKhspGgnW3SGC56ZgUJGCRnLOmIJAkuNBgvwU4Ocf8CJK9UsafH9/Frj///365XSoME+DZMw5UNjrMbVoeIj9EL91IuQ5KHyl5V2LCpdIdESgafOHxVGkAlkHuakmix/gN8+BP/sKguLAAoAtUjtvaoeEADwr3OK11E4KBlojgeQNQBJ4MvCAd/4t/xMMzeLhQGQ1//6tQu5BaBOGCT6U4aafvXZ//4iAPAAAAbLkgIlQmMSLA2H1CVNAlWwyVvKIQIxOSK1NWxs4MBUATlKrAkIMPAjCAdS6MVFzuURWa/+/qQWEGsA6EEpiBEJb9Q21lAHoBoD0B6aAPhyt+bG3muoXIN3RLadXxUfr/ohjGFF/p97eqNI5noKAqYLNPpUTDSI9/TmA6B+YAAADgA0Y4lxTW1SQfOQuDDDI0KTTuIrF5qoJrUFhUFAsg+AT2hbkaRZYGIjBKVDIa5VgNN/9P/rCDsBJbYJRKpCA1ArAkigIeYY61AjE+jubyiZFZ3+L789//uSZBCABHVj2entNmw1JXokLycYEFTFVa0wz4DYjKs08J2Q+r4n3lgbWaaMwMLEjFW88F39brqPF83cv1mCSJeY3Q2uiQxhBJxCBeR1D2LQRsYQcZUTzdNll8+OwZBsIwSgl45ymaHX603Mz7JmZuvt71GDTN66zev/+cLn/b5imV8pAHkg61FIJchBSG+zycgAZgADD6F1iQQRXRWmWS6bDIIgyBCZEcdl/KgXGmVKFv/vl8ry/5bLypf//U5jhYDhL9X/pAA0AKBIAAKgGtGXGGWJgEoF2JNsHlKfSKLRhGBAgIuWZKIJCFpF1VBhkB+EfzEyMUJdWuMrEZoPZ5BfF3/Nu62riIdjoO4AAKD2sTrDmpZZaYysf/810TitAVvn9xtFucieiaEy54YqiIO6RqkGAm5wVO0bFB0sDTdNxYGekKktR4KAAfAwUIgI8Ci6aXgtwbhPWAC+CKExAFydNtYGXNZoQjUsXv/9vKjgmdwieb+h7kHvPoc//0FaCACAATKFC4Y9ammklidbaiJNPBhGWTNhFSgdtalK12lpl//7kmQRAFN2NFI7TBvwNKNaTRsFGBWdfV2tPNcYvBHpgPKJsc8IUcTCxY3HSvUVNTWe/Z3YWlrJ0yrNRUiT19aprA7E+mPP+ZmC3/CsheOJXhc/9VJb3UZnphUBcqZUZQth1i3XqtPYu2Sy1s8DV9ZYACAAASAAHgFkQcOqgB5utFHFh3kSi4USs0yk4iOClREmjvdG+upaiLcRA6/9QGbOfxF/8sEAQAVG0G07YFMihKR4EXJCkRdX9isueLqUMRAQdhDZmv3KeR0nPqRVrZmSIXDt+BBSR7qqbKQcB98W9qiMb55preHIStxFWPE4lAyI+BKz2iSxonpvMR5DgKxTH6vGGXAbYCaAnJUW4W07EesQqbfqdbo4qNnPxSpn1H8eahszc/y9//dn1V7D/OYpn1szQKAPXTMlO/rO//u7JriJXbld7aP33v6RXYg/COIDzTWkTspg6Ay1YaDSwKxrP/LfIikHjmO871POf/kEAseAgoPEi9/0ZziNwfxVKy9qAEGEEAAq1EcOamDEGHAA0iao8k31rz2MiLNEik6VQ37/+5JkEAgEYU5WU0M3MDjDe0o9IjiOzSVM7aCzEM2GqXD8pFB0zxMcHCQNHtZD+R+pMWZxOJ/otEZTvVN/MeU12xTVcL+f2YaiNJTVoPd6SvzEnKel5GXOzEaazgdChnP2jOAwpfyRpVlQwoJBwpN1L1DL////6TVWcoepf7CVWrpEWiym5lR5U0BSMlxQC4qByOyQIAEuJfIriWixDqRgMfVZWuvRowjR9BzP5lZlT/+YG50CsSBG////////liXDQVMxEaBkbzKAAACnDIAstY7iK7gGSF7SIDexaTtPOHABk9YcmJEACmo50pgWal22etroBpYoVqtU6OPqvlf0c4QCAfLk9P/FJs4KCQMf6ECZyA6BwqqyJ0rMYj56k1/UlTIx1V3Rt5NF71D4qlptDC8VMgQVHFDlQnDFi06qQgKQAAIK4TxxJGFGYJuZNGXRdpq7IW/DYpPIQRFJLAc+qn1E0XYdOkQVJT+z8Lvff//8vbKAWTIBBUUdM6cOhlDry7x4dAkJXIBhbO3HSMMMGBQ9K9/JNfu09PjTO64wYEcR//uSZBeABP5g11NPRVwzQ4r8PMJVj7j9UU2wUwDPjeq0Z5w675D9+uDdL2QsuIry2lZtwn/pJYyRRjANEOQxNWw8mU7Tq+vueV7JrX/Pg7VIkEuZT5dwd85MVoq5lpStNICkBAcFR88//58KO8Zjt2PIGxWl1cVfXeNGH18SReNT//hYliWtQuNluxyxONbm4U+lpkAgpyE7yAIYUjIaqHmARJ0GQTtmH60xdwFp/u253XBCxD0f/lBcguCALn//Y5nqEv//1h4BAAwgAA5gcHmpIplgeW9fAOM6RFZUywrsGAiRmKkanQnCFBjYoPDS7bjwtPTkVI8D/P8VVLcTUz65n7PW2s3tNYHgEul4tBaIz0A9RgJAyAMI4/i0fpQKjhX9S+qIa0vmc4CZit/0/3UTDGeKNpkk0nu2rUE2ag8WErhE/kgAiQCJKQEYBA5Wn6CxHoIUh6dQ46nLIuwFk4S/LaDQxXu7Yf/pf//lwJB0S/Ff/4C///EiBEiAAAIAMnpngiIABAdMpKigkXaUwhLEGvpiofmXW57h2XAZO3CMRv/7kmQUAEOHQlHraRTQMkQp6GWFZBTVU1lNPTPYyIyocYeUoNgLBWAs1jPkTv/tXBaeZ/tbD/nAGP8/xT0SNEi5zof0KIVEzVe9r5lZOol7kyaXMYS4J/ZS3djp//UaeVyR0mUMlTgfz8XqMzIEgAQQ6UNQ1DSE0/C16OvyaocF4ijAGFci0FSYqCUSaWs6t9F6/699DKvMgMoK1//kSbvxtyBN27I7mdXgNMAW75sRU1UwUHYG5axI2tFIFpkgx7nnK+1JmRKjqeAd5Ph0QAL4QAnirmiPlg0yBDlrb/d3ngtA65rb999+8vdDCfnJuJAYIl285zklpVbrKpk1PEzrOY9NZUgyz6OiOsKt5qG/g2ibxSZ+/eTI/NB8n4ev//n2nIw85GAdwuJL7kYnnAbpcf1RBKH6b2U4RWP8dmWH5snsAFYwADBgAopKdzFJq4Jlmotloh/m4QpTSvJRE3nYZHephoqBhVf+P7vQ9BPlwZCP+3//+hdy5uUwS3LDEgQx4cdIgvDEBR1YqymCsSbKzRy2aQmSv+AAcAgAkvzPfuX/+5JkFQAj6VFX00Zr5DllOhhgpn4MmSs+zSRRiO8U5tWklYgSLKfs+Xheb/+6WaAQCKTztNeJ382MUltZNnjSJoFrCqB6C4mFcwJpJD4Oc8dLDXMTh9k1/rmTopfzqv9AvHWfOuZJlEvHSVMjyjpkVucKSzxJVQBgAAIo8DGqRdYCXPckFYg+dH9A/qUyljrtpxH9RJX/Z3Vv6uFkPg4M2jf3CL09QrwOrMt69n//8UFEAAMHWdhg1CcjyVBwiArOYlDL5NPY6x8ZLFBCGi6SVTKX5nqdSEFjebnv2zHdt0dj6xvORsSFzwqRNTJSZIrrlpXcURNL9WW7krBgr5jPMaGcvJ5v0N1s19CV7+7fvQfjySX2QECWUgKgeJCIif4WRBZ/6archpDkzE7oWctK3zEHP9Smeai8oeHkM6AK7pGjtOgeFv40ugqNd+Iv///uAZAMgAAAUeSWhLPpdwk3iXpBw43hOVIp1gliUOSaeZcZeZhLAH9TtD56wUpBduzLF5v5qViTH6o+I0+8Z1asaLgKVAohlpB72DgAQBQxEd3g//uSZCiAA6k0UdMPQfA+xcnBYON8E3WDVU0w1ZjPDSmo8IniHAFDNnkXF3B94gicH5d8MFw+IHZwufxOf/8gsHw+XrD4Jn8T4RAyQiABNBQg/3giEWuZ42mVFB3kkXNjhqBg1CghEUbN3/7/KBhyqNueef/MIDBClP3YRnKLiIlEFzf//0g+4zKpRIKTpqQgUtnHGFw6RSLN421iGcYapqFxny/capK9r9v+2BSy/RU1yZxa2eGaWK07ijfcxeiO3iuHJvjbXzts+Ny+XyFnsne1h0qG4mAaN6xRGaLVxKPlrri0Bg9oXGyxcw8JRBPkUzC8v451vVd9liSX85JMrmkVNwxOCwUg298////7ks//L409/hwMRIozKiIckXtjzDaAMTBcAACAwLGargPSEgEJZN/EFjfF/VKgaMYKMbwtf/T0UCGGfjfOAZ2frCigYdwh/+sGlQBxhCAAAUHkDPqOdmmUdAVYl3IhrEfR8qZFjLYEPOyzVGvm6lNUJCk2PNazwFxaijk+ZEaiTehoJGuDh6zN/EVP8BCLD/88BoY7Xv/7kmQlgBNmMtNTL0FwOGZJ/WHiKAyhJU+soE3A3JnmAa2oaCIru/+RrEHMTphxQ0X/LzoVy4gKhYl6ZUlklW7CLRVoYmgABwCRMAAMA/poCiEEYLsBVodWcVZ18+CcAfH165U4Xgh7/X1/BAQF6GN/BwQ/+D9S9P6wII//CoANYFYCBAKlGQDKhVjjylKARw2mPAtp8JjcQHggQswVsOEKsF6AIBWvmpIFdSZvRVv/LHWEy0+txMxu+VK9gEqG5pWf6GNGU4UBVkfd+bsj/6lZE0fkOpAqAOvyUO9oo+IiEtcLKOGzhhSGa4MYINHWoQsFr8zzmow0tRILkqz5/+vFxl/oZX/+qGW//xiLjR3xcGn//0QLkTQJh1UA8MAQAEXC/YxODKTDUEhrASs1512GRp+dRFFdTWIRaOXrve1eNjTNpreqQYrC9NBlQc1f8YO2po8bnH6qffuRvU7taiNF3baokE0YpmjRCHRclWBb9NCHKHpERwHRG3pqgXklq4sBpLjGvmekg8Y7SjM1FZopIM8IhB6dtMr8aKsdovh4FW//+5JkQ4CjTDdSU0gtIDiE+YBrKgwNbSVJTCBPwN8N5ZW8NKDnhRB8AXCm//KAsBUCwKU//oJQnET+UP3/zpYRocAAABJkVzzIuoLGEaDoxfsNva12EUdxhJMGFQioSg8GxKsLm8kWEmExJuNidarkk+OTXc0i2OZEq2v+tZr/MDZRS0I7LfRpHdlsiF6m/mEjk+XlK10UqtKYUwNgMx24hUtCJLfpM3ExUeKDYjClgZAzAjQ0qlNQBTsGpk9zSRkCiKkRGp572VXsPYChGvxhAuYkDYZK//jSRgto2mTf6+PJqgAAgIAAAACYZE6aZOHhYkYlcbpeYQq1RgLO4U8TIlL1sGw+iKZi5Kzc/bKT0yXrIUMES89RCWy8oWlxqIQlKANLFpT/KjUrK+UCYbZqGnjVj29aO5dzofWAskRX5eJWPi4kf/aRVjy3Wlyg2AnMYIDSTLwZUTASIzflPWUwwlUnIFMnGiyABeaXJcN91PmQJCLzmvUJkFOHCrX/+6O///IHnT4tT9YYBoNMQ09GfKIErwdwChNz1Qy5+5S/wWeY//uSZF+C03UyT2tMO0A3RRkhY20KzQjDMszhA8DjlGOBp5y4ZCS3ica52GIGiryv7FAaSDVZSXKFTiir+GvGiuK4rjgwPVTddso+W/42a4ueJJHDYtfj6YoKknnjzRgKA0fBIRZOSsprJqnoNN73ps/Z9DVgbKNbMGmRzrYBMAZCPUANkAZQ0syAC2ubK1NF90+WoesBpnhY8qwVDkNb/5Uof6//418TgElCSgAIgyAAQBHEmiaQFPIRmfAMELffpo0IflyEuAAQnSnKvwTlVlnIgOAAGS3P3IydjXPSh/CaVRqpSNCjQqDvPM+fLcuN+WgqNix6CoHomUWTT86JjziRSZ3yjnq+dIldKPU11KUuf6wAASMAAJxE+MlyktgE9UGSxjEx6RR0v1s9bWZ+EJSrGtjqUIhklG3J8eLRn/2U/nv7f///+7/6gBQgEAMUijVMwweWWMyYM/PLXuc7DptIQmBARMRCxXjEIcTNDQgSSeHpUNXO7dRSOllJPvnY7yzaO1hmUjsKvHe99fOxrabMX7mGTi5tsNkZVZLndzxse//7kmR7ABM2O0pbKTvQN4NI+WGFPA2ZESs1pYAAvA0jVrJwAHfbr/c6//vW790dzX36QNBRlDv/6QQAU3V64yUgBEAYc/lI8e5bm+Z9+j+4aaj4tFrb//iker/4a12b/V//q//9v+7vAEAAAAMqZTGd5gL4f54o6ZebKNrR/zWVYUEVYVVv8BuAV2OUT+DUQgkJ8J1Ey4ZbFCiAwgwzMSdHV4jQR+OoPWEASaPkyYq+PsQFFJCsEEJtOiUjI/+GRhtC2DnizTMXATJig9Ey/kAJMrkHGYJ8gpLjmJOYoskpav+ShRJInyGGZVJMihDi6pIxRZJJel/8iZPkYiREnyKE0akTL5QNSqT5iiySS9Ja2SV//5ME0ak//+4KgAAABgQBAADAMDgYCAEgCteQ0fZH6+ICXA357+MPfhR/+ywRf/U///LVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+5JknQAFoWhGLm5gBClBmT3GiAAAAAGkHAAAIAAANIOAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");var qr="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOcAAACDCAYAAAB2kQxsAAAAAXNSR0IArs4c6QAABdRJREFUeJzt3d3N3TYMgGG16ADdoAhyl7UyV9bqXRB0g2zQXgRGDcOWSIoUaX3vAwQBknMk/4gWLcnHrQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACDEb9kb8FH99eeXf6Wf/efn35ynDyj1pEsb6G6NUxOYZ7sdB/QtPdnWRnn29gbKMYDUspPs0SgPb22cHANo/JG9AZF6wWBp3JLgeir36bvff3x9LOvzp2/dbSFA97bk5I4a9VMD7TXOUcP0uJ+d6emu5d6V1QvMs5nj8FZPx37X/b2TFpzShtnafeP0DipJMFnLnN3/w1OQ7tZgP+pA4VVKcHo0TG36KNULKGt5XsHZmi1APS5WM2Vqg0i7vbsG6YcIznN9vRTxXHavgdxtv6Tc3vc1pAHqdaG6ipwKYprpf1sFp6aH0gRTrxxLubPB2avHu+c/l3mICvqnsr//+Cq+qGrK1Xw/wzbBaRkNvSv3yew9cq+cu89L6nu6F/cMzCgzF1ftANlbe+Otp1IkDVxyVfbo6Z481f3507dhvXfbrk3HpdtjKTNqKuio8678c7mzF6ns6arfMyrVNoA75wMfNU2hKSeCx3Fq7dc+SPfDc39H9Vqn2CT//4bsYeT1PecOJyGSJdh6PZOlbElPZz2PHtlD1cUeS4LT4z5IOihwfNaD5ERm9qxH/dZ7Vmt9M999CtCZbdLUP/p3r2zFQ0paG8lr4Eb6+ZWBcSeq/qhyK6bXUfXOSgtO7/tOb9eT1NveqKttpYbiyXu/euV51JV16/T6e86zyF5TUp731V5Sp+Z7M71h9QvFNWWuvr0Sy4LzLfNvrel6zRX1e+hN2VzrnNlfaYD0xhCs++851lDh3vNV95xe6YvHgb8bwbNcuc+f09wbaUj2dzYgjz93//5kh94t0quCM8OKK6glKKuM0EYHfhUZWd8WwenZa0rLsp6s2YY66o0k9WUvS4NManBaGuo1eDIHgUZ1ePdkntsfFaCz5VZJdStsxyt7ziMNXHEAK5yk1mqmhrMPf1fcp57Vqe3SqZTMEduZhqAZyaywFne0DVHngHTZ11bznE88l/1lBZ9meP8851plWkBCO7drmQvWnL/sY/fKtFaqN3iy6iofsQxNktJnTMgfPXJUz3w3VaP5vOQ7Iyszvy2DczSi+aYFET2jINUEqFcAS4+rV480WlwRWXe07dLa0YGvfl9kmbTvPZJ1TXGvn4t4yuRp+2aMgk27wkm63DIztU3vOVfueC8wK4zKWtK0M+nvJXmOdlt65MgFFCva06qsKz044SvjIiN5TjLaaHxhtNyyouXBGZ1WSn66Ivt+M7pRZAWoZsDq+t2emeM1am/WtHxFG9runrO1/n1CxLK7CilxJM/H4bwuTJJBvWtgvm0gcNu01uvpd8la1soLE7xkpYDea4Ot6W3GOSzRc3o/qHw2M9qmXWA+uw+jbd0hyO9Yz0+vJ9QGcO/8ZV2YUqYVPN8dImXp3aJ/w1XTGGYfKZN+P7IXiXqO1uINLzFOm/Pz+BV4C03PNEqpZl//ELXP1ro8nhLyKLPHMyAiXyvh4cMFZ2uyAJXc62gzgJl1nhrSLMEzcLx+5qQnIhgqv6qhTHC2Zmus1tUuowCVDkRU6j0jgiJqhLPSSq2q7wMtMSBkdbcQWjNCq2nMlRrTnajAPP/t+c5Sj3K8VNueQ+pGzaa2MyOb2sZseW2dpL6ZnjMzfeQFt/Fe3XP2WIfGvRY6a569jCJ9TaIlcCS9KQE5p1TP2VrMbwLNDlZEvpE5AkGxh9f2nLO/QOetytIwAnMf6SfS2ns+jaZ6B4i2sWvSvF0HWOAj/aRGNFAaPXbw2rS2Rzr0T/ChshKNM3qd4135BCaqK9VAKy+lAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4DBC0k0jFtF9wAAAAASUVORK5CYII=";var $r="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOcAAACDCAYAAAB2kQxsAAAAAXNSR0IArs4c6QAABqxJREFUeJztnU1yFDkQRtMEB+AG7Fk6fBPO6ZsQLGc/N5gbMAtosJvqKv2kpPxS763A0W5XSXqVqZ+SngzgF58/fflx/7N///vnacW1gBkFD2Z2LOYNBF3Dx9UXAGs5kxLWwhNxU2qlJHrOhwLfkNZoiaBzIa3dCFJYLXgSboKXmETPeVDQyamR8vX55fe/v37/9vBzCDoH0tqktEpZ+t0IOh4KOBm16euZmETPtVDAiRgRLRF0HRRuEkrFrE1hzR4Lipxj+bD6AqCPz5++/Bgp5tXfdv1CeAdPPmFmSkn0nE+a0drdFm6XiOkdKWEuKRptTXqlLuqqFNaM6Dkb+T5nbb+npo8WjZVinqFantFJk9bWojaRThq7HzKN8wiPJ7aCoJHEZN5zHvJp7RE1DTV6SnZ1fa/PL1MjJtF5HmnT2tJF3GZ/BIj05I8ULUtR6ypER7ogjxpw61rRGxEal4KYjNyORzatbUlHSxr06tFcBTHPiN5NUEJWzlZKG/aKRqYk5tl1IKgPafucZ7w+vxSluLP6olHnL6MQQfYV6bpk/+BRZXm+cXHEiApSipZHlE6tRBDMkxmyysl5VsmtjXiFoJmiZU35ZWK0oNv1OY+omSv0GDDKJCaMI42cHg25dvFCi6QZxVS6ViVSpLUz38A4oiS9ySjlW2althGWKZrN6XNuOVpbwq0ReIzqZhfTrHwE/PZZuEYqcnqO0tZQGxVqRylprLGIEDXNkLOKEakbYsYiiphmiQaEZuD9BghixiKSmGYJIueqBt4TRZEyHtHENCNyNtMaRREzHhHFNBOKnKv7myVcVXKka4WfRBXTjMjpypl8iBmP6MsOmed0Bgk1UHjxXlpORIAWIqeybyGtha1QEdNMRM5s7wLCGpTENBORE6AXNTHNkBM2QFFMM4F5ToX5TYiLqphmRE7YmMhimiEnJEb9XBdJOUlp4Qp1Mc1E5QQ4I/qyvFJCy8n8JnijEjXNAi3fQ0TwIEM6e2OqnAgII8kkptkgOZEQZlN6BquZjqhVFxlBOkZq4Z6WASAFQQ8jZwQJ70FK8CTiaeb3fDSLJyMiwiwiS/q0SkwEBE+85jYjSTpcTiSE2WQRtVlOpAMVemVdtjXmlZxICFlQk/TJjHcmYS96JJ0p6KmcZggKeWmVdPopYwgKuxJVUuQE+EU0Sd99KYICxJH0ry9DUIA/rFy3WyWnGYLCnqyQ9PCXERTgmJmSPvwlBAU4p1bUWklPP1yytA9JYWdGRtLLDyEowDUjomiRwQgKUIZnJC3OgREUoByPSDpkDyEkBfhJj6RNQ7xEUYA6aiS9Cdo8SUoUBaijVtCuFQwICtBGiajdawARFKCNK0HdVtEjKUAd0+Q0q9v/FklhJ1rmP4e8JEoUBejfq2jYNgtEUdgJzwN7u6dSSkBQyMSME7O7FyHUQpoLCqw8rv5o+d6Uw3NvfzjagUkAZvOlLH1lLMyx8wCzWBEhW3ZDmLZ7NTsrwCpmyui5A1+IPidigjcjhZy14/vytBYxwRsPMVcf/2c2QU72wQUVIgj5lqFyIiZEJ5qQb1me1gLMJLKM93wY9cVETYiGkphmg+RETFhJljY2LHICQB/uchI1AXxwlRMxAfwgrYVtUHvxwk1OoiaAL8MjJ2ICtOEip1q6APnJEBS6VwiRzp4vtM5YBvf3m/EeI8DyvUZK33z4+v1bqsZ7dN+3n2W6zwgMO44hY0X1vIqkXh419x7lXh9ds8oyviFyRqmcXrxf2FUtF89ymFkG6nI2p7WZB4FGvUWfLcVt4ahsdy+TR7ifz6lc0F5v0GfalmXldpE3esrr6PrTR84sjNjS4kpQhQhaUi4lD6KR1xK9DHupfoKoR02vSFDy9FWNoKVivv1/lG7OfZkqR043OZUbWgmtFaomaGl51ZTHCnFv5bqNnFGjZvRtEFUEHSHmI1ZHWgVBXZ5+sxvX7ANlPChpjKsknSllKaPlRU4nZo0Yjq6wiIJGFPMML2mj3M8ZRRe4QkzF6FhCJEFbBn4i0iKswn11yenZiLLKeMRqQdWiZSmlkqrcV9d0gPfksAcqBW+2ZqAoq5gZGSrnTtGwlVmCIqUepxWxerj7iIyNZ7SgiKmJhJw7NJpRgiKmLuHl3KnReA4UIaU+y+WkcbzHQ1DEzMGQ9aJH0BDK6RE0y9wlTDp2HuppERQxc0FFBaZGUMTMB5UlQG/fHyk1odJEaBUUMXWh4oSoFRQxtaHyxMi2uBseQwUKciUoYuaAShTlkaCImQcqUph7QREzF/8DSS/2GZ2/N/sAAAAASUVORK5CYII=";var ki="3000.1.17",zr=" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",tn="topleft",Kr=64,Ni="monospace",nn="monospace",ji=36,rn=64,sn=256,Yr=2048,Wr=2048,Xr=2048,Jr=2048,Qr=.1,Hi=64,Wn="linear",qi=8,$i=4,Qn=[{name:"a_pos",size:2},{name:"a_uv",size:2},{name:"a_color",size:4}],zi=Qn.reduce((n,e)=>n+e.size,0),Zr=2048,Ki=Zr*4*zi,Yi=Zr*6,Wi=`
attribute vec2 a_pos;
attribute vec2 a_uv;
attribute vec4 a_color;

varying vec2 v_pos;
varying vec2 v_uv;
varying vec4 v_color;

vec4 def_vert() {
	return vec4(a_pos, 0.0, 1.0);
}

{{user}}

void main() {
	vec4 pos = vert(a_pos, a_uv, a_color);
	v_pos = a_pos;
	v_uv = a_uv;
	v_color = a_color;
	gl_Position = pos;
}
`,Xi=`
precision mediump float;

varying vec2 v_pos;
varying vec2 v_uv;
varying vec4 v_color;

uniform sampler2D u_tex;

vec4 def_frag() {
	return v_color * texture2D(u_tex, v_uv);
}

{{user}}

void main() {
	gl_FragColor = frag(v_pos, v_uv, v_color, u_tex);
	if (gl_FragColor.a == 0.0) {
		discard;
	}
}
`,Xn=`
vec4 vert(vec2 pos, vec2 uv, vec4 color) {
	return def_vert();
}
`,Jn=`
vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
	return def_frag();
}
`,Ji=new Set(["id","require"]),Qi=new Set(["add","update","draw","destroy","inspect","drawInspect"]);function ut(n){switch(n){case "topleft":return new v(-1,-1);case "top":return new v(0,-1);case "topright":return new v(1,-1);case "left":return new v(-1,0);case "center":return new v(0,0);case "right":return new v(1,0);case "botleft":return new v(-1,1);case "bot":return new v(0,1);case "botright":return new v(1,1);default:return n}}i(ut,"anchorPt");function Zi(n){switch(n){case "left":return 0;case "center":return .5;case "right":return 1;default:return 0}}i(Zi,"alignPt");function eo(n){return n.createBuffer(1,1,44100)}i(eo,"createEmptyAudioBuffer");var zo=i((n={})=>{let e=n.root??document.body;e===document.body&&(document.body.style.width="100%",document.body.style.height="100%",document.body.style.margin="0px",document.documentElement.style.width="100%",document.documentElement.style.height="100%");let o=n.canvas??(()=>{let t=document.createElement("canvas");return e.appendChild(t),t})(),c=n.scale??1,g=n.width&&n.height&&!n.stretch&&!n.letterbox;g?(o.width=n.width*c,o.height=n.height*c):(o.width=o.parentElement.offsetWidth,o.height=o.parentElement.offsetHeight);let m=["outline: none","cursor: default"];if(g){let t=o.width,r=o.height;m.push(`width: ${t}px`),m.push(`height: ${r}px`);}else m.push("width: 100%"),m.push("height: 100%");n.crisp&&(m.push("image-rendering: pixelated"),m.push("image-rendering: crisp-edges")),o.style.cssText=m.join(";");let P=n.pixelDensity||window.devicePixelRatio;o.width*=P,o.height*=P,o.tabIndex=0;let I=document.createElement("canvas");I.width=sn,I.height=sn;let j=I.getContext("2d",{willReadFrequently:true}),y=Ir({canvas:o,touchToMouse:n.touchToMouse,gamepads:n.gamepads,pixelDensity:n.pixelDensity,maxFPS:n.maxFPS}),X=[],S=y.canvas.getContext("webgl",{antialias:true,depth:true,stencil:true,alpha:true,preserveDrawingBuffer:true}),q=Kn(S,{texFilter:n.texFilter}),E=(()=>{let t=ht(Xn,Jn),r=Re.fromImage(q,new ImageData(new Uint8ClampedArray([255,255,255,255]),1,1)),s=n.width&&n.height?new rt(q,n.width*P*c,n.height*P*c):new rt(q,S.drawingBufferWidth,S.drawingBufferHeight),u=null,a=1;n.background&&(u=J(n.background),a=Array.isArray(n.background)?n.background[3]:1,S.clearColor(u.r/255,u.g/255,u.b/255,a??1)),S.enable(S.BLEND),S.blendFuncSeparate(S.SRC_ALPHA,S.ONE_MINUS_SRC_ALPHA,S.ONE,S.ONE_MINUS_SRC_ALPHA);let h=new Qt(q,Qn,Ki,Yi),f=Re.fromImage(q,new ImageData(new Uint8ClampedArray([128,128,128,255,190,190,190,255,190,190,190,255,128,128,128,255]),2,2),{wrap:"repeat",filter:"nearest"});return {lastDrawCalls:0,defShader:t,defTex:r,frameBuffer:s,postShader:null,postShaderUniform:null,renderer:h,transform:new Ue,transformStack:[],bgTex:f,bgColor:u,bgAlpha:a,width:n.width??S.drawingBufferWidth/P/c,height:n.height??S.drawingBufferHeight/P/c,viewport:{x:0,y:0,width:S.drawingBufferWidth,height:S.drawingBufferHeight},fixed:false}})();class K{static{i(this,"SpriteData");}tex;frames=[new oe(0,0,1,1)];anims={};slice9=null;constructor(r,s,u={},a=null){this.tex=r,s&&(this.frames=s),this.anims=u,this.slice9=a;}get width(){return this.tex.width*this.frames[0].w}get height(){return this.tex.height*this.frames[0].h}static from(r,s={}){return typeof r=="string"?K.fromURL(r,s):Promise.resolve(K.fromImage(r,s))}static fromImage(r,s={}){let[u,a]=k.packer.add(r),h=s.frames?s.frames.map(f=>new oe(a.x+f.x*a.w,a.y+f.y*a.h,f.w*a.w,f.h*a.h)):Tt(s.sliceX||1,s.sliceY||1,a.x,a.y,a.w,a.h);return new K(u,h,s.anims,s.slice9)}static fromURL(r,s={}){return St(r).then(u=>K.fromImage(u,s))}}class Q{static{i(this,"SoundData");}buf;constructor(r){this.buf=r;}static fromArrayBuffer(r){return new Promise((s,u)=>te.ctx.decodeAudioData(r,s,u)).then(s=>new Q(s))}static fromURL(r){return jn(r)?Q.fromArrayBuffer(Pr(r)):Vr(r).then(s=>Q.fromArrayBuffer(s))}}let te=(()=>{let t=new(window.AudioContext||window.webkitAudioContext),r=t.createGain();r.connect(t.destination);let s=new Q(eo(t));return t.decodeAudioData(Hr.buffer.slice(0)).then(u=>{s.buf=u;}).catch(u=>{console.error("Failed to load burp: ",u);}),{ctx:t,masterNode:r,burpSnd:s}})(),k={urlPrefix:"",sprites:new je,fonts:new je,bitmapFonts:new je,sounds:new je,shaders:new je,custom:new je,packer:new At(q,Xr,Jr),loaded:false};function pe(t){return typeof t!="string"||jn(t)?t:k.urlPrefix+t}i(pe,"fixURL");let C={events:new Ne,objEvents:new Ne,root:Un([]),gravity:0,scenes:{},logs:[],cam:{pos:null,scale:new v(1),angle:0,shake:0,transform:new Ue}};C.root.use(An());function Ae(t){return k.custom.add(null,t)}i(Ae,"load");function $(){let t=[k.sprites,k.sounds,k.shaders,k.fonts,k.bitmapFonts,k.custom];return t.reduce((r,s)=>r+s.progress(),0)/t.length}i($,"loadProgress");function Te(t){return t!==void 0&&(k.urlPrefix=t),k.urlPrefix}i(Te,"loadRoot");function ye(t,r){return k.custom.add(t,Et(r))}i(ye,"loadJSON");class Se{static{i(this,"FontData");}fontface;filter=Wn;outline=null;size=rn;constructor(r,s={}){if(this.fontface=r,this.filter=s.filter??Wn,this.size=s.size??rn,this.size>sn)throw new Error(`Max font size: ${sn}`);s.outline&&(this.outline={width:1,color:J(0,0,0)},typeof s.outline=="number"?this.outline.width=s.outline:typeof s.outline=="object"&&(s.outline.width&&(this.outline.width=s.outline.width),s.outline.color&&(this.outline.color=s.outline.color)));}}function st(t,r,s={}){let u=new FontFace(t,typeof r=="string"?`url(${r})`:r);return document.fonts.add(u),k.fonts.add(t,u.load().catch(a=>{throw new Error(`Failed to load font from "${r}": ${a}`)}).then(a=>new Se(a,s)))}i(st,"loadFont");function on(t,r,s,u,a={}){return k.bitmapFonts.add(t,St(r).then(h=>bn(Re.fromImage(q,h,a),s,u,a.chars??zr)))}i(on,"loadBitmapFont");function Tt(t=1,r=1,s=0,u=0,a=1,h=1){let f=[],b=a/t,p=h/r;for(let d=0;d<r;d++)for(let w=0;w<t;w++)f.push(new oe(s+w*b,u+d*p,b,p));return f}i(Tt,"slice");function Ot(t,r){return t=pe(t),Ae(typeof r=="string"?new Promise((s,u)=>{Et(r).then(a=>{Ot(t,a).then(s).catch(u);});}):K.from(t).then(s=>{let u={};for(let a in r){let h=r[a],f=s.frames[0],b=Xr*f.w,p=Jr*f.h,d=h.frames?h.frames.map(A=>new oe(f.x+(h.x+A.x)/b*f.w,f.y+(h.y+A.y)/p*f.h,A.w/b*f.w,A.h/p*f.h)):Tt(h.sliceX||1,h.sliceY||1,f.x+h.x/b*f.w,f.y+h.y/p*f.h,h.width/b*f.w,h.height/p*f.h),w=new K(s.tex,d,h.anims);k.sprites.addLoaded(a,w),u[a]=w;}return u}))}i(Ot,"loadSpriteAtlas");function Rt(t,r={}){let s=document.createElement("canvas"),u=t[0].width,a=t[0].height;s.width=u*t.length,s.height=a;let h=s.getContext("2d");t.forEach((b,p)=>{b instanceof ImageData?h.putImageData(b,p*u,0):h.drawImage(b,p*u,0);});let f=h.getImageData(0,0,t.length*u,a);return K.fromImage(f,{...r,sliceX:t.length,sliceY:1})}i(Rt,"createSpriteSheet");function Ye(t,r,s={sliceX:1,sliceY:1,anims:{}}){return r=pe(r),Array.isArray(r)?r.some(u=>typeof u=="string")?k.sprites.add(t,Promise.all(r.map(u=>typeof u=="string"?St(u):Promise.resolve(u))).then(u=>Rt(u,s))):k.sprites.addLoaded(t,Rt(r,s)):typeof r=="string"?k.sprites.add(t,K.from(r,s)):k.sprites.addLoaded(t,K.fromImage(r,s))}i(Ye,"loadSprite");function an(t,r){return r=pe(r),k.sprites.add(t,new Promise(async s=>{let u=typeof r=="string"?await Et(r):r,a=await Promise.all(u.frames.map(St)),h=document.createElement("canvas");h.width=u.width,h.height=u.height*u.frames.length;let f=h.getContext("2d");a.forEach((p,d)=>{f.drawImage(p,0,d*u.height);});let b=await Ye(null,h,{sliceY:u.frames.length,anims:u.anims});s(b);}))}i(an,"loadPedit");function un(t,r,s){r=pe(r),s=pe(s),typeof r=="string"&&!s&&(s=Mr(r)+".json");let u=typeof s=="string"?Et(s):Promise.resolve(s);return k.sprites.add(t,u.then(a=>{let h=a.meta.size,f=a.frames.map(p=>new oe(p.frame.x/h.w,p.frame.y/h.h,p.frame.w/h.w,p.frame.h/h.h)),b={};for(let p of a.meta.frameTags)p.from===p.to?b[p.name]=p.from:b[p.name]={from:p.from,to:p.to,speed:10,loop:true,pingpong:p.direction==="pingpong"};return K.from(r,{frames:f,anims:b})}))}i(un,"loadAseprite");function cn(t,r,s){return k.shaders.addLoaded(t,ht(r,s))}i(cn,"loadShader");function hn(t,r,s){r=pe(r),s=pe(s);let u=i(h=>h?Lr(h):Promise.resolve(null),"resolveUrl"),a=Promise.all([u(r),u(s)]).then(([h,f])=>ht(h,f));return k.shaders.add(t,a)}i(hn,"loadShaderURL");function ln(t,r){return r=pe(r),k.sounds.add(t,typeof r=="string"?Q.fromURL(r):Q.fromArrayBuffer(r))}i(ln,"loadSound");function dn(t="bean"){return Ye(t,jr)}i(dn,"loadBean");function Pt(t){return k.sprites.get(t)}i(Pt,"getSprite");function Dt(t){return k.sounds.get(t)}i(Dt,"getSound");function Mt(t){return k.fonts.get(t)}i(Mt,"getFont");function Gt(t){return k.bitmapFonts.get(t)}i(Gt,"getBitmapFont");function Bt(t){return k.shaders.get(t)}i(Bt,"getShader");function fn(t){return k.custom.get(t)}i(fn,"getAsset");function ct(t){if(typeof t=="string"){let r=Pt(t);if(r)return r;if($()<1)return null;throw new Error(`Sprite not found: ${t}`)}else {if(t instanceof K)return ve.loaded(t);if(t instanceof ve)return t;throw new Error(`Invalid sprite: ${t}`)}}i(ct,"resolveSprite");function mn(t){if(typeof t=="string"){let r=Dt(t);if(r)return r;if($()<1)return null;throw new Error(`Sound not found: ${t}`)}else {if(t instanceof Q)return ve.loaded(t);if(t instanceof ve)return t;throw new Error(`Invalid sound: ${t}`)}}i(mn,"resolveSound");function pn(t){if(!t)return E.defShader;if(typeof t=="string"){let r=Bt(t);if(r)return r.data??r;if($()<1)return null;throw new Error(`Shader not found: ${t}`)}else if(t instanceof ve)return t.data?t.data:t;return t}i(pn,"resolveShader");function Ft(t){if(!t)return Ft(n.font??Ni);if(typeof t=="string"){let r=Gt(t),s=Mt(t);if(r)return r.data??r;if(s)return s.data??s;if(document.fonts.check(`${rn}px ${t}`))return t;if($()<1)return null;throw new Error(`Font not found: ${t}`)}else if(t instanceof ve)return t.data?t.data:t;return t}i(Ft,"resolveFont");function gn(t){return t!==void 0&&(te.masterNode.gain.value=t),te.masterNode.gain.value}i(gn,"volume");function It(t,r={}){let s=te.ctx,u=r.paused??false,a=s.createBufferSource(),h=new be,f=s.createGain(),b=r.seek??0,p=0,d=0,w=false;a.loop=!!r.loop,a.detune.value=r.detune??0,a.playbackRate.value=r.speed??1,a.connect(f),a.onended=()=>{N()>=a.buffer?.duration&&h.trigger();},f.connect(te.masterNode),f.gain.value=r.volume??1;let A=i(M=>{a.buffer=M.buf,u||(p=s.currentTime,a.start(0,b),w=true);},"start"),D=mn(t);D instanceof ve&&D.onLoad(A);let N=i(()=>{if(!a.buffer)return 0;let M=u?d-p:s.currentTime-p,O=a.buffer.duration;return a.loop?M%O:Math.min(M,O)},"getTime"),_=i(M=>{let O=s.createBufferSource();return O.buffer=M.buffer,O.loop=M.loop,O.playbackRate.value=M.playbackRate.value,O.detune.value=M.detune.value,O.onended=M.onended,O.connect(f),O},"cloneNode");return {stop(){this.paused=true,this.seek(0);},set paused(M){if(u!==M)if(u=M,M)w&&(a.stop(),w=false),d=s.currentTime;else {a=_(a);let O=d-p;a.start(0,O),w=true,p=s.currentTime-O,d=0;}},get paused(){return u},play(M=0){this.seek(M),this.paused=false;},seek(M){a.buffer?.duration&&(M>a.buffer.duration||(u?(a=_(a),p=d-M):(a.stop(),a=_(a),p=s.currentTime-M,a.start(0,M),w=true,d=0)));},set speed(M){a.playbackRate.value=M;},get speed(){return a.playbackRate.value},set detune(M){a.detune.value=M;},get detune(){return a.detune.value},set volume(M){f.gain.value=Math.max(M,0);},get volume(){return f.gain.value},set loop(M){a.loop=M;},get loop(){return a.loop},duration(){return a.buffer?.duration??0},time(){return N()%this.duration()},onEnd(M){return h.add(M)},then(M){return this.onEnd(M)}}}i(It,"play");function Lt(t){return It(te.burpSnd,t)}i(Lt,"burp");function wn(t,r){return new rt(q,t,r)}i(wn,"makeCanvas");function ht(t=Xn,r=Jn){let s=Wi.replace("{{user}}",t??Xn),u=Xi.replace("{{user}}",r??Jn);try{return new Jt(q,s,u,Qn.map(a=>a.name))}catch(a){let f=/(?<type>^\w+) SHADER ERROR: 0:(?<line>\d+): (?<msg>.+)/,b=Br(a).match(f),p=Number(b.groups.line)-14,d=b.groups.msg.trim(),w=b.groups.type.toLowerCase();throw new Error(`${w} shader line ${p}: ${d}`)}}i(ht,"makeShader");function bn(t,r,s,u){let a=t.width/r,h={},f=u.split("").entries();for(let[b,p]of f)h[p]=new oe(b%a*r,Math.floor(b/a)*s,r,s);return {tex:t,map:h,size:s}}i(bn,"makeFont");function lt(t,r,s,u=E.defTex,a=E.defShader,h={}){let f=pn(a);if(!f||f instanceof ve)return;let b=E.fixed||s?E.transform:C.cam.transform.mult(E.transform),p=[];for(let d of t){let w=vn(b.multVec2(d.pos));p.push(w.x,w.y,d.uv.x,d.uv.y,d.color.r/255,d.color.g/255,d.color.b/255,d.opacity);}E.renderer.push(S.TRIANGLES,p,r,f,u,h);}i(lt,"drawRaw");function Pe(){E.renderer.flush();}i(Pe,"flush");function dt(){S.clear(S.COLOR_BUFFER_BIT),E.frameBuffer.bind(),S.clear(S.COLOR_BUFFER_BIT),E.bgColor||Ce(()=>{Be({width:we(),height:xe(),quad:new oe(0,0,we()/Kr,xe()/Kr),tex:E.bgTex,fixed:true});}),E.renderer.numDraws=0,E.fixed=false,E.transformStack.length=0,E.transform=new Ue;}i(dt,"frameStart");function Vt(t,r){E.postShader=t,E.postShaderUniform=r??null;}i(Vt,"usePostEffect");function ft(){Pe(),E.lastDrawCalls=E.renderer.numDraws,E.frameBuffer.unbind(),S.viewport(0,0,S.drawingBufferWidth,S.drawingBufferHeight);let t=E.width,r=E.height;E.width=S.drawingBufferWidth/P,E.height=S.drawingBufferHeight/P,We({flipY:true,tex:E.frameBuffer.tex,pos:new v(E.viewport.x,E.viewport.y),width:E.viewport.width,height:E.viewport.height,shader:E.postShader,uniform:typeof E.postShaderUniform=="function"?E.postShaderUniform():E.postShaderUniform,fixed:true}),Pe(),E.width=t,E.height=r;}i(ft,"frameEnd");function vn(t){return new v(t.x/we()*2-1,-t.y/xe()*2+1)}i(vn,"screen2ndc");function _t(t){E.transform=t.clone();}i(_t,"pushMatrix");function ne(...t){if(t[0]===void 0)return;let r=T(...t);r.x===0&&r.y===0||E.transform.translate(r);}i(ne,"pushTranslate");function He(...t){if(t[0]===void 0)return;let r=T(...t);r.x===1&&r.y===1||E.transform.scale(r);}i(He,"pushScale");function se(t){t&&E.transform.rotate(t);}i(se,"pushRotate");function le(){E.transformStack.push(E.transform.clone());}i(le,"pushTransform");function ae(){E.transformStack.length>0&&(E.transform=E.transformStack.pop());}i(ae,"popTransform");function Be(t){if(t.width===void 0||t.height===void 0)throw new Error('drawUVQuad() requires property "width" and "height".');if(t.width<=0||t.height<=0)return;let r=t.width,s=t.height,a=ut(t.anchor||tn).scale(new v(r,s).scale(-0.5)),h=t.quad||new oe(0,0,1,1),f=t.color||J(255,255,255),b=t.opacity??1,p=t.tex?Qr/t.tex.width:0,d=t.tex?Qr/t.tex.height:0,w=h.x+p,A=h.y+d,D=h.w-p*2,N=h.h-d*2;le(),ne(t.pos),se(t.angle),He(t.scale),ne(a),lt([{pos:new v(-r/2,s/2),uv:new v(t.flipX?w+D:w,t.flipY?A:A+N),color:f,opacity:b},{pos:new v(-r/2,-s/2),uv:new v(t.flipX?w+D:w,t.flipY?A+N:A),color:f,opacity:b},{pos:new v(r/2,-s/2),uv:new v(t.flipX?w:w+D,t.flipY?A+N:A),color:f,opacity:b},{pos:new v(r/2,s/2),uv:new v(t.flipX?w:w+D,t.flipY?A:A+N),color:f,opacity:b}],[0,1,3,1,2,3],t.fixed,t.tex,t.shader,t.uniform),ae();}i(Be,"drawUVQuad");function We(t){if(!t.tex)throw new Error('drawTexture() requires property "tex".');let r=t.quad??new oe(0,0,1,1),s=t.tex.width*r.w,u=t.tex.height*r.h,a=new v(1);if(t.tiled){let h=Math.ceil((t.width||s)/s),f=Math.ceil((t.height||u)/u),p=ut(t.anchor||tn).add(new v(1,1)).scale(.5).scale(h*s,f*u);for(let d=0;d<h;d++)for(let w=0;w<f;w++)Be(Object.assign({},t,{pos:(t.pos||new v(0)).add(new v(s*d,u*w)).sub(p),scale:a.scale(t.scale||new v(1)),tex:t.tex,quad:r,width:s,height:u,anchor:"topleft"}));}else t.width&&t.height?(a.x=t.width/s,a.y=t.height/u):t.width?(a.x=t.width/s,a.y=a.x):t.height&&(a.y=t.height/u,a.x=a.y),Be(Object.assign({},t,{scale:a.scale(t.scale||new v(1)),tex:t.tex,quad:r,width:s,height:u}));}i(We,"drawTexture");function yn(t){if(!t.sprite)throw new Error('drawSprite() requires property "sprite"');let r=ct(t.sprite);if(!r||!r.data)return;let s=r.data.frames[t.frame??0];if(!s)throw new Error(`Frame not found: ${t.frame??0}`);We(Object.assign({},t,{tex:r.data.tex,quad:s.scale(t.quad??new oe(0,0,1,1))}));}i(yn,"drawSprite");function qe(t,r,s,u,a,h=1){u=Ge(u%360),a=Ge(a%360),a<=u&&(a+=Math.PI*2);let f=[],b=Math.ceil((a-u)/Ge(8)*h),p=(a-u)/b;for(let d=u;d<a;d+=p)f.push(t.add(r*Math.cos(d),s*Math.sin(d)));return f.push(t.add(r*Math.cos(a),s*Math.sin(a))),f}i(qe,"getArcPts");function ge(t){if(t.width===void 0||t.height===void 0)throw new Error('drawRect() requires property "width" and "height".');if(t.width<=0||t.height<=0)return;let r=t.width,s=t.height,a=ut(t.anchor||tn).add(1,1).scale(new v(r,s).scale(-0.5)),h=[new v(0,0),new v(r,0),new v(r,s),new v(0,s)];if(t.radius){let f=Math.min(Math.min(r,s)/2,t.radius);h=[new v(f,0),new v(r-f,0),...qe(new v(r-f,f),f,f,270,360),new v(r,f),new v(r,s-f),...qe(new v(r-f,s-f),f,f,0,90),new v(r-f,s),new v(f,s),...qe(new v(f,s-f),f,f,90,180),new v(0,s-f),new v(0,f),...qe(new v(f,f),f,f,180,270)];}z(Object.assign({},t,{offset:a,pts:h,...t.gradient?{colors:t.horizontal?[t.gradient[0],t.gradient[1],t.gradient[1],t.gradient[0]]:[t.gradient[0],t.gradient[0],t.gradient[1],t.gradient[1]]}:{}}));}i(ge,"drawRect");function l(t){let{p1:r,p2:s}=t;if(!r||!s)throw new Error('drawLine() requires properties "p1" and "p2".');let u=t.width||1,a=s.sub(r).unit().normal().scale(u*.5),h=[r.sub(a),r.add(a),s.add(a),s.sub(a)].map(f=>({pos:new v(f.x,f.y),uv:new v(0),color:t.color??W.WHITE,opacity:t.opacity??1}));lt(h,[0,1,3,1,2,3],t.fixed,E.defTex,t.shader,t.uniform);}i(l,"drawLine");function x(t){let r=t.pts;if(!r)throw new Error('drawLines() requires property "pts".');if(!(r.length<2))if(t.radius&&r.length>=3){let s=r[0].sdist(r[1]);for(let a=1;a<r.length-1;a++)s=Math.min(r[a].sdist(r[a+1]),s);Math.min(t.radius,Math.sqrt(s)/2);l(Object.assign({},t,{p1:r[0],p2:r[1]}));for(let a=1;a<r.length-2;a++){let h=r[a],f=r[a+1];l(Object.assign({},t,{p1:h,p2:f}));}l(Object.assign({},t,{p1:r[r.length-2],p2:r[r.length-1]}));}else for(let s=0;s<r.length-1;s++)l(Object.assign({},t,{p1:r[s],p2:r[s+1]})),t.join!=="none"&&L(Object.assign({},t,{pos:r[s],radius:t.width/2}));}i(x,"drawLines");function R(t){if(!t.p1||!t.p2||!t.p3)throw new Error('drawTriangle() requires properties "p1", "p2" and "p3".');return z(Object.assign({},t,{pts:[t.p1,t.p2,t.p3]}))}i(R,"drawTriangle");function L(t){if(typeof t.radius!="number")throw new Error('drawCircle() requires property "radius".');t.radius!==0&&he(Object.assign({},t,{radiusX:t.radius,radiusY:t.radius,angle:0}));}i(L,"drawCircle");function he(t){if(t.radiusX===void 0||t.radiusY===void 0)throw new Error('drawEllipse() requires properties "radiusX" and "radiusY".');if(t.radiusX===0||t.radiusY===0)return;let r=t.start??0,s=t.end??360,u=ut(t.anchor??"center").scale(new v(-t.radiusX,-t.radiusY)),a=qe(u,t.radiusX,t.radiusY,r,s,t.resolution);a.unshift(u);let h=Object.assign({},t,{pts:a,radius:0,...t.gradient?{colors:[t.gradient[0],...Array(a.length-1).fill(t.gradient[1])]}:{}});if(s-r>=360&&t.outline){t.fill!==false&&z(Object.assign(h,{outline:null})),z(Object.assign(h,{pts:a.slice(1),fill:false}));return}z(h);}i(he,"drawEllipse");function z(t){if(!t.pts)throw new Error('drawPolygon() requires property "pts".');let r=t.pts.length;if(!(r<3)){if(le(),ne(t.pos),He(t.scale),se(t.angle),ne(t.offset),t.fill!==false){let s=t.color??W.WHITE,u=t.pts.map((h,f)=>({pos:new v(h.x,h.y),uv:new v(0,0),color:t.colors&&t.colors[f]?t.colors[f].mult(s):s,opacity:t.opacity??1})),a=[...Array(r-2).keys()].map(h=>[0,h+1,h+2]).flat();lt(u,t.indices??a,t.fixed,E.defTex,t.shader,t.uniform);}t.outline&&x({pts:[...t.pts,t.pts[0]],radius:t.radius,width:t.outline.width,color:t.outline.color,join:t.outline.join,uniform:t.uniform,fixed:t.fixed,opacity:t.opacity}),ae();}}i(z,"drawPolygon");function Oe(t,r,s){Pe(),S.clear(S.STENCIL_BUFFER_BIT),S.enable(S.STENCIL_TEST),S.stencilFunc(S.NEVER,1,255),S.stencilOp(S.REPLACE,S.REPLACE,S.REPLACE),r(),Pe(),S.stencilFunc(s,1,255),S.stencilOp(S.KEEP,S.KEEP,S.KEEP),t(),Pe(),S.disable(S.STENCIL_TEST);}i(Oe,"drawStenciled");function $e(t,r){Oe(t,r,S.EQUAL);}i($e,"drawMasked");function kt(t,r){Oe(t,r,S.NOTEQUAL);}i(kt,"drawSubtracted");function De(){return (E.viewport.width+E.viewport.height)/(E.width+E.height)}i(De,"getViewportScale");function Ce(t){Pe();let r=E.width,s=E.height;E.width=E.viewport.width,E.height=E.viewport.height,t(),Pe(),E.width=r,E.height=s;}i(Ce,"drawUnscaled");function Zn(t,r){r.pos&&(t.pos=t.pos.add(r.pos)),r.scale&&(t.scale=t.scale.scale(T(r.scale))),r.angle&&(t.angle+=r.angle),r.color&&t.ch.length===1&&(t.color=t.color.mult(r.color)),r.opacity&&(t.opacity*=r.opacity);}i(Zn,"applyCharTransform");let er=/\[(?<style>\w+)\](?<text>.*?)\[\/\k<style>\]/g;function es(t){let r={},s=t.replace(er,"$2"),u=0;for(let a of t.matchAll(er)){let h=a.index-u;for(let f=0;f<a.groups.text.length;f++)r[f+h]=[a.groups.style];u+=a[0].length-a.groups.text.length;}return {charStyleMap:r,text:s}}i(es,"compileStyledText");let xn={};function Xe(t){if(t.text===void 0)throw new Error('formatText() requires property "text".');let r=Ft(t.font);if(t.text===""||r instanceof ve||!r)return {width:0,height:0,chars:[],opt:t};let{charStyleMap:s,text:u}=es(t.text+""),a=Fr(u);if(r instanceof Se||typeof r=="string"){let Z=r instanceof Se?r.fontface.family:r,H=r instanceof Se?{outline:r.outline,filter:r.filter}:{outline:null,filter:Wn},V=xn[Z]??{font:{tex:new Re(q,Yr,Wr,{filter:H.filter}),map:{},size:rn},cursor:new v(0),outline:H.outline};xn[Z]||(xn[Z]=V),r=V.font;for(let fe of a)if(!V.font.map[fe]){let U=j;U.clearRect(0,0,I.width,I.height),U.font=`${r.size}px ${Z}`,U.textBaseline="top",U.textAlign="left",U.fillStyle="#ffffff";let G=U.measureText(fe),B=Math.ceil(G.width),F=r.size;V.outline&&(U.lineJoin="round",U.lineWidth=V.outline.width*2,U.strokeStyle=V.outline.color.toHex(),U.strokeText(fe,V.outline.width,V.outline.width),B+=V.outline.width*2,F+=V.outline.width*3),U.fillText(fe,V.outline?.width??0,V.outline?.width??0);let Y=U.getImageData(0,0,B,F);if(V.cursor.x+B>Yr&&(V.cursor.x=0,V.cursor.y+=F,V.cursor.y>Wr))throw new Error("Font atlas exceeds character limit");r.tex.update(Y,V.cursor.x,V.cursor.y),r.map[fe]=new oe(V.cursor.x,V.cursor.y,B,F),V.cursor.x+=B;}}let h=t.size||r.size,f=T(t.scale??1).scale(h/r.size),b=t.lineSpacing??0,p=t.letterSpacing??0,d=0,w=0,A=0,D=[],N=[],_=0,M=null,O=null;for(;_<a.length;){let Z=a[_];if(Z===`
`)A+=h+b,D.push({width:d-p,chars:N}),M=null,O=null,d=0,N=[];else {let H=r.map[Z];if(H){let V=H.w*f.x;t.width&&d+V>t.width&&(A+=h+b,M!=null&&(_-=N.length-M,Z=a[_],H=r.map[Z],V=H.w*f.x,N=N.slice(0,M-1),d=O),M=null,O=null,D.push({width:d-p,chars:N}),d=0,N=[]),N.push({tex:r.tex,width:H.w,height:H.h,quad:new oe(H.x/r.tex.width,H.y/r.tex.height,H.w/r.tex.width,H.h/r.tex.height),ch:Z,pos:new v(d,A),opacity:t.opacity??1,color:t.color??W.WHITE,scale:T(f),angle:0}),Z===" "&&(M=N.length,O=d),d+=V,w=Math.max(w,d),d+=p;}}_++;}D.push({width:d-p,chars:N}),A+=h,t.width&&(w=t.width);let ie=[];for(let Z of D){let H=(w-Z.width)*Zi(t.align??"left");for(let V of Z.chars){let fe=r.map[V.ch],U=ie.length;if(V.pos=V.pos.add(H,0).add(fe.w*f.x*.5,fe.h*f.y*.5),t.transform){let G=typeof t.transform=="function"?t.transform(U,V.ch):t.transform;G&&Zn(V,G);}if(s[U]){let G=s[U];for(let B of G){let F=t.styles[B],Y=typeof F=="function"?F(U,V.ch):F;Y&&Zn(V,Y);}}ie.push(V);}}return {width:w,height:A,chars:ie,opt:t}}i(Xe,"formatText");function tr(t){Je(Xe(t));}i(tr,"drawText");function Je(t){le(),ne(t.opt.pos),se(t.opt.angle),ne(ut(t.opt.anchor??"topleft").add(1,1).scale(t.width,t.height).scale(-0.5)),t.chars.forEach(r=>{Be({tex:r.tex,width:r.width,height:r.height,pos:r.pos,scale:r.scale,angle:r.angle,color:r.color,opacity:r.opacity,quad:r.quad,anchor:"center",uniform:t.opt.uniform,shader:t.opt.shader,fixed:t.opt.fixed});}),ae();}i(Je,"drawFormattedText");function we(){return E.width}i(we,"width");function xe(){return E.height}i(xe,"height");function ts(t){return new v((t.x-E.viewport.x)*we()/E.viewport.width,(t.y-E.viewport.y)*xe()/E.viewport.height)}i(ts,"windowToContent");function ns(t){return new v(t.x*E.viewport.width/E.width,t.y*E.viewport.height/E.height)}i(ns,"contentToView");function Nt(){return ts(y.mousePos())}i(Nt,"mousePos");let nr=false,re={inspect:false,timeScale:1,showLog:true,fps:()=>y.fps(),numFrames:()=>y.numFrames(),stepFrame:dr,drawCalls:()=>E.lastDrawCalls,clearLog:()=>C.logs=[],log:t=>{let r=n.logMax??qi;C.logs.unshift({msg:t,time:y.time()}),C.logs.length>r&&(C.logs=C.logs.slice(0,r));},error:t=>re.log(new Error(t.toString?t.toString():t)),curRecording:null,numObjects:()=>On("*",{recursive:true}).length,get paused(){return nr},set paused(t){nr=t,t?te.ctx.suspend():te.ctx.resume();}};function Me(){return y.dt()*re.timeScale}i(Me,"dt");function rs(...t){return t.length>0&&(C.cam.pos=T(...t)),C.cam.pos?C.cam.pos.clone():zt()}i(rs,"camPos");function ss(...t){return t.length>0&&(C.cam.scale=T(...t)),C.cam.scale.clone()}i(ss,"camScale");function is(t){return t!==void 0&&(C.cam.angle=t),C.cam.angle}i(is,"camRot");function os(t=12){C.cam.shake+=t;}i(os,"shake");function rr(t){return C.cam.transform.multVec2(t)}i(rr,"toScreen");function sr(t){return C.cam.transform.invert().multVec2(t)}i(sr,"toWorld");function jt(t){let r=new Ue;return t.pos&&r.translate(t.pos),t.scale&&r.scale(t.scale),t.angle&&r.rotate(t.angle),t.parent?r.mult(t.parent.transform):r}i(jt,"calcTransform");function Un(t=[]){let r=new Map,s={},u=new Ne,a=[],h=null,f=false,b={id:Gr(),hidden:false,transform:new Ue,children:[],parent:null,set paused(d){if(d!==f){f=d;for(let w of a)w.paused=d;}},get paused(){return f},add(d=[]){let w=Array.isArray(d)?Un(d):d;if(w.parent)throw new Error("Cannot add a game obj that already has a parent.");return w.parent=this,w.transform=jt(w),this.children.push(w),w.trigger("add",w),C.events.trigger("add",w),w},readd(d){let w=this.children.indexOf(d);return w!==-1&&(this.children.splice(w,1),this.children.push(d)),d},remove(d){let w=this.children.indexOf(d);if(w!==-1){d.parent=null,this.children.splice(w,1);let A=i(D=>{D.trigger("destroy"),C.events.trigger("destroy",D),D.children.forEach(N=>A(N));},"trigger");A(d);}},removeAll(d){if(d)this.get(d).forEach(w=>this.remove(w));else for(let w of [...this.children])this.remove(w);},update(){this.paused||(this.children.sort((d,w)=>(d.z??0)-(w.z??0)).forEach(d=>d.update()),this.trigger("update"));},draw(){if(this.hidden)return;this.canvas&&this.canvas.bind();let d=E.fixed;this.fixed&&(E.fixed=true),le(),ne(this.pos),He(this.scale),se(this.angle);let w=this.children.sort((A,D)=>(A.z??0)-(D.z??0));if(this.mask){let A={intersect:$e,subtract:kt}[this.mask];if(!A)throw new Error(`Invalid mask func: "${this.mask}"`);A(()=>{w.forEach(D=>D.draw());},()=>{this.trigger("draw");});}else this.trigger("draw"),w.forEach(A=>A.draw());ae(),E.fixed=d,this.canvas&&this.canvas.unbind();},drawInspect(){this.hidden||(le(),ne(this.pos),He(this.scale),se(this.angle),this.children.sort((d,w)=>(d.z??0)-(w.z??0)).forEach(d=>d.drawInspect()),this.trigger("drawInspect"),ae());},use(d){if(!d)return;if(typeof d=="string")return this.use({id:d});let w=[];d.id&&(this.unuse(d.id),s[d.id]=[],w=s[d.id],r.set(d.id,d));for(let D in d){if(Ji.has(D))continue;let N=Object.getOwnPropertyDescriptor(d,D);if(typeof N.value=="function"&&(d[D]=d[D].bind(this)),N.set&&Object.defineProperty(d,D,{set:N.set.bind(this)}),N.get&&Object.defineProperty(d,D,{get:N.get.bind(this)}),Qi.has(D)){let _=D==="add"?()=>{h=i(M=>w.push(M),"onCurCompCleanup"),d[D](),h=null;}:d[D];w.push(this.on(D,_).cancel);}else if(this[D]===void 0)Object.defineProperty(this,D,{get:()=>d[D],set:_=>d[D]=_,configurable:true,enumerable:true}),w.push(()=>delete this[D]);else throw new Error(`Duplicate component property: "${D}"`)}let A=i(()=>{if(d.require){for(let D of d.require)if(!this.c(D))throw new Error(`Component "${d.id}" requires component "${D}"`)}},"checkDeps");d.destroy&&w.push(d.destroy.bind(this)),this.exists()?(A(),d.add&&(h=i(D=>w.push(D),"onCurCompCleanup"),d.add.call(this),h=null)):d.require&&w.push(this.on("add",A).cancel);},unuse(d){s[d]&&(s[d].forEach(w=>w()),delete s[d]),r.has(d)&&r.delete(d);},c(d){return r.get(d)},get(d,w={}){let A=w.recursive?this.children.flatMap(i(function D(N){return [N,...N.children.flatMap(D)]},"recurse")):this.children;if(A=A.filter(D=>d?D.is(d):true),w.liveUpdate){let D=i(_=>w.recursive?this.isAncestorOf(_):_.parent===this,"isChild"),N=[];N.push(En(_=>{D(_)&&_.is(d)&&A.push(_);})),N.push(ir(_=>{if(D(_)&&_.is(d)){let M=A.findIndex(O=>O.id===_.id);M!==-1&&A.splice(M,1);}})),this.onDestroy(()=>{for(let _ of N)_.cancel();});}return A},isAncestorOf(d){return d.parent?d.parent===this||this.isAncestorOf(d.parent):false},exists(){return C.root.isAncestorOf(this)},is(d){if(d==="*")return  true;if(Array.isArray(d)){for(let w of d)if(!this.c(w))return  false;return  true}else return this.c(d)!=null},on(d,w){let A=u.on(d,w.bind(this));return h&&h(()=>A.cancel()),A},trigger(d,...w){u.trigger(d,...w),C.objEvents.trigger(d,this,...w);},destroy(){this.parent&&this.parent.remove(this);},inspect(){let d={};for(let[w,A]of r)d[w]=A.inspect?A.inspect():null;return d},onAdd(d){return this.on("add",d)},onUpdate(d){return this.on("update",d)},onDraw(d){return this.on("draw",d)},onDestroy(d){return this.on("destroy",d)},clearEvents(){u.clear();}},p=["onKeyPress","onKeyPressRepeat","onKeyDown","onKeyRelease","onMousePress","onMouseDown","onMouseRelease","onMouseMove","onCharInput","onMouseMove","onTouchStart","onTouchMove","onTouchEnd","onScroll","onGamepadButtonPress","onGamepadButtonDown","onGamepadButtonRelease","onGamepadStick"];for(let d of p)b[d]=(...w)=>{let A=y[d](...w);return a.push(A),b.onDestroy(()=>A.cancel()),A};for(let d of t)b.use(d);return b}i(Un,"make");function ze(t,r,s){return C.objEvents[t]||(C.objEvents[t]=new Ut),C.objEvents.on(t,(u,...a)=>{u.is(r)&&s(u,...a);})}i(ze,"on");let as=Ee(t=>{let r=gt([{update:t}]);return {get paused(){return r.paused},set paused(s){r.paused=s;},cancel:()=>r.destroy()}},(t,r)=>ze("update",t,r)),us=Ee(t=>{let r=gt([{draw:t}]);return {get paused(){return r.hidden},set paused(s){r.hidden=s;},cancel:()=>r.destroy()}},(t,r)=>ze("draw",t,r)),En=Ee(t=>C.events.on("add",t),(t,r)=>ze("add",t,r)),ir=Ee(t=>C.events.on("destroy",t),(t,r)=>ze("destroy",t,r));function cs(t,r,s){return ze("collide",t,(u,a,h)=>a.is(r)&&s(u,a,h))}i(cs,"onCollide");function hs(t,r,s){return ze("collideUpdate",t,(u,a,h)=>a.is(r)&&s(u,a,h))}i(hs,"onCollideUpdate");function ls(t,r,s){return ze("collideEnd",t,(u,a,h)=>a.is(r)&&s(u,a,h))}i(ls,"onCollideEnd");function Ht(t,r){On(t,{recursive:true}).forEach(r),En(t,r);}i(Ht,"forAllCurrentAndFuture");let ds=Ee(t=>y.onMousePress(t),(t,r)=>{let s=[];return Ht(t,u=>{if(!u.area)throw new Error("onClick() requires the object to have area() component");s.push(u.onClick(()=>r(u)));}),ke.join(s)});function fs(t,r){let s=[];return Ht(t,u=>{if(!u.area)throw new Error("onHover() requires the object to have area() component");s.push(u.onHover(()=>r(u)));}),ke.join(s)}i(fs,"onHover");function ms(t,r){let s=[];return Ht(t,u=>{if(!u.area)throw new Error("onHoverUpdate() requires the object to have area() component");s.push(u.onHoverUpdate(()=>r(u)));}),ke.join(s)}i(ms,"onHoverUpdate");function ps(t,r){let s=[];return Ht(t,u=>{if(!u.area)throw new Error("onHoverEnd() requires the object to have area() component");s.push(u.onHoverEnd(()=>r(u)));}),ke.join(s)}i(ps,"onHoverEnd");function gs(t){C.gravity=t;}i(gs,"setGravity");function ws(){return C.gravity}i(ws,"getGravity");function bs(...t){t.length===1||t.length===2?(E.bgColor=J(t[0]),t[1]&&(E.bgAlpha=t[1])):(t.length===3||t.length===4)&&(E.bgColor=J(t[0],t[1],t[2]),t[3]&&(E.bgAlpha=t[3])),S.clearColor(E.bgColor.r/255,E.bgColor.g/255,E.bgColor.b/255,E.bgAlpha);}i(bs,"setBackground");function vs(){return E.bgColor.clone()}i(vs,"getBackground");function qt(...t){return {id:"pos",pos:T(...t),moveBy(...r){this.pos=this.pos.add(T(...r));},move(...r){this.moveBy(T(...r).scale(Me()));},moveTo(...r){if(typeof r[0]=="number"&&typeof r[1]=="number")return this.moveTo(T(r[0],r[1]),r[2]);let s=r[0],u=r[1];if(u===void 0){this.pos=T(s);return}let a=s.sub(this.pos);if(a.len()<=u*Me()){this.pos=T(s);return}this.move(a.unit().scale(u));},worldPos(){return this.parent?this.parent.transform.multVec2(this.pos):this.pos},screenPos(){let r=this.worldPos();return pt(this)?r:rr(r)},inspect(){return `(${Math.round(this.pos.x)}, ${Math.round(this.pos.y)})`},drawInspect(){L({color:J(255,0,0),radius:4/De()});}}}i(qt,"pos");function $t(...t){return t.length===0?$t(1):{id:"scale",scale:T(...t),scaleTo(...r){this.scale=T(...r);},scaleBy(...r){this.scale.scale(T(...r));},inspect(){return `(${mt(this.scale.x,2)}, ${mt(this.scale.y,2)})`}}}i($t,"scale");function ys(t){return {id:"rotate",angle:t??0,rotateBy(r){this.angle+=r;},rotateTo(r){this.angle=r;},inspect(){return `${Math.round(this.angle)}`}}}i(ys,"rotate");function xs(...t){return {id:"color",color:J(...t),inspect(){return this.color.toString()}}}i(xs,"color");function mt(t,r){return Number(t.toFixed(r))}i(mt,"toFixed");function Us(t){return {id:"opacity",opacity:t??1,inspect(){return `${mt(this.opacity,1)}`},fadeOut(r=1,s=Ct.linear){return Rn(this.opacity,0,r,u=>this.opacity=u,s)}}}i(Us,"opacity");function Sn(t){if(!t)throw new Error("Please define an anchor");return {id:"anchor",anchor:t,inspect(){return typeof this.anchor=="string"?this.anchor:this.anchor.toString()}}}i(Sn,"anchor");function Es(t){return {id:"z",z:t,inspect(){return `${this.z}`}}}i(Es,"z");function Ss(t,r){return {id:"follow",require:["pos"],follow:{obj:t,offset:r??T(0)},add(){t.exists()&&(this.pos=this.follow.obj.pos.add(this.follow.offset));},update(){t.exists()&&(this.pos=this.follow.obj.pos.add(this.follow.offset));}}}i(Ss,"follow");function Cs(t,r){let s=typeof t=="number"?v.fromAngle(t):t.unit();return {id:"move",require:["pos"],update(){this.move(s.scale(r));}}}i(Cs,"move");let As=200;function Ts(t={}){let r=t.distance??As,s=false;return {id:"offscreen",require:["pos"],isOffScreen(){let u=this.screenPos(),a=new de(T(0),we(),xe());return !vt(a,u)&&a.sdistToPoint(u)>r*r},onExitScreen(u){return this.on("exitView",u)},onEnterScreen(u){return this.on("enterView",u)},update(){this.isOffScreen()?(s||(this.trigger("exitView"),s=true),t.hide&&(this.hidden=true),t.pause&&(this.paused=true),t.destroy&&this.destroy()):(s&&(this.trigger("enterView"),s=false),t.hide&&(this.hidden=false),t.pause&&(this.paused=false));}}}i(Ts,"offscreen");function pt(t){return t.fixed?true:t.parent?pt(t.parent):false}i(pt,"isFixed");function Os(t={}){let r={},s=new Set;return {id:"area",collisionIgnore:t.collisionIgnore??[],add(){this.area.cursor&&this.onHover(()=>y.setCursor(this.area.cursor)),this.onCollideUpdate((u,a)=>{r[u.id]||this.trigger("collide",u,a),r[u.id]=a,s.add(u.id);});},update(){for(let u in r)s.has(Number(u))||(this.trigger("collideEnd",r[u].target),delete r[u]);s.clear();},drawInspect(){let u=this.localArea();le(),He(this.area.scale),ne(this.area.offset);let a={outline:{width:4/De(),color:J(0,0,255)},anchor:this.anchor,fill:false,fixed:pt(this)};u instanceof de?ge({...a,pos:u.pos,width:u.width,height:u.height}):u instanceof Ke?z({...a,pts:u.pts}):u instanceof yt&&L({...a,pos:u.center,radius:u.radius}),ae();},area:{shape:t.shape??null,scale:t.scale?T(t.scale):T(1),offset:t.offset??T(0),cursor:t.cursor??null},isClicked(){return y.isMousePressed()&&this.isHovering()},isHovering(){let u=pt(this)?Nt():sr(Nt());return this.hasPoint(u)},checkCollision(u){return r[u.id]??null},getCollisions(){return Object.values(r)},isColliding(u){return !!r[u.id]},isOverlapping(u){let a=r[u.id];return a&&a.hasOverlap()},onClick(u){let a=y.onMousePress("left",()=>{this.isHovering()&&u();});return this.onDestroy(()=>a.cancel()),a},onHover(u){let a=false;return this.onUpdate(()=>{a?a=this.isHovering():this.isHovering()&&(a=true,u());})},onHoverUpdate(u){return this.onUpdate(()=>{this.isHovering()&&u();})},onHoverEnd(u){let a=false;return this.onUpdate(()=>{a?this.isHovering()||(a=false,u()):a=this.isHovering();})},onCollide(u,a){if(typeof u=="function"&&a===void 0)return this.on("collide",u);if(typeof u=="string")return this.onCollide((h,f)=>{h.is(u)&&a(h,f);})},onCollideUpdate(u,a){if(typeof u=="function"&&a===void 0)return this.on("collideUpdate",u);if(typeof u=="string")return this.on("collideUpdate",(h,f)=>h.is(u)&&a(h,f))},onCollideEnd(u,a){if(typeof u=="function"&&a===void 0)return this.on("collideEnd",u);if(typeof u=="string")return this.on("collideEnd",h=>h.is(u)&&a(h))},hasPoint(u){return _n(this.worldArea(),u)},resolveCollision(u){let a=this.checkCollision(u);a&&!a.resolved&&(this.pos=this.pos.add(a.displacement),a.resolved=true);},localArea(){return this.area.shape?this.area.shape:this.renderArea()},worldArea(){let u=this.localArea();if(!(u instanceof Ke||u instanceof de))throw new Error("Only support polygon and rect shapes for now");let a=this.transform.clone().scale(T(this.area.scale??1)).translate(this.area.offset);if(u instanceof de){let h=ut(this.anchor||tn).add(1,1).scale(-0.5).scale(u.width,u.height);a.translate(h);}return u.transform(a)},screenArea(){let u=this.worldArea();return pt(this)?u:u.transform(C.cam.transform)}}}i(Os,"area");function Qe(t){return {color:t.color,opacity:t.opacity,anchor:t.anchor,outline:t.outline,shader:t.shader,uniform:t.uniform}}i(Qe,"getRenderProps");function Cn(t,r={}){let s=null,u=null,a=null,h=new be;if(!t)throw new Error("Please pass the resource name or data to sprite()");let f=i((b,p,d,w)=>{let A=T(1,1);return d&&w?(A.x=d/(b.width*p.w),A.y=w/(b.height*p.h)):d?(A.x=d/(b.width*p.w),A.y=A.x):w&&(A.y=w/(b.height*p.h),A.x=A.y),A},"calcTexScale");return {id:"sprite",width:0,height:0,frame:r.frame||0,quad:r.quad||new oe(0,0,1,1),animSpeed:r.animSpeed??1,flipX:r.flipX??false,flipY:r.flipY??false,draw(){if(!s)return;let b=s.frames[this.frame??0];if(!b)throw new Error(`Frame not found: ${this.frame??0}`);if(s.slice9){let{left:p,right:d,top:w,bottom:A}=s.slice9,D=s.tex.width*b.w,N=s.tex.height*b.h,_=this.width-p-d,M=this.height-w-A,O=p/D,ie=d/D,Z=1-O-ie,H=w/N,V=A/N,fe=1-H-V,U=[ce(0,0,O,H),ce(O,0,Z,H),ce(O+Z,0,ie,H),ce(0,H,O,fe),ce(O,H,Z,fe),ce(O+Z,H,ie,fe),ce(0,H+fe,O,V),ce(O,H+fe,Z,V),ce(O+Z,H+fe,ie,V),ce(0,0,p,w),ce(p,0,_,w),ce(p+_,0,d,w),ce(0,w,p,M),ce(p,w,_,M),ce(p+_,w,d,M),ce(0,w+M,p,A),ce(p,w+M,_,A),ce(p+_,w+M,d,A)];for(let G=0;G<9;G++){let B=U[G],F=U[G+9];We(Object.assign(Qe(this),{pos:F.pos(),tex:s.tex,quad:b.scale(B),flipX:this.flipX,flipY:this.flipY,tiled:r.tiled,width:F.w,height:F.h}));}}else We(Object.assign(Qe(this),{tex:s.tex,quad:b.scale(this.quad??new oe(0,0,1,1)),flipX:this.flipX,flipY:this.flipY,tiled:r.tiled,width:this.width,height:this.height}));},add(){let b=i(d=>{let w=d.frames[0].clone();r.quad&&(w=w.scale(r.quad));let A=f(d.tex,w,r.width,r.height);this.width=d.tex.width*w.w*A.x,this.height=d.tex.height*w.h*A.y,r.anim&&this.play(r.anim),s=d,h.trigger(s);},"setSpriteData"),p=ct(t);p?p.onLoad(b):Tn(()=>b(ct(t).data));},update(){if(!u)return;let b=s.anims[u.name];if(typeof b=="number"){this.frame=b;return}if(b.speed===0)throw new Error("Sprite anim speed cannot be 0");u.timer+=Me()*this.animSpeed,u.timer>=1/u.speed&&(u.timer=0,this.frame+=a,(this.frame<Math.min(b.from,b.to)||this.frame>Math.max(b.from,b.to))&&(u.loop?u.pingpong?(this.frame-=a,a*=-1,this.frame+=a):this.frame=b.from:(this.frame=b.to,u.onEnd(),this.stop())));},play(b,p={}){if(!s){h.add(()=>this.play(b,p));return}let d=s.anims[b];if(d===void 0)throw new Error(`Anim not found: ${b}`);u&&this.stop(),u=typeof d=="number"?{name:b,timer:0,loop:false,pingpong:false,speed:0,onEnd:()=>{}}:{name:b,timer:0,loop:p.loop??d.loop??false,pingpong:p.pingpong??d.pingpong??false,speed:p.speed??d.speed??10,onEnd:p.onEnd??(()=>{})},a=typeof d=="number"?null:d.from<d.to?1:-1,this.frame=typeof d=="number"?d:d.from,this.trigger("animStart",b);},stop(){if(!u)return;let b=u.name;u=null,this.trigger("animEnd",b);},numFrames(){return s?.frames.length??0},curAnim(){return u?.name},onAnimEnd(b){return this.on("animEnd",b)},onAnimStart(b){return this.on("animStart",b)},renderArea(){return new de(T(0),this.width,this.height)},inspect(){if(typeof t=="string")return `"${t}"`}}}i(Cn,"sprite");function Rs(t,r={}){function s(a){let h=Xe(Object.assign(Qe(a),{text:a.text+"",size:a.textSize,font:a.font,width:r.width&&a.width,align:a.align,letterSpacing:a.letterSpacing,lineSpacing:a.lineSpacing,transform:a.textTransform,styles:a.textStyles}));return r.width||(a.width=h.width/(a.scale?.x||1)),a.height=h.height/(a.scale?.y||1),h}i(s,"update");let u={id:"text",set text(a){t=a,s(this);},get text(){return t},textSize:r.size??ji,font:r.font,width:r.width??0,height:0,align:r.align,lineSpacing:r.lineSpacing,letterSpacing:r.letterSpacing,textTransform:r.transform,textStyles:r.styles,add(){Tn(()=>s(this));},draw(){Je(s(this));},renderArea(){return new de(T(0),this.width,this.height)}};return s(u),u}i(Rs,"text");function Ps(t,r={}){if(t.length<3)throw new Error(`Polygon's need more than two points, ${t.length} points provided`);return {id:"polygon",pts:t,colors:r.colors,radius:r.radius,draw(){z(Object.assign(Qe(this),{pts:this.pts,colors:this.colors,radius:this.radius,fill:r.fill}));},renderArea(){return new Ke(this.pts)},inspect(){return this.pts.map(s=>`[${s.x},${s.y}]`).join(",")}}}i(Ps,"polygon");function Ds(t,r,s={}){return {id:"rect",width:t,height:r,radius:s.radius||0,draw(){ge(Object.assign(Qe(this),{width:this.width,height:this.height,radius:this.radius,fill:s.fill}));},renderArea(){return new de(T(0),this.width,this.height)},inspect(){return `${Math.ceil(this.width)}, ${Math.ceil(this.height)}`}}}i(Ds,"rect");function Ms(t,r){return {id:"rect",width:t,height:r,draw(){Be(Object.assign(Qe(this),{width:this.width,height:this.height}));},renderArea(){return new de(T(0),this.width,this.height)},inspect(){return `${Math.ceil(this.width)}, ${Math.ceil(this.height)}`}}}i(Ms,"uvquad");function Gs(t,r={}){return {id:"circle",radius:t,draw(){L(Object.assign(Qe(this),{radius:this.radius,fill:r.fill}));},renderArea(){return new de(new v(this.anchor?0:-this.radius),this.radius*2,this.radius*2)},inspect(){return `${Math.ceil(this.radius)}`}}}i(Gs,"circle");function Bs(t=1,r=J(0,0,0)){return {id:"outline",outline:{width:t,color:r}}}i(Bs,"outline");function An(){return {id:"timer",wait(t,r){let s=[];r&&s.push(r);let u=0,a=this.onUpdate(()=>{u+=Me(),u>=t&&(s.forEach(h=>h()),a.cancel());});return {get paused(){return a.paused},set paused(h){a.paused=h;},cancel:a.cancel,onEnd(h){s.push(h);},then(h){return this.onEnd(h),this}}},loop(t,r){let s=null,u=i(()=>{s=this.wait(t,u),r();},"newAction");return s=this.wait(0,u),{get paused(){return s.paused},set paused(a){s.paused=a;},cancel:()=>s.cancel()}},tween(t,r,s,u,a=Ct.linear){let h=0,f=[],b=this.onUpdate(()=>{h+=Me();let p=Math.min(h/s,1);u(Ve(t,r,a(p))),p===1&&(b.cancel(),u(r),f.forEach(d=>d()));});return {get paused(){return b.paused},set paused(p){b.paused=p;},onEnd(p){f.push(p);},then(p){return this.onEnd(p),this},cancel(){b.cancel();},finish(){b.cancel(),u(r),f.forEach(p=>p());}}}}}i(An,"timer");let Fs=640,Is=65536;function Ls(t={}){let r=null,s=null,u=false;return {id:"body",require:["pos","area"],vel:new v(0),jumpForce:t.jumpForce??Fs,gravityScale:t.gravityScale??1,isStatic:t.isStatic??false,mass:t.mass??1,add(){if(this.mass===0)throw new Error("Can't set body mass to 0");this.onCollideUpdate((a,h)=>{if(a.is("body")&&!h.resolved&&(this.trigger("beforePhysicsResolve",h),a.trigger("beforePhysicsResolve",h.reverse()),!h.resolved&&!(this.isStatic&&a.isStatic))){if(!this.isStatic&&!a.isStatic){let f=this.mass+a.mass;this.pos=this.pos.add(h.displacement.scale(a.mass/f)),a.pos=a.pos.add(h.displacement.scale(-this.mass/f)),this.transform=jt(this),a.transform=jt(a);}else {let f=!this.isStatic&&a.isStatic?h:h.reverse();f.source.pos=f.source.pos.add(f.displacement),f.source.transform=jt(f.source);}h.resolved=true,this.trigger("physicsResolve",h),a.trigger("physicsResolve",h.reverse());}}),this.onPhysicsResolve(a=>{C.gravity&&(a.isBottom()&&this.isFalling()?(this.vel.y=0,r=a.target,s=a.target.pos,u?u=false:this.trigger("ground",r)):a.isTop()&&this.isJumping()&&(this.vel.y=0,this.trigger("headbutt",a.target)));});},update(){if(!C.gravity||this.isStatic)return;if(u&&(r=null,s=null,this.trigger("fallOff"),u=false),r)if(!this.isColliding(r)||!r.exists()||!r.is("body"))u=true;else {!r.pos.eq(s)&&t.stickToPlatform!==false&&this.moveBy(r.pos.sub(s)),s=r.pos;return}let a=this.vel.y;this.vel.y+=C.gravity*this.gravityScale*Me(),this.vel.y=Math.min(this.vel.y,t.maxVelocity??Is),a<0&&this.vel.y>=0&&this.trigger("fall"),this.move(this.vel);},onPhysicsResolve(a){return this.on("physicsResolve",a)},onBeforePhysicsResolve(a){return this.on("beforePhysicsResolve",a)},curPlatform(){return r},isGrounded(){return r!==null},isFalling(){return this.vel.y>0},isJumping(){return this.vel.y<0},jump(a){r=null,s=null,this.vel.y=-a||-this.jumpForce;},onGround(a){return this.on("ground",a)},onFall(a){return this.on("fall",a)},onFallOff(a){return this.on("fallOff",a)},onHeadbutt(a){return this.on("headbutt",a)}}}i(Ls,"body");function Vs(t=2){let r=t;return {id:"doubleJump",require:["body"],numJumps:t,add(){this.onGround(()=>{r=this.numJumps;});},doubleJump(s){r<=0||(r<this.numJumps&&this.trigger("doubleJump"),r--,this.jump(s));},onDoubleJump(s){return this.on("doubleJump",s)},inspect(){return `${r}`}}}i(Vs,"doubleJump");function _s(t,r){return {id:"shader",shader:t,...typeof r=="function"?{uniform:r(),update(){this.uniform=r();}}:{uniform:r}}}i(_s,"shader");function ks(){return {id:"fixed",fixed:true}}i(ks,"fixed");function or(t){return {id:"stay",stay:true,scenesToStay:t}}i(or,"stay");function Ns(t,r){if(t==null)throw new Error("health() requires the initial amount of hp");return {id:"health",hurt(s=1){this.setHP(t-s),this.trigger("hurt",s);},heal(s=1){let u=t;this.setHP(t+s),this.trigger("heal",t-u);},hp(){return t},maxHP(){return r??null},setMaxHP(s){r=s;},setHP(s){t=r?Math.min(r,s):s,t<=0&&this.trigger("death");},onHurt(s){return this.on("hurt",s)},onHeal(s){return this.on("heal",s)},onDeath(s){return this.on("death",s)},inspect(){return `${t}`}}}i(Ns,"health");function js(t,r={}){if(t==null)throw new Error("lifespan() requires time");let s=r.fade??0;return {id:"lifespan",async add(){await hr(t),s>0&&this.opacity&&await Rn(this.opacity,0,s,u=>this.opacity=u,Ct.linear),this.destroy();}}}i(js,"lifespan");function Hs(t,r,s){if(!t)throw new Error("state() requires an initial state");let u={};function a(p){u[p]||(u[p]={enter:new be,end:new be,update:new be,draw:new be});}i(a,"initStateEvents");function h(p,d,w){return a(d),u[d][p].add(w)}i(h,"on");function f(p,d,...w){a(d),u[d][p].trigger(...w);}i(f,"trigger");let b=false;return {id:"state",state:t,enterState(p,...d){if(b=true,r&&!r.includes(p))throw new Error(`State not found: ${p}`);let w=this.state;if(s){if(!s?.[w])return;let A=typeof s[w]=="string"?[s[w]]:s[w];if(!A.includes(p))throw new Error(`Cannot transition state from "${w}" to "${p}". Available transitions: ${A.map(D=>`"${D}"`).join(", ")}`)}f("end",w,...d),this.state=p,f("enter",p,...d),f("enter",`${w} -> ${p}`,...d);},onStateTransition(p,d,w){return h("enter",`${p} -> ${d}`,w)},onStateEnter(p,d){return h("enter",p,d)},onStateUpdate(p,d){return h("update",p,d)},onStateDraw(p,d){return h("draw",p,d)},onStateEnd(p,d){return h("end",p,d)},update(){b||(f("enter",t),b=true),f("update",this.state);},draw(){f("draw",this.state);},inspect(){return this.state}}}i(Hs,"state");function qs(t=1){let r=0,s=false;return {require:["opacity"],add(){this.opacity=0;},update(){s||(r+=Me(),this.opacity=_e(r,0,t,0,1),r>=t&&(this.opacity=1,s=true));}}}i(qs,"fadeIn");function $s(t="intersect"){return {id:"mask",mask:t}}i($s,"mask");function zs(t){return {add(){this.canvas=t;}}}i(zs,"drawon");function Tn(t){k.loaded?t():C.events.on("load",t);}i(Tn,"onLoad");function Ks(t,r){C.scenes[t]=r;}i(Ks,"scene");function Ys(t,...r){if(!C.scenes[t])throw new Error(`Scene not found: ${t}`);C.events.onOnce("frameEnd",()=>{C.events.trigger("sceneLeave",t),y.events.clear(),C.events.clear(),C.objEvents.clear(),[...C.root.children].forEach(s=>{(!s.stay||s.scenesToStay&&!s.scenesToStay.includes(t))&&C.root.remove(s);}),C.root.clearEvents(),pr(),C.cam={pos:null,scale:T(1),angle:0,shake:0,transform:new Ue},C.scenes[t](...r);});}i(Ys,"go");function Ws(t){return C.events.on("sceneLeave",t)}i(Ws,"onSceneLeave");function Xs(t,r){try{return JSON.parse(window.localStorage[t])}catch{return r?(ar(t,r),r):null}}i(Xs,"getData");function ar(t,r){window.localStorage[t]=JSON.stringify(r);}i(ar,"setData");function ur(t,...r){let s=t(Ze),u;typeof s=="function"?u=s(...r)(Ze):u=s;for(let a in u)Ze[a]=u[a],n.global!==false&&(window[a]=u[a]);return Ze}i(ur,"plug");function zt(){return T(we()/2,xe()/2)}i(zt,"center");let Js;(O=>(O[O.None=0]="None",O[O.Left=1]="Left",O[O.Top=2]="Top",O[O.LeftTop=3]="LeftTop",O[O.Right=4]="Right",O[O.Horizontal=5]="Horizontal",O[O.RightTop=6]="RightTop",O[O.HorizontalTop=7]="HorizontalTop",O[O.Bottom=8]="Bottom",O[O.LeftBottom=9]="LeftBottom",O[O.Vertical=10]="Vertical",O[O.LeftVertical=11]="LeftVertical",O[O.RightBottom=12]="RightBottom",O[O.HorizontalBottom=13]="HorizontalBottom",O[O.RightVertical=14]="RightVertical",O[O.All=15]="All"))(Js||={});function cr(t={}){let r=T(0),s=t.isObstacle??false,u=t.cost??0,a=t.edges??[],h=i(()=>{let b={left:1,top:2,right:4,bottom:8};return a.map(p=>b[p]||0).reduce((p,d)=>p|d,0)},"getEdgeMask"),f=h();return {id:"tile",tilePosOffset:t.offset??T(0),set tilePos(b){let p=this.getLevel();r=b.clone(),this.pos=T(this.tilePos.x*p.tileWidth(),this.tilePos.y*p.tileHeight()).add(this.tilePosOffset);},get tilePos(){return r},set isObstacle(b){s!==b&&(s=b,this.getLevel().invalidateNavigationMap());},get isObstacle(){return s},set cost(b){u!==b&&(u=b,this.getLevel().invalidateNavigationMap());},get cost(){return u},set edges(b){a=b,f=h(),this.getLevel().invalidateNavigationMap();},get edges(){return a},get edgeMask(){return f},getLevel(){return this.parent},moveLeft(){this.tilePos=this.tilePos.add(T(-1,0));},moveRight(){this.tilePos=this.tilePos.add(T(1,0));},moveUp(){this.tilePos=this.tilePos.add(T(0,-1));},moveDown(){this.tilePos=this.tilePos.add(T(0,1));}}}i(cr,"tile");function Qs(t,r){if(!r.tileWidth||!r.tileHeight)throw new Error("Must provide tileWidth and tileHeight.");let s=gt([qt(r.pos??T(0))]),u=t.length,a=0,h=null,f=null,b=null,p=null,d=i(U=>U.x+U.y*a,"tile2Hash"),w=i(U=>T(Math.floor(U%a),Math.floor(U/a)),"hash2Tile"),A=i(()=>{h=[];for(let U of s.children)D(U);},"createSpatialMap"),D=i(U=>{let G=d(U.tilePos);h[G]?h[G].push(U):h[G]=[U];},"insertIntoSpatialMap"),N=i(U=>{let G=d(U.tilePos);if(h[G]){let B=h[G].indexOf(U);B>=0&&h[G].splice(B,1);}},"removeFromSpatialMap"),_=i(()=>{let U=false;for(let G of s.children){let B=s.pos2Tile(G.pos);(G.tilePos.x!=B.x||G.tilePos.y!=B.y)&&(U=true,N(G),G.tilePos.x=B.x,G.tilePos.y=B.y,D(G));}U&&s.trigger("spatial_map_changed");},"updateSpatialMap"),M=i(()=>{let U=s.getSpatialMap(),G=s.numRows()*s.numColumns();f?f.length=G:f=new Array(G),f.fill(1,0,G);for(let B=0;B<U.length;B++){let F=U[B];if(F){let Y=0;for(let ee of F)if(ee.isObstacle){Y=1/0;break}else Y+=ee.cost;f[B]=Y||1;}}},"createCostMap"),O=i(()=>{let U=s.getSpatialMap(),G=s.numRows()*s.numColumns();b?b.length=G:b=new Array(G),b.fill(15,0,G);for(let B=0;B<U.length;B++){let F=U[B];if(F){let Y=F.length,ee=15;for(let ue=0;ue<Y;ue++)ee|=F[ue].edgeMask;b[B]=ee;}}},"createEdgeMap"),ie=i(()=>{let U=s.numRows()*s.numColumns(),G=i((F,Y)=>{let ee=[];for(ee.push(F);ee.length>0;){let ue=ee.pop();V(ue).forEach(me=>{p[me]<0&&(p[me]=Y,ee.push(me));});}},"traverse");p?p.length=U:p=new Array(U),p.fill(-1,0,U);let B=0;for(let F=0;F<f.length;F++){if(p[F]>=0){B++;continue}G(F,B),B++;}},"createConnectivityMap"),Z=i((U,G)=>f[G],"getCost"),H=i((U,G)=>{let B=w(U),F=w(G);return B.dist(F)},"getHeuristic"),V=i((U,G)=>{let B=[],F=Math.floor(U%a),Y=F>0&&b[U]&1&&f[U-1]!==1/0,ee=U>=a&&b[U]&2&&f[U-a]!==1/0,ue=F<a-1&&b[U]&4&&f[U+1]!==1/0,me=U<a*u-a-1&&b[U]&8&&f[U+a]!==1/0;return G?(Y&&(ee&&B.push(U-a-1),B.push(U-1),me&&B.push(U+a-1)),ee&&B.push(U-a),ue&&(ee&&B.push(U-a+1),B.push(U+1),me&&B.push(U+a+1)),me&&B.push(U+a)):(Y&&B.push(U-1),ee&&B.push(U-a),ue&&B.push(U+1),me&&B.push(U+a)),B},"getNeighbours"),fe={id:"level",tileWidth(){return r.tileWidth},tileHeight(){return r.tileHeight},spawn(U,...G){let B=T(...G),F=(()=>{if(typeof U=="string"){if(r.tiles[U]){if(typeof r.tiles[U]!="function")throw new Error("Level symbol def must be a function returning a component list");return r.tiles[U](B)}else if(r.wildcardTile)return r.wildcardTile(U,B)}else {if(Array.isArray(U))return U;throw new Error("Expected a symbol or a component list")}})();if(!F)return null;let Y=false,ee=false;for(let me of F)me.id==="tile"&&(ee=true),me.id==="pos"&&(Y=true);Y||F.push(qt()),ee||F.push(cr());let ue=s.add(F);return Y&&(ue.tilePosOffset=ue.pos.clone()),ue.tilePos=B,h&&(D(ue),this.trigger("spatial_map_changed"),this.trigger("navigation_map_invalid")),ue},numColumns(){return a},numRows(){return u},levelWidth(){return a*this.tileWidth()},levelHeight(){return u*this.tileHeight()},tile2Pos(...U){return T(...U).scale(this.tileWidth(),this.tileHeight())},pos2Tile(...U){let G=T(...U);return T(Math.floor(G.x/this.tileWidth()),Math.floor(G.y/this.tileHeight()))},getSpatialMap(){return h||A(),h},onSpatialMapChanged(U){return this.on("spatial_map_changed",U)},onNavigationMapInvalid(U){return this.on("navigation_map_invalid",U)},getAt(U){h||A();let G=d(U);return h[G]||[]},update(){h&&_();},invalidateNavigationMap(){f=null,b=null,p=null;},onNavigationMapChanged(U){return this.on("navigation_map_changed",U)},getTilePath(U,G,B={}){if(f||M(),b||O(),p||ie(),U.x<0||U.x>=a||U.y<0||U.y>=u||G.x<0||G.x>=a||G.y<0||G.y>=u)return null;let F=d(U),Y=d(G);if(f[Y]===1/0)return null;if(F===Y)return [];if(p[F]!=-1&&p[F]!==p[Y])return null;let ee=new Yt((Fe,Mn)=>Fe.cost<Mn.cost);ee.insert({cost:0,node:F});let ue=new Map;ue.set(F,F);let me=new Map;for(me.set(F,0);ee.length!==0;){let Fe=ee.remove()?.node;if(Fe===Y)break;let Mn=V(Fe,B.allowDiagonals);for(let et of Mn){let Gn=(me.get(Fe)||0)+Z(Fe,et)+H(et,Y);(!me.has(et)||Gn<me.get(et))&&(me.set(et,Gn),ee.insert({cost:Gn,node:et}),ue.set(et,Fe));}}let Dn=[],wt=Y,vi=w(wt);for(Dn.push(vi);wt!==F;){wt=ue.get(wt);let Fe=w(wt);Dn.push(Fe);}return Dn.reverse()},getPath(U,G,B={}){let F=this.tileWidth(),Y=this.tileHeight(),ee=this.getTilePath(this.pos2Tile(U),this.pos2Tile(G),B);return ee?[U,...ee.slice(1,-1).map(ue=>ue.scale(F,Y).add(F/2,Y/2)),G]:null}};return s.use(fe),s.onNavigationMapInvalid(()=>{s.invalidateNavigationMap(),s.trigger("navigation_map_changed");}),t.forEach((U,G)=>{let B=U.split("");a=Math.max(B.length,a),B.forEach((F,Y)=>{s.spawn(F,T(Y,G));});}),s}i(Qs,"addLevel");function Zs(t={}){let r=null,s=null,u=null,a=null;return {id:"agent",require:["pos","tile"],agentSpeed:t.speed??100,allowDiagonals:t.allowDiagonals??true,getDistanceToTarget(){return r?this.pos.dist(r):0},getNextLocation(){return s&&u?s[u]:null},getPath(){return s?s.slice():null},getTarget(){return r},isNavigationFinished(){return s?u===null:true},isTargetReachable(){return s!==null},isTargetReached(){return r?this.pos.eq(r):true},setTarget(h){r=h,s=this.getLevel().getPath(this.pos,r,{allowDiagonals:this.allowDiagonals}),u=s?0:null,s?(a||(a=this.getLevel().onNavigationMapChanged(()=>{s&&u!==null&&(s=this.getLevel().getPath(this.pos,r,{allowDiagonals:this.allowDiagonals}),u=s?0:null,s?this.trigger("navigation-next",this,s[u]):this.trigger("navigation-ended",this));}),this.onDestroy(()=>a.cancel())),this.trigger("navigation-started",this),this.trigger("navigation-next",this,s[u])):this.trigger("navigation-ended",this);},update(){if(s&&u!==null){if(this.pos.sdist(s[u])<2)if(u===s.length-1){this.pos=r.clone(),u=null,this.trigger("navigation-ended",this),this.trigger("target-reached",this);return}else u++,this.trigger("navigation-next",this,s[u]);this.moveTo(s[u],this.agentSpeed);}},onNavigationStarted(h){return this.on("navigation-started",h)},onNavigationNext(h){return this.on("navigation-next",h)},onNavigationEnded(h){return this.on("navigation-ended",h)},onTargetReached(h){return this.on("target-reached",h)},inspect(){return JSON.stringify({target:JSON.stringify(r),path:JSON.stringify(s)})}}}i(Zs,"agent");function ei(t){let r=y.canvas.captureStream(t),s=te.ctx.createMediaStreamDestination();te.masterNode.connect(s);let u=new MediaRecorder(r),a=[];return u.ondataavailable=h=>{h.data.size>0&&a.push(h.data);},u.onerror=()=>{te.masterNode.disconnect(s),r.getTracks().forEach(h=>h.stop());},u.start(),{resume(){u.resume();},pause(){u.pause();},stop(){return u.stop(),te.masterNode.disconnect(s),r.getTracks().forEach(h=>h.stop()),new Promise(h=>{u.onstop=()=>{h(new Blob(a,{type:"video/mp4"}));};})},download(h="kaboom.mp4"){this.stop().then(f=>Nn(h,f));}}}i(ei,"record");function ti(){return document.activeElement===y.canvas}i(ti,"isFocused");function ni(t){t.destroy();}i(ni,"destroy");let gt=C.root.add.bind(C.root),ri=C.root.readd.bind(C.root),si=C.root.removeAll.bind(C.root),On=C.root.get.bind(C.root),hr=C.root.wait.bind(C.root),ii=C.root.loop.bind(C.root),Rn=C.root.tween.bind(C.root);function lr(t=2,r=1){let s=0;return {require:["scale"],update(){let u=Math.sin(s*t)*r;u<0&&this.destroy(),this.scale=T(u),s+=Me();}}}i(lr,"boom");let oi=Ye(null,qr),ai=Ye(null,$r);function ui(t,r={}){let s=gt([qt(t),or()]),u=(r.speed||1)*5,a=r.scale||1;s.add([Cn(ai),$t(0),Sn("center"),lr(u,a),...r.comps??[]]);let h=s.add([Cn(oi),$t(0),Sn("center"),An(),...r.comps??[]]);return h.wait(.4/u,()=>h.use(lr(u,a))),h.onDestroy(()=>s.destroy()),s}i(ui,"addKaboom");function dr(){C.root.update();}i(dr,"updateFrame");class Pn{static{i(this,"Collision");}source;target;displacement;resolved=false;constructor(r,s,u,a=false){this.source=r,this.target=s,this.displacement=u,this.resolved=a;}reverse(){return new Pn(this.target,this.source,this.displacement.scale(-1),this.resolved)}hasOverlap(){return !this.displacement.isZero()}isLeft(){return this.displacement.x>0}isRight(){return this.displacement.x<0}isTop(){return this.displacement.y>0}isBottom(){return this.displacement.y<0}preventResolution(){this.resolved=true;}}function ci(){let t={},r=n.hashGridSize||Hi,s=new Ue,u=[];function a(h){if(u.push(s.clone()),h.pos&&s.translate(h.pos),h.scale&&s.scale(h.scale),h.angle&&s.rotate(h.angle),h.transform=s.clone(),h.c("area")&&!h.paused){let f=h,p=f.worldArea().bbox(),d=Math.floor(p.pos.x/r),w=Math.floor(p.pos.y/r),A=Math.ceil((p.pos.x+p.width)/r),D=Math.ceil((p.pos.y+p.height)/r),N=new Set;for(let _=d;_<=A;_++)for(let M=w;M<=D;M++)if(!t[_])t[_]={},t[_][M]=[f];else if(!t[_][M])t[_][M]=[f];else {let O=t[_][M];e:for(let ie of O){if(ie.paused||!ie.exists()||N.has(ie.id))continue;for(let H of f.collisionIgnore)if(ie.is(H))continue e;for(let H of ie.collisionIgnore)if(f.is(H))continue e;let Z=Or(f.worldArea(),ie.worldArea());if(Z){let H=new Pn(f,ie,Z);f.trigger("collideUpdate",ie,H);let V=H.reverse();V.resolved=H.resolved,ie.trigger("collideUpdate",f,V);}N.add(ie.id);}O.push(f);}}h.children.forEach(a),s=u.pop();}i(a,"checkObj"),a(C.root);}i(ci,"checkFrame");function hi(){let t=C.cam,r=v.fromAngle(xt(0,360)).scale(t.shake);t.shake=Ve(t.shake,0,5*Me()),t.transform=new Ue().translate(zt()).scale(t.scale).rotate(t.angle).translate((t.pos??zt()).scale(-1).add(r)),C.root.draw(),Pe();}i(hi,"drawFrame");function li(){let t=$();C.events.numListeners("loading")>0?C.events.trigger("loading",t):Ce(()=>{let r=we()/2,s=24,u=T(we()/2,xe()/2).sub(T(r/2,s/2));ge({pos:T(0),width:we(),height:xe(),color:J(0,0,0)}),ge({pos:u,width:r,height:s,fill:false,outline:{width:4}}),ge({pos:u,width:r*t,height:s});});}i(li,"drawLoadScreen");function fr(t,r){Ce(()=>{let s=T(8);le(),ne(t);let u=Xe({text:r,font:nn,size:16,pos:s,color:J(255,255,255),fixed:true}),a=u.width+s.x*2,h=u.height+s.x*2;t.x+a>=we()&&ne(T(-a,0)),t.y+h>=xe()&&ne(T(0,-h)),ge({width:a,height:h,color:J(0,0,0),radius:4,opacity:.8,fixed:true}),Je(u),ae();});}i(fr,"drawInspectText");function di(){if(re.inspect){let t=null;for(let r of C.root.get("*",{recursive:true}))if(r.c("area")&&r.isHovering()){t=r;break}if(C.root.drawInspect(),t){let r=[],s=t.inspect();for(let u in s)s[u]?r.push(`${u}: ${s[u]}`):r.push(`${u}`);fr(ns(Nt()),r.join(`
`));}fr(T(8),`FPS: ${re.fps()}`);}re.paused&&Ce(()=>{le(),ne(we(),0),ne(-8,8);let t=32;ge({width:t,height:t,anchor:"topright",color:J(0,0,0),opacity:.8,radius:4,fixed:true});for(let r=1;r<=2;r++)ge({width:4,height:t*.6,anchor:"center",pos:T(-32/3*r,t*.5),color:J(255,255,255),radius:2,fixed:true});ae();}),re.timeScale!==1&&Ce(()=>{le(),ne(we(),xe()),ne(-8,-8);let t=8,r=Xe({text:re.timeScale.toFixed(1),font:nn,size:16,color:J(255,255,255),pos:T(-8),anchor:"botright",fixed:true});ge({width:r.width+t*2+t*4,height:r.height+t*2,anchor:"botright",color:J(0,0,0),opacity:.8,radius:4,fixed:true});for(let s=0;s<2;s++){let u=re.timeScale<1;R({p1:T(-r.width-t*(u?2:3.5),-8),p2:T(-r.width-t*(u?2:3.5),-8-r.height),p3:T(-r.width-t*(u?3.5:2),-8-r.height/2),pos:T(-s*t*1+(u?-8*.5:0),0),color:J(255,255,255),fixed:true});}Je(r),ae();}),re.curRecording&&Ce(()=>{le(),ne(0,xe()),ne(24,-24),L({radius:12,color:J(255,0,0),opacity:In(0,1,y.time()*4),fixed:true}),ae();}),re.showLog&&C.logs.length>0&&Ce(()=>{le(),ne(0,xe()),ne(8,-8);let t=8,r=[];for(let u of C.logs){let a="",h=u.msg instanceof Error?"error":"info";a+=`[time]${u.time.toFixed(2)}[/time]`,a+=" ",a+=`[${h}]${u.msg?.toString?u.msg.toString():u.msg}[/${h}]`,r.push(a);}C.logs=C.logs.filter(u=>y.time()-u.time<(n.logTime||$i));let s=Xe({text:r.join(`
`),font:nn,pos:T(t,-8),anchor:"botleft",size:16,width:we()*.6,lineSpacing:t/2,fixed:true,styles:{time:{color:J(127,127,127)},info:{color:J(255,255,255)},error:{color:J(255,0,127)}}});ge({width:s.width+t*2,height:s.height+t*2,anchor:"botleft",color:J(0,0,0),radius:4,opacity:.8,fixed:true}),Je(s),ae();});}i(di,"drawDebug");function fi(t){C.events.on("loading",t);}i(fi,"onLoading");function mi(t){y.onResize(t);}i(mi,"onResize");function pi(t){C.events.on("error",t);}i(pi,"onError");function gi(t){console.error(t),te.ctx.suspend(),y.run(()=>{dt(),Ce(()=>{let u=we(),a=xe(),h={size:36,width:u-32*2,letterSpacing:4,lineSpacing:4,font:nn,fixed:true};ge({width:u,height:a,color:J(0,0,255),fixed:true});let f=Xe({...h,text:"Error",pos:T(32),color:J(255,128,0),fixed:true});Je(f),tr({...h,text:t.message,pos:T(32,32+f.height+16),fixed:true}),ae(),C.events.trigger("error",t);}),ft();});}i(gi,"handleErr");function wi(t){X.push(t);}i(wi,"onCleanup");function bi(){C.events.onOnce("frameEnd",()=>{y.quit(),S.clear(S.COLOR_BUFFER_BIT|S.DEPTH_BUFFER_BIT|S.STENCIL_BUFFER_BIT);let t=S.getParameter(S.MAX_TEXTURE_IMAGE_UNITS);for(let r=0;r<t;r++)S.activeTexture(S.TEXTURE0+r),S.bindTexture(S.TEXTURE_2D,null),S.bindTexture(S.TEXTURE_CUBE_MAP,null);S.bindBuffer(S.ARRAY_BUFFER,null),S.bindBuffer(S.ELEMENT_ARRAY_BUFFER,null),S.bindRenderbuffer(S.RENDERBUFFER,null),S.bindFramebuffer(S.FRAMEBUFFER,null),q.destroy(),X.forEach(r=>r());});}i(bi,"quit");let Kt=true;y.run(()=>{try{k.loaded||$()===1&&!Kt&&(k.loaded=!0,C.events.trigger("load")),!k.loaded&&n.loadingScreen!==!1||Kt?(dt(),li(),ft()):(re.paused||dr(),ci(),dt(),hi(),n.debug!==!1&&di(),ft()),Kt&&(Kt=!1),C.events.trigger("frameEnd");}catch(t){gi(t);}});function mr(){let t=P,r=S.drawingBufferWidth/t,s=S.drawingBufferHeight/t;if(n.letterbox){if(!n.width||!n.height)throw new Error("Letterboxing requires width and height defined.");let u=r/s,a=n.width/n.height;if(u>a){let h=s*a,f=(r-h)/2;E.viewport={x:f,y:0,width:h,height:s};}else {let h=r/a,f=(s-h)/2;E.viewport={x:0,y:f,width:r,height:h};}return}if(n.stretch&&(!n.width||!n.height))throw new Error("Stretching requires width and height defined.");E.viewport={x:0,y:0,width:r,height:s};}i(mr,"updateViewport");function pr(){y.onHide(()=>{n.backgroundAudio||te.ctx.suspend();}),y.onShow(()=>{!n.backgroundAudio&&!re.paused&&te.ctx.resume();}),y.onResize(()=>{if(y.isFullscreen())return;let t=n.width&&n.height;t&&!n.stretch&&!n.letterbox||(o.width=o.offsetWidth*P,o.height=o.offsetHeight*P,mr(),t||(E.frameBuffer.free(),E.frameBuffer=new rt(q,S.drawingBufferWidth,S.drawingBufferHeight),E.width=S.drawingBufferWidth/P,E.height=S.drawingBufferHeight/P));}),n.debug!==false&&(y.onKeyPress("f1",()=>re.inspect=!re.inspect),y.onKeyPress("f2",()=>re.clearLog()),y.onKeyPress("f8",()=>re.paused=!re.paused),y.onKeyPress("f7",()=>{re.timeScale=mt(Le(re.timeScale-.2,0,2),1);}),y.onKeyPress("f9",()=>{re.timeScale=mt(Le(re.timeScale+.2,0,2),1);}),y.onKeyPress("f10",()=>re.stepFrame())),n.burp&&y.onKeyPress("b",()=>Lt());}i(pr,"initEvents"),mr(),pr();let Ze={VERSION:ki,loadRoot:Te,loadProgress:$,loadSprite:Ye,loadSpriteAtlas:Ot,loadSound:ln,loadBitmapFont:on,loadFont:st,loadShader:cn,loadShaderURL:hn,loadAseprite:un,loadPedit:an,loadBean:dn,loadJSON:ye,load:Ae,getSprite:Pt,getSound:Dt,getFont:Mt,getBitmapFont:Gt,getShader:Bt,getAsset:fn,Asset:ve,SpriteData:K,SoundData:Q,width:we,height:xe,center:zt,dt:Me,time:y.time,screenshot:y.screenshot,record:ei,isFocused:ti,setCursor:y.setCursor,getCursor:y.getCursor,setCursorLocked:y.setCursorLocked,isCursorLocked:y.isCursorLocked,setFullscreen:y.setFullscreen,isFullscreen:y.isFullscreen,isTouchscreen:y.isTouchscreen,onLoad:Tn,onLoading:fi,onResize:mi,onGamepadConnect:y.onGamepadConnect,onGamepadDisconnect:y.onGamepadDisconnect,onError:pi,onCleanup:wi,camPos:rs,camScale:ss,camRot:is,shake:os,toScreen:rr,toWorld:sr,setGravity:gs,getGravity:ws,setBackground:bs,getBackground:vs,getGamepads:y.getGamepads,add:gt,make:Un,destroy:ni,destroyAll:si,get:On,readd:ri,pos:qt,scale:$t,rotate:ys,color:xs,opacity:Us,anchor:Sn,area:Os,sprite:Cn,text:Rs,polygon:Ps,rect:Ds,circle:Gs,uvquad:Ms,outline:Bs,body:Ls,doubleJump:Vs,shader:_s,timer:An,fixed:ks,stay:or,health:Ns,lifespan:js,z:Es,move:Cs,offscreen:Ts,follow:Ss,state:Hs,fadeIn:qs,mask:$s,drawon:zs,tile:cr,agent:Zs,on:ze,onUpdate:as,onDraw:us,onAdd:En,onDestroy:ir,onClick:ds,onCollide:cs,onCollideUpdate:hs,onCollideEnd:ls,onHover:fs,onHoverUpdate:ms,onHoverEnd:ps,onKeyDown:y.onKeyDown,onKeyPress:y.onKeyPress,onKeyPressRepeat:y.onKeyPressRepeat,onKeyRelease:y.onKeyRelease,onMouseDown:y.onMouseDown,onMousePress:y.onMousePress,onMouseRelease:y.onMouseRelease,onMouseMove:y.onMouseMove,onCharInput:y.onCharInput,onTouchStart:y.onTouchStart,onTouchMove:y.onTouchMove,onTouchEnd:y.onTouchEnd,onScroll:y.onScroll,onHide:y.onHide,onShow:y.onShow,onGamepadButtonDown:y.onGamepadButtonDown,onGamepadButtonPress:y.onGamepadButtonPress,onGamepadButtonRelease:y.onGamepadButtonRelease,onGamepadStick:y.onGamepadStick,mousePos:Nt,mouseDeltaPos:y.mouseDeltaPos,isKeyDown:y.isKeyDown,isKeyPressed:y.isKeyPressed,isKeyPressedRepeat:y.isKeyPressedRepeat,isKeyReleased:y.isKeyReleased,isMouseDown:y.isMouseDown,isMousePressed:y.isMousePressed,isMouseReleased:y.isMouseReleased,isMouseMoved:y.isMouseMoved,isGamepadButtonPressed:y.isGamepadButtonPressed,isGamepadButtonDown:y.isGamepadButtonDown,isGamepadButtonReleased:y.isGamepadButtonReleased,getGamepadStick:y.getGamepadStick,charInputted:y.charInputted,loop:ii,wait:hr,play:It,volume:gn,burp:Lt,audioCtx:te.ctx,Line:Ie,Rect:de,Circle:yt,Polygon:Ke,Vec2:v,Color:W,Mat4:Ue,Quad:oe,RNG:bt,rand:xt,randi:Ln,randSeed:yr,vec2:T,rgb:J,hsl2rgb:vr,quad:ce,choose:Ur,chance:xr,lerp:Ve,tween:Rn,easings:Ct,map:_e,mapc:br,wave:In,deg2rad:Ge,rad2deg:ot,clamp:Le,testLineLine:it,testRectRect:Er,testRectLine:Sr,testRectPoint:vt,testCirclePolygon:Tr,testLinePoint:Cr,testLineCircle:Vn,drawSprite:yn,drawText:tr,formatText:Xe,drawRect:ge,drawLine:l,drawLines:x,drawTriangle:R,drawCircle:L,drawEllipse:he,drawUVQuad:Be,drawPolygon:z,drawFormattedText:Je,drawMasked:$e,drawSubtracted:kt,pushTransform:le,popTransform:ae,pushTranslate:ne,pushScale:He,pushRotate:se,pushMatrix:_t,usePostEffect:Vt,makeCanvas:wn,debug:re,scene:Ks,go:Ys,onSceneLeave:Ws,addLevel:Qs,getData:Xs,setData:ar,download:Xt,downloadJSON:Dr,downloadText:kn,downloadBlob:Nn,plug:ur,ASCII_CHARS:zr,canvas:y.canvas,addKaboom:ui,LEFT:v.LEFT,RIGHT:v.RIGHT,UP:v.UP,DOWN:v.DOWN,RED:W.RED,GREEN:W.GREEN,BLUE:W.BLUE,YELLOW:W.YELLOW,MAGENTA:W.MAGENTA,CYAN:W.CYAN,WHITE:W.WHITE,BLACK:W.BLACK,quit:bi,Event:be,EventHandler:Ne,EventController:ke};if(n.plugins&&n.plugins.forEach(ur),n.global!==false)for(let t in Ze)window[t]=Ze[t];return n.focus!==false&&y.canvas.focus(),Ze},"default");

function Game() {
  const canvasRef = reactExports.useRef(null);
  const { player: playerId = "player1" } = useParams();
  reactExports.useEffect(() => {
    const vw = window.innerWidth - 4;
    const vh = window.innerHeight - 4;
    const k = zo({
      canvas: canvasRef.current,
      width: vw,
      height: vh,
      global: false,
      background: [0, 0, 0]
    });
    const SPEED = 600;
    let lives = 3;
    const spawnInterval = 3.2;
    const enemySpeedByLevel = [0, 250, 300, 350, 400, 450];
    let level = 1;
    const maxLevel = 5;
    const levelDuration = 30;
    let levelProgress = 0;
    let elapsedTime = 0;
    let currentEnemySpeed = enemySpeedByLevel[level];
    let coinCount = 0;
    const hearts = [];
    let gameOverTriggered = false;
    k.setGravity(2400);
    let levelFill, timeText, coinText, levelText;
    k.loadSprite("bg", "/src/assets/bg.png").then((tex) => {
      k.add([
        k.sprite("bg"),
        k.pos(0, 0),
        k.scale(vw / tex.width, vh / tex.height),
        k.anchor("topleft"),
        k.fixed(),
        k.z(-100)
      ]);
    });
    Promise.all([
      k.loadSprite("player1", "/src/assets/hero-1.png"),
      k.loadSprite("player2", "/src/assets/hero-2.png"),
      k.loadSprite("stage", "/src/assets/stage-1.png"),
      k.loadSprite("enemy", "/src/assets/enemy-1.png"),
      k.loadSprite("enemy1", "/src/assets/enemy-2.png"),
      k.loadSprite("enemy2", "/src/assets/enemy-3.png"),
      k.loadSprite("enemy3", "/src/assets/enemy-4.png"),
      k.loadSprite("enemy4", "/src/assets/enemy-5.png"),
      k.loadSprite("heart", "/src/assets/heart.gif"),
      k.loadSprite("coin", "/src/assets/coin.png"),
      k.loadSound("score", "/src/assets/score.mp3"),
      k.loadSound("game-over", "/src/assets/game-over.mp3"),
      k.loadSound("jump", "/src/assets/jump.mp3"),
      k.loadSound("lose-heart", "/src/assets/lose-heart.mp3")
    ]).then(() => {
      const pl = playerId === "player1" ? "player1" : "player2";
      const player = k.add([
        k.sprite(playerId),
        k.pos(vw / 2, vh / 2 + 200),
        k.area(),
        k.scale(0.2),
        k.body(),
        k.anchor("bot"),
        pl
      ]);
      const stageWidth = vw * 0.7;
      const stageHeight = 100;
      const platforms = [
        [vw / 2, vh / 2 - 180],
        [-200, vh / 2 + 70],
        [vw + 200, vh / 2 + 70],
        [vw / 2, vh / 2 + 300]
      ];
      platforms.forEach(([x, y]) => {
        k.add([
          k.sprite("stage"),
          k.pos(x, y),
          k.area({ shape: new k.Rect(k.vec2(0), stageWidth, stageHeight) }),
          k.body({ isStatic: true }),
          k.anchor("bot"),
          k.scale(stageWidth / 1480, stageHeight / 149)
        ]);
      });
      k.add([
        k.rect(200, 20),
        k.pos(vw - 250, 30),
        k.color(80, 80, 80),
        k.fixed(),
        k.z(100)
      ]);
      levelFill = k.add([
        k.rect(0, 20),
        k.pos(vw - 250, 30),
        k.color(0, 255, 100),
        k.fixed(),
        k.z(101)
      ]);
      timeText = k.add([
        k.text("Time: 00:00", { size: 24 }),
        k.pos(vw / 2, 30),
        k.anchor("center"),
        k.fixed(),
        k.color(255, 255, 255)
      ]);
      coinText = k.add([
        k.text("Coins: 0", { size: 24 }),
        k.pos(30, 30),
        k.fixed()
      ]);
      levelText = k.add([
        k.text("Level: 1", { size: 24 }),
        k.pos(30, 60),
        k.fixed()
      ]);
      const updateHUD = () => {
        coinText.text = `Coins: ${coinCount}`;
        levelText.text = `Level: ${level}`;
        const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, "0");
        const seconds = Math.floor(elapsedTime % 60).toString().padStart(2, "0");
        timeText.text = `Time: ${minutes}:${seconds}`;
        const fillWidth = Math.min(levelProgress / levelDuration * 200, 200);
        levelFill.width = fillWidth;
      };
      const showGameOver = () => {
        gameOverTriggered = true;
        k.play("game-over");
        const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, "0");
        const seconds = Math.floor(elapsedTime % 60).toString().padStart(2, "0");
        const duration = `${minutes}:${seconds}`;
        let title = "Rookie Adventurer";
        if (elapsedTime >= 180) title = "Veteran Survivor";
        else if (elapsedTime >= 120) title = "Determined Explorer";
        else if (elapsedTime >= 60) title = "Quick Learner";
        const overlay = k.add([
          k.rect(vw, vh),
          k.pos(0, 0),
          k.color(0, 0, 0),
          k.opacity(0),
          k.fixed(),
          k.z(998)
        ]);
        k.tween(0, 0.6, 1, (val) => overlay.opacity = val);
        k.add([
          k.rect(vw, vh),
          k.pos(0, 0),
          k.color(0, 0, 0),
          k.opacity(0.4),
          k.fixed(),
          k.z(999)
        ]);
        const texts = [
          { text: "GAME OVER", size: 48, y: vh / 2 - 100, color: [255, 0, 0] },
          { text: `Coins Collected: ${coinCount}`, size: 24, y: vh / 2 - 20 },
          { text: `Time Survived: ${duration}`, size: 24, y: vh / 2 + 20 },
          {
            text: `Title: ${title}`,
            size: 24,
            y: vh / 2 + 60,
            color: [0, 255, 255]
          }
        ];
        texts.forEach((t, i) => {
          const label = k.add([
            k.text(t.text, { size: t.size }),
            k.pos(vw / 2, t.y + 30),
            k.anchor("center"),
            k.color(t.color || [255, 255, 255]),
            k.z(1e3),
            k.opacity(0)
          ]);
          k.wait(i * 0.3, () => {
            k.tween(0, 1, 0.5, (val) => label.opacity = val);
            k.tween(label.pos.y, t.y, 0.5, (val) => label.pos.y = val);
          });
        });
        k.wait(1.5, () => {
          const retryBtn = k.add([
            k.text("Try Again", { size: 28 }),
            k.pos(vw / 2, vh / 2 + 120),
            k.area(),
            k.anchor("center"),
            k.z(1001),
            k.color(255, 255, 255),
            k.scale(1)
          ]);
          retryBtn.onClick(() => {
            window.location.reload();
          });
          retryBtn.onHover(() => {
            retryBtn.scale = k.vec2(1.2);
          });
          retryBtn.onHoverEnd(() => {
            retryBtn.scale = k.vec2(1);
          });
        });
      };
      const addHearts = () => {
        for (let i = 0; i < lives; i++) {
          const heart = k.add([
            k.sprite("heart"),
            k.pos(30 + i * 40, 100),
            k.fixed(),
            k.scale(0.1),
            `heart-${i}`
          ]);
          hearts.push(heart);
        }
      };
      const resetPlayer = () => {
        player.pos = k.vec2(vw / 2, vh / 2 + 200);
        loseLife();
      };
      const loseLife = () => {
        if (lives <= 0 || gameOverTriggered) return;
        lives--;
        k.destroy(hearts[lives]);
        k.play("lose-heart");
        if (lives === 0) {
          player.use(k.body({ isStatic: true }));
          showGameOver();
        }
      };
      addHearts();
      k.onKeyDown("left", () => {
        if (!gameOverTriggered) {
          player.move(-600, 0);
          player.flipX = true;
        }
      });
      k.onKeyDown("right", () => {
        if (!gameOverTriggered) {
          player.move(SPEED, 0);
          player.flipX = false;
        }
      });
      k.onKeyPress("space", () => {
        if (player.isGrounded() && !gameOverTriggered) {
          player.jump(1200);
          k.play("jump");
        }
      });
      player.onCollide("danger", () => {
        resetPlayer();
      });
      player.onCollide("coin", (coin) => {
        k.play("score");
        k.destroy(coin);
        coinCount++;
        updateHUD();
      });
      k.onUpdate(() => {
        if (player.pos.y > vh + 200) resetPlayer();
        if (gameOverTriggered) return;
        elapsedTime += k.dt();
        levelProgress += k.dt();
        updateHUD();
      });
      k.loop(0.5, () => {
        if (levelProgress >= levelDuration && level < maxLevel && !gameOverTriggered) {
          level++;
          currentEnemySpeed = enemySpeedByLevel[level];
          levelProgress = 0;
          updateHUD();
        }
      });
      const spawnEnemy = () => {
        if (gameOverTriggered) return;
        const [spawnX, spawnY] = platforms[0];
        const dir = Math.random() > 0.5 ? 1 : -1;
        const shouldSwitch = Math.random() < 0.5;
        const enemy_name = Math.floor(Math.random() * 5);
        const enemies = ["enemy", "enemy1", "enemy2", "enemy3", "enemy4"];
        k.add([
          k.sprite(enemies[enemy_name]),
          k.pos(spawnX, spawnY - 10),
          k.area(),
          k.body({ isSensor: true }),
          k.anchor("bot"),
          k.scale(0.2),
          "ai_enemy",
          "danger",
          {
            dir,
            currentStage: 0,
            switched: false,
            shouldSwitch
          }
        ]);
      };
      k.onUpdate("ai_enemy", (enemy) => {
        if (gameOverTriggered) return;
        const state = enemy;
        const stageY = platforms[state.currentStage][1];
        if (enemy.pos.y > stageY + 20 && state.currentStage < platforms.length - 1) {
          state.currentStage++;
          if (state.currentStage === 1 && state.shouldSwitch && !state.switched) {
            state.dir *= -1;
            state.switched = true;
          }
        }
        const extra_s = Math.floor(Math.random() * 5) * 2;
        enemy.move(state.dir * currentEnemySpeed + extra_s, 0);
        if (enemy.pos.x < -200 || enemy.pos.x > vw + 200 || enemy.pos.y > vh + 200) {
          k.destroy(enemy);
        }
      });
      const spawnCoin = () => {
        if (gameOverTriggered) return;
        const randomPlatformIndex = Math.floor(
          Math.random() * platforms.length
        );
        const [xBase, y] = platforms[randomPlatformIndex];
        let random_pos_x;
        if (randomPlatformIndex === 0 || randomPlatformIndex === 3) {
          random_pos_x = xBase + Math.floor(Math.random() * 601) - 300;
        } else if (randomPlatformIndex === 1) {
          random_pos_x = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
        } else if (randomPlatformIndex === 2) {
          random_pos_x = Math.floor(Math.random() * (300 - 100 + 1)) * -1;
        }
        const coin = k.add([
          k.sprite("coin"),
          k.pos(random_pos_x, y - 110),
          k.area(),
          k.scale(0.15),
          "coin"
        ]);
        k.wait(5, () => {
          if (coin.exists()) k.destroy(coin);
        });
      };
      k.loop(spawnInterval, () => {
        if (Math.random() < 0.6) {
          spawnEnemy();
          spawnEnemy();
        } else {
          spawnEnemy();
          spawnEnemy();
          spawnEnemy();
        }
      });
      k.loop(1, () => {
        spawnCoin();
      });
    });
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "game-container" });
}

const Layout = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
};
clientExports.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(BrowserRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Routes, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, {}), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { index: true, element: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/game/:player", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Game, {}) })
  ] }) }) })
);

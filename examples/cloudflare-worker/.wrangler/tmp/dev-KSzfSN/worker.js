var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// .wrangler/tmp/bundle-BorWzd/checked-fetch.js
function checkURL(request2, init) {
  const url = request2 instanceof URL ? request2 : new URL(
    (typeof request2 === "string" ? new Request(request2, init) : request2).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
var urls;
var init_checked_fetch = __esm({
  ".wrangler/tmp/bundle-BorWzd/checked-fetch.js"() {
    urls = /* @__PURE__ */ new Set();
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request2, init] = argArray;
        checkURL(request2, init);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// node_modules/media-chrome/dist/constants.js
var constants_exports = {};
__export(constants_exports, {
  AttributeToStateChangeEventMap: () => AttributeToStateChangeEventMap,
  AvailabilityStates: () => AvailabilityStates,
  MediaStateChangeEvents: () => MediaStateChangeEvents,
  MediaStateReceiverAttributes: () => MediaStateReceiverAttributes,
  MediaUIAttributes: () => MediaUIAttributes,
  MediaUIEvents: () => MediaUIEvents,
  MediaUIProps: () => MediaUIProps,
  PointerTypes: () => PointerTypes,
  ReadyStates: () => ReadyStates,
  StateChangeEventToAttributeMap: () => StateChangeEventToAttributeMap,
  StreamTypes: () => StreamTypes,
  TextTrackKinds: () => TextTrackKinds,
  TextTrackModes: () => TextTrackModes
});
var MediaUIEvents, MediaStateReceiverAttributes, MediaUIProps, MediaUIPropsEntries, MediaUIAttributes, MediaStateChangeEvents, StateChangeEventToAttributeMap, AttributeToStateChangeEventMap, TextTrackKinds, TextTrackModes, ReadyStates, PointerTypes, AvailabilityStates, StreamTypes;
var init_constants = __esm({
  "node_modules/media-chrome/dist/constants.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    MediaUIEvents = {
      MEDIA_PLAY_REQUEST: "mediaplayrequest",
      MEDIA_PAUSE_REQUEST: "mediapauserequest",
      MEDIA_MUTE_REQUEST: "mediamuterequest",
      MEDIA_UNMUTE_REQUEST: "mediaunmuterequest",
      MEDIA_VOLUME_REQUEST: "mediavolumerequest",
      MEDIA_SEEK_REQUEST: "mediaseekrequest",
      MEDIA_AIRPLAY_REQUEST: "mediaairplayrequest",
      MEDIA_ENTER_FULLSCREEN_REQUEST: "mediaenterfullscreenrequest",
      MEDIA_EXIT_FULLSCREEN_REQUEST: "mediaexitfullscreenrequest",
      MEDIA_PREVIEW_REQUEST: "mediapreviewrequest",
      MEDIA_ENTER_PIP_REQUEST: "mediaenterpiprequest",
      MEDIA_EXIT_PIP_REQUEST: "mediaexitpiprequest",
      MEDIA_ENTER_CAST_REQUEST: "mediaentercastrequest",
      MEDIA_EXIT_CAST_REQUEST: "mediaexitcastrequest",
      MEDIA_SHOW_TEXT_TRACKS_REQUEST: "mediashowtexttracksrequest",
      MEDIA_HIDE_TEXT_TRACKS_REQUEST: "mediahidetexttracksrequest",
      MEDIA_SHOW_SUBTITLES_REQUEST: "mediashowsubtitlesrequest",
      MEDIA_DISABLE_SUBTITLES_REQUEST: "mediadisablesubtitlesrequest",
      MEDIA_PLAYBACK_RATE_REQUEST: "mediaplaybackraterequest",
      MEDIA_RENDITION_REQUEST: "mediarenditionrequest",
      MEDIA_AUDIO_TRACK_REQUEST: "mediaaudiotrackrequest",
      MEDIA_SEEK_TO_LIVE_REQUEST: "mediaseektoliverequest",
      REGISTER_MEDIA_STATE_RECEIVER: "registermediastatereceiver",
      UNREGISTER_MEDIA_STATE_RECEIVER: "unregistermediastatereceiver"
    };
    MediaStateReceiverAttributes = {
      MEDIA_CHROME_ATTRIBUTES: "mediachromeattributes",
      MEDIA_CONTROLLER: "mediacontroller"
    };
    MediaUIProps = {
      MEDIA_AIRPLAY_UNAVAILABLE: "mediaAirplayUnavailable",
      MEDIA_FULLSCREEN_UNAVAILABLE: "mediaFullscreenUnavailable",
      MEDIA_PIP_UNAVAILABLE: "mediaPipUnavailable",
      MEDIA_CAST_UNAVAILABLE: "mediaCastUnavailable",
      MEDIA_RENDITION_UNAVAILABLE: "mediaRenditionUnavailable",
      MEDIA_AUDIO_TRACK_UNAVAILABLE: "mediaAudioTrackUnavailable",
      MEDIA_PAUSED: "mediaPaused",
      MEDIA_HAS_PLAYED: "mediaHasPlayed",
      MEDIA_ENDED: "mediaEnded",
      MEDIA_MUTED: "mediaMuted",
      MEDIA_VOLUME_LEVEL: "mediaVolumeLevel",
      MEDIA_VOLUME: "mediaVolume",
      MEDIA_VOLUME_UNAVAILABLE: "mediaVolumeUnavailable",
      MEDIA_IS_PIP: "mediaIsPip",
      MEDIA_IS_CASTING: "mediaIsCasting",
      MEDIA_SUBTITLES_LIST: "mediaSubtitlesList",
      MEDIA_SUBTITLES_SHOWING: "mediaSubtitlesShowing",
      MEDIA_IS_FULLSCREEN: "mediaIsFullscreen",
      MEDIA_PLAYBACK_RATE: "mediaPlaybackRate",
      MEDIA_CURRENT_TIME: "mediaCurrentTime",
      MEDIA_DURATION: "mediaDuration",
      MEDIA_SEEKABLE: "mediaSeekable",
      MEDIA_PREVIEW_TIME: "mediaPreviewTime",
      MEDIA_PREVIEW_IMAGE: "mediaPreviewImage",
      MEDIA_PREVIEW_COORDS: "mediaPreviewCoords",
      MEDIA_LOADING: "mediaLoading",
      MEDIA_BUFFERED: "mediaBuffered",
      MEDIA_STREAM_TYPE: "mediaStreamType",
      MEDIA_TARGET_LIVE_WINDOW: "mediaTargetLiveWindow",
      MEDIA_TIME_IS_LIVE: "mediaTimeIsLive",
      MEDIA_RENDITION_LIST: "mediaRenditionList",
      MEDIA_RENDITION_SELECTED: "mediaRenditionSelected",
      MEDIA_AUDIO_TRACK_LIST: "mediaAudioTrackList",
      MEDIA_AUDIO_TRACK_ENABLED: "mediaAudioTrackEnabled"
    };
    MediaUIPropsEntries = Object.entries(MediaUIProps);
    MediaUIAttributes = MediaUIPropsEntries.reduce((dictObj, [key2, propName]) => {
      dictObj[key2] = `${propName.toLowerCase()}`;
      return dictObj;
    }, {});
    MediaStateChangeEvents = MediaUIPropsEntries.reduce(
      (dictObj, [key2, propName]) => {
        dictObj[key2] = `${propName.toLowerCase()}`;
        return dictObj;
      },
      {
        USER_INACTIVE: "userinactivechange",
        BREAKPOINTS_CHANGE: "breakpointchange",
        BREAKPOINTS_COMPUTED: "breakpointscomputed"
      }
    );
    StateChangeEventToAttributeMap = Object.entries(
      MediaStateChangeEvents
    ).reduce(
      (mapObj, [key2, eventType]) => {
        const attrName = MediaUIAttributes[key2];
        if (attrName) {
          mapObj[eventType] = attrName;
        }
        return mapObj;
      },
      { userinactivechange: "userinactive" }
    );
    AttributeToStateChangeEventMap = Object.entries(
      MediaUIAttributes
    ).reduce(
      (mapObj, [key2, attrName]) => {
        const evtType = MediaStateChangeEvents[key2];
        if (evtType) {
          mapObj[attrName] = evtType;
        }
        return mapObj;
      },
      { userinactive: "userinactivechange" }
    );
    TextTrackKinds = {
      SUBTITLES: "subtitles",
      CAPTIONS: "captions",
      DESCRIPTIONS: "descriptions",
      CHAPTERS: "chapters",
      METADATA: "metadata"
    };
    TextTrackModes = {
      DISABLED: "disabled",
      HIDDEN: "hidden",
      SHOWING: "showing"
    };
    ReadyStates = {
      HAVE_NOTHING: 0,
      HAVE_METADATA: 1,
      HAVE_CURRENT_DATA: 2,
      HAVE_FUTURE_DATA: 3,
      HAVE_ENOUGH_DATA: 4
    };
    PointerTypes = {
      MOUSE: "mouse",
      PEN: "pen",
      TOUCH: "touch"
    };
    AvailabilityStates = {
      UNAVAILABLE: "unavailable",
      UNSUPPORTED: "unsupported"
    };
    StreamTypes = {
      LIVE: "live",
      ON_DEMAND: "on-demand",
      UNKNOWN: "unknown"
    };
  }
});

// node_modules/media-chrome/dist/labels/labels.js
var nouns, verbs, labels_default;
var init_labels = __esm({
  "node_modules/media-chrome/dist/labels/labels.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    nouns = {
      AUDIO_PLAYER: () => "audio player",
      VIDEO_PLAYER: () => "video player",
      VOLUME: () => "volume",
      SEEK: () => "seek",
      CLOSED_CAPTIONS: () => "closed captions",
      PLAYBACK_RATE: ({ playbackRate = 1 } = {}) => `current playback rate ${playbackRate}`,
      PLAYBACK_TIME: () => `playback time`,
      MEDIA_LOADING: () => `media loading`
    };
    verbs = {
      PLAY: () => "play",
      PAUSE: () => "pause",
      MUTE: () => "mute",
      UNMUTE: () => "unmute",
      AIRPLAY: () => "air play",
      ENTER_CAST: () => "start casting",
      EXIT_CAST: () => "stop casting",
      ENTER_FULLSCREEN: () => "enter fullscreen mode",
      EXIT_FULLSCREEN: () => "exit fullscreen mode",
      ENTER_PIP: () => "enter picture in picture mode",
      EXIT_PIP: () => "exit picture in picture mode",
      SEEK_FORWARD_N_SECS: ({ seekOffset = 30 } = {}) => `seek forward ${seekOffset} seconds`,
      SEEK_BACK_N_SECS: ({ seekOffset = 30 } = {}) => `seek back ${seekOffset} seconds`,
      SEEK_LIVE: () => "seek to live",
      PLAYING_LIVE: () => "playing live"
    };
    labels_default = {
      ...nouns,
      ...verbs
    };
  }
});

// node_modules/media-chrome/dist/utils/utils.js
function stringifyRenditionList(renditions) {
  return renditions == null ? void 0 : renditions.map(stringifyRendition).join(" ");
}
function stringifyRendition(rendition) {
  if (rendition) {
    const { id, width, height } = rendition;
    return [id, width, height].filter((a) => a != null).join(":");
  }
}
function stringifyAudioTrackList(audioTracks) {
  return audioTracks == null ? void 0 : audioTracks.map(stringifyAudioTrack).join(" ");
}
function stringifyAudioTrack(audioTrack) {
  if (audioTrack) {
    const { id, kind, language, label } = audioTrack;
    return [id, kind, language, label].filter((a) => a != null).join(":");
  }
}
function constToCamel(word, upperFirst = false) {
  return word.split("_").map(function(x, i) {
    return (i || upperFirst ? x[0].toUpperCase() : x[0].toLowerCase()) + x.slice(1).toLowerCase();
  }).join("");
}
function camelCase(name) {
  return name.replace(/[-_]([a-z])/g, ($0, $1) => $1.toUpperCase());
}
function isValidNumber(x) {
  return typeof x === "number" && !Number.isNaN(x) && Number.isFinite(x);
}
function isNumericString(str) {
  if (typeof str != "string")
    return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}
var delay;
var init_utils = __esm({
  "node_modules/media-chrome/dist/utils/utils.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  }
});

// node_modules/media-chrome/dist/utils/time.js
var time_exports = {};
__export(time_exports, {
  emptyTimeRanges: () => emptyTimeRanges,
  formatAsTimePhrase: () => formatAsTimePhrase,
  formatTime: () => formatTime,
  serializeTimeRanges: () => serializeTimeRanges
});
function formatTime(seconds, guide) {
  let negative = false;
  if (seconds < 0) {
    negative = true;
    seconds = 0 - seconds;
  }
  seconds = seconds < 0 ? 0 : seconds;
  let s = Math.floor(seconds % 60);
  let m = Math.floor(seconds / 60 % 60);
  let h = Math.floor(seconds / 3600);
  const gm = Math.floor(guide / 60 % 60);
  const gh = Math.floor(guide / 3600);
  if (isNaN(seconds) || seconds === Infinity) {
    h = m = s = "0";
  }
  h = h > 0 || gh > 0 ? h + ":" : "";
  m = ((h || gm >= 10) && m < 10 ? "0" + m : m) + ":";
  s = s < 10 ? "0" + s : s;
  return (negative ? "-" : "") + h + m + s;
}
function serializeTimeRanges(timeRanges = emptyTimeRanges) {
  return Array.from(timeRanges).map((_, i) => [
    Number(timeRanges.start(i).toFixed(3)),
    Number(timeRanges.end(i).toFixed(3))
  ].join(":")).join(" ");
}
var UnitLabels, toTimeUnitPhrase, formatAsTimePhrase, emptyTimeRanges;
var init_time = __esm({
  "node_modules/media-chrome/dist/utils/time.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_utils();
    UnitLabels = [
      {
        singular: "hour",
        plural: "hours"
      },
      {
        singular: "minute",
        plural: "minutes"
      },
      {
        singular: "second",
        plural: "seconds"
      }
    ];
    toTimeUnitPhrase = (timeUnitValue, unitIndex) => {
      const unitLabel = timeUnitValue === 1 ? UnitLabels[unitIndex].singular : UnitLabels[unitIndex].plural;
      return `${timeUnitValue} ${unitLabel}`;
    };
    formatAsTimePhrase = (seconds) => {
      if (!isValidNumber(seconds))
        return "";
      const positiveSeconds = Math.abs(seconds);
      const negative = positiveSeconds !== seconds;
      const secondsDateTime = new Date(0, 0, 0, 0, 0, positiveSeconds, 0);
      const timeParts = [
        secondsDateTime.getHours(),
        secondsDateTime.getMinutes(),
        secondsDateTime.getSeconds()
      ];
      const timeString = timeParts.map(
        (timeUnitValue, index) => timeUnitValue && toTimeUnitPhrase(timeUnitValue, index)
      ).filter((x) => x).join(", ");
      const negativeSuffix = negative ? " remaining" : "";
      return `${timeString}${negativeSuffix}`;
    };
    emptyTimeRanges = Object.freeze({
      length: 0,
      start(index) {
        const unsignedIdx = index >>> 0;
        if (unsignedIdx >= this.length) {
          throw new DOMException(
            `Failed to execute 'start' on 'TimeRanges': The index provided (${unsignedIdx}) is greater than or equal to the maximum bound (${this.length}).`
          );
        }
        return 0;
      },
      end(index) {
        const unsignedIdx = index >>> 0;
        if (unsignedIdx >= this.length) {
          throw new DOMException(
            `Failed to execute 'end' on 'TimeRanges': The index provided (${unsignedIdx}) is greater than or equal to the maximum bound (${this.length}).`
          );
        }
        return 0;
      }
    });
  }
});

// node_modules/media-chrome/dist/utils/element-utils.js
function isElementVisible(element, depth = 3) {
  if (element.checkVisibility) {
    return element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
  }
  let el = element;
  while (el && depth > 0) {
    const style = getComputedStyle(el);
    if (style.opacity === "0" || style.visibility === "hidden" || style.display === "none") {
      return false;
    }
    el = el.parentElement;
    depth--;
  }
  return true;
}
function getPointProgressOnLine(x, y, p1, p2) {
  const segment = distance(p1, p2);
  const toStart = distance(p1, { x, y });
  const toEnd = distance(p2, { x, y });
  if (toStart > segment || toEnd > segment) {
    return toStart > toEnd ? 1 : 0;
  }
  return toStart / segment;
}
function distance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}
function getOrInsertCSSRule(styleParent, selectorText) {
  var _a2;
  let style;
  for (style of styleParent.querySelectorAll("style")) {
    let cssRules;
    try {
      cssRules = (_a2 = style.sheet) == null ? void 0 : _a2.cssRules;
    } catch {
      continue;
    }
    for (let rule of cssRules != null ? cssRules : [])
      if (rule.selectorText === selectorText)
        return rule;
  }
  if (!(style == null ? void 0 : style.sheet)) {
    return {
      style: {
        setProperty: () => {
        },
        removeProperty: () => {
        }
      }
    };
  }
  style.sheet.insertRule(`${selectorText}{}`, style.sheet.cssRules.length);
  return style.sheet.cssRules[style.sheet.cssRules.length - 1];
}
function getNumericAttr(el, attrName, defaultValue = Number.NaN) {
  const attrVal = el.getAttribute(attrName);
  return attrVal != null ? +attrVal : defaultValue;
}
function setNumericAttr(el, attrName, value) {
  const nextNumericValue = +value;
  if (value == null || Number.isNaN(nextNumericValue)) {
    if (el.hasAttribute(attrName)) {
      el.removeAttribute(attrName);
    }
    return;
  }
  if (getNumericAttr(el, attrName, void 0) === nextNumericValue)
    return;
  el.setAttribute(attrName, `${nextNumericValue}`);
}
function getBooleanAttr(el, attrName) {
  return el.hasAttribute(attrName);
}
function setBooleanAttr(el, attrName, value) {
  if (value == null) {
    if (el.hasAttribute(attrName)) {
      el.removeAttribute(attrName);
    }
    return;
  }
  if (getBooleanAttr(el, attrName) == value)
    return;
  el.toggleAttribute(attrName, value);
}
function getStringAttr(el, attrName, defaultValue = null) {
  var _a2;
  return (_a2 = el.getAttribute(attrName)) != null ? _a2 : defaultValue;
}
function setStringAttr(el, attrName, value) {
  if (value == null) {
    if (el.hasAttribute(attrName)) {
      el.removeAttribute(attrName);
    }
    return;
  }
  const nextValue = `${value}`;
  if (getStringAttr(el, attrName, void 0) === nextValue)
    return;
  el.setAttribute(attrName, nextValue);
}
var updateIconText, getAllSlotted, getSlotted, containsComposedNode, closestComposedNode;
var init_element_utils = __esm({
  "node_modules/media-chrome/dist/utils/element-utils.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    updateIconText = (svg, value, selector = ".value") => {
      const node = svg.querySelector(selector);
      if (!node)
        return;
      node.textContent = value;
    };
    getAllSlotted = (el, name) => {
      const slotSelector = `slot[name="${name}"]`;
      const slot = el.shadowRoot.querySelector(slotSelector);
      if (!slot)
        return [];
      return slot.children;
    };
    getSlotted = (el, name) => getAllSlotted(el, name)[0];
    containsComposedNode = (rootNode, childNode) => {
      if (!rootNode || !childNode)
        return false;
      if (rootNode.contains(childNode))
        return true;
      return containsComposedNode(rootNode, childNode.getRootNode().host);
    };
    closestComposedNode = (childNode, selector) => {
      if (!childNode)
        return null;
      const closest = childNode.closest(selector);
      if (closest)
        return closest;
      return closestComposedNode(childNode.getRootNode().host, selector);
    };
  }
});

// node_modules/media-chrome/dist/utils/server-safe-globals.js
var EventTarget, ResizeObserver2, documentShim, globalThisShim, isServer, isShimmed, GlobalThis, Document5;
var init_server_safe_globals = __esm({
  "node_modules/media-chrome/dist/utils/server-safe-globals.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    EventTarget = class {
      addEventListener() {
      }
      removeEventListener() {
      }
      dispatchEvent() {
        return true;
      }
    };
    ResizeObserver2 = class {
      observe() {
      }
      unobserve() {
      }
      disconnect() {
      }
    };
    documentShim = {
      createElement: function() {
        return new globalThisShim.HTMLElement();
      },
      addEventListener() {
      },
      removeEventListener() {
      }
    };
    globalThisShim = {
      ResizeObserver: ResizeObserver2,
      document: documentShim,
      HTMLElement: class HTMLElement2 extends EventTarget {
      },
      DocumentFragment: class DocumentFragment2 extends EventTarget {
      },
      customElements: {
        get: function() {
        },
        define: function() {
        },
        whenDefined: function() {
        }
      },
      CustomEvent: function CustomEvent3() {
      },
      getComputedStyle: function() {
      }
    };
    isServer = typeof window === "undefined" || typeof window.customElements === "undefined";
    isShimmed = Object.keys(globalThisShim).every((key2) => key2 in globalThis);
    GlobalThis = isServer && !isShimmed ? globalThisShim : globalThis;
    Document5 = isServer && !isShimmed ? documentShim : globalThis.document;
  }
});

// node_modules/media-chrome/dist/media-chrome-button.js
var __defProp3, __defNormalProp, __publicField, __accessCheck, __privateGet, __privateAdd, __privateSet, _mediaController, _clickListener, _keyupListener, _keydownListener, template, MediaChromeButton, media_chrome_button_default;
var init_media_chrome_button = __esm({
  "node_modules/media-chrome/dist/media-chrome-button.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_constants();
    init_element_utils();
    init_server_safe_globals();
    __defProp3 = Object.defineProperty;
    __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp3(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
    __publicField = (obj, key2, value) => {
      __defNormalProp(obj, typeof key2 !== "symbol" ? key2 + "" : key2, value);
      return value;
    };
    __accessCheck = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet = (obj, member, getter) => {
      __accessCheck(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    __privateSet = (obj, member, value, setter) => {
      __accessCheck(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    template = Document5.createElement("template");
    template.innerHTML = `
<style>
  :host {
    font: var(--media-font,
      var(--media-font-weight, bold)
      var(--media-font-size, 14px) /
      var(--media-text-content-height, var(--media-control-height, 24px))
      var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
    color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
    background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
    padding: var(--media-control-padding, 10px);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    box-sizing: border-box;
    transition: background .15s linear;
    pointer-events: auto;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  ${""}
  :host(:focus-visible) {
    box-shadow: inset 0 0 0 2px rgb(27 127 204 / .9);
    outline: 0;
  }
  ${""}
  :host(:where(:focus)) {
    box-shadow: none;
    outline: 0;
  }

  :host(:hover) {
    background: var(--media-control-hover-background, rgba(50 50 70 / .7));
  }

  svg, img, ::slotted(svg), ::slotted(img) {
    width: var(--media-button-icon-width);
    height: var(--media-button-icon-height, var(--media-control-height, 24px));
    transform: var(--media-button-icon-transform);
    transition: var(--media-button-icon-transition);
    fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
    vertical-align: middle;
    max-width: 100%;
    max-height: 100%;
    min-width: 100%;
  }
</style>
`;
    MediaChromeButton = class extends GlobalThis.HTMLElement {
      constructor(options = {}) {
        super();
        __privateAdd(this, _mediaController, void 0);
        __publicField(this, "preventClick", false);
        __privateAdd(this, _clickListener, (e) => {
          if (!this.preventClick) {
            this.handleClick(e);
          }
        });
        __privateAdd(this, _keyupListener, (e) => {
          const { key: key2 } = e;
          if (!this.keysUsed.includes(key2)) {
            this.removeEventListener("keyup", __privateGet(this, _keyupListener));
            return;
          }
          if (!this.preventClick) {
            this.handleClick(e);
          }
        });
        __privateAdd(this, _keydownListener, (e) => {
          const { metaKey, altKey, key: key2 } = e;
          if (metaKey || altKey || !this.keysUsed.includes(key2)) {
            this.removeEventListener("keyup", __privateGet(this, _keyupListener));
            return;
          }
          this.addEventListener("keyup", __privateGet(this, _keyupListener), { once: true });
        });
        if (!this.shadowRoot) {
          this.attachShadow({ mode: "open" });
          const buttonHTML = template.content.cloneNode(true);
          this.nativeEl = buttonHTML;
          let slotTemplate12 = options.slotTemplate;
          if (!slotTemplate12) {
            slotTemplate12 = Document5.createElement("template");
            slotTemplate12.innerHTML = `<slot>${options.defaultContent || ""}</slot>`;
          }
          this.nativeEl.appendChild(slotTemplate12.content.cloneNode(true));
          this.shadowRoot.appendChild(buttonHTML);
        }
        const { style } = getOrInsertCSSRule(this.shadowRoot, ":host");
        style.setProperty("display", `var(--media-control-display, var(--${this.localName}-display, inline-flex))`);
      }
      static get observedAttributes() {
        return ["disabled", MediaStateReceiverAttributes.MEDIA_CONTROLLER];
      }
      enable() {
        this.addEventListener("click", __privateGet(this, _clickListener));
        this.addEventListener("keydown", __privateGet(this, _keydownListener));
        this.tabIndex = 0;
      }
      disable() {
        this.removeEventListener("click", __privateGet(this, _clickListener));
        this.removeEventListener("keydown", __privateGet(this, _keydownListener));
        this.removeEventListener("keyup", __privateGet(this, _keyupListener));
        this.tabIndex = -1;
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        var _a2, _b, _c, _d, _e;
        if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
          if (oldValue) {
            (_b = (_a2 = __privateGet(this, _mediaController)) == null ? void 0 : _a2.unassociateElement) == null ? void 0 : _b.call(_a2, this);
            __privateSet(this, _mediaController, null);
          }
          if (newValue && this.isConnected) {
            __privateSet(this, _mediaController, (_c = this.getRootNode()) == null ? void 0 : _c.getElementById(newValue));
            (_e = (_d = __privateGet(this, _mediaController)) == null ? void 0 : _d.associateElement) == null ? void 0 : _e.call(_d, this);
          }
        } else if (attrName === "disabled" && newValue !== oldValue) {
          if (newValue == null) {
            this.enable();
          } else {
            this.disable();
          }
        }
      }
      connectedCallback() {
        var _a2, _b, _c;
        if (!this.hasAttribute("disabled")) {
          this.enable();
        }
        this.setAttribute("role", "button");
        const mediaControllerId = this.getAttribute(
          MediaStateReceiverAttributes.MEDIA_CONTROLLER
        );
        if (mediaControllerId) {
          __privateSet(this, _mediaController, (_a2 = this.getRootNode()) == null ? void 0 : _a2.getElementById(mediaControllerId));
          (_c = (_b = __privateGet(this, _mediaController)) == null ? void 0 : _b.associateElement) == null ? void 0 : _c.call(_b, this);
        }
      }
      disconnectedCallback() {
        var _a2, _b;
        this.disable();
        (_b = (_a2 = __privateGet(this, _mediaController)) == null ? void 0 : _a2.unassociateElement) == null ? void 0 : _b.call(_a2, this);
        __privateSet(this, _mediaController, null);
      }
      get keysUsed() {
        return ["Enter", " "];
      }
      handleClick(e) {
      }
    };
    _mediaController = /* @__PURE__ */ new WeakMap();
    _clickListener = /* @__PURE__ */ new WeakMap();
    _keyupListener = /* @__PURE__ */ new WeakMap();
    _keydownListener = /* @__PURE__ */ new WeakMap();
    if (!GlobalThis.customElements.get("media-chrome-button")) {
      GlobalThis.customElements.define("media-chrome-button", MediaChromeButton);
    }
    media_chrome_button_default = MediaChromeButton;
  }
});

// node_modules/media-chrome/dist/media-airplay-button.js
var airplayIcon, slotTemplate, MediaAirplayButton, media_airplay_button_default;
var init_media_airplay_button = __esm({
  "node_modules/media-chrome/dist/media-airplay-button.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_media_chrome_button();
    init_server_safe_globals();
    init_constants();
    init_labels();
    init_element_utils();
    airplayIcon = `<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.13 3H3.87a.87.87 0 0 0-.87.87v13.26a.87.87 0 0 0 .87.87h3.4L9 16H5V5h16v11h-4l1.72 2h3.4a.87.87 0 0 0 .87-.87V3.87a.87.87 0 0 0-.86-.87Zm-8.75 11.44a.5.5 0 0 0-.76 0l-4.91 5.73a.5.5 0 0 0 .38.83h9.82a.501.501 0 0 0 .38-.83l-4.91-5.73Z"/>
</svg>
`;
    slotTemplate = Document5.createElement("template");
    slotTemplate.innerHTML = `
  <slot name="icon">${airplayIcon}</slot>
`;
    MediaAirplayButton = class extends MediaChromeButton {
      static get observedAttributes() {
        return [
          ...super.observedAttributes,
          MediaUIAttributes.MEDIA_AIRPLAY_UNAVAILABLE
        ];
      }
      constructor(options = {}) {
        super({ slotTemplate, ...options });
      }
      connectedCallback() {
        this.setAttribute("aria-label", verbs.AIRPLAY());
        super.connectedCallback();
      }
      get mediaAirplayUnavailable() {
        return getStringAttr(this, MediaUIAttributes.MEDIA_AIRPLAY_UNAVAILABLE);
      }
      set mediaAirplayUnavailable(value) {
        setStringAttr(this, MediaUIAttributes.MEDIA_AIRPLAY_UNAVAILABLE, value);
      }
      handleClick() {
        const evt = new GlobalThis.CustomEvent(MediaUIEvents.MEDIA_AIRPLAY_REQUEST, {
          composed: true,
          bubbles: true
        });
        this.dispatchEvent(evt);
      }
    };
    if (!GlobalThis.customElements.get("media-airplay-button")) {
      GlobalThis.customElements.define("media-airplay-button", MediaAirplayButton);
    }
    media_airplay_button_default = MediaAirplayButton;
  }
});

// node_modules/media-chrome/dist/media-cast-button.js
var enterIcon, exitIcon, slotTemplate2, updateAriaLabel, MediaCastButton, media_cast_button_default;
var init_media_cast_button = __esm({
  "node_modules/media-chrome/dist/media-cast-button.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_media_chrome_button();
    init_server_safe_globals();
    init_constants();
    init_labels();
    init_element_utils();
    enterIcon = `<svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/></g></svg>`;
    exitIcon = `<svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/><path class="cast_caf_icon_boxfill" d="M5,7 L5,8.63 C8,8.6 13.37,14 13.37,17 L19,17 L19,7 Z"/></g></svg>`;
    slotTemplate2 = Document5.createElement("template");
    slotTemplate2.innerHTML = `
  <style>
  :host([${MediaUIAttributes.MEDIA_IS_CASTING}]) slot:not([name=exit]):not([name=icon]) {
    display: none !important;
  }

  ${""}
  :host(:not([${MediaUIAttributes.MEDIA_IS_CASTING}])) slot:not([name=enter]):not([name=icon]) {
    display: none !important;
  }
  </style>

  <slot name="icon">
    <slot name="enter">${enterIcon}</slot>
    <slot name="exit">${exitIcon}</slot>
  </slot>
`;
    updateAriaLabel = (el) => {
      const isCast = el.getAttribute(MediaUIAttributes.MEDIA_IS_CASTING) != null;
      const label = isCast ? verbs.EXIT_CAST() : verbs.ENTER_CAST();
      el.setAttribute("aria-label", label);
    };
    MediaCastButton = class extends MediaChromeButton {
      static get observedAttributes() {
        return [
          ...super.observedAttributes,
          MediaUIAttributes.MEDIA_IS_CASTING,
          MediaUIAttributes.MEDIA_CAST_UNAVAILABLE
        ];
      }
      constructor(options = {}) {
        super({ slotTemplate: slotTemplate2, ...options });
      }
      connectedCallback() {
        updateAriaLabel(this);
        super.connectedCallback();
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        if (attrName === MediaUIAttributes.MEDIA_IS_CASTING) {
          updateAriaLabel(this);
        }
        super.attributeChangedCallback(attrName, oldValue, newValue);
      }
      get mediaIsCasting() {
        return getBooleanAttr(this, MediaUIAttributes.MEDIA_IS_CASTING);
      }
      set mediaIsCasting(value) {
        setBooleanAttr(this, MediaUIAttributes.MEDIA_IS_CASTING, value);
      }
      get mediaCastUnavailable() {
        return getStringAttr(this, MediaUIAttributes.MEDIA_CAST_UNAVAILABLE);
      }
      set mediaCastUnavailable(value) {
        setStringAttr(this, MediaUIAttributes.MEDIA_CAST_UNAVAILABLE, value);
      }
      handleClick() {
        const eventName = this.mediaIsCasting ? MediaUIEvents.MEDIA_EXIT_CAST_REQUEST : MediaUIEvents.MEDIA_ENTER_CAST_REQUEST;
        this.dispatchEvent(
          new GlobalThis.CustomEvent(eventName, { composed: true, bubbles: true })
        );
      }
    };
    if (!GlobalThis.customElements.get("media-cast-button")) {
      GlobalThis.customElements.define("media-cast-button", MediaCastButton);
    }
    media_cast_button_default = MediaCastButton;
  }
});

// node_modules/media-chrome/dist/media-gesture-receiver.js
function getMediaControllerEl(controlEl) {
  var _a2;
  const mediaControllerId = controlEl.getAttribute(
    MediaStateReceiverAttributes.MEDIA_CONTROLLER
  );
  if (mediaControllerId) {
    return (_a2 = controlEl.getRootNode()) == null ? void 0 : _a2.getElementById(mediaControllerId);
  }
  return closestComposedNode(controlEl, "media-controller");
}
var __accessCheck2, __privateGet2, __privateAdd2, __privateSet2, _mediaController2, template2, MediaGestureReceiver, media_gesture_receiver_default;
var init_media_gesture_receiver = __esm({
  "node_modules/media-chrome/dist/media-gesture-receiver.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_constants();
    init_element_utils();
    init_server_safe_globals();
    __accessCheck2 = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet2 = (obj, member, getter) => {
      __accessCheck2(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd2 = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    __privateSet2 = (obj, member, value, setter) => {
      __accessCheck2(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    template2 = Document5.createElement("template");
    template2.innerHTML = `
<style>
  :host {
    display: var(--media-control-display, var(--media-gesture-receiver-display, inline-block));
    box-sizing: border-box;
  }
</style>
`;
    MediaGestureReceiver = class extends GlobalThis.HTMLElement {
      constructor(options = {}) {
        super();
        __privateAdd2(this, _mediaController2, void 0);
        if (!this.shadowRoot) {
          const shadow = this.attachShadow({ mode: "open" });
          const buttonHTML = template2.content.cloneNode(true);
          this.nativeEl = buttonHTML;
          let slotTemplate12 = options.slotTemplate;
          if (!slotTemplate12) {
            slotTemplate12 = Document5.createElement("template");
            slotTemplate12.innerHTML = `<slot>${options.defaultContent || ""}</slot>`;
          }
          this.nativeEl.appendChild(slotTemplate12.content.cloneNode(true));
          shadow.appendChild(buttonHTML);
        }
      }
      static get observedAttributes() {
        return [
          MediaStateReceiverAttributes.MEDIA_CONTROLLER,
          MediaUIAttributes.MEDIA_PAUSED
        ];
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        var _a2, _b, _c, _d, _e;
        if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
          if (oldValue) {
            (_b = (_a2 = __privateGet2(this, _mediaController2)) == null ? void 0 : _a2.unassociateElement) == null ? void 0 : _b.call(_a2, this);
            __privateSet2(this, _mediaController2, null);
          }
          if (newValue && this.isConnected) {
            __privateSet2(this, _mediaController2, (_c = this.getRootNode()) == null ? void 0 : _c.getElementById(newValue));
            (_e = (_d = __privateGet2(this, _mediaController2)) == null ? void 0 : _d.associateElement) == null ? void 0 : _e.call(_d, this);
          }
        }
      }
      connectedCallback() {
        var _a2, _b, _c, _d;
        this.tabIndex = -1;
        this.setAttribute("aria-hidden", "true");
        __privateSet2(this, _mediaController2, getMediaControllerEl(this));
        if (this.getAttribute(MediaStateReceiverAttributes.MEDIA_CONTROLLER)) {
          (_b = (_a2 = __privateGet2(this, _mediaController2)) == null ? void 0 : _a2.associateElement) == null ? void 0 : _b.call(_a2, this);
        }
        (_c = __privateGet2(this, _mediaController2)) == null ? void 0 : _c.addEventListener("pointerdown", this);
        (_d = __privateGet2(this, _mediaController2)) == null ? void 0 : _d.addEventListener("click", this);
      }
      disconnectedCallback() {
        var _a2, _b, _c, _d;
        if (this.getAttribute(MediaStateReceiverAttributes.MEDIA_CONTROLLER)) {
          (_b = (_a2 = __privateGet2(this, _mediaController2)) == null ? void 0 : _a2.unassociateElement) == null ? void 0 : _b.call(_a2, this);
        }
        (_c = __privateGet2(this, _mediaController2)) == null ? void 0 : _c.removeEventListener("pointerdown", this);
        (_d = __privateGet2(this, _mediaController2)) == null ? void 0 : _d.removeEventListener("click", this);
        __privateSet2(this, _mediaController2, null);
      }
      handleEvent(event) {
        var _a2;
        const composedTarget = (_a2 = event.composedPath()) == null ? void 0 : _a2[0];
        const allowList = ["video", "media-controller"];
        if (!allowList.includes(composedTarget == null ? void 0 : composedTarget.localName))
          return;
        if (event.type === "pointerdown") {
          this._pointerType = event.pointerType;
        } else if (event.type === "click") {
          const { clientX, clientY } = event;
          const { left, top, width, height } = this.getBoundingClientRect();
          const x = clientX - left;
          const y = clientY - top;
          if (x < 0 || y < 0 || x > width || y > height || width === 0 && height === 0) {
            return;
          }
          const { pointerType = this._pointerType } = event;
          this._pointerType = void 0;
          if (pointerType === PointerTypes.TOUCH) {
            this.handleTap(event);
            return;
          } else if (pointerType === PointerTypes.MOUSE) {
            this.handleMouseClick(event);
            return;
          }
        }
      }
      get mediaPaused() {
        return getBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED);
      }
      set mediaPaused(value) {
        setBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED, value);
      }
      handleTap(e) {
      }
      handleMouseClick(e) {
        const eventName = this.mediaPaused ? MediaUIEvents.MEDIA_PLAY_REQUEST : MediaUIEvents.MEDIA_PAUSE_REQUEST;
        this.dispatchEvent(
          new GlobalThis.CustomEvent(eventName, { composed: true, bubbles: true })
        );
      }
    };
    _mediaController2 = /* @__PURE__ */ new WeakMap();
    if (!GlobalThis.customElements.get("media-gesture-receiver")) {
      GlobalThis.customElements.define("media-gesture-receiver", MediaGestureReceiver);
    }
    media_gesture_receiver_default = MediaGestureReceiver;
  }
});

// node_modules/media-chrome/dist/media-container.js
function resizeCallback(entries2) {
  for (const entry of entries2) {
    setBreakpoints(entry.target, entry.contentRect.width);
  }
}
function setBreakpoints(container, width) {
  var _a2;
  if (!container.isConnected)
    return;
  const breakpoints = (_a2 = container.getAttribute(Attributes.BREAKPOINTS)) != null ? _a2 : defaultBreakpoints;
  const ranges = createBreakpointMap(breakpoints);
  const activeBreakpoints = getBreakpoints(ranges, width);
  let changed = false;
  Object.keys(ranges).forEach((name) => {
    if (activeBreakpoints.includes(name)) {
      if (!container.hasAttribute(`breakpoint${name}`)) {
        container.setAttribute(`breakpoint${name}`, "");
        changed = true;
      }
      return;
    }
    if (container.hasAttribute(`breakpoint${name}`)) {
      container.removeAttribute(`breakpoint${name}`);
      changed = true;
    }
  });
  if (changed) {
    const evt = new CustomEvent(MediaStateChangeEvents.BREAKPOINTS_CHANGE, {
      detail: activeBreakpoints
    });
    container.dispatchEvent(evt);
  }
}
function createBreakpointMap(breakpoints) {
  const pairs = breakpoints.split(/\s+/);
  return Object.fromEntries(pairs.map((pair) => pair.split(":")));
}
function getBreakpoints(breakpoints, width) {
  return Object.keys(breakpoints).filter((name) => {
    return width >= breakpoints[name];
  });
}
var __defProp4, __defNormalProp2, __publicField2, __accessCheck3, __privateGet3, __privateAdd3, __privateSet3, __privateMethod, _pointerDownTimeStamp, _handlePointerMove, handlePointerMove_fn, _handlePointerUp, handlePointerUp_fn, _setInactive, setInactive_fn, _setActive, setActive_fn, _scheduleInactive, scheduleInactive_fn, Attributes, template3, MEDIA_UI_ATTRIBUTE_NAMES, defaultBreakpoints, MediaContainer;
var init_media_container = __esm({
  "node_modules/media-chrome/dist/media-container.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_server_safe_globals();
    init_constants();
    init_labels();
    init_media_gesture_receiver();
    __defProp4 = Object.defineProperty;
    __defNormalProp2 = (obj, key2, value) => key2 in obj ? __defProp4(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
    __publicField2 = (obj, key2, value) => {
      __defNormalProp2(obj, typeof key2 !== "symbol" ? key2 + "" : key2, value);
      return value;
    };
    __accessCheck3 = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet3 = (obj, member, getter) => {
      __accessCheck3(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd3 = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    __privateSet3 = (obj, member, value, setter) => {
      __accessCheck3(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    __privateMethod = (obj, member, method) => {
      __accessCheck3(obj, member, "access private method");
      return method;
    };
    Attributes = {
      AUDIO: "audio",
      AUTOHIDE: "autohide",
      BREAKPOINTS: "breakpoints",
      GESTURES_DISABLED: "gesturesdisabled",
      KEYBOARD_CONTROL: "keyboardcontrol",
      NO_AUTOHIDE: "noautohide",
      USER_INACTIVE: "userinactive"
    };
    template3 = Document5.createElement("template");
    template3.innerHTML = `
  <style>
    ${""}
    :host([${MediaUIAttributes.MEDIA_IS_FULLSCREEN}]) ::slotted([slot=media]) {
      outline: none;
    }

    :host {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      line-height: 0;
      background-color: var(--media-background-color, #000);
    }

    :host(:not([${Attributes.AUDIO}])) [part~=layer]:not([part~=media-layer]) {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      flex-flow: column nowrap;
      align-items: start;
      pointer-events: none;
      background: none;
    }

    slot[name=media] {
      display: var(--media-slot-display, contents);
    }

    ${""}
    :host([${Attributes.AUDIO}]) slot[name=media] {
      display: var(--media-slot-display, none);
    }

    ${""}
    :host([${Attributes.AUDIO}]) [part~=layer][part~=gesture-layer] {
      height: 0;
      display: block;
    }

    ${""}
    :host(:not([${Attributes.AUDIO}])[${Attributes.GESTURES_DISABLED}]) ::slotted([slot=gestures-chrome]),
    :host(:not([${Attributes.AUDIO}])[${Attributes.GESTURES_DISABLED}]) media-gesture-receiver[slot=gestures-chrome] {
      display: none;
    }

    ${""}
    ::slotted(:not([slot=media]):not([slot=poster]):not(media-loading-indicator)) {
      pointer-events: auto;
    }

    :host(:not([${Attributes.AUDIO}])) *[part~=layer][part~=centered-layer] {
      align-items: center;
      justify-content: center;
    }

    :host(:not([${Attributes.AUDIO}])) ::slotted(media-gesture-receiver[slot=gestures-chrome]),
    :host(:not([${Attributes.AUDIO}])) media-gesture-receiver[slot=gestures-chrome] {
      align-self: stretch;
      flex-grow: 1;
    }

    slot[name=middle-chrome] {
      display: inline;
      flex-grow: 1;
      pointer-events: none;
      background: none;
    }

    ${""}
    ::slotted([slot=media]),
    ::slotted([slot=poster]) {
      width: 100%;
      height: 100%;
    }

    ${""}
    :host(:not([${Attributes.AUDIO}])) .spacer {
      flex-grow: 1;
    }

    ${""}
    :host(:-webkit-full-screen) {
      ${""}
      width: 100% !important;
      height: 100% !important;
    }

    ${""}
    ::slotted(:not([slot=media]):not([${Attributes.NO_AUTOHIDE}])) {
      opacity: 1;
      transition: opacity 0.25s;
    }

    ${""}
    :host([${Attributes.USER_INACTIVE}]:not([${MediaUIAttributes.MEDIA_PAUSED}]):not([${MediaUIAttributes.MEDIA_IS_CASTING}]):not([${Attributes.AUDIO}])) ::slotted(:not([slot=media]):not([${Attributes.NO_AUTOHIDE}])) {
      opacity: 0;
      transition: opacity 1s;
    }

    :host([${Attributes.USER_INACTIVE}]:not([${MediaUIAttributes.MEDIA_PAUSED}]):not([${MediaUIAttributes.MEDIA_IS_CASTING}]):not([${Attributes.AUDIO}])) ::slotted([slot=media]) {
      cursor: none;
    }

    ::slotted(media-control-bar)  {
      align-self: stretch;
    }

    ${""}
    :host(:not([${Attributes.AUDIO}])[${MediaUIAttributes.MEDIA_HAS_PLAYED}]) slot[name=poster] {
      display: none;
    }
  </style>

  <slot name="media" part="layer media-layer"></slot>
  <slot name="poster" part="layer poster-layer"></slot>
  <slot name="gestures-chrome" part="layer gesture-layer">
    <media-gesture-receiver slot="gestures-chrome"></media-gesture-receiver>
  </slot>
  <span part="layer vertical-layer">
    <slot name="top-chrome" part="top chrome"></slot>
    <slot name="middle-chrome" part="middle chrome"></slot>
    <slot name="centered-chrome" part="layer centered-layer center centered chrome"></slot>
    ${""}
    <slot part="bottom chrome"></slot>
  </span>
`;
    MEDIA_UI_ATTRIBUTE_NAMES = Object.values(MediaUIAttributes);
    defaultBreakpoints = "sm:384 md:576 lg:768 xl:960";
    MediaContainer = class extends GlobalThis.HTMLElement {
      constructor() {
        super();
        __privateAdd3(this, _handlePointerMove);
        __privateAdd3(this, _handlePointerUp);
        __privateAdd3(this, _setInactive);
        __privateAdd3(this, _setActive);
        __privateAdd3(this, _scheduleInactive);
        __privateAdd3(this, _pointerDownTimeStamp, 0);
        __publicField2(this, "breakpointsComputed", false);
        if (!this.shadowRoot) {
          this.attachShadow({ mode: "open" });
          this.shadowRoot.appendChild(template3.content.cloneNode(true));
        }
        const mutationCallback = (mutationsList) => {
          const media = this.media;
          for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
              mutation.removedNodes.forEach((node) => {
                if (node.slot == "media" && mutation.target == this) {
                  let previousSibling2 = mutation.previousSibling && mutation.previousSibling.previousElementSibling;
                  if (!previousSibling2 || !media) {
                    this.mediaUnsetCallback(node);
                  } else {
                    let wasFirst = previousSibling2.slot !== "media";
                    while ((previousSibling2 = previousSibling2.previousSibling) !== null) {
                      if (previousSibling2.slot == "media")
                        wasFirst = false;
                    }
                    if (wasFirst)
                      this.mediaUnsetCallback(node);
                  }
                }
              });
              if (media) {
                mutation.addedNodes.forEach((node) => {
                  if (node == media) {
                    this.handleMediaUpdated(media).then(
                      (media2) => this.mediaSetCallback(media2)
                    );
                  }
                });
              }
            }
          }
        };
        const mutationObserver = new MutationObserver(mutationCallback);
        mutationObserver.observe(this, { childList: true, subtree: true });
        let pendingResizeCb = false;
        const deferResizeCallback = (entries2) => {
          if (pendingResizeCb)
            return;
          setTimeout(() => {
            resizeCallback(entries2);
            pendingResizeCb = false;
            if (!this.breakpointsComputed) {
              this.breakpointsComputed = true;
              this.dispatchEvent(
                new CustomEvent(MediaStateChangeEvents.BREAKPOINTS_COMPUTED, {
                  bubbles: true,
                  composed: true
                })
              );
            }
          }, 0);
          pendingResizeCb = true;
        };
        const resizeObserver = new ResizeObserver(deferResizeCallback);
        this.resizeObserver = resizeObserver;
        resizeObserver.observe(this);
        let currentMedia = this.media;
        let chainedSlot = this.querySelector(":scope > slot[slot=media]");
        if (chainedSlot) {
          chainedSlot.addEventListener("slotchange", () => {
            const slotEls = chainedSlot.assignedElements({ flatten: true });
            if (!slotEls.length) {
              this.mediaUnsetCallback(currentMedia);
              return;
            }
            if (this.media) {
              currentMedia = this.media;
              this.handleMediaUpdated(this.media).then(
                (media) => this.mediaSetCallback(media)
              );
            }
          });
        }
      }
      static get observedAttributes() {
        return [Attributes.AUTOHIDE, Attributes.GESTURES_DISABLED].concat(MEDIA_UI_ATTRIBUTE_NAMES).filter((name) => ![
          MediaUIAttributes.MEDIA_RENDITION_LIST,
          MediaUIAttributes.MEDIA_AUDIO_TRACK_LIST
        ].includes(name));
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        if (attrName.toLowerCase() == Attributes.AUTOHIDE) {
          this.autohide = newValue;
        }
      }
      get media() {
        let media = this.querySelector(":scope > [slot=media]");
        if ((media == null ? void 0 : media.nodeName) == "SLOT")
          media = media.assignedElements({ flatten: true })[0];
        return media;
      }
      mediaSetCallback(media) {
        this._mediaClickPlayToggle = () => {
          const eventName = media.paused ? MediaUIEvents.MEDIA_PLAY_REQUEST : MediaUIEvents.MEDIA_PAUSE_REQUEST;
          this.dispatchEvent(
            new GlobalThis.CustomEvent(eventName, { composed: true, bubbles: true })
          );
        };
      }
      handleMediaUpdated(media) {
        const resolveMediaPromise = (media2) => {
          return Promise.resolve(media2);
        };
        const rejectMediaPromise = (media2) => {
          console.error(
            '<media-chrome>: Media element set with slot="media" does not appear to be compatible.',
            media2
          );
          return Promise.reject(media2);
        };
        if (!media) {
          return rejectMediaPromise(media);
        }
        const mediaName = media.nodeName.toLowerCase();
        if (mediaName.includes("-")) {
          return GlobalThis.customElements.whenDefined(mediaName).then(() => {
            return resolveMediaPromise(media);
          });
        }
        return resolveMediaPromise(media);
      }
      mediaUnsetCallback(node) {
      }
      connectedCallback() {
        var _a2;
        const isAudioChrome = this.getAttribute(Attributes.AUDIO) != null;
        const label = isAudioChrome ? nouns.AUDIO_PLAYER() : nouns.VIDEO_PLAYER();
        this.setAttribute("role", "region");
        this.setAttribute("aria-label", label);
        if (this.media) {
          this.handleMediaUpdated(this.media).then(
            (media) => this.mediaSetCallback(media)
          );
        }
        this.setAttribute(Attributes.USER_INACTIVE, "");
        this.addEventListener("pointerdown", this);
        this.addEventListener("pointermove", this);
        this.addEventListener("pointerup", this);
        this.addEventListener("mouseleave", this);
        this.addEventListener("keyup", this);
        (_a2 = GlobalThis.window) == null ? void 0 : _a2.addEventListener("mouseup", () => {
          this.removeAttribute(Attributes.KEYBOARD_CONTROL);
        });
      }
      handleEvent(event) {
        switch (event.type) {
          case "pointerdown":
            __privateSet3(this, _pointerDownTimeStamp, event.timeStamp);
            break;
          case "pointermove":
            __privateMethod(this, _handlePointerMove, handlePointerMove_fn).call(this, event);
            break;
          case "pointerup":
            __privateMethod(this, _handlePointerUp, handlePointerUp_fn).call(this, event);
            break;
          case "mouseleave":
            __privateMethod(this, _setInactive, setInactive_fn).call(this);
            break;
          case "keyup":
            __privateMethod(this, _scheduleInactive, scheduleInactive_fn).call(this);
            this.setAttribute(Attributes.KEYBOARD_CONTROL, "");
            break;
        }
      }
      set autohide(seconds) {
        seconds = Number(seconds);
        this._autohide = isNaN(seconds) ? 0 : seconds;
      }
      get autohide() {
        return this._autohide === void 0 ? 2 : this._autohide;
      }
    };
    _pointerDownTimeStamp = /* @__PURE__ */ new WeakMap();
    _handlePointerMove = /* @__PURE__ */ new WeakSet();
    handlePointerMove_fn = function(event) {
      if (event.pointerType !== "mouse") {
        const MAX_TAP_DURATION = 250;
        if (event.timeStamp - __privateGet3(this, _pointerDownTimeStamp) < MAX_TAP_DURATION)
          return;
      }
      __privateMethod(this, _setActive, setActive_fn).call(this);
      clearTimeout(this._inactiveTimeout);
      if ([this, this.media].includes(event.target)) {
        __privateMethod(this, _scheduleInactive, scheduleInactive_fn).call(this);
      }
    };
    _handlePointerUp = /* @__PURE__ */ new WeakSet();
    handlePointerUp_fn = function(event) {
      if (event.pointerType === "touch") {
        const controlsVisible = !this.hasAttribute(Attributes.USER_INACTIVE);
        if ([this, this.media].includes(event.target) && controlsVisible) {
          __privateMethod(this, _setInactive, setInactive_fn).call(this);
        } else {
          __privateMethod(this, _scheduleInactive, scheduleInactive_fn).call(this);
        }
      } else if (event.composedPath().some((el) => ["media-play-button", "media-fullscreen-button"].includes(el == null ? void 0 : el.localName))) {
        __privateMethod(this, _scheduleInactive, scheduleInactive_fn).call(this);
      }
    };
    _setInactive = /* @__PURE__ */ new WeakSet();
    setInactive_fn = function() {
      if (this.autohide < 0)
        return;
      if (this.hasAttribute(Attributes.USER_INACTIVE))
        return;
      this.setAttribute(Attributes.USER_INACTIVE, "");
      const evt = new GlobalThis.CustomEvent(
        MediaStateChangeEvents.USER_INACTIVE,
        { composed: true, bubbles: true, detail: true }
      );
      this.dispatchEvent(evt);
    };
    _setActive = /* @__PURE__ */ new WeakSet();
    setActive_fn = function() {
      if (!this.hasAttribute(Attributes.USER_INACTIVE))
        return;
      this.removeAttribute(Attributes.USER_INACTIVE);
      const evt = new GlobalThis.CustomEvent(
        MediaStateChangeEvents.USER_INACTIVE,
        { composed: true, bubbles: true, detail: false }
      );
      this.dispatchEvent(evt);
    };
    _scheduleInactive = /* @__PURE__ */ new WeakSet();
    scheduleInactive_fn = function() {
      __privateMethod(this, _setActive, setActive_fn).call(this);
      clearTimeout(this._inactiveTimeout);
      if (this.autohide < 0)
        return;
      this._inactiveTimeout = setTimeout(() => {
        __privateMethod(this, _setInactive, setInactive_fn).call(this);
      }, this.autohide * 1e3);
    };
  }
});

// node_modules/media-chrome/dist/utils/attribute-token-list.js
var __accessCheck4, __privateGet4, __privateAdd4, __privateSet4, _el, _attr, _defaultSet, _tokenSet, _tokens, tokens_get, AttributeTokenList;
var init_attribute_token_list = __esm({
  "node_modules/media-chrome/dist/utils/attribute-token-list.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    __accessCheck4 = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet4 = (obj, member, getter) => {
      __accessCheck4(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd4 = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    __privateSet4 = (obj, member, value, setter) => {
      __accessCheck4(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    AttributeTokenList = class {
      constructor(el, attr, { defaultValue } = { defaultValue: void 0 }) {
        __privateAdd4(this, _tokens);
        __privateAdd4(this, _el, void 0);
        __privateAdd4(this, _attr, void 0);
        __privateAdd4(this, _defaultSet, void 0);
        __privateAdd4(this, _tokenSet, /* @__PURE__ */ new Set());
        __privateSet4(this, _el, el);
        __privateSet4(this, _attr, attr);
        __privateSet4(this, _defaultSet, new Set(defaultValue));
      }
      [Symbol.iterator]() {
        return __privateGet4(this, _tokens, tokens_get).values();
      }
      get length() {
        return __privateGet4(this, _tokens, tokens_get).size;
      }
      get value() {
        var _a2;
        return (_a2 = [...__privateGet4(this, _tokens, tokens_get)].join(" ")) != null ? _a2 : "";
      }
      set value(val) {
        var _a2;
        if (val === this.value)
          return;
        __privateSet4(this, _tokenSet, /* @__PURE__ */ new Set());
        this.add(...(_a2 = val == null ? void 0 : val.split(" ")) != null ? _a2 : []);
      }
      toString() {
        return this.value;
      }
      item(index) {
        return [...__privateGet4(this, _tokens, tokens_get)][index];
      }
      values() {
        return __privateGet4(this, _tokens, tokens_get).values();
      }
      forEach(callback) {
        __privateGet4(this, _tokens, tokens_get).forEach(callback);
      }
      add(...tokens) {
        var _a2, _b;
        tokens.forEach((t) => __privateGet4(this, _tokenSet).add(t));
        if (this.value === "" && !((_a2 = __privateGet4(this, _el)) == null ? void 0 : _a2.hasAttribute(`${__privateGet4(this, _attr)}`))) {
          return;
        }
        (_b = __privateGet4(this, _el)) == null ? void 0 : _b.setAttribute(`${__privateGet4(this, _attr)}`, `${this.value}`);
      }
      remove(...tokens) {
        var _a2;
        tokens.forEach((t) => __privateGet4(this, _tokenSet).delete(t));
        (_a2 = __privateGet4(this, _el)) == null ? void 0 : _a2.setAttribute(`${__privateGet4(this, _attr)}`, `${this.value}`);
      }
      contains(token) {
        return __privateGet4(this, _tokens, tokens_get).has(token);
      }
      toggle(token, force) {
        if (typeof force !== "undefined") {
          if (force) {
            this.add(token);
            return true;
          } else {
            this.remove(token);
            return false;
          }
        }
        if (this.contains(token)) {
          this.remove(token);
          return false;
        }
        this.add(token);
        return true;
      }
      replace(oldToken, newToken) {
        this.remove(oldToken);
        this.add(newToken);
        return oldToken === newToken;
      }
    };
    _el = /* @__PURE__ */ new WeakMap();
    _attr = /* @__PURE__ */ new WeakMap();
    _defaultSet = /* @__PURE__ */ new WeakMap();
    _tokenSet = /* @__PURE__ */ new WeakMap();
    _tokens = /* @__PURE__ */ new WeakSet();
    tokens_get = function() {
      return __privateGet4(this, _tokenSet).size ? __privateGet4(this, _tokenSet) : __privateGet4(this, _defaultSet);
    };
  }
});

// node_modules/media-chrome/dist/utils/captions.js
var splitTextTracksStr, parseTextTrackStr, parseTextTracksStr, parseTracks, formatTextTrackObj, stringifyTextTrackList, isMatchingPropOf, textTrackObjAsPred, updateTracksModeTo, getTextTracksList, areSubsOn, toggleSubsCaps;
var init_captions = __esm({
  "node_modules/media-chrome/dist/utils/captions.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_server_safe_globals();
    init_constants();
    splitTextTracksStr = (textTracksStr = "") => textTracksStr.split(/\s+/);
    parseTextTrackStr = (textTrackStr = "") => {
      let [kind, language, encodedLabel] = textTrackStr.split(":");
      const label = encodedLabel ? decodeURIComponent(encodedLabel) : void 0;
      kind = kind === "cc" ? "captions" : "subtitles";
      return {
        kind,
        language,
        label
      };
    };
    parseTextTracksStr = (textTracksStr = "", textTrackLikeObj = {}) => {
      return splitTextTracksStr(textTracksStr).map((textTrackStr) => {
        const textTrackObj = parseTextTrackStr(textTrackStr);
        return {
          ...textTrackLikeObj,
          ...textTrackObj
        };
      });
    };
    parseTracks = (trackOrTracks) => {
      if (Array.isArray(trackOrTracks)) {
        return trackOrTracks.map((trackObjOrStr) => {
          if (typeof trackObjOrStr === "string") {
            return parseTextTrackStr(trackObjOrStr);
          }
          return trackObjOrStr;
        });
      }
      if (typeof trackOrTracks === "string") {
        return parseTextTracksStr(trackOrTracks);
      }
      return [trackOrTracks];
    };
    formatTextTrackObj = ({ kind, label, language } = { kind: "subtitles" }) => {
      if (!label)
        return language;
      return `${kind === "captions" ? "cc" : "sb"}:${language}:${encodeURIComponent(label)}`;
    };
    stringifyTextTrackList = (textTracks = []) => {
      return Array.prototype.map.call(textTracks, formatTextTrackObj).join(" ");
    };
    isMatchingPropOf = (key2, value) => (obj) => obj[key2] === value;
    textTrackObjAsPred = (filterObj) => {
      const preds = Object.entries(filterObj).map(([key2, value]) => {
        return isMatchingPropOf(key2, value);
      });
      return (textTrack) => preds.every((pred) => pred(textTrack));
    };
    updateTracksModeTo = (mode, tracks = [], tracksToUpdate = []) => {
      const preds = parseTracks(tracksToUpdate).map(textTrackObjAsPred);
      const isTrackToUpdate = (textTrack) => {
        return preds.some((pred) => pred(textTrack));
      };
      Array.from(tracks).filter(isTrackToUpdate).forEach((textTrack) => {
        textTrack.mode = mode;
      });
    };
    getTextTracksList = (media, filterPredOrObj = () => true) => {
      if (!(media == null ? void 0 : media.textTracks))
        return [];
      const filterPred = typeof filterPredOrObj === "function" ? filterPredOrObj : textTrackObjAsPred(filterPredOrObj);
      return Array.from(media.textTracks).filter(filterPred);
    };
    areSubsOn = (el) => {
      const showingSubtitles = !!el.getAttribute(
        MediaUIAttributes.MEDIA_SUBTITLES_SHOWING
      );
      return showingSubtitles;
    };
    toggleSubsCaps = (el, force) => {
      var _a2, _b;
      const subsOn = areSubsOn(el);
      if (subsOn || force === false) {
        const subtitlesShowingStr = el.getAttribute(
          MediaUIAttributes.MEDIA_SUBTITLES_SHOWING
        );
        if (subtitlesShowingStr) {
          const evt = new GlobalThis.CustomEvent(
            MediaUIEvents.MEDIA_DISABLE_SUBTITLES_REQUEST,
            { composed: true, bubbles: true, detail: subtitlesShowingStr }
          );
          el.dispatchEvent(evt);
        }
      } else if (!subsOn || force === true) {
        const [subTrackStr] = (_b = splitTextTracksStr(
          (_a2 = el.getAttribute(MediaUIAttributes.MEDIA_SUBTITLES_LIST)) != null ? _a2 : ""
        )) != null ? _b : [];
        if (subTrackStr) {
          const evt = new GlobalThis.CustomEvent(
            MediaUIEvents.MEDIA_SHOW_SUBTITLES_REQUEST,
            { composed: true, bubbles: true, detail: subTrackStr }
          );
          el.dispatchEvent(evt);
        }
      } else {
        console.error(
          "Attempting to enable captions or subtitles but none are available! Please verify your media content if this is unexpected."
        );
      }
    };
  }
});

// node_modules/media-chrome/dist/utils/fullscreen-api.js
var fullscreenApi;
var init_fullscreen_api = __esm({
  "node_modules/media-chrome/dist/utils/fullscreen-api.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_server_safe_globals();
    fullscreenApi = {
      enter: "requestFullscreen",
      exit: "exitFullscreen",
      rootEvents: ["fullscreenchange"],
      mediaEvents: [],
      element: "fullscreenElement",
      error: "fullscreenerror",
      enabled: "fullscreenEnabled"
    };
    if (Document5.fullscreenElement === void 0) {
      fullscreenApi.enter = "webkitRequestFullScreen";
      fullscreenApi.exit = Document5.webkitExitFullscreen != null ? "webkitExitFullscreen" : "webkitCancelFullScreen";
      fullscreenApi.rootEvents = ["webkitfullscreenchange"];
      fullscreenApi.mediaEvents = ["webkitbeginfullscreen", "webkitendfullscreen"], fullscreenApi.element = "webkitFullscreenElement";
      fullscreenApi.error = "webkitfullscreenerror";
      fullscreenApi.enabled = "webkitFullscreenEnabled";
    }
  }
});

// node_modules/media-chrome/dist/utils/platform-tests.js
var testMediaEl, getTestMediaEl, hasVolumeSupportAsync, hasPipSupport, hasFullscreenSupport, fullscreenSupported, pipSupported, airplaySupported, castSupported;
var init_platform_tests = __esm({
  "node_modules/media-chrome/dist/utils/platform-tests.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_server_safe_globals();
    init_utils();
    init_fullscreen_api();
    getTestMediaEl = () => {
      var _a2, _b;
      if (testMediaEl)
        return testMediaEl;
      testMediaEl = (_b = (_a2 = Document5) == null ? void 0 : _a2.createElement) == null ? void 0 : _b.call(_a2, "video");
      return testMediaEl;
    };
    hasVolumeSupportAsync = async (mediaEl = getTestMediaEl()) => {
      if (!mediaEl)
        return false;
      const prevVolume = mediaEl.volume;
      mediaEl.volume = prevVolume / 2 + 0.1;
      await delay(0);
      return mediaEl.volume !== prevVolume;
    };
    hasPipSupport = (mediaEl = getTestMediaEl()) => typeof (mediaEl == null ? void 0 : mediaEl.requestPictureInPicture) === "function";
    hasFullscreenSupport = (mediaEl = getTestMediaEl()) => {
      let fullscreenEnabled = Document5[fullscreenApi.enabled];
      if (!fullscreenEnabled && mediaEl) {
        fullscreenEnabled = "webkitSupportsFullscreen" in mediaEl;
      }
      return fullscreenEnabled;
    };
    fullscreenSupported = hasFullscreenSupport();
    pipSupported = hasPipSupport();
    airplaySupported = !!GlobalThis.WebKitPlaybackTargetAvailabilityEvent;
    castSupported = !!GlobalThis.chrome;
  }
});

// node_modules/media-chrome/dist/controller.js
var volumeSupported, volumeSupportPromise, StreamTypeValues, getSubtitleTracks, getShowingSubtitleTracks, MediaUIStates, MediaUIRequestHandlers;
var init_controller = __esm({
  "node_modules/media-chrome/dist/controller.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_server_safe_globals();
    init_fullscreen_api();
    init_element_utils();
    init_platform_tests();
    init_constants();
    init_captions();
    volumeSupportPromise = hasVolumeSupportAsync().then((supported) => {
      volumeSupported = supported;
      return volumeSupported;
    });
    StreamTypeValues = Object.values(StreamTypes);
    getSubtitleTracks = (controller) => {
      return getTextTracksList(controller.media, (textTrack) => {
        return [TextTrackKinds.SUBTITLES, TextTrackKinds.CAPTIONS].includes(textTrack.kind);
      }).sort((a, b) => a.kind >= b.kind ? 1 : -1);
    };
    getShowingSubtitleTracks = (controller) => {
      return getTextTracksList(controller.media, (textTrack) => {
        return textTrack.mode === TextTrackModes.SHOWING && [TextTrackKinds.SUBTITLES, TextTrackKinds.CAPTIONS].includes(textTrack.kind);
      });
    };
    MediaUIStates = {
      MEDIA_PAUSED: {
        get: function(controller) {
          const { media } = controller;
          return media ? media.paused : true;
        },
        mediaEvents: ["play", "playing", "pause", "emptied"]
      },
      MEDIA_HAS_PLAYED: {
        get: function(controller) {
          const { media } = controller;
          if (!media)
            return false;
          return !media.paused;
        },
        mediaEvents: ["playing", "emptied"]
      },
      MEDIA_ENDED: {
        get: function(controller) {
          const { media } = controller;
          return media ? media.ended : false;
        },
        mediaEvents: ["seeked", "ended", "emptied"]
      },
      MEDIA_PLAYBACK_RATE: {
        get: function(controller) {
          const { media } = controller;
          if (!media || typeof media.playbackRate == "undefined") {
            return 1;
          }
          return media.playbackRate;
        },
        mediaEvents: ["ratechange", "loadstart"]
      },
      MEDIA_MUTED: {
        get: function(controller) {
          const { media } = controller;
          if (!media || typeof media.muted == "undefined") {
            return false;
          }
          return media.muted;
        },
        mediaEvents: ["volumechange"]
      },
      MEDIA_VOLUME: {
        get: function(controller) {
          const { media } = controller;
          if (!media || typeof media.volume == "undefined") {
            return 1;
          }
          return Number(media.volume);
        },
        mediaEvents: ["volumechange"]
      },
      MEDIA_VOLUME_LEVEL: {
        get: function(controller) {
          const { media } = controller;
          let level = "high";
          if (!media || typeof media.volume == "undefined") {
            return level;
          }
          const { muted, volume } = media;
          if (volume === 0 || muted) {
            level = "off";
          } else if (volume < 0.5) {
            level = "low";
          } else if (volume < 0.75) {
            level = "medium";
          }
          return level;
        },
        mediaEvents: ["volumechange"]
      },
      MEDIA_CURRENT_TIME: {
        get: function(controller) {
          const { media } = controller;
          if (!media || typeof media.currentTime == "undefined") {
            return 0;
          }
          return media.currentTime;
        },
        mediaEvents: ["playing", "pause", "timeupdate", "loadedmetadata"]
      },
      MEDIA_DURATION: {
        get: function(controller) {
          const { media } = controller;
          if (!media || !Number.isFinite(media.duration)) {
            return NaN;
          }
          return media.duration;
        },
        mediaEvents: ["durationchange", "loadedmetadata", "emptied"]
      },
      MEDIA_SEEKABLE: {
        get: function(controller) {
          var _a2;
          const { media } = controller;
          if (!((_a2 = media == null ? void 0 : media.seekable) == null ? void 0 : _a2.length))
            return void 0;
          const start = media.seekable.start(0);
          const end = media.seekable.end(media.seekable.length - 1);
          if (!start && !end)
            return void 0;
          return [Number(start.toFixed(3)), Number(end.toFixed(3))];
        },
        mediaEvents: ["loadedmetadata", "emptied", "progress"]
      },
      MEDIA_LOADING: {
        get: function(controller) {
          var _a2;
          return !!(((_a2 = controller.media) == null ? void 0 : _a2.readyState) < 3);
        },
        mediaEvents: ["waiting", "playing", "emptied"]
      },
      MEDIA_BUFFERED: {
        get: function(controller) {
          var _a2, _b, _c;
          const timeRanges = (_a2 = controller.media) == null ? void 0 : _a2.buffered;
          return Array.from((_c = (_b = controller.media) == null ? void 0 : _b.buffered) != null ? _c : []).map((_, i) => [
            Number(timeRanges.start(i)).toFixed(3),
            Number(timeRanges.end(i)).toFixed(3)
          ]);
        },
        mediaEvents: ["progress", "emptied"]
      },
      MEDIA_STREAM_TYPE: {
        get: function(controller) {
          const { media } = controller;
          if (!media)
            return void 0;
          const { streamType } = media;
          if (StreamTypeValues.includes(streamType)) {
            if (streamType === StreamTypes.UNKNOWN) {
              const defaultType = controller.getAttribute("defaultstreamtype");
              if ([StreamTypes.LIVE, StreamTypes.ON_DEMAND].includes(defaultType)) {
                return defaultType;
              }
              return void 0;
            }
            return streamType;
          }
          const duration = media.duration;
          if (duration === Infinity) {
            return StreamTypes.LIVE;
          } else if (Number.isFinite(duration)) {
            return StreamTypes.ON_DEMAND;
          } else {
            const defaultType = controller.getAttribute("defaultstreamtype");
            if ([StreamTypes.LIVE, StreamTypes.ON_DEMAND].includes(defaultType)) {
              return defaultType;
            }
          }
          return void 0;
        },
        mediaEvents: [
          "emptied",
          "durationchange",
          "loadedmetadata",
          "streamtypechange"
        ]
      },
      MEDIA_TARGET_LIVE_WINDOW: {
        get: function(controller) {
          const { media } = controller;
          if (!media)
            return Number.NaN;
          const { targetLiveWindow } = media;
          const streamType = MediaUIStates.MEDIA_STREAM_TYPE.get(controller);
          if ((targetLiveWindow == null || Number.isNaN(targetLiveWindow)) && streamType === StreamTypes.LIVE) {
            return 0;
          }
          return targetLiveWindow;
        },
        mediaEvents: [
          "emptied",
          "durationchange",
          "loadedmetadata",
          "streamtypechange",
          "targetlivewindowchange"
        ]
      },
      MEDIA_TIME_IS_LIVE: {
        get: function(controller) {
          const { media } = controller;
          if (!media)
            return false;
          if (typeof media.liveEdgeStart === "number") {
            if (Number.isNaN(media.liveEdgeStart))
              return false;
            return media.currentTime >= media.liveEdgeStart;
          }
          const live = MediaUIStates.MEDIA_STREAM_TYPE.get(controller) === "live";
          if (!live)
            return false;
          const seekable = media.seekable;
          if (!seekable)
            return true;
          if (!seekable.length)
            return false;
          const liveEdgeStartOffset = controller.hasAttribute("liveedgeoffset") ? Number(controller.getAttribute("liveedgeoffset")) : 10;
          const liveEdgeStart = seekable.end(seekable.length - 1) - liveEdgeStartOffset;
          return media.currentTime >= liveEdgeStart;
        },
        mediaEvents: ["playing", "timeupdate", "progress", "waiting", "emptied"]
      },
      MEDIA_IS_FULLSCREEN: {
        get: function(controller, event) {
          var _a2;
          const media = controller.media;
          if (media && Document5[fullscreenApi.element] === void 0 && "webkitDisplayingFullscreen" in media) {
            return media.webkitDisplayingFullscreen && media.webkitPresentationMode === "fullscreen";
          }
          let fullscreenEl;
          if (event) {
            const isSomeElementFullscreen = Document5[fullscreenApi.element];
            fullscreenEl = isSomeElementFullscreen ? event.target : null;
          } else {
            fullscreenEl = (_a2 = controller.getRootNode().fullscreenElement) != null ? _a2 : Document5[fullscreenApi.element];
          }
          return containsComposedNode(controller.fullscreenElement, fullscreenEl);
        },
        rootEvents: fullscreenApi.rootEvents,
        mediaEvents: fullscreenApi.mediaEvents
      },
      MEDIA_IS_PIP: {
        get: function(controller, e) {
          var _a2;
          const media = controller.media;
          if (!media)
            return false;
          if (e) {
            return e.type == "enterpictureinpicture";
          } else {
            const pipElement = (_a2 = controller.getRootNode().pictureInPictureElement) != null ? _a2 : Document5.pictureInPictureElement;
            return containsComposedNode(media, pipElement);
          }
        },
        mediaEvents: ["enterpictureinpicture", "leavepictureinpicture"]
      },
      MEDIA_IS_CASTING: {
        get: function(controller, e) {
          var _a2;
          const { media } = controller;
          if (!media)
            return false;
          const castElement = (_a2 = GlobalThis.CastableVideoElement) == null ? void 0 : _a2.castElement;
          let castState = containsComposedNode(media, castElement);
          if ((e == null ? void 0 : e.type) === "castchange" && (e == null ? void 0 : e.detail) === "CONNECTING") {
            castState = "connecting";
          }
          return castState;
        },
        mediaEvents: ["entercast", "leavecast", "castchange"]
      },
      MEDIA_AIRPLAY_UNAVAILABLE: {
        get: function(controller, e) {
          if (!airplaySupported)
            return AvailabilityStates.UNSUPPORTED;
          if (!e)
            return void 0;
          if (e.availability === "available") {
            return void 0;
          } else if (e.availability === "not-available") {
            return AvailabilityStates.UNAVAILABLE;
          }
        },
        mediaEvents: ["webkitplaybacktargetavailabilitychanged"]
      },
      MEDIA_CAST_UNAVAILABLE: {
        get: function() {
          var _a2;
          const castState = (_a2 = GlobalThis.CastableVideoElement) == null ? void 0 : _a2.castState;
          if (!castSupported || !castState) {
            return AvailabilityStates.UNSUPPORTED;
          }
          if (castState.includes("CONNECT")) {
            return void 0;
          } else {
            return AvailabilityStates.UNAVAILABLE;
          }
        },
        mediaEvents: ["castchange"]
      },
      MEDIA_FULLSCREEN_UNAVAILABLE: {
        get: function() {
          return fullscreenSupported ? void 0 : AvailabilityStates.UNAVAILABLE;
        }
      },
      MEDIA_PIP_UNAVAILABLE: {
        get: function() {
          return pipSupported ? void 0 : AvailabilityStates.UNSUPPORTED;
        }
      },
      MEDIA_RENDITION_UNAVAILABLE: {
        get: function(controller) {
          var _a2;
          const { media } = controller;
          if (!(media == null ? void 0 : media.videoRenditions)) {
            return AvailabilityStates.UNSUPPORTED;
          }
          if (!((_a2 = media.videoRenditions) == null ? void 0 : _a2.length)) {
            return AvailabilityStates.UNAVAILABLE;
          }
          return void 0;
        },
        mediaEvents: ["emptied", "loadstart"],
        videoRenditionsEvents: ["addrendition", "removerendition"]
      },
      MEDIA_AUDIO_TRACK_UNAVAILABLE: {
        get: function(controller) {
          var _a2, _b;
          const { media } = controller;
          if (!(media == null ? void 0 : media.audioTracks)) {
            return AvailabilityStates.UNSUPPORTED;
          }
          if (((_b = (_a2 = media.audioTracks) == null ? void 0 : _a2.length) != null ? _b : 0) <= 1) {
            return AvailabilityStates.UNAVAILABLE;
          }
          return void 0;
        },
        mediaEvents: ["emptied", "loadstart"],
        audioTracksEvents: ["addtrack", "removetrack"]
      },
      MEDIA_VOLUME_UNAVAILABLE: {
        get: function(controller) {
          if (volumeSupported !== void 0 && !volumeSupported) {
            return AvailabilityStates.UNSUPPORTED;
          }
          const { media } = controller;
          if (media && typeof media.volume == "undefined") {
            return AvailabilityStates.UNAVAILABLE;
          }
          return void 0;
        },
        mediaEvents: ["loadstart"]
      },
      MEDIA_SUBTITLES_LIST: {
        get: function(controller) {
          return getSubtitleTracks(controller).map(({ kind, label, language }) => ({ kind, label, language }));
        },
        mediaEvents: ["loadstart"],
        textTracksEvents: ["addtrack", "removetrack"]
      },
      MEDIA_SUBTITLES_SHOWING: {
        get: function(controller) {
          if (controller.hasAttribute("defaultsubtitles") && !controller.hasAttribute(MediaUIAttributes.MEDIA_HAS_PLAYED) && !controller.hasAttribute(MediaUIAttributes.MEDIA_SUBTITLES_SHOWING)) {
            toggleSubsCaps(controller, true);
          }
          return getShowingSubtitleTracks(controller).map(({ kind, label, language }) => ({ kind, label, language }));
        },
        mediaEvents: ["loadstart"],
        textTracksEvents: ["addtrack", "removetrack", "change"]
      },
      MEDIA_RENDITION_LIST: {
        get: function(controller) {
          var _a2;
          const { media } = controller;
          return [...(_a2 = media == null ? void 0 : media.videoRenditions) != null ? _a2 : []];
        },
        mediaEvents: ["emptied", "loadstart"],
        videoRenditionsEvents: ["addrendition", "removerendition"]
      },
      MEDIA_RENDITION_SELECTED: {
        get: function(controller) {
          var _a2, _b, _c;
          const { media } = controller;
          return (_c = (_b = media == null ? void 0 : media.videoRenditions) == null ? void 0 : _b[(_a2 = media.videoRenditions) == null ? void 0 : _a2.selectedIndex]) == null ? void 0 : _c.id;
        },
        mediaEvents: ["emptied"],
        videoRenditionsEvents: ["addrendition", "removerendition", "change"]
      },
      MEDIA_AUDIO_TRACK_LIST: {
        get: function(controller) {
          var _a2;
          const { media } = controller;
          return [...(_a2 = media == null ? void 0 : media.audioTracks) != null ? _a2 : []];
        },
        mediaEvents: ["emptied", "loadstart"],
        audioTracksEvents: ["addtrack", "removetrack"]
      },
      MEDIA_AUDIO_TRACK_ENABLED: {
        get: function(controller) {
          var _a2, _b;
          const { media } = controller;
          return (_b = [...(_a2 = media == null ? void 0 : media.audioTracks) != null ? _a2 : []].find((audioTrack) => audioTrack.enabled)) == null ? void 0 : _b.id;
        },
        mediaEvents: ["emptied"],
        audioTracksEvents: ["addtrack", "removetrack", "change"]
      }
    };
    MediaUIRequestHandlers = {
      MEDIA_PLAY_REQUEST: (media, event, controller) => {
        var _a2;
        const streamType = MediaUIStates.MEDIA_STREAM_TYPE.get(controller);
        const autoSeekToLive = controller.getAttribute("noautoseektolive") === null;
        if (streamType == StreamTypes.LIVE && autoSeekToLive) {
          MediaUIRequestHandlers["MEDIA_SEEK_TO_LIVE_REQUEST"](media);
        }
        (_a2 = media.play()) == null ? void 0 : _a2.catch(() => {
        });
      },
      MEDIA_PAUSE_REQUEST: (media) => media.pause(),
      MEDIA_MUTE_REQUEST: (media) => media.muted = true,
      MEDIA_UNMUTE_REQUEST: (media) => {
        media.muted = false;
        if (media.volume === 0) {
          media.volume = 0.25;
        }
      },
      MEDIA_VOLUME_REQUEST: (media, event, mediaController) => {
        const volume = event.detail;
        media.volume = volume;
        if (volume > 0 && media.muted) {
          media.muted = false;
        }
        if (!mediaController.hasAttribute("novolumepref")) {
          try {
            GlobalThis.localStorage.setItem(
              "media-chrome-pref-volume",
              volume.toString()
            );
          } catch (err) {
          }
        }
      },
      MEDIA_ENTER_FULLSCREEN_REQUEST: (media, event, controller) => {
        if (!fullscreenSupported) {
          console.warn(
            "Fullscreen support is unavailable; not entering fullscreen"
          );
          return;
        }
        if (Document5.pictureInPictureElement) {
          Document5.exitPictureInPicture();
        }
        if (controller[fullscreenApi.enter]) {
          controller.fullscreenElement[fullscreenApi.enter]();
        } else if (media.webkitEnterFullscreen) {
          media.webkitEnterFullscreen();
        } else if (media.requestFullscreen) {
          media.requestFullscreen();
        } else {
          console.warn("MediaChrome: Fullscreen not supported");
        }
      },
      MEDIA_EXIT_FULLSCREEN_REQUEST: () => {
        Document5[fullscreenApi.exit]();
      },
      MEDIA_ENTER_PIP_REQUEST: (media) => {
        if (!Document5.pictureInPictureEnabled) {
          console.warn("MediaChrome: Picture-in-picture is not enabled");
          return;
        }
        if (!media.requestPictureInPicture) {
          console.warn(
            "MediaChrome: The current media does not support picture-in-picture"
          );
          return;
        }
        if (Document5[fullscreenApi.element]) {
          Document5[fullscreenApi.exit]();
        }
        const warnNotReady = () => {
          console.warn(
            "MediaChrome: The media is not ready for picture-in-picture. It must have a readyState > 0."
          );
        };
        media.requestPictureInPicture().catch((err) => {
          if (err.code === 11) {
            if (media.readyState === 0 && media.preload === "none") {
              const cleanup = () => {
                media.removeEventListener("loadedmetadata", tryPip);
                media.preload = "none";
              };
              const tryPip = () => {
                media.requestPictureInPicture().catch(warnNotReady);
                cleanup();
              };
              media.addEventListener("loadedmetadata", tryPip);
              media.preload = "metadata";
              setTimeout(() => {
                if (media.readyState === 0)
                  warnNotReady();
                cleanup();
              }, 1e3);
            } else {
              throw err;
            }
          } else {
            throw err;
          }
        });
      },
      MEDIA_EXIT_PIP_REQUEST: () => {
        if (Document5.pictureInPictureElement) {
          Document5.exitPictureInPicture();
        }
      },
      MEDIA_ENTER_CAST_REQUEST: (media) => {
        var _a2;
        if (!((_a2 = GlobalThis.CastableVideoElement) == null ? void 0 : _a2.castEnabled))
          return;
        if (Document5[fullscreenApi.element]) {
          Document5[fullscreenApi.exit]();
        }
        media.requestCast();
      },
      MEDIA_EXIT_CAST_REQUEST: async () => {
        var _a2;
        if ((_a2 = GlobalThis.CastableVideoElement) == null ? void 0 : _a2.castElement) {
          GlobalThis.CastableVideoElement.exitCast();
        }
      },
      MEDIA_SEEK_REQUEST: (media, event) => {
        const time = event.detail;
        if (media.readyState > 0 || media.readyState === void 0) {
          media.currentTime = time;
        }
      },
      MEDIA_PLAYBACK_RATE_REQUEST: (media, event) => {
        media.playbackRate = event.detail;
      },
      MEDIA_PREVIEW_REQUEST: (media, event, controller) => {
        var _a2;
        if (!media)
          return;
        const time = event.detail;
        if (time === null) {
          controller.propagateMediaState(
            MediaUIAttributes.MEDIA_PREVIEW_TIME,
            void 0
          );
        }
        controller.propagateMediaState(MediaUIAttributes.MEDIA_PREVIEW_TIME, time);
        const [track] = getTextTracksList(media, {
          kind: TextTrackKinds.METADATA,
          label: "thumbnails"
        });
        if (!(track && track.cues))
          return;
        if (time === null) {
          controller.propagateMediaState(
            MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
            void 0
          );
          controller.propagateMediaState(
            MediaUIAttributes.MEDIA_PREVIEW_COORDS,
            void 0
          );
          return;
        }
        const cue = Array.prototype.find.call(
          track.cues,
          (c) => c.startTime >= time
        );
        if (!cue)
          return;
        const base = !/'^(?:[a-z]+:)?\/\//i.test(cue.text) ? (_a2 = media.querySelector('track[label="thumbnails"]')) == null ? void 0 : _a2.src : void 0;
        const url = new URL(cue.text, base);
        const previewCoordsStr = new URLSearchParams(url.hash).get("#xywh");
        controller.propagateMediaState(
          MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
          url.href
        );
        controller.propagateMediaState(
          MediaUIAttributes.MEDIA_PREVIEW_COORDS,
          previewCoordsStr.split(",")
        );
      },
      MEDIA_SHOW_SUBTITLES_REQUEST: (media, event, controller) => {
        const tracks = getSubtitleTracks(controller);
        const { detail: tracksToUpdate = [] } = event;
        updateTracksModeTo(TextTrackModes.SHOWING, tracks, tracksToUpdate);
      },
      MEDIA_DISABLE_SUBTITLES_REQUEST: (media, event, controller) => {
        const tracks = getSubtitleTracks(controller);
        const { detail: tracksToUpdate = [] } = event;
        updateTracksModeTo(TextTrackModes.DISABLED, tracks, tracksToUpdate);
      },
      MEDIA_AIRPLAY_REQUEST: (media) => {
        if (!media)
          return;
        if (!(media.webkitShowPlaybackTargetPicker && GlobalThis.WebKitPlaybackTargetAvailabilityEvent)) {
          console.warn(
            "received a request to select AirPlay but AirPlay is not supported in this environment"
          );
          return;
        }
        media.webkitShowPlaybackTargetPicker();
      },
      MEDIA_SEEK_TO_LIVE_REQUEST: (media) => {
        const seekable = media.seekable;
        if (!seekable) {
          console.warn(
            "MediaController: Media element does not support seeking to live."
          );
          return;
        }
        if (!seekable.length) {
          console.warn("MediaController: Media is unable to seek to live.");
          return;
        }
        media.currentTime = seekable.end(seekable.length - 1);
      },
      MEDIA_RENDITION_REQUEST: (media, event) => {
        if (!(media == null ? void 0 : media.videoRenditions)) {
          console.warn("MediaController: Rendition selection not supported by this media.");
          return;
        }
        const renditionId = event.detail;
        const index = [...media.videoRenditions].findIndex((r) => r.id == renditionId);
        if (media.videoRenditions.selectedIndex != index) {
          media.videoRenditions.selectedIndex = index;
        }
      },
      MEDIA_AUDIO_TRACK_REQUEST: (media, event) => {
        if (!(media == null ? void 0 : media.audioTracks)) {
          console.warn("MediaController: Audio track selection not supported by this media.");
          return;
        }
        const audioTrackId = event.detail;
        for (let track of media.audioTracks) {
          track.enabled = audioTrackId == track.id;
        }
      }
    };
  }
});

// node_modules/media-chrome/dist/media-controller.js
var __accessCheck5, __privateGet5, __privateAdd5, __privateSet5, __privateMethod2, _hotKeys, _fullscreenElement, _keyUpHandler, keyUpHandler_fn, _keyDownHandler, keyDownHandler_fn, ButtonPressedKeys, DEFAULT_SEEK_OFFSET, DEFAULT_TIME, Attributes2, MediaController, MEDIA_UI_ATTRIBUTE_NAMES2, MEDIA_UI_PROP_NAMES, getMediaUIAttributesFrom, hasMediaUIProps, isMediaStateReceiver, serializeTuple, CustomAttrSerializer, setAttr, isMediaSlotElementDescendant, traverseForMediaStateReceivers, propagateMediaState, getStateValue, monitorForMediaStateReceivers, media_controller_default;
var init_media_controller = __esm({
  "node_modules/media-chrome/dist/media-controller.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_media_container();
    init_server_safe_globals();
    init_attribute_token_list();
    init_utils();
    init_captions();
    init_constants();
    init_controller();
    init_element_utils();
    __accessCheck5 = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet5 = (obj, member, getter) => {
      __accessCheck5(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd5 = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    __privateSet5 = (obj, member, value, setter) => {
      __accessCheck5(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    __privateMethod2 = (obj, member, method) => {
      __accessCheck5(obj, member, "access private method");
      return method;
    };
    ButtonPressedKeys = ["ArrowLeft", "ArrowRight", "Enter", " ", "f", "m", "k", "c"];
    DEFAULT_SEEK_OFFSET = 10;
    DEFAULT_TIME = 0;
    Attributes2 = {
      DEFAULT_SUBTITLES: "defaultsubtitles",
      DEFAULT_STREAM_TYPE: "defaultstreamtype",
      FULLSCREEN_ELEMENT: "fullscreenelement",
      HOTKEYS: "hotkeys",
      KEYS_USED: "keysused",
      LIVE_EDGE_OFFSET: "liveedgeoffset",
      NO_AUTO_SEEK_TO_LIVE: "noautoseektolive",
      NO_HOTKEYS: "nohotkeys"
    };
    MediaController = class extends MediaContainer {
      constructor() {
        super();
        __privateAdd5(this, _keyUpHandler);
        __privateAdd5(this, _keyDownHandler);
        __privateAdd5(this, _hotKeys, new AttributeTokenList(this, Attributes2.HOTKEYS));
        __privateAdd5(this, _fullscreenElement, void 0);
        if (MediaUIStates.MEDIA_VOLUME_UNAVAILABLE.get(this) === void 0) {
          volumeSupportPromise.then(() => {
            this.propagateMediaState(
              MediaUIAttributes.MEDIA_VOLUME_UNAVAILABLE,
              MediaUIStates.MEDIA_VOLUME_UNAVAILABLE.get(this)
            );
          });
        }
        this.mediaStateReceivers = [];
        this.associatedElementSubscriptions = /* @__PURE__ */ new Map();
        this.associateElement(this);
        Object.keys(MediaUIRequestHandlers).forEach((key2) => {
          const handlerName = `_handle${constToCamel(key2, true)}`;
          this[handlerName] = (e) => {
            e.stopPropagation();
            if (!this.media) {
              console.warn("MediaController: No media available.");
              return;
            }
            MediaUIRequestHandlers[key2](this.media, e, this);
          };
          this.addEventListener(MediaUIEvents[key2], this[handlerName]);
        });
        this._mediaStatePropagators = {};
        Object.keys(MediaUIStates).forEach((key2) => {
          this._mediaStatePropagators[key2] = (e) => {
            this.propagateMediaState(MediaUIProps[key2], MediaUIStates[key2].get(this, e));
          };
        });
        this.enableHotkeys();
      }
      static get observedAttributes() {
        return super.observedAttributes.concat(
          Attributes2.NO_HOTKEYS,
          Attributes2.HOTKEYS,
          Attributes2.DEFAULT_STREAM_TYPE,
          Attributes2.DEFAULT_SUBTITLES
        );
      }
      get fullscreenElement() {
        var _a2;
        return (_a2 = __privateGet5(this, _fullscreenElement)) != null ? _a2 : this;
      }
      set fullscreenElement(element) {
        if (this.hasAttribute(Attributes2.FULLSCREEN_ELEMENT)) {
          this.removeAttribute(Attributes2.FULLSCREEN_ELEMENT);
        }
        __privateSet5(this, _fullscreenElement, element);
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        var _a2;
        if (attrName === Attributes2.NO_HOTKEYS) {
          if (newValue !== oldValue && newValue === "") {
            if (this.hasAttribute(Attributes2.HOTKEYS)) {
              console.warn("Both `hotkeys` and `nohotkeys` have been set. All hotkeys will be disabled.");
            }
            this.disableHotkeys();
          } else if (newValue !== oldValue && newValue === null) {
            this.enableHotkeys();
          }
        } else if (attrName === Attributes2.HOTKEYS) {
          __privateGet5(this, _hotKeys).value = newValue;
        } else if (attrName === Attributes2.DEFAULT_SUBTITLES && newValue !== oldValue && newValue === "") {
          toggleSubsCaps(this, true);
        } else if (attrName === Attributes2.DEFAULT_STREAM_TYPE) {
          this.propagateMediaState(MediaUIProps.MEDIA_STREAM_TYPE);
        } else if (attrName === Attributes2.FULLSCREEN_ELEMENT) {
          const el = newValue ? (_a2 = this.getRootNode()) == null ? void 0 : _a2.getElementById(newValue) : void 0;
          __privateSet5(this, _fullscreenElement, el);
        }
        super.attributeChangedCallback(attrName, oldValue, newValue);
      }
      mediaSetCallback(media) {
        super.mediaSetCallback(media);
        if (!media.hasAttribute("tabindex")) {
          media.tabIndex = -1;
        }
        Object.keys(MediaUIStates).forEach((key2) => {
          const {
            mediaEvents,
            rootEvents,
            textTracksEvents,
            videoRenditionsEvents,
            audioTracksEvents
          } = MediaUIStates[key2];
          const handler4 = this._mediaStatePropagators[key2];
          mediaEvents == null ? void 0 : mediaEvents.forEach((eventName) => {
            media.addEventListener(eventName, handler4);
            handler4();
          });
          rootEvents == null ? void 0 : rootEvents.forEach((eventName) => {
            this.getRootNode().addEventListener(eventName, handler4);
            handler4();
          });
          textTracksEvents == null ? void 0 : textTracksEvents.forEach((eventName) => {
            var _a2;
            (_a2 = media.textTracks) == null ? void 0 : _a2.addEventListener(eventName, handler4);
            handler4();
          });
          videoRenditionsEvents == null ? void 0 : videoRenditionsEvents.forEach((eventName) => {
            var _a2;
            (_a2 = media.videoRenditions) == null ? void 0 : _a2.addEventListener(eventName, handler4);
            handler4();
          });
          audioTracksEvents == null ? void 0 : audioTracksEvents.forEach((eventName) => {
            var _a2;
            (_a2 = media.audioTracks) == null ? void 0 : _a2.addEventListener(eventName, handler4);
            handler4();
          });
        });
        if (!this.hasAttribute("novolumepref")) {
          try {
            const volPref = GlobalThis.localStorage.getItem("media-chrome-pref-volume");
            if (volPref !== null)
              media.volume = volPref;
          } catch (e) {
            console.debug("Error getting volume pref", e);
          }
        }
      }
      mediaUnsetCallback(media) {
        super.mediaUnsetCallback(media);
        Object.keys(MediaUIStates).forEach((key2) => {
          const {
            mediaEvents,
            rootEvents,
            textTracksEvents,
            videoRenditionsEvents,
            audioTracksEvents
          } = MediaUIStates[key2];
          const handler4 = this._mediaStatePropagators[key2];
          mediaEvents == null ? void 0 : mediaEvents.forEach((eventName) => {
            media.removeEventListener(eventName, handler4);
          });
          rootEvents == null ? void 0 : rootEvents.forEach((eventName) => {
            this.getRootNode().removeEventListener(eventName, handler4);
          });
          textTracksEvents == null ? void 0 : textTracksEvents.forEach((eventName) => {
            var _a2;
            (_a2 = media.textTracks) == null ? void 0 : _a2.removeEventListener(eventName, handler4);
          });
          videoRenditionsEvents == null ? void 0 : videoRenditionsEvents.forEach((eventName) => {
            var _a2;
            (_a2 = media.videoRenditions) == null ? void 0 : _a2.removeEventListener(eventName, handler4);
            handler4();
          });
          audioTracksEvents == null ? void 0 : audioTracksEvents.forEach((eventName) => {
            var _a2;
            (_a2 = media.audioTracks) == null ? void 0 : _a2.removeEventListener(eventName, handler4);
            handler4();
          });
        });
        this.propagateMediaState(MediaUIProps.MEDIA_PAUSED, true);
      }
      propagateMediaState(stateName, state) {
        const previousState = getStateValue(this.mediaStateReceivers, stateName);
        propagateMediaState(this.mediaStateReceivers, stateName, state);
        if (previousState === getStateValue(this.mediaStateReceivers, stateName))
          return;
        const attrName = stateName.toLowerCase();
        const evt = new GlobalThis.CustomEvent(
          AttributeToStateChangeEventMap[attrName],
          { composed: true, bubbles: true, detail: state }
        );
        this.dispatchEvent(evt);
      }
      associateElement(element) {
        if (!element)
          return;
        const { associatedElementSubscriptions } = this;
        if (associatedElementSubscriptions.has(element))
          return;
        const registerMediaStateReceiver = this.registerMediaStateReceiver.bind(this);
        const unregisterMediaStateReceiver = this.unregisterMediaStateReceiver.bind(this);
        const unsubscribe = monitorForMediaStateReceivers(
          element,
          registerMediaStateReceiver,
          unregisterMediaStateReceiver
        );
        Object.keys(MediaUIEvents).forEach((key2) => {
          element.addEventListener(
            MediaUIEvents[key2],
            this[`_handle${constToCamel(key2, true)}`]
          );
        });
        associatedElementSubscriptions.set(element, unsubscribe);
      }
      unassociateElement(element) {
        if (!element)
          return;
        const { associatedElementSubscriptions } = this;
        if (!associatedElementSubscriptions.has(element))
          return;
        const unsubscribe = associatedElementSubscriptions.get(element);
        unsubscribe();
        associatedElementSubscriptions.delete(element);
        Object.keys(MediaUIEvents).forEach((key2) => {
          element.removeEventListener(
            MediaUIEvents[key2],
            this[`_handle${constToCamel(key2, true)}`]
          );
        });
      }
      registerMediaStateReceiver(el) {
        if (!el)
          return;
        const els = this.mediaStateReceivers;
        const index = els.indexOf(el);
        if (index > -1)
          return;
        els.push(el);
        Object.keys(MediaUIStates).forEach((stateConstName) => {
          const stateDetails = MediaUIStates[stateConstName];
          propagateMediaState(
            [el],
            MediaUIProps[stateConstName],
            stateDetails.get(this)
          );
        });
      }
      unregisterMediaStateReceiver(el) {
        const els = this.mediaStateReceivers;
        const index = els.indexOf(el);
        if (index < 0)
          return;
        els.splice(index, 1);
      }
      enableHotkeys() {
        this.addEventListener("keydown", __privateMethod2(this, _keyDownHandler, keyDownHandler_fn));
      }
      disableHotkeys() {
        this.removeEventListener("keydown", __privateMethod2(this, _keyDownHandler, keyDownHandler_fn));
        this.removeEventListener("keyup", __privateMethod2(this, _keyUpHandler, keyUpHandler_fn));
      }
      get hotkeys() {
        return __privateGet5(this, _hotKeys);
      }
      keyboardShortcutHandler(e) {
        var _a2, _b, _c, _d;
        const keysUsed = ((_d = (_c = (_a2 = e.target.getAttribute(Attributes2.KEYS_USED)) == null ? void 0 : _a2.split(" ")) != null ? _c : (_b = e.target) == null ? void 0 : _b.keysUsed) != null ? _d : []).map((key2) => key2 === "Space" ? " " : key2).filter(Boolean);
        if (keysUsed.includes(e.key)) {
          return;
        }
        let eventName, currentTimeStr, currentTime, detail, evt;
        const seekOffset = DEFAULT_SEEK_OFFSET;
        if (__privateGet5(this, _hotKeys).contains(`no${e.key.toLowerCase()}`))
          return;
        if (e.key === " " && __privateGet5(this, _hotKeys).contains(`nospace`))
          return;
        switch (e.key) {
          case " ":
          case "k":
            eventName = this.getAttribute(MediaUIAttributes.MEDIA_PAUSED) != null ? MediaUIEvents.MEDIA_PLAY_REQUEST : MediaUIEvents.MEDIA_PAUSE_REQUEST;
            this.dispatchEvent(
              new GlobalThis.CustomEvent(eventName, { composed: true, bubbles: true })
            );
            break;
          case "m":
            eventName = this.getAttribute(MediaUIAttributes.MEDIA_VOLUME_LEVEL) === "off" ? MediaUIEvents.MEDIA_UNMUTE_REQUEST : MediaUIEvents.MEDIA_MUTE_REQUEST;
            this.dispatchEvent(
              new GlobalThis.CustomEvent(eventName, { composed: true, bubbles: true })
            );
            break;
          case "f":
            eventName = this.getAttribute(MediaUIAttributes.MEDIA_IS_FULLSCREEN) != null ? MediaUIEvents.MEDIA_EXIT_FULLSCREEN_REQUEST : MediaUIEvents.MEDIA_ENTER_FULLSCREEN_REQUEST;
            this.dispatchEvent(
              new GlobalThis.CustomEvent(eventName, { composed: true, bubbles: true })
            );
            break;
          case "c":
            toggleSubsCaps(this);
            break;
          case "ArrowLeft":
            currentTimeStr = this.getAttribute(
              MediaUIAttributes.MEDIA_CURRENT_TIME
            );
            currentTime = currentTimeStr && !Number.isNaN(+currentTimeStr) ? +currentTimeStr : DEFAULT_TIME;
            detail = Math.max(currentTime - seekOffset, 0);
            evt = new GlobalThis.CustomEvent(MediaUIEvents.MEDIA_SEEK_REQUEST, {
              composed: true,
              bubbles: true,
              detail
            });
            this.dispatchEvent(evt);
            break;
          case "ArrowRight":
            currentTimeStr = this.getAttribute(
              MediaUIAttributes.MEDIA_CURRENT_TIME
            );
            currentTime = currentTimeStr && !Number.isNaN(+currentTimeStr) ? +currentTimeStr : DEFAULT_TIME;
            detail = Math.max(currentTime + seekOffset, 0);
            evt = new GlobalThis.CustomEvent(MediaUIEvents.MEDIA_SEEK_REQUEST, {
              composed: true,
              bubbles: true,
              detail
            });
            this.dispatchEvent(evt);
            break;
          default:
            break;
        }
      }
    };
    _hotKeys = /* @__PURE__ */ new WeakMap();
    _fullscreenElement = /* @__PURE__ */ new WeakMap();
    _keyUpHandler = /* @__PURE__ */ new WeakSet();
    keyUpHandler_fn = function(e) {
      const { key: key2 } = e;
      if (!ButtonPressedKeys.includes(key2)) {
        this.removeEventListener("keyup", __privateMethod2(this, _keyUpHandler, keyUpHandler_fn));
        return;
      }
      this.keyboardShortcutHandler(e);
    };
    _keyDownHandler = /* @__PURE__ */ new WeakSet();
    keyDownHandler_fn = function(e) {
      const { metaKey, altKey, key: key2 } = e;
      if (metaKey || altKey || !ButtonPressedKeys.includes(key2)) {
        this.removeEventListener("keyup", __privateMethod2(this, _keyUpHandler, keyUpHandler_fn));
        return;
      }
      if ([" ", "ArrowLeft", "ArrowRight"].includes(key2) && !(__privateGet5(this, _hotKeys).contains(`no${key2.toLowerCase()}`) || key2 === " " && __privateGet5(this, _hotKeys).contains("nospace"))) {
        e.preventDefault();
      }
      this.addEventListener("keyup", __privateMethod2(this, _keyUpHandler, keyUpHandler_fn), { once: true });
    };
    MEDIA_UI_ATTRIBUTE_NAMES2 = Object.values(MediaUIAttributes);
    MEDIA_UI_PROP_NAMES = Object.values(MediaUIProps);
    getMediaUIAttributesFrom = (child) => {
      var _a2, _b, _c, _d;
      let { observedAttributes } = child.constructor;
      if (!observedAttributes && ((_a2 = child.nodeName) == null ? void 0 : _a2.includes("-"))) {
        GlobalThis.customElements.upgrade(child);
        ({ observedAttributes } = child.constructor);
      }
      const mediaChromeAttributesList = (_d = (_c = (_b = child == null ? void 0 : child.getAttribute) == null ? void 0 : _b.call(child, MediaStateReceiverAttributes.MEDIA_CHROME_ATTRIBUTES)) == null ? void 0 : _c.split) == null ? void 0 : _d.call(_c, /\s+/);
      if (!Array.isArray(observedAttributes || mediaChromeAttributesList))
        return [];
      return (observedAttributes || mediaChromeAttributesList).filter(
        (attrName) => MEDIA_UI_ATTRIBUTE_NAMES2.includes(attrName)
      );
    };
    hasMediaUIProps = (mediaStateReceiverCandidate) => {
      var _a2, _b;
      if (((_a2 = mediaStateReceiverCandidate.nodeName) == null ? void 0 : _a2.includes("-")) && !!GlobalThis.customElements.get((_b = mediaStateReceiverCandidate.nodeName) == null ? void 0 : _b.toLowerCase()) && !(mediaStateReceiverCandidate instanceof GlobalThis.customElements.get(mediaStateReceiverCandidate.nodeName.toLowerCase()))) {
        GlobalThis.customElements.upgrade(mediaStateReceiverCandidate);
      }
      return MEDIA_UI_PROP_NAMES.some((propName) => propName in mediaStateReceiverCandidate);
    };
    isMediaStateReceiver = (child) => {
      return hasMediaUIProps(child) || !!getMediaUIAttributesFrom(child).length;
    };
    serializeTuple = (tuple) => {
      var _a2;
      return (_a2 = tuple == null ? void 0 : tuple.join) == null ? void 0 : _a2.call(tuple, ":");
    };
    CustomAttrSerializer = {
      [MediaUIAttributes.MEDIA_SUBTITLES_LIST]: stringifyTextTrackList,
      [MediaUIAttributes.MEDIA_SUBTITLES_SHOWING]: stringifyTextTrackList,
      [MediaUIAttributes.MEDIA_SEEKABLE]: serializeTuple,
      [MediaUIAttributes.MEDIA_BUFFERED]: (tuples) => tuples == null ? void 0 : tuples.map(serializeTuple).join(" "),
      [MediaUIAttributes.MEDIA_PREVIEW_COORDS]: (coords) => coords == null ? void 0 : coords.join(" "),
      [MediaUIAttributes.MEDIA_RENDITION_LIST]: stringifyRenditionList,
      [MediaUIAttributes.MEDIA_AUDIO_TRACK_LIST]: stringifyAudioTrackList
    };
    setAttr = async (child, attrName, attrValue) => {
      var _a2, _b;
      if (!child.isConnected) {
        await delay(0);
      }
      if (typeof attrValue === "boolean" || attrValue == null) {
        return setBooleanAttr(child, attrName, attrValue);
      }
      if (typeof attrValue === "number") {
        return setNumericAttr(child, attrName, attrValue);
      }
      if (typeof attrValue === "string") {
        return setStringAttr(child, attrName, attrValue);
      }
      if (Array.isArray(attrValue) && !attrValue.length) {
        return child.removeAttribute(attrName);
      }
      const val = (_b = (_a2 = CustomAttrSerializer[attrName]) == null ? void 0 : _a2.call(CustomAttrSerializer, attrValue)) != null ? _b : attrValue;
      return child.setAttribute(attrName, val);
    };
    isMediaSlotElementDescendant = (el) => {
      var _a2;
      return !!((_a2 = el.closest) == null ? void 0 : _a2.call(el, '*[slot="media"]'));
    };
    traverseForMediaStateReceivers = (rootNode, mediaStateReceiverCallback) => {
      if (isMediaSlotElementDescendant(rootNode)) {
        return;
      }
      const traverseForMediaStateReceiversSync = (rootNode2, mediaStateReceiverCallback2) => {
        var _a2, _b;
        if (isMediaStateReceiver(rootNode2)) {
          mediaStateReceiverCallback2(rootNode2);
        }
        const { children = [] } = rootNode2 != null ? rootNode2 : {};
        const shadowChildren = (_b = (_a2 = rootNode2 == null ? void 0 : rootNode2.shadowRoot) == null ? void 0 : _a2.children) != null ? _b : [];
        const allChildren = [...children, ...shadowChildren];
        allChildren.forEach(
          (child) => traverseForMediaStateReceivers(child, mediaStateReceiverCallback2)
        );
      };
      const name = rootNode == null ? void 0 : rootNode.nodeName.toLowerCase();
      if (name.includes("-") && !isMediaStateReceiver(rootNode)) {
        GlobalThis.customElements.whenDefined(name).then(() => {
          traverseForMediaStateReceiversSync(rootNode, mediaStateReceiverCallback);
        });
        return;
      }
      traverseForMediaStateReceiversSync(rootNode, mediaStateReceiverCallback);
    };
    propagateMediaState = (els, stateName, val) => {
      els.forEach((el) => {
        if (stateName in el) {
          el[stateName] = val;
          return;
        }
        const relevantAttrs = getMediaUIAttributesFrom(el);
        const attrName = stateName.toLowerCase();
        if (!relevantAttrs.includes(attrName))
          return;
        setAttr(el, attrName, val);
      });
    };
    getStateValue = (els, stateName) => {
      for (const el of els) {
        if (stateName in el) {
          return el[stateName];
        }
        const relevantAttrs = getMediaUIAttributesFrom(el);
        const attrName = stateName.toLowerCase();
        if (!relevantAttrs.includes(attrName))
          continue;
        return el.getAttribute(attrName);
      }
    };
    monitorForMediaStateReceivers = (rootNode, registerMediaStateReceiver, unregisterMediaStateReceiver) => {
      traverseForMediaStateReceivers(rootNode, registerMediaStateReceiver);
      const registerMediaStateReceiverHandler = (evt) => {
        var _a2;
        const el = (_a2 = evt == null ? void 0 : evt.composedPath()[0]) != null ? _a2 : evt.target;
        registerMediaStateReceiver(el);
      };
      const unregisterMediaStateReceiverHandler = (evt) => {
        var _a2;
        const el = (_a2 = evt == null ? void 0 : evt.composedPath()[0]) != null ? _a2 : evt.target;
        unregisterMediaStateReceiver(el);
      };
      rootNode.addEventListener(
        MediaUIEvents.REGISTER_MEDIA_STATE_RECEIVER,
        registerMediaStateReceiverHandler
      );
      rootNode.addEventListener(
        MediaUIEvents.UNREGISTER_MEDIA_STATE_RECEIVER,
        unregisterMediaStateReceiverHandler
      );
      const mutationCallback = (mutationsList) => {
        mutationsList.forEach((mutationRecord) => {
          const {
            addedNodes = [],
            removedNodes = [],
            type,
            target,
            attributeName
          } = mutationRecord;
          if (type === "childList") {
            Array.prototype.forEach.call(
              addedNodes,
              (node) => traverseForMediaStateReceivers(node, registerMediaStateReceiver)
            );
            Array.prototype.forEach.call(
              removedNodes,
              (node) => traverseForMediaStateReceivers(node, unregisterMediaStateReceiver)
            );
          } else if (type === "attributes" && attributeName === MediaStateReceiverAttributes.MEDIA_CHROME_ATTRIBUTES) {
            if (isMediaStateReceiver(target)) {
              registerMediaStateReceiver(target);
            } else {
              unregisterMediaStateReceiver(target);
            }
          }
        });
      };
      let prevSlotted = [];
      const slotChangeHandler = (event) => {
        const slotEl = event.target;
        if (slotEl.name === "media")
          return;
        prevSlotted.forEach(
          (node) => traverseForMediaStateReceivers(node, unregisterMediaStateReceiver)
        );
        prevSlotted = [...slotEl.assignedElements({ flatten: true })];
        prevSlotted.forEach(
          (node) => traverseForMediaStateReceivers(node, registerMediaStateReceiver)
        );
      };
      rootNode.addEventListener("slotchange", slotChangeHandler);
      const observer = new MutationObserver(mutationCallback);
      observer.observe(rootNode, {
        childList: true,
        attributes: true,
        subtree: true
      });
      const unsubscribe = () => {
        traverseForMediaStateReceivers(rootNode, unregisterMediaStateReceiver);
        rootNode.removeEventListener("slotchange", slotChangeHandler);
        observer.disconnect();
        rootNode.removeEventListener(
          MediaUIEvents.REGISTER_MEDIA_STATE_RECEIVER,
          registerMediaStateReceiverHandler
        );
        rootNode.removeEventListener(
          MediaUIEvents.UNREGISTER_MEDIA_STATE_RECEIVER,
          unregisterMediaStateReceiverHandler
        );
      };
      return unsubscribe;
    };
    if (!GlobalThis.customElements.get("media-controller")) {
      GlobalThis.customElements.define("media-controller", MediaController);
    }
    media_controller_default = MediaController;
  }
});

// node_modules/media-chrome/dist/media-chrome-range.js
var __accessCheck6, __privateGet6, __privateAdd6, __privateSet6, __privateMethod3, _mediaController3, _isInputTarget, _startpoint, _endpoint, _onFocusIn, _onFocusOut, _enableUserEvents, enableUserEvents_fn, _disableUserEvents, disableUserEvents_fn, _handlePointerDown, handlePointerDown_fn, _handlePointerEnter, handlePointerEnter_fn, _handlePointerUp2, handlePointerUp_fn2, _handlePointerLeave, handlePointerLeave_fn, _handlePointerMove2, handlePointerMove_fn2, template4, MediaChromeRange, media_chrome_range_default;
var init_media_chrome_range = __esm({
  "node_modules/media-chrome/dist/media-chrome-range.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_constants();
    init_server_safe_globals();
    init_element_utils();
    __accessCheck6 = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet6 = (obj, member, getter) => {
      __accessCheck6(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd6 = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    __privateSet6 = (obj, member, value, setter) => {
      __accessCheck6(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    __privateMethod3 = (obj, member, method) => {
      __accessCheck6(obj, member, "access private method");
      return method;
    };
    template4 = Document5.createElement("template");
    template4.innerHTML = `
  <style>
    :host {
      --_focus-box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
      --_media-range-padding: var(--media-range-padding, var(--media-control-padding, 10px));

      box-shadow: var(--_focus-visible-box-shadow, none);
      background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
      height: calc(var(--media-control-height, 24px) + 2 * var(--_media-range-padding));
      display: inline-flex;
      align-items: center;
      ${""}
      vertical-align: middle;
      box-sizing: border-box;
      position: relative;
      width: 100px;
      transition: background .15s linear;
      cursor: pointer;
      pointer-events: auto;
      touch-action: none; ${""}
      z-index: 1; ${""}
    }

    ${""}
    input[type=range]:focus {
      outline: 0;
    }
    input[type=range]:focus::-webkit-slider-runnable-track {
      outline: 0;
    }

    :host(:hover) {
      background: var(--media-control-hover-background, rgb(50 50 70 / .7));
    }

    #leftgap {
      padding-left: var(--media-range-padding-left, var(--_media-range-padding));
    }

    #rightgap {
      padding-right: var(--media-range-padding-right, var(--_media-range-padding));
    }

    #startpoint,
    #endpoint {
      position: absolute;
    }

    #endpoint {
      right: 0;
    }

    #container {
      ${""}
      width: var(--media-range-track-width, 100%);
      transform: translate(var(--media-range-track-translate-x, 0px), var(--media-range-track-translate-y, 0px));
      position: relative;
      height: 100%;
      display: flex;
      align-items: center;
      min-width: 40px;
    }

    #range {
      ${""}
      display: var(--media-time-range-hover-display, block);
      bottom: var(--media-time-range-hover-bottom, -7px);
      height: var(--media-time-range-hover-height, max(100% + 7px, 25px));
      width: 100%;
      position: absolute;
      cursor: pointer;

      -webkit-appearance: none; ${""}
      -webkit-tap-highlight-color: transparent;
      background: transparent; ${""}
      margin: 0;
      z-index: 1;
    }

    @media (hover: hover) {
      #range {
        bottom: var(--media-time-range-hover-bottom, -5px);
        height: var(--media-time-range-hover-height, max(100% + 5px, 20px));
      }
    }

    ${""}
    ${""}
    #range::-webkit-slider-thumb {
      -webkit-appearance: none;
      background: transparent;
      width: .1px;
      height: .1px;
    }

    ${""}
    #range::-moz-range-thumb {
      background: transparent;
      border: transparent;
      width: .1px;
      height: .1px;
    }

    #appearance {
      height: var(--media-range-track-height, 4px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      position: absolute;
    }

    #background,
    #track {
      border-radius: var(--media-range-track-border-radius, 1px);
      position: absolute;
      width: 100%;
      height: 100%;
    }

    #background {
      background: var(--media-range-track-background, rgb(255 255 255 / .2));
      backdrop-filter: var(--media-range-track-background-backdrop-filter);
      -webkit-backdrop-filter: var(--media-range-track-background-backdrop-filter);
    }

    #track {
      border: var(--media-range-track-border, none);
      outline: var(--media-range-track-outline);
      outline-offset: var(--media-range-track-outline-offset);
      backdrop-filter: var(--media-range-track-backdrop-filter);
      -webkit-backdrop-filter: var(--media-range-track-backdrop-filter);
      box-shadow: var(--media-range-track-box-shadow, none);
      overflow: hidden;
    }

    #progress {
      background: var(--media-range-bar-color, var(--media-primary-color, rgb(238 238 238)));
      border-radius: var(--media-range-track-border-radius, 1px);
      transition: var(--media-range-track-transition);
      position: absolute;
      height: 100%;
    }

    #highlight {
      border-radius: var(--media-range-track-border-radius, 1px);
      position: absolute;
      height: 100%;
    }

    #pointer {
      background: var(--media-range-track-pointer-background);
      border-right: var(--media-range-track-pointer-border-right);
      border-radius: var(--media-range-track-border-radius, 1px);
      transition: visibility .25s, opacity .25s;
      visibility: hidden;
      opacity: 0;
      position: absolute;
      height: 100%;
    }

    :host(:hover) #pointer {
      transition: visibility .5s, opacity .5s;
      visibility: visible;
      opacity: 1;
    }

    #thumb {
      width: var(--media-range-thumb-width, 10px);
      height: var(--media-range-thumb-height, 10px);
      margin-left: calc(var(--media-range-thumb-width, 10px) / -2);
      border: var(--media-range-thumb-border, none);
      border-radius: var(--media-range-thumb-border-radius, 10px);
      background: var(--media-range-thumb-background, var(--media-primary-color, rgb(238 238 238)));
      box-shadow: var(--media-range-thumb-box-shadow, 1px 1px 1px transparent);
      transition: var(--media-range-thumb-transition);
      transform: var(--media-range-thumb-transform, none);
      opacity: var(--media-range-thumb-opacity, 1);
      position: absolute;
      left: 0;
      cursor: pointer;
    }

    :host([disabled]) #thumb {
      background-color: #777;
    }
  </style>
  <div id="leftgap"></div>
  <div id="container">
    <div id="startpoint"></div>
    <div id="endpoint"></div>
    <div id="appearance">
      <div id="background"></div>
      <div id="track">
        <div id="highlight"></div>
        <div id="pointer"></div>
        <div id="progress"></div>
      </div>
      <div id="thumb"></div>
    </div>
    <input id="range" type="range" min="0" max="1" step="any" value="0">
  </div>
  <div id="rightgap"></div>
`;
    MediaChromeRange = class extends GlobalThis.HTMLElement {
      constructor() {
        super();
        __privateAdd6(this, _enableUserEvents);
        __privateAdd6(this, _disableUserEvents);
        __privateAdd6(this, _handlePointerDown);
        __privateAdd6(this, _handlePointerEnter);
        __privateAdd6(this, _handlePointerUp2);
        __privateAdd6(this, _handlePointerLeave);
        __privateAdd6(this, _handlePointerMove2);
        __privateAdd6(this, _mediaController3, void 0);
        __privateAdd6(this, _isInputTarget, void 0);
        __privateAdd6(this, _startpoint, void 0);
        __privateAdd6(this, _endpoint, void 0);
        __privateAdd6(this, _onFocusIn, () => {
          if (this.range.matches(":focus-visible")) {
            const { style: style2 } = getOrInsertCSSRule(this.shadowRoot, ":host");
            style2.setProperty("--_focus-visible-box-shadow", "var(--_focus-box-shadow)");
          }
        });
        __privateAdd6(this, _onFocusOut, () => {
          const { style: style2 } = getOrInsertCSSRule(this.shadowRoot, ":host");
          style2.removeProperty("--_focus-visible-box-shadow");
        });
        if (!this.shadowRoot) {
          this.attachShadow({ mode: "open" });
          this.shadowRoot.appendChild(template4.content.cloneNode(true));
        }
        const { style } = getOrInsertCSSRule(this.shadowRoot, ":host");
        style.setProperty("display", `var(--media-control-display, var(--${this.localName}-display, inline-flex))`);
        this.container = this.shadowRoot.querySelector("#container");
        __privateSet6(this, _startpoint, this.shadowRoot.querySelector("#startpoint"));
        __privateSet6(this, _endpoint, this.shadowRoot.querySelector("#endpoint"));
        this.range = this.shadowRoot.querySelector("#range");
      }
      static get observedAttributes() {
        return [
          "disabled",
          "aria-disabled",
          MediaStateReceiverAttributes.MEDIA_CONTROLLER
        ];
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        var _a2, _b, _c, _d, _e;
        if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
          if (oldValue) {
            (_b = (_a2 = __privateGet6(this, _mediaController3)) == null ? void 0 : _a2.unassociateElement) == null ? void 0 : _b.call(_a2, this);
            __privateSet6(this, _mediaController3, null);
          }
          if (newValue && this.isConnected) {
            __privateSet6(this, _mediaController3, (_c = this.getRootNode()) == null ? void 0 : _c.getElementById(newValue));
            (_e = (_d = __privateGet6(this, _mediaController3)) == null ? void 0 : _d.associateElement) == null ? void 0 : _e.call(_d, this);
          }
        } else if (attrName === "disabled" || attrName === "aria-disabled" && oldValue !== newValue) {
          if (newValue == null) {
            this.range.removeAttribute(attrName);
            __privateMethod3(this, _enableUserEvents, enableUserEvents_fn).call(this);
          } else {
            this.range.setAttribute(attrName, newValue);
            __privateMethod3(this, _disableUserEvents, disableUserEvents_fn).call(this);
          }
        }
      }
      connectedCallback() {
        var _a2, _b, _c;
        const mediaControllerId = this.getAttribute(
          MediaStateReceiverAttributes.MEDIA_CONTROLLER
        );
        if (mediaControllerId) {
          __privateSet6(this, _mediaController3, (_a2 = this.getRootNode()) == null ? void 0 : _a2.getElementById(mediaControllerId));
          (_c = (_b = __privateGet6(this, _mediaController3)) == null ? void 0 : _b.associateElement) == null ? void 0 : _c.call(_b, this);
        }
        this.updateBar();
        this.shadowRoot.addEventListener("focusin", __privateGet6(this, _onFocusIn));
        this.shadowRoot.addEventListener("focusout", __privateGet6(this, _onFocusOut));
        __privateMethod3(this, _enableUserEvents, enableUserEvents_fn).call(this);
      }
      disconnectedCallback() {
        var _a2, _b;
        __privateMethod3(this, _disableUserEvents, disableUserEvents_fn).call(this);
        (_b = (_a2 = __privateGet6(this, _mediaController3)) == null ? void 0 : _a2.unassociateElement) == null ? void 0 : _b.call(_a2, this);
        __privateSet6(this, _mediaController3, null);
        this.shadowRoot.removeEventListener("focusin", __privateGet6(this, _onFocusIn));
        this.shadowRoot.removeEventListener("focusout", __privateGet6(this, _onFocusOut));
      }
      updatePointerBar(evt) {
        const rangeRect = this.range.getBoundingClientRect();
        let mousePercent = (evt.clientX - rangeRect.left) / rangeRect.width;
        mousePercent = Math.max(0, Math.min(1, mousePercent)) * 100;
        const { style } = getOrInsertCSSRule(this.shadowRoot, "#pointer");
        style.setProperty("width", `${mousePercent}%`);
      }
      updateBar() {
        const rangePercent = this.range.valueAsNumber * 100;
        const progressRule = getOrInsertCSSRule(this.shadowRoot, "#progress");
        const thumbRule = getOrInsertCSSRule(this.shadowRoot, "#thumb");
        progressRule.style.setProperty("width", `${rangePercent}%`);
        thumbRule.style.setProperty("left", `${rangePercent}%`);
      }
      get dragging() {
        return this.hasAttribute("dragging");
      }
      handleEvent(evt) {
        switch (evt.type) {
          case "input":
            this.updateBar();
            break;
          case "pointerenter":
            __privateMethod3(this, _handlePointerEnter, handlePointerEnter_fn).call(this, evt);
            break;
          case "pointerdown":
            __privateMethod3(this, _handlePointerDown, handlePointerDown_fn).call(this, evt);
            break;
          case "pointermove":
            __privateMethod3(this, _handlePointerMove2, handlePointerMove_fn2).call(this, evt);
            break;
          case "pointerup":
            __privateMethod3(this, _handlePointerUp2, handlePointerUp_fn2).call(this);
            break;
          case "pointerleave":
            __privateMethod3(this, _handlePointerLeave, handlePointerLeave_fn).call(this);
            break;
        }
      }
      get keysUsed() {
        return ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];
      }
    };
    _mediaController3 = /* @__PURE__ */ new WeakMap();
    _isInputTarget = /* @__PURE__ */ new WeakMap();
    _startpoint = /* @__PURE__ */ new WeakMap();
    _endpoint = /* @__PURE__ */ new WeakMap();
    _onFocusIn = /* @__PURE__ */ new WeakMap();
    _onFocusOut = /* @__PURE__ */ new WeakMap();
    _enableUserEvents = /* @__PURE__ */ new WeakSet();
    enableUserEvents_fn = function() {
      if (this.hasAttribute("disabled"))
        return;
      this.addEventListener("input", this);
      this.addEventListener("pointerdown", this);
      this.addEventListener("pointerenter", this);
    };
    _disableUserEvents = /* @__PURE__ */ new WeakSet();
    disableUserEvents_fn = function() {
      var _a2, _b;
      this.removeEventListener("input", this);
      this.removeEventListener("pointerdown", this);
      this.removeEventListener("pointerenter", this);
      (_a2 = GlobalThis.window) == null ? void 0 : _a2.removeEventListener("pointerup", this);
      (_b = GlobalThis.window) == null ? void 0 : _b.removeEventListener("pointermove", this);
    };
    _handlePointerDown = /* @__PURE__ */ new WeakSet();
    handlePointerDown_fn = function(evt) {
      var _a2;
      __privateSet6(this, _isInputTarget, evt.composedPath().includes(this.range));
      (_a2 = GlobalThis.window) == null ? void 0 : _a2.addEventListener("pointerup", this);
    };
    _handlePointerEnter = /* @__PURE__ */ new WeakSet();
    handlePointerEnter_fn = function(evt) {
      var _a2;
      if (evt.pointerType !== "mouse")
        __privateMethod3(this, _handlePointerDown, handlePointerDown_fn).call(this, evt);
      this.addEventListener("pointerleave", this);
      (_a2 = GlobalThis.window) == null ? void 0 : _a2.addEventListener("pointermove", this);
    };
    _handlePointerUp2 = /* @__PURE__ */ new WeakSet();
    handlePointerUp_fn2 = function() {
      var _a2;
      (_a2 = GlobalThis.window) == null ? void 0 : _a2.removeEventListener("pointerup", this);
      this.toggleAttribute("dragging", false);
      this.range.disabled = this.hasAttribute("disabled");
    };
    _handlePointerLeave = /* @__PURE__ */ new WeakSet();
    handlePointerLeave_fn = function() {
      var _a2;
      this.removeEventListener("pointerleave", this);
      (_a2 = GlobalThis.window) == null ? void 0 : _a2.removeEventListener("pointermove", this);
      this.toggleAttribute("dragging", false);
      this.range.disabled = this.hasAttribute("disabled");
    };
    _handlePointerMove2 = /* @__PURE__ */ new WeakSet();
    handlePointerMove_fn2 = function(evt) {
      this.toggleAttribute("dragging", evt.buttons === 1 || evt.pointerType !== "mouse");
      this.updatePointerBar(evt);
      if (this.dragging && (evt.pointerType !== "mouse" || !__privateGet6(this, _isInputTarget))) {
        this.range.disabled = true;
        let pointerRatio = getPointProgressOnLine(
          evt.clientX,
          evt.clientY,
          __privateGet6(this, _startpoint).getBoundingClientRect(),
          __privateGet6(this, _endpoint).getBoundingClientRect()
        );
        pointerRatio = Math.max(0, Math.min(1, pointerRatio));
        this.range.valueAsNumber = pointerRatio;
        this.range.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
      }
    };
    if (!GlobalThis.customElements.get("media-chrome-range")) {
      GlobalThis.customElements.define("media-chrome-range", MediaChromeRange);
    }
    media_chrome_range_default = MediaChromeRange;
  }
});

// node_modules/media-chrome/dist/media-control-bar.js
var __accessCheck7, __privateGet7, __privateAdd7, __privateSet7, _mediaController4, template5, MediaControlBar, media_control_bar_default;
var init_media_control_bar = __esm({
  "node_modules/media-chrome/dist/media-control-bar.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_constants();
    init_server_safe_globals();
    __accessCheck7 = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet7 = (obj, member, getter) => {
      __accessCheck7(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd7 = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    __privateSet7 = (obj, member, value, setter) => {
      __accessCheck7(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    template5 = Document5.createElement("template");
    template5.innerHTML = `
  <style>
    :host {
      ${""}
      box-sizing: border-box;
      display: var(--media-control-display, var(--media-control-bar-display, inline-flex));
      color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
      --media-loading-indicator-icon-height: 44px;
    }

    ::slotted(media-time-range),
    ::slotted(media-volume-range) {
      min-height: 100%;
    }

    ::slotted(media-time-range),
    ::slotted(media-clip-selector) {
      flex-grow: 1;
    }
  </style>

  <slot></slot>
`;
    MediaControlBar = class extends GlobalThis.HTMLElement {
      constructor() {
        super();
        __privateAdd7(this, _mediaController4, void 0);
        if (!this.shadowRoot) {
          this.attachShadow({ mode: "open" });
          this.shadowRoot.appendChild(template5.content.cloneNode(true));
        }
      }
      static get observedAttributes() {
        return [MediaStateReceiverAttributes.MEDIA_CONTROLLER];
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        var _a2, _b, _c, _d, _e;
        if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
          if (oldValue) {
            (_b = (_a2 = __privateGet7(this, _mediaController4)) == null ? void 0 : _a2.unassociateElement) == null ? void 0 : _b.call(_a2, this);
            __privateSet7(this, _mediaController4, null);
          }
          if (newValue && this.isConnected) {
            __privateSet7(this, _mediaController4, (_c = this.getRootNode()) == null ? void 0 : _c.getElementById(newValue));
            (_e = (_d = __privateGet7(this, _mediaController4)) == null ? void 0 : _d.associateElement) == null ? void 0 : _e.call(_d, this);
          }
        }
      }
      connectedCallback() {
        var _a2, _b, _c;
        const mediaControllerId = this.getAttribute(
          MediaStateReceiverAttributes.MEDIA_CONTROLLER
        );
        if (mediaControllerId) {
          __privateSet7(this, _mediaController4, (_a2 = this.getRootNode()) == null ? void 0 : _a2.getElementById(mediaControllerId));
          (_c = (_b = __privateGet7(this, _mediaController4)) == null ? void 0 : _b.associateElement) == null ? void 0 : _c.call(_b, this);
        }
      }
      disconnectedCallback() {
        var _a2, _b;
        (_b = (_a2 = __privateGet7(this, _mediaController4)) == null ? void 0 : _a2.unassociateElement) == null ? void 0 : _b.call(_a2, this);
        __privateSet7(this, _mediaController4, null);
      }
    };
    _mediaController4 = /* @__PURE__ */ new WeakMap();
    if (!GlobalThis.customElements.get("media-control-bar")) {
      GlobalThis.customElements.define("media-control-bar", MediaControlBar);
    }
    media_control_bar_default = MediaControlBar;
  }
});

// node_modules/media-chrome/dist/media-text-display.js
var __accessCheck8, __privateGet8, __privateAdd8, __privateSet8, _mediaController5, template6, MediaTextDisplay;
var init_media_text_display = __esm({
  "node_modules/media-chrome/dist/media-text-display.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_constants();
    init_element_utils();
    init_server_safe_globals();
    __accessCheck8 = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet8 = (obj, member, getter) => {
      __accessCheck8(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd8 = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    __privateSet8 = (obj, member, value, setter) => {
      __accessCheck8(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    template6 = Document5.createElement("template");
    template6.innerHTML = `
  <style>
    :host {
      font: var(--media-font,
        var(--media-font-weight, normal)
        var(--media-font-size, 14px) /
        var(--media-text-content-height, var(--media-control-height, 24px))
        var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
      color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
      background: var(--media-text-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7))));
      padding: var(--media-control-padding, 10px);
      display: inline-flex;
      justify-content: center;
      align-items: center;
      vertical-align: middle;
      box-sizing: border-box;
      text-align: center;
      pointer-events: auto;
    }

    ${""}
    :host(:focus-visible) {
      box-shadow: inset 0 0 0 2px rgb(27 127 204 / .9);
      outline: 0;
    }

    ${""}
    :host(:where(:focus)) {
      box-shadow: none;
      outline: 0;
    }
  </style>
  <slot></slot>
`;
    MediaTextDisplay = class extends GlobalThis.HTMLElement {
      constructor() {
        super();
        __privateAdd8(this, _mediaController5, void 0);
        if (!this.shadowRoot) {
          this.attachShadow({ mode: "open" });
          this.shadowRoot.appendChild(template6.content.cloneNode(true));
        }
        const { style } = getOrInsertCSSRule(this.shadowRoot, ":host");
        style.setProperty("display", `var(--media-control-display, var(--${this.localName}-display, inline-flex))`);
      }
      static get observedAttributes() {
        return [MediaStateReceiverAttributes.MEDIA_CONTROLLER];
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        var _a2, _b, _c, _d, _e;
        if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
          if (oldValue) {
            (_b = (_a2 = __privateGet8(this, _mediaController5)) == null ? void 0 : _a2.unassociateElement) == null ? void 0 : _b.call(_a2, this);
            __privateSet8(this, _mediaController5, null);
          }
          if (newValue && this.isConnected) {
            __privateSet8(this, _mediaController5, (_c = this.getRootNode()) == null ? void 0 : _c.getElementById(newValue));
            (_e = (_d = __privateGet8(this, _mediaController5)) == null ? void 0 : _d.associateElement) == null ? void 0 : _e.call(_d, this);
          }
        }
      }
      connectedCallback() {
        var _a2, _b, _c;
        const mediaControllerId = this.getAttribute(
          MediaStateReceiverAttributes.MEDIA_CONTROLLER
        );
        if (mediaControllerId) {
          __privateSet8(this, _mediaController5, (_a2 = this.getRootNode()) == null ? void 0 : _a2.getElementById(mediaControllerId));
          (_c = (_b = __privateGet8(this, _mediaController5)) == null ? void 0 : _b.associateElement) == null ? void 0 : _c.call(_b, this);
        }
      }
      disconnectedCallback() {
        var _a2, _b;
        (_b = (_a2 = __privateGet8(this, _mediaController5)) == null ? void 0 : _a2.unassociateElement) == null ? void 0 : _b.call(_a2, this);
        __privateSet8(this, _mediaController5, null);
      }
    };
    _mediaController5 = /* @__PURE__ */ new WeakMap();
    if (!GlobalThis.customElements.get("media-text-display")) {
      GlobalThis.customElements.define("media-text-display", MediaTextDisplay);
    }
  }
});

// node_modules/media-chrome/dist/media-duration-display.js
var __accessCheck9, __privateGet9, __privateAdd9, __privateSet9, _slot, MediaDurationDisplay, media_duration_display_default;
var init_media_duration_display = __esm({
  "node_modules/media-chrome/dist/media-duration-display.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_media_text_display();
    init_server_safe_globals();
    init_time();
    init_constants();
    init_element_utils();
    __accessCheck9 = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet9 = (obj, member, getter) => {
      __accessCheck9(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd9 = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    __privateSet9 = (obj, member, value, setter) => {
      __accessCheck9(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    MediaDurationDisplay = class extends MediaTextDisplay {
      constructor() {
        super();
        __privateAdd9(this, _slot, void 0);
        __privateSet9(this, _slot, this.shadowRoot.querySelector("slot"));
        __privateGet9(this, _slot).textContent = formatTime(0);
      }
      static get observedAttributes() {
        return [...super.observedAttributes, MediaUIAttributes.MEDIA_DURATION];
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        if (attrName === MediaUIAttributes.MEDIA_DURATION) {
          __privateGet9(this, _slot).textContent = formatTime(newValue);
        }
        super.attributeChangedCallback(attrName, oldValue, newValue);
      }
      get mediaDuration() {
        return getNumericAttr(this, MediaUIAttributes.MEDIA_DURATION);
      }
      set mediaDuration(time) {
        setNumericAttr(this, MediaUIAttributes.MEDIA_DURATION, time);
      }
    };
    _slot = /* @__PURE__ */ new WeakMap();
    if (!GlobalThis.customElements.get("media-duration-display")) {
      GlobalThis.customElements.define("media-duration-display", MediaDurationDisplay);
    }
    media_duration_display_default = MediaDurationDisplay;
  }
});

// node_modules/media-chrome/dist/media-time-display.js
var __accessCheck10, __privateGet10, __privateAdd10, __privateSet10, _slot2, Attributes3, CombinedAttributes, ButtonPressedKeys2, DEFAULT_TIMES_SEP, formatTimesLabel, DEFAULT_MISSING_TIME_PHRASE, updateAriaValueText, MediaTimeDisplay, media_time_display_default;
var init_media_time_display = __esm({
  "node_modules/media-chrome/dist/media-time-display.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_media_text_display();
    init_element_utils();
    init_server_safe_globals();
    init_time();
    init_constants();
    init_labels();
    __accessCheck10 = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet10 = (obj, member, getter) => {
      __accessCheck10(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd10 = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    __privateSet10 = (obj, member, value, setter) => {
      __accessCheck10(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    Attributes3 = {
      REMAINING: "remaining",
      SHOW_DURATION: "showduration",
      NO_TOGGLE: "notoggle"
    };
    CombinedAttributes = [
      ...Object.values(Attributes3),
      MediaUIAttributes.MEDIA_CURRENT_TIME,
      MediaUIAttributes.MEDIA_DURATION,
      MediaUIAttributes.MEDIA_SEEKABLE
    ];
    ButtonPressedKeys2 = ["Enter", " "];
    DEFAULT_TIMES_SEP = "&nbsp;/&nbsp;";
    formatTimesLabel = (el, { timesSep = DEFAULT_TIMES_SEP } = {}) => {
      var _a2, _b, _c, _d;
      const showRemaining = el.hasAttribute(Attributes3.REMAINING);
      const showDuration = el.hasAttribute(Attributes3.SHOW_DURATION);
      const currentTime = (_a2 = el.mediaCurrentTime) != null ? _a2 : 0;
      const [, seekableEnd] = (_b = el.mediaSeekable) != null ? _b : [];
      const endTime = (_d = (_c = el.mediaDuration) != null ? _c : seekableEnd) != null ? _d : 0;
      const timeLabel = showRemaining ? formatTime(0 - (endTime - currentTime)) : formatTime(currentTime);
      if (!showDuration)
        return timeLabel;
      return `${timeLabel}${timesSep}${formatTime(endTime)}`;
    };
    DEFAULT_MISSING_TIME_PHRASE = "video not loaded, unknown time.";
    updateAriaValueText = (el) => {
      var _a2;
      const currentTime = el.mediaCurrentTime;
      const [, seekableEnd] = (_a2 = el.mediaSeekable) != null ? _a2 : [];
      const endTime = el.mediaDuration || seekableEnd;
      if (currentTime == null || endTime == null) {
        el.setAttribute("aria-valuetext", DEFAULT_MISSING_TIME_PHRASE);
        return;
      }
      const showRemaining = el.hasAttribute(Attributes3.REMAINING);
      const showDuration = el.hasAttribute(Attributes3.SHOW_DURATION);
      const currentTimePhrase = showRemaining ? formatAsTimePhrase(0 - (endTime - currentTime)) : formatAsTimePhrase(currentTime);
      if (!showDuration) {
        el.setAttribute("aria-valuetext", currentTimePhrase);
        return;
      }
      const totalTimePhrase = formatAsTimePhrase(endTime);
      const fullPhrase = `${currentTimePhrase} of ${totalTimePhrase}`;
      el.setAttribute("aria-valuetext", fullPhrase);
    };
    MediaTimeDisplay = class extends MediaTextDisplay {
      constructor() {
        super();
        __privateAdd10(this, _slot2, void 0);
        __privateSet10(this, _slot2, this.shadowRoot.querySelector("slot"));
        __privateGet10(this, _slot2).innerHTML = `${formatTimesLabel(this)}`;
        const { style } = getOrInsertCSSRule(
          this.shadowRoot,
          ":host(:hover:not([notoggle]))"
        );
        style.setProperty("cursor", "pointer");
        style.setProperty(
          "background",
          "var(--media-control-hover-background, rgba(50 50 70 / .7))"
        );
      }
      static get observedAttributes() {
        return [...super.observedAttributes, ...CombinedAttributes, "disabled"];
      }
      connectedCallback() {
        if (!this.hasAttribute("disabled")) {
          this.enable();
        }
        this.setAttribute("role", "progressbar");
        this.setAttribute("aria-label", nouns.PLAYBACK_TIME());
        const keyUpHandler = (evt) => {
          const { key: key2 } = evt;
          if (!ButtonPressedKeys2.includes(key2)) {
            this.removeEventListener("keyup", keyUpHandler);
            return;
          }
          this.toggleTimeDisplay();
        };
        this.addEventListener("keydown", (evt) => {
          const { metaKey, altKey, key: key2 } = evt;
          if (metaKey || altKey || !ButtonPressedKeys2.includes(key2)) {
            this.removeEventListener("keyup", keyUpHandler);
            return;
          }
          this.addEventListener("keyup", keyUpHandler);
        });
        this.addEventListener("click", this.toggleTimeDisplay);
        super.connectedCallback();
      }
      toggleTimeDisplay() {
        if (this.noToggle) {
          return;
        }
        if (this.hasAttribute("remaining")) {
          this.removeAttribute("remaining");
        } else {
          this.setAttribute("remaining", "");
        }
      }
      disconnectedCallback() {
        this.disable();
        super.disconnectedCallback();
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        if (CombinedAttributes.includes(attrName)) {
          this.update();
        } else if (attrName === "disabled" && newValue !== oldValue) {
          if (newValue == null) {
            this.enable();
          } else {
            this.disable();
          }
        }
        super.attributeChangedCallback(attrName, oldValue, newValue);
      }
      enable() {
        this.tabIndex = 0;
      }
      disable() {
        this.tabIndex = -1;
      }
      get remaining() {
        return getBooleanAttr(this, Attributes3.REMAINING);
      }
      set remaining(show) {
        setBooleanAttr(this, Attributes3.REMAINING, show);
      }
      get showDuration() {
        return getBooleanAttr(this, Attributes3.SHOW_DURATION);
      }
      set showDuration(show) {
        setBooleanAttr(this, Attributes3.SHOW_DURATION, show);
      }
      get noToggle() {
        return getBooleanAttr(this, Attributes3.NO_TOGGLE);
      }
      set noToggle(notoggle) {
        setBooleanAttr(this, Attributes3.NO_TOGGLE, notoggle);
      }
      get mediaDuration() {
        return getNumericAttr(this, MediaUIAttributes.MEDIA_DURATION);
      }
      set mediaDuration(time) {
        setNumericAttr(this, MediaUIAttributes.MEDIA_DURATION, time);
      }
      get mediaCurrentTime() {
        return getNumericAttr(this, MediaUIAttributes.MEDIA_CURRENT_TIME);
      }
      set mediaCurrentTime(time) {
        setNumericAttr(this, MediaUIAttributes.MEDIA_CURRENT_TIME, time);
      }
      get mediaSeekable() {
        const seekable = this.getAttribute(MediaUIAttributes.MEDIA_SEEKABLE);
        if (!seekable)
          return void 0;
        return seekable.split(":").map((time) => +time);
      }
      set mediaSeekable(range) {
        if (range == null) {
          this.removeAttribute(MediaUIAttributes.MEDIA_SEEKABLE);
          return;
        }
        this.setAttribute(MediaUIAttributes.MEDIA_SEEKABLE, range.join(":"));
      }
      update() {
        const timesLabel = formatTimesLabel(this);
        updateAriaValueText(this);
        if (timesLabel !== __privateGet10(this, _slot2).innerHTML) {
          __privateGet10(this, _slot2).innerHTML = timesLabel;
        }
      }
    };
    _slot2 = /* @__PURE__ */ new WeakMap();
    if (!GlobalThis.customElements.get("media-time-display")) {
      GlobalThis.customElements.define("media-time-display", MediaTimeDisplay);
    }
    media_time_display_default = MediaTimeDisplay;
  }
});

// node_modules/media-chrome/dist/media-captions-button.js
var ccIconOn, ccIconOff, slotTemplate3, updateAriaChecked, MediaCaptionsButton, getSubtitlesListAttr, setSubtitlesListAttr, media_captions_button_default;
var init_media_captions_button = __esm({
  "node_modules/media-chrome/dist/media-captions-button.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_media_chrome_button();
    init_server_safe_globals();
    init_constants();
    init_labels();
    init_captions();
    ccIconOn = `<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`;
    ccIconOff = `<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`;
    slotTemplate3 = Document5.createElement("template");
    slotTemplate3.innerHTML = `
  <style>
    :host([aria-checked="true"]) slot[name=off] {
      display: none !important;
    }

    ${""}
    :host(:not([aria-checked="true"])) slot[name=on] {
      display: none !important;
    }
  </style>

  <slot name="icon">
    <slot name="on">${ccIconOn}</slot>
    <slot name="off">${ccIconOff}</slot>
  </slot>
`;
    updateAriaChecked = (el) => {
      el.setAttribute("aria-checked", areSubsOn(el));
    };
    MediaCaptionsButton = class extends MediaChromeButton {
      static get observedAttributes() {
        return [
          ...super.observedAttributes,
          MediaUIAttributes.MEDIA_SUBTITLES_LIST,
          MediaUIAttributes.MEDIA_SUBTITLES_SHOWING
        ];
      }
      constructor(options = {}) {
        super({ slotTemplate: slotTemplate3, ...options });
        this._captionsReady = false;
      }
      connectedCallback() {
        super.connectedCallback();
        this.setAttribute("role", "switch");
        this.setAttribute("aria-label", nouns.CLOSED_CAPTIONS());
        updateAriaChecked(this);
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        if (attrName === MediaUIAttributes.MEDIA_SUBTITLES_SHOWING) {
          updateAriaChecked(this);
        }
        super.attributeChangedCallback(attrName, oldValue, newValue);
      }
      get mediaSubtitlesList() {
        return getSubtitlesListAttr(this, MediaUIAttributes.MEDIA_SUBTITLES_LIST);
      }
      set mediaSubtitlesList(list) {
        setSubtitlesListAttr(this, MediaUIAttributes.MEDIA_SUBTITLES_LIST, list);
      }
      get mediaSubtitlesShowing() {
        return getSubtitlesListAttr(
          this,
          MediaUIAttributes.MEDIA_SUBTITLES_SHOWING
        );
      }
      set mediaSubtitlesShowing(list) {
        setSubtitlesListAttr(this, MediaUIAttributes.MEDIA_SUBTITLES_SHOWING, list);
      }
      handleClick() {
        toggleSubsCaps(this);
      }
    };
    getSubtitlesListAttr = (el, attrName) => {
      const attrVal = el.getAttribute(attrName);
      return attrVal ? parseTextTracksStr(attrVal) : [];
    };
    setSubtitlesListAttr = (el, attrName, list) => {
      if (!(list == null ? void 0 : list.length)) {
        el.removeAttribute(attrName);
        return;
      }
      const newValStr = stringifyTextTrackList(list);
      const oldVal = el.getAttribute(attrName);
      if (oldVal === newValStr)
        return;
      el.setAttribute(attrName, newValStr);
    };
    if (!GlobalThis.customElements.get("media-captions-button")) {
      GlobalThis.customElements.define("media-captions-button", MediaCaptionsButton);
    }
    media_captions_button_default = MediaCaptionsButton;
  }
});

// node_modules/media-chrome/dist/media-seek-forward-button.js
var Attributes4, DEFAULT_SEEK_OFFSET2, forwardIcon, slotTemplate4, DEFAULT_TIME2, MediaSeekForwardButton, media_seek_forward_button_default;
var init_media_seek_forward_button = __esm({
  "node_modules/media-chrome/dist/media-seek-forward-button.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_media_chrome_button();
    init_server_safe_globals();
    init_constants();
    init_element_utils();
    init_labels();
    init_element_utils();
    Attributes4 = {
      SEEK_OFFSET: "seekoffset"
    };
    DEFAULT_SEEK_OFFSET2 = 30;
    forwardIcon = `<svg aria-hidden="true" viewBox="0 0 20 24"><defs><style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style></defs><text class="text value" transform="translate(8.9 19.87)">${DEFAULT_SEEK_OFFSET2}</text><path d="M10 6V3l5.61 4L10 10.94V8a5.54 5.54 0 0 0-1.9 10.48v2.12A7.5 7.5 0 0 1 10 6Z"/></svg>`;
    slotTemplate4 = Document5.createElement("template");
    slotTemplate4.innerHTML = `
  <slot name="icon">${forwardIcon}</slot>
`;
    DEFAULT_TIME2 = 0;
    MediaSeekForwardButton = class extends MediaChromeButton {
      static get observedAttributes() {
        return [
          ...super.observedAttributes,
          MediaUIAttributes.MEDIA_CURRENT_TIME,
          Attributes4.SEEK_OFFSET
        ];
      }
      constructor(options = {}) {
        super({ slotTemplate: slotTemplate4, ...options });
      }
      connectedCallback() {
        this.seekOffset = getNumericAttr(this, Attributes4.SEEK_OFFSET, DEFAULT_SEEK_OFFSET2);
        super.connectedCallback();
      }
      attributeChangedCallback(attrName, _oldValue, newValue) {
        if (attrName === Attributes4.SEEK_OFFSET) {
          this.seekOffset = getNumericAttr(this, Attributes4.SEEK_OFFSET, DEFAULT_SEEK_OFFSET2);
        }
        super.attributeChangedCallback(attrName, _oldValue, newValue);
      }
      get seekOffset() {
        return getNumericAttr(this, Attributes4.SEEK_OFFSET, DEFAULT_SEEK_OFFSET2);
      }
      set seekOffset(value) {
        setNumericAttr(this, Attributes4.SEEK_OFFSET, value);
        this.setAttribute("aria-label", verbs.SEEK_FORWARD_N_SECS({ seekOffset: this.seekOffset }));
        updateIconText(getSlotted(this, "icon"), this.seekOffset);
      }
      get mediaCurrentTime() {
        return getNumericAttr(this, MediaUIAttributes.MEDIA_CURRENT_TIME, DEFAULT_TIME2);
      }
      set mediaCurrentTime(time) {
        setNumericAttr(this, MediaUIAttributes.MEDIA_CURRENT_TIME, time);
      }
      handleClick() {
        const detail = this.mediaCurrentTime + this.seekOffset;
        const evt = new GlobalThis.CustomEvent(MediaUIEvents.MEDIA_SEEK_REQUEST, {
          composed: true,
          bubbles: true,
          detail
        });
        this.dispatchEvent(evt);
      }
    };
    if (!GlobalThis.customElements.get("media-seek-forward-button")) {
      GlobalThis.customElements.define(
        "media-seek-forward-button",
        MediaSeekForwardButton
      );
    }
    media_seek_forward_button_default = MediaSeekForwardButton;
  }
});

// node_modules/media-chrome/dist/media-fullscreen-button.js
var enterFullscreenIcon, exitFullscreenIcon, slotTemplate5, updateAriaLabel2, MediaFullscreenButton, media_fullscreen_button_default;
var init_media_fullscreen_button = __esm({
  "node_modules/media-chrome/dist/media-fullscreen-button.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_media_chrome_button();
    init_server_safe_globals();
    init_constants();
    init_labels();
    init_element_utils();
    enterFullscreenIcon = `<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M16 3v2.5h3.5V9H22V3h-6ZM4 9h2.5V5.5H10V3H4v6Zm15.5 9.5H16V21h6v-6h-2.5v3.5ZM6.5 15H4v6h6v-2.5H6.5V15Z"/>
</svg>`;
    exitFullscreenIcon = `<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M18.5 6.5V3H16v6h6V6.5h-3.5ZM16 21h2.5v-3.5H22V15h-6v6ZM4 17.5h3.5V21H10v-6H4v2.5Zm3.5-11H4V9h6V3H7.5v3.5Z"/>
</svg>`;
    slotTemplate5 = Document5.createElement("template");
    slotTemplate5.innerHTML = `
  <style>
  :host([${MediaUIAttributes.MEDIA_IS_FULLSCREEN}]) slot:not([name=exit]):not([name=icon]) {
    display: none !important;
  }

  ${""}
  :host(:not([${MediaUIAttributes.MEDIA_IS_FULLSCREEN}])) slot:not([name=enter]):not([name=icon]) {
    display: none !important;
  }
  </style>

  <slot name="icon">
    <slot name="enter">${enterFullscreenIcon}</slot>
    <slot name="exit">${exitFullscreenIcon}</slot>
  </slot>
`;
    updateAriaLabel2 = (el) => {
      const label = el.mediaIsFullscreen ? verbs.EXIT_FULLSCREEN() : verbs.ENTER_FULLSCREEN();
      el.setAttribute("aria-label", label);
    };
    MediaFullscreenButton = class extends MediaChromeButton {
      static get observedAttributes() {
        return [
          ...super.observedAttributes,
          MediaUIAttributes.MEDIA_IS_FULLSCREEN,
          MediaUIAttributes.MEDIA_FULLSCREEN_UNAVAILABLE
        ];
      }
      constructor(options = {}) {
        super({ slotTemplate: slotTemplate5, ...options });
      }
      connectedCallback() {
        updateAriaLabel2(this);
        super.connectedCallback();
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        if (attrName === MediaUIAttributes.MEDIA_IS_FULLSCREEN) {
          updateAriaLabel2(this);
        }
        super.attributeChangedCallback(attrName, oldValue, newValue);
      }
      get mediaFullscreenUnavailable() {
        return getStringAttr(this, MediaUIAttributes.MEDIA_FULLSCREEN_UNAVAILABLE);
      }
      set mediaFullscreenUnavailable(value) {
        setStringAttr(this, MediaUIAttributes.MEDIA_FULLSCREEN_UNAVAILABLE, value);
      }
      get mediaIsFullscreen() {
        return getBooleanAttr(this, MediaUIAttributes.MEDIA_IS_FULLSCREEN);
      }
      set mediaIsFullscreen(value) {
        setBooleanAttr(this, MediaUIAttributes.MEDIA_IS_FULLSCREEN, value);
      }
      handleClick() {
        const eventName = this.mediaIsFullscreen ? MediaUIEvents.MEDIA_EXIT_FULLSCREEN_REQUEST : MediaUIEvents.MEDIA_ENTER_FULLSCREEN_REQUEST;
        this.dispatchEvent(
          new GlobalThis.CustomEvent(eventName, { composed: true, bubbles: true })
        );
      }
    };
    if (!GlobalThis.customElements.get("media-fullscreen-button")) {
      GlobalThis.customElements.define(
        "media-fullscreen-button",
        MediaFullscreenButton
      );
    }
    media_fullscreen_button_default = MediaFullscreenButton;
  }
});

// node_modules/media-chrome/dist/media-live-button.js
var MEDIA_TIME_IS_LIVE, MEDIA_PAUSED, MEDIA_SEEK_TO_LIVE_REQUEST, MEDIA_PLAY_REQUEST, indicatorSVG, slotTemplate6, updateAriaAttributes, MediaLiveButton, media_live_button_default;
var init_media_live_button = __esm({
  "node_modules/media-chrome/dist/media-live-button.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_media_chrome_button();
    init_server_safe_globals();
    init_constants();
    init_labels();
    init_element_utils();
    ({ MEDIA_TIME_IS_LIVE, MEDIA_PAUSED } = MediaUIAttributes);
    ({ MEDIA_SEEK_TO_LIVE_REQUEST, MEDIA_PLAY_REQUEST } = MediaUIEvents);
    indicatorSVG = '<svg viewBox="0 0 6 12"><circle cx="3" cy="6" r="2"></circle></svg>';
    slotTemplate6 = Document5.createElement("template");
    slotTemplate6.innerHTML = `
  <style>

  slot[name=indicator] > *,
  :host ::slotted([slot=indicator]) {
    ${""}
    min-width: auto;
    fill: var(--media-live-button-icon-color, rgb(140, 140, 140));
    color: var(--media-live-button-icon-color, rgb(140, 140, 140));
  }

  :host([${MEDIA_TIME_IS_LIVE}]:not([${MEDIA_PAUSED}])) slot[name=indicator] > *,
  :host([${MEDIA_TIME_IS_LIVE}]:not([${MEDIA_PAUSED}])) ::slotted([slot=indicator]) {
    fill: var(--media-live-button-indicator-color, rgb(255, 0, 0));
    color: var(--media-live-button-indicator-color, rgb(255, 0, 0));
  }

  :host([${MEDIA_TIME_IS_LIVE}]:not([${MEDIA_PAUSED}])) {
    cursor: not-allowed;
  }

  </style>

  <slot name="indicator">${indicatorSVG}</slot>
  ${""}
  <slot name="spacer">&nbsp;</slot><slot name="text">LIVE</slot>
`;
    updateAriaAttributes = (el) => {
      const isPausedOrNotLive = el.mediaPaused || !el.mediaTimeIsLive;
      const label = isPausedOrNotLive ? verbs.SEEK_LIVE() : verbs.PLAYING_LIVE();
      el.setAttribute("aria-label", label);
      isPausedOrNotLive ? el.removeAttribute("aria-disabled") : el.setAttribute("aria-disabled", "true");
    };
    MediaLiveButton = class extends MediaChromeButton {
      static get observedAttributes() {
        return [...super.observedAttributes, MEDIA_PAUSED, MEDIA_TIME_IS_LIVE];
      }
      constructor(options = {}) {
        super({ slotTemplate: slotTemplate6, ...options });
      }
      connectedCallback() {
        updateAriaAttributes(this);
        super.connectedCallback();
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        updateAriaAttributes(this);
      }
      get mediaPaused() {
        return getBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED);
      }
      set mediaPaused(value) {
        setBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED, value);
      }
      get mediaTimeIsLive() {
        return getBooleanAttr(this, MediaUIAttributes.MEDIA_TIME_IS_LIVE);
      }
      set mediaTimeIsLive(value) {
        setBooleanAttr(this, MediaUIAttributes.MEDIA_TIME_IS_LIVE, value);
      }
      handleClick() {
        if (!this.mediaPaused && this.mediaTimeIsLive)
          return;
        this.dispatchEvent(
          new GlobalThis.CustomEvent(MEDIA_SEEK_TO_LIVE_REQUEST, {
            composed: true,
            bubbles: true
          })
        );
        if (this.hasAttribute(MEDIA_PAUSED)) {
          this.dispatchEvent(
            new GlobalThis.CustomEvent(MEDIA_PLAY_REQUEST, {
              composed: true,
              bubbles: true
            })
          );
        }
      }
    };
    if (!GlobalThis.customElements.get("media-live-button")) {
      GlobalThis.customElements.define("media-live-button", MediaLiveButton);
    }
    media_live_button_default = MediaLiveButton;
  }
});

// node_modules/media-chrome/dist/media-mute-button.js
var MEDIA_VOLUME_LEVEL, offIcon, lowIcon, highIcon, slotTemplate7, updateAriaLabel3, MediaMuteButton, media_mute_button_default;
var init_media_mute_button = __esm({
  "node_modules/media-chrome/dist/media-mute-button.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_media_chrome_button();
    init_server_safe_globals();
    init_constants();
    init_labels();
    init_element_utils();
    ({ MEDIA_VOLUME_LEVEL } = MediaUIAttributes);
    offIcon = `<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.18l2.45 2.45a4.22 4.22 0 0 0 .05-.63Zm2.5 0a6.84 6.84 0 0 1-.54 2.64L20 16.15A8.8 8.8 0 0 0 21 12a9 9 0 0 0-7-8.77v2.06A7 7 0 0 1 19 12ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25A6.92 6.92 0 0 1 14 18.7v2.06A9 9 0 0 0 17.69 19l2 2.05L21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"/>
</svg>`;
    lowIcon = `<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4Z"/>
</svg>`;
    highIcon = `<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4ZM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54Z"/>
</svg>`;
    slotTemplate7 = Document5.createElement("template");
    slotTemplate7.innerHTML = `
  <style>
  ${""}
  :host(:not([${MEDIA_VOLUME_LEVEL}])) slot:not([name=high]):not([name=icon]), 
  :host([${MEDIA_VOLUME_LEVEL}=high]) slot:not([name=high]):not([name=icon]) {
    display: none !important;
  }

  :host([${MEDIA_VOLUME_LEVEL}=off]) slot:not([name=off]):not([name=icon]) {
    display: none !important;
  }

  :host([${MEDIA_VOLUME_LEVEL}=low]) slot:not([name=low]):not([name=icon]) {
    display: none !important;
  }

  :host([${MEDIA_VOLUME_LEVEL}=medium]) slot:not([name=medium]):not([name=icon]) {
    display: none !important;
  }
  </style>

  <slot name="icon">
    <slot name="off">${offIcon}</slot>
    <slot name="low">${lowIcon}</slot>
    <slot name="medium">${lowIcon}</slot>
    <slot name="high">${highIcon}</slot>
  </slot>
`;
    updateAriaLabel3 = (el) => {
      const muted = el.mediaVolumeLevel === "off";
      const label = muted ? verbs.UNMUTE() : verbs.MUTE();
      el.setAttribute("aria-label", label);
    };
    MediaMuteButton = class extends MediaChromeButton {
      static get observedAttributes() {
        return [...super.observedAttributes, MediaUIAttributes.MEDIA_VOLUME_LEVEL];
      }
      constructor(options = {}) {
        super({ slotTemplate: slotTemplate7, ...options });
      }
      connectedCallback() {
        updateAriaLabel3(this);
        super.connectedCallback();
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        if (attrName === MediaUIAttributes.MEDIA_VOLUME_LEVEL) {
          updateAriaLabel3(this);
        }
        super.attributeChangedCallback(attrName, oldValue, newValue);
      }
      get mediaVolumeLevel() {
        return getStringAttr(this, MediaUIAttributes.MEDIA_VOLUME_LEVEL);
      }
      set mediaVolumeLevel(value) {
        setStringAttr(this, MediaUIAttributes.MEDIA_VOLUME_LEVEL, value);
      }
      handleClick() {
        const eventName = this.mediaVolumeLevel === "off" ? MediaUIEvents.MEDIA_UNMUTE_REQUEST : MediaUIEvents.MEDIA_MUTE_REQUEST;
        this.dispatchEvent(
          new GlobalThis.CustomEvent(eventName, { composed: true, bubbles: true })
        );
      }
    };
    if (!GlobalThis.customElements.get("media-mute-button")) {
      GlobalThis.customElements.define("media-mute-button", MediaMuteButton);
    }
    media_mute_button_default = MediaMuteButton;
  }
});

// node_modules/media-chrome/dist/media-pip-button.js
var pipIcon, slotTemplate8, updateAriaLabel4, MediaPipButton, media_pip_button_default;
var init_media_pip_button = __esm({
  "node_modules/media-chrome/dist/media-pip-button.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_media_chrome_button();
    init_server_safe_globals();
    init_constants();
    init_labels();
    init_element_utils();
    pipIcon = `<svg aria-hidden="true" viewBox="0 0 28 24">
  <path d="M24 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Zm-1 16H5V5h18v14Zm-3-8h-7v5h7v-5Z"/>
</svg>`;
    slotTemplate8 = Document5.createElement("template");
    slotTemplate8.innerHTML = `
  <style>
  :host([${MediaUIAttributes.MEDIA_IS_PIP}]) slot:not([name=exit]):not([name=icon]) {
    display: none !important;
  }

  ${""}
  :host(:not([${MediaUIAttributes.MEDIA_IS_PIP}])) slot:not([name=enter]):not([name=icon]) {
    display: none !important;
  }
  </style>

  <slot name="icon">
    <slot name="enter">${pipIcon}</slot>
    <slot name="exit">${pipIcon}</slot>
  </slot>
`;
    updateAriaLabel4 = (el) => {
      const label = el.mediaIsPip ? verbs.EXIT_PIP() : verbs.ENTER_PIP();
      el.setAttribute("aria-label", label);
    };
    MediaPipButton = class extends MediaChromeButton {
      static get observedAttributes() {
        return [
          ...super.observedAttributes,
          MediaUIAttributes.MEDIA_IS_PIP,
          MediaUIAttributes.MEDIA_PIP_UNAVAILABLE
        ];
      }
      constructor(options = {}) {
        super({ slotTemplate: slotTemplate8, ...options });
      }
      connectedCallback() {
        updateAriaLabel4(this);
        super.connectedCallback();
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        if (attrName === MediaUIAttributes.MEDIA_IS_PIP) {
          updateAriaLabel4(this);
        }
        super.attributeChangedCallback(attrName, oldValue, newValue);
      }
      get mediaPipUnavailable() {
        return getStringAttr(this, MediaUIAttributes.MEDIA_PIP_UNAVAILABLE);
      }
      set mediaPipUnavailable(value) {
        setStringAttr(this, MediaUIAttributes.MEDIA_PIP_UNAVAILABLE, value);
      }
      get mediaIsPip() {
        return getBooleanAttr(this, MediaUIAttributes.MEDIA_IS_PIP);
      }
      set mediaIsPip(value) {
        setBooleanAttr(this, MediaUIAttributes.MEDIA_IS_PIP, value);
      }
      handleClick() {
        const eventName = this.mediaIsPip ? MediaUIEvents.MEDIA_EXIT_PIP_REQUEST : MediaUIEvents.MEDIA_ENTER_PIP_REQUEST;
        this.dispatchEvent(
          new GlobalThis.CustomEvent(eventName, { composed: true, bubbles: true })
        );
      }
    };
    if (!GlobalThis.customElements.get("media-pip-button")) {
      GlobalThis.customElements.define("media-pip-button", MediaPipButton);
    }
    media_pip_button_default = MediaPipButton;
  }
});

// node_modules/media-chrome/dist/media-play-button.js
var playIcon, pauseIcon, slotTemplate9, updateAriaLabel5, MediaPlayButton, media_play_button_default;
var init_media_play_button = __esm({
  "node_modules/media-chrome/dist/media-play-button.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_media_chrome_button();
    init_server_safe_globals();
    init_constants();
    init_labels();
    init_element_utils();
    playIcon = `<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="m6 21 15-9L6 3v18Z"/>
</svg>`;
    pauseIcon = `<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M6 20h4V4H6v16Zm8-16v16h4V4h-4Z"/>
</svg>`;
    slotTemplate9 = Document5.createElement("template");
    slotTemplate9.innerHTML = `
  <style>
  :host([${MediaUIAttributes.MEDIA_PAUSED}]) slot[name=pause] {
    display: none !important;
  }

  :host(:not([${MediaUIAttributes.MEDIA_PAUSED}])) slot[name=play] {
    display: none !important;
  }
  </style>

  <slot name="icon">
    <slot name="play">${playIcon}</slot>
    <slot name="pause">${pauseIcon}</slot>
  </slot>
`;
    updateAriaLabel5 = (el) => {
      const label = el.mediaPaused ? verbs.PLAY() : verbs.PAUSE();
      el.setAttribute("aria-label", label);
    };
    MediaPlayButton = class extends MediaChromeButton {
      static get observedAttributes() {
        return [
          ...super.observedAttributes,
          MediaUIAttributes.MEDIA_PAUSED,
          MediaUIAttributes.MEDIA_ENDED
        ];
      }
      constructor(options = {}) {
        super({ slotTemplate: slotTemplate9, ...options });
      }
      connectedCallback() {
        updateAriaLabel5(this);
        super.connectedCallback();
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        if (attrName === MediaUIAttributes.MEDIA_PAUSED) {
          updateAriaLabel5(this);
        }
        super.attributeChangedCallback(attrName, oldValue, newValue);
      }
      get mediaPaused() {
        return getBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED);
      }
      set mediaPaused(value) {
        setBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED, value);
      }
      handleClick() {
        const eventName = this.mediaPaused ? MediaUIEvents.MEDIA_PLAY_REQUEST : MediaUIEvents.MEDIA_PAUSE_REQUEST;
        this.dispatchEvent(
          new GlobalThis.CustomEvent(eventName, { composed: true, bubbles: true })
        );
      }
    };
    if (!GlobalThis.customElements.get("media-play-button")) {
      GlobalThis.customElements.define("media-play-button", MediaPlayButton);
    }
    media_play_button_default = MediaPlayButton;
  }
});

// node_modules/media-chrome/dist/media-playback-rate-button.js
var __accessCheck11, __privateGet11, __privateAdd11, _rates, Attributes5, DEFAULT_RATES, DEFAULT_RATE, slotTemplate10, MediaPlaybackRateButton, media_playback_rate_button_default;
var init_media_playback_rate_button = __esm({
  "node_modules/media-chrome/dist/media-playback-rate-button.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_media_chrome_button();
    init_server_safe_globals();
    init_constants();
    init_labels();
    init_element_utils();
    init_attribute_token_list();
    __accessCheck11 = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet11 = (obj, member, getter) => {
      __accessCheck11(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd11 = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    Attributes5 = {
      RATES: "rates"
    };
    DEFAULT_RATES = [1, 1.2, 1.5, 1.7, 2];
    DEFAULT_RATE = 1;
    slotTemplate10 = Document5.createElement("template");
    slotTemplate10.innerHTML = `
  <style>
    :host {
      min-width: 5ch;
      padding: var(--media-control-padding, 10px 5px);
    }
  </style>
  <span id="container"></span>
`;
    MediaPlaybackRateButton = class extends MediaChromeButton {
      constructor(options = {}) {
        super({ slotTemplate: slotTemplate10, ...options });
        __privateAdd11(this, _rates, new AttributeTokenList(this, Attributes5.RATES, { defaultValue: DEFAULT_RATES }));
        this.container = this.shadowRoot.querySelector("#container");
        this.container.innerHTML = `${DEFAULT_RATE}x`;
      }
      static get observedAttributes() {
        return [
          ...super.observedAttributes,
          MediaUIAttributes.MEDIA_PLAYBACK_RATE,
          Attributes5.RATES
        ];
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (attrName === Attributes5.RATES) {
          __privateGet11(this, _rates).value = newValue;
        }
        if (attrName === MediaUIAttributes.MEDIA_PLAYBACK_RATE) {
          const newPlaybackRate = newValue ? +newValue : Number.NaN;
          const playbackRate = !Number.isNaN(newPlaybackRate) ? newPlaybackRate : DEFAULT_RATE;
          this.container.innerHTML = `${playbackRate}x`;
          this.setAttribute("aria-label", nouns.PLAYBACK_RATE({ playbackRate }));
        }
      }
      get rates() {
        return __privateGet11(this, _rates);
      }
      set rates(value) {
        if (!value) {
          __privateGet11(this, _rates).value = "";
        } else if (Array.isArray(value)) {
          __privateGet11(this, _rates).value = value.join(" ");
        }
      }
      get mediaPlaybackRate() {
        return getNumericAttr(this, MediaUIAttributes.MEDIA_PLAYBACK_RATE, DEFAULT_RATE);
      }
      set mediaPlaybackRate(value) {
        setNumericAttr(this, MediaUIAttributes.MEDIA_PLAYBACK_RATE, value);
      }
      handleClick() {
        var _a2, _b;
        const availableRates = Array.from(this.rates.values(), (str) => +str).sort((a, b) => a - b);
        const detail = (_b = (_a2 = availableRates.find((r) => r > this.mediaPlaybackRate)) != null ? _a2 : availableRates[0]) != null ? _b : DEFAULT_RATE;
        const evt = new GlobalThis.CustomEvent(
          MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST,
          { composed: true, bubbles: true, detail }
        );
        this.dispatchEvent(evt);
      }
    };
    _rates = /* @__PURE__ */ new WeakMap();
    if (!GlobalThis.customElements.get("media-playback-rate-button")) {
      GlobalThis.customElements.define(
        "media-playback-rate-button",
        MediaPlaybackRateButton
      );
    }
    media_playback_rate_button_default = MediaPlaybackRateButton;
  }
});

// node_modules/media-chrome/dist/media-poster-image.js
var Attributes6, template7, unsetBackgroundImage, setBackgroundImage, MediaPosterImage, media_poster_image_default;
var init_media_poster_image = __esm({
  "node_modules/media-chrome/dist/media-poster-image.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_server_safe_globals();
    init_element_utils();
    Attributes6 = {
      PLACEHOLDER_SRC: "placeholdersrc",
      SRC: "src"
    };
    template7 = Document5.createElement("template");
    template7.innerHTML = `
  <style>
    :host {
      pointer-events: none;
      display: var(--media-poster-image-display, inline-block);
      box-sizing: border-box;
    }

    img {
      max-width: 100%;
      max-height: 100%;
      min-width: 100%;
      min-height: 100%;
      background-repeat: no-repeat;
      background-position: var(--media-poster-image-background-position, var(--media-object-position, center));
      background-size: var(--media-poster-image-background-size, var(--media-object-fit, contain));
      object-fit: var(--media-object-fit, contain);
      object-position: var(--media-object-position, center);
    }
  </style>

  <img part="poster img" aria-hidden="true" id="image"/>
`;
    unsetBackgroundImage = (el) => {
      el.style.removeProperty("background-image");
    };
    setBackgroundImage = (el, image) => {
      el.style["background-image"] = `url('${image}')`;
    };
    MediaPosterImage = class extends GlobalThis.HTMLElement {
      static get observedAttributes() {
        return [Attributes6.PLACEHOLDER_SRC, Attributes6.SRC];
      }
      constructor() {
        super();
        if (!this.shadowRoot) {
          this.attachShadow({ mode: "open" });
          this.shadowRoot.appendChild(template7.content.cloneNode(true));
        }
        this.image = this.shadowRoot.querySelector("#image");
      }
      attributeChangedCallback(attrName, _oldValue, newValue) {
        if (attrName === Attributes6.SRC) {
          if (newValue == null) {
            this.image.removeAttribute(Attributes6.SRC);
          } else {
            this.image.setAttribute(Attributes6.SRC, newValue);
          }
        }
        if (attrName === Attributes6.PLACEHOLDER_SRC) {
          if (newValue == null) {
            unsetBackgroundImage(this.image);
          } else {
            setBackgroundImage(this.image, newValue);
          }
        }
      }
      get placeholderSrc() {
        return getStringAttr(this, Attributes6.PLACEHOLDER_SRC);
      }
      set placeholderSrc(value) {
        setStringAttr(this, Attributes6.SRC, value);
      }
      get src() {
        return getStringAttr(this, Attributes6.SRC);
      }
      set src(value) {
        setStringAttr(this, Attributes6.SRC, value);
      }
    };
    if (!GlobalThis.customElements.get("media-poster-image")) {
      GlobalThis.customElements.define("media-poster-image", MediaPosterImage);
    }
    media_poster_image_default = MediaPosterImage;
  }
});

// node_modules/media-chrome/dist/media-seek-backward-button.js
var Attributes7, DEFAULT_SEEK_OFFSET3, backwardIcon, slotTemplate11, DEFAULT_TIME3, MediaSeekBackwardButton, media_seek_backward_button_default;
var init_media_seek_backward_button = __esm({
  "node_modules/media-chrome/dist/media-seek-backward-button.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_media_chrome_button();
    init_server_safe_globals();
    init_constants();
    init_element_utils();
    init_labels();
    init_element_utils();
    Attributes7 = {
      SEEK_OFFSET: "seekoffset"
    };
    DEFAULT_SEEK_OFFSET3 = 30;
    backwardIcon = `<svg aria-hidden="true" viewBox="0 0 20 24"><defs><style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style></defs><text class="text value" transform="translate(2.18 19.87)">${DEFAULT_SEEK_OFFSET3}</text><path d="M10 6V3L4.37 7 10 10.94V8a5.54 5.54 0 0 1 1.9 10.48v2.12A7.5 7.5 0 0 0 10 6Z"/></svg>`;
    slotTemplate11 = Document5.createElement("template");
    slotTemplate11.innerHTML = `
  <slot name="icon">${backwardIcon}</slot>
`;
    DEFAULT_TIME3 = 0;
    MediaSeekBackwardButton = class extends MediaChromeButton {
      static get observedAttributes() {
        return [
          ...super.observedAttributes,
          MediaUIAttributes.MEDIA_CURRENT_TIME,
          Attributes7.SEEK_OFFSET
        ];
      }
      constructor(options = {}) {
        super({ slotTemplate: slotTemplate11, ...options });
      }
      connectedCallback() {
        this.seekOffset = getNumericAttr(this, Attributes7.SEEK_OFFSET, DEFAULT_SEEK_OFFSET3);
        super.connectedCallback();
      }
      attributeChangedCallback(attrName, _oldValue, newValue) {
        if (attrName === Attributes7.SEEK_OFFSET) {
          this.seekOffset = getNumericAttr(this, Attributes7.SEEK_OFFSET, DEFAULT_SEEK_OFFSET3);
        }
        super.attributeChangedCallback(attrName, _oldValue, newValue);
      }
      get seekOffset() {
        return getNumericAttr(this, Attributes7.SEEK_OFFSET, DEFAULT_SEEK_OFFSET3);
      }
      set seekOffset(value) {
        setNumericAttr(this, Attributes7.SEEK_OFFSET, value);
        this.setAttribute("aria-label", verbs.SEEK_BACK_N_SECS({ seekOffset: this.seekOffset }));
        updateIconText(getSlotted(this, "icon"), this.seekOffset);
      }
      get mediaCurrentTime() {
        return getNumericAttr(this, MediaUIAttributes.MEDIA_CURRENT_TIME, DEFAULT_TIME3);
      }
      set mediaCurrentTime(time) {
        setNumericAttr(this, MediaUIAttributes.MEDIA_CURRENT_TIME, time);
      }
      handleClick() {
        const detail = Math.max(this.mediaCurrentTime - this.seekOffset, 0);
        const evt = new GlobalThis.CustomEvent(MediaUIEvents.MEDIA_SEEK_REQUEST, {
          composed: true,
          bubbles: true,
          detail
        });
        this.dispatchEvent(evt);
      }
    };
    if (!GlobalThis.customElements.get("media-seek-backward-button")) {
      GlobalThis.customElements.define(
        "media-seek-backward-button",
        MediaSeekBackwardButton
      );
    }
    media_seek_backward_button_default = MediaSeekBackwardButton;
  }
});

// node_modules/media-chrome/dist/media-preview-time-display.js
var __accessCheck12, __privateGet12, __privateAdd12, __privateSet11, _slot3, MediaPreviewTimeDisplay, media_preview_time_display_default;
var init_media_preview_time_display = __esm({
  "node_modules/media-chrome/dist/media-preview-time-display.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_media_text_display();
    init_server_safe_globals();
    init_time();
    init_constants();
    init_element_utils();
    __accessCheck12 = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet12 = (obj, member, getter) => {
      __accessCheck12(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd12 = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    __privateSet11 = (obj, member, value, setter) => {
      __accessCheck12(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    MediaPreviewTimeDisplay = class extends MediaTextDisplay {
      constructor() {
        super();
        __privateAdd12(this, _slot3, void 0);
        __privateSet11(this, _slot3, this.shadowRoot.querySelector("slot"));
        __privateGet12(this, _slot3).textContent = formatTime(0);
      }
      static get observedAttributes() {
        return [...super.observedAttributes, MediaUIAttributes.MEDIA_PREVIEW_TIME];
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        if (attrName === MediaUIAttributes.MEDIA_PREVIEW_TIME && newValue != null) {
          __privateGet12(this, _slot3).textContent = formatTime(newValue);
        }
        super.attributeChangedCallback(attrName, oldValue, newValue);
      }
      get mediaPreviewTime() {
        return getNumericAttr(this, MediaUIAttributes.MEDIA_PREVIEW_TIME);
      }
      set mediaPreviewTime(value) {
        setNumericAttr(this, MediaUIAttributes.MEDIA_PREVIEW_TIME, value);
      }
    };
    _slot3 = /* @__PURE__ */ new WeakMap();
    if (!GlobalThis.customElements.get("media-preview-time-display")) {
      GlobalThis.customElements.define(
        "media-preview-time-display",
        MediaPreviewTimeDisplay
      );
    }
    media_preview_time_display_default = MediaPreviewTimeDisplay;
  }
});

// node_modules/media-chrome/dist/media-preview-thumbnail.js
var __accessCheck13, __privateGet13, __privateAdd13, __privateSet12, _mediaController6, template8, MediaPreviewThumbnail, media_preview_thumbnail_default;
var init_media_preview_thumbnail = __esm({
  "node_modules/media-chrome/dist/media-preview-thumbnail.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_server_safe_globals();
    init_constants();
    init_element_utils();
    __accessCheck13 = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet13 = (obj, member, getter) => {
      __accessCheck13(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd13 = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    __privateSet12 = (obj, member, value, setter) => {
      __accessCheck13(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    template8 = Document5.createElement("template");
    template8.innerHTML = `
  <style>
    :host {
      box-sizing: border-box;
      display: var(--media-control-display, var(--media-preview-thumbnail-display, inline-block));
      overflow: hidden;
    }

    img {
      display: none;
      position: relative;
    }
  </style>
  <img crossorigin loading="eager" decoding="async">
`;
    MediaPreviewThumbnail = class extends GlobalThis.HTMLElement {
      constructor() {
        super();
        __privateAdd13(this, _mediaController6, void 0);
        if (!this.shadowRoot) {
          this.attachShadow({ mode: "open" });
          this.shadowRoot.appendChild(template8.content.cloneNode(true));
        }
      }
      static get observedAttributes() {
        return [
          MediaStateReceiverAttributes.MEDIA_CONTROLLER,
          MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
          MediaUIAttributes.MEDIA_PREVIEW_COORDS
        ];
      }
      connectedCallback() {
        var _a2, _b, _c;
        const mediaControllerId = this.getAttribute(
          MediaStateReceiverAttributes.MEDIA_CONTROLLER
        );
        if (mediaControllerId) {
          __privateSet12(this, _mediaController6, (_a2 = this.getRootNode()) == null ? void 0 : _a2.getElementById(mediaControllerId));
          (_c = (_b = __privateGet13(this, _mediaController6)) == null ? void 0 : _b.associateElement) == null ? void 0 : _c.call(_b, this);
        }
      }
      disconnectedCallback() {
        var _a2, _b;
        (_b = (_a2 = __privateGet13(this, _mediaController6)) == null ? void 0 : _a2.unassociateElement) == null ? void 0 : _b.call(_a2, this);
        __privateSet12(this, _mediaController6, null);
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        var _a2, _b, _c, _d, _e;
        if ([
          MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
          MediaUIAttributes.MEDIA_PREVIEW_COORDS
        ].includes(attrName)) {
          this.update();
        }
        if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
          if (oldValue) {
            (_b = (_a2 = __privateGet13(this, _mediaController6)) == null ? void 0 : _a2.unassociateElement) == null ? void 0 : _b.call(_a2, this);
            __privateSet12(this, _mediaController6, null);
          }
          if (newValue && this.isConnected) {
            __privateSet12(this, _mediaController6, (_c = this.getRootNode()) == null ? void 0 : _c.getElementById(newValue));
            (_e = (_d = __privateGet13(this, _mediaController6)) == null ? void 0 : _d.associateElement) == null ? void 0 : _e.call(_d, this);
          }
        }
      }
      get mediaPreviewImage() {
        return getStringAttr(this, MediaUIAttributes.MEDIA_PREVIEW_IMAGE);
      }
      set mediaPreviewImage(value) {
        setStringAttr(this, MediaUIAttributes.MEDIA_PREVIEW_IMAGE, value);
      }
      get mediaPreviewCoords() {
        const attrVal = this.getAttribute(MediaUIAttributes.MEDIA_PREVIEW_COORDS);
        if (!attrVal)
          return void 0;
        return attrVal.split(/\s+/).map((coord) => +coord);
      }
      set mediaPreviewCoords(value) {
        if (!value) {
          this.removeAttribute(MediaUIAttributes.MEDIA_PREVIEW_COORDS);
          return;
        }
        this.setAttribute(MediaUIAttributes.MEDIA_PREVIEW_COORDS, value.join(" "));
      }
      update() {
        const coords = this.mediaPreviewCoords;
        const previewImage = this.mediaPreviewImage;
        if (!(coords && previewImage))
          return;
        const [x, y, w, h] = coords;
        const src = previewImage.split("#")[0];
        const computedStyle = getComputedStyle(this);
        const { maxWidth, maxHeight, minWidth, minHeight } = computedStyle;
        const maxRatio = Math.min(parseInt(maxWidth) / w, parseInt(maxHeight) / h);
        const minRatio = Math.max(parseInt(minWidth) / w, parseInt(minHeight) / h);
        const isScalingDown = maxRatio < 1;
        const scale = isScalingDown ? maxRatio : minRatio > 1 ? minRatio : 1;
        const { style } = getOrInsertCSSRule(this.shadowRoot, ":host");
        const imgStyle = getOrInsertCSSRule(this.shadowRoot, "img").style;
        const img = this.shadowRoot.querySelector("img");
        const extremum = isScalingDown ? "min" : "max";
        style.setProperty(`${extremum}-width`, "initial", "important");
        style.setProperty(`${extremum}-height`, "initial", "important");
        style.width = `${w * scale}px`;
        style.height = `${h * scale}px`;
        const resize = () => {
          imgStyle.width = `${this.imgWidth * scale}px`;
          imgStyle.height = `${this.imgHeight * scale}px`;
          imgStyle.display = "block";
        };
        if (img.src !== src) {
          img.onload = () => {
            this.imgWidth = img.naturalWidth;
            this.imgHeight = img.naturalHeight;
            resize();
          };
          img.src = src;
          resize();
        }
        resize();
        imgStyle.transform = `translate(-${x * scale}px, -${y * scale}px)`;
      }
    };
    _mediaController6 = /* @__PURE__ */ new WeakMap();
    if (!GlobalThis.customElements.get("media-preview-thumbnail")) {
      GlobalThis.customElements.define(
        "media-preview-thumbnail",
        MediaPreviewThumbnail
      );
    }
    media_preview_thumbnail_default = MediaPreviewThumbnail;
  }
});

// node_modules/media-chrome/dist/utils/range-animation.js
var __accessCheck14, __privateGet14, __privateAdd14, __privateSet13, __privateWrapper, _range, _startTime, _previousTime, _deltaTime, _frameCount, _updateTimestamp, _updateStartValue, _lastRangeIncrease, _id, _animate, RangeAnimation;
var init_range_animation = __esm({
  "node_modules/media-chrome/dist/utils/range-animation.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    __accessCheck14 = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet14 = (obj, member, getter) => {
      __accessCheck14(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd14 = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    __privateSet13 = (obj, member, value, setter) => {
      __accessCheck14(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    __privateWrapper = (obj, member, setter, getter) => ({
      set _(value) {
        __privateSet13(obj, member, value, setter);
      },
      get _() {
        return __privateGet14(obj, member, getter);
      }
    });
    RangeAnimation = class {
      constructor(range, callback, fps) {
        __privateAdd14(this, _range, void 0);
        __privateAdd14(this, _startTime, void 0);
        __privateAdd14(this, _previousTime, void 0);
        __privateAdd14(this, _deltaTime, void 0);
        __privateAdd14(this, _frameCount, void 0);
        __privateAdd14(this, _updateTimestamp, void 0);
        __privateAdd14(this, _updateStartValue, void 0);
        __privateAdd14(this, _lastRangeIncrease, void 0);
        __privateAdd14(this, _id, 0);
        __privateAdd14(this, _animate, (now = performance.now()) => {
          __privateSet13(this, _id, requestAnimationFrame(__privateGet14(this, _animate)));
          __privateSet13(this, _deltaTime, performance.now() - __privateGet14(this, _previousTime));
          const fpsInterval = 1e3 / this.fps;
          if (__privateGet14(this, _deltaTime) > fpsInterval) {
            __privateSet13(this, _previousTime, now - __privateGet14(this, _deltaTime) % fpsInterval);
            const fps2 = 1e3 / ((now - __privateGet14(this, _startTime)) / ++__privateWrapper(this, _frameCount)._);
            const delta = (now - __privateGet14(this, _updateTimestamp)) / 1e3 / this.duration;
            let value = __privateGet14(this, _updateStartValue) + delta * this.playbackRate;
            const increase = value - __privateGet14(this, _range).valueAsNumber;
            if (increase > 0) {
              __privateSet13(this, _lastRangeIncrease, this.playbackRate / this.duration / fps2);
            } else {
              __privateSet13(this, _lastRangeIncrease, 0.995 * __privateGet14(this, _lastRangeIncrease));
              value = __privateGet14(this, _range).valueAsNumber + __privateGet14(this, _lastRangeIncrease);
            }
            this.callback(value);
          }
        });
        __privateSet13(this, _range, range);
        this.callback = callback;
        this.fps = fps;
      }
      start() {
        if (__privateGet14(this, _id) !== 0)
          return;
        __privateSet13(this, _previousTime, performance.now());
        __privateSet13(this, _startTime, __privateGet14(this, _previousTime));
        __privateSet13(this, _frameCount, 0);
        __privateGet14(this, _animate).call(this);
      }
      stop() {
        if (__privateGet14(this, _id) === 0)
          return;
        cancelAnimationFrame(__privateGet14(this, _id));
        __privateSet13(this, _id, 0);
      }
      update({ start, duration, playbackRate }) {
        const increase = start - __privateGet14(this, _range).valueAsNumber;
        if (increase > 0 || increase < -0.03) {
          this.callback(start);
        }
        __privateSet13(this, _updateStartValue, start);
        __privateSet13(this, _updateTimestamp, performance.now());
        this.duration = duration;
        this.playbackRate = playbackRate;
      }
    };
    _range = /* @__PURE__ */ new WeakMap();
    _startTime = /* @__PURE__ */ new WeakMap();
    _previousTime = /* @__PURE__ */ new WeakMap();
    _deltaTime = /* @__PURE__ */ new WeakMap();
    _frameCount = /* @__PURE__ */ new WeakMap();
    _updateTimestamp = /* @__PURE__ */ new WeakMap();
    _updateStartValue = /* @__PURE__ */ new WeakMap();
    _lastRangeIncrease = /* @__PURE__ */ new WeakMap();
    _id = /* @__PURE__ */ new WeakMap();
    _animate = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/media-chrome/dist/media-time-range.js
var __accessCheck15, __privateGet15, __privateAdd15, __privateSet14, __privateMethod4, _rootNode, _animation, _boxes, _previewBox, _currentBox, _boxPaddingLeft, _boxPaddingRight, _toggleRangeAnimation, toggleRangeAnimation_fn, _shouldRangeAnimate, shouldRangeAnimate_fn, _updateRange, _getBoxPosition, getBoxPosition_fn, _handlePointerMove3, handlePointerMove_fn3, _previewRequest, previewRequest_fn, _seekRequest, seekRequest_fn, DEFAULT_MISSING_TIME_PHRASE2, updateAriaValueText2, template9, calcRangeValueFromTime, calcTimeFromRangeValue, MediaTimeRange, media_time_range_default;
var init_media_time_range = __esm({
  "node_modules/media-chrome/dist/media-time-range.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_media_chrome_range();
    init_server_safe_globals();
    init_constants();
    init_labels();
    init_time();
    init_element_utils();
    init_range_animation();
    init_element_utils();
    __accessCheck15 = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet15 = (obj, member, getter) => {
      __accessCheck15(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd15 = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    __privateSet14 = (obj, member, value, setter) => {
      __accessCheck15(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    __privateMethod4 = (obj, member, method) => {
      __accessCheck15(obj, member, "access private method");
      return method;
    };
    DEFAULT_MISSING_TIME_PHRASE2 = "video not loaded, unknown time.";
    updateAriaValueText2 = (el) => {
      const range = el.range;
      const currentTimePhrase = formatAsTimePhrase(+calcTimeFromRangeValue(el));
      const totalTimePhrase = formatAsTimePhrase(+el.mediaSeekableEnd);
      const fullPhrase = !(currentTimePhrase && totalTimePhrase) ? DEFAULT_MISSING_TIME_PHRASE2 : `${currentTimePhrase} of ${totalTimePhrase}`;
      range.setAttribute("aria-valuetext", fullPhrase);
    };
    template9 = Document5.createElement("template");
    template9.innerHTML = `
  <style>
    :host {
      --media-preview-border-radius: 3px;
      --media-box-padding-left: 10px;
      --media-box-padding-right: 10px;
    }

    #highlight {
      background: var(--media-time-range-buffered-color, rgb(255 255 255 / .4));
    }

    #preview-rail,
    #current-rail {
      ${""}
      width: 1%;
      position: absolute;
      left: 0;
      bottom: 100%;
      pointer-events: none;
    }

    [part~="box"] {
      ${""}
      position: absolute;
      bottom: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      transform: translateX(-50%);
    }

    [part~="preview-box"] {
      transition-property: var(--media-preview-transition-property, visibility, opacity);
      transition-duration: var(--media-preview-transition-duration-out, .25s);
      transition-delay: var(--media-preview-transition-delay-out, 0s);
      visibility: hidden;
      opacity: 0;
    }

    :host(:is([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}], [${MediaUIAttributes.MEDIA_PREVIEW_TIME}])[dragging]) [part~="preview-box"] {
      transition-duration: var(--media-preview-transition-duration-in, .5s);
      transition-delay: var(--media-preview-transition-delay-in, .25s);
      visibility: visible;
      opacity: 1;
    }

    @media (hover: hover) {
      :host(:is([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}], [${MediaUIAttributes.MEDIA_PREVIEW_TIME}]):hover) [part~="preview-box"] {
        transition-duration: var(--media-preview-transition-duration-in, .5s);
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
        opacity: 1;
      }
    }

    media-preview-thumbnail,
    ::slotted(media-preview-thumbnail) {
      visibility: hidden;
      ${""}
      transition: visibility 0s .25s;
      transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
      background: var(--media-preview-thumbnail-background, var(--media-preview-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)))));
      box-shadow: var(--media-preview-thumbnail-box-shadow, 0 0 4px rgb(0 0 0 / .2));
      max-width: var(--media-preview-thumbnail-max-width, 180px);
      max-height: var(--media-preview-thumbnail-max-height, 160px);
      min-width: var(--media-preview-thumbnail-min-width, 120px);
      min-height: var(--media-preview-thumbnail-min-height, 80px);
      border: var(--media-preview-thumbnail-border);
      border-radius: var(--media-preview-thumbnail-border-radius,
        var(--media-preview-border-radius) var(--media-preview-border-radius) 0 0);
    }

    :host([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}][dragging]) media-preview-thumbnail,
    :host([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}][dragging]) ::slotted(media-preview-thumbnail) {
      transition-delay: var(--media-preview-transition-delay-in, .25s);
      visibility: visible;
    }

    @media (hover: hover) {
      :host([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}]:hover) media-preview-thumbnail,
      :host([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}]:hover) ::slotted(media-preview-thumbnail) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
      }

      :host([${MediaUIAttributes.MEDIA_PREVIEW_TIME}]:hover) {
        --media-time-range-hover-display: block;
      }
    }

    media-preview-time-display,
    ::slotted(media-preview-time-display) {
      min-width: 0;
      ${""}
      transition: min-width 0s, border-radius 0s;
      transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
      background: var(--media-preview-time-background, var(--media-preview-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)))));
      border-radius: var(--media-preview-time-border-radius,
        var(--media-preview-border-radius) var(--media-preview-border-radius)
        var(--media-preview-border-radius) var(--media-preview-border-radius));
      padding: var(--media-preview-time-padding, 1px 10px 0);
      margin: var(--media-preview-time-margin, 0 0 10px);
      text-shadow: var(--media-preview-time-text-shadow, 0 0 4px rgb(0 0 0 / .75));
    }

    :host([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}]) media-preview-time-display,
    :host([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-time-display) {
      transition-delay: var(--media-preview-transition-delay-in, .25s);
      min-width: 100%;
      border-radius: var(--media-preview-time-border-radius,
        0 0 var(--media-preview-border-radius) var(--media-preview-border-radius));
    }
  </style>
  <div id="preview-rail">
    <slot name="preview" part="box preview-box">
      <media-preview-thumbnail></media-preview-thumbnail>
      <media-preview-time-display></media-preview-time-display>
    </slot>
  </div>
  <div id="current-rail">
    <slot name="current" part="box current-box">
      ${""}
    </slot>
  </div>
`;
    calcRangeValueFromTime = (el, time = el.mediaCurrentTime) => {
      if (Number.isNaN(el.mediaSeekableEnd))
        return 0;
      const value = (time - el.mediaSeekableStart) / (el.mediaSeekableEnd - el.mediaSeekableStart);
      return Math.max(0, Math.min(value, 1));
    };
    calcTimeFromRangeValue = (el, value = el.range.valueAsNumber) => {
      if (Number.isNaN(el.mediaSeekableEnd))
        return 0;
      return value * (el.mediaSeekableEnd - el.mediaSeekableStart) + el.mediaSeekableStart;
    };
    MediaTimeRange = class extends MediaChromeRange {
      constructor() {
        super();
        __privateAdd15(this, _toggleRangeAnimation);
        __privateAdd15(this, _shouldRangeAnimate);
        __privateAdd15(this, _getBoxPosition);
        __privateAdd15(this, _handlePointerMove3);
        __privateAdd15(this, _previewRequest);
        __privateAdd15(this, _seekRequest);
        __privateAdd15(this, _rootNode, void 0);
        __privateAdd15(this, _animation, void 0);
        __privateAdd15(this, _boxes, void 0);
        __privateAdd15(this, _previewBox, void 0);
        __privateAdd15(this, _currentBox, void 0);
        __privateAdd15(this, _boxPaddingLeft, void 0);
        __privateAdd15(this, _boxPaddingRight, void 0);
        __privateAdd15(this, _updateRange, (value) => {
          if (this.dragging)
            return;
          this.range.valueAsNumber = value;
          this.updateBar();
        });
        this.container.appendChild(template9.content.cloneNode(true));
        __privateSet14(this, _boxes, this.shadowRoot.querySelectorAll('[part~="box"]'));
        __privateSet14(this, _previewBox, this.shadowRoot.querySelector('[part~="preview-box"]'));
        __privateSet14(this, _currentBox, this.shadowRoot.querySelector('[part~="current-box"]'));
        const computedStyle = getComputedStyle(this);
        __privateSet14(this, _boxPaddingLeft, parseInt(computedStyle.getPropertyValue("--media-box-padding-left")));
        __privateSet14(this, _boxPaddingRight, parseInt(computedStyle.getPropertyValue("--media-box-padding-right")));
        __privateSet14(this, _animation, new RangeAnimation(this.range, __privateGet15(this, _updateRange), 60));
      }
      static get observedAttributes() {
        return [
          ...super.observedAttributes,
          MediaUIAttributes.MEDIA_PAUSED,
          MediaUIAttributes.MEDIA_DURATION,
          MediaUIAttributes.MEDIA_SEEKABLE,
          MediaUIAttributes.MEDIA_CURRENT_TIME,
          MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
          MediaUIAttributes.MEDIA_PREVIEW_TIME,
          MediaUIAttributes.MEDIA_BUFFERED,
          MediaUIAttributes.MEDIA_PLAYBACK_RATE,
          MediaUIAttributes.MEDIA_LOADING,
          MediaUIAttributes.MEDIA_ENDED
        ];
      }
      connectedCallback() {
        var _a2;
        super.connectedCallback();
        this.range.setAttribute("aria-label", nouns.SEEK());
        __privateMethod4(this, _toggleRangeAnimation, toggleRangeAnimation_fn).call(this);
        __privateSet14(this, _rootNode, this.getRootNode());
        (_a2 = __privateGet15(this, _rootNode)) == null ? void 0 : _a2.addEventListener("transitionstart", this);
      }
      disconnectedCallback() {
        var _a2;
        super.disconnectedCallback();
        __privateMethod4(this, _toggleRangeAnimation, toggleRangeAnimation_fn).call(this);
        (_a2 = __privateGet15(this, _rootNode)) == null ? void 0 : _a2.removeEventListener("transitionstart", this);
        __privateSet14(this, _rootNode, null);
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (oldValue == newValue)
          return;
        if (attrName === MediaUIAttributes.MEDIA_CURRENT_TIME || attrName === MediaUIAttributes.MEDIA_PAUSED || attrName === MediaUIAttributes.MEDIA_ENDED || attrName === MediaUIAttributes.MEDIA_LOADING || attrName === MediaUIAttributes.MEDIA_DURATION || attrName === MediaUIAttributes.MEDIA_SEEKABLE) {
          __privateGet15(this, _animation).update({
            start: calcRangeValueFromTime(this),
            duration: this.mediaSeekableEnd - this.mediaSeekableStart,
            playbackRate: this.mediaPlaybackRate
          });
          __privateMethod4(this, _toggleRangeAnimation, toggleRangeAnimation_fn).call(this);
          updateAriaValueText2(this);
        } else if (attrName === MediaUIAttributes.MEDIA_BUFFERED) {
          this.updateBufferedBar();
        }
      }
      get mediaPaused() {
        return getBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED);
      }
      set mediaPaused(value) {
        setBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED, value);
      }
      get mediaLoading() {
        return getBooleanAttr(this, MediaUIAttributes.MEDIA_LOADING);
      }
      set mediaLoading(value) {
        setBooleanAttr(this, MediaUIAttributes.MEDIA_LOADING, value);
      }
      get mediaDuration() {
        return getNumericAttr(this, MediaUIAttributes.MEDIA_DURATION);
      }
      set mediaDuration(value) {
        setNumericAttr(this, MediaUIAttributes.MEDIA_DURATION, value);
      }
      get mediaCurrentTime() {
        return getNumericAttr(this, MediaUIAttributes.MEDIA_CURRENT_TIME);
      }
      set mediaCurrentTime(value) {
        setNumericAttr(this, MediaUIAttributes.MEDIA_CURRENT_TIME, value);
      }
      get mediaPlaybackRate() {
        return getNumericAttr(this, MediaUIAttributes.MEDIA_PLAYBACK_RATE, 1);
      }
      set mediaPlaybackRate(value) {
        setNumericAttr(this, MediaUIAttributes.MEDIA_PLAYBACK_RATE, value);
      }
      get mediaBuffered() {
        const buffered = this.getAttribute(MediaUIAttributes.MEDIA_BUFFERED);
        if (!buffered)
          return [];
        return buffered.split(" ").map((timePair) => timePair.split(":").map((timeStr) => +timeStr));
      }
      set mediaBuffered(list) {
        if (!list) {
          this.removeAttribute(MediaUIAttributes.MEDIA_BUFFERED);
          return;
        }
        const strVal = list.map((tuple) => tuple.join(":")).join(" ");
        this.setAttribute(MediaUIAttributes.MEDIA_BUFFERED, strVal);
      }
      get mediaSeekable() {
        const seekable = this.getAttribute(MediaUIAttributes.MEDIA_SEEKABLE);
        if (!seekable)
          return void 0;
        return seekable.split(":").map((time) => +time);
      }
      set mediaSeekable(range) {
        if (range == null) {
          this.removeAttribute(MediaUIAttributes.MEDIA_SEEKABLE);
          return;
        }
        this.setAttribute(MediaUIAttributes.MEDIA_SEEKABLE, range.join(":"));
      }
      get mediaSeekableEnd() {
        var _a2;
        const [, end = this.mediaDuration] = (_a2 = this.mediaSeekable) != null ? _a2 : [];
        return end;
      }
      get mediaSeekableStart() {
        var _a2;
        const [start = 0] = (_a2 = this.mediaSeekable) != null ? _a2 : [];
        return start;
      }
      get mediaPreviewImage() {
        return getStringAttr(this, MediaUIAttributes.MEDIA_PREVIEW_IMAGE);
      }
      set mediaPreviewImage(value) {
        setStringAttr(this, MediaUIAttributes.MEDIA_PREVIEW_IMAGE, value);
      }
      get mediaPreviewTime() {
        return getNumericAttr(this, MediaUIAttributes.MEDIA_PREVIEW_TIME);
      }
      set mediaPreviewTime(value) {
        setNumericAttr(this, MediaUIAttributes.MEDIA_PREVIEW_TIME, value);
      }
      get mediaEnded() {
        return getBooleanAttr(this, MediaUIAttributes.MEDIA_ENDED);
      }
      set mediaEnded(value) {
        setBooleanAttr(this, MediaUIAttributes.MEDIA_ENDED, value);
      }
      updateBar() {
        super.updateBar();
        this.updateBufferedBar();
        this.updateCurrentBox();
      }
      updateBufferedBar() {
        var _a2;
        const buffered = this.mediaBuffered;
        if (!buffered.length) {
          return;
        }
        let relativeBufferedEnd;
        if (!this.mediaEnded) {
          const currentTime = this.mediaCurrentTime;
          const [, bufferedEnd = this.mediaSeekableStart] = (_a2 = buffered.find(
            ([start, end]) => start <= currentTime && currentTime <= end
          )) != null ? _a2 : [];
          relativeBufferedEnd = calcRangeValueFromTime(this, bufferedEnd);
        } else {
          relativeBufferedEnd = 1;
        }
        const { style } = getOrInsertCSSRule(this.shadowRoot, "#highlight");
        style.setProperty("width", `${relativeBufferedEnd * 100}%`);
      }
      updateCurrentBox() {
        if (!__privateGet15(this, _currentBox).assignedElements().length)
          return;
        const boxPos = __privateMethod4(this, _getBoxPosition, getBoxPosition_fn).call(this, __privateGet15(this, _currentBox), this.range.valueAsNumber);
        const { style } = getOrInsertCSSRule(this.shadowRoot, "#current-rail");
        style.transform = `translateX(${boxPos})`;
      }
      handleEvent(evt) {
        super.handleEvent(evt);
        switch (evt.type) {
          case "input":
            __privateMethod4(this, _seekRequest, seekRequest_fn).call(this);
            break;
          case "pointermove":
            __privateMethod4(this, _handlePointerMove3, handlePointerMove_fn3).call(this, evt);
            break;
          case "pointerup":
          case "pointerleave":
            __privateMethod4(this, _previewRequest, previewRequest_fn).call(this, null);
            break;
          case "transitionstart":
            if (containsComposedNode(evt.target, this)) {
              setTimeout(() => __privateMethod4(this, _toggleRangeAnimation, toggleRangeAnimation_fn).call(this), 0);
            }
            break;
        }
      }
    };
    _rootNode = /* @__PURE__ */ new WeakMap();
    _animation = /* @__PURE__ */ new WeakMap();
    _boxes = /* @__PURE__ */ new WeakMap();
    _previewBox = /* @__PURE__ */ new WeakMap();
    _currentBox = /* @__PURE__ */ new WeakMap();
    _boxPaddingLeft = /* @__PURE__ */ new WeakMap();
    _boxPaddingRight = /* @__PURE__ */ new WeakMap();
    _toggleRangeAnimation = /* @__PURE__ */ new WeakSet();
    toggleRangeAnimation_fn = function() {
      if (__privateMethod4(this, _shouldRangeAnimate, shouldRangeAnimate_fn).call(this)) {
        __privateGet15(this, _animation).start();
      } else {
        __privateGet15(this, _animation).stop();
      }
    };
    _shouldRangeAnimate = /* @__PURE__ */ new WeakSet();
    shouldRangeAnimate_fn = function() {
      return this.isConnected && isElementVisible(this) && !this.mediaPaused && !this.mediaLoading && !this.mediaEnded;
    };
    _updateRange = /* @__PURE__ */ new WeakMap();
    _getBoxPosition = /* @__PURE__ */ new WeakSet();
    getBoxPosition_fn = function(box, ratio) {
      var _a2;
      let position = `${ratio * 100 * 100}%`;
      const boxWidth = box.offsetWidth;
      if (!boxWidth)
        return position;
      const bounds = (_a2 = this.getAttribute("bounds") ? closestComposedNode(this, `#${this.getAttribute("bounds")}`) : this.parentElement) != null ? _a2 : this;
      const rangeRect = this.range.getBoundingClientRect();
      const mediaBoundsRect = bounds.getBoundingClientRect();
      const boxMin = (__privateGet15(this, _boxPaddingLeft) - (rangeRect.left - mediaBoundsRect.left - boxWidth / 2)) / rangeRect.width * 100;
      const boxMax = (mediaBoundsRect.right - rangeRect.left - boxWidth / 2 - __privateGet15(this, _boxPaddingRight)) / rangeRect.width * 100;
      if (!Number.isNaN(boxMin))
        position = `max(${boxMin * 100}%, ${position})`;
      if (!Number.isNaN(boxMax))
        position = `min(${position}, ${boxMax * 100}%)`;
      return position;
    };
    _handlePointerMove3 = /* @__PURE__ */ new WeakSet();
    handlePointerMove_fn3 = function(evt) {
      const isOverBoxes = [...__privateGet15(this, _boxes)].some((b) => evt.composedPath().includes(b));
      if (!this.dragging && (isOverBoxes || !evt.composedPath().includes(this))) {
        __privateMethod4(this, _previewRequest, previewRequest_fn).call(this, null);
        return;
      }
      const duration = this.mediaDuration;
      if (!duration)
        return;
      const rangeRect = this.range.getBoundingClientRect();
      let pointerRatio = (evt.clientX - rangeRect.left) / rangeRect.width;
      pointerRatio = Math.max(0, Math.min(1, pointerRatio));
      const boxPos = __privateMethod4(this, _getBoxPosition, getBoxPosition_fn).call(this, __privateGet15(this, _previewBox), pointerRatio);
      const { style } = getOrInsertCSSRule(this.shadowRoot, "#preview-rail");
      style.transform = `translateX(${boxPos})`;
      __privateMethod4(this, _previewRequest, previewRequest_fn).call(this, pointerRatio * duration);
    };
    _previewRequest = /* @__PURE__ */ new WeakSet();
    previewRequest_fn = function(detail) {
      this.dispatchEvent(new GlobalThis.CustomEvent(
        MediaUIEvents.MEDIA_PREVIEW_REQUEST,
        { composed: true, bubbles: true, detail }
      ));
    };
    _seekRequest = /* @__PURE__ */ new WeakSet();
    seekRequest_fn = function() {
      __privateGet15(this, _animation).stop();
      const detail = calcTimeFromRangeValue(this);
      this.dispatchEvent(new GlobalThis.CustomEvent(
        MediaUIEvents.MEDIA_SEEK_REQUEST,
        { composed: true, bubbles: true, detail }
      ));
    };
    if (!GlobalThis.customElements.get("media-time-range")) {
      GlobalThis.customElements.define("media-time-range", MediaTimeRange);
    }
    media_time_range_default = MediaTimeRange;
  }
});

// node_modules/media-chrome/dist/media-loading-indicator.js
var __accessCheck16, __privateGet16, __privateAdd16, __privateSet15, _mediaController7, _delay, _style, Attributes8, DEFAULT_LOADING_DELAY, template10, loadingIndicatorIcon, MediaLoadingIndicator, media_loading_indicator_default;
var init_media_loading_indicator = __esm({
  "node_modules/media-chrome/dist/media-loading-indicator.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_constants();
    init_labels();
    init_server_safe_globals();
    init_element_utils();
    __accessCheck16 = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet16 = (obj, member, getter) => {
      __accessCheck16(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd16 = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    __privateSet15 = (obj, member, value, setter) => {
      __accessCheck16(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    Attributes8 = {
      LOADING_DELAY: "loadingdelay"
    };
    DEFAULT_LOADING_DELAY = 500;
    template10 = Document5.createElement("template");
    loadingIndicatorIcon = `
<svg aria-hidden="true" viewBox="0 0 100 100">
  <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
    <animateTransform
       attributeName="transform"
       attributeType="XML"
       type="rotate"
       dur="1s"
       from="0 50 50"
       to="360 50 50"
       repeatCount="indefinite" />
  </path>
</svg>
`;
    template10.innerHTML = `
<style>
:host {
  display: var(--media-control-display, var(--media-loading-indicator-display, inline-block));
  vertical-align: middle;
  box-sizing: border-box;
  --_loading-indicator-delay: var(--media-loading-indicator-transition-delay, ${DEFAULT_LOADING_DELAY}ms);
}

#status {
  color: rgba(0,0,0,0);
  width: 0px;
  height: 0px;
}

:host slot[name=icon] > *,
:host ::slotted([slot=icon]) {
  opacity: var(--media-loading-indicator-opacity, 0);
  transition: opacity 0.15s;
}

:host([${MediaUIAttributes.MEDIA_LOADING}]:not([${MediaUIAttributes.MEDIA_PAUSED}])) slot[name=icon] > *,
:host([${MediaUIAttributes.MEDIA_LOADING}]:not([${MediaUIAttributes.MEDIA_PAUSED}])) ::slotted([slot=icon]) {
  opacity: var(--media-loading-indicator-opacity, 1);
  transition: opacity 0.15s var(--_loading-indicator-delay);
}

:host #status {
  visibility: var(--media-loading-indicator-opacity, hidden);
  transition: visibility 0.15s;
}

:host([${MediaUIAttributes.MEDIA_LOADING}]:not([${MediaUIAttributes.MEDIA_PAUSED}])) #status {
  visibility: var(--media-loading-indicator-opacity, visible);
  transition: visibility 0.15s var(--_loading-indicator-delay);
}

svg, img, ::slotted(svg), ::slotted(img) {
  width: var(--media-loading-indicator-icon-width);
  height: var(--media-loading-indicator-icon-height, 100px);
  fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
  vertical-align: middle;
}
</style>

<slot name="icon">${loadingIndicatorIcon}</slot>
<div id="status" role="status" aria-live="polite">${nouns.MEDIA_LOADING()}</div>
`;
    MediaLoadingIndicator = class extends GlobalThis.HTMLElement {
      constructor() {
        super();
        __privateAdd16(this, _mediaController7, void 0);
        __privateAdd16(this, _delay, DEFAULT_LOADING_DELAY);
        __privateAdd16(this, _style, void 0);
        if (!this.shadowRoot) {
          const shadow = this.attachShadow({ mode: "open" });
          const indicatorHTML = template10.content.cloneNode(true);
          shadow.appendChild(indicatorHTML);
        }
        const { style } = getOrInsertCSSRule(this.shadowRoot, ":host");
        __privateSet15(this, _style, style);
      }
      static get observedAttributes() {
        return [
          MediaStateReceiverAttributes.MEDIA_CONTROLLER,
          MediaUIAttributes.MEDIA_PAUSED,
          MediaUIAttributes.MEDIA_LOADING,
          Attributes8.LOADING_DELAY
        ];
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        var _a2, _b, _c, _d, _e;
        if (attrName === Attributes8.LOADING_DELAY && oldValue !== newValue) {
          this.loadingDelay = Number(newValue);
        } else if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
          if (oldValue) {
            (_b = (_a2 = __privateGet16(this, _mediaController7)) == null ? void 0 : _a2.unassociateElement) == null ? void 0 : _b.call(_a2, this);
            __privateSet15(this, _mediaController7, null);
          }
          if (newValue && this.isConnected) {
            __privateSet15(this, _mediaController7, (_c = this.getRootNode()) == null ? void 0 : _c.getElementById(newValue));
            (_e = (_d = __privateGet16(this, _mediaController7)) == null ? void 0 : _d.associateElement) == null ? void 0 : _e.call(_d, this);
          }
        }
      }
      connectedCallback() {
        var _a2, _b, _c;
        const mediaControllerId = this.getAttribute(
          MediaStateReceiverAttributes.MEDIA_CONTROLLER
        );
        if (mediaControllerId) {
          __privateSet15(this, _mediaController7, (_a2 = this.getRootNode()) == null ? void 0 : _a2.getElementById(mediaControllerId));
          (_c = (_b = __privateGet16(this, _mediaController7)) == null ? void 0 : _b.associateElement) == null ? void 0 : _c.call(_b, this);
        }
      }
      disconnectedCallback() {
        var _a2, _b;
        (_b = (_a2 = __privateGet16(this, _mediaController7)) == null ? void 0 : _a2.unassociateElement) == null ? void 0 : _b.call(_a2, this);
        __privateSet15(this, _mediaController7, null);
      }
      get loadingDelay() {
        return __privateGet16(this, _delay);
      }
      set loadingDelay(delay2) {
        __privateSet15(this, _delay, delay2);
        __privateGet16(this, _style).setProperty(
          "--_loading-indicator-delay",
          `var(--media-loading-indicator-transition-delay, ${delay2}ms)`
        );
      }
      get mediaPaused() {
        return getBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED);
      }
      set mediaPaused(value) {
        setBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED, value);
      }
      get mediaLoading() {
        return getBooleanAttr(this, MediaUIAttributes.MEDIA_LOADING);
      }
      set mediaLoading(value) {
        setBooleanAttr(this, MediaUIAttributes.MEDIA_LOADING, value);
      }
    };
    _mediaController7 = /* @__PURE__ */ new WeakMap();
    _delay = /* @__PURE__ */ new WeakMap();
    _style = /* @__PURE__ */ new WeakMap();
    if (!GlobalThis.customElements.get("media-loading-indicator")) {
      GlobalThis.customElements.define("media-loading-indicator", MediaLoadingIndicator);
    }
    media_loading_indicator_default = MediaLoadingIndicator;
  }
});

// node_modules/media-chrome/dist/media-volume-range.js
var DEFAULT_VOLUME, toVolume, formatAsPercentString, MediaVolumeRange, media_volume_range_default;
var init_media_volume_range = __esm({
  "node_modules/media-chrome/dist/media-volume-range.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_server_safe_globals();
    init_media_chrome_range();
    init_constants();
    init_labels();
    init_element_utils();
    DEFAULT_VOLUME = 1;
    toVolume = (el) => {
      if (el.mediaMuted)
        return 0;
      return el.mediaVolume;
    };
    formatAsPercentString = ({ value }) => `${Math.round(value * 100)}%`;
    MediaVolumeRange = class extends MediaChromeRange {
      static get observedAttributes() {
        return [
          ...super.observedAttributes,
          MediaUIAttributes.MEDIA_VOLUME,
          MediaUIAttributes.MEDIA_MUTED,
          MediaUIAttributes.MEDIA_VOLUME_UNAVAILABLE
        ];
      }
      constructor() {
        super();
        this.range.addEventListener("input", () => {
          const detail = this.range.value;
          const evt = new GlobalThis.CustomEvent(MediaUIEvents.MEDIA_VOLUME_REQUEST, {
            composed: true,
            bubbles: true,
            detail
          });
          this.dispatchEvent(evt);
        });
      }
      connectedCallback() {
        super.connectedCallback();
        this.range.setAttribute("aria-label", nouns.VOLUME());
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (attrName === MediaUIAttributes.MEDIA_VOLUME || attrName === MediaUIAttributes.MEDIA_MUTED) {
          this.range.valueAsNumber = toVolume(this);
          this.range.setAttribute(
            "aria-valuetext",
            formatAsPercentString(this.range)
          );
          this.updateBar();
        }
      }
      get mediaVolume() {
        return getNumericAttr(this, MediaUIAttributes.MEDIA_VOLUME, DEFAULT_VOLUME);
      }
      set mediaVolume(value) {
        setNumericAttr(this, MediaUIAttributes.MEDIA_VOLUME, value);
      }
      get mediaMuted() {
        return getBooleanAttr(this, MediaUIAttributes.MEDIA_MUTED);
      }
      set mediaMuted(value) {
        setBooleanAttr(this, MediaUIAttributes.MEDIA_MUTED, value);
      }
      get mediaVolumeUnavailable() {
        return getStringAttr(this, MediaUIAttributes.MEDIA_VOLUME_UNAVAILABLE);
      }
      set mediaVolumeUnavailable(value) {
        setStringAttr(this, MediaUIAttributes.MEDIA_VOLUME_UNAVAILABLE, value);
      }
    };
    if (!GlobalThis.customElements.get("media-volume-range")) {
      GlobalThis.customElements.define("media-volume-range", MediaVolumeRange);
    }
    media_volume_range_default = MediaVolumeRange;
  }
});

// node_modules/media-chrome/dist/index.js
var dist_exports = {};
__export(dist_exports, {
  MediaAirplayButton: () => media_airplay_button_default,
  MediaCaptionsButton: () => media_captions_button_default,
  MediaCastButton: () => media_cast_button_default,
  MediaChromeButton: () => media_chrome_button_default,
  MediaChromeRange: () => media_chrome_range_default,
  MediaControlBar: () => media_control_bar_default,
  MediaController: () => media_controller_default,
  MediaDurationDisplay: () => media_duration_display_default,
  MediaFullscreenButton: () => media_fullscreen_button_default,
  MediaGestureReceiver: () => media_gesture_receiver_default,
  MediaLiveButton: () => media_live_button_default,
  MediaLoadingIndicator: () => media_loading_indicator_default,
  MediaMuteButton: () => media_mute_button_default,
  MediaPipButton: () => media_pip_button_default,
  MediaPlayButton: () => media_play_button_default,
  MediaPlaybackRateButton: () => media_playback_rate_button_default,
  MediaPosterImage: () => media_poster_image_default,
  MediaPreviewThumbnail: () => media_preview_thumbnail_default,
  MediaPreviewTimeDisplay: () => media_preview_time_display_default,
  MediaSeekBackwardButton: () => media_seek_backward_button_default,
  MediaSeekForwardButton: () => media_seek_forward_button_default,
  MediaTimeDisplay: () => media_time_display_default,
  MediaTimeRange: () => media_time_range_default,
  MediaVolumeRange: () => media_volume_range_default,
  constants: () => constants_exports,
  labels: () => labels_default,
  timeUtils: () => time_exports
});
var init_dist = __esm({
  "node_modules/media-chrome/dist/index.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_constants();
    init_labels();
    init_time();
    init_media_airplay_button();
    init_media_cast_button();
    init_media_chrome_button();
    init_media_gesture_receiver();
    init_media_controller();
    init_media_chrome_range();
    init_media_control_bar();
    init_media_duration_display();
    init_media_time_display();
    init_media_captions_button();
    init_media_seek_forward_button();
    init_media_fullscreen_button();
    init_media_live_button();
    init_media_mute_button();
    init_media_pip_button();
    init_media_play_button();
    init_media_playback_rate_button();
    init_media_poster_image();
    init_media_seek_backward_button();
    init_media_preview_time_display();
    init_media_preview_thumbnail();
    init_media_time_range();
    init_media_loading_indicator();
    init_media_volume_range();
  }
});

// node_modules/media-chrome/dist/utils/template-parts.js
function swapdom(parent, a, b, end = null) {
  let i = 0, cur, next, bi, n = b.length, m = a.length;
  while (i < n && i < m && a[i] == b[i])
    i++;
  while (i < n && i < m && b[n - 1] == a[m - 1])
    end = b[--m, --n];
  if (i == m)
    while (i < n)
      parent.insertBefore(b[i++], end);
  if (i == n)
    while (i < m)
      parent.removeChild(a[i++]);
  else {
    cur = a[i];
    while (i < n) {
      bi = b[i++], next = cur ? cur.nextSibling : end;
      if (cur == bi)
        cur = next;
      else if (i < n && b[i] == next)
        parent.replaceChild(bi, cur), cur = next;
      else
        parent.insertBefore(bi, cur);
    }
    while (cur != end)
      next = cur.nextSibling, parent.removeChild(cur), cur = next;
  }
  return b;
}
var __defProp5, __defNormalProp3, __publicField3, __accessCheck17, __privateGet17, __privateAdd17, __privateSet16, _parts, _processor, _items, _value, _element, _attributeName, _namespaceURI, _list, list_get, _parentNode, _nodes, ELEMENT, STRING, PART, defaultProcessor, TemplateInstance, parse3, mem, tokenize, FRAGMENT, Part, attrPartToList, AttrPartList, AttrPart, ChildNodePart, InnerTemplatePart;
var init_template_parts = __esm({
  "node_modules/media-chrome/dist/utils/template-parts.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_server_safe_globals();
    __defProp5 = Object.defineProperty;
    __defNormalProp3 = (obj, key2, value) => key2 in obj ? __defProp5(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
    __publicField3 = (obj, key2, value) => {
      __defNormalProp3(obj, typeof key2 !== "symbol" ? key2 + "" : key2, value);
      return value;
    };
    __accessCheck17 = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet17 = (obj, member, getter) => {
      __accessCheck17(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd17 = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    __privateSet16 = (obj, member, value, setter) => {
      __accessCheck17(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    ELEMENT = 1;
    STRING = 0;
    PART = 1;
    defaultProcessor = {
      processCallback(instance, parts, state) {
        if (!state)
          return;
        for (const [expression, part] of parts) {
          if (expression in state) {
            const value = state[expression];
            if (typeof value === "boolean" && part instanceof AttrPart && typeof part.element[part.attributeName] === "boolean") {
              part.booleanValue = value;
            } else if (typeof value === "function" && part instanceof AttrPart) {
              part.element[part.attributeName] = value;
            } else {
              part.value = value;
            }
          }
        }
      }
    };
    TemplateInstance = class extends GlobalThis.DocumentFragment {
      constructor(template11, state, processor2 = defaultProcessor) {
        var _a2;
        super();
        __privateAdd17(this, _parts, void 0);
        __privateAdd17(this, _processor, void 0);
        this.append(template11.content.cloneNode(true));
        __privateSet16(this, _parts, parse3(this));
        __privateSet16(this, _processor, processor2);
        (_a2 = processor2.createCallback) == null ? void 0 : _a2.call(processor2, this, __privateGet17(this, _parts), state);
        processor2.processCallback(this, __privateGet17(this, _parts), state);
      }
      update(state) {
        __privateGet17(this, _processor).processCallback(this, __privateGet17(this, _parts), state);
      }
    };
    _parts = /* @__PURE__ */ new WeakMap();
    _processor = /* @__PURE__ */ new WeakMap();
    parse3 = (element, parts = []) => {
      let type, value;
      for (let attr of element.attributes || []) {
        if (attr.value.includes("{{")) {
          const list = new AttrPartList();
          for ([type, value] of tokenize(attr.value)) {
            if (!type)
              list.append(value);
            else {
              const part = new AttrPart(element, attr.name, attr.namespaceURI);
              list.append(part);
              parts.push([value, part]);
            }
          }
          attr.value = list.toString();
        }
      }
      for (let node of element.childNodes) {
        if (node.nodeType === ELEMENT && !(node instanceof HTMLTemplateElement)) {
          parse3(node, parts);
        } else {
          if (node.nodeType === ELEMENT || node.data.includes("{{")) {
            const items = [];
            if (node.data) {
              for ([type, value] of tokenize(node.data))
                if (!type)
                  items.push(new Text(value));
                else {
                  const part = new ChildNodePart(element);
                  items.push(part);
                  parts.push([value, part]);
                }
            } else if (node instanceof HTMLTemplateElement) {
              const part = new InnerTemplatePart(element, node);
              items.push(part);
              parts.push([part.expression, part]);
            }
            node.replaceWith(
              ...items.flatMap((part) => part.replacementNodes || [part])
            );
          }
        }
      }
      return parts;
    };
    mem = {};
    tokenize = (text) => {
      let value = "", open = 0, tokens = mem[text], i = 0, c;
      if (tokens)
        return tokens;
      else
        tokens = [];
      for (; c = text[i]; i++) {
        if (c === "{" && text[i + 1] === "{" && text[i - 1] !== "\\" && text[i + 2] && ++open == 1) {
          if (value)
            tokens.push([STRING, value]);
          value = "";
          i++;
        } else if (c === "}" && text[i + 1] === "}" && text[i - 1] !== "\\" && !--open) {
          tokens.push([PART, value.trim()]);
          value = "";
          i++;
        } else
          value += c || "";
      }
      if (value)
        tokens.push([STRING, (open > 0 ? "{{" : "") + value]);
      return mem[text] = tokens;
    };
    FRAGMENT = 11;
    Part = class {
      get value() {
        return "";
      }
      set value(val) {
      }
      toString() {
        return this.value;
      }
    };
    attrPartToList = /* @__PURE__ */ new WeakMap();
    AttrPartList = class {
      constructor() {
        __privateAdd17(this, _items, []);
      }
      [Symbol.iterator]() {
        return __privateGet17(this, _items).values();
      }
      get length() {
        return __privateGet17(this, _items).length;
      }
      item(index) {
        return __privateGet17(this, _items)[index];
      }
      append(...items) {
        for (const item of items) {
          if (item instanceof AttrPart) {
            attrPartToList.set(item, this);
          }
          __privateGet17(this, _items).push(item);
        }
      }
      toString() {
        return __privateGet17(this, _items).join("");
      }
    };
    _items = /* @__PURE__ */ new WeakMap();
    AttrPart = class extends Part {
      constructor(element, attributeName, namespaceURI) {
        super();
        __privateAdd17(this, _list);
        __privateAdd17(this, _value, "");
        __privateAdd17(this, _element, void 0);
        __privateAdd17(this, _attributeName, void 0);
        __privateAdd17(this, _namespaceURI, void 0);
        __privateSet16(this, _element, element);
        __privateSet16(this, _attributeName, attributeName);
        __privateSet16(this, _namespaceURI, namespaceURI);
      }
      get attributeName() {
        return __privateGet17(this, _attributeName);
      }
      get attributeNamespace() {
        return __privateGet17(this, _namespaceURI);
      }
      get element() {
        return __privateGet17(this, _element);
      }
      get value() {
        return __privateGet17(this, _value);
      }
      set value(newValue) {
        if (__privateGet17(this, _value) === newValue)
          return;
        __privateSet16(this, _value, newValue);
        if (!__privateGet17(this, _list, list_get) || __privateGet17(this, _list, list_get).length === 1) {
          if (newValue == null) {
            __privateGet17(this, _element).removeAttributeNS(
              __privateGet17(this, _namespaceURI),
              __privateGet17(this, _attributeName)
            );
          } else {
            __privateGet17(this, _element).setAttributeNS(
              __privateGet17(this, _namespaceURI),
              __privateGet17(this, _attributeName),
              newValue
            );
          }
        } else {
          __privateGet17(this, _element).setAttributeNS(
            __privateGet17(this, _namespaceURI),
            __privateGet17(this, _attributeName),
            __privateGet17(this, _list, list_get)
          );
        }
      }
      get booleanValue() {
        return __privateGet17(this, _element).hasAttributeNS(
          __privateGet17(this, _namespaceURI),
          __privateGet17(this, _attributeName)
        );
      }
      set booleanValue(value) {
        if (!__privateGet17(this, _list, list_get) || __privateGet17(this, _list, list_get).length === 1)
          this.value = value ? "" : null;
        else
          throw new DOMException("Value is not fully templatized");
      }
    };
    _value = /* @__PURE__ */ new WeakMap();
    _element = /* @__PURE__ */ new WeakMap();
    _attributeName = /* @__PURE__ */ new WeakMap();
    _namespaceURI = /* @__PURE__ */ new WeakMap();
    _list = /* @__PURE__ */ new WeakSet();
    list_get = function() {
      return attrPartToList.get(this);
    };
    ChildNodePart = class extends Part {
      constructor(parentNode, nodes) {
        super();
        __privateAdd17(this, _parentNode, void 0);
        __privateAdd17(this, _nodes, void 0);
        __privateSet16(this, _parentNode, parentNode);
        __privateSet16(this, _nodes, nodes ? [...nodes] : [new Text()]);
      }
      get replacementNodes() {
        return __privateGet17(this, _nodes);
      }
      get parentNode() {
        return __privateGet17(this, _parentNode);
      }
      get nextSibling() {
        return __privateGet17(this, _nodes)[__privateGet17(this, _nodes).length - 1].nextSibling;
      }
      get previousSibling() {
        return __privateGet17(this, _nodes)[0].previousSibling;
      }
      get value() {
        return __privateGet17(this, _nodes).map((node) => node.textContent).join("");
      }
      set value(newValue) {
        this.replace(newValue);
      }
      replace(...nodes) {
        const normalisedNodes = nodes.flat().flatMap(
          (node) => node == null ? [new Text()] : node.forEach ? [...node] : node.nodeType === FRAGMENT ? [...node.childNodes] : node.nodeType ? [node] : [new Text(node)]
        );
        if (!normalisedNodes.length)
          normalisedNodes.push(new Text());
        __privateSet16(this, _nodes, swapdom(
          __privateGet17(this, _nodes)[0].parentNode,
          __privateGet17(this, _nodes),
          normalisedNodes,
          this.nextSibling
        ));
      }
    };
    _parentNode = /* @__PURE__ */ new WeakMap();
    _nodes = /* @__PURE__ */ new WeakMap();
    InnerTemplatePart = class extends ChildNodePart {
      constructor(parentNode, template11) {
        let directive = template11.getAttribute("directive") || template11.getAttribute("type");
        let expression = template11.getAttribute("expression") || template11.getAttribute(directive) || "";
        if (expression.startsWith("{{"))
          expression = expression.trim().slice(2, -2).trim();
        super(parentNode);
        __publicField3(this, "directive");
        this.expression = expression;
        this.template = template11;
        this.directive = directive;
      }
    };
  }
});

// node_modules/media-chrome/dist/utils/template-processor.js
function tokenizeExpression(expr) {
  return tokenize2(expr, {
    boolean: /true|false/,
    number: /-?\d+\.?\d*/,
    string: /(["'])((?:\\.|[^\\])*?)\1/,
    operator: /[!=><][=!]?|\?\?|\|/,
    ws: /\s+/,
    param: /[$a-z_][$\w]*/i
  }).filter(({ type }) => type !== "ws");
}
function evaluateExpression(expr, state = {}) {
  var _a2, _b, _c, _d, _e, _f, _g;
  const tokens = tokenizeExpression(expr);
  if (tokens.length === 0 || tokens.some(({ type }) => !type)) {
    return invalidExpression(expr);
  }
  if (((_a2 = tokens[0]) == null ? void 0 : _a2.token) === ">") {
    const partial = state[(_b = tokens[1]) == null ? void 0 : _b.token];
    if (!partial) {
      return invalidExpression(expr);
    }
    const partialState = { ...state };
    partial.state = partialState;
    const args = tokens.slice(2);
    for (let i = 0; i < args.length; i += 3) {
      const name = (_c = args[i]) == null ? void 0 : _c.token;
      const operator = (_d = args[i + 1]) == null ? void 0 : _d.token;
      const value = (_e = args[i + 2]) == null ? void 0 : _e.token;
      if (name && operator === "=") {
        partialState[name] = getParamValue(value, state);
      }
    }
    return partial;
  }
  if (tokens.length === 1) {
    if (!isValidParam(tokens[0])) {
      return invalidExpression(expr);
    }
    return getParamValue(tokens[0].token, state);
  }
  if (tokens.length === 2) {
    const operator = (_f = tokens[0]) == null ? void 0 : _f.token;
    const run = operators[operator];
    if (!run || !isValidParam(tokens[1])) {
      return invalidExpression(expr);
    }
    const a = getParamValue(tokens[1].token, state);
    return run(a);
  }
  if (tokens.length === 3) {
    const operator = (_g = tokens[1]) == null ? void 0 : _g.token;
    const run = operators[operator];
    if (!run || !isValidParam(tokens[0]) || !isValidParam(tokens[2])) {
      return invalidExpression(expr);
    }
    const a = getParamValue(tokens[0].token, state);
    if (operator === "|") {
      return run(a, tokens[2].token);
    }
    const b = getParamValue(tokens[2].token, state);
    return run(a, b);
  }
}
function invalidExpression(expr) {
  console.warn(`Warning: invalid expression \`${expr}\``);
  return false;
}
function isValidParam({ type }) {
  return ["number", "boolean", "string", "param"].includes(type);
}
function getParamValue(raw, state) {
  const firstChar = raw[0];
  const lastChar = raw.slice(-1);
  if (raw === "true" || raw === "false") {
    return raw === "true";
  }
  if (firstChar === lastChar && [`'`, `"`].includes(firstChar)) {
    return raw.slice(1, -1);
  }
  if (isNumericString(raw)) {
    return parseFloat(raw);
  }
  return state[raw];
}
function tokenize2(str, parsers) {
  let len, match, token, tokens = [];
  while (str) {
    token = null;
    len = str.length;
    for (let key2 in parsers) {
      match = parsers[key2].exec(str);
      if (match && match.index < len) {
        token = {
          token: match[0],
          type: key2,
          matches: match.slice(1)
        };
        len = match.index;
      }
    }
    if (len) {
      tokens.push({
        token: str.substr(0, len),
        type: void 0
      });
    }
    if (token) {
      tokens.push(token);
    }
    str = str.substr(len + (token ? token.token.length : 0));
  }
  return tokens;
}
var pipeModifiers, PartialTemplate, templates, templateInstances, Directives, DirectiveNames, processor, operators;
var init_template_processor = __esm({
  "node_modules/media-chrome/dist/utils/template-processor.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_template_parts();
    init_utils();
    pipeModifiers = {
      string: (value) => String(value)
    };
    PartialTemplate = class {
      constructor(template11) {
        this.template = template11;
        this.state = void 0;
      }
    };
    templates = /* @__PURE__ */ new WeakMap();
    templateInstances = /* @__PURE__ */ new WeakMap();
    Directives = {
      partial: (part, state) => {
        state[part.expression] = new PartialTemplate(part.template);
      },
      if: (part, state) => {
        var _a2;
        if (evaluateExpression(part.expression, state)) {
          if (templates.get(part) !== part.template) {
            templates.set(part, part.template);
            const tpl = new TemplateInstance(part.template, state, processor);
            part.replace(tpl);
            templateInstances.set(part, tpl);
          } else {
            (_a2 = templateInstances.get(part)) == null ? void 0 : _a2.update(state);
          }
        } else {
          part.replace("");
          templates.delete(part);
          templateInstances.delete(part);
        }
      }
    };
    DirectiveNames = Object.keys(Directives);
    processor = {
      processCallback(instance, parts, state) {
        var _a2, _b;
        if (!state)
          return;
        for (const [expression, part] of parts) {
          if (part instanceof InnerTemplatePart) {
            if (!part.directive) {
              const directive = DirectiveNames.find((n) => part.template.hasAttribute(n));
              if (directive) {
                part.directive = directive;
                part.expression = part.template.getAttribute(directive);
              }
            }
            (_a2 = Directives[part.directive]) == null ? void 0 : _a2.call(Directives, part, state);
            continue;
          }
          let value = evaluateExpression(expression, state);
          if (value instanceof PartialTemplate) {
            if (templates.get(part) !== value.template) {
              templates.set(part, value.template);
              value = new TemplateInstance(
                value.template,
                value.state,
                processor
              );
              part.value = value;
              templateInstances.set(part, value);
            } else {
              (_b = templateInstances.get(part)) == null ? void 0 : _b.update(value.state);
            }
            continue;
          }
          if (value) {
            if (part instanceof AttrPart) {
              if (part.attributeName.startsWith("aria-")) {
                value = String(value);
              }
            }
            if (part instanceof AttrPart) {
              if (typeof value === "boolean") {
                part.booleanValue = value;
              } else if (typeof value === "function") {
                part.element[part.attributeName] = value;
              } else {
                part.value = value;
              }
            } else {
              part.value = value;
              templates.delete(part);
              templateInstances.delete(part);
            }
          } else {
            if (part instanceof AttrPart) {
              part.value = void 0;
            } else {
              part.value = void 0;
              templates.delete(part);
              templateInstances.delete(part);
            }
          }
        }
      }
    };
    operators = {
      "!": (a) => !a,
      "!!": (a) => !!a,
      "==": (a, b) => a == b,
      "!=": (a, b) => a != b,
      ">": (a, b) => a > b,
      ">=": (a, b) => a >= b,
      "<": (a, b) => a < b,
      "<=": (a, b) => a <= b,
      "??": (a, b) => a != null ? a : b,
      "|": (a, b) => {
        var _a2;
        return (_a2 = pipeModifiers[b]) == null ? void 0 : _a2.call(pipeModifiers, a);
      }
    };
  }
});

// node_modules/media-chrome/dist/media-theme-element.js
var media_theme_element_exports = {};
__export(media_theme_element_exports, {
  AttrPart: () => AttrPart,
  AttrPartList: () => AttrPartList,
  ChildNodePart: () => ChildNodePart,
  InnerTemplatePart: () => InnerTemplatePart,
  MediaThemeElement: () => MediaThemeElement,
  Part: () => Part,
  TemplateInstance: () => TemplateInstance,
  defaultProcessor: () => defaultProcessor,
  parse: () => parse3,
  tokenize: () => tokenize
});
function isValidUrl(url) {
  if (!/^(\/|\.\/|https?:\/\/)/.test(url))
    return false;
  const base = /^https?:\/\//.test(url) ? void 0 : location.origin;
  try {
    new URL(url, base);
  } catch (e) {
    return false;
  }
  return true;
}
async function request(resource) {
  const response = await fetch(resource);
  if (response.status !== 200) {
    throw new Error(`Failed to load resource: the server responded with a status of ${response.status}`);
  }
  return response.text();
}
var __defProp6, __defNormalProp4, __publicField4, __accessCheck18, __privateGet18, __privateAdd18, __privateSet17, __privateMethod5, _template, _prevTemplate, _prevTemplateId, _upgradeProperty, upgradeProperty_fn, _updateTemplate, updateTemplate_fn, observedMediaAttributes, prependTemplate, MediaThemeElement;
var init_media_theme_element = __esm({
  "node_modules/media-chrome/dist/media-theme-element.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_constants();
    init_server_safe_globals();
    init_template_parts();
    init_template_processor();
    init_utils();
    init_template_parts();
    __defProp6 = Object.defineProperty;
    __defNormalProp4 = (obj, key2, value) => key2 in obj ? __defProp6(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
    __publicField4 = (obj, key2, value) => {
      __defNormalProp4(obj, typeof key2 !== "symbol" ? key2 + "" : key2, value);
      return value;
    };
    __accessCheck18 = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet18 = (obj, member, getter) => {
      __accessCheck18(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd18 = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    __privateSet17 = (obj, member, value, setter) => {
      __accessCheck18(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    __privateMethod5 = (obj, member, method) => {
      __accessCheck18(obj, member, "access private method");
      return method;
    };
    observedMediaAttributes = {
      mediatargetlivewindow: "targetlivewindow",
      mediastreamtype: "streamtype"
    };
    prependTemplate = Document5.createElement("template");
    prependTemplate.innerHTML = `
  <style>
    :host {
      display: inline-block;
      line-height: 0;
    }

    media-controller {
      width: 100%;
      height: 100%;
    }

    media-controller:not([mediasubtitleslist]) media-captions-selectmenu,
    media-captions-button:not([mediasubtitleslist]),
    media-rendition-selectmenu[mediarenditionunavailable],
    media-audio-track-selectmenu[mediaaudiotrackunavailable],
    media-volume-range[mediavolumeunavailable],
    media-airplay-button[mediaairplayunavailable],
    media-fullscreen-button[mediafullscreenunavailable],
    media-cast-button[mediacastunavailable],
    media-pip-button[mediapipunavailable] {
      display: none;
    }
  </style>
`;
    MediaThemeElement = class extends GlobalThis.HTMLElement {
      constructor() {
        super();
        __privateAdd18(this, _upgradeProperty);
        __privateAdd18(this, _updateTemplate);
        __publicField4(this, "renderRoot");
        __publicField4(this, "renderer");
        __privateAdd18(this, _template, void 0);
        __privateAdd18(this, _prevTemplate, void 0);
        __privateAdd18(this, _prevTemplateId, void 0);
        if (this.shadowRoot) {
          this.renderRoot = this.shadowRoot;
        } else {
          this.renderRoot = this.attachShadow({ mode: "open" });
          this.createRenderer();
        }
        const observer = new MutationObserver((mutationList) => {
          var _a2;
          if (this.mediaController && !((_a2 = this.mediaController) == null ? void 0 : _a2.breakpointsComputed))
            return;
          if (mutationList.some((mutation) => {
            const target = mutation.target;
            if (target === this)
              return true;
            if (target.localName !== "media-controller")
              return false;
            if (observedMediaAttributes[mutation.attributeName])
              return true;
            if (mutation.attributeName.startsWith("breakpoint"))
              return true;
            return false;
          })) {
            this.render();
          }
        });
        observer.observe(this, { attributes: true });
        observer.observe(this.renderRoot, {
          attributes: true,
          subtree: true
        });
        this.addEventListener(MediaStateChangeEvents.BREAKPOINTS_COMPUTED, this.render);
        __privateMethod5(this, _upgradeProperty, upgradeProperty_fn).call(this, "template");
      }
      get mediaController() {
        return this.renderRoot.querySelector("media-controller");
      }
      get template() {
        var _a2;
        return (_a2 = __privateGet18(this, _template)) != null ? _a2 : this.constructor.template;
      }
      set template(element) {
        __privateSet17(this, _prevTemplateId, null);
        __privateSet17(this, _template, element);
        this.createRenderer();
      }
      get props() {
        var _a2, _b, _c;
        const observedAttributes = [
          ...Array.from((_b = (_a2 = this.mediaController) == null ? void 0 : _a2.attributes) != null ? _b : []).filter(({ name }) => {
            return observedMediaAttributes[name] || name.startsWith("breakpoint");
          }),
          ...Array.from(this.attributes)
        ];
        const props = {};
        for (let attr of observedAttributes) {
          const name = (_c = observedMediaAttributes[attr.name]) != null ? _c : camelCase(attr.name);
          let { value } = attr;
          if (value != null) {
            if (isNumericString(value)) {
              value = parseFloat(value);
            }
            props[name] = value === "" ? true : value;
          } else {
            props[name] = false;
          }
        }
        return props;
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        if (attrName === "template" && oldValue != newValue) {
          __privateMethod5(this, _updateTemplate, updateTemplate_fn).call(this);
        }
      }
      connectedCallback() {
        __privateMethod5(this, _updateTemplate, updateTemplate_fn).call(this);
      }
      createRenderer() {
        if (this.template && this.template !== __privateGet18(this, _prevTemplate)) {
          __privateSet17(this, _prevTemplate, this.template);
          this.renderer = new TemplateInstance(
            this.template,
            this.props,
            this.constructor.processor
          );
          this.renderRoot.textContent = "";
          this.renderRoot.append(
            prependTemplate.content.cloneNode(true),
            this.renderer
          );
        }
      }
      render() {
        var _a2;
        (_a2 = this.renderer) == null ? void 0 : _a2.update(this.props);
      }
    };
    _template = /* @__PURE__ */ new WeakMap();
    _prevTemplate = /* @__PURE__ */ new WeakMap();
    _prevTemplateId = /* @__PURE__ */ new WeakMap();
    _upgradeProperty = /* @__PURE__ */ new WeakSet();
    upgradeProperty_fn = function(prop2) {
      if (Object.prototype.hasOwnProperty.call(this, prop2)) {
        const value = this[prop2];
        delete this[prop2];
        this[prop2] = value;
      }
    };
    _updateTemplate = /* @__PURE__ */ new WeakSet();
    updateTemplate_fn = function() {
      var _a2;
      const templateId = this.getAttribute("template");
      if (!templateId || templateId === __privateGet18(this, _prevTemplateId))
        return;
      const rootNode = this.getRootNode();
      const template11 = (_a2 = rootNode == null ? void 0 : rootNode.getElementById) == null ? void 0 : _a2.call(rootNode, templateId);
      if (template11) {
        __privateSet17(this, _prevTemplateId, templateId);
        __privateSet17(this, _template, template11);
        this.createRenderer();
        return;
      }
      if (isValidUrl(templateId)) {
        __privateSet17(this, _prevTemplateId, templateId);
        request(templateId).then((data2) => {
          const template22 = Document5.createElement("template");
          template22.innerHTML = data2;
          __privateSet17(this, _template, template22);
          this.createRenderer();
        }).catch(console.error);
      }
    };
    __publicField4(MediaThemeElement, "template");
    __publicField4(MediaThemeElement, "observedAttributes", ["template"]);
    __publicField4(MediaThemeElement, "processor", processor);
    if (!GlobalThis.customElements.get("media-theme")) {
      GlobalThis.customElements.define("media-theme", MediaThemeElement);
    }
  }
});

// .wrangler/tmp/bundle-BorWzd/middleware-loader.entry.ts
init_checked_fetch();
init_modules_watch_stub();

// node_modules/wrangler/templates/middleware/common.ts
init_checked_fetch();
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
function __facade_invokeChain__(request2, env, ctx, dispatch2, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch: dispatch2,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch2, tail);
    }
  };
  return head(request2, env, ctx, middlewareCtx);
}
function __facade_invoke__(request2, env, ctx, dispatch2, finalMiddleware) {
  return __facade_invokeChain__(request2, env, ctx, dispatch2, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}

// .wrangler/tmp/bundle-BorWzd/middleware-insertion-facade.js
init_checked_fetch();
init_modules_watch_stub();

// src/worker.js
init_checked_fetch();
init_modules_watch_stub();

// ../../dist/server.js
init_checked_fetch();
init_modules_watch_stub();
var __create = Object.create;
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames2 = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require2 = /* @__PURE__ */ ((x) => typeof __require !== "undefined" ? __require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof __require !== "undefined" ? __require : a)[b]
}) : x)(function(x) {
  if (typeof __require !== "undefined")
    return __require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require22() {
  return mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export2 = (target, all) => {
  for (var name in all)
    __defProp2(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames2(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp2(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var require_perf_hooks = __commonJS({
  "node_modules/linkedom/commonjs/perf_hooks.cjs"(exports) {
    try {
      const { performance: performance2 } = __require2("perf_hooks");
      exports.performance = performance2;
    } catch (fallback) {
      exports.performance = { now() {
        return +/* @__PURE__ */ new Date();
      } };
    }
  }
});
var require_boolbase = __commonJS({
  "node_modules/boolbase/index.js"(exports, module) {
    module.exports = {
      trueFunc: function trueFunc() {
        return true;
      },
      falseFunc: function falseFunc() {
        return false;
      }
    };
  }
});
var require_StyleSheet = __commonJS({
  "node_modules/cssom/lib/StyleSheet.js"(exports) {
    var CSSOM = {};
    CSSOM.StyleSheet = function StyleSheet() {
      this.parentStyleSheet = null;
    };
    exports.StyleSheet = CSSOM.StyleSheet;
  }
});
var require_CSSRule = __commonJS({
  "node_modules/cssom/lib/CSSRule.js"(exports) {
    var CSSOM = {};
    CSSOM.CSSRule = function CSSRule() {
      this.parentRule = null;
      this.parentStyleSheet = null;
    };
    CSSOM.CSSRule.UNKNOWN_RULE = 0;
    CSSOM.CSSRule.STYLE_RULE = 1;
    CSSOM.CSSRule.CHARSET_RULE = 2;
    CSSOM.CSSRule.IMPORT_RULE = 3;
    CSSOM.CSSRule.MEDIA_RULE = 4;
    CSSOM.CSSRule.FONT_FACE_RULE = 5;
    CSSOM.CSSRule.PAGE_RULE = 6;
    CSSOM.CSSRule.KEYFRAMES_RULE = 7;
    CSSOM.CSSRule.KEYFRAME_RULE = 8;
    CSSOM.CSSRule.MARGIN_RULE = 9;
    CSSOM.CSSRule.NAMESPACE_RULE = 10;
    CSSOM.CSSRule.COUNTER_STYLE_RULE = 11;
    CSSOM.CSSRule.SUPPORTS_RULE = 12;
    CSSOM.CSSRule.DOCUMENT_RULE = 13;
    CSSOM.CSSRule.FONT_FEATURE_VALUES_RULE = 14;
    CSSOM.CSSRule.VIEWPORT_RULE = 15;
    CSSOM.CSSRule.REGION_STYLE_RULE = 16;
    CSSOM.CSSRule.prototype = {
      constructor: CSSOM.CSSRule
      //FIXME
    };
    exports.CSSRule = CSSOM.CSSRule;
  }
});
var require_CSSStyleRule = __commonJS({
  "node_modules/cssom/lib/CSSStyleRule.js"(exports) {
    var CSSOM = {
      CSSStyleDeclaration: require_CSSStyleDeclaration().CSSStyleDeclaration,
      CSSRule: require_CSSRule().CSSRule
    };
    CSSOM.CSSStyleRule = function CSSStyleRule() {
      CSSOM.CSSRule.call(this);
      this.selectorText = "";
      this.style = new CSSOM.CSSStyleDeclaration();
      this.style.parentRule = this;
    };
    CSSOM.CSSStyleRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSStyleRule.prototype.constructor = CSSOM.CSSStyleRule;
    CSSOM.CSSStyleRule.prototype.type = 1;
    Object.defineProperty(CSSOM.CSSStyleRule.prototype, "cssText", {
      get: function() {
        var text;
        if (this.selectorText) {
          text = this.selectorText + " {" + this.style.cssText + "}";
        } else {
          text = "";
        }
        return text;
      },
      set: function(cssText) {
        var rule = CSSOM.CSSStyleRule.parse(cssText);
        this.style = rule.style;
        this.selectorText = rule.selectorText;
      }
    });
    CSSOM.CSSStyleRule.parse = function(ruleText) {
      var i = 0;
      var state = "selector";
      var index;
      var j = i;
      var buffer = "";
      var SIGNIFICANT_WHITESPACE = {
        "selector": true,
        "value": true
      };
      var styleRule = new CSSOM.CSSStyleRule();
      var name, priority = "";
      for (var character; character = ruleText.charAt(i); i++) {
        switch (character) {
          case " ":
          case "	":
          case "\r":
          case "\n":
          case "\f":
            if (SIGNIFICANT_WHITESPACE[state]) {
              switch (ruleText.charAt(i - 1)) {
                case " ":
                case "	":
                case "\r":
                case "\n":
                case "\f":
                  break;
                default:
                  buffer += " ";
                  break;
              }
            }
            break;
          case '"':
            j = i + 1;
            index = ruleText.indexOf('"', j) + 1;
            if (!index) {
              throw '" is missing';
            }
            buffer += ruleText.slice(i, index);
            i = index - 1;
            break;
          case "'":
            j = i + 1;
            index = ruleText.indexOf("'", j) + 1;
            if (!index) {
              throw "' is missing";
            }
            buffer += ruleText.slice(i, index);
            i = index - 1;
            break;
          case "/":
            if (ruleText.charAt(i + 1) === "*") {
              i += 2;
              index = ruleText.indexOf("*/", i);
              if (index === -1) {
                throw new SyntaxError("Missing */");
              } else {
                i = index + 1;
              }
            } else {
              buffer += character;
            }
            break;
          case "{":
            if (state === "selector") {
              styleRule.selectorText = buffer.trim();
              buffer = "";
              state = "name";
            }
            break;
          case ":":
            if (state === "name") {
              name = buffer.trim();
              buffer = "";
              state = "value";
            } else {
              buffer += character;
            }
            break;
          case "!":
            if (state === "value" && ruleText.indexOf("!important", i) === i) {
              priority = "important";
              i += "important".length;
            } else {
              buffer += character;
            }
            break;
          case ";":
            if (state === "value") {
              styleRule.style.setProperty(name, buffer.trim(), priority);
              priority = "";
              buffer = "";
              state = "name";
            } else {
              buffer += character;
            }
            break;
          case "}":
            if (state === "value") {
              styleRule.style.setProperty(name, buffer.trim(), priority);
              priority = "";
              buffer = "";
            } else if (state === "name") {
              break;
            } else {
              buffer += character;
            }
            state = "selector";
            break;
          default:
            buffer += character;
            break;
        }
      }
      return styleRule;
    };
    exports.CSSStyleRule = CSSOM.CSSStyleRule;
  }
});
var require_CSSStyleSheet = __commonJS({
  "node_modules/cssom/lib/CSSStyleSheet.js"(exports) {
    var CSSOM = {
      StyleSheet: require_StyleSheet().StyleSheet,
      CSSStyleRule: require_CSSStyleRule().CSSStyleRule
    };
    CSSOM.CSSStyleSheet = function CSSStyleSheet() {
      CSSOM.StyleSheet.call(this);
      this.cssRules = [];
    };
    CSSOM.CSSStyleSheet.prototype = new CSSOM.StyleSheet();
    CSSOM.CSSStyleSheet.prototype.constructor = CSSOM.CSSStyleSheet;
    CSSOM.CSSStyleSheet.prototype.insertRule = function(rule, index) {
      if (index < 0 || index > this.cssRules.length) {
        throw new RangeError("INDEX_SIZE_ERR");
      }
      var cssRule = CSSOM.parse(rule).cssRules[0];
      cssRule.parentStyleSheet = this;
      this.cssRules.splice(index, 0, cssRule);
      return index;
    };
    CSSOM.CSSStyleSheet.prototype.deleteRule = function(index) {
      if (index < 0 || index >= this.cssRules.length) {
        throw new RangeError("INDEX_SIZE_ERR");
      }
      this.cssRules.splice(index, 1);
    };
    CSSOM.CSSStyleSheet.prototype.toString = function() {
      var result = "";
      var rules = this.cssRules;
      for (var i = 0; i < rules.length; i++) {
        result += rules[i].cssText + "\n";
      }
      return result;
    };
    exports.CSSStyleSheet = CSSOM.CSSStyleSheet;
    CSSOM.parse = require_parse().parse;
  }
});
var require_MediaList = __commonJS({
  "node_modules/cssom/lib/MediaList.js"(exports) {
    var CSSOM = {};
    CSSOM.MediaList = function MediaList() {
      this.length = 0;
    };
    CSSOM.MediaList.prototype = {
      constructor: CSSOM.MediaList,
      /**
       * @return {string}
       */
      get mediaText() {
        return Array.prototype.join.call(this, ", ");
      },
      /**
       * @param {string} value
       */
      set mediaText(value) {
        var values = value.split(",");
        var length = this.length = values.length;
        for (var i = 0; i < length; i++) {
          this[i] = values[i].trim();
        }
      },
      /**
       * @param {string} medium
       */
      appendMedium: function(medium) {
        if (Array.prototype.indexOf.call(this, medium) === -1) {
          this[this.length] = medium;
          this.length++;
        }
      },
      /**
       * @param {string} medium
       */
      deleteMedium: function(medium) {
        var index = Array.prototype.indexOf.call(this, medium);
        if (index !== -1) {
          Array.prototype.splice.call(this, index, 1);
        }
      }
    };
    exports.MediaList = CSSOM.MediaList;
  }
});
var require_CSSImportRule = __commonJS({
  "node_modules/cssom/lib/CSSImportRule.js"(exports) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule,
      CSSStyleSheet: require_CSSStyleSheet().CSSStyleSheet,
      MediaList: require_MediaList().MediaList
    };
    CSSOM.CSSImportRule = function CSSImportRule() {
      CSSOM.CSSRule.call(this);
      this.href = "";
      this.media = new CSSOM.MediaList();
      this.styleSheet = new CSSOM.CSSStyleSheet();
    };
    CSSOM.CSSImportRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSImportRule.prototype.constructor = CSSOM.CSSImportRule;
    CSSOM.CSSImportRule.prototype.type = 3;
    Object.defineProperty(CSSOM.CSSImportRule.prototype, "cssText", {
      get: function() {
        var mediaText = this.media.mediaText;
        return "@import url(" + this.href + ")" + (mediaText ? " " + mediaText : "") + ";";
      },
      set: function(cssText) {
        var i = 0;
        var state = "";
        var buffer = "";
        var index;
        for (var character; character = cssText.charAt(i); i++) {
          switch (character) {
            case " ":
            case "	":
            case "\r":
            case "\n":
            case "\f":
              if (state === "after-import") {
                state = "url";
              } else {
                buffer += character;
              }
              break;
            case "@":
              if (!state && cssText.indexOf("@import", i) === i) {
                state = "after-import";
                i += "import".length;
                buffer = "";
              }
              break;
            case "u":
              if (state === "url" && cssText.indexOf("url(", i) === i) {
                index = cssText.indexOf(")", i + 1);
                if (index === -1) {
                  throw i + ': ")" not found';
                }
                i += "url(".length;
                var url = cssText.slice(i, index);
                if (url[0] === url[url.length - 1]) {
                  if (url[0] === '"' || url[0] === "'") {
                    url = url.slice(1, -1);
                  }
                }
                this.href = url;
                i = index;
                state = "media";
              }
              break;
            case '"':
              if (state === "url") {
                index = cssText.indexOf('"', i + 1);
                if (!index) {
                  throw i + `: '"' not found`;
                }
                this.href = cssText.slice(i + 1, index);
                i = index;
                state = "media";
              }
              break;
            case "'":
              if (state === "url") {
                index = cssText.indexOf("'", i + 1);
                if (!index) {
                  throw i + `: "'" not found`;
                }
                this.href = cssText.slice(i + 1, index);
                i = index;
                state = "media";
              }
              break;
            case ";":
              if (state === "media") {
                if (buffer) {
                  this.media.mediaText = buffer.trim();
                }
              }
              break;
            default:
              if (state === "media") {
                buffer += character;
              }
              break;
          }
        }
      }
    });
    exports.CSSImportRule = CSSOM.CSSImportRule;
  }
});
var require_CSSGroupingRule = __commonJS({
  "node_modules/cssom/lib/CSSGroupingRule.js"(exports) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule
    };
    CSSOM.CSSGroupingRule = function CSSGroupingRule() {
      CSSOM.CSSRule.call(this);
      this.cssRules = [];
    };
    CSSOM.CSSGroupingRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSGroupingRule.prototype.constructor = CSSOM.CSSGroupingRule;
    CSSOM.CSSGroupingRule.prototype.insertRule = function insertRule(rule, index) {
      if (index < 0 || index > this.cssRules.length) {
        throw new RangeError("INDEX_SIZE_ERR");
      }
      var cssRule = CSSOM.parse(rule).cssRules[0];
      cssRule.parentRule = this;
      this.cssRules.splice(index, 0, cssRule);
      return index;
    };
    CSSOM.CSSGroupingRule.prototype.deleteRule = function deleteRule(index) {
      if (index < 0 || index >= this.cssRules.length) {
        throw new RangeError("INDEX_SIZE_ERR");
      }
      this.cssRules.splice(index, 1)[0].parentRule = null;
    };
    exports.CSSGroupingRule = CSSOM.CSSGroupingRule;
  }
});
var require_CSSConditionRule = __commonJS({
  "node_modules/cssom/lib/CSSConditionRule.js"(exports) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule,
      CSSGroupingRule: require_CSSGroupingRule().CSSGroupingRule
    };
    CSSOM.CSSConditionRule = function CSSConditionRule() {
      CSSOM.CSSGroupingRule.call(this);
      this.cssRules = [];
    };
    CSSOM.CSSConditionRule.prototype = new CSSOM.CSSGroupingRule();
    CSSOM.CSSConditionRule.prototype.constructor = CSSOM.CSSConditionRule;
    CSSOM.CSSConditionRule.prototype.conditionText = "";
    CSSOM.CSSConditionRule.prototype.cssText = "";
    exports.CSSConditionRule = CSSOM.CSSConditionRule;
  }
});
var require_CSSMediaRule = __commonJS({
  "node_modules/cssom/lib/CSSMediaRule.js"(exports) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule,
      CSSGroupingRule: require_CSSGroupingRule().CSSGroupingRule,
      CSSConditionRule: require_CSSConditionRule().CSSConditionRule,
      MediaList: require_MediaList().MediaList
    };
    CSSOM.CSSMediaRule = function CSSMediaRule() {
      CSSOM.CSSConditionRule.call(this);
      this.media = new CSSOM.MediaList();
    };
    CSSOM.CSSMediaRule.prototype = new CSSOM.CSSConditionRule();
    CSSOM.CSSMediaRule.prototype.constructor = CSSOM.CSSMediaRule;
    CSSOM.CSSMediaRule.prototype.type = 4;
    Object.defineProperties(CSSOM.CSSMediaRule.prototype, {
      "conditionText": {
        get: function() {
          return this.media.mediaText;
        },
        set: function(value) {
          this.media.mediaText = value;
        },
        configurable: true,
        enumerable: true
      },
      "cssText": {
        get: function() {
          var cssTexts = [];
          for (var i = 0, length = this.cssRules.length; i < length; i++) {
            cssTexts.push(this.cssRules[i].cssText);
          }
          return "@media " + this.media.mediaText + " {" + cssTexts.join("") + "}";
        },
        configurable: true,
        enumerable: true
      }
    });
    exports.CSSMediaRule = CSSOM.CSSMediaRule;
  }
});
var require_CSSSupportsRule = __commonJS({
  "node_modules/cssom/lib/CSSSupportsRule.js"(exports) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule,
      CSSGroupingRule: require_CSSGroupingRule().CSSGroupingRule,
      CSSConditionRule: require_CSSConditionRule().CSSConditionRule
    };
    CSSOM.CSSSupportsRule = function CSSSupportsRule() {
      CSSOM.CSSConditionRule.call(this);
    };
    CSSOM.CSSSupportsRule.prototype = new CSSOM.CSSConditionRule();
    CSSOM.CSSSupportsRule.prototype.constructor = CSSOM.CSSSupportsRule;
    CSSOM.CSSSupportsRule.prototype.type = 12;
    Object.defineProperty(CSSOM.CSSSupportsRule.prototype, "cssText", {
      get: function() {
        var cssTexts = [];
        for (var i = 0, length = this.cssRules.length; i < length; i++) {
          cssTexts.push(this.cssRules[i].cssText);
        }
        return "@supports " + this.conditionText + " {" + cssTexts.join("") + "}";
      }
    });
    exports.CSSSupportsRule = CSSOM.CSSSupportsRule;
  }
});
var require_CSSFontFaceRule = __commonJS({
  "node_modules/cssom/lib/CSSFontFaceRule.js"(exports) {
    var CSSOM = {
      CSSStyleDeclaration: require_CSSStyleDeclaration().CSSStyleDeclaration,
      CSSRule: require_CSSRule().CSSRule
    };
    CSSOM.CSSFontFaceRule = function CSSFontFaceRule() {
      CSSOM.CSSRule.call(this);
      this.style = new CSSOM.CSSStyleDeclaration();
      this.style.parentRule = this;
    };
    CSSOM.CSSFontFaceRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSFontFaceRule.prototype.constructor = CSSOM.CSSFontFaceRule;
    CSSOM.CSSFontFaceRule.prototype.type = 5;
    Object.defineProperty(CSSOM.CSSFontFaceRule.prototype, "cssText", {
      get: function() {
        return "@font-face {" + this.style.cssText + "}";
      }
    });
    exports.CSSFontFaceRule = CSSOM.CSSFontFaceRule;
  }
});
var require_CSSHostRule = __commonJS({
  "node_modules/cssom/lib/CSSHostRule.js"(exports) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule
    };
    CSSOM.CSSHostRule = function CSSHostRule() {
      CSSOM.CSSRule.call(this);
      this.cssRules = [];
    };
    CSSOM.CSSHostRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSHostRule.prototype.constructor = CSSOM.CSSHostRule;
    CSSOM.CSSHostRule.prototype.type = 1001;
    Object.defineProperty(CSSOM.CSSHostRule.prototype, "cssText", {
      get: function() {
        var cssTexts = [];
        for (var i = 0, length = this.cssRules.length; i < length; i++) {
          cssTexts.push(this.cssRules[i].cssText);
        }
        return "@host {" + cssTexts.join("") + "}";
      }
    });
    exports.CSSHostRule = CSSOM.CSSHostRule;
  }
});
var require_CSSKeyframeRule = __commonJS({
  "node_modules/cssom/lib/CSSKeyframeRule.js"(exports) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule,
      CSSStyleDeclaration: require_CSSStyleDeclaration().CSSStyleDeclaration
    };
    CSSOM.CSSKeyframeRule = function CSSKeyframeRule() {
      CSSOM.CSSRule.call(this);
      this.keyText = "";
      this.style = new CSSOM.CSSStyleDeclaration();
      this.style.parentRule = this;
    };
    CSSOM.CSSKeyframeRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSKeyframeRule.prototype.constructor = CSSOM.CSSKeyframeRule;
    CSSOM.CSSKeyframeRule.prototype.type = 8;
    Object.defineProperty(CSSOM.CSSKeyframeRule.prototype, "cssText", {
      get: function() {
        return this.keyText + " {" + this.style.cssText + "} ";
      }
    });
    exports.CSSKeyframeRule = CSSOM.CSSKeyframeRule;
  }
});
var require_CSSKeyframesRule = __commonJS({
  "node_modules/cssom/lib/CSSKeyframesRule.js"(exports) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule
    };
    CSSOM.CSSKeyframesRule = function CSSKeyframesRule() {
      CSSOM.CSSRule.call(this);
      this.name = "";
      this.cssRules = [];
    };
    CSSOM.CSSKeyframesRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSKeyframesRule.prototype.constructor = CSSOM.CSSKeyframesRule;
    CSSOM.CSSKeyframesRule.prototype.type = 7;
    Object.defineProperty(CSSOM.CSSKeyframesRule.prototype, "cssText", {
      get: function() {
        var cssTexts = [];
        for (var i = 0, length = this.cssRules.length; i < length; i++) {
          cssTexts.push("  " + this.cssRules[i].cssText);
        }
        return "@" + (this._vendorPrefix || "") + "keyframes " + this.name + " { \n" + cssTexts.join("\n") + "\n}";
      }
    });
    exports.CSSKeyframesRule = CSSOM.CSSKeyframesRule;
  }
});
var require_CSSValue = __commonJS({
  "node_modules/cssom/lib/CSSValue.js"(exports) {
    var CSSOM = {};
    CSSOM.CSSValue = function CSSValue() {
    };
    CSSOM.CSSValue.prototype = {
      constructor: CSSOM.CSSValue,
      // @see: http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSValue
      set cssText(text) {
        var name = this._getConstructorName();
        throw new Error('DOMException: property "cssText" of "' + name + '" is readonly and can not be replaced with "' + text + '"!');
      },
      get cssText() {
        var name = this._getConstructorName();
        throw new Error('getter "cssText" of "' + name + '" is not implemented!');
      },
      _getConstructorName: function() {
        var s = this.constructor.toString(), c = s.match(/function\s([^\(]+)/), name = c[1];
        return name;
      }
    };
    exports.CSSValue = CSSOM.CSSValue;
  }
});
var require_CSSValueExpression = __commonJS({
  "node_modules/cssom/lib/CSSValueExpression.js"(exports) {
    var CSSOM = {
      CSSValue: require_CSSValue().CSSValue
    };
    CSSOM.CSSValueExpression = function CSSValueExpression(token, idx) {
      this._token = token;
      this._idx = idx;
    };
    CSSOM.CSSValueExpression.prototype = new CSSOM.CSSValue();
    CSSOM.CSSValueExpression.prototype.constructor = CSSOM.CSSValueExpression;
    CSSOM.CSSValueExpression.prototype.parse = function() {
      var token = this._token, idx = this._idx;
      var character = "", expression = "", error = "", info, paren = [];
      for (; ; ++idx) {
        character = token.charAt(idx);
        if (character === "") {
          error = "css expression error: unfinished expression!";
          break;
        }
        switch (character) {
          case "(":
            paren.push(character);
            expression += character;
            break;
          case ")":
            paren.pop(character);
            expression += character;
            break;
          case "/":
            if (info = this._parseJSComment(token, idx)) {
              if (info.error) {
                error = "css expression error: unfinished comment in expression!";
              } else {
                idx = info.idx;
              }
            } else if (info = this._parseJSRexExp(token, idx)) {
              idx = info.idx;
              expression += info.text;
            } else {
              expression += character;
            }
            break;
          case "'":
          case '"':
            info = this._parseJSString(token, idx, character);
            if (info) {
              idx = info.idx;
              expression += info.text;
            } else {
              expression += character;
            }
            break;
          default:
            expression += character;
            break;
        }
        if (error) {
          break;
        }
        if (paren.length === 0) {
          break;
        }
      }
      var ret;
      if (error) {
        ret = {
          error
        };
      } else {
        ret = {
          idx,
          expression
        };
      }
      return ret;
    };
    CSSOM.CSSValueExpression.prototype._parseJSComment = function(token, idx) {
      var nextChar = token.charAt(idx + 1), text;
      if (nextChar === "/" || nextChar === "*") {
        var startIdx = idx, endIdx, commentEndChar;
        if (nextChar === "/") {
          commentEndChar = "\n";
        } else if (nextChar === "*") {
          commentEndChar = "*/";
        }
        endIdx = token.indexOf(commentEndChar, startIdx + 1 + 1);
        if (endIdx !== -1) {
          endIdx = endIdx + commentEndChar.length - 1;
          text = token.substring(idx, endIdx + 1);
          return {
            idx: endIdx,
            text
          };
        } else {
          var error = "css expression error: unfinished comment in expression!";
          return {
            error
          };
        }
      } else {
        return false;
      }
    };
    CSSOM.CSSValueExpression.prototype._parseJSString = function(token, idx, sep) {
      var endIdx = this._findMatchedIdx(token, idx, sep), text;
      if (endIdx === -1) {
        return false;
      } else {
        text = token.substring(idx, endIdx + sep.length);
        return {
          idx: endIdx,
          text
        };
      }
    };
    CSSOM.CSSValueExpression.prototype._parseJSRexExp = function(token, idx) {
      var before2 = token.substring(0, idx).replace(/\s+$/, ""), legalRegx = [
        /^$/,
        /\($/,
        /\[$/,
        /\!$/,
        /\+$/,
        /\-$/,
        /\*$/,
        /\/\s+/,
        /\%$/,
        /\=$/,
        /\>$/,
        /<$/,
        /\&$/,
        /\|$/,
        /\^$/,
        /\~$/,
        /\?$/,
        /\,$/,
        /delete$/,
        /in$/,
        /instanceof$/,
        /new$/,
        /typeof$/,
        /void$/
      ];
      var isLegal = legalRegx.some(function(reg) {
        return reg.test(before2);
      });
      if (!isLegal) {
        return false;
      } else {
        var sep = "/";
        return this._parseJSString(token, idx, sep);
      }
    };
    CSSOM.CSSValueExpression.prototype._findMatchedIdx = function(token, idx, sep) {
      var startIdx = idx, endIdx;
      var NOT_FOUND = -1;
      while (true) {
        endIdx = token.indexOf(sep, startIdx + 1);
        if (endIdx === -1) {
          endIdx = NOT_FOUND;
          break;
        } else {
          var text = token.substring(idx + 1, endIdx), matched = text.match(/\\+$/);
          if (!matched || matched[0] % 2 === 0) {
            break;
          } else {
            startIdx = endIdx;
          }
        }
      }
      var nextNewLineIdx = token.indexOf("\n", idx + 1);
      if (nextNewLineIdx < endIdx) {
        endIdx = NOT_FOUND;
      }
      return endIdx;
    };
    exports.CSSValueExpression = CSSOM.CSSValueExpression;
  }
});
var require_MatcherList = __commonJS({
  "node_modules/cssom/lib/MatcherList.js"(exports) {
    var CSSOM = {};
    CSSOM.MatcherList = function MatcherList() {
      this.length = 0;
    };
    CSSOM.MatcherList.prototype = {
      constructor: CSSOM.MatcherList,
      /**
       * @return {string}
       */
      get matcherText() {
        return Array.prototype.join.call(this, ", ");
      },
      /**
       * @param {string} value
       */
      set matcherText(value) {
        var values = value.split(",");
        var length = this.length = values.length;
        for (var i = 0; i < length; i++) {
          this[i] = values[i].trim();
        }
      },
      /**
       * @param {string} matcher
       */
      appendMatcher: function(matcher) {
        if (Array.prototype.indexOf.call(this, matcher) === -1) {
          this[this.length] = matcher;
          this.length++;
        }
      },
      /**
       * @param {string} matcher
       */
      deleteMatcher: function(matcher) {
        var index = Array.prototype.indexOf.call(this, matcher);
        if (index !== -1) {
          Array.prototype.splice.call(this, index, 1);
        }
      }
    };
    exports.MatcherList = CSSOM.MatcherList;
  }
});
var require_CSSDocumentRule = __commonJS({
  "node_modules/cssom/lib/CSSDocumentRule.js"(exports) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule,
      MatcherList: require_MatcherList().MatcherList
    };
    CSSOM.CSSDocumentRule = function CSSDocumentRule() {
      CSSOM.CSSRule.call(this);
      this.matcher = new CSSOM.MatcherList();
      this.cssRules = [];
    };
    CSSOM.CSSDocumentRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSDocumentRule.prototype.constructor = CSSOM.CSSDocumentRule;
    CSSOM.CSSDocumentRule.prototype.type = 10;
    Object.defineProperty(CSSOM.CSSDocumentRule.prototype, "cssText", {
      get: function() {
        var cssTexts = [];
        for (var i = 0, length = this.cssRules.length; i < length; i++) {
          cssTexts.push(this.cssRules[i].cssText);
        }
        return "@-moz-document " + this.matcher.matcherText + " {" + cssTexts.join("") + "}";
      }
    });
    exports.CSSDocumentRule = CSSOM.CSSDocumentRule;
  }
});
var require_parse = __commonJS({
  "node_modules/cssom/lib/parse.js"(exports) {
    var CSSOM = {};
    CSSOM.parse = function parse5(token) {
      var i = 0;
      var state = "before-selector";
      var index;
      var buffer = "";
      var valueParenthesisDepth = 0;
      var SIGNIFICANT_WHITESPACE = {
        "selector": true,
        "value": true,
        "value-parenthesis": true,
        "atRule": true,
        "importRule-begin": true,
        "importRule": true,
        "atBlock": true,
        "conditionBlock": true,
        "documentRule-begin": true
      };
      var styleSheet = new CSSOM.CSSStyleSheet();
      var currentScope = styleSheet;
      var parentRule;
      var ancestorRules = [];
      var hasAncestors = false;
      var prevScope;
      var name, priority = "", styleRule, mediaRule, supportsRule, importRule, fontFaceRule, keyframesRule, documentRule, hostRule;
      var atKeyframesRegExp = /@(-(?:\w+-)+)?keyframes/g;
      var parseError = function(message) {
        var lines = token.substring(0, i).split("\n");
        var lineCount = lines.length;
        var charCount = lines.pop().length + 1;
        var error = new Error(message + " (line " + lineCount + ", char " + charCount + ")");
        error.line = lineCount;
        error["char"] = charCount;
        error.styleSheet = styleSheet;
        throw error;
      };
      for (var character; character = token.charAt(i); i++) {
        switch (character) {
          case " ":
          case "	":
          case "\r":
          case "\n":
          case "\f":
            if (SIGNIFICANT_WHITESPACE[state]) {
              buffer += character;
            }
            break;
          case '"':
            index = i + 1;
            do {
              index = token.indexOf('"', index) + 1;
              if (!index) {
                parseError('Unmatched "');
              }
            } while (token[index - 2] === "\\");
            buffer += token.slice(i, index);
            i = index - 1;
            switch (state) {
              case "before-value":
                state = "value";
                break;
              case "importRule-begin":
                state = "importRule";
                break;
            }
            break;
          case "'":
            index = i + 1;
            do {
              index = token.indexOf("'", index) + 1;
              if (!index) {
                parseError("Unmatched '");
              }
            } while (token[index - 2] === "\\");
            buffer += token.slice(i, index);
            i = index - 1;
            switch (state) {
              case "before-value":
                state = "value";
                break;
              case "importRule-begin":
                state = "importRule";
                break;
            }
            break;
          case "/":
            if (token.charAt(i + 1) === "*") {
              i += 2;
              index = token.indexOf("*/", i);
              if (index === -1) {
                parseError("Missing */");
              } else {
                i = index + 1;
              }
            } else {
              buffer += character;
            }
            if (state === "importRule-begin") {
              buffer += " ";
              state = "importRule";
            }
            break;
          case "@":
            if (token.indexOf("@-moz-document", i) === i) {
              state = "documentRule-begin";
              documentRule = new CSSOM.CSSDocumentRule();
              documentRule.__starts = i;
              i += "-moz-document".length;
              buffer = "";
              break;
            } else if (token.indexOf("@media", i) === i) {
              state = "atBlock";
              mediaRule = new CSSOM.CSSMediaRule();
              mediaRule.__starts = i;
              i += "media".length;
              buffer = "";
              break;
            } else if (token.indexOf("@supports", i) === i) {
              state = "conditionBlock";
              supportsRule = new CSSOM.CSSSupportsRule();
              supportsRule.__starts = i;
              i += "supports".length;
              buffer = "";
              break;
            } else if (token.indexOf("@host", i) === i) {
              state = "hostRule-begin";
              i += "host".length;
              hostRule = new CSSOM.CSSHostRule();
              hostRule.__starts = i;
              buffer = "";
              break;
            } else if (token.indexOf("@import", i) === i) {
              state = "importRule-begin";
              i += "import".length;
              buffer += "@import";
              break;
            } else if (token.indexOf("@font-face", i) === i) {
              state = "fontFaceRule-begin";
              i += "font-face".length;
              fontFaceRule = new CSSOM.CSSFontFaceRule();
              fontFaceRule.__starts = i;
              buffer = "";
              break;
            } else {
              atKeyframesRegExp.lastIndex = i;
              var matchKeyframes = atKeyframesRegExp.exec(token);
              if (matchKeyframes && matchKeyframes.index === i) {
                state = "keyframesRule-begin";
                keyframesRule = new CSSOM.CSSKeyframesRule();
                keyframesRule.__starts = i;
                keyframesRule._vendorPrefix = matchKeyframes[1];
                i += matchKeyframes[0].length - 1;
                buffer = "";
                break;
              } else if (state === "selector") {
                state = "atRule";
              }
            }
            buffer += character;
            break;
          case "{":
            if (state === "selector" || state === "atRule") {
              styleRule.selectorText = buffer.trim();
              styleRule.style.__starts = i;
              buffer = "";
              state = "before-name";
            } else if (state === "atBlock") {
              mediaRule.media.mediaText = buffer.trim();
              if (parentRule) {
                ancestorRules.push(parentRule);
              }
              currentScope = parentRule = mediaRule;
              mediaRule.parentStyleSheet = styleSheet;
              buffer = "";
              state = "before-selector";
            } else if (state === "conditionBlock") {
              supportsRule.conditionText = buffer.trim();
              if (parentRule) {
                ancestorRules.push(parentRule);
              }
              currentScope = parentRule = supportsRule;
              supportsRule.parentStyleSheet = styleSheet;
              buffer = "";
              state = "before-selector";
            } else if (state === "hostRule-begin") {
              if (parentRule) {
                ancestorRules.push(parentRule);
              }
              currentScope = parentRule = hostRule;
              hostRule.parentStyleSheet = styleSheet;
              buffer = "";
              state = "before-selector";
            } else if (state === "fontFaceRule-begin") {
              if (parentRule) {
                fontFaceRule.parentRule = parentRule;
              }
              fontFaceRule.parentStyleSheet = styleSheet;
              styleRule = fontFaceRule;
              buffer = "";
              state = "before-name";
            } else if (state === "keyframesRule-begin") {
              keyframesRule.name = buffer.trim();
              if (parentRule) {
                ancestorRules.push(parentRule);
                keyframesRule.parentRule = parentRule;
              }
              keyframesRule.parentStyleSheet = styleSheet;
              currentScope = parentRule = keyframesRule;
              buffer = "";
              state = "keyframeRule-begin";
            } else if (state === "keyframeRule-begin") {
              styleRule = new CSSOM.CSSKeyframeRule();
              styleRule.keyText = buffer.trim();
              styleRule.__starts = i;
              buffer = "";
              state = "before-name";
            } else if (state === "documentRule-begin") {
              documentRule.matcher.matcherText = buffer.trim();
              if (parentRule) {
                ancestorRules.push(parentRule);
                documentRule.parentRule = parentRule;
              }
              currentScope = parentRule = documentRule;
              documentRule.parentStyleSheet = styleSheet;
              buffer = "";
              state = "before-selector";
            }
            break;
          case ":":
            if (state === "name") {
              name = buffer.trim();
              buffer = "";
              state = "before-value";
            } else {
              buffer += character;
            }
            break;
          case "(":
            if (state === "value") {
              if (buffer.trim() === "expression") {
                var info = new CSSOM.CSSValueExpression(token, i).parse();
                if (info.error) {
                  parseError(info.error);
                } else {
                  buffer += info.expression;
                  i = info.idx;
                }
              } else {
                state = "value-parenthesis";
                valueParenthesisDepth = 1;
                buffer += character;
              }
            } else if (state === "value-parenthesis") {
              valueParenthesisDepth++;
              buffer += character;
            } else {
              buffer += character;
            }
            break;
          case ")":
            if (state === "value-parenthesis") {
              valueParenthesisDepth--;
              if (valueParenthesisDepth === 0)
                state = "value";
            }
            buffer += character;
            break;
          case "!":
            if (state === "value" && token.indexOf("!important", i) === i) {
              priority = "important";
              i += "important".length;
            } else {
              buffer += character;
            }
            break;
          case ";":
            switch (state) {
              case "value":
                styleRule.style.setProperty(name, buffer.trim(), priority);
                priority = "";
                buffer = "";
                state = "before-name";
                break;
              case "atRule":
                buffer = "";
                state = "before-selector";
                break;
              case "importRule":
                importRule = new CSSOM.CSSImportRule();
                importRule.parentStyleSheet = importRule.styleSheet.parentStyleSheet = styleSheet;
                importRule.cssText = buffer + character;
                styleSheet.cssRules.push(importRule);
                buffer = "";
                state = "before-selector";
                break;
              default:
                buffer += character;
                break;
            }
            break;
          case "}":
            switch (state) {
              case "value":
                styleRule.style.setProperty(name, buffer.trim(), priority);
                priority = "";
              case "before-name":
              case "name":
                styleRule.__ends = i + 1;
                if (parentRule) {
                  styleRule.parentRule = parentRule;
                }
                styleRule.parentStyleSheet = styleSheet;
                currentScope.cssRules.push(styleRule);
                buffer = "";
                if (currentScope.constructor === CSSOM.CSSKeyframesRule) {
                  state = "keyframeRule-begin";
                } else {
                  state = "before-selector";
                }
                break;
              case "keyframeRule-begin":
              case "before-selector":
              case "selector":
                if (!parentRule) {
                  parseError("Unexpected }");
                }
                hasAncestors = ancestorRules.length > 0;
                while (ancestorRules.length > 0) {
                  parentRule = ancestorRules.pop();
                  if (parentRule.constructor.name === "CSSMediaRule" || parentRule.constructor.name === "CSSSupportsRule") {
                    prevScope = currentScope;
                    currentScope = parentRule;
                    currentScope.cssRules.push(prevScope);
                    break;
                  }
                  if (ancestorRules.length === 0) {
                    hasAncestors = false;
                  }
                }
                if (!hasAncestors) {
                  currentScope.__ends = i + 1;
                  styleSheet.cssRules.push(currentScope);
                  currentScope = styleSheet;
                  parentRule = null;
                }
                buffer = "";
                state = "before-selector";
                break;
            }
            break;
          default:
            switch (state) {
              case "before-selector":
                state = "selector";
                styleRule = new CSSOM.CSSStyleRule();
                styleRule.__starts = i;
                break;
              case "before-name":
                state = "name";
                break;
              case "before-value":
                state = "value";
                break;
              case "importRule-begin":
                state = "importRule";
                break;
            }
            buffer += character;
            break;
        }
      }
      return styleSheet;
    };
    exports.parse = CSSOM.parse;
    CSSOM.CSSStyleSheet = require_CSSStyleSheet().CSSStyleSheet;
    CSSOM.CSSStyleRule = require_CSSStyleRule().CSSStyleRule;
    CSSOM.CSSImportRule = require_CSSImportRule().CSSImportRule;
    CSSOM.CSSGroupingRule = require_CSSGroupingRule().CSSGroupingRule;
    CSSOM.CSSMediaRule = require_CSSMediaRule().CSSMediaRule;
    CSSOM.CSSConditionRule = require_CSSConditionRule().CSSConditionRule;
    CSSOM.CSSSupportsRule = require_CSSSupportsRule().CSSSupportsRule;
    CSSOM.CSSFontFaceRule = require_CSSFontFaceRule().CSSFontFaceRule;
    CSSOM.CSSHostRule = require_CSSHostRule().CSSHostRule;
    CSSOM.CSSStyleDeclaration = require_CSSStyleDeclaration().CSSStyleDeclaration;
    CSSOM.CSSKeyframeRule = require_CSSKeyframeRule().CSSKeyframeRule;
    CSSOM.CSSKeyframesRule = require_CSSKeyframesRule().CSSKeyframesRule;
    CSSOM.CSSValueExpression = require_CSSValueExpression().CSSValueExpression;
    CSSOM.CSSDocumentRule = require_CSSDocumentRule().CSSDocumentRule;
  }
});
var require_CSSStyleDeclaration = __commonJS({
  "node_modules/cssom/lib/CSSStyleDeclaration.js"(exports) {
    var CSSOM = {};
    CSSOM.CSSStyleDeclaration = function CSSStyleDeclaration2() {
      this.length = 0;
      this.parentRule = null;
      this._importants = {};
    };
    CSSOM.CSSStyleDeclaration.prototype = {
      constructor: CSSOM.CSSStyleDeclaration,
      /**
       *
       * @param {string} name
       * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-getPropertyValue
       * @return {string} the value of the property if it has been explicitly set for this declaration block.
       * Returns the empty string if the property has not been set.
       */
      getPropertyValue: function(name) {
        return this[name] || "";
      },
      /**
       *
       * @param {string} name
       * @param {string} value
       * @param {string} [priority=null] "important" or null
       * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-setProperty
       */
      setProperty: function(name, value, priority) {
        if (this[name]) {
          var index = Array.prototype.indexOf.call(this, name);
          if (index < 0) {
            this[this.length] = name;
            this.length++;
          }
        } else {
          this[this.length] = name;
          this.length++;
        }
        this[name] = value + "";
        this._importants[name] = priority;
      },
      /**
       *
       * @param {string} name
       * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-removeProperty
       * @return {string} the value of the property if it has been explicitly set for this declaration block.
       * Returns the empty string if the property has not been set or the property name does not correspond to a known CSS property.
       */
      removeProperty: function(name) {
        if (!(name in this)) {
          return "";
        }
        var index = Array.prototype.indexOf.call(this, name);
        if (index < 0) {
          return "";
        }
        var prevValue = this[name];
        this[name] = "";
        Array.prototype.splice.call(this, index, 1);
        return prevValue;
      },
      getPropertyCSSValue: function() {
      },
      /**
       *
       * @param {String} name
       */
      getPropertyPriority: function(name) {
        return this._importants[name] || "";
      },
      /**
       *   element.style.overflow = "auto"
       *   element.style.getPropertyShorthand("overflow-x")
       *   -> "overflow"
       */
      getPropertyShorthand: function() {
      },
      isPropertyImplicit: function() {
      },
      // Doesn't work in IE < 9
      get cssText() {
        var properties = [];
        for (var i = 0, length = this.length; i < length; ++i) {
          var name = this[i];
          var value = this.getPropertyValue(name);
          var priority = this.getPropertyPriority(name);
          if (priority) {
            priority = " !" + priority;
          }
          properties[i] = name + ": " + value + priority + ";";
        }
        return properties.join(" ");
      },
      set cssText(text) {
        var i, name;
        for (i = this.length; i--; ) {
          name = this[i];
          this[name] = "";
        }
        Array.prototype.splice.call(this, 0, this.length);
        this._importants = {};
        var dummyRule = CSSOM.parse("#bogus{" + text + "}").cssRules[0].style;
        var length = dummyRule.length;
        for (i = 0; i < length; ++i) {
          name = dummyRule[i];
          this.setProperty(dummyRule[i], dummyRule.getPropertyValue(name), dummyRule.getPropertyPriority(name));
        }
      }
    };
    exports.CSSStyleDeclaration = CSSOM.CSSStyleDeclaration;
    CSSOM.parse = require_parse().parse;
  }
});
var require_clone = __commonJS({
  "node_modules/cssom/lib/clone.js"(exports) {
    var CSSOM = {
      CSSStyleSheet: require_CSSStyleSheet().CSSStyleSheet,
      CSSRule: require_CSSRule().CSSRule,
      CSSStyleRule: require_CSSStyleRule().CSSStyleRule,
      CSSGroupingRule: require_CSSGroupingRule().CSSGroupingRule,
      CSSConditionRule: require_CSSConditionRule().CSSConditionRule,
      CSSMediaRule: require_CSSMediaRule().CSSMediaRule,
      CSSSupportsRule: require_CSSSupportsRule().CSSSupportsRule,
      CSSStyleDeclaration: require_CSSStyleDeclaration().CSSStyleDeclaration,
      CSSKeyframeRule: require_CSSKeyframeRule().CSSKeyframeRule,
      CSSKeyframesRule: require_CSSKeyframesRule().CSSKeyframesRule
    };
    CSSOM.clone = function clone(stylesheet) {
      var cloned = new CSSOM.CSSStyleSheet();
      var rules = stylesheet.cssRules;
      if (!rules) {
        return cloned;
      }
      for (var i = 0, rulesLength = rules.length; i < rulesLength; i++) {
        var rule = rules[i];
        var ruleClone = cloned.cssRules[i] = new rule.constructor();
        var style = rule.style;
        if (style) {
          var styleClone = ruleClone.style = new CSSOM.CSSStyleDeclaration();
          for (var j = 0, styleLength = style.length; j < styleLength; j++) {
            var name = styleClone[j] = style[j];
            styleClone[name] = style[name];
            styleClone._importants[name] = style.getPropertyPriority(name);
          }
          styleClone.length = style.length;
        }
        if (rule.hasOwnProperty("keyText")) {
          ruleClone.keyText = rule.keyText;
        }
        if (rule.hasOwnProperty("selectorText")) {
          ruleClone.selectorText = rule.selectorText;
        }
        if (rule.hasOwnProperty("mediaText")) {
          ruleClone.mediaText = rule.mediaText;
        }
        if (rule.hasOwnProperty("conditionText")) {
          ruleClone.conditionText = rule.conditionText;
        }
        if (rule.hasOwnProperty("cssRules")) {
          ruleClone.cssRules = clone(rule).cssRules;
        }
      }
      return cloned;
    };
    exports.clone = CSSOM.clone;
  }
});
var require_lib = __commonJS({
  "node_modules/cssom/lib/index.js"(exports) {
    "use strict";
    exports.CSSStyleDeclaration = require_CSSStyleDeclaration().CSSStyleDeclaration;
    exports.CSSRule = require_CSSRule().CSSRule;
    exports.CSSGroupingRule = require_CSSGroupingRule().CSSGroupingRule;
    exports.CSSConditionRule = require_CSSConditionRule().CSSConditionRule;
    exports.CSSStyleRule = require_CSSStyleRule().CSSStyleRule;
    exports.MediaList = require_MediaList().MediaList;
    exports.CSSMediaRule = require_CSSMediaRule().CSSMediaRule;
    exports.CSSSupportsRule = require_CSSSupportsRule().CSSSupportsRule;
    exports.CSSImportRule = require_CSSImportRule().CSSImportRule;
    exports.CSSFontFaceRule = require_CSSFontFaceRule().CSSFontFaceRule;
    exports.CSSHostRule = require_CSSHostRule().CSSHostRule;
    exports.StyleSheet = require_StyleSheet().StyleSheet;
    exports.CSSStyleSheet = require_CSSStyleSheet().CSSStyleSheet;
    exports.CSSKeyframesRule = require_CSSKeyframesRule().CSSKeyframesRule;
    exports.CSSKeyframeRule = require_CSSKeyframeRule().CSSKeyframeRule;
    exports.MatcherList = require_MatcherList().MatcherList;
    exports.CSSDocumentRule = require_CSSDocumentRule().CSSDocumentRule;
    exports.CSSValue = require_CSSValue().CSSValue;
    exports.CSSValueExpression = require_CSSValueExpression().CSSValueExpression;
    exports.parse = require_parse().parse;
    exports.clone = require_clone().clone;
  }
});
var require_canvas_shim = __commonJS({
  "node_modules/linkedom/commonjs/canvas-shim.cjs"(exports, module) {
    var Canvas2 = class {
      constructor(width, height) {
        this.width = width;
        this.height = height;
      }
      getContext() {
        return null;
      }
      toDataURL() {
        return "";
      }
    };
    module.exports = {
      createCanvas: (width, height) => new Canvas2(width, height)
    };
  }
});
var require_canvas = __commonJS({
  "node_modules/linkedom/commonjs/canvas.cjs"(exports, module) {
    try {
      module.exports = __require2("canvas");
    } catch (fallback) {
      module.exports = require_canvas_shim();
    }
  }
});
var CHANGED = Symbol("changed");
var CLASS_LIST = Symbol("classList");
var CUSTOM_ELEMENTS = Symbol("CustomElements");
var CONTENT = Symbol("content");
var DATASET = Symbol("dataset");
var DOCTYPE = Symbol("doctype");
var DOM_PARSER = Symbol("DOMParser");
var END = Symbol("end");
var EVENT_TARGET = Symbol("EventTarget");
var GLOBALS = Symbol("globals");
var IMAGE = Symbol("image");
var MIME = Symbol("mime");
var MUTATION_OBSERVER = Symbol("MutationObserver");
var NEXT = Symbol("next");
var OWNER_ELEMENT = Symbol("ownerElement");
var PREV = Symbol("prev");
var PRIVATE = Symbol("private");
var SHEET = Symbol("sheet");
var START = Symbol("start");
var STYLE = Symbol("style");
var UPGRADE = Symbol("upgrade");
var VALUE = Symbol("value");
var esm_exports3 = {};
__export2(esm_exports3, {
  DefaultHandler: () => DomHandler,
  DomHandler: () => DomHandler,
  DomUtils: () => esm_exports2,
  ElementType: () => esm_exports,
  Parser: () => Parser,
  Tokenizer: () => Tokenizer,
  createDomStream: () => createDomStream,
  getFeed: () => getFeed,
  parseDOM: () => parseDOM,
  parseDocument: () => parseDocument,
  parseFeed: () => parseFeed
});
var decode_data_html_default = new Uint16Array(
  // prettier-ignore
  '\u1D41<\xD5\u0131\u028A\u049D\u057B\u05D0\u0675\u06DE\u07A2\u07D6\u080F\u0A4A\u0A91\u0DA1\u0E6D\u0F09\u0F26\u10CA\u1228\u12E1\u1415\u149D\u14C3\u14DF\u1525\0\0\0\0\0\0\u156B\u16CD\u198D\u1C12\u1DDD\u1F7E\u2060\u21B0\u228D\u23C0\u23FB\u2442\u2824\u2912\u2D08\u2E48\u2FCE\u3016\u32BA\u3639\u37AC\u38FE\u3A28\u3A71\u3AE0\u3B2E\u0800EMabcfglmnoprstu\\bfms\x7F\x84\x8B\x90\x95\x98\xA6\xB3\xB9\xC8\xCFlig\u803B\xC6\u40C6P\u803B&\u4026cute\u803B\xC1\u40C1reve;\u4102\u0100iyx}rc\u803B\xC2\u40C2;\u4410r;\uC000\u{1D504}rave\u803B\xC0\u40C0pha;\u4391acr;\u4100d;\u6A53\u0100gp\x9D\xA1on;\u4104f;\uC000\u{1D538}plyFunction;\u6061ing\u803B\xC5\u40C5\u0100cs\xBE\xC3r;\uC000\u{1D49C}ign;\u6254ilde\u803B\xC3\u40C3ml\u803B\xC4\u40C4\u0400aceforsu\xE5\xFB\xFE\u0117\u011C\u0122\u0127\u012A\u0100cr\xEA\xF2kslash;\u6216\u0176\xF6\xF8;\u6AE7ed;\u6306y;\u4411\u0180crt\u0105\u010B\u0114ause;\u6235noullis;\u612Ca;\u4392r;\uC000\u{1D505}pf;\uC000\u{1D539}eve;\u42D8c\xF2\u0113mpeq;\u624E\u0700HOacdefhilorsu\u014D\u0151\u0156\u0180\u019E\u01A2\u01B5\u01B7\u01BA\u01DC\u0215\u0273\u0278\u027Ecy;\u4427PY\u803B\xA9\u40A9\u0180cpy\u015D\u0162\u017Aute;\u4106\u0100;i\u0167\u0168\u62D2talDifferentialD;\u6145leys;\u612D\u0200aeio\u0189\u018E\u0194\u0198ron;\u410Cdil\u803B\xC7\u40C7rc;\u4108nint;\u6230ot;\u410A\u0100dn\u01A7\u01ADilla;\u40B8terDot;\u40B7\xF2\u017Fi;\u43A7rcle\u0200DMPT\u01C7\u01CB\u01D1\u01D6ot;\u6299inus;\u6296lus;\u6295imes;\u6297o\u0100cs\u01E2\u01F8kwiseContourIntegral;\u6232eCurly\u0100DQ\u0203\u020FoubleQuote;\u601Duote;\u6019\u0200lnpu\u021E\u0228\u0247\u0255on\u0100;e\u0225\u0226\u6237;\u6A74\u0180git\u022F\u0236\u023Aruent;\u6261nt;\u622FourIntegral;\u622E\u0100fr\u024C\u024E;\u6102oduct;\u6210nterClockwiseContourIntegral;\u6233oss;\u6A2Fcr;\uC000\u{1D49E}p\u0100;C\u0284\u0285\u62D3ap;\u624D\u0580DJSZacefios\u02A0\u02AC\u02B0\u02B4\u02B8\u02CB\u02D7\u02E1\u02E6\u0333\u048D\u0100;o\u0179\u02A5trahd;\u6911cy;\u4402cy;\u4405cy;\u440F\u0180grs\u02BF\u02C4\u02C7ger;\u6021r;\u61A1hv;\u6AE4\u0100ay\u02D0\u02D5ron;\u410E;\u4414l\u0100;t\u02DD\u02DE\u6207a;\u4394r;\uC000\u{1D507}\u0100af\u02EB\u0327\u0100cm\u02F0\u0322ritical\u0200ADGT\u0300\u0306\u0316\u031Ccute;\u40B4o\u0174\u030B\u030D;\u42D9bleAcute;\u42DDrave;\u4060ilde;\u42DCond;\u62C4ferentialD;\u6146\u0470\u033D\0\0\0\u0342\u0354\0\u0405f;\uC000\u{1D53B}\u0180;DE\u0348\u0349\u034D\u40A8ot;\u60DCqual;\u6250ble\u0300CDLRUV\u0363\u0372\u0382\u03CF\u03E2\u03F8ontourIntegra\xEC\u0239o\u0274\u0379\0\0\u037B\xBB\u0349nArrow;\u61D3\u0100eo\u0387\u03A4ft\u0180ART\u0390\u0396\u03A1rrow;\u61D0ightArrow;\u61D4e\xE5\u02CAng\u0100LR\u03AB\u03C4eft\u0100AR\u03B3\u03B9rrow;\u67F8ightArrow;\u67FAightArrow;\u67F9ight\u0100AT\u03D8\u03DErrow;\u61D2ee;\u62A8p\u0241\u03E9\0\0\u03EFrrow;\u61D1ownArrow;\u61D5erticalBar;\u6225n\u0300ABLRTa\u0412\u042A\u0430\u045E\u047F\u037Crrow\u0180;BU\u041D\u041E\u0422\u6193ar;\u6913pArrow;\u61F5reve;\u4311eft\u02D2\u043A\0\u0446\0\u0450ightVector;\u6950eeVector;\u695Eector\u0100;B\u0459\u045A\u61BDar;\u6956ight\u01D4\u0467\0\u0471eeVector;\u695Fector\u0100;B\u047A\u047B\u61C1ar;\u6957ee\u0100;A\u0486\u0487\u62A4rrow;\u61A7\u0100ct\u0492\u0497r;\uC000\u{1D49F}rok;\u4110\u0800NTacdfglmopqstux\u04BD\u04C0\u04C4\u04CB\u04DE\u04E2\u04E7\u04EE\u04F5\u0521\u052F\u0536\u0552\u055D\u0560\u0565G;\u414AH\u803B\xD0\u40D0cute\u803B\xC9\u40C9\u0180aiy\u04D2\u04D7\u04DCron;\u411Arc\u803B\xCA\u40CA;\u442Dot;\u4116r;\uC000\u{1D508}rave\u803B\xC8\u40C8ement;\u6208\u0100ap\u04FA\u04FEcr;\u4112ty\u0253\u0506\0\0\u0512mallSquare;\u65FBerySmallSquare;\u65AB\u0100gp\u0526\u052Aon;\u4118f;\uC000\u{1D53C}silon;\u4395u\u0100ai\u053C\u0549l\u0100;T\u0542\u0543\u6A75ilde;\u6242librium;\u61CC\u0100ci\u0557\u055Ar;\u6130m;\u6A73a;\u4397ml\u803B\xCB\u40CB\u0100ip\u056A\u056Fsts;\u6203onentialE;\u6147\u0280cfios\u0585\u0588\u058D\u05B2\u05CCy;\u4424r;\uC000\u{1D509}lled\u0253\u0597\0\0\u05A3mallSquare;\u65FCerySmallSquare;\u65AA\u0370\u05BA\0\u05BF\0\0\u05C4f;\uC000\u{1D53D}All;\u6200riertrf;\u6131c\xF2\u05CB\u0600JTabcdfgorst\u05E8\u05EC\u05EF\u05FA\u0600\u0612\u0616\u061B\u061D\u0623\u066C\u0672cy;\u4403\u803B>\u403Emma\u0100;d\u05F7\u05F8\u4393;\u43DCreve;\u411E\u0180eiy\u0607\u060C\u0610dil;\u4122rc;\u411C;\u4413ot;\u4120r;\uC000\u{1D50A};\u62D9pf;\uC000\u{1D53E}eater\u0300EFGLST\u0635\u0644\u064E\u0656\u065B\u0666qual\u0100;L\u063E\u063F\u6265ess;\u62DBullEqual;\u6267reater;\u6AA2ess;\u6277lantEqual;\u6A7Eilde;\u6273cr;\uC000\u{1D4A2};\u626B\u0400Aacfiosu\u0685\u068B\u0696\u069B\u069E\u06AA\u06BE\u06CARDcy;\u442A\u0100ct\u0690\u0694ek;\u42C7;\u405Eirc;\u4124r;\u610ClbertSpace;\u610B\u01F0\u06AF\0\u06B2f;\u610DizontalLine;\u6500\u0100ct\u06C3\u06C5\xF2\u06A9rok;\u4126mp\u0144\u06D0\u06D8ownHum\xF0\u012Fqual;\u624F\u0700EJOacdfgmnostu\u06FA\u06FE\u0703\u0707\u070E\u071A\u071E\u0721\u0728\u0744\u0778\u078B\u078F\u0795cy;\u4415lig;\u4132cy;\u4401cute\u803B\xCD\u40CD\u0100iy\u0713\u0718rc\u803B\xCE\u40CE;\u4418ot;\u4130r;\u6111rave\u803B\xCC\u40CC\u0180;ap\u0720\u072F\u073F\u0100cg\u0734\u0737r;\u412AinaryI;\u6148lie\xF3\u03DD\u01F4\u0749\0\u0762\u0100;e\u074D\u074E\u622C\u0100gr\u0753\u0758ral;\u622Bsection;\u62C2isible\u0100CT\u076C\u0772omma;\u6063imes;\u6062\u0180gpt\u077F\u0783\u0788on;\u412Ef;\uC000\u{1D540}a;\u4399cr;\u6110ilde;\u4128\u01EB\u079A\0\u079Ecy;\u4406l\u803B\xCF\u40CF\u0280cfosu\u07AC\u07B7\u07BC\u07C2\u07D0\u0100iy\u07B1\u07B5rc;\u4134;\u4419r;\uC000\u{1D50D}pf;\uC000\u{1D541}\u01E3\u07C7\0\u07CCr;\uC000\u{1D4A5}rcy;\u4408kcy;\u4404\u0380HJacfos\u07E4\u07E8\u07EC\u07F1\u07FD\u0802\u0808cy;\u4425cy;\u440Cppa;\u439A\u0100ey\u07F6\u07FBdil;\u4136;\u441Ar;\uC000\u{1D50E}pf;\uC000\u{1D542}cr;\uC000\u{1D4A6}\u0580JTaceflmost\u0825\u0829\u082C\u0850\u0863\u09B3\u09B8\u09C7\u09CD\u0A37\u0A47cy;\u4409\u803B<\u403C\u0280cmnpr\u0837\u083C\u0841\u0844\u084Dute;\u4139bda;\u439Bg;\u67EAlacetrf;\u6112r;\u619E\u0180aey\u0857\u085C\u0861ron;\u413Ddil;\u413B;\u441B\u0100fs\u0868\u0970t\u0500ACDFRTUVar\u087E\u08A9\u08B1\u08E0\u08E6\u08FC\u092F\u095B\u0390\u096A\u0100nr\u0883\u088FgleBracket;\u67E8row\u0180;BR\u0899\u089A\u089E\u6190ar;\u61E4ightArrow;\u61C6eiling;\u6308o\u01F5\u08B7\0\u08C3bleBracket;\u67E6n\u01D4\u08C8\0\u08D2eeVector;\u6961ector\u0100;B\u08DB\u08DC\u61C3ar;\u6959loor;\u630Aight\u0100AV\u08EF\u08F5rrow;\u6194ector;\u694E\u0100er\u0901\u0917e\u0180;AV\u0909\u090A\u0910\u62A3rrow;\u61A4ector;\u695Aiangle\u0180;BE\u0924\u0925\u0929\u62B2ar;\u69CFqual;\u62B4p\u0180DTV\u0937\u0942\u094CownVector;\u6951eeVector;\u6960ector\u0100;B\u0956\u0957\u61BFar;\u6958ector\u0100;B\u0965\u0966\u61BCar;\u6952ight\xE1\u039Cs\u0300EFGLST\u097E\u098B\u0995\u099D\u09A2\u09ADqualGreater;\u62DAullEqual;\u6266reater;\u6276ess;\u6AA1lantEqual;\u6A7Dilde;\u6272r;\uC000\u{1D50F}\u0100;e\u09BD\u09BE\u62D8ftarrow;\u61DAidot;\u413F\u0180npw\u09D4\u0A16\u0A1Bg\u0200LRlr\u09DE\u09F7\u0A02\u0A10eft\u0100AR\u09E6\u09ECrrow;\u67F5ightArrow;\u67F7ightArrow;\u67F6eft\u0100ar\u03B3\u0A0Aight\xE1\u03BFight\xE1\u03CAf;\uC000\u{1D543}er\u0100LR\u0A22\u0A2CeftArrow;\u6199ightArrow;\u6198\u0180cht\u0A3E\u0A40\u0A42\xF2\u084C;\u61B0rok;\u4141;\u626A\u0400acefiosu\u0A5A\u0A5D\u0A60\u0A77\u0A7C\u0A85\u0A8B\u0A8Ep;\u6905y;\u441C\u0100dl\u0A65\u0A6FiumSpace;\u605Flintrf;\u6133r;\uC000\u{1D510}nusPlus;\u6213pf;\uC000\u{1D544}c\xF2\u0A76;\u439C\u0480Jacefostu\u0AA3\u0AA7\u0AAD\u0AC0\u0B14\u0B19\u0D91\u0D97\u0D9Ecy;\u440Acute;\u4143\u0180aey\u0AB4\u0AB9\u0ABEron;\u4147dil;\u4145;\u441D\u0180gsw\u0AC7\u0AF0\u0B0Eative\u0180MTV\u0AD3\u0ADF\u0AE8ediumSpace;\u600Bhi\u0100cn\u0AE6\u0AD8\xEB\u0AD9eryThi\xEE\u0AD9ted\u0100GL\u0AF8\u0B06reaterGreate\xF2\u0673essLes\xF3\u0A48Line;\u400Ar;\uC000\u{1D511}\u0200Bnpt\u0B22\u0B28\u0B37\u0B3Areak;\u6060BreakingSpace;\u40A0f;\u6115\u0680;CDEGHLNPRSTV\u0B55\u0B56\u0B6A\u0B7C\u0BA1\u0BEB\u0C04\u0C5E\u0C84\u0CA6\u0CD8\u0D61\u0D85\u6AEC\u0100ou\u0B5B\u0B64ngruent;\u6262pCap;\u626DoubleVerticalBar;\u6226\u0180lqx\u0B83\u0B8A\u0B9Bement;\u6209ual\u0100;T\u0B92\u0B93\u6260ilde;\uC000\u2242\u0338ists;\u6204reater\u0380;EFGLST\u0BB6\u0BB7\u0BBD\u0BC9\u0BD3\u0BD8\u0BE5\u626Fqual;\u6271ullEqual;\uC000\u2267\u0338reater;\uC000\u226B\u0338ess;\u6279lantEqual;\uC000\u2A7E\u0338ilde;\u6275ump\u0144\u0BF2\u0BFDownHump;\uC000\u224E\u0338qual;\uC000\u224F\u0338e\u0100fs\u0C0A\u0C27tTriangle\u0180;BE\u0C1A\u0C1B\u0C21\u62EAar;\uC000\u29CF\u0338qual;\u62ECs\u0300;EGLST\u0C35\u0C36\u0C3C\u0C44\u0C4B\u0C58\u626Equal;\u6270reater;\u6278ess;\uC000\u226A\u0338lantEqual;\uC000\u2A7D\u0338ilde;\u6274ested\u0100GL\u0C68\u0C79reaterGreater;\uC000\u2AA2\u0338essLess;\uC000\u2AA1\u0338recedes\u0180;ES\u0C92\u0C93\u0C9B\u6280qual;\uC000\u2AAF\u0338lantEqual;\u62E0\u0100ei\u0CAB\u0CB9verseElement;\u620CghtTriangle\u0180;BE\u0CCB\u0CCC\u0CD2\u62EBar;\uC000\u29D0\u0338qual;\u62ED\u0100qu\u0CDD\u0D0CuareSu\u0100bp\u0CE8\u0CF9set\u0100;E\u0CF0\u0CF3\uC000\u228F\u0338qual;\u62E2erset\u0100;E\u0D03\u0D06\uC000\u2290\u0338qual;\u62E3\u0180bcp\u0D13\u0D24\u0D4Eset\u0100;E\u0D1B\u0D1E\uC000\u2282\u20D2qual;\u6288ceeds\u0200;EST\u0D32\u0D33\u0D3B\u0D46\u6281qual;\uC000\u2AB0\u0338lantEqual;\u62E1ilde;\uC000\u227F\u0338erset\u0100;E\u0D58\u0D5B\uC000\u2283\u20D2qual;\u6289ilde\u0200;EFT\u0D6E\u0D6F\u0D75\u0D7F\u6241qual;\u6244ullEqual;\u6247ilde;\u6249erticalBar;\u6224cr;\uC000\u{1D4A9}ilde\u803B\xD1\u40D1;\u439D\u0700Eacdfgmoprstuv\u0DBD\u0DC2\u0DC9\u0DD5\u0DDB\u0DE0\u0DE7\u0DFC\u0E02\u0E20\u0E22\u0E32\u0E3F\u0E44lig;\u4152cute\u803B\xD3\u40D3\u0100iy\u0DCE\u0DD3rc\u803B\xD4\u40D4;\u441Eblac;\u4150r;\uC000\u{1D512}rave\u803B\xD2\u40D2\u0180aei\u0DEE\u0DF2\u0DF6cr;\u414Cga;\u43A9cron;\u439Fpf;\uC000\u{1D546}enCurly\u0100DQ\u0E0E\u0E1AoubleQuote;\u601Cuote;\u6018;\u6A54\u0100cl\u0E27\u0E2Cr;\uC000\u{1D4AA}ash\u803B\xD8\u40D8i\u016C\u0E37\u0E3Cde\u803B\xD5\u40D5es;\u6A37ml\u803B\xD6\u40D6er\u0100BP\u0E4B\u0E60\u0100ar\u0E50\u0E53r;\u603Eac\u0100ek\u0E5A\u0E5C;\u63DEet;\u63B4arenthesis;\u63DC\u0480acfhilors\u0E7F\u0E87\u0E8A\u0E8F\u0E92\u0E94\u0E9D\u0EB0\u0EFCrtialD;\u6202y;\u441Fr;\uC000\u{1D513}i;\u43A6;\u43A0usMinus;\u40B1\u0100ip\u0EA2\u0EADncareplan\xE5\u069Df;\u6119\u0200;eio\u0EB9\u0EBA\u0EE0\u0EE4\u6ABBcedes\u0200;EST\u0EC8\u0EC9\u0ECF\u0EDA\u627Aqual;\u6AAFlantEqual;\u627Cilde;\u627Eme;\u6033\u0100dp\u0EE9\u0EEEuct;\u620Fortion\u0100;a\u0225\u0EF9l;\u621D\u0100ci\u0F01\u0F06r;\uC000\u{1D4AB};\u43A8\u0200Ufos\u0F11\u0F16\u0F1B\u0F1FOT\u803B"\u4022r;\uC000\u{1D514}pf;\u611Acr;\uC000\u{1D4AC}\u0600BEacefhiorsu\u0F3E\u0F43\u0F47\u0F60\u0F73\u0FA7\u0FAA\u0FAD\u1096\u10A9\u10B4\u10BEarr;\u6910G\u803B\xAE\u40AE\u0180cnr\u0F4E\u0F53\u0F56ute;\u4154g;\u67EBr\u0100;t\u0F5C\u0F5D\u61A0l;\u6916\u0180aey\u0F67\u0F6C\u0F71ron;\u4158dil;\u4156;\u4420\u0100;v\u0F78\u0F79\u611Cerse\u0100EU\u0F82\u0F99\u0100lq\u0F87\u0F8Eement;\u620Builibrium;\u61CBpEquilibrium;\u696Fr\xBB\u0F79o;\u43A1ght\u0400ACDFTUVa\u0FC1\u0FEB\u0FF3\u1022\u1028\u105B\u1087\u03D8\u0100nr\u0FC6\u0FD2gleBracket;\u67E9row\u0180;BL\u0FDC\u0FDD\u0FE1\u6192ar;\u61E5eftArrow;\u61C4eiling;\u6309o\u01F5\u0FF9\0\u1005bleBracket;\u67E7n\u01D4\u100A\0\u1014eeVector;\u695Dector\u0100;B\u101D\u101E\u61C2ar;\u6955loor;\u630B\u0100er\u102D\u1043e\u0180;AV\u1035\u1036\u103C\u62A2rrow;\u61A6ector;\u695Biangle\u0180;BE\u1050\u1051\u1055\u62B3ar;\u69D0qual;\u62B5p\u0180DTV\u1063\u106E\u1078ownVector;\u694FeeVector;\u695Cector\u0100;B\u1082\u1083\u61BEar;\u6954ector\u0100;B\u1091\u1092\u61C0ar;\u6953\u0100pu\u109B\u109Ef;\u611DndImplies;\u6970ightarrow;\u61DB\u0100ch\u10B9\u10BCr;\u611B;\u61B1leDelayed;\u69F4\u0680HOacfhimoqstu\u10E4\u10F1\u10F7\u10FD\u1119\u111E\u1151\u1156\u1161\u1167\u11B5\u11BB\u11BF\u0100Cc\u10E9\u10EEHcy;\u4429y;\u4428FTcy;\u442Ccute;\u415A\u0280;aeiy\u1108\u1109\u110E\u1113\u1117\u6ABCron;\u4160dil;\u415Erc;\u415C;\u4421r;\uC000\u{1D516}ort\u0200DLRU\u112A\u1134\u113E\u1149ownArrow\xBB\u041EeftArrow\xBB\u089AightArrow\xBB\u0FDDpArrow;\u6191gma;\u43A3allCircle;\u6218pf;\uC000\u{1D54A}\u0272\u116D\0\0\u1170t;\u621Aare\u0200;ISU\u117B\u117C\u1189\u11AF\u65A1ntersection;\u6293u\u0100bp\u118F\u119Eset\u0100;E\u1197\u1198\u628Fqual;\u6291erset\u0100;E\u11A8\u11A9\u6290qual;\u6292nion;\u6294cr;\uC000\u{1D4AE}ar;\u62C6\u0200bcmp\u11C8\u11DB\u1209\u120B\u0100;s\u11CD\u11CE\u62D0et\u0100;E\u11CD\u11D5qual;\u6286\u0100ch\u11E0\u1205eeds\u0200;EST\u11ED\u11EE\u11F4\u11FF\u627Bqual;\u6AB0lantEqual;\u627Dilde;\u627FTh\xE1\u0F8C;\u6211\u0180;es\u1212\u1213\u1223\u62D1rset\u0100;E\u121C\u121D\u6283qual;\u6287et\xBB\u1213\u0580HRSacfhiors\u123E\u1244\u1249\u1255\u125E\u1271\u1276\u129F\u12C2\u12C8\u12D1ORN\u803B\xDE\u40DEADE;\u6122\u0100Hc\u124E\u1252cy;\u440By;\u4426\u0100bu\u125A\u125C;\u4009;\u43A4\u0180aey\u1265\u126A\u126Fron;\u4164dil;\u4162;\u4422r;\uC000\u{1D517}\u0100ei\u127B\u1289\u01F2\u1280\0\u1287efore;\u6234a;\u4398\u0100cn\u128E\u1298kSpace;\uC000\u205F\u200ASpace;\u6009lde\u0200;EFT\u12AB\u12AC\u12B2\u12BC\u623Cqual;\u6243ullEqual;\u6245ilde;\u6248pf;\uC000\u{1D54B}ipleDot;\u60DB\u0100ct\u12D6\u12DBr;\uC000\u{1D4AF}rok;\u4166\u0AE1\u12F7\u130E\u131A\u1326\0\u132C\u1331\0\0\0\0\0\u1338\u133D\u1377\u1385\0\u13FF\u1404\u140A\u1410\u0100cr\u12FB\u1301ute\u803B\xDA\u40DAr\u0100;o\u1307\u1308\u619Fcir;\u6949r\u01E3\u1313\0\u1316y;\u440Eve;\u416C\u0100iy\u131E\u1323rc\u803B\xDB\u40DB;\u4423blac;\u4170r;\uC000\u{1D518}rave\u803B\xD9\u40D9acr;\u416A\u0100di\u1341\u1369er\u0100BP\u1348\u135D\u0100ar\u134D\u1350r;\u405Fac\u0100ek\u1357\u1359;\u63DFet;\u63B5arenthesis;\u63DDon\u0100;P\u1370\u1371\u62C3lus;\u628E\u0100gp\u137B\u137Fon;\u4172f;\uC000\u{1D54C}\u0400ADETadps\u1395\u13AE\u13B8\u13C4\u03E8\u13D2\u13D7\u13F3rrow\u0180;BD\u1150\u13A0\u13A4ar;\u6912ownArrow;\u61C5ownArrow;\u6195quilibrium;\u696Eee\u0100;A\u13CB\u13CC\u62A5rrow;\u61A5own\xE1\u03F3er\u0100LR\u13DE\u13E8eftArrow;\u6196ightArrow;\u6197i\u0100;l\u13F9\u13FA\u43D2on;\u43A5ing;\u416Ecr;\uC000\u{1D4B0}ilde;\u4168ml\u803B\xDC\u40DC\u0480Dbcdefosv\u1427\u142C\u1430\u1433\u143E\u1485\u148A\u1490\u1496ash;\u62ABar;\u6AEBy;\u4412ash\u0100;l\u143B\u143C\u62A9;\u6AE6\u0100er\u1443\u1445;\u62C1\u0180bty\u144C\u1450\u147Aar;\u6016\u0100;i\u144F\u1455cal\u0200BLST\u1461\u1465\u146A\u1474ar;\u6223ine;\u407Ceparator;\u6758ilde;\u6240ThinSpace;\u600Ar;\uC000\u{1D519}pf;\uC000\u{1D54D}cr;\uC000\u{1D4B1}dash;\u62AA\u0280cefos\u14A7\u14AC\u14B1\u14B6\u14BCirc;\u4174dge;\u62C0r;\uC000\u{1D51A}pf;\uC000\u{1D54E}cr;\uC000\u{1D4B2}\u0200fios\u14CB\u14D0\u14D2\u14D8r;\uC000\u{1D51B};\u439Epf;\uC000\u{1D54F}cr;\uC000\u{1D4B3}\u0480AIUacfosu\u14F1\u14F5\u14F9\u14FD\u1504\u150F\u1514\u151A\u1520cy;\u442Fcy;\u4407cy;\u442Ecute\u803B\xDD\u40DD\u0100iy\u1509\u150Drc;\u4176;\u442Br;\uC000\u{1D51C}pf;\uC000\u{1D550}cr;\uC000\u{1D4B4}ml;\u4178\u0400Hacdefos\u1535\u1539\u153F\u154B\u154F\u155D\u1560\u1564cy;\u4416cute;\u4179\u0100ay\u1544\u1549ron;\u417D;\u4417ot;\u417B\u01F2\u1554\0\u155BoWidt\xE8\u0AD9a;\u4396r;\u6128pf;\u6124cr;\uC000\u{1D4B5}\u0BE1\u1583\u158A\u1590\0\u15B0\u15B6\u15BF\0\0\0\0\u15C6\u15DB\u15EB\u165F\u166D\0\u1695\u169B\u16B2\u16B9\0\u16BEcute\u803B\xE1\u40E1reve;\u4103\u0300;Ediuy\u159C\u159D\u15A1\u15A3\u15A8\u15AD\u623E;\uC000\u223E\u0333;\u623Frc\u803B\xE2\u40E2te\u80BB\xB4\u0306;\u4430lig\u803B\xE6\u40E6\u0100;r\xB2\u15BA;\uC000\u{1D51E}rave\u803B\xE0\u40E0\u0100ep\u15CA\u15D6\u0100fp\u15CF\u15D4sym;\u6135\xE8\u15D3ha;\u43B1\u0100ap\u15DFc\u0100cl\u15E4\u15E7r;\u4101g;\u6A3F\u0264\u15F0\0\0\u160A\u0280;adsv\u15FA\u15FB\u15FF\u1601\u1607\u6227nd;\u6A55;\u6A5Clope;\u6A58;\u6A5A\u0380;elmrsz\u1618\u1619\u161B\u161E\u163F\u164F\u1659\u6220;\u69A4e\xBB\u1619sd\u0100;a\u1625\u1626\u6221\u0461\u1630\u1632\u1634\u1636\u1638\u163A\u163C\u163E;\u69A8;\u69A9;\u69AA;\u69AB;\u69AC;\u69AD;\u69AE;\u69AFt\u0100;v\u1645\u1646\u621Fb\u0100;d\u164C\u164D\u62BE;\u699D\u0100pt\u1654\u1657h;\u6222\xBB\xB9arr;\u637C\u0100gp\u1663\u1667on;\u4105f;\uC000\u{1D552}\u0380;Eaeiop\u12C1\u167B\u167D\u1682\u1684\u1687\u168A;\u6A70cir;\u6A6F;\u624Ad;\u624Bs;\u4027rox\u0100;e\u12C1\u1692\xF1\u1683ing\u803B\xE5\u40E5\u0180cty\u16A1\u16A6\u16A8r;\uC000\u{1D4B6};\u402Amp\u0100;e\u12C1\u16AF\xF1\u0288ilde\u803B\xE3\u40E3ml\u803B\xE4\u40E4\u0100ci\u16C2\u16C8onin\xF4\u0272nt;\u6A11\u0800Nabcdefiklnoprsu\u16ED\u16F1\u1730\u173C\u1743\u1748\u1778\u177D\u17E0\u17E6\u1839\u1850\u170D\u193D\u1948\u1970ot;\u6AED\u0100cr\u16F6\u171Ek\u0200ceps\u1700\u1705\u170D\u1713ong;\u624Cpsilon;\u43F6rime;\u6035im\u0100;e\u171A\u171B\u623Dq;\u62CD\u0176\u1722\u1726ee;\u62BDed\u0100;g\u172C\u172D\u6305e\xBB\u172Drk\u0100;t\u135C\u1737brk;\u63B6\u0100oy\u1701\u1741;\u4431quo;\u601E\u0280cmprt\u1753\u175B\u1761\u1764\u1768aus\u0100;e\u010A\u0109ptyv;\u69B0s\xE9\u170Cno\xF5\u0113\u0180ahw\u176F\u1771\u1773;\u43B2;\u6136een;\u626Cr;\uC000\u{1D51F}g\u0380costuvw\u178D\u179D\u17B3\u17C1\u17D5\u17DB\u17DE\u0180aiu\u1794\u1796\u179A\xF0\u0760rc;\u65EFp\xBB\u1371\u0180dpt\u17A4\u17A8\u17ADot;\u6A00lus;\u6A01imes;\u6A02\u0271\u17B9\0\0\u17BEcup;\u6A06ar;\u6605riangle\u0100du\u17CD\u17D2own;\u65BDp;\u65B3plus;\u6A04e\xE5\u1444\xE5\u14ADarow;\u690D\u0180ako\u17ED\u1826\u1835\u0100cn\u17F2\u1823k\u0180lst\u17FA\u05AB\u1802ozenge;\u69EBriangle\u0200;dlr\u1812\u1813\u1818\u181D\u65B4own;\u65BEeft;\u65C2ight;\u65B8k;\u6423\u01B1\u182B\0\u1833\u01B2\u182F\0\u1831;\u6592;\u65914;\u6593ck;\u6588\u0100eo\u183E\u184D\u0100;q\u1843\u1846\uC000=\u20E5uiv;\uC000\u2261\u20E5t;\u6310\u0200ptwx\u1859\u185E\u1867\u186Cf;\uC000\u{1D553}\u0100;t\u13CB\u1863om\xBB\u13CCtie;\u62C8\u0600DHUVbdhmptuv\u1885\u1896\u18AA\u18BB\u18D7\u18DB\u18EC\u18FF\u1905\u190A\u1910\u1921\u0200LRlr\u188E\u1890\u1892\u1894;\u6557;\u6554;\u6556;\u6553\u0280;DUdu\u18A1\u18A2\u18A4\u18A6\u18A8\u6550;\u6566;\u6569;\u6564;\u6567\u0200LRlr\u18B3\u18B5\u18B7\u18B9;\u655D;\u655A;\u655C;\u6559\u0380;HLRhlr\u18CA\u18CB\u18CD\u18CF\u18D1\u18D3\u18D5\u6551;\u656C;\u6563;\u6560;\u656B;\u6562;\u655Fox;\u69C9\u0200LRlr\u18E4\u18E6\u18E8\u18EA;\u6555;\u6552;\u6510;\u650C\u0280;DUdu\u06BD\u18F7\u18F9\u18FB\u18FD;\u6565;\u6568;\u652C;\u6534inus;\u629Flus;\u629Eimes;\u62A0\u0200LRlr\u1919\u191B\u191D\u191F;\u655B;\u6558;\u6518;\u6514\u0380;HLRhlr\u1930\u1931\u1933\u1935\u1937\u1939\u193B\u6502;\u656A;\u6561;\u655E;\u653C;\u6524;\u651C\u0100ev\u0123\u1942bar\u803B\xA6\u40A6\u0200ceio\u1951\u1956\u195A\u1960r;\uC000\u{1D4B7}mi;\u604Fm\u0100;e\u171A\u171Cl\u0180;bh\u1968\u1969\u196B\u405C;\u69C5sub;\u67C8\u016C\u1974\u197El\u0100;e\u1979\u197A\u6022t\xBB\u197Ap\u0180;Ee\u012F\u1985\u1987;\u6AAE\u0100;q\u06DC\u06DB\u0CE1\u19A7\0\u19E8\u1A11\u1A15\u1A32\0\u1A37\u1A50\0\0\u1AB4\0\0\u1AC1\0\0\u1B21\u1B2E\u1B4D\u1B52\0\u1BFD\0\u1C0C\u0180cpr\u19AD\u19B2\u19DDute;\u4107\u0300;abcds\u19BF\u19C0\u19C4\u19CA\u19D5\u19D9\u6229nd;\u6A44rcup;\u6A49\u0100au\u19CF\u19D2p;\u6A4Bp;\u6A47ot;\u6A40;\uC000\u2229\uFE00\u0100eo\u19E2\u19E5t;\u6041\xEE\u0693\u0200aeiu\u19F0\u19FB\u1A01\u1A05\u01F0\u19F5\0\u19F8s;\u6A4Don;\u410Ddil\u803B\xE7\u40E7rc;\u4109ps\u0100;s\u1A0C\u1A0D\u6A4Cm;\u6A50ot;\u410B\u0180dmn\u1A1B\u1A20\u1A26il\u80BB\xB8\u01ADptyv;\u69B2t\u8100\xA2;e\u1A2D\u1A2E\u40A2r\xE4\u01B2r;\uC000\u{1D520}\u0180cei\u1A3D\u1A40\u1A4Dy;\u4447ck\u0100;m\u1A47\u1A48\u6713ark\xBB\u1A48;\u43C7r\u0380;Ecefms\u1A5F\u1A60\u1A62\u1A6B\u1AA4\u1AAA\u1AAE\u65CB;\u69C3\u0180;el\u1A69\u1A6A\u1A6D\u42C6q;\u6257e\u0261\u1A74\0\0\u1A88rrow\u0100lr\u1A7C\u1A81eft;\u61BAight;\u61BB\u0280RSacd\u1A92\u1A94\u1A96\u1A9A\u1A9F\xBB\u0F47;\u64C8st;\u629Birc;\u629Aash;\u629Dnint;\u6A10id;\u6AEFcir;\u69C2ubs\u0100;u\u1ABB\u1ABC\u6663it\xBB\u1ABC\u02EC\u1AC7\u1AD4\u1AFA\0\u1B0Aon\u0100;e\u1ACD\u1ACE\u403A\u0100;q\xC7\xC6\u026D\u1AD9\0\0\u1AE2a\u0100;t\u1ADE\u1ADF\u402C;\u4040\u0180;fl\u1AE8\u1AE9\u1AEB\u6201\xEE\u1160e\u0100mx\u1AF1\u1AF6ent\xBB\u1AE9e\xF3\u024D\u01E7\u1AFE\0\u1B07\u0100;d\u12BB\u1B02ot;\u6A6Dn\xF4\u0246\u0180fry\u1B10\u1B14\u1B17;\uC000\u{1D554}o\xE4\u0254\u8100\xA9;s\u0155\u1B1Dr;\u6117\u0100ao\u1B25\u1B29rr;\u61B5ss;\u6717\u0100cu\u1B32\u1B37r;\uC000\u{1D4B8}\u0100bp\u1B3C\u1B44\u0100;e\u1B41\u1B42\u6ACF;\u6AD1\u0100;e\u1B49\u1B4A\u6AD0;\u6AD2dot;\u62EF\u0380delprvw\u1B60\u1B6C\u1B77\u1B82\u1BAC\u1BD4\u1BF9arr\u0100lr\u1B68\u1B6A;\u6938;\u6935\u0270\u1B72\0\0\u1B75r;\u62DEc;\u62DFarr\u0100;p\u1B7F\u1B80\u61B6;\u693D\u0300;bcdos\u1B8F\u1B90\u1B96\u1BA1\u1BA5\u1BA8\u622Arcap;\u6A48\u0100au\u1B9B\u1B9Ep;\u6A46p;\u6A4Aot;\u628Dr;\u6A45;\uC000\u222A\uFE00\u0200alrv\u1BB5\u1BBF\u1BDE\u1BE3rr\u0100;m\u1BBC\u1BBD\u61B7;\u693Cy\u0180evw\u1BC7\u1BD4\u1BD8q\u0270\u1BCE\0\0\u1BD2re\xE3\u1B73u\xE3\u1B75ee;\u62CEedge;\u62CFen\u803B\xA4\u40A4earrow\u0100lr\u1BEE\u1BF3eft\xBB\u1B80ight\xBB\u1BBDe\xE4\u1BDD\u0100ci\u1C01\u1C07onin\xF4\u01F7nt;\u6231lcty;\u632D\u0980AHabcdefhijlorstuwz\u1C38\u1C3B\u1C3F\u1C5D\u1C69\u1C75\u1C8A\u1C9E\u1CAC\u1CB7\u1CFB\u1CFF\u1D0D\u1D7B\u1D91\u1DAB\u1DBB\u1DC6\u1DCDr\xF2\u0381ar;\u6965\u0200glrs\u1C48\u1C4D\u1C52\u1C54ger;\u6020eth;\u6138\xF2\u1133h\u0100;v\u1C5A\u1C5B\u6010\xBB\u090A\u016B\u1C61\u1C67arow;\u690Fa\xE3\u0315\u0100ay\u1C6E\u1C73ron;\u410F;\u4434\u0180;ao\u0332\u1C7C\u1C84\u0100gr\u02BF\u1C81r;\u61CAtseq;\u6A77\u0180glm\u1C91\u1C94\u1C98\u803B\xB0\u40B0ta;\u43B4ptyv;\u69B1\u0100ir\u1CA3\u1CA8sht;\u697F;\uC000\u{1D521}ar\u0100lr\u1CB3\u1CB5\xBB\u08DC\xBB\u101E\u0280aegsv\u1CC2\u0378\u1CD6\u1CDC\u1CE0m\u0180;os\u0326\u1CCA\u1CD4nd\u0100;s\u0326\u1CD1uit;\u6666amma;\u43DDin;\u62F2\u0180;io\u1CE7\u1CE8\u1CF8\u40F7de\u8100\xF7;o\u1CE7\u1CF0ntimes;\u62C7n\xF8\u1CF7cy;\u4452c\u026F\u1D06\0\0\u1D0Arn;\u631Eop;\u630D\u0280lptuw\u1D18\u1D1D\u1D22\u1D49\u1D55lar;\u4024f;\uC000\u{1D555}\u0280;emps\u030B\u1D2D\u1D37\u1D3D\u1D42q\u0100;d\u0352\u1D33ot;\u6251inus;\u6238lus;\u6214quare;\u62A1blebarwedg\xE5\xFAn\u0180adh\u112E\u1D5D\u1D67ownarrow\xF3\u1C83arpoon\u0100lr\u1D72\u1D76ef\xF4\u1CB4igh\xF4\u1CB6\u0162\u1D7F\u1D85karo\xF7\u0F42\u026F\u1D8A\0\0\u1D8Ern;\u631Fop;\u630C\u0180cot\u1D98\u1DA3\u1DA6\u0100ry\u1D9D\u1DA1;\uC000\u{1D4B9};\u4455l;\u69F6rok;\u4111\u0100dr\u1DB0\u1DB4ot;\u62F1i\u0100;f\u1DBA\u1816\u65BF\u0100ah\u1DC0\u1DC3r\xF2\u0429a\xF2\u0FA6angle;\u69A6\u0100ci\u1DD2\u1DD5y;\u445Fgrarr;\u67FF\u0900Dacdefglmnopqrstux\u1E01\u1E09\u1E19\u1E38\u0578\u1E3C\u1E49\u1E61\u1E7E\u1EA5\u1EAF\u1EBD\u1EE1\u1F2A\u1F37\u1F44\u1F4E\u1F5A\u0100Do\u1E06\u1D34o\xF4\u1C89\u0100cs\u1E0E\u1E14ute\u803B\xE9\u40E9ter;\u6A6E\u0200aioy\u1E22\u1E27\u1E31\u1E36ron;\u411Br\u0100;c\u1E2D\u1E2E\u6256\u803B\xEA\u40EAlon;\u6255;\u444Dot;\u4117\u0100Dr\u1E41\u1E45ot;\u6252;\uC000\u{1D522}\u0180;rs\u1E50\u1E51\u1E57\u6A9Aave\u803B\xE8\u40E8\u0100;d\u1E5C\u1E5D\u6A96ot;\u6A98\u0200;ils\u1E6A\u1E6B\u1E72\u1E74\u6A99nters;\u63E7;\u6113\u0100;d\u1E79\u1E7A\u6A95ot;\u6A97\u0180aps\u1E85\u1E89\u1E97cr;\u4113ty\u0180;sv\u1E92\u1E93\u1E95\u6205et\xBB\u1E93p\u01001;\u1E9D\u1EA4\u0133\u1EA1\u1EA3;\u6004;\u6005\u6003\u0100gs\u1EAA\u1EAC;\u414Bp;\u6002\u0100gp\u1EB4\u1EB8on;\u4119f;\uC000\u{1D556}\u0180als\u1EC4\u1ECE\u1ED2r\u0100;s\u1ECA\u1ECB\u62D5l;\u69E3us;\u6A71i\u0180;lv\u1EDA\u1EDB\u1EDF\u43B5on\xBB\u1EDB;\u43F5\u0200csuv\u1EEA\u1EF3\u1F0B\u1F23\u0100io\u1EEF\u1E31rc\xBB\u1E2E\u0269\u1EF9\0\0\u1EFB\xED\u0548ant\u0100gl\u1F02\u1F06tr\xBB\u1E5Dess\xBB\u1E7A\u0180aei\u1F12\u1F16\u1F1Als;\u403Dst;\u625Fv\u0100;D\u0235\u1F20D;\u6A78parsl;\u69E5\u0100Da\u1F2F\u1F33ot;\u6253rr;\u6971\u0180cdi\u1F3E\u1F41\u1EF8r;\u612Fo\xF4\u0352\u0100ah\u1F49\u1F4B;\u43B7\u803B\xF0\u40F0\u0100mr\u1F53\u1F57l\u803B\xEB\u40EBo;\u60AC\u0180cip\u1F61\u1F64\u1F67l;\u4021s\xF4\u056E\u0100eo\u1F6C\u1F74ctatio\xEE\u0559nential\xE5\u0579\u09E1\u1F92\0\u1F9E\0\u1FA1\u1FA7\0\0\u1FC6\u1FCC\0\u1FD3\0\u1FE6\u1FEA\u2000\0\u2008\u205Allingdotse\xF1\u1E44y;\u4444male;\u6640\u0180ilr\u1FAD\u1FB3\u1FC1lig;\u8000\uFB03\u0269\u1FB9\0\0\u1FBDg;\u8000\uFB00ig;\u8000\uFB04;\uC000\u{1D523}lig;\u8000\uFB01lig;\uC000fj\u0180alt\u1FD9\u1FDC\u1FE1t;\u666Dig;\u8000\uFB02ns;\u65B1of;\u4192\u01F0\u1FEE\0\u1FF3f;\uC000\u{1D557}\u0100ak\u05BF\u1FF7\u0100;v\u1FFC\u1FFD\u62D4;\u6AD9artint;\u6A0D\u0100ao\u200C\u2055\u0100cs\u2011\u2052\u03B1\u201A\u2030\u2038\u2045\u2048\0\u2050\u03B2\u2022\u2025\u2027\u202A\u202C\0\u202E\u803B\xBD\u40BD;\u6153\u803B\xBC\u40BC;\u6155;\u6159;\u615B\u01B3\u2034\0\u2036;\u6154;\u6156\u02B4\u203E\u2041\0\0\u2043\u803B\xBE\u40BE;\u6157;\u615C5;\u6158\u01B6\u204C\0\u204E;\u615A;\u615D8;\u615El;\u6044wn;\u6322cr;\uC000\u{1D4BB}\u0880Eabcdefgijlnorstv\u2082\u2089\u209F\u20A5\u20B0\u20B4\u20F0\u20F5\u20FA\u20FF\u2103\u2112\u2138\u0317\u213E\u2152\u219E\u0100;l\u064D\u2087;\u6A8C\u0180cmp\u2090\u2095\u209Dute;\u41F5ma\u0100;d\u209C\u1CDA\u43B3;\u6A86reve;\u411F\u0100iy\u20AA\u20AErc;\u411D;\u4433ot;\u4121\u0200;lqs\u063E\u0642\u20BD\u20C9\u0180;qs\u063E\u064C\u20C4lan\xF4\u0665\u0200;cdl\u0665\u20D2\u20D5\u20E5c;\u6AA9ot\u0100;o\u20DC\u20DD\u6A80\u0100;l\u20E2\u20E3\u6A82;\u6A84\u0100;e\u20EA\u20ED\uC000\u22DB\uFE00s;\u6A94r;\uC000\u{1D524}\u0100;g\u0673\u061Bmel;\u6137cy;\u4453\u0200;Eaj\u065A\u210C\u210E\u2110;\u6A92;\u6AA5;\u6AA4\u0200Eaes\u211B\u211D\u2129\u2134;\u6269p\u0100;p\u2123\u2124\u6A8Arox\xBB\u2124\u0100;q\u212E\u212F\u6A88\u0100;q\u212E\u211Bim;\u62E7pf;\uC000\u{1D558}\u0100ci\u2143\u2146r;\u610Am\u0180;el\u066B\u214E\u2150;\u6A8E;\u6A90\u8300>;cdlqr\u05EE\u2160\u216A\u216E\u2173\u2179\u0100ci\u2165\u2167;\u6AA7r;\u6A7Aot;\u62D7Par;\u6995uest;\u6A7C\u0280adels\u2184\u216A\u2190\u0656\u219B\u01F0\u2189\0\u218Epro\xF8\u209Er;\u6978q\u0100lq\u063F\u2196les\xF3\u2088i\xED\u066B\u0100en\u21A3\u21ADrtneqq;\uC000\u2269\uFE00\xC5\u21AA\u0500Aabcefkosy\u21C4\u21C7\u21F1\u21F5\u21FA\u2218\u221D\u222F\u2268\u227Dr\xF2\u03A0\u0200ilmr\u21D0\u21D4\u21D7\u21DBrs\xF0\u1484f\xBB\u2024il\xF4\u06A9\u0100dr\u21E0\u21E4cy;\u444A\u0180;cw\u08F4\u21EB\u21EFir;\u6948;\u61ADar;\u610Firc;\u4125\u0180alr\u2201\u220E\u2213rts\u0100;u\u2209\u220A\u6665it\xBB\u220Alip;\u6026con;\u62B9r;\uC000\u{1D525}s\u0100ew\u2223\u2229arow;\u6925arow;\u6926\u0280amopr\u223A\u223E\u2243\u225E\u2263rr;\u61FFtht;\u623Bk\u0100lr\u2249\u2253eftarrow;\u61A9ightarrow;\u61AAf;\uC000\u{1D559}bar;\u6015\u0180clt\u226F\u2274\u2278r;\uC000\u{1D4BD}as\xE8\u21F4rok;\u4127\u0100bp\u2282\u2287ull;\u6043hen\xBB\u1C5B\u0AE1\u22A3\0\u22AA\0\u22B8\u22C5\u22CE\0\u22D5\u22F3\0\0\u22F8\u2322\u2367\u2362\u237F\0\u2386\u23AA\u23B4cute\u803B\xED\u40ED\u0180;iy\u0771\u22B0\u22B5rc\u803B\xEE\u40EE;\u4438\u0100cx\u22BC\u22BFy;\u4435cl\u803B\xA1\u40A1\u0100fr\u039F\u22C9;\uC000\u{1D526}rave\u803B\xEC\u40EC\u0200;ino\u073E\u22DD\u22E9\u22EE\u0100in\u22E2\u22E6nt;\u6A0Ct;\u622Dfin;\u69DCta;\u6129lig;\u4133\u0180aop\u22FE\u231A\u231D\u0180cgt\u2305\u2308\u2317r;\u412B\u0180elp\u071F\u230F\u2313in\xE5\u078Ear\xF4\u0720h;\u4131f;\u62B7ed;\u41B5\u0280;cfot\u04F4\u232C\u2331\u233D\u2341are;\u6105in\u0100;t\u2338\u2339\u621Eie;\u69DDdo\xF4\u2319\u0280;celp\u0757\u234C\u2350\u235B\u2361al;\u62BA\u0100gr\u2355\u2359er\xF3\u1563\xE3\u234Darhk;\u6A17rod;\u6A3C\u0200cgpt\u236F\u2372\u2376\u237By;\u4451on;\u412Ff;\uC000\u{1D55A}a;\u43B9uest\u803B\xBF\u40BF\u0100ci\u238A\u238Fr;\uC000\u{1D4BE}n\u0280;Edsv\u04F4\u239B\u239D\u23A1\u04F3;\u62F9ot;\u62F5\u0100;v\u23A6\u23A7\u62F4;\u62F3\u0100;i\u0777\u23AElde;\u4129\u01EB\u23B8\0\u23BCcy;\u4456l\u803B\xEF\u40EF\u0300cfmosu\u23CC\u23D7\u23DC\u23E1\u23E7\u23F5\u0100iy\u23D1\u23D5rc;\u4135;\u4439r;\uC000\u{1D527}ath;\u4237pf;\uC000\u{1D55B}\u01E3\u23EC\0\u23F1r;\uC000\u{1D4BF}rcy;\u4458kcy;\u4454\u0400acfghjos\u240B\u2416\u2422\u2427\u242D\u2431\u2435\u243Bppa\u0100;v\u2413\u2414\u43BA;\u43F0\u0100ey\u241B\u2420dil;\u4137;\u443Ar;\uC000\u{1D528}reen;\u4138cy;\u4445cy;\u445Cpf;\uC000\u{1D55C}cr;\uC000\u{1D4C0}\u0B80ABEHabcdefghjlmnoprstuv\u2470\u2481\u2486\u248D\u2491\u250E\u253D\u255A\u2580\u264E\u265E\u2665\u2679\u267D\u269A\u26B2\u26D8\u275D\u2768\u278B\u27C0\u2801\u2812\u0180art\u2477\u247A\u247Cr\xF2\u09C6\xF2\u0395ail;\u691Barr;\u690E\u0100;g\u0994\u248B;\u6A8Bar;\u6962\u0963\u24A5\0\u24AA\0\u24B1\0\0\0\0\0\u24B5\u24BA\0\u24C6\u24C8\u24CD\0\u24F9ute;\u413Amptyv;\u69B4ra\xEE\u084Cbda;\u43BBg\u0180;dl\u088E\u24C1\u24C3;\u6991\xE5\u088E;\u6A85uo\u803B\xAB\u40ABr\u0400;bfhlpst\u0899\u24DE\u24E6\u24E9\u24EB\u24EE\u24F1\u24F5\u0100;f\u089D\u24E3s;\u691Fs;\u691D\xEB\u2252p;\u61ABl;\u6939im;\u6973l;\u61A2\u0180;ae\u24FF\u2500\u2504\u6AABil;\u6919\u0100;s\u2509\u250A\u6AAD;\uC000\u2AAD\uFE00\u0180abr\u2515\u2519\u251Drr;\u690Crk;\u6772\u0100ak\u2522\u252Cc\u0100ek\u2528\u252A;\u407B;\u405B\u0100es\u2531\u2533;\u698Bl\u0100du\u2539\u253B;\u698F;\u698D\u0200aeuy\u2546\u254B\u2556\u2558ron;\u413E\u0100di\u2550\u2554il;\u413C\xEC\u08B0\xE2\u2529;\u443B\u0200cqrs\u2563\u2566\u256D\u257Da;\u6936uo\u0100;r\u0E19\u1746\u0100du\u2572\u2577har;\u6967shar;\u694Bh;\u61B2\u0280;fgqs\u258B\u258C\u0989\u25F3\u25FF\u6264t\u0280ahlrt\u2598\u25A4\u25B7\u25C2\u25E8rrow\u0100;t\u0899\u25A1a\xE9\u24F6arpoon\u0100du\u25AF\u25B4own\xBB\u045Ap\xBB\u0966eftarrows;\u61C7ight\u0180ahs\u25CD\u25D6\u25DErrow\u0100;s\u08F4\u08A7arpoon\xF3\u0F98quigarro\xF7\u21F0hreetimes;\u62CB\u0180;qs\u258B\u0993\u25FAlan\xF4\u09AC\u0280;cdgs\u09AC\u260A\u260D\u261D\u2628c;\u6AA8ot\u0100;o\u2614\u2615\u6A7F\u0100;r\u261A\u261B\u6A81;\u6A83\u0100;e\u2622\u2625\uC000\u22DA\uFE00s;\u6A93\u0280adegs\u2633\u2639\u263D\u2649\u264Bppro\xF8\u24C6ot;\u62D6q\u0100gq\u2643\u2645\xF4\u0989gt\xF2\u248C\xF4\u099Bi\xED\u09B2\u0180ilr\u2655\u08E1\u265Asht;\u697C;\uC000\u{1D529}\u0100;E\u099C\u2663;\u6A91\u0161\u2669\u2676r\u0100du\u25B2\u266E\u0100;l\u0965\u2673;\u696Alk;\u6584cy;\u4459\u0280;acht\u0A48\u2688\u268B\u2691\u2696r\xF2\u25C1orne\xF2\u1D08ard;\u696Bri;\u65FA\u0100io\u269F\u26A4dot;\u4140ust\u0100;a\u26AC\u26AD\u63B0che\xBB\u26AD\u0200Eaes\u26BB\u26BD\u26C9\u26D4;\u6268p\u0100;p\u26C3\u26C4\u6A89rox\xBB\u26C4\u0100;q\u26CE\u26CF\u6A87\u0100;q\u26CE\u26BBim;\u62E6\u0400abnoptwz\u26E9\u26F4\u26F7\u271A\u272F\u2741\u2747\u2750\u0100nr\u26EE\u26F1g;\u67ECr;\u61FDr\xEB\u08C1g\u0180lmr\u26FF\u270D\u2714eft\u0100ar\u09E6\u2707ight\xE1\u09F2apsto;\u67FCight\xE1\u09FDparrow\u0100lr\u2725\u2729ef\xF4\u24EDight;\u61AC\u0180afl\u2736\u2739\u273Dr;\u6985;\uC000\u{1D55D}us;\u6A2Dimes;\u6A34\u0161\u274B\u274Fst;\u6217\xE1\u134E\u0180;ef\u2757\u2758\u1800\u65CAnge\xBB\u2758ar\u0100;l\u2764\u2765\u4028t;\u6993\u0280achmt\u2773\u2776\u277C\u2785\u2787r\xF2\u08A8orne\xF2\u1D8Car\u0100;d\u0F98\u2783;\u696D;\u600Eri;\u62BF\u0300achiqt\u2798\u279D\u0A40\u27A2\u27AE\u27BBquo;\u6039r;\uC000\u{1D4C1}m\u0180;eg\u09B2\u27AA\u27AC;\u6A8D;\u6A8F\u0100bu\u252A\u27B3o\u0100;r\u0E1F\u27B9;\u601Arok;\u4142\u8400<;cdhilqr\u082B\u27D2\u2639\u27DC\u27E0\u27E5\u27EA\u27F0\u0100ci\u27D7\u27D9;\u6AA6r;\u6A79re\xE5\u25F2mes;\u62C9arr;\u6976uest;\u6A7B\u0100Pi\u27F5\u27F9ar;\u6996\u0180;ef\u2800\u092D\u181B\u65C3r\u0100du\u2807\u280Dshar;\u694Ahar;\u6966\u0100en\u2817\u2821rtneqq;\uC000\u2268\uFE00\xC5\u281E\u0700Dacdefhilnopsu\u2840\u2845\u2882\u288E\u2893\u28A0\u28A5\u28A8\u28DA\u28E2\u28E4\u0A83\u28F3\u2902Dot;\u623A\u0200clpr\u284E\u2852\u2863\u287Dr\u803B\xAF\u40AF\u0100et\u2857\u2859;\u6642\u0100;e\u285E\u285F\u6720se\xBB\u285F\u0100;s\u103B\u2868to\u0200;dlu\u103B\u2873\u2877\u287Bow\xEE\u048Cef\xF4\u090F\xF0\u13D1ker;\u65AE\u0100oy\u2887\u288Cmma;\u6A29;\u443Cash;\u6014asuredangle\xBB\u1626r;\uC000\u{1D52A}o;\u6127\u0180cdn\u28AF\u28B4\u28C9ro\u803B\xB5\u40B5\u0200;acd\u1464\u28BD\u28C0\u28C4s\xF4\u16A7ir;\u6AF0ot\u80BB\xB7\u01B5us\u0180;bd\u28D2\u1903\u28D3\u6212\u0100;u\u1D3C\u28D8;\u6A2A\u0163\u28DE\u28E1p;\u6ADB\xF2\u2212\xF0\u0A81\u0100dp\u28E9\u28EEels;\u62A7f;\uC000\u{1D55E}\u0100ct\u28F8\u28FDr;\uC000\u{1D4C2}pos\xBB\u159D\u0180;lm\u2909\u290A\u290D\u43BCtimap;\u62B8\u0C00GLRVabcdefghijlmoprstuvw\u2942\u2953\u297E\u2989\u2998\u29DA\u29E9\u2A15\u2A1A\u2A58\u2A5D\u2A83\u2A95\u2AA4\u2AA8\u2B04\u2B07\u2B44\u2B7F\u2BAE\u2C34\u2C67\u2C7C\u2CE9\u0100gt\u2947\u294B;\uC000\u22D9\u0338\u0100;v\u2950\u0BCF\uC000\u226B\u20D2\u0180elt\u295A\u2972\u2976ft\u0100ar\u2961\u2967rrow;\u61CDightarrow;\u61CE;\uC000\u22D8\u0338\u0100;v\u297B\u0C47\uC000\u226A\u20D2ightarrow;\u61CF\u0100Dd\u298E\u2993ash;\u62AFash;\u62AE\u0280bcnpt\u29A3\u29A7\u29AC\u29B1\u29CCla\xBB\u02DEute;\u4144g;\uC000\u2220\u20D2\u0280;Eiop\u0D84\u29BC\u29C0\u29C5\u29C8;\uC000\u2A70\u0338d;\uC000\u224B\u0338s;\u4149ro\xF8\u0D84ur\u0100;a\u29D3\u29D4\u666El\u0100;s\u29D3\u0B38\u01F3\u29DF\0\u29E3p\u80BB\xA0\u0B37mp\u0100;e\u0BF9\u0C00\u0280aeouy\u29F4\u29FE\u2A03\u2A10\u2A13\u01F0\u29F9\0\u29FB;\u6A43on;\u4148dil;\u4146ng\u0100;d\u0D7E\u2A0Aot;\uC000\u2A6D\u0338p;\u6A42;\u443Dash;\u6013\u0380;Aadqsx\u0B92\u2A29\u2A2D\u2A3B\u2A41\u2A45\u2A50rr;\u61D7r\u0100hr\u2A33\u2A36k;\u6924\u0100;o\u13F2\u13F0ot;\uC000\u2250\u0338ui\xF6\u0B63\u0100ei\u2A4A\u2A4Ear;\u6928\xED\u0B98ist\u0100;s\u0BA0\u0B9Fr;\uC000\u{1D52B}\u0200Eest\u0BC5\u2A66\u2A79\u2A7C\u0180;qs\u0BBC\u2A6D\u0BE1\u0180;qs\u0BBC\u0BC5\u2A74lan\xF4\u0BE2i\xED\u0BEA\u0100;r\u0BB6\u2A81\xBB\u0BB7\u0180Aap\u2A8A\u2A8D\u2A91r\xF2\u2971rr;\u61AEar;\u6AF2\u0180;sv\u0F8D\u2A9C\u0F8C\u0100;d\u2AA1\u2AA2\u62FC;\u62FAcy;\u445A\u0380AEadest\u2AB7\u2ABA\u2ABE\u2AC2\u2AC5\u2AF6\u2AF9r\xF2\u2966;\uC000\u2266\u0338rr;\u619Ar;\u6025\u0200;fqs\u0C3B\u2ACE\u2AE3\u2AEFt\u0100ar\u2AD4\u2AD9rro\xF7\u2AC1ightarro\xF7\u2A90\u0180;qs\u0C3B\u2ABA\u2AEAlan\xF4\u0C55\u0100;s\u0C55\u2AF4\xBB\u0C36i\xED\u0C5D\u0100;r\u0C35\u2AFEi\u0100;e\u0C1A\u0C25i\xE4\u0D90\u0100pt\u2B0C\u2B11f;\uC000\u{1D55F}\u8180\xAC;in\u2B19\u2B1A\u2B36\u40ACn\u0200;Edv\u0B89\u2B24\u2B28\u2B2E;\uC000\u22F9\u0338ot;\uC000\u22F5\u0338\u01E1\u0B89\u2B33\u2B35;\u62F7;\u62F6i\u0100;v\u0CB8\u2B3C\u01E1\u0CB8\u2B41\u2B43;\u62FE;\u62FD\u0180aor\u2B4B\u2B63\u2B69r\u0200;ast\u0B7B\u2B55\u2B5A\u2B5Flle\xEC\u0B7Bl;\uC000\u2AFD\u20E5;\uC000\u2202\u0338lint;\u6A14\u0180;ce\u0C92\u2B70\u2B73u\xE5\u0CA5\u0100;c\u0C98\u2B78\u0100;e\u0C92\u2B7D\xF1\u0C98\u0200Aait\u2B88\u2B8B\u2B9D\u2BA7r\xF2\u2988rr\u0180;cw\u2B94\u2B95\u2B99\u619B;\uC000\u2933\u0338;\uC000\u219D\u0338ghtarrow\xBB\u2B95ri\u0100;e\u0CCB\u0CD6\u0380chimpqu\u2BBD\u2BCD\u2BD9\u2B04\u0B78\u2BE4\u2BEF\u0200;cer\u0D32\u2BC6\u0D37\u2BC9u\xE5\u0D45;\uC000\u{1D4C3}ort\u026D\u2B05\0\0\u2BD6ar\xE1\u2B56m\u0100;e\u0D6E\u2BDF\u0100;q\u0D74\u0D73su\u0100bp\u2BEB\u2BED\xE5\u0CF8\xE5\u0D0B\u0180bcp\u2BF6\u2C11\u2C19\u0200;Ees\u2BFF\u2C00\u0D22\u2C04\u6284;\uC000\u2AC5\u0338et\u0100;e\u0D1B\u2C0Bq\u0100;q\u0D23\u2C00c\u0100;e\u0D32\u2C17\xF1\u0D38\u0200;Ees\u2C22\u2C23\u0D5F\u2C27\u6285;\uC000\u2AC6\u0338et\u0100;e\u0D58\u2C2Eq\u0100;q\u0D60\u2C23\u0200gilr\u2C3D\u2C3F\u2C45\u2C47\xEC\u0BD7lde\u803B\xF1\u40F1\xE7\u0C43iangle\u0100lr\u2C52\u2C5Ceft\u0100;e\u0C1A\u2C5A\xF1\u0C26ight\u0100;e\u0CCB\u2C65\xF1\u0CD7\u0100;m\u2C6C\u2C6D\u43BD\u0180;es\u2C74\u2C75\u2C79\u4023ro;\u6116p;\u6007\u0480DHadgilrs\u2C8F\u2C94\u2C99\u2C9E\u2CA3\u2CB0\u2CB6\u2CD3\u2CE3ash;\u62ADarr;\u6904p;\uC000\u224D\u20D2ash;\u62AC\u0100et\u2CA8\u2CAC;\uC000\u2265\u20D2;\uC000>\u20D2nfin;\u69DE\u0180Aet\u2CBD\u2CC1\u2CC5rr;\u6902;\uC000\u2264\u20D2\u0100;r\u2CCA\u2CCD\uC000<\u20D2ie;\uC000\u22B4\u20D2\u0100At\u2CD8\u2CDCrr;\u6903rie;\uC000\u22B5\u20D2im;\uC000\u223C\u20D2\u0180Aan\u2CF0\u2CF4\u2D02rr;\u61D6r\u0100hr\u2CFA\u2CFDk;\u6923\u0100;o\u13E7\u13E5ear;\u6927\u1253\u1A95\0\0\0\0\0\0\0\0\0\0\0\0\0\u2D2D\0\u2D38\u2D48\u2D60\u2D65\u2D72\u2D84\u1B07\0\0\u2D8D\u2DAB\0\u2DC8\u2DCE\0\u2DDC\u2E19\u2E2B\u2E3E\u2E43\u0100cs\u2D31\u1A97ute\u803B\xF3\u40F3\u0100iy\u2D3C\u2D45r\u0100;c\u1A9E\u2D42\u803B\xF4\u40F4;\u443E\u0280abios\u1AA0\u2D52\u2D57\u01C8\u2D5Alac;\u4151v;\u6A38old;\u69BClig;\u4153\u0100cr\u2D69\u2D6Dir;\u69BF;\uC000\u{1D52C}\u036F\u2D79\0\0\u2D7C\0\u2D82n;\u42DBave\u803B\xF2\u40F2;\u69C1\u0100bm\u2D88\u0DF4ar;\u69B5\u0200acit\u2D95\u2D98\u2DA5\u2DA8r\xF2\u1A80\u0100ir\u2D9D\u2DA0r;\u69BEoss;\u69BBn\xE5\u0E52;\u69C0\u0180aei\u2DB1\u2DB5\u2DB9cr;\u414Dga;\u43C9\u0180cdn\u2DC0\u2DC5\u01CDron;\u43BF;\u69B6pf;\uC000\u{1D560}\u0180ael\u2DD4\u2DD7\u01D2r;\u69B7rp;\u69B9\u0380;adiosv\u2DEA\u2DEB\u2DEE\u2E08\u2E0D\u2E10\u2E16\u6228r\xF2\u1A86\u0200;efm\u2DF7\u2DF8\u2E02\u2E05\u6A5Dr\u0100;o\u2DFE\u2DFF\u6134f\xBB\u2DFF\u803B\xAA\u40AA\u803B\xBA\u40BAgof;\u62B6r;\u6A56lope;\u6A57;\u6A5B\u0180clo\u2E1F\u2E21\u2E27\xF2\u2E01ash\u803B\xF8\u40F8l;\u6298i\u016C\u2E2F\u2E34de\u803B\xF5\u40F5es\u0100;a\u01DB\u2E3As;\u6A36ml\u803B\xF6\u40F6bar;\u633D\u0AE1\u2E5E\0\u2E7D\0\u2E80\u2E9D\0\u2EA2\u2EB9\0\0\u2ECB\u0E9C\0\u2F13\0\0\u2F2B\u2FBC\0\u2FC8r\u0200;ast\u0403\u2E67\u2E72\u0E85\u8100\xB6;l\u2E6D\u2E6E\u40B6le\xEC\u0403\u0269\u2E78\0\0\u2E7Bm;\u6AF3;\u6AFDy;\u443Fr\u0280cimpt\u2E8B\u2E8F\u2E93\u1865\u2E97nt;\u4025od;\u402Eil;\u6030enk;\u6031r;\uC000\u{1D52D}\u0180imo\u2EA8\u2EB0\u2EB4\u0100;v\u2EAD\u2EAE\u43C6;\u43D5ma\xF4\u0A76ne;\u660E\u0180;tv\u2EBF\u2EC0\u2EC8\u43C0chfork\xBB\u1FFD;\u43D6\u0100au\u2ECF\u2EDFn\u0100ck\u2ED5\u2EDDk\u0100;h\u21F4\u2EDB;\u610E\xF6\u21F4s\u0480;abcdemst\u2EF3\u2EF4\u1908\u2EF9\u2EFD\u2F04\u2F06\u2F0A\u2F0E\u402Bcir;\u6A23ir;\u6A22\u0100ou\u1D40\u2F02;\u6A25;\u6A72n\u80BB\xB1\u0E9Dim;\u6A26wo;\u6A27\u0180ipu\u2F19\u2F20\u2F25ntint;\u6A15f;\uC000\u{1D561}nd\u803B\xA3\u40A3\u0500;Eaceinosu\u0EC8\u2F3F\u2F41\u2F44\u2F47\u2F81\u2F89\u2F92\u2F7E\u2FB6;\u6AB3p;\u6AB7u\xE5\u0ED9\u0100;c\u0ECE\u2F4C\u0300;acens\u0EC8\u2F59\u2F5F\u2F66\u2F68\u2F7Eppro\xF8\u2F43urlye\xF1\u0ED9\xF1\u0ECE\u0180aes\u2F6F\u2F76\u2F7Approx;\u6AB9qq;\u6AB5im;\u62E8i\xED\u0EDFme\u0100;s\u2F88\u0EAE\u6032\u0180Eas\u2F78\u2F90\u2F7A\xF0\u2F75\u0180dfp\u0EEC\u2F99\u2FAF\u0180als\u2FA0\u2FA5\u2FAAlar;\u632Eine;\u6312urf;\u6313\u0100;t\u0EFB\u2FB4\xEF\u0EFBrel;\u62B0\u0100ci\u2FC0\u2FC5r;\uC000\u{1D4C5};\u43C8ncsp;\u6008\u0300fiopsu\u2FDA\u22E2\u2FDF\u2FE5\u2FEB\u2FF1r;\uC000\u{1D52E}pf;\uC000\u{1D562}rime;\u6057cr;\uC000\u{1D4C6}\u0180aeo\u2FF8\u3009\u3013t\u0100ei\u2FFE\u3005rnion\xF3\u06B0nt;\u6A16st\u0100;e\u3010\u3011\u403F\xF1\u1F19\xF4\u0F14\u0A80ABHabcdefhilmnoprstux\u3040\u3051\u3055\u3059\u30E0\u310E\u312B\u3147\u3162\u3172\u318E\u3206\u3215\u3224\u3229\u3258\u326E\u3272\u3290\u32B0\u32B7\u0180art\u3047\u304A\u304Cr\xF2\u10B3\xF2\u03DDail;\u691Car\xF2\u1C65ar;\u6964\u0380cdenqrt\u3068\u3075\u3078\u307F\u308F\u3094\u30CC\u0100eu\u306D\u3071;\uC000\u223D\u0331te;\u4155i\xE3\u116Emptyv;\u69B3g\u0200;del\u0FD1\u3089\u308B\u308D;\u6992;\u69A5\xE5\u0FD1uo\u803B\xBB\u40BBr\u0580;abcfhlpstw\u0FDC\u30AC\u30AF\u30B7\u30B9\u30BC\u30BE\u30C0\u30C3\u30C7\u30CAp;\u6975\u0100;f\u0FE0\u30B4s;\u6920;\u6933s;\u691E\xEB\u225D\xF0\u272El;\u6945im;\u6974l;\u61A3;\u619D\u0100ai\u30D1\u30D5il;\u691Ao\u0100;n\u30DB\u30DC\u6236al\xF3\u0F1E\u0180abr\u30E7\u30EA\u30EEr\xF2\u17E5rk;\u6773\u0100ak\u30F3\u30FDc\u0100ek\u30F9\u30FB;\u407D;\u405D\u0100es\u3102\u3104;\u698Cl\u0100du\u310A\u310C;\u698E;\u6990\u0200aeuy\u3117\u311C\u3127\u3129ron;\u4159\u0100di\u3121\u3125il;\u4157\xEC\u0FF2\xE2\u30FA;\u4440\u0200clqs\u3134\u3137\u313D\u3144a;\u6937dhar;\u6969uo\u0100;r\u020E\u020Dh;\u61B3\u0180acg\u314E\u315F\u0F44l\u0200;ips\u0F78\u3158\u315B\u109Cn\xE5\u10BBar\xF4\u0FA9t;\u65AD\u0180ilr\u3169\u1023\u316Esht;\u697D;\uC000\u{1D52F}\u0100ao\u3177\u3186r\u0100du\u317D\u317F\xBB\u047B\u0100;l\u1091\u3184;\u696C\u0100;v\u318B\u318C\u43C1;\u43F1\u0180gns\u3195\u31F9\u31FCht\u0300ahlrst\u31A4\u31B0\u31C2\u31D8\u31E4\u31EErrow\u0100;t\u0FDC\u31ADa\xE9\u30C8arpoon\u0100du\u31BB\u31BFow\xEE\u317Ep\xBB\u1092eft\u0100ah\u31CA\u31D0rrow\xF3\u0FEAarpoon\xF3\u0551ightarrows;\u61C9quigarro\xF7\u30CBhreetimes;\u62CCg;\u42DAingdotse\xF1\u1F32\u0180ahm\u320D\u3210\u3213r\xF2\u0FEAa\xF2\u0551;\u600Foust\u0100;a\u321E\u321F\u63B1che\xBB\u321Fmid;\u6AEE\u0200abpt\u3232\u323D\u3240\u3252\u0100nr\u3237\u323Ag;\u67EDr;\u61FEr\xEB\u1003\u0180afl\u3247\u324A\u324Er;\u6986;\uC000\u{1D563}us;\u6A2Eimes;\u6A35\u0100ap\u325D\u3267r\u0100;g\u3263\u3264\u4029t;\u6994olint;\u6A12ar\xF2\u31E3\u0200achq\u327B\u3280\u10BC\u3285quo;\u603Ar;\uC000\u{1D4C7}\u0100bu\u30FB\u328Ao\u0100;r\u0214\u0213\u0180hir\u3297\u329B\u32A0re\xE5\u31F8mes;\u62CAi\u0200;efl\u32AA\u1059\u1821\u32AB\u65B9tri;\u69CEluhar;\u6968;\u611E\u0D61\u32D5\u32DB\u32DF\u332C\u3338\u3371\0\u337A\u33A4\0\0\u33EC\u33F0\0\u3428\u3448\u345A\u34AD\u34B1\u34CA\u34F1\0\u3616\0\0\u3633cute;\u415Bqu\xEF\u27BA\u0500;Eaceinpsy\u11ED\u32F3\u32F5\u32FF\u3302\u330B\u330F\u331F\u3326\u3329;\u6AB4\u01F0\u32FA\0\u32FC;\u6AB8on;\u4161u\xE5\u11FE\u0100;d\u11F3\u3307il;\u415Frc;\u415D\u0180Eas\u3316\u3318\u331B;\u6AB6p;\u6ABAim;\u62E9olint;\u6A13i\xED\u1204;\u4441ot\u0180;be\u3334\u1D47\u3335\u62C5;\u6A66\u0380Aacmstx\u3346\u334A\u3357\u335B\u335E\u3363\u336Drr;\u61D8r\u0100hr\u3350\u3352\xEB\u2228\u0100;o\u0A36\u0A34t\u803B\xA7\u40A7i;\u403Bwar;\u6929m\u0100in\u3369\xF0nu\xF3\xF1t;\u6736r\u0100;o\u3376\u2055\uC000\u{1D530}\u0200acoy\u3382\u3386\u3391\u33A0rp;\u666F\u0100hy\u338B\u338Fcy;\u4449;\u4448rt\u026D\u3399\0\0\u339Ci\xE4\u1464ara\xEC\u2E6F\u803B\xAD\u40AD\u0100gm\u33A8\u33B4ma\u0180;fv\u33B1\u33B2\u33B2\u43C3;\u43C2\u0400;deglnpr\u12AB\u33C5\u33C9\u33CE\u33D6\u33DE\u33E1\u33E6ot;\u6A6A\u0100;q\u12B1\u12B0\u0100;E\u33D3\u33D4\u6A9E;\u6AA0\u0100;E\u33DB\u33DC\u6A9D;\u6A9Fe;\u6246lus;\u6A24arr;\u6972ar\xF2\u113D\u0200aeit\u33F8\u3408\u340F\u3417\u0100ls\u33FD\u3404lsetm\xE9\u336Ahp;\u6A33parsl;\u69E4\u0100dl\u1463\u3414e;\u6323\u0100;e\u341C\u341D\u6AAA\u0100;s\u3422\u3423\u6AAC;\uC000\u2AAC\uFE00\u0180flp\u342E\u3433\u3442tcy;\u444C\u0100;b\u3438\u3439\u402F\u0100;a\u343E\u343F\u69C4r;\u633Ff;\uC000\u{1D564}a\u0100dr\u344D\u0402es\u0100;u\u3454\u3455\u6660it\xBB\u3455\u0180csu\u3460\u3479\u349F\u0100au\u3465\u346Fp\u0100;s\u1188\u346B;\uC000\u2293\uFE00p\u0100;s\u11B4\u3475;\uC000\u2294\uFE00u\u0100bp\u347F\u348F\u0180;es\u1197\u119C\u3486et\u0100;e\u1197\u348D\xF1\u119D\u0180;es\u11A8\u11AD\u3496et\u0100;e\u11A8\u349D\xF1\u11AE\u0180;af\u117B\u34A6\u05B0r\u0165\u34AB\u05B1\xBB\u117Car\xF2\u1148\u0200cemt\u34B9\u34BE\u34C2\u34C5r;\uC000\u{1D4C8}tm\xEE\xF1i\xEC\u3415ar\xE6\u11BE\u0100ar\u34CE\u34D5r\u0100;f\u34D4\u17BF\u6606\u0100an\u34DA\u34EDight\u0100ep\u34E3\u34EApsilo\xEE\u1EE0h\xE9\u2EAFs\xBB\u2852\u0280bcmnp\u34FB\u355E\u1209\u358B\u358E\u0480;Edemnprs\u350E\u350F\u3511\u3515\u351E\u3523\u352C\u3531\u3536\u6282;\u6AC5ot;\u6ABD\u0100;d\u11DA\u351Aot;\u6AC3ult;\u6AC1\u0100Ee\u3528\u352A;\u6ACB;\u628Alus;\u6ABFarr;\u6979\u0180eiu\u353D\u3552\u3555t\u0180;en\u350E\u3545\u354Bq\u0100;q\u11DA\u350Feq\u0100;q\u352B\u3528m;\u6AC7\u0100bp\u355A\u355C;\u6AD5;\u6AD3c\u0300;acens\u11ED\u356C\u3572\u3579\u357B\u3326ppro\xF8\u32FAurlye\xF1\u11FE\xF1\u11F3\u0180aes\u3582\u3588\u331Bppro\xF8\u331Aq\xF1\u3317g;\u666A\u0680123;Edehlmnps\u35A9\u35AC\u35AF\u121C\u35B2\u35B4\u35C0\u35C9\u35D5\u35DA\u35DF\u35E8\u35ED\u803B\xB9\u40B9\u803B\xB2\u40B2\u803B\xB3\u40B3;\u6AC6\u0100os\u35B9\u35BCt;\u6ABEub;\u6AD8\u0100;d\u1222\u35C5ot;\u6AC4s\u0100ou\u35CF\u35D2l;\u67C9b;\u6AD7arr;\u697Bult;\u6AC2\u0100Ee\u35E4\u35E6;\u6ACC;\u628Blus;\u6AC0\u0180eiu\u35F4\u3609\u360Ct\u0180;en\u121C\u35FC\u3602q\u0100;q\u1222\u35B2eq\u0100;q\u35E7\u35E4m;\u6AC8\u0100bp\u3611\u3613;\u6AD4;\u6AD6\u0180Aan\u361C\u3620\u362Drr;\u61D9r\u0100hr\u3626\u3628\xEB\u222E\u0100;o\u0A2B\u0A29war;\u692Alig\u803B\xDF\u40DF\u0BE1\u3651\u365D\u3660\u12CE\u3673\u3679\0\u367E\u36C2\0\0\0\0\0\u36DB\u3703\0\u3709\u376C\0\0\0\u3787\u0272\u3656\0\0\u365Bget;\u6316;\u43C4r\xEB\u0E5F\u0180aey\u3666\u366B\u3670ron;\u4165dil;\u4163;\u4442lrec;\u6315r;\uC000\u{1D531}\u0200eiko\u3686\u369D\u36B5\u36BC\u01F2\u368B\0\u3691e\u01004f\u1284\u1281a\u0180;sv\u3698\u3699\u369B\u43B8ym;\u43D1\u0100cn\u36A2\u36B2k\u0100as\u36A8\u36AEppro\xF8\u12C1im\xBB\u12ACs\xF0\u129E\u0100as\u36BA\u36AE\xF0\u12C1rn\u803B\xFE\u40FE\u01EC\u031F\u36C6\u22E7es\u8180\xD7;bd\u36CF\u36D0\u36D8\u40D7\u0100;a\u190F\u36D5r;\u6A31;\u6A30\u0180eps\u36E1\u36E3\u3700\xE1\u2A4D\u0200;bcf\u0486\u36EC\u36F0\u36F4ot;\u6336ir;\u6AF1\u0100;o\u36F9\u36FC\uC000\u{1D565}rk;\u6ADA\xE1\u3362rime;\u6034\u0180aip\u370F\u3712\u3764d\xE5\u1248\u0380adempst\u3721\u374D\u3740\u3751\u3757\u375C\u375Fngle\u0280;dlqr\u3730\u3731\u3736\u3740\u3742\u65B5own\xBB\u1DBBeft\u0100;e\u2800\u373E\xF1\u092E;\u625Cight\u0100;e\u32AA\u374B\xF1\u105Aot;\u65ECinus;\u6A3Alus;\u6A39b;\u69CDime;\u6A3Bezium;\u63E2\u0180cht\u3772\u377D\u3781\u0100ry\u3777\u377B;\uC000\u{1D4C9};\u4446cy;\u445Brok;\u4167\u0100io\u378B\u378Ex\xF4\u1777head\u0100lr\u3797\u37A0eftarro\xF7\u084Fightarrow\xBB\u0F5D\u0900AHabcdfghlmoprstuw\u37D0\u37D3\u37D7\u37E4\u37F0\u37FC\u380E\u381C\u3823\u3834\u3851\u385D\u386B\u38A9\u38CC\u38D2\u38EA\u38F6r\xF2\u03EDar;\u6963\u0100cr\u37DC\u37E2ute\u803B\xFA\u40FA\xF2\u1150r\u01E3\u37EA\0\u37EDy;\u445Eve;\u416D\u0100iy\u37F5\u37FArc\u803B\xFB\u40FB;\u4443\u0180abh\u3803\u3806\u380Br\xF2\u13ADlac;\u4171a\xF2\u13C3\u0100ir\u3813\u3818sht;\u697E;\uC000\u{1D532}rave\u803B\xF9\u40F9\u0161\u3827\u3831r\u0100lr\u382C\u382E\xBB\u0957\xBB\u1083lk;\u6580\u0100ct\u3839\u384D\u026F\u383F\0\0\u384Arn\u0100;e\u3845\u3846\u631Cr\xBB\u3846op;\u630Fri;\u65F8\u0100al\u3856\u385Acr;\u416B\u80BB\xA8\u0349\u0100gp\u3862\u3866on;\u4173f;\uC000\u{1D566}\u0300adhlsu\u114B\u3878\u387D\u1372\u3891\u38A0own\xE1\u13B3arpoon\u0100lr\u3888\u388Cef\xF4\u382Digh\xF4\u382Fi\u0180;hl\u3899\u389A\u389C\u43C5\xBB\u13FAon\xBB\u389Aparrows;\u61C8\u0180cit\u38B0\u38C4\u38C8\u026F\u38B6\0\0\u38C1rn\u0100;e\u38BC\u38BD\u631Dr\xBB\u38BDop;\u630Eng;\u416Fri;\u65F9cr;\uC000\u{1D4CA}\u0180dir\u38D9\u38DD\u38E2ot;\u62F0lde;\u4169i\u0100;f\u3730\u38E8\xBB\u1813\u0100am\u38EF\u38F2r\xF2\u38A8l\u803B\xFC\u40FCangle;\u69A7\u0780ABDacdeflnoprsz\u391C\u391F\u3929\u392D\u39B5\u39B8\u39BD\u39DF\u39E4\u39E8\u39F3\u39F9\u39FD\u3A01\u3A20r\xF2\u03F7ar\u0100;v\u3926\u3927\u6AE8;\u6AE9as\xE8\u03E1\u0100nr\u3932\u3937grt;\u699C\u0380eknprst\u34E3\u3946\u394B\u3952\u395D\u3964\u3996app\xE1\u2415othin\xE7\u1E96\u0180hir\u34EB\u2EC8\u3959op\xF4\u2FB5\u0100;h\u13B7\u3962\xEF\u318D\u0100iu\u3969\u396Dgm\xE1\u33B3\u0100bp\u3972\u3984setneq\u0100;q\u397D\u3980\uC000\u228A\uFE00;\uC000\u2ACB\uFE00setneq\u0100;q\u398F\u3992\uC000\u228B\uFE00;\uC000\u2ACC\uFE00\u0100hr\u399B\u399Fet\xE1\u369Ciangle\u0100lr\u39AA\u39AFeft\xBB\u0925ight\xBB\u1051y;\u4432ash\xBB\u1036\u0180elr\u39C4\u39D2\u39D7\u0180;be\u2DEA\u39CB\u39CFar;\u62BBq;\u625Alip;\u62EE\u0100bt\u39DC\u1468a\xF2\u1469r;\uC000\u{1D533}tr\xE9\u39AEsu\u0100bp\u39EF\u39F1\xBB\u0D1C\xBB\u0D59pf;\uC000\u{1D567}ro\xF0\u0EFBtr\xE9\u39B4\u0100cu\u3A06\u3A0Br;\uC000\u{1D4CB}\u0100bp\u3A10\u3A18n\u0100Ee\u3980\u3A16\xBB\u397En\u0100Ee\u3992\u3A1E\xBB\u3990igzag;\u699A\u0380cefoprs\u3A36\u3A3B\u3A56\u3A5B\u3A54\u3A61\u3A6Airc;\u4175\u0100di\u3A40\u3A51\u0100bg\u3A45\u3A49ar;\u6A5Fe\u0100;q\u15FA\u3A4F;\u6259erp;\u6118r;\uC000\u{1D534}pf;\uC000\u{1D568}\u0100;e\u1479\u3A66at\xE8\u1479cr;\uC000\u{1D4CC}\u0AE3\u178E\u3A87\0\u3A8B\0\u3A90\u3A9B\0\0\u3A9D\u3AA8\u3AAB\u3AAF\0\0\u3AC3\u3ACE\0\u3AD8\u17DC\u17DFtr\xE9\u17D1r;\uC000\u{1D535}\u0100Aa\u3A94\u3A97r\xF2\u03C3r\xF2\u09F6;\u43BE\u0100Aa\u3AA1\u3AA4r\xF2\u03B8r\xF2\u09EBa\xF0\u2713is;\u62FB\u0180dpt\u17A4\u3AB5\u3ABE\u0100fl\u3ABA\u17A9;\uC000\u{1D569}im\xE5\u17B2\u0100Aa\u3AC7\u3ACAr\xF2\u03CEr\xF2\u0A01\u0100cq\u3AD2\u17B8r;\uC000\u{1D4CD}\u0100pt\u17D6\u3ADCr\xE9\u17D4\u0400acefiosu\u3AF0\u3AFD\u3B08\u3B0C\u3B11\u3B15\u3B1B\u3B21c\u0100uy\u3AF6\u3AFBte\u803B\xFD\u40FD;\u444F\u0100iy\u3B02\u3B06rc;\u4177;\u444Bn\u803B\xA5\u40A5r;\uC000\u{1D536}cy;\u4457pf;\uC000\u{1D56A}cr;\uC000\u{1D4CE}\u0100cm\u3B26\u3B29y;\u444El\u803B\xFF\u40FF\u0500acdefhiosw\u3B42\u3B48\u3B54\u3B58\u3B64\u3B69\u3B6D\u3B74\u3B7A\u3B80cute;\u417A\u0100ay\u3B4D\u3B52ron;\u417E;\u4437ot;\u417C\u0100et\u3B5D\u3B61tr\xE6\u155Fa;\u43B6r;\uC000\u{1D537}cy;\u4436grarr;\u61DDpf;\uC000\u{1D56B}cr;\uC000\u{1D4CF}\u0100jn\u3B85\u3B87;\u600Dj;\u600C'.split("").map((c) => c.charCodeAt(0))
);
var decode_data_xml_default = new Uint16Array(
  // prettier-ignore
  "\u0200aglq	\x1B\u026D\0\0p;\u4026os;\u4027t;\u403Et;\u403Cuot;\u4022".split("").map((c) => c.charCodeAt(0))
);
var _a;
var decodeMap = /* @__PURE__ */ new Map([
  [0, 65533],
  // C1 Unicode control character reference replacements
  [128, 8364],
  [130, 8218],
  [131, 402],
  [132, 8222],
  [133, 8230],
  [134, 8224],
  [135, 8225],
  [136, 710],
  [137, 8240],
  [138, 352],
  [139, 8249],
  [140, 338],
  [142, 381],
  [145, 8216],
  [146, 8217],
  [147, 8220],
  [148, 8221],
  [149, 8226],
  [150, 8211],
  [151, 8212],
  [152, 732],
  [153, 8482],
  [154, 353],
  [155, 8250],
  [156, 339],
  [158, 382],
  [159, 376]
]);
var fromCodePoint = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
  (_a = String.fromCodePoint) !== null && _a !== void 0 ? _a : function(codePoint) {
    let output = "";
    if (codePoint > 65535) {
      codePoint -= 65536;
      output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    output += String.fromCharCode(codePoint);
    return output;
  }
);
function replaceCodePoint(codePoint) {
  var _a2;
  if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
    return 65533;
  }
  return (_a2 = decodeMap.get(codePoint)) !== null && _a2 !== void 0 ? _a2 : codePoint;
}
var CharCodes;
(function(CharCodes3) {
  CharCodes3[CharCodes3["NUM"] = 35] = "NUM";
  CharCodes3[CharCodes3["SEMI"] = 59] = "SEMI";
  CharCodes3[CharCodes3["EQUALS"] = 61] = "EQUALS";
  CharCodes3[CharCodes3["ZERO"] = 48] = "ZERO";
  CharCodes3[CharCodes3["NINE"] = 57] = "NINE";
  CharCodes3[CharCodes3["LOWER_A"] = 97] = "LOWER_A";
  CharCodes3[CharCodes3["LOWER_F"] = 102] = "LOWER_F";
  CharCodes3[CharCodes3["LOWER_X"] = 120] = "LOWER_X";
  CharCodes3[CharCodes3["LOWER_Z"] = 122] = "LOWER_Z";
  CharCodes3[CharCodes3["UPPER_A"] = 65] = "UPPER_A";
  CharCodes3[CharCodes3["UPPER_F"] = 70] = "UPPER_F";
  CharCodes3[CharCodes3["UPPER_Z"] = 90] = "UPPER_Z";
})(CharCodes || (CharCodes = {}));
var TO_LOWER_BIT = 32;
var BinTrieFlags;
(function(BinTrieFlags2) {
  BinTrieFlags2[BinTrieFlags2["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
  BinTrieFlags2[BinTrieFlags2["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
  BinTrieFlags2[BinTrieFlags2["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags || (BinTrieFlags = {}));
function isNumber(code) {
  return code >= CharCodes.ZERO && code <= CharCodes.NINE;
}
function isHexadecimalCharacter(code) {
  return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_F || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_F;
}
function isAsciiAlphaNumeric(code) {
  return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_Z || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_Z || isNumber(code);
}
function isEntityInAttributeInvalidEnd(code) {
  return code === CharCodes.EQUALS || isAsciiAlphaNumeric(code);
}
var EntityDecoderState;
(function(EntityDecoderState2) {
  EntityDecoderState2[EntityDecoderState2["EntityStart"] = 0] = "EntityStart";
  EntityDecoderState2[EntityDecoderState2["NumericStart"] = 1] = "NumericStart";
  EntityDecoderState2[EntityDecoderState2["NumericDecimal"] = 2] = "NumericDecimal";
  EntityDecoderState2[EntityDecoderState2["NumericHex"] = 3] = "NumericHex";
  EntityDecoderState2[EntityDecoderState2["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState || (EntityDecoderState = {}));
var DecodingMode;
(function(DecodingMode2) {
  DecodingMode2[DecodingMode2["Legacy"] = 0] = "Legacy";
  DecodingMode2[DecodingMode2["Strict"] = 1] = "Strict";
  DecodingMode2[DecodingMode2["Attribute"] = 2] = "Attribute";
})(DecodingMode || (DecodingMode = {}));
var EntityDecoder = class {
  constructor(decodeTree, emitCodePoint, errors) {
    this.decodeTree = decodeTree;
    this.emitCodePoint = emitCodePoint;
    this.errors = errors;
    this.state = EntityDecoderState.EntityStart;
    this.consumed = 1;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.decodeMode = DecodingMode.Strict;
  }
  /** Resets the instance to make it reusable. */
  startEntity(decodeMode) {
    this.decodeMode = decodeMode;
    this.state = EntityDecoderState.EntityStart;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.consumed = 1;
  }
  /**
   * Write an entity to the decoder. This can be called multiple times with partial entities.
   * If the entity is incomplete, the decoder will return -1.
   *
   * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
   * entity is incomplete, and resume when the next string is written.
   *
   * @param string The string containing the entity (or a continuation of the entity).
   * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  write(str, offset) {
    switch (this.state) {
      case EntityDecoderState.EntityStart: {
        if (str.charCodeAt(offset) === CharCodes.NUM) {
          this.state = EntityDecoderState.NumericStart;
          this.consumed += 1;
          return this.stateNumericStart(str, offset + 1);
        }
        this.state = EntityDecoderState.NamedEntity;
        return this.stateNamedEntity(str, offset);
      }
      case EntityDecoderState.NumericStart: {
        return this.stateNumericStart(str, offset);
      }
      case EntityDecoderState.NumericDecimal: {
        return this.stateNumericDecimal(str, offset);
      }
      case EntityDecoderState.NumericHex: {
        return this.stateNumericHex(str, offset);
      }
      case EntityDecoderState.NamedEntity: {
        return this.stateNamedEntity(str, offset);
      }
    }
  }
  /**
   * Switches between the numeric decimal and hexadecimal states.
   *
   * Equivalent to the `Numeric character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericStart(str, offset) {
    if (offset >= str.length) {
      return -1;
    }
    if ((str.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
      this.state = EntityDecoderState.NumericHex;
      this.consumed += 1;
      return this.stateNumericHex(str, offset + 1);
    }
    this.state = EntityDecoderState.NumericDecimal;
    return this.stateNumericDecimal(str, offset);
  }
  addToNumericResult(str, start, end, base) {
    if (start !== end) {
      const digitCount = end - start;
      this.result = this.result * Math.pow(base, digitCount) + parseInt(str.substr(start, digitCount), base);
      this.consumed += digitCount;
    }
  }
  /**
   * Parses a hexadecimal numeric entity.
   *
   * Equivalent to the `Hexademical character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericHex(str, offset) {
    const startIdx = offset;
    while (offset < str.length) {
      const char = str.charCodeAt(offset);
      if (isNumber(char) || isHexadecimalCharacter(char)) {
        offset += 1;
      } else {
        this.addToNumericResult(str, startIdx, offset, 16);
        return this.emitNumericEntity(char, 3);
      }
    }
    this.addToNumericResult(str, startIdx, offset, 16);
    return -1;
  }
  /**
   * Parses a decimal numeric entity.
   *
   * Equivalent to the `Decimal character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericDecimal(str, offset) {
    const startIdx = offset;
    while (offset < str.length) {
      const char = str.charCodeAt(offset);
      if (isNumber(char)) {
        offset += 1;
      } else {
        this.addToNumericResult(str, startIdx, offset, 10);
        return this.emitNumericEntity(char, 2);
      }
    }
    this.addToNumericResult(str, startIdx, offset, 10);
    return -1;
  }
  /**
   * Validate and emit a numeric entity.
   *
   * Implements the logic from the `Hexademical character reference start
   * state` and `Numeric character reference end state` in the HTML spec.
   *
   * @param lastCp The last code point of the entity. Used to see if the
   *               entity was terminated with a semicolon.
   * @param expectedLength The minimum number of characters that should be
   *                       consumed. Used to validate that at least one digit
   *                       was consumed.
   * @returns The number of characters that were consumed.
   */
  emitNumericEntity(lastCp, expectedLength) {
    var _a2;
    if (this.consumed <= expectedLength) {
      (_a2 = this.errors) === null || _a2 === void 0 ? void 0 : _a2.absenceOfDigitsInNumericCharacterReference(this.consumed);
      return 0;
    }
    if (lastCp === CharCodes.SEMI) {
      this.consumed += 1;
    } else if (this.decodeMode === DecodingMode.Strict) {
      return 0;
    }
    this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
    if (this.errors) {
      if (lastCp !== CharCodes.SEMI) {
        this.errors.missingSemicolonAfterCharacterReference();
      }
      this.errors.validateNumericCharacterReference(this.result);
    }
    return this.consumed;
  }
  /**
   * Parses a named entity.
   *
   * Equivalent to the `Named character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNamedEntity(str, offset) {
    const { decodeTree } = this;
    let current = decodeTree[this.treeIndex];
    let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
    for (; offset < str.length; offset++, this.excess++) {
      const char = str.charCodeAt(offset);
      this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
      if (this.treeIndex < 0) {
        return this.result === 0 || // If we are parsing an attribute
        this.decodeMode === DecodingMode.Attribute && // We shouldn't have consumed any characters after the entity,
        (valueLength === 0 || // And there should be no invalid characters.
        isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
      }
      current = decodeTree[this.treeIndex];
      valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
      if (valueLength !== 0) {
        if (char === CharCodes.SEMI) {
          return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
        }
        if (this.decodeMode !== DecodingMode.Strict) {
          this.result = this.treeIndex;
          this.consumed += this.excess;
          this.excess = 0;
        }
      }
    }
    return -1;
  }
  /**
   * Emit a named entity that was not terminated with a semicolon.
   *
   * @returns The number of characters consumed.
   */
  emitNotTerminatedNamedEntity() {
    var _a2;
    const { result, decodeTree } = this;
    const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
    this.emitNamedEntityData(result, valueLength, this.consumed);
    (_a2 = this.errors) === null || _a2 === void 0 ? void 0 : _a2.missingSemicolonAfterCharacterReference();
    return this.consumed;
  }
  /**
   * Emit a named entity.
   *
   * @param result The index of the entity in the decode tree.
   * @param valueLength The number of bytes in the entity.
   * @param consumed The number of characters consumed.
   *
   * @returns The number of characters consumed.
   */
  emitNamedEntityData(result, valueLength, consumed) {
    const { decodeTree } = this;
    this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~BinTrieFlags.VALUE_LENGTH : decodeTree[result + 1], consumed);
    if (valueLength === 3) {
      this.emitCodePoint(decodeTree[result + 2], consumed);
    }
    return consumed;
  }
  /**
   * Signal to the parser that the end of the input was reached.
   *
   * Remaining data will be emitted and relevant errors will be produced.
   *
   * @returns The number of characters consumed.
   */
  end() {
    var _a2;
    switch (this.state) {
      case EntityDecoderState.NamedEntity: {
        return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
      }
      case EntityDecoderState.NumericDecimal: {
        return this.emitNumericEntity(0, 2);
      }
      case EntityDecoderState.NumericHex: {
        return this.emitNumericEntity(0, 3);
      }
      case EntityDecoderState.NumericStart: {
        (_a2 = this.errors) === null || _a2 === void 0 ? void 0 : _a2.absenceOfDigitsInNumericCharacterReference(this.consumed);
        return 0;
      }
      case EntityDecoderState.EntityStart: {
        return 0;
      }
    }
  }
};
function getDecoder(decodeTree) {
  let ret = "";
  const decoder = new EntityDecoder(decodeTree, (str) => ret += fromCodePoint(str));
  return function decodeWithTrie(str, decodeMode) {
    let lastIndex = 0;
    let offset = 0;
    while ((offset = str.indexOf("&", offset)) >= 0) {
      ret += str.slice(lastIndex, offset);
      decoder.startEntity(decodeMode);
      const len = decoder.write(
        str,
        // Skip the "&"
        offset + 1
      );
      if (len < 0) {
        lastIndex = offset + decoder.end();
        break;
      }
      lastIndex = offset + len;
      offset = len === 0 ? lastIndex + 1 : lastIndex;
    }
    const result = ret + str.slice(lastIndex);
    ret = "";
    return result;
  };
}
function determineBranch(decodeTree, current, nodeIdx, char) {
  const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
  const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
  if (branchCount === 0) {
    return jumpOffset !== 0 && char === jumpOffset ? nodeIdx : -1;
  }
  if (jumpOffset) {
    const value = char - jumpOffset;
    return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIdx + value] - 1;
  }
  let lo = nodeIdx;
  let hi = lo + branchCount - 1;
  while (lo <= hi) {
    const mid = lo + hi >>> 1;
    const midVal = decodeTree[mid];
    if (midVal < char) {
      lo = mid + 1;
    } else if (midVal > char) {
      hi = mid - 1;
    } else {
      return decodeTree[mid + branchCount];
    }
  }
  return -1;
}
var htmlDecoder = getDecoder(decode_data_html_default);
var xmlDecoder = getDecoder(decode_data_xml_default);
var CharCodes2;
(function(CharCodes3) {
  CharCodes3[CharCodes3["Tab"] = 9] = "Tab";
  CharCodes3[CharCodes3["NewLine"] = 10] = "NewLine";
  CharCodes3[CharCodes3["FormFeed"] = 12] = "FormFeed";
  CharCodes3[CharCodes3["CarriageReturn"] = 13] = "CarriageReturn";
  CharCodes3[CharCodes3["Space"] = 32] = "Space";
  CharCodes3[CharCodes3["ExclamationMark"] = 33] = "ExclamationMark";
  CharCodes3[CharCodes3["Number"] = 35] = "Number";
  CharCodes3[CharCodes3["Amp"] = 38] = "Amp";
  CharCodes3[CharCodes3["SingleQuote"] = 39] = "SingleQuote";
  CharCodes3[CharCodes3["DoubleQuote"] = 34] = "DoubleQuote";
  CharCodes3[CharCodes3["Dash"] = 45] = "Dash";
  CharCodes3[CharCodes3["Slash"] = 47] = "Slash";
  CharCodes3[CharCodes3["Zero"] = 48] = "Zero";
  CharCodes3[CharCodes3["Nine"] = 57] = "Nine";
  CharCodes3[CharCodes3["Semi"] = 59] = "Semi";
  CharCodes3[CharCodes3["Lt"] = 60] = "Lt";
  CharCodes3[CharCodes3["Eq"] = 61] = "Eq";
  CharCodes3[CharCodes3["Gt"] = 62] = "Gt";
  CharCodes3[CharCodes3["Questionmark"] = 63] = "Questionmark";
  CharCodes3[CharCodes3["UpperA"] = 65] = "UpperA";
  CharCodes3[CharCodes3["LowerA"] = 97] = "LowerA";
  CharCodes3[CharCodes3["UpperF"] = 70] = "UpperF";
  CharCodes3[CharCodes3["LowerF"] = 102] = "LowerF";
  CharCodes3[CharCodes3["UpperZ"] = 90] = "UpperZ";
  CharCodes3[CharCodes3["LowerZ"] = 122] = "LowerZ";
  CharCodes3[CharCodes3["LowerX"] = 120] = "LowerX";
  CharCodes3[CharCodes3["OpeningSquareBracket"] = 91] = "OpeningSquareBracket";
})(CharCodes2 || (CharCodes2 = {}));
var State;
(function(State2) {
  State2[State2["Text"] = 1] = "Text";
  State2[State2["BeforeTagName"] = 2] = "BeforeTagName";
  State2[State2["InTagName"] = 3] = "InTagName";
  State2[State2["InSelfClosingTag"] = 4] = "InSelfClosingTag";
  State2[State2["BeforeClosingTagName"] = 5] = "BeforeClosingTagName";
  State2[State2["InClosingTagName"] = 6] = "InClosingTagName";
  State2[State2["AfterClosingTagName"] = 7] = "AfterClosingTagName";
  State2[State2["BeforeAttributeName"] = 8] = "BeforeAttributeName";
  State2[State2["InAttributeName"] = 9] = "InAttributeName";
  State2[State2["AfterAttributeName"] = 10] = "AfterAttributeName";
  State2[State2["BeforeAttributeValue"] = 11] = "BeforeAttributeValue";
  State2[State2["InAttributeValueDq"] = 12] = "InAttributeValueDq";
  State2[State2["InAttributeValueSq"] = 13] = "InAttributeValueSq";
  State2[State2["InAttributeValueNq"] = 14] = "InAttributeValueNq";
  State2[State2["BeforeDeclaration"] = 15] = "BeforeDeclaration";
  State2[State2["InDeclaration"] = 16] = "InDeclaration";
  State2[State2["InProcessingInstruction"] = 17] = "InProcessingInstruction";
  State2[State2["BeforeComment"] = 18] = "BeforeComment";
  State2[State2["CDATASequence"] = 19] = "CDATASequence";
  State2[State2["InSpecialComment"] = 20] = "InSpecialComment";
  State2[State2["InCommentLike"] = 21] = "InCommentLike";
  State2[State2["BeforeSpecialS"] = 22] = "BeforeSpecialS";
  State2[State2["SpecialStartSequence"] = 23] = "SpecialStartSequence";
  State2[State2["InSpecialTag"] = 24] = "InSpecialTag";
  State2[State2["BeforeEntity"] = 25] = "BeforeEntity";
  State2[State2["BeforeNumericEntity"] = 26] = "BeforeNumericEntity";
  State2[State2["InNamedEntity"] = 27] = "InNamedEntity";
  State2[State2["InNumericEntity"] = 28] = "InNumericEntity";
  State2[State2["InHexEntity"] = 29] = "InHexEntity";
})(State || (State = {}));
function isWhitespace(c) {
  return c === CharCodes2.Space || c === CharCodes2.NewLine || c === CharCodes2.Tab || c === CharCodes2.FormFeed || c === CharCodes2.CarriageReturn;
}
function isEndOfTagSection(c) {
  return c === CharCodes2.Slash || c === CharCodes2.Gt || isWhitespace(c);
}
function isNumber2(c) {
  return c >= CharCodes2.Zero && c <= CharCodes2.Nine;
}
function isASCIIAlpha(c) {
  return c >= CharCodes2.LowerA && c <= CharCodes2.LowerZ || c >= CharCodes2.UpperA && c <= CharCodes2.UpperZ;
}
function isHexDigit(c) {
  return c >= CharCodes2.UpperA && c <= CharCodes2.UpperF || c >= CharCodes2.LowerA && c <= CharCodes2.LowerF;
}
var QuoteType;
(function(QuoteType2) {
  QuoteType2[QuoteType2["NoValue"] = 0] = "NoValue";
  QuoteType2[QuoteType2["Unquoted"] = 1] = "Unquoted";
  QuoteType2[QuoteType2["Single"] = 2] = "Single";
  QuoteType2[QuoteType2["Double"] = 3] = "Double";
})(QuoteType || (QuoteType = {}));
var Sequences = {
  Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
  CdataEnd: new Uint8Array([93, 93, 62]),
  CommentEnd: new Uint8Array([45, 45, 62]),
  ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
  StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
  TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101])
  // `</title`
};
var Tokenizer = class {
  constructor({ xmlMode = false, decodeEntities = true }, cbs) {
    this.cbs = cbs;
    this.state = State.Text;
    this.buffer = "";
    this.sectionStart = 0;
    this.index = 0;
    this.baseState = State.Text;
    this.isSpecial = false;
    this.running = true;
    this.offset = 0;
    this.currentSequence = void 0;
    this.sequenceIndex = 0;
    this.trieIndex = 0;
    this.trieCurrent = 0;
    this.entityResult = 0;
    this.entityExcess = 0;
    this.xmlMode = xmlMode;
    this.decodeEntities = decodeEntities;
    this.entityTrie = xmlMode ? decode_data_xml_default : decode_data_html_default;
  }
  reset() {
    this.state = State.Text;
    this.buffer = "";
    this.sectionStart = 0;
    this.index = 0;
    this.baseState = State.Text;
    this.currentSequence = void 0;
    this.running = true;
    this.offset = 0;
  }
  write(chunk) {
    this.offset += this.buffer.length;
    this.buffer = chunk;
    this.parse();
  }
  end() {
    if (this.running)
      this.finish();
  }
  pause() {
    this.running = false;
  }
  resume() {
    this.running = true;
    if (this.index < this.buffer.length + this.offset) {
      this.parse();
    }
  }
  /**
   * The current index within all of the written data.
   */
  getIndex() {
    return this.index;
  }
  /**
   * The start of the current section.
   */
  getSectionStart() {
    return this.sectionStart;
  }
  stateText(c) {
    if (c === CharCodes2.Lt || !this.decodeEntities && this.fastForwardTo(CharCodes2.Lt)) {
      if (this.index > this.sectionStart) {
        this.cbs.ontext(this.sectionStart, this.index);
      }
      this.state = State.BeforeTagName;
      this.sectionStart = this.index;
    } else if (this.decodeEntities && c === CharCodes2.Amp) {
      this.state = State.BeforeEntity;
    }
  }
  stateSpecialStartSequence(c) {
    const isEnd = this.sequenceIndex === this.currentSequence.length;
    const isMatch = isEnd ? (
      // If we are at the end of the sequence, make sure the tag name has ended
      isEndOfTagSection(c)
    ) : (
      // Otherwise, do a case-insensitive comparison
      (c | 32) === this.currentSequence[this.sequenceIndex]
    );
    if (!isMatch) {
      this.isSpecial = false;
    } else if (!isEnd) {
      this.sequenceIndex++;
      return;
    }
    this.sequenceIndex = 0;
    this.state = State.InTagName;
    this.stateInTagName(c);
  }
  /** Look for an end tag. For <title> tags, also decode entities. */
  stateInSpecialTag(c) {
    if (this.sequenceIndex === this.currentSequence.length) {
      if (c === CharCodes2.Gt || isWhitespace(c)) {
        const endOfText = this.index - this.currentSequence.length;
        if (this.sectionStart < endOfText) {
          const actualIndex = this.index;
          this.index = endOfText;
          this.cbs.ontext(this.sectionStart, endOfText);
          this.index = actualIndex;
        }
        this.isSpecial = false;
        this.sectionStart = endOfText + 2;
        this.stateInClosingTagName(c);
        return;
      }
      this.sequenceIndex = 0;
    }
    if ((c | 32) === this.currentSequence[this.sequenceIndex]) {
      this.sequenceIndex += 1;
    } else if (this.sequenceIndex === 0) {
      if (this.currentSequence === Sequences.TitleEnd) {
        if (this.decodeEntities && c === CharCodes2.Amp) {
          this.state = State.BeforeEntity;
        }
      } else if (this.fastForwardTo(CharCodes2.Lt)) {
        this.sequenceIndex = 1;
      }
    } else {
      this.sequenceIndex = Number(c === CharCodes2.Lt);
    }
  }
  stateCDATASequence(c) {
    if (c === Sequences.Cdata[this.sequenceIndex]) {
      if (++this.sequenceIndex === Sequences.Cdata.length) {
        this.state = State.InCommentLike;
        this.currentSequence = Sequences.CdataEnd;
        this.sequenceIndex = 0;
        this.sectionStart = this.index + 1;
      }
    } else {
      this.sequenceIndex = 0;
      this.state = State.InDeclaration;
      this.stateInDeclaration(c);
    }
  }
  /**
   * When we wait for one specific character, we can speed things up
   * by skipping through the buffer until we find it.
   *
   * @returns Whether the character was found.
   */
  fastForwardTo(c) {
    while (++this.index < this.buffer.length + this.offset) {
      if (this.buffer.charCodeAt(this.index - this.offset) === c) {
        return true;
      }
    }
    this.index = this.buffer.length + this.offset - 1;
    return false;
  }
  /**
   * Comments and CDATA end with `-->` and `]]>`.
   *
   * Their common qualities are:
   * - Their end sequences have a distinct character they start with.
   * - That character is then repeated, so we have to check multiple repeats.
   * - All characters but the start character of the sequence can be skipped.
   */
  stateInCommentLike(c) {
    if (c === this.currentSequence[this.sequenceIndex]) {
      if (++this.sequenceIndex === this.currentSequence.length) {
        if (this.currentSequence === Sequences.CdataEnd) {
          this.cbs.oncdata(this.sectionStart, this.index, 2);
        } else {
          this.cbs.oncomment(this.sectionStart, this.index, 2);
        }
        this.sequenceIndex = 0;
        this.sectionStart = this.index + 1;
        this.state = State.Text;
      }
    } else if (this.sequenceIndex === 0) {
      if (this.fastForwardTo(this.currentSequence[0])) {
        this.sequenceIndex = 1;
      }
    } else if (c !== this.currentSequence[this.sequenceIndex - 1]) {
      this.sequenceIndex = 0;
    }
  }
  /**
   * HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
   *
   * XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
   * We allow anything that wouldn't end the tag.
   */
  isTagStartChar(c) {
    return this.xmlMode ? !isEndOfTagSection(c) : isASCIIAlpha(c);
  }
  startSpecial(sequence, offset) {
    this.isSpecial = true;
    this.currentSequence = sequence;
    this.sequenceIndex = offset;
    this.state = State.SpecialStartSequence;
  }
  stateBeforeTagName(c) {
    if (c === CharCodes2.ExclamationMark) {
      this.state = State.BeforeDeclaration;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes2.Questionmark) {
      this.state = State.InProcessingInstruction;
      this.sectionStart = this.index + 1;
    } else if (this.isTagStartChar(c)) {
      const lower = c | 32;
      this.sectionStart = this.index;
      if (!this.xmlMode && lower === Sequences.TitleEnd[2]) {
        this.startSpecial(Sequences.TitleEnd, 3);
      } else {
        this.state = !this.xmlMode && lower === Sequences.ScriptEnd[2] ? State.BeforeSpecialS : State.InTagName;
      }
    } else if (c === CharCodes2.Slash) {
      this.state = State.BeforeClosingTagName;
    } else {
      this.state = State.Text;
      this.stateText(c);
    }
  }
  stateInTagName(c) {
    if (isEndOfTagSection(c)) {
      this.cbs.onopentagname(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    }
  }
  stateBeforeClosingTagName(c) {
    if (isWhitespace(c)) {
    } else if (c === CharCodes2.Gt) {
      this.state = State.Text;
    } else {
      this.state = this.isTagStartChar(c) ? State.InClosingTagName : State.InSpecialComment;
      this.sectionStart = this.index;
    }
  }
  stateInClosingTagName(c) {
    if (c === CharCodes2.Gt || isWhitespace(c)) {
      this.cbs.onclosetag(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.AfterClosingTagName;
      this.stateAfterClosingTagName(c);
    }
  }
  stateAfterClosingTagName(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.state = State.Text;
      this.baseState = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateBeforeAttributeName(c) {
    if (c === CharCodes2.Gt) {
      this.cbs.onopentagend(this.index);
      if (this.isSpecial) {
        this.state = State.InSpecialTag;
        this.sequenceIndex = 0;
      } else {
        this.state = State.Text;
      }
      this.baseState = this.state;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes2.Slash) {
      this.state = State.InSelfClosingTag;
    } else if (!isWhitespace(c)) {
      this.state = State.InAttributeName;
      this.sectionStart = this.index;
    }
  }
  stateInSelfClosingTag(c) {
    if (c === CharCodes2.Gt) {
      this.cbs.onselfclosingtag(this.index);
      this.state = State.Text;
      this.baseState = State.Text;
      this.sectionStart = this.index + 1;
      this.isSpecial = false;
    } else if (!isWhitespace(c)) {
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    }
  }
  stateInAttributeName(c) {
    if (c === CharCodes2.Eq || isEndOfTagSection(c)) {
      this.cbs.onattribname(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.AfterAttributeName;
      this.stateAfterAttributeName(c);
    }
  }
  stateAfterAttributeName(c) {
    if (c === CharCodes2.Eq) {
      this.state = State.BeforeAttributeValue;
    } else if (c === CharCodes2.Slash || c === CharCodes2.Gt) {
      this.cbs.onattribend(QuoteType.NoValue, this.index);
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    } else if (!isWhitespace(c)) {
      this.cbs.onattribend(QuoteType.NoValue, this.index);
      this.state = State.InAttributeName;
      this.sectionStart = this.index;
    }
  }
  stateBeforeAttributeValue(c) {
    if (c === CharCodes2.DoubleQuote) {
      this.state = State.InAttributeValueDq;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes2.SingleQuote) {
      this.state = State.InAttributeValueSq;
      this.sectionStart = this.index + 1;
    } else if (!isWhitespace(c)) {
      this.sectionStart = this.index;
      this.state = State.InAttributeValueNq;
      this.stateInAttributeValueNoQuotes(c);
    }
  }
  handleInAttributeValue(c, quote) {
    if (c === quote || !this.decodeEntities && this.fastForwardTo(quote)) {
      this.cbs.onattribdata(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.cbs.onattribend(quote === CharCodes2.DoubleQuote ? QuoteType.Double : QuoteType.Single, this.index);
      this.state = State.BeforeAttributeName;
    } else if (this.decodeEntities && c === CharCodes2.Amp) {
      this.baseState = this.state;
      this.state = State.BeforeEntity;
    }
  }
  stateInAttributeValueDoubleQuotes(c) {
    this.handleInAttributeValue(c, CharCodes2.DoubleQuote);
  }
  stateInAttributeValueSingleQuotes(c) {
    this.handleInAttributeValue(c, CharCodes2.SingleQuote);
  }
  stateInAttributeValueNoQuotes(c) {
    if (isWhitespace(c) || c === CharCodes2.Gt) {
      this.cbs.onattribdata(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.cbs.onattribend(QuoteType.Unquoted, this.index);
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    } else if (this.decodeEntities && c === CharCodes2.Amp) {
      this.baseState = this.state;
      this.state = State.BeforeEntity;
    }
  }
  stateBeforeDeclaration(c) {
    if (c === CharCodes2.OpeningSquareBracket) {
      this.state = State.CDATASequence;
      this.sequenceIndex = 0;
    } else {
      this.state = c === CharCodes2.Dash ? State.BeforeComment : State.InDeclaration;
    }
  }
  stateInDeclaration(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.ondeclaration(this.sectionStart, this.index);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateInProcessingInstruction(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.onprocessinginstruction(this.sectionStart, this.index);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateBeforeComment(c) {
    if (c === CharCodes2.Dash) {
      this.state = State.InCommentLike;
      this.currentSequence = Sequences.CommentEnd;
      this.sequenceIndex = 2;
      this.sectionStart = this.index + 1;
    } else {
      this.state = State.InDeclaration;
    }
  }
  stateInSpecialComment(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.oncomment(this.sectionStart, this.index, 0);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateBeforeSpecialS(c) {
    const lower = c | 32;
    if (lower === Sequences.ScriptEnd[3]) {
      this.startSpecial(Sequences.ScriptEnd, 4);
    } else if (lower === Sequences.StyleEnd[3]) {
      this.startSpecial(Sequences.StyleEnd, 4);
    } else {
      this.state = State.InTagName;
      this.stateInTagName(c);
    }
  }
  stateBeforeEntity(c) {
    this.entityExcess = 1;
    this.entityResult = 0;
    if (c === CharCodes2.Number) {
      this.state = State.BeforeNumericEntity;
    } else if (c === CharCodes2.Amp) {
    } else {
      this.trieIndex = 0;
      this.trieCurrent = this.entityTrie[0];
      this.state = State.InNamedEntity;
      this.stateInNamedEntity(c);
    }
  }
  stateInNamedEntity(c) {
    this.entityExcess += 1;
    this.trieIndex = determineBranch(this.entityTrie, this.trieCurrent, this.trieIndex + 1, c);
    if (this.trieIndex < 0) {
      this.emitNamedEntity();
      this.index--;
      return;
    }
    this.trieCurrent = this.entityTrie[this.trieIndex];
    const masked = this.trieCurrent & BinTrieFlags.VALUE_LENGTH;
    if (masked) {
      const valueLength = (masked >> 14) - 1;
      if (!this.allowLegacyEntity() && c !== CharCodes2.Semi) {
        this.trieIndex += valueLength;
      } else {
        const entityStart = this.index - this.entityExcess + 1;
        if (entityStart > this.sectionStart) {
          this.emitPartial(this.sectionStart, entityStart);
        }
        this.entityResult = this.trieIndex;
        this.trieIndex += valueLength;
        this.entityExcess = 0;
        this.sectionStart = this.index + 1;
        if (valueLength === 0) {
          this.emitNamedEntity();
        }
      }
    }
  }
  emitNamedEntity() {
    this.state = this.baseState;
    if (this.entityResult === 0) {
      return;
    }
    const valueLength = (this.entityTrie[this.entityResult] & BinTrieFlags.VALUE_LENGTH) >> 14;
    switch (valueLength) {
      case 1: {
        this.emitCodePoint(this.entityTrie[this.entityResult] & ~BinTrieFlags.VALUE_LENGTH);
        break;
      }
      case 2: {
        this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
        break;
      }
      case 3: {
        this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
        this.emitCodePoint(this.entityTrie[this.entityResult + 2]);
      }
    }
  }
  stateBeforeNumericEntity(c) {
    if ((c | 32) === CharCodes2.LowerX) {
      this.entityExcess++;
      this.state = State.InHexEntity;
    } else {
      this.state = State.InNumericEntity;
      this.stateInNumericEntity(c);
    }
  }
  emitNumericEntity(strict) {
    const entityStart = this.index - this.entityExcess - 1;
    const numberStart = entityStart + 2 + Number(this.state === State.InHexEntity);
    if (numberStart !== this.index) {
      if (entityStart > this.sectionStart) {
        this.emitPartial(this.sectionStart, entityStart);
      }
      this.sectionStart = this.index + Number(strict);
      this.emitCodePoint(replaceCodePoint(this.entityResult));
    }
    this.state = this.baseState;
  }
  stateInNumericEntity(c) {
    if (c === CharCodes2.Semi) {
      this.emitNumericEntity(true);
    } else if (isNumber2(c)) {
      this.entityResult = this.entityResult * 10 + (c - CharCodes2.Zero);
      this.entityExcess++;
    } else {
      if (this.allowLegacyEntity()) {
        this.emitNumericEntity(false);
      } else {
        this.state = this.baseState;
      }
      this.index--;
    }
  }
  stateInHexEntity(c) {
    if (c === CharCodes2.Semi) {
      this.emitNumericEntity(true);
    } else if (isNumber2(c)) {
      this.entityResult = this.entityResult * 16 + (c - CharCodes2.Zero);
      this.entityExcess++;
    } else if (isHexDigit(c)) {
      this.entityResult = this.entityResult * 16 + ((c | 32) - CharCodes2.LowerA + 10);
      this.entityExcess++;
    } else {
      if (this.allowLegacyEntity()) {
        this.emitNumericEntity(false);
      } else {
        this.state = this.baseState;
      }
      this.index--;
    }
  }
  allowLegacyEntity() {
    return !this.xmlMode && (this.baseState === State.Text || this.baseState === State.InSpecialTag);
  }
  /**
   * Remove data that has already been consumed from the buffer.
   */
  cleanup() {
    if (this.running && this.sectionStart !== this.index) {
      if (this.state === State.Text || this.state === State.InSpecialTag && this.sequenceIndex === 0) {
        this.cbs.ontext(this.sectionStart, this.index);
        this.sectionStart = this.index;
      } else if (this.state === State.InAttributeValueDq || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueNq) {
        this.cbs.onattribdata(this.sectionStart, this.index);
        this.sectionStart = this.index;
      }
    }
  }
  shouldContinue() {
    return this.index < this.buffer.length + this.offset && this.running;
  }
  /**
   * Iterates through the buffer, calling the function corresponding to the current state.
   *
   * States that are more likely to be hit are higher up, as a performance improvement.
   */
  parse() {
    while (this.shouldContinue()) {
      const c = this.buffer.charCodeAt(this.index - this.offset);
      switch (this.state) {
        case State.Text: {
          this.stateText(c);
          break;
        }
        case State.SpecialStartSequence: {
          this.stateSpecialStartSequence(c);
          break;
        }
        case State.InSpecialTag: {
          this.stateInSpecialTag(c);
          break;
        }
        case State.CDATASequence: {
          this.stateCDATASequence(c);
          break;
        }
        case State.InAttributeValueDq: {
          this.stateInAttributeValueDoubleQuotes(c);
          break;
        }
        case State.InAttributeName: {
          this.stateInAttributeName(c);
          break;
        }
        case State.InCommentLike: {
          this.stateInCommentLike(c);
          break;
        }
        case State.InSpecialComment: {
          this.stateInSpecialComment(c);
          break;
        }
        case State.BeforeAttributeName: {
          this.stateBeforeAttributeName(c);
          break;
        }
        case State.InTagName: {
          this.stateInTagName(c);
          break;
        }
        case State.InClosingTagName: {
          this.stateInClosingTagName(c);
          break;
        }
        case State.BeforeTagName: {
          this.stateBeforeTagName(c);
          break;
        }
        case State.AfterAttributeName: {
          this.stateAfterAttributeName(c);
          break;
        }
        case State.InAttributeValueSq: {
          this.stateInAttributeValueSingleQuotes(c);
          break;
        }
        case State.BeforeAttributeValue: {
          this.stateBeforeAttributeValue(c);
          break;
        }
        case State.BeforeClosingTagName: {
          this.stateBeforeClosingTagName(c);
          break;
        }
        case State.AfterClosingTagName: {
          this.stateAfterClosingTagName(c);
          break;
        }
        case State.BeforeSpecialS: {
          this.stateBeforeSpecialS(c);
          break;
        }
        case State.InAttributeValueNq: {
          this.stateInAttributeValueNoQuotes(c);
          break;
        }
        case State.InSelfClosingTag: {
          this.stateInSelfClosingTag(c);
          break;
        }
        case State.InDeclaration: {
          this.stateInDeclaration(c);
          break;
        }
        case State.BeforeDeclaration: {
          this.stateBeforeDeclaration(c);
          break;
        }
        case State.BeforeComment: {
          this.stateBeforeComment(c);
          break;
        }
        case State.InProcessingInstruction: {
          this.stateInProcessingInstruction(c);
          break;
        }
        case State.InNamedEntity: {
          this.stateInNamedEntity(c);
          break;
        }
        case State.BeforeEntity: {
          this.stateBeforeEntity(c);
          break;
        }
        case State.InHexEntity: {
          this.stateInHexEntity(c);
          break;
        }
        case State.InNumericEntity: {
          this.stateInNumericEntity(c);
          break;
        }
        default: {
          this.stateBeforeNumericEntity(c);
        }
      }
      this.index++;
    }
    this.cleanup();
  }
  finish() {
    if (this.state === State.InNamedEntity) {
      this.emitNamedEntity();
    }
    if (this.sectionStart < this.index) {
      this.handleTrailingData();
    }
    this.cbs.onend();
  }
  /** Handle any trailing data. */
  handleTrailingData() {
    const endIndex = this.buffer.length + this.offset;
    if (this.state === State.InCommentLike) {
      if (this.currentSequence === Sequences.CdataEnd) {
        this.cbs.oncdata(this.sectionStart, endIndex, 0);
      } else {
        this.cbs.oncomment(this.sectionStart, endIndex, 0);
      }
    } else if (this.state === State.InNumericEntity && this.allowLegacyEntity()) {
      this.emitNumericEntity(false);
    } else if (this.state === State.InHexEntity && this.allowLegacyEntity()) {
      this.emitNumericEntity(false);
    } else if (this.state === State.InTagName || this.state === State.BeforeAttributeName || this.state === State.BeforeAttributeValue || this.state === State.AfterAttributeName || this.state === State.InAttributeName || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueDq || this.state === State.InAttributeValueNq || this.state === State.InClosingTagName) {
    } else {
      this.cbs.ontext(this.sectionStart, endIndex);
    }
  }
  emitPartial(start, endIndex) {
    if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
      this.cbs.onattribdata(start, endIndex);
    } else {
      this.cbs.ontext(start, endIndex);
    }
  }
  emitCodePoint(cp) {
    if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
      this.cbs.onattribentity(cp);
    } else {
      this.cbs.ontextentity(cp);
    }
  }
};
var formTags = /* @__PURE__ */ new Set([
  "input",
  "option",
  "optgroup",
  "select",
  "button",
  "datalist",
  "textarea"
]);
var pTag = /* @__PURE__ */ new Set(["p"]);
var tableSectionTags = /* @__PURE__ */ new Set(["thead", "tbody"]);
var ddtTags = /* @__PURE__ */ new Set(["dd", "dt"]);
var rtpTags = /* @__PURE__ */ new Set(["rt", "rp"]);
var openImpliesClose = /* @__PURE__ */ new Map([
  ["tr", /* @__PURE__ */ new Set(["tr", "th", "td"])],
  ["th", /* @__PURE__ */ new Set(["th"])],
  ["td", /* @__PURE__ */ new Set(["thead", "th", "td"])],
  ["body", /* @__PURE__ */ new Set(["head", "link", "script"])],
  ["li", /* @__PURE__ */ new Set(["li"])],
  ["p", pTag],
  ["h1", pTag],
  ["h2", pTag],
  ["h3", pTag],
  ["h4", pTag],
  ["h5", pTag],
  ["h6", pTag],
  ["select", formTags],
  ["input", formTags],
  ["output", formTags],
  ["button", formTags],
  ["datalist", formTags],
  ["textarea", formTags],
  ["option", /* @__PURE__ */ new Set(["option"])],
  ["optgroup", /* @__PURE__ */ new Set(["optgroup", "option"])],
  ["dd", ddtTags],
  ["dt", ddtTags],
  ["address", pTag],
  ["article", pTag],
  ["aside", pTag],
  ["blockquote", pTag],
  ["details", pTag],
  ["div", pTag],
  ["dl", pTag],
  ["fieldset", pTag],
  ["figcaption", pTag],
  ["figure", pTag],
  ["footer", pTag],
  ["form", pTag],
  ["header", pTag],
  ["hr", pTag],
  ["main", pTag],
  ["nav", pTag],
  ["ol", pTag],
  ["pre", pTag],
  ["section", pTag],
  ["table", pTag],
  ["ul", pTag],
  ["rt", rtpTags],
  ["rp", rtpTags],
  ["tbody", tableSectionTags],
  ["tfoot", tableSectionTags]
]);
var voidElements = /* @__PURE__ */ new Set([
  "area",
  "base",
  "basefont",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "img",
  "input",
  "isindex",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
var foreignContextElements = /* @__PURE__ */ new Set(["math", "svg"]);
var htmlIntegrationElements = /* @__PURE__ */ new Set([
  "mi",
  "mo",
  "mn",
  "ms",
  "mtext",
  "annotation-xml",
  "foreignobject",
  "desc",
  "title"
]);
var reNameEnd = /\s|\//;
var Parser = class {
  constructor(cbs, options = {}) {
    var _a2, _b, _c, _d, _e;
    this.options = options;
    this.startIndex = 0;
    this.endIndex = 0;
    this.openTagStart = 0;
    this.tagname = "";
    this.attribname = "";
    this.attribvalue = "";
    this.attribs = null;
    this.stack = [];
    this.foreignContext = [];
    this.buffers = [];
    this.bufferOffset = 0;
    this.writeIndex = 0;
    this.ended = false;
    this.cbs = cbs !== null && cbs !== void 0 ? cbs : {};
    this.lowerCaseTagNames = (_a2 = options.lowerCaseTags) !== null && _a2 !== void 0 ? _a2 : !options.xmlMode;
    this.lowerCaseAttributeNames = (_b = options.lowerCaseAttributeNames) !== null && _b !== void 0 ? _b : !options.xmlMode;
    this.tokenizer = new ((_c = options.Tokenizer) !== null && _c !== void 0 ? _c : Tokenizer)(this.options, this);
    (_e = (_d = this.cbs).onparserinit) === null || _e === void 0 ? void 0 : _e.call(_d, this);
  }
  // Tokenizer event handlers
  /** @internal */
  ontext(start, endIndex) {
    var _a2, _b;
    const data2 = this.getSlice(start, endIndex);
    this.endIndex = endIndex - 1;
    (_b = (_a2 = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a2, data2);
    this.startIndex = endIndex;
  }
  /** @internal */
  ontextentity(cp) {
    var _a2, _b;
    const index = this.tokenizer.getSectionStart();
    this.endIndex = index - 1;
    (_b = (_a2 = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a2, fromCodePoint(cp));
    this.startIndex = index;
  }
  isVoidElement(name) {
    return !this.options.xmlMode && voidElements.has(name);
  }
  /** @internal */
  onopentagname(start, endIndex) {
    this.endIndex = endIndex;
    let name = this.getSlice(start, endIndex);
    if (this.lowerCaseTagNames) {
      name = name.toLowerCase();
    }
    this.emitOpenTag(name);
  }
  emitOpenTag(name) {
    var _a2, _b, _c, _d;
    this.openTagStart = this.startIndex;
    this.tagname = name;
    const impliesClose = !this.options.xmlMode && openImpliesClose.get(name);
    if (impliesClose) {
      while (this.stack.length > 0 && impliesClose.has(this.stack[this.stack.length - 1])) {
        const element = this.stack.pop();
        (_b = (_a2 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a2, element, true);
      }
    }
    if (!this.isVoidElement(name)) {
      this.stack.push(name);
      if (foreignContextElements.has(name)) {
        this.foreignContext.push(true);
      } else if (htmlIntegrationElements.has(name)) {
        this.foreignContext.push(false);
      }
    }
    (_d = (_c = this.cbs).onopentagname) === null || _d === void 0 ? void 0 : _d.call(_c, name);
    if (this.cbs.onopentag)
      this.attribs = {};
  }
  endOpenTag(isImplied) {
    var _a2, _b;
    this.startIndex = this.openTagStart;
    if (this.attribs) {
      (_b = (_a2 = this.cbs).onopentag) === null || _b === void 0 ? void 0 : _b.call(_a2, this.tagname, this.attribs, isImplied);
      this.attribs = null;
    }
    if (this.cbs.onclosetag && this.isVoidElement(this.tagname)) {
      this.cbs.onclosetag(this.tagname, true);
    }
    this.tagname = "";
  }
  /** @internal */
  onopentagend(endIndex) {
    this.endIndex = endIndex;
    this.endOpenTag(false);
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onclosetag(start, endIndex) {
    var _a2, _b, _c, _d, _e, _f;
    this.endIndex = endIndex;
    let name = this.getSlice(start, endIndex);
    if (this.lowerCaseTagNames) {
      name = name.toLowerCase();
    }
    if (foreignContextElements.has(name) || htmlIntegrationElements.has(name)) {
      this.foreignContext.pop();
    }
    if (!this.isVoidElement(name)) {
      const pos = this.stack.lastIndexOf(name);
      if (pos !== -1) {
        if (this.cbs.onclosetag) {
          let count = this.stack.length - pos;
          while (count--) {
            this.cbs.onclosetag(this.stack.pop(), count !== 0);
          }
        } else
          this.stack.length = pos;
      } else if (!this.options.xmlMode && name === "p") {
        this.emitOpenTag("p");
        this.closeCurrentTag(true);
      }
    } else if (!this.options.xmlMode && name === "br") {
      (_b = (_a2 = this.cbs).onopentagname) === null || _b === void 0 ? void 0 : _b.call(_a2, "br");
      (_d = (_c = this.cbs).onopentag) === null || _d === void 0 ? void 0 : _d.call(_c, "br", {}, true);
      (_f = (_e = this.cbs).onclosetag) === null || _f === void 0 ? void 0 : _f.call(_e, "br", false);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onselfclosingtag(endIndex) {
    this.endIndex = endIndex;
    if (this.options.xmlMode || this.options.recognizeSelfClosing || this.foreignContext[this.foreignContext.length - 1]) {
      this.closeCurrentTag(false);
      this.startIndex = endIndex + 1;
    } else {
      this.onopentagend(endIndex);
    }
  }
  closeCurrentTag(isOpenImplied) {
    var _a2, _b;
    const name = this.tagname;
    this.endOpenTag(isOpenImplied);
    if (this.stack[this.stack.length - 1] === name) {
      (_b = (_a2 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a2, name, !isOpenImplied);
      this.stack.pop();
    }
  }
  /** @internal */
  onattribname(start, endIndex) {
    this.startIndex = start;
    const name = this.getSlice(start, endIndex);
    this.attribname = this.lowerCaseAttributeNames ? name.toLowerCase() : name;
  }
  /** @internal */
  onattribdata(start, endIndex) {
    this.attribvalue += this.getSlice(start, endIndex);
  }
  /** @internal */
  onattribentity(cp) {
    this.attribvalue += fromCodePoint(cp);
  }
  /** @internal */
  onattribend(quote, endIndex) {
    var _a2, _b;
    this.endIndex = endIndex;
    (_b = (_a2 = this.cbs).onattribute) === null || _b === void 0 ? void 0 : _b.call(_a2, this.attribname, this.attribvalue, quote === QuoteType.Double ? '"' : quote === QuoteType.Single ? "'" : quote === QuoteType.NoValue ? void 0 : null);
    if (this.attribs && !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) {
      this.attribs[this.attribname] = this.attribvalue;
    }
    this.attribvalue = "";
  }
  getInstructionName(value) {
    const index = value.search(reNameEnd);
    let name = index < 0 ? value : value.substr(0, index);
    if (this.lowerCaseTagNames) {
      name = name.toLowerCase();
    }
    return name;
  }
  /** @internal */
  ondeclaration(start, endIndex) {
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex);
    if (this.cbs.onprocessinginstruction) {
      const name = this.getInstructionName(value);
      this.cbs.onprocessinginstruction(`!${name}`, `!${value}`);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onprocessinginstruction(start, endIndex) {
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex);
    if (this.cbs.onprocessinginstruction) {
      const name = this.getInstructionName(value);
      this.cbs.onprocessinginstruction(`?${name}`, `?${value}`);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  oncomment(start, endIndex, offset) {
    var _a2, _b, _c, _d;
    this.endIndex = endIndex;
    (_b = (_a2 = this.cbs).oncomment) === null || _b === void 0 ? void 0 : _b.call(_a2, this.getSlice(start, endIndex - offset));
    (_d = (_c = this.cbs).oncommentend) === null || _d === void 0 ? void 0 : _d.call(_c);
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  oncdata(start, endIndex, offset) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex - offset);
    if (this.options.xmlMode || this.options.recognizeCDATA) {
      (_b = (_a2 = this.cbs).oncdatastart) === null || _b === void 0 ? void 0 : _b.call(_a2);
      (_d = (_c = this.cbs).ontext) === null || _d === void 0 ? void 0 : _d.call(_c, value);
      (_f = (_e = this.cbs).oncdataend) === null || _f === void 0 ? void 0 : _f.call(_e);
    } else {
      (_h = (_g = this.cbs).oncomment) === null || _h === void 0 ? void 0 : _h.call(_g, `[CDATA[${value}]]`);
      (_k = (_j = this.cbs).oncommentend) === null || _k === void 0 ? void 0 : _k.call(_j);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onend() {
    var _a2, _b;
    if (this.cbs.onclosetag) {
      this.endIndex = this.startIndex;
      for (let index = this.stack.length; index > 0; this.cbs.onclosetag(this.stack[--index], true))
        ;
    }
    (_b = (_a2 = this.cbs).onend) === null || _b === void 0 ? void 0 : _b.call(_a2);
  }
  /**
   * Resets the parser to a blank state, ready to parse a new HTML document
   */
  reset() {
    var _a2, _b, _c, _d;
    (_b = (_a2 = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a2);
    this.tokenizer.reset();
    this.tagname = "";
    this.attribname = "";
    this.attribs = null;
    this.stack.length = 0;
    this.startIndex = 0;
    this.endIndex = 0;
    (_d = (_c = this.cbs).onparserinit) === null || _d === void 0 ? void 0 : _d.call(_c, this);
    this.buffers.length = 0;
    this.bufferOffset = 0;
    this.writeIndex = 0;
    this.ended = false;
  }
  /**
   * Resets the parser, then parses a complete document and
   * pushes it to the handler.
   *
   * @param data Document to parse.
   */
  parseComplete(data2) {
    this.reset();
    this.end(data2);
  }
  getSlice(start, end) {
    while (start - this.bufferOffset >= this.buffers[0].length) {
      this.shiftBuffer();
    }
    let slice = this.buffers[0].slice(start - this.bufferOffset, end - this.bufferOffset);
    while (end - this.bufferOffset > this.buffers[0].length) {
      this.shiftBuffer();
      slice += this.buffers[0].slice(0, end - this.bufferOffset);
    }
    return slice;
  }
  shiftBuffer() {
    this.bufferOffset += this.buffers[0].length;
    this.writeIndex--;
    this.buffers.shift();
  }
  /**
   * Parses a chunk of data and calls the corresponding callbacks.
   *
   * @param chunk Chunk to parse.
   */
  write(chunk) {
    var _a2, _b;
    if (this.ended) {
      (_b = (_a2 = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a2, new Error(".write() after done!"));
      return;
    }
    this.buffers.push(chunk);
    if (this.tokenizer.running) {
      this.tokenizer.write(chunk);
      this.writeIndex++;
    }
  }
  /**
   * Parses the end of the buffer and clears the stack, calls onend.
   *
   * @param chunk Optional final chunk to parse.
   */
  end(chunk) {
    var _a2, _b;
    if (this.ended) {
      (_b = (_a2 = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a2, new Error(".end() after done!"));
      return;
    }
    if (chunk)
      this.write(chunk);
    this.ended = true;
    this.tokenizer.end();
  }
  /**
   * Pauses parsing. The parser won't emit events until `resume` is called.
   */
  pause() {
    this.tokenizer.pause();
  }
  /**
   * Resumes parsing after `pause` was called.
   */
  resume() {
    this.tokenizer.resume();
    while (this.tokenizer.running && this.writeIndex < this.buffers.length) {
      this.tokenizer.write(this.buffers[this.writeIndex++]);
    }
    if (this.ended)
      this.tokenizer.end();
  }
  /**
   * Alias of `write`, for backwards compatibility.
   *
   * @param chunk Chunk to parse.
   * @deprecated
   */
  parseChunk(chunk) {
    this.write(chunk);
  }
  /**
   * Alias of `end`, for backwards compatibility.
   *
   * @param chunk Optional final chunk to parse.
   * @deprecated
   */
  done(chunk) {
    this.end(chunk);
  }
};
var esm_exports = {};
__export2(esm_exports, {
  CDATA: () => CDATA,
  Comment: () => Comment,
  Directive: () => Directive,
  Doctype: () => Doctype,
  ElementType: () => ElementType,
  Root: () => Root,
  Script: () => Script,
  Style: () => Style,
  Tag: () => Tag,
  Text: () => Text2,
  isTag: () => isTag
});
var ElementType;
(function(ElementType2) {
  ElementType2["Root"] = "root";
  ElementType2["Text"] = "text";
  ElementType2["Directive"] = "directive";
  ElementType2["Comment"] = "comment";
  ElementType2["Script"] = "script";
  ElementType2["Style"] = "style";
  ElementType2["Tag"] = "tag";
  ElementType2["CDATA"] = "cdata";
  ElementType2["Doctype"] = "doctype";
})(ElementType || (ElementType = {}));
function isTag(elem) {
  return elem.type === ElementType.Tag || elem.type === ElementType.Script || elem.type === ElementType.Style;
}
var Root = ElementType.Root;
var Text2 = ElementType.Text;
var Directive = ElementType.Directive;
var Comment = ElementType.Comment;
var Script = ElementType.Script;
var Style = ElementType.Style;
var Tag = ElementType.Tag;
var CDATA = ElementType.CDATA;
var Doctype = ElementType.Doctype;
var Node = class {
  constructor() {
    this.parent = null;
    this.prev = null;
    this.next = null;
    this.startIndex = null;
    this.endIndex = null;
  }
  // Read-write aliases for properties
  /**
   * Same as {@link parent}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get parentNode() {
    return this.parent;
  }
  set parentNode(parent) {
    this.parent = parent;
  }
  /**
   * Same as {@link prev}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get previousSibling() {
    return this.prev;
  }
  set previousSibling(prev) {
    this.prev = prev;
  }
  /**
   * Same as {@link next}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get nextSibling() {
    return this.next;
  }
  set nextSibling(next) {
    this.next = next;
  }
  /**
   * Clone this node, and optionally its children.
   *
   * @param recursive Clone child nodes as well.
   * @returns A clone of the node.
   */
  cloneNode(recursive = false) {
    return cloneNode(this, recursive);
  }
};
var DataNode = class extends Node {
  /**
   * @param data The content of the data node
   */
  constructor(data2) {
    super();
    this.data = data2;
  }
  /**
   * Same as {@link data}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get nodeValue() {
    return this.data;
  }
  set nodeValue(data2) {
    this.data = data2;
  }
};
var Text22 = class extends DataNode {
  constructor() {
    super(...arguments);
    this.type = ElementType.Text;
  }
  get nodeType() {
    return 3;
  }
};
var Comment2 = class extends DataNode {
  constructor() {
    super(...arguments);
    this.type = ElementType.Comment;
  }
  get nodeType() {
    return 8;
  }
};
var ProcessingInstruction = class extends DataNode {
  constructor(name, data2) {
    super(data2);
    this.name = name;
    this.type = ElementType.Directive;
  }
  get nodeType() {
    return 1;
  }
};
var NodeWithChildren = class extends Node {
  /**
   * @param children Children of the node. Only certain node types can have children.
   */
  constructor(children) {
    super();
    this.children = children;
  }
  // Aliases
  /** First child of the node. */
  get firstChild() {
    var _a2;
    return (_a2 = this.children[0]) !== null && _a2 !== void 0 ? _a2 : null;
  }
  /** Last child of the node. */
  get lastChild() {
    return this.children.length > 0 ? this.children[this.children.length - 1] : null;
  }
  /**
   * Same as {@link children}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get childNodes() {
    return this.children;
  }
  set childNodes(children) {
    this.children = children;
  }
};
var CDATA2 = class extends NodeWithChildren {
  constructor() {
    super(...arguments);
    this.type = ElementType.CDATA;
  }
  get nodeType() {
    return 4;
  }
};
var Document = class extends NodeWithChildren {
  constructor() {
    super(...arguments);
    this.type = ElementType.Root;
  }
  get nodeType() {
    return 9;
  }
};
var Element = class extends NodeWithChildren {
  /**
   * @param name Name of the tag, eg. `div`, `span`.
   * @param attribs Object mapping attribute names to attribute values.
   * @param children Children of the node.
   */
  constructor(name, attribs, children = [], type = name === "script" ? ElementType.Script : name === "style" ? ElementType.Style : ElementType.Tag) {
    super(children);
    this.name = name;
    this.attribs = attribs;
    this.type = type;
  }
  get nodeType() {
    return 1;
  }
  // DOM Level 1 aliases
  /**
   * Same as {@link name}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get tagName() {
    return this.name;
  }
  set tagName(name) {
    this.name = name;
  }
  get attributes() {
    return Object.keys(this.attribs).map((name) => {
      var _a2, _b;
      return {
        name,
        value: this.attribs[name],
        namespace: (_a2 = this["x-attribsNamespace"]) === null || _a2 === void 0 ? void 0 : _a2[name],
        prefix: (_b = this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name]
      };
    });
  }
};
function isTag2(node) {
  return isTag(node);
}
function isCDATA(node) {
  return node.type === ElementType.CDATA;
}
function isText(node) {
  return node.type === ElementType.Text;
}
function isComment(node) {
  return node.type === ElementType.Comment;
}
function isDirective(node) {
  return node.type === ElementType.Directive;
}
function isDocument(node) {
  return node.type === ElementType.Root;
}
function hasChildren(node) {
  return Object.prototype.hasOwnProperty.call(node, "children");
}
function cloneNode(node, recursive = false) {
  let result;
  if (isText(node)) {
    result = new Text22(node.data);
  } else if (isComment(node)) {
    result = new Comment2(node.data);
  } else if (isTag2(node)) {
    const children = recursive ? cloneChildren(node.children) : [];
    const clone = new Element(node.name, { ...node.attribs }, children);
    children.forEach((child) => child.parent = clone);
    if (node.namespace != null) {
      clone.namespace = node.namespace;
    }
    if (node["x-attribsNamespace"]) {
      clone["x-attribsNamespace"] = { ...node["x-attribsNamespace"] };
    }
    if (node["x-attribsPrefix"]) {
      clone["x-attribsPrefix"] = { ...node["x-attribsPrefix"] };
    }
    result = clone;
  } else if (isCDATA(node)) {
    const children = recursive ? cloneChildren(node.children) : [];
    const clone = new CDATA2(children);
    children.forEach((child) => child.parent = clone);
    result = clone;
  } else if (isDocument(node)) {
    const children = recursive ? cloneChildren(node.children) : [];
    const clone = new Document(children);
    children.forEach((child) => child.parent = clone);
    if (node["x-mode"]) {
      clone["x-mode"] = node["x-mode"];
    }
    result = clone;
  } else if (isDirective(node)) {
    const instruction = new ProcessingInstruction(node.name, node.data);
    if (node["x-name"] != null) {
      instruction["x-name"] = node["x-name"];
      instruction["x-publicId"] = node["x-publicId"];
      instruction["x-systemId"] = node["x-systemId"];
    }
    result = instruction;
  } else {
    throw new Error(`Not implemented yet: ${node.type}`);
  }
  result.startIndex = node.startIndex;
  result.endIndex = node.endIndex;
  if (node.sourceCodeLocation != null) {
    result.sourceCodeLocation = node.sourceCodeLocation;
  }
  return result;
}
function cloneChildren(childs) {
  const children = childs.map((child) => cloneNode(child, true));
  for (let i = 1; i < children.length; i++) {
    children[i].prev = children[i - 1];
    children[i - 1].next = children[i];
  }
  return children;
}
var defaultOpts = {
  withStartIndices: false,
  withEndIndices: false,
  xmlMode: false
};
var DomHandler = class {
  /**
   * @param callback Called once parsing has completed.
   * @param options Settings for the handler.
   * @param elementCB Callback whenever a tag is closed.
   */
  constructor(callback, options, elementCB) {
    this.dom = [];
    this.root = new Document(this.dom);
    this.done = false;
    this.tagStack = [this.root];
    this.lastNode = null;
    this.parser = null;
    if (typeof options === "function") {
      elementCB = options;
      options = defaultOpts;
    }
    if (typeof callback === "object") {
      options = callback;
      callback = void 0;
    }
    this.callback = callback !== null && callback !== void 0 ? callback : null;
    this.options = options !== null && options !== void 0 ? options : defaultOpts;
    this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
  }
  onparserinit(parser) {
    this.parser = parser;
  }
  // Resets the handler back to starting state
  onreset() {
    this.dom = [];
    this.root = new Document(this.dom);
    this.done = false;
    this.tagStack = [this.root];
    this.lastNode = null;
    this.parser = null;
  }
  // Signals the handler that parsing is done
  onend() {
    if (this.done)
      return;
    this.done = true;
    this.parser = null;
    this.handleCallback(null);
  }
  onerror(error) {
    this.handleCallback(error);
  }
  onclosetag() {
    this.lastNode = null;
    const elem = this.tagStack.pop();
    if (this.options.withEndIndices) {
      elem.endIndex = this.parser.endIndex;
    }
    if (this.elementCB)
      this.elementCB(elem);
  }
  onopentag(name, attribs) {
    const type = this.options.xmlMode ? ElementType.Tag : void 0;
    const element = new Element(name, attribs, void 0, type);
    this.addNode(element);
    this.tagStack.push(element);
  }
  ontext(data2) {
    const { lastNode } = this;
    if (lastNode && lastNode.type === ElementType.Text) {
      lastNode.data += data2;
      if (this.options.withEndIndices) {
        lastNode.endIndex = this.parser.endIndex;
      }
    } else {
      const node = new Text22(data2);
      this.addNode(node);
      this.lastNode = node;
    }
  }
  oncomment(data2) {
    if (this.lastNode && this.lastNode.type === ElementType.Comment) {
      this.lastNode.data += data2;
      return;
    }
    const node = new Comment2(data2);
    this.addNode(node);
    this.lastNode = node;
  }
  oncommentend() {
    this.lastNode = null;
  }
  oncdatastart() {
    const text = new Text22("");
    const node = new CDATA2([text]);
    this.addNode(node);
    text.parent = node;
    this.lastNode = text;
  }
  oncdataend() {
    this.lastNode = null;
  }
  onprocessinginstruction(name, data2) {
    const node = new ProcessingInstruction(name, data2);
    this.addNode(node);
  }
  handleCallback(error) {
    if (typeof this.callback === "function") {
      this.callback(error, this.dom);
    } else if (error) {
      throw error;
    }
  }
  addNode(node) {
    const parent = this.tagStack[this.tagStack.length - 1];
    const previousSibling2 = parent.children[parent.children.length - 1];
    if (this.options.withStartIndices) {
      node.startIndex = this.parser.startIndex;
    }
    if (this.options.withEndIndices) {
      node.endIndex = this.parser.endIndex;
    }
    parent.children.push(node);
    if (previousSibling2) {
      node.prev = previousSibling2;
      previousSibling2.next = node;
    }
    node.parent = parent;
    this.lastNode = null;
  }
};
var esm_exports2 = {};
__export2(esm_exports2, {
  DocumentPosition: () => DocumentPosition,
  append: () => append,
  appendChild: () => appendChild,
  compareDocumentPosition: () => compareDocumentPosition,
  existsOne: () => existsOne,
  filter: () => filter,
  find: () => find,
  findAll: () => findAll,
  findOne: () => findOne,
  findOneChild: () => findOneChild,
  getAttributeValue: () => getAttributeValue,
  getChildren: () => getChildren,
  getElementById: () => getElementById,
  getElements: () => getElements,
  getElementsByTagName: () => getElementsByTagName,
  getElementsByTagType: () => getElementsByTagType,
  getFeed: () => getFeed,
  getInnerHTML: () => getInnerHTML,
  getName: () => getName,
  getOuterHTML: () => getOuterHTML,
  getParent: () => getParent,
  getSiblings: () => getSiblings,
  getText: () => getText,
  hasAttrib: () => hasAttrib,
  hasChildren: () => hasChildren,
  innerText: () => innerText,
  isCDATA: () => isCDATA,
  isComment: () => isComment,
  isDocument: () => isDocument,
  isTag: () => isTag2,
  isText: () => isText,
  nextElementSibling: () => nextElementSibling,
  prepend: () => prepend,
  prependChild: () => prependChild,
  prevElementSibling: () => prevElementSibling,
  removeElement: () => removeElement,
  removeSubsets: () => removeSubsets,
  replaceElement: () => replaceElement,
  testElement: () => testElement,
  textContent: () => textContent,
  uniqueSort: () => uniqueSort
});
function restoreDiff(arr) {
  for (let i = 1; i < arr.length; i++) {
    arr[i][0] += arr[i - 1][0] + 1;
  }
  return arr;
}
var encode_html_default = new Map(/* @__PURE__ */ restoreDiff([[9, "&Tab;"], [0, "&NewLine;"], [22, "&excl;"], [0, "&quot;"], [0, "&num;"], [0, "&dollar;"], [0, "&percnt;"], [0, "&amp;"], [0, "&apos;"], [0, "&lpar;"], [0, "&rpar;"], [0, "&ast;"], [0, "&plus;"], [0, "&comma;"], [1, "&period;"], [0, "&sol;"], [10, "&colon;"], [0, "&semi;"], [0, { v: "&lt;", n: 8402, o: "&nvlt;" }], [0, { v: "&equals;", n: 8421, o: "&bne;" }], [0, { v: "&gt;", n: 8402, o: "&nvgt;" }], [0, "&quest;"], [0, "&commat;"], [26, "&lbrack;"], [0, "&bsol;"], [0, "&rbrack;"], [0, "&Hat;"], [0, "&lowbar;"], [0, "&DiacriticalGrave;"], [5, { n: 106, o: "&fjlig;" }], [20, "&lbrace;"], [0, "&verbar;"], [0, "&rbrace;"], [34, "&nbsp;"], [0, "&iexcl;"], [0, "&cent;"], [0, "&pound;"], [0, "&curren;"], [0, "&yen;"], [0, "&brvbar;"], [0, "&sect;"], [0, "&die;"], [0, "&copy;"], [0, "&ordf;"], [0, "&laquo;"], [0, "&not;"], [0, "&shy;"], [0, "&circledR;"], [0, "&macr;"], [0, "&deg;"], [0, "&PlusMinus;"], [0, "&sup2;"], [0, "&sup3;"], [0, "&acute;"], [0, "&micro;"], [0, "&para;"], [0, "&centerdot;"], [0, "&cedil;"], [0, "&sup1;"], [0, "&ordm;"], [0, "&raquo;"], [0, "&frac14;"], [0, "&frac12;"], [0, "&frac34;"], [0, "&iquest;"], [0, "&Agrave;"], [0, "&Aacute;"], [0, "&Acirc;"], [0, "&Atilde;"], [0, "&Auml;"], [0, "&angst;"], [0, "&AElig;"], [0, "&Ccedil;"], [0, "&Egrave;"], [0, "&Eacute;"], [0, "&Ecirc;"], [0, "&Euml;"], [0, "&Igrave;"], [0, "&Iacute;"], [0, "&Icirc;"], [0, "&Iuml;"], [0, "&ETH;"], [0, "&Ntilde;"], [0, "&Ograve;"], [0, "&Oacute;"], [0, "&Ocirc;"], [0, "&Otilde;"], [0, "&Ouml;"], [0, "&times;"], [0, "&Oslash;"], [0, "&Ugrave;"], [0, "&Uacute;"], [0, "&Ucirc;"], [0, "&Uuml;"], [0, "&Yacute;"], [0, "&THORN;"], [0, "&szlig;"], [0, "&agrave;"], [0, "&aacute;"], [0, "&acirc;"], [0, "&atilde;"], [0, "&auml;"], [0, "&aring;"], [0, "&aelig;"], [0, "&ccedil;"], [0, "&egrave;"], [0, "&eacute;"], [0, "&ecirc;"], [0, "&euml;"], [0, "&igrave;"], [0, "&iacute;"], [0, "&icirc;"], [0, "&iuml;"], [0, "&eth;"], [0, "&ntilde;"], [0, "&ograve;"], [0, "&oacute;"], [0, "&ocirc;"], [0, "&otilde;"], [0, "&ouml;"], [0, "&div;"], [0, "&oslash;"], [0, "&ugrave;"], [0, "&uacute;"], [0, "&ucirc;"], [0, "&uuml;"], [0, "&yacute;"], [0, "&thorn;"], [0, "&yuml;"], [0, "&Amacr;"], [0, "&amacr;"], [0, "&Abreve;"], [0, "&abreve;"], [0, "&Aogon;"], [0, "&aogon;"], [0, "&Cacute;"], [0, "&cacute;"], [0, "&Ccirc;"], [0, "&ccirc;"], [0, "&Cdot;"], [0, "&cdot;"], [0, "&Ccaron;"], [0, "&ccaron;"], [0, "&Dcaron;"], [0, "&dcaron;"], [0, "&Dstrok;"], [0, "&dstrok;"], [0, "&Emacr;"], [0, "&emacr;"], [2, "&Edot;"], [0, "&edot;"], [0, "&Eogon;"], [0, "&eogon;"], [0, "&Ecaron;"], [0, "&ecaron;"], [0, "&Gcirc;"], [0, "&gcirc;"], [0, "&Gbreve;"], [0, "&gbreve;"], [0, "&Gdot;"], [0, "&gdot;"], [0, "&Gcedil;"], [1, "&Hcirc;"], [0, "&hcirc;"], [0, "&Hstrok;"], [0, "&hstrok;"], [0, "&Itilde;"], [0, "&itilde;"], [0, "&Imacr;"], [0, "&imacr;"], [2, "&Iogon;"], [0, "&iogon;"], [0, "&Idot;"], [0, "&imath;"], [0, "&IJlig;"], [0, "&ijlig;"], [0, "&Jcirc;"], [0, "&jcirc;"], [0, "&Kcedil;"], [0, "&kcedil;"], [0, "&kgreen;"], [0, "&Lacute;"], [0, "&lacute;"], [0, "&Lcedil;"], [0, "&lcedil;"], [0, "&Lcaron;"], [0, "&lcaron;"], [0, "&Lmidot;"], [0, "&lmidot;"], [0, "&Lstrok;"], [0, "&lstrok;"], [0, "&Nacute;"], [0, "&nacute;"], [0, "&Ncedil;"], [0, "&ncedil;"], [0, "&Ncaron;"], [0, "&ncaron;"], [0, "&napos;"], [0, "&ENG;"], [0, "&eng;"], [0, "&Omacr;"], [0, "&omacr;"], [2, "&Odblac;"], [0, "&odblac;"], [0, "&OElig;"], [0, "&oelig;"], [0, "&Racute;"], [0, "&racute;"], [0, "&Rcedil;"], [0, "&rcedil;"], [0, "&Rcaron;"], [0, "&rcaron;"], [0, "&Sacute;"], [0, "&sacute;"], [0, "&Scirc;"], [0, "&scirc;"], [0, "&Scedil;"], [0, "&scedil;"], [0, "&Scaron;"], [0, "&scaron;"], [0, "&Tcedil;"], [0, "&tcedil;"], [0, "&Tcaron;"], [0, "&tcaron;"], [0, "&Tstrok;"], [0, "&tstrok;"], [0, "&Utilde;"], [0, "&utilde;"], [0, "&Umacr;"], [0, "&umacr;"], [0, "&Ubreve;"], [0, "&ubreve;"], [0, "&Uring;"], [0, "&uring;"], [0, "&Udblac;"], [0, "&udblac;"], [0, "&Uogon;"], [0, "&uogon;"], [0, "&Wcirc;"], [0, "&wcirc;"], [0, "&Ycirc;"], [0, "&ycirc;"], [0, "&Yuml;"], [0, "&Zacute;"], [0, "&zacute;"], [0, "&Zdot;"], [0, "&zdot;"], [0, "&Zcaron;"], [0, "&zcaron;"], [19, "&fnof;"], [34, "&imped;"], [63, "&gacute;"], [65, "&jmath;"], [142, "&circ;"], [0, "&caron;"], [16, "&breve;"], [0, "&DiacriticalDot;"], [0, "&ring;"], [0, "&ogon;"], [0, "&DiacriticalTilde;"], [0, "&dblac;"], [51, "&DownBreve;"], [127, "&Alpha;"], [0, "&Beta;"], [0, "&Gamma;"], [0, "&Delta;"], [0, "&Epsilon;"], [0, "&Zeta;"], [0, "&Eta;"], [0, "&Theta;"], [0, "&Iota;"], [0, "&Kappa;"], [0, "&Lambda;"], [0, "&Mu;"], [0, "&Nu;"], [0, "&Xi;"], [0, "&Omicron;"], [0, "&Pi;"], [0, "&Rho;"], [1, "&Sigma;"], [0, "&Tau;"], [0, "&Upsilon;"], [0, "&Phi;"], [0, "&Chi;"], [0, "&Psi;"], [0, "&ohm;"], [7, "&alpha;"], [0, "&beta;"], [0, "&gamma;"], [0, "&delta;"], [0, "&epsi;"], [0, "&zeta;"], [0, "&eta;"], [0, "&theta;"], [0, "&iota;"], [0, "&kappa;"], [0, "&lambda;"], [0, "&mu;"], [0, "&nu;"], [0, "&xi;"], [0, "&omicron;"], [0, "&pi;"], [0, "&rho;"], [0, "&sigmaf;"], [0, "&sigma;"], [0, "&tau;"], [0, "&upsi;"], [0, "&phi;"], [0, "&chi;"], [0, "&psi;"], [0, "&omega;"], [7, "&thetasym;"], [0, "&Upsi;"], [2, "&phiv;"], [0, "&piv;"], [5, "&Gammad;"], [0, "&digamma;"], [18, "&kappav;"], [0, "&rhov;"], [3, "&epsiv;"], [0, "&backepsilon;"], [10, "&IOcy;"], [0, "&DJcy;"], [0, "&GJcy;"], [0, "&Jukcy;"], [0, "&DScy;"], [0, "&Iukcy;"], [0, "&YIcy;"], [0, "&Jsercy;"], [0, "&LJcy;"], [0, "&NJcy;"], [0, "&TSHcy;"], [0, "&KJcy;"], [1, "&Ubrcy;"], [0, "&DZcy;"], [0, "&Acy;"], [0, "&Bcy;"], [0, "&Vcy;"], [0, "&Gcy;"], [0, "&Dcy;"], [0, "&IEcy;"], [0, "&ZHcy;"], [0, "&Zcy;"], [0, "&Icy;"], [0, "&Jcy;"], [0, "&Kcy;"], [0, "&Lcy;"], [0, "&Mcy;"], [0, "&Ncy;"], [0, "&Ocy;"], [0, "&Pcy;"], [0, "&Rcy;"], [0, "&Scy;"], [0, "&Tcy;"], [0, "&Ucy;"], [0, "&Fcy;"], [0, "&KHcy;"], [0, "&TScy;"], [0, "&CHcy;"], [0, "&SHcy;"], [0, "&SHCHcy;"], [0, "&HARDcy;"], [0, "&Ycy;"], [0, "&SOFTcy;"], [0, "&Ecy;"], [0, "&YUcy;"], [0, "&YAcy;"], [0, "&acy;"], [0, "&bcy;"], [0, "&vcy;"], [0, "&gcy;"], [0, "&dcy;"], [0, "&iecy;"], [0, "&zhcy;"], [0, "&zcy;"], [0, "&icy;"], [0, "&jcy;"], [0, "&kcy;"], [0, "&lcy;"], [0, "&mcy;"], [0, "&ncy;"], [0, "&ocy;"], [0, "&pcy;"], [0, "&rcy;"], [0, "&scy;"], [0, "&tcy;"], [0, "&ucy;"], [0, "&fcy;"], [0, "&khcy;"], [0, "&tscy;"], [0, "&chcy;"], [0, "&shcy;"], [0, "&shchcy;"], [0, "&hardcy;"], [0, "&ycy;"], [0, "&softcy;"], [0, "&ecy;"], [0, "&yucy;"], [0, "&yacy;"], [1, "&iocy;"], [0, "&djcy;"], [0, "&gjcy;"], [0, "&jukcy;"], [0, "&dscy;"], [0, "&iukcy;"], [0, "&yicy;"], [0, "&jsercy;"], [0, "&ljcy;"], [0, "&njcy;"], [0, "&tshcy;"], [0, "&kjcy;"], [1, "&ubrcy;"], [0, "&dzcy;"], [7074, "&ensp;"], [0, "&emsp;"], [0, "&emsp13;"], [0, "&emsp14;"], [1, "&numsp;"], [0, "&puncsp;"], [0, "&ThinSpace;"], [0, "&hairsp;"], [0, "&NegativeMediumSpace;"], [0, "&zwnj;"], [0, "&zwj;"], [0, "&lrm;"], [0, "&rlm;"], [0, "&dash;"], [2, "&ndash;"], [0, "&mdash;"], [0, "&horbar;"], [0, "&Verbar;"], [1, "&lsquo;"], [0, "&CloseCurlyQuote;"], [0, "&lsquor;"], [1, "&ldquo;"], [0, "&CloseCurlyDoubleQuote;"], [0, "&bdquo;"], [1, "&dagger;"], [0, "&Dagger;"], [0, "&bull;"], [2, "&nldr;"], [0, "&hellip;"], [9, "&permil;"], [0, "&pertenk;"], [0, "&prime;"], [0, "&Prime;"], [0, "&tprime;"], [0, "&backprime;"], [3, "&lsaquo;"], [0, "&rsaquo;"], [3, "&oline;"], [2, "&caret;"], [1, "&hybull;"], [0, "&frasl;"], [10, "&bsemi;"], [7, "&qprime;"], [7, { v: "&MediumSpace;", n: 8202, o: "&ThickSpace;" }], [0, "&NoBreak;"], [0, "&af;"], [0, "&InvisibleTimes;"], [0, "&ic;"], [72, "&euro;"], [46, "&tdot;"], [0, "&DotDot;"], [37, "&complexes;"], [2, "&incare;"], [4, "&gscr;"], [0, "&hamilt;"], [0, "&Hfr;"], [0, "&Hopf;"], [0, "&planckh;"], [0, "&hbar;"], [0, "&imagline;"], [0, "&Ifr;"], [0, "&lagran;"], [0, "&ell;"], [1, "&naturals;"], [0, "&numero;"], [0, "&copysr;"], [0, "&weierp;"], [0, "&Popf;"], [0, "&Qopf;"], [0, "&realine;"], [0, "&real;"], [0, "&reals;"], [0, "&rx;"], [3, "&trade;"], [1, "&integers;"], [2, "&mho;"], [0, "&zeetrf;"], [0, "&iiota;"], [2, "&bernou;"], [0, "&Cayleys;"], [1, "&escr;"], [0, "&Escr;"], [0, "&Fouriertrf;"], [1, "&Mellintrf;"], [0, "&order;"], [0, "&alefsym;"], [0, "&beth;"], [0, "&gimel;"], [0, "&daleth;"], [12, "&CapitalDifferentialD;"], [0, "&dd;"], [0, "&ee;"], [0, "&ii;"], [10, "&frac13;"], [0, "&frac23;"], [0, "&frac15;"], [0, "&frac25;"], [0, "&frac35;"], [0, "&frac45;"], [0, "&frac16;"], [0, "&frac56;"], [0, "&frac18;"], [0, "&frac38;"], [0, "&frac58;"], [0, "&frac78;"], [49, "&larr;"], [0, "&ShortUpArrow;"], [0, "&rarr;"], [0, "&darr;"], [0, "&harr;"], [0, "&updownarrow;"], [0, "&nwarr;"], [0, "&nearr;"], [0, "&LowerRightArrow;"], [0, "&LowerLeftArrow;"], [0, "&nlarr;"], [0, "&nrarr;"], [1, { v: "&rarrw;", n: 824, o: "&nrarrw;" }], [0, "&Larr;"], [0, "&Uarr;"], [0, "&Rarr;"], [0, "&Darr;"], [0, "&larrtl;"], [0, "&rarrtl;"], [0, "&LeftTeeArrow;"], [0, "&mapstoup;"], [0, "&map;"], [0, "&DownTeeArrow;"], [1, "&hookleftarrow;"], [0, "&hookrightarrow;"], [0, "&larrlp;"], [0, "&looparrowright;"], [0, "&harrw;"], [0, "&nharr;"], [1, "&lsh;"], [0, "&rsh;"], [0, "&ldsh;"], [0, "&rdsh;"], [1, "&crarr;"], [0, "&cularr;"], [0, "&curarr;"], [2, "&circlearrowleft;"], [0, "&circlearrowright;"], [0, "&leftharpoonup;"], [0, "&DownLeftVector;"], [0, "&RightUpVector;"], [0, "&LeftUpVector;"], [0, "&rharu;"], [0, "&DownRightVector;"], [0, "&dharr;"], [0, "&dharl;"], [0, "&RightArrowLeftArrow;"], [0, "&udarr;"], [0, "&LeftArrowRightArrow;"], [0, "&leftleftarrows;"], [0, "&upuparrows;"], [0, "&rightrightarrows;"], [0, "&ddarr;"], [0, "&leftrightharpoons;"], [0, "&Equilibrium;"], [0, "&nlArr;"], [0, "&nhArr;"], [0, "&nrArr;"], [0, "&DoubleLeftArrow;"], [0, "&DoubleUpArrow;"], [0, "&DoubleRightArrow;"], [0, "&dArr;"], [0, "&DoubleLeftRightArrow;"], [0, "&DoubleUpDownArrow;"], [0, "&nwArr;"], [0, "&neArr;"], [0, "&seArr;"], [0, "&swArr;"], [0, "&lAarr;"], [0, "&rAarr;"], [1, "&zigrarr;"], [6, "&larrb;"], [0, "&rarrb;"], [15, "&DownArrowUpArrow;"], [7, "&loarr;"], [0, "&roarr;"], [0, "&hoarr;"], [0, "&forall;"], [0, "&comp;"], [0, { v: "&part;", n: 824, o: "&npart;" }], [0, "&exist;"], [0, "&nexist;"], [0, "&empty;"], [1, "&Del;"], [0, "&Element;"], [0, "&NotElement;"], [1, "&ni;"], [0, "&notni;"], [2, "&prod;"], [0, "&coprod;"], [0, "&sum;"], [0, "&minus;"], [0, "&MinusPlus;"], [0, "&dotplus;"], [1, "&Backslash;"], [0, "&lowast;"], [0, "&compfn;"], [1, "&radic;"], [2, "&prop;"], [0, "&infin;"], [0, "&angrt;"], [0, { v: "&ang;", n: 8402, o: "&nang;" }], [0, "&angmsd;"], [0, "&angsph;"], [0, "&mid;"], [0, "&nmid;"], [0, "&DoubleVerticalBar;"], [0, "&NotDoubleVerticalBar;"], [0, "&and;"], [0, "&or;"], [0, { v: "&cap;", n: 65024, o: "&caps;" }], [0, { v: "&cup;", n: 65024, o: "&cups;" }], [0, "&int;"], [0, "&Int;"], [0, "&iiint;"], [0, "&conint;"], [0, "&Conint;"], [0, "&Cconint;"], [0, "&cwint;"], [0, "&ClockwiseContourIntegral;"], [0, "&awconint;"], [0, "&there4;"], [0, "&becaus;"], [0, "&ratio;"], [0, "&Colon;"], [0, "&dotminus;"], [1, "&mDDot;"], [0, "&homtht;"], [0, { v: "&sim;", n: 8402, o: "&nvsim;" }], [0, { v: "&backsim;", n: 817, o: "&race;" }], [0, { v: "&ac;", n: 819, o: "&acE;" }], [0, "&acd;"], [0, "&VerticalTilde;"], [0, "&NotTilde;"], [0, { v: "&eqsim;", n: 824, o: "&nesim;" }], [0, "&sime;"], [0, "&NotTildeEqual;"], [0, "&cong;"], [0, "&simne;"], [0, "&ncong;"], [0, "&ap;"], [0, "&nap;"], [0, "&ape;"], [0, { v: "&apid;", n: 824, o: "&napid;" }], [0, "&backcong;"], [0, { v: "&asympeq;", n: 8402, o: "&nvap;" }], [0, { v: "&bump;", n: 824, o: "&nbump;" }], [0, { v: "&bumpe;", n: 824, o: "&nbumpe;" }], [0, { v: "&doteq;", n: 824, o: "&nedot;" }], [0, "&doteqdot;"], [0, "&efDot;"], [0, "&erDot;"], [0, "&Assign;"], [0, "&ecolon;"], [0, "&ecir;"], [0, "&circeq;"], [1, "&wedgeq;"], [0, "&veeeq;"], [1, "&triangleq;"], [2, "&equest;"], [0, "&ne;"], [0, { v: "&Congruent;", n: 8421, o: "&bnequiv;" }], [0, "&nequiv;"], [1, { v: "&le;", n: 8402, o: "&nvle;" }], [0, { v: "&ge;", n: 8402, o: "&nvge;" }], [0, { v: "&lE;", n: 824, o: "&nlE;" }], [0, { v: "&gE;", n: 824, o: "&ngE;" }], [0, { v: "&lnE;", n: 65024, o: "&lvertneqq;" }], [0, { v: "&gnE;", n: 65024, o: "&gvertneqq;" }], [0, { v: "&ll;", n: new Map(/* @__PURE__ */ restoreDiff([[824, "&nLtv;"], [7577, "&nLt;"]])) }], [0, { v: "&gg;", n: new Map(/* @__PURE__ */ restoreDiff([[824, "&nGtv;"], [7577, "&nGt;"]])) }], [0, "&between;"], [0, "&NotCupCap;"], [0, "&nless;"], [0, "&ngt;"], [0, "&nle;"], [0, "&nge;"], [0, "&lesssim;"], [0, "&GreaterTilde;"], [0, "&nlsim;"], [0, "&ngsim;"], [0, "&LessGreater;"], [0, "&gl;"], [0, "&NotLessGreater;"], [0, "&NotGreaterLess;"], [0, "&pr;"], [0, "&sc;"], [0, "&prcue;"], [0, "&sccue;"], [0, "&PrecedesTilde;"], [0, { v: "&scsim;", n: 824, o: "&NotSucceedsTilde;" }], [0, "&NotPrecedes;"], [0, "&NotSucceeds;"], [0, { v: "&sub;", n: 8402, o: "&NotSubset;" }], [0, { v: "&sup;", n: 8402, o: "&NotSuperset;" }], [0, "&nsub;"], [0, "&nsup;"], [0, "&sube;"], [0, "&supe;"], [0, "&NotSubsetEqual;"], [0, "&NotSupersetEqual;"], [0, { v: "&subne;", n: 65024, o: "&varsubsetneq;" }], [0, { v: "&supne;", n: 65024, o: "&varsupsetneq;" }], [1, "&cupdot;"], [0, "&UnionPlus;"], [0, { v: "&sqsub;", n: 824, o: "&NotSquareSubset;" }], [0, { v: "&sqsup;", n: 824, o: "&NotSquareSuperset;" }], [0, "&sqsube;"], [0, "&sqsupe;"], [0, { v: "&sqcap;", n: 65024, o: "&sqcaps;" }], [0, { v: "&sqcup;", n: 65024, o: "&sqcups;" }], [0, "&CirclePlus;"], [0, "&CircleMinus;"], [0, "&CircleTimes;"], [0, "&osol;"], [0, "&CircleDot;"], [0, "&circledcirc;"], [0, "&circledast;"], [1, "&circleddash;"], [0, "&boxplus;"], [0, "&boxminus;"], [0, "&boxtimes;"], [0, "&dotsquare;"], [0, "&RightTee;"], [0, "&dashv;"], [0, "&DownTee;"], [0, "&bot;"], [1, "&models;"], [0, "&DoubleRightTee;"], [0, "&Vdash;"], [0, "&Vvdash;"], [0, "&VDash;"], [0, "&nvdash;"], [0, "&nvDash;"], [0, "&nVdash;"], [0, "&nVDash;"], [0, "&prurel;"], [1, "&LeftTriangle;"], [0, "&RightTriangle;"], [0, { v: "&LeftTriangleEqual;", n: 8402, o: "&nvltrie;" }], [0, { v: "&RightTriangleEqual;", n: 8402, o: "&nvrtrie;" }], [0, "&origof;"], [0, "&imof;"], [0, "&multimap;"], [0, "&hercon;"], [0, "&intcal;"], [0, "&veebar;"], [1, "&barvee;"], [0, "&angrtvb;"], [0, "&lrtri;"], [0, "&bigwedge;"], [0, "&bigvee;"], [0, "&bigcap;"], [0, "&bigcup;"], [0, "&diam;"], [0, "&sdot;"], [0, "&sstarf;"], [0, "&divideontimes;"], [0, "&bowtie;"], [0, "&ltimes;"], [0, "&rtimes;"], [0, "&leftthreetimes;"], [0, "&rightthreetimes;"], [0, "&backsimeq;"], [0, "&curlyvee;"], [0, "&curlywedge;"], [0, "&Sub;"], [0, "&Sup;"], [0, "&Cap;"], [0, "&Cup;"], [0, "&fork;"], [0, "&epar;"], [0, "&lessdot;"], [0, "&gtdot;"], [0, { v: "&Ll;", n: 824, o: "&nLl;" }], [0, { v: "&Gg;", n: 824, o: "&nGg;" }], [0, { v: "&leg;", n: 65024, o: "&lesg;" }], [0, { v: "&gel;", n: 65024, o: "&gesl;" }], [2, "&cuepr;"], [0, "&cuesc;"], [0, "&NotPrecedesSlantEqual;"], [0, "&NotSucceedsSlantEqual;"], [0, "&NotSquareSubsetEqual;"], [0, "&NotSquareSupersetEqual;"], [2, "&lnsim;"], [0, "&gnsim;"], [0, "&precnsim;"], [0, "&scnsim;"], [0, "&nltri;"], [0, "&NotRightTriangle;"], [0, "&nltrie;"], [0, "&NotRightTriangleEqual;"], [0, "&vellip;"], [0, "&ctdot;"], [0, "&utdot;"], [0, "&dtdot;"], [0, "&disin;"], [0, "&isinsv;"], [0, "&isins;"], [0, { v: "&isindot;", n: 824, o: "&notindot;" }], [0, "&notinvc;"], [0, "&notinvb;"], [1, { v: "&isinE;", n: 824, o: "&notinE;" }], [0, "&nisd;"], [0, "&xnis;"], [0, "&nis;"], [0, "&notnivc;"], [0, "&notnivb;"], [6, "&barwed;"], [0, "&Barwed;"], [1, "&lceil;"], [0, "&rceil;"], [0, "&LeftFloor;"], [0, "&rfloor;"], [0, "&drcrop;"], [0, "&dlcrop;"], [0, "&urcrop;"], [0, "&ulcrop;"], [0, "&bnot;"], [1, "&profline;"], [0, "&profsurf;"], [1, "&telrec;"], [0, "&target;"], [5, "&ulcorn;"], [0, "&urcorn;"], [0, "&dlcorn;"], [0, "&drcorn;"], [2, "&frown;"], [0, "&smile;"], [9, "&cylcty;"], [0, "&profalar;"], [7, "&topbot;"], [6, "&ovbar;"], [1, "&solbar;"], [60, "&angzarr;"], [51, "&lmoustache;"], [0, "&rmoustache;"], [2, "&OverBracket;"], [0, "&bbrk;"], [0, "&bbrktbrk;"], [37, "&OverParenthesis;"], [0, "&UnderParenthesis;"], [0, "&OverBrace;"], [0, "&UnderBrace;"], [2, "&trpezium;"], [4, "&elinters;"], [59, "&blank;"], [164, "&circledS;"], [55, "&boxh;"], [1, "&boxv;"], [9, "&boxdr;"], [3, "&boxdl;"], [3, "&boxur;"], [3, "&boxul;"], [3, "&boxvr;"], [7, "&boxvl;"], [7, "&boxhd;"], [7, "&boxhu;"], [7, "&boxvh;"], [19, "&boxH;"], [0, "&boxV;"], [0, "&boxdR;"], [0, "&boxDr;"], [0, "&boxDR;"], [0, "&boxdL;"], [0, "&boxDl;"], [0, "&boxDL;"], [0, "&boxuR;"], [0, "&boxUr;"], [0, "&boxUR;"], [0, "&boxuL;"], [0, "&boxUl;"], [0, "&boxUL;"], [0, "&boxvR;"], [0, "&boxVr;"], [0, "&boxVR;"], [0, "&boxvL;"], [0, "&boxVl;"], [0, "&boxVL;"], [0, "&boxHd;"], [0, "&boxhD;"], [0, "&boxHD;"], [0, "&boxHu;"], [0, "&boxhU;"], [0, "&boxHU;"], [0, "&boxvH;"], [0, "&boxVh;"], [0, "&boxVH;"], [19, "&uhblk;"], [3, "&lhblk;"], [3, "&block;"], [8, "&blk14;"], [0, "&blk12;"], [0, "&blk34;"], [13, "&square;"], [8, "&blacksquare;"], [0, "&EmptyVerySmallSquare;"], [1, "&rect;"], [0, "&marker;"], [2, "&fltns;"], [1, "&bigtriangleup;"], [0, "&blacktriangle;"], [0, "&triangle;"], [2, "&blacktriangleright;"], [0, "&rtri;"], [3, "&bigtriangledown;"], [0, "&blacktriangledown;"], [0, "&dtri;"], [2, "&blacktriangleleft;"], [0, "&ltri;"], [6, "&loz;"], [0, "&cir;"], [32, "&tridot;"], [2, "&bigcirc;"], [8, "&ultri;"], [0, "&urtri;"], [0, "&lltri;"], [0, "&EmptySmallSquare;"], [0, "&FilledSmallSquare;"], [8, "&bigstar;"], [0, "&star;"], [7, "&phone;"], [49, "&female;"], [1, "&male;"], [29, "&spades;"], [2, "&clubs;"], [1, "&hearts;"], [0, "&diamondsuit;"], [3, "&sung;"], [2, "&flat;"], [0, "&natural;"], [0, "&sharp;"], [163, "&check;"], [3, "&cross;"], [8, "&malt;"], [21, "&sext;"], [33, "&VerticalSeparator;"], [25, "&lbbrk;"], [0, "&rbbrk;"], [84, "&bsolhsub;"], [0, "&suphsol;"], [28, "&LeftDoubleBracket;"], [0, "&RightDoubleBracket;"], [0, "&lang;"], [0, "&rang;"], [0, "&Lang;"], [0, "&Rang;"], [0, "&loang;"], [0, "&roang;"], [7, "&longleftarrow;"], [0, "&longrightarrow;"], [0, "&longleftrightarrow;"], [0, "&DoubleLongLeftArrow;"], [0, "&DoubleLongRightArrow;"], [0, "&DoubleLongLeftRightArrow;"], [1, "&longmapsto;"], [2, "&dzigrarr;"], [258, "&nvlArr;"], [0, "&nvrArr;"], [0, "&nvHarr;"], [0, "&Map;"], [6, "&lbarr;"], [0, "&bkarow;"], [0, "&lBarr;"], [0, "&dbkarow;"], [0, "&drbkarow;"], [0, "&DDotrahd;"], [0, "&UpArrowBar;"], [0, "&DownArrowBar;"], [2, "&Rarrtl;"], [2, "&latail;"], [0, "&ratail;"], [0, "&lAtail;"], [0, "&rAtail;"], [0, "&larrfs;"], [0, "&rarrfs;"], [0, "&larrbfs;"], [0, "&rarrbfs;"], [2, "&nwarhk;"], [0, "&nearhk;"], [0, "&hksearow;"], [0, "&hkswarow;"], [0, "&nwnear;"], [0, "&nesear;"], [0, "&seswar;"], [0, "&swnwar;"], [8, { v: "&rarrc;", n: 824, o: "&nrarrc;" }], [1, "&cudarrr;"], [0, "&ldca;"], [0, "&rdca;"], [0, "&cudarrl;"], [0, "&larrpl;"], [2, "&curarrm;"], [0, "&cularrp;"], [7, "&rarrpl;"], [2, "&harrcir;"], [0, "&Uarrocir;"], [0, "&lurdshar;"], [0, "&ldrushar;"], [2, "&LeftRightVector;"], [0, "&RightUpDownVector;"], [0, "&DownLeftRightVector;"], [0, "&LeftUpDownVector;"], [0, "&LeftVectorBar;"], [0, "&RightVectorBar;"], [0, "&RightUpVectorBar;"], [0, "&RightDownVectorBar;"], [0, "&DownLeftVectorBar;"], [0, "&DownRightVectorBar;"], [0, "&LeftUpVectorBar;"], [0, "&LeftDownVectorBar;"], [0, "&LeftTeeVector;"], [0, "&RightTeeVector;"], [0, "&RightUpTeeVector;"], [0, "&RightDownTeeVector;"], [0, "&DownLeftTeeVector;"], [0, "&DownRightTeeVector;"], [0, "&LeftUpTeeVector;"], [0, "&LeftDownTeeVector;"], [0, "&lHar;"], [0, "&uHar;"], [0, "&rHar;"], [0, "&dHar;"], [0, "&luruhar;"], [0, "&ldrdhar;"], [0, "&ruluhar;"], [0, "&rdldhar;"], [0, "&lharul;"], [0, "&llhard;"], [0, "&rharul;"], [0, "&lrhard;"], [0, "&udhar;"], [0, "&duhar;"], [0, "&RoundImplies;"], [0, "&erarr;"], [0, "&simrarr;"], [0, "&larrsim;"], [0, "&rarrsim;"], [0, "&rarrap;"], [0, "&ltlarr;"], [1, "&gtrarr;"], [0, "&subrarr;"], [1, "&suplarr;"], [0, "&lfisht;"], [0, "&rfisht;"], [0, "&ufisht;"], [0, "&dfisht;"], [5, "&lopar;"], [0, "&ropar;"], [4, "&lbrke;"], [0, "&rbrke;"], [0, "&lbrkslu;"], [0, "&rbrksld;"], [0, "&lbrksld;"], [0, "&rbrkslu;"], [0, "&langd;"], [0, "&rangd;"], [0, "&lparlt;"], [0, "&rpargt;"], [0, "&gtlPar;"], [0, "&ltrPar;"], [3, "&vzigzag;"], [1, "&vangrt;"], [0, "&angrtvbd;"], [6, "&ange;"], [0, "&range;"], [0, "&dwangle;"], [0, "&uwangle;"], [0, "&angmsdaa;"], [0, "&angmsdab;"], [0, "&angmsdac;"], [0, "&angmsdad;"], [0, "&angmsdae;"], [0, "&angmsdaf;"], [0, "&angmsdag;"], [0, "&angmsdah;"], [0, "&bemptyv;"], [0, "&demptyv;"], [0, "&cemptyv;"], [0, "&raemptyv;"], [0, "&laemptyv;"], [0, "&ohbar;"], [0, "&omid;"], [0, "&opar;"], [1, "&operp;"], [1, "&olcross;"], [0, "&odsold;"], [1, "&olcir;"], [0, "&ofcir;"], [0, "&olt;"], [0, "&ogt;"], [0, "&cirscir;"], [0, "&cirE;"], [0, "&solb;"], [0, "&bsolb;"], [3, "&boxbox;"], [3, "&trisb;"], [0, "&rtriltri;"], [0, { v: "&LeftTriangleBar;", n: 824, o: "&NotLeftTriangleBar;" }], [0, { v: "&RightTriangleBar;", n: 824, o: "&NotRightTriangleBar;" }], [11, "&iinfin;"], [0, "&infintie;"], [0, "&nvinfin;"], [4, "&eparsl;"], [0, "&smeparsl;"], [0, "&eqvparsl;"], [5, "&blacklozenge;"], [8, "&RuleDelayed;"], [1, "&dsol;"], [9, "&bigodot;"], [0, "&bigoplus;"], [0, "&bigotimes;"], [1, "&biguplus;"], [1, "&bigsqcup;"], [5, "&iiiint;"], [0, "&fpartint;"], [2, "&cirfnint;"], [0, "&awint;"], [0, "&rppolint;"], [0, "&scpolint;"], [0, "&npolint;"], [0, "&pointint;"], [0, "&quatint;"], [0, "&intlarhk;"], [10, "&pluscir;"], [0, "&plusacir;"], [0, "&simplus;"], [0, "&plusdu;"], [0, "&plussim;"], [0, "&plustwo;"], [1, "&mcomma;"], [0, "&minusdu;"], [2, "&loplus;"], [0, "&roplus;"], [0, "&Cross;"], [0, "&timesd;"], [0, "&timesbar;"], [1, "&smashp;"], [0, "&lotimes;"], [0, "&rotimes;"], [0, "&otimesas;"], [0, "&Otimes;"], [0, "&odiv;"], [0, "&triplus;"], [0, "&triminus;"], [0, "&tritime;"], [0, "&intprod;"], [2, "&amalg;"], [0, "&capdot;"], [1, "&ncup;"], [0, "&ncap;"], [0, "&capand;"], [0, "&cupor;"], [0, "&cupcap;"], [0, "&capcup;"], [0, "&cupbrcap;"], [0, "&capbrcup;"], [0, "&cupcup;"], [0, "&capcap;"], [0, "&ccups;"], [0, "&ccaps;"], [2, "&ccupssm;"], [2, "&And;"], [0, "&Or;"], [0, "&andand;"], [0, "&oror;"], [0, "&orslope;"], [0, "&andslope;"], [1, "&andv;"], [0, "&orv;"], [0, "&andd;"], [0, "&ord;"], [1, "&wedbar;"], [6, "&sdote;"], [3, "&simdot;"], [2, { v: "&congdot;", n: 824, o: "&ncongdot;" }], [0, "&easter;"], [0, "&apacir;"], [0, { v: "&apE;", n: 824, o: "&napE;" }], [0, "&eplus;"], [0, "&pluse;"], [0, "&Esim;"], [0, "&Colone;"], [0, "&Equal;"], [1, "&ddotseq;"], [0, "&equivDD;"], [0, "&ltcir;"], [0, "&gtcir;"], [0, "&ltquest;"], [0, "&gtquest;"], [0, { v: "&leqslant;", n: 824, o: "&nleqslant;" }], [0, { v: "&geqslant;", n: 824, o: "&ngeqslant;" }], [0, "&lesdot;"], [0, "&gesdot;"], [0, "&lesdoto;"], [0, "&gesdoto;"], [0, "&lesdotor;"], [0, "&gesdotol;"], [0, "&lap;"], [0, "&gap;"], [0, "&lne;"], [0, "&gne;"], [0, "&lnap;"], [0, "&gnap;"], [0, "&lEg;"], [0, "&gEl;"], [0, "&lsime;"], [0, "&gsime;"], [0, "&lsimg;"], [0, "&gsiml;"], [0, "&lgE;"], [0, "&glE;"], [0, "&lesges;"], [0, "&gesles;"], [0, "&els;"], [0, "&egs;"], [0, "&elsdot;"], [0, "&egsdot;"], [0, "&el;"], [0, "&eg;"], [2, "&siml;"], [0, "&simg;"], [0, "&simlE;"], [0, "&simgE;"], [0, { v: "&LessLess;", n: 824, o: "&NotNestedLessLess;" }], [0, { v: "&GreaterGreater;", n: 824, o: "&NotNestedGreaterGreater;" }], [1, "&glj;"], [0, "&gla;"], [0, "&ltcc;"], [0, "&gtcc;"], [0, "&lescc;"], [0, "&gescc;"], [0, "&smt;"], [0, "&lat;"], [0, { v: "&smte;", n: 65024, o: "&smtes;" }], [0, { v: "&late;", n: 65024, o: "&lates;" }], [0, "&bumpE;"], [0, { v: "&PrecedesEqual;", n: 824, o: "&NotPrecedesEqual;" }], [0, { v: "&sce;", n: 824, o: "&NotSucceedsEqual;" }], [2, "&prE;"], [0, "&scE;"], [0, "&precneqq;"], [0, "&scnE;"], [0, "&prap;"], [0, "&scap;"], [0, "&precnapprox;"], [0, "&scnap;"], [0, "&Pr;"], [0, "&Sc;"], [0, "&subdot;"], [0, "&supdot;"], [0, "&subplus;"], [0, "&supplus;"], [0, "&submult;"], [0, "&supmult;"], [0, "&subedot;"], [0, "&supedot;"], [0, { v: "&subE;", n: 824, o: "&nsubE;" }], [0, { v: "&supE;", n: 824, o: "&nsupE;" }], [0, "&subsim;"], [0, "&supsim;"], [2, { v: "&subnE;", n: 65024, o: "&varsubsetneqq;" }], [0, { v: "&supnE;", n: 65024, o: "&varsupsetneqq;" }], [2, "&csub;"], [0, "&csup;"], [0, "&csube;"], [0, "&csupe;"], [0, "&subsup;"], [0, "&supsub;"], [0, "&subsub;"], [0, "&supsup;"], [0, "&suphsub;"], [0, "&supdsub;"], [0, "&forkv;"], [0, "&topfork;"], [0, "&mlcp;"], [8, "&Dashv;"], [1, "&Vdashl;"], [0, "&Barv;"], [0, "&vBar;"], [0, "&vBarv;"], [1, "&Vbar;"], [0, "&Not;"], [0, "&bNot;"], [0, "&rnmid;"], [0, "&cirmid;"], [0, "&midcir;"], [0, "&topcir;"], [0, "&nhpar;"], [0, "&parsim;"], [9, { v: "&parsl;", n: 8421, o: "&nparsl;" }], [44343, { n: new Map(/* @__PURE__ */ restoreDiff([[56476, "&Ascr;"], [1, "&Cscr;"], [0, "&Dscr;"], [2, "&Gscr;"], [2, "&Jscr;"], [0, "&Kscr;"], [2, "&Nscr;"], [0, "&Oscr;"], [0, "&Pscr;"], [0, "&Qscr;"], [1, "&Sscr;"], [0, "&Tscr;"], [0, "&Uscr;"], [0, "&Vscr;"], [0, "&Wscr;"], [0, "&Xscr;"], [0, "&Yscr;"], [0, "&Zscr;"], [0, "&ascr;"], [0, "&bscr;"], [0, "&cscr;"], [0, "&dscr;"], [1, "&fscr;"], [1, "&hscr;"], [0, "&iscr;"], [0, "&jscr;"], [0, "&kscr;"], [0, "&lscr;"], [0, "&mscr;"], [0, "&nscr;"], [1, "&pscr;"], [0, "&qscr;"], [0, "&rscr;"], [0, "&sscr;"], [0, "&tscr;"], [0, "&uscr;"], [0, "&vscr;"], [0, "&wscr;"], [0, "&xscr;"], [0, "&yscr;"], [0, "&zscr;"], [52, "&Afr;"], [0, "&Bfr;"], [1, "&Dfr;"], [0, "&Efr;"], [0, "&Ffr;"], [0, "&Gfr;"], [2, "&Jfr;"], [0, "&Kfr;"], [0, "&Lfr;"], [0, "&Mfr;"], [0, "&Nfr;"], [0, "&Ofr;"], [0, "&Pfr;"], [0, "&Qfr;"], [1, "&Sfr;"], [0, "&Tfr;"], [0, "&Ufr;"], [0, "&Vfr;"], [0, "&Wfr;"], [0, "&Xfr;"], [0, "&Yfr;"], [1, "&afr;"], [0, "&bfr;"], [0, "&cfr;"], [0, "&dfr;"], [0, "&efr;"], [0, "&ffr;"], [0, "&gfr;"], [0, "&hfr;"], [0, "&ifr;"], [0, "&jfr;"], [0, "&kfr;"], [0, "&lfr;"], [0, "&mfr;"], [0, "&nfr;"], [0, "&ofr;"], [0, "&pfr;"], [0, "&qfr;"], [0, "&rfr;"], [0, "&sfr;"], [0, "&tfr;"], [0, "&ufr;"], [0, "&vfr;"], [0, "&wfr;"], [0, "&xfr;"], [0, "&yfr;"], [0, "&zfr;"], [0, "&Aopf;"], [0, "&Bopf;"], [1, "&Dopf;"], [0, "&Eopf;"], [0, "&Fopf;"], [0, "&Gopf;"], [1, "&Iopf;"], [0, "&Jopf;"], [0, "&Kopf;"], [0, "&Lopf;"], [0, "&Mopf;"], [1, "&Oopf;"], [3, "&Sopf;"], [0, "&Topf;"], [0, "&Uopf;"], [0, "&Vopf;"], [0, "&Wopf;"], [0, "&Xopf;"], [0, "&Yopf;"], [1, "&aopf;"], [0, "&bopf;"], [0, "&copf;"], [0, "&dopf;"], [0, "&eopf;"], [0, "&fopf;"], [0, "&gopf;"], [0, "&hopf;"], [0, "&iopf;"], [0, "&jopf;"], [0, "&kopf;"], [0, "&lopf;"], [0, "&mopf;"], [0, "&nopf;"], [0, "&oopf;"], [0, "&popf;"], [0, "&qopf;"], [0, "&ropf;"], [0, "&sopf;"], [0, "&topf;"], [0, "&uopf;"], [0, "&vopf;"], [0, "&wopf;"], [0, "&xopf;"], [0, "&yopf;"], [0, "&zopf;"]])) }], [8906, "&fflig;"], [0, "&filig;"], [0, "&fllig;"], [0, "&ffilig;"], [0, "&ffllig;"]]));
var xmlReplacer = /["&'<>$\x80-\uFFFF]/g;
var xmlCodeMap = /* @__PURE__ */ new Map([
  [34, "&quot;"],
  [38, "&amp;"],
  [39, "&apos;"],
  [60, "&lt;"],
  [62, "&gt;"]
]);
var getCodePoint = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  String.prototype.codePointAt != null ? (str, index) => str.codePointAt(index) : (
    // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
    (c, index) => (c.charCodeAt(index) & 64512) === 55296 ? (c.charCodeAt(index) - 55296) * 1024 + c.charCodeAt(index + 1) - 56320 + 65536 : c.charCodeAt(index)
  )
);
function encodeXML(str) {
  let ret = "";
  let lastIdx = 0;
  let match;
  while ((match = xmlReplacer.exec(str)) !== null) {
    const i = match.index;
    const char = str.charCodeAt(i);
    const next = xmlCodeMap.get(char);
    if (next !== void 0) {
      ret += str.substring(lastIdx, i) + next;
      lastIdx = i + 1;
    } else {
      ret += `${str.substring(lastIdx, i)}&#x${getCodePoint(str, i).toString(16)};`;
      lastIdx = xmlReplacer.lastIndex += Number((char & 64512) === 55296);
    }
  }
  return ret + str.substr(lastIdx);
}
function getEscaper(regex, map) {
  return function escape3(data2) {
    let match;
    let lastIdx = 0;
    let result = "";
    while (match = regex.exec(data2)) {
      if (lastIdx !== match.index) {
        result += data2.substring(lastIdx, match.index);
      }
      result += map.get(match[0].charCodeAt(0));
      lastIdx = match.index + 1;
    }
    return result + data2.substring(lastIdx);
  };
}
var escapeUTF8 = getEscaper(/[&<>'"]/g, xmlCodeMap);
var escapeAttribute = getEscaper(/["&\u00A0]/g, /* @__PURE__ */ new Map([
  [34, "&quot;"],
  [38, "&amp;"],
  [160, "&nbsp;"]
]));
var escapeText = getEscaper(/[&<>\u00A0]/g, /* @__PURE__ */ new Map([
  [38, "&amp;"],
  [60, "&lt;"],
  [62, "&gt;"],
  [160, "&nbsp;"]
]));
var EntityLevel;
(function(EntityLevel2) {
  EntityLevel2[EntityLevel2["XML"] = 0] = "XML";
  EntityLevel2[EntityLevel2["HTML"] = 1] = "HTML";
})(EntityLevel || (EntityLevel = {}));
var EncodingMode;
(function(EncodingMode2) {
  EncodingMode2[EncodingMode2["UTF8"] = 0] = "UTF8";
  EncodingMode2[EncodingMode2["ASCII"] = 1] = "ASCII";
  EncodingMode2[EncodingMode2["Extensive"] = 2] = "Extensive";
  EncodingMode2[EncodingMode2["Attribute"] = 3] = "Attribute";
  EncodingMode2[EncodingMode2["Text"] = 4] = "Text";
})(EncodingMode || (EncodingMode = {}));
var elementNames = new Map([
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "clipPath",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "foreignObject",
  "glyphRef",
  "linearGradient",
  "radialGradient",
  "textPath"
].map((val) => [val.toLowerCase(), val]));
var attributeNames = new Map([
  "definitionURL",
  "attributeName",
  "attributeType",
  "baseFrequency",
  "baseProfile",
  "calcMode",
  "clipPathUnits",
  "diffuseConstant",
  "edgeMode",
  "filterUnits",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "kernelMatrix",
  "kernelUnitLength",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lengthAdjust",
  "limitingConeAngle",
  "markerHeight",
  "markerUnits",
  "markerWidth",
  "maskContentUnits",
  "maskUnits",
  "numOctaves",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "refX",
  "refY",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "specularConstant",
  "specularExponent",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stitchTiles",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "targetX",
  "targetY",
  "textLength",
  "viewBox",
  "viewTarget",
  "xChannelSelector",
  "yChannelSelector",
  "zoomAndPan"
].map((val) => [val.toLowerCase(), val]));
var unencodedElements = /* @__PURE__ */ new Set([
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
]);
function replaceQuotes(value) {
  return value.replace(/"/g, "&quot;");
}
function formatAttributes(attributes2, opts) {
  var _a2;
  if (!attributes2)
    return;
  const encode = ((_a2 = opts.encodeEntities) !== null && _a2 !== void 0 ? _a2 : opts.decodeEntities) === false ? replaceQuotes : opts.xmlMode || opts.encodeEntities !== "utf8" ? encodeXML : escapeAttribute;
  return Object.keys(attributes2).map((key2) => {
    var _a3, _b;
    const value = (_a3 = attributes2[key2]) !== null && _a3 !== void 0 ? _a3 : "";
    if (opts.xmlMode === "foreign") {
      key2 = (_b = attributeNames.get(key2)) !== null && _b !== void 0 ? _b : key2;
    }
    if (!opts.emptyAttrs && !opts.xmlMode && value === "") {
      return key2;
    }
    return `${key2}="${encode(value)}"`;
  }).join(" ");
}
var singleTag = /* @__PURE__ */ new Set([
  "area",
  "base",
  "basefont",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "img",
  "input",
  "isindex",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
function render(node, options = {}) {
  const nodes = "length" in node ? node : [node];
  let output = "";
  for (let i = 0; i < nodes.length; i++) {
    output += renderNode(nodes[i], options);
  }
  return output;
}
var esm_default = render;
function renderNode(node, options) {
  switch (node.type) {
    case Root:
      return render(node.children, options);
    case Doctype:
    case Directive:
      return renderDirective(node);
    case Comment:
      return renderComment(node);
    case CDATA:
      return renderCdata(node);
    case Script:
    case Style:
    case Tag:
      return renderTag(node, options);
    case Text2:
      return renderText(node, options);
  }
}
var foreignModeIntegrationPoints = /* @__PURE__ */ new Set([
  "mi",
  "mo",
  "mn",
  "ms",
  "mtext",
  "annotation-xml",
  "foreignObject",
  "desc",
  "title"
]);
var foreignElements = /* @__PURE__ */ new Set(["svg", "math"]);
function renderTag(elem, opts) {
  var _a2;
  if (opts.xmlMode === "foreign") {
    elem.name = (_a2 = elementNames.get(elem.name)) !== null && _a2 !== void 0 ? _a2 : elem.name;
    if (elem.parent && foreignModeIntegrationPoints.has(elem.parent.name)) {
      opts = { ...opts, xmlMode: false };
    }
  }
  if (!opts.xmlMode && foreignElements.has(elem.name)) {
    opts = { ...opts, xmlMode: "foreign" };
  }
  let tag = `<${elem.name}`;
  const attribs = formatAttributes(elem.attribs, opts);
  if (attribs) {
    tag += ` ${attribs}`;
  }
  if (elem.children.length === 0 && (opts.xmlMode ? (
    // In XML mode or foreign mode, and user hasn't explicitly turned off self-closing tags
    opts.selfClosingTags !== false
  ) : (
    // User explicitly asked for self-closing tags, even in HTML mode
    opts.selfClosingTags && singleTag.has(elem.name)
  ))) {
    if (!opts.xmlMode)
      tag += " ";
    tag += "/>";
  } else {
    tag += ">";
    if (elem.children.length > 0) {
      tag += render(elem.children, opts);
    }
    if (opts.xmlMode || !singleTag.has(elem.name)) {
      tag += `</${elem.name}>`;
    }
  }
  return tag;
}
function renderDirective(elem) {
  return `<${elem.data}>`;
}
function renderText(elem, opts) {
  var _a2;
  let data2 = elem.data || "";
  if (((_a2 = opts.encodeEntities) !== null && _a2 !== void 0 ? _a2 : opts.decodeEntities) !== false && !(!opts.xmlMode && elem.parent && unencodedElements.has(elem.parent.name))) {
    data2 = opts.xmlMode || opts.encodeEntities !== "utf8" ? encodeXML(data2) : escapeText(data2);
  }
  return data2;
}
function renderCdata(elem) {
  return `<![CDATA[${elem.children[0].data}]]>`;
}
function renderComment(elem) {
  return `<!--${elem.data}-->`;
}
function getOuterHTML(node, options) {
  return esm_default(node, options);
}
function getInnerHTML(node, options) {
  return hasChildren(node) ? node.children.map((node2) => getOuterHTML(node2, options)).join("") : "";
}
function getText(node) {
  if (Array.isArray(node))
    return node.map(getText).join("");
  if (isTag2(node))
    return node.name === "br" ? "\n" : getText(node.children);
  if (isCDATA(node))
    return getText(node.children);
  if (isText(node))
    return node.data;
  return "";
}
function textContent(node) {
  if (Array.isArray(node))
    return node.map(textContent).join("");
  if (hasChildren(node) && !isComment(node)) {
    return textContent(node.children);
  }
  if (isText(node))
    return node.data;
  return "";
}
function innerText(node) {
  if (Array.isArray(node))
    return node.map(innerText).join("");
  if (hasChildren(node) && (node.type === ElementType.Tag || isCDATA(node))) {
    return innerText(node.children);
  }
  if (isText(node))
    return node.data;
  return "";
}
function getChildren(elem) {
  return hasChildren(elem) ? elem.children : [];
}
function getParent(elem) {
  return elem.parent || null;
}
function getSiblings(elem) {
  const parent = getParent(elem);
  if (parent != null)
    return getChildren(parent);
  const siblings = [elem];
  let { prev, next } = elem;
  while (prev != null) {
    siblings.unshift(prev);
    ({ prev } = prev);
  }
  while (next != null) {
    siblings.push(next);
    ({ next } = next);
  }
  return siblings;
}
function getAttributeValue(elem, name) {
  var _a2;
  return (_a2 = elem.attribs) === null || _a2 === void 0 ? void 0 : _a2[name];
}
function hasAttrib(elem, name) {
  return elem.attribs != null && Object.prototype.hasOwnProperty.call(elem.attribs, name) && elem.attribs[name] != null;
}
function getName(elem) {
  return elem.name;
}
function nextElementSibling(elem) {
  let { next } = elem;
  while (next !== null && !isTag2(next))
    ({ next } = next);
  return next;
}
function prevElementSibling(elem) {
  let { prev } = elem;
  while (prev !== null && !isTag2(prev))
    ({ prev } = prev);
  return prev;
}
function removeElement(elem) {
  if (elem.prev)
    elem.prev.next = elem.next;
  if (elem.next)
    elem.next.prev = elem.prev;
  if (elem.parent) {
    const childs = elem.parent.children;
    const childsIndex = childs.lastIndexOf(elem);
    if (childsIndex >= 0) {
      childs.splice(childsIndex, 1);
    }
  }
  elem.next = null;
  elem.prev = null;
  elem.parent = null;
}
function replaceElement(elem, replacement) {
  const prev = replacement.prev = elem.prev;
  if (prev) {
    prev.next = replacement;
  }
  const next = replacement.next = elem.next;
  if (next) {
    next.prev = replacement;
  }
  const parent = replacement.parent = elem.parent;
  if (parent) {
    const childs = parent.children;
    childs[childs.lastIndexOf(elem)] = replacement;
    elem.parent = null;
  }
}
function appendChild(parent, child) {
  removeElement(child);
  child.next = null;
  child.parent = parent;
  if (parent.children.push(child) > 1) {
    const sibling = parent.children[parent.children.length - 2];
    sibling.next = child;
    child.prev = sibling;
  } else {
    child.prev = null;
  }
}
function append(elem, next) {
  removeElement(next);
  const { parent } = elem;
  const currNext = elem.next;
  next.next = currNext;
  next.prev = elem;
  elem.next = next;
  next.parent = parent;
  if (currNext) {
    currNext.prev = next;
    if (parent) {
      const childs = parent.children;
      childs.splice(childs.lastIndexOf(currNext), 0, next);
    }
  } else if (parent) {
    parent.children.push(next);
  }
}
function prependChild(parent, child) {
  removeElement(child);
  child.parent = parent;
  child.prev = null;
  if (parent.children.unshift(child) !== 1) {
    const sibling = parent.children[1];
    sibling.prev = child;
    child.next = sibling;
  } else {
    child.next = null;
  }
}
function prepend(elem, prev) {
  removeElement(prev);
  const { parent } = elem;
  if (parent) {
    const childs = parent.children;
    childs.splice(childs.indexOf(elem), 0, prev);
  }
  if (elem.prev) {
    elem.prev.next = prev;
  }
  prev.parent = parent;
  prev.prev = elem.prev;
  prev.next = elem;
  elem.prev = prev;
}
function filter(test, node, recurse = true, limit = Infinity) {
  return find(test, Array.isArray(node) ? node : [node], recurse, limit);
}
function find(test, nodes, recurse, limit) {
  const result = [];
  const nodeStack = [nodes];
  const indexStack = [0];
  for (; ; ) {
    if (indexStack[0] >= nodeStack[0].length) {
      if (indexStack.length === 1) {
        return result;
      }
      nodeStack.shift();
      indexStack.shift();
      continue;
    }
    const elem = nodeStack[0][indexStack[0]++];
    if (test(elem)) {
      result.push(elem);
      if (--limit <= 0)
        return result;
    }
    if (recurse && hasChildren(elem) && elem.children.length > 0) {
      indexStack.unshift(0);
      nodeStack.unshift(elem.children);
    }
  }
}
function findOneChild(test, nodes) {
  return nodes.find(test);
}
function findOne(test, nodes, recurse = true) {
  let elem = null;
  for (let i = 0; i < nodes.length && !elem; i++) {
    const node = nodes[i];
    if (!isTag2(node)) {
      continue;
    } else if (test(node)) {
      elem = node;
    } else if (recurse && node.children.length > 0) {
      elem = findOne(test, node.children, true);
    }
  }
  return elem;
}
function existsOne(test, nodes) {
  return nodes.some((checked) => isTag2(checked) && (test(checked) || existsOne(test, checked.children)));
}
function findAll(test, nodes) {
  const result = [];
  const nodeStack = [nodes];
  const indexStack = [0];
  for (; ; ) {
    if (indexStack[0] >= nodeStack[0].length) {
      if (nodeStack.length === 1) {
        return result;
      }
      nodeStack.shift();
      indexStack.shift();
      continue;
    }
    const elem = nodeStack[0][indexStack[0]++];
    if (!isTag2(elem))
      continue;
    if (test(elem))
      result.push(elem);
    if (elem.children.length > 0) {
      indexStack.unshift(0);
      nodeStack.unshift(elem.children);
    }
  }
}
var Checks = {
  tag_name(name) {
    if (typeof name === "function") {
      return (elem) => isTag2(elem) && name(elem.name);
    } else if (name === "*") {
      return isTag2;
    }
    return (elem) => isTag2(elem) && elem.name === name;
  },
  tag_type(type) {
    if (typeof type === "function") {
      return (elem) => type(elem.type);
    }
    return (elem) => elem.type === type;
  },
  tag_contains(data2) {
    if (typeof data2 === "function") {
      return (elem) => isText(elem) && data2(elem.data);
    }
    return (elem) => isText(elem) && elem.data === data2;
  }
};
function getAttribCheck(attrib, value) {
  if (typeof value === "function") {
    return (elem) => isTag2(elem) && value(elem.attribs[attrib]);
  }
  return (elem) => isTag2(elem) && elem.attribs[attrib] === value;
}
function combineFuncs(a, b) {
  return (elem) => a(elem) || b(elem);
}
function compileTest(options) {
  const funcs = Object.keys(options).map((key2) => {
    const value = options[key2];
    return Object.prototype.hasOwnProperty.call(Checks, key2) ? Checks[key2](value) : getAttribCheck(key2, value);
  });
  return funcs.length === 0 ? null : funcs.reduce(combineFuncs);
}
function testElement(options, node) {
  const test = compileTest(options);
  return test ? test(node) : true;
}
function getElements(options, nodes, recurse, limit = Infinity) {
  const test = compileTest(options);
  return test ? filter(test, nodes, recurse, limit) : [];
}
function getElementById(id, nodes, recurse = true) {
  if (!Array.isArray(nodes))
    nodes = [nodes];
  return findOne(getAttribCheck("id", id), nodes, recurse);
}
function getElementsByTagName(tagName21, nodes, recurse = true, limit = Infinity) {
  return filter(Checks["tag_name"](tagName21), nodes, recurse, limit);
}
function getElementsByTagType(type, nodes, recurse = true, limit = Infinity) {
  return filter(Checks["tag_type"](type), nodes, recurse, limit);
}
function removeSubsets(nodes) {
  let idx = nodes.length;
  while (--idx >= 0) {
    const node = nodes[idx];
    if (idx > 0 && nodes.lastIndexOf(node, idx - 1) >= 0) {
      nodes.splice(idx, 1);
      continue;
    }
    for (let ancestor = node.parent; ancestor; ancestor = ancestor.parent) {
      if (nodes.includes(ancestor)) {
        nodes.splice(idx, 1);
        break;
      }
    }
  }
  return nodes;
}
var DocumentPosition;
(function(DocumentPosition2) {
  DocumentPosition2[DocumentPosition2["DISCONNECTED"] = 1] = "DISCONNECTED";
  DocumentPosition2[DocumentPosition2["PRECEDING"] = 2] = "PRECEDING";
  DocumentPosition2[DocumentPosition2["FOLLOWING"] = 4] = "FOLLOWING";
  DocumentPosition2[DocumentPosition2["CONTAINS"] = 8] = "CONTAINS";
  DocumentPosition2[DocumentPosition2["CONTAINED_BY"] = 16] = "CONTAINED_BY";
})(DocumentPosition || (DocumentPosition = {}));
function compareDocumentPosition(nodeA, nodeB) {
  const aParents = [];
  const bParents = [];
  if (nodeA === nodeB) {
    return 0;
  }
  let current = hasChildren(nodeA) ? nodeA : nodeA.parent;
  while (current) {
    aParents.unshift(current);
    current = current.parent;
  }
  current = hasChildren(nodeB) ? nodeB : nodeB.parent;
  while (current) {
    bParents.unshift(current);
    current = current.parent;
  }
  const maxIdx = Math.min(aParents.length, bParents.length);
  let idx = 0;
  while (idx < maxIdx && aParents[idx] === bParents[idx]) {
    idx++;
  }
  if (idx === 0) {
    return DocumentPosition.DISCONNECTED;
  }
  const sharedParent = aParents[idx - 1];
  const siblings = sharedParent.children;
  const aSibling = aParents[idx];
  const bSibling = bParents[idx];
  if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
    if (sharedParent === nodeB) {
      return DocumentPosition.FOLLOWING | DocumentPosition.CONTAINED_BY;
    }
    return DocumentPosition.FOLLOWING;
  }
  if (sharedParent === nodeA) {
    return DocumentPosition.PRECEDING | DocumentPosition.CONTAINS;
  }
  return DocumentPosition.PRECEDING;
}
function uniqueSort(nodes) {
  nodes = nodes.filter((node, i, arr) => !arr.includes(node, i + 1));
  nodes.sort((a, b) => {
    const relative = compareDocumentPosition(a, b);
    if (relative & DocumentPosition.PRECEDING) {
      return -1;
    } else if (relative & DocumentPosition.FOLLOWING) {
      return 1;
    }
    return 0;
  });
  return nodes;
}
function getFeed(doc) {
  const feedRoot = getOneElement(isValidFeed, doc);
  return !feedRoot ? null : feedRoot.name === "feed" ? getAtomFeed(feedRoot) : getRssFeed(feedRoot);
}
function getAtomFeed(feedRoot) {
  var _a2;
  const childs = feedRoot.children;
  const feed = {
    type: "atom",
    items: getElementsByTagName("entry", childs).map((item) => {
      var _a3;
      const { children } = item;
      const entry = { media: getMediaElements(children) };
      addConditionally(entry, "id", "id", children);
      addConditionally(entry, "title", "title", children);
      const href2 = (_a3 = getOneElement("link", children)) === null || _a3 === void 0 ? void 0 : _a3.attribs["href"];
      if (href2) {
        entry.link = href2;
      }
      const description = fetch2("summary", children) || fetch2("content", children);
      if (description) {
        entry.description = description;
      }
      const pubDate = fetch2("updated", children);
      if (pubDate) {
        entry.pubDate = new Date(pubDate);
      }
      return entry;
    })
  };
  addConditionally(feed, "id", "id", childs);
  addConditionally(feed, "title", "title", childs);
  const href = (_a2 = getOneElement("link", childs)) === null || _a2 === void 0 ? void 0 : _a2.attribs["href"];
  if (href) {
    feed.link = href;
  }
  addConditionally(feed, "description", "subtitle", childs);
  const updated = fetch2("updated", childs);
  if (updated) {
    feed.updated = new Date(updated);
  }
  addConditionally(feed, "author", "email", childs, true);
  return feed;
}
function getRssFeed(feedRoot) {
  var _a2, _b;
  const childs = (_b = (_a2 = getOneElement("channel", feedRoot.children)) === null || _a2 === void 0 ? void 0 : _a2.children) !== null && _b !== void 0 ? _b : [];
  const feed = {
    type: feedRoot.name.substr(0, 3),
    id: "",
    items: getElementsByTagName("item", feedRoot.children).map((item) => {
      const { children } = item;
      const entry = { media: getMediaElements(children) };
      addConditionally(entry, "id", "guid", children);
      addConditionally(entry, "title", "title", children);
      addConditionally(entry, "link", "link", children);
      addConditionally(entry, "description", "description", children);
      const pubDate = fetch2("pubDate", children) || fetch2("dc:date", children);
      if (pubDate)
        entry.pubDate = new Date(pubDate);
      return entry;
    })
  };
  addConditionally(feed, "title", "title", childs);
  addConditionally(feed, "link", "link", childs);
  addConditionally(feed, "description", "description", childs);
  const updated = fetch2("lastBuildDate", childs);
  if (updated) {
    feed.updated = new Date(updated);
  }
  addConditionally(feed, "author", "managingEditor", childs, true);
  return feed;
}
var MEDIA_KEYS_STRING = ["url", "type", "lang"];
var MEDIA_KEYS_INT = [
  "fileSize",
  "bitrate",
  "framerate",
  "samplingrate",
  "channels",
  "duration",
  "height",
  "width"
];
function getMediaElements(where) {
  return getElementsByTagName("media:content", where).map((elem) => {
    const { attribs } = elem;
    const media = {
      medium: attribs["medium"],
      isDefault: !!attribs["isDefault"]
    };
    for (const attrib of MEDIA_KEYS_STRING) {
      if (attribs[attrib]) {
        media[attrib] = attribs[attrib];
      }
    }
    for (const attrib of MEDIA_KEYS_INT) {
      if (attribs[attrib]) {
        media[attrib] = parseInt(attribs[attrib], 10);
      }
    }
    if (attribs["expression"]) {
      media.expression = attribs["expression"];
    }
    return media;
  });
}
function getOneElement(tagName21, node) {
  return getElementsByTagName(tagName21, node, true, 1)[0];
}
function fetch2(tagName21, where, recurse = false) {
  return textContent(getElementsByTagName(tagName21, where, recurse, 1)).trim();
}
function addConditionally(obj, prop2, tagName21, where, recurse = false) {
  const val = fetch2(tagName21, where, recurse);
  if (val)
    obj[prop2] = val;
}
function isValidFeed(value) {
  return value === "rss" || value === "feed" || value === "rdf:RDF";
}
function parseDocument(data2, options) {
  const handler4 = new DomHandler(void 0, options);
  new Parser(handler4, options).end(data2);
  return handler4.root;
}
function parseDOM(data2, options) {
  return parseDocument(data2, options).children;
}
function createDomStream(callback, options, elementCallback) {
  const handler4 = new DomHandler(callback, options, elementCallback);
  return new Parser(handler4, options);
}
var parseFeedDefaultOptions = { xmlMode: true };
function parseFeed(feed, options = parseFeedDefaultOptions) {
  return getFeed(parseDOM(feed, options));
}
var NODE_END = -1;
var ELEMENT_NODE = 1;
var ATTRIBUTE_NODE = 2;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;
var DOCUMENT_NODE = 9;
var DOCUMENT_TYPE_NODE = 10;
var DOCUMENT_FRAGMENT_NODE = 11;
var BLOCK_ELEMENTS = /* @__PURE__ */ new Set(["ARTICLE", "ASIDE", "BLOCKQUOTE", "BODY", "BR", "BUTTON", "CANVAS", "CAPTION", "COL", "COLGROUP", "DD", "DIV", "DL", "DT", "EMBED", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "UL", "OL", "P"]);
var SHOW_ALL = -1;
var SHOW_ELEMENT = 1;
var SHOW_TEXT = 4;
var SHOW_COMMENT = 128;
var DOCUMENT_POSITION_DISCONNECTED = 1;
var DOCUMENT_POSITION_PRECEDING = 2;
var DOCUMENT_POSITION_FOLLOWING = 4;
var DOCUMENT_POSITION_CONTAINS = 8;
var DOCUMENT_POSITION_CONTAINED_BY = 16;
var DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;
var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
var {
  assign,
  create,
  defineProperties,
  entries,
  getOwnPropertyDescriptors,
  keys,
  setPrototypeOf
} = Object;
var $String = String;
var getEnd = (node) => node.nodeType === ELEMENT_NODE ? node[END] : node;
var ignoreCase = ({ ownerDocument }) => ownerDocument[MIME].ignoreCase;
var knownAdjacent = (prev, next) => {
  prev[NEXT] = next;
  next[PREV] = prev;
};
var knownBoundaries = (prev, current, next) => {
  knownAdjacent(prev, current);
  knownAdjacent(getEnd(current), next);
};
var knownSegment = (prev, start, end, next) => {
  knownAdjacent(prev, start);
  knownAdjacent(getEnd(end), next);
};
var knownSiblings = (prev, current, next) => {
  knownAdjacent(prev, current);
  knownAdjacent(current, next);
};
var localCase = ({ localName, ownerDocument }) => {
  return ownerDocument[MIME].ignoreCase ? localName.toUpperCase() : localName;
};
var setAdjacent = (prev, next) => {
  if (prev)
    prev[NEXT] = next;
  if (next)
    next[PREV] = prev;
};
var shadowRoots = /* @__PURE__ */ new WeakMap();
var reactive = false;
var Classes = /* @__PURE__ */ new WeakMap();
var customElements = /* @__PURE__ */ new WeakMap();
var attributeChangedCallback = (element, attributeName, oldValue, newValue) => {
  if (reactive && customElements.has(element) && element.attributeChangedCallback && element.constructor.observedAttributes.includes(attributeName)) {
    element.attributeChangedCallback(attributeName, oldValue, newValue);
  }
};
var createTrigger = (method, isConnected2) => (element) => {
  if (customElements.has(element)) {
    const info = customElements.get(element);
    if (info.connected !== isConnected2 && element.isConnected === isConnected2) {
      info.connected = isConnected2;
      if (method in element)
        element[method]();
    }
  }
};
var triggerConnected = createTrigger("connectedCallback", true);
var connectedCallback = (element) => {
  if (reactive) {
    triggerConnected(element);
    if (shadowRoots.has(element))
      element = shadowRoots.get(element).shadowRoot;
    let { [NEXT]: next, [END]: end } = element;
    while (next !== end) {
      if (next.nodeType === ELEMENT_NODE)
        triggerConnected(next);
      next = next[NEXT];
    }
  }
};
var triggerDisconnected = createTrigger("disconnectedCallback", false);
var disconnectedCallback = (element) => {
  if (reactive) {
    triggerDisconnected(element);
    if (shadowRoots.has(element))
      element = shadowRoots.get(element).shadowRoot;
    let { [NEXT]: next, [END]: end } = element;
    while (next !== end) {
      if (next.nodeType === ELEMENT_NODE)
        triggerDisconnected(next);
      next = next[NEXT];
    }
  }
};
var CustomElementRegistry = class {
  /**
   * @param {Document} ownerDocument
   */
  constructor(ownerDocument) {
    this.ownerDocument = ownerDocument;
    this.registry = /* @__PURE__ */ new Map();
    this.waiting = /* @__PURE__ */ new Map();
    this.active = false;
  }
  /**
   * @param {string} localName the custom element definition name
   * @param {Function} Class the custom element **Class** definition
   * @param {object?} options the optional object with an `extends` property
   */
  define(localName, Class, options = {}) {
    const { ownerDocument, registry, waiting } = this;
    if (registry.has(localName))
      throw new Error("unable to redefine " + localName);
    if (Classes.has(Class))
      throw new Error("unable to redefine the same class: " + Class);
    this.active = reactive = true;
    const { extends: extend } = options;
    Classes.set(Class, {
      ownerDocument,
      options: { is: extend ? localName : "" },
      localName: extend || localName
    });
    const check = extend ? (element) => {
      return element.localName === extend && element.getAttribute("is") === localName;
    } : (element) => element.localName === localName;
    registry.set(localName, { Class, check });
    if (waiting.has(localName)) {
      for (const resolve of waiting.get(localName))
        resolve(Class);
      waiting.delete(localName);
    }
    ownerDocument.querySelectorAll(
      extend ? `${extend}[is="${localName}"]` : localName
    ).forEach(this.upgrade, this);
  }
  /**
   * @param {Element} element
   */
  upgrade(element) {
    if (customElements.has(element))
      return;
    const { ownerDocument, registry } = this;
    const ce = element.getAttribute("is") || element.localName;
    if (registry.has(ce)) {
      const { Class, check } = registry.get(ce);
      if (check(element)) {
        const { attributes: attributes2, isConnected: isConnected2 } = element;
        for (const attr of attributes2)
          element.removeAttributeNode(attr);
        const values = entries(element);
        for (const [key2] of values)
          delete element[key2];
        setPrototypeOf(element, Class.prototype);
        ownerDocument[UPGRADE] = { element, values };
        new Class(ownerDocument, ce);
        customElements.set(element, { connected: isConnected2 });
        for (const attr of attributes2)
          element.setAttributeNode(attr);
        if (isConnected2 && element.connectedCallback)
          element.connectedCallback();
      }
    }
  }
  /**
   * @param {string} localName the custom element definition name
   */
  whenDefined(localName) {
    const { registry, waiting } = this;
    return new Promise((resolve) => {
      if (registry.has(localName))
        resolve(registry.get(localName).Class);
      else {
        if (!waiting.has(localName))
          waiting.set(localName, []);
        waiting.get(localName).push(resolve);
      }
    });
  }
  /**
   * @param {string} localName the custom element definition name
   * @returns {Function?} the custom element **Class**, if any
   */
  get(localName) {
    const info = this.registry.get(localName);
    return info && info.Class;
  }
};
var createRecord = (type, target, addedNodes, removedNodes, attributeName, oldValue) => ({ type, target, addedNodes, removedNodes, attributeName, oldValue });
var queueAttribute = (observer, target, attributeName, attributeFilter, attributeOldValue, oldValue) => {
  if (!attributeFilter || attributeFilter.includes(attributeName)) {
    const { callback, records, scheduled } = observer;
    records.push(createRecord(
      "attributes",
      target,
      [],
      [],
      attributeName,
      attributeOldValue ? oldValue : void 0
    ));
    if (!scheduled) {
      observer.scheduled = true;
      Promise.resolve().then(() => {
        observer.scheduled = false;
        callback(records.splice(0), observer);
      });
    }
  }
};
var attributeChangedCallback2 = (element, attributeName, oldValue) => {
  const { ownerDocument } = element;
  const { active, observers } = ownerDocument[MUTATION_OBSERVER];
  if (active) {
    for (const observer of observers) {
      for (const [
        target,
        {
          childList,
          subtree,
          attributes: attributes2,
          attributeFilter,
          attributeOldValue
        }
      ] of observer.nodes) {
        if (childList) {
          if (subtree && (target === ownerDocument || target.contains(element)) || !subtree && target.children.includes(element)) {
            queueAttribute(
              observer,
              element,
              attributeName,
              attributeFilter,
              attributeOldValue,
              oldValue
            );
            break;
          }
        } else if (attributes2 && target === element) {
          queueAttribute(
            observer,
            element,
            attributeName,
            attributeFilter,
            attributeOldValue,
            oldValue
          );
          break;
        }
      }
    }
  }
};
var moCallback = (element, parentNode) => {
  const { ownerDocument } = element;
  const { active, observers } = ownerDocument[MUTATION_OBSERVER];
  if (active) {
    for (const observer of observers) {
      for (const [target, { subtree, childList, characterData }] of observer.nodes) {
        if (childList) {
          if (parentNode && (target === parentNode || /* c8 ignore next */
          subtree && target.contains(parentNode)) || !parentNode && (subtree && (target === ownerDocument || /* c8 ignore next */
          target.contains(element)) || !subtree && target[characterData ? "childNodes" : "children"].includes(element))) {
            const { callback, records, scheduled } = observer;
            records.push(createRecord(
              "childList",
              target,
              parentNode ? [] : [element],
              parentNode ? [element] : []
            ));
            if (!scheduled) {
              observer.scheduled = true;
              Promise.resolve().then(() => {
                observer.scheduled = false;
                callback(records.splice(0), observer);
              });
            }
            break;
          }
        }
      }
    }
  }
};
var MutationObserverClass = class {
  constructor(ownerDocument) {
    const observers = /* @__PURE__ */ new Set();
    this.observers = observers;
    this.active = false;
    this.class = class MutationObserver {
      constructor(callback) {
        this.callback = callback;
        this.nodes = /* @__PURE__ */ new Map();
        this.records = [];
        this.scheduled = false;
      }
      disconnect() {
        this.records.splice(0);
        this.nodes.clear();
        observers.delete(this);
        ownerDocument[MUTATION_OBSERVER].active = !!observers.size;
      }
      /**
       * @param {Element} target
       * @param {MutationObserverInit} options
       */
      observe(target, options = {
        subtree: false,
        childList: false,
        attributes: false,
        attributeFilter: null,
        attributeOldValue: false,
        characterData: false
        // TODO: not implemented yet
        // characterDataOldValue: false
      }) {
        if ("attributeOldValue" in options || "attributeFilter" in options)
          options.attributes = true;
        options.childList = !!options.childList;
        options.subtree = !!options.subtree;
        this.nodes.set(target, options);
        observers.add(this);
        ownerDocument[MUTATION_OBSERVER].active = true;
      }
      /**
       * @returns {MutationRecord[]}
       */
      takeRecords() {
        return this.records.splice(0);
      }
    };
  }
};
var { Parser: Parser2 } = esm_exports3;
var notParsing = true;
var append2 = (self, node, active) => {
  const end = self[END];
  node.parentNode = self;
  knownBoundaries(end[PREV], node, end);
  moCallback(node, null);
  if (active && node.nodeType === ELEMENT_NODE)
    connectedCallback(node);
  return node;
};
var attribute = (element, end, attribute2, value, active) => {
  attribute2[VALUE] = value;
  attribute2.ownerElement = element;
  knownSiblings(end[PREV], attribute2, end);
  if (attribute2.name === "class")
    element.className = value;
  if (active)
    attributeChangedCallback(element, attribute2.name, null, value);
};
var parseFromString = (document2, isHTML, markupLanguage) => {
  const { active, registry } = document2[CUSTOM_ELEMENTS];
  let node = document2;
  let ownerSVGElement = null;
  notParsing = false;
  const content = new Parser2({
    // <!DOCTYPE ...>
    onprocessinginstruction(name, data2) {
      if (name.toLowerCase() === "!doctype")
        document2.doctype = data2.slice(name.length).trim();
    },
    // <tagName>
    onopentag(name, attributes2) {
      let create3 = true;
      if (isHTML) {
        if (ownerSVGElement) {
          node = append2(node, document2.createElementNS(SVG_NAMESPACE, name), active);
          node.ownerSVGElement = ownerSVGElement;
          create3 = false;
        } else if (name === "svg" || name === "SVG") {
          ownerSVGElement = document2.createElementNS(SVG_NAMESPACE, name);
          node = append2(node, ownerSVGElement, active);
          create3 = false;
        } else if (active) {
          const ce = name.includes("-") ? name : attributes2.is || "";
          if (ce && registry.has(ce)) {
            const { Class } = registry.get(ce);
            node = append2(node, new Class(), active);
            delete attributes2.is;
            create3 = false;
          }
        }
      }
      if (create3)
        node = append2(node, document2.createElement(name), false);
      let end = node[END];
      for (const name2 of keys(attributes2))
        attribute(node, end, document2.createAttribute(name2), attributes2[name2], active);
    },
    // #text, #comment
    oncomment(data2) {
      append2(node, document2.createComment(data2), active);
    },
    ontext(text) {
      append2(node, document2.createTextNode(text), active);
    },
    // </tagName>
    onclosetag() {
      if (isHTML && node === ownerSVGElement)
        ownerSVGElement = null;
      node = node.parentNode;
    }
  }, {
    lowerCaseAttributeNames: false,
    decodeEntities: true,
    xmlMode: !isHTML
  });
  content.write(markupLanguage);
  content.end();
  notParsing = true;
  return document2;
};
var htmlClasses = /* @__PURE__ */ new Map();
var registerHTMLClass = (names, Class) => {
  for (const name of [].concat(names)) {
    htmlClasses.set(name, Class);
    htmlClasses.set(name.toUpperCase(), Class);
  }
};
var import_perf_hooks = __toESM(require_perf_hooks(), 1);
var loopSegment = ({ [NEXT]: next, [END]: end }, json) => {
  while (next !== end) {
    switch (next.nodeType) {
      case ATTRIBUTE_NODE:
        attrAsJSON(next, json);
        break;
      case TEXT_NODE:
      case COMMENT_NODE:
        characterDataAsJSON(next, json);
        break;
      case ELEMENT_NODE:
        elementAsJSON(next, json);
        next = getEnd(next);
        break;
      case DOCUMENT_TYPE_NODE:
        documentTypeAsJSON(next, json);
        break;
    }
    next = next[NEXT];
  }
  const last = json.length - 1;
  const value = json[last];
  if (typeof value === "number" && value < 0)
    json[last] += NODE_END;
  else
    json.push(NODE_END);
};
var attrAsJSON = (attr, json) => {
  json.push(ATTRIBUTE_NODE, attr.name);
  const value = attr[VALUE].trim();
  if (value)
    json.push(value);
};
var characterDataAsJSON = (node, json) => {
  const value = node[VALUE];
  if (value.trim())
    json.push(node.nodeType, value);
};
var nonElementAsJSON = (node, json) => {
  json.push(node.nodeType);
  loopSegment(node, json);
};
var documentTypeAsJSON = ({ name, publicId, systemId }, json) => {
  json.push(DOCUMENT_TYPE_NODE, name);
  if (publicId)
    json.push(publicId);
  if (systemId)
    json.push(systemId);
};
var elementAsJSON = (element, json) => {
  json.push(ELEMENT_NODE, element.localName);
  loopSegment(element, json);
};
var emptyAttributes = /* @__PURE__ */ new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "class",
  "contenteditable",
  "controls",
  "default",
  "defer",
  "disabled",
  "draggable",
  "formnovalidate",
  "hidden",
  "id",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected",
  "style",
  "truespeed"
]);
var setAttribute = (element, attribute2) => {
  const { [VALUE]: value, name } = attribute2;
  attribute2.ownerElement = element;
  knownSiblings(element, attribute2, element[NEXT]);
  if (name === "class")
    element.className = value;
  attributeChangedCallback2(element, name, null);
  attributeChangedCallback(element, name, null, value);
};
var removeAttribute = (element, attribute2) => {
  const { [VALUE]: value, name } = attribute2;
  knownAdjacent(attribute2[PREV], attribute2[NEXT]);
  attribute2.ownerElement = attribute2[PREV] = attribute2[NEXT] = null;
  if (name === "class")
    element[CLASS_LIST] = null;
  attributeChangedCallback2(element, name, value);
  attributeChangedCallback(element, name, value, null);
};
var booleanAttribute = {
  get(element, name) {
    return element.hasAttribute(name);
  },
  set(element, name, value) {
    if (value)
      element.setAttribute(name, "");
    else
      element.removeAttribute(name);
  }
};
var numericAttribute = {
  get(element, name) {
    return parseFloat(element.getAttribute(name) || 0);
  },
  set(element, name, value) {
    element.setAttribute(name, value);
  }
};
var stringAttribute = {
  get(element, name) {
    return element.getAttribute(name) || "";
  },
  set(element, name, value) {
    element.setAttribute(name, value);
  }
};
var wm = /* @__PURE__ */ new WeakMap();
function dispatch(event, listener) {
  if (typeof listener === "function")
    listener.call(event.target, event);
  else
    listener.handleEvent(event);
  return event._stopImmediatePropagationFlag;
}
function invokeListeners({ currentTarget, target }) {
  const map = wm.get(currentTarget);
  if (map && map.has(this.type)) {
    const listeners = map.get(this.type);
    if (currentTarget === target) {
      this.eventPhase = this.AT_TARGET;
    } else {
      this.eventPhase = this.BUBBLING_PHASE;
    }
    this.currentTarget = currentTarget;
    this.target = target;
    for (const [listener, options] of listeners) {
      if (options && options.once)
        listeners.delete(listener);
      if (dispatch(this, listener))
        break;
    }
    delete this.currentTarget;
    delete this.target;
    return this.cancelBubble;
  }
}
var DOMEventTarget = class {
  constructor() {
    wm.set(this, /* @__PURE__ */ new Map());
  }
  /**
   * @protected
   */
  _getParent() {
    return null;
  }
  addEventListener(type, listener, options) {
    const map = wm.get(this);
    if (!map.has(type))
      map.set(type, /* @__PURE__ */ new Map());
    map.get(type).set(listener, options);
  }
  removeEventListener(type, listener) {
    const map = wm.get(this);
    if (map.has(type)) {
      const listeners = map.get(type);
      if (listeners.delete(listener) && !listeners.size)
        map.delete(type);
    }
  }
  dispatchEvent(event) {
    let node = this;
    event.eventPhase = event.CAPTURING_PHASE;
    while (node) {
      if (node.dispatchEvent)
        event._path.push({ currentTarget: node, target: this });
      node = event.bubbles && node._getParent && node._getParent();
    }
    event._path.some(invokeListeners, event);
    event._path = [];
    event.eventPhase = event.NONE;
    return !event.defaultPrevented;
  }
};
var NodeList = class extends Array {
  item(i) {
    return i < this.length ? this[i] : null;
  }
};
var getParentNodeCount = ({ parentNode }) => {
  let count = 0;
  while (parentNode) {
    count++;
    parentNode = parentNode.parentNode;
  }
  return count;
};
var Node2 = class extends DOMEventTarget {
  static get ELEMENT_NODE() {
    return ELEMENT_NODE;
  }
  static get ATTRIBUTE_NODE() {
    return ATTRIBUTE_NODE;
  }
  static get TEXT_NODE() {
    return TEXT_NODE;
  }
  static get COMMENT_NODE() {
    return COMMENT_NODE;
  }
  static get DOCUMENT_NODE() {
    return DOCUMENT_NODE;
  }
  static get DOCUMENT_FRAGMENT_NODE() {
    return DOCUMENT_FRAGMENT_NODE;
  }
  static get DOCUMENT_TYPE_NODE() {
    return DOCUMENT_TYPE_NODE;
  }
  constructor(ownerDocument, localName, nodeType) {
    super();
    this.ownerDocument = ownerDocument;
    this.localName = localName;
    this.nodeType = nodeType;
    this.parentNode = null;
    this[NEXT] = null;
    this[PREV] = null;
  }
  get ELEMENT_NODE() {
    return ELEMENT_NODE;
  }
  get ATTRIBUTE_NODE() {
    return ATTRIBUTE_NODE;
  }
  get TEXT_NODE() {
    return TEXT_NODE;
  }
  get COMMENT_NODE() {
    return COMMENT_NODE;
  }
  get DOCUMENT_NODE() {
    return DOCUMENT_NODE;
  }
  get DOCUMENT_FRAGMENT_NODE() {
    return DOCUMENT_FRAGMENT_NODE;
  }
  get DOCUMENT_TYPE_NODE() {
    return DOCUMENT_TYPE_NODE;
  }
  get baseURI() {
    const ownerDocument = this.nodeType === DOCUMENT_NODE ? this : this.ownerDocument;
    if (ownerDocument) {
      const base = ownerDocument.querySelector("base");
      if (base)
        return base.getAttribute("href");
      const { location: location2 } = ownerDocument.defaultView;
      if (location2)
        return location2.href;
    }
    return null;
  }
  /* c8 ignore start */
  // mixin: node
  get isConnected() {
    return false;
  }
  get nodeName() {
    return this.localName;
  }
  get parentElement() {
    return null;
  }
  get previousSibling() {
    return null;
  }
  get previousElementSibling() {
    return null;
  }
  get nextSibling() {
    return null;
  }
  get nextElementSibling() {
    return null;
  }
  get childNodes() {
    return new NodeList();
  }
  get firstChild() {
    return null;
  }
  get lastChild() {
    return null;
  }
  // default values
  get nodeValue() {
    return null;
  }
  set nodeValue(value) {
  }
  get textContent() {
    return null;
  }
  set textContent(value) {
  }
  normalize() {
  }
  cloneNode() {
    return null;
  }
  contains() {
    return false;
  }
  /**
   * Inserts a node before a reference node as a child of this parent node.
   * @param {Node} newNode The node to be inserted.
   * @param {Node} referenceNode The node before which newNode is inserted. If this is null, then newNode is inserted at the end of node's child nodes.
   * @returns The added child
   */
  // eslint-disable-next-line no-unused-vars
  insertBefore(newNode, referenceNode) {
    return newNode;
  }
  /**
   * Adds a node to the end of the list of children of this node.
   * @param {Node} child The node to append to the given parent node.
   * @returns The appended child.
   */
  appendChild(child) {
    return child;
  }
  /**
   * Replaces a child node within this node
   * @param {Node} newChild The new node to replace oldChild.
   * @param {Node} oldChild The child to be replaced.
   * @returns The replaced Node. This is the same node as oldChild.
   */
  replaceChild(newChild, oldChild) {
    return oldChild;
  }
  /**
   * Removes a child node from the DOM.
   * @param {Node} child A Node that is the child node to be removed from the DOM.
   * @returns The removed node.
   */
  removeChild(child) {
    return child;
  }
  toString() {
    return "";
  }
  /* c8 ignore stop */
  hasChildNodes() {
    return !!this.lastChild;
  }
  isSameNode(node) {
    return this === node;
  }
  // TODO: attributes?
  compareDocumentPosition(target) {
    let result = 0;
    if (this !== target) {
      let self = getParentNodeCount(this);
      let other = getParentNodeCount(target);
      if (self < other) {
        result += DOCUMENT_POSITION_FOLLOWING;
        if (this.contains(target))
          result += DOCUMENT_POSITION_CONTAINED_BY;
      } else if (other < self) {
        result += DOCUMENT_POSITION_PRECEDING;
        if (target.contains(this))
          result += DOCUMENT_POSITION_CONTAINS;
      } else if (self && other) {
        const { childNodes } = this.parentNode;
        if (childNodes.indexOf(this) < childNodes.indexOf(target))
          result += DOCUMENT_POSITION_FOLLOWING;
        else
          result += DOCUMENT_POSITION_PRECEDING;
      }
      if (!self || !other) {
        result += DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
        result += DOCUMENT_POSITION_DISCONNECTED;
      }
    }
    return result;
  }
  isEqualNode(node) {
    if (this === node)
      return true;
    if (this.nodeType === node.nodeType) {
      switch (this.nodeType) {
        case DOCUMENT_NODE:
        case DOCUMENT_FRAGMENT_NODE: {
          const aNodes = this.childNodes;
          const bNodes = node.childNodes;
          return aNodes.length === bNodes.length && aNodes.every((node2, i) => node2.isEqualNode(bNodes[i]));
        }
      }
      return this.toString() === node.toString();
    }
    return false;
  }
  /**
   * @protected
   */
  _getParent() {
    return this.parentNode;
  }
  /**
   * Calling it on an element inside a standard web page will return an HTMLDocument object representing the entire page (or <iframe>).
   * Calling it on an element inside a shadow DOM will return the associated ShadowRoot.
   * @return {ShadowRoot | HTMLDocument}
   */
  getRootNode() {
    let root = this;
    while (root.parentNode)
      root = root.parentNode;
    return root;
  }
};
var QUOTE = /"/g;
var Attr = class _Attr extends Node2 {
  constructor(ownerDocument, name, value = "") {
    super(ownerDocument, "#attribute", ATTRIBUTE_NODE);
    this.ownerElement = null;
    this.name = $String(name);
    this[VALUE] = $String(value);
    this[CHANGED] = false;
  }
  get value() {
    return this[VALUE];
  }
  set value(newValue) {
    const { [VALUE]: oldValue, name, ownerElement } = this;
    this[VALUE] = $String(newValue);
    this[CHANGED] = true;
    if (ownerElement) {
      attributeChangedCallback2(ownerElement, name, oldValue);
      attributeChangedCallback(ownerElement, name, oldValue, this[VALUE]);
    }
  }
  cloneNode() {
    const { ownerDocument, name, [VALUE]: value } = this;
    return new _Attr(ownerDocument, name, value);
  }
  toString() {
    const { name, [VALUE]: value } = this;
    return emptyAttributes.has(name) && !value ? name : `${name}="${value.replace(QUOTE, "&quot;")}"`;
  }
  toJSON() {
    const json = [];
    attrAsJSON(this, json);
    return json;
  }
};
var isConnected = ({ ownerDocument, parentNode }) => {
  while (parentNode) {
    if (parentNode === ownerDocument)
      return true;
    parentNode = parentNode.parentNode || parentNode.host;
  }
  return false;
};
var parentElement = ({ parentNode }) => {
  if (parentNode) {
    switch (parentNode.nodeType) {
      case DOCUMENT_NODE:
      case DOCUMENT_FRAGMENT_NODE:
        return null;
    }
  }
  return parentNode;
};
var previousSibling = ({ [PREV]: prev }) => {
  switch (prev ? prev.nodeType : 0) {
    case NODE_END:
      return prev[START];
    case TEXT_NODE:
    case COMMENT_NODE:
      return prev;
  }
  return null;
};
var nextSibling = (node) => {
  const next = getEnd(node)[NEXT];
  return next && (next.nodeType === NODE_END ? null : next);
};
var nextElementSibling2 = (node) => {
  let next = nextSibling(node);
  while (next && next.nodeType !== ELEMENT_NODE)
    next = nextSibling(next);
  return next;
};
var previousElementSibling = (node) => {
  let prev = previousSibling(node);
  while (prev && prev.nodeType !== ELEMENT_NODE)
    prev = previousSibling(prev);
  return prev;
};
var asFragment = (ownerDocument, nodes) => {
  const fragment = ownerDocument.createDocumentFragment();
  fragment.append(...nodes);
  return fragment;
};
var before = (node, nodes) => {
  const { ownerDocument, parentNode } = node;
  if (parentNode)
    parentNode.insertBefore(
      asFragment(ownerDocument, nodes),
      node
    );
};
var after = (node, nodes) => {
  const { ownerDocument, parentNode } = node;
  if (parentNode)
    parentNode.insertBefore(
      asFragment(ownerDocument, nodes),
      getEnd(node)[NEXT]
    );
};
var replaceWith = (node, nodes) => {
  const { ownerDocument, parentNode } = node;
  if (parentNode) {
    parentNode.insertBefore(
      asFragment(ownerDocument, nodes),
      node
    );
    node.remove();
  }
};
var remove = (prev, current, next) => {
  const { parentNode, nodeType } = current;
  if (prev || next) {
    setAdjacent(prev, next);
    current[PREV] = null;
    getEnd(current)[NEXT] = null;
  }
  if (parentNode) {
    current.parentNode = null;
    moCallback(current, parentNode);
    if (nodeType === ELEMENT_NODE)
      disconnectedCallback(current);
  }
};
var CharacterData = class extends Node2 {
  constructor(ownerDocument, localName, nodeType, data2) {
    super(ownerDocument, localName, nodeType);
    this[VALUE] = $String(data2);
  }
  // <Mixins>
  get isConnected() {
    return isConnected(this);
  }
  get parentElement() {
    return parentElement(this);
  }
  get previousSibling() {
    return previousSibling(this);
  }
  get nextSibling() {
    return nextSibling(this);
  }
  get previousElementSibling() {
    return previousElementSibling(this);
  }
  get nextElementSibling() {
    return nextElementSibling2(this);
  }
  before(...nodes) {
    before(this, nodes);
  }
  after(...nodes) {
    after(this, nodes);
  }
  replaceWith(...nodes) {
    replaceWith(this, nodes);
  }
  remove() {
    remove(this[PREV], this, this[NEXT]);
  }
  // </Mixins>
  // CharacterData only
  /* c8 ignore start */
  get data() {
    return this[VALUE];
  }
  set data(value) {
    this[VALUE] = $String(value);
    moCallback(this, this.parentNode);
  }
  get nodeValue() {
    return this.data;
  }
  set nodeValue(value) {
    this.data = value;
  }
  get textContent() {
    return this.data;
  }
  set textContent(value) {
    this.data = value;
  }
  get length() {
    return this.data.length;
  }
  substringData(offset, count) {
    return this.data.substr(offset, count);
  }
  appendData(data2) {
    this.data += data2;
  }
  insertData(offset, data2) {
    const { data: t } = this;
    this.data = t.slice(0, offset) + data2 + t.slice(offset);
  }
  deleteData(offset, count) {
    const { data: t } = this;
    this.data = t.slice(0, offset) + t.slice(offset + count);
  }
  replaceData(offset, count, data2) {
    const { data: t } = this;
    this.data = t.slice(0, offset) + data2 + t.slice(offset + count);
  }
  /* c8 ignore stop */
  toJSON() {
    const json = [];
    characterDataAsJSON(this, json);
    return json;
  }
};
var Comment3 = class _Comment extends CharacterData {
  constructor(ownerDocument, data2 = "") {
    super(ownerDocument, "#comment", COMMENT_NODE, data2);
  }
  cloneNode() {
    const { ownerDocument, [VALUE]: data2 } = this;
    return new _Comment(ownerDocument, data2);
  }
  toString() {
    return `<!--${this[VALUE]}-->`;
  }
};
var DocumentType = class _DocumentType extends Node2 {
  constructor(ownerDocument, name, publicId = "", systemId = "") {
    super(ownerDocument, "#document-type", DOCUMENT_TYPE_NODE);
    this.name = name;
    this.publicId = publicId;
    this.systemId = systemId;
  }
  cloneNode() {
    const { ownerDocument, name, publicId, systemId } = this;
    return new _DocumentType(ownerDocument, name, publicId, systemId);
  }
  toString() {
    const { name, publicId, systemId } = this;
    const hasPublic = 0 < publicId.length;
    const str = [name];
    if (hasPublic)
      str.push("PUBLIC", `"${publicId}"`);
    if (systemId.length) {
      if (!hasPublic)
        str.push("SYSTEM");
      str.push(`"${systemId}"`);
    }
    return `<!DOCTYPE ${str.join(" ")}>`;
  }
  toJSON() {
    const json = [];
    documentTypeAsJSON(this, json);
    return json;
  }
};
var import_boolbase6 = __toESM(require_boolbase(), 1);
var SelectorType;
(function(SelectorType2) {
  SelectorType2["Attribute"] = "attribute";
  SelectorType2["Pseudo"] = "pseudo";
  SelectorType2["PseudoElement"] = "pseudo-element";
  SelectorType2["Tag"] = "tag";
  SelectorType2["Universal"] = "universal";
  SelectorType2["Adjacent"] = "adjacent";
  SelectorType2["Child"] = "child";
  SelectorType2["Descendant"] = "descendant";
  SelectorType2["Parent"] = "parent";
  SelectorType2["Sibling"] = "sibling";
  SelectorType2["ColumnCombinator"] = "column-combinator";
})(SelectorType || (SelectorType = {}));
var AttributeAction;
(function(AttributeAction2) {
  AttributeAction2["Any"] = "any";
  AttributeAction2["Element"] = "element";
  AttributeAction2["End"] = "end";
  AttributeAction2["Equals"] = "equals";
  AttributeAction2["Exists"] = "exists";
  AttributeAction2["Hyphen"] = "hyphen";
  AttributeAction2["Not"] = "not";
  AttributeAction2["Start"] = "start";
})(AttributeAction || (AttributeAction = {}));
var reName = /^[^\\#]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/;
var reEscape = /\\([\da-f]{1,6}\s?|(\s)|.)/gi;
var actionTypes = /* @__PURE__ */ new Map([
  [126, AttributeAction.Element],
  [94, AttributeAction.Start],
  [36, AttributeAction.End],
  [42, AttributeAction.Any],
  [33, AttributeAction.Not],
  [124, AttributeAction.Hyphen]
]);
var unpackPseudos = /* @__PURE__ */ new Set([
  "has",
  "not",
  "matches",
  "is",
  "where",
  "host",
  "host-context"
]);
function isTraversal(selector) {
  switch (selector.type) {
    case SelectorType.Adjacent:
    case SelectorType.Child:
    case SelectorType.Descendant:
    case SelectorType.Parent:
    case SelectorType.Sibling:
    case SelectorType.ColumnCombinator:
      return true;
    default:
      return false;
  }
}
var stripQuotesFromPseudos = /* @__PURE__ */ new Set(["contains", "icontains"]);
function funescape(_, escaped, escapedWhitespace) {
  const high = parseInt(escaped, 16) - 65536;
  return high !== high || escapedWhitespace ? escaped : high < 0 ? (
    // BMP codepoint
    String.fromCharCode(high + 65536)
  ) : (
    // Supplemental Plane codepoint (surrogate pair)
    String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320)
  );
}
function unescapeCSS(str) {
  return str.replace(reEscape, funescape);
}
function isQuote(c) {
  return c === 39 || c === 34;
}
function isWhitespace2(c) {
  return c === 32 || c === 9 || c === 10 || c === 12 || c === 13;
}
function parse(selector) {
  const subselects2 = [];
  const endIndex = parseSelector(subselects2, `${selector}`, 0);
  if (endIndex < selector.length) {
    throw new Error(`Unmatched selector: ${selector.slice(endIndex)}`);
  }
  return subselects2;
}
function parseSelector(subselects2, selector, selectorIndex) {
  let tokens = [];
  function getName3(offset) {
    const match = selector.slice(selectorIndex + offset).match(reName);
    if (!match) {
      throw new Error(`Expected name, found ${selector.slice(selectorIndex)}`);
    }
    const [name] = match;
    selectorIndex += offset + name.length;
    return unescapeCSS(name);
  }
  function stripWhitespace(offset) {
    selectorIndex += offset;
    while (selectorIndex < selector.length && isWhitespace2(selector.charCodeAt(selectorIndex))) {
      selectorIndex++;
    }
  }
  function readValueWithParenthesis() {
    selectorIndex += 1;
    const start = selectorIndex;
    let counter = 1;
    for (; counter > 0 && selectorIndex < selector.length; selectorIndex++) {
      if (selector.charCodeAt(selectorIndex) === 40 && !isEscaped(selectorIndex)) {
        counter++;
      } else if (selector.charCodeAt(selectorIndex) === 41 && !isEscaped(selectorIndex)) {
        counter--;
      }
    }
    if (counter) {
      throw new Error("Parenthesis not matched");
    }
    return unescapeCSS(selector.slice(start, selectorIndex - 1));
  }
  function isEscaped(pos) {
    let slashCount = 0;
    while (selector.charCodeAt(--pos) === 92)
      slashCount++;
    return (slashCount & 1) === 1;
  }
  function ensureNotTraversal() {
    if (tokens.length > 0 && isTraversal(tokens[tokens.length - 1])) {
      throw new Error("Did not expect successive traversals.");
    }
  }
  function addTraversal(type) {
    if (tokens.length > 0 && tokens[tokens.length - 1].type === SelectorType.Descendant) {
      tokens[tokens.length - 1].type = type;
      return;
    }
    ensureNotTraversal();
    tokens.push({ type });
  }
  function addSpecialAttribute(name, action) {
    tokens.push({
      type: SelectorType.Attribute,
      name,
      action,
      value: getName3(1),
      namespace: null,
      ignoreCase: "quirks"
    });
  }
  function finalizeSubselector() {
    if (tokens.length && tokens[tokens.length - 1].type === SelectorType.Descendant) {
      tokens.pop();
    }
    if (tokens.length === 0) {
      throw new Error("Empty sub-selector");
    }
    subselects2.push(tokens);
  }
  stripWhitespace(0);
  if (selector.length === selectorIndex) {
    return selectorIndex;
  }
  loop:
    while (selectorIndex < selector.length) {
      const firstChar = selector.charCodeAt(selectorIndex);
      switch (firstChar) {
        case 32:
        case 9:
        case 10:
        case 12:
        case 13: {
          if (tokens.length === 0 || tokens[0].type !== SelectorType.Descendant) {
            ensureNotTraversal();
            tokens.push({ type: SelectorType.Descendant });
          }
          stripWhitespace(1);
          break;
        }
        case 62: {
          addTraversal(SelectorType.Child);
          stripWhitespace(1);
          break;
        }
        case 60: {
          addTraversal(SelectorType.Parent);
          stripWhitespace(1);
          break;
        }
        case 126: {
          addTraversal(SelectorType.Sibling);
          stripWhitespace(1);
          break;
        }
        case 43: {
          addTraversal(SelectorType.Adjacent);
          stripWhitespace(1);
          break;
        }
        case 46: {
          addSpecialAttribute("class", AttributeAction.Element);
          break;
        }
        case 35: {
          addSpecialAttribute("id", AttributeAction.Equals);
          break;
        }
        case 91: {
          stripWhitespace(1);
          let name;
          let namespace = null;
          if (selector.charCodeAt(selectorIndex) === 124) {
            name = getName3(1);
          } else if (selector.startsWith("*|", selectorIndex)) {
            namespace = "*";
            name = getName3(2);
          } else {
            name = getName3(0);
            if (selector.charCodeAt(selectorIndex) === 124 && selector.charCodeAt(selectorIndex + 1) !== 61) {
              namespace = name;
              name = getName3(1);
            }
          }
          stripWhitespace(0);
          let action = AttributeAction.Exists;
          const possibleAction = actionTypes.get(selector.charCodeAt(selectorIndex));
          if (possibleAction) {
            action = possibleAction;
            if (selector.charCodeAt(selectorIndex + 1) !== 61) {
              throw new Error("Expected `=`");
            }
            stripWhitespace(2);
          } else if (selector.charCodeAt(selectorIndex) === 61) {
            action = AttributeAction.Equals;
            stripWhitespace(1);
          }
          let value = "";
          let ignoreCase2 = null;
          if (action !== "exists") {
            if (isQuote(selector.charCodeAt(selectorIndex))) {
              const quote = selector.charCodeAt(selectorIndex);
              let sectionEnd = selectorIndex + 1;
              while (sectionEnd < selector.length && (selector.charCodeAt(sectionEnd) !== quote || isEscaped(sectionEnd))) {
                sectionEnd += 1;
              }
              if (selector.charCodeAt(sectionEnd) !== quote) {
                throw new Error("Attribute value didn't end");
              }
              value = unescapeCSS(selector.slice(selectorIndex + 1, sectionEnd));
              selectorIndex = sectionEnd + 1;
            } else {
              const valueStart = selectorIndex;
              while (selectorIndex < selector.length && (!isWhitespace2(selector.charCodeAt(selectorIndex)) && selector.charCodeAt(selectorIndex) !== 93 || isEscaped(selectorIndex))) {
                selectorIndex += 1;
              }
              value = unescapeCSS(selector.slice(valueStart, selectorIndex));
            }
            stripWhitespace(0);
            const forceIgnore = selector.charCodeAt(selectorIndex) | 32;
            if (forceIgnore === 115) {
              ignoreCase2 = false;
              stripWhitespace(1);
            } else if (forceIgnore === 105) {
              ignoreCase2 = true;
              stripWhitespace(1);
            }
          }
          if (selector.charCodeAt(selectorIndex) !== 93) {
            throw new Error("Attribute selector didn't terminate");
          }
          selectorIndex += 1;
          const attributeSelector = {
            type: SelectorType.Attribute,
            name,
            action,
            value,
            namespace,
            ignoreCase: ignoreCase2
          };
          tokens.push(attributeSelector);
          break;
        }
        case 58: {
          if (selector.charCodeAt(selectorIndex + 1) === 58) {
            tokens.push({
              type: SelectorType.PseudoElement,
              name: getName3(2).toLowerCase(),
              data: selector.charCodeAt(selectorIndex) === 40 ? readValueWithParenthesis() : null
            });
            continue;
          }
          const name = getName3(1).toLowerCase();
          let data2 = null;
          if (selector.charCodeAt(selectorIndex) === 40) {
            if (unpackPseudos.has(name)) {
              if (isQuote(selector.charCodeAt(selectorIndex + 1))) {
                throw new Error(`Pseudo-selector ${name} cannot be quoted`);
              }
              data2 = [];
              selectorIndex = parseSelector(data2, selector, selectorIndex + 1);
              if (selector.charCodeAt(selectorIndex) !== 41) {
                throw new Error(`Missing closing parenthesis in :${name} (${selector})`);
              }
              selectorIndex += 1;
            } else {
              data2 = readValueWithParenthesis();
              if (stripQuotesFromPseudos.has(name)) {
                const quot = data2.charCodeAt(0);
                if (quot === data2.charCodeAt(data2.length - 1) && isQuote(quot)) {
                  data2 = data2.slice(1, -1);
                }
              }
              data2 = unescapeCSS(data2);
            }
          }
          tokens.push({ type: SelectorType.Pseudo, name, data: data2 });
          break;
        }
        case 44: {
          finalizeSubselector();
          tokens = [];
          stripWhitespace(1);
          break;
        }
        default: {
          if (selector.startsWith("/*", selectorIndex)) {
            const endIndex = selector.indexOf("*/", selectorIndex + 2);
            if (endIndex < 0) {
              throw new Error("Comment was not terminated");
            }
            selectorIndex = endIndex + 2;
            if (tokens.length === 0) {
              stripWhitespace(0);
            }
            break;
          }
          let namespace = null;
          let name;
          if (firstChar === 42) {
            selectorIndex += 1;
            name = "*";
          } else if (firstChar === 124) {
            name = "";
            if (selector.charCodeAt(selectorIndex + 1) === 124) {
              addTraversal(SelectorType.ColumnCombinator);
              stripWhitespace(2);
              break;
            }
          } else if (reName.test(selector.slice(selectorIndex))) {
            name = getName3(0);
          } else {
            break loop;
          }
          if (selector.charCodeAt(selectorIndex) === 124 && selector.charCodeAt(selectorIndex + 1) !== 124) {
            namespace = name;
            if (selector.charCodeAt(selectorIndex + 1) === 42) {
              name = "*";
              selectorIndex += 2;
            } else {
              name = getName3(1);
            }
          }
          tokens.push(name === "*" ? { type: SelectorType.Universal, namespace } : { type: SelectorType.Tag, name, namespace });
        }
      }
    }
  finalizeSubselector();
  return selectorIndex;
}
var import_boolbase5 = __toESM(require_boolbase(), 1);
var procedure = /* @__PURE__ */ new Map([
  [SelectorType.Universal, 50],
  [SelectorType.Tag, 30],
  [SelectorType.Attribute, 1],
  [SelectorType.Pseudo, 0]
]);
function isTraversal2(token) {
  return !procedure.has(token.type);
}
var attributes = /* @__PURE__ */ new Map([
  [AttributeAction.Exists, 10],
  [AttributeAction.Equals, 8],
  [AttributeAction.Not, 7],
  [AttributeAction.Start, 6],
  [AttributeAction.End, 6],
  [AttributeAction.Any, 5]
]);
function sortByProcedure(arr) {
  const procs = arr.map(getProcedure);
  for (let i = 1; i < arr.length; i++) {
    const procNew = procs[i];
    if (procNew < 0)
      continue;
    for (let j = i - 1; j >= 0 && procNew < procs[j]; j--) {
      const token = arr[j + 1];
      arr[j + 1] = arr[j];
      arr[j] = token;
      procs[j + 1] = procs[j];
      procs[j] = procNew;
    }
  }
}
function getProcedure(token) {
  var _a2, _b;
  let proc = (_a2 = procedure.get(token.type)) !== null && _a2 !== void 0 ? _a2 : -1;
  if (token.type === SelectorType.Attribute) {
    proc = (_b = attributes.get(token.action)) !== null && _b !== void 0 ? _b : 4;
    if (token.action === AttributeAction.Equals && token.name === "id") {
      proc = 9;
    }
    if (token.ignoreCase) {
      proc >>= 1;
    }
  } else if (token.type === SelectorType.Pseudo) {
    if (!token.data) {
      proc = 3;
    } else if (token.name === "has" || token.name === "contains") {
      proc = 0;
    } else if (Array.isArray(token.data)) {
      proc = Math.min(...token.data.map((d) => Math.min(...d.map(getProcedure))));
      if (proc < 0) {
        proc = 0;
      }
    } else {
      proc = 2;
    }
  }
  return proc;
}
var import_boolbase = __toESM(require_boolbase(), 1);
var reChars = /[-[\]{}()*+?.,\\^$|#\s]/g;
function escapeRegex(value) {
  return value.replace(reChars, "\\$&");
}
var caseInsensitiveAttributes = /* @__PURE__ */ new Set([
  "accept",
  "accept-charset",
  "align",
  "alink",
  "axis",
  "bgcolor",
  "charset",
  "checked",
  "clear",
  "codetype",
  "color",
  "compact",
  "declare",
  "defer",
  "dir",
  "direction",
  "disabled",
  "enctype",
  "face",
  "frame",
  "hreflang",
  "http-equiv",
  "lang",
  "language",
  "link",
  "media",
  "method",
  "multiple",
  "nohref",
  "noresize",
  "noshade",
  "nowrap",
  "readonly",
  "rel",
  "rev",
  "rules",
  "scope",
  "scrolling",
  "selected",
  "shape",
  "target",
  "text",
  "type",
  "valign",
  "valuetype",
  "vlink"
]);
function shouldIgnoreCase(selector, options) {
  return typeof selector.ignoreCase === "boolean" ? selector.ignoreCase : selector.ignoreCase === "quirks" ? !!options.quirksMode : !options.xmlMode && caseInsensitiveAttributes.has(selector.name);
}
var attributeRules = {
  equals(next, data2, options) {
    const { adapter: adapter2 } = options;
    const { name } = data2;
    let { value } = data2;
    if (shouldIgnoreCase(data2, options)) {
      value = value.toLowerCase();
      return (elem) => {
        const attr = adapter2.getAttributeValue(elem, name);
        return attr != null && attr.length === value.length && attr.toLowerCase() === value && next(elem);
      };
    }
    return (elem) => adapter2.getAttributeValue(elem, name) === value && next(elem);
  },
  hyphen(next, data2, options) {
    const { adapter: adapter2 } = options;
    const { name } = data2;
    let { value } = data2;
    const len = value.length;
    if (shouldIgnoreCase(data2, options)) {
      value = value.toLowerCase();
      return function hyphenIC(elem) {
        const attr = adapter2.getAttributeValue(elem, name);
        return attr != null && (attr.length === len || attr.charAt(len) === "-") && attr.substr(0, len).toLowerCase() === value && next(elem);
      };
    }
    return function hyphen(elem) {
      const attr = adapter2.getAttributeValue(elem, name);
      return attr != null && (attr.length === len || attr.charAt(len) === "-") && attr.substr(0, len) === value && next(elem);
    };
  },
  element(next, data2, options) {
    const { adapter: adapter2 } = options;
    const { name, value } = data2;
    if (/\s/.test(value)) {
      return import_boolbase.default.falseFunc;
    }
    const regex = new RegExp(`(?:^|\\s)${escapeRegex(value)}(?:$|\\s)`, shouldIgnoreCase(data2, options) ? "i" : "");
    return function element(elem) {
      const attr = adapter2.getAttributeValue(elem, name);
      return attr != null && attr.length >= value.length && regex.test(attr) && next(elem);
    };
  },
  exists(next, { name }, { adapter: adapter2 }) {
    return (elem) => adapter2.hasAttrib(elem, name) && next(elem);
  },
  start(next, data2, options) {
    const { adapter: adapter2 } = options;
    const { name } = data2;
    let { value } = data2;
    const len = value.length;
    if (len === 0) {
      return import_boolbase.default.falseFunc;
    }
    if (shouldIgnoreCase(data2, options)) {
      value = value.toLowerCase();
      return (elem) => {
        const attr = adapter2.getAttributeValue(elem, name);
        return attr != null && attr.length >= len && attr.substr(0, len).toLowerCase() === value && next(elem);
      };
    }
    return (elem) => {
      var _a2;
      return !!((_a2 = adapter2.getAttributeValue(elem, name)) === null || _a2 === void 0 ? void 0 : _a2.startsWith(value)) && next(elem);
    };
  },
  end(next, data2, options) {
    const { adapter: adapter2 } = options;
    const { name } = data2;
    let { value } = data2;
    const len = -value.length;
    if (len === 0) {
      return import_boolbase.default.falseFunc;
    }
    if (shouldIgnoreCase(data2, options)) {
      value = value.toLowerCase();
      return (elem) => {
        var _a2;
        return ((_a2 = adapter2.getAttributeValue(elem, name)) === null || _a2 === void 0 ? void 0 : _a2.substr(len).toLowerCase()) === value && next(elem);
      };
    }
    return (elem) => {
      var _a2;
      return !!((_a2 = adapter2.getAttributeValue(elem, name)) === null || _a2 === void 0 ? void 0 : _a2.endsWith(value)) && next(elem);
    };
  },
  any(next, data2, options) {
    const { adapter: adapter2 } = options;
    const { name, value } = data2;
    if (value === "") {
      return import_boolbase.default.falseFunc;
    }
    if (shouldIgnoreCase(data2, options)) {
      const regex = new RegExp(escapeRegex(value), "i");
      return function anyIC(elem) {
        const attr = adapter2.getAttributeValue(elem, name);
        return attr != null && attr.length >= value.length && regex.test(attr) && next(elem);
      };
    }
    return (elem) => {
      var _a2;
      return !!((_a2 = adapter2.getAttributeValue(elem, name)) === null || _a2 === void 0 ? void 0 : _a2.includes(value)) && next(elem);
    };
  },
  not(next, data2, options) {
    const { adapter: adapter2 } = options;
    const { name } = data2;
    let { value } = data2;
    if (value === "") {
      return (elem) => !!adapter2.getAttributeValue(elem, name) && next(elem);
    } else if (shouldIgnoreCase(data2, options)) {
      value = value.toLowerCase();
      return (elem) => {
        const attr = adapter2.getAttributeValue(elem, name);
        return (attr == null || attr.length !== value.length || attr.toLowerCase() !== value) && next(elem);
      };
    }
    return (elem) => adapter2.getAttributeValue(elem, name) !== value && next(elem);
  }
};
var whitespace = /* @__PURE__ */ new Set([9, 10, 12, 13, 32]);
var ZERO = "0".charCodeAt(0);
var NINE = "9".charCodeAt(0);
function parse2(formula) {
  formula = formula.trim().toLowerCase();
  if (formula === "even") {
    return [2, 0];
  } else if (formula === "odd") {
    return [2, 1];
  }
  let idx = 0;
  let a = 0;
  let sign = readSign();
  let number = readNumber();
  if (idx < formula.length && formula.charAt(idx) === "n") {
    idx++;
    a = sign * (number !== null && number !== void 0 ? number : 1);
    skipWhitespace();
    if (idx < formula.length) {
      sign = readSign();
      skipWhitespace();
      number = readNumber();
    } else {
      sign = number = 0;
    }
  }
  if (number === null || idx < formula.length) {
    throw new Error(`n-th rule couldn't be parsed ('${formula}')`);
  }
  return [a, sign * number];
  function readSign() {
    if (formula.charAt(idx) === "-") {
      idx++;
      return -1;
    }
    if (formula.charAt(idx) === "+") {
      idx++;
    }
    return 1;
  }
  function readNumber() {
    const start = idx;
    let value = 0;
    while (idx < formula.length && formula.charCodeAt(idx) >= ZERO && formula.charCodeAt(idx) <= NINE) {
      value = value * 10 + (formula.charCodeAt(idx) - ZERO);
      idx++;
    }
    return idx === start ? null : value;
  }
  function skipWhitespace() {
    while (idx < formula.length && whitespace.has(formula.charCodeAt(idx))) {
      idx++;
    }
  }
}
var import_boolbase2 = __toESM(require_boolbase(), 1);
function compile(parsed) {
  const a = parsed[0];
  const b = parsed[1] - 1;
  if (b < 0 && a <= 0)
    return import_boolbase2.default.falseFunc;
  if (a === -1)
    return (index) => index <= b;
  if (a === 0)
    return (index) => index === b;
  if (a === 1)
    return b < 0 ? import_boolbase2.default.trueFunc : (index) => index >= b;
  const absA = Math.abs(a);
  const bMod = (b % absA + absA) % absA;
  return a > 1 ? (index) => index >= b && index % absA === bMod : (index) => index <= b && index % absA === bMod;
}
function nthCheck(formula) {
  return compile(parse2(formula));
}
var import_boolbase3 = __toESM(require_boolbase(), 1);
function getChildFunc(next, adapter2) {
  return (elem) => {
    const parent = adapter2.getParent(elem);
    return parent != null && adapter2.isTag(parent) && next(elem);
  };
}
var filters = {
  contains(next, text, { adapter: adapter2 }) {
    return function contains(elem) {
      return next(elem) && adapter2.getText(elem).includes(text);
    };
  },
  icontains(next, text, { adapter: adapter2 }) {
    const itext = text.toLowerCase();
    return function icontains(elem) {
      return next(elem) && adapter2.getText(elem).toLowerCase().includes(itext);
    };
  },
  // Location specific methods
  "nth-child"(next, rule, { adapter: adapter2, equals }) {
    const func = nthCheck(rule);
    if (func === import_boolbase3.default.falseFunc)
      return import_boolbase3.default.falseFunc;
    if (func === import_boolbase3.default.trueFunc)
      return getChildFunc(next, adapter2);
    return function nthChild(elem) {
      const siblings = adapter2.getSiblings(elem);
      let pos = 0;
      for (let i = 0; i < siblings.length; i++) {
        if (equals(elem, siblings[i]))
          break;
        if (adapter2.isTag(siblings[i])) {
          pos++;
        }
      }
      return func(pos) && next(elem);
    };
  },
  "nth-last-child"(next, rule, { adapter: adapter2, equals }) {
    const func = nthCheck(rule);
    if (func === import_boolbase3.default.falseFunc)
      return import_boolbase3.default.falseFunc;
    if (func === import_boolbase3.default.trueFunc)
      return getChildFunc(next, adapter2);
    return function nthLastChild(elem) {
      const siblings = adapter2.getSiblings(elem);
      let pos = 0;
      for (let i = siblings.length - 1; i >= 0; i--) {
        if (equals(elem, siblings[i]))
          break;
        if (adapter2.isTag(siblings[i])) {
          pos++;
        }
      }
      return func(pos) && next(elem);
    };
  },
  "nth-of-type"(next, rule, { adapter: adapter2, equals }) {
    const func = nthCheck(rule);
    if (func === import_boolbase3.default.falseFunc)
      return import_boolbase3.default.falseFunc;
    if (func === import_boolbase3.default.trueFunc)
      return getChildFunc(next, adapter2);
    return function nthOfType(elem) {
      const siblings = adapter2.getSiblings(elem);
      let pos = 0;
      for (let i = 0; i < siblings.length; i++) {
        const currentSibling = siblings[i];
        if (equals(elem, currentSibling))
          break;
        if (adapter2.isTag(currentSibling) && adapter2.getName(currentSibling) === adapter2.getName(elem)) {
          pos++;
        }
      }
      return func(pos) && next(elem);
    };
  },
  "nth-last-of-type"(next, rule, { adapter: adapter2, equals }) {
    const func = nthCheck(rule);
    if (func === import_boolbase3.default.falseFunc)
      return import_boolbase3.default.falseFunc;
    if (func === import_boolbase3.default.trueFunc)
      return getChildFunc(next, adapter2);
    return function nthLastOfType(elem) {
      const siblings = adapter2.getSiblings(elem);
      let pos = 0;
      for (let i = siblings.length - 1; i >= 0; i--) {
        const currentSibling = siblings[i];
        if (equals(elem, currentSibling))
          break;
        if (adapter2.isTag(currentSibling) && adapter2.getName(currentSibling) === adapter2.getName(elem)) {
          pos++;
        }
      }
      return func(pos) && next(elem);
    };
  },
  // TODO determine the actual root element
  root(next, _rule, { adapter: adapter2 }) {
    return (elem) => {
      const parent = adapter2.getParent(elem);
      return (parent == null || !adapter2.isTag(parent)) && next(elem);
    };
  },
  scope(next, rule, options, context) {
    const { equals } = options;
    if (!context || context.length === 0) {
      return filters["root"](next, rule, options);
    }
    if (context.length === 1) {
      return (elem) => equals(context[0], elem) && next(elem);
    }
    return (elem) => context.includes(elem) && next(elem);
  },
  hover: dynamicStatePseudo("isHovered"),
  visited: dynamicStatePseudo("isVisited"),
  active: dynamicStatePseudo("isActive")
};
function dynamicStatePseudo(name) {
  return function dynamicPseudo(next, _rule, { adapter: adapter2 }) {
    const func = adapter2[name];
    if (typeof func !== "function") {
      return import_boolbase3.default.falseFunc;
    }
    return function active(elem) {
      return func(elem) && next(elem);
    };
  };
}
var pseudos = {
  empty(elem, { adapter: adapter2 }) {
    return !adapter2.getChildren(elem).some((elem2) => (
      // FIXME: `getText` call is potentially expensive.
      adapter2.isTag(elem2) || adapter2.getText(elem2) !== ""
    ));
  },
  "first-child"(elem, { adapter: adapter2, equals }) {
    if (adapter2.prevElementSibling) {
      return adapter2.prevElementSibling(elem) == null;
    }
    const firstChild = adapter2.getSiblings(elem).find((elem2) => adapter2.isTag(elem2));
    return firstChild != null && equals(elem, firstChild);
  },
  "last-child"(elem, { adapter: adapter2, equals }) {
    const siblings = adapter2.getSiblings(elem);
    for (let i = siblings.length - 1; i >= 0; i--) {
      if (equals(elem, siblings[i]))
        return true;
      if (adapter2.isTag(siblings[i]))
        break;
    }
    return false;
  },
  "first-of-type"(elem, { adapter: adapter2, equals }) {
    const siblings = adapter2.getSiblings(elem);
    const elemName = adapter2.getName(elem);
    for (let i = 0; i < siblings.length; i++) {
      const currentSibling = siblings[i];
      if (equals(elem, currentSibling))
        return true;
      if (adapter2.isTag(currentSibling) && adapter2.getName(currentSibling) === elemName) {
        break;
      }
    }
    return false;
  },
  "last-of-type"(elem, { adapter: adapter2, equals }) {
    const siblings = adapter2.getSiblings(elem);
    const elemName = adapter2.getName(elem);
    for (let i = siblings.length - 1; i >= 0; i--) {
      const currentSibling = siblings[i];
      if (equals(elem, currentSibling))
        return true;
      if (adapter2.isTag(currentSibling) && adapter2.getName(currentSibling) === elemName) {
        break;
      }
    }
    return false;
  },
  "only-of-type"(elem, { adapter: adapter2, equals }) {
    const elemName = adapter2.getName(elem);
    return adapter2.getSiblings(elem).every((sibling) => equals(elem, sibling) || !adapter2.isTag(sibling) || adapter2.getName(sibling) !== elemName);
  },
  "only-child"(elem, { adapter: adapter2, equals }) {
    return adapter2.getSiblings(elem).every((sibling) => equals(elem, sibling) || !adapter2.isTag(sibling));
  }
};
function verifyPseudoArgs(func, name, subselect, argIndex) {
  if (subselect === null) {
    if (func.length > argIndex) {
      throw new Error(`Pseudo-class :${name} requires an argument`);
    }
  } else if (func.length === argIndex) {
    throw new Error(`Pseudo-class :${name} doesn't have any arguments`);
  }
}
var aliases = {
  // Links
  "any-link": ":is(a, area, link)[href]",
  link: ":any-link:not(:visited)",
  // Forms
  // https://html.spec.whatwg.org/multipage/scripting.html#disabled-elements
  disabled: `:is(
        :is(button, input, select, textarea, optgroup, option)[disabled],
        optgroup[disabled] > option,
        fieldset[disabled]:not(fieldset[disabled] legend:first-of-type *)
    )`,
  enabled: ":not(:disabled)",
  checked: ":is(:is(input[type=radio], input[type=checkbox])[checked], option:selected)",
  required: ":is(input, select, textarea)[required]",
  optional: ":is(input, select, textarea):not([required])",
  // JQuery extensions
  // https://html.spec.whatwg.org/multipage/form-elements.html#concept-option-selectedness
  selected: "option:is([selected], select:not([multiple]):not(:has(> option[selected])) > :first-of-type)",
  checkbox: "[type=checkbox]",
  file: "[type=file]",
  password: "[type=password]",
  radio: "[type=radio]",
  reset: "[type=reset]",
  image: "[type=image]",
  submit: "[type=submit]",
  parent: ":not(:empty)",
  header: ":is(h1, h2, h3, h4, h5, h6)",
  button: ":is(button, input[type=button])",
  input: ":is(input, textarea, select, button)",
  text: "input:is(:not([type!='']), [type=text])"
};
var import_boolbase4 = __toESM(require_boolbase(), 1);
var PLACEHOLDER_ELEMENT = {};
function ensureIsTag(next, adapter2) {
  if (next === import_boolbase4.default.falseFunc)
    return import_boolbase4.default.falseFunc;
  return (elem) => adapter2.isTag(elem) && next(elem);
}
function getNextSiblings(elem, adapter2) {
  const siblings = adapter2.getSiblings(elem);
  if (siblings.length <= 1)
    return [];
  const elemIndex = siblings.indexOf(elem);
  if (elemIndex < 0 || elemIndex === siblings.length - 1)
    return [];
  return siblings.slice(elemIndex + 1).filter(adapter2.isTag);
}
function copyOptions(options) {
  return {
    xmlMode: !!options.xmlMode,
    lowerCaseAttributeNames: !!options.lowerCaseAttributeNames,
    lowerCaseTags: !!options.lowerCaseTags,
    quirksMode: !!options.quirksMode,
    cacheResults: !!options.cacheResults,
    pseudos: options.pseudos,
    adapter: options.adapter,
    equals: options.equals
  };
}
var is = (next, token, options, context, compileToken2) => {
  const func = compileToken2(token, copyOptions(options), context);
  return func === import_boolbase4.default.trueFunc ? next : func === import_boolbase4.default.falseFunc ? import_boolbase4.default.falseFunc : (elem) => func(elem) && next(elem);
};
var subselects = {
  is,
  /**
   * `:matches` and `:where` are aliases for `:is`.
   */
  matches: is,
  where: is,
  not(next, token, options, context, compileToken2) {
    const func = compileToken2(token, copyOptions(options), context);
    return func === import_boolbase4.default.falseFunc ? next : func === import_boolbase4.default.trueFunc ? import_boolbase4.default.falseFunc : (elem) => !func(elem) && next(elem);
  },
  has(next, subselect, options, _context, compileToken2) {
    const { adapter: adapter2 } = options;
    const opts = copyOptions(options);
    opts.relativeSelector = true;
    const context = subselect.some((s) => s.some(isTraversal2)) ? (
      // Used as a placeholder. Will be replaced with the actual element.
      [PLACEHOLDER_ELEMENT]
    ) : void 0;
    const compiled = compileToken2(subselect, opts, context);
    if (compiled === import_boolbase4.default.falseFunc)
      return import_boolbase4.default.falseFunc;
    const hasElement = ensureIsTag(compiled, adapter2);
    if (context && compiled !== import_boolbase4.default.trueFunc) {
      const { shouldTestNextSiblings = false } = compiled;
      return (elem) => {
        if (!next(elem))
          return false;
        context[0] = elem;
        const childs = adapter2.getChildren(elem);
        const nextElements = shouldTestNextSiblings ? [...childs, ...getNextSiblings(elem, adapter2)] : childs;
        return adapter2.existsOne(hasElement, nextElements);
      };
    }
    return (elem) => next(elem) && adapter2.existsOne(hasElement, adapter2.getChildren(elem));
  }
};
function compilePseudoSelector(next, selector, options, context, compileToken2) {
  var _a2;
  const { name, data: data2 } = selector;
  if (Array.isArray(data2)) {
    if (!(name in subselects)) {
      throw new Error(`Unknown pseudo-class :${name}(${data2})`);
    }
    return subselects[name](next, data2, options, context, compileToken2);
  }
  const userPseudo = (_a2 = options.pseudos) === null || _a2 === void 0 ? void 0 : _a2[name];
  const stringPseudo = typeof userPseudo === "string" ? userPseudo : aliases[name];
  if (typeof stringPseudo === "string") {
    if (data2 != null) {
      throw new Error(`Pseudo ${name} doesn't have any arguments`);
    }
    const alias = parse(stringPseudo);
    return subselects["is"](next, alias, options, context, compileToken2);
  }
  if (typeof userPseudo === "function") {
    verifyPseudoArgs(userPseudo, name, data2, 1);
    return (elem) => userPseudo(elem, data2) && next(elem);
  }
  if (name in filters) {
    return filters[name](next, data2, options, context);
  }
  if (name in pseudos) {
    const pseudo = pseudos[name];
    verifyPseudoArgs(pseudo, name, data2, 2);
    return (elem) => pseudo(elem, options, data2) && next(elem);
  }
  throw new Error(`Unknown pseudo-class :${name}`);
}
function getElementParent(node, adapter2) {
  const parent = adapter2.getParent(node);
  if (parent && adapter2.isTag(parent)) {
    return parent;
  }
  return null;
}
function compileGeneralSelector(next, selector, options, context, compileToken2) {
  const { adapter: adapter2, equals } = options;
  switch (selector.type) {
    case SelectorType.PseudoElement: {
      throw new Error("Pseudo-elements are not supported by css-select");
    }
    case SelectorType.ColumnCombinator: {
      throw new Error("Column combinators are not yet supported by css-select");
    }
    case SelectorType.Attribute: {
      if (selector.namespace != null) {
        throw new Error("Namespaced attributes are not yet supported by css-select");
      }
      if (!options.xmlMode || options.lowerCaseAttributeNames) {
        selector.name = selector.name.toLowerCase();
      }
      return attributeRules[selector.action](next, selector, options);
    }
    case SelectorType.Pseudo: {
      return compilePseudoSelector(next, selector, options, context, compileToken2);
    }
    case SelectorType.Tag: {
      if (selector.namespace != null) {
        throw new Error("Namespaced tag names are not yet supported by css-select");
      }
      let { name } = selector;
      if (!options.xmlMode || options.lowerCaseTags) {
        name = name.toLowerCase();
      }
      return function tag(elem) {
        return adapter2.getName(elem) === name && next(elem);
      };
    }
    case SelectorType.Descendant: {
      if (options.cacheResults === false || typeof WeakSet === "undefined") {
        return function descendant(elem) {
          let current = elem;
          while (current = getElementParent(current, adapter2)) {
            if (next(current)) {
              return true;
            }
          }
          return false;
        };
      }
      const isFalseCache = /* @__PURE__ */ new WeakSet();
      return function cachedDescendant(elem) {
        let current = elem;
        while (current = getElementParent(current, adapter2)) {
          if (!isFalseCache.has(current)) {
            if (adapter2.isTag(current) && next(current)) {
              return true;
            }
            isFalseCache.add(current);
          }
        }
        return false;
      };
    }
    case "_flexibleDescendant": {
      return function flexibleDescendant(elem) {
        let current = elem;
        do {
          if (next(current))
            return true;
        } while (current = getElementParent(current, adapter2));
        return false;
      };
    }
    case SelectorType.Parent: {
      return function parent(elem) {
        return adapter2.getChildren(elem).some((elem2) => adapter2.isTag(elem2) && next(elem2));
      };
    }
    case SelectorType.Child: {
      return function child(elem) {
        const parent = adapter2.getParent(elem);
        return parent != null && adapter2.isTag(parent) && next(parent);
      };
    }
    case SelectorType.Sibling: {
      return function sibling(elem) {
        const siblings = adapter2.getSiblings(elem);
        for (let i = 0; i < siblings.length; i++) {
          const currentSibling = siblings[i];
          if (equals(elem, currentSibling))
            break;
          if (adapter2.isTag(currentSibling) && next(currentSibling)) {
            return true;
          }
        }
        return false;
      };
    }
    case SelectorType.Adjacent: {
      if (adapter2.prevElementSibling) {
        return function adjacent(elem) {
          const previous = adapter2.prevElementSibling(elem);
          return previous != null && next(previous);
        };
      }
      return function adjacent(elem) {
        const siblings = adapter2.getSiblings(elem);
        let lastElement;
        for (let i = 0; i < siblings.length; i++) {
          const currentSibling = siblings[i];
          if (equals(elem, currentSibling))
            break;
          if (adapter2.isTag(currentSibling)) {
            lastElement = currentSibling;
          }
        }
        return !!lastElement && next(lastElement);
      };
    }
    case SelectorType.Universal: {
      if (selector.namespace != null && selector.namespace !== "*") {
        throw new Error("Namespaced universal selectors are not yet supported by css-select");
      }
      return next;
    }
  }
}
function compile2(selector, options, context) {
  const next = compileUnsafe(selector, options, context);
  return ensureIsTag(next, options.adapter);
}
function compileUnsafe(selector, options, context) {
  const token = typeof selector === "string" ? parse(selector) : selector;
  return compileToken(token, options, context);
}
function includesScopePseudo(t) {
  return t.type === SelectorType.Pseudo && (t.name === "scope" || Array.isArray(t.data) && t.data.some((data2) => data2.some(includesScopePseudo)));
}
var DESCENDANT_TOKEN = { type: SelectorType.Descendant };
var FLEXIBLE_DESCENDANT_TOKEN = {
  type: "_flexibleDescendant"
};
var SCOPE_TOKEN = {
  type: SelectorType.Pseudo,
  name: "scope",
  data: null
};
function absolutize(token, { adapter: adapter2 }, context) {
  const hasContext = !!(context === null || context === void 0 ? void 0 : context.every((e) => {
    const parent = adapter2.isTag(e) && adapter2.getParent(e);
    return e === PLACEHOLDER_ELEMENT || parent && adapter2.isTag(parent);
  }));
  for (const t of token) {
    if (t.length > 0 && isTraversal2(t[0]) && t[0].type !== SelectorType.Descendant) {
    } else if (hasContext && !t.some(includesScopePseudo)) {
      t.unshift(DESCENDANT_TOKEN);
    } else {
      continue;
    }
    t.unshift(SCOPE_TOKEN);
  }
}
function compileToken(token, options, context) {
  var _a2;
  token.forEach(sortByProcedure);
  context = (_a2 = options.context) !== null && _a2 !== void 0 ? _a2 : context;
  const isArrayContext = Array.isArray(context);
  const finalContext = context && (Array.isArray(context) ? context : [context]);
  if (options.relativeSelector !== false) {
    absolutize(token, options, finalContext);
  } else if (token.some((t) => t.length > 0 && isTraversal2(t[0]))) {
    throw new Error("Relative selectors are not allowed when the `relativeSelector` option is disabled");
  }
  let shouldTestNextSiblings = false;
  const query2 = token.map((rules) => {
    if (rules.length >= 2) {
      const [first, second] = rules;
      if (first.type !== SelectorType.Pseudo || first.name !== "scope") {
      } else if (isArrayContext && second.type === SelectorType.Descendant) {
        rules[1] = FLEXIBLE_DESCENDANT_TOKEN;
      } else if (second.type === SelectorType.Adjacent || second.type === SelectorType.Sibling) {
        shouldTestNextSiblings = true;
      }
    }
    return compileRules(rules, options, finalContext);
  }).reduce(reduceRules, import_boolbase5.default.falseFunc);
  query2.shouldTestNextSiblings = shouldTestNextSiblings;
  return query2;
}
function compileRules(rules, options, context) {
  var _a2;
  return rules.reduce((previous, rule) => previous === import_boolbase5.default.falseFunc ? import_boolbase5.default.falseFunc : compileGeneralSelector(previous, rule, options, context, compileToken), (_a2 = options.rootFunc) !== null && _a2 !== void 0 ? _a2 : import_boolbase5.default.trueFunc);
}
function reduceRules(a, b) {
  if (b === import_boolbase5.default.falseFunc || a === import_boolbase5.default.trueFunc) {
    return a;
  }
  if (a === import_boolbase5.default.falseFunc || b === import_boolbase5.default.trueFunc) {
    return b;
  }
  return function combine(elem) {
    return a(elem) || b(elem);
  };
}
var defaultEquals = (a, b) => a === b;
var defaultOptions = {
  adapter: esm_exports2,
  equals: defaultEquals
};
function convertOptionFormats(options) {
  var _a2, _b, _c, _d;
  const opts = options !== null && options !== void 0 ? options : defaultOptions;
  (_a2 = opts.adapter) !== null && _a2 !== void 0 ? _a2 : opts.adapter = esm_exports2;
  (_b = opts.equals) !== null && _b !== void 0 ? _b : opts.equals = (_d = (_c = opts.adapter) === null || _c === void 0 ? void 0 : _c.equals) !== null && _d !== void 0 ? _d : defaultEquals;
  return opts;
}
function wrapCompile(func) {
  return function addAdapter(selector, options, context) {
    const opts = convertOptionFormats(options);
    return func(selector, opts, context);
  };
}
var compile3 = wrapCompile(compile2);
var _compileUnsafe = wrapCompile(compileUnsafe);
var _compileToken = wrapCompile(compileToken);
function getSelectorFunc(searchFunc) {
  return function select(query2, elements, options) {
    const opts = convertOptionFormats(options);
    if (typeof query2 !== "function") {
      query2 = compileUnsafe(query2, opts, elements);
    }
    const filteredElements = prepareContext(elements, opts.adapter, query2.shouldTestNextSiblings);
    return searchFunc(query2, filteredElements, opts);
  };
}
function prepareContext(elems, adapter2, shouldTestNextSiblings = false) {
  if (shouldTestNextSiblings) {
    elems = appendNextSiblings(elems, adapter2);
  }
  return Array.isArray(elems) ? adapter2.removeSubsets(elems) : adapter2.getChildren(elems);
}
function appendNextSiblings(elem, adapter2) {
  const elems = Array.isArray(elem) ? elem.slice(0) : [elem];
  const elemsLength = elems.length;
  for (let i = 0; i < elemsLength; i++) {
    const nextSiblings = getNextSiblings(elems[i], adapter2);
    elems.push(...nextSiblings);
  }
  return elems;
}
var selectAll = getSelectorFunc((query2, elems, options) => query2 === import_boolbase6.default.falseFunc || !elems || elems.length === 0 ? [] : options.adapter.findAll(query2, elems));
var selectOne = getSelectorFunc((query2, elems, options) => query2 === import_boolbase6.default.falseFunc || !elems || elems.length === 0 ? null : options.adapter.findOne(query2, elems));
function is2(elem, query2, options) {
  const opts = convertOptionFormats(options);
  return (typeof query2 === "function" ? query2 : compile2(query2, opts))(elem);
}
var { isArray } = Array;
var isTag3 = ({ nodeType }) => nodeType === ELEMENT_NODE;
var existsOne2 = (test, elements) => elements.some(
  (element) => isTag3(element) && (test(element) || existsOne2(test, getChildren2(element)))
);
var getAttributeValue2 = (element, name) => name === "class" ? element.classList.value : element.getAttribute(name);
var getChildren2 = ({ childNodes }) => childNodes;
var getName2 = (element) => {
  const { localName } = element;
  return ignoreCase(element) ? localName.toLowerCase() : localName;
};
var getParent2 = ({ parentNode }) => parentNode;
var getSiblings2 = (element) => {
  const { parentNode } = element;
  return parentNode ? getChildren2(parentNode) : element;
};
var getText2 = (node) => {
  if (isArray(node))
    return node.map(getText2).join("");
  if (isTag3(node))
    return getText2(getChildren2(node));
  if (node.nodeType === TEXT_NODE)
    return node.data;
  return "";
};
var hasAttrib2 = (element, name) => element.hasAttribute(name);
var removeSubsets2 = (nodes) => {
  let { length } = nodes;
  while (length--) {
    const node = nodes[length];
    if (length && -1 < nodes.lastIndexOf(node, length - 1)) {
      nodes.splice(length, 1);
      continue;
    }
    for (let { parentNode } = node; parentNode; parentNode = parentNode.parentNode) {
      if (nodes.includes(parentNode)) {
        nodes.splice(length, 1);
        break;
      }
    }
  }
  return nodes;
};
var findAll2 = (test, nodes) => {
  const matches2 = [];
  for (const node of nodes) {
    if (isTag3(node)) {
      if (test(node))
        matches2.push(node);
      matches2.push(...findAll2(test, getChildren2(node)));
    }
  }
  return matches2;
};
var findOne2 = (test, nodes) => {
  for (let node of nodes)
    if (test(node) || (node = findOne2(test, getChildren2(node))))
      return node;
  return null;
};
var adapter = {
  isTag: isTag3,
  existsOne: existsOne2,
  getAttributeValue: getAttributeValue2,
  getChildren: getChildren2,
  getName: getName2,
  getParent: getParent2,
  getSiblings: getSiblings2,
  getText: getText2,
  hasAttrib: hasAttrib2,
  removeSubsets: removeSubsets2,
  findAll: findAll2,
  findOne: findOne2
};
var prepareMatch = (element, selectors) => compile3(
  selectors,
  {
    context: selectors.includes(":scope") ? element : void 0,
    xmlMode: !ignoreCase(element),
    adapter
  }
);
var matches = (element, selectors) => is2(
  element,
  selectors,
  {
    strict: true,
    context: selectors.includes(":scope") ? element : void 0,
    xmlMode: !ignoreCase(element),
    adapter
  }
);
var getInnerHtml = (node) => node.childNodes.join("");
var setInnerHtml = (node, html) => {
  const { ownerDocument } = node;
  const { constructor } = ownerDocument;
  const document2 = new constructor();
  document2[CUSTOM_ELEMENTS] = ownerDocument[CUSTOM_ELEMENTS];
  const { childNodes } = parseFromString(document2, ignoreCase(node), html);
  node.replaceChildren(...childNodes.map(setOwnerDocument, ownerDocument));
};
function setOwnerDocument(node) {
  node.ownerDocument = this;
  switch (node.nodeType) {
    case ELEMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE:
      node.childNodes.forEach(setOwnerDocument, this);
      break;
  }
  return node;
}
var { replace } = "";
var ca = /[<>&\xA0]/g;
var esca = {
  "\xA0": "&#160;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
var pe = (m) => esca[m];
var escape2 = (es) => replace.call(es, ca, pe);
var Text3 = class _Text extends CharacterData {
  constructor(ownerDocument, data2 = "") {
    super(ownerDocument, "#text", TEXT_NODE, data2);
  }
  get wholeText() {
    const text = [];
    let { previousSibling: previousSibling2, nextSibling: nextSibling2 } = this;
    while (previousSibling2) {
      if (previousSibling2.nodeType === TEXT_NODE)
        text.unshift(previousSibling2[VALUE]);
      else
        break;
      previousSibling2 = previousSibling2.previousSibling;
    }
    text.push(this[VALUE]);
    while (nextSibling2) {
      if (nextSibling2.nodeType === TEXT_NODE)
        text.push(nextSibling2[VALUE]);
      else
        break;
      nextSibling2 = nextSibling2.nextSibling;
    }
    return text.join("");
  }
  cloneNode() {
    const { ownerDocument, [VALUE]: data2 } = this;
    return new _Text(ownerDocument, data2);
  }
  toString() {
    return escape2(this[VALUE]);
  }
};
var isNode = (node) => node instanceof Node2;
var insert = (parentNode, child, nodes) => {
  const { ownerDocument } = parentNode;
  for (const node of nodes)
    parentNode.insertBefore(
      isNode(node) ? node : new Text3(ownerDocument, node),
      child
    );
};
var ParentNode = class extends Node2 {
  constructor(ownerDocument, localName, nodeType) {
    super(ownerDocument, localName, nodeType);
    this[PRIVATE] = null;
    this[NEXT] = this[END] = {
      [NEXT]: null,
      [PREV]: this,
      [START]: this,
      nodeType: NODE_END,
      ownerDocument: this.ownerDocument,
      parentNode: null
    };
  }
  get childNodes() {
    const childNodes = new NodeList();
    let { firstChild } = this;
    while (firstChild) {
      childNodes.push(firstChild);
      firstChild = nextSibling(firstChild);
    }
    return childNodes;
  }
  get children() {
    const children = new NodeList();
    let { firstElementChild } = this;
    while (firstElementChild) {
      children.push(firstElementChild);
      firstElementChild = nextElementSibling2(firstElementChild);
    }
    return children;
  }
  /**
   * @returns {NodeStruct | null}
   */
  get firstChild() {
    let { [NEXT]: next, [END]: end } = this;
    while (next.nodeType === ATTRIBUTE_NODE)
      next = next[NEXT];
    return next === end ? null : next;
  }
  /**
   * @returns {NodeStruct | null}
   */
  get firstElementChild() {
    let { firstChild } = this;
    while (firstChild) {
      if (firstChild.nodeType === ELEMENT_NODE)
        return firstChild;
      firstChild = nextSibling(firstChild);
    }
    return null;
  }
  get lastChild() {
    const prev = this[END][PREV];
    switch (prev.nodeType) {
      case NODE_END:
        return prev[START];
      case ATTRIBUTE_NODE:
        return null;
    }
    return prev === this ? null : prev;
  }
  get lastElementChild() {
    let { lastChild } = this;
    while (lastChild) {
      if (lastChild.nodeType === ELEMENT_NODE)
        return lastChild;
      lastChild = previousSibling(lastChild);
    }
    return null;
  }
  get childElementCount() {
    return this.children.length;
  }
  prepend(...nodes) {
    insert(this, this.firstChild, nodes);
  }
  append(...nodes) {
    insert(this, this[END], nodes);
  }
  replaceChildren(...nodes) {
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end && next.nodeType === ATTRIBUTE_NODE)
      next = next[NEXT];
    while (next !== end) {
      const after2 = getEnd(next)[NEXT];
      next.remove();
      next = after2;
    }
    if (nodes.length)
      insert(this, end, nodes);
  }
  getElementsByClassName(className) {
    const elements = new NodeList();
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end) {
      if (next.nodeType === ELEMENT_NODE && next.hasAttribute("class") && next.classList.has(className))
        elements.push(next);
      next = next[NEXT];
    }
    return elements;
  }
  getElementsByTagName(tagName21) {
    const elements = new NodeList();
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end) {
      if (next.nodeType === ELEMENT_NODE && (next.localName === tagName21 || localCase(next) === tagName21))
        elements.push(next);
      next = next[NEXT];
    }
    return elements;
  }
  querySelector(selectors) {
    const matches2 = prepareMatch(this, selectors);
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end) {
      if (next.nodeType === ELEMENT_NODE && matches2(next))
        return next;
      next = next.localName === "template" ? next[END] : next[NEXT];
    }
    return null;
  }
  querySelectorAll(selectors) {
    const matches2 = prepareMatch(this, selectors);
    const elements = new NodeList();
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end) {
      if (next.nodeType === ELEMENT_NODE && matches2(next))
        elements.push(next);
      next = next.localName === "template" ? next[END] : next[NEXT];
    }
    return elements;
  }
  appendChild(node) {
    return this.insertBefore(node, this[END]);
  }
  contains(node) {
    let parentNode = node;
    while (parentNode && parentNode !== this)
      parentNode = parentNode.parentNode;
    return parentNode === this;
  }
  insertBefore(node, before2 = null) {
    if (node === before2)
      return node;
    if (node === this)
      throw new Error("unable to append a node to itself");
    const next = before2 || this[END];
    switch (node.nodeType) {
      case ELEMENT_NODE:
        node.remove();
        node.parentNode = this;
        knownBoundaries(next[PREV], node, next);
        moCallback(node, null);
        connectedCallback(node);
        break;
      case DOCUMENT_FRAGMENT_NODE: {
        let { [PRIVATE]: parentNode, firstChild, lastChild } = node;
        if (firstChild) {
          knownSegment(next[PREV], firstChild, lastChild, next);
          knownAdjacent(node, node[END]);
          if (parentNode)
            parentNode.replaceChildren();
          do {
            firstChild.parentNode = this;
            moCallback(firstChild, null);
            if (firstChild.nodeType === ELEMENT_NODE)
              connectedCallback(firstChild);
          } while (firstChild !== lastChild && (firstChild = nextSibling(firstChild)));
        }
        break;
      }
      case TEXT_NODE:
      case COMMENT_NODE:
        node.remove();
      default:
        node.parentNode = this;
        knownSiblings(next[PREV], node, next);
        moCallback(node, null);
        break;
    }
    return node;
  }
  normalize() {
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end) {
      const { [NEXT]: $next, [PREV]: $prev, nodeType } = next;
      if (nodeType === TEXT_NODE) {
        if (!next[VALUE])
          next.remove();
        else if ($prev && $prev.nodeType === TEXT_NODE) {
          $prev.textContent += next.textContent;
          next.remove();
        }
      }
      next = $next;
    }
  }
  removeChild(node) {
    if (node.parentNode !== this)
      throw new Error("node is not a child");
    node.remove();
    return node;
  }
  replaceChild(node, replaced) {
    const next = getEnd(replaced)[NEXT];
    replaced.remove();
    this.insertBefore(node, next);
    return replaced;
  }
};
var esm_default2 = (camel) => camel.replace(/(([A-Z0-9])([A-Z0-9][a-z]))|(([a-z0-9]+)([A-Z]))/g, "$2$5-$3$6").toLowerCase();
var refs = /* @__PURE__ */ new WeakMap();
var key = (name) => `data-${esm_default2(name)}`;
var prop = (name) => name.slice(5).replace(/-([a-z])/g, (_, $1) => $1.toUpperCase());
var handler = {
  get(dataset, name) {
    if (name in dataset)
      return refs.get(dataset).getAttribute(key(name));
  },
  set(dataset, name, value) {
    dataset[name] = value;
    refs.get(dataset).setAttribute(key(name), value);
    return true;
  },
  deleteProperty(dataset, name) {
    if (name in dataset)
      refs.get(dataset).removeAttribute(key(name));
    return delete dataset[name];
  }
};
var DOMStringMap = class {
  /**
   * @param {Element} ref
   */
  constructor(ref) {
    for (const { name, value } of ref.attributes) {
      if (/^data-/.test(name))
        this[prop(name)] = value;
    }
    refs.set(this, ref);
    return new Proxy(this, handler);
  }
};
setPrototypeOf(DOMStringMap.prototype, null);
var { add } = Set.prototype;
var addTokens = (self, tokens) => {
  for (const token of tokens) {
    if (token)
      add.call(self, token);
  }
};
var update = ({ [OWNER_ELEMENT]: ownerElement, value }) => {
  const attribute2 = ownerElement.getAttributeNode("class");
  if (attribute2)
    attribute2.value = value;
  else
    setAttribute(
      ownerElement,
      new Attr(ownerElement.ownerDocument, "class", value)
    );
};
var DOMTokenList = class extends Set {
  constructor(ownerElement) {
    super();
    this[OWNER_ELEMENT] = ownerElement;
    const attribute2 = ownerElement.getAttributeNode("class");
    if (attribute2)
      addTokens(this, attribute2.value.split(/\s+/));
  }
  get length() {
    return this.size;
  }
  get value() {
    return [...this].join(" ");
  }
  /**
   * @param  {...string} tokens
   */
  add(...tokens) {
    addTokens(this, tokens);
    update(this);
  }
  /**
   * @param {string} token
   */
  contains(token) {
    return this.has(token);
  }
  /**
   * @param  {...string} tokens
   */
  remove(...tokens) {
    for (const token of tokens)
      this.delete(token);
    update(this);
  }
  /**
   * @param {string} token
   * @param {boolean?} force
   */
  toggle(token, force) {
    if (this.has(token)) {
      if (force)
        return true;
      this.delete(token);
      update(this);
    } else if (force || arguments.length === 1) {
      super.add(token);
      update(this);
      return true;
    }
    return false;
  }
  /**
   * @param {string} token
   * @param {string} newToken
   */
  replace(token, newToken) {
    if (this.has(token)) {
      this.delete(token);
      super.add(newToken);
      update(this);
      return true;
    }
    return false;
  }
  /**
   * @param {string} token
   */
  supports() {
    return true;
  }
};
var refs2 = /* @__PURE__ */ new WeakMap();
var getKeys = (style) => [...style.keys()].filter((key2) => key2 !== PRIVATE);
var updateKeys = (style) => {
  const attr = refs2.get(style).getAttributeNode("style");
  if (!attr || attr[CHANGED] || style.get(PRIVATE) !== attr) {
    style.clear();
    if (attr) {
      style.set(PRIVATE, attr);
      for (const rule of attr[VALUE].split(/\s*;\s*/)) {
        let [key2, ...rest] = rule.split(":");
        if (rest.length > 0) {
          key2 = key2.trim();
          const value = rest.join(":").trim();
          if (key2 && value)
            style.set(key2, value);
        }
      }
    }
  }
  return attr;
};
var handler2 = {
  get(style, name) {
    if (name in prototype)
      return style[name];
    updateKeys(style);
    if (name === "length")
      return getKeys(style).length;
    if (/^\d+$/.test(name))
      return getKeys(style)[name];
    return style.get(esm_default2(name));
  },
  set(style, name, value) {
    if (name === "cssText")
      style[name] = value;
    else {
      let attr = updateKeys(style);
      if (value == null)
        style.delete(esm_default2(name));
      else
        style.set(esm_default2(name), value);
      if (!attr) {
        const element = refs2.get(style);
        attr = element.ownerDocument.createAttribute("style");
        element.setAttributeNode(attr);
        style.set(PRIVATE, attr);
      }
      attr[CHANGED] = false;
      attr[VALUE] = style.toString();
    }
    return true;
  }
};
var CSSStyleDeclaration = class extends Map {
  constructor(element) {
    super();
    refs2.set(this, element);
    return new Proxy(this, handler2);
  }
  get cssText() {
    return this.toString();
  }
  set cssText(value) {
    refs2.get(this).setAttribute("style", value);
  }
  getPropertyValue(name) {
    const self = this[PRIVATE];
    return handler2.get(self, name);
  }
  setProperty(name, value) {
    const self = this[PRIVATE];
    handler2.set(self, name, value);
  }
  removeProperty(name) {
    const self = this[PRIVATE];
    handler2.set(self, name, null);
  }
  [Symbol.iterator]() {
    const self = this[PRIVATE];
    updateKeys(self);
    const keys2 = getKeys(self);
    const { length } = keys2;
    let i = 0;
    return {
      next() {
        const done = i === length;
        return { done, value: done ? null : keys2[i++] };
      }
    };
  }
  get [PRIVATE]() {
    return this;
  }
  toString() {
    const self = this[PRIVATE];
    updateKeys(self);
    const cssText = [];
    self.forEach(push, cssText);
    return cssText.join(";");
  }
};
var { prototype } = CSSStyleDeclaration;
function push(value, key2) {
  if (key2 !== PRIVATE)
    this.push(`${key2}:${value}`);
}
var BUBBLING_PHASE = 3;
var AT_TARGET = 2;
var CAPTURING_PHASE = 1;
var NONE = 0;
var GlobalEvent = class {
  static get BUBBLING_PHASE() {
    return BUBBLING_PHASE;
  }
  static get AT_TARGET() {
    return AT_TARGET;
  }
  static get CAPTURING_PHASE() {
    return CAPTURING_PHASE;
  }
  static get NONE() {
    return NONE;
  }
  constructor(type, eventInitDict = {}) {
    this.type = type;
    this.bubbles = !!eventInitDict.bubbles;
    this.cancelBubble = false;
    this._stopImmediatePropagationFlag = false;
    this.cancelable = !!eventInitDict.cancelable;
    this.eventPhase = this.NONE;
    this.timeStamp = Date.now();
    this.defaultPrevented = false;
    this.originalTarget = null;
    this.returnValue = null;
    this.srcElement = null;
    this.target = null;
    this._path = [];
  }
  get BUBBLING_PHASE() {
    return BUBBLING_PHASE;
  }
  get AT_TARGET() {
    return AT_TARGET;
  }
  get CAPTURING_PHASE() {
    return CAPTURING_PHASE;
  }
  get NONE() {
    return NONE;
  }
  preventDefault() {
    this.defaultPrevented = true;
  }
  // simplified implementation, should be https://dom.spec.whatwg.org/#dom-event-composedpath
  composedPath() {
    return this._path;
  }
  stopPropagation() {
    this.cancelBubble = true;
  }
  stopImmediatePropagation() {
    this.stopPropagation();
    this._stopImmediatePropagationFlag = true;
  }
};
var NamedNodeMap = class extends Array {
  constructor(ownerElement) {
    super();
    this.ownerElement = ownerElement;
  }
  getNamedItem(name) {
    return this.ownerElement.getAttributeNode(name);
  }
  setNamedItem(attr) {
    this.ownerElement.setAttributeNode(attr);
    this.unshift(attr);
  }
  removeNamedItem(name) {
    const item = this.getNamedItem(name);
    this.ownerElement.removeAttribute(name);
    this.splice(this.indexOf(item), 1);
  }
  item(index) {
    return index < this.length ? this[index] : null;
  }
  /* c8 ignore start */
  getNamedItemNS(_, name) {
    return this.getNamedItem(name);
  }
  setNamedItemNS(_, attr) {
    return this.setNamedItem(attr);
  }
  removeNamedItemNS(_, name) {
    return this.removeNamedItem(name);
  }
  /* c8 ignore stop */
};
var NonElementParentNode = class extends ParentNode {
  getElementById(id) {
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end) {
      if (next.nodeType === ELEMENT_NODE && next.id === id)
        return next;
      next = next[NEXT];
    }
    return null;
  }
  cloneNode(deep) {
    const { ownerDocument, constructor } = this;
    const nonEPN = new constructor(ownerDocument);
    if (deep) {
      const { [END]: end } = nonEPN;
      for (const node of this.childNodes)
        nonEPN.insertBefore(node.cloneNode(deep), end);
    }
    return nonEPN;
  }
  toString() {
    const { childNodes, localName } = this;
    return `<${localName}>${childNodes.join("")}</${localName}>`;
  }
  toJSON() {
    const json = [];
    nonElementAsJSON(this, json);
    return json;
  }
};
var ShadowRoot = class extends NonElementParentNode {
  constructor(host) {
    super(host.ownerDocument, "#shadow-root", DOCUMENT_FRAGMENT_NODE);
    this.host = host;
  }
  get innerHTML() {
    return getInnerHtml(this);
  }
  set innerHTML(html) {
    setInnerHtml(this, html);
  }
};
var attributesHandler = {
  get(target, key2) {
    return key2 in target ? target[key2] : target.find(({ name }) => name === key2);
  }
};
var create2 = (ownerDocument, element, localName) => {
  if ("ownerSVGElement" in element) {
    const svg = ownerDocument.createElementNS(SVG_NAMESPACE, localName);
    svg.ownerSVGElement = element.ownerSVGElement;
    return svg;
  }
  return ownerDocument.createElement(localName);
};
var isVoid = ({ localName, ownerDocument }) => {
  return ownerDocument[MIME].voidElements.test(localName);
};
var Element2 = class extends ParentNode {
  constructor(ownerDocument, localName) {
    super(ownerDocument, localName, ELEMENT_NODE);
    this[CLASS_LIST] = null;
    this[DATASET] = null;
    this[STYLE] = null;
  }
  // <Mixins>
  get isConnected() {
    return isConnected(this);
  }
  get parentElement() {
    return parentElement(this);
  }
  get previousSibling() {
    return previousSibling(this);
  }
  get nextSibling() {
    return nextSibling(this);
  }
  get namespaceURI() {
    return "http://www.w3.org/1999/xhtml";
  }
  get previousElementSibling() {
    return previousElementSibling(this);
  }
  get nextElementSibling() {
    return nextElementSibling2(this);
  }
  before(...nodes) {
    before(this, nodes);
  }
  after(...nodes) {
    after(this, nodes);
  }
  replaceWith(...nodes) {
    replaceWith(this, nodes);
  }
  remove() {
    remove(this[PREV], this, this[END][NEXT]);
  }
  // </Mixins>
  // <specialGetters>
  get id() {
    return stringAttribute.get(this, "id");
  }
  set id(value) {
    stringAttribute.set(this, "id", value);
  }
  get className() {
    return this.classList.value;
  }
  set className(value) {
    const { classList } = this;
    classList.clear();
    classList.add(...$String(value).split(/\s+/));
  }
  get nodeName() {
    return localCase(this);
  }
  get tagName() {
    return localCase(this);
  }
  get classList() {
    return this[CLASS_LIST] || (this[CLASS_LIST] = new DOMTokenList(this));
  }
  get dataset() {
    return this[DATASET] || (this[DATASET] = new DOMStringMap(this));
  }
  get nonce() {
    return stringAttribute.get(this, "nonce");
  }
  set nonce(value) {
    stringAttribute.set(this, "nonce", value);
  }
  get style() {
    return this[STYLE] || (this[STYLE] = new CSSStyleDeclaration(this));
  }
  get tabIndex() {
    return numericAttribute.get(this, "tabindex") || -1;
  }
  set tabIndex(value) {
    numericAttribute.set(this, "tabindex", value);
  }
  get slot() {
    return stringAttribute.get(this, "slot");
  }
  set slot(value) {
    stringAttribute.set(this, "slot", value);
  }
  // </specialGetters>
  // <contentRelated>
  get innerText() {
    const text = [];
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end) {
      if (next.nodeType === TEXT_NODE) {
        text.push(next.textContent.replace(/\s+/g, " "));
      } else if (text.length && next[NEXT] != end && BLOCK_ELEMENTS.has(next.tagName)) {
        text.push("\n");
      }
      next = next[NEXT];
    }
    return text.join("");
  }
  /**
   * @returns {String}
   */
  get textContent() {
    const text = [];
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end) {
      if (next.nodeType === TEXT_NODE)
        text.push(next.textContent);
      next = next[NEXT];
    }
    return text.join("");
  }
  set textContent(text) {
    this.replaceChildren();
    if (text != null)
      this.appendChild(new Text3(this.ownerDocument, text));
  }
  get innerHTML() {
    return getInnerHtml(this);
  }
  set innerHTML(html) {
    setInnerHtml(this, html);
  }
  get outerHTML() {
    return this.toString();
  }
  set outerHTML(html) {
    const template11 = this.ownerDocument.createElement("");
    template11.innerHTML = html;
    this.replaceWith(...template11.childNodes);
  }
  // </contentRelated>
  // <attributes>
  get attributes() {
    const attributes2 = new NamedNodeMap(this);
    let next = this[NEXT];
    while (next.nodeType === ATTRIBUTE_NODE) {
      attributes2.push(next);
      next = next[NEXT];
    }
    return new Proxy(attributes2, attributesHandler);
  }
  focus() {
    this.dispatchEvent(new GlobalEvent("focus"));
  }
  getAttribute(name) {
    if (name === "class")
      return this.className;
    const attribute2 = this.getAttributeNode(name);
    return attribute2 && attribute2.value;
  }
  getAttributeNode(name) {
    let next = this[NEXT];
    while (next.nodeType === ATTRIBUTE_NODE) {
      if (next.name === name)
        return next;
      next = next[NEXT];
    }
    return null;
  }
  getAttributeNames() {
    const attributes2 = new NodeList();
    let next = this[NEXT];
    while (next.nodeType === ATTRIBUTE_NODE) {
      attributes2.push(next.name);
      next = next[NEXT];
    }
    return attributes2;
  }
  hasAttribute(name) {
    return !!this.getAttributeNode(name);
  }
  hasAttributes() {
    return this[NEXT].nodeType === ATTRIBUTE_NODE;
  }
  removeAttribute(name) {
    if (name === "class" && this[CLASS_LIST])
      this[CLASS_LIST].clear();
    let next = this[NEXT];
    while (next.nodeType === ATTRIBUTE_NODE) {
      if (next.name === name) {
        removeAttribute(this, next);
        return;
      }
      next = next[NEXT];
    }
  }
  removeAttributeNode(attribute2) {
    let next = this[NEXT];
    while (next.nodeType === ATTRIBUTE_NODE) {
      if (next === attribute2) {
        removeAttribute(this, next);
        return;
      }
      next = next[NEXT];
    }
  }
  setAttribute(name, value) {
    if (name === "class")
      this.className = value;
    else {
      const attribute2 = this.getAttributeNode(name);
      if (attribute2)
        attribute2.value = value;
      else
        setAttribute(this, new Attr(this.ownerDocument, name, value));
    }
  }
  setAttributeNode(attribute2) {
    const { name } = attribute2;
    const previously = this.getAttributeNode(name);
    if (previously !== attribute2) {
      if (previously)
        this.removeAttributeNode(previously);
      const { ownerElement } = attribute2;
      if (ownerElement)
        ownerElement.removeAttributeNode(attribute2);
      setAttribute(this, attribute2);
    }
    return previously;
  }
  toggleAttribute(name, force) {
    if (this.hasAttribute(name)) {
      if (!force) {
        this.removeAttribute(name);
        return false;
      }
      return true;
    } else if (force || arguments.length === 1) {
      this.setAttribute(name, "");
      return true;
    }
    return false;
  }
  // </attributes>
  // <ShadowDOM>
  get shadowRoot() {
    if (shadowRoots.has(this)) {
      const { mode, shadowRoot } = shadowRoots.get(this);
      if (mode === "open")
        return shadowRoot;
    }
    return null;
  }
  attachShadow(init) {
    if (shadowRoots.has(this))
      throw new Error("operation not supported");
    const shadowRoot = new ShadowRoot(this);
    shadowRoots.set(this, {
      mode: init.mode,
      shadowRoot
    });
    return shadowRoot;
  }
  // </ShadowDOM>
  // <selectors>
  matches(selectors) {
    return matches(this, selectors);
  }
  closest(selectors) {
    let parentElement2 = this;
    const matches2 = prepareMatch(parentElement2, selectors);
    while (parentElement2 && !matches2(parentElement2))
      parentElement2 = parentElement2.parentElement;
    return parentElement2;
  }
  // </selectors>
  // <insertAdjacent>
  insertAdjacentElement(position, element) {
    const { parentElement: parentElement2 } = this;
    switch (position) {
      case "beforebegin":
        if (parentElement2) {
          parentElement2.insertBefore(element, this);
          break;
        }
        return null;
      case "afterbegin":
        this.insertBefore(element, this.firstChild);
        break;
      case "beforeend":
        this.insertBefore(element, null);
        break;
      case "afterend":
        if (parentElement2) {
          parentElement2.insertBefore(element, this.nextSibling);
          break;
        }
        return null;
    }
    return element;
  }
  insertAdjacentHTML(position, html) {
    const template11 = this.ownerDocument.createElement("template");
    template11.innerHTML = html;
    this.insertAdjacentElement(position, template11.content);
  }
  insertAdjacentText(position, text) {
    const node = this.ownerDocument.createTextNode(text);
    this.insertAdjacentElement(position, node);
  }
  // </insertAdjacent>
  cloneNode(deep = false) {
    const { ownerDocument, localName } = this;
    const addNext = (next2) => {
      next2.parentNode = parentNode;
      knownAdjacent($next, next2);
      $next = next2;
    };
    const clone = create2(ownerDocument, this, localName);
    let parentNode = clone, $next = clone;
    let { [NEXT]: next, [END]: prev } = this;
    while (next !== prev && (deep || next.nodeType === ATTRIBUTE_NODE)) {
      switch (next.nodeType) {
        case NODE_END:
          knownAdjacent($next, parentNode[END]);
          $next = parentNode[END];
          parentNode = parentNode.parentNode;
          break;
        case ELEMENT_NODE: {
          const node = create2(ownerDocument, next, next.localName);
          addNext(node);
          parentNode = node;
          break;
        }
        case ATTRIBUTE_NODE: {
          const attr = next.cloneNode(deep);
          attr.ownerElement = parentNode;
          addNext(attr);
          break;
        }
        case TEXT_NODE:
        case COMMENT_NODE:
          addNext(next.cloneNode(deep));
          break;
      }
      next = next[NEXT];
    }
    knownAdjacent($next, clone[END]);
    return clone;
  }
  // <custom>
  toString() {
    const out = [];
    const { [END]: end } = this;
    let next = { [NEXT]: this };
    let isOpened = false;
    do {
      next = next[NEXT];
      switch (next.nodeType) {
        case ATTRIBUTE_NODE: {
          const attr = " " + next;
          switch (attr) {
            case " id":
            case " class":
            case " style":
              break;
            default:
              out.push(attr);
          }
          break;
        }
        case NODE_END: {
          const start = next[START];
          if (isOpened) {
            if ("ownerSVGElement" in start)
              out.push(" />");
            else if (isVoid(start))
              out.push(ignoreCase(start) ? ">" : " />");
            else
              out.push(`></${start.localName}>`);
            isOpened = false;
          } else
            out.push(`</${start.localName}>`);
          break;
        }
        case ELEMENT_NODE:
          if (isOpened)
            out.push(">");
          if (next.toString !== this.toString) {
            out.push(next.toString());
            next = next[END];
            isOpened = false;
          } else {
            out.push(`<${next.localName}`);
            isOpened = true;
          }
          break;
        case TEXT_NODE:
        case COMMENT_NODE:
          out.push((isOpened ? ">" : "") + next);
          isOpened = false;
          break;
      }
    } while (next !== end);
    return out.join("");
  }
  toJSON() {
    const json = [];
    elementAsJSON(this, json);
    return json;
  }
  // </custom>
  /* c8 ignore start */
  getAttributeNS(_, name) {
    return this.getAttribute(name);
  }
  getElementsByTagNameNS(_, name) {
    return this.getElementsByTagName(name);
  }
  hasAttributeNS(_, name) {
    return this.hasAttribute(name);
  }
  removeAttributeNS(_, name) {
    this.removeAttribute(name);
  }
  setAttributeNS(_, name, value) {
    this.setAttribute(name, value);
  }
  setAttributeNodeNS(attr) {
    return this.setAttributeNode(attr);
  }
  /* c8 ignore stop */
};
var classNames = /* @__PURE__ */ new WeakMap();
var handler3 = {
  get(target, name) {
    return target[name];
  },
  set(target, name, value) {
    target[name] = value;
    return true;
  }
};
var SVGElement = class extends Element2 {
  constructor(ownerDocument, localName, ownerSVGElement = null) {
    super(ownerDocument, localName);
    this.ownerSVGElement = ownerSVGElement;
  }
  get className() {
    if (!classNames.has(this))
      classNames.set(this, new Proxy({ baseVal: "", animVal: "" }, handler3));
    return classNames.get(this);
  }
  /* c8 ignore start */
  set className(value) {
    const { classList } = this;
    classList.clear();
    classList.add(...$String(value).split(/\s+/));
  }
  /* c8 ignore stop */
  get namespaceURI() {
    return "http://www.w3.org/2000/svg";
  }
  getAttribute(name) {
    return name === "class" ? [...this.classList].join(" ") : super.getAttribute(name);
  }
  setAttribute(name, value) {
    if (name === "class")
      this.className = value;
    else if (name === "style") {
      const { className } = this;
      className.baseVal = className.animVal = value;
    }
    super.setAttribute(name, value);
  }
};
var illegalConstructor = () => {
  throw new TypeError("Illegal constructor");
};
function Attr2() {
  illegalConstructor();
}
setPrototypeOf(Attr2, Attr);
Attr2.prototype = Attr.prototype;
function CharacterData2() {
  illegalConstructor();
}
setPrototypeOf(CharacterData2, CharacterData);
CharacterData2.prototype = CharacterData.prototype;
function Comment4() {
  illegalConstructor();
}
setPrototypeOf(Comment4, Comment3);
Comment4.prototype = Comment3.prototype;
function DocumentType2() {
  illegalConstructor();
}
setPrototypeOf(DocumentType2, DocumentType);
DocumentType2.prototype = DocumentType.prototype;
function Element3() {
  illegalConstructor();
}
setPrototypeOf(Element3, Element2);
Element3.prototype = Element2.prototype;
function Node3() {
  illegalConstructor();
}
setPrototypeOf(Node3, Node2);
Node3.prototype = Node2.prototype;
function ShadowRoot2() {
  illegalConstructor();
}
setPrototypeOf(ShadowRoot2, ShadowRoot);
ShadowRoot2.prototype = ShadowRoot.prototype;
function Text4() {
  illegalConstructor();
}
setPrototypeOf(Text4, Text3);
Text4.prototype = Text3.prototype;
function SVGElement2() {
  illegalConstructor();
}
setPrototypeOf(SVGElement2, SVGElement);
SVGElement2.prototype = SVGElement.prototype;
var Facades = {
  Attr: Attr2,
  CharacterData: CharacterData2,
  Comment: Comment4,
  DocumentType: DocumentType2,
  Element: Element3,
  Node: Node3,
  ShadowRoot: ShadowRoot2,
  Text: Text4,
  SVGElement: SVGElement2
};
var Level0 = /* @__PURE__ */ new WeakMap();
var level0 = {
  get(element, name) {
    return Level0.has(element) && Level0.get(element)[name] || null;
  },
  set(element, name, value) {
    if (!Level0.has(element))
      Level0.set(element, {});
    const handlers = Level0.get(element);
    const type = name.slice(2);
    if (handlers[name])
      element.removeEventListener(type, handlers[name], false);
    if (handlers[name] = value)
      element.addEventListener(type, value, false);
  }
};
var HTMLElement = class extends Element2 {
  static get observedAttributes() {
    return [];
  }
  constructor(ownerDocument = null, localName = "") {
    super(ownerDocument, localName);
    const ownerLess = !ownerDocument;
    let options;
    if (ownerLess) {
      const { constructor: Class } = this;
      if (!Classes.has(Class))
        throw new Error("unable to initialize this Custom Element");
      ({ ownerDocument, localName, options } = Classes.get(Class));
    }
    if (ownerDocument[UPGRADE]) {
      const { element, values } = ownerDocument[UPGRADE];
      ownerDocument[UPGRADE] = null;
      for (const [key2, value] of values)
        element[key2] = value;
      return element;
    }
    if (ownerLess) {
      this.ownerDocument = this[END].ownerDocument = ownerDocument;
      this.localName = localName;
      customElements.set(this, { connected: false });
      if (options.is)
        this.setAttribute("is", options.is);
    }
  }
  /* c8 ignore start */
  /* TODO: what about these?
  offsetHeight
  offsetLeft
  offsetParent
  offsetTop
  offsetWidth
  */
  blur() {
    this.dispatchEvent(new GlobalEvent("blur"));
  }
  click() {
    this.dispatchEvent(new GlobalEvent("click"));
  }
  // Boolean getters
  get accessKeyLabel() {
    const { accessKey } = this;
    return accessKey && `Alt+Shift+${accessKey}`;
  }
  get isContentEditable() {
    return this.hasAttribute("contenteditable");
  }
  // Boolean Accessors
  get contentEditable() {
    return booleanAttribute.get(this, "contenteditable");
  }
  set contentEditable(value) {
    booleanAttribute.set(this, "contenteditable", value);
  }
  get draggable() {
    return booleanAttribute.get(this, "draggable");
  }
  set draggable(value) {
    booleanAttribute.set(this, "draggable", value);
  }
  get hidden() {
    return booleanAttribute.get(this, "hidden");
  }
  set hidden(value) {
    booleanAttribute.set(this, "hidden", value);
  }
  get spellcheck() {
    return booleanAttribute.get(this, "spellcheck");
  }
  set spellcheck(value) {
    booleanAttribute.set(this, "spellcheck", value);
  }
  // String Accessors
  get accessKey() {
    return stringAttribute.get(this, "accesskey");
  }
  set accessKey(value) {
    stringAttribute.set(this, "accesskey", value);
  }
  get dir() {
    return stringAttribute.get(this, "dir");
  }
  set dir(value) {
    stringAttribute.set(this, "dir", value);
  }
  get lang() {
    return stringAttribute.get(this, "lang");
  }
  set lang(value) {
    stringAttribute.set(this, "lang", value);
  }
  get title() {
    return stringAttribute.get(this, "title");
  }
  set title(value) {
    stringAttribute.set(this, "title", value);
  }
  // DOM Level 0
  get onabort() {
    return level0.get(this, "onabort");
  }
  set onabort(value) {
    level0.set(this, "onabort", value);
  }
  get onblur() {
    return level0.get(this, "onblur");
  }
  set onblur(value) {
    level0.set(this, "onblur", value);
  }
  get oncancel() {
    return level0.get(this, "oncancel");
  }
  set oncancel(value) {
    level0.set(this, "oncancel", value);
  }
  get oncanplay() {
    return level0.get(this, "oncanplay");
  }
  set oncanplay(value) {
    level0.set(this, "oncanplay", value);
  }
  get oncanplaythrough() {
    return level0.get(this, "oncanplaythrough");
  }
  set oncanplaythrough(value) {
    level0.set(this, "oncanplaythrough", value);
  }
  get onchange() {
    return level0.get(this, "onchange");
  }
  set onchange(value) {
    level0.set(this, "onchange", value);
  }
  get onclick() {
    return level0.get(this, "onclick");
  }
  set onclick(value) {
    level0.set(this, "onclick", value);
  }
  get onclose() {
    return level0.get(this, "onclose");
  }
  set onclose(value) {
    level0.set(this, "onclose", value);
  }
  get oncontextmenu() {
    return level0.get(this, "oncontextmenu");
  }
  set oncontextmenu(value) {
    level0.set(this, "oncontextmenu", value);
  }
  get oncuechange() {
    return level0.get(this, "oncuechange");
  }
  set oncuechange(value) {
    level0.set(this, "oncuechange", value);
  }
  get ondblclick() {
    return level0.get(this, "ondblclick");
  }
  set ondblclick(value) {
    level0.set(this, "ondblclick", value);
  }
  get ondrag() {
    return level0.get(this, "ondrag");
  }
  set ondrag(value) {
    level0.set(this, "ondrag", value);
  }
  get ondragend() {
    return level0.get(this, "ondragend");
  }
  set ondragend(value) {
    level0.set(this, "ondragend", value);
  }
  get ondragenter() {
    return level0.get(this, "ondragenter");
  }
  set ondragenter(value) {
    level0.set(this, "ondragenter", value);
  }
  get ondragleave() {
    return level0.get(this, "ondragleave");
  }
  set ondragleave(value) {
    level0.set(this, "ondragleave", value);
  }
  get ondragover() {
    return level0.get(this, "ondragover");
  }
  set ondragover(value) {
    level0.set(this, "ondragover", value);
  }
  get ondragstart() {
    return level0.get(this, "ondragstart");
  }
  set ondragstart(value) {
    level0.set(this, "ondragstart", value);
  }
  get ondrop() {
    return level0.get(this, "ondrop");
  }
  set ondrop(value) {
    level0.set(this, "ondrop", value);
  }
  get ondurationchange() {
    return level0.get(this, "ondurationchange");
  }
  set ondurationchange(value) {
    level0.set(this, "ondurationchange", value);
  }
  get onemptied() {
    return level0.get(this, "onemptied");
  }
  set onemptied(value) {
    level0.set(this, "onemptied", value);
  }
  get onended() {
    return level0.get(this, "onended");
  }
  set onended(value) {
    level0.set(this, "onended", value);
  }
  get onerror() {
    return level0.get(this, "onerror");
  }
  set onerror(value) {
    level0.set(this, "onerror", value);
  }
  get onfocus() {
    return level0.get(this, "onfocus");
  }
  set onfocus(value) {
    level0.set(this, "onfocus", value);
  }
  get oninput() {
    return level0.get(this, "oninput");
  }
  set oninput(value) {
    level0.set(this, "oninput", value);
  }
  get oninvalid() {
    return level0.get(this, "oninvalid");
  }
  set oninvalid(value) {
    level0.set(this, "oninvalid", value);
  }
  get onkeydown() {
    return level0.get(this, "onkeydown");
  }
  set onkeydown(value) {
    level0.set(this, "onkeydown", value);
  }
  get onkeypress() {
    return level0.get(this, "onkeypress");
  }
  set onkeypress(value) {
    level0.set(this, "onkeypress", value);
  }
  get onkeyup() {
    return level0.get(this, "onkeyup");
  }
  set onkeyup(value) {
    level0.set(this, "onkeyup", value);
  }
  get onload() {
    return level0.get(this, "onload");
  }
  set onload(value) {
    level0.set(this, "onload", value);
  }
  get onloadeddata() {
    return level0.get(this, "onloadeddata");
  }
  set onloadeddata(value) {
    level0.set(this, "onloadeddata", value);
  }
  get onloadedmetadata() {
    return level0.get(this, "onloadedmetadata");
  }
  set onloadedmetadata(value) {
    level0.set(this, "onloadedmetadata", value);
  }
  get onloadstart() {
    return level0.get(this, "onloadstart");
  }
  set onloadstart(value) {
    level0.set(this, "onloadstart", value);
  }
  get onmousedown() {
    return level0.get(this, "onmousedown");
  }
  set onmousedown(value) {
    level0.set(this, "onmousedown", value);
  }
  get onmouseenter() {
    return level0.get(this, "onmouseenter");
  }
  set onmouseenter(value) {
    level0.set(this, "onmouseenter", value);
  }
  get onmouseleave() {
    return level0.get(this, "onmouseleave");
  }
  set onmouseleave(value) {
    level0.set(this, "onmouseleave", value);
  }
  get onmousemove() {
    return level0.get(this, "onmousemove");
  }
  set onmousemove(value) {
    level0.set(this, "onmousemove", value);
  }
  get onmouseout() {
    return level0.get(this, "onmouseout");
  }
  set onmouseout(value) {
    level0.set(this, "onmouseout", value);
  }
  get onmouseover() {
    return level0.get(this, "onmouseover");
  }
  set onmouseover(value) {
    level0.set(this, "onmouseover", value);
  }
  get onmouseup() {
    return level0.get(this, "onmouseup");
  }
  set onmouseup(value) {
    level0.set(this, "onmouseup", value);
  }
  get onmousewheel() {
    return level0.get(this, "onmousewheel");
  }
  set onmousewheel(value) {
    level0.set(this, "onmousewheel", value);
  }
  get onpause() {
    return level0.get(this, "onpause");
  }
  set onpause(value) {
    level0.set(this, "onpause", value);
  }
  get onplay() {
    return level0.get(this, "onplay");
  }
  set onplay(value) {
    level0.set(this, "onplay", value);
  }
  get onplaying() {
    return level0.get(this, "onplaying");
  }
  set onplaying(value) {
    level0.set(this, "onplaying", value);
  }
  get onprogress() {
    return level0.get(this, "onprogress");
  }
  set onprogress(value) {
    level0.set(this, "onprogress", value);
  }
  get onratechange() {
    return level0.get(this, "onratechange");
  }
  set onratechange(value) {
    level0.set(this, "onratechange", value);
  }
  get onreset() {
    return level0.get(this, "onreset");
  }
  set onreset(value) {
    level0.set(this, "onreset", value);
  }
  get onresize() {
    return level0.get(this, "onresize");
  }
  set onresize(value) {
    level0.set(this, "onresize", value);
  }
  get onscroll() {
    return level0.get(this, "onscroll");
  }
  set onscroll(value) {
    level0.set(this, "onscroll", value);
  }
  get onseeked() {
    return level0.get(this, "onseeked");
  }
  set onseeked(value) {
    level0.set(this, "onseeked", value);
  }
  get onseeking() {
    return level0.get(this, "onseeking");
  }
  set onseeking(value) {
    level0.set(this, "onseeking", value);
  }
  get onselect() {
    return level0.get(this, "onselect");
  }
  set onselect(value) {
    level0.set(this, "onselect", value);
  }
  get onshow() {
    return level0.get(this, "onshow");
  }
  set onshow(value) {
    level0.set(this, "onshow", value);
  }
  get onstalled() {
    return level0.get(this, "onstalled");
  }
  set onstalled(value) {
    level0.set(this, "onstalled", value);
  }
  get onsubmit() {
    return level0.get(this, "onsubmit");
  }
  set onsubmit(value) {
    level0.set(this, "onsubmit", value);
  }
  get onsuspend() {
    return level0.get(this, "onsuspend");
  }
  set onsuspend(value) {
    level0.set(this, "onsuspend", value);
  }
  get ontimeupdate() {
    return level0.get(this, "ontimeupdate");
  }
  set ontimeupdate(value) {
    level0.set(this, "ontimeupdate", value);
  }
  get ontoggle() {
    return level0.get(this, "ontoggle");
  }
  set ontoggle(value) {
    level0.set(this, "ontoggle", value);
  }
  get onvolumechange() {
    return level0.get(this, "onvolumechange");
  }
  set onvolumechange(value) {
    level0.set(this, "onvolumechange", value);
  }
  get onwaiting() {
    return level0.get(this, "onwaiting");
  }
  set onwaiting(value) {
    level0.set(this, "onwaiting", value);
  }
  get onauxclick() {
    return level0.get(this, "onauxclick");
  }
  set onauxclick(value) {
    level0.set(this, "onauxclick", value);
  }
  get ongotpointercapture() {
    return level0.get(this, "ongotpointercapture");
  }
  set ongotpointercapture(value) {
    level0.set(this, "ongotpointercapture", value);
  }
  get onlostpointercapture() {
    return level0.get(this, "onlostpointercapture");
  }
  set onlostpointercapture(value) {
    level0.set(this, "onlostpointercapture", value);
  }
  get onpointercancel() {
    return level0.get(this, "onpointercancel");
  }
  set onpointercancel(value) {
    level0.set(this, "onpointercancel", value);
  }
  get onpointerdown() {
    return level0.get(this, "onpointerdown");
  }
  set onpointerdown(value) {
    level0.set(this, "onpointerdown", value);
  }
  get onpointerenter() {
    return level0.get(this, "onpointerenter");
  }
  set onpointerenter(value) {
    level0.set(this, "onpointerenter", value);
  }
  get onpointerleave() {
    return level0.get(this, "onpointerleave");
  }
  set onpointerleave(value) {
    level0.set(this, "onpointerleave", value);
  }
  get onpointermove() {
    return level0.get(this, "onpointermove");
  }
  set onpointermove(value) {
    level0.set(this, "onpointermove", value);
  }
  get onpointerout() {
    return level0.get(this, "onpointerout");
  }
  set onpointerout(value) {
    level0.set(this, "onpointerout", value);
  }
  get onpointerover() {
    return level0.get(this, "onpointerover");
  }
  set onpointerover(value) {
    level0.set(this, "onpointerover", value);
  }
  get onpointerup() {
    return level0.get(this, "onpointerup");
  }
  set onpointerup(value) {
    level0.set(this, "onpointerup", value);
  }
  /* c8 ignore stop */
};
var tagName = "template";
var HTMLTemplateElement2 = class extends HTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, tagName);
    const content = this.ownerDocument.createDocumentFragment();
    (this[CONTENT] = content)[PRIVATE] = this;
  }
  get content() {
    if (this.hasChildNodes() && !this[CONTENT].hasChildNodes()) {
      for (const node of this.childNodes)
        this[CONTENT].appendChild(node.cloneNode(true));
    }
    return this[CONTENT];
  }
};
registerHTMLClass(tagName, HTMLTemplateElement2);
var HTMLHtmlElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "html") {
    super(ownerDocument, localName);
  }
};
var { toString } = HTMLElement.prototype;
var TextElement = class extends HTMLElement {
  get innerHTML() {
    return this.textContent;
  }
  set innerHTML(html) {
    this.textContent = html;
  }
  toString() {
    const outerHTML = toString.call(this.cloneNode());
    return outerHTML.replace(/></, `>${this.textContent}<`);
  }
};
var tagName2 = "script";
var HTMLScriptElement = class extends TextElement {
  constructor(ownerDocument, localName = tagName2) {
    super(ownerDocument, localName);
  }
  get type() {
    return stringAttribute.get(this, "type");
  }
  set type(value) {
    stringAttribute.set(this, "type", value);
  }
  get src() {
    return stringAttribute.get(this, "src");
  }
  set src(value) {
    stringAttribute.set(this, "src", value);
  }
  get defer() {
    return booleanAttribute.get(this, "defer");
  }
  set defer(value) {
    booleanAttribute.set(this, "defer", value);
  }
  get crossOrigin() {
    return stringAttribute.get(this, "crossorigin");
  }
  set crossOrigin(value) {
    stringAttribute.set(this, "crossorigin", value);
  }
  get nomodule() {
    return booleanAttribute.get(this, "nomodule");
  }
  set nomodule(value) {
    booleanAttribute.set(this, "nomodule", value);
  }
  get referrerPolicy() {
    return stringAttribute.get(this, "referrerpolicy");
  }
  set referrerPolicy(value) {
    stringAttribute.set(this, "referrerpolicy", value);
  }
  get nonce() {
    return stringAttribute.get(this, "nonce");
  }
  set nonce(value) {
    stringAttribute.set(this, "nonce", value);
  }
  get async() {
    return booleanAttribute.get(this, "async");
  }
  set async(value) {
    booleanAttribute.set(this, "async", value);
  }
  get text() {
    return this.textContent;
  }
  set text(content) {
    this.textContent = content;
  }
};
registerHTMLClass(tagName2, HTMLScriptElement);
var HTMLFrameElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "frame") {
    super(ownerDocument, localName);
  }
};
var tagName3 = "iframe";
var HTMLIFrameElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName3) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get src() {
    return stringAttribute.get(this, "src");
  }
  set src(value) {
    stringAttribute.set(this, "src", value);
  }
  get srcdoc() {
    return stringAttribute.get(this, "srcdoc");
  }
  set srcdoc(value) {
    stringAttribute.set(this, "srcdoc", value);
  }
  get name() {
    return stringAttribute.get(this, "name");
  }
  set name(value) {
    stringAttribute.set(this, "name", value);
  }
  get allow() {
    return stringAttribute.get(this, "allow");
  }
  set allow(value) {
    stringAttribute.set(this, "allow", value);
  }
  get allowFullscreen() {
    return booleanAttribute.get(this, "allowfullscreen");
  }
  set allowFullscreen(value) {
    booleanAttribute.set(this, "allowfullscreen", value);
  }
  get referrerPolicy() {
    return stringAttribute.get(this, "referrerpolicy");
  }
  set referrerPolicy(value) {
    stringAttribute.set(this, "referrerpolicy", value);
  }
  get loading() {
    return stringAttribute.get(this, "loading");
  }
  set loading(value) {
    stringAttribute.set(this, "loading", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName3, HTMLIFrameElement);
var HTMLObjectElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "object") {
    super(ownerDocument, localName);
  }
};
var HTMLHeadElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "head") {
    super(ownerDocument, localName);
  }
};
var HTMLBodyElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "body") {
    super(ownerDocument, localName);
  }
};
var import_cssom = __toESM(require_lib(), 1);
var tagName4 = "style";
var HTMLStyleElement = class extends TextElement {
  constructor(ownerDocument, localName = tagName4) {
    super(ownerDocument, localName);
    this[SHEET] = null;
  }
  get sheet() {
    const sheet = this[SHEET];
    if (sheet !== null) {
      return sheet;
    }
    return this[SHEET] = (0, import_cssom.parse)(this.textContent);
  }
  get innerHTML() {
    return super.innerHTML || "";
  }
  set innerHTML(value) {
    super.textContent = value;
    this[SHEET] = null;
  }
  get innerText() {
    return super.innerText || "";
  }
  set innerText(value) {
    super.textContent = value;
    this[SHEET] = null;
  }
  get textContent() {
    return super.textContent || "";
  }
  set textContent(value) {
    super.textContent = value;
    this[SHEET] = null;
  }
};
registerHTMLClass(tagName4, HTMLStyleElement);
var HTMLTimeElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "time") {
    super(ownerDocument, localName);
  }
};
var HTMLFieldSetElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "fieldset") {
    super(ownerDocument, localName);
  }
};
var HTMLEmbedElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "embed") {
    super(ownerDocument, localName);
  }
};
var HTMLHRElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "hr") {
    super(ownerDocument, localName);
  }
};
var HTMLProgressElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "progress") {
    super(ownerDocument, localName);
  }
};
var HTMLParagraphElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "p") {
    super(ownerDocument, localName);
  }
};
var HTMLTableElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "table") {
    super(ownerDocument, localName);
  }
};
var HTMLFrameSetElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "frameset") {
    super(ownerDocument, localName);
  }
};
var HTMLLIElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "li") {
    super(ownerDocument, localName);
  }
};
var HTMLBaseElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "base") {
    super(ownerDocument, localName);
  }
};
var HTMLDataListElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "datalist") {
    super(ownerDocument, localName);
  }
};
var tagName5 = "input";
var HTMLInputElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName5) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get autofocus() {
    return booleanAttribute.get(this, "autofocus") || -1;
  }
  set autofocus(value) {
    booleanAttribute.set(this, "autofocus", value);
  }
  get disabled() {
    return booleanAttribute.get(this, "disabled");
  }
  set disabled(value) {
    booleanAttribute.set(this, "disabled", value);
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(value) {
    this.setAttribute("name", value);
  }
  get placeholder() {
    return this.getAttribute("placeholder");
  }
  set placeholder(value) {
    this.setAttribute("placeholder", value);
  }
  get type() {
    return this.getAttribute("type");
  }
  set type(value) {
    this.setAttribute("type", value);
  }
  get value() {
    return stringAttribute.get(this, "value");
  }
  set value(value) {
    stringAttribute.set(this, "value", value);
  }
  get validity() {
    return { valid: true };
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName5, HTMLInputElement);
var HTMLParamElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "param") {
    super(ownerDocument, localName);
  }
};
var data = Symbol("data");
var HTMLMediaElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "media") {
    super(ownerDocument, localName);
    this[data] = {};
  }
  /* c8 ignore start */
  get paused() {
    return !this.hasAttribute("autoplay");
  }
  get volume() {
    return this[data].volume ?? 1;
  }
  set volume(value) {
    this[data].volume = value;
  }
  get currentTime() {
    return this[data].currentTime ?? 0;
  }
  set currentTime(value) {
    this[data].currentTime = value;
  }
  get muted() {
    return this[data].muted ?? this.defaultMuted;
  }
  set muted(value) {
    this[data].muted = value;
  }
  get defaultMuted() {
    return booleanAttribute.get(this, "muted");
  }
  set defaultMuted(value) {
    booleanAttribute.set(this, "muted", value);
  }
  get autoplay() {
    return booleanAttribute.get(this, "autoplay");
  }
  set autoplay(value) {
    booleanAttribute.set(this, "autoplay", value);
  }
  get controls() {
    return booleanAttribute.get(this, "controls");
  }
  set controls(value) {
    booleanAttribute.set(this, "controls", value);
  }
  get loop() {
    return booleanAttribute.get(this, "loop");
  }
  set loop(value) {
    booleanAttribute.set(this, "loop", value);
  }
  get src() {
    return stringAttribute.get(this, "src");
  }
  set src(value) {
    stringAttribute.set(this, "src", value);
  }
  get poster() {
    return stringAttribute.get(this, "poster");
  }
  set poster(value) {
    stringAttribute.set(this, "poster", value);
  }
  get preload() {
    return stringAttribute.get(this, "preload");
  }
  set preload(value) {
    stringAttribute.set(this, "preload", value);
  }
  /* c8 ignore stop */
};
var tagName6 = "audio";
var HTMLAudioElement = class extends HTMLMediaElement {
  constructor(ownerDocument, localName = tagName6) {
    super(ownerDocument, localName);
  }
};
registerHTMLClass(tagName6, HTMLAudioElement);
var tagName7 = "h1";
var HTMLHeadingElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName7) {
    super(ownerDocument, localName);
  }
};
registerHTMLClass([tagName7, "h2", "h3", "h4", "h5", "h6"], HTMLHeadingElement);
var HTMLDirectoryElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "dir") {
    super(ownerDocument, localName);
  }
};
var HTMLQuoteElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "quote") {
    super(ownerDocument, localName);
  }
};
var import_canvas = __toESM(require_canvas(), 1);
var { createCanvas } = import_canvas.default;
var tagName8 = "canvas";
var HTMLCanvasElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName8) {
    super(ownerDocument, localName);
    this[IMAGE] = createCanvas(300, 150);
  }
  get width() {
    return this[IMAGE].width;
  }
  set width(value) {
    numericAttribute.set(this, "width", value);
    this[IMAGE].width = value;
  }
  get height() {
    return this[IMAGE].height;
  }
  set height(value) {
    numericAttribute.set(this, "height", value);
    this[IMAGE].height = value;
  }
  getContext(type) {
    return this[IMAGE].getContext(type);
  }
  toDataURL(...args) {
    return this[IMAGE].toDataURL(...args);
  }
};
registerHTMLClass(tagName8, HTMLCanvasElement);
var HTMLLegendElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "legend") {
    super(ownerDocument, localName);
  }
};
var tagName9 = "option";
var HTMLOptionElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName9) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get value() {
    return stringAttribute.get(this, "value");
  }
  set value(value) {
    stringAttribute.set(this, "value", value);
  }
  /* c8 ignore stop */
  get selected() {
    return booleanAttribute.get(this, "selected");
  }
  set selected(value) {
    const option = this.parentElement?.querySelector("option[selected]");
    if (option && option !== this)
      option.selected = false;
    booleanAttribute.set(this, "selected", value);
  }
};
registerHTMLClass(tagName9, HTMLOptionElement);
var HTMLSpanElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "span") {
    super(ownerDocument, localName);
  }
};
var HTMLMeterElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "meter") {
    super(ownerDocument, localName);
  }
};
var tagName10 = "video";
var HTMLVideoElement = class extends HTMLMediaElement {
  constructor(ownerDocument, localName = tagName10) {
    super(ownerDocument, localName);
  }
};
registerHTMLClass(tagName10, HTMLVideoElement);
var HTMLTableCellElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "td") {
    super(ownerDocument, localName);
  }
};
var tagName11 = "title";
var HTMLTitleElement = class extends TextElement {
  constructor(ownerDocument, localName = tagName11) {
    super(ownerDocument, localName);
  }
};
registerHTMLClass(tagName11, HTMLTitleElement);
var HTMLOutputElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "output") {
    super(ownerDocument, localName);
  }
};
var HTMLTableRowElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "tr") {
    super(ownerDocument, localName);
  }
};
var HTMLDataElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "data") {
    super(ownerDocument, localName);
  }
};
var HTMLMenuElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "menu") {
    super(ownerDocument, localName);
  }
};
var tagName12 = "select";
var HTMLSelectElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName12) {
    super(ownerDocument, localName);
  }
  get options() {
    let children = new NodeList();
    let { firstElementChild } = this;
    while (firstElementChild) {
      if (firstElementChild.tagName === "OPTGROUP")
        children.push(...firstElementChild.children);
      else
        children.push(firstElementChild);
      firstElementChild = firstElementChild.nextElementSibling;
    }
    return children;
  }
  /* c8 ignore start */
  get disabled() {
    return booleanAttribute.get(this, "disabled");
  }
  set disabled(value) {
    booleanAttribute.set(this, "disabled", value);
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(value) {
    this.setAttribute("name", value);
  }
  /* c8 ignore stop */
  get value() {
    return this.querySelector("option[selected]")?.value;
  }
};
registerHTMLClass(tagName12, HTMLSelectElement);
var HTMLBRElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "br") {
    super(ownerDocument, localName);
  }
};
var tagName13 = "button";
var HTMLButtonElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName13) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get disabled() {
    return booleanAttribute.get(this, "disabled");
  }
  set disabled(value) {
    booleanAttribute.set(this, "disabled", value);
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(value) {
    this.setAttribute("name", value);
  }
  get type() {
    return this.getAttribute("type");
  }
  set type(value) {
    this.setAttribute("type", value);
  }
  get validity() {
    return { valid: true };
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName13, HTMLButtonElement);
var HTMLMapElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "map") {
    super(ownerDocument, localName);
  }
};
var HTMLOptGroupElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "optgroup") {
    super(ownerDocument, localName);
  }
};
var HTMLDListElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "dl") {
    super(ownerDocument, localName);
  }
};
var tagName14 = "textarea";
var HTMLTextAreaElement = class extends TextElement {
  constructor(ownerDocument, localName = tagName14) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get disabled() {
    return booleanAttribute.get(this, "disabled");
  }
  set disabled(value) {
    booleanAttribute.set(this, "disabled", value);
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(value) {
    this.setAttribute("name", value);
  }
  get placeholder() {
    return this.getAttribute("placeholder");
  }
  set placeholder(value) {
    this.setAttribute("placeholder", value);
  }
  get type() {
    return this.getAttribute("type");
  }
  set type(value) {
    this.setAttribute("type", value);
  }
  get value() {
    return this.textContent;
  }
  set value(content) {
    this.textContent = content;
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName14, HTMLTextAreaElement);
var HTMLFontElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "font") {
    super(ownerDocument, localName);
  }
};
var HTMLDivElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "div") {
    super(ownerDocument, localName);
  }
};
var tagName15 = "link";
var HTMLLinkElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName15) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  // copy paste from img.src, already covered
  get disabled() {
    return booleanAttribute.get(this, "disabled");
  }
  set disabled(value) {
    booleanAttribute.set(this, "disabled", value);
  }
  get href() {
    return stringAttribute.get(this, "href");
  }
  set href(value) {
    stringAttribute.set(this, "href", value);
  }
  get hreflang() {
    return stringAttribute.get(this, "hreflang");
  }
  set hreflang(value) {
    stringAttribute.set(this, "hreflang", value);
  }
  get media() {
    return stringAttribute.get(this, "media");
  }
  set media(value) {
    stringAttribute.set(this, "media", value);
  }
  get rel() {
    return stringAttribute.get(this, "rel");
  }
  set rel(value) {
    stringAttribute.set(this, "rel", value);
  }
  get type() {
    return stringAttribute.get(this, "type");
  }
  set type(value) {
    stringAttribute.set(this, "type", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName15, HTMLLinkElement);
var tagName16 = "slot";
var HTMLSlotElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName16) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get name() {
    return this.getAttribute("name");
  }
  set name(value) {
    this.setAttribute("name", value);
  }
  assign() {
  }
  assignedNodes(options) {
    const isNamedSlot = !!this.name;
    const hostChildNodes = this.getRootNode().host?.childNodes ?? [];
    let slottables;
    if (isNamedSlot) {
      slottables = [...hostChildNodes].filter((node) => node.slot === this.name);
    } else {
      slottables = [...hostChildNodes].filter((node) => !node.slot);
    }
    if (options?.flatten) {
      const result = [];
      for (let slottable of slottables) {
        if (slottable.localName === "slot") {
          result.push(...slottable.assignedNodes({ flatten: true }));
        } else {
          result.push(slottable);
        }
      }
      slottables = result;
    }
    return slottables.length ? slottables : [...this.childNodes];
  }
  assignedElements(options) {
    const slottables = this.assignedNodes(options).filter((n) => n.nodeType === 1);
    return slottables.length ? slottables : [...this.children];
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName16, HTMLSlotElement);
var HTMLFormElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "form") {
    super(ownerDocument, localName);
  }
};
var tagName17 = "img";
var HTMLImageElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName17) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get alt() {
    return stringAttribute.get(this, "alt");
  }
  set alt(value) {
    stringAttribute.set(this, "alt", value);
  }
  get sizes() {
    return stringAttribute.get(this, "sizes");
  }
  set sizes(value) {
    stringAttribute.set(this, "sizes", value);
  }
  get src() {
    return stringAttribute.get(this, "src");
  }
  set src(value) {
    stringAttribute.set(this, "src", value);
  }
  get srcset() {
    return stringAttribute.get(this, "srcset");
  }
  set srcset(value) {
    stringAttribute.set(this, "srcset", value);
  }
  get title() {
    return stringAttribute.get(this, "title");
  }
  set title(value) {
    stringAttribute.set(this, "title", value);
  }
  get width() {
    return numericAttribute.get(this, "width");
  }
  set width(value) {
    numericAttribute.set(this, "width", value);
  }
  get height() {
    return numericAttribute.get(this, "height");
  }
  set height(value) {
    numericAttribute.set(this, "height", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName17, HTMLImageElement);
var HTMLPreElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "pre") {
    super(ownerDocument, localName);
  }
};
var HTMLUListElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "ul") {
    super(ownerDocument, localName);
  }
};
var tagName18 = "meta";
var HTMLMetaElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName18) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get name() {
    return stringAttribute.get(this, "name");
  }
  set name(value) {
    stringAttribute.set(this, "name", value);
  }
  get httpEquiv() {
    return stringAttribute.get(this, "http-equiv");
  }
  set httpEquiv(value) {
    stringAttribute.set(this, "http-equiv", value);
  }
  get content() {
    return stringAttribute.get(this, "content");
  }
  set content(value) {
    stringAttribute.set(this, "content", value);
  }
  get charset() {
    return stringAttribute.get(this, "charset");
  }
  set charset(value) {
    stringAttribute.set(this, "charset", value);
  }
  get media() {
    return stringAttribute.get(this, "media");
  }
  set media(value) {
    stringAttribute.set(this, "media", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName18, HTMLMetaElement);
var HTMLPictureElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "picture") {
    super(ownerDocument, localName);
  }
};
var HTMLAreaElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "area") {
    super(ownerDocument, localName);
  }
};
var HTMLOListElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "ol") {
    super(ownerDocument, localName);
  }
};
var HTMLTableCaptionElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "caption") {
    super(ownerDocument, localName);
  }
};
var tagName19 = "a";
var HTMLAnchorElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName19) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  // copy paste from img.src, already covered
  get href() {
    return encodeURI(stringAttribute.get(this, "href"));
  }
  set href(value) {
    stringAttribute.set(this, "href", decodeURI(value));
  }
  get download() {
    return encodeURI(stringAttribute.get(this, "download"));
  }
  set download(value) {
    stringAttribute.set(this, "download", decodeURI(value));
  }
  get target() {
    return stringAttribute.get(this, "target");
  }
  set target(value) {
    stringAttribute.set(this, "target", value);
  }
  get type() {
    return stringAttribute.get(this, "type");
  }
  set type(value) {
    stringAttribute.set(this, "type", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName19, HTMLAnchorElement);
var HTMLLabelElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "label") {
    super(ownerDocument, localName);
  }
};
var HTMLUnknownElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "unknown") {
    super(ownerDocument, localName);
  }
};
var HTMLModElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "mod") {
    super(ownerDocument, localName);
  }
};
var HTMLDetailsElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "details") {
    super(ownerDocument, localName);
  }
};
var tagName20 = "source";
var HTMLSourceElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName20) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get src() {
    return stringAttribute.get(this, "src");
  }
  set src(value) {
    stringAttribute.set(this, "src", value);
  }
  get srcset() {
    return stringAttribute.get(this, "srcset");
  }
  set srcset(value) {
    stringAttribute.set(this, "srcset", value);
  }
  get sizes() {
    return stringAttribute.get(this, "sizes");
  }
  set sizes(value) {
    stringAttribute.set(this, "sizes", value);
  }
  get type() {
    return stringAttribute.get(this, "type");
  }
  set type(value) {
    stringAttribute.set(this, "type", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName20, HTMLSourceElement);
var HTMLTrackElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "track") {
    super(ownerDocument, localName);
  }
};
var HTMLMarqueeElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "marquee") {
    super(ownerDocument, localName);
  }
};
var HTMLClasses = {
  HTMLElement,
  HTMLTemplateElement: HTMLTemplateElement2,
  HTMLHtmlElement,
  HTMLScriptElement,
  HTMLFrameElement,
  HTMLIFrameElement,
  HTMLObjectElement,
  HTMLHeadElement,
  HTMLBodyElement,
  HTMLStyleElement,
  HTMLTimeElement,
  HTMLFieldSetElement,
  HTMLEmbedElement,
  HTMLHRElement,
  HTMLProgressElement,
  HTMLParagraphElement,
  HTMLTableElement,
  HTMLFrameSetElement,
  HTMLLIElement,
  HTMLBaseElement,
  HTMLDataListElement,
  HTMLInputElement,
  HTMLParamElement,
  HTMLMediaElement,
  HTMLAudioElement,
  HTMLHeadingElement,
  HTMLDirectoryElement,
  HTMLQuoteElement,
  HTMLCanvasElement,
  HTMLLegendElement,
  HTMLOptionElement,
  HTMLSpanElement,
  HTMLMeterElement,
  HTMLVideoElement,
  HTMLTableCellElement,
  HTMLTitleElement,
  HTMLOutputElement,
  HTMLTableRowElement,
  HTMLDataElement,
  HTMLMenuElement,
  HTMLSelectElement,
  HTMLBRElement,
  HTMLButtonElement,
  HTMLMapElement,
  HTMLOptGroupElement,
  HTMLDListElement,
  HTMLTextAreaElement,
  HTMLFontElement,
  HTMLDivElement,
  HTMLLinkElement,
  HTMLSlotElement,
  HTMLFormElement,
  HTMLImageElement,
  HTMLPreElement,
  HTMLUListElement,
  HTMLMetaElement,
  HTMLPictureElement,
  HTMLAreaElement,
  HTMLOListElement,
  HTMLTableCaptionElement,
  HTMLAnchorElement,
  HTMLLabelElement,
  HTMLUnknownElement,
  HTMLModElement,
  HTMLDetailsElement,
  HTMLSourceElement,
  HTMLTrackElement,
  HTMLMarqueeElement
};
var voidElements2 = { test: () => true };
var Mime = {
  "text/html": {
    docType: "<!DOCTYPE html>",
    ignoreCase: true,
    voidElements: /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i
  },
  "image/svg+xml": {
    docType: '<?xml version="1.0" encoding="utf-8"?>',
    ignoreCase: false,
    voidElements: voidElements2
  },
  "text/xml": {
    docType: '<?xml version="1.0" encoding="utf-8"?>',
    ignoreCase: false,
    voidElements: voidElements2
  },
  "application/xml": {
    docType: '<?xml version="1.0" encoding="utf-8"?>',
    ignoreCase: false,
    voidElements: voidElements2
  },
  "application/xhtml+xml": {
    docType: '<?xml version="1.0" encoding="utf-8"?>',
    ignoreCase: false,
    voidElements: voidElements2
  }
};
var CustomEvent2 = class extends GlobalEvent {
  constructor(type, eventInitDict = {}) {
    super(type, eventInitDict);
    this.detail = eventInitDict.detail;
  }
};
var DocumentFragment = class extends NonElementParentNode {
  constructor(ownerDocument) {
    super(ownerDocument, "#document-fragment", DOCUMENT_FRAGMENT_NODE);
  }
};
var InputEvent = class extends GlobalEvent {
  constructor(type, inputEventInit = {}) {
    super(type, inputEventInit);
    this.inputType = inputEventInit.inputType;
    this.data = inputEventInit.data;
    this.dataTransfer = inputEventInit.dataTransfer;
    this.isComposing = inputEventInit.isComposing || false;
    this.ranges = inputEventInit.ranges;
  }
};
var ImageClass = (ownerDocument) => (
  /**
   * @implements globalThis.Image
   */
  class Image extends HTMLImageElement {
    constructor(width, height) {
      super(ownerDocument);
      switch (arguments.length) {
        case 1:
          this.height = width;
          this.width = width;
          break;
        case 2:
          this.height = height;
          this.width = width;
          break;
      }
    }
  }
);
var deleteContents = ({ [START]: start, [END]: end }, fragment = null) => {
  setAdjacent(start[PREV], end[NEXT]);
  do {
    const after2 = getEnd(start);
    const next = after2 === end ? after2 : after2[NEXT];
    if (fragment)
      fragment.insertBefore(start, fragment[END]);
    else
      start.remove();
    start = next;
  } while (start !== end);
};
var Range = class _Range {
  constructor() {
    this[START] = null;
    this[END] = null;
    this.commonAncestorContainer = null;
  }
  /* TODO: this is more complicated than it looks
    setStart(node, offset) {
      this[START] = node.childNodes[offset];
    }
  
    setEnd(node, offset) {
      this[END] = getEnd(node.childNodes[offset]);
    }
    //*/
  insertNode(newNode) {
    this[END].parentNode.insertBefore(newNode, this[START]);
  }
  selectNode(node) {
    this[START] = node;
    this[END] = getEnd(node);
  }
  surroundContents(parentNode) {
    parentNode.replaceChildren(this.extractContents());
  }
  setStartBefore(node) {
    this[START] = node;
  }
  setStartAfter(node) {
    this[START] = node.nextSibling;
  }
  setEndBefore(node) {
    this[END] = getEnd(node.previousSibling);
  }
  setEndAfter(node) {
    this[END] = getEnd(node);
  }
  cloneContents() {
    let { [START]: start, [END]: end } = this;
    const fragment = start.ownerDocument.createDocumentFragment();
    while (start !== end) {
      fragment.insertBefore(start.cloneNode(true), fragment[END]);
      start = getEnd(start);
      if (start !== end)
        start = start[NEXT];
    }
    return fragment;
  }
  deleteContents() {
    deleteContents(this);
  }
  extractContents() {
    const fragment = this[START].ownerDocument.createDocumentFragment();
    deleteContents(this, fragment);
    return fragment;
  }
  createContextualFragment(html) {
    const template11 = this.commonAncestorContainer.createElement("template");
    template11.innerHTML = html;
    this.selectNode(template11.content);
    return template11.content;
  }
  cloneRange() {
    const range = new _Range();
    range[START] = this[START];
    range[END] = this[END];
    return range;
  }
};
var isOK = ({ nodeType }, mask) => {
  switch (nodeType) {
    case ELEMENT_NODE:
      return mask & SHOW_ELEMENT;
    case TEXT_NODE:
      return mask & SHOW_TEXT;
    case COMMENT_NODE:
      return mask & SHOW_COMMENT;
  }
  return 0;
};
var TreeWalker = class {
  constructor(root, whatToShow = SHOW_ALL) {
    this.root = root;
    this.whatToShow = whatToShow;
    this._currentNode = root;
    this._createNodes(root);
  }
  set currentNode(currentNode) {
    this._currentNode = currentNode;
    if (currentNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
      this._createNodes(currentNode);
    }
  }
  get currentNode() {
    return this._currentNode;
  }
  nextNode() {
    const $ = this[PRIVATE];
    this._currentNode = $.i < $.nodes.length ? $.nodes[$.i++] : null;
    return this._currentNode;
  }
  _createNodes(root) {
    let { [NEXT]: next, [END]: end } = root;
    if (root.nodeType === DOCUMENT_NODE) {
      const { documentElement } = root;
      next = documentElement;
      end = documentElement[END];
    }
    const nodes = [];
    while (next !== end) {
      if (isOK(next, this.whatToShow))
        nodes.push(next);
      next = next[NEXT];
    }
    this[PRIVATE] = { i: 0, nodes };
  }
};
var query = (method, ownerDocument, selectors) => {
  let { [NEXT]: next, [END]: end } = ownerDocument;
  return method.call({ ownerDocument, [NEXT]: next, [END]: end }, selectors);
};
var globalExports = assign(
  {},
  Facades,
  HTMLClasses,
  {
    CustomEvent: CustomEvent2,
    DocumentFragment,
    Event: GlobalEvent,
    EventTarget: DOMEventTarget,
    InputEvent,
    NamedNodeMap,
    NodeList
  }
);
var window2 = /* @__PURE__ */ new WeakMap();
var Document2 = class extends NonElementParentNode {
  constructor(type) {
    super(null, "#document", DOCUMENT_NODE);
    this[CUSTOM_ELEMENTS] = { active: false, registry: null };
    this[MUTATION_OBSERVER] = { active: false, class: null };
    this[MIME] = Mime[type];
    this[DOCTYPE] = null;
    this[DOM_PARSER] = null;
    this[GLOBALS] = null;
    this[IMAGE] = null;
    this[UPGRADE] = null;
  }
  /**
   * @type {globalThis.Document['defaultView']}
   */
  get defaultView() {
    if (!window2.has(this))
      window2.set(this, new Proxy(globalThis, {
        set: (target, name, value) => {
          switch (name) {
            case "addEventListener":
            case "removeEventListener":
            case "dispatchEvent":
              this[EVENT_TARGET][name] = value;
              break;
            default:
              target[name] = value;
              break;
          }
          return true;
        },
        get: (globalThis2, name) => {
          switch (name) {
            case "addEventListener":
            case "removeEventListener":
            case "dispatchEvent":
              if (!this[EVENT_TARGET]) {
                const et = this[EVENT_TARGET] = new DOMEventTarget();
                et.dispatchEvent = et.dispatchEvent.bind(et);
                et.addEventListener = et.addEventListener.bind(et);
                et.removeEventListener = et.removeEventListener.bind(et);
              }
              return this[EVENT_TARGET][name];
            case "document":
              return this;
            case "navigator":
              return {
                userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36"
              };
            case "window":
              return window2.get(this);
            case "customElements":
              if (!this[CUSTOM_ELEMENTS].registry)
                this[CUSTOM_ELEMENTS] = new CustomElementRegistry(this);
              return this[CUSTOM_ELEMENTS];
            case "performance":
              return import_perf_hooks.performance;
            case "DOMParser":
              return this[DOM_PARSER];
            case "Image":
              if (!this[IMAGE])
                this[IMAGE] = ImageClass(this);
              return this[IMAGE];
            case "MutationObserver":
              if (!this[MUTATION_OBSERVER].class)
                this[MUTATION_OBSERVER] = new MutationObserverClass(this);
              return this[MUTATION_OBSERVER].class;
          }
          return this[GLOBALS] && this[GLOBALS][name] || globalExports[name] || globalThis2[name];
        }
      }));
    return window2.get(this);
  }
  get doctype() {
    const docType = this[DOCTYPE];
    if (docType)
      return docType;
    const { firstChild } = this;
    if (firstChild && firstChild.nodeType === DOCUMENT_TYPE_NODE)
      return this[DOCTYPE] = firstChild;
    return null;
  }
  set doctype(value) {
    if (/^([a-z:]+)(\s+system|\s+public(\s+"([^"]+)")?)?(\s+"([^"]+)")?/i.test(value)) {
      const { $1: name, $4: publicId, $6: systemId } = RegExp;
      this[DOCTYPE] = new DocumentType(this, name, publicId, systemId);
      knownSiblings(this, this[DOCTYPE], this[NEXT]);
    }
  }
  get documentElement() {
    return this.firstElementChild;
  }
  get isConnected() {
    return true;
  }
  /**
   * @protected
   */
  _getParent() {
    return this[EVENT_TARGET];
  }
  createAttribute(name) {
    return new Attr(this, name);
  }
  createComment(textContent2) {
    return new Comment3(this, textContent2);
  }
  createDocumentFragment() {
    return new DocumentFragment(this);
  }
  createDocumentType(name, publicId, systemId) {
    return new DocumentType(this, name, publicId, systemId);
  }
  createElement(localName) {
    return new Element2(this, localName);
  }
  createRange() {
    const range = new Range();
    range.commonAncestorContainer = this;
    return range;
  }
  createTextNode(textContent2) {
    return new Text3(this, textContent2);
  }
  createTreeWalker(root, whatToShow = -1) {
    return new TreeWalker(root, whatToShow);
  }
  createNodeIterator(root, whatToShow = -1) {
    return this.createTreeWalker(root, whatToShow);
  }
  createEvent(name) {
    const event = create(name === "Event" ? new GlobalEvent("") : new CustomEvent2(""));
    event.initEvent = event.initCustomEvent = (type, canBubble = false, cancelable = false, detail) => {
      defineProperties(event, {
        type: { value: type },
        canBubble: { value: canBubble },
        cancelable: { value: cancelable },
        detail: { value: detail }
      });
    };
    return event;
  }
  cloneNode(deep = false) {
    const {
      constructor,
      [CUSTOM_ELEMENTS]: customElements2,
      [DOCTYPE]: doctype
    } = this;
    const document2 = new constructor();
    document2[CUSTOM_ELEMENTS] = customElements2;
    if (deep) {
      const end = document2[END];
      const { childNodes } = this;
      for (let { length } = childNodes, i = 0; i < length; i++)
        document2.insertBefore(childNodes[i].cloneNode(true), end);
      if (doctype)
        document2[DOCTYPE] = childNodes[0];
    }
    return document2;
  }
  importNode(externalNode) {
    const deep = 1 < arguments.length && !!arguments[1];
    const node = externalNode.cloneNode(deep);
    const { [CUSTOM_ELEMENTS]: customElements2 } = this;
    const { active } = customElements2;
    const upgrade = (element) => {
      const { ownerDocument, nodeType } = element;
      element.ownerDocument = this;
      if (active && ownerDocument !== this && nodeType === ELEMENT_NODE)
        customElements2.upgrade(element);
    };
    upgrade(node);
    if (deep) {
      switch (node.nodeType) {
        case ELEMENT_NODE:
        case DOCUMENT_FRAGMENT_NODE: {
          let { [NEXT]: next, [END]: end } = node;
          while (next !== end) {
            if (next.nodeType === ELEMENT_NODE)
              upgrade(next);
            next = next[NEXT];
          }
          break;
        }
      }
    }
    return node;
  }
  toString() {
    return this.childNodes.join("");
  }
  querySelector(selectors) {
    return query(super.querySelector, this, selectors);
  }
  querySelectorAll(selectors) {
    return query(super.querySelectorAll, this, selectors);
  }
  /* c8 ignore start */
  getElementsByTagNameNS(_, name) {
    return this.getElementsByTagName(name);
  }
  createAttributeNS(_, name) {
    return this.createAttribute(name);
  }
  createElementNS(nsp, localName, options) {
    return nsp === SVG_NAMESPACE ? new SVGElement(this, localName, null) : this.createElement(localName, options);
  }
  /* c8 ignore stop */
};
setPrototypeOf(
  globalExports.Document = function Document3() {
    illegalConstructor();
  },
  Document2
).prototype = Document2.prototype;
var createHTMLElement = (ownerDocument, builtin, localName, options) => {
  if (!builtin && htmlClasses.has(localName)) {
    const Class = htmlClasses.get(localName);
    return new Class(ownerDocument, localName);
  }
  const { [CUSTOM_ELEMENTS]: { active, registry } } = ownerDocument;
  if (active) {
    const ce = builtin ? options.is : localName;
    if (registry.has(ce)) {
      const { Class } = registry.get(ce);
      const element = new Class(ownerDocument, localName);
      customElements.set(element, { connected: false });
      return element;
    }
  }
  return new HTMLElement(ownerDocument, localName);
};
var HTMLDocument = class extends Document2 {
  constructor() {
    super("text/html");
  }
  get all() {
    const nodeList = new NodeList();
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end) {
      switch (next.nodeType) {
        case ELEMENT_NODE:
          nodeList.push(next);
          break;
      }
      next = next[NEXT];
    }
    return nodeList;
  }
  /**
   * @type HTMLHeadElement
   */
  get head() {
    const { documentElement } = this;
    let { firstElementChild } = documentElement;
    if (!firstElementChild || firstElementChild.tagName !== "HEAD") {
      firstElementChild = this.createElement("head");
      documentElement.prepend(firstElementChild);
    }
    return firstElementChild;
  }
  /**
   * @type HTMLBodyElement
   */
  get body() {
    const { head } = this;
    let { nextElementSibling: nextElementSibling3 } = head;
    if (!nextElementSibling3 || nextElementSibling3.tagName !== "BODY") {
      nextElementSibling3 = this.createElement("body");
      head.after(nextElementSibling3);
    }
    return nextElementSibling3;
  }
  /**
   * @type HTMLTitleElement
   */
  get title() {
    const { head } = this;
    let title = head.getElementsByTagName("title").shift();
    return title ? title.textContent : "";
  }
  set title(textContent2) {
    const { head } = this;
    let title = head.getElementsByTagName("title").shift();
    if (title)
      title.textContent = textContent2;
    else {
      head.insertBefore(
        this.createElement("title"),
        head.firstChild
      ).textContent = textContent2;
    }
  }
  createElement(localName, options) {
    const builtin = !!(options && options.is);
    const element = createHTMLElement(this, builtin, localName, options);
    if (builtin)
      element.setAttribute("is", options.is);
    return element;
  }
};
var SVGDocument = class extends Document2 {
  constructor() {
    super("image/svg+xml");
  }
  toString() {
    return this[MIME].docType + super.toString();
  }
};
var XMLDocument = class extends Document2 {
  constructor() {
    super("text/xml");
  }
  toString() {
    return this[MIME].docType + super.toString();
  }
};
var DOMParser = class _DOMParser {
  /** @typedef {{ "text/html": HTMLDocument, "image/svg+xml": SVGDocument, "text/xml": XMLDocument }} MimeToDoc */
  /**
   * @template {keyof MimeToDoc} MIME
   * @param {string} markupLanguage
   * @param {MIME} mimeType
   * @returns {MimeToDoc[MIME]}
   */
  parseFromString(markupLanguage, mimeType, globals = null) {
    let isHTML = false, document2;
    if (mimeType === "text/html") {
      isHTML = true;
      document2 = new HTMLDocument();
    } else if (mimeType === "image/svg+xml")
      document2 = new SVGDocument();
    else
      document2 = new XMLDocument();
    document2[DOM_PARSER] = _DOMParser;
    if (globals)
      document2[GLOBALS] = globals;
    if (isHTML && markupLanguage === "...")
      markupLanguage = "<!doctype html><html><head></head><body></body></html>";
    return markupLanguage ? parseFromString(document2, isHTML, markupLanguage) : document2;
  }
};
var { parse: parse4 } = JSON;
var parseHTML = (html, globals = null) => new DOMParser().parseFromString(
  html,
  "text/html",
  globals
).defaultView;
function Document4() {
  illegalConstructor();
}
setPrototypeOf(Document4, Document2).prototype = Document2.prototype;
var preshimGlobalThis;
shim();
function shim() {
  if (preshimGlobalThis)
    return;
  let {
    document: document2,
    navigator,
    customElements: customElements2,
    addEventListener,
    removeEventListener,
    dispatchEvent,
    Event: Event2,
    CustomEvent: CustomEvent22,
    DocumentFragment: DocumentFragment22,
    DOMParser: DOMParser2,
    HTMLElement: HTMLElement22,
    HTMLTemplateElement: HTMLTemplateElement22,
    MutationObserver: MutationObserver2
  } = parseHTML("...");
  class Storage {
    key() {
    }
    getItem() {
    }
    setItem() {
    }
    removeItem() {
    }
    clear() {
    }
  }
  const localStorage = new Storage();
  class ResizeObserver3 {
    observe() {
    }
    unobserve() {
    }
    disconnect() {
    }
  }
  class CSSStyleDeclaration2 {
    getPropertyPriority() {
    }
    getPropertyValue() {
    }
    item() {
    }
    removeProperty() {
    }
    setProperty() {
    }
  }
  const shims = {
    document: document2,
    navigator,
    customElements: customElements2,
    addEventListener,
    removeEventListener,
    dispatchEvent,
    Event: Event2,
    CustomEvent: CustomEvent22,
    DocumentFragment: DocumentFragment22,
    DOMParser: DOMParser2,
    HTMLElement: HTMLElement22,
    HTMLTemplateElement: HTMLTemplateElement22,
    MutationObserver: MutationObserver2,
    localStorage,
    ResizeObserver: ResizeObserver3,
    CSSStyleDeclaration: CSSStyleDeclaration2,
    getComputedStyle: function getComputedStyle2() {
      return new CSSStyleDeclaration2();
    },
    requestAnimationFrame: function requestAnimationFrame2() {
    },
    cancelAnimationFrame: function cancelAnimationFrame2() {
    }
  };
  preshimGlobalThis = {};
  for (let shim2 in shims) {
    preshimGlobalThis[shim2] = globalThis[shim2];
  }
  Object.assign(globalThis, shims);
}
var nonClosingElements = /* @__PURE__ */ new Set([
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
var defaults = {
  getRenderComplete: () => new Promise((resolve) => setTimeout(resolve, 0)),
  minifyCss: true,
  stripHtmlTag: false
};
var renderCompleteQueue = /* @__PURE__ */ new Set();
async function renderToDom(html, opts = { ...defaults }) {
  html = String(html);
  html = html.replace(/(<!DOCTYPE[^>]*?>)\s*\n/i, (_, doctype) => {
    opts.doctype = opts.doctype ?? doctype;
    return "";
  });
  if (!html.includes("<html")) {
    html = `<html>${html}</html>`;
    opts.stripHtmlTag = true;
  }
  const renderComplete = opts.getRenderComplete();
  renderCompleteQueue.add(renderComplete);
  renderComplete.then(() => renderCompleteQueue.delete(renderComplete));
  await Promise.all(renderCompleteQueue);
  document.documentElement.outerHTML = html;
  await renderComplete;
  return document;
}
async function renderToString(html, opts = { ...defaults }) {
  const dom = await renderToDom(html, opts);
  return stringify(dom, opts);
}
var customElementOpenRegex = /<(\w+-\w+)([^>]*?)>/m;
var customElementsRegex = /<(\w+-\w+)([^>]*?)>([^]*?)<\/\1>/gm;
function renderToStream(rs, opts) {
  const reader = rs.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      let html = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.enqueue(encoder.encode(html));
          break;
        }
        const decoded = decoder.decode(value, { stream: true });
        html += decoded;
        if (customElementOpenRegex.test(html)) {
          let out = "";
          let start = 0;
          const matches2 = html.matchAll(customElementsRegex);
          for (const match of matches2) {
            out += html.slice(start, match.index);
            out += await renderToString(match[0], opts);
            start = match.index + match[0].length;
          }
          if (out) {
            controller.enqueue(encoder.encode(out));
            html = html.slice(start);
          }
          continue;
        }
        controller.enqueue(encoder.encode(html));
        html = "";
      }
      controller.close();
      reader.releaseLock();
    }
  });
}
function stringify(node, opts) {
  let str = "";
  let skipNode = false;
  if (node.nodeName === "#document") {
    if (opts.doctype) {
      str += `${opts.doctype}
`;
    }
    node = node.documentElement;
    skipNode = opts.stripHtmlTag;
  }
  if (!skipNode) {
    if (node.nodeName === "#text") {
      let text = node.textContent.replace(/\xA0/g, "&nbsp;");
      if (opts.minifyCss && node.parentNode.localName === "style") {
        text = minimizeCss(text);
      }
      return text;
    }
    if (node.nodeName === "#comment") {
      return `<!--${node.textContent}-->`;
    }
    str += `<${node.localName}${(node.attributes || []).map((a) => ` ${a.name}${a.value === "" ? "" : `="${a.value}"`}`).join("")}>`;
  }
  if (node.shadowRoot) {
    str += `<template shadowrootmode="open">${node.shadowRoot.childNodes.map((n) => stringify(n, opts)).join("")}</template>`;
  }
  if (node.childNodes) {
    str += node.childNodes.map((n) => stringify(n, opts)).join("");
  }
  if (!skipNode && !nonClosingElements.has(node.localName)) {
    str += `</${node.localName}>`;
  }
  return str;
}
function minimizeCss(content) {
  content = content.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "");
  content = content.replace(/ {2,}/g, " ");
  content = content.replace(/ ([{:}]) /g, "$1");
  content = content.replace(/([;,]) /g, "$1");
  content = content.replace(/ !/g, "!");
  return content;
}

// src/worker.js
var worker_default = {
  async fetch(request2, env, ctx) {
    let out = "";
    const url = new URL(request2.url);
    const contentUrl = url.searchParams.get("url");
    await Promise.resolve().then(() => (init_dist(), dist_exports));
    await Promise.resolve().then(() => (init_media_theme_element(), media_theme_element_exports));
    class TitleElementHandler {
      element(element) {
        element.before(`<base href="${contentUrl}">
`, { html: true });
      }
    }
    if (contentUrl) {
      const res = await fetch(contentUrl);
      const newRes = new HTMLRewriter().on("title", new TitleElementHandler()).transform(res);
      out = renderToStream(newRes.body);
    }
    return new Response(out, {
      headers: {
        "content-type": "text/html;charset=UTF-8"
      }
    });
  }
};

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_checked_fetch();
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
var jsonError = async (request2, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request2, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
};
var middleware_miniflare3_json_error_default = jsonError;
var wrap = void 0;

// .wrangler/tmp/bundle-BorWzd/middleware-insertion-facade.js
var envWrappers = [wrap].filter(Boolean);
var facade = {
  ...worker_default,
  envWrappers,
  middleware: [
    middleware_miniflare3_json_error_default,
    ...worker_default.middleware ? worker_default.middleware : []
  ].filter(Boolean)
};
var middleware_insertion_facade_default = facade;

// .wrangler/tmp/bundle-BorWzd/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
var __facade_modules_fetch__ = function(request2, env, ctx) {
  if (middleware_insertion_facade_default.fetch === void 0)
    throw new Error("Handler does not export a fetch() function.");
  return middleware_insertion_facade_default.fetch(request2, env, ctx);
};
function getMaskedEnv(rawEnv) {
  let env = rawEnv;
  if (middleware_insertion_facade_default.envWrappers && middleware_insertion_facade_default.envWrappers.length > 0) {
    for (const wrapFn of middleware_insertion_facade_default.envWrappers) {
      env = wrapFn(env);
    }
  }
  return env;
}
var registeredMiddleware = false;
var facade2 = {
  ...middleware_insertion_facade_default.tail && {
    tail: maskHandlerEnv(middleware_insertion_facade_default.tail)
  },
  ...middleware_insertion_facade_default.trace && {
    trace: maskHandlerEnv(middleware_insertion_facade_default.trace)
  },
  ...middleware_insertion_facade_default.scheduled && {
    scheduled: maskHandlerEnv(middleware_insertion_facade_default.scheduled)
  },
  ...middleware_insertion_facade_default.queue && {
    queue: maskHandlerEnv(middleware_insertion_facade_default.queue)
  },
  ...middleware_insertion_facade_default.test && {
    test: maskHandlerEnv(middleware_insertion_facade_default.test)
  },
  ...middleware_insertion_facade_default.email && {
    email: maskHandlerEnv(middleware_insertion_facade_default.email)
  },
  fetch(request2, rawEnv, ctx) {
    const env = getMaskedEnv(rawEnv);
    if (middleware_insertion_facade_default.middleware && middleware_insertion_facade_default.middleware.length > 0) {
      if (!registeredMiddleware) {
        registeredMiddleware = true;
        for (const middleware of middleware_insertion_facade_default.middleware) {
          __facade_register__(middleware);
        }
      }
      const __facade_modules_dispatch__ = function(type, init) {
        if (type === "scheduled" && middleware_insertion_facade_default.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return middleware_insertion_facade_default.scheduled(controller, env, ctx);
        }
      };
      return __facade_invoke__(
        request2,
        env,
        ctx,
        __facade_modules_dispatch__,
        __facade_modules_fetch__
      );
    } else {
      return __facade_modules_fetch__(request2, env, ctx);
    }
  }
};
function maskHandlerEnv(handler4) {
  return (data2, env, ctx) => handler4(data2, getMaskedEnv(env), ctx);
}
var middleware_loader_entry_default = facade2;
export {
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map

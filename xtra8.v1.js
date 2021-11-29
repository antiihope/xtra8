let Routes = {};
let _values = {};
let els = {};
let str = JSON.stringify;

const GenID = () => {
  let r = (Math.random() + 1).toString(36).substring(7);
  return r;
};

window.print = console.log;

function CheckType(type) {
  if (window.useEffect == undefined) {
    window.useEffect = {};
  }
  if (els == undefined) {
    els = {};
  }
  if (els[type] !== undefined) {
    els[type] = els[type] + 1;
  } else {
    els[type] = 0;
  }

  return els[type];
}

function SET_VALUES(values, type, children) {
  var PAGE = ThisPageName();
  var COUNT = CheckType(type);

  if (values == null) values = {};
  if (values.hasOwnProperty('if')) {
    if (!values.if || values.if == undefined) {
      return 'stop';
    }
  }
  var id;
  id = PAGE + type + COUNT;
  // assign id if not already there  , for easier  Callback
  if (values == null) {
    var values = {};

    values.id = id;
  }

  if (values.id == undefined) values.id = id;
  var id = values.id;

  if (id.length == 0) id = id;

  // look for useeffect and call it or ignore it
  var Checkin = values.useEffect || false;
  if (Checkin) {
    if (typeof Checkin == 'function') {
      if (!window.useEffect[id]) {
        Checkin();
        window.useEffect[id] = true;
      }
    }
  }
  return values;
}

var React = {
  createElement: function createElement(type, values, ...children) {
    if (type == 'route') {
      print(type, values);
    }

    var props = SET_VALUES(values, type, children.length);

    if (props == 'stop') {
      return '';
    }

    if (type !== undefined) {
      if (typeof type == 'function') {
        var props = SET_VALUES(values, type, children.length);
        props.id = type.name;

        props.children = children;
        type.props = props;
        return type(props);
      }
    } else {
      return '';
    }

    var element = document.createElement(type);

    Object.assign(element, { ...props, ...values });

    children.forEach((z) => {
      if (typeof z == 'function') {
        // print(z);
        vdom[z.name] = z;
        var newz = z();
        newz.id = z.name;
        element.append(newz);
      } else {
        // this to look for loops in element children
        if (Array.isArray(z)) {
          // console.log(z);
          z.forEach((typos) => {
            element.append(typos);
          });
        } else {
          element.append(z);
        }
      }
    });

    return element;
  },
};

window.React = React;
window.el = (x) => {
  return document.getElementById(x);
};

Element.prototype.insertChildAtIndex = function (child, index) {
  if (!index) index = 0;
  if (index >= this.children.length) {
    this.appendChild(child);
  } else {
    this.insertBefore(child, this.children[index]);
  }
};

function SaveValues() {
  window['SelectValues'] = {};
  document.querySelectorAll('select').forEach((el) => {
    window['SelectValues'][el.id] = el.value;
  });
}

function PutValues() {
  document.querySelectorAll('select').forEach((el) => {
    if (window['SelectValues'][el.id]) {
      document.getElementById([el.id]).value = window['SelectValues'][el.id];
    }
  });
}

function UPDATE_DOM(newdom = false) {
  if (!window.Loaded) {
    print('not yet loaded');
    window.finished = true;
    window.Loaded = true;
    return;
  }

  window['focused'] = document.activeElement.id;
  var external;
  external = true;
  if (newdom == false) {
    external = false;

    els = {};
    var newdom = window.vdom();
  } else {
    external = newdom;
    newdom = external();
  }
  var root = el('parent');
  var oldDom = root.childNodes[0];

  var matchs = newdom.innerHTML == oldDom.innerHTML;
  if (!matchs) {
    window['olDom'] = oldDom;
    // what this function?! you ask
    var changed = 0;
    var oldDom = root.childNodes[0];
    var clone = oldDom.cloneNode(true);

    function CheckUpdates() {
      if (window.onUpdate) {
        print('found on update');
        window.onUpdate();
      }
    }
    //  STOP JUDGIN ME .. .I WAS DRUNK ↓↓
    function Proccess(repeat = false) {
      window.finished = false;
      try {
        SaveValues();

        function isEmpty(obj) {
          return Object.keys(obj).length === 0;
        }

        function SameParent(x, y) {
          return x[0].parentElement.id == y[0].parentElement.id;
        }

        function DIFF(oldDom, newdom) {
          function el(x) {
            return oldDom.querySelector('#' + x);
          }
          var obj = {};
          var attrs = [
            'disabled',
            "style['cssText']",
            'value',
            'media',
            'class',
            'href',
            'oncopy',
            'controls',
            'src',
            'onclick',
            'onblur',
            'draggable',
            'id',
          ];
          var OLD_KIDS = oldDom.childNodes;
          var NEW_KIDS = newdom.childNodes;
          if (!SameParent(OLD_KIDS, NEW_KIDS)) return false;

          // print('<<<<<<<<DIFF>>>>>>>');

          // REMOVES ITEMS THAT ARE NOT IN NEWDOM
          OLD_KIDS.forEach((element) => {
            var ele = newdom.querySelector('#' + element.id);
            if (!ele) {
              element.remove();
            }
          });
          NEW_KIDS.forEach((element) => {
            if (!element.id) {
              return false;
            }

            var thisID = element.id;
            obj[thisID] = {
              attrs: {},
              inner: 'IGNORE',
            };
            var index = [...element.parentElement.children].indexOf(element);
            var oldElement = el(thisID);

            if (oldElement) {
              if (element.tagName == 'DIV') {
                return DIFF(oldElement, element);
              }
              attrs.forEach((attr) => {
                if (oldElement[attr] !== element[attr]) {
                  if (attr == 'value') {
                    return;
                  }
                  obj[thisID]['attrs'][attr] = element[attr];
                  // print(attr, element[attr]);
                }
              });
              if (oldElement.innerHTML !== element.innerHTML) {
                obj[thisID]['inner'] = element.innerHTML;
              }
            } else {
              oldDom.insertChildAtIndex(element, index);
            }
          });
          for (const key in obj) {
            if (isEmpty(obj[key]['attrs']) && obj[key]['inner'] == 'IGNORE') {
              delete obj[key];
            }
          }
          for (const key in obj) {
            var ele = el(key);
            var attrs = obj[key]['attrs'];
            if (ele) {
              for (const attr in attrs) {
                ele[attr] = attrs[attr];
              }
              if (obj[key]['inner'] !== 'IGNORE') {
                ele.innerHTML = obj[key]['inner'];
              }
            }
          }
          PutValues();
          window.finished = true;
          // print('<<<<<<<<DIFF>>>>>>');
        }

        return DIFF(oldDom, newdom);
      } catch (error) {
        if (!repeat) {
          Proccess(true);
        } else return false;
      }
    }
    // ↑↑↑ STOP JUDGIN ME .. .I WAS DRUNK ↑↑↑
    if (Proccess() == false) {
      SaveValues();
      window.finished = true;
      // print('returned false');
      var div = document.createElement('div');
      div.id = 'parent';
      div.append(ThisPage()());
      root.replaceWith(div);
      CheckUpdates();
      PutValues();
      if (window.focused) {
        var focus = el(window.focused);
        if (focus) {
          focus.focus();
        }
      }
    }
    PutValues();
    window.finished = true;
    CheckUpdates();

    els = {};
    window.finished = true;

    return;
  }
  window.finished = true;

  return;
}
// ↑↑↑ THIS WHOLE PART UPTHERE IS SO CONFUSING .. I DON EVEN KNOW HOW I WROTE IT ↑↑↑

function INIT(x) {
  var root = el('parent');
  var div = document.createElement('div');
  div.id = 'parent';
  div.append(x());
  // print(div);
  root.replaceWith(div);
  if (window.focused) {
    var focus = el(window.focused);
    if (focus) {
      focus.focus();
    }
  }
  return;
}

//  Returns the current page name
window.ThisPageName = () => {
  var name = location.hash.replace('#', '');
  if (name.length == 0) {
    var name = 'Main';
    return 'Main';
  }
  return name;
};

//  Returns the current page function
window.ThisPage = () => {
  var name = location.hash.replace('#', '');
  if (name.length == 0) {
    var name = 'Main';
    return Routes['Main'];
  }
  if (Routes[name] !== undefined) {
    return Routes[name];
  } else return Routes['Main'];
};

// MAIN THING , RENDERS ON DOM COMPLETE >> Sends passed function to INIT()
function render(x) {
  function Mok(props = {}) {
    var React = React;
    var SET_VALUES = SET_VALUES;
    els = {};
    return x(props);
  }
  APP.Modules['Main'] = Mok;
  Routes['Main'] = Mok;

  let stateCheck = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(stateCheck);
      var page = ThisPage();
      window.vdom = x;

      INIT(page);
    }
  }, 1);
}

async function getFetch(url) {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  return await fetch(url, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      return result;
    })
    .catch((error) => print('error', error));
}
// get modules  , parse it , eval it , append it to html
// YES IT'S USELESS AND SLOW .. DUH
async function SetModulesFile(path, names) {
  names.forEach(async (name) => {
    var children = await getFetch(path + name);
    var parsed = Babel.transform(children, { presets: ['env', 'react'] }).code;
    var els = document.createElement('script');
    els.type = 'module';
    els.innerHTML = parsed;
    window.eval(parsed);
    document.head.append(els);
    return true;
  });
}

const Modules = {
  SetModule: function (z, x) {
    var name = z.name;
    window.APP[name] = (x) => {
      var React = React;
      var SET_VALUES = SET_VALUES;
      els = {};
      return z(x);
    };
    this[name] = window.APP[name];
  },
};

// set multi-ple pages at once , almost useless LOL (•_•)
function Router(z) {
  for (var key in z) {
    if (key.length == 0) {
      key = 'Main';
    }
    function Callee() {
      location.hash = key;
      return z[key]();
    }
    window.APP[key] = Callee;
    print(key);
  }
}

// SET PAGE FOR HASH AND HASH FOR MODULE

const Route = (x, z) => {
  APP.Modules[x] = z;
  if (typeof z == 'function') {
    function Callee(props = {}) {
      window.finished = false;
      var React = React;
      var SET_VALUES = SET_VALUES;
      els = {};
      location.hash = x;
      window.finished = true;
      return z(props);
    }

    Routes[x] = Callee;
  } else {
    function Callee() {
      window.finished = false;

      var React = React;
      var SET_VALUES = SET_VALUES;
      location.hash = x;
      els = {};
      window.finished = true;
      return z;
    }
    Routes[x] = Callee;
  }
};

window.updates = {};

function useState(initialValue, Callback = () => {}) {
  if (_values === undefined) {
    _values = {};
  }
  var id = GenID();
  _values[id] = initialValue;

  var state = {
    get val() {
      return _values[id];
    },
    vals: (x) => {
      _values[id] = x;
    },
  };

  function setState(newVal, Callbacks = () => {}) {
    if (newVal == undefined) {
      return;
    }
    els = {};
    if (!window.Loaded) {
      window.finished = true;
    }

    //  WELL , we donna wanna call the update function for nothing  -_(0_0)_- , so we check if it's the same old value or not
    if (str(state.val) !== str(newVal)) {
      state.vals(newVal);
      if (window.finished) {
        Callbacks(newVal);
        return UPDATE_DOM(ThisPage());
      } else {
        print('not finished');
        updates[id] = { newVal: newVal, Callbacks: Callbacks };
        window.onUpdate = () => {
          function WhatUpdates() {
            var len = Object.keys(updates).length;
            print('updating ', Object.keys(updates).length, ' key');
            for (const key in updates) {
              var newVal = updates[key]['newVal'];
              _values[key] = newVal;
              var Callbacks = updates[key]['Callbacks'];
              Callbacks(newVal);
              delete updates[key];
            }
            return len;
          }
          if (WhatUpdates() > 0) {
            print('found on update');
            UPDATE_DOM();
            window.finished = true;
          } else {
            window.finished = true;
            delete window.onUpdate;
          }
        };

        return;
      }
    }
    return;
  }

  Callback(initialValue);
  return [state, setState];
}

// Just a hook i like ↓↓↓↓↓
function listen(key, func) {
  return document.addEventlistener('keydown', (e) => {
    // print(e.key);
    if (e.key == key) {
      func(e);
    } else {
      return e;
    }
  });
}
let xtra8 = {
  React,
  render,
  Modules,
  useState,
  Router,
  Route,
  listen,
  Routes,
};
window.xtra8 = xtra8;
window.APP = xtra8;

window.onhashchange = (e) => {
  var name = location.hash.replace('#', '');
  if (name.length == 0) {
    var name = 'Main';

    return UPDATE_DOM();
  }

  if (Routes[name] !== undefined) {
    return UPDATE_DOM(Routes[name]);
  } else {
  }
};

import * as NaminAnythingBlah from 'https://cdn.jsdelivr.net/gh/hazem223/xtra8@main/babel.min.js';

window.fails = 0;
window.succeed = 0;

window.Loaded = true;
window.finished = true;

import * as NaminAnythingBlah from './babel.min.js';

const GenID = () => {
  let r = (Math.random() + 1).toString(36).substring(7);
  return r;
};
window.print = console.log;

var str = JSON.stringify;

function CheckType(type) {
  if (window.useEffect == undefined) {
    window.useEffect = {};
  }
  if (window.els == undefined) {
    window.els = {};
  }
  if (window.els[type] !== undefined) {
    window.els[type] = window.els[type] + 1;
  } else {
    window.els[type] = 1;
  }

  return window.els[type];
}
function SET_VALUES(values, type, children) {
  if (values == null) values = {};
  if (values.hasOwnProperty('if')) {
    if (!values.if || values.if == undefined) {
      return 'stop';
    }
  }
  var PAGE = ThisPageName();
  var COUNT = CheckType(type);
  var id;
  id = PAGE + type + COUNT;
  // assign id if not already there  , for easier  Callback

  if (values == null) {
    var values = {};

    values.id = id;
  }
  if (values.id == undefined) values.id = id;
  var id = values.id;
  if (id.length == 0) id = name;

  // look for useeffect and call it or ignore it
  var Checkin = values.useEffect || type.useEffect || false;
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

    var props = SET_VALUES(values, type, children);
    if (props == 'stop') {
      return '';
    }
    if (type !== undefined) {
      if (typeof type == 'function') {
        var props = SET_VALUES(values, type);
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

function UPDATE_DOM(newdom = false) {
  while (window.els !== undefined) {
    delete window.els;
  }

  // Reset elements count > elements count was made for id , head back to set values uprthere
  window['focused'] = document.activeElement.id;
  var external;
  external = true;
  if (newdom == false) {
    external = false;

    delete window.els;
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

    //  STOP JUDGIN ME .. .I WAS DRUNK ↓↓
    function tryes(repeat = false) {
      window.finished = false;
      try {
        function childtoarray(x) {
          // pass node element , turn it into object of its id and inner html
          var z = [[], []];
          x.forEach((element) => {
            z[0].push({ inner: element.innerHTML, id: element.id });
          });
          // push parent element id , to check if the page has change or not later
          z[1].push(x[0].parentElement.id);
          return z;
        }

        var old = childtoarray(oldDom.childNodes);
        var vso = childtoarray(newdom.childNodes);
        var cloneDom = childtoarray(clone.childNodes);

        // print(old[0].length, vso[0].length);
        // if parent element changed return false

        if (cloneDom[1][0] !== vso[1][0]) {
          // print(cloneDom[1][0], vso[1][0]);
          if (!repeat) {
            if (external) newdom = external;
            else newdom = window.vdom();
            return tryes(true);
          } else {
            print('tryed and false not same', cloneDom[1][0], vso[1][0]);
            return false;
          }
        } else {
          return false;
        }
        // print(false);

        try {
          vso[0].forEach((element) => {
            var index = vso[0].indexOf(element);
            var olds = cloneDom[0][index];
            if (olds.inner !== element.inner) {
              var ele = clone.querySelector('#' + olds.id);
              if (ele) {
                ele.innerHTML = element.inner;
              }
            }
          });
          if (clone.innerHTML == newdom.innerHTML) {
            vso[0].forEach((element) => {
              var index = vso[0].indexOf(element);
              var olds = old[0][index];
              if (olds.inner !== element.inner) {
                var ele = el(olds.id);
                if (ele) {
                  ele.innerHTML = element.inner;
                }
              }
            });
          } else {
            if (!repeat) {
              if (!external) {
                newdom = window.vdom();
                return tryes(true);
              } else return false;
            } else {
              return false;
            }
          }
        } catch (error) {
          console.log('error in tryes() in updateDom 1 ');

          return false;
        }

        return true;
      } catch (error) {
        // print(error.message);
        console.log('error in tryes() in updateDom');
        return false;
      }

      return false;
    }

    if (tryes() == false) {
      window.finished = true;
      // print('returned false');
      var div = document.createElement('div');
      div.id = 'parent';
      div.append(newdom);
      root.replaceWith(div);

      if (window.focused) {
        var focus = el(window.focused);
        if (focus) {
          focus.focus();
        }
      }
    }
    window.finished = true;

    if (window.onUpdate) {
      print('found on update');
      window.onUpdate();
    }
    window.els = {};
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
    return APP.Routes['Main'];
  }
  if (window.APP.Routes[name] !== undefined) {
    return window.APP.Routes[name];
  } else return APP.Routes['Main'];
};

// MAIN THING , RENDERS ON DOM COMPLETE >> Sends passed function to INIT()
function render(x) {
  APP.Modules['Main'] = x;
  APP.Routes['Main'] = x;
  window.vdom = x;
  let stateCheck = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(stateCheck);
      var page = ThisPage();
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

//Same thing  ..  I THOUGHT IT'S COOL ¯\(o_o)/¯
// async function req(file) {
//   var children = await getFetch(file);
//   var parsed = Babel.transform(children, { presets: ['env', 'react'] }).code;
//   var els = document.createElement('script');
//   els.type = 'module';
//   els.innerHTML = parsed;
//   window.eval(parsed);
//   return parsed;
//   document.head.append(els);
// }

// Set modules takes the function name and assigns it to APP object on window and Modules Object
var Modules = {
  SetModule: function (z, x) {
    var name = z.name;
    this[name] = z;
    window.APP[name] = z;
  },
  SetModulesFile: SetModulesFile,
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
var Route = (x, z) => {
  APP.Modules[x] = z;
  if (typeof z == 'function') {
    function Callee() {
      location.hash = x;
      return z();
    }

    window.APP.Routes[x] = Callee;
  } else {
    function Callee() {
      location.hash = x;
      return z;
    }

    window.APP.Routes[x] = Callee;
  }
};

window.updates = {};

// i really dont know dude I THOUGHT IT'S COOL ¯\(o_o)/¯

function useEffect(fn, mainfn) {
  mainfn.useEffect = fn;
}

function useState(initialValue, Callback = false) {
  if (window.APP.values === undefined) {
    window.APP.values = {};
  }
  var id = GenID();
  window.APP.values[id] = initialValue;

  var state = {
    state: function state() {
      return window.APP.values[id];
    },
    get val() {
      return window.APP.values[id];
    },
    vals: (x) => {
      window.APP.values[id] = x;
    },
  };

  function setState(newVal, Callbacks = false) {
    window.els = {};
    if (!window.Loaded) {
      window.Loaded = true;
      window.finished = true;
    }
    try {
      clearTimeout(window.timeout);
      // print('cleared');
    } catch (error) {
      print('not there');
    }

    //  WELL , we donna wanna call the update function for nothing  -_(0_0)_- , so we check if it's the same old value or not
    if (str(state.val) !== str(newVal)) {
      // print('updted', id, newVal);...
      state.vals(newVal);
      if (window.finished) {
        // see if it's another page and UPDATE accordinly =>
        if (Callbacks) Callbacks(newVal);
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
              window.APP.values[key] = newVal;
              var Callbacks = updates[key]['Callbacks'];
              if (Callbacks) Callbacks(newVal);
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

  if (Callback) {
    Callback(initialValue);
  }
  return [state, setState];
}

// Just a hook i like ↓↓↓↓↓
function Listen(key, func) {
  return document.addEventListener('keydown', (e) => {
    // print(e.key);
    if (e.key == key) {
      func(e);
    } else {
      return e;
    }
  });
}

window.xtra8 = {
  React,
  render,
  Modules,
  useState,
  Router,
  useEffect,
  Route,
  Listen,
};
window.APP = window.xtra8;
APP.Routes = {};

export { React, render, Modules, useState, Router, useEffect, Route, Listen };

window.onhashchange = (e) => {
  var name = location.hash.replace('#', '');
  // print(name);
  if (name.length == 0) {
    var name = 'Main';

    return UPDATE_DOM();
  }

  if (window.APP.Routes[name] !== undefined) {
    return UPDATE_DOM(window.APP.Routes[name]);
  } else {
    location.hash = '';
    UPDATE_DOM();
  }
};

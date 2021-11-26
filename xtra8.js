import * as NaminAnythingBlah from './babel.min.js';

const GenID = () => {
  let r = (Math.random() + 1).toString(36).substring(7);
  return r;
};

window.logme = true;
window.print = window.logme ? console.log : () => null;

function SetValues(values, type, content) {
  var page = ThisPageName();
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
  var count = window.els[type];
  var id;
  id = page + type + count;
  // assign id if not already there  , for easier  Callback

  if (values == null) {
    var values = {};

    values.id = id;
  }
  if (values.id == undefined) {
    values.id = id;
  }
  var id = values.id;
  if (id.length == 0) {
    id = name;
  }

  if (values.if !== undefined) {
    // print(values.if);
    var statment = values.if;
    if (statment == false) {
      
      return 'stop';
      values.style = 'display: none;';
      // return React.createElement(type, values, content);
    } else {
      // look for useeffect and call it or ignore it
      var Checkin = values.useEffect;
      if (Checkin) {
        if (typeof Checkin == 'function') {
          if (!window.useEffect[id]) {
            Checkin();
            window.useEffect[id] = true;
          }
        }
      }
    }
  }
  return values;
}

var React = {
  createElement: function createElement(type, values, ...content) {
    if (type == 'route') {
      print(type, values);
    }
    // print(type);
    // assign id if not already there  , for easier  Callback
    // print(type, values, content);

    var newvalues = SetValues(values, type, content);
    if (newvalues == 'stop') {
      return '';
    }
    if (type !== undefined) {
      if (typeof type == 'function') {
        if (type.useEffect) {
          if (!window.useEffect) {
            window.useEffect = {};
          }
          if (!window.useEffect[type.name]) {
            window.useEffect[type.name] = true;
            type.useEffect();
          }
        }
        var newvalues = SetValues(values, type);
        newvalues.id = type.name;
        newvalues.children = content;
        return type(newvalues);
      }
    } else {
      return '';
    }

    var element = document.createElement(type);

    Object.assign(element, { ...newvalues, ...values });

    content.forEach((z) => {
      if (typeof z == 'function') {
        // print(z);
        vdom[z.name] = z;
        var newz = z();
        newz.id = z.name;
        element.append(newz);
      } else {
        // this to look for loops in element content
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

function UpdateDom(newdom = false) {
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
  }
  var root = el('parent');
  var oldDom = root.childNodes[0];

  var matchs = newdom.innerHTML == oldDom.innerHTML;

  if (!matchs) {
    window['olDom'] = oldDom;
    // what this function?! you ask
    var changed = 0;
    const diff = (diffMe, diffBy) => diffMe.split(diffBy).join('\n');
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
          if (!repeat) {
            // print(cloneDom[1][0], vso[1][0]);
            if (!external) {
              newdom = window.vdom();
              return tryes(true);
            } else return false;
          } else {
            // print('tryed and false not same', cloneDom[1][0], vso[1][0]);
            return false;
          }
          // print(false);
          // return false;
        } else {
          if (repeat) {
            // print('tryes and success');
          }
        }
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
          // console.log('error in tryes() in updateDom 1 ');

          return false;
        }

        return true;
      } catch (error) {
        // print(error.message);
        // console.log('error in tryes() in updateDom');
        return false;
      }

      return false;
    }

    window.finished = true;

    if (tryes() == false) {
      print('returned false');
      var div = document.createElement('div');
      div.id = 'parent';
      div.append(newdom);
      root.replaceWith(div);
      window.finished = true;
      window.finished = true;
      if (window.onUpdate) {
        window.onUpdate();
        print('found on update');
        window.finished = true;
      }

      if (window.focused) {
        var focus = el(window.focused);
        if (focus) {
          focus.focus();
        }
      }
    }
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
    return 'Main';
  }
  if (window.APP[name] !== undefined) {
    return window.APP[name];
  } else return 'Main';
};

// MAIN THING , RENDERS ON DOM COMPLETE >> Sends passed function to INIT()
function render(x) {
  APP.Modules[x.name] = x;
  // print(x);
  window.vdom = x;
  let stateCheck = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(stateCheck);
      var page = ThisPage();
      if (page == 'Main') {
        INIT(x);
        return;
      } else {
        INIT(page);
      }
    }
  }, 1);
}

// OLD THINGHY  =>=>=>=>=>=>=>
function State(z, x, Callback = false) {
  if (x.length == 0) {
    // print('aha');
    x = ' ';
    // print(x.length);
  }

  window[z] = x;
  if (Callback) {
    window['set' + z] = (c, Callback = false) => {
      print('update');
      delete window.els;
      if (c !== z) {
        // new value DIF from original SO UPDATE DOM
        if (Callback) {
          Callback(c);
        }
        window[z] = c;
        UpdateDom();
      }
    };
  } else {
    window['set' + z] = (c, Callback = false) => {
      if (c !== z) {
        delete window.els;
        if (Callback) {
          Callback(c);
        }
        // new value DIF from original SO UPDATE DOM

        window[z] = c;
        UpdateDom();
      }
    };
  }
}

// <=  <=<= <= OLD THINGHY

function States(obj) {
  for (const key in obj) {
    window[key] = obj[key];
    window['set' + key] = (c) => {
      // new value DIF from original SO UPDATE DOM
      delete window.els;

      window[key] = c;
      UpdateDom();
    };
  }
}
//  ¯\(o_o)/¯¯\(o_o)/¯¯\(o_o)/¯¯\(o_o)/¯¯\(o_o)/¯¯\(o_o)/¯¯\(o_o)/¯¯\(o_o)/¯¯\(o_o)/¯
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
// ¯\(o_o)/¯¯\(o_o)/¯¯\(o_o)/¯¯\(o_o)/¯¯\(o_o)/¯¯\(o_o)/¯¯\(o_o)/¯¯\(o_o)/¯¯\(o_o)/¯¯\(o_o)/¯¯\(o_o)/¯
// get modules  , parse it , eval it , append it to html
//  ¯\(o_o)/¯
async function SetModulesFile(path, names) {
  names.forEach(async (name) => {
    var content = await getFetch(path + name);
    var parsed = Babel.transform(content, { presets: ['env', 'react'] }).code;
    var els = document.createElement('script');
    els.type = 'module';
    els.innerHTML = parsed;
    window.eval(parsed);
    document.head.append(els);
    return true;
  });
}

//Same thing  ..  I THOUGHT IT'S COOL ¯\(o_o)/¯
async function req(file) {
  var content = await getFetch(file);
  var parsed = Babel.transform(content, { presets: ['env', 'react'] }).code;
  var els = document.createElement('script');
  els.type = 'module';
  els.innerHTML = parsed;
  window.eval(parsed);
  return parsed;
  document.head.append(els);
}

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

    window.APP[x] = Callee;
  } else {
    function Callee() {
      location.hash = x;
      return z;
    }

    window.APP[x] = Callee;
  }
};

window.updates = {};

// i really dont know dude I THOUGHT IT'S COOL ¯\(o_o)/¯

function useEffect(fn, mainfn) {
  mainfn.useEffect = fn;
  // if (mainfn.id) {
  //   if (window.useEffect == undefined) {
  //     window.useEffect = {};
  //   }
  //   if (!window.useEffect[mainfn.name]) {
  //     window.useEffect[mainfn.name] = true;
  //     fn();
  //   }
  // }
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
      window.finished = true;
      window.Loaded = true;
    }

    try {
      clearTimeout(window.timeout);
      // print('cleared');
    } catch (error) {
      print('not there');
    }

    //  WELL , we donna wanna call the update function for nothing  -_(0_0)_- , so we check if it's the same old value or not
    if (JSON.stringify(state.val) !== JSON.stringify(newVal)) {
      if (window.finished) {
        state.vals(newVal);
        // see if it's another page and UPDATE accordinly =>
        {
          var name = location.hash.replace('#', '');
          // print(name);
          if (name.length == 0) {
            var name = 'Main';
            // print('reloaded main');

            if (Callbacks) {
              Callbacks(newVal);
            }

            UpdateDom();
          }
          if (window.APP[name] !== undefined) {
            // print('reloaded');
            if (Callbacks) {
              Callbacks(newVal);
            }
            UpdateDom(window.APP[name]());
          }
        }
        // <=
        return;
      }
      // if not finish updating , set a function to update things after UpdateDom() finishes
      // this is to avoid multiple updates with (SetState*) at once causing the dom to change for every one ↓↓↓↓

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
          UpdateDom();
          window.finished = true;
        } else {
          delete window.onUpdate;
          window.finished = true;
        }
        window.finished = true;
      };

      print('not finished');

      return;
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
  State,
  States,
  Modules,
  req,
  useState,
  Router,
  useEffect,
  Route,
  Listen,
};
window.APP = window.xtra8;

export {
  React,
  render,
  State,
  States,
  Modules,
  req,
  useState,
  Router,
  Route,
  Listen,
};

window.onhashchange = (e) => {
  var name = location.hash.replace('#', '');
  // print(name);
  if (name.length == 0) {
    var name = 'Main';

    return UpdateDom();
  }

  if (window.APP[name] !== undefined) {
    return UpdateDom(window.APP[name]());
  }
};

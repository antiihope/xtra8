import * as NaminAnythingBlah from './babel.min.js';

const GenID = () => {
  let r = (Math.random() + 1).toString(36).substring(7);
  return r;
};

window.print = console.log;

window.seeme = (e) => {
  window['focused'] = e.target.id;
};
function SetValues(values, type, content) {
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
  id = type + count;
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
      delete values.if;
      values.style = 'visibility: hidden;';
      // return React.createElement(type, values, content);
    } else {
      // look for useeffect and call it or ignore it
      if (values.useEffect) {
        if (typeof values.useEffect == 'function') {
          if (!window.useEffect[id]) {
            values.useEffect();
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
        // print(typeof type, type);
        var newvalues = SetValues(values, type, content);
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

    function tryes(repeat = false) {
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

        // print(old, vso);
        // if parent element changed return false
        if (cloneDom[1][0] !== vso[1][0]) {
          if (!repeat) {
            if (!external) {
              newdom = window.vdom();
              return tryes(true);
            } else return false;
          } else {
            print('tryed and false not same');
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
              return tryes(true);
            } else {
              print('tryes  and false');
              return false;
            }
          }
        } catch (error) {
          // console.log('error in tryes() in updateDom 1 ');
          // console.clear();

          return false;
        }

        // print(vso[0], old[0]);
        // changed = changed + nesa.length;
        // nesa.forEach((obj) => {
        // var ele = el(obj.id);
        // if (ele) {
        //   ele.innerHTML = obj.inner;
        // }
        // });
        return true;
      } catch (error) {
        // print(error.message);
        // console.log('error in tryes() in updateDom');
        // console.clear();

        return false;
      }

      return false;
    }

    if (tryes() == false) {
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
    return;
  }

  return;
}

function main(x) {
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

function whatPageIsThis() {
  var name = location.hash.replace('#', '');
  // print(name);
  if (name.length == 0) {
    var name = 'Main';
    return null;
  }
  if (window.App[name] !== undefined) {
    return window.App[name];
  }
}

function render(x) {
  App.Modules[x.name] = x;
  // print(x);
  window.vdom = x;
  let stateCheck = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(stateCheck);
      var page = whatPageIsThis();
      if (page == null) {
        main(x);
        return;
      } else {
        main(page);
      }
    }
  }, 1);
}

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

// Set modules to access it from diffrent js files

var Modules = {
  SetModule: function (z, x) {
    var name = z.name;
    this[name] = z;
    window.App[name] = z;
  },
  SetModulesFile: SetModulesFile,
};

// set multi-ple pages at once
function Router(z) {
  for (var key in z) {
    if (key.length == 0) {
      key = 'Main';
    }
    function Callee() {
      location.hash = key;
      return z[key]();
    }
    window.App[key] = Callee;
    print(key);
  }
}

// set page for hash
var Route = (x, z) => {
  App.Modules[x] = z;
  if (typeof z == 'function') {
    function Callee() {
      location.hash = x;
      return z();
    }

    window.App[x] = Callee;
  } else {
    function Callee() {
      location.hash = x;
      return z;
    }

    window.App[x] = Callee;
  }
};

// let value;

var calls = 0;

window.updates = {};

function useEffect(fn, name) {
  if (window.useEffect == undefined) {
    window.useEffect = {};
  }
  if (!window.useEffect[name]) {
    window.useEffect[name] = true;
    fn();
  }
}

function useState(initialValue, Callback = false) {
  if (window.App.values === undefined) {
    window.App.values = {};
  }
  var id = GenID();
  window.App.values[id] = initialValue;

  var state = {
    state: function state() {
      return window.App.values[id];
    },
    get val() {
      return window.App.values[id];
    },
    vals: (x) => {
      window.App.values[id] = x;
    },
  };

  function setState(newVal, Callbacks = false) {
    try {
      clearTimeout(window.timeout);
      // print('cleared');
    } catch (error) {
      print('not there');
    }

    if (JSON.stringify(state.val) !== JSON.stringify(newVal)) {
      // print(state.val, newVal);
      state.vals(newVal);
      // see if it's another page and update accordinly =>
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
          return;
        }
        if (window.App[name] !== undefined) {
          // print('reloaded');

          if (Callbacks) {
            Callbacks(newVal);
          }
          UpdateDom(window.App[name]());
          return;
        }
      }
      // <=

      // UpdateDom();
    }
  }

  if (Callback) {
    Callback(initialValue);
  }
  return [state, setState]; // exposing functions for external use
}

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
window.App = window.xtra8;

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
  if (window.App[name] !== undefined) {
    return UpdateDom(window.App[name]());
  }
};

import * as NaminAnythingBlah from 'https://cdn.jsdelivr.net/gh/hazem223/xtra8@main/lib/xtra8babel@1.0.3.js';

const GenID = () => {
  let r = (Math.random() + 1).toString(36).substring(7);
  return r;
};

window.print = console.log;

window.seeme = (e) => {
  window['focused'] = e.target.id;
};
function SetValues(values, type, name) {
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
  if (name) {
    id = name;
  }

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

  // values.onfocus = (e) => (window['focused'] = e.target.id);

  return values;
}

var React = {
  createElement: function createElement(type, values, ...content) {
    if (type == 'route') {
      print(type, values);
    }

    // assign id if not already there  , for easier  Callback
    // print(type, values, content);

    var newvalues = SetValues(values, type, false);
    if (typeof type !== 'string') {
      // print(type);
      var newvalues = SetValues(values, type, type.name);

      return type(newvalues);
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

  if (newdom == false) {
    delete window.els;

    var newdom = window.vdom();
    // newdom = window.vdom();
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

    function tryes() {
      try {
        function arr_diff(a1, a2) {
          var anew = a1.filter(
            ({ inner: id1 }) => !a2.some(({ inner: id2 }) => id2 == id1)
          );

          return anew;
        }

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
          // print(false);
          return false;
        }
        // print(cloneDom[1][0], vso[1][0]);
        // else get diff and change DOM , that means you dont have to update the whole thing
        // var nesa = arr_diff(vso[0], old[0]);
        // console.log(nesa);
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
          } else return false;
        } catch (error) {
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
        console.log(error);
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

function render(x) {
  // print(x);
  window.vdom = x;
  let stateCheck = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(stateCheck);
      main(x);
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
  SetModule: function (z) {
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
  function Callee() {
    location.hash = x;
    return z();
  }
  window.App[x] = Callee;
};

// let value;

function useState(initialValue , Callback=false) {
  var _val = initialValue;
  var state = {
    _val: initialValue,
    state: function state() {
      return this._val;
    },
    get val() {
      return this._val;
    },
  };

  function setState(newVal  ,Callback=false) {
    // same
    if (Callback) {
      Callback(newVal)
    }
    state._val = newVal;
    UpdateDom();
  }
  if (Callback) {
    Callback(initialValue)
  }
  return [state, setState]; // exposing functions for external use
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
  Route,
};
window.App = window.xtra8;

export { React, render, State, States, Modules, req };

window.onhashchange = (e) => {
  var name = location.hash.replace('#', '');
  // print(name);
  if (name.length == 0) {
    return UpdateDom();
    var name = 'Main';
  }
  if (window.App[name] !== undefined) {
    return main(window.App[name]);
  } else {
    return UpdateDom();
  }
};

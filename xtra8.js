import * as NaminAnythingBlah from 'https://unpkg.com/@babel/standalone@7.16.4/babel.min.js';

window.print = (...x) => {
  console.log(...x);
};

window.seeme = (e) => {
  window['focused'] = e.target.id;
};

function SetValues(values, type, content, els = window.els) {
  if (window.els == undefined) {
    window.els = {};
  }
  if (window.els[type] !== undefined) {
    window.els[type] = window.els[type] + 1;
  } else {
    window.els[type] = 1;
  }

  var count = window.els[type];

  var string = typeof content[0] == 'string';
  var num = typeof content[0] == 'number';
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
    values.id = type + count;
  }

  values.onfocus = (e) => (window['focused'] = e.target.id);

  return values;
}

var React = {
  createElement: (type, values, ...content) => {
    var element = document.createElement(type);
    // assign id if not already there  , for easier  Callback
    values = SetValues(values, type, content);
    Object.assign(element, values);

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
    newdom = window.vdom();
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
        // if parent element changed return false
        if (old[1][0] !== vso[1][0]) {
          return false;
        }
        // else get diff and change DOM , that means you dont have to update the whole thing
        var nesa = arr_diff(vso[0], old[0]);
        // print(vso, old);
        // changed = changed + nesa.length;
        nesa.forEach((obj) => {
          var ele = el(obj.id);
          if (ele) {
            ele.innerHTML = obj.inner;
          }
        });
        return true;
      } catch (error) {
        return false;
      }

      return false;
    }

    if (tryes() == false) {
      print('returned false');
      console.clear();
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
    focus.focus();
  }
  return;
}

function render(x) {
  window.vdom = x;
  // window.OLDvdom = x();
  let stateCheck = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(stateCheck);
      main(x);
    }
  }, 100);
}

function State(z, x, Callback = false) {
  if (x.length == 0) {
    // print('aha');
    x = ' ';
    print(x.length);
  }

  window[z] = x;
  if (Callback) {
    window['set' + z] = (c) => {
      print('update');
      delete window.els;
      if (c !== z) {
        // new value DIF from original SO UPDATE DOM
        Callback(c);
        window[z] = c;
        UpdateDom();
      }
    };
  } else {
    window['set' + z] = (c) => {
      if (c !== z) {
        delete window.els;

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
    this[z.name] = z;
  },
  SetModulesFile: SetModulesFile,
};

window.xtra8 = { React, render, State, States, Modules, req };

export { React, render, State, States, Modules, req };

// 3:38 AM 11/18/2021
// there are values not changing .. figure it out i wanna sleep
